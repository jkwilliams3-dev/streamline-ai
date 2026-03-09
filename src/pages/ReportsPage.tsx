import { useState } from 'react';
import { transactions } from '../data/mockData';
import type { Transaction } from '../data/mockData';
import TransactionsTable from '../components/dashboard/TransactionsTable';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

const summaryCardStyle = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderColor: 'rgba(51, 65, 85, 0.5)',
};

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('2025-12-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && d < start) return false;
    if (end && d > end) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = filtered.reduce((s, t) => s + t.amount, 0);
  const completedCount = filtered.filter((t) => t.status === 'completed').length;
  const successRate = filtered.length > 0 ? ((completedCount / filtered.length) * 100).toFixed(1) : '0';
  const avgTransaction = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Date', 'Customer', 'Company', 'Category', 'Amount', 'Status'];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.customer,
      t.company,
      t.category,
      t.amount.toFixed(2),
      t.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streamlineai-transactions-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const inputStyle = {
    backgroundColor: '#e2e8f0',
    border: '1px solid #334155',
    color: '#1e293b',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    colorScheme: 'dark' as const,
  };

  const summaryCards = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '$', color: '#6366f1' },
    { label: 'Total Transactions', value: String(filtered.length), icon: '#', color: '#8b5cf6' },
    { label: 'Avg Transaction', value: formatCurrency(avgTransaction), icon: '~', color: '#a78bfa' },
    { label: 'Success Rate', value: `${successRate}%`, icon: '%', color: '#34d399' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-500 mt-1">Transaction history and financial summaries</p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background: downloadSuccess
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          }}
        >
          {downloadSuccess ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Downloaded!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CSV
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-5 border mb-6 flex flex-wrap gap-4 items-end"
        style={summaryCardStyle}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Transaction['status'] | 'all')}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 border"
            style={summaryCardStyle}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${card.color}20`, color: card.color }}
              >
                {card.icon}
              </span>
            </div>
            <span className="text-2xl font-bold text-white">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <TransactionsTable allRows filterStatus={statusFilter} />
    </div>
  );
}
