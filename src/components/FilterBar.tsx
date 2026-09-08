import React from 'react';
import { Building2, ChevronDown, X } from 'lucide-react';

interface FilterBarProps {
  departmentFilter: string;
  onDepartmentFilterChange: (d: string) => void;
  availableDepartments: string[];
  totalFilteredCount: number;
  totalRecords: number;
  onResetDepartmentFilter: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  departmentFilter,
  onDepartmentFilterChange,
  availableDepartments,
  totalFilteredCount,
  totalRecords,
  onResetDepartmentFilter,
}) => {
  const isFiltered = departmentFilter !== 'All';

  return (
    <section
      id="department-filter-section"
      aria-label="Department Filter"
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Title & Info */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Department Filter
            </h3>
            <p className="text-[11px] text-slate-500">
              Filter department comparison and user rankings below
            </p>
          </div>
        </div>

        {/* Department Dropdown Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="department-select-dropdown"
              className="text-xs font-semibold text-slate-700 whitespace-nowrap"
            >
              Select Department:
            </label>

            <div className="relative min-w-[200px]">
              <select
                id="department-select-dropdown"
                value={departmentFilter}
                onChange={(e) => onDepartmentFilterChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-300 hover:border-slate-400 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs cursor-pointer transition-all"
              >
                <option value="All">All Departments ({availableDepartments.length})</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reset Filter Button if active */}
          {isFiltered && (
            <button
              id="reset-department-filter-btn"
              type="button"
              onClick={onResetDepartmentFilter}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              title="Reset to All Departments"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear ({departmentFilter})</span>
            </button>
          )}

          {/* Records Counter */}
          <div className="text-[11px] text-slate-500 border-l border-slate-200 pl-3 hidden md:block">
            Matching: <span className="font-semibold text-slate-800">{totalFilteredCount}</span> of {totalRecords} records
          </div>
        </div>
      </div>
    </section>
  );
};
