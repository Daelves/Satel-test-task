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

export const getRadioStationForCall = (callId: string): string => {
    const hashCode = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Конвертация в 32-битное целое
        }
        return Math.abs(hash);
    };

    const stationIndex = hashCode(callId) % radioStations.length;
    return radioStations[stationIndex].id;
};

export const selectStation = radioDomain.createEvent<string>();
export const initRadioPlayer = radioDomain.createEvent();
export const playRadio = radioDomain.createEvent();
export const pauseRadio = radioDomain.createEvent();
export const setVolume = radioDomain.createEvent<number>();
export const destroyRadioPlayer = radioDomain.createEvent();

export const $radioPlayer = radioDomain.createStore<HTMLAudioElement | null>(
  null
);
export const $isPlaying = radioDomain.createStore(false);
export const $volume = radioDomain.createStore(0.3);
export const $currentStationId = radioDomain.createStore<string>('europa-plus');

$radioPlayer
    .on(initRadioPlayer, (_, stationId) => {
        const targetStationId = stationId ||
            radioStations[Math.floor(Math.random() * radioStations.length)].id;

        const station = radioStations.find(s => s.id === targetStationId) ||
            radioStations[0];

        const audio = new Audio(station.url);
        audio.volume = $volume.getState();
        audio.autoplay = true;

        $currentStationId.setState(station.id);

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

selectStation.watch((stationId) => {
    const wasPlaying = $isPlaying.getState();
    const volume = $volume.getState();

    destroyRadioPlayer();

    const player = initRadioPlayer(stationId);

    if (!wasPlaying) {
        pauseRadio();
    }
    setVolume(volume);
});

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
