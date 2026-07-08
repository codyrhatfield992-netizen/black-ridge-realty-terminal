import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { WATCHLIST_INSTRUMENTS } from "./lib/defaults";

export function MarketWatchlist() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Market Watchlist</CardTitle>
        <CardDescription>Illustrative snapshot for context — not a live feed.</CardDescription>
        <CardAction>
          <Badge variant="outline" className="text-muted-foreground">
            Sample Data
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instrument</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Level</TableHead>
              <TableHead className="text-right">Chg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WATCHLIST_INSTRUMENTS.map((instrument) => (
              <TableRow key={instrument.symbol}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{instrument.symbol}</span>
                    <span className="text-muted-foreground text-xs">{instrument.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{instrument.category}</TableCell>
                <TableCell className="text-right tabular-nums">{instrument.price}</TableCell>
                <TableCell
                  className={cn(
                    "text-right tabular-nums",
                    instrument.changePercent >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {instrument.changePercent >= 0 ? "+" : ""}
                  {instrument.changePercent.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
