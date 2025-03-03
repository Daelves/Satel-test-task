import React from 'react';
import { Space, Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningTime, $recordingTime } from '../../model/listeningСard.ts';
import { $listeningCall } from '../../model.ts';

const { Text } = Typography;

const TimerDisplay: React.FC = () => {
  const listeningCall = useUnit($listeningCall);
  const listeningTime = useUnit($listeningTime);
  const recordingTime = useUnit($recordingTime);

  return (
    <div className='timer-display'>
      <Text className='current-time'>18:36</Text>

      {listeningCall?.isRecording && (
        <div className='recording-time-container'>
          <Text className='recording-time'>00:22</Text>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
