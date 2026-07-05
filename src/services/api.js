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

const GOLD_STORAGE_KEY = 'lakehouse_gold_db';
const DATASETS_STORAGE_KEY = 'lakehouse_datasets';

const getGoldDatabase = () => {
  const stored = localStorage.getItem(GOLD_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored mock database, regenerating...", e);
    }
  }
  const initial = generateMockTransactions();
  localStorage.setItem(GOLD_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const getDatasetsList = () => {
  const stored = localStorage.getItem(DATASETS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored datasets list, returning empty...", e);
    }
  }
  return [];
};

const saveGoldDatabase = (data) => {
  localStorage.setItem(GOLD_STORAGE_KEY, JSON.stringify(data));
};

const saveDatasetsList = (datasets) => {
  localStorage.setItem(DATASETS_STORAGE_KEY, JSON.stringify(datasets));
};

// Expose datasets and database controls
export const getDatasets = async () => {
  await delay(300);
  return getDatasetsList();
};

export const deleteDataset = async (datasetId) => {
  await delay(400);
  const datasets = getDatasetsList().filter(d => d.id !== datasetId);
  saveDatasetsList(datasets);

  // Remove rows from gold database
  const goldDb = getGoldDatabase().filter(item => item.sourceDatasetId !== datasetId);
  saveGoldDatabase(goldDb);
};

export const resetLakehouse = async () => {
  await delay(500);
  localStorage.removeItem(GOLD_STORAGE_KEY);
  localStorage.removeItem(DATASETS_STORAGE_KEY);
};

// Simple CSV Line Parser that handles quotes
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const getFilteredDatabase = (datasetId) => {
  const goldDb = getGoldDatabase();
  if (!datasetId || datasetId === 'all') {
    return goldDb;
  }
  if (datasetId === 'baseline') {
    return goldDb.filter(item => !item.sourceDatasetId);
  }
  return goldDb.filter(item => item.sourceDatasetId === datasetId);
};

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

