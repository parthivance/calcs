import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleButton from '../components/ToggleButton';

// Mock-up function for generating chart data
function generateChartData(monthlyInvestment: number, growthRate: number, years: number): Array<{ year: string; Principal: number; 'Total Value': number }> {
    let annualInvestment = monthlyInvestment * 12;
    let totalValue = 0;
    let totalPrincipal = 0;
    const chartData = [];
  
    for (let i = 0; i < years; i++) {
      totalPrincipal += annualInvestment;
      totalValue = (totalValue + annualInvestment) * (1 + growthRate / 100);
      chartData.push({
        year: `${i + 1}Y`,
        Principal: totalPrincipal,
        'Total Value': totalValue
      });
    }
  
    return chartData;
  }
  interface TooltipProps {
    active?: boolean;
    payload?: { name: string; value: number; }[];
    label?: string;
  }

const SIPCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [timePeriod, setTimePeriod] = useState(12);
    const [growthRate, setGrowthRate] = useState(12);
    const [isLumpsum, setIsLumpsum] = useState(false);
    const [chartData, setChartData] = useState<Array<{ year: string; Principal: number; 'Total Value': number }>>([]);
    const [investedAmount, setInvestedAmount] = useState(0);
    const [estimatedReturns, setEstimatedReturns] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const data = generateChartData(monthlyInvestment, growthRate, timePeriod);
        setChartData(data);
        setInvestedAmount(monthlyInvestment * 12 * timePeriod);
        setEstimatedReturns(data[data.length - 1]['Total Value']);
    }, [monthlyInvestment, timePeriod, growthRate]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
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

    return (
        <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
            <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[780px]`}>
                <div className="flex flex-col justify-between mb-8">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-4`}>SIP Calculator</h1>
                    <ToggleButton 
                        leftLabel="One Time" 
                        rightLabel="Lumpsum" 
                        checked={isLumpsum} 
                        onChange={() => setIsLumpsum(prev => !prev)} 
                    />
                </div>

                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
                    <InvestmentSlider
                        min={1000}
                        max={100000}
                        field="I want to invest monthly"
                        step={1000}
                        tip="The amount you want to invest monthly"
                        value={monthlyInvestment}
                        symbol="₹"
                        onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    />
                    <InvestmentSlider
                        min={1}
                        max={30}
                        field="For a time period of"
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
                        symbolPosition='right'
                        onChange={(e) => setGrowthRate(Number(e.target.value))}
                    />
                </div>

                <div className="mt-8 h-96">
                <div className={`w-full h-full`}>
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

                <div className="flex justify-between mt-8">
                    <div>
                        <h3 className="text-xl text-gray-400">Invested amount</h3>
                        <p className="text-2xl font-bold">{(investedAmount / 100000).toFixed(2)} Lakhs</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xl text-gray-400">Estimated returns</h3>
                        <p className="text-2xl font-bold">{(estimatedReturns / 100000).toFixed(2)} Lakhs</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SIPCalculator;
