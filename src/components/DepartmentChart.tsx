import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DepartmentUsagePoint, Granularity, MetricMode, ProviderFilter } from '../types';
import { formatCurrency, formatTokens } from '../utils/analytics';
import { Building2, AlertCircle, Search, ChevronDown, ChevronUp, Users, X, Calendar } from 'lucide-react';

interface DepartmentChartProps {
  data: DepartmentUsagePoint[];
  providerFilter: ProviderFilter;
  granularity?: Granularity;
  periodLabel?: string;
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({
  data,
  providerFilter,
  granularity,
  periodLabel,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('cost');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const claudeKey = metricMode === 'cost' ? 'claudeCost' : 'claudeTokens';
  const copilotKey = metricMode === 'cost' ? 'copilotCost' : 'copilotTokens';

  const showClaude = providerFilter === 'All' || providerFilter === 'Claude';
  const showCopilot = providerFilter === 'All' || providerFilter === 'Copilot';

  const hasData = data && data.length > 0;

  // Calculate total spend & tokens across all departments for % share calculation
  const totalAllCost = useMemo(() => {
    return data.reduce((acc, d) => acc + d.totalCost, 0);
  }, [data]);

  const totalAllTokens = useMemo(() => {
    return data.reduce((acc, d) => acc + d.totalTokens, 0);
  }, [data]);

  // Search filtered departments
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((d) => d.department.toLowerCase().includes(q));
  }, [data, searchQuery]);

  // Collapsed / expanded items (collapse if > 5 departments)
  const shouldShowCollapse = filteredDepartments.length > 5;
  const visibleDepartments = shouldShowCollapse && isCollapsed
    ? filteredDepartments.slice(0, 5)
    : filteredDepartments;

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPoint = payload[0]?.payload as DepartmentUsagePoint;
      const total =
        metricMode === 'cost' ? currentPoint.totalCost : currentPoint.totalTokens;

      return (
        <div className="bg-slate-900/95 text-slate-100 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-sm text-xs min-w-[200px]">
          <div className="font-semibold text-slate-200 pb-1.5 border-b border-slate-800 mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-white">{currentPoint.department}</span>
            <span className="text-[10px] text-slate-400">Department</span>
          </div>

          <div className="space-y-1.5">
            {showClaude && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Claude:</span>
                </div>
                <span className="font-mono font-medium text-amber-300">
                  {metricMode === 'cost'
                    ? formatCurrency(currentPoint.claudeCost)
                    : formatTokens(currentPoint.claudeTokens)}
                </span>
              </div>
            )}

            {showCopilot && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-300">Copilot:</span>
                </div>
                <span className="font-mono font-medium text-blue-300">
                  {metricMode === 'cost'
                    ? formatCurrency(currentPoint.copilotCost)
                    : formatTokens(currentPoint.copilotTokens)}
                </span>
              </div>
            )}

            <div className="pt-1.5 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-4 font-semibold text-slate-200">
              <span>Combined Total:</span>
              <span className="font-mono">
                {metricMode === 'cost' ? formatCurrency(total) : formatTokens(total)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="department-usage-card"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6"
    >
      {/* Top Header & Chart Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-slate-900">
                Usage by Department
              </h2>
              {periodLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{periodLabel}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Stacked distribution across departments by AI platform • Filtered for {periodLabel || 'selected period'}
            </p>
          </div>
        </div>

        {/* Cost vs Tokens Toggle */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            id="dept-toggle-cost-btn"
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
            id="dept-toggle-tokens-btn"
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

      {/* 1. Bar Chart Canvas or Empty State */}
      {!hasData ? (
        <div
          id="dept-empty-state"
          className="h-64 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50"
        >
          <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No department data available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Current filter selection yielded 0 matching department records.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="department"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(value) =>
                  metricMode === 'cost' ? formatCurrency(value, true) : formatTokens(value)
                }
                width={56}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                iconType="circle"
              />

              {showClaude && (
                <Bar
                  dataKey={claudeKey}
                  name="Claude"
                  stackId="providerStack"
                  fill="#EA580C"
                  radius={showCopilot ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  maxBarSize={48}
                />
              )}

              {showCopilot && (
                <Bar
                  dataKey={copilotKey}
                  name="Copilot"
                  stackId="providerStack"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 2. Department Usage List Table Section */}
      <div className="pt-5 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900">
                Department Usage Table
              </h3>
              {periodLabel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  <span>{periodLabel}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Complete usage, platform breakdown, and active headcount by department • {periodLabel || 'selected period'}
            </p>
          </div>

          {/* Search Input for Department Table */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="department-table-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        {filteredDepartments.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-500">
            No departments match your search &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Total Spend</th>
                  <th className="py-2.5 px-3 text-right">Total Tokens</th>
                  {showClaude && <th className="py-2.5 px-3 text-right">Claude Spend (Tokens)</th>}
                  {showCopilot && <th className="py-2.5 px-3 text-right">Copilot Spend (Tokens)</th>}
                  <th className="py-2.5 px-3 text-center">Active Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {visibleDepartments.map((dept, index) => {
                  const sharePercent = totalAllCost > 0 ? (dept.totalCost / totalAllCost) * 100 : 0;
                  return (
                    <tr key={dept.department} className="hover:bg-slate-50/70 transition-colors">
                      {/* Department Name + Rank */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[11px] font-semibold">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{dept.department}</span>
                        </div>
                      </td>

                      {/* Total Spend with Share Bar */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          {formatCurrency(dept.totalCost)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, Math.max(5, sharePercent))}%` }}
                            />
                          </div>
                          <span>{sharePercent.toFixed(1)}%</span>
                        </div>
                      </td>

                      {/* Total Tokens */}
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                        {formatTokens(dept.totalTokens)}
                      </td>

                      {/* Claude Column */}
                      {showClaude && (
                        <td className="py-2.5 px-3 text-right">
                          <div className="font-semibold text-amber-700 font-mono">
                            {formatCurrency(dept.claudeCost)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatTokens(dept.claudeTokens)} tokens
                          </div>
                        </td>
                      )}

                      {/* Copilot Column */}
                      {showCopilot && (
                        <td className="py-2.5 px-3 text-right">
                          <div className="font-semibold text-blue-700 font-mono">
                            {formatCurrency(dept.copilotCost)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatTokens(dept.copilotTokens)} tokens
                          </div>
                        </td>
                      )}

                      {/* Active Users */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono text-[11px]">
                          <Users className="w-3 h-3 text-slate-500" />
                          {dept.activeUsersCount ?? '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Collapse / Expand Toggle Button for > 5 departments */}
        {shouldShowCollapse && (
          <div className="mt-3 flex justify-center">
            <button
              id="dept-table-collapse-toggle-btn"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              {isCollapsed ? (
                <>
                  <span>Show {filteredDepartments.length - 5} More Departments</span>
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
    </div>
  );
};
