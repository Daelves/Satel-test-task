// src/pages/ActiveCallsPage/components/ListeningCard/ControlButtons.tsx
import React, { useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  PhoneOutlined,
  AudioOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUnit } from 'effector-react';

import { $listeningCall, stopListeningFx } from '../../model';
import useModal from '../../../../shared/modals/useModal.ts';
import {
  $isPaused,
  $isRecording,
  startRecordingFx,
  stopRecordingFx,
  togglePause,
} from '../../model/listeningCall.ts';
import { openModal } from '../../../../shared/modals';
import {
  destroyRadioPlayer,
  initRadioPlayer,
  pauseRadio,
  playRadio,
} from '../../../../services/radioService.ts';
import VolumeControl from './VolumeControl.tsx';

const ControlButtons: React.FC = () => {
  const isPaused = useUnit($isPaused);
  const isRecording = useUnit($isRecording);
  const listeningCall = useUnit($listeningCall);

  const { open: openPhoneSelectModal } = useModal('phoneSelect');
  const { open: openDownloadModal } = useModal('download');

  useEffect(() => {
    if (listeningCall) {
      initRadioPlayer();
      if (!isPaused) {
        playRadio();
      }
    }

    // Уничтожаем плеер при отключении от звонка
    return () => {
      destroyRadioPlayer();
    };
  }, [listeningCall]);

  useEffect(() => {
    if (listeningCall) {
      // Проверяем, что плеер инициализирован
      // и начинаем воспроизведение, если звонок не на паузе
      if (!isPaused) {
        playRadio();
      } else {
        pauseRadio();
      }
    }

    // Очистка при размонтировании
    return () => {
      // Не нужно вызывать destroyRadioPlayer здесь,
      // так как это будет сделано в switchRadioStationFx
      // Просто останавливаем воспроизведение
      pauseRadio();
    };
  }, [listeningCall, isPaused]);

  if (!listeningCall) return null;

  const handlePauseResume = () => {
    togglePause();
    console.log(`${isPaused ? 'Возобновление' : 'Пауза'} прослушивания`);
  };

  const handleDisconnect = () => {
    pauseRadio();
    stopListeningFx(listeningCall.id);
    console.log('Отключение от звонка');
  };

  const handleRecordStart = () => {
    startRecordingFx(listeningCall.id);
    console.log('Начало записи звонка');
  };

  const handleRecordStop = () => {
    if (listeningCall) {
      stopRecordingFx(listeningCall.id);
      openModal({
        key: 'download',
        params: { callId: listeningCall.id },
      });

      console.log('Остановка записи звонка и открытие модального окна');
    }
  };

  const handleAddToControlClick = () => {
    openPhoneSelectModal({
      onSelectPhone: (phone: string) => {
        console.log('Выбран номер для контроля:', phone);
      },
    });
  };

  return (
    <div className='control-buttons'>
      <Tooltip
        title={isPaused ? 'Продолжить прослушивание' : 'Поставить на паузу'}
      >
        <Button
          type='text'
          className='control-btn pause-btn'
          icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
          onClick={handlePauseResume}
        />
      </Tooltip>

      <Tooltip title='Отключиться от звонка'>
        <Button
          type='text'
          className='control-btn disconnect-btn'
          icon={<PhoneOutlined />}
          onClick={handleDisconnect}
        />
      </Tooltip>

      <Tooltip title='Добавить на контроль'>
        <Button
          type='text'
          className='control-btn add-control-btn'
          icon={<PlusOutlined />}
          onClick={handleAddToControlClick}
        />
      </Tooltip>

      {!isRecording ? (
        <Tooltip title='Начать запись звонка'>
          <Button
            type='text'
            className='control-btn record-btn'
            icon={<AudioOutlined />}
            onClick={handleRecordStart}
          />
        </Tooltip>
      ) : (
        <Tooltip title='Остановить запись'>
          <div className='recording-indicator' onClick={handleRecordStop} />
        </Tooltip>
      )}
      <VolumeControl />
    </div>
  );
};

export default ControlButtons;
