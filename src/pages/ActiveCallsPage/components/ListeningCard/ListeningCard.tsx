import React from 'react';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../model.ts';
import ControlButtons from './ControlButtons';
import './styles/listening-card.css';
import { $isPaused, $isRecording } from '../../model/listeningCall.ts';
import CallDurationDisplay from './CallDurationDisplay.tsx';
import RecordingTimeDisplay from './RecordingTimeDisplay.tsx';

const ListeningCard: React.FC = () => {
  const listeningCall = useUnit($listeningCall);
  const isPaused = useUnit($isPaused);
  const isRecording = useUnit($isRecording);

  if (!listeningCall) return null;

  return (
    <div className='listening-card-wrapper'>
      <div className='listening-card-container'>
        <div className='listening-card-player'>
          <div className='player-label'>
            {isPaused ? 'Звонок на паузе' : 'Идет звонок'}
          </div>
          <div className='listening-card-content'>
            <div className='timer-container'>
              <CallDurationDisplay />
            </div>
            <div className='control-buttons-container'>
              <ControlButtons />
            </div>
            {isRecording && (
              <div className='recording-time-container'>
                <RecordingTimeDisplay />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningCard;
