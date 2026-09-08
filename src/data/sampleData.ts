import { AIUsageRecord } from '../types';

/**
 * Enterprise AI Tool Usage Dataset
 * 
 * Generic array of records representing daily usage per employee per provider.
 * You can directly replace this array with your own Excel / CSV export data,
 * or paste CSV data via the dashboard's "Manage Dataset" button.
 */
export const INITIAL_AI_USAGE_DATA: AIUsageRecord[] = [
  // --- Week 1 (July 10 - July 16, 2026) ---
  {
    date: "2026-07-10",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 342000,
    output_tokens: 88500,
    total_tokens: 430500,
    cost_usd: 2.35
  },
  {
    date: "2026-07-10",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 85000,
    output_tokens: 15200,
    total_tokens: 100200,
    cost_usd: 0.36
  },
  {
    date: "2026-07-10",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 195000,
    output_tokens: 32000,
    total_tokens: 227000,
    cost_usd: 0.81
  },
  {
    date: "2026-07-10",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 142000,
    output_tokens: 45000,
    total_tokens: 187000,
    cost_usd: 1.10
  },
  {
    date: "2026-07-11",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 210000,
    output_tokens: 72000,
    total_tokens: 282000,
    cost_usd: 1.71
  },
  {
    date: "2026-07-11",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 65000,
    output_tokens: 12000,
    total_tokens: 77000,
    cost_usd: 0.28
  },
  {
    date: "2026-07-11",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 310000,
    output_tokens: 48000,
    total_tokens: 358000,
    cost_usd: 1.25
  },
  {
    date: "2026-07-12",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 115000,
    output_tokens: 31000,
    total_tokens: 146000,
    cost_usd: 0.81
  },
  {
    date: "2026-07-12",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 180000,
    output_tokens: 52000,
    total_tokens: 232000,
    cost_usd: 1.32
  },
  {
    date: "2026-07-13",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 75000,
    output_tokens: 14000,
    total_tokens: 89000,
    cost_usd: 0.33
  },
  {
    date: "2026-07-13",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 490000,
    output_tokens: 112000,
    total_tokens: 602000,
    cost_usd: 3.15
  },
  {
    date: "2026-07-13",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 240000,
    output_tokens: 41000,
    total_tokens: 281000,
    cost_usd: 1.01
  },
  {
    date: "2026-07-14",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 95000,
    output_tokens: 18000,
    total_tokens: 113000,
    cost_usd: 0.42
  },
  {
    date: "2026-07-14",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 165000,
    output_tokens: 44000,
    total_tokens: 209000,
    cost_usd: 1.15
  },
  {
    date: "2026-07-15",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 280000,
    output_tokens: 46000,
    total_tokens: 326000,
    cost_usd: 1.16
  },
  {
    date: "2026-07-15",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 340000,
    output_tokens: 58000,
    total_tokens: 398000,
    cost_usd: 1.43
  },
  {
    date: "2026-07-16",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 320000,
    output_tokens: 98000,
    total_tokens: 418000,
    cost_usd: 2.43
  },

  // --- Week 2 (July 17 - July 23, 2026) ---
  {
    date: "2026-07-17",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 520000,
    output_tokens: 130000,
    total_tokens: 650000,
    cost_usd: 3.51
  },
  {
    date: "2026-07-17",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 125000,
    output_tokens: 22000,
    total_tokens: 147000,
    cost_usd: 0.53
  },
  {
    date: "2026-07-18",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 260000,
    output_tokens: 64000,
    total_tokens: 324000,
    cost_usd: 1.74
  },
  {
    date: "2026-07-18",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 145000,
    output_tokens: 38000,
    total_tokens: 183000,
    cost_usd: 1.01
  },
  {
    date: "2026-07-19",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 80000,
    output_tokens: 16000,
    total_tokens: 96000,
    cost_usd: 0.36
  },
  {
    date: "2026-07-20",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 190000,
    output_tokens: 58000,
    total_tokens: 248000,
    cost_usd: 1.44
  },
  {
    date: "2026-07-20",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 420000,
    output_tokens: 65000,
    total_tokens: 485000,
    cost_usd: 1.70
  },
  {
    date: "2026-07-21",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 280000,
    output_tokens: 82000,
    total_tokens: 362000,
    cost_usd: 2.07
  },
  {
    date: "2026-07-21",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 310000,
    output_tokens: 54000,
    total_tokens: 364000,
    cost_usd: 1.31
  },
  {
    date: "2026-07-22",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 72000,
    output_tokens: 14000,
    total_tokens: 86000,
    cost_usd: 0.32
  },
  {
    date: "2026-07-22",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 390000,
    output_tokens: 110000,
    total_tokens: 500000,
    cost_usd: 2.82
  },
  {
    date: "2026-07-23",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 210000,
    output_tokens: 36000,
    total_tokens: 246000,
    cost_usd: 0.88
  },

  // --- Week 3 (July 24 - July 30, 2026) ---
  // FIRST VISIBLE SPIKE: Alex Rivera refactors Core Microservices in Claude
  {
    date: "2026-07-24",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 2850000,
    output_tokens: 680000,
    total_tokens: 3530000,
    cost_usd: 18.75
  },
  {
    date: "2026-07-25",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 3450000,
    output_tokens: 820000,
    total_tokens: 4270000,
    cost_usd: 22.65
  },
  {
    date: "2026-07-25",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 380000,
    output_tokens: 62000,
    total_tokens: 442000,
    cost_usd: 1.57
  },
  {
    date: "2026-07-26",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 190000,
    output_tokens: 52000,
    total_tokens: 242000,
    cost_usd: 1.35
  },
  {
    date: "2026-07-26",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 95000,
    output_tokens: 19000,
    total_tokens: 114000,
    cost_usd: 0.43
  },
  {
    date: "2026-07-27",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 230000,
    output_tokens: 66000,
    total_tokens: 296000,
    cost_usd: 1.68
  },
  {
    date: "2026-07-27",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 140000,
    output_tokens: 26000,
    total_tokens: 166000,
    cost_usd: 0.61
  },
  {
    date: "2026-07-28",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 240000,
    output_tokens: 68000,
    total_tokens: 308000,
    cost_usd: 1.74
  },
  {
    date: "2026-07-28",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 130000,
    output_tokens: 38000,
    total_tokens: 168000,
    cost_usd: 0.96
  },
  {
    date: "2026-07-29",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 390000,
    output_tokens: 61000,
    total_tokens: 451000,
    cost_usd: 1.58
  },
  {
    date: "2026-07-29",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 88000,
    output_tokens: 15000,
    total_tokens: 103000,
    cost_usd: 0.37
  },
  {
    date: "2026-07-30",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 820000,
    output_tokens: 195000,
    total_tokens: 1015000,
    cost_usd: 5.38
  },

  // --- Week 4 (July 31 - Aug 6, 2026) ---
  {
    date: "2026-07-31",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 450000,
    output_tokens: 72000,
    total_tokens: 522000,
    cost_usd: 1.84
  },
  {
    date: "2026-07-31",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 310000,
    output_tokens: 88000,
    total_tokens: 398000,
    cost_usd: 2.25
  },
  {
    date: "2026-08-01",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 440000,
    output_tokens: 125000,
    total_tokens: 565000,
    cost_usd: 3.19
  },
  {
    date: "2026-08-01",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 180000,
    output_tokens: 49000,
    total_tokens: 229000,
    cost_usd: 1.28
  },
  {
    date: "2026-08-02",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 350000,
    output_tokens: 88000,
    total_tokens: 438000,
    cost_usd: 2.37
  },
  {
    date: "2026-08-02",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 110000,
    output_tokens: 21000,
    total_tokens: 131000,
    cost_usd: 0.48
  },
  {
    date: "2026-08-03",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 560000,
    output_tokens: 85000,
    total_tokens: 645000,
    cost_usd: 2.25
  },
  {
    date: "2026-08-03",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 130000,
    output_tokens: 24000,
    total_tokens: 154000,
    cost_usd: 0.56
  },
  {
    date: "2026-08-04",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 160000,
    output_tokens: 42000,
    total_tokens: 202000,
    cost_usd: 1.11
  },
  {
    date: "2026-08-04",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 210000,
    output_tokens: 56000,
    total_tokens: 266000,
    cost_usd: 1.47
  },
  {
    date: "2026-08-05",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 620000,
    output_tokens: 95000,
    total_tokens: 715000,
    cost_usd: 2.50
  },
  {
    date: "2026-08-05",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 120000,
    output_tokens: 22000,
    total_tokens: 142000,
    cost_usd: 0.52
  },
  {
    date: "2026-08-06",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 680000,
    output_tokens: 160000,
    total_tokens: 840000,
    cost_usd: 4.44
  },

  // --- Week 5 (Aug 7 - Aug 13, 2026) ---
  // SECOND VISIBLE SPIKE: Copilot heavy batch automated tests & migrations by Liam Chen
  {
    date: "2026-08-07",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 2450000,
    output_tokens: 420000,
    total_tokens: 2870000,
    cost_usd: 10.32
  },
  {
    date: "2026-08-08",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 2980000,
    output_tokens: 510000,
    total_tokens: 3490000,
    cost_usd: 12.55
  },
  {
    date: "2026-08-08",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 410000,
    output_tokens: 95000,
    total_tokens: 505000,
    cost_usd: 2.65
  },
  {
    date: "2026-08-09",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 380000,
    output_tokens: 105000,
    total_tokens: 485000,
    cost_usd: 2.71
  },
  {
    date: "2026-08-09",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 85000,
    output_tokens: 17000,
    total_tokens: 102000,
    cost_usd: 0.38
  },
  {
    date: "2026-08-10",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 340000,
    output_tokens: 92000,
    total_tokens: 432000,
    cost_usd: 2.40
  },
  {
    date: "2026-08-10",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 95000,
    output_tokens: 18000,
    total_tokens: 113000,
    cost_usd: 0.42
  },
  {
    date: "2026-08-11",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 280000,
    output_tokens: 76000,
    total_tokens: 356000,
    cost_usd: 1.98
  },
  {
    date: "2026-08-11",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 720000,
    output_tokens: 175000,
    total_tokens: 895000,
    cost_usd: 4.78
  },
  {
    date: "2026-08-12",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 290000,
    output_tokens: 79000,
    total_tokens: 369000,
    cost_usd: 2.05
  },
  {
    date: "2026-08-12",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 105000,
    output_tokens: 19000,
    total_tokens: 124000,
    cost_usd: 0.46
  },
  {
    date: "2026-08-13",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 410000,
    output_tokens: 68000,
    total_tokens: 478000,
    cost_usd: 1.70
  },

  // --- Week 6 (Aug 14 - Aug 20, 2026) ---
  // THIRD VISIBLE SPIKE: Marcus Brody marketing campaign global launch
  {
    date: "2026-08-14",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 2150000,
    output_tokens: 580000,
    total_tokens: 2730000,
    cost_usd: 15.15
  },
  {
    date: "2026-08-15",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 2600000,
    output_tokens: 710000,
    total_tokens: 3310000,
    cost_usd: 18.45
  },
  {
    date: "2026-08-15",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 950000,
    output_tokens: 210000,
    total_tokens: 1160000,
    cost_usd: 6.00
  },
  {
    date: "2026-08-16",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 480000,
    output_tokens: 130000,
    total_tokens: 610000,
    cost_usd: 3.39
  },
  {
    date: "2026-08-16",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 380000,
    output_tokens: 59000,
    total_tokens: 439000,
    cost_usd: 1.54
  },
  {
    date: "2026-08-17",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 210000,
    output_tokens: 54000,
    total_tokens: 264000,
    cost_usd: 1.44
  },
  {
    date: "2026-08-17",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 110000,
    output_tokens: 21000,
    total_tokens: 131000,
    cost_usd: 0.48
  },
  {
    date: "2026-08-18",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 175000,
    output_tokens: 46000,
    total_tokens: 221000,
    cost_usd: 1.21
  },
  {
    date: "2026-08-18",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 360000,
    output_tokens: 82000,
    total_tokens: 442000,
    cost_usd: 2.31
  },
  {
    date: "2026-08-19",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 160000,
    output_tokens: 28000,
    total_tokens: 188000,
    cost_usd: 0.68
  },
  {
    date: "2026-08-19",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 240000,
    output_tokens: 62000,
    total_tokens: 302000,
    cost_usd: 1.65
  },
  {
    date: "2026-08-20",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 480000,
    output_tokens: 76000,
    total_tokens: 556000,
    cost_usd: 1.96
  },

  // --- Week 7 (Aug 21 - Aug 27, 2026) ---
  {
    date: "2026-08-21",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 370000,
    output_tokens: 96000,
    total_tokens: 466000,
    cost_usd: 2.55
  },
  {
    date: "2026-08-21",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 510000,
    output_tokens: 82000,
    total_tokens: 592000,
    cost_usd: 2.09
  },
  {
    date: "2026-08-22",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 460000,
    output_tokens: 128000,
    total_tokens: 588000,
    cost_usd: 3.30
  },
  {
    date: "2026-08-22",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 95000,
    output_tokens: 18000,
    total_tokens: 113000,
    cost_usd: 0.42
  },
  {
    date: "2026-08-23",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 310000,
    output_tokens: 84000,
    total_tokens: 394000,
    cost_usd: 2.19
  },
  {
    date: "2026-08-23",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 115000,
    output_tokens: 22000,
    total_tokens: 137000,
    cost_usd: 0.51
  },
  {
    date: "2026-08-24",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 1100000,
    output_tokens: 260000,
    total_tokens: 1360000,
    cost_usd: 7.20
  },
  {
    date: "2026-08-24",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 440000,
    output_tokens: 72000,
    total_tokens: 512000,
    cost_usd: 1.82
  },
  {
    date: "2026-08-25",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 320000,
    output_tokens: 88000,
    total_tokens: 408000,
    cost_usd: 2.28
  },
  {
    date: "2026-08-25",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 98000,
    output_tokens: 18000,
    total_tokens: 116000,
    cost_usd: 0.43
  },
  {
    date: "2026-08-26",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 580000,
    output_tokens: 92000,
    total_tokens: 672000,
    cost_usd: 2.37
  },
  {
    date: "2026-08-26",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 135000,
    output_tokens: 24000,
    total_tokens: 159000,
    cost_usd: 0.58
  },
  {
    date: "2026-08-27",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 890000,
    output_tokens: 210000,
    total_tokens: 1100000,
    cost_usd: 5.82
  },

  // --- Week 8 (Aug 28 - Sep 3, 2026) ---
  {
    date: "2026-08-28",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 520000,
    output_tokens: 140000,
    total_tokens: 660000,
    cost_usd: 3.66
  },
  {
    date: "2026-08-28",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 380000,
    output_tokens: 88000,
    total_tokens: 468000,
    cost_usd: 2.46
  },
  {
    date: "2026-08-29",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 240000,
    output_tokens: 61000,
    total_tokens: 301000,
    cost_usd: 1.63
  },
  {
    date: "2026-08-29",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 185000,
    output_tokens: 49000,
    total_tokens: 234000,
    cost_usd: 1.29
  },
  {
    date: "2026-08-30",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 125000,
    output_tokens: 24000,
    total_tokens: 149000,
    cost_usd: 0.55
  },
  {
    date: "2026-08-30",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 460000,
    output_tokens: 74000,
    total_tokens: 534000,
    cost_usd: 1.89
  },
  {
    date: "2026-08-31",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 390000,
    output_tokens: 102000,
    total_tokens: 492000,
    cost_usd: 2.70
  },
  {
    date: "2026-08-31",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 540000,
    output_tokens: 88000,
    total_tokens: 628000,
    cost_usd: 2.23
  },
  {
    date: "2026-09-01",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 140000,
    output_tokens: 26000,
    total_tokens: 166000,
    cost_usd: 0.61
  },
  {
    date: "2026-09-01",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 270000,
    output_tokens: 68000,
    total_tokens: 338000,
    cost_usd: 1.83
  },
  {
    date: "2026-09-02",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 1450000,
    output_tokens: 340000,
    total_tokens: 1790000,
    cost_usd: 9.45
  },
  {
    date: "2026-09-02",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 480000,
    output_tokens: 78000,
    total_tokens: 558000,
    cost_usd: 1.98
  },
  {
    date: "2026-09-03",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 590000,
    output_tokens: 155000,
    total_tokens: 745000,
    cost_usd: 4.10
  },
  {
    date: "2026-09-03",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 620000,
    output_tokens: 96000,
    total_tokens: 716000,
    cost_usd: 2.51
  },

  // --- Week 9 (Sep 4 - Sep 7, 2026) ---
  {
    date: "2026-09-04",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 410000,
    output_tokens: 108000,
    total_tokens: 518000,
    cost_usd: 2.85
  },
  {
    date: "2026-09-04",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 110000,
    output_tokens: 22000,
    total_tokens: 132000,
    cost_usd: 0.49
  },
  {
    date: "2026-09-05",
    employee_name: "Elena Rostova",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 330000,
    output_tokens: 89000,
    total_tokens: 419000,
    cost_usd: 2.32
  },
  {
    date: "2026-09-05",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 125000,
    output_tokens: 24000,
    total_tokens: 149000,
    cost_usd: 0.55
  },
  {
    date: "2026-09-06",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 1280000,
    output_tokens: 295000,
    total_tokens: 1575000,
    cost_usd: 8.26
  },
  {
    date: "2026-09-06",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 490000,
    output_tokens: 81000,
    total_tokens: 571000,
    cost_usd: 2.03
  },
  {
    date: "2026-09-07",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 590000,
    output_tokens: 92000,
    total_tokens: 682000,
    cost_usd: 2.41
  },
  {
    date: "2026-09-07",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 340000,
    output_tokens: 91000,
    total_tokens: 431000,
    cost_usd: 2.41
  },
  {
    date: "2026-09-07",
    employee_name: "David Kim",
    department: "Sales",
    ai_provider: "Copilot",
    model: "Copilot Chat",
    input_tokens: 112000,
    output_tokens: 21000,
    total_tokens: 133000,
    cost_usd: 0.50
  },

  // Additional weekday fills ensuring ~160 comprehensive rows across the 60-day period:
  {
    date: "2026-07-12",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 195000,
    output_tokens: 48000,
    total_tokens: 243000,
    cost_usd: 1.30
  },
  {
    date: "2026-07-16",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 170000,
    output_tokens: 42000,
    total_tokens: 212000,
    cost_usd: 1.14
  },
  {
    date: "2026-07-17",
    employee_name: "Kenji Sato",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 140000,
    output_tokens: 36000,
    total_tokens: 176000,
    cost_usd: 0.96
  },
  {
    date: "2026-07-19",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 360000,
    output_tokens: 58000,
    total_tokens: 418000,
    cost_usd: 1.48
  },
  {
    date: "2026-07-23",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 290000,
    output_tokens: 78000,
    total_tokens: 368000,
    cost_usd: 2.04
  },
  {
    date: "2026-07-24",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 310000,
    output_tokens: 52000,
    total_tokens: 362000,
    cost_usd: 1.30
  },
  {
    date: "2026-07-30",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 410000,
    output_tokens: 115000,
    total_tokens: 525000,
    cost_usd: 2.95
  },
  {
    date: "2026-08-01",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 780000,
    output_tokens: 185000,
    total_tokens: 965000,
    cost_usd: 5.11
  },
  {
    date: "2026-08-06",
    employee_name: "Priya Sharma",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 260000,
    output_tokens: 69000,
    total_tokens: 329000,
    cost_usd: 1.82
  },
  {
    date: "2026-08-07",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 920000,
    output_tokens: 215000,
    total_tokens: 1135000,
    cost_usd: 5.98
  },
  {
    date: "2026-08-12",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 350000,
    output_tokens: 94000,
    total_tokens: 444000,
    cost_usd: 2.46
  },
  {
    date: "2026-08-13",
    employee_name: "Alex Rivera",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 880000,
    output_tokens: 205000,
    total_tokens: 1085000,
    cost_usd: 5.72
  },
  {
    date: "2026-08-14",
    employee_name: "Liam Chen",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 490000,
    output_tokens: 78000,
    total_tokens: 568000,
    cost_usd: 2.00
  },
  {
    date: "2026-08-17",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Copilot",
    model: "GPT-4o",
    input_tokens: 420000,
    output_tokens: 69000,
    total_tokens: 489000,
    cost_usd: 1.74
  },
  {
    date: "2026-08-20",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 360000,
    output_tokens: 95000,
    total_tokens: 455000,
    cost_usd: 2.50
  },
  {
    date: "2026-08-27",
    employee_name: "Maya Patel",
    department: "Engineering",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 390000,
    output_tokens: 89000,
    total_tokens: 479000,
    cost_usd: 2.51
  },
  {
    date: "2026-09-02",
    employee_name: "Sarah Jenkins",
    department: "Design",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 380000,
    output_tokens: 99000,
    total_tokens: 479000,
    cost_usd: 2.62
  },
  {
    date: "2026-09-03",
    employee_name: "Jordan Hayes",
    department: "Sales",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 260000,
    output_tokens: 68000,
    total_tokens: 328000,
    cost_usd: 1.80
  },
  {
    date: "2026-09-06",
    employee_name: "Marcus Brody",
    department: "Marketing",
    ai_provider: "Claude",
    model: "Claude Sonnet 4.6",
    input_tokens: 610000,
    output_tokens: 160000,
    total_tokens: 770000,
    cost_usd: 4.23
  }
];
