import React, { useEffect, useRef, useState } from 'react';
import { useUnit } from 'effector-react';
import { Button, Card, Typography } from 'antd';
import { AudioOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import {
  $isBackgroundRecording,
  $backgroundRecordingCallId,
  stopRecordingFx,
  $listeningCallState,
} from '../model/listeningCall';
import { $calls } from '../model';
import './styles/background-recording.css';
import { formatTime } from '../../../utils/formatters.ts';

const { Text } = Typography;

const BackgroundRecordingTimer: React.FC<{ recordingStartTime: number }> =
  React.memo(({ recordingStartTime }) => {
    const [timeDisplay, setTimeDisplay] = useState('00:00');
    const rafIdRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);

    useEffect(() => {
      const updateTimer = () => {
        const now = Date.now();

        if (now - lastUpdateTimeRef.current >= 200) {
          const elapsed = now - recordingStartTime;
          const formattedTime = formatTime(elapsed);
          setTimeDisplay(formattedTime);
          lastUpdateTimeRef.current = now;
        }

        rafIdRef.current = requestAnimationFrame(updateTimer);
      };

      rafIdRef.current = requestAnimationFrame(updateTimer);

      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [recordingStartTime]);

    return <Text>{timeDisplay}</Text>;
  });

const BackgroundRecordingIndicator: React.FC = () => {
  const isBackgroundRecording = useUnit($isBackgroundRecording);
  const backgroundRecordingCallId = useUnit($backgroundRecordingCallId);
  const listeningCallState = useUnit($listeningCallState);
  const calls = useUnit($calls);
  const [callDetails, setCallDetails] = useState<{
    appealsId: string;
    recordingStartTime: number;
  } | null>(null);

  useEffect(() => {
    if (isBackgroundRecording && backgroundRecordingCallId) {
      const call = calls.find((call) => call.id === backgroundRecordingCallId);
      if (call) {
        // Берем время начала записи из состояния, если оно есть
        const recordingStartTime =
          listeningCallState.recordingStartTime || Date.now();

        console.log(
          'Время начала записи:',
          new Date(recordingStartTime).toISOString()
        );

        setCallDetails({
          appealsId: call.appealsId,
          recordingStartTime: recordingStartTime,
        });
      }
    } else {
      setCallDetails(null);
    }
  }, [
    isBackgroundRecording,
    backgroundRecordingCallId,
    calls,
    listeningCallState,
  ]);

  const handleStopRecording = () => {
    if (backgroundRecordingCallId) {
      stopRecordingFx(backgroundRecordingCallId);
    }
  };

  if (!isBackgroundRecording || !callDetails) {
    return null;
  }

  return (
    <div className='background-recording-container'>
      <Card
        className='background-recording-card'
        bordered={false}
        bodyStyle={{ padding: 8 }}
      >
        <div className='background-recording-header'>
          <CloseOutlined className='close-icon' onClick={handleStopRecording} />
        </div>
        <div className='background-recording-content'>
          <AudioOutlined className='recording-icon' />
          <div className='recording-text'>
            <Text>Запись фоновом режиме</Text>
            <div className='recording-details'>
              <Text>ID: {callDetails.appealsId}</Text>
              <span className='recording-dot'></span>
              <BackgroundRecordingTimer
                recordingStartTime={callDetails.recordingStartTime}
              />
            </div>
          </div>
          <Button
            danger
            type='primary'
            icon={<StopOutlined />}
            onClick={handleStopRecording}
            className='stop-button-icon-only'
          />
        </div>
      </Card>
    </div>
  );
};

export default BackgroundRecordingIndicator;
