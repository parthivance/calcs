import React from 'react';

interface PeriodSliderProps {
  min: number;
  max: number;
  field: string;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  periodType: 'YR' | 'MO';
  setPeriodType: React.Dispatch<React.SetStateAction<'YR' | 'MO'>>;
}

const PeriodSlider: React.FC<PeriodSliderProps> = ({
  min,
  max,
  field,
  step = 1,
  value,
  onChange,
  periodType,
  setPeriodType
}) => {
  const handleInputBlur = () => {
    if (value < min || String(value) === "") {
      onChange({ target: { value: String(min) } } as React.ChangeEvent<HTMLInputElement>);
    } else if (value > max) {
      onChange({ target: { value: String(max) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue === "") {
      onChange(e);
      return;
    }
    if (/^\d+$/.test(newValue)) {
      let numericValue = Number(newValue);
      numericValue = Math.min(Math.max(numericValue, min), max);
      onChange({ target: { value: String(numericValue) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
    <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="text-sm md:text-base font-bold text-gray-700">{field}</span>
      <div className="flex bg-gray-200 rounded-full">
        <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                periodType === 'YR' ? 'bg-black text-white' : 'text-gray-700'
              }`}
              onClick={() => setPeriodType('YR')}
            >
              YR
            </button>
            <button
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                periodType === 'MO' ? 'bg-black text-white' : 'text-gray-700'
              }`}
              onClick={() => setPeriodType('MO')}
            >
              MO
            </button>
          </div>
        </div>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-16 text-xl font-bold text-center bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none"
          min={min}
          max={max}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer"
        style={{
            backgroundImage: `linear-gradient(to right, #E7E7E7 0%, #E7E7E7 ${((value - min) / (max - min)) * 100}%, #F6F6F6 ${((value - min) / (max - min)) * 100}%, #F6F6F6 100%)`
        }}
      />
    </div>
  );
};

export default PeriodSlider;