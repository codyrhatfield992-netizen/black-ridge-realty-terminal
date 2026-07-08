"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { formatPercent, formatUsd } from "./lib/format";
import { useTerminal } from "./terminal-provider";

type Tone = "positive" | "negative" | "neutral";

const TONE_LABEL: Record<Tone, string> = {
  positive: "Healthy",
  negative: "Watch",
  neutral: "Model",
};

function toneForScore(score: number): Tone {
  if (score >= 70) return "positive";
  if (score >= 45) return "neutral";
  return "negative";
}

export function KpiStrip() {
  const { model } = useTerminal();

  const items: { label: string; value: string; hint: string; tone: Tone }[] = [
    {
      label: "Net Worth",
      value: formatUsd(model.netWorth, { compact: true }),
      hint: `${formatUsd(model.totalAssets, { compact: true })} assets − ${formatUsd(model.totalLiabilities, { compact: true })} liabilities`,
      tone: model.netWorth >= 0 ? "positive" : "negative",
    },
    {
      label: "Total Assets",
      value: formatUsd(model.totalAssets, { compact: true }),
      hint: `${model.allocation.length} asset classes modeled`,
      tone: "neutral",
    },
    {
      label: "Total Liabilities",
      value: formatUsd(model.totalLiabilities, { compact: true }),
      hint: `${formatPercent(model.debtToAssetRatio)} of total assets`,
      tone: model.debtToAssetRatio > 0.35 ? "negative" : "neutral",
    },
    {
      label: "Monthly Surplus",
      value: formatUsd(model.monthlySurplus, { compact: true }),
      hint: `${formatPercent(model.savingsRate)} savings rate`,
      tone: model.monthlySurplus >= 0 ? "positive" : "negative",
    },
    {
      label: "Wealth Health Score",
      value: `${model.wealthHealthScore}`,
      hint: "out of 100, model composite",
      tone: toneForScore(model.wealthHealthScore),
    },
    {
      label: "Enterprise Value",
      value: formatUsd(model.enterpriseValue, { compact: true }),
      hint: `${formatUsd(model.equityValue, { compact: true })} equity value`,
      tone: "neutral",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 sm:grid-cols-2 sm:divide-x xl:grid-cols-3 2xl:grid-cols-6">
        {items.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-xs uppercase tracking-wide">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-2">
              <div className="space-y-1">
                <div className="text-2xl leading-none tracking-tight tabular-nums">{item.value}</div>
                <p className="text-muted-foreground text-xs">{item.hint}</p>
              </div>
              <Badge
                className={cn(
                  item.tone === "positive" &&
                    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                  item.tone === "negative" && "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                  item.tone === "neutral" && "bg-muted text-muted-foreground",
                )}
              >
                {TONE_LABEL[item.tone]}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
