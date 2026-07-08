"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { formatUsd } from "./lib/format";
import { useTerminal } from "./terminal-provider";

const INTENSITY_CLASSES = [
  "bg-rose-500/20 text-rose-800 dark:bg-rose-500/25 dark:text-rose-200",
  "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-muted text-foreground",
  "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200",
];

function intensityClass(value: number, min: number, max: number) {
  if (max === min) return INTENSITY_CLASSES[2];
  const ratio = (value - min) / (max - min);
  const bucket = Math.min(INTENSITY_CLASSES.length - 1, Math.floor(ratio * INTENSITY_CLASSES.length));
  return INTENSITY_CLASSES[bucket];
}

export function SensitivityMatrix() {
  const { model } = useTerminal();
  const { waccRange, terminalGrowthRange, cells } = model.sensitivityMatrix;

  const flatValues = cells.flat();
  const min = Math.min(...flatValues);
  const max = Math.max(...flatValues);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Sensitivity Matrix</CardTitle>
        <CardDescription>Enterprise value across WACC and terminal growth rate assumptions.</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1 text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left align-bottom font-normal text-muted-foreground">
                WACC ↓ · Terminal Growth →
              </th>
              {terminalGrowthRange.map((terminalGrowth) => (
                <th key={terminalGrowth} className="p-2 font-medium tabular-nums">
                  {terminalGrowth.toFixed(1)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waccRange.map((wacc, rowIndex) => (
              <tr key={wacc}>
                <th className="p-2 text-left font-medium tabular-nums text-muted-foreground">{wacc.toFixed(1)}%</th>
                {cells[rowIndex].map((value, colIndex) => (
                  <td
                    key={terminalGrowthRange[colIndex]}
                    className={cn("rounded-md p-2 font-medium tabular-nums", intensityClass(value, min, max))}
                  >
                    {formatUsd(value, { compact: true })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
