"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { AssumptionsFields } from "./assumptions-fields";
import { useTerminal } from "./terminal-provider";

export function AssumptionsPanel() {
  const { resetAssumptions } = useTerminal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Model Assumptions</CardTitle>
        <CardDescription>
          Every figure on this screen recalculates instantly as you edit these inputs. Model profile: Cody Hatfield /
          EKU / Wealth Management + Risk + TerraCloud.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" onClick={resetAssumptions}>
            <RotateCcw />
            Reset to Defaults
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <AssumptionsFields idPrefix="panel" />
      </CardContent>
    </Card>
  );
}
