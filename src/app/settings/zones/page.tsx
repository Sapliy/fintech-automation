'use client';

import React, { useState } from 'react';
import { Plus, Shield, Zap, Trash2, ExternalLink } from 'lucide-react';
import { useAuthStore, Zone } from '@/store/auth.store';

const ZonesPage = () => {
    const { zones, setZones, organization } = useAuthStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newMode, setNewMode] = useState<'test' | 'live'>('test');

    const handleCreateZone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;

        const newZone: Zone = {
            id: `zone_${Math.random().toString(36).substr(2, 9)}`,
            name: newName,
            org_id: organization.id,
            mode: newMode,
        };

        setZones([...zones, newZone]);
        setNewName('');
        setIsCreating(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Zones</h1>
                    <p className="text-gray-500">Manage your isolated automation environments.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Zone
                </button>
            </div>

            {isCreating && (
                <div className="mb-8 p-6 bg-white border border-blue-100 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">New Zone</h2>
                    <form onSubmit={handleCreateZone} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Staging, Production"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setNewMode('test')}
                                    className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all ${newMode === 'test'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                        }`}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Test (Sandbox)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewMode('live')}
                                    className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all ${newMode === 'live'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                        }`}
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Live (Production)
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {zones.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Plus className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-500">No zones created yet.</p>
                    </div>
                ) : (
                    zones.map((z) => (
                        <div key={z.id} className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${z.mode === 'live' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {z.mode === 'live' ? <Zap className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h3 className="font-bold text-gray-900 mr-2">{z.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${z.mode === 'live' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {z.mode}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{z.id}</p>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-12 p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Advanced Zone Scoping</h3>
                    <p className="text-blue-100 text-sm max-w-lg mb-6">
                        Each zone generates its own set of API keys. Events and Flows are strictly isolated within their respective zones.
                    </p>
                    <button className="px-5 py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                        Read Documentation
                    </button>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400 rounded-full opacity-30 blur-2xl"></div>
            </div>
        </div>
    );
};

export default ZonesPage;
