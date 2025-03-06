import { createDomain, sample } from 'effector';
import { Call, ListeningCall } from './types.ts';
import { mockCallsService } from '../../services/mockService.ts';

import {
  connectToCall,
  disconnectFromCall,
  resetListening,
} from './model/events';
import {destroyRadioPlayer, getRadioStationForCall, initRadioPlayer} from "../../services/radioService.ts";

const callsDomain = createDomain();
const filtersDomain = createDomain();
const listeningDomain = createDomain();

// Создаем событие для переключения между звонками
export const switchCallRequested = listeningDomain.createEvent<string>();

// События для управления звонками
export const fetchCallsFx = callsDomain.createEffect(async () => {
  return await mockCallsService.getCalls();
});

// События для управления прослушиванием
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
      return result;
    } catch (error) {
      console.error('Ошибка в stopListeningFx:', error);
      throw error;
    }
  }
);

export const switchRadioStationFx = listeningDomain.createEffect(
    async (callId: string) => {
      // Останавливаем текущую станцию
      destroyRadioPlayer();

      // Определяем новую станцию для звонка
      const stationId = getRadioStationForCall(callId);

      // Инициализируем плеер с новой станцией
      initRadioPlayer(stationId);

      return stationId;
    }
);

// События для управления фильтрами
export const setFilters = filtersDomain.createEvent();

// Хранилища данных
export const $calls = callsDomain
  .createStore<Call[]>([])
  .on(fetchCallsFx.doneData, (_, payload) => payload);

export const $listeningCall = listeningDomain
  .createStore<ListeningCall | null>(null)
  .on(startListeningFx.doneData, (_, payload) => payload)
  .on(stopListeningFx.done, (state, { params }) => {
    // Сбрасываем состояние только если звонок отключается без подключения к новому
    if (state?.id === params) {
      return null;
    }
    return state;
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

// Связь между событиями: успешное начало прослушивания вызывает connectToCall
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

// Связь между событиями: успешное завершение прослушивания вызывает disconnectFromCall
sample({
  clock: stopListeningFx.done,
  target: disconnectFromCall,
});

// Сброс состояния прослушивания при отключении от звонка
sample({
  clock: stopListeningFx.done,
  target: resetListening,
});

// Обработка переключения между звонками
// Если есть активный звонок, сначала отключаемся от него
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
  fn: (newCallId) => newCallId,
  target: switchRadioStationFx,
});

sample({
  clock: switchCallRequested,
  source: $listeningCall,
  filter: (currentCall, newCallId) =>
      currentCall === null || currentCall.id === newCallId,
  fn: (_, newCallId) => newCallId,
  target: switchRadioStationFx, // Сначала переключаем радиостанцию
});

sample({
  clock: switchRadioStationFx.done,
  source: switchCallRequested,
  filter: (newCallId, { params }) => newCallId !== params,
  target: startListeningFx,
});

// После отключения от текущего звонка, подключаемся к новому
sample({
  clock: stopListeningFx.done,
  source: switchCallRequested,
  filter: (newCallId, { params }) => newCallId !== params,
  target: startListeningFx,
});

// Прямое подключение, если нет активного звонка
sample({
  clock: switchCallRequested,
  source: $listeningCall,
  filter: (currentCall, newCallId) =>
    currentCall === null || currentCall.id === newCallId,
  fn: (_, newCallId) => newCallId,
  target: startListeningFx,
});

// Инициализация данных при загрузке
fetchCallsFx();
