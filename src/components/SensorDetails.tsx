import React from 'react';
import { Thermometer, ShieldCheck, Tag } from 'lucide-react';

interface SensorDetailsProps {
    sensorId: string;
    sensorName: string;
    sensorType: string;
    currentStatus: string;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({
    sensorId,
    sensorName,
    sensorType,
    currentStatus,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Thermometer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{sensorName}</h2>
                    <p className="text-sm text-gray-500">ID: {sensorId}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Type</span>
                    </div>
                    <span className="font-medium text-gray-800">{sensorType}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {currentStatus.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SensorDetails;
