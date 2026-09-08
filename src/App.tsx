import React, { useState, useMemo } from 'react';
import {
  AIUsageRecord,
  Granularity,
  ProviderFilter,
} from './types';
import { INITIAL_AI_USAGE_DATA } from './data/sampleData';
import {
  getGranularSummaryMetrics,
  getAvailableBuckets,
  getTrendData,
  getDepartmentUsage,
  getTopUsersByPlatform,
  getAllUsersUsage,
  getBucketInfo,
} from './utils/analytics';
import { TopBar } from './components/TopBar';
import { SummaryCards } from './components/SummaryCards';
import { TrendChart } from './components/TrendChart';
import { FilterBar } from './components/FilterBar';
import { DepartmentChart } from './components/DepartmentChart';
import { TopUsersGrid } from './components/TopUsersGrid';
import { DataManagementModal } from './components/DataManagementModal';

export default function App() {
  // Master embedded dataset (allows live swapping / pasting Excel data)
  const [dataset, setDataset] = useState<AIUsageRecord[]>(INITIAL_AI_USAGE_DATA);

  // Global granularity toggle (Daily / Weekly / Monthly)
  const [granularity, setGranularity] = useState<Granularity>('daily');

  // Specific selected bucket (e.g. specific day, week, month, or 'all')
  const [selectedBucketKey, setSelectedBucketKey] = useState<string>('');

  // Top bar provider filter
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>('All');

  // Row 3 department filter (the only filter left below)
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Modal for Excel data interchange
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Dynamic departments extracted from current dataset
  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    for (const r of dataset) {
      if (r.department) set.add(r.department);
    }
    return Array.from(set).sort();
  }, [dataset]);

  // Dataset filtered by department and provider
  const filteredDataset = useMemo(() => {
    return dataset.filter((r) => {
      if (departmentFilter !== 'All' && r.department !== departmentFilter) {
        return false;
      }
      if (providerFilter !== 'All' && r.ai_provider !== providerFilter) {
        return false;
      }
      return true;
    });
  }, [dataset, departmentFilter, providerFilter]);

  // Dynamic buckets available for current dataset and granularity
  const availableBuckets = useMemo(() => {
    return getAvailableBuckets(dataset, granularity);
  }, [dataset, granularity]);

  // Effective active bucket key
  const activeBucketKey = useMemo(() => {
    if (selectedBucketKey === 'all') return 'all';
    const exists = availableBuckets.some((b) => b.key === selectedBucketKey);
    if (exists) return selectedBucketKey;
    return availableBuckets[availableBuckets.length - 1]?.key || '';
  }, [availableBuckets, selectedBucketKey]);

  // Granularity change handler: switches granularity and auto-selects the latest bucket
  const handleGranularityChange = (newG: Granularity) => {
    setGranularity(newG);
    const newBuckets = getAvailableBuckets(dataset, newG);
    if (newBuckets.length > 0) {
      setSelectedBucketKey(newBuckets[newBuckets.length - 1].key);
    } else {
      setSelectedBucketKey('');
    }
  };

  // Row 1: Granular summary metrics (dynamically changes when granularity changes!)
  const summaryMetrics = useMemo(() => {
    return getGranularSummaryMetrics(filteredDataset, granularity, activeBucketKey);
  }, [filteredDataset, granularity, activeBucketKey]);

  // For trend chart: respects department filter, while provider filtering is handled cleanly in the chart
  const trendFilteredRecords = useMemo(() => {
    if (departmentFilter === 'All') return dataset;
    return dataset.filter((r) => r.department === departmentFilter);
  }, [dataset, departmentFilter]);

  // Row 2: Trend chart data respecting granularity
  const trendData = useMemo(() => {
    return getTrendData(trendFilteredRecords, granularity);
  }, [trendFilteredRecords, granularity]);

  // Master records filtered by the selected period bucket according to granularity
  const periodFilteredRecords = useMemo(() => {
    if (!activeBucketKey || activeBucketKey === 'all') {
      return dataset;
    }
    return dataset.filter((r) => {
      const info = getBucketInfo(r.date, granularity);
      return info.key === activeBucketKey;
    });
  }, [dataset, granularity, activeBucketKey]);

  // Row 4: Department usage respecting period filter, department filter, and provider filter
  const departmentFilteredRecords = useMemo(() => {
    return periodFilteredRecords.filter((r) => {
      if (departmentFilter !== 'All' && r.department !== departmentFilter) {
        return false;
      }
      if (providerFilter !== 'All' && r.ai_provider !== providerFilter) {
        return false;
      }
      return true;
    });
  }, [periodFilteredRecords, departmentFilter, providerFilter]);

  const departmentUsageData = useMemo(() => {
    return getDepartmentUsage(departmentFilteredRecords);
  }, [departmentFilteredRecords]);

  // Row 5: Top users for Claude & Copilot with median calculation + all users directory
  // Filtered by granularity & period filter, as well as department & provider filters
  const claudeTopUsers = useMemo(() => {
    const deptPeriodRecords = periodFilteredRecords.filter(
      (r) => departmentFilter === 'All' || r.department === departmentFilter
    );
    return getTopUsersByPlatform(deptPeriodRecords, 'Claude', 'cost');
  }, [periodFilteredRecords, departmentFilter]);

  const copilotTopUsers = useMemo(() => {
    const deptPeriodRecords = periodFilteredRecords.filter(
      (r) => departmentFilter === 'All' || r.department === departmentFilter
    );
    return getTopUsersByPlatform(deptPeriodRecords, 'Copilot', 'cost');
  }, [periodFilteredRecords, departmentFilter]);

  const allUsersSummary = useMemo(() => {
    const userFilteredRecords = periodFilteredRecords.filter((r) => {
      if (departmentFilter !== 'All' && r.department !== departmentFilter) {
        return false;
      }
      if (providerFilter !== 'All' && r.ai_provider !== providerFilter) {
        return false;
      }
      return true;
    });
    return getAllUsersUsage(userFilteredRecords, 'cost');
  }, [periodFilteredRecords, departmentFilter, providerFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Bar with Title, Provider Filter, Granularity & Period Buckets (No date selector below Title) */}
      <TopBar
        granularity={granularity}
        onGranularityChange={handleGranularityChange}
        providerFilter={providerFilter}
        onProviderFilterChange={setProviderFilter}
        availableBuckets={availableBuckets}
        selectedBucketKey={activeBucketKey}
        onSelectBucket={setSelectedBucketKey}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Row 1 — Summary Cards (4 cards, dynamically updates with Daily / Weekly / Monthly granularity) */}
        <SummaryCards
          totalTokens={summaryMetrics.totalTokens}
          totalCost={summaryMetrics.totalCost}
          claudeCost={summaryMetrics.claudeCost}
          copilotCost={summaryMetrics.copilotCost}
          claudeTokens={summaryMetrics.claudeTokens}
          copilotTokens={summaryMetrics.copilotTokens}
          claudeCostPercent={summaryMetrics.claudeCostPercent}
          copilotCostPercent={summaryMetrics.copilotCostPercent}
          activeUserCount={summaryMetrics.activeUserCount}
          claudeUserCount={summaryMetrics.claudeUserCount}
          copilotUserCount={summaryMetrics.copilotUserCount}
          granularity={granularity}
          bucketLabel={summaryMetrics.bucketLabel}
          isAllTime={summaryMetrics.isAllTime}
          averageCost={summaryMetrics.averageCost}
          averageTokens={summaryMetrics.averageTokens}
          totalPeriodCost={summaryMetrics.totalPeriodCost}
          totalPeriodTokens={summaryMetrics.totalPeriodTokens}
        />

        {/* Row 2 — Trend Chart */}
        <TrendChart
          data={trendData}
          granularity={granularity}
          providerFilter={providerFilter}
          selectedBucketKey={activeBucketKey}
          onSelectBucket={setSelectedBucketKey}
        />

        {/* Row 3 — Department Filter (the only filter left below) */}
        <FilterBar
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          availableDepartments={availableDepartments}
          totalFilteredCount={filteredDataset.length}
          totalRecords={dataset.length}
          onResetDepartmentFilter={() => setDepartmentFilter('All')}
        />

        {/* Row 4 — Usage by Department */}
        <DepartmentChart
          data={departmentUsageData}
          providerFilter={providerFilter}
          granularity={granularity}
          periodLabel={summaryMetrics.bucketLabel}
        />

        {/* Row 5 — Top Users by Platform (Claude & Copilot) with >2x median highlight + Full User Directory */}
        <TopUsersGrid
          claudeUsers={claudeTopUsers.users}
          copilotUsers={copilotTopUsers.users}
          allUsers={allUsersSummary.users}
          claudeMedian={claudeTopUsers.medianValue}
          copilotMedian={copilotTopUsers.medianValue}
          claudeTotalCost={claudeTopUsers.totalPlatformCost}
          copilotTotalCost={copilotTopUsers.totalPlatformCost}
          claudeTotalTokens={claudeTopUsers.totalPlatformTokens}
          copilotTotalTokens={copilotTopUsers.totalPlatformTokens}
          granularity={granularity}
          periodLabel={summaryMetrics.bucketLabel}
          providerFilter={providerFilter}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AI Usage &amp; Cost Dashboard • Comparing Anthropic Claude &amp; GitHub Copilot
          </span>
          <span className="font-mono text-slate-400">
            {dataset.length} total records • Dynamic generic schema parser
          </span>
        </div>
      </footer>

      {/* Dataset / Excel Interchange Modal */}
      {isDataModalOpen && (
        <DataManagementModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          dataset={dataset}
          onUpdateDataset={(newRows) => setDataset(newRows)}
          onResetDefault={() => setDataset(INITIAL_AI_USAGE_DATA)}
        />
      )}
    </div>
  );
}
