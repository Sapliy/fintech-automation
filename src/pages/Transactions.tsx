import { FileText } from 'lucide-react';

const Transactions = () => {
    return (
        <div className="p-8 w-full h-full overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500">View and manage processed transactions</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                <p>Transaction table coming soon...</p>
            </div>
        </div>
    );
};

export default Transactions;
