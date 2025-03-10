import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { Alert, Button, Space, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import {
  $isBackgroundRecording,
  $backgroundRecordingCallId,
  $recordingTime,
  stopRecordingFx,
} from '../model/listeningCall';
import { $calls } from '../model';
import './styles/background-recording.css';

const { Text } = Typography;

const BackgroundRecordingIndicator: React.FC = () => {
  const isBackgroundRecording = useUnit($isBackgroundRecording);
  const backgroundRecordingCallId = useUnit($backgroundRecordingCallId);
  const recordingTime = useUnit($recordingTime);
  const calls = useUnit($calls);
  const [callDetails, setCallDetails] = useState<{ appealsId: string } | null>(
    null
  );

  useEffect(() => {
    if (isBackgroundRecording && backgroundRecordingCallId) {
      const call = calls.find((call) => call.id === backgroundRecordingCallId);
      if (call) {
        setCallDetails({
          appealsId: call.appealsId,
        });
      }
    } else {
      setCallDetails(null);
    }
  }, [isBackgroundRecording, backgroundRecordingCallId, calls]);

  const handleStopRecording = () => {
    if (backgroundRecordingCallId) {
      stopRecordingFx(backgroundRecordingCallId);
    }
  };

  if (!isBackgroundRecording || !callDetails) {
    return null;
  }

  return (
    <Alert
      type='info'
      showIcon
      icon={<AudioOutlined className='background-recording-icon' />}
      message={
        <Space align='center'>
          <Text strong>Запись звонка продолжается в фоновом режиме</Text>
          <Text>ID: {callDetails.appealsId}</Text>
          <Text className='background-recording-timer'>
            Время записи: {recordingTime}
          </Text>
          <Button size='small' danger onClick={handleStopRecording}>
            Остановить запись
          </Button>
        </Space>
      }
      className='background-recording-alert'
      closable={false}
    />
  );
};

export default BackgroundRecordingIndicator;
