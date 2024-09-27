import React from 'react';

interface PercentageSwitchProps {
  selected: string;
  onSelect: (value: string) => void;
  options: string[]; // New prop for dynamic options
  className?: string; // Optional className prop for styling flexibility
}

const PercentageSwitch: React.FC<PercentageSwitchProps> = ({ selected, onSelect, options, className }) => {
  return (
    <div className={`${className} flex h-[34px] rounded-full bg-gray-100 overflow-hidden`}>
      {options.map((option, index) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`
            flex-1 text-sm font-bold transition-colors duration-200
            ${selected === option ? 'bg-black text-white' : 'bg-transparent text-gray-600'}
            ${index !== options.length - 1 ? 'border-r border-gray-300' : ''}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PercentageSwitch;