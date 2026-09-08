import React, { useState, useMemo } from 'react';
import { Granularity, MetricMode, ProviderFilter, UserPlatformSummary, UserUsageItem } from '../types';
import { formatCurrency, formatTokens } from '../utils/analytics';
import {
  Award,
  Flame,
  AlertCircle,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Users,
  Table,
  LayoutGrid,
  Calendar,
} from 'lucide-react';

interface TopUsersGridProps {
  claudeUsers: UserPlatformSummary[];
  copilotUsers: UserPlatformSummary[];
  allUsers: UserUsageItem[];
  claudeMedian: number;
  copilotMedian: number;
  claudeTotalCost: number;
  copilotTotalCost: number;
  claudeTotalTokens: number;
  copilotTotalTokens: number;
  granularity?: Granularity;
  periodLabel?: string;
  providerFilter?: ProviderFilter;
}

export const TopUsersGrid: React.FC<TopUsersGridProps> = ({
  claudeUsers,
  copilotUsers,
  allUsers,
  claudeMedian,
  copilotMedian,
  claudeTotalCost,
  copilotTotalCost,
  claudeTotalTokens,
  copilotTotalTokens,
  granularity,
  periodLabel,
  providerFilter = 'All',
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('cost');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [isTableCollapsed, setIsTableCollapsed] = useState(true);

  const showClaudeCol = providerFilter === 'All' || providerFilter === 'Claude';
  const showCopilotCol = providerFilter === 'All' || providerFilter === 'Copilot';

  // Per-card collapse states for platform rankings
  const [isClaudeCardCollapsed, setIsClaudeCardCollapsed] = useState(true);
  const [isCopilotCardCollapsed, setIsCopilotCardCollapsed] = useState(true);

  // Total cost across all users for percentage share calculation
  const totalAllUsersCost = useMemo(() => {
    return allUsers.reduce((acc, u) => acc + u.totalCost, 0);
  }, [allUsers]);

  // Filtered users for the comprehensive directory table
  const filteredUsers = useMemo(() => {
    if (!tableSearchQuery.trim()) return allUsers;
    const q = tableSearchQuery.toLowerCase().trim();
    return allUsers.filter(
      (u) =>
        u.employee_name.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.primaryProvider.toLowerCase().includes(q)
    );
  }, [allUsers, tableSearchQuery]);

  // Collapse if more than 5 users
  const shouldCollapseTable = filteredUsers.length > 5;
  const visibleTableUsers = shouldCollapseTable && isTableCollapsed
    ? filteredUsers.slice(0, 5)
    : filteredUsers;

  const renderPlatformCard = (
    provider: 'Claude' | 'Copilot',
    users: UserPlatformSummary[],
    medianValue: number,
    platformTotalCost: number,
    platformTotalTokens: number,
    isCardCollapsed: boolean,
    onToggleCardCollapse: () => void
  ) => {
    const isClaude = provider === 'Claude';
    const maxVal = users.length > 0
      ? (metricMode === 'cost' ? users[0].totalCost : users[0].totalTokens)
      : 1;

    const shouldCollapseCard = users.length > 5;
    const visibleUsers = shouldCollapseCard && isCardCollapsed ? users.slice(0, 5) : users;

    return (
      <div
        id={`top-users-${provider.toLowerCase()}-card`}
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isClaude ? 'bg-amber-500' : 'bg-blue-600'
                }`}
              />
              <h3 className="text-base font-semibold text-slate-900">
                {provider} Users ({users.length})
              </h3>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isClaude
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  : 'bg-blue-50 text-blue-800 border border-blue-200/80'
              }`}
            >
              Median: {metricMode === 'cost' ? formatCurrency(medianValue) : formatTokens(medianValue)}
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Ranked by {metricMode === 'cost' ? 'Total Spend ($)' : 'Total Tokens'}</span>
            <span>
              Total: {metricMode === 'cost' ? formatCurrency(platformTotalCost) : formatTokens(platformTotalTokens)}
            </span>
          </div>

          {/* User Rows */}
          {users.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <AlertCircle className="w-6 h-6 mx-auto mb-1.5 opacity-60" />
              <p className="text-xs">No active {provider} users in current filter selection.</p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {visibleUsers.map((user, idx) => {
                const primaryVal = metricMode === 'cost' ? user.totalCost : user.totalTokens;
                const barPercent = Math.min(100, Math.max(5, (primaryVal / maxVal) * 100));

                return (
                  <div
                    key={user.employee_name}
                    id={`top-user-${provider.toLowerCase()}-${idx}`}
                    className="py-3 flex flex-col gap-2 hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            idx === 0
                              ? isClaude
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </span>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900">
                              {user.employee_name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {user.department}
                            </span>

                            {user.isHighUsage && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold tracking-tight"
                                title={`High Usage: >2x median of ${formatCurrency(medianValue)}`}
                              >
                                <Flame className="w-3 h-3 text-rose-600" />
                                &gt;2x median
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{user.activeDays} days active</span>
                            <span>•</span>
                            <span className="truncate max-w-[170px]" title={user.modelsUsed.join(', ')}>
                              {user.modelsUsed.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {metricMode === 'cost'
                            ? formatCurrency(user.totalCost)
                            : formatTokens(user.totalTokens)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {metricMode === 'cost'
                            ? `${formatTokens(user.totalTokens)} tokens`
                            : formatCurrency(user.totalCost)}
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isClaude ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Collapse / Expand button for Platform Card if > 5 users */}
          {shouldCollapseCard && (
            <div className="mt-3 flex justify-center border-t border-slate-100 pt-2.5">
              <button
                type="button"
                onClick={onToggleCardCollapse}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                {isCardCollapsed ? (
                  <>
                    <span>Show {users.length - 5} More Users</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </>
                ) : (
                  <>
                    <span>Show Top 5 Only</span>
                    <ChevronUp className="w-3 h-3 text-slate-500" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Benchmark note */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Highlight threshold: &gt;2x median ({metricMode === 'cost' ? formatCurrency(medianValue * 2) : formatTokens(medianValue * 2)})
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="top-users-section" aria-label="User Usage Directory" className="space-y-4">
      {/* Top Header with Title, Mode Controls & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              User Usage &amp; Rankings
            </h2>
            {periodLabel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>{periodLabel}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Enterprise user consumption directory with outlier &gt;2x median detection • Filtered for {periodLabel || 'active period'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Mode Toggle: Table vs Platform Cards */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="user-view-table-btn"
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View all users in a list table"
            >
              <Table className="w-3.5 h-3.5" />
              <span>User Table</span>
            </button>
            <button
              id="user-view-cards-btn"
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View platform leaderboards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Platform Cards</span>
            </button>
          </div>

          {/* Cost vs Tokens Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="top-users-toggle-cost-btn"
              type="button"
              onClick={() => setMetricMode('cost')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                metricMode === 'cost'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cost ($)
            </button>
            <button
              id="top-users-toggle-tokens-btn"
              type="button"
              onClick={() => setMetricMode('tokens')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                metricMode === 'tokens'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tokens
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: All Users Usage List Table */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  All Users Usage Table ({allUsers.length} active in period)
                </h3>
                {periodLabel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    <span>{periodLabel}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Detailed individual consumption across Claude and Copilot with outlier alerts • {periodLabel || 'active period'}
              </p>
            </div>

            {/* Search Input for User Table */}
            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="user-table-search-input"
                type="text"
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                placeholder="Search users or department..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
              {tableSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTableSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table Content */}
          {filteredUsers.length === 0 ? (
            <div className="py-10 text-center bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-500">
              No users match your search &quot;{tableSearchQuery}&quot;.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Primary Platform</th>
                    <th className="py-2.5 px-3 text-right">Total Spend</th>
                    <th className="py-2.5 px-3 text-right">Total Tokens</th>
                    {showClaudeCol && <th className="py-2.5 px-3 text-right">Claude Usage</th>}
                    {showCopilotCol && <th className="py-2.5 px-3 text-right">Copilot Usage</th>}
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {visibleTableUsers.map((user, index) => {
                    const sharePercent = totalAllUsersCost > 0 ? (user.totalCost / totalAllUsersCost) * 100 : 0;
                    return (
                      <tr key={user.employee_name} className="hover:bg-slate-50/70 transition-colors">
                        {/* Employee Name + Rank */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px] font-semibold">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900">{user.employee_name}</div>
                              <div className="text-[10px] text-slate-500">{user.activeDays} days active</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {user.department}
                          </span>
                        </td>

                        {/* Primary Platform */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              user.primaryProvider === 'Claude'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : user.primaryProvider === 'Copilot'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-purple-50 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {user.primaryProvider}
                          </span>
                        </td>

                        {/* Total Spend with Share */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="font-bold text-slate-900 font-mono">
                            {formatCurrency(user.totalCost)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {sharePercent.toFixed(1)}% of users
                          </div>
                        </td>

                        {/* Total Tokens */}
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                          {formatTokens(user.totalTokens)}
                        </td>

                        {/* Claude Usage */}
                        {showClaudeCol && (
                          <td className="py-2.5 px-3 text-right">
                            {user.claudeCost > 0 ? (
                              <div>
                                <div className="font-medium text-amber-700 font-mono">
                                  {formatCurrency(user.claudeCost)}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {formatTokens(user.claudeTokens)} tokens
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">-</span>
                            )}
                          </td>
                        )}

                        {/* Copilot Usage */}
                        {showCopilotCol && (
                          <td className="py-2.5 px-3 text-right">
                            {user.copilotCost > 0 ? (
                              <div>
                                <div className="font-medium text-blue-700 font-mono">
                                  {formatCurrency(user.copilotCost)}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {formatTokens(user.copilotTokens)} tokens
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono">-</span>
                            )}
                          </td>
                        )}

                        {/* High Usage Outlier Status */}
                        <td className="py-2.5 px-3 text-center">
                          {user.isHighUsage ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold"
                              title="Usage is >2x enterprise median"
                            >
                              <Flame className="w-3 h-3 text-rose-600" />
                              High Usage
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Normal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Collapse / Expand Toggle for User Table if > 5 users */}
          {shouldCollapseTable && (
            <div className="mt-3 flex justify-center">
              <button
                id="user-table-collapse-toggle-btn"
                type="button"
                onClick={() => setIsTableCollapsed(!isTableCollapsed)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                {isTableCollapsed ? (
                  <>
                    <span>Show {filteredUsers.length - 5} More Users</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </>
                ) : (
                  <>
                    <span>Show Top 5 Only</span>
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Platform Leaderboards Cards */}
      {viewMode === 'cards' && (
        <div className={`grid gap-4 ${showClaudeCol && showCopilotCol ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {showClaudeCol &&
            renderPlatformCard(
              'Claude',
              claudeUsers,
              claudeMedian,
              claudeTotalCost,
              claudeTotalTokens,
              isClaudeCardCollapsed,
              () => setIsClaudeCardCollapsed(!isClaudeCardCollapsed)
            )}
          {showCopilotCol &&
            renderPlatformCard(
              'Copilot',
              copilotUsers,
              copilotMedian,
              copilotTotalCost,
              copilotTotalTokens,
              isCopilotCardCollapsed,
              () => setIsCopilotCardCollapsed(!isCopilotCardCollapsed)
            )}
        </div>
      )}
    </section>
  );
};
