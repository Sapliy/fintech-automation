'use client';

import { FileText, Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import ledgerService from '@/services/ledgerService';

export default function TransactionsPage() {
    const { zone } = useAuthStore();
    const [filter, setFilter] = useState('');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!zone) return;
            setLoading(true);
            try {
                const data = await ledgerService.listEntries(zone.id, 50);
                if (Array.isArray(data)) {
                    setTransactions(data.map((tx: any) => ({
                        id: tx.id,
                        amount: tx.amount,
                        currency: tx.currency || 'USD',
                        status: 'completed',
                        type: tx.type || 'ledger',
                        customer: tx.account_id || 'N/A',
                        date: tx.created_at
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [zone]);

    const filteredTransactions = transactions.filter(t =>
        t.id.toLowerCase().includes(filter.toLowerCase()) ||
        t.customer.toLowerCase().includes(filter.toLowerCase()) ||
        t.status.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                        <p className="text-sm text-gray-500">Manage and monitor financial transactions</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {tx.type === 'payment' ?
                                                    <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> :
                                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                                }
                                                <span className="text-sm font-medium text-gray-700 capitalize">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount / 100)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">{tx.customer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
