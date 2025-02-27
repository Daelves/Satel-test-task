// src/api/mockService.ts
import { Call, ListeningCall } from '../pages/ActiveCallsPage/types';

// Генерируем моковые данные для звонков
export const mockCalls: Call[] = [
  {
    id: '1',
    callsId: 'CALL-2025-001',
    recording: false,
    appealsId: 'APP-2025-001',
    callsStartTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 минут назад
    phoneNumbers: ['+7 (999) 123-45-67', '+7 (495) 987-65-43'],
  },
  {
    id: '2',
    callsId: 'CALL-2025-002',
    recording: true,
    appealsId: 'APP-2025-002',
    callsStartTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 минут назад
    phoneNumbers: ['+7 (999) 555-44-33'],
  },
  {
    id: '3',
    callsId: 'CALL-2025-003',
    recording: false,
    appealsId: 'APP-2025-003',
    callsStartTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 минут назад
    phoneNumbers: [
      '+7 (999) 777-88-99',
      '+7 (495) 111-22-33',
      '+7 (812) 444-55-66',
    ],
  },
];

// Мок для прослушиваемого звонка
export const mockListeningCall: ListeningCall = {
  ...mockCalls[1],
  duration: '00:05:00', // формат времени
  isRecording: true,
};

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
    return new Promise((resolve) => {
      const call = mockCalls.find((c) => c.id === callId);
      if (call) {
        const listeningCall: ListeningCall = {
          ...call,
          duration: '00:00:00',
          isRecording: call.recording,
        };
        setTimeout(() => resolve(listeningCall), 300);
      } else {
        throw new Error('Call not found');
      }
    });
  },

  // Остановить прослушивание
  stopListening: (callId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },

  // Начать запись
  startRecording: (callId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },

  // Остановить запись
  stopRecording: (callId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },
};
