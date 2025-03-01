import { createDomain } from 'effector';
import { ModalState } from './types.ts';
import React from 'react';

// Домен для модальных окон
const modalsDomain = createDomain('modal');

export const openModal = modalsDomain.createEvent<{
  key: string;
  params?: Record<string, any>;
}>();
export const closeModal = modalsDomain.createEvent<string>();
export const closeAllModals = modalsDomain.createEvent();

export const $modalsState = modalsDomain.createStore<ModalState>({
  isOpen: false,
  key: null,
  params: {},
});

export const $registeredModals = modalsDomain.createStore<
  Record<string, React.ComponentType<any>>
>({});

export const registerModal = (
  key: string,
  component: React.ComponentType<any>
) => {
  $registeredModals.setState((state) => ({
    ...state,
    [key]: component,
  }));
};

$modalsState
  .on(openModal, (_, { key, params }) => ({
    isOpen: true,
    key,
    params: params || {},
  }))
  .on(closeModal, (state, closedKey) =>
    state.key === closedKey ? { isOpen: false, key: null, params: {} } : state
  )
  .on(closeAllModals, () => ({
    isOpen: false,
    key: null,
    params: {},
  }));
