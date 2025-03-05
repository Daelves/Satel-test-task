import { createDomain, createEvent, createEffect } from 'effector';
import { formatTime } from '../../../utils/formatters';
import {closeModal, openModal} from "../../../shared/modals";

import {
  connectToCall,
  disconnectFromCall,
  resetListening,
} from './events.ts';

const listeningCallDomain = createDomain('listeningCall');

export interface ListeningCallState {
  isPaused: boolean;
  listeningStartTime: number | null;
  pausedAtTime: number | null;
  isRecording: boolean;
  recordingStartTime: number | null;
  callDuration: string; // Реальная длительность звонка
  recordingTimeDisplay: string;
  isDownloadModalVisible: boolean;
  downloadProgress: number;
}

export type UpdateTimeParams = {
  initListeningTime?: boolean;
  callDuration?: string;
};

// События для управления состоянием прослушивания
export const togglePause = listeningCallDomain.createEvent();
export const updateTime =
  listeningCallDomain.createEvent<UpdateTimeParams | void>();


// Эффекты для записи
export const startRecordingFx = listeningCallDomain.createEffect(
  async (callId: string) => {
    console.log(`Starting recording for call ${callId}`);
    return true;
  }
);

export const stopRecordingFx = listeningCallDomain.createEffect(
    async (callId: string) => {
      console.log(`Stopping recording for call ${callId}`);

      // Добавим прямой вызов открытия модального окна здесь
      console.log('Attempting to open download modal from stopRecordingFx');
      console.log(callId)

      // Вызов напрямую из эффекта
      openModal({
        key: 'download',
        params: { callId }
      });

      return callId;
    }
);

// События обновления прогресса загрузки
export const updateDownloadProgress = listeningCallDomain.createEvent<number>();
export const closeDownloadModal = listeningCallDomain.createEvent();
closeDownloadModal.watch(() => {
  closeModal('download');
});

// Стор с состоянием прослушивания
export const $listeningCallState =
  listeningCallDomain.createStore<ListeningCallState>({
    isPaused: false,
    listeningStartTime: null,
    pausedAtTime: null,
    isRecording: false,
    recordingStartTime: null,
    callDuration: '00:00',
    recordingTimeDisplay: '00:00',
    isDownloadModalVisible: false,
    downloadProgress: 0,
  });

// Добавляем обработчики событий
$listeningCallState
  .on(togglePause, (state) => {
    const now = Date.now();

    if (state.isPaused) {
      const timeOnPause = now - (state.pausedAtTime || now);
      const newStartTime = state.listeningStartTime
        ? state.listeningStartTime + timeOnPause
        : now;

      return {
        ...state,
        isPaused: false,
        listeningStartTime: newStartTime,
        pausedAtTime: null,
      };
    } else {
      return {
        ...state,
        isPaused: true,
        pausedAtTime: now,
      };
    }
  })
  .on(updateTime, (state, params = {}) => {
    const now = Date.now();
    const { initListeningTime, callDuration } = params as UpdateTimeParams;

    if (callDuration) {
      return {
        ...state,
        callDuration,
      };
    }

    if (initListeningTime) {
      return {
        ...state,
        listeningStartTime: now,
        isPaused: false,
      };
    }

    let recordingTimeDisplay = state.recordingTimeDisplay;

    if (state.isRecording && state.recordingStartTime) {
      const elapsed = now - state.recordingStartTime;
      recordingTimeDisplay = formatTime(elapsed);
    }

    return {
      ...state,
      recordingTimeDisplay,
    };
  })
  .on(startRecordingFx.doneData, (state) => {
    return {
      ...state,
      isRecording: true,
      recordingStartTime: Date.now(),
      recordingTimeDisplay: '00:00',
    };
  })
  .on(stopRecordingFx.doneData, (state) => {
    return {
      ...state,
      isRecording: false,
      recordingStartTime: null,
      isDownloadModalVisible: true,
      downloadProgress: 0,
    };
  })
  .on(updateDownloadProgress, (state, progress) => {
    return {
      ...state,
      downloadProgress: progress,
    };
  })
  .on(closeDownloadModal, (state) => {
    return {
      ...state,
      isDownloadModalVisible: false,
      downloadProgress: 0,
    };
  })
  .reset(resetListening);

// Селекторы для удобного доступа к данным из компонентов
export const $isPaused = $listeningCallState.map((state) => state.isPaused);
export const $isRecording = $listeningCallState.map(
  (state) => state.isRecording
);
export const $callDuration = $listeningCallState.map(
  (state) => state.callDuration
);
export const $recordingTime = $listeningCallState.map(
  (state) => state.recordingTimeDisplay
);
export const $downloadModalVisible = $listeningCallState.map(
  (state) => state.isDownloadModalVisible
);
export const $downloadProgress = $listeningCallState.map(
  (state) => state.downloadProgress
);
