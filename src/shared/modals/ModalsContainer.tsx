import React from 'react';
import { useUnit } from 'effector-react';
import { Modal } from 'antd';
import { $modalsState, modalsRegistry, closeModal } from './model';
import { ModalConfig } from './types';

const ModalsContainer: React.FC = () => {
  const modalsState = useUnit($modalsState);

  return (
    <>
      {Object.entries(modalsState).map(([key, { isVisible, params }]) => {
        if (!modalsRegistry[key]) return null;

        const ModalComponent = modalsRegistry[key];
        const config: ModalConfig = ModalComponent.modalConfig || {};

        return (
          <Modal
            key={key}
            open={isVisible}
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
            <ModalComponent {...params} onClose={() => closeModal(key)} />
          </Modal>
        );
      })}
    </>
  );
};

export default ModalsContainer;
