"use client";

import * as React from "react";

import { computeTerminalModel } from "./lib/calculations";
import { DEFAULT_ASSUMPTIONS, SCENARIO_PRESETS } from "./lib/defaults";
import type { ScenarioPresetKey, TerminalAssumptions, TerminalModel } from "./lib/types";

interface TerminalContextValue {
  assumptions: TerminalAssumptions;
  model: TerminalModel;
  scenario: ScenarioPresetKey | "Custom";
  setAssumption: <K extends keyof TerminalAssumptions>(key: K, value: TerminalAssumptions[K]) => void;
  applyScenarioPreset: (key: ScenarioPresetKey) => void;
  resetAssumptions: () => void;
}

const TerminalContext = React.createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [assumptions, setAssumptions] = React.useState<TerminalAssumptions>(DEFAULT_ASSUMPTIONS);
  const [scenario, setScenario] = React.useState<ScenarioPresetKey | "Custom">("Base");

  const setAssumption = React.useCallback(
    <K extends keyof TerminalAssumptions>(key: K, value: TerminalAssumptions[K]) => {
      setAssumptions((prev) => ({ ...prev, [key]: value }));
      setScenario("Custom");
    },
    [],
  );

  const applyScenarioPreset = React.useCallback((key: ScenarioPresetKey) => {
    setAssumptions((prev) => ({ ...prev, ...SCENARIO_PRESETS[key] }));
    setScenario(key);
  }, []);

  const resetAssumptions = React.useCallback(() => {
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setScenario("Base");
  }, []);

  const model = React.useMemo(() => computeTerminalModel(assumptions), [assumptions]);

  const value = React.useMemo(
    () => ({ assumptions, model, scenario, setAssumption, applyScenarioPreset, resetAssumptions }),
    [assumptions, model, scenario, setAssumption, applyScenarioPreset, resetAssumptions],
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}

export function useTerminal() {
  const context = React.useContext(TerminalContext);

  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }

  return context;
}
