// model/listeningCall.ts
import { createStore, createEvent, sample } from 'effector';

export interface ListeningCall {
  id: string;
  startTime: Date;
  listeningStartTime: Date;
  listeningTime: number; // в секундах
  isRecording: boolean;
  recordingStartTime: Date | null;
  recordingTime: number | null; // в секундах
  participants: string[];
  isPaused: boolean;
  appealsId: string;
}

export const $listeningCall = createStore<ListeningCall | null>(null);

export const connectToCall = createEvent<{
  id: string;
  startTime: Date;
  participants: string[];
  appealsId: string;
}>();
export const disconnectFromCall = createEvent<void>();
export const pauseListening = createEvent<void>();
export const resumeListening = createEvent<void>();
export const startRecording = createEvent<void>();
export const stopRecording = createEvent<void>();
export const updateCallTimers = createEvent<void>();

$listeningCall
  .on(connectToCall, (_, payload) => ({
    id: payload.id,
    startTime: payload.startTime,
    listeningStartTime: new Date(),
    listeningTime: 0,
    isRecording: false,
    recordingStartTime: null,
    recordingTime: null,
    participants: payload.participants,
    isPaused: false,
    appealsId: payload.appealsId,
  }))
  .on(disconnectFromCall, () => null)
  .on(pauseListening, (state) => (state ? { ...state, isPaused: true } : null))
  .on(resumeListening, (state) =>
    state ? { ...state, isPaused: false } : null
  )
  .on(startRecording, (state) => {
    if (!state) return null;
    return {
      ...state,
      isRecording: true,
      recordingStartTime: new Date(),
      recordingTime: 0,
    };
  })
  .on(stopRecording, (state) => {
    if (!state) return null;
    return {
      ...state,
      isRecording: false,
      recordingStartTime: null,
      recordingTime: null,
    };
  });

// Эффект для обновления времени
sample({
  clock: updateCallTimers,
  source: $listeningCall,
  filter: (call): call is ListeningCall => Boolean(call) && !call.isPaused,
  fn: (call) => {
    const now = new Date();
    const listeningTime = Math.floor(
      (now.getTime() - call.listeningStartTime.getTime()) / 1000
    );

    let recordingTime = null;
    if (call.isRecording && call.recordingStartTime) {
      recordingTime = Math.floor(
        (now.getTime() - call.recordingStartTime.getTime()) / 1000
      );
    }

    return {
      ...call,
      listeningTime,
      recordingTime,
    };
  },
  target: $listeningCall,
});

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
