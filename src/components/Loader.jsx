import React from 'react';

// Full Page Glassmorphic Spinner
export const PageLoader = ({ message = 'Loading system assets...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-fabric-bg-light/80 dark:bg-fabric-bg-dark/80 backdrop-blur-md transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-brand-blue/20 dark:bg-brand-orange/20"></div>
        {/* Spinner rings */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-brand-blue border-r-brand-orange dark:border-t-brand-orange dark:border-r-brand-yellow"></div>
      </div>
      <p className="mt-4 font-display text-sm font-semibold tracking-wide text-brand-blue dark:text-brand-orange animate-pulse">
        {message}
      </p>
    </div>
  );
};

// KPI Card Skeleton
export const SkeletonKPI = () => {
  return (
    <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="mt-4 h-8 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mt-2 h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
};

// Chart Panel Skeleton
export const SkeletonChart = () => {
  return (
    <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-pulse">
      <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-6"></div>
      <div className="h-[250px] w-full rounded bg-gray-200/50 dark:bg-gray-700/50 flex items-end p-4 space-x-4">
        <div className="h-[40%] flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-[75%] flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-[55%] flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-[90%] flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

// Data Table Skeleton
export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="space-y-3">
        <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-gray-200/50 dark:bg-gray-700/30"></div>
        ))}
      </div>
    </div>
  );
};
