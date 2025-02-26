
import { createDomain, sample } from 'effector';
import { formatTime } from '../../../utils/formatters';


const listeningControlDomain = createDomain('listeningControl');
const recordingDomain = createDomain('recording');
const modalsDomain = createDomain('modals');
const timersDomain = createDomain('timers');


// События для управления прослушиванием
export const togglePause = listeningControlDomain.createEvent();
export const resetListening = listeningControlDomain.createEvent();

// События и эффекты для управления записью
export const startRecordingFx = recordingDomain.createEffect(async (callId: string) => {
    // В реальном приложении здесь будет вызов API
    console.log(`Starting recording for call ${callId}`);
    return true;
});

export const stopRecordingFx = recordingDomain.createEffect(async (callId: string) => {
    // В реальном приложении здесь будет вызов API
    console.log(`Stopping recording for call ${callId}`);
    return false;
});

export const resetRecording = recordingDomain.createEvent();

// События для модальных окон
export const openPhoneSelectModal = modalsDomain.createEvent();
export const closePhoneSelectModal = modalsDomain.createEvent();
export const openRuleModal = modalsDomain.createEvent<string>(); // с параметром номера телефона
export const closeRuleModal = modalsDomain.createEvent();
export const openDownloadModal = modalsDomain.createEvent();
export const closeDownloadModal = modalsDomain.createEvent();
export const updateDownloadProgress = modalsDomain.createEvent<number>();

// События для таймеров
export const updateListeningTimer = timersDomain.createEvent<number>();
export const updateRecordingTimer = timersDomain.createEvent<number>();
export const resetTimers = timersDomain.createEvent();

// ================== Сторы ==================

// Сторы для управления прослушиванием
export const $isPaused = listeningControlDomain.createStore(false)
    .on(togglePause, (state) => !state)
    .reset(resetListening);

export const $listeningStartTime = listeningControlDomain.createStore<number | null>(null)
    .on(resetListening, () => null);

// Сторы для управления записью
export const $recordingStartTime = recordingDomain.createStore<number | null>(null)
    .on(startRecordingFx.doneData, () => Date.now())
    .on(stopRecordingFx.doneData, () => null)
    .reset(resetRecording);

// Сторы для модальных окон
export const $phoneSelectModalVisible = modalsDomain.createStore(false)
    .on(openPhoneSelectModal, () => true)
    .on(closePhoneSelectModal, () => false)
    .on(openRuleModal, () => false);

export const $ruleModalVisible = modalsDomain.createStore(false)
    .on(openRuleModal, () => true)
    .on(closeRuleModal, () => false);

export const $selectedPhoneNumber = modalsDomain.createStore<string | null>(null)
    .on(openRuleModal, (_, phoneNumber) => phoneNumber)
    .reset(closeRuleModal);

export const $downloadModalVisible = modalsDomain.createStore(false)
    .on(openDownloadModal, () => true)
    .on(closeDownloadModal, () => false);

export const $downloadProgress = modalsDomain.createStore(0)
    .on(updateDownloadProgress, (_, progress) => progress)
    .reset(closeDownloadModal);

// Сторы для таймеров
export const $listeningTime = timersDomain.createStore('00:00')
    .on(updateListeningTimer, (_, timestamp) => {
        const now = Date.now();
        const elapsed = now - timestamp;
        return formatTime(elapsed);
    })
    .reset(resetTimers);

export const $recordingTime = timersDomain.createStore('00:00')
    .on(updateRecordingTimer, (_, timestamp) => {
        const now = Date.now();
        const elapsed = now - timestamp;
        return formatTime(elapsed);
    })
    .reset(resetTimers);


// При остановке записи открываем модальное окно загрузки
sample({
    clock: stopRecordingFx.doneData,
    target: openDownloadModal
});

// Импортируем существующий стор из основной модели
import { $listeningCall as $existingListeningCall } from '../model.ts';

export { $listeningCall } from '../model.ts';
