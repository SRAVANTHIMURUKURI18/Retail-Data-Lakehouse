import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Theme Colors Configuration
const COLORS = {
  blue: '#0078d4',
  orange: '#ff6f00',
  yellow: '#f2c811',
  teal: '#00b7c3',
  purple: '#8e24aa',
  emerald: '#10b981'
};

const PIE_COLORS = [COLORS.blue, COLORS.orange, COLORS.teal, COLORS.yellow, COLORS.purple];

// Custom Tooltip component for consistent style
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-fabric-border-light bg-fabric-card-light/95 p-3 shadow-xl backdrop-blur-md dark:border-fabric-border-dark dark:bg-fabric-card-dark/95">
        {label && <p className="mb-1 font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">{label}</p>}
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }}></span>
              <span className="text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">{item.name}:</span>
              <span className="font-semibold text-fabric-text-light dark:text-fabric-text-dark">
                {formatter ? formatter(item.value) : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 1. Sales by Region (Bar Chart)
export const SalesByRegionChart = ({ data, isDark }) => {
  const labelColor = isDark ? '#a1a7b5' : '#605e5c';
  const gridColor = isDark ? 'rgba(35, 48, 76, 0.5)' : 'rgba(237, 235, 233, 0.8)';

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="region" 
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
          />
          <Tooltip content={<CustomTooltip formatter={(v) => `$${new Intl.NumberFormat('en-US').format(v)}`} />} />
          <Bar dataKey="sales" name="Sales" fill={COLORS.blue} radius={[6, 6, 0, 0]} maxBarSize={45}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.blue : index === 1 ? COLORS.teal : index === 2 ? COLORS.orange : COLORS.yellow} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Sales by Category (Pie Chart)
export const SalesByCategoryChart = ({ data, isDark }) => {
  const legendColor = isDark ? '#f3f2f1' : '#323130';

  return (
    <div className="h-[300px] w-full flex flex-col justify-center">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={(v) => `$${new Intl.NumberFormat('en-US').format(v)}`} />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => (
              <span className="text-xs font-semibold px-1" style={{ color: legendColor }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Profit by Region (Horizontal Bar Chart)
export const ProfitByRegionChart = ({ data, isDark }) => {
  const labelColor = isDark ? '#a1a7b5' : '#605e5c';
  const gridColor = isDark ? 'rgba(35, 48, 76, 0.5)' : 'rgba(237, 235, 233, 0.8)';

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis 
            type="number"
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
          />
          <YAxis 
            dataKey="region" 
            type="category"
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip formatter={(v) => `$${new Intl.NumberFormat('en-US').format(v)}`} />} />
          <Bar dataKey="profit" name="Profit" fill={COLORS.teal} radius={[0, 6, 6, 0]} maxBarSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Discount Analysis (Line Chart)
export const DiscountAnalysisChart = ({ data, isDark }) => {
  const labelColor = isDark ? '#a1a7b5' : '#605e5c';
  const gridColor = isDark ? 'rgba(35, 48, 76, 0.5)' : 'rgba(237, 235, 233, 0.8)';

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="discount" 
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: labelColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip formatter={(v) => `$${new Intl.NumberFormat('en-US').format(v)}`} />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs font-semibold px-1 dark:text-fabric-text-dark text-fabric-text-light">{value}</span>
            )}
          />
          <Line 
            type="monotone" 
            dataKey="avgSales" 
            name="Average Sales" 
            stroke={COLORS.orange} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="avgProfit" 
            name="Average Profit" 
            stroke={COLORS.blue} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
