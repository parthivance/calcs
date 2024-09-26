interface NSCParams {
    investment: number;
    annualInterestRate: number;
    timePeriod: number;
    compoundingFrequency: number;
  }
  
  interface NSCResults {
    investment: number;
    totalInterest: number;
    total: number;
  }
  
  // Calculate NSC maturity, interest, and principal
  export const calculateNSC = ({
    investment,
    annualInterestRate,
    timePeriod,
    compoundingFrequency
  }: NSCParams): NSCResults => {
    let total = investment;
    let interestRatePerPeriod = annualInterestRate / compoundingFrequency / 100;
  
    for (let i = 0; i < timePeriod * compoundingFrequency; i++) {
      total += total * interestRatePerPeriod;
    }
  
    const totalInterest = total - investment;
    return {
      investment,
      totalInterest,
      total
    };
  };
  
  interface ChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  }
  
  // Generate chart data for NSC calculations
  export const generateNSCChartData = ({
    investment,
    totalInterest,
    total
  }: NSCResults): ChartData => {
    return {
      labels: ['Principal Amount', 'Total Interest'],
      datasets: [
        {
          data: [investment, totalInterest],
          backgroundColor: ['#5CA185', '#79E7A5']
        }
      ]
    };
  };