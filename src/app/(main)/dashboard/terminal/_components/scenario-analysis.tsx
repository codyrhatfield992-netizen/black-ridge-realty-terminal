"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { formatUsd } from "./lib/format";
import { useTerminal } from "./terminal-provider";

const chartConfig = {
  enterpriseValue: { label: "Enterprise Value" },
  bear: { label: "Bear", color: "var(--color-rose-500)" },
  base: { label: "Base", color: "var(--color-slate-400)" },
  bull: { label: "Bull", color: "var(--color-emerald-500)" },
} satisfies ChartConfig;

export function ScenarioAnalysis() {
  const { model } = useTerminal();

  const chartData = model.scenarios.map((scenario) => ({
    scenario: scenario.label,
    enterpriseValue: scenario.enterpriseValue,
    fill: `var(--color-${scenario.key})`,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Scenario Analysis</CardTitle>
        <CardDescription>Enterprise value under bear, base, and bull operating assumptions.</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="scenario" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <YAxis
              hide
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatUsd(Number(value), { compact: true })}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
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
            <Bar dataKey="enterpriseValue" name="Enterprise Value" radius={[8, 8, 0, 0]} maxBarSize={72}>
              {chartData.map((item) => (
                <Cell key={item.scenario} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
