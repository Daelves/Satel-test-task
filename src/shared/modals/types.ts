import React from 'react';

export interface ModalConfig {
  width?: number | string;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  closable?: boolean;
  title?: string;
}

export interface ModalComponentType {
  modalConfig?: ModalConfig;
}

export interface ModalState {
  isOpen: boolean;
  key: string | null;
  params: Record<string, any>;
}
