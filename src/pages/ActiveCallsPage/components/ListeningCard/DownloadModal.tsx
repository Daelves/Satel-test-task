// src/pages/ActiveCallsPage/components/ListeningCard/DownloadModal.tsx
import React from 'react';
import { Modal, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useUnit } from 'effector-react';
import {
    $downloadModalVisible,
    closeDownloadModal,
    $downloadProgress
} from '../../model/listening-card';
import { useDownloadSimulation } from '../../hooks/useListeningCardHooks';

const DownloadModal: React.FC = () => {
    const visible = useUnit($downloadModalVisible);
    const progress = useUnit($downloadProgress);

    // Используем кастомный хук для симуляции загрузки
    useDownloadSimulation();

    const handleClose = () => {
        closeDownloadModal();
    };

    return (
        <Modal
            title="Загрузка записи звонка"
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button
                    key="download"
                    type="primary"
                    icon={<DownloadOutlined />}
                    disabled={progress < 100}
                    onClick={handleClose}
                >
                    Скачать запись
                </Button>
            ]}
        >
            <div style={{ margin: '20px 0' }}>
                <div style={{ marginBottom: 10 }}>
                    Подготовка записи звонка: {progress}%
                </div>
                <div
                    style={{
                        height: 10,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 5,
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#1890ff',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default DownloadModal;