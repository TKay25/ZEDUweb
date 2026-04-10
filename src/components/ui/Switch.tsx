import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`} />
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? 'transform translate-x-6' : ''
        }`} />
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
};

export default Switch;