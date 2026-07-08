"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { RISK_TOLERANCE_OPTIONS } from "./lib/defaults";
import type { TerminalAssumptions } from "./lib/types";
import { useTerminal } from "./terminal-provider";

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}

function NumberField({ id, label, value, prefix, suffix, min = 0, step = 1, onChange }: NumberFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        {prefix ? <InputGroupAddon>{prefix}</InputGroupAddon> : null}
        <InputGroupInput
          id={id}
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
        />
        {suffix ? <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon> : null}
      </InputGroup>
    </Field>
  );
}

const CAPITAL_FIELDS: { key: keyof TerminalAssumptions; label: string }[] = [
  { key: "cash", label: "Total Cash" },
  { key: "publicEquities", label: "Public Equities" },
  { key: "retirementAssets", label: "Retirement Assets" },
  { key: "realEstateEquity", label: "Real Estate Equity" },
  { key: "alternatives", label: "Alternatives / Private Markets" },
  { key: "liabilities", label: "Liabilities" },
];

const CASH_FLOW_FIELDS: { key: keyof TerminalAssumptions; label: string }[] = [
  { key: "professionalIncome", label: "Professional / Internship Income" },
  { key: "ventureIncome", label: "TerraCloud Venture Income" },
  { key: "monthlyExpenses", label: "Monthly Expenses" },
];

const VALUATION_FIELDS: { key: keyof TerminalAssumptions; label: string }[] = [
  { key: "ebitdaMargin", label: "EBITDA Margin" },
  { key: "growthRate", label: "Growth Rate" },
  { key: "wacc", label: "WACC" },
  { key: "terminalGrowthRate", label: "Terminal Growth Rate" },
];

interface AssumptionsFieldsProps {
  idPrefix: string;
  gridClassName?: string;
}

// Shared field content rendered by both the bottom-of-page Model Assumptions card and the
// "Edit Assumptions" drawer. `idPrefix` keeps input ids unique when both are mounted at once
// (the drawer can be open while the page's own copy of this panel is still in the DOM below it).
export function AssumptionsFields({ idPrefix, gridClassName }: AssumptionsFieldsProps) {
  const { assumptions, setAssumption } = useTerminal();

  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", gridClassName)}>
      <div className="space-y-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Capital Position</h3>
        <div className="space-y-4">
          {CAPITAL_FIELDS.map((field) => (
            <NumberField
              key={field.key}
              id={`${idPrefix}-${field.key}`}
              label={field.label}
              prefix="$"
              step={1000}
              value={assumptions[field.key] as number}
              onChange={(value) => setAssumption(field.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Cash Flow</h3>
        <div className="space-y-4">
          {CASH_FLOW_FIELDS.map((field) => (
            <NumberField
              key={field.key}
              id={`${idPrefix}-${field.key}`}
              label={field.label}
              prefix="$"
              step={100}
              value={assumptions[field.key] as number}
              onChange={(value) => setAssumption(field.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Enterprise Valuation</h3>
        <div className="space-y-4">
          <NumberField
            id={`${idPrefix}-revenue`}
            label="Revenue Assumption"
            prefix="$"
            step={100_000}
            value={assumptions.revenue}
            onChange={(value) => setAssumption("revenue", value)}
          />
          {VALUATION_FIELDS.map((field) => (
            <NumberField
              key={field.key}
              id={`${idPrefix}-${field.key}`}
              label={field.label}
              suffix="%"
              step={0.5}
              value={assumptions[field.key] as number}
              onChange={(value) => setAssumption(field.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Strategy</h3>
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-riskTolerance`}>Risk Tolerance</FieldLabel>
            <Select
              value={assumptions.riskTolerance}
              onValueChange={(value) => setAssumption("riskTolerance", value as TerminalAssumptions["riskTolerance"])}
            >
              <SelectTrigger id={`${idPrefix}-riskTolerance`} className="w-full">
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
          </Field>

          <NumberField
            id={`${idPrefix}-timeHorizonYears`}
            label="Time Horizon"
            suffix="yrs"
            min={1}
            step={1}
            value={assumptions.timeHorizonYears}
            onChange={(value) => setAssumption("timeHorizonYears", value)}
          />
        </div>
      </div>
    </div>
  );
}
