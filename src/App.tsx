import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ModalsContainer from "./shared/modals/ModalsContainer.tsx";
import {useEffect} from "react";
import {registerAllModals} from "./shared/modals/registerModals.ts";

function App() {
  useEffect(() => {
    registerAllModals();
  }, []);

  return <>
    <RouterProvider router={router} />;
    <ModalsContainer />
  </>
}

export default App;
