import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ModalProvider } from './shared/modals';

function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;
