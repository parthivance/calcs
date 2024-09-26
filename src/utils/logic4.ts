interface SimpleInterestParams {
    principal: number;
    rate: number;
    time: number;
  }
  
  interface SimpleInterestResult {
    value: number;
    interest: number;
  }
  
  export const calculateSimpleInterest = ({
    principal,
    rate,
    time
  }: SimpleInterestParams): SimpleInterestResult => {
    const interest = (principal * rate * time) / 100;
    const maturityAmount = principal + interest;
    return {
      value: maturityAmount,
      interest: interest,
    };
  };
  interface ChartData {
    year: string;
    Principal: number;
    'Total Value': number;
  }
  
  export const generateChartData = (
    principal: number,
    totalInterest: number,
    time: number,
    periodType: 'YR' | 'MO'
  ): ChartData[] => {
    const dataPoints: ChartData[] = [];
    const periods = periodType === 'YR' ? time : Math.ceil(time / 12);
    const interestPerPeriod = totalInterest / periods;
  
    for (let i = 1; i <= periods; i++) {
      dataPoints.push({
        year: `${i}${periodType === 'YR' ? ' Year' : ' Month'}`,
        Principal: principal,
        'Total Value': principal + interestPerPeriod * i
      });
    }
    return dataPoints;
  };