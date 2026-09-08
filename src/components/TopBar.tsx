import React from 'react';
import { Granularity, ProviderFilter } from '../types';
import { BucketOption } from '../utils/analytics';
import { Layers, TableProperties, Sparkles, Bot, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface TopBarProps {
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  providerFilter: ProviderFilter;
  onProviderFilterChange: (p: ProviderFilter) => void;
  availableBuckets: BucketOption[];
  selectedBucketKey: string;
  onSelectBucket: (key: string) => void;
  onOpenDataModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  granularity,
  onGranularityChange,
  providerFilter,
  onProviderFilterChange,
  availableBuckets,
  selectedBucketKey,
  onSelectBucket,
  onOpenDataModal,
}) => {
  // Current active index in availableBuckets
  const currentIndex = availableBuckets.findIndex((b) => b.key === selectedBucketKey);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < availableBuckets.length - 1;

  const handlePrevBucket = () => {
    if (canGoPrev) {
      onSelectBucket(availableBuckets[currentIndex - 1].key);
    }
  };

  const handleNextBucket = () => {
    if (canGoNext) {
      onSelectBucket(availableBuckets[currentIndex + 1].key);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Top Header Row: Branding & Modal Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                AI Usage &amp; Cost Dashboard
              </h1>
            </div>
            {/* Clean Subtitle with NO date selector below title */}
            <p className="mt-1 text-xs text-slate-400">
              Enterprise Observability &amp; Cost Intelligence • Comparing Claude &amp; GitHub Copilot
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Dataset / Excel Manager Button */}
            <button
              id="open-dataset-modal-btn"
              type="button"
              onClick={onOpenDataModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
              title="Inspect or swap dataset rows"
            >
              <TableProperties className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dataset &amp; Excel</span>
            </button>
          </div>
        </div>

        {/* Global Controls Bar: All Filters except Department moved to the Top */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3.5">
          
          {/* Left Group: Provider Filter + Granularity Toggle */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            
            {/* 1. AI Provider Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Bot className="w-3.5 h-3.5 text-slate-400" />
                <span>Provider:</span>
              </span>
              <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700" role="group">
                {(['All', 'Claude', 'Copilot'] as ProviderFilter[]).map((p) => {
                  const isActive = providerFilter === p;
                  return (
                    <button
                      key={p}
                      id={`top-filter-provider-${p.toLowerCase()}-btn`}
                      type="button"
                      onClick={() => onProviderFilterChange(p)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                        isActive
                          ? p === 'Claude'
                            ? 'bg-amber-500 text-white font-semibold shadow-xs'
                            : p === 'Copilot'
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      {p === 'Claude' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-amber-500'}`} />
                      )}
                      {p === 'Copilot' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-blue-600'}`} />
                      )}
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <span className="hidden sm:inline text-slate-700">|</span>

            {/* 2. Granularity Toggle (Daily / Weekly / Monthly) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Granularity:
              </span>
              <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700" role="group">
                {(['daily', 'weekly', 'monthly'] as Granularity[]).map((g) => {
                  const isActive = granularity === g;
                  const label = g.charAt(0).toUpperCase() + g.slice(1);
                  return (
                    <button
                      key={g}
                      id={`top-granularity-${g}-btn`}
                      type="button"
                      onClick={() => onGranularityChange(g)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Group: Period / Bucket Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 hidden md:flex">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Period:</span>
            </span>

            {/* Quick Prev / Next Buttons */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handlePrevBucket}
                disabled={!canGoPrev}
                title="Previous period"
                className={`p-1 rounded-md text-xs ${
                  canGoPrev
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Bucket Dropdown */}
              <select
                id="top-period-bucket-select"
                value={selectedBucketKey}
                onChange={(e) => onSelectBucket(e.target.value)}
                className="bg-transparent text-slate-200 text-xs px-2 py-1 font-medium focus:outline-none cursor-pointer"
              >
                {availableBuckets.map((bucket, index) => {
                  const isLatest = index === availableBuckets.length - 1;
                  return (
                    <option key={bucket.key} value={bucket.key} className="bg-slate-900 text-slate-200">
                      {bucket.label} {isLatest ? `(Latest ${granularity})` : ''}
                    </option>
                  );
                })}
                <option value="all" className="bg-slate-900 text-amber-300 font-semibold">
                  All {availableBuckets.length} {granularity === 'daily' ? 'Days' : granularity === 'weekly' ? 'Weeks' : 'Months'} (Combined Total)
                </option>
              </select>

              <button
                type="button"
                onClick={handleNextBucket}
                disabled={!canGoNext}
                title="Next period"
                className={`p-1 rounded-md text-xs ${
                  canGoNext
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
