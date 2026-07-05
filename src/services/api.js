// Mock API service for Retail Analytics Platform
// Simulates a future FastAPI backend connected to Databricks Gold tables

import axios from 'axios';

// ----------------------------------------------------
// Mock Database Generator (Sample Superstore Schema)
// ----------------------------------------------------
const REGIONS = ['West', 'East', 'Central', 'South'];
const CATEGORIES = ['Technology', 'Furniture', 'Office Supplies'];
const CATEGORY_SUB_MAP = {
  'Technology': ['Phones', 'Accessories', 'Copiers', 'Machines'],
  'Furniture': ['Chairs', 'Tables', 'Bookcases', 'Furnishings'],
  'Office Supplies': ['Paper', 'Binders', 'Art', 'Appliances', 'Envelopes', 'Fasteners']
};

const REGION_STATES = {
  'West': [
    { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'] },
    { name: 'Washington', cities: ['Seattle', 'Tacoma', 'Spokane'] },
    { name: 'Oregon', cities: ['Portland', 'Salem', 'Eugene'] },
    { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa'] }
  ],
  'East': [
    { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
    { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown'] },
    { name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield'] },
    { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati'] }
  ],
  'Central': [
    { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio'] },
    { name: 'Illinois', cities: ['Chicago', 'Naperville', 'Aurora'] },
    { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Lansing'] },
    { name: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Bloomington'] }
  ],
  'South': [
    { name: 'Florida', cities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville'] },
    { name: 'Georgia', cities: ['Atlanta', 'Savannah', 'Augusta'] },
    { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro'] },
    { name: 'Virginia', cities: ['Richmond', 'Virginia Beach', 'Norfolk'] }
  ]
};

// Generate Mock Transactions (250 rows)
const generateMockTransactions = () => {
  const data = [];
  const startTimestamp = new Date(2025, 0, 1).getTime();
  const endTimestamp = new Date(2026, 6, 1).getTime();

  for (let i = 1; i <= 250; i++) {
    const orderDate = new Date(startTimestamp + Math.random() * (endTimestamp - startTimestamp));
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const subCategories = CATEGORY_SUB_MAP[category];
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    
    const states = REGION_STATES[region];
    const stateObj = states[Math.floor(Math.random() * states.length)];
    const state = stateObj.name;
    const city = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];
    
    const quantity = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const discount = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.8][Math.floor(Math.random() * 8)];
    
    // Base unit price by category
    let unitPrice = 0;
    if (category === 'Technology') unitPrice = Math.random() * 400 + 100;
    else if (category === 'Furniture') unitPrice = Math.random() * 250 + 50;
    else unitPrice = Math.random() * 45 + 5;

    const sales = parseFloat((unitPrice * quantity * (1 - discount)).toFixed(2));
    
    // Profit margin varies by category/discount
    let baseMargin = 0;
    if (category === 'Technology') baseMargin = 0.35;
    else if (category === 'Furniture') baseMargin = 0.08; // Furniture has low margins
    else baseMargin = 0.25;

    // High discount eats profit
    const profitMargin = baseMargin - (discount * 1.1); 
    const profit = parseFloat((sales * profitMargin).toFixed(2));

    data.push({
      id: `ORD-${2026}-${String(i).padStart(4, '0')}`,
      orderDate: orderDate.toISOString().split('T')[0],
      region,
      category,
      subCategory,
      state,
      city,
      quantity,
      discount,
      sales,
      profit
    });
  }
  return data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

let mockDatabase = generateMockTransactions();

// ----------------------------------------------------
// Helper for API simulated response delay
// ----------------------------------------------------
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// ----------------------------------------------------
// API Endpoints Functions
// ----------------------------------------------------

export const login = async (email, password) => {
  await delay(800);
  if (email && password.length >= 4) {
    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);
    return { success: true, token, email };
  }
  throw new Error('Invalid email or password (must be at least 4 characters)');
};

export const getDashboard = async () => {
  await delay(700);
  const totalSales = mockDatabase.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = mockDatabase.reduce((sum, item) => sum + item.profit, 0);
  const totalQuantity = mockDatabase.reduce((sum, item) => sum + item.quantity, 0);
  
  const uniqueRegions = new Set(mockDatabase.map(item => item.region)).size;
  const uniqueCategories = new Set(mockDatabase.map(item => item.category)).size;

  // Calculate monthly sales trend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendMap = {};
  
  mockDatabase.forEach(item => {
    const date = new Date(item.orderDate);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const displayLabel = `${months[date.getMonth()]} ${String(date.getFullYear()).substring(2)}`;
    
    if (!trendMap[yearMonth]) {
      trendMap[yearMonth] = { label: displayLabel, sales: 0, profit: 0, sortKey: yearMonth };
    }
    trendMap[yearMonth].sales += item.sales;
    trendMap[yearMonth].profit += item.profit;
  });

  const salesTrend = Object.values(trendMap)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({
      name: item.label,
      Sales: parseFloat(item.sales.toFixed(2)),
      Profit: parseFloat(item.profit.toFixed(2))
    }));

  return {
    kpis: {
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalQuantity,
      totalRegions: uniqueRegions,
      totalCategories: uniqueCategories,
      salesGrowth: +8.4,  // mock percentages
      profitGrowth: +12.3,
      quantityGrowth: +3.2
    },
    salesTrend
  };
};

export const getRegionSales = async () => {
  await delay(500);
  const regionMap = {};
  mockDatabase.forEach(item => {
    if (!regionMap[item.region]) {
      regionMap[item.region] = { region: item.region, sales: 0, profit: 0, quantity: 0 };
    }
    regionMap[item.region].sales += item.sales;
    regionMap[item.region].profit += item.profit;
    regionMap[item.region].quantity += item.quantity;
  });

  return Object.values(regionMap).map(item => ({
    region: item.region,
    sales: parseFloat(item.sales.toFixed(2)),
    profit: parseFloat(item.profit.toFixed(2)),
    quantity: item.quantity
  })).sort((a, b) => b.sales - a.sales);
};

export const getCategorySales = async () => {
  await delay(500);
  const categoryMap = {};
  mockDatabase.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { name: item.category, sales: 0, profit: 0, quantity: 0 };
    }
    categoryMap[item.category].sales += item.sales;
    categoryMap[item.category].profit += item.profit;
    categoryMap[item.category].quantity += item.quantity;
  });

  return Object.values(categoryMap).map(item => ({
    name: item.name,
    value: parseFloat(item.sales.toFixed(2)),
    profit: parseFloat(item.profit.toFixed(2)),
    quantity: item.quantity
  }));
};

export const getTopStates = async () => {
  await delay(600);
  const stateMap = {};
  mockDatabase.forEach(item => {
    if (!stateMap[item.state]) {
      stateMap[item.state] = { state: item.state, sales: 0, profit: 0, region: item.region };
    }
    stateMap[item.state].sales += item.sales;
    stateMap[item.state].profit += item.profit;
  });

  return Object.values(stateMap)
    .map(item => ({
      state: item.state,
      region: item.region,
      sales: parseFloat(item.sales.toFixed(2)),
      profit: parseFloat(item.profit.toFixed(2))
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
};

export const getDiscountAnalysis = async () => {
  await delay(500);
  const discountMap = {};
  mockDatabase.forEach(item => {
    const discPercent = (item.discount * 100).toFixed(0) + '%';
    if (!discountMap[discPercent]) {
      discountMap[discPercent] = { 
        discount: discPercent, 
        discountValue: item.discount,
        salesSum: 0, 
        profitSum: 0, 
        count: 0 
      };
    }
    discountMap[discPercent].salesSum += item.sales;
    discountMap[discPercent].profitSum += item.profit;
    discountMap[discPercent].count += 1;
  });

  return Object.values(discountMap)
    .map(item => ({
      discount: item.discount,
      discountValue: item.discountValue,
      avgSales: parseFloat((item.salesSum / item.count).toFixed(2)),
      avgProfit: parseFloat((item.profitSum / item.count).toFixed(2))
    }))
    .sort((a, b) => a.discountValue - b.discountValue);
};

// Advanced full dataset retrieve for Analytics Page
export const getAnalyticsData = async (filters = {}) => {
  await delay(800);
  let filtered = [...mockDatabase];

  if (filters.region && filters.region !== 'All') {
    filtered = filtered.filter(item => item.region === filters.region);
  }
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(item => item.category === filters.category);
  }
  if (filters.state && filters.state !== 'All') {
    filtered = filtered.filter(item => item.state === filters.state);
  }
  if (filters.discount && filters.discount !== 'All') {
    const rawDiscount = parseFloat(filters.discount) / 100;
    filtered = filtered.filter(item => Math.abs(item.discount - rawDiscount) < 0.01);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.id.toLowerCase().includes(searchLower) ||
      item.city.toLowerCase().includes(searchLower) ||
      item.state.toLowerCase().includes(searchLower) ||
      item.subCategory.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// File Upload Mock API
export const uploadCSV = async (file, onProgress) => {
  // Read first line of file if possible (in client side we mock this check)
  const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv';
  if (!isCSV) {
    throw new Error('Unsupported file format. Please upload a valid CSV file.');
  }

  // Simulate progress
  for (let p = 0; p <= 100; p += 20) {
    if (onProgress) onProgress(p);
    await delay(150);
  }

  // Mock validating CSV column structure
  // In a real app we would parse CSV header: "Region,Category,Sales,Profit,Discount,Quantity,State,City"
  // Let's assume validation succeeds
  
  // Create a new mock entry from this file
  const newTransactionsCount = 30; // simulate adding new rows
  const newTransactions = [];
  for (let i = 0; i < newTransactionsCount; i++) {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const states = REGION_STATES[region];
    const stateObj = states[Math.floor(Math.random() * states.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const sales = parseFloat((Math.random() * 300 + 10).toFixed(2));
    const profit = parseFloat((sales * 0.15).toFixed(2));

    newTransactions.push({
      id: `UP-${2026}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      region,
      category,
      subCategory: CATEGORY_SUB_MAP[category][0],
      state: stateObj.name,
      city: stateObj.cities[0],
      quantity,
      discount: 0.1,
      sales,
      profit
    });
  }

  // Prepend to database
  mockDatabase = [...newTransactions, ...mockDatabase];

  return {
    success: true,
    fileName: file.name,
    rowsProcessed: newTransactionsCount,
    message: 'CSV format validated and ingestion complete. Ready to run ETL Pipeline.'
  };
};

// Trigger ETL Pipeline Mock API
export const triggerPipeline = async (onStageUpdate) => {
  const stages = [
    { key: 'ingestion', name: 'Raw Ingestion', rows: 250, duration: '1.2s' },
    { key: 'bronze', name: 'Bronze (Delta Table Created)', rows: 250, duration: '2.5s' },
    { key: 'silver', name: 'Silver (Cleaned & De-duplicated)', rows: 238, duration: '3.1s' },
    { key: 'gold', name: 'Gold (Aggregated Gold Cubes)', rows: 28, duration: '4.2s' }
  ];

  await delay(500);

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    // Update stage to RUNNING
    if (onStageUpdate) {
      onStageUpdate({
        activeStage: stage.key,
        stageStatus: 'Running',
        progress: (i + 0.5) * 25,
        stagesList: stages.map((s, idx) => ({
          ...s,
          status: idx < i ? 'Completed' : idx === i ? 'Running' : 'Pending'
        }))
      });
    }

    await delay(1200); // simulate execution of each notebook

    // Update stage to COMPLETED
    if (onStageUpdate) {
      onStageUpdate({
        activeStage: stage.key,
        stageStatus: 'Completed',
        progress: (i + 1) * 25,
        stagesList: stages.map((s, idx) => ({
          ...s,
          status: idx <= i ? 'Completed' : idx === i + 1 ? 'Running' : 'Pending'
        }))
      });
    }
    await delay(300);
  }

  return {
    success: true,
    status: 'Succeeded',
    totalDuration: '11.0s',
    goldTablesUpdated: ['gold_region_sales', 'gold_category_sales', 'gold_top_states', 'gold_discount_analysis']
  };
};
