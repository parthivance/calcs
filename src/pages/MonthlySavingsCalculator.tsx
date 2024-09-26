import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { ChartOptions, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface SavingsResults {
  totalSaved: number;
  interestEarned: number;
  totalAmount: number;
}

const MonthlySavingsCalculator = () => {
  const [initialDeposit, setInitialDeposit] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [annualReturnRate, setAnnualReturnRate] = useState(5);
  const [years, setYears] = useState(10);
  const [chartData, setChartData] = useState<ChartData>({
    datasets: [{ data: [], backgroundColor: ['#5CA185', '#79E7A5'] }]
  });
  const [results, setResults] = useState<SavingsResults>({
    totalSaved: 0,
    interestEarned: 0,
    totalAmount: 0
  });
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (resultsRef.current) {
      const resultsHeight = resultsRef.current.clientHeight;
      setChartHeight(resultsHeight);
    }
  }, [initialDeposit, monthlyContribution, annualReturnRate, years]);

  useEffect(() => {
    const savingsResults = calculateSavings(initialDeposit, monthlyContribution, annualReturnRate, years);
    setResults(savingsResults);
    setChartData(generateChartData(initialDeposit, savingsResults.interestEarned));
  }, [initialDeposit, monthlyContribution, annualReturnRate, years]);

  const calculateSavings = (initial: number, monthly: number, rate: number, time: number): SavingsResults => {
    const monthlyRate = rate / 12 / 100;
    const months = time * 12;
    let futureValue = initial * Math.pow(1 + monthlyRate, months);
    for (let i = 1; i <= months; i++) {
      futureValue += monthly * Math.pow(1 + monthlyRate, months - i);
    }
    const totalContributions = initial + monthly * months;
    const interestEarned = futureValue - totalContributions;
    return {
      totalSaved: totalContributions,
      interestEarned,
      totalAmount: futureValue
    };
  };

  const generateChartData = (principal: number, interest: number): ChartData => {
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
            const label = context.dataIndex === 0 ? 'Total' : 'Interest';
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
        <h1 className="text-3xl font-bold">Monthly Savings Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentSlider
            min={1000}
            max={1000000}
            field="Initial Deposit"
            symbol="₹"
            step={1000}
            tip="Enter your initial deposit amount"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(Number(e.target.value))}
          />
          <InvestmentSlider
            min={0}
            max={100000}
            field="Monthly Contribution"
            symbol="₹"
            step={100}
            tip="Enter your monthly contribution"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentSlider
            min={0.1}
            max={15}
            field="Annual Return Rate"
            symbol="%"
            step={0.1}
            tip="Enter the annual interest rate"
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
          />
          <InvestmentSlider
            min={1}
            max={30}
            field="Years"
            symbol="years"
            step={1}
            tip="Enter the number of years for savings"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-full flex justify-center mt-14">
            <Doughnut
              data={chartData}
              options={chartOptions}
              width={300}
              height={chartHeight}
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6" ref={resultsRef}>
            <div className="flex flex-col gap-4 mt-5">
              <ResultsDisplay
                items={[
                    { label: 'Total Saved', value: `₹${results.totalSaved.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-600' },
                    { label: 'Interest Earned', value: `₹${results.interestEarned.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-400' },
                    { label: 'Total Amount', value: `₹${results.totalAmount.toLocaleString()}` }
                  ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsCalculator;