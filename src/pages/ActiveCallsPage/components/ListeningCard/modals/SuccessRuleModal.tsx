import React from 'react';
import { Button, Typography } from 'antd';
import { ModalFC } from '../../../../../shared/modals/types';
import { formatDateTime } from '../../../../../utils/formatters';

const { Text, Paragraph } = Typography;

interface SuccessRuleModalProps {
  onClose: () => void;
  phoneNumber: string;
}

const SuccessRuleModal: ModalFC<SuccessRuleModalProps> = ({
  onClose,
  phoneNumber,
}) => {
  const currentDateTime = formatDateTime(new Date().toISOString());

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Paragraph>
          <Text>
            Номер телефона {phoneNumber} добавлен в правила записи разговоров.
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>Запись разговоров будет вестись со следующего звонка</Text>
        </Paragraph>
      </div>

      <Button type='primary' onClick={onClose}>
        OK
      </Button>
    </div>
  );
};

SuccessRuleModal.modalConfig = {
  width: 500,
  maskClosable: false,
  closable: false,
};

export default SuccessRuleModal;
