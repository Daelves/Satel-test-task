import React, { ReactNode, useEffect } from 'react';

import ModalsContainer from './ModalsContainer.tsx';
import {registerModalComponents} from "../../modalRegistration.ts";
import {registerAllModals} from "./registerModals.ts";



interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  useEffect(() => {
    console.log('ModalProvider: registering modals');
    registerAllModals();
    // Дополнительно явно регистрируем модальные окна
    registerModalComponents();
  }, []);

  return (
    <>
      {children}
      <ModalsContainer />
    </>
  );
};

export default ModalProvider;
