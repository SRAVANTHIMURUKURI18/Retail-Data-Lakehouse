import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const AnimatedCounter = ({ value, isCurrency = false, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Cubic ease-out formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {isCurrency
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(count)
        : new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
          }).format(count)}
    </span>
  );
};

export const KPICard = ({ title, value, growth, icon: Icon, isCurrency = false, accentColor = 'blue' }) => {
  const isPositive = growth >= 0;

  const accentClasses = {
    blue: {
      text: 'text-brand-blue dark:text-blue-400',
      bg: 'bg-brand-blue/10 dark:bg-blue-900/30',
      border: 'hover:border-brand-blue/30 dark:hover:border-blue-500/30 shadow-blue-500/5'
    },
    orange: {
      text: 'text-brand-orange dark:text-orange-400',
      bg: 'bg-brand-orange/10 dark:bg-orange-900/30',
      border: 'hover:border-brand-orange/30 dark:hover:border-orange-500/30 shadow-orange-500/5'
    },
    yellow: {
      text: 'text-brand-yellow dark:text-yellow-400',
      bg: 'bg-brand-yellow/10 dark:bg-yellow-900/30',
      border: 'hover:border-brand-yellow/30 dark:hover:border-yellow-500/30 shadow-yellow-500/5'
    },
    teal: {
      text: 'text-brand-teal dark:text-teal-400',
      bg: 'bg-brand-teal/10 dark:bg-teal-900/30',
      border: 'hover:border-brand-teal/30 dark:hover:border-teal-500/30 shadow-teal-500/5'
    },
    purple: {
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-600/10 dark:bg-purple-900/30',
      border: 'hover:border-purple-500/30 dark:hover:border-purple-500/30 shadow-purple-500/5'
    }
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.blue;

  return (
    <div className={`group relative rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-fabric-border-dark dark:bg-fabric-card-dark ${currentAccent.border} hover:-translate-y-0.5`}>
      {/* Decorative radial gradient glow */}
      <div className="absolute -inset-px rounded-2xl bg-radial from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:to-white/5 pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
          {title}
        </span>
        <div className={`rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110 ${currentAccent.bg} ${currentAccent.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="font-display text-3xl font-bold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
          <AnimatedCounter value={value} isCurrency={isCurrency} />
        </div>
        
        <div className="mt-2 flex items-center space-x-1.5">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            isPositive 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="mr-1 h-3.5 w-3.5" />
            )}
            {Math.abs(growth)}%
          </span>
          <span className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
};
