import React, { useState, useEffect } from 'react';
import { calculateRetirement } from '../utils/logic5';
import InvestmentSlider from '../components/InvestmentSlider';
import CustomFDChart from '../components/CustomFDChart';

interface ChartDataPoint {
  year: string;
  Principal: number;
  'Total Value': number;
}

const RetirementCalculator: React.FC = () => {
  const [age, setAge] = useState(25);
  const [monthlyExpenditure, setMonthlyExpenditure] = useState(25000);
  const [retirementStyle, setRetirementStyle] = useState<'Live like a king' | 'I am happy the way I am' | 'Like a monk'>('Live like a king');
  const [savingStyle, setSavingStyle] = useState<'Safe (PF,FD,ETC)' | 'Aggressive (mutual funds, equity, etc)'>('Safe (PF,FD,ETC)');
  const [totalRequired, setTotalRequired] = useState(0);
  const [monthlySavingsRequired, setMonthlySavingsRequired] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    calculateRetirementValues();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [age, monthlyExpenditure, retirementStyle, savingStyle]);

  const calculateRetirementValues = () => {
    const result = calculateRetirement({
      age,
      monthlyExpenditure,
      retirementStyle,
      savingStyle
    });

    setTotalRequired(result.totalRequired);
    setMonthlySavingsRequired(result.monthlySavingsRequired);
    setChartData(result.chartData);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
      <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[780px]`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>Retirement Calculator</h1>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-6`}>
          <InvestmentSlider
            min={18}
            max={100}
            field="How old are you"
            step={1}
            tip="What is your current age"
            value={age}
            symbol="Y"
            symbolPosition='right'
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <InvestmentSlider
            min={1000}
            max={1000000}
            field="Monthly Expenditure"
            step={1000}
            value={monthlyExpenditure}
            symbol="₹"
            onChange={(e) => setMonthlyExpenditure(Number(e.target.value))}
          />
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} mt-6 mb-4 gap-6`}>
          <div>
            <h3 className="mb-2 text-gray-500">What kind of retirement do you want?</h3>
            <div className="flex flex-col gap-2">
              {['Live like a king', 'I am happy the way I am', 'Like a monk'].map((style) => (
                <label key={style} className="flex items-center">
                  <input
                    type="radio"
                    value={style}
                    checked={retirementStyle === style}
                    onChange={(e) => setRetirementStyle(e.target.value as typeof retirementStyle)}
                    className="mr-2"
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-gray-500">What are you saving for your retirement</h3>
            <div className="flex flex-col gap-2">
              {['Safe (PF,FD,ETC)', 'Aggressive (mutual funds, equity, etc)'].map((style) => (
                <label key={style} className="flex items-center">
                  <input
                    type="radio"
                    value={style}
                    checked={savingStyle === style}
                    onChange={(e) => setSavingStyle(e.target.value as typeof savingStyle)}
                    className="mr-2"
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6`}>
          <div className={`w-full h-full`}>
            <CustomFDChart data={chartData} height={isMobile ? 300 : 500}/>
          </div>
        </div>

        <div className="mt-6">
        <div className="md:flex md:justify-between md:items-center">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h3 className="text-lg font-semibold mb-1 md:mb-0">Total amount required for retirement</h3>
            <p className="text-2xl font-bold md:ml-4">₹{(totalRequired / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 md:mt-0">
            <h3 className="text-lg font-semibold mb-1 md:mb-0">How much do you need to save per month to retire</h3>
            <p className="text-2xl font-bold md:ml-4">₹{Math.round(monthlySavingsRequired).toLocaleString()}</p>
            </div>
        </div>
        </div>

      </div>
    </div>
  );
};

export default RetirementCalculator;