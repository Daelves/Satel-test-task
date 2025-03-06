import React, { useEffect } from 'react';
import {Button, Dropdown, Tooltip} from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  PhoneOutlined,
  AudioOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUnit } from 'effector-react';

import { $listeningCall, disconnectCallRequested } from '../../model';
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
  pauseRadio,
  playRadio,
} from '../../../../services/radioService.ts';
import VolumeControl from './VolumeControl.tsx';

const ControlButtons: React.FC = () => {
  const isPaused = useUnit($isPaused);
  const isRecording = useUnit($isRecording);
  const listeningCall = useUnit($listeningCall);

  const { open: openRuleModal } = useModal('rule');

  useEffect(() => {
    if (listeningCall) {
      if (!isPaused) {
        playRadio();
      } else {
        pauseRadio();
      }
    }
  }, [listeningCall, isPaused]);

  if (!listeningCall) return null;

  const handlePauseResume = () => {
    togglePause();
    console.log(`${isPaused ? 'Возобновление' : 'Пауза'} прослушивания`);
  };

  const handleDisconnect = () => {
    if (listeningCall) {
      pauseRadio(); // Приостанавливаем воспроизведение
      disconnectCallRequested(listeningCall.id);
      console.log('Отключение от звонка');
    }
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

  const handlePhoneSelect = (phone: string) => {
    openRuleModal({ phoneNumber: phone });
    console.log('Выбран номер для контроля:', phone);
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
          <Dropdown
              menu={{ items: listeningCall.phoneNumbers?.map((phone, index) => ({
                  key: index.toString(),
                  label: phone,
                  onClick: () => handlePhoneSelect(phone)
                })) }}
              trigger={['click']}
              placement="bottomCenter"
              arrow
          >
          <Button
              type='text'
              className='control-btn add-control-btn'
              icon={<PlusOutlined />}
          />
          </Dropdown>
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