import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import PeriodSlider from '../components/PeriodSlider';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface EMIResults {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
}

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [periodType, setPeriodType] = useState<'YR' | 'MO'>('YR');
  const [chartData, setChartData] = useState<ChartData>({
    datasets: [{ data: [], backgroundColor: [] }]
  });
  const [results, setResults] = useState<EMIResults>({
    monthlyEMI: 0,
    totalInterest: 0,
    totalAmount: 0
  });
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (resultsRef.current) {
      const resultsHeight = resultsRef.current.clientHeight;
      setChartHeight(resultsHeight);
    }
  }, [loanAmount, interestRate, loanTerm, results]);

  useEffect(() => {
    const { monthlyEMI, totalInterest, totalAmount } = calculateEMI(loanAmount, interestRate, loanTerm, periodType);
    setResults({ monthlyEMI, totalInterest, totalAmount });
    setChartData(generateEMIChartData(loanAmount, totalInterest));
  }, [loanAmount, interestRate, loanTerm, periodType]);

  const calculateEMI = (principal: number, rate: number, time: number, type: 'YR' | 'MO'): EMIResults => {
    const monthlyRate = rate / 12 / 100;
    const numberOfPayments = type === 'YR' ? time * 12 : time;
    const monthlyEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalAmount = monthlyEMI * numberOfPayments;
    const totalInterest = totalAmount - principal;
    return { monthlyEMI, totalInterest, totalAmount };
  };

  const generateEMIChartData = (principal: number, totalInterest: number): ChartData => {
    return {
      datasets: [{
        data: [principal, totalInterest],
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
      <div className="bg-white p-6 py-10 flex flex-col gap-6 justify-center w-full max-w-[1200px]">
        <h1 className="text-3xl font-bold">EMI Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InvestmentSlider
            min={100000}
            max={10000000}
            field="Loan Amount"
            symbol="₹"
            step={10000}
            tip="Enter your loan amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
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
          <PeriodSlider
            min={1}
            max={periodType === 'YR' ? 30 : 360}
            field="Loan Tenure"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 h-full flex justify-center mt-14">
            <Doughnut
              data={chartData}
              options={chartOptions}
              width={300}
              height={chartHeight}
            />
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-6" ref={resultsRef}>
            <div className="flex flex-col gap-4 mt-5">
              <ResultsDisplay
                items={[
                  { label: 'Monthly EMI Amount', value: `₹${results.monthlyEMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                  { label: 'Principal Amount', value: `₹${loanAmount.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-600' },
                  { label: 'Total Interest', value: `₹${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, showCircle: true, circleColor: 'bg-green-400' },
                  { label: 'Total Amount', value: `₹${results.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;