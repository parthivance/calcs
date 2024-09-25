import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '../../utils/logic';

interface ChartData {
  year: string;
  Principal: number;
  'Total Value': number;
}

const CustomFDChart: React.FC<{ data: ChartData[], height: number }> = ({ data, height }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis
          dataKey="year"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          tickFormatter={(value) => `₹${formatIndianCurrency(value)}`}
        />
        <Tooltip
          contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          formatter={(value: string | number | Array<string | number>, name: string) => {
            const formattedValue = Array.isArray(value) 
              ? value.map(v => `₹${formatIndianCurrency(Number(v))}`) 
              : `₹${formatIndianCurrency(Number(value))}`;
            return [formattedValue, name];
          }}
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
        />
        {/* Render "Total Value" first so it is under "Principal" */}
        <Area
          type="monotone"
          dataKey="Total Value"
          stroke="#58E791"
          fill="#58E791"
          fillOpacity={0.5}
          strokeWidth={2}
        />
        {/* Render "Principal" last to ensure it is on top */}
        <Area
          type="monotone"
          dataKey="Principal"
          stroke="#1AC27E"
          fill="#1AC27E"
          fillOpacity={0.5}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomFDChart;