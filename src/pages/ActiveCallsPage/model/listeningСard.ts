// src/pages/ActiveCallsPage/model/listeningСard.ts
import { createDomain } from 'effector';
import { formatTime } from '../../../utils/formatters';

const listeningCardDomain = createDomain('listeningCard');

export interface ListeningCardState {
  isPaused: boolean;
  listeningStartTime: number | null;
  pausedAtTime: number | null;
  isRecording: boolean;
  recordingStartTime: number | null;
  listeningTimeDisplay: string;
  recordingTimeDisplay: string;
  isDownloadModalVisible: boolean;
  downloadProgress: number;
}

export const togglePause = listeningCardDomain.createEvent();
export const resetListening = listeningCardDomain.createEvent();
export const updateTime = listeningCardDomain.createEvent();

export const startRecordingFx = listeningCardDomain.createEffect(
  async (callId: string) => {
    // вызов API
    console.log(`Starting recording for call ${callId}`);
    return true;
  }
);

export const stopRecordingFx = listeningCardDomain.createEffect(
  async (callId: string) => {
    // вызов API
    console.log(`Stopping recording for call ${callId}`);
    return false;
  }
);

export const updateDownloadProgress = listeningCardDomain.createEvent<number>();
export const closeDownloadModal = listeningCardDomain.createEvent();

export const $listeningCardState =
  listeningCardDomain.createStore<ListeningCardState>({
    isPaused: false,
    listeningStartTime: null,
    pausedAtTime: null,
    isRecording: false,
    recordingStartTime: null,
    listeningTimeDisplay: '00:00',
    recordingTimeDisplay: '00:00',
    isDownloadModalVisible: false,
    downloadProgress: 0,
  });

$listeningCardState
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
      // Ставим на паузу
      return {
        ...state,
        isPaused: true,
        pausedAtTime: now,
      };
    }
  })

  .on(updateTime, (state) => {
    const now = Date.now();
    let listeningTimeDisplay = state.listeningTimeDisplay;
    let recordingTimeDisplay = state.recordingTimeDisplay;

    if (state.listeningStartTime && !state.isPaused) {
      const elapsed = now - state.listeningStartTime;
      listeningTimeDisplay = formatTime(elapsed);
    }

    if (state.isRecording && state.recordingStartTime) {
      const elapsed = now - state.recordingStartTime;
      recordingTimeDisplay = formatTime(elapsed);
    }

    return {
      ...state,
      listeningTimeDisplay,
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

export const $isPaused = $listeningCardState.map((state) => state.isPaused);
export const $isRecording = $listeningCardState.map(
  (state) => state.isRecording
);
export const $listeningTime = $listeningCardState.map(
  (state) => state.listeningTimeDisplay
);
export const $recordingTime = $listeningCardState.map(
  (state) => state.recordingTimeDisplay
);
export const $downloadModalVisible = $listeningCardState.map(
  (state) => state.isDownloadModalVisible
);
export const $downloadProgress = $listeningCardState.map(
  (state) => state.downloadProgress
);
