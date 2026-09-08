import React, { useState, useMemo, useRef } from 'react';
import { AIUsageRecord, AIProvider } from '../types';
import { formatCurrency, formatTokens } from '../utils/analytics';
import {
  X,
  Download,
  Upload,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  RotateCcw,
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  Info,
  FileText,
  Copy,
  ChevronDown,
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: AIUsageRecord[];
  onUpdateDataset: (newDataset: AIUsageRecord[]) => void;
  onResetDefault: () => void;
}

// Sample realistic Claude data for 1-click testing
const SAMPLE_CLAUDE_TSV = `date\temployee_name\tdepartment\tmodel\tinput_tokens\toutput_tokens\ttotal_tokens\tcost_usd
2026-08-20\tAlex Rivera\tEngineering\tClaude Sonnet 4.6\t185000\t42000\t227000\t1.19
2026-08-20\tPriya Patel\tDesign\tClaude Sonnet 4.6\t95000\t28000\t123000\t0.71
2026-08-21\tMarcus Chen\tResearch\tClaude Opus 3.5\t320000\t95000\t415000\t2.39
2026-08-21\tSarah Jenkins\tMarketing\tClaude Sonnet 4.6\t140000\t35000\t175000\t0.95
2026-08-22\tElena Rostova\tProduct\tClaude Sonnet 4.6\t210000\t58000\t268000\t1.50
2026-08-22\tDavid Kim\tEngineering\tClaude Haiku 3.5\t450000\t110000\t560000\t0.78
2026-08-23\tLiam Thorne\tEngineering\tClaude Sonnet 4.6\t165000\t40000\t205000\t1.10
2026-08-23\tMaya Lin\tData Science\tClaude Sonnet 4.6\t280000\t72000\t352000\t1.92`;

// Sample realistic Copilot data for 1-click testing
const SAMPLE_COPILOT_TSV = `date\temployee_name\tdepartment\tmodel\tinput_tokens\toutput_tokens\ttotal_tokens\tcost_usd
2026-08-20\tJordan Hayes\tEngineering\tCopilot Chat\t220000\t55000\t275000\t0.88
2026-08-20\tSamantha Wu\tDevOps\tCopilot Autocomplete\t310000\t70000\t380000\t0.95
2026-08-21\tCarlos Mendez\tQA & Testing\tCopilot Chat\t145000\t38000\t183000\t0.46
2026-08-21\tRachel Green\tInfrastructure\tCopilot Chat\t195000\t48000\t243000\t0.61
2026-08-22\tKevin Durant\tEngineering\tCopilot Enterprise\t420000\t95000\t515000\t1.29
2026-08-22\tAisha Morales\tData Science\tCopilot Chat\t260000\t62000\t322000\t0.81
2026-08-23\tTariq Al-Mansoor\tEngineering\tCopilot Autocomplete\t340000\t78000\t418000\t1.05
2026-08-23\tOlivia Bennett\tProduct\tCopilot Chat\t120000\t30000\t150000\t0.38`;

/**
 * Normalizes varied date formats (YYYY-MM-DD, MM/DD/YYYY, etc.) into strict ISO YYYY-MM-DD
 */
function normalizeDate(raw: string): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[/-]/);
    if (Number(parts[0]) > 12) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

/**
 * Robust parser for CSV, TSV, or JSON data with dedicated Claude/Copilot token counting and billing
 */
