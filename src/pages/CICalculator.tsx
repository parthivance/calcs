import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleSwitch from '../components/ToggleSwitch';
import PercentageSwitch from '../components/PercentageSwitchCI';
enum Frequency {
    Daily = "Daily",
    Monthly = "Monthly",
    Quarterly = "Quarterly",
    Yearly = "Yearly"
}
// Refactored function for generating chart data
function generateChartData(monthlyInvestment: number, interestRate: number, years: number, compoundFrequency: Frequency, adjustForInflation: boolean, inflationRate: number): Array<{ year: string; Principal: number; 'Total Value': number }> {
    const chartData = [];
    let totalPrincipal = 0;
    let totalValue = 0;
    
    const frequencyMap: { [key in Frequency]: number } = {
        [Frequency.Daily]: 365,
        [Frequency.Monthly]: 12,
        [Frequency.Quarterly]: 4,
        [Frequency.Yearly]: 1
    };
    
    const compoundPeriods = frequencyMap[compoundFrequency];
    const effectiveRate = (1 + interestRate / (100 * compoundPeriods)) ** compoundPeriods - 1;
    
    for (let year = 1; year <= years; year++) {
        totalPrincipal += monthlyInvestment * 12;
        totalValue = (totalValue + monthlyInvestment * 12) * (1 + effectiveRate);
        
        if (adjustForInflation) {
            totalValue /= (1 + inflationRate / 100);
        }
        
        chartData.push({
            year: `${year}Y`,
            Principal: Math.round(totalPrincipal),
            'Total Value': Math.round(totalValue)
        });
    }
    
    return chartData;
}

interface TooltipProps {
    active?: boolean;
    payload?: { name: string; value: number; }[];
    label?: string;
}

const CICalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [interestRate, setInterestRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(12);
    const [compoundFrequency, setCompoundFrequency] = useState<Frequency>(Frequency.Daily);    const [chartData, setChartData] = useState<Array<{ year: string; Principal: number; 'Total Value': number }>>([]);
    const [investedAmount, setInvestedAmount] = useState(0);
    const [estimatedReturns, setEstimatedReturns] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(4);

    useEffect(() => {
        const data = generateChartData(monthlyInvestment, interestRate, timePeriod, compoundFrequency, adjustForInflation, inflationRate);
        setChartData(data);
        setInvestedAmount(monthlyInvestment * 12 * timePeriod);
        setEstimatedReturns(data[data.length - 1]['Total Value'] - monthlyInvestment * 12 * timePeriod);
    }, [monthlyInvestment, interestRate, timePeriod, compoundFrequency, adjustForInflation, inflationRate]);

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
                    <p>{`${payload[0].name}: ${(payload[0].value / 100000).toFixed(2)}L`}</p>
                    <p>{`${payload[1].name}: ${(payload[1].value / 100000).toFixed(2)}L`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
            <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[780px]`}>
                <div className="flex flex-col justify-between mb-8">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>Compound Interest Calculator</h1>
                </div>

                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
                    <InvestmentSlider
                        min={1000}
                        max={100000}
                        field="Investment"
                        step={1000}
                        tip="The amount you want to invest monthly"
                        value={monthlyInvestment}
                        symbol="₹"
                        onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    />
                    <InvestmentSlider
                        min={1}
                        max={30}
                        field="Rate of interest"
                        step={0.1}
                        tip="The annual interest rate for the investment"
                        value={interestRate}
                        symbol="%"
                        symbolPosition='right'
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                    <div>
                    <span className="font-semibold">Compounding frequency</span>
                    <div className="flex gap-2 mt-2">
                    <PercentageSwitch
                        options={Object.values(Frequency)}
                        selected={compoundFrequency}
                        onSelect={(value) => setCompoundFrequency(Frequency[value as keyof typeof Frequency])}
                        className="w-full"
                        />
                    </div>
                    </div>
                </div>
                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-6`}>
                <div className="flex flex-col items-start">
                    <span className='py-2'>&nbsp; &nbsp;Adjust maturity amount for inflation</span>
                    <ToggleSwitch
                    checked={adjustForInflation}
                    onChange={() => setAdjustForInflation(prev => !prev)}
                    />
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-semibold py-2">Inflation</span>
                    <PercentageSwitch
                    options={["4%", "6%", "8%"]}
                    selected={`${inflationRate}%`}
                    onSelect={(value) => setInflationRate(Number(value.replace('%', '')))}
                    className="w-full"
                    />
                </div>   
                </div>
                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-6 mt-6`}>
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
                <div className="flex justify-between">
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
            </div>
        </div>
    );
};

export default CICalculator;