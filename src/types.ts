export type AIProvider = 'Claude' | 'Copilot';

export interface AIUsageRecord {
  date: string; // YYYY-MM-DD
  employee_name: string;
  department: string; // e.g. Engineering, Sales, Marketing, Design
  ai_provider: AIProvider;
  model: string; // e.g. "Claude Sonnet 4.6", "GPT-4o", "Copilot Chat"
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_usd: number;
}

export type Granularity = 'daily' | 'weekly' | 'monthly';
export type MetricMode = 'cost' | 'tokens';
export type ProviderFilter = 'All' | 'Claude' | 'Copilot';

export interface AggregatedTrendPoint {
  bucketKey: string;
  displayDate: string;
  claudeCost: number;
  copilotCost: number;
  totalCost: number;
  claudeTokens: number;
  copilotTokens: number;
  totalTokens: number;
}

export interface DepartmentUsagePoint {
  department: string;
  claudeCost: number;
  copilotCost: number;
  totalCost: number;
  claudeTokens: number;
  copilotTokens: number;
  totalTokens: number;
  activeUsersCount: number;
}

export interface UserUsageItem {
  employee_name: string;
  department: string;
  primaryProvider: 'Claude' | 'Copilot' | 'Both';
  claudeCost: number;
  copilotCost: number;
  totalCost: number;
  claudeTokens: number;
  copilotTokens: number;
  totalTokens: number;
  activeDays: number;
  modelsUsed: string[];
  isHighUsage: boolean;
}

export interface UserPlatformSummary {
  employee_name: string;
  department: string;
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  activeDays: number;
  modelsUsed: string[];
  isHighUsage: boolean;
  medianUsage: number;
}
