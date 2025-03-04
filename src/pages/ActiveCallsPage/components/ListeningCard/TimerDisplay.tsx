import React from 'react';
import { Space, Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningTime, $recordingTime } from '../../model/listeningСard.ts';
import { $listeningCall } from '../../model.ts';

const { Text } = Typography;

const TimerDisplay: React.FC = () => {
  const recordingTime = useUnit($recordingTime);

  return (
    <div className='recording-time-container'>
      <Text className='recording-time'>{recordingTime}</Text>
    </div>
  );
};

export default TimerDisplay;
