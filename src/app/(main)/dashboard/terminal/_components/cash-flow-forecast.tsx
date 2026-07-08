"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { formatUsd } from "./lib/format";
import { useTerminal } from "./terminal-provider";

const chartConfig = {
  netWorth: { label: "Projected Net Worth", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function CashFlowForecast() {
  const { assumptions, model } = useTerminal();

  const chartData = model.cashFlowForecast.map((point) => ({
    label: point.year === 0 ? "Today" : `Yr ${point.year}`,
    netWorth: point.netWorth,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Cash Flow Forecast</CardTitle>
        <CardDescription>
          Net worth trajectory over {assumptions.timeHorizonYears} years at a {(model.expectedReturn * 100).toFixed(1)}%
          blended return, reinvesting the modeled monthly surplus.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="terminal-net-worth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-netWorth)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-netWorth)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <YAxis
              hide
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatUsd(Number(value), { compact: true })}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-medium font-mono tabular-nums">
                        {formatUsd(Number(value), { compact: true })}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="netWorth"
              name="Projected Net Worth"
              type="monotone"
              stroke="var(--color-netWorth)"
              strokeWidth={2}
              fill="url(#terminal-net-worth-fill)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--background)", stroke: "var(--color-netWorth)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
