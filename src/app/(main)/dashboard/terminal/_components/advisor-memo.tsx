"use client";

import * as React from "react";

import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { buildSummaryExport } from "./lib/export";
import { generateAdvisorMemo } from "./lib/memo";
import { useTerminal } from "./terminal-provider";

export function AdvisorMemo() {
  const { assumptions, model } = useTerminal();
  const [copied, setCopied] = React.useState(false);

  const memo = generateAdvisorMemo(assumptions, model);
  const paragraphs = memo.split("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(memo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied by the browser — the export button remains available.
    }
  };

  const handleExport = () => {
    const summary = buildSummaryExport(assumptions, model, memo);
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "black-ridge-terminal-summary.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Advisor Memo</CardTitle>
        <CardDescription>Generated from current model assumptions.</CardDescription>
        <CardAction className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download />
            Export Summary
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
