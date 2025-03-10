import { createDomain } from 'effector';
import { formatTime } from '../../../utils/formatters';
import { closeModal } from '../../../shared/modals';

import { resetListening } from './events.ts';
import { mockCallsService } from '../../../services/mockService.ts';

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
  isBackgroundRecording: boolean;
  backgroundRecordingCallId: string | null;
}

export type UpdateTimeParams = {
  initListeningTime?: boolean;
  callDuration?: string;
};

// События для управления состоянием прослушивания
export const togglePause = listeningCallDomain.createEvent();
export const updateTime =
  listeningCallDomain.createEvent<UpdateTimeParams | void>();

// События для управления фоновой записью
export const switchToBackgroundRecording =
  listeningCallDomain.createEvent<string>();
export const stopBackgroundRecording = listeningCallDomain.createEvent();

// Эффекты для записи
export const startRecordingFx = listeningCallDomain.createEffect(
  async (callId: string) => {
    console.log(`Starting recording for call ${callId}`);
    return true;
  }
);

export const stopRecordingFx = listeningCallDomain.createEffect(
  async (callId: string) => {
    const result = await mockCallsService.stopRecording(callId);

    return {
      callId,
      success: true,
    };
  }
);

// События обновления прогресса загрузки
export const updateDownloadProgress = listeningCallDomain.createEvent<number>();
export const closeDownloadModal = listeningCallDomain.createEvent();
closeDownloadModal.watch(() => {
  closeModal('download');
});

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
    isBackgroundRecording: false,
    backgroundRecordingCallId: null,
  });

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

    if (
      (state.isRecording || state.isBackgroundRecording) &&
      state.recordingStartTime
    ) {
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
      isBackgroundRecording: false,
      backgroundRecordingCallId: null,
      recordingStartTime: null,
      isDownloadModalVisible: false,
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
  // Обработчик для перехода к фоновой записи
  .on(switchToBackgroundRecording, (state, callId) => {
    // Если запись не ведется, ничего не делаем
    if (!state.isRecording) return state;

    return {
      ...state,
      isRecording: false,
      isBackgroundRecording: true,
      backgroundRecordingCallId: callId,
    };
  })
  // Обработчик для остановки фоновой записи
  .on(stopBackgroundRecording, (state) => {
    if (!state.isBackgroundRecording) return state;

    return {
      ...state,
      isBackgroundRecording: false,
      backgroundRecordingCallId: null,
    };
  })
  // Сбрасываем только активное прослушивание, но не фоновую запись
  .on(resetListening, (state) => {
    // Если ведется запись, переводим ее в фоновый режим
    if (state.isRecording && !state.isBackgroundRecording) {
      return {
        ...state,
        isPaused: false,
        listeningStartTime: null,
        pausedAtTime: null,
        isRecording: false,
        isBackgroundRecording: true,
        backgroundRecordingCallId: state.backgroundRecordingCallId || null,
        callDuration: '00:00',
        isDownloadModalVisible: false,
        downloadProgress: 0,
      };
    }
    return {
      ...state,
      isPaused: false,
      listeningStartTime: null,
      pausedAtTime: null,
      isRecording: false,
      callDuration: '00:00',
      isDownloadModalVisible: false,
      downloadProgress: 0,
    };
  });

// Селекторы для удобного доступа к данным из компонентов
export const $isPaused = $listeningCallState.map((state) => state.isPaused);
export const $isRecording = $listeningCallState.map(
  (state) => state.isRecording
);
export const $isActiveRecording = $listeningCallState.map(
  (state) => state.isRecording
);
export const $isBackgroundRecording = $listeningCallState.map(
  (state) => state.isBackgroundRecording
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
export const $backgroundRecordingCallId = $listeningCallState.map(
  (state) => state.backgroundRecordingCallId
);
