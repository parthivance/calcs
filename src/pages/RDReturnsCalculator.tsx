import React, { useState, useEffect, useRef } from 'react';
import { calculateRD, generateRDChartData } from '../utils/logic2';
import PercentageSwitch from '../components/PercentageSwitch';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import PeriodSlider from '../components/PeriodSlider';
import ToggleSwitch from '../components/ToggleSwitch';
import CustomFDChart from '../components/CustomFDChart';

const RDReturnsCalculator: React.FC = () => {
  const [investment, setInvestment] = useState(5000);
  const [rateOfInterest, setRateOfInterest] = useState(6.5);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [isPostTax, setIsPostTax] = useState(false);
  const [taxSlab, setTaxSlab] = useState(5);
  const [period, setPeriod] = useState(5); // Period in years
  const [periodType, setPeriodType] = useState<'YR' | 'MO'>('YR');
  const [chartHeight, setChartHeight] = useState(500);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  interface ChartData {
    year: string;
    Principal: number;
    'Total Value': number;
  }

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    calculateRDReturns();
  }, [investment, rateOfInterest, period, isSeniorCitizen, periodType, isPostTax, taxSlab]);

  const calculateRDReturns = () => {
    const timePeriod = periodType === 'YR' ? period : period / 12; // Convert months to years if needed
    const compoundingFrequency = 4; // Quarterly compounding for RD
    const effectiveInterestRate = rateOfInterest + (isSeniorCitizen ? 0.5 : 0); // Additional rate for senior citizens

    const result = calculateRD({
      monthlyInvestment: investment,
      annualInterestRate: effectiveInterestRate,
      timePeriod,
      compoundingFrequency,
    });

    if (result.value !== '-1') {
      const totalInvestment = investment * timePeriod * 12;
      const postTaxInterest = isPostTax
        ? result.chartData.returns * (1 - taxSlab / 100)
        : result.chartData.returns;

      setPrincipalAmount(totalInvestment);
      setTotalInterest(postTaxInterest);
      setMaturityAmount(totalInvestment + postTaxInterest);

      // Generate chart data to show progress over the years
      const newChartData = generateRDChartData(investment, effectiveInterestRate, timePeriod, compoundingFrequency);
      setChartData(newChartData);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (resultsRef.current) {
        setChartHeight(resultsRef.current.clientHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
      <div className={`${isMobile ? 'w-full' : 'w-[1680px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[780px]`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>RD Returns Calculator</h1>
          <div className="flex items-center gap-2">
          <ToggleSwitch
              checked={isSeniorCitizen}
              onChange={() => setIsSeniorCitizen(prev => !prev)}
            > Senior Citizen</ToggleSwitch>
          </div>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
          <InvestmentSlider
            min={0}
            max={1000000}
            field="Monthly Investment"
            step={100}
            tip="Enter your monthly investment"
            value={investment}
            symbol="₹"
            onChange={(e) => setInvestment(Number(e.target.value))}
          />
          <InvestmentSlider
            min={0}
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

        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6`}>
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} h-full`}>
            <CustomFDChart data={chartData} height={isMobile ? 300 : chartHeight}/>
          </div>

          <div className={`${isMobile ? 'w-full' : 'w-1/3'} flex flex-col gap-6`} ref={resultsRef}>
          <ToggleSwitch 
              checked={isPostTax}
              onChange={() => setIsPostTax(prev => !prev)}
            >Post tax
            </ToggleSwitch>
            <div>
              <span className="font-semibold">Select tax slab</span>
              <div className="flex gap-2 mt-2">
                <PercentageSwitch selected={taxSlab} onSelect={setTaxSlab} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ResultsDisplay
                items={[
                  { label: 'Total Invested', value: principalAmount, showCircle: true, circleColor: 'bg-green-600' },
                  { label: 'Maturity Amount', value: maturityAmount, showCircle: true, circleColor: 'bg-green-400' },
                  { label: 'Total Interest', value: totalInterest },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDReturnsCalculator;