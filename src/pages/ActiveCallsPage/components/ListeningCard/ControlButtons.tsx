import React from 'react';
import { Button, Tooltip } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  PhoneOutlined,
  AudioOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUnit } from 'effector-react';
import {
  $isPaused,
  $isRecording,
  togglePause,
  startRecordingFx,
  stopRecordingFx,
} from '../../model/listeningСard.ts';
import { $listeningCall, stopListeningFx } from '../../model';
import useModal from '../../../../shared/modals/useModal.ts';

const ControlButtons: React.FC = () => {
  const isPaused = useUnit($isPaused);
  const isRecording = useUnit($isRecording);
  const listeningCall = useUnit($listeningCall);

  const { open: openPhoneSelectModal } = useModal('phoneSelect');
  const { open: openDownloadModal } = useModal('download');

  if (!listeningCall) return null;

  /**
   * Обработчик кнопки паузы/воспроизведения
   */
  const handlePauseResume = () => {
    togglePause();
    console.log(`${isPaused ? 'Возобновление' : 'Пауза'} прослушивания`);
  };

  /**
   * Обработчик отключения от звонка
   */
  const handleDisconnect = () => {
    stopListeningFx(listeningCall.id);
    console.log('Отключение от звонка');
  };

  /**
   * Обработчик кнопки начала записи звонка
   */
  const handleRecordStart = () => {
    startRecordingFx(listeningCall.id);
    console.log('Начало записи звонка');
  };

  /**
   * Обработчик кнопки окончания записи звонка
   */
  const handleRecordStop = () => {
    stopRecordingFx(listeningCall.id);
    console.log('Остановка записи звонка');
  };

  /**
   * Обработчик добавления звонка на контроль
   */
  const handleAddToControlClick = () => {
    openPhoneSelectModal({
      onSelectPhone: (phone: string) => {
        console.log('Выбран номер для контроля:', phone);
      },
    });
  };

  return (
      <div className="control-buttons">
        <Tooltip title={isPaused ? 'Продолжить прослушивание' : 'Поставить на паузу'}>
          <Button
              type="text"
              className="control-btn pause-btn"
              icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
              onClick={handlePauseResume}
          />
        </Tooltip>

        <Tooltip title="Отключиться от звонка">
          <Button
              type="text"
              className="control-btn disconnect-btn"
              icon={<PhoneOutlined />}
              onClick={handleDisconnect}
          />
        </Tooltip>

        <Tooltip title="Добавить на контроль">
          <Button
              type="text"
              className="control-btn add-control-btn"
              icon={<PlusOutlined />}
              onClick={handleAddToControlClick}
          />
        </Tooltip>

        {!isRecording ? (
            <Tooltip title="Начать запись звонка">
              <Button
                  type="text"
                  className="control-btn record-btn"
                  icon={<AudioOutlined />}
                  onClick={handleRecordStart}
              />
            </Tooltip>
        ) : (
            <Tooltip title="Остановить запись">
              <div
                  className="recording-indicator"
                  onClick={handleRecordStop}
              />
            </Tooltip>
        )}
      </div>
  );
};

export default ControlButtons;