
import { Call, ListeningCall } from '../pages/ActiveCallsPage/types';
import { mockCalls as generatedMockCalls } from '../api/mackCallsData';

export const mockCalls: Call[] = generatedMockCalls.map(call => ({
  id: call.id,
  callsId: `CALL-${call.id}`,
  recording: call.isRecording,
  appealsId: call.appealsId,
  callsStartTime: call.startTime.toISOString(), // Используем существующее startTime
  phoneNumbers: call.participants,
}));

// Мок-сервис для имитации API
export const mockCallsService = {
  // Получение списка звонков
  getCalls: (): Promise<Call[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCalls), 500);
    });
  },

  // Начать прослушивание звонка
  startListening: (callId: string): Promise<ListeningCall> => {
    return new Promise((resolve, reject) => {
      console.log('startListening вызван с ID:', callId);

      // Находим существующий звонок по ID
      const call = mockCalls.find((c) => c.id === callId);

      if (call) {
        // Используем данные существующего звонка
        const listeningCall: ListeningCall = {
          ...call,
          duration: '00:00:00',
          isRecording: call.recording,
        };

        console.log('Найден звонок:', call);
        console.log('Создан listeningCall:', listeningCall);

        setTimeout(() => {
          resolve(listeningCall);
        }, 300);
      } else {
        console.error('Звонок с ID', callId, 'не найден в mockCalls');
        reject(new Error('Call not found'));
      }
    });
  },

  // Остановить прослушивание
  stopListening: (callId: string): Promise<null> => {
    return new Promise((resolve) => {
      console.log('stopListening вызван с ID:', callId);
      setTimeout(() => resolve(null), 300);
    });
  },

  // Начать запись
  startRecording: (callId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('startRecording вызван с ID:', callId);
      setTimeout(() => resolve(true), 300);
    });
  },

  // Остановить запись
  stopRecording: (callId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('stopRecording вызван с ID:', callId);
      setTimeout(() => resolve(false), 300);
    });
  },
};