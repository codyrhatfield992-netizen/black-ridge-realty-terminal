"use client";

import { RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

import { formatPercent } from "./lib/format";
import { useTerminal } from "./terminal-provider";

const chartConfig = {
  score: { label: "Risk Score" },
} satisfies ChartConfig;

function gaugeColor(score: number) {
  if (score >= 75) return "var(--color-rose-500)";
  if (score >= 50) return "var(--color-amber-500)";
  if (score >= 25) return "var(--color-slate-400)";
  return "var(--color-emerald-500)";
}

export function RiskExposure() {
  const { model } = useTerminal();

  const chartData = [{ name: "risk", score: model.riskScore, fill: gaugeColor(model.riskScore) }];

  const rows = [
    { label: "Growth Asset Exposure", value: model.equityWeight },
    { label: "Leverage (Debt / Assets)", value: model.debtToAssetRatio },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Risk Exposure</CardTitle>
        <CardDescription>Composite exposure across equity weighting and leverage.</CardDescription>
      </CardHeader>

      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className="relative mx-auto flex aspect-square h-40 items-center justify-center">
          <ChartContainer config={chartConfig} className="absolute inset-0">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={58}
              outerRadius={80}
              barSize={12}
            >
              <RadialBar dataKey="score" background cornerRadius={12} max={100} />
            </RadialBarChart>
          </ChartContainer>
          <div className="pointer-events-none flex flex-col items-center">
            <span className="font-semibold text-2xl tabular-nums">{Math.round(model.riskScore)}</span>
            <span className="text-muted-foreground text-xs">{model.riskTier}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div className="space-y-1.5" key={row.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">{formatPercent(row.value)}</span>
              </div>
              <Progress value={row.value * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
