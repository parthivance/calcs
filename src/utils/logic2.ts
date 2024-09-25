interface CalculateRDParams {
    monthlyInvestment: number;
    annualInterestRate: number;
    timePeriod: number; // in years
    compoundingFrequency: number;
  }
  
  interface ChartData {
    investment: number;
    returns: number;
  }
  
  interface RDResult {
    value: string;
    chartData: ChartData;
  }
  
  export const calculateRD = ({
    monthlyInvestment,
    annualInterestRate,
    timePeriod,
    compoundingFrequency,
  }: CalculateRDParams): RDResult => {
    const r = annualInterestRate / 100 / compoundingFrequency; // interest per period
    const n = timePeriod * 12; // total months
  
    let maturityValue = 0;
    for (let i = 1; i <= n; i++) {
      maturityValue += monthlyInvestment * Math.pow(1 + r, (i / 12) * compoundingFrequency);
    }
  
    const totalInvestment = monthlyInvestment * n;
    const returns = maturityValue - totalInvestment;
  
    return {
      value: maturityValue.toFixed(2),
      chartData: {
        investment: totalInvestment,
        returns,
      },
    };
  };
  
  export const generateRDChartData = (
    monthlyInvestment: number,
    annualInterestRate: number,
    timePeriod: number,
    compoundingFrequency: number
  ) => {
    let cumulativeInvestment = 0;
    let totalInterest = 0;
    const monthlyRate = annualInterestRate / 100 / compoundingFrequency;
  
    return Array.from({ length: timePeriod * 12 }, (_, i) => {
      cumulativeInvestment += monthlyInvestment;
      const interest = cumulativeInvestment * Math.pow(1 + monthlyRate, (i + 1) / 12) - cumulativeInvestment;
      totalInterest += interest;
  
      return {
        year: `${Math.floor((i + 1) / 12)}Y ${((i + 1) % 12)}M`,
        Principal: cumulativeInvestment,
        'Total Value': cumulativeInvestment + totalInterest,
      };
    });
  };