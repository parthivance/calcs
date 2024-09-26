import React, { useState, useEffect } from 'react';
import { calculateGST } from '../utils/logic';
import PercentageSwitch from '../components/PercentageSwitchGST';
import InvestmentSlider from '../components/InvestmentSlider';
import ToggleSwitch from '../components/ToggleSwitch';
import ResultsDisplay from '../components/ResultsDisplay';

const GSTCalculator: React.FC = () => {
  const [costOfGoods, setCostOfGoods] = useState(50000);
  const [profitRatio, setProfitRatio] = useState(10);
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
      <div className={`${isMobile ? 'w-full' : 'w-[1119px]'} bg-white p-6 py-10 flex flex-col gap-6 rounded-3xl justify-center min-h-[600px]`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold`}>GST Calculator</h1>
        </div>

        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} gap-6 mt-2 mb-2`}>
        <InvestmentSlider
              min={0}
              max={1000000}
              field="Cost of Goods"
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
              symbolPosition='right'
              onChange={(e) => setProfitRatio(Number(e.target.value))}
            />
          {/* <div className="flex flex-col items-start justify-start p-2 rounded-lg">
              <span>Select tax slab</span>
              <PercentageSwitch selected={taxSlab} onSelect={setTaxSlab} />
          </div> */}
          <div className="flex flex-col gap-2 w-full">
            <div className="mb-2">
                <span className="font-semibold">Select tax slab</span>
            </div>
            <div>
                <PercentageSwitch selected={taxSlab} onSelect={setTaxSlab} className="w-full" />
            </div>
        </div>
        </div>
        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3 items-center'} gap-2 p-4`}>
          <ToggleSwitch
              checked={isSameState}
              onChange={() => setIsSameState(prev => !prev)}
          >
                    State of Billing is same&nbsp;as the <br /> State of Production
          </ToggleSwitch>
          <span className="text-xl font-semibold text-gray-700 col-span-1 px-8 py-2 flex items-center w-full border-b">
              <span className="text-base text-gray-500 pr-2">CGST {taxSlab / 2}%</span>
              <span className="ml-auto">₹{cgst.toFixed(2)}</span>
          </span>
          <span className="text-xl font-semibold text-gray-700 col-span-1 px-8 py-2 flex items-center w-full border-b">
              <span className="text-base text-gray-500 pr-2">SGST {taxSlab / 2}%</span>
              <span className="ml-auto">₹{sgst.toFixed(2)}</span>
          </span>
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
