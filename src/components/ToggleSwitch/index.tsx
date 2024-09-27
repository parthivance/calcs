import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode; // Now accepts children for flexible content
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ children, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-3 w-full">
      <div className="text-gray-700">{children}</div>
      <div 
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
          checked ? 'bg-[#79E7A5]' : 'bg-gray-300'
        }`}
        onClick={onChange}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;