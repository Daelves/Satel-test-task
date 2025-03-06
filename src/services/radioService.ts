import { createDomain } from 'effector';

const radioDomain = createDomain('radio');

export interface RadioStation {
    id: string;
    name: string;
    url: string;
}

export const radioStations: RadioStation[] = [
    {
        id: 'europa-plus',
        name: 'Европа Плюс',
        url: 'https://ep128.hostingradio.ru:8030/ep128',
    },
    {
        id: 'record',
        name: 'Радио Рекорд',
        url: 'https://radiorecord.hostingradio.ru/rr96.aacp',
    },
    {
        id: 'energy',
        name: 'Energy',
        url: 'https://pub0302.101.ru:8443/stream/air/aac/64/99',
    },
];

export const initRadioPlayer = radioDomain.createEvent();
export const playRadio = radioDomain.createEvent();
export const pauseRadio = radioDomain.createEvent();
export const setVolume = radioDomain.createEvent<number>();
export const destroyRadioPlayer = radioDomain.createEvent();


export const $radioPlayer = radioDomain.createStore<HTMLAudioElement | null>(null);
export const $isPlaying = radioDomain.createStore(false);
export const $volume = radioDomain.createStore(0.3); // 30% громкости по умолчанию


$radioPlayer
    .on(initRadioPlayer, () => {
        // Выбираем случайную станцию из списка
        const randomIndex = Math.floor(Math.random() * radioStations.length);
        const station = radioStations[randomIndex];

        const audio = new Audio(station.url);
        audio.volume = $volume.getState();
        audio.autoplay = true;
        return audio;
    })
    .on(destroyRadioPlayer, () => {
        const currentPlayer = $radioPlayer.getState();
        if (currentPlayer) {
            currentPlayer.pause();
            currentPlayer.src = '';
        }
        return null;
    });

$isPlaying
    .on(initRadioPlayer, () => true)
    .on(playRadio, () => true)
    .on(pauseRadio, () => false)
    .reset(destroyRadioPlayer);

$volume.on(setVolume, (_, volume) => volume);

playRadio.watch(() => {
    const player = $radioPlayer.getState();
    if (player) {
        player.play().catch(console.error);
    }
});

pauseRadio.watch(() => {
    const player = $radioPlayer.getState();
    if (player) {
        player.pause();
    }
});

setVolume.watch((volume) => {
    const player = $radioPlayer.getState();
    if (player) {
        player.volume = volume;
    }
});