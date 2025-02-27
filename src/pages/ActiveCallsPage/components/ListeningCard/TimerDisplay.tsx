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
    <Space style={{ width: '100%', justifyContent: 'center' }}>
      <div>
        <Text>Длительность прослушивания: </Text>
        <Text strong>{listeningTime}</Text>
      </div>

      {listeningCall?.isRecording && (
        <div>
          <Text>Длительность записи: </Text>
          <Text strong>{recordingTime}</Text>
        </div>
      )}
    </Space>
  );
};

export default TimerDisplay;
