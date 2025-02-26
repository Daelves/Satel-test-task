import { createDomain } from 'effector';

// Создаем домены
const callsDomain = createDomain();
const filtersDomain = createDomain();
const listeningDomain = createDomain();
const recordingDomain = createDomain();

// События
export const fetchCallsFx = callsDomain.createEffect();
export const startListeningFx = listeningDomain.createEffect();
export const stopListeningFx = listeningDomain.createEffect();
export const startRecordingFx = recordingDomain.createEffect();
export const stopRecordingFx = recordingDomain.createEffect();
export const setFilters = filtersDomain.createEvent();

// Сторы
export const $calls = callsDomain.createStore<Call[]>([]);
export const $listeningCall = listeningDomain.createStore<ListeningCall | null>(null);
export const $filters = filtersDomain.createStore({});