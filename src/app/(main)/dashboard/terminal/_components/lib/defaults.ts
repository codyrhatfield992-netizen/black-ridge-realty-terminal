import type { RiskTolerance, ScenarioPresetKey, TerminalAssumptions } from "./types";

// Modeled client profile: Cody Hatfield, Eastern Kentucky University. Professional/internship
// income plus a TerraCloud venture pipeline income stream. All figures are sample/model data.
export const DEFAULT_ASSUMPTIONS: TerminalAssumptions = {
  cash: 62_000,
  publicEquities: 215_000,
  retirementAssets: 88_000,
  realEstateEquity: 95_000,
  alternatives: 25_000,
  liabilities: 72_000,
  professionalIncome: 4_500,
  ventureIncome: 2_500,
  monthlyExpenses: 3_800,
  revenue: 12_000_000,
  ebitdaMargin: 22,
  growthRate: 11,
  wacc: 10,
  terminalGrowthRate: 3,
  riskTolerance: "Growth",
  timeHorizonYears: 7,
};

export const RISK_TOLERANCE_OPTIONS: RiskTolerance[] = ["Conservative", "Balanced", "Growth", "Aggressive"];

export const TIME_HORIZON_OPTIONS = [3, 5, 7, 10, 15, 20, 25, 30];

export const SCENARIO_PRESET_KEYS: ScenarioPresetKey[] = ["Conservative", "Base", "Growth"];

// Quick-pick presets for the top-level scenario selector. "Base" mirrors DEFAULT_ASSUMPTIONS
// exactly so switching back to it always matches the reset state.
export const SCENARIO_PRESETS: Record<
  ScenarioPresetKey,
  Pick<TerminalAssumptions, "growthRate" | "ebitdaMargin" | "wacc" | "terminalGrowthRate" | "riskTolerance">
> = {
  Conservative: { growthRate: 6, ebitdaMargin: 18, wacc: 12, terminalGrowthRate: 2, riskTolerance: "Conservative" },
  Base: { growthRate: 11, ebitdaMargin: 22, wacc: 10, terminalGrowthRate: 3, riskTolerance: "Growth" },
  Growth: { growthRate: 16, ebitdaMargin: 26, wacc: 8.5, terminalGrowthRate: 3.5, riskTolerance: "Aggressive" },
};

export interface WatchlistInstrument {
  symbol: string;
  name: string;
  category: string;
  price: string;
  changePercent: number;
}

// Illustrative snapshot only — not a live feed. Values are static sample data for the model.
export const WATCHLIST_INSTRUMENTS: WatchlistInstrument[] = [
  { symbol: "SPX", name: "S&P 500 Index", category: "Equity Index", price: "5,842.30", changePercent: 0.64 },
  { symbol: "NDX", name: "Nasdaq 100 Index", category: "Equity Index", price: "20,974.10", changePercent: 0.91 },
  { symbol: "US10Y", name: "US 10-Year Treasury Yield", category: "Rates", price: "4.28%", changePercent: -0.32 },
  { symbol: "GOLD", name: "Gold Spot", category: "Commodities", price: "2,398.60", changePercent: 0.18 },
  { symbol: "DXY", name: "US Dollar Index", category: "Currency", price: "103.92", changePercent: -0.11 },
  { symbol: "HY OAS", name: "High Yield Credit Spread", category: "Credit", price: "312 bps", changePercent: 1.4 },
  { symbol: "VIX", name: "CBOE Volatility Index", category: "Volatility", price: "14.85", changePercent: -2.6 },
  { symbol: "BTC", name: "Bitcoin", category: "Digital Assets", price: "64,210", changePercent: 3.2 },
];
