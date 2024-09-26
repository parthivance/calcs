import React, { useState } from 'react';

const ToggleButton = ({ leftLabel = "Old Regime", rightLabel = "New Regime" }) => {
  const [activeOption, setActiveOption] = useState(leftLabel);

  return (
    <div className="inline-flex bg-gray-200 p-1 rounded-full w-[300px]">
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeOption === leftLabel ? 'bg-black text-white' : 'text-gray-700'
        }`}
        onClick={() => setActiveOption(leftLabel)}
      >
        {leftLabel}
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeOption === rightLabel ? 'bg-black text-white' : 'text-gray-700'
        }`}
        onClick={() => setActiveOption(rightLabel)}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleButton;