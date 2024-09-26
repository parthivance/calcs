// utils.ts
import { ChartConfiguration, Plugin } from 'chart.js';

export const formatIndianCurrency = (value: number): string => {
  value = Math.round(value * 10) / 10;
  let valueStr = value.toFixed(1);
  let afterPoint = "";
  if (valueStr.indexOf(".") > 0) {
    afterPoint = valueStr.substring(valueStr.indexOf("."), valueStr.length);
  }
  value = Math.floor(value);
  valueStr = value.toString();
  let lastThree = valueStr.substring(valueStr.length - 3);
  let otherNumbers = valueStr.substring(0, valueStr.length - 3);
  if (otherNumbers !== "") lastThree = "," + lastThree;
  return (
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint
  );
};

interface CalculateFDParams {
  isRecurring: boolean;
  principal: number;
  annualInterestRate: number;
  timePeriod: number;
  compoundingFrequency: number;
}

interface ChartData {
  investment: number;
  returns: number;
}

interface FDResult {
  value: string;
  chartData: ChartData;
}

export const calculateFD = ({
  isRecurring,
  principal,
  annualInterestRate,
  timePeriod,
  compoundingFrequency,
}: CalculateFDParams): FDResult => {
  const r = annualInterestRate / 100;
  const n = compoundingFrequency;
  const t = timePeriod;
  let maturityAmount = 0;
  if (isRecurring) {
    maturityAmount = principal * Math.pow(1 + r / n, n * t);
  } else {
    maturityAmount = principal * Math.pow(1 + r / n, n * t);
  }
  const returns = maturityAmount - principal;
  return {
    value: maturityAmount.toFixed(2),
    chartData: {
      investment: principal,
      returns,
    },
  };
};

export const generateChartData = (
  investment: number,
  rateOfInterest: number,
  period: number
) => {
  return Array.from({ length: period }, (_, i) => ({
    year: `${i + 1}Y`,
    Principal: investment,
    'Total Value': investment * Math.pow(1 + rateOfInterest / 100, i + 1)
  }));
};

export const calculateMonthlyEMI = (
  principal: number,
  annualInterestRate: number,
  timePeriodInYears: number
) => {
  const r = (annualInterestRate / 100) / 12;
  const n = timePeriodInYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const customBackgroundPlugin: Plugin<'line'> = {
  id: 'customBackground',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgb(246, 246, 246)';
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.restore();
  }
};

export const getChartOptions = (maxValue: number): ChartConfiguration<'line'>['options'] => {
  const yAxisMax = Math.ceil(maxValue * 1.2 / 5000) * 5000;
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: false,
        suggestedMin: 0,
        suggestedMax: yAxisMax,
        ticks: {
          callback: function (value) {
            return `₹${formatIndianCurrency(value as number)}`;
          },
          maxTicksLimit: 9,
        },
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
  };
};



// utils/logic.ts

interface GSTParams {
  amount: number;
  profitRatio: number;
  taxRate: number;
  isSameState: boolean;
}

interface GSTResult {
  amountBeforeGST: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export function calculateGST({ amount, profitRatio, taxRate, isSameState }: GSTParams): GSTResult {
  // Calculate the amount including profit
  const amountWithProfit = amount * (1 + profitRatio / 100);

  // Calculate GST amount
  const gstAmount = (amountWithProfit * taxRate) / 100;

  // Calculate total amount including GST
  const totalAmount = amountWithProfit + gstAmount;

  // Calculate CGST, SGST, and IGST
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isSameState) {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  } else {
    igst = gstAmount;
  }

  return {
    amountBeforeGST: amountWithProfit,
    gstAmount,
    totalAmount,
    cgst,
    sgst,
    igst
  };
}