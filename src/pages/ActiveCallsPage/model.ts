// src/pages/ActiveCallsPage/model.ts
import { createDomain, sample } from 'effector';
import { Call, ListeningCall } from './types.ts';
import { mockCallsService } from '../../services/mockService.ts';
import { resetListening } from './model/listeningСard.ts';
import { connectToCall, disconnectFromCall } from './model/listeningCall.ts';

const callsDomain = createDomain();
const filtersDomain = createDomain();
const listeningDomain = createDomain();

// События для управления звонками
export const fetchCallsFx = callsDomain.createEffect(async () => {
    return await mockCallsService.getCalls();
});

// События для управления прослушиванием
export const startListeningFx = listeningDomain.createEffect(
    async (callId: string) => {
        return await mockCallsService.startListening(callId);
    }
);

export const stopListeningFx = listeningDomain.createEffect(
    async (callId: string) => {
        await mockCallsService.stopListening(callId);
        return null;
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
    .on(stopListeningFx.doneData, () => null);

export const $filters = filtersDomain
    .createStore({})
    .on(setFilters, (_, payload) => payload);

// Связь между событиями: успешное начало прослушивания вызывает connectToCall
sample({
    source: startListeningFx.doneData,
    fn: (call) => ({
        id: call.id,
        startTime: new Date(call.callsStartTime),
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

// Автоматическое отключение от предыдущего звонка при новом подключении
sample({
    source: $listeningCall,
    clock: startListeningFx,
    filter: (listeningCall) => listeningCall !== null,
    fn: (listeningCall) => listeningCall!.id,
    target: stopListeningFx,
});

// Инициализация данных при загрузке
fetchCallsFx();