"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { formatUsd } from "./lib/format";
import { useTerminal } from "./terminal-provider";

const chartConfig = {
  explicitValue: { label: "Explicit Cash Flow PV", color: "var(--chart-2)" },
  terminalValuePv: { label: "Terminal Value PV", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ValuationModel() {
  const { assumptions, model } = useTerminal();

  const chartData = [
    { name: "Enterprise Value", explicitValue: model.explicitValue, terminalValuePv: model.terminalValuePv },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Valuation Model</CardTitle>
        <CardDescription>
          Discounted cash flow, {assumptions.timeHorizonYears}-year horizon at {assumptions.wacc}% WACC.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Enterprise Value</p>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {formatUsd(model.enterpriseValue, { compact: true })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Equity Value</p>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {formatUsd(model.equityValue, { compact: true })}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-24 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <ChartTooltip
              cursor={false}
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
            <Bar dataKey="explicitValue" stackId="ev" fill="var(--color-explicitValue)" radius={[6, 0, 0, 6]} />
            <Bar dataKey="terminalValuePv" stackId="ev" fill="var(--color-terminalValuePv)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
            <span className="text-muted-foreground">
              Explicit period · {formatUsd(model.explicitValue, { compact: true })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--chart-5)" }} />
            <span className="text-muted-foreground">
              Terminal value · {formatUsd(model.terminalValuePv, { compact: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
