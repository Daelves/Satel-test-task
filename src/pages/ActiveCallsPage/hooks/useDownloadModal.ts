
import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { $downloadModalVisible, $listeningCallState } from '../model/listeningCall';
import useModal from '../../../shared/modals/useModal';

export const useDownloadModal = () => {
    const isVisible = useUnit($downloadModalVisible);
    const listeningCallState = useUnit($listeningCallState);
    const { open: openDownloadModal, close: closeDownloadModal } = useModal('download');

    useEffect(() => {
        if (isVisible && listeningCallState.isDownloadModalVisible) {
            openDownloadModal({ callId: listeningCallState.currentCallId });
        }
    }, [isVisible, listeningCallState.isDownloadModalVisible]);

    return { isVisible };
};