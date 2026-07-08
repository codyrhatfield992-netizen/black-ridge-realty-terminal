import type {
  AllocationSlice,
  CashFlowForecastPoint,
  RiskTolerance,
  ScenarioResult,
  SensitivityMatrix,
  TerminalAssumptions,
  TerminalModel,
} from "./types";

const EXPECTED_RETURN_BY_RISK_TOLERANCE: Record<RiskTolerance, number> = {
  Conservative: 0.04,
  Balanced: 0.06,
  Growth: 0.08,
  Aggressive: 0.105,
};

const RISK_SCORE_BONUS_BY_TOLERANCE: Record<RiskTolerance, number> = {
  Conservative: -10,
  Balanced: 0,
  Growth: 8,
  Aggressive: 16,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function presentValue(cashFlow: number, rate: number, period: number) {
  return cashFlow / (1 + rate) ** period;
}

interface DcfInputs {
  revenue: number;
  ebitdaMargin: number;
  growthRate: number;
  wacc: number;
  terminalGrowthRate: number;
  years: number;
}

interface DcfResult {
  enterpriseValue: number;
  explicitValue: number;
  terminalValuePv: number;
}

// EBITDA is used as a free-cash-flow proxy — a deliberate simplification for a single-page
// model with no capex/tax detail. The terminal growth rate is capped below WACC to keep the
// Gordon Growth denominator positive regardless of what a user types into the panel.
function discountedCashFlowValue({
  revenue,
  ebitdaMargin,
  growthRate,
  wacc,
  terminalGrowthRate,
  years,
}: DcfInputs): DcfResult {
  const waccRate = Math.max(wacc, 0.5) / 100;
  const growth = growthRate / 100;
  const terminalGrowth = Math.min(terminalGrowthRate / 100, waccRate - 0.005);
  const baseFreeCashFlow = revenue * (ebitdaMargin / 100);

  let explicitValue = 0;
  let finalYearCashFlow = baseFreeCashFlow;

  for (let year = 1; year <= years; year += 1) {
    finalYearCashFlow = baseFreeCashFlow * (1 + growth) ** year;
    explicitValue += presentValue(finalYearCashFlow, waccRate, year);
  }

  const terminalValue = (finalYearCashFlow * (1 + terminalGrowth)) / (waccRate - terminalGrowth);
  const terminalValuePv = presentValue(terminalValue, waccRate, years);

  return {
    enterpriseValue: explicitValue + terminalValuePv,
    explicitValue,
    terminalValuePv,
  };
}

interface ScenarioDelta {
  growthDelta: number;
  marginDelta: number;
  waccDelta: number;
  terminalDelta: number;
}

function deriveScenario(assumptions: TerminalAssumptions, delta: ScenarioDelta) {
  const dcf = discountedCashFlowValue({
    revenue: assumptions.revenue,
    ebitdaMargin: Math.max(assumptions.ebitdaMargin + delta.marginDelta, 2),
    growthRate: Math.max(assumptions.growthRate + delta.growthDelta, -10),
    wacc: Math.max(assumptions.wacc + delta.waccDelta, 2),
    terminalGrowthRate: Math.max(assumptions.terminalGrowthRate + delta.terminalDelta, 0),
    years: assumptions.timeHorizonYears,
  });

  return {
    enterpriseValue: dcf.enterpriseValue,
    equityValue: dcf.enterpriseValue - assumptions.liabilities,
  };
}

function buildScenarios(assumptions: TerminalAssumptions, base: DcfResult): ScenarioResult[] {
  return [
    {
      key: "bear",
      label: "Bear",
      ...deriveScenario(assumptions, { growthDelta: -4, marginDelta: -3, waccDelta: 1.5, terminalDelta: -0.5 }),
    },
    {
      key: "base",
      label: "Base",
      enterpriseValue: base.enterpriseValue,
      equityValue: base.enterpriseValue - assumptions.liabilities,
    },
    {
      key: "bull",
      label: "Bull",
      ...deriveScenario(assumptions, { growthDelta: 4, marginDelta: 3, waccDelta: -1, terminalDelta: 0.5 }),
    },
  ];
}

function buildCashFlowForecast(params: {
  netWorth: number;
  annualContribution: number;
  expectedReturn: number;
  years: number;
}): CashFlowForecastPoint[] {
  const { netWorth, annualContribution, expectedReturn, years } = params;
  const points: CashFlowForecastPoint[] = [{ year: 0, netWorth, contributions: 0 }];

  let runningNetWorth = netWorth;
  let cumulativeContributions = 0;

  for (let year = 1; year <= years; year += 1) {
    runningNetWorth = runningNetWorth * (1 + expectedReturn) + annualContribution;
    cumulativeContributions += annualContribution;
    points.push({ year, netWorth: runningNetWorth, contributions: cumulativeContributions });
  }

  return points;
}

function buildSensitivityMatrix(assumptions: TerminalAssumptions): SensitivityMatrix {
  const waccRange = [-2, -1, 0, 1, 2].map((step) => Math.max(assumptions.wacc + step, 2));
  const terminalGrowthRange = [-1, -0.5, 0, 0.5, 1].map((step) => Math.max(assumptions.terminalGrowthRate + step, 0));

  const cells = waccRange.map((wacc) =>
    terminalGrowthRange.map(
      (terminalGrowthRate) =>
        discountedCashFlowValue({
          revenue: assumptions.revenue,
          ebitdaMargin: assumptions.ebitdaMargin,
          growthRate: assumptions.growthRate,
          wacc,
          terminalGrowthRate,
          years: assumptions.timeHorizonYears,
        }).enterpriseValue,
    ),
  );

  return { waccRange, terminalGrowthRange, cells };
}

function riskTierFromScore(score: number) {
  if (score >= 75) return "Aggressive";
  if (score >= 50) return "Growth-oriented";
  if (score >= 25) return "Balanced";
  return "Conservative";
}

export function computeTerminalModel(assumptions: TerminalAssumptions): TerminalModel {
  const totalAssets =
    assumptions.cash +
    assumptions.publicEquities +
    assumptions.retirementAssets +
    assumptions.realEstateEquity +
    assumptions.alternatives;
  const totalLiabilities = assumptions.liabilities;
  const netWorth = totalAssets - totalLiabilities;
  const monthlyIncome = assumptions.professionalIncome + assumptions.ventureIncome;
  const monthlySurplus = monthlyIncome - assumptions.monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? monthlySurplus / monthlyIncome : 0;
  const emergencyRunwayMonths = assumptions.monthlyExpenses > 0 ? assumptions.cash / assumptions.monthlyExpenses : 0;
  const debtToAssetRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;

  const allocation: AllocationSlice[] = (
    [
      { key: "publicEquities", label: "Public Equities", amount: assumptions.publicEquities },
      { key: "retirementAssets", label: "Retirement Assets", amount: assumptions.retirementAssets },
      { key: "realEstateEquity", label: "Real Estate Equity", amount: assumptions.realEstateEquity },
      { key: "cash", label: "Cash & Equivalents", amount: assumptions.cash },
      { key: "alternatives", label: "Alternatives & Private Markets", amount: assumptions.alternatives },
    ] as const
  ).map((item) => ({ ...item, weight: totalAssets > 0 ? item.amount / totalAssets : 0 }));

  const topAllocation = allocation.reduce((max, item) => (item.amount > max.amount ? item : max), allocation[0]);

  const herfindahlIndex = allocation.reduce((sum, item) => sum + item.weight ** 2, 0);
  // Five asset classes evenly weighted produce a minimum HHI of 0.2 — normalize against that floor.
  const diversificationScore = clamp(((1 - herfindahlIndex) / 0.8) * 100, 0, 100);

  const savingsRateScore = clamp((savingsRate / 0.3) * 100, 0, 100);
  const runwayScore = clamp((emergencyRunwayMonths / 6) * 100, 0, 100);
  const debtScore = clamp((1 - debtToAssetRatio / 0.5) * 100, 0, 100);
  const wealthHealthScore = Math.round(
    savingsRateScore * 0.25 + runwayScore * 0.25 + debtScore * 0.25 + diversificationScore * 0.25,
  );

  const baseDcf = discountedCashFlowValue({
    revenue: assumptions.revenue,
    ebitdaMargin: assumptions.ebitdaMargin,
    growthRate: assumptions.growthRate,
    wacc: assumptions.wacc,
    terminalGrowthRate: assumptions.terminalGrowthRate,
    years: assumptions.timeHorizonYears,
  });

  const equityWeight = totalAssets > 0 ? (assumptions.publicEquities + assumptions.alternatives) / totalAssets : 0;
  const riskScore = clamp(
    equityWeight * 70 + debtToAssetRatio * 30 + RISK_SCORE_BONUS_BY_TOLERANCE[assumptions.riskTolerance],
    0,
    100,
  );

  const expectedReturn = EXPECTED_RETURN_BY_RISK_TOLERANCE[assumptions.riskTolerance];

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyIncome,
    ventureIncomeShare: monthlyIncome > 0 ? assumptions.ventureIncome / monthlyIncome : 0,
    monthlySurplus,
    savingsRate,
    emergencyRunwayMonths,
    debtToAssetRatio,
    allocation,
    topAllocation,
    wealthHealthScore,
    enterpriseValue: baseDcf.enterpriseValue,
    equityValue: baseDcf.enterpriseValue - totalLiabilities,
    explicitValue: baseDcf.explicitValue,
    terminalValuePv: baseDcf.terminalValuePv,
    scenarios: buildScenarios(assumptions, baseDcf),
    riskScore,
    riskTier: riskTierFromScore(riskScore),
    equityWeight,
    expectedReturn,
    cashFlowForecast: buildCashFlowForecast({
      netWorth,
      annualContribution: monthlySurplus * 12,
      expectedReturn,
      years: assumptions.timeHorizonYears,
    }),
    sensitivityMatrix: buildSensitivityMatrix(assumptions),
  };
}
