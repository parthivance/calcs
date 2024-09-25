import React from 'react';

interface ResultItem {
  label: string;
  value: string | number;
  showCircle?: boolean;
  circleColor?: string;
}

interface ResultsDisplayProps {
  items: ResultItem[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ items }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="flex justify-between items-center px-4 py-6 border-b border-gray-600"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">{item.label}</span>
            {item.showCircle && (
              <div 
                className={`w-3 h-3 rounded-full ${item.circleColor || 'bg-green-500'}`}
              ></div>
            )}
          </div>
          <span className="text-xl font-bold text-black">
            {typeof item.value === 'number' ? `₹${item.value.toLocaleString('en-IN')}` : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;