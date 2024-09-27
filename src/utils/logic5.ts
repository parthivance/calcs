// Add these imports if not already present
import { formatIndianCurrency } from './logic';

interface RetirementParams {
  age: number;
  monthlyExpenditure: number;
  retirementStyle: 'Live like a king' | 'I am happy the way I am' | 'Like a monk';
  savingStyle: 'Safe (PF,FD,ETC)' | 'Aggressive (mutual funds, equity, etc)';
}

interface RetirementResult {
  totalRequired: number;
  monthlySavingsRequired: number;
  chartData: Array<{ year: string; Principal: number; 'Total Value': number }>;
}

export function calculateRetirement({
  age,
  monthlyExpenditure,
  retirementStyle,
  savingStyle
}: RetirementParams): RetirementResult {
  const retirementAge = 60;
  const yearsUntilRetirement = retirementAge - age;
  const annualExpenditure = monthlyExpenditure * 12;
  const inflationRate = 0.06; // 6% annual inflation
  const returnRate = savingStyle === 'Safe (PF,FD,ETC)' ? 0.07 : 0.12; // 7% for safe, 12% for aggressive
  const retirementYears = 25; // Assuming 25 years of retirement

  // Calculate future annual expenditure considering inflation
  const futureAnnualExpenditure = annualExpenditure * Math.pow(1 + inflationRate, yearsUntilRetirement);

  // Calculate total required amount for retirement
  let totalRequired = futureAnnualExpenditure * retirementYears;

  // Adjust total required based on retirement style
  if (retirementStyle === 'Live like a king') {
    totalRequired *= 1.5;
  } else if (retirementStyle === 'Like a monk') {
    totalRequired *= 0.75;
  }

  // Calculate monthly savings required
  const monthlySavingsRequired = calculateMonthlySavingsRequired(totalRequired, returnRate, yearsUntilRetirement);

  // Generate chart data
  const chartData = generateRetirementChartData(monthlySavingsRequired * 12, returnRate, yearsUntilRetirement);

  return {
    totalRequired,
    monthlySavingsRequired,
    chartData
  };
}

function calculateMonthlySavingsRequired(
  totalRequired: number,
  annualReturnRate: number,
  yearsUntilRetirement: number
): number {
  const monthlyRate = annualReturnRate / 12;
  const totalMonths = yearsUntilRetirement * 12;
  
  return totalRequired * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
}

function generateRetirementChartData(
  annualSavings: number,
  annualReturnRate: number,
  years: number
): Array<{ year: string; Principal: number; 'Total Value': number }> {
  let totalPrincipal = 0;
  let totalValue = 0;

  return Array.from({ length: years }, (_, i) => {
    totalPrincipal += annualSavings;
    totalValue = (totalValue + annualSavings) * (1 + annualReturnRate);

    return {
      year: `${i + 1}Y`,
      Principal: Math.round(totalPrincipal),
      'Total Value': Math.round(totalValue)
    };
  });
}

// Update the existing generateChartData function to use the new logic
export const generateChartData = (
  annualSavings: number,
  annualReturnRate: number,
  years: number
) => {
  return generateRetirementChartData(annualSavings, annualReturnRate / 100, years);
};