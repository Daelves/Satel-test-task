import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ModalProvider } from './shared/modals';
import {useEffect} from "react";
import {registerModalComponents} from "./modalRegistration.ts";


function App() {
    useEffect(() => {
        registerModalComponents();
    }, []);

    return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;
