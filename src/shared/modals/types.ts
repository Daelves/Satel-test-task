import React from 'react';

export interface ModalConfig {
  width?: number | string;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  closable?: boolean;
  title?: string;
  defaultParams?: Record<string, unknown>;
}

export interface ModalComponentType {
  modalConfig?: ModalConfig;
}

export interface ModalState {
  isOpen: boolean;
  key: string | null;
  params: Record<string, unknown>;
}

export type ModalFC<P = Record<string, unknown>> = React.FC<P> &
  ModalComponentType;
