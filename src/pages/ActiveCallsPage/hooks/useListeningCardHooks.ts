import { useEffect, useRef } from 'react';
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

  // Отслеживаем изменение состояния модального окна
  useEffect(() => {
    if (isDownloadModalVisible && listeningCall) {
      // Явно открываем модальное окно, если оно должно быть видимым
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
