'use client';

import { Package } from 'lucide-react';

export default function PackagesPage() {
    return (
        <div className="flex flex-col h-full w-full bg-gray-50 items-center justify-center p-8 text-center">
            <div className="bg-purple-100 p-6 rounded-full mb-6">
                <Package className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations & Packages</h1>
            <p className="text-gray-500 max-w-md">
                Install and manage integration packages for payment gateways, messaging services, and more.
            </p>
        </div>
    );
}
