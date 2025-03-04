import React, {useEffect} from 'react';
import { Card, Space, Typography, Badge } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../model.ts';
import {
  useListeningTimer,
  useRecordingTimer,
  useInitializeListeningTime,
} from '../../hooks/useListeningCardHooks';
import TimerDisplay from './TimerDisplay';
import ControlButtons from './ControlButtons';
import './styles/listening-card.css';
import {
  $isPaused,
  $listeningTime,
  $recordingTime,
} from '../../model/listeningСard.ts';
import {updateTime} from "../../model/listeningCall.ts";

const { Text } = Typography;

const ListeningCard: React.FC = () => {
  const listeningCall = useUnit($listeningCall);
  const listeningTime = useUnit($listeningTime);
  const recordingTime = useUnit($recordingTime);
  const isPaused = useUnit($isPaused);

  useListeningTimer();
  useRecordingTimer();
  useInitializeListeningTime(listeningCall?.id || null);

  // Исправляем: вместо неопределенной функции updateListeningTimer
  // используем функцию updateTime из модели
  useEffect(() => {
    if (listeningCall) {
      // Инициализируем время начала прослушивания
      updateTime({ initListeningTime: true });
    }
  }, [listeningCall]);

  if (!listeningCall) return null;

  return (
      <div className="listening-card-wrapper">
        <div className="listening-card-container">
          <div className="listening-card-player">
            <div className="player-label">
              {isPaused ? 'Звонок на паузе' : 'Идет звонок'}
              {listeningCall.isRecording}
            </div>
            <div className="listening-card-content">
              <div className="timer-container">
                <Text className="current-time">{listeningTime}</Text>
              </div>
              <div className="control-buttons-container">
                <ControlButtons />
              </div>
              {listeningCall.isRecording && (
                  <div className="recording-time-container">
                    <Text className="recording-time">{recordingTime}</Text>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ListeningCard;
