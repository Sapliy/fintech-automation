'use client';

import { Toaster } from 'sonner';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            richColors
            closeButton
            theme="light"
            toastOptions={{
                style: {
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                },
            }}
        />
    );
}
