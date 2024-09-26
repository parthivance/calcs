import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { calculateNSC, generateNSCChartData } from '../utils/logic3';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import ToggleSwitch from '../components/ToggleSwitch';
import PeriodSlider from '../components/PeriodSlider';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

const NSCCalculator = () => {
  const [investment, setInvestment] = useState(5000);
  const [rateOfInterest, setRateOfInterest] = useState(6.5);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [period, setPeriod] = useState(5);
  const [periodType, setPeriodType] = useState<'YR' | 'MO'>('YR');
  const [chartData, setChartData] = useState<ChartData>({
    datasets: [{ data: [], backgroundColor: [] }]
  });
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (resultsRef.current) {
      const resultsHeight = resultsRef.current.clientHeight;
      setChartHeight(resultsHeight);
    }
  }, [investment, rateOfInterest, period, totalInterest, maturityAmount]);

  useEffect(() => {
    const compoundingFrequency = periodType === 'YR' ? 1 : 12;
    const annualInterestRate = rateOfInterest + (isSeniorCitizen ? 0.5 : 0);
    const timePeriod = periodType === 'YR' ? period : period / 12;

    const { investment: principal, totalInterest: interest, total } = calculateNSC({
      investment,
      annualInterestRate,
      timePeriod,
      compoundingFrequency
    });

    setTotalInterest(interest);
    setMaturityAmount(total);

    setChartData(generateNSCChartData({
      investment: principal,
      totalInterest: interest,
      total
    }));

  }, [investment, rateOfInterest, period, periodType, isSeniorCitizen]);

  const chartOptions: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 5,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const label = context.label || '';
            return `${label}: ${(value / 100000).toFixed(2)}L`;
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 py-10 flex flex-col gap-6 justify-center w-full max-w-[1200px]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">NSC Calculator</h1>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              label="Senior Citizen"
              checked={isSeniorCitizen}
              onChange={() => setIsSeniorCitizen(prev => !prev)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InvestmentSlider
            min={1000}
            max={1000000}
            field="Investment Amount"
            symbol="₹"
            step={100}
            tip="Enter your investment amount"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
          />
          <InvestmentSlider
            min={0.1}
            max={15}
            field="Rate of Interest"
            symbol="%"
            step={0.1}
            tip="Enter your interest rate"
            value={rateOfInterest}
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

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-full flex justify-center mt-7">
            <Doughnut
              data={chartData}
              options={chartOptions}
              width={300}
              height={chartHeight-20}
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6" ref={resultsRef}>
            <div className="flex flex-col gap-4 mt-7">
              <ResultsDisplay
                items={[
                  { label: 'Principal Amount', value: `₹${investment.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-600' },
                  { label: 'Total Interest', value: `₹${totalInterest.toLocaleString()}`,showCircle: true, circleColor: 'bg-green-400'  },
                  { label: 'Total Amount', value: `₹${maturityAmount.toLocaleString()}`},
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NSCCalculator;