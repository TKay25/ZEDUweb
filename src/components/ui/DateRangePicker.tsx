import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg flex items-center justify-between"
      >
        <span className="text-gray-700">
          {value.startDate && value.endDate
            ? `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`
            : 'Select date range'}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={value.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  onChange({ ...value, startDate: date });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={value.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  onChange({ ...value, endDate: date });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Apply the range
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;