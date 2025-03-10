import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ActiveCallsPage from '../pages/ActiveCallsPage';
import PlugPage from '../pages/Plug/PlugPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: ActiveCallsPage,
      },
      {
        path: 'userRequests',
        Component: PlugPage,
      },
      {
        path: 'employeeSessions',
        Component: PlugPage,
      },
      {
        path: 'securityEvents',
        Component: PlugPage,
      },
      {
        path: 'settings',
        Component: PlugPage,
      },
    ],
  },
]);
