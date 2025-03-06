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
  {
    id: 'dorozhnoe-radio',
    name: 'Дорожное Радио',
    url: 'https://dorognoe.hostingradio.ru/radio',
  },
  {
    id: 'avtoradio',
    name: 'Авторадио',
    url: 'https://pub0201.101.ru:8443/stream/air/aac/64/100',
  },
  {
    id: 'radio-dacha',
    name: 'Радио Дача',
    url: 'https://stream.radiodacha.ru/14_dacha_64',
  },
  {
    id: 'vesti-fm',
    name: 'Вести FM',
    url: 'https://icecast-vgtrk.cdnvideo.ru/vestifm_mp3_192kbps',
  },
  {
    id: 'radio-mayak',
    name: 'Радио Маяк',
    url: 'https://icecast-vgtrk.cdnvideo.ru/mayakfm_mp3_192kbps',
  },
  {
    id: 'radio-maximum',
    name: 'Radio Maximum',
    url: 'https://maximum.hostingradio.ru/maximum96.aacp',
  },
  {
    id: 'nashe-radio',
    name: 'Наше Радио',
    url: 'https://nashe1.hostingradio.ru/nashe-128.mp3',
  },
  {
    id: 'retro-fm',
    name: 'Ретро FM',
    url: 'https://retro.hostingradio.ru:8043/retro256.mp3',
  },
  {
    id: 'love-radio',
    name: 'Love Radio',
    url: 'https://pub0201.101.ru:8443/stream/air/aac/64/101',
  },
  {
    id: 'radio-shanson',
    name: 'Радио Шансон',
    url: 'https://chanson.hostingradio.ru:8041/chanson128.mp3',
  },
];

export const getRadioStationForCall = (callId: string): string => {
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

    const stationIndex = hashCode(callId) % radioStations.length;
    return radioStations[stationIndex].id;
};

export const selectStation = radioDomain.createEvent<string>();
export const initRadioPlayer = radioDomain.createEvent<string | undefined>();
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

// Добавляем логирование
destroyRadioPlayer.watch(() => {
    console.log('Radio player destroyed');
});

initRadioPlayer.watch((stationId) => {
    console.log('Radio player initialized with station ID:', stationId);
});

$radioPlayer
    .on(initRadioPlayer, (_, stationId) => {
        // Если не передан stationId, не инициализируем плеер
        if (!stationId) {
            console.log('No station ID provided, not initializing radio player');
            return null;
        }

        const targetStationId = stationId ||
            radioStations[Math.floor(Math.random() * radioStations.length)].id;

        const station = radioStations.find(s => s.id === targetStationId) ||
            radioStations[0];

        console.log('Creating new audio player for station:', station.name);

        const audio = new Audio(station.url);
        audio.volume = $volume.getState();
        audio.autoplay = false; // Изменяем на false, чтобы управлять через playRadio

        $currentStationId.setState(station.id);

        return audio;
    })
    .on(destroyRadioPlayer, (player) => {
        if (player) {
            console.log('Stopping and clearing audio player');
            player.pause();
            player.src = '';
            player.load(); // Полностью выгружаем ресурс
        }
        return null;
    });

$isPlaying
    .on(playRadio, () => true)
    .on(pauseRadio, () => false)
    .reset(destroyRadioPlayer);

$volume.on(setVolume, (_, volume) => volume);

selectStation.watch((stationId) => {
    const wasPlaying = $isPlaying.getState();
    const volume = $volume.getState();

    destroyRadioPlayer();

    // Только инициализируем, если был передан stationId
    if (stationId) {
        initRadioPlayer(stationId);

        if (wasPlaying) {
            playRadio();
        }
        setVolume(volume);
    }
});

playRadio.watch(() => {
    const player = $radioPlayer.getState();
    if (player) {
        console.log('Playing radio');
        player.play().catch(err => {
            console.error('Error playing audio:', err);
        });
    } else {
        console.warn('Attempted to play radio with no player initialized');
    }
});

pauseRadio.watch(() => {
    const player = $radioPlayer.getState();
    if (player) {
        console.log('Pausing radio');
        player.pause();
    }
});

setVolume.watch((volume) => {
    const player = $radioPlayer.getState();
    if (player) {
        player.volume = volume;
    }
});