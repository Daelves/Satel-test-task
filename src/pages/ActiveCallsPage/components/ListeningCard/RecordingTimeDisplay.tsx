import React, { useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $isRecording } from '../../model/listeningCall.ts';
import { formatTime } from '../../../../utils/formatters.ts';
import './styles/timer-animation.css';

const { Text } = Typography;

interface RecordingTimeDisplayProps {
  className?: string;
}

const RecordingTimeDisplay: React.FC<RecordingTimeDisplayProps> = React.memo(
  ({ className = 'recording-time' }) => {
    const [recordingTime, setRecordingTime] = useState('00:00');
    const isRecording = useUnit($isRecording);
    const recordingStartTimeRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);
    const rafIdRef = useRef<number | null>(null);
    const lastTimeRef = useRef<string>('00:00');

    useEffect(() => {
      if (!isRecording) {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        if (lastTimeRef.current !== '00:00') {
          setRecordingTime('00:00');
          lastTimeRef.current = '00:00';
        }

        recordingStartTimeRef.current = null;
        return;
      }

      recordingStartTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();

      const updateRecordingTime = () => {
        const now = Date.now();

        if (
          now - lastUpdateTimeRef.current >= 200 &&
          recordingStartTimeRef.current
        ) {
          const elapsed = now - recordingStartTimeRef.current;
          const formattedTime = formatTime(elapsed);

          // Обновляем состояние только если время изменилось
          if (formattedTime !== lastTimeRef.current) {
            setRecordingTime(formattedTime);
            lastTimeRef.current = formattedTime;
          }

          lastUpdateTimeRef.current = now;
        }

        rafIdRef.current = requestAnimationFrame(updateRecordingTime);
      };

      rafIdRef.current = requestAnimationFrame(updateRecordingTime);

      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [isRecording]);

    if (!isRecording) return null;

    return <Text className={className}>{recordingTime}</Text>;
  }
);

export default RecordingTimeDisplay;