export const getDashboard = async (filters = {}) => {
  await delay(700);
  const db = getFilteredDatabase(filters.datasetId);
  const totalSales = db.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = db.reduce((sum, item) => sum + item.profit, 0);
  const totalQuantity = db.reduce((sum, item) => sum + item.quantity, 0);
  
  const uniqueRegions = new Set(db.map(item => item.region)).size;
  const uniqueCategories = new Set(db.map(item => item.category)).size;

  // Calculate monthly sales trend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendMap = {};
  
  db.forEach(item => {
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

export const getRegionSales = async (filters = {}) => {
  await delay(500);
  const db = getFilteredDatabase(filters.datasetId);
  const regionMap = {};
  db.forEach(item => {
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

export const getCategorySales = async (filters = {}) => {
  await delay(500);
  const db = getFilteredDatabase(filters.datasetId);
  const categoryMap = {};
  db.forEach(item => {
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

export const getTopStates = async (filters = {}) => {
  await delay(600);
  const db = getFilteredDatabase(filters.datasetId);
  const stateMap = {};
  db.forEach(item => {
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

export const getDiscountAnalysis = async (filters = {}) => {
  await delay(500);
  const db = getFilteredDatabase(filters.datasetId);
  const discountMap = {};
  db.forEach(item => {
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
  let filtered = getFilteredDatabase(filters.datasetId);

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
  for (let p = 0; p <= 100; p += 25) {
    if (onProgress) onProgress(p);
    await delay(100);
  }

  let text;
  try {
    text = await file.text();
  } catch (err) {
    throw new Error('Failed to read file contents.');
  }

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows.');
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  const requiredHeaders = ['region', 'category', 'sales', 'profit', 'discount', 'quantity', 'state', 'city'];
  
  // Check if all required headers exist
  const headerMap = {};
  headers.forEach((h, idx) => {
    headerMap[h.toLowerCase()] = idx;
  });

  const missingHeaders = requiredHeaders.filter(req => headerMap[req] === undefined);
  if (missingHeaders.length > 0) {
    throw new Error(`Invalid CSV headers. Missing: ${missingHeaders.map(h => h.charAt(0).toUpperCase() + h.slice(1)).join(', ')}.`);
  }

  const datasetId = 'ds_' + Math.random().toString(36).substring(2, 10);
  const parsedTransactions = [];
  const startIdx = getGoldDatabase().length + 1;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < requiredHeaders.length) continue; // Skip malformed lines

    const region = values[headerMap['region']];
    const category = values[headerMap['category']];
    const salesVal = parseFloat(values[headerMap['sales']]);
    const profitVal = parseFloat(values[headerMap['profit']]);
    const discountVal = parseFloat(values[headerMap['discount']]);
    const quantityVal = parseInt(values[headerMap['quantity']], 10);
    const state = values[headerMap['state']];
    const city = values[headerMap['city']];

    if (isNaN(salesVal) || isNaN(profitVal) || isNaN(discountVal) || isNaN(quantityVal)) {
      continue;
    }

    const subCategory = headerMap['subcategory'] !== undefined 
      ? values[headerMap['subcategory']] 
      : (CATEGORY_SUB_MAP[category]?.[0] || 'Other');
      
    const orderDate = headerMap['order date'] !== undefined 
      ? values[headerMap['order date']] 
      : (headerMap['orderdate'] !== undefined 
         ? values[headerMap['orderdate']] 
         : new Date().toISOString().split('T')[0]);

    parsedTransactions.push({
      id: `UP-${2026}-${String(startIdx + i).padStart(4, '0')}`,
      sourceDatasetId: datasetId,
      orderDate,
      region,
      category,
      subCategory,
      state,
      city,
      quantity: quantityVal,
      discount: discountVal,
      sales: salesVal,
      profit: profitVal
    });
  }

  if (parsedTransactions.length === 0) {
    throw new Error('No valid transaction rows found in the CSV.');
  }

  const newDataset = {
    id: datasetId,
    fileName: file.name,
    uploadedAt: new Date().toLocaleString(),
    rowsCount: parsedTransactions.length,
    data: parsedTransactions,
    status: 'Ingested'
  };

  const datasets = getDatasetsList();
  saveDatasetsList([...datasets, newDataset]);

  return {
    success: true,
    fileName: file.name,
    rowsProcessed: parsedTransactions.length,
    message: 'CSV format validated and ingestion complete. Ready to run ETL Pipeline.'
  };
};

// Trigger ETL Pipeline Mock API
export const triggerPipeline = async (onStageUpdate) => {
  const datasets = getDatasetsList();
  const pendingDatasets = datasets.filter(d => d.status === 'Ingested');
  const pendingRows = pendingDatasets.reduce((sum, d) => sum + d.rowsCount, 0);

  const stages = [
    { key: 'ingestion', name: 'Raw Ingestion', rows: pendingRows, duration: '1.2s' },
    { key: 'bronze', name: 'Bronze (Delta Table Created)', rows: pendingRows, duration: '2.5s' },
    { key: 'silver', name: 'Silver (Cleaned & De-duplicated)', rows: pendingRows, duration: '3.1s' },
    { key: 'gold', name: 'Gold (Aggregated Gold Cubes)', rows: pendingDatasets.length > 0 ? 28 + pendingDatasets.length : 28, duration: '4.2s' }
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

  // Update status of ingested datasets and merge into Gold DB
  if (pendingDatasets.length > 0) {
    let goldDb = getGoldDatabase();
    
    pendingDatasets.forEach(d => {
      // Prepend the data
      goldDb = [...d.data, ...goldDb];
      d.status = 'Processed';
    });

    saveGoldDatabase(goldDb);
    saveDatasetsList(datasets);
  }

  return {
    success: true,
    status: 'Succeeded',
    totalDuration: '11.0s',
    goldTablesUpdated: ['gold_region_sales', 'gold_category_sales', 'gold_top_states', 'gold_discount_analysis'],
    processedFiles: pendingDatasets.map(d => d.fileName)
  };
};
