import React, { useState, useEffect } from 'react';
import { calculateSimpleInterest, generateChartData } from '../utils/logic4';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import CustomFDChart from '../components/CustomFDChart';
import PeriodSlider from '../components/PeriodSlider';

interface ChartData {
    year: string;
    Principal: number;
    'Total Value': number;
  }
  
const SICalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(100000);
  const [rateOfInterest, setRateOfInterest] = useState<number>(6.5);
  const [period, setPeriod] = useState<number>(5);
  const [periodType, setPeriodType] = useState<'YR' | 'MO'>('YR');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timePeriod = periodType === "YR" ? period : period / 12;
    const result = calculateSimpleInterest({
      principal: investment,
      rate: rateOfInterest,
      time: timePeriod
    });

    setMaturityAmount(result.value);
    setTotalInterest(result.interest);
    const newData = generateChartData(investment, result.interest, period, periodType);
    setChartData(newData);
  }, [investment, rateOfInterest, period, periodType]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
      <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[624px] rounded-3xl`}>
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold mb-4">Simple Interest Calculator</h1>
      </div>
      <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
      <InvestmentSlider
            min={0}
            max={1000000}
            field="Principal Amount"
            step={100}
            tip="Enter your investment amount"
            value={investment}
            symbol="₹"
            onChange={(e) => setInvestment(Number(e.target.value))}
          />
          <InvestmentSlider
            min={0.5}
            max={15}
            field="Rate of Interest"
            step={0.1}
            tip="Enter your interest rate"
            value={rateOfInterest}
            symbol="%"
            onChange={(e) => setRateOfInterest(Number(e.target.value))}
          />
          <PeriodSlider
            min={1}
            max={periodType === 'YR' ? 30 : 360}
            field="Period"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        </div>
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6 mt-6`}>
        <div className={`${isMobile ? 'w-full' : 'w-2/3'} h-full`}>
        <CustomFDChart data={chartData} height={300} />
          </div>
          <div className={`${isMobile ? 'w-full' : 'w-1/3'} flex flex-col gap-6`}>
            <ResultsDisplay
              items={[
                { label: 'Total Invested', value: investment, showCircle: true, circleColor: 'bg-green-600' },
                { label: 'Total Interest', value: totalInterest},
                { label: 'Maturity Amount', value: maturityAmount, showCircle: true, circleColor: 'bg-green-400' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SICalculator;