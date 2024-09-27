import React, { useState } from 'react';

interface RadioToggleProps {
  leftLabel: string;
  rightLabel: string;
  onChange?: (selectedOption: string) => void;
}

const RadioToggle: React.FC<RadioToggleProps> = ({ leftLabel, rightLabel, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(leftLabel);

  const handleChange = (label: string) => {
    setSelectedOption(label);
    if (onChange) {
      onChange(label);
    }
  };

  return (
    <div className="inline-flex items-center rounded-full p-1">
      {[leftLabel, rightLabel].map((label) => (
        <div key={label} className="relative">
          <input
            type="radio"
            id={label}
            name="radio-toggle"
            value={label}
            checked={selectedOption === label}
            onChange={() => handleChange(label)}
            className="sr-only"
          />
          <label
            htmlFor={label}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-full cursor-pointer ${
              selectedOption === label
                ? 'text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <span className="relative flex items-center">
              <div
                className={`w-4 h-4 mr-2 rounded-full border-2 ${
                  selectedOption === label ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}
              />
              {label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioToggle;