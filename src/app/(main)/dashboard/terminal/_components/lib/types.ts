export type RiskTolerance = "Conservative" | "Balanced" | "Growth" | "Aggressive";

export interface TerminalAssumptions {
  cash: number;
  publicEquities: number;
  retirementAssets: number;
  realEstateEquity: number;
  alternatives: number;
  liabilities: number;
  professionalIncome: number;
  ventureIncome: number;
  monthlyExpenses: number;
  revenue: number;
  ebitdaMargin: number;
  growthRate: number;
  wacc: number;
  terminalGrowthRate: number;
  riskTolerance: RiskTolerance;
  timeHorizonYears: number;
}

export type AllocationKey = "cash" | "publicEquities" | "retirementAssets" | "realEstateEquity" | "alternatives";

export interface AllocationSlice {
  key: AllocationKey;
  label: string;
  amount: number;
  weight: number;
}

export type ScenarioKey = "bear" | "base" | "bull";

export type ScenarioPresetKey = "Conservative" | "Base" | "Growth";

export interface ScenarioResult {
  key: ScenarioKey;
  label: string;
  enterpriseValue: number;
  equityValue: number;
}

export interface CashFlowForecastPoint {
  year: number;
  netWorth: number;
  contributions: number;
}

export interface SensitivityMatrix {
  waccRange: number[];
  terminalGrowthRange: number[];
  cells: number[][];
}

export interface TerminalModel {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  ventureIncomeShare: number;
  monthlySurplus: number;
  savingsRate: number;
  emergencyRunwayMonths: number;
  debtToAssetRatio: number;
  allocation: AllocationSlice[];
  topAllocation: AllocationSlice;
  wealthHealthScore: number;
  enterpriseValue: number;
  equityValue: number;
  explicitValue: number;
  terminalValuePv: number;
  scenarios: ScenarioResult[];
  riskScore: number;
  riskTier: string;
  equityWeight: number;
  expectedReturn: number;
  cashFlowForecast: CashFlowForecastPoint[];
  sensitivityMatrix: SensitivityMatrix;
}
