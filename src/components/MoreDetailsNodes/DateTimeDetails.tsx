import { memo } from "react";
import { Clock, Calendar, Sun, Moon, Repeat } from "lucide-react";
import { type TDateTimeData } from "../../nodes/types";
import { nodeColors } from "../../utils/edgeStyles";

interface DateTimeDetailsProps {
  data: TDateTimeData;
  handleUpdate: (updatedData: Partial<TDateTimeData>) => void;
}

const DateTimeDetails = ({ data, handleUpdate }: DateTimeDetailsProps) => {
  const isDaytime = new Date().getHours() >= 6 && new Date().getHours() < 18;
  const dateTimeColor = nodeColors.dateTime;
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate({ time: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate({ date: e.target.value });
  };

  const handleRepeatToggle = () => {
    handleUpdate({ repeat: !data.repeat });
  };

  const handleDayToggle = (dayIndex: number) => {
    const currentDays = data.activeDays ?? [];
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter((day: number) => day !== dayIndex)
      : [...currentDays, dayIndex].sort((a, b) => a - b);
    handleUpdate({ activeDays: newDays });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Calendar className="w-6 h-6" style={{ color: dateTimeColor.from }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">DateTime Settings</h3>
          <p className="text-sm text-gray-500">Configure time and schedule</p>
        </div>
      </div>

      {/* Time Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time</span>
          </div>
          <input
            type="time"
            value={data.time}
            onChange={handleTimeChange}
            className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Date</span>
          </div>
          <input
            type="date"
            value={data.date}
            onChange={handleDateChange}
            className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Repeat Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Repeat</span>
          </div>
          <button
            onClick={handleRepeatToggle}
            className={`p-2 rounded-full transition-colors ${data.repeat ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Time of Day */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDaytime ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-700">Time of Day</span>
          </div>
          <span className="text-sm text-gray-600">{isDaytime ? "Day" : "Night"}</span>
        </div>
      </div>

      {/* Active Days */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Active Days</h4>
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayToggle(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${data.activeDays?.includes(index)
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${data.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            }`}>
            {data.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DateTimeDetails); 