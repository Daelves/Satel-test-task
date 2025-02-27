import { CallRecord } from '../pages/ActiveCallsPage/model/callsTable.ts';

/**
 * Генерация моковых данных для таблицы активных звонков
 * Структура на основе документации "Описание атрибутов таблицы CurrentCall"
 */

const generateAppealsId = (): string => {
  return `AP-${Math.floor(100000 + Math.random() * 900000)}`;
};

const generateCallId = (): string => {
  return `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
};

const generatePhoneNumber = (): string => {
  return `+7${Math.floor(9000000000 + Math.random() * 1000000000)}`;
};

const generateRecentDate = (): Date => {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 24); // От 0 до 24 часов назад
  const minutesAgo = Math.floor(Math.random() * 60); // От 0 до 60 минут назад

  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);

  return now;
};

export const generateMockCalls = (count: number = 15): CallRecord[] => {
  const calls: CallRecord[] = [];

  for (let i = 0; i < count; i++) {
    const participantsCount = Math.floor(Math.random() * 3) + 2; // От 2 до 4 участников
    const participants: string[] = [];

    for (let j = 0; j < participantsCount; j++) {
      participants.push(generatePhoneNumber());
    }

    calls.push({
      id: generateCallId(),
      appealsId: generateAppealsId(),
      startTime: generateRecentDate(),
      participants,
      isRecording: Math.random() > 0.3,
    });
  }

  return calls.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
};

export const mockCalls = generateMockCalls(15);
