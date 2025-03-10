import React from 'react';
import { Button, Space, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { closeDownloadModal } from '../../../model/listeningCall.ts';
import { ModalFC } from '../../../../../shared/modals/types.ts';
import { formatDateTime } from '../../../../../utils/formatters.ts';
import Title from 'antd/es/typography/Title';

interface DownloadModalProps {
  onClose: () => void;
  callId?: string;
  startTime?: string;
  participants?: string[];
  recordingDuration?: string;
}

const { Text } = Typography;

const DownloadModal: ModalFC<DownloadModalProps> = ({
  onClose,
  callId,
  startTime,
  participants,
  recordingDuration,
}) => {
  const handleDownload = () => {
    console.log('Downloading call recording for call ID:', callId);
    onClose();
  };

  const handleClose = () => {
    closeDownloadModal();
    onClose();
  };

  const formattedStartTime = startTime ? formatDateTime(startTime) : '';

  console.log('DownloadModal параметры:', {
    callId,
    startTime,
    participants,
    recordingDuration,
  });

  return (
    <div style={{ textAlign: 'center', position: 'relative', padding: '20px' }}>
      <Title level={5} style={{ marginBottom: 30, fontWeight: 'normal' }}>
        Запись прослушиваемого звонка завершена
      </Title>
      <div style={{ margin: '20px 0' }}>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text>ID звонка:</Text>
            <Text strong>{callId}</Text>
          </Space>

          <Space
            style={{
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <Text>Время начала:</Text>
            <Text strong>{formattedStartTime}</Text>
          </Space>

          <Space
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginTop: 8,
            }}
          >
            <Text>Участники:</Text>
            <div style={{ paddingLeft: 24 }}>
              {participants.map((participant, index) => (
                <div key={index} style={{ textAlign: 'right' }}>
                  <Text strong>{participant}</Text>
                </div>
              ))}
            </div>
          </Space>

          <Space
            style={{
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <Text>Длительность записи:</Text>
            <Text strong>{recordingDuration}</Text>
          </Space>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <Button onClick={handleClose} variant='solid' color='danger'>
          Закрыть
        </Button>

        <Button
          type='primary'
          icon={<DownloadOutlined />}
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
