import { createDomain } from 'effector';
import { ModalComponent, ModalState } from './types.ts';

// Домен для модальных окон
const modalsDomain = createDomain('modals');

export const openModal = modalsDomain.createEvent<{
  key: string;
  params?: Record<string, any>;
}>();
export const closeModal = modalsDomain.createEvent<string>();
export const closeAllModals = modalsDomain.createEvent();

export const $modalsState = modalsDomain.createStore<
  Record<string, ModalState>
>({});

// Реестр модальных окон
export interface ModalRegistry {
  [key: string]: ModalComponent;
}

export const modalsRegistry: ModalRegistry = {};

export const registerModal = (key: string, component: ModalComponent): void => {
  modalsRegistry[key] = component;

  $modalsState.setState((state) => ({
    ...state,
    [key]: {
      isVisible: false,
      params: component.modalConfig?.defaultParams || {},
    },
  }));
};

$modalsState
  .on(openModal, (state, { key, params = {} }) => {
    if (!modalsRegistry[key]) {
      console.error(`Modal with key "${key}" is not registered`);
      return state;
    }

    return {
      ...state,
      [key]: {
        isVisible: true,
        params: {
          ...(state[key]?.params || {}),
          ...(modalsRegistry[key].modalConfig?.defaultParams || {}),
          ...params,
        },
      },
    };
  })
  .on(closeModal, (state, key) => {
    if (!state[key]) return state;

    return {
      ...state,
      [key]: {
        ...state[key],
        isVisible: false,
      },
    };
  })
  .reset(closeAllModals);

export const resetModals = modalsDomain.createEvent();
$modalsState.reset(resetModals);
