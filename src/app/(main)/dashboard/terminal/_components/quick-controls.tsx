"use client";

import { RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { AssumptionsDrawer } from "./assumptions-drawer";
import { RISK_TOLERANCE_OPTIONS, SCENARIO_PRESET_KEYS, TIME_HORIZON_OPTIONS } from "./lib/defaults";
import type { RiskTolerance, ScenarioPresetKey } from "./lib/types";
import { useTerminal } from "./terminal-provider";

export function QuickControls() {
  const { assumptions, scenario, setAssumption, applyScenarioPreset, resetAssumptions } = useTerminal();

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Scenario</p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={scenario === "Custom" ? undefined : scenario}
            onValueChange={(value) => {
              if (value) applyScenarioPreset(value as ScenarioPresetKey);
            }}
          >
            {SCENARIO_PRESET_KEYS.map((key) => (
              <ToggleGroupItem key={key} value={key} aria-label={key}>
                {key}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Risk Tolerance</p>
          <Select
            value={assumptions.riskTolerance}
            onValueChange={(value) => setAssumption("riskTolerance", value as RiskTolerance)}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {RISK_TOLERANCE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Time Horizon</p>
          <Select
            value={String(assumptions.timeHorizonYears)}
            onValueChange={(value) => setAssumption("timeHorizonYears", Number(value))}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TIME_HORIZON_OPTIONS.map((years) => (
                  <SelectItem key={years} value={String(years)}>
                    {years} years
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          <AssumptionsDrawer />
          <Button size="sm" variant="outline" onClick={resetAssumptions}>
            <Sparkles />
            Load Example Profile
          </Button>
          <Button size="sm" variant="outline" onClick={resetAssumptions}>
            <RotateCcw />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
