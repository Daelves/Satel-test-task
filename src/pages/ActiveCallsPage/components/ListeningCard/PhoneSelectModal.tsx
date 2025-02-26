// src/pages/ActiveCallsPage/components/ListeningCard/PhoneSelectModal.tsx
import React from 'react';
import { Modal, Button, List } from 'antd';
import { useUnit } from 'effector-react';
import {
    $phoneSelectModalVisible,
    closePhoneSelectModal,
    openRuleModal,
    $listeningCall
} from '../../model/listening-card';

const PhoneSelectModal: React.FC = () => {
    const visible = useUnit($phoneSelectModalVisible);
    const listeningCall = useUnit($listeningCall);

    const handleCancel = () => {
        closePhoneSelectModal();
    };

    const handlePhoneSelect = (phone: string) => {
        openRuleModal(phone);
    };

    return (
        <Modal
            title="Выберите номер участника"
    open={visible}
    onCancel={handleCancel}
    footer={null}
    >
    <List
        dataSource={listeningCall?.phoneNumbers || []}
    renderItem={(phone) => (
        <List.Item>
            <Button
                type="link"
    onClick={() => handlePhoneSelect(phone)}
    style={{ width: '100%', textAlign: 'left' }}
>
    {phone}
    </Button>
    </List.Item>
)}
    />
    </Modal>
);
};

export default PhoneSelectModal;