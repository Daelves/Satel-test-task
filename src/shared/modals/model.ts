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
  console.log(`Registering modal: ${key}`, component);

  const previousState = $registeredModals.getState();
  console.log('Previous modals state:', Object.keys(previousState));

  const newState = {
    ...previousState,
    [key]: component,
  };

  $registeredModals.setState(newState);

  console.log('New modals state:', Object.keys($registeredModals.getState()));
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
