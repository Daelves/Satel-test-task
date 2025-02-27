import React from 'react';
import { Button, Space } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  DisconnectOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUnit } from 'effector-react';
import {
  $isPaused,
  togglePause,
  startRecordingFx,
  stopRecordingFx,
  $listeningCall,
} from '../../model/listeningСard.ts';
import { stopListeningFx } from '../../model';
import useModal from "../../../../shared/modals/useModal.ts";

const ControlButtons: React.FC = () => {
  const isPaused = useUnit($isPaused);
  const listeningCall = useUnit($listeningCall);

    const { open: openPhoneSelectModal } = useModal('phoneSelect');
    const { open: openDownloadModal } = useModal('download');


  if (!listeningCall) return null;

  const handlePauseResume = () => {
    togglePause();
  };

  const handleDisconnect = () => {
    stopListeningFx(listeningCall.id);
  };

  const handleRecordStart = () => {
    startRecordingFx(listeningCall.id);
  };

  const handleRecordStop = () => {
    stopRecordingFx(listeningCall.id);
      openDownloadModal({ callId: listeningCall.id })
  };

  const handleAddToControlClick = () => {
      openPhoneSelectModal({
          onSelectPhone: (phone: string) => {
              console.log('Selected phone:', phone);
          }
      });
  };

  return (
    <Space style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
      <Button
        type='primary'
        icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
        onClick={handlePauseResume}
      >
        {isPaused ? 'Продолжить прослушивание' : 'Пауза'}
      </Button>

      {!listeningCall.isRecording ? (
        <Button
          icon={<AudioOutlined />}
          onClick={handleRecordStart}
          style={{ backgroundColor: '#f5f5f5' }}
        >
          Запись звонка
        </Button>
      ) : (
        <Button danger icon={<AudioMutedOutlined />} onClick={handleRecordStop}>
          Остановка записи
        </Button>
      )}

      <Button
        danger
        type='primary'
        icon={<DisconnectOutlined />}
        onClick={handleDisconnect}
      >
        Отключиться от звонка
      </Button>

      <Button
        type='default'
        icon={<PlusOutlined />}
        onClick={handleAddToControlClick}
      >
        Добавить на контроль
      </Button>
    </Space>
  );
};

export default ControlButtons;
