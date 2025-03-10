import { useEffect } from 'react';
import { useUnit } from 'effector-react';

import { $listeningCall } from '../model.ts';

import {
  $downloadModalVisible,
  updateDownloadProgress,
} from '../model/listeningCall.ts';
import { useModal } from '../../../shared/modals';

/**
 * Хук для симуляции загрузки записи
 */
export const useDownloadSimulation = () => {
  const isDownloadModalVisible = useUnit($downloadModalVisible);
  const { open: openDownloadModal } = useModal('download');
  const listeningCall = useUnit($listeningCall);

  useEffect(() => {
    if (isDownloadModalVisible && listeningCall) {
      openDownloadModal({ callId: listeningCall.id });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        updateDownloadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {}, 500);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isDownloadModalVisible, listeningCall]);
};
