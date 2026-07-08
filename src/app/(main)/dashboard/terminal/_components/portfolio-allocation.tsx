"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { formatPercent, formatUsd } from "./lib/format";
import type { AllocationKey } from "./lib/types";
import { useTerminal } from "./terminal-provider";

const chartConfig = {
  amount: { label: "Amount" },
  publicEquities: { label: "Public Equities", color: "var(--chart-1)" },
  retirementAssets: { label: "Retirement Assets", color: "var(--chart-2)" },
  realEstateEquity: { label: "Real Estate Equity", color: "var(--chart-3)" },
  cash: { label: "Cash & Equivalents", color: "var(--chart-4)" },
  alternatives: { label: "Alternatives & Private Markets", color: "var(--chart-5)" },
} satisfies ChartConfig;

function colorFor(key: AllocationKey) {
  const config = chartConfig[key];
  return "color" in config ? config.color : undefined;
}

export function PortfolioAllocation() {
  const { model } = useTerminal();

  const chartData = model.allocation.map((slice) => ({
    ...slice,
    fill: colorFor(slice.key),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Portfolio Allocation</CardTitle>
        <CardDescription>Current weighting across modeled asset classes.</CardDescription>
      </CardHeader>

      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-52">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-56" nameKey="label" />} />
            <Pie
              cornerRadius={6}
              data={chartData}
              dataKey="amount"
              innerRadius={68}
              nameKey="label"
              outerRadius={92}
              paddingAngle={2}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total Assets
                      </tspan>
                      <tspan
                        className="fill-foreground font-medium text-lg tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {formatUsd(model.totalAssets, { compact: true })}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-3">
          {chartData.map((item) => (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.key}>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-1 rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="truncate text-muted-foreground text-xs">{item.label}</p>
                </div>
                <p className="font-medium tabular-nums">{formatUsd(item.amount, { compact: true })}</p>
              </div>
              <div className="font-medium tabular-nums">{formatPercent(item.weight)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
