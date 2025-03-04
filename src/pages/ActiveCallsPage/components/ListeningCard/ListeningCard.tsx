import React from 'react';
import { Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../model.ts';
import ControlButtons from './ControlButtons';
import './styles/listening-card.css';

import {
  $callDuration, $isPaused,
  $isRecording, $recordingTime,
} from '../../model/listeningCall.ts';
import {useCallDuration} from "../../hooks/useCallDuration.ts";

const { Text } = Typography;

const ListeningCard: React.FC = () => {
  const listeningCall = useUnit($listeningCall);
  const recordingTime = useUnit($recordingTime);
  const isPaused = useUnit($isPaused);
  const isRecording = useUnit($isRecording);
  const callDuration = useUnit($callDuration);

  // Используем хук для обновления длительности звонка
  useCallDuration();

  if (!listeningCall) return null;

  return (
      <div className="listening-card-wrapper">
        <div className="listening-card-container">
          <div className="listening-card-player">
            <div className="player-label">
              {isPaused ? 'Звонок на паузе' : 'Идет звонок'}
            </div>
            <div className="listening-card-content">
              <div className="timer-container">
                <Text className="current-time">{callDuration}</Text>
              </div>
              <div className="control-buttons-container">
                <ControlButtons />
              </div>
              {isRecording && (
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
