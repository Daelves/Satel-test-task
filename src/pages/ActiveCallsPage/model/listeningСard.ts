import { createDomain, sample } from 'effector';
import { formatTime } from '../../../utils/formatters';

const listeningControlDomain = createDomain('listeningControl');
const recordingDomain = createDomain('recording');
const timersDomain = createDomain('timers');

export const togglePause = listeningControlDomain.createEvent();
export const resetListening = listeningControlDomain.createEvent();

export const startRecordingFx = recordingDomain.createEffect(
  async (callId: string) => {
    // В реальном приложении здесь будет вызов API
    console.log(`Starting recording for call ${callId}`);
    return true;
  }
);

export const stopRecordingFx = recordingDomain.createEffect(
  async (callId: string) => {
    // В реальном приложении здесь будет вызов API
    console.log(`Stopping recording for call ${callId}`);
    return false;
  }
);

export const resetRecording = recordingDomain.createEvent();

export const updateListeningTimer = timersDomain.createEvent<number>();
export const updateRecordingTimer = timersDomain.createEvent<number>();
export const resetTimers = timersDomain.createEvent();

// ================== Сторы ==================

export const $isPaused = listeningControlDomain
  .createStore(false)
  .on(togglePause, (state) => !state)
  .reset(resetListening);

export const $listeningStartTime = listeningControlDomain
  .createStore<number | null>(null)
  .on(resetListening, () => null);

// Сторы для управления записью
export const $recordingStartTime = recordingDomain
  .createStore<number | null>(null)
  .on(startRecordingFx.doneData, () => Date.now())
  .on(stopRecordingFx.doneData, () => null)
  .reset(resetRecording);

export const $listeningTime = timersDomain
  .createStore('00:00')
  .on(updateListeningTimer, (_, timestamp) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    return formatTime(elapsed);
  })
  .reset(resetTimers);

export const $recordingTime = timersDomain
  .createStore('00:00')
  .on(updateRecordingTimer, (_, timestamp) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    return formatTime(elapsed);
  })
  .reset(resetTimers);
