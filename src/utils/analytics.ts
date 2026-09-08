import {
  AIProvider,
  AIUsageRecord,
  AggregatedTrendPoint,
  DepartmentUsagePoint,
  Granularity,
  MetricMode,
  UserPlatformSummary,
  UserUsageItem,
} from '../types';

export function formatCurrency(amount: number, compact = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  if (compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTokens(tokens: number): string {
  if (tokens === undefined || tokens === null || isNaN(tokens)) return '0';
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(1)}B`;
  }
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(0)}K`;
  }
  return tokens.toLocaleString();
}

/**
 * Parses YYYY-MM-DD safely into Date object at midnight UTC
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Returns bucket key and human-friendly display label based on granularity
 */
export function getBucketInfo(dateStr: string, granularity: Granularity): { key: string; label: string; sortTime: number } {
  const date = parseDate(dateStr);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-indexed
  const day = date.getUTCDate();

  if (granularity === 'monthly') {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${monthNames[month]} ${year}`;
    const sortTime = Date.UTC(year, month, 1);
    return { key, label, sortTime };
  }

  if (granularity === 'weekly') {
    // Determine start of week (Sunday or Monday, let's pick Monday)
    const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday
    const diffToMonday = (dayOfWeek + 6) % 7; // days since Monday
    const monday = new Date(date.getTime() - diffToMonday * 86400000);
    const mYear = monday.getUTCFullYear();
    const mMonth = monday.getUTCMonth();
    const mDay = monday.getUTCDate();
    const key = `${mYear}-${String(mMonth + 1).padStart(2, '0')}-${String(mDay).padStart(2, '0')}`;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `Wk ${mDay} ${monthNames[mMonth]}`;
    const sortTime = monday.getTime();
    return { key, label, sortTime };
  }

  // Daily
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const label = `${monthNames[month]} ${day}`;
  const sortTime = date.getTime();
  return { key: dateStr, label, sortTime };
}

/**
 * Summary metrics for Row 1
 */
export function getSummaryMetrics(records: AIUsageRecord[]) {
  let totalTokens = 0;
  let totalCost = 0;
  let claudeCost = 0;
  let copilotCost = 0;
  let claudeTokens = 0;
  let copilotTokens = 0;
  const activeUsers = new Set<string>();
  const claudeUsers = new Set<string>();
  const copilotUsers = new Set<string>();
  const departments = new Set<string>();

  for (const record of records) {
    const tokens = record.total_tokens || (record.input_tokens + record.output_tokens);
    const cost = record.cost_usd || 0;

    totalTokens += tokens;
    totalCost += cost;
    activeUsers.add(record.employee_name);
    departments.add(record.department);

    if (record.ai_provider === 'Claude') {
      claudeCost += cost;
      claudeTokens += tokens;
      claudeUsers.add(record.employee_name);
    } else if (record.ai_provider === 'Copilot') {
      copilotCost += cost;
      copilotTokens += tokens;
      copilotUsers.add(record.employee_name);
    }
  }

  const totalBothCosts = claudeCost + copilotCost;
  const claudeCostPercent = totalBothCosts > 0 ? (claudeCost / totalBothCosts) * 100 : 0;
  const copilotCostPercent = totalBothCosts > 0 ? (copilotCost / totalBothCosts) * 100 : 0;

  return {
    totalTokens,
    totalCost,
    claudeCost,
    copilotCost,
    claudeTokens,
    copilotTokens,
    claudeCostPercent,
    copilotCostPercent,
    activeUserCount: activeUsers.size,
    claudeUserCount: claudeUsers.size,
    copilotUserCount: copilotUsers.size,
    departmentCount: departments.size,
  };
}

/**
 * Aggregates trend chart data grouped by bucket according to granularity
 */
export function getTrendData(records: AIUsageRecord[], granularity: Granularity): AggregatedTrendPoint[] {
  const buckets = new Map<string, {
    key: string;
    label: string;
    sortTime: number;
    claudeCost: number;
    copilotCost: number;
    totalCost: number;
    claudeTokens: number;
    copilotTokens: number;
    totalTokens: number;
  }>();

  for (const record of records) {
    const { key, label, sortTime } = getBucketInfo(record.date, granularity);
    const tokens = record.total_tokens || (record.input_tokens + record.output_tokens);
    const cost = record.cost_usd || 0;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        key,
        label,
        sortTime,
        claudeCost: 0,
        copilotCost: 0,
        totalCost: 0,
        claudeTokens: 0,
        copilotTokens: 0,
        totalTokens: 0,
      };
      buckets.set(key, bucket);
    }

    bucket.totalCost += cost;
    bucket.totalTokens += tokens;

    if (record.ai_provider === 'Claude') {
      bucket.claudeCost += cost;
      bucket.claudeTokens += tokens;
    } else if (record.ai_provider === 'Copilot') {
      bucket.copilotCost += cost;
      bucket.copilotTokens += tokens;
    }
  }

  // Sort buckets chronologically
  return Array.from(buckets.values())
    .sort((a, b) => a.sortTime - b.sortTime)
    .map((b) => ({
      bucketKey: b.key,
      displayDate: b.label,
      claudeCost: Number(b.claudeCost.toFixed(2)),
      copilotCost: Number(b.copilotCost.toFixed(2)),
      totalCost: Number(b.totalCost.toFixed(2)),
      claudeTokens: Math.round(b.claudeTokens),
      copilotTokens: Math.round(b.copilotTokens),
      totalTokens: Math.round(b.totalTokens),
    }));
}

/**
 * Aggregates department usage for stacked bar charts
 */
export function getDepartmentUsage(records: AIUsageRecord[]): DepartmentUsagePoint[] {
  const deptMap = new Map<
    string,
    {
      department: string;
      claudeCost: number;
      copilotCost: number;
      totalCost: number;
      claudeTokens: number;
      copilotTokens: number;
      totalTokens: number;
      activeUsers: Set<string>;
    }
  >();

  for (const record of records) {
    const dept = record.department || 'Other';
    const tokens = record.total_tokens || (record.input_tokens + record.output_tokens);
    const cost = record.cost_usd || 0;

    let item = deptMap.get(dept);
    if (!item) {
      item = {
        department: dept,
        claudeCost: 0,
        copilotCost: 0,
        totalCost: 0,
        claudeTokens: 0,
        copilotTokens: 0,
        totalTokens: 0,
        activeUsers: new Set<string>(),
      };
      deptMap.set(dept, item);
    }

    item.totalCost += cost;
    item.totalTokens += tokens;
    if (record.employee_name) {
      item.activeUsers.add(record.employee_name);
    }

    if (record.ai_provider === 'Claude') {
      item.claudeCost += cost;
      item.claudeTokens += tokens;
    } else if (record.ai_provider === 'Copilot') {
      item.copilotCost += cost;
      item.copilotTokens += tokens;
    }
  }

  return Array.from(deptMap.values())
    .sort((a, b) => b.totalCost - a.totalCost)
    .map((d) => ({
      department: d.department,
      claudeCost: Number(d.claudeCost.toFixed(2)),
      copilotCost: Number(d.copilotCost.toFixed(2)),
      totalCost: Number(d.totalCost.toFixed(2)),
      claudeTokens: Math.round(d.claudeTokens),
      copilotTokens: Math.round(d.copilotTokens),
      totalTokens: Math.round(d.totalTokens),
      activeUsersCount: d.activeUsers.size,
    }));
}

/**
 * Calculates median value of an array of numbers
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Aggregates top users for a specific platform with median calculation
 * and high usage flag (> 2x median)
 */
export function getTopUsersByPlatform(
  records: AIUsageRecord[],
  provider: AIProvider,
  metric: MetricMode,
  limit?: number
): {
  users: UserPlatformSummary[];
  medianValue: number;
  totalPlatformCost: number;
  totalPlatformTokens: number;
} {
  const providerRecords = records.filter((r) => r.ai_provider === provider);
  const userMap = new Map<string, {
    employee_name: string;
    department: string;
    totalCost: number;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    activeDates: Set<string>;
    models: Set<string>;
  }>();

  let totalPlatformCost = 0;
  let totalPlatformTokens = 0;

  for (const record of providerRecords) {
    const tokens = record.total_tokens || (record.input_tokens + record.output_tokens);
    const cost = record.cost_usd || 0;

    totalPlatformCost += cost;
    totalPlatformTokens += tokens;

    let user = userMap.get(record.employee_name);
    if (!user) {
      user = {
        employee_name: record.employee_name,
        department: record.department,
        totalCost: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        activeDates: new Set<string>(),
        models: new Set<string>(),
      };
      userMap.set(record.employee_name, user);
    }

    user.totalCost += cost;
    user.totalTokens += tokens;
    user.inputTokens += record.input_tokens || 0;
    user.outputTokens += record.output_tokens || 0;
    user.activeDates.add(record.date);
    if (record.model) user.models.add(record.model);
  }

  const allUsersList = Array.from(userMap.values());
  if (allUsersList.length === 0) {
    return {
      users: [],
      medianValue: 0,
      totalPlatformCost: 0,
      totalPlatformTokens: 0,
    };
  }

  // Calculate median based on current metric mode (cost or tokens)
  const metricValues = allUsersList.map((u) => (metric === 'cost' ? u.totalCost : u.totalTokens));
  const medianVal = calculateMedian(metricValues);

  const mappedUsers: UserPlatformSummary[] = allUsersList.map((u) => {
    const currentVal = metric === 'cost' ? u.totalCost : u.totalTokens;
    // High usage flag: usage is more than 2x the median for their provider
    const isHighUsage = medianVal > 0 && currentVal > 2 * medianVal;

    return {
      employee_name: u.employee_name,
      department: u.department,
      totalCost: Number(u.totalCost.toFixed(2)),
      totalTokens: Math.round(u.totalTokens),
      inputTokens: Math.round(u.inputTokens),
      outputTokens: Math.round(u.outputTokens),
      activeDays: u.activeDates.size,
      modelsUsed: Array.from(u.models),
      isHighUsage,
      medianUsage: medianVal,
    };
  });

  // Sort descending by selected metric
  mappedUsers.sort((a, b) => (metric === 'cost' ? b.totalCost - a.totalCost : b.totalTokens - a.totalTokens));

  return {
    users: typeof limit === 'number' ? mappedUsers.slice(0, limit) : mappedUsers,
    medianValue: medianVal,
    totalPlatformCost,
    totalPlatformTokens,
  };
}

/**
 * Aggregates all users across both platforms into a comprehensive list
 */
export function getAllUsersUsage(
  records: AIUsageRecord[],
  metric: MetricMode = 'cost'
): {
  users: UserUsageItem[];
  medianCost: number;
  medianTokens: number;
} {
  const userMap = new Map<
    string,
    {
      employee_name: string;
      department: string;
      claudeCost: number;
      copilotCost: number;
      totalCost: number;
      claudeTokens: number;
      copilotTokens: number;
      totalTokens: number;
      activeDates: Set<string>;
      models: Set<string>;
      hasClaude: boolean;
      hasCopilot: boolean;
    }
  >();

  for (const record of records) {
    const tokens = record.total_tokens || (record.input_tokens + record.output_tokens);
    const cost = record.cost_usd || 0;

    let user = userMap.get(record.employee_name);
    if (!user) {
      user = {
        employee_name: record.employee_name,
        department: record.department,
        claudeCost: 0,
        copilotCost: 0,
        totalCost: 0,
        claudeTokens: 0,
        copilotTokens: 0,
        totalTokens: 0,
        activeDates: new Set<string>(),
        models: new Set<string>(),
        hasClaude: false,
        hasCopilot: false,
      };
      userMap.set(record.employee_name, user);
    }

    user.totalCost += cost;
    user.totalTokens += tokens;
    user.activeDates.add(record.date);
    if (record.model) user.models.add(record.model);

    if (record.ai_provider === 'Claude') {
      user.claudeCost += cost;
      user.claudeTokens += tokens;
      user.hasClaude = true;
    } else if (record.ai_provider === 'Copilot') {
      user.copilotCost += cost;
      user.copilotTokens += tokens;
      user.hasCopilot = true;
    }
  }

  const rawUsers = Array.from(userMap.values());
  if (rawUsers.length === 0) {
    return { users: [], medianCost: 0, medianTokens: 0 };
  }

  const medianCost = calculateMedian(rawUsers.map((u) => u.totalCost));
  const medianTokens = calculateMedian(rawUsers.map((u) => u.totalTokens));
  const threshold = metric === 'cost' ? medianCost * 2 : medianTokens * 2;

  const users: UserUsageItem[] = rawUsers.map((u) => {
    let primaryProvider: 'Claude' | 'Copilot' | 'Both' = 'Both';
    if (u.hasClaude && !u.hasCopilot) primaryProvider = 'Claude';
    else if (!u.hasClaude && u.hasCopilot) primaryProvider = 'Copilot';

    const testVal = metric === 'cost' ? u.totalCost : u.totalTokens;
    const isHighUsage = threshold > 0 && testVal > threshold;

    return {
      employee_name: u.employee_name,
      department: u.department,
      primaryProvider,
      claudeCost: Number(u.claudeCost.toFixed(2)),
      copilotCost: Number(u.copilotCost.toFixed(2)),
      totalCost: Number(u.totalCost.toFixed(2)),
      claudeTokens: Math.round(u.claudeTokens),
      copilotTokens: Math.round(u.copilotTokens),
      totalTokens: Math.round(u.totalTokens),
      activeDays: u.activeDates.size,
      modelsUsed: Array.from(u.models),
      isHighUsage,
    };
  });

  // Sort by selected metric descending
  users.sort((a, b) => (metric === 'cost' ? b.totalCost - a.totalCost : b.totalTokens - a.totalTokens));

  return { users, medianCost, medianTokens };
}

export interface BucketOption {
  key: string;
  label: string;
  sortTime: number;
}

export function getAvailableBuckets(records: AIUsageRecord[], granularity: Granularity): BucketOption[] {
  const bucketMap = new Map<string, { label: string; sortTime: number }>();
  for (const r of records) {
    const { key, label, sortTime } = getBucketInfo(r.date, granularity);
    if (!bucketMap.has(key)) {
      bucketMap.set(key, { label, sortTime });
    }
  }
  return Array.from(bucketMap.entries())
    .map(([key, data]) => ({ key, label: data.label, sortTime: data.sortTime }))
    .sort((a, b) => a.sortTime - b.sortTime);
}

export interface GranularSummaryMetrics {
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
  departmentCount: number;
  bucketKey: string;
  bucketLabel: string;
  isAllTime: boolean;
  averageTokens: number;
  averageCost: number;
  totalPeriodTokens: number;
  totalPeriodCost: number;
  bucketCount: number;
}

/**
 * Calculates summary metrics that adapt dynamically based on granularity and selected bucket.
 */
export function getGranularSummaryMetrics(
  records: AIUsageRecord[],
  granularity: Granularity,
  selectedBucketKey?: string
): GranularSummaryMetrics {
  const buckets = getAvailableBuckets(records, granularity);
  const bucketCount = Math.max(1, buckets.length);

  // Overall period totals
  const overall = getSummaryMetrics(records);
  const averageCost = overall.totalCost / bucketCount;
  const averageTokens = overall.totalTokens / bucketCount;

  if (records.length === 0) {
    return {
      ...overall,
      bucketKey: '',
      bucketLabel: 'No Data',
      isAllTime: false,
      averageTokens: 0,
      averageCost: 0,
      totalPeriodTokens: 0,
      totalPeriodCost: 0,
      bucketCount: 0,
    };
  }

  // Check if "all" is explicitly selected
  if (selectedBucketKey === 'all') {
    return {
      ...overall,
      bucketKey: 'all',
      bucketLabel: `All ${bucketCount} ${granularity === 'daily' ? 'Days' : granularity === 'weekly' ? 'Weeks' : 'Months'} (Combined)`,
      isAllTime: true,
      averageTokens,
      averageCost,
      totalPeriodTokens: overall.totalTokens,
      totalPeriodCost: overall.totalCost,
      bucketCount,
    };
  }

  // Determine active bucket key (default to the latest bucket if none specified or not found)
  let activeBucket = buckets.find((b) => b.key === selectedBucketKey);
  if (!activeBucket) {
    activeBucket = buckets[buckets.length - 1]; // latest bucket
  }

  // Filter records belonging to this specific bucket
  const bucketRecords = records.filter((r) => {
    const info = getBucketInfo(r.date, granularity);
    return info.key === activeBucket!.key;
  });

  const bucketMetrics = getSummaryMetrics(bucketRecords);

  const prefix = granularity === 'daily' ? 'Day of' : granularity === 'weekly' ? 'Week of' : 'Month of';
  const displayLabel = `${prefix} ${activeBucket.label}`;

  return {
    ...bucketMetrics,
    bucketKey: activeBucket.key,
    bucketLabel: displayLabel,
    isAllTime: false,
    averageTokens,
    averageCost,
    totalPeriodTokens: overall.totalTokens,
    totalPeriodCost: overall.totalCost,
    bucketCount,
  };
}

