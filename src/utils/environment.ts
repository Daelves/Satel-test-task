export const isDevelopment = (): boolean => {

    if (typeof import.meta !== 'undefined' && import.meta.env) {
        if (import.meta.env.DEV) return true;
        if (import.meta.env.MODE === 'development') return true;
    }

    // Определяем по URL (для локальной разработки)
    if (window && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    )) {
        return true;
    }
    return false;
};


// Расширяем Window интерфейс для TypeScript
declare global {
    interface Window {
        ENV?: {
            environment?: string;
            [key: string]: any;
        };
    }
}