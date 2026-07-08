import { format } from "date-fns";

import { AdvisorMemo } from "./_components/advisor-memo";
import { AssumptionsPanel } from "./_components/assumptions-panel";
import { CashFlowForecast } from "./_components/cash-flow-forecast";
import { KpiStrip } from "./_components/kpi-strip";
import { MarketWatchlist } from "./_components/market-watchlist";
import { PortfolioAllocation } from "./_components/portfolio-allocation";
import { QuickControls } from "./_components/quick-controls";
import { RiskExposure } from "./_components/risk-exposure";
import { ScenarioAnalysis } from "./_components/scenario-analysis";
import { SensitivityMatrix } from "./_components/sensitivity-matrix";
import { TerminalHero } from "./_components/terminal-hero";
import { TerminalProvider } from "./_components/terminal-provider";
import { ValuationModel } from "./_components/valuation-model";

export const metadata = {
  title: "Black Ridge Terminal — Institutional Wealth Intelligence",
  description:
    "See capital, risk, and opportunity in one command center. All calculations run locally in your browser.",
};

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <TerminalProvider>
      <div className="flex flex-col gap-6">
        <TerminalHero formattedDate={formattedDate} />

        <QuickControls />

        <KpiStrip />

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
          <div id="portfolio" className="scroll-mt-24 xl:col-span-7">
            <PortfolioAllocation />
          </div>
          <div id="valuation" className="scroll-mt-24 xl:col-span-5">
            <ValuationModel />
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
          <div id="scenarios" className="scroll-mt-24 xl:col-span-7">
            <ScenarioAnalysis />
          </div>
          <div className="xl:col-span-5">
            <RiskExposure />
          </div>
        </div>

        <CashFlowForecast />

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <MarketWatchlist />
          </div>
          <div id="memo" className="scroll-mt-24 xl:col-span-7">
            <AdvisorMemo />
          </div>
        </div>

        <SensitivityMatrix />

        <div id="assumptions" className="scroll-mt-24">
          <AssumptionsPanel />
        </div>

        <p className="text-center text-muted-foreground text-xs">
          Black Ridge Terminal uses model/sample data for educational and portfolio purposes only — not financial,
          investment, or valuation advice. Nothing on this page is stored or uploaded.
        </p>
      </div>
    </TerminalProvider>
  );
}
