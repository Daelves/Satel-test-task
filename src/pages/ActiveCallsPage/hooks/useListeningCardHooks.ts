// src/pages/ActiveCallsPage/hooks/useListeningCardHooks.ts
import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';

import { $listeningCall } from '../model.ts';
import { formatTime } from '../../../utils/formatters.ts';
import {
  $downloadModalVisible,
  $isPaused,
  $isRecording,
  $listeningCallState,
  closeDownloadModal,
  updateDownloadProgress,
  updateTime,
} from '../model/listeningCall.ts';
import {useModal} from "../../../shared/modals";

/**
 * Хук для расчета времени с начала звонка
 */
export const useCallDuration = () => {
  const listeningCall = useUnit($listeningCall);

  useEffect(() => {
    if (listeningCall) {
      // Получаем время начала звонка
      const callStartTime = new Date(listeningCall.callsStartTime).getTime();
      const currentTime = Date.now();
      const callDuration = currentTime - callStartTime;

      // Формируем строку длительности звонка с начала звонка
      const formattedDuration = formatTime(callDuration);

      // Обновляем модель с реальной длительностью звонка
      updateTime({ callDuration: formattedDuration });
    }
  }, [listeningCall]);
};

/**
 * Хук для управления таймером прослушивания
 * Обновляет время прослушивания, когда звонок не на паузе
 */
export const useListeningTimer = () => {
  const timerRef = useRef<number | null>(null);
  const state = useUnit($listeningCallState);
  const isPaused = useUnit($isPaused);
  const listeningCall = useUnit($listeningCall);

  useEffect(() => {
    // Запускаем таймер только если есть время начала прослушивания и звонок не на паузе
    if (!state.listeningStartTime || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Запускаем интервал обновления времени прослушивания
    timerRef.current = window.setInterval(() => {
      if (listeningCall) {
        // Рассчитываем длительность звонка с момента его начала
        const callStartTime = new Date(listeningCall.callsStartTime).getTime();
        const currentTime = Date.now();
        const callDuration = currentTime - callStartTime;

        // Обновляем с актуальной длительностью
        updateTime({ callDuration: formatTime(callDuration) });
      } else {
        // Обычное обновление времени прослушивания
        updateTime();
      }
    }, 1000);

    // Сразу вызываем обновление при установке таймера
    if (listeningCall) {
      const callStartTime = new Date(listeningCall.callsStartTime).getTime();
      const currentTime = Date.now();
      const callDuration = currentTime - callStartTime;
      updateTime({ callDuration: formatTime(callDuration) });
    } else {
      updateTime();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.listeningStartTime, isPaused, listeningCall]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
};

/**
 * Хук для управления таймером записи
 * Запись работает независимо от состояния паузы прослушивания
 */
export const useRecordingTimer = () => {
  const timerRef = useRef<number | null>(null);
  const state = useUnit($listeningCallState);
  const isRecording = useUnit($isRecording);

  useEffect(() => {
    // Запускаем таймер только если запись активна
    if (!state.recordingStartTime || !isRecording) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Запускаем интервал обновления времени записи
    timerRef.current = window.setInterval(() => {
      updateTime();
    }, 1000);

    // Сразу вызываем обновление при установке таймера
    updateTime();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.recordingStartTime, isRecording]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
};

/**
 * Хук для инициализации начального времени прослушивания
 */
export const useInitializeListeningTime = (callId: string | null) => {
  const state = useUnit($listeningCallState);
  const listeningCall = useUnit($listeningCall);

  useEffect(() => {
    if (callId && !state.listeningStartTime && !state.isPaused) {
      // Инициализируем время прослушивания
      updateTime({ initListeningTime: true });

      // Также инициализируем длительность звонка
      if (listeningCall) {
        const callStartTime = new Date(listeningCall.callsStartTime).getTime();
        const currentTime = Date.now();
        const callDuration = currentTime - callStartTime;
        updateTime({ callDuration: formatTime(callDuration) });
      }
    }
  }, [callId, state.listeningStartTime, state.isPaused, listeningCall]);
};

/**
 * Хук для симуляции загрузки записи
 */
export const useDownloadSimulation = () => {
  const isDownloadModalVisible = useUnit($downloadModalVisible);
  const { open: openDownloadModal } = useModal('download');
  const listeningCall = useUnit($listeningCall);

  // Отслеживаем изменение состояния модального окна
  useEffect(() => {
    if (isDownloadModalVisible && listeningCall) {
      // Явно открываем модальное окно, если оно должно быть видимым
      openDownloadModal({ callId: listeningCall.id });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        updateDownloadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            closeDownloadModal();
          }, 500);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isDownloadModalVisible, listeningCall]);
};