function parseRecordsFromText(
  text: string,
  targetProvider: 'Claude' | 'Copilot' | 'Auto'
): { records: AIUsageRecord[]; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { records: [] };
  }

  // 1. JSON Array parsing
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Parsed JSON is not a non-empty array.');
      }
      const records: AIUsageRecord[] = parsed.map((item, idx) => {
        const prov: 'Claude' | 'Copilot' =
          targetProvider !== 'Auto'
            ? targetProvider
            : item.ai_provider === 'Copilot' || String(item.provider || '').toLowerCase().includes('copilot')
            ? 'Copilot'
            : 'Claude';

        const inTok = Number(item.input_tokens) || 0;
        const outTok = Number(item.output_tokens) || 0;
        const totTok = Number(item.total_tokens) || (inTok + outTok);

        // Billing calculation: Use provided cost/billing or calculate based on provider rates
        let cost = Number(item.cost_usd ?? item.cost ?? item.billing ?? item.spend ?? item.amount);
        if (isNaN(cost) || cost === 0) {
          if (prov === 'Claude') {
            cost = inTok > 0 || outTok > 0
              ? (inTok * 3.0 + outTok * 15.0) / 1_000_000
              : (totTok * 5.0) / 1_000_000;
          } else {
            cost = inTok > 0 || outTok > 0
              ? (inTok * 2.0 + outTok * 8.0) / 1_000_000
              : (totTok * 2.5) / 1_000_000;
          }
        }

        return {
          date: normalizeDate(String(item.date || '')),
          employee_name: String(item.employee_name || item.name || item.user || `User ${idx + 1}`),
          department: String(item.department || item.dept || 'Engineering'),
          ai_provider: prov,
          model: String(item.model || (prov === 'Claude' ? 'Claude Sonnet 4.6' : 'Copilot Chat')),
          input_tokens: inTok,
          output_tokens: outTok,
          total_tokens: totTok,
          cost_usd: Number(cost.toFixed(2)),
        };
      });
      return { records };
    } catch (e: any) {
      return { records: [], error: `JSON parse error: ${e.message}` };
    }
  }

  // 2. CSV / TSV / Excel table parsing
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { records: [], error: 'Data must include at least a header row and one data row.' };
  }

  // Detect delimiter: tab, semicolon, or comma
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';

  // Identify column indices by matching aliases
  const rawHeaders = firstLine
    .split(delimiter)
    .map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

  const dateIdx = rawHeaders.findIndex((h) => h.includes('date') || h.includes('day') || h.includes('time'));
  const nameIdx = rawHeaders.findIndex(
    (h) => h.includes('name') || h.includes('employee') || h.includes('user') || h.includes('member')
  );
  const deptIdx = rawHeaders.findIndex(
    (h) => h.includes('dept') || h.includes('department') || h.includes('team') || h.includes('group')
  );
  const provIdx = rawHeaders.findIndex(
    (h) => h.includes('provider') || h.includes('ai') || h.includes('platform') || h.includes('tool')
  );
  const modelIdx = rawHeaders.findIndex((h) => h.includes('model') || h.includes('engine') || h.includes('version'));
  const inTokIdx = rawHeaders.findIndex(
    (h) => h.includes('input') || h.includes('prompt') || h.includes('in_token')
  );
  const outTokIdx = rawHeaders.findIndex(
    (h) => h.includes('output') || h.includes('completion') || h.includes('out_token')
  );
  const totalTokIdx = rawHeaders.findIndex(
    (h) =>
      (h.includes('total') && h.includes('token')) ||
      h === 'tokens' ||
      h === 'token' ||
      h === 'total_tokens'
  );
  const costIdx = rawHeaders.findIndex(
    (h) =>
      h.includes('cost') ||
      h.includes('billing') ||
      h.includes('spend') ||
      h.includes('price') ||
      h.includes('amount') ||
      h.includes('usd')
  );

  const records: AIUsageRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());
    if (cols.length < 2) continue;

    const rawDate = dateIdx !== -1 ? cols[dateIdx] : '';
    const date = normalizeDate(rawDate);
    const employee_name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : `Employee ${i}`;
    const department = deptIdx !== -1 && cols[deptIdx] ? cols[deptIdx] : 'Engineering';

    // Determine provider
    let prov: 'Claude' | 'Copilot' = 'Claude';
    if (targetProvider !== 'Auto') {
      prov = targetProvider;
    } else if (provIdx !== -1 && cols[provIdx]) {
      prov = cols[provIdx].toLowerCase().includes('copilot') ? 'Copilot' : 'Claude';
    } else {
      prov = 'Claude';
    }

    const model =
      modelIdx !== -1 && cols[modelIdx]
        ? cols[modelIdx]
        : prov === 'Claude'
        ? 'Claude Sonnet 4.6'
        : 'Copilot Chat';

    // Token counting
    const inTok = inTokIdx !== -1 ? Number(cols[inTokIdx].replace(/[^0-9.]/g, '')) || 0 : 0;
    const outTok = outTokIdx !== -1 ? Number(cols[outTokIdx].replace(/[^0-9.]/g, '')) || 0 : 0;
    let totalTok = totalTokIdx !== -1 ? Number(cols[totalTokIdx].replace(/[^0-9.]/g, '')) || 0 : 0;
    if (!totalTok) {
      totalTok = inTok + outTok;
    }

    // Billing counting: If explicit cost column exists, use provided billing. Otherwise, use provider rate
    let cost = costIdx !== -1 ? Number(cols[costIdx].replace(/[^0-9.]/g, '')) : NaN;

    if (isNaN(cost) || cost === 0) {
      if (prov === 'Claude') {
        // Claude standard token billing formula ($3/M input, $15/M output or $5/M blended)
        if (inTok > 0 || outTok > 0) {
          cost = (inTok * 3.0 + outTok * 15.0) / 1_000_000;
        } else {
          cost = (totalTok * 5.0) / 1_000_000;
        }
      } else {
        // Copilot standard token billing formula ($2.50/M blended or $2/M input, $8/M output)
        if (inTok > 0 || outTok > 0) {
          cost = (inTok * 2.0 + outTok * 8.0) / 1_000_000;
        } else {
          cost = (totalTok * 2.5) / 1_000_000;
        }
      }
    }

    records.push({
      date,
      employee_name,
      department,
      ai_provider: prov,
      model,
      input_tokens: inTok,
      output_tokens: outTok,
      total_tokens: totalTok,
      cost_usd: Number(cost.toFixed(2)),
    });
  }

  if (records.length === 0) {
    return { records: [], error: 'Could not parse any valid rows. Please verify your column headers.' };
  }

  return { records };
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onUpdateDataset,
  onResetDefault,
}) => {
  // Modal tabs: claude | copilot | combined | table
  const [activeTab, setActiveTab] = useState<'claude' | 'copilot' | 'combined' | 'table'>('claude');

  // Input states for each section
  const [claudeText, setClaudeText] = useState('');
  const [copilotText, setCopilotText] = useState('');
  const [combinedText, setCombinedText] = useState('');

  // Table search
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilterProvider, setTableFilterProvider] = useState<'All' | 'Claude' | 'Copilot'>('All');

  // Status message
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // File input refs
  const claudeFileInputRef = useRef<HTMLInputElement>(null);
  const copilotFileInputRef = useRef<HTMLInputElement>(null);
  const combinedFileInputRef = useRef<HTMLInputElement>(null);

  // Real-time parse previews for each section
  const parsedClaude = useMemo(() => parseRecordsFromText(claudeText, 'Claude'), [claudeText]);
  const parsedCopilot = useMemo(() => parseRecordsFromText(copilotText, 'Copilot'), [copilotText]);
  const parsedCombined = useMemo(() => parseRecordsFromText(combinedText, 'Auto'), [combinedText]);

  // Overall dataset summary stats
  const claudeCount = dataset.filter((r) => r.ai_provider === 'Claude').length;
  const copilotCount = dataset.filter((r) => r.ai_provider === 'Copilot').length;
  const totalCost = dataset.reduce((acc, r) => acc + r.cost_usd, 0);
  const totalTokens = dataset.reduce((acc, r) => acc + r.total_tokens, 0);

  // Filtered rows for current dataset table
  const filteredDataset = dataset.filter((row) => {
    if (tableFilterProvider !== 'All' && row.ai_provider !== tableFilterProvider) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.employee_name.toLowerCase().includes(q) ||
      row.department.toLowerCase().includes(q) ||
      row.ai_provider.toLowerCase().includes(q) ||
      row.model.toLowerCase().includes(q) ||
      row.date.includes(q)
    );
  });

  // Handle file uploads
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setter(content);
        setStatus({
          type: 'success',
          message: `Loaded file "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`,
        });
      }
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Failed to read file.' });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setter: (val: string) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setter(content);
        setStatus({
          type: 'success',
          message: `Dropped file "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`,
        });
      }
    };
    reader.readAsText(file);
  };

  // Export current dataset to CSV
  const handleExportCSV = () => {
    const headers = [
      'date',
      'employee_name',
      'department',
      'ai_provider',
      'model',
      'input_tokens',
      'output_tokens',
      'total_tokens',
      'cost_usd',
    ];
    const csvLines = [headers.join(',')];
    for (const r of dataset) {
      csvLines.push(
        [
          r.date,
          `"${r.employee_name.replace(/"/g, '""')}"`,
          `"${r.department.replace(/"/g, '""')}"`,
          r.ai_provider,
          `"${r.model.replace(/"/g, '""')}"`,
          r.input_tokens,
          r.output_tokens,
          r.total_tokens,
          r.cost_usd.toFixed(2),
        ].join(',')
      );
    }
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai_usage_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Action Handler: Replace or Concatenate
   */
  const handleApplyData = (
    mode: 'replace' | 'concatenate' | 'replace_provider_only',
    targetSection: 'Claude' | 'Copilot' | 'Combined'
  ) => {
    setStatus({ type: 'idle', message: '' });

    let parsedResult =
      targetSection === 'Claude'
        ? parsedClaude
        : targetSection === 'Copilot'
        ? parsedCopilot
        : parsedCombined;

    if (parsedResult.error) {
      setStatus({ type: 'error', message: parsedResult.error });
      return;
    }

    const newRecords = parsedResult.records;
    if (newRecords.length === 0) {
      setStatus({
        type: 'error',
        message: 'No records to import. Please upload a file or paste data first.',
      });
      return;
    }

    if (mode === 'replace') {
      // Replace entire dataset
      onUpdateDataset(newRecords);
      setStatus({
        type: 'success',
        message: `Dataset successfully REPLACED with ${newRecords.length} records from ${targetSection}!`,
      });
      setActiveTab('table');
    } else if (mode === 'replace_provider_only') {
      // Replace only this provider's records, leaving other providers intact
      const provider = targetSection === 'Claude' ? 'Claude' : 'Copilot';
      const otherRecords = dataset.filter((r) => r.ai_provider !== provider);
      const merged = [...otherRecords, ...newRecords];
      onUpdateDataset(merged);
      setStatus({
        type: 'success',
        message: `Replaced existing ${provider} records with ${newRecords.length} new records (${otherRecords.length} other records preserved).`,
      });
      setActiveTab('table');
    } else if (mode === 'concatenate') {
      // Concatenate / Append to current dataset
      const combined = [...dataset, ...newRecords];
      onUpdateDataset(combined);
      setStatus({
        type: 'success',
        message: `CONCATENATED ${newRecords.length} new records with existing ${dataset.length} records (Now ${combined.length} total).`,
      });
      setActiveTab('table');
    }
  };

  // Helper renderer for Preview Box
  const renderParsedPreview = (
    result: { records: AIUsageRecord[]; error?: string },
    providerName: 'Claude' | 'Copilot' | 'Combined'
  ) => {
    if (!result.records.length && !result.error) return null;

    if (result.error) {
      return (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{result.error}</span>
        </div>
      );
    }

    const subTotalCost = result.records.reduce((acc, r) => acc + r.cost_usd, 0);
    const subTotalTokens = result.records.reduce((acc, r) => acc + r.total_tokens, 0);
    const subInputTokens = result.records.reduce((acc, r) => acc + r.input_tokens, 0);
    const subOutputTokens = result.records.reduce((acc, r) => acc + r.output_tokens, 0);

    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
              ✓ Ready to Apply
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {result.records.length} {providerName} records parsed successfully
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">
              Tokens: <strong className="text-slate-900">{formatTokens(subTotalTokens)}</strong>
            </span>
            <span className="text-emerald-700 font-bold">
              Billing: {formatCurrency(subTotalCost)}
            </span>
          </div>
        </div>

        {/* Token Counting & Billing Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-2.5 rounded-lg border border-emerald-100">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Input Tokens</span>
            <span className="font-mono font-medium text-slate-800">{formatTokens(subInputTokens)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Output Tokens</span>
            <span className="font-mono font-medium text-slate-800">{formatTokens(subOutputTokens)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Tokens</span>
            <span className="font-mono font-bold text-slate-900">{formatTokens(subTotalTokens)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Calculated Billing</span>
            <span className="font-mono font-bold text-emerald-700">{formatCurrency(subTotalCost)}</span>
          </div>
        </div>

        {/* Preview rows table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-h-36">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-1.5 px-2">Date</th>
                <th className="py-1.5 px-2">Employee</th>
                <th className="py-1.5 px-2">Dept</th>
                <th className="py-1.5 px-2">Model</th>
                <th className="py-1.5 px-2 text-right">Tokens</th>
                <th className="py-1.5 px-2 text-right">Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {result.records.slice(0, 4).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-1 px-2">{row.date}</td>
                  <td className="py-1 px-2 font-sans font-medium text-slate-900">{row.employee_name}</td>
                  <td className="py-1 px-2 font-sans text-slate-600">{row.department}</td>
                  <td className="py-1 px-2 font-sans text-slate-500">{row.model}</td>
                  <td className="py-1 px-2 text-right">{formatTokens(row.total_tokens)}</td>
                  <td className="py-1 px-2 text-right text-slate-900 font-semibold">{formatCurrency(row.cost_usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.records.length > 4 && (
          <div className="text-center text-[10px] text-slate-500">
            + {result.records.length - 4} more rows parsed and ready
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="dataset-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        id="dataset-modal-content"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-indigo-100 text-indigo-700">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Dataset &amp; Excel Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload or paste dedicated Claude and Copilot data with custom token counting, billing, and replace/concatenate options
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Dataset Snapshot Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-600">
              Active Dataset: <strong className="text-slate-900 font-mono">{dataset.length}</strong> records
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Claude: {claudeCount} rows
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Copilot: {copilotCount} rows
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-slate-600">
            <span>
              Total Tokens: <strong className="text-slate-900">{formatTokens(totalTokens)}</strong>
            </span>
            <span>
              Total Spend: <strong className="text-emerald-700">{formatCurrency(totalCost)}</strong>
            </span>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Tab 1: Claude Data */}
            <button
              id="tab-claude-data"
              type="button"
              onClick={() => setActiveTab('claude')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'claude'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Claude Data</span>
              {parsedClaude.records.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white/25 rounded-full text-[10px]">
                  {parsedClaude.records.length}
                </span>
              )}
            </button>

            {/* Tab 2: Copilot Data */}
            <button
              id="tab-copilot-data"
              type="button"
              onClick={() => setActiveTab('copilot')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'copilot'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copilot Data</span>
              {parsedCopilot.records.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white/25 rounded-full text-[10px]">
                  {parsedCopilot.records.length}
                </span>
              )}
            </button>

            {/* Tab 3: Combined / Any Data */}
            <button
              id="tab-combined-data"
              type="button"
              onClick={() => setActiveTab('combined')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'combined'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Combined Import</span>
            </button>

            {/* Tab 4: Current Dataset Table */}
            <button
              id="tab-dataset-table"
              type="button"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Active Table ({dataset.length})</span>
            </button>
          </div>

          {/* Quick Actions (Export / Reset) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Download full dataset as CSV file"
            >
              <Download className="w-3 h-3 text-slate-600" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Reset dataset back to original sample records"
            >
              <RefreshCw className="w-3 h-3 text-slate-600" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Status */}
        {status.message && (
          <div
            className={`px-6 py-2 text-xs flex items-center justify-between ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {status.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatus({ type: 'idle', message: '' })}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Claude Upload & Paste Section */}
          {activeTab === 'claude' && (
            <div className="space-y-5">
              {/* Info banner for Claude Token Counting & Billing */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Bot className="w-4 h-4 text-amber-600" />
                  <span>Anthropic Claude Token Counting &amp; Billing</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Data uploaded or pasted here is explicitly mapped to <strong>Claude</strong>. All token counts (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">input_tokens</code>, <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">output_tokens</code>, <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">total_tokens</code>) and provided billing values (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">cost_usd</code> / <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">billing</code>) are parsed directly. If billing is omitted, it auto-computes using Claude Sonnet enterprise rates ($3.00/M input, $15.00/M output).
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setClaudeText(SAMPLE_CLAUDE_TSV)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load Sample Claude Dataset</span>
                  </button>
                  <span className="text-amber-700 text-[11px]">
                    Expected columns: date, employee_name, department, model, input_tokens, output_tokens, total_tokens, cost_usd
                  </span>
                </div>
              </div>

              {/* Upload Dropzone & File Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Drag and drop upload */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, setClaudeText)}
                  className="border-2 border-dashed border-amber-300 bg-amber-50/20 hover:bg-amber-50/40 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                  onClick={() => claudeFileInputRef.current?.click()}
                >
                  <Upload className="w-7 h-7 text-amber-600 mb-2" />
                  <span className="text-xs font-semibold text-slate-800">
                    Upload Claude CSV / TSV / Excel file
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Drag and drop file here, or click to browse (.csv, .tsv, .txt, .json)
                  </span>
                  <input
                    ref={claudeFileInputRef}
                    type="file"
                    accept=".csv,.tsv,.txt,.json"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setClaudeText)}
                  />
                </div>

                {/* Quick Paste from Excel / Sheets info */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">
                      Direct Copy-Paste from Excel or Google Sheets
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Select your Claude usage table in Microsoft Excel, Google Sheets, or a text editor, copy it (Ctrl+C / Cmd+C), and paste directly below. Tab delimiters and headers are auto-detected.
                    </p>
                  </div>
                  {claudeText && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setClaudeText('')}
                        className="text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        Clear text
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea for Pasting */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paste Claude Data (Excel rows, CSV, TSV, or JSON):
                </label>
                <textarea
                  id="claude-data-paste-textarea"
                  value={claudeText}
                  onChange={(e) => setClaudeText(e.target.value)}
                  placeholder={`date\temployee_name\tdepartment\tmodel\tinput_tokens\toutput_tokens\ttotal_tokens\tcost_usd\n2026-08-20\tAlex Rivera\tEngineering\tClaude Sonnet 4.6\t185000\t42000\t227000\t1.19`}
                  rows={6}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-amber-200 bg-amber-50/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>

              {/* Parsed Live Preview */}
              {renderParsedPreview(parsedClaude, 'Claude')}

              {/* Action Buttons: REPLACE or CONCATENATE */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Choose how to incorporate this Claude data into your dashboard:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Replace Options */}
                  <button
                    id="claude-replace-btn"
                    type="button"
                    onClick={() => handleApplyData('replace', 'Claude')}
                    disabled={!parsedClaude.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                    title="Overwrite all existing records with this Claude data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Dataset</span>
                  </button>

                  <button
                    id="claude-replace-provider-btn"
                    type="button"
                    onClick={() => handleApplyData('replace_provider_only', 'Claude')}
                    disabled={!parsedClaude.records.length}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    title="Replace only Claude records, keeping existing Copilot records intact"
                  >
                    <span>Replace Claude Only</span>
                  </button>

                  {/* Concatenate / Append Option */}
                  <button
                    id="claude-concatenate-btn"
                    type="button"
                    onClick={() => handleApplyData('concatenate', 'Claude')}
                    disabled={!parsedClaude.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                    title="Append these new records to the current dataset"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Concatenate (Append) to Dataset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Copilot Upload & Paste Section */}
          {activeTab === 'copilot' && (
            <div className="space-y-5">
              {/* Info banner for Copilot Token Counting & Billing */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span>GitHub Copilot Token Counting &amp; Billing</span>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  Data uploaded or pasted here is explicitly mapped to <strong>Copilot</strong>. All token counts (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">input_tokens</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">output_tokens</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">total_tokens</code>) and provided billing values (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">cost_usd</code> / <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">billing</code>) are parsed directly. If billing is omitted, it auto-computes using GitHub Copilot enterprise token rates ($2.50/M tokens).
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCopilotText(SAMPLE_COPILOT_TSV)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load Sample Copilot Dataset</span>
                  </button>
                  <span className="text-blue-700 text-[11px]">
                    Expected columns: date, employee_name, department, model, input_tokens, output_tokens, total_tokens, cost_usd
                  </span>
                </div>
              </div>

              {/* Upload Dropzone & File Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Drag and drop upload */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, setCopilotText)}
                  className="border-2 border-dashed border-blue-300 bg-blue-50/20 hover:bg-blue-50/40 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                  onClick={() => copilotFileInputRef.current?.click()}
                >
                  <Upload className="w-7 h-7 text-blue-600 mb-2" />
                  <span className="text-xs font-semibold text-slate-800">
                    Upload Copilot CSV / TSV / Excel file
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Drag and drop file here, or click to browse (.csv, .tsv, .txt, .json)
                  </span>
                  <input
                    ref={copilotFileInputRef}
                    type="file"
                    accept=".csv,.tsv,.txt,.json"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setCopilotText)}
                  />
                </div>

                {/* Quick Paste from Excel / Sheets info */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">
                      Direct Copy-Paste from Excel or Google Sheets
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Select your Copilot usage table in Microsoft Excel, Google Sheets, or GitHub enterprise export, copy it, and paste directly below. Header aliases and delimiters are auto-detected.
                    </p>
                  </div>
                  {copilotText && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setCopilotText('')}
                        className="text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        Clear text
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea for Pasting */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paste Copilot Data (Excel rows, CSV, TSV, or JSON):
                </label>
                <textarea
                  id="copilot-data-paste-textarea"
                  value={copilotText}
                  onChange={(e) => setCopilotText(e.target.value)}
                  placeholder={`date\temployee_name\tdepartment\tmodel\tinput_tokens\toutput_tokens\ttotal_tokens\tcost_usd\n2026-08-20\tJordan Hayes\tEngineering\tCopilot Chat\t220000\t55000\t275000\t0.88`}
                  rows={6}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-blue-200 bg-blue-50/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Parsed Live Preview */}
              {renderParsedPreview(parsedCopilot, 'Copilot')}

              {/* Action Buttons: REPLACE or CONCATENATE */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Choose how to incorporate this Copilot data into your dashboard:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Replace Options */}
                  <button
                    id="copilot-replace-btn"
                    type="button"
                    onClick={() => handleApplyData('replace', 'Copilot')}
                    disabled={!parsedCopilot.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                    title="Overwrite all existing records with this Copilot data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Dataset</span>
                  </button>

                  <button
                    id="copilot-replace-provider-btn"
                    type="button"
                    onClick={() => handleApplyData('replace_provider_only', 'Copilot')}
                    disabled={!parsedCopilot.records.length}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    title="Replace only Copilot records, keeping existing Claude records intact"
                  >
                    <span>Replace Copilot Only</span>
                  </button>

                  {/* Concatenate / Append Option */}
                  <button
                    id="copilot-concatenate-btn"
                    type="button"
                    onClick={() => handleApplyData('concatenate', 'Copilot')}
                    disabled={!parsedCopilot.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                    title="Append these new records to the current dataset"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Concatenate (Append) to Dataset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Combined / Multi-Platform Data */}
          {activeTab === 'combined' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Combined Multi-Platform Dataset Import</span>
                </div>
                <p className="text-indigo-800 leading-relaxed">
                  For files containing both Claude and Copilot rows. The system automatically reads the <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">ai_provider</code> column to route each row to its respective token counters and billing models.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setCombinedText)}
                className="border-2 border-dashed border-indigo-300 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                onClick={() => combinedFileInputRef.current?.click()}
              >
                <Upload className="w-7 h-7 text-indigo-600 mb-2" />
                <span className="text-xs font-semibold text-slate-800">
                  Upload Combined CSV / TSV / Excel file
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Drag and drop file here, or click to browse (.csv, .tsv, .txt, .json)
                </span>
                <input
                  ref={combinedFileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt,.json"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setCombinedText)}
                />
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paste Combined Data:
                </label>
                <textarea
                  id="combined-data-paste-textarea"
                  value={combinedText}
                  onChange={(e) => setCombinedText(e.target.value)}
                  placeholder={`date\temployee_name\tdepartment\tai_provider\tmodel\tinput_tokens\toutput_tokens\ttotal_tokens\tcost_usd\n2026-08-20\tAlex Rivera\tEngineering\tClaude\tClaude Sonnet 4.6\t185000\t42000\t227000\t1.19\n2026-08-20\tJordan Hayes\tEngineering\tCopilot\tCopilot Chat\t220000\t55000\t275000\t0.88`}
                  rows={6}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-indigo-200 bg-indigo-50/10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              {renderParsedPreview(parsedCombined, 'Combined')}

              {/* Action Buttons: REPLACE or CONCATENATE */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Choose action for combined data:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id="combined-replace-btn"
                    type="button"
                    onClick={() => handleApplyData('replace', 'Combined')}
                    disabled={!parsedCombined.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Entire Dataset</span>
                  </button>

                  <button
                    id="combined-concatenate-btn"
                    type="button"
                    onClick={() => handleApplyData('concatenate', 'Combined')}
                    disabled={!parsedCombined.records.length}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Concatenate (Append) to Dataset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Active Dataset Table View */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              {/* Filter controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search */}
                <div className="relative min-w-[260px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, dept, or model..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter by Provider Pills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Provider:</span>
                  <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                    {(['All', 'Claude', 'Copilot'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTableFilterProvider(p)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                          tableFilterProvider === p
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Employee</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3 text-right">In Tokens</th>
                      <th className="py-2.5 px-3 text-right">Out Tokens</th>
                      <th className="py-2.5 px-3 text-right">Total Tokens</th>
                      <th className="py-2.5 px-3 text-right">Spend ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredDataset.slice(0, 150).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-600">{row.date}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.employee_name}</td>
                        <td className="py-2 px-3 text-slate-600">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            {row.department}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.ai_provider === 'Claude'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {row.ai_provider}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{row.model}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600">
                          {formatTokens(row.input_tokens)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600">
                          {formatTokens(row.output_tokens)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-slate-800">
                          {formatTokens(row.total_tokens)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(row.cost_usd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  Showing {Math.min(150, filteredDataset.length)} of {filteredDataset.length} matching rows
                </span>
                {filteredDataset.length > 150 && (
                  <span>(Displaying first 150 rows for optimal performance)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Enterprise data importer • Dedicated Claude &amp; Copilot token counters and billing models
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
