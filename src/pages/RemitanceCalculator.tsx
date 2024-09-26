import React, { useState } from 'react';
import InvestmentSlider from '../components/InvestmentSlider';
import WalletImage from '../assets/image 8.png'; // Ensure the path is correct

const MonthlySavingsCalculator = () => {
  const [remittanceAmount, setRemittanceAmount] = useState(10000);
  const [flatFee, setFlatFee] = useState(10);
  const [percentageFee, setPercentageFee] = useState(1);
  const [additionalCharges, setAdditionalCharges] = useState(5);

  const totalRemittanceFee = remittanceAmount * (percentageFee / 100) + flatFee + additionalCharges;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 py-10 flex flex-col gap-6 justify-center w-full max-w-[1119px] rounded-3xl">
      <div className="flex justify-between items-center ml-14">
        <h1 className="text-4xl font-bold text-center">Remittance Fee Calculator</h1>
    </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 h-full flex justify-center mt-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-10 w-full md:ml-14">
              <InvestmentSlider
                min={10}
                max={100000}
                field="Remittance amount"
                symbol="$"
                step={100}
                tip="Enter the remittance amount"
                value={remittanceAmount}
                onChange={(e) => setRemittanceAmount(Number(e.target.value))}
                symbolPosition='right'
              />
              <InvestmentSlider
                min={0}
                max={100}
                field="Flat fee per transaction"
                symbol="$"
                step={1}
                tip=""
                value={flatFee}
                onChange={(e) => setFlatFee(Number(e.target.value))}
                symbolPosition='right'
              />
              <InvestmentSlider
                min={0}
                max={10}
                field="Percentage fee"
                symbol="%"
                step={0.1}
                tip="Enter the percentage fee"
                value={percentageFee}
                onChange={(e) => setPercentageFee(Number(e.target.value))}
                symbolPosition='right'
              />
              <InvestmentSlider
                min={0}
                max={50}
                field="Additional Charges"
                symbol="$"
                step={1}
                tip=""
                value={additionalCharges}
                onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                symbolPosition='right'
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-8 items-center mt-10">
            <img src={WalletImage} alt="Wallet illustration" className="w-54 h-45" />
            <div className="text-3xl font-semibold text-center">
                Total remittance fee
            <div className="text-4xl text-green-600 relative pt-2 pb-6"> {/* Added more padding to increase the gap */}
                ₹{totalRemittanceFee.toLocaleString()}
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-gray-400" style={{ backgroundColor: '#D1D5DB' }}></div>
                {/* Adjusted left to '50%' and added transform to center the line */}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsCalculator;