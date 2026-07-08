import { formatMonths, formatPercent, formatUsd } from "./format";
import type { TerminalAssumptions, TerminalModel } from "./types";

export function buildSummaryExport(assumptions: TerminalAssumptions, model: TerminalModel, memo: string) {
  const generatedAt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(new Date());

  const lines = [
    "BLACK RIDGE TERMINAL — MODEL SUMMARY",
    `Generated ${generatedAt}`,
    "Model/sample data only — not financial, investment, or valuation advice.",
    "",
    "KEY METRICS",
    `Net Worth: ${formatUsd(model.netWorth)}`,
    `Total Assets: ${formatUsd(model.totalAssets)}`,
    `Total Liabilities: ${formatUsd(model.totalLiabilities)}`,
    `Monthly Surplus: ${formatUsd(model.monthlySurplus)} (${formatPercent(model.savingsRate)} savings rate)`,
    `Emergency Runway: ${formatMonths(model.emergencyRunwayMonths)}`,
    `Debt-to-Asset Ratio: ${formatPercent(model.debtToAssetRatio)}`,
    `Wealth Health Score: ${model.wealthHealthScore}/100`,
    `Enterprise Value: ${formatUsd(model.enterpriseValue)}`,
    `Equity Value: ${formatUsd(model.equityValue)}`,
    `Risk Score: ${Math.round(model.riskScore)}/100 (${model.riskTier})`,
    "",
    "SCENARIO ANALYSIS (Enterprise Value)",
    ...model.scenarios.map((scenario) => `${scenario.label}: ${formatUsd(scenario.enterpriseValue)}`),
    "",
    "KEY ASSUMPTIONS",
    `Risk Tolerance: ${assumptions.riskTolerance}`,
    `Time Horizon: ${assumptions.timeHorizonYears} years`,
    `Revenue: ${formatUsd(assumptions.revenue)} · EBITDA Margin: ${assumptions.ebitdaMargin}% · Growth: ${assumptions.growthRate}% · WACC: ${assumptions.wacc}% · Terminal Growth: ${assumptions.terminalGrowthRate}%`,
    "",
    "ADVISOR MEMO",
    memo,
  ];

  return lines.join("\n");
}
