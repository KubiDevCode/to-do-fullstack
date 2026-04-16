
import { Route, Routes } from 'react-router-dom';
import App from '../app/App';
import { AuthPage } from '../pages/AuthPage/AuthPage';
import { AllTasksPage } from '../pages/AllTasksPage/AllTasksPage';

interface AppRouterProps {
    className?: string;
}

export const AppRouter = ({ className }: AppRouterProps) => {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/tasks' element={<AllTasksPage />} />
        </Routes>
    )
};