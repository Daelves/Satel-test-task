import { createDomain, sample } from 'effector';
import { Call, ListeningCall } from './types.ts';
import { mockCallsService } from '../../services/mockService.ts';

import {
  connectToCall,
  disconnectFromCall,
  resetListening,
} from './model/events';
import { destroyRadioPlayer, getRadioStationForCall, initRadioPlayer } from "../../services/radioService.ts";

const callsDomain = createDomain();
const filtersDomain = createDomain();
const listeningDomain = createDomain();

export const switchCallRequested = listeningDomain.createEvent<string>();
export const disconnectCallRequested = listeningDomain.createEvent<string>();

export const fetchCallsFx = callsDomain.createEffect(async () => {
  return await mockCallsService.getCalls();
});

export const startListeningFx = listeningDomain.createEffect(
    async (callId: string) => {
      console.log('Запуск startListeningFx с ID:', callId);
      try {
        const result = await mockCallsService.startListening(callId);
        console.log('startListeningFx успешно выполнен:', result);

        const stationId = result.radioStationId || getRadioStationForCall(callId);

        destroyRadioPlayer();
        initRadioPlayer(stationId);

        return {
          ...result,
          radioStationId: stationId
        };
      } catch (error) {
        console.error('Ошибка в startListeningFx:', error);
        throw error;
      }
    }
);

export const stopListeningFx = listeningDomain.createEffect(
    async (callId: string) => {
      console.log('Запуск stopListeningFx с ID:', callId);
      try {
        const result = await mockCallsService.stopListening(callId);
        console.log('stopListeningFx успешно выполнен:', result);

        destroyRadioPlayer();

        return result;
      } catch (error) {
        console.error('Ошибка в stopListeningFx:', error);
        throw error;
      }
    }
);

export const switchRadioStationFx = listeningDomain.createEffect(
    async (callId: string) => {
      destroyRadioPlayer();

      const stationId = getRadioStationForCall(callId);

      initRadioPlayer(stationId);

      return stationId;
    }
);

export const setFilters = filtersDomain.createEvent();

export const $calls = callsDomain
    .createStore<Call[]>([])
    .on(fetchCallsFx.doneData, (_, payload) => payload);

export const $listeningCall = listeningDomain
    .createStore<ListeningCall | null>(null)
    .on(startListeningFx.doneData, (_, payload) => payload)
    .on(stopListeningFx.done, (state, { params }) => {
      return null;
    });

export const $filters = filtersDomain
    .createStore({})
    .on(setFilters, (_, payload) => payload);

// Добавляем логирование для отслеживания событий
startListeningFx.doneData.watch((payload) => {
  console.log('startListeningFx.doneData сработал с:', payload);
});

startListeningFx.failData.watch((error) => {
  console.error('startListeningFx.failData сработал с ошибкой:', error);
});

$listeningCall.watch((state) => {
  console.log('$listeningCall обновился:', state);
});

sample({
  source: startListeningFx.doneData,
  fn: (call) => ({
    id: call.id,
    startTime: call.callsStartTime,
    participants: call.phoneNumbers,
    appealsId: call.appealsId,
  }),
  target: connectToCall,
});


sample({
  clock: stopListeningFx.done,
  target: disconnectFromCall,
});

sample({
  clock: stopListeningFx.done,
  target: resetListening,
});

sample({
  clock: disconnectCallRequested,
  target: stopListeningFx,
});

sample({
  clock: switchCallRequested,
  source: $listeningCall,
  filter: (currentCall, newCallId) =>
      currentCall !== null && currentCall.id !== newCallId,
  fn: (currentCall) => currentCall!.id,
  target: stopListeningFx,
});

sample({
  clock: stopListeningFx.done,
  source: switchCallRequested,
  filter: (newCallId, { params }) => newCallId !== params,
  target: startListeningFx,
});

sample({
  clock: switchCallRequested,
  source: $listeningCall,
  filter: (currentCall, newCallId) =>
      currentCall === null || currentCall.id === newCallId,
  fn: (_, newCallId) => newCallId,
  target: startListeningFx,
});

fetchCallsFx();