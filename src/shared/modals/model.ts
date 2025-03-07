import { createDomain } from 'effector';
import { ModalState } from './types.ts';
import React from 'react';

const modalsDomain = createDomain('modal');

export const openModal = modalsDomain.createEvent<{
  key: string;
  params?: Record<string, any>;
}>();
export const closeModal = modalsDomain.createEvent<string>();
export const closeAllModals = modalsDomain.createEvent();
export const registerModalEvent = modalsDomain.createEvent<{
  key: string;
  component: React.ComponentType<any>;
}>();

export const $modalsState = modalsDomain.createStore<ModalState>({
  isOpen: false,
  key: null,
  params: {},
});

export const $registeredModals = modalsDomain.createStore<
  Record<string, React.ComponentType<any>>
>({});

$registeredModals.on(registerModalEvent, (state, { key, component }) => {
  console.log(`Registering modal: ${key}`, component);
  console.log('Previous modals state:', Object.keys(state));

  return {
    ...state,
    [key]: component,
  };
});

export const registerModal = (
  key: string,
  component: React.ComponentType<any>
) => {
  console.log(`Calling registerModal: ${key}`);
  registerModalEvent({ key, component });
  return key; // Возвращаем ключ для проверки
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
