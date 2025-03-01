import React, { ReactNode, useEffect } from 'react';
import { registerAllModals } from './registerModals.ts';
import ModalsContainer from './ModalsContainer.tsx';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  useEffect(() => {
    registerAllModals();
  }, []);

  return (
    <>
      {children}
      <ModalsContainer />
    </>
  );
};

export default ModalProvider;
