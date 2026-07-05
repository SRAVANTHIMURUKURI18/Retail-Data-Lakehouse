import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const DataTable = ({
  columns = [],
  data = [],
  title = '',
  searchPlaceholder = 'Search records...',
  showSearch = true,
  showExport = true,
  exportFileName = 'report-data',
  defaultSortField = '',
  defaultSortDirection = 'asc',
  pageSize = 8
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Handle Sort Change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle numbers
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      
      // Handle strings
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  
  // Reset page when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Export CSV Action
  const exportToCSV = () => {
    if (data.length === 0) return;
    
    // Headers line
    const headersLine = columns.map(c => `"${c.label}"`).join(',');
    
    // Rows line
    const rowsLines = data.map(row => 
      columns.map(c => {
        let val = row[c.key];
        // Handle rendering override or formatting in csv
        if (c.key === 'sales' || c.key === 'profit' || c.key === 'total_sales' || c.key === 'total_profit') {
          return `"${val}"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const blob = new Blob([[headersLine, ...rowsLines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-4 rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
      
      {/* Title + Controls Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {title && (
          <h3 className="font-display text-lg font-bold text-fabric-text-light dark:text-fabric-text-dark">
            {title}
          </h3>
        )}

        <div className="flex flex-1 items-center justify-end space-x-3 max-w-lg w-full ml-auto">
          {showSearch && (
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 py-2 pl-9 pr-4 text-xs text-fabric-text-light placeholder-gray-400 outline-none transition-all focus:border-brand-blue/50 focus:bg-white dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark dark:focus:border-brand-orange/50 dark:focus:bg-fabric-bg-dark"
              />
            </div>
          )}

          {showExport && (
            <button
              onClick={exportToCSV}
              disabled={data.length === 0}
              className="flex items-center space-x-2 rounded-xl bg-brand-blue px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-brand-blue/90 dark:bg-brand-orange dark:hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-fabric-border-light dark:border-fabric-border-dark">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-fabric-border-light bg-gray-50 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/60">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-5 py-4 font-semibold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark ${
                    col.sortable ? 'cursor-pointer select-none hover:text-fabric-text-light dark:hover:text-fabric-text-dark' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.label}</span>
                    {col.sortable && sortField === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-fabric-border-light dark:divide-fabric-border-dark">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  className="bg-white hover:bg-gray-50/50 dark:bg-fabric-card-dark dark:hover:bg-fabric-bg-dark/30 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-5 py-3.5 font-medium text-fabric-text-light dark:text-fabric-text-dark whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                    <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <span className="text-sm font-medium">No records matching your search</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-fabric-border-light pt-4 dark:border-fabric-border-dark">
          <div className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
            Showing <span className="font-semibold text-fabric-text-light dark:text-fabric-text-dark">
              {Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}
            </span> to <span className="font-semibold text-fabric-text-light dark:text-fabric-text-dark">
              {Math.min(sortedData.length, currentPage * pageSize)}
            </span> of <span className="font-semibold text-fabric-text-light dark:text-fabric-text-dark">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-fabric-border-light p-1.5 text-fabric-text-light hover:bg-gray-50 dark:border-fabric-border-dark dark:text-fabric-text-dark dark:hover:bg-fabric-bg-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isSelected = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-brand-blue text-white dark:bg-brand-orange'
                      : 'border border-fabric-border-light text-fabric-text-light hover:bg-gray-50 dark:border-fabric-border-dark dark:text-fabric-text-dark dark:hover:bg-fabric-bg-dark'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-fabric-border-light p-1.5 text-fabric-text-light hover:bg-gray-50 dark:border-fabric-border-dark dark:text-fabric-text-dark dark:hover:bg-fabric-bg-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
