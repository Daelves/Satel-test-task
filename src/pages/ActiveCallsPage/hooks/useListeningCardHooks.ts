import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
    $downloadModalVisible,
    $isPaused,
    $listeningStartTime,
    $recordingStartTime, closeDownloadModal, updateDownloadProgress,
    updateListeningTimer,
    updateRecordingTimer
} from "../model/listening-card.ts";


/**
 * Хук для управления таймером прослушивания
 */
export const useListeningTimer = () => {
    const isPaused = useUnit($isPaused);
    const startTime = useUnit($listeningStartTime);

    useEffect(() => {
        if (!startTime || isPaused) return;

        const interval = setInterval(() => {
            updateListeningTimer(startTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, startTime]);
};

/**
 * Хук для управления таймером записи
 */
export const useRecordingTimer = () => {
    const startTime = useUnit($recordingStartTime);

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            updateRecordingTimer(startTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);
};

/**
 * Хук для симуляции загрузки записи
 */
export const useDownloadSimulation = () => {
    const isDownloadModalVisible = useUnit($downloadModalVisible);

    useEffect(() => {
        if (!isDownloadModalVisible) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            updateDownloadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    closeDownloadModal();
                }, 500);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [isDownloadModalVisible]);
};

/**
 * Хук для инициализации стартового времени прослушивания
 */
export const useInitializeListeningTime = (callId: string | null) => {
    useEffect(() => {
        if (callId) {
            // Устанавливаем время начала прослушивания при первом рендере
            updateListeningTimer(Date.now());
        }
    }, [callId]);
};