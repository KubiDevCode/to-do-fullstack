
import { Provider } from 'react-redux';
import { store } from './store';
import type { ReactNode } from 'react';

interface StoreProciderProps {
    className?: string;
    children: ReactNode
}

export const StoreProcider = ({ children }: StoreProciderProps) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};