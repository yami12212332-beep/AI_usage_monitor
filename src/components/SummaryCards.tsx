import React from 'react';
import { Granularity } from '../types';
import { formatCurrency, formatTokens } from '../utils/analytics';
import { Cpu, DollarSign, Scale, Users, CalendarCheck2 } from 'lucide-react';

interface SummaryCardsProps {
  totalTokens: number;
  totalCost: number;
  claudeCost: number;
  copilotCost: number;
  claudeTokens: number;
  copilotTokens: number;
  claudeCostPercent: number;
  copilotCostPercent: number;
  activeUserCount: number;
  claudeUserCount: number;
  copilotUserCount: number;
  granularity: Granularity;
  bucketLabel: string;
  isAllTime?: boolean;
  averageCost?: number;
  averageTokens?: number;
  totalPeriodCost?: number;
  totalPeriodTokens?: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalTokens,
  totalCost,
  claudeCost,
  copilotCost,
  claudeTokens,
  copilotTokens,
  claudeCostPercent,
  copilotCostPercent,
  activeUserCount,
  claudeUserCount,
  copilotUserCount,
  granularity,
  bucketLabel,
  isAllTime = false,
  averageCost = 0,
  averageTokens = 0,
  totalPeriodCost = 0,
  totalPeriodTokens = 0,
}) => {
  const granBadgeLabel =
    isAllTime
      ? 'All Time'
      : granularity === 'daily'
      ? 'Daily'
      : granularity === 'weekly'
      ? 'Weekly'
      : 'Monthly';

  const granAvgUnit =
    granularity === 'daily' ? '/day' : granularity === 'weekly' ? '/wk' : '/mo';

  return (
    <section aria-label="Granular Summary Overview" className="space-y-2.5">
      {/* Active Period Indicator */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
          <span>Metrics Granularity:</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
            {granBadgeLabel}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-800 font-semibold">{bucketLabel}</span>
        </div>

        {!isAllTime && averageCost > 0 && (
          <div className="hidden sm:block text-[11px] text-slate-500">
            Benchmark Avg: <span className="font-semibold text-slate-700">{formatCurrency(averageCost)}{granAvgUnit}</span> ({formatTokens(averageTokens)} tokens{granAvgUnit})
          </div>
        )}
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Tokens */}
        <div
          id="summary-total-tokens-card"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {granBadgeLabel} Tokens
              </span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                {formatTokens(totalTokens)}
              </span>
              <span className="text-xs text-slate-500">tokens</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Claude: {formatTokens(claudeTokens)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Copilot: {formatTokens(copilotTokens)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Cost */}
        <div
          id="summary-total-cost-card"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {granBadgeLabel} Spend
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                {formatCurrency(totalCost)}
              </span>
              <span className="text-xs text-slate-500">USD</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg / Active User</span>
            <span className="font-semibold text-slate-700 font-mono">
              {activeUserCount > 0 ? formatCurrency(totalCost / activeUserCount) : '$0.00'}
            </span>
          </div>
        </div>

        {/* Card 3: Claude vs Copilot Cost Comparison */}
        <div
          id="summary-provider-comparison-card"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {granBadgeLabel} Comparison
              </span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            {/* Side by side amounts for this specific granularity bucket */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Claude
                </div>
                <div className="mt-0.5 text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(claudeCost)}
                </div>
                <div className="text-[10px] text-amber-700 font-medium">
                  {claudeCostPercent.toFixed(1)}% share
                </div>
              </div>

              <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-200/60">
                <div className="text-[11px] font-semibold text-blue-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Copilot
                </div>
                <div className="mt-0.5 text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(copilotCost)}
                </div>
                <div className="text-[10px] text-blue-700 font-medium">
                  {copilotCostPercent.toFixed(1)}% share
                </div>
              </div>
            </div>
          </div>

          {/* Visual Share Bar */}
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${claudeCostPercent}%` }}
                title={`Claude: ${claudeCostPercent.toFixed(1)}%`}
              />
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${copilotCostPercent}%` }}
                title={`Copilot: ${copilotCostPercent.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Active User Count */}
        <div
          id="summary-active-users-card"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {granBadgeLabel} Users
              </span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                {activeUserCount}
              </span>
              <span className="text-xs text-slate-500">active in {granBadgeLabel.toLowerCase()} period</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700 font-mono">{claudeUserCount}</span> on Claude
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700 font-mono">{copilotUserCount}</span> on Copilot
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
