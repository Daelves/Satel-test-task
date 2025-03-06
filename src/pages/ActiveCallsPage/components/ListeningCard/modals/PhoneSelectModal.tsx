import React from 'react';
import { Button, List } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../../model';
import useModal from '../../../../../shared/modals/useModal.ts';
import { ModalFC } from '../../../../../shared/modals/types.ts';

interface PhoneSelectModalProps {
  onClose: () => void;
  onSelectPhone: (phone: string) => void;
}

const PhoneSelectModal: ModalFC<PhoneSelectModalProps> = ({
  onClose,
  onSelectPhone,
}) => {
  const listeningCall = useUnit($listeningCall);
  const { open: openRuleModal } = useModal('rule');

  const handlePhoneSelect = (phone: string) => {
    onSelectPhone(phone);
    openRuleModal({ phoneNumber: phone });
    onClose();
  };

  return (
    <List
      dataSource={listeningCall?.phoneNumbers || []}
      renderItem={(phone) => (
        <List.Item>
          <Button
            type='link'
            onClick={() => handlePhoneSelect(phone)}
            style={{ width: '100%', textAlign: 'left' }}
          >
            {phone}
          </Button>
        </List.Item>
      )}
    />
  );
};

PhoneSelectModal.modalConfig = {
  width: 500,
  title: 'Выберите номер участника',
  maskClosable: true,
  destroyOnClose: true,
};

export default PhoneSelectModal;
