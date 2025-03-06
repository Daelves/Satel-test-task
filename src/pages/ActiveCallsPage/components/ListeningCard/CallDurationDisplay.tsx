import React, { useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../model.ts';
import { formatTime } from '../../../../utils/formatters.ts';

const { Text } = Typography;

interface CallDurationProps {
  className?: string;
}

const CallDurationDisplay: React.FC<CallDurationProps> = React.memo(({ className = 'current-time' }) => {
    const [displayTime, setDisplayTime] = useState('00:00');
    const listeningCall = useUnit($listeningCall);
    const timerRef = useRef<number | null>(null);
    const lastRealTimeRef = useRef<string>('00:00');
    const lastUpdateTimeRef = useRef<number>(0);

    const calculateDuration = () => {
        if (!listeningCall) return '00:00';

        const callStartTime = new Date(listeningCall.callsStartTime).getTime();
        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - callStartTime;
        return formatTime(elapsedMilliseconds);
    };

    useEffect(() => {
        if (!listeningCall) return;

              const initialTime = calculateDuration();
        setDisplayTime(initialTime);
        lastRealTimeRef.current = initialTime;
        lastUpdateTimeRef.current = Date.now();

        const updateTime = () => {
            const now = Date.now();

            if (now - lastUpdateTimeRef.current >= 100) {
                const newTime = calculateDuration();

                if (newTime !== lastRealTimeRef.current) {
                    setDisplayTime(newTime);
                    lastRealTimeRef.current = newTime;
                }

                lastUpdateTimeRef.current = now;
            }

            timerRef.current = requestAnimationFrame(updateTime);
        };

        timerRef.current = requestAnimationFrame(updateTime);


        return () => {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [listeningCall]);

    if (!listeningCall) return null;

    return <Text className={className}>{displayTime}</Text>;
});

export default CallDurationDisplay;
