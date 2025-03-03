// src/pages/ActiveCallsPage/hooks/useListeningCardHooks.ts
import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';
import {
  $listeningCardState,
  updateTime,
  updateDownloadProgress,
  closeDownloadModal,
  $downloadModalVisible,
  $isPaused,
  $isRecording
} from '../model/listeningСard.ts';

/**
 * Хук для управления таймером прослушивания
 * Обновляет время прослушивания, когда звонок не на паузе
 */
export const useListeningTimer = () => {
  const timerRef = useRef<number | null>(null);
  const state = useUnit($listeningCardState);
  const isPaused = useUnit($isPaused);

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
  }, [
    state.listeningStartTime,
    isPaused
  ]);

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
  const state = useUnit($listeningCardState);
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
  }, [
    state.recordingStartTime,
    isRecording
  ]);

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
  const state = useUnit($listeningCardState);

  useEffect(() => {
    if (callId && !state.listeningStartTime && !state.isPaused) {
      // Инициализируем время прослушивания
      updateTime({ initListeningTime: true });
    }
  }, [callId, state.listeningStartTime, state.isPaused]);
};

/**
 * Хук для симуляции загрузки записи
 */
export const useDownloadSimulation = () => {
  const isDownloadModalVisible = useUnit($downloadModalVisible);

  useEffect(() => {
    if (!isDownloadModalVisible) return;

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
  }, [isDownloadModalVisible]);
};