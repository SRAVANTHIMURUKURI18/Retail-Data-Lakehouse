import React, { useState, useEffect } from 'react';
import { getDashboard, getRegionSales, getCategorySales, getTopStates, getDiscountAnalysis } from '../services/api';
import { KPICard } from '../components/KPICard';
import { 
  SalesByRegionChart, 
  SalesByCategoryChart, 
  ProfitByRegionChart, 
  DiscountAnalysisChart 
} from '../components/Charts';
import { SkeletonKPI, SkeletonChart, SkeletonTable } from '../components/Loader';
import { formatCurrency, formatNumber } from '../utils/helpers';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  MapPin, 
  Tag, 
  ArrowUpRight, 
  RefreshCw 
} from 'lucide-react';

export const Dashboard = ({ isDark }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [regionSales, setRegionSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [discountAnalysis, setDiscountAnalysis] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dash, reg, cat, states, disc] = await Promise.all([
        getDashboard(),
        getRegionSales(),
        getCategorySales(),
        getTopStates(),
        getDiscountAnalysis()
      ]);
      setDashboardData(dash);
      setRegionSales(reg);
      setCategorySales(cat);
      setTopStates(states);
      setDiscountAnalysis(disc);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonKPI key={i} />)}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonChart key={i} />)}
        </div>
        {/* Skeleton Table */}
        <SkeletonTable />
      </div>
    );
  }

  const { kpis } = dashboardData;

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
            Lakehouse Dashboard
          </h1>
          <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium mt-0.5">
            Real-time analytics aggregated from Databricks Gold tables
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 rounded-xl border border-fabric-border-light bg-fabric-card-light px-3.5 py-2 text-xs font-semibold text-fabric-text-light hover:bg-gray-50 dark:border-fabric-border-dark dark:bg-fabric-card-dark dark:text-fabric-text-dark dark:hover:bg-fabric-border-dark/55 transition-all shadow-sm hover:-translate-y-0.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Sales"
          value={kpis.totalSales}
          growth={kpis.salesGrowth}
          icon={DollarSign}
          isCurrency={true}
          accentColor="blue"
        />
        <KPICard
          title="Total Profit"
          value={kpis.totalProfit}
          growth={kpis.profitGrowth}
          icon={TrendingUp}
          isCurrency={true}
          accentColor="teal"
        />
        <KPICard
          title="Total Quantity"
          value={kpis.totalQuantity}
          growth={kpis.quantityGrowth}
          icon={ShoppingCart}
          isCurrency={false}
          accentColor="orange"
        />
        <KPICard
          title="Total Regions"
          value={kpis.totalRegions}
          growth={0.0}
          icon={MapPin}
          isCurrency={false}
          accentColor="yellow"
        />
        <KPICard
          title="Total Categories"
          value={kpis.totalCategories}
          growth={0.0}
          icon={Tag}
          isCurrency={false}
          accentColor="purple"
        />
      </div>

      {/* Recharts Grid (Sales by Region & Sales by Category) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Sales by Region
            </h3>
            <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">Gold Level Cube</span>
          </div>
          <SalesByRegionChart data={regionSales} isDark={isDark} />
        </div>

        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Sales by Category
            </h3>
            <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">Distribution Analysis</span>
          </div>
          <SalesByCategoryChart data={categorySales} isDark={isDark} />
        </div>
      </div>

      {/* Recharts Grid 2 (Profit by Region & Discount Analysis) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Profit by Region
            </h3>
            <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">Bottom-Line Performance</span>
          </div>
          <ProfitByRegionChart data={regionSales} isDark={isDark} />
        </div>

        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Discount Performance Analysis
            </h3>
            <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">Sales vs Profit Margin</span>
          </div>
          <DiscountAnalysisChart data={discountAnalysis} isDark={isDark} />
        </div>
      </div>

      {/* Top States Table (Dashboard Highlight version) */}
      <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Top Performing States
            </h3>
            <p className="text-[11px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark mt-0.5">
              Top 5 States by total revenue generated
            </p>
          </div>
          <a
            href="/analytics"
            className="flex items-center space-x-1 text-xs font-bold text-brand-blue hover:underline dark:text-brand-orange"
          >
            <span>View All Data</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto rounded-xl border border-fabric-border-light dark:border-fabric-border-dark">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-fabric-border-light bg-gray-50 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/60">
                <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">State</th>
                <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Region</th>
                <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark text-right">Total Revenue</th>
                <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark text-right">Bottom-line Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fabric-border-light dark:divide-fabric-border-dark">
              {topStates.slice(0, 5).map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-fabric-bg-dark/20 transition-colors">
                  <td className="px-5 py-3 font-bold text-fabric-text-light dark:text-fabric-text-dark">{row.state}</td>
                  <td className="px-5 py-3 text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">{row.region}</td>
                  <td className="px-5 py-3 text-right font-semibold text-fabric-text-light dark:text-fabric-text-dark">
                    {formatCurrency(row.sales)}
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold ${row.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {formatCurrency(row.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
