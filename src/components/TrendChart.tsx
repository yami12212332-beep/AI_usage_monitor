import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AggregatedTrendPoint, Granularity, MetricMode, ProviderFilter } from '../types';
import { formatCurrency, formatTokens } from '../utils/analytics';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface TrendChartProps {
  data: AggregatedTrendPoint[];
  granularity: Granularity;
  providerFilter: ProviderFilter;
  selectedBucketKey?: string;
  onSelectBucket?: (key: string) => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  granularity,
  providerFilter,
  selectedBucketKey,
  onSelectBucket,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('cost');

  const claudeKey = metricMode === 'cost' ? 'claudeCost' : 'claudeTokens';
  const copilotKey = metricMode === 'cost' ? 'copilotCost' : 'copilotTokens';

  const showClaude = providerFilter === 'All' || providerFilter === 'Claude';
  const showCopilot = providerFilter === 'All' || providerFilter === 'Copilot';

  const hasData = data && data.length > 0;

  // Custom tooltip component
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPoint = payload[0]?.payload as AggregatedTrendPoint;
      return (
        <div className="bg-slate-900/95 text-slate-100 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-sm text-xs min-w-[190px]">
          <div className="font-semibold text-slate-300 pb-1.5 border-b border-slate-800 mb-2 flex items-center justify-between">
            <span>{currentPoint?.displayDate || label}</span>
            <span className="text-[10px] text-slate-400 capitalize">({granularity})</span>
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

            {showClaude && showCopilot && (
              <div className="pt-1.5 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-4 font-semibold text-slate-200">
                <span>Total:</span>
                <span className="font-mono">
                  {metricMode === 'cost'
                    ? formatCurrency(currentPoint.totalCost)
                    : formatTokens(currentPoint.totalTokens)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="trend-chart-card"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
    >
      {/* Chart Header & Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Usage &amp; Cost Trend
            </h2>
            <p className="text-xs text-slate-500">
              Provider trajectory over time ({granularity} aggregation)
            </p>
          </div>
        </div>

        {/* Toggle between Cost ($) and Tokens */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            id="trend-toggle-cost-btn"
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
            id="trend-toggle-tokens-btn"
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

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div
          id="trend-empty-state"
          className="h-72 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50"
        >
          <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No data for this selection</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try adjusting your provider or department filters to view historical trends.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length && onSelectBucket) {
                  const pt = e.activePayload[0].payload as AggregatedTrendPoint;
                  if (pt && pt.bucketKey) {
                    onSelectBucket(pt.bucketKey);
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                minTickGap={20}
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
                <Line
                  type="monotone"
                  dataKey={claudeKey}
                  name="Claude"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#EA580C', strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, stroke: '#EA580C', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}

              {showCopilot && (
                <Line
                  type="monotone"
                  dataKey={copilotKey}
                  name="Copilot"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563EB', strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, stroke: '#2563EB', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
