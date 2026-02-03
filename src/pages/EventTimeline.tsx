import { Activity } from 'lucide-react';

const EventTimeline = () => {
    return (
        <div className="p-8 w-full h-full overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Timeline</h1>
                    <p className="text-gray-500">Real-time stream of fintech events</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                <p>Timeline visualization coming soon...</p>
            </div>
        </div>
    );
};

export default EventTimeline;
