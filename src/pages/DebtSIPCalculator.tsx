import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleButton from '../components/ToggleButton';
import ResultsDisplay from '../components/ResultsDisplay';
import RadioToggle from '../components/RadioToggle';

interface ChartData {
  year: string;
  Principal: number;
  'Total Value': number;
}

const generateChartData = (monthlyInvestment: number, growthRate: number, years: number): ChartData[] => {
  let annualInvestment = monthlyInvestment * 12;
  let totalValue = 0;
  let totalPrincipal = 0;
  const chartData: ChartData[] = [];

  for (let i = 0; i < years; i++) {
    totalPrincipal += annualInvestment;
    totalValue = (totalValue + annualInvestment) * (1 + growthRate / 100);
    chartData.push({
      year: `${i + 1}Y`,
      Principal: Math.round(totalPrincipal / 100000), // Convert to lakhs
      'Total Value': Math.round(totalValue / 100000) // Convert to lakhs
    });
  }

  return chartData;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-100 rounded-lg shadow text-white">
        <p>{label}</p>
        <p>{`${payload[0].name}: ${payload[0].value.toLocaleString()}L`}</p>
        <p>{`${payload[1].name}: ${payload[1].value.toLocaleString()}L`}</p>
      </div>
    );
  }
  return null;
};

const DebtSIPCalculator = () => {
  const [calculationType, setCalculationType] = useState<'investment' | 'goal'>('investment');
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [timePeriod, setTimePeriod] = useState(12);
  const [growthRate, setGrowthRate] = useState(12);
  const [isLumpsum, setIsLumpsum] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1425);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let investment = monthlyInvestment;
    let period = timePeriod;

    if (calculationType === 'goal') {
      // Calculate required monthly investment to reach the target amount
      const monthlyRate = growthRate / 12 / 100;
      const months = timePeriod * 12;
      investment = Math.round(
        (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      );
    } else if (calculationType === 'investment') {
      // Calculate how long it will take to reach the target amount
      const monthlyRate = growthRate / 12 / 100;
      period = Math.ceil(
        Math.log(targetAmount * monthlyRate / monthlyInvestment + 1) / Math.log(1 + monthlyRate) / 12
      );
    }

    const data = generateChartData(investment, growthRate, period);
    setChartData(data);
    setInvestedAmount(investment * 12 * period);
    setEstimatedReturns(data[data.length - 1]['Total Value'] * 100000);
    
    if (calculationType === 'goal') {
      setMonthlyInvestment(investment);
    } else {
      setTimePeriod(period);
    }
  }, [monthlyInvestment, timePeriod, growthRate, targetAmount, calculationType]);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center min-h-screen bg-gray-100 p-4`}>
      <div className={`${isMobile ? 'w-full' : 'w-2/3'} bg-white p-6 py-10 flex flex-col gap-6`}>
        <div className="flex flex-col justify-between mb-8">
          <h1 className="text-4xl font-bold mb-4">Debt SIP Calculator</h1>
          <RadioToggle
            leftLabel="I know my investment amount"
            rightLabel="I know my goal amount"
            onChange={(value) => setCalculationType(value === "I know my investment amount" ? 'investment' : 'goal')}
          />
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
          {calculationType === 'investment' ? (
            <InvestmentSlider
              min={1000}
              max={100000}
              field="Monthly Investment"
              step={1000}
              tip="The amount you want to invest monthly"
              value={monthlyInvestment}
              symbol="₹"
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            />
          ) : (
            <InvestmentSlider
              min={100000}
              max={10000000}
              field="Target Amount"
              step={100000}
              tip="The amount you want to achieve"
              value={targetAmount}
              symbol="₹"
              onChange={(e) => setTargetAmount(Number(e.target.value))}
            />
          )}
          <InvestmentSlider
            min={1}
            max={30}
            field="Time Period"
            step={1}
            tip="Investment duration in years"
            value={timePeriod}
            symbol="Y"
            symbolPosition='right'
            onChange={(e) => setTimePeriod(Number(e.target.value))}
          />
          <InvestmentSlider
            min={1}
            max={30}
            field="Growth Rate"
            step={1}
            tip="Expected annual growth rate"
            value={growthRate}
            symbol="%"
            onChange={(e) => setGrowthRate(Number(e.target.value))}
          />
        </div>
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6`}>
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} h-full`}>
            <div className="mt-8 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Principal" stackId="a" fill="#5CA185" />
                  <Bar dataKey="Total Value" stackId="a" fill="#79E7A5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${isMobile ? 'w-full' : 'w-1/3'} bg-white p-6 py-10 flex flex-col gap-6`}>
            <ResultsDisplay
              items={[
                { label: 'Total Invested', value: `₹ ${investedAmount.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-600' },
                { label: 'Estimated Value', value: `₹ ${estimatedReturns.toLocaleString()}`, showCircle: true, circleColor: 'bg-green-400' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtSIPCalculator;