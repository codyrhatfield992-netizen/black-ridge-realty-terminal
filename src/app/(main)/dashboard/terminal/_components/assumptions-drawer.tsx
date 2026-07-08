"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AssumptionsFields } from "./assumptions-fields";
import { useTerminal } from "./terminal-provider";

export function AssumptionsDrawer() {
  const { resetAssumptions } = useTerminal();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          <SlidersHorizontal />
          Edit Assumptions
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>Model Assumptions</SheetTitle>
          <SheetDescription>
            Edit capital, cash flow, valuation, and strategy inputs. Every KPI, chart, and the advisor memo recalculate
            instantly — nothing here is saved or uploaded.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AssumptionsFields idPrefix="drawer" gridClassName="lg:grid-cols-2" />
        </div>

        <SheetFooter className="flex-row justify-between border-t">
          <Button size="sm" variant="outline" onClick={resetAssumptions}>
            <RotateCcw />
            Reset to Defaults
          </Button>
          <SheetClose asChild>
            <Button size="sm">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
