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

const { Text } = Typography;

const ListeningCard: React.FC = () => {
  const listeningCall = useUnit($listeningCall);
  const listeningTime = useUnit($listeningTime);
  const recordingTime = useUnit($recordingTime);
  const isPaused = useUnit($isPaused);

  useListeningTimer();
  useRecordingTimer();
  useInitializeListeningTime(listeningCall?.id || null);

  if (!listeningCall) return null;

  useEffect(() => {
    if (listeningCall) {
      // Устанавливаем время начала прослушивания
      updateListeningTimer(Date.now());
    }
  }, []);

  return (
      <div className="listening-card-container">
        <div className="listening-card-player">
          <div className="player-label">
            {isPaused ? 'Звонок на паузе' : 'Идет звонок'}
            {listeningCall.isRecording && ' (запись активна)'}
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
  );
};

export default ListeningCard;
