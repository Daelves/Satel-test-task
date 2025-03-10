import React from 'react';
import { Button, Space, Typography } from 'antd';
import { ModalFC } from '../../../../../shared/modals/types.ts';
import { navigationCancelled } from '../../../model/navigationWarning.ts';

const { Text, Title, Paragraph } = Typography;

interface NavigationWarningModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isRecording: boolean;
  targetPath?: string;
}

const NavigationWarningModal: ModalFC<NavigationWarningModalProps> = ({
  onClose,
  onConfirm,
  isRecording,
  targetPath,
}) => {
  const handleConfirm = () => {
    console.log(`Подтверждение перехода на страницу: ${targetPath}`);
    onConfirm();
  };

  const handleCancel = () => {
    console.log('Navigation cancelled in modal');
    navigationCancelled();
    onClose();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Title level={5} style={{ marginBottom: 20 }}>
        Вы точно хотите покинуть эту страницу?
      </Title>

      <Paragraph>
        Прослушивание звонка будет завершено
        {isRecording && (
          <Text>
            {
              ', но запись звонка продолжится до его окончания и будет доступна для скачивания в журнале звонков'
            }
          </Text>
        )}
      </Paragraph>

      <Space style={{ marginTop: 20 }}>
        <Button onClick={handleCancel}>Отменить</Button>
        <Button type='primary' onClick={handleConfirm}>
          Покинуть
        </Button>
      </Space>
    </div>
  );
};

NavigationWarningModal.modalConfig = {
  width: 500,
  maskClosable: false,
  closable: false,
};

export default NavigationWarningModal;
