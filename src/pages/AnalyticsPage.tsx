import KPICard from '../components/dashboard/KPICard';
import RevenueChart from '../components/dashboard/RevenueChart';
import TrafficChart from '../components/dashboard/TrafficChart';
import DeviceChart from '../components/dashboard/DeviceChart';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { kpiMetrics } from '../data/mockData';

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your key metrics and performance</p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#a5b4fc',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Jan 1 – Dec 31, 2025
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="grid gap-6 mb-8"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
      >
        {kpiMetrics.map((metric, i) => (
          <KPICard key={metric.id} metric={metric} delay={i * 80} />
        ))}
      </div>

      {/* Charts row: Revenue (left) + Device (right) */}
      <div
        className="grid gap-6 mb-6"
        style={{ gridTemplateColumns: '3fr 2fr' }}
      >
        <RevenueChart />
        <DeviceChart />
      </div>

      {/* Traffic chart */}
      <div className="mb-6">
        <TrafficChart />
      </div>

      {/* Transactions table */}
      <TransactionsTable />
    </div>
  );
}
