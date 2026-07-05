import React, { useState, useEffect, useMemo } from 'react';
import { getAnalyticsData, getDatasets } from '../services/api';
import { DataTable } from '../components/Tables';
import { SkeletonTable, SkeletonChart } from '../components/Loader';
import { formatCurrency, formatNumber, formatDiscount } from '../utils/helpers';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const Analytics = ({ isDark }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  
  // Filter States
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [discountFilter, setDiscountFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [datasetsList, setDatasetsList] = useState([]);
  const [datasetFilter, setDatasetFilter] = useState('all');

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const [data, allDatasets] = await Promise.all([
        getAnalyticsData({
          region: regionFilter,
          category: categoryFilter,
          state: stateFilter,
          discount: discountFilter,
          search: searchQuery,
          datasetId: datasetFilter
        }),
        getDatasets()
      ]);
      setTransactions(data);
      setDatasetsList(allDatasets.filter(d => d.status === 'Processed'));
    } catch (err) {
      console.error('Error fetching analytics transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [regionFilter, categoryFilter, stateFilter, discountFilter, searchQuery, datasetFilter]);

  // Derive unique values for filters from initial/full database if possible
  // For simplicity, we define standard static unique values matching our mock generator
  const regions = ['All', 'West', 'East', 'Central', 'South'];
  const categories = ['All', 'Technology', 'Furniture', 'Office Supplies'];
  const discounts = ['All', '0%', '10%', '20%', '30%', '40%', '50%', '70%', '80%'];
  const states = [
    'All', 'California', 'Washington', 'Oregon', 'Arizona',
    'New York', 'Pennsylvania', 'Massachusetts', 'Ohio',
    'Texas', 'Illinois', 'Michigan', 'Indiana',
    'Florida', 'Georgia', 'North Carolina', 'Virginia'
  ];

  // Derived Filtered Statistics
  const stats = useMemo(() => {
    const totalSales = transactions.reduce((sum, t) => sum + t.sales, 0);
    const totalProfit = transactions.reduce((sum, t) => sum + t.profit, 0);
    const totalQty = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const avgMargin = transactions.length > 0 ? (totalProfit / totalSales) * 100 : 0;
    
    return {
      sales: totalSales,
      profit: totalProfit,
      quantity: totalQty,
      margin: avgMargin,
      count: transactions.length
    };
  }, [transactions]);

  // Chart aggregations for filtered data
  const subCategoryChartData = useMemo(() => {
    const subCatMap = {};
    transactions.forEach(t => {
      if (!subCatMap[t.subCategory]) {
        subCatMap[t.subCategory] = { name: t.subCategory, sales: 0, profit: 0 };
      }
      subCatMap[t.subCategory].sales += t.sales;
      subCatMap[t.subCategory].profit += t.profit;
    });

    return Object.values(subCatMap)
      .map(item => ({
        name: item.name,
        Sales: parseFloat(item.Sales?.toFixed(2) || item.sales.toFixed(2)),
        Profit: parseFloat(item.Profit?.toFixed(2) || item.profit.toFixed(2))
      }))
      .sort((a, b) => b.Sales - a.Sales)
      .slice(0, 8);
  }, [transactions]);

  // Columns definition for the DataTable
  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'subCategory', label: 'Sub-Category', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'quantity', label: 'Qty', sortable: true },
    {
      key: 'discount',
      label: 'Discount',
      sortable: true,
      render: (val) => formatDiscount(val)
    },
    {
      key: 'sales',
      label: 'Sales',
      sortable: true,
      render: (val) => formatCurrency(val)
    },
    {
      key: 'profit',
      label: 'Profit',
      sortable: true,
      render: (val) => (
        <span className={val >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
          {formatCurrency(val)}
        </span>
      )
    }
  ];

  const chartLabelColor = isDark ? '#a1a7b5' : '#605e5c';
  const chartGridColor = isDark ? 'rgba(35, 48, 76, 0.5)' : 'rgba(237, 235, 233, 0.8)';

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
          Analytics Explorer
        </h1>
        <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium">
          Slice and dice transaction data using modern filters and interactive tables
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-5 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
        <div className="flex items-center space-x-2 border-b border-fabric-border-light pb-3 dark:border-fabric-border-dark mb-4">
          <Filter className="h-4.5 w-4.5 text-brand-blue dark:text-brand-orange" />
          <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">Filter Console</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {/* Region */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Region
            </span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none cursor-pointer focus:border-brand-blue/50 dark:focus:border-brand-orange/50"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Category
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none cursor-pointer focus:border-brand-blue/50 dark:focus:border-brand-orange/50"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              State
            </span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none cursor-pointer focus:border-brand-blue/50 dark:focus:border-brand-orange/50"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Discount */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Discount Rate
            </span>
            <select
              value={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.value)}
              className="rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none cursor-pointer focus:border-brand-blue/50 dark:focus:border-brand-orange/50"
            >
              {discounts.map(d => <option key={d} value={d === 'All' ? 'All' : d.replace('%','')}>{d}</option>)}
            </select>
          </div>

          {/* Dataset Source */}
          <div className="flex flex-col space-y-1.5 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Dataset Source
            </span>
            <select
              value={datasetFilter}
              onChange={(e) => setDatasetFilter(e.target.value)}
              className="rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none cursor-pointer focus:border-brand-blue/50 dark:focus:border-brand-orange/50"
            >
              <option value="all">All Gold Data</option>
              <option value="baseline">System Baseline</option>
              {datasetsList.map(ds => (
                <option key={ds.id} value={ds.id}>{ds.fileName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Statistics Panel */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Filtered Revenue</p>
          <p className="mt-1 text-lg font-bold text-fabric-text-light dark:text-fabric-text-dark">{formatCurrency(stats.sales)}</p>
        </div>
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Filtered Profit</p>
          <p className={`mt-1 text-lg font-bold ${stats.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(stats.profit)}
          </p>
        </div>
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Total Quantity</p>
          <p className="mt-1 text-lg font-bold text-fabric-text-light dark:text-fabric-text-dark">{formatNumber(stats.quantity)}</p>
        </div>
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Profit Margin</p>
          <p className="mt-1 text-lg font-bold text-fabric-text-light dark:text-fabric-text-dark">{stats.margin.toFixed(1)}%</p>
        </div>
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark text-center col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Order Rows</p>
          <p className="mt-1 text-lg font-bold text-fabric-text-light dark:text-fabric-text-dark">{formatNumber(stats.count)}</p>
        </div>
      </div>

      {/* Subcategory Visual Summary Chart */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <SkeletonChart />
        ) : (
          <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                Filtered Sub-Category Distribution
              </h3>
              <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">Interactive Slice</span>
            </div>
            <div className="h-[260px] w-full">
              {subCategoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subCategoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                    <XAxis dataKey="name" tick={{ fill: chartLabelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: chartLabelColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="Sales" fill="#0078d4" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="Profit" fill="#00b7c3" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  Select less restrictive filters to visualize distribution
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Transactions Grid */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          title="Superstore Transaction Records"
          searchPlaceholder="Search order ID, city, sub-category..."
          exportFileName="superstore-transactions"
          pageSize={8}
        />
      )}
    </div>
  );
};
export default Analytics;
