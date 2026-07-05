import React, { useState, useEffect } from 'react';
import { getRegionSales, getCategorySales, getTopStates, getDiscountAnalysis } from '../services/api';
import { DataTable } from '../components/Tables';
import { SkeletonTable } from '../components/Loader';
import { formatCurrency, formatNumber, formatDiscount } from '../utils/helpers';
import { Database, FileCode, Play, Terminal } from 'lucide-react';

export const SQLReports = () => {
  const [activeTab, setActiveTab] = useState('region');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);

  const tabs = {
    region: {
      title: 'Sales by Region',
      table: 'workspace.retail_project.gold_region_sales',
      query: `SELECT \n  region,\n  ROUND(SUM(sales), 2) AS total_sales,\n  ROUND(SUM(profit), 2) AS total_profit,\n  SUM(quantity) AS total_quantity\nFROM workspace.retail_project.silver_sales\nGROUP BY region\nORDER BY total_sales DESC;`,
      fetch: getRegionSales,
      columns: [
        { key: 'region', label: 'Region', sortable: true },
        { key: 'sales', label: 'Total Sales', sortable: true, render: (v) => formatCurrency(v) },
        { key: 'profit', label: 'Total Profit', sortable: true, render: (v) => formatCurrency(v) },
        { key: 'quantity', label: 'Total Qty', sortable: true, render: (v) => formatNumber(v) }
      ]
    },
    category: {
      title: 'Sales by Category',
      table: 'workspace.retail_project.gold_category_sales',
      query: `SELECT \n  category,\n  ROUND(SUM(sales), 2) AS total_sales,\n  ROUND(SUM(profit), 2) AS total_profit,\n  SUM(quantity) AS total_quantity\nFROM workspace.retail_project.silver_sales\nGROUP BY category\nORDER BY total_sales DESC;`,
      fetch: getCategorySales,
      columns: [
        { key: 'name', label: 'Category', sortable: true },
        { key: 'value', label: 'Total Sales', sortable: true, render: (v) => formatCurrency(v) },
        { key: 'profit', label: 'Total Profit', sortable: true, render: (v) => formatCurrency(v) },
        { key: 'quantity', label: 'Total Qty', sortable: true, render: (v) => formatNumber(v) }
      ]
    },
    states: {
      title: 'Top States Analysis',
      table: 'workspace.retail_project.gold_top_states',
      query: `SELECT \n  state,\n  ROUND(SUM(sales), 2) AS total_sales\nFROM workspace.retail_project.silver_sales\nGROUP BY state\nORDER BY total_sales DESC\nLIMIT 10;`,
      fetch: getTopStates,
      columns: [
        { key: 'state', label: 'State', sortable: true },
        { key: 'region', label: 'Region', sortable: true },
        { key: 'sales', label: 'Total Sales', sortable: true, render: (v) => formatCurrency(v) }
      ]
    },
    discount: {
      title: 'Discount Analysis Matrix',
      table: 'workspace.retail_project.gold_discount_analysis',
      query: `SELECT \n  discount,\n  ROUND(AVG(sales), 2) AS avg_sales,\n  ROUND(AVG(profit), 2) AS avg_profit\nFROM workspace.retail_project.silver_sales\nGROUP BY discount\nORDER BY discount ASC;`,
      fetch: getDiscountAnalysis,
      columns: [
        { key: 'discount', label: 'Discount Rate', sortable: true },
        { key: 'avgSales', label: 'Avg Sales', sortable: true, render: (v) => formatCurrency(v) },
        { key: 'avgProfit', label: 'Avg Profit', sortable: true, render: (v) => formatCurrency(v) }
      ]
    }
  };

  const currentReport = tabs[activeTab];

  const runQuery = async () => {
    setLoading(true);
    try {
      const data = await currentReport.fetch();
      setReportData(data);
    } catch (err) {
      console.error('Error executing catalog report query:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runQuery();
  }, [activeTab]);

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
          SQL Warehouse Client
        </h1>
        <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium">
          Query the lakehouse catalogs and export schema report assets.
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-fabric-border-light pb-3.5 dark:border-fabric-border-dark">
        {Object.entries(tabs).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
              activeTab === key
                ? 'bg-brand-blue text-white shadow-md dark:bg-brand-orange'
                : 'border border-fabric-border-light bg-fabric-card-light text-fabric-text-light hover:bg-gray-100 dark:border-fabric-border-dark dark:bg-fabric-card-dark dark:text-fabric-text-dark dark:hover:bg-fabric-border-dark/55'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* Left Column: Query Editor Preview (1/3 width) */}
        <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark overflow-hidden flex flex-col transition-all duration-300">
          <div className="flex items-center justify-between border-b border-fabric-border-light bg-gray-50/50 px-5 py-3 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40">
            <div className="flex items-center space-x-2 text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">
              <FileCode className="h-4 w-4 text-gray-400" />
              <span>SQL Query Code</span>
            </div>
            <span className="rounded bg-brand-blue/10 dark:bg-brand-orange/15 px-1.5 py-0.5 text-[9px] font-bold text-brand-blue dark:text-brand-orange">
              {currentReport.table.split('.').pop()}
            </span>
          </div>

          {/* SQL Syntax Glow Block */}
          <div className="flex-1 bg-slate-950 p-4 font-mono text-[10px] leading-relaxed text-blue-400 select-all overflow-x-auto min-h-[160px]">
            <pre className="text-slate-300">{currentReport.query}</pre>
          </div>

          <div className="border-t border-fabric-border-light bg-gray-50/50 p-4 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40">
            <button
              onClick={runQuery}
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/15 py-3 text-xs font-bold text-brand-blue dark:bg-brand-orange/10 dark:hover:bg-brand-orange/15 dark:text-brand-orange transition-all"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Execute SQL Report</span>
            </button>
          </div>
        </div>

        {/* Right Column: Query Results Grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <SkeletonTable rows={6} />
          ) : (
            <DataTable
              columns={currentReport.columns}
              data={reportData}
              title={`Report Table: ${currentReport.table}`}
              searchPlaceholder="Filter columns..."
              exportFileName={currentReport.table.replace(/\./g, '-')}
              showSearch={true}
              pageSize={6}
            />
          )}

          {/* Console status */}
          <div className="rounded-2xl border border-fabric-border-light bg-gray-50/30 p-4 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/20 flex items-start space-x-3 text-[10px] font-mono text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
            <Terminal className="h-4 w-4 text-brand-blue dark:text-brand-orange shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-fabric-text-light dark:text-fabric-text-dark">Execution Metadata:</span>
              <p className="mt-1">Status: Query execution completed successfully. Row limit evaluated.</p>
              <p>Duration: 0.04s. Target Table: {currentReport.table}.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default SQLReports;
