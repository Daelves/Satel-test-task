import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ModalProvider, registerAllModals } from './shared/modals';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('App.tsx: Registering modals');
    registerAllModals();
  }, []);

  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;
