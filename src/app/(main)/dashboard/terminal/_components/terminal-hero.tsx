import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function TerminalHero({ formattedDate }: { formattedDate: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Black Ridge Demo — created by Cody Hatfield, Eastern Kentucky University
        </p>
        <h1 className="text-3xl tracking-tight">Black Ridge Terminal</h1>
        <p className="text-muted-foreground text-sm">
          Institutional Wealth Intelligence · {formattedDate} · No login — calculations run locally in your browser.
        </p>
      </div>
      <Badge variant="outline" className="w-fit gap-1.5">
        <Sparkles className="size-3" />
        Model Environment · Educational Use
      </Badge>
    </div>
  );
}
