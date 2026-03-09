import { useState } from 'react';
import { transactions } from '../../data/mockData';
import type { Transaction } from '../../data/mockData';

const PAGE_SIZE = 8;

const statusStyles: Record<Transaction['status'], { bg: string; text: string; border: string; label: string }> = {
  completed: {
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#34d399',
    border: 'rgba(16, 185, 129, 0.3)',
    label: 'Completed',
  },
  pending: {
    bg: 'rgba(245, 158, 11, 0.15)',
    text: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'Pending',
  },
  failed: {
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#f87171',
    border: 'rgba(239, 68, 68, 0.3)',
    label: 'Failed',
  },
  refunded: {
    bg: 'rgba(100, 116, 139, 0.15)',
    text: '#94a3b8',
    border: 'rgba(100, 116, 139, 0.3)',
    label: 'Refunded',
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

interface Props {
  allRows?: boolean;
  filterStatus?: Transaction['status'] | 'all';
}

export default function TransactionsTable({ allRows = false, filterStatus = 'all' }: Props) {
  const [page, setPage] = useState(0);

  const filtered = filterStatus === 'all'
    ? transactions
    : transactions.filter((t) => t.status === filterStatus);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = allRows ? filtered : filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderColor: 'rgba(51, 65, 85, 0.5)',
      }}
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-base font-semibold text-white">Recent Transactions</h3>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} transactions total</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
              {['Date', 'Customer', 'Company', 'Category', 'Amount', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                  style={{ color: '#64748b' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => {
              const s = statusStyles[tx.status];
              return (
                <tr
                  key={tx.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: '1px solid rgba(30,41,59,0.8)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(51,65,85,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                    {tx.customer}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {tx.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        color: '#818cf8',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold whitespace-nowrap">
                    {formatAmount(tx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: s.bg,
                        color: s.text,
                        borderColor: s.border,
                      }}
                    >
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!allRows && totalPages > 1 && (
        <div
          className="px-6 py-4 flex items-center justify-between border-t"
          style={{ borderColor: 'rgba(51,65,85,0.5)' }}
        >
          <span className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(51,65,85,0.5)',
                color: '#64748b',
                border: '1px solid rgba(71,85,105,0.5)',
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(51,65,85,0.5)',
                color: '#64748b',
                border: '1px solid rgba(71,85,105,0.5)',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
