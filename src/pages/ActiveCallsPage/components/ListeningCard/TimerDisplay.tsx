import React from 'react';
import { Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $recordingTime } from '../../model/listeningCall.ts';

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
