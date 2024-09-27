import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import PeriodSlider from '../components/PeriodSlider';
import ToggleButton from '../components/ToggleButton';
import ToggleSwitch from '../components/ToggleSwitch';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface FDResults {
  interestRate: number;
  maturityAmount: number;
  totalAmount: number;
}

const NRIFDCalculator = () => {
  const [depositAmount, setDepositAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(7.3);
  const [tenure, setTenure] = useState(2);
  const [periodType, setPeriodType] = useState<'YR' | 'MO'>('YR');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [isMaturityDate, setIsMaturityDate] = useState(false);
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);
  const [interestPayout, setInterestPayout] = useState('One time');
  const [chartData, setChartData] = useState<ChartData>({
    datasets: [{ data: [], backgroundColor: [] }]
  });
  const [results, setResults] = useState<FDResults>({
    interestRate: 0,
    maturityAmount: 0,
    totalAmount: 0
  });
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (resultsRef.current) {
      const resultsHeight = resultsRef.current.clientHeight;
      setChartHeight(resultsHeight);
    }
  }, [depositAmount, interestRate, tenure, results]);

  useEffect(() => {
    const finalInterestRate = isSeniorCitizen ? interestRate + 0.5 : interestRate;

    if (isMaturityDate && maturityDate) {
      const tenureFromMaturityDate = calculateTenureFromMaturityDate(maturityDate);
      const { interestRate: calculatedInterestRate, maturityAmount, totalAmount } = calculateFD(depositAmount, finalInterestRate, tenureFromMaturityDate, 'YR');
      setResults({ interestRate: calculatedInterestRate, maturityAmount, totalAmount });
    } else {
      const { interestRate: calculatedInterestRate, maturityAmount, totalAmount } = calculateFD(depositAmount, finalInterestRate, tenure, periodType);
      setResults({ interestRate: calculatedInterestRate, maturityAmount, totalAmount });
    }

    setChartData(generateFDChartData(depositAmount, results.maturityAmount - depositAmount));
  }, [depositAmount, interestRate, tenure, periodType, isSeniorCitizen, isMaturityDate, maturityDate, interestPayout]);

  const calculateFD = (principal: number, rate: number, time: number, type: 'YR' | 'MO'): FDResults => {
    const years = type === 'YR' ? time : time / 12;
    const maturityAmount = principal * Math.pow(1 + rate / 100, years);
    const totalAmount = maturityAmount;
    return { interestRate: rate, maturityAmount, totalAmount };
  };

  const calculateTenureFromMaturityDate = (maturityDate: Date): number => {
    const currentDate = new Date();
    const diffTime = maturityDate.getTime() - currentDate.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears;
  };

  const generateFDChartData = (principal: number, interest: number): ChartData => {
    return {
      datasets: [{
        data: [principal, interest],
        backgroundColor: ['#5CA185', '#79E7A5']
      }]
    };
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const label = context.dataIndex === 0 ? 'Principal' : 'Interest';
            return `${label}: ₹${value.toLocaleString()}`;
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
      <div className="bg-white p-6 py-10 flex flex-col gap-6 justify-center w-full max-w-[1200px] rounded-3xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">NRI FD Calculator</h1>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={isSeniorCitizen}
              onChange={() => setIsSeniorCitizen(prev => !prev)} 
            >
              Senior citizen
            </ToggleSwitch>
          </div>
        </div>

        <div className="flex flex-col md:text-start text-start gap-2">
          <p className="text-gray-600 ">Calculate maturity amount</p>
          <div className="flex flex-col md:flex-row md:gap-1 gap-2 w-full items-start">
            <ToggleButton
              leftLabel="Tenure"
              rightLabel="Maturity date"
              checked={isMaturityDate}
              onChange={() => setIsMaturityDate(prev => !prev)} 
            />
            {isMaturityDate ? (
              <div className="flex-grow mb-6 mt-4 md:mt-0 md:ml-7 w-full md:w-auto">
                <input
                  type="date"
                  value={maturityDate ? maturityDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setMaturityDate(new Date(e.target.value))}
                  className="border p-2 rounded-3xl w-full"
                />
              </div>
            ) : (
              <div className="flex-grow mb-6 mt-4 md:mt-0 md:ml-7 w-full md:w-auto md:relative bottom-8">
                <PeriodSlider
                  min={1}
                  max={periodType === 'YR' ? 30 : 360}
                  field="Tenure"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  periodType={periodType}
                  setPeriodType={setPeriodType}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InvestmentSlider
            min={1000}
            max={10000000}
            field="Deposit amount"
            symbol="₹"
            step={1000}
            tip="Enter your deposit amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
          />
          <InvestmentSlider
            min={1}
            max={20}
            field="Interest Rate"
            symbol="%"
            step={0.1}
            tip="Enter the annual interest rate"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
          <div className="flex flex-col gap-2">
            <label>Interest payout</label>
            <select
              value={interestPayout}
              onChange={(e) => setInterestPayout(e.target.value)}
              className="border rounded-3xl p-2 mt-3"
            >
              <option value="One time">One time</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 h-full flex justify-center items-center">
            <Doughnut
              data={chartData}
              options={chartOptions}
              width={300}
              height={chartHeight}
            />
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-6" ref={resultsRef}>
            <ResultsDisplay
              items={[
                { label: 'Interest Rate', value: `${results.interestRate.toFixed(1)}%`, showCircle: true, circleColor: 'bg-green-600' },
                { label: 'Maturity Amount', value: `₹${results.maturityAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, showCircle: true, circleColor: 'bg-green-400' },
                { label: 'Total Amount', value: `₹${results.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NRIFDCalculator;
