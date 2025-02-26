import { createDomain, sample } from 'effector';
import { Call, ListeningCall } from './types.ts';
import {mockCallsService, mockListeningCall} from "../../services/mockService.ts";



const callsDomain = createDomain();
const filtersDomain = createDomain();
const listeningDomain = createDomain();
const recordingDomain = createDomain();

// Существующие события и эффекты
export const fetchCallsFx = callsDomain.createEffect(async () => {
    return await mockCallsService.getCalls();
});

export const startListeningFx = listeningDomain.createEffect(async (callId: string) => {
    return await mockCallsService.startListening(callId);
});

export const stopListeningFx = listeningDomain.createEffect(async (callId: string) => {
    await mockCallsService.stopListening(callId);
    return null;
});

export const startRecordingFx = recordingDomain.createEffect(async (callId: string) => {
    await mockCallsService.startRecording(callId);
    return true;
});

export const stopRecordingFx = recordingDomain.createEffect(async (callId: string) => {
    await mockCallsService.stopRecording(callId);
    return false;
});

export const setFilters = filtersDomain.createEvent();


export const $calls = callsDomain.createStore<Call[]>([])
    .on(fetchCallsFx.doneData, (_, payload) => payload);

export const $listeningCall = listeningDomain.createStore<ListeningCall | null>(mockListeningCall)
    .on(startListeningFx.doneData, (_, payload) => payload)
    .on(stopListeningFx.doneData, () => null);

export const $filters = filtersDomain.createStore({})
    .on(setFilters, (_, payload) => payload);

// Обновление isRecording в прослушиваемом звонке
sample({
    source: $listeningCall,
    clock: startRecordingFx.doneData,
    fn: (call, isRecording) => call ? { ...call, isRecording } : null,
    target: $listeningCall
});

sample({
    source: $listeningCall,
    clock: stopRecordingFx.doneData,
    fn: (call, isRecording) => call ? { ...call, isRecording } : null,
    target: $listeningCall
});

// Инициализация данных при загрузке
fetchCallsFx();