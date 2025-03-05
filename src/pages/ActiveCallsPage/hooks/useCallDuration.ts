import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../model';

import { formatTime } from '../../../utils/formatters';
import { updateTime } from '../model/listeningCall.ts';

export const useCallDuration = () => {
  const listeningCall = useUnit($listeningCall);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const calculateDuration = () => {
      if (!listeningCall) return;

      const callStartTime = new Date(listeningCall.callsStartTime).getTime();
      const currentTime = Date.now();
      const elapsedMilliseconds = currentTime - callStartTime;
      const formattedDuration = formatTime(elapsedMilliseconds);

      updateTime({ callDuration: formattedDuration });
    };

    if (listeningCall) {
      calculateDuration();
      timerRef.current = window.setInterval(calculateDuration, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [listeningCall]);
};

export default useCallDuration;
