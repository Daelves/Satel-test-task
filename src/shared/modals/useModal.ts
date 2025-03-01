import { $modalsState, closeModal, openModal } from './model.ts';
import { useCallback } from 'react';
import { useUnit } from 'effector-react';

export interface UseModalResult {
  isOpen: boolean;
  open: (params?: Record<string, any>) => void;
  close: () => void;
  params: Record<string, any>;
}

/**
 * Хук для работы с модальными окнами
 * @param key Ключ модального окна
 */

export const useModal = (key: string): UseModalResult => {
  const modalState = useUnit($modalsState);

  const open = useCallback(
    (params?: Record<string, any>) => {
      openModal({ key, params });
    },
    [key]
  );

  const close = useCallback(() => {
    closeModal(key);
  }, [key]);

  const isOpen = modalState.isOpen && modalState.key === key;
  const params = isOpen ? modalState.params || {} : {};

  return {
    isOpen,
    open,
    close,
    params,
  };
};

export default useModal;
