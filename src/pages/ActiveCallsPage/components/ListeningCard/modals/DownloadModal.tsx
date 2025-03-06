import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { ModalComponentType } from '../../../../../shared/modals';
import { useUnit } from 'effector-react';
import {$downloadProgress, closeDownloadModal} from '../../../model/listeningCall.ts';
import {ModalFC} from "../../../../../shared/modals/types.ts";

interface DownloadModalProps {
  onClose: () => void;
  callId?: string;
}

const DownloadModal: ModalFC<DownloadModalProps> & { modalConfig: any } = ({ onClose, callId }) => {
    const progress = useUnit($downloadProgress);

    const handleDownload = () => {
        console.log('Downloading call recording for call ID:', callId);
        onClose();
    };

    const handleClose = () => {
        closeDownloadModal();
        onClose();
    };

    return (
        <div>
            <div style={{ margin: '20px 0' }}>
                <div style={{ marginBottom: 10 }}>
                    Подготовка записи звонка: {progress}%
                </div>
                <div
                    style={{
                        height: 10,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#1890ff',
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>

            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                }}
            >
                <Button onClick={handleClose} variant="solid" color="danger">
                    Закрыть
                </Button>

                <Button
                    type='primary'
                    icon={<DownloadOutlined />}
                    disabled={progress < 100}
                    onClick={handleDownload}
                >
                    Скачать запись
                </Button>
            </div>
        </div>
    );
};

DownloadModal.modalConfig = {
    width: 500,
    title: 'Загрузка записи звонка',
    maskClosable: false,
    closable: false,
};

export default DownloadModal;
