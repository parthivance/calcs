import React from 'react';

interface ToggleButtonProps {
  leftLabel?: string;
  rightLabel?: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  leftLabel = "Old Regime",
  rightLabel = "New Regime",
  checked,
  onChange
}) => {
  return (
    <div className="inline-flex bg-gray-200 p-1 rounded-full w-[300px]">
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          !checked ? 'bg-black text-white' : 'text-gray-700'
        }`}
        onClick={onChange}
      >
        {leftLabel}
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          checked ? 'bg-black text-white' : 'text-gray-700'
        }`}
        onClick={onChange}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleButton;