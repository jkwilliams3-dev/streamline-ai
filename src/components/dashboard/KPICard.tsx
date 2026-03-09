import React from 'react';
import type { KPIMetric } from '../../data/mockData';

interface Props {
  metric: KPIMetric;
  delay?: number;
}

const iconMap: Record<string, React.ReactElement> = {
  dollar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  bag: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
};

export default function KPICard({ metric, delay = 0 }: Props) {
  const isPositive = metric.change >= 0;

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${metric.label}: ${metric.value}, ${metric.changeLabel} vs last month`}
    >
      <div
        className="rounded-xl p-6 border transition-all duration-300 cursor-default group"
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderColor: 'rgba(51, 65, 85, 0.5)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(99,102,241,0.05)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(51, 65, 85, 0.5)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{metric.label}</span>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
            }}
          >
            {iconMap[metric.icon]}
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <span className="text-3xl font-bold text-white">{metric.value}</span>
        </div>

        {/* Change */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
            style={{
              backgroundColor: isPositive
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
              color: isPositive ? '#34d399' : '#f87171',
            }}
          >
            {isPositive ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {metric.changeLabel}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  );
}
