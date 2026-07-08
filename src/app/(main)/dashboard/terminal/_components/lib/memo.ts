import { formatPercent, formatUsd } from "./format";
import type { TerminalAssumptions, TerminalModel } from "./types";

function liquidityPhrase(months: number) {
  if (months >= 6) return "a strong liquidity position";
  if (months >= 3) return "an adequate liquidity position";
  return "a constrained liquidity position";
}

function debtPhrase(ratio: number) {
  if (ratio >= 0.4) {
    return "Leverage is elevated relative to the asset base; retiring high-cost liabilities should be prioritized before additional risk capital is deployed.";
  }
  if (ratio >= 0.2) {
    return "Current debt load appears manageable relative to assets, though further deleveraging would improve capacity to absorb a valuation drawdown.";
  }
  return "Leverage is low relative to the asset base, leaving meaningful capacity to fund opportunistic allocations without stressing the balance sheet.";
}

function strategyPhrase(score: number) {
  if (score >= 75) {
    return "Recommended capital strategy: maintain current allocation discipline, automate surplus deployment across systematic investing, and continue funding the TerraCloud venture pipeline as a measured, non-core allocation.";
  }
  if (score >= 50) {
    return "Recommended capital strategy: continue building the liquidity buffer toward a six-month target while holding core allocation steady and treating venture reinvestment as opportunistic rather than systematic.";
  }
  return "Recommended capital strategy: prioritize liability reduction and liquidity buffer-building before increasing exposure to growth, alternative, or venture allocations.";
}

export function generateAdvisorMemo(assumptions: TerminalAssumptions, model: TerminalModel) {
  const paragraphs = [
    `Black Ridge Terminal models a ${assumptions.riskTolerance.toLowerCase()}-oriented capital profile for Cody Hatfield, an Eastern Kentucky University business student focused on wealth management, risk management, real estate finance, and financial technology. The modeled profile combines professional/internship income with an early-stage TerraCloud venture pipeline, alongside a sample portfolio of public equities, retirement assets, real estate exposure, and alternative allocations.`,
    `Base-case modeling indicates ${liquidityPhrase(model.emergencyRunwayMonths)} with ${model.emergencyRunwayMonths.toFixed(1)} months of expenses covered by current cash reserves. Modeled monthly surplus of ${formatUsd(model.monthlySurplus)} combines ${formatUsd(assumptions.professionalIncome)} in professional/internship income with ${formatUsd(assumptions.ventureIncome)} in modeled TerraCloud venture income, implying a ${formatPercent(model.savingsRate)} savings rate against ${formatUsd(assumptions.monthlyExpenses)} in modeled monthly expenses.`,
    `Portfolio exposure is weighted toward ${model.topAllocation.label.toLowerCase()} at ${formatPercent(model.topAllocation.weight)} of total assets, consistent with a ${assumptions.riskTolerance.toLowerCase()}-oriented mandate. Combined public equity and alternative exposure of ${formatPercent(model.equityWeight)} places the composite risk score at ${Math.round(model.riskScore)}/100 (${model.riskTier}).`,
    `Liabilities represent ${formatPercent(model.debtToAssetRatio)} of total assets. ${debtPhrase(model.debtToAssetRatio)}`,
    `Enterprise modeling under base-case assumptions (${formatUsd(assumptions.revenue, { compact: true })} revenue, ${assumptions.ebitdaMargin}% EBITDA margin, ${assumptions.wacc}% discount rate over a ${assumptions.timeHorizonYears}-year horizon) implies an enterprise value of approximately ${formatUsd(model.enterpriseValue, { compact: true })}, with a bear-to-bull range of ${formatUsd(model.scenarios[0].enterpriseValue, { compact: true })} to ${formatUsd(model.scenarios[2].enterpriseValue, { compact: true })}. ${strategyPhrase(model.wealthHealthScore)}`,
  ];

  return paragraphs.join("\n\n");
}
