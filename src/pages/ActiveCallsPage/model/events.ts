import { createDomain } from 'effector';

const eventsDomain = createDomain('callsEvents');

// События, общие для модулей
export const connectToCall = eventsDomain.createEvent<{
  id: string;
  startTime: string;
  participants: string[];
  appealsId: string;
}>();

export const disconnectFromCall = eventsDomain.createEvent();
export const resetListening = eventsDomain.createEvent();
