import React, { useState, useRef } from 'react';

interface InvestmentSliderProps {
  min: number;
  max: number;
  field: string;
  step?: number;
  tip?: string;
  value: number;
  symbol: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InvestmentSlider: React.FC<InvestmentSliderProps> = ({ 
  min, max, field, step = 1, tip, value, symbol, onChange 
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const infoIconRef = useRef<HTMLDivElement>(null);

  const handleInputBlur = () => {
    if (value < min || String(value) === "") {
      onChange({ target: { value: String(min) } } as React.ChangeEvent<HTMLInputElement>);
    } else if (value > max) {
      onChange({ target: { value: String(max) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Allow empty value for clearing the input
    if (newValue === "") {
      onChange(e);
      return;
    }

    // Allow numbers, including a single decimal point
    if (/^\d*\.?\d*$/.test(newValue)) {
      let numericValue = Number(newValue);

      // Ensure the value is within the range of min and max
      if (numericValue < min) {
        numericValue = min;
      } else if (numericValue > max) {
        numericValue = max;
      }

      onChange({ target: { value: String(numericValue) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>{field}</span>
          {tip && ( // Only render the icon and tooltip if `tip` exists
            <div
              ref={infoIconRef}
              className="relative"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                  <path d="M1.12967 10.1592C1.21123 4.63697 5.75401 0.226424 11.2763 0.307982C16.7985 0.389539 21.209 4.93232 21.1275 10.4546C21.0459 15.9768 16.5032 20.3874 10.9809 20.3058C5.45866 20.2242 1.04811 15.6815 1.12967 10.1592Z" fill="#111111"/>
                  <path d="M7.55385 14.8483C7.5531 14.5462 7.64778 14.308 7.83787 14.1337C8.03317 13.9595 8.29227 13.8747 8.61515 13.8795L10.2087 13.9031L10.2731 9.54415L8.89825 9.52385C8.58058 9.51916 8.32667 9.42946 8.13652 9.25476C7.95165 9.07493 7.85881 8.83655 7.85798 8.53963C7.85716 8.24271 7.95436 8.00974 8.14959 7.84073C8.34489 7.66652 8.60398 7.58179 8.92686 7.58656L11.3641 7.62255C11.6661 7.62702 11.907 7.71912 12.0867 7.89888C12.2663 8.07864 12.3539 8.32214 12.3493 8.6294L12.271 13.9335L13.474 13.9513C13.8021 13.9561 14.0586 14.0485 14.2434 14.2283C14.4335 14.4082 14.5237 14.6491 14.514 14.9511C14.5045 15.2427 14.4047 15.4756 14.2146 15.6499C14.0246 15.819 13.7681 15.9011 13.4453 15.8964L8.58642 15.8246C8.26875 15.8199 8.01744 15.7303 7.8325 15.5556C7.64763 15.3758 7.55475 15.14 7.55385 14.8483ZM9.74394 4.63737C9.74955 4.2572 9.88448 3.93884 10.1487 3.6823C10.4129 3.42576 10.7325 3.30026 11.1075 3.30579C11.4877 3.31141 11.8034 3.4463 12.0548 3.71045C12.3113 3.97469 12.4368 4.29689 12.4311 4.67705C12.4256 5.05201 12.2907 5.37037 12.0264 5.63212C11.7673 5.88874 11.4478 6.01424 11.0676 6.00863C10.6926 6.00309 10.3769 5.8682 10.1203 5.60397C9.86387 5.33453 9.7384 5.01233 9.74394 4.63737Z" fill="#F6F6F6"/>
                </g>
              </svg>
              {isTooltipVisible && (
                <div
                  className="absolute z-50 p-2 text-sm text-white bg-gray-700 bg-opacity-80 rounded shadow-lg transform -translate-x-1/2 -translate-y-full"
                  style={{ top: '-10px', left: '50%', width: '200px', whiteSpace: 'normal', textAlign: 'center' }}
                >
                  {tip}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-1">{symbol}</span>
          <input
            type="number"
            value={value === 0 ? "" : value} // Empty input allows clearing
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-30 text-xl font-bold text-center bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none"
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer"
        style={{
          backgroundImage: `linear-gradient(to right, #E7E7E7 0%, #E7E7E7 ${((value - min) / (max - min)) * 100}%, #F6F6F6 ${((value - min) / (max - min)) * 100}%, #F6F6F6 100%)`
        }}
      />
    </div>
  );
};

export default InvestmentSlider;