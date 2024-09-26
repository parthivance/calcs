import React, { useState, useEffect } from 'react';
import { calculateGST } from '../utils/logic';
import PercentageSwitch from '../components/PercentageSwitchGST';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleSwitch from '../components/ToggleSwitch';
import ResultsDisplay from '../components/ResultsDisplay';

const GSTCalculator: React.FC = () => {
  const [costOfGoods, setCostOfGoods] = useState(50000);
  const [profitRatio, setProfitRatio] = useState(0);
  const [taxSlab, setTaxSlab] = useState(5);
  const [isSameState, setIsSameState] = useState(true);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    calculateGSTReturns();
  }, [costOfGoods, profitRatio, taxSlab, isSameState]);

  const calculateGSTReturns = () => {
    const result = calculateGST({
      amount: costOfGoods,
      profitRatio,
      taxRate: taxSlab,
      isSameState
    });

    setTotalSellingPrice(result.totalAmount);
    setTotalProfit(result.totalAmount - costOfGoods);
    setCgst(result.cgst);
    setSgst(result.sgst);
    setIgst(result.igst);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100 ${isMobile ? 'p-4' : ''}`}>
      <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 justify-center min-h-[780px]`}>
        <div className="flex justify-between items-center">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>GST Calculator</h1>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
        <InvestmentSlider
              min={0}
              max={1000000}
              field="Cost of Goods / Services(Without GST)"
              step={100}
              tip="Enter the cost of goods or services without GST"
              value={costOfGoods}
              symbol="₹"
              onChange={(e) => setCostOfGoods(Number(e.target.value))}
            />
          <InvestmentSlider
              min={0}
              max={100}
              field="Profit ratio"
              step={1}
              tip="Enter your profit ratio"
              value={profitRatio}
              symbol="%"
              onChange={(e) => setProfitRatio(Number(e.target.value))}
            />
          <div className="flex gap-2 mt-2">
                <span className="font-semibold">Select tax slab</span>
                <PercentageSwitch selected={taxSlab} onSelect={setTaxSlab} />
          </div>
        </div>
        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6`}>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={isSameState}
              onChange={() => setIsSameState(prev => !prev)}
            >
              State of Billing is same&nbsp;as the <br /> State of Production
            </ToggleSwitch>
            </div>
            <div className="flex justify-between items-center">
              <span>CGST {taxSlab / 2}%</span>
              <span>₹{cgst.toFixed(2)}</span>
              <span>SGST {taxSlab / 2}%</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-6`}>
          

           

            <div className="flex flex-col gap-4 w-full">
              <ResultsDisplay
                items={[
                  { label: 'Total Selling Price', value: totalSellingPrice.toFixed(2) },
                  { label: 'Total profit', value: totalProfit.toFixed(2) },
                ]}
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default GSTCalculator;
