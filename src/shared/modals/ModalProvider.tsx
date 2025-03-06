import React, { ReactNode } from 'react';
import ModalsContainer from './ModalsContainer.tsx';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ModalsContainer />
    </>
  );
};

export default ModalProvider;
