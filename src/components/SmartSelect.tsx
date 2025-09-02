import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SmartSelectProps {
  label: string;
  options: Option[];
}

const SmartSelect: React.FC<SmartSelectProps> = ({ label, options }) => {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded p-2 focus:outline-none focus:ring"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {value && <p className="text-sm text-gray-600">Selected: {value}</p>}
    </div>
  );
};

export default SmartSelect;