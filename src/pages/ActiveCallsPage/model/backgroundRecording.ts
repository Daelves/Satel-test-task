import { createDomain, sample } from 'effector';
import { openModal } from '../../../shared/modals';
import {
  $isBackgroundRecording,
  $backgroundRecordingCallId,
  $recordingTime,
  stopRecordingFx,
  stopBackgroundRecording,
} from './listeningCall';
import { $calls } from '../model';

const backgroundRecordingDomain = createDomain('backgroundRecording');

// Событие для завершения звонка
export const callEnded = backgroundRecordingDomain.createEvent<string>(); // callId

// Эффекты
export const handleCallEndedWithRecordingFx =
  backgroundRecordingDomain.createEffect(
    async (params: {
      callId: string;
      recordingTime: string;
      appealsId: string;
      startTime: string;
      participants: string[];
    }) => {
      // Останавливаем запись
      await stopRecordingFx(params.callId);

      // Показываем диалог загрузки
      openModal({
        key: 'download',
        params: {
          callId: params.appealsId,
          startTime: params.startTime,
          participants: params.participants,
          recordingDuration: params.recordingTime,
          fromBackgroundRecording: true,
        },
      });

      return params;
    }
  );

// Проверяем завершение звонка с активной фоновой записью
sample({
  clock: callEnded,
  source: {
    isBackgroundRecording: $isBackgroundRecording,
    backgroundRecordingCallId: $backgroundRecordingCallId,
    recordingTime: $recordingTime,
    calls: $calls,
  },
  filter: ({ isBackgroundRecording, backgroundRecordingCallId }, callId) =>
    isBackgroundRecording && backgroundRecordingCallId === callId,
  fn: ({ recordingTime, calls }, callId) => {
    const call = calls.find((c) => c.id === callId);
    if (!call) {
      return {
        callId,
        recordingTime,
        appealsId: 'unknown',
        startTime: new Date().toISOString(),
        participants: [],
      };
    }

    return {
      callId,
      recordingTime,
      appealsId: call.appealsId,
      startTime: call.callsStartTime,
      participants: call.phoneNumbers,
    };
  },
  target: handleCallEndedWithRecordingFx,
});

sample({
  clock: handleCallEndedWithRecordingFx.done,
  target: stopBackgroundRecording,
});

// Экспортируем функцию для проверки, записывается ли звонок
export const isCallBeingRecorded = (callId: string): boolean => {
  return (
    $isBackgroundRecording.getState() &&
    $backgroundRecordingCallId.getState() === callId
  );
};
