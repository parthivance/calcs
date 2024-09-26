import React, { useState, useEffect } from 'react';
import { calculateGST, GSTCalculationResult } from '../utils/logic2';
import InvestmentSlider from '../components/InvestmentSlider';
import ResultsDisplay from '../components/ResultsDisplay';

const ReverseGSTCalculator: React.FC = () => {
    const [amount, setAmount] = useState(50000);
    const [taxRate, setTaxRate] = useState(5);
    const [result, setResult] = useState<GSTCalculationResult>({
      totalAmount: 0,
      totalProfit: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    });
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      setResult(calculateGST(amount, taxRate));
    }, [amount, taxRate]);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
        <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[407px] rounded-3xl`}>
          <div className="flex justify-between items-center">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>GST Calculator</h1>
          </div>
  
          <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-6`}>
            <InvestmentSlider
              min={0}
              max={1000000}
              field="Amount including GST"
              step={100}
              tip="Enter the amount including GST"
              value={amount}
              symbol="₹"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <InvestmentSlider
              min={0}
              max={28}
              field="GST Slab/rate"
              step={0.1}
              value={taxRate}
              symbol=""
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
          </div>
  
          <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6`}>
            <div className="flex flex-col gap-4 w-full">
              <ResultsDisplay
                items={[
                  { label: 'Amount Including GST', value: result.totalAmount.toFixed(2) },
                  { label: 'Total GST amount', value: result.totalProfit.toFixed(2) },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReverseGSTCalculator;
