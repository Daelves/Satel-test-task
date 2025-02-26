import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ActiveCallsPage from '../pages/ActiveCallsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: ActiveCallsPage
            }
        ]
    }
]);