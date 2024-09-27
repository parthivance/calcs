import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleSwitch from '../components/ToggleSwitch';
import PercentageSwitch from '../components/PercentageSwitchCI';
import Banner from '../assets/Tags.png';

enum Frequency {
    Monthly = "Monthly",
    Quarterly = "Quarterly",
    Yearly = "Yearly"
}

function generateChartData(yearlyInvestment: number, interestRate: number, years: number): Array<{ year: string; Principal: number; 'Total Value': number }> {
    const chartData = [];
    let totalPrincipal = 0;
    let totalValue = 0;
    
    for (let year = 1; year <= years; year++) {
        totalPrincipal += yearlyInvestment;
        const interest = (totalValue + yearlyInvestment) * (interestRate / 100);
        totalValue += yearlyInvestment + interest;
        
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

const PPFCalculator = () => {
    const [yearlyInvestment, setYearlyInvestment] = useState(150000);
    const [interestRate, setInterestRate] = useState(7.1);
    const [timePeriod, setTimePeriod] = useState(15);
    const [frequency, setFrequency] = useState<Frequency>(Frequency.Yearly);
    const [chartData, setChartData] = useState<Array<{ year: string; Principal: number; 'Total Value': number }>>([]);
    const [investedAmount, setInvestedAmount] = useState(0);
    const [estimatedReturns, setEstimatedReturns] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [interest, setInterest] = useState(0);
    const [maturityAmount, setMaturityAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);

    useEffect(() => {
        const data = generateChartData(yearlyInvestment, interestRate, timePeriod);
        setChartData(data);
        setInvestedAmount(yearlyInvestment * timePeriod);
        const totalValue = data[data.length - 1]['Total Value'];
        setEstimatedReturns(totalValue - yearlyInvestment * timePeriod);
        setInterest(totalValue - yearlyInvestment * timePeriod);
        setMaturityAmount(totalValue);

        // Calculate deposit amount based on frequency
        let amount = yearlyInvestment;
        switch (frequency) {
            case Frequency.Monthly:
                amount = yearlyInvestment / 12;
                break;
            case Frequency.Quarterly:
                amount = yearlyInvestment / 4;
                break;
            case Frequency.Yearly:
                amount = yearlyInvestment;
                break;
        }
        setDepositAmount(amount);
    }, [yearlyInvestment, interestRate, timePeriod, frequency]);

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
            <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center rounded-3xl min-h-[780px]`}>
                <div className="flex flex-col justify-between mb-8">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>PPF Calculator</h1>
                </div>

                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
                    <InvestmentSlider
                        min={500}
                        max={150000}
                        field="I want to deposit"
                        step={500}
                        tip="The amount you want to invest yearly (max 1.5 lakh)"
                        value={yearlyInvestment}
                        symbol="₹"
                        onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                    />
                    <InvestmentSlider
                        min={1}
                        max={10}
                        field="Current Interest"
                        step={0.1}
                        tip="The current PPF interest rate"
                        value={interestRate}
                        symbol="%"
                        symbolPosition='right'
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                    <div>
                    <span className="font-semibold">My deposit would be</span>
                    <div className="flex gap-2 mt-2">
                    <PercentageSwitch
                        options={Object.values(Frequency)}
                        selected={frequency}
                        onSelect={(value) => setFrequency(Frequency[value as keyof typeof Frequency])}
                        className="w-full"
                        />
                    </div>
                    </div>
                </div>
                <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-6 mt-2`}>
                    <div className='md:mt-28'>
    <InvestmentSlider
        min={15}
        max={50}
        field="Investment Period"
        step={1}
        tip="Investment duration in years (min 15 years)"
        value={timePeriod}
        symbol="Y"
        symbolPosition='right'
        onChange={(e) => setTimePeriod(Number(e.target.value))}
    />
    </div>
    <div className="mt-6">
    <div className="flex justify-between border-b border-gray-400 pb-4">
        <div>
            <h3 className="text-xl text-gray-400">Invested amount</h3>
            <p className="text-2xl font-bold">{(investedAmount / 100000).toFixed(2)} Lakhs</p>
        </div>
        <div>
            <h3 className="text-xl text-gray-400">Interest</h3>
            <p className="text-2xl font-bold">{(interest / 100000).toFixed(2)} Lakhs</p>
        </div>
        <div>
            <h3 className="text-xl text-gray-400">Maturity amount</h3>
            <p className="text-2xl font-bold">{(maturityAmount / 100000).toFixed(2)} Lakhs</p>
        </div>
    </div>

    <div className="text-black text-justify py-3 flex justify-between items-center mt-2">
    <p className="text-sm md:text-base lg:text-lg flex-grow tracking-tight leading-snug">Your PPF investment, returns & maturity are all TAX FREE!</p>
    <img src={Banner} alt="EEE Savings" className="ml-8 w-24 md:w-32 lg:w-40"/>
</div>
    </div>
</div>
                <div className=" h-96">
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

export default PPFCalculator;