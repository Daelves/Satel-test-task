import React from 'react';

export interface ModalConfig {
  width?: number | string;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  defaultParams?: Record<string, any>;
  closable?: boolean;
  title?: string;
}

export interface ModalComponent extends React.FC<any> {
  modalConfig?: ModalConfig;
}

export interface ModalState {
  isVisible: boolean;
  params: Record<string, any>;
}
