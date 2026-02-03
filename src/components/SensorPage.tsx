import React from 'react';
import SensorDetails from './SensorDetails';

const SensorPage: React.FC = () => {
  const mockSensor = {
    id: 'SENSOR-001',
    name: 'Temperature Sensor',
    type: 'DHT22',
    status: 'active',
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sensor Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SensorDetails
          sensorId={mockSensor.id}
          sensorName={mockSensor.name}
          sensorType={mockSensor.type}
          currentStatus={mockSensor.status}
        />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor Data</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Temperature</h3>
                <p className="text-2xl font-bold text-blue-600">23.5°C</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Humidity</h3>
                <p className="text-2xl font-bold text-green-600">45%</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Update</h3>
              <p className="text-gray-900">2023-04-08 14:30:45</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Battery Level</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">75% remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorPage; 