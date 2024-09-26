import React from 'react';

interface PercentageSwitchProps {
  selected: number;
  onSelect: (value: number) => void;
}

const PercentageSwitch: React.FC<PercentageSwitchProps> = ({ selected, onSelect }) => {
  const options = [5, 3, 12, 18, 28];

  return (
    <div className="flex w-full md:w-[378px] h-[34px] rounded-full bg-gray-100 overflow-hidden">
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
          {option}%
        </button>
      ))}
    </div>
  );
};

export default PercentageSwitch;