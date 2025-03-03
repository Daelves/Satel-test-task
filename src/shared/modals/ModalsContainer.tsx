import React from 'react';
import { useUnit } from 'effector-react';
import { Modal } from 'antd';
import { $modalsState, $registeredModals, closeModal } from './model';
import { ModalConfig } from './types';

const ModalsContainer: React.FC = () => {
  const modalState = useUnit($modalsState);
  const registeredModals = useUnit($registeredModals);

  if (!modalState.isOpen || !modalState.key) {
    return null;
  }

  const key = modalState.key;
  const ModalComponent = registeredModals[key];

  if (!ModalComponent) {
    return null;
  }

  const config: ModalConfig = (ModalComponent as any).modalConfig || {};

  return (
    <Modal
      key={key}
      open={modalState.isOpen}
      onCancel={() => closeModal(key)}
      width={config.width}
      maskClosable={
        config.maskClosable !== undefined ? config.maskClosable : true
      }
      destroyOnClose={
        config.destroyOnClose !== undefined ? config.destroyOnClose : true
      }
      closable={config.closable !== undefined ? config.closable : true}
      title={config.title}
      footer={null}
    >
      <ModalComponent {...modalState.params} onClose={() => closeModal(key)} />
    </Modal>
  );
};

export default ModalsContainer;
