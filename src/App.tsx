import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ModalsContainer from './shared/modals/ModalsContainer.tsx';
import { useEffect } from 'react';
import { registerAllModals } from './shared/modals/registerModals.ts';
import { ModalProvider } from './shared/modals';

function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;
