"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileWarning,
  MapPinned,
  Plus,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BUYER_STAGES, type BuyerRecord, type BuyerStage, LOAN_STATUSES } from "@/lib/real-estate/types";
import { cn } from "@/lib/utils";

const timelineOptions = ["0–3 months", "3–6 months", "6–12 months", "12+ months", "Exploring"];
const creditOptions = ["Unknown", "Below 620", "620–659", "660–699", "700–739", "740+"];
const buyerSkeletons = ["buyer-skeleton-1", "buyer-skeleton-2", "buyer-skeleton-3", "buyer-skeleton-4"];

type BuyerFilter = "all" | "attention" | "ready";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function stageVariant(stage: BuyerStage): "default" | "secondary" | "outline" {
  if (stage === "Closed" || stage === "Under contract") {
    return "default";
  }

  if (stage === "Offer submitted" || stage === "Home search") {
    return "secondary";
  }

  return "outline";
}

function missingItemCount(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export function RealtyTerminal() {
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BuyerFilter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const loadBuyers = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/buyers", { cache: "no-store" });
      const result = (await response.json()) as { buyers?: BuyerRecord[]; error?: string };

      if (!response.ok || !result.buyers) {
        throw new Error(result.error ?? "Buyer records could not be loaded.");
      }

      setBuyers(result.buyers);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Buyer records could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBuyers();
  }, [loadBuyers]);

  const metrics = useMemo(() => {
    const activeBuyers = buyers.filter((buyer) => buyer.stage !== "Closed");
    const representedBuyingPower = activeBuyers.reduce((sum, buyer) => sum + buyer.budgetMax, 0);
    const readyBuyers = activeBuyers.filter((buyer) => buyer.loanStatus === "Pre-approved");
    const missingItems = activeBuyers.reduce((sum, buyer) => sum + missingItemCount(buyer.missingItems), 0);

    return {
      activeCount: activeBuyers.length,
      representedBuyingPower,
      readyRate: activeBuyers.length ? Math.round((readyBuyers.length / activeBuyers.length) * 100) : 0,
      missingItems,
    };
  }, [buyers]);

  const filteredBuyers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return buyers.filter((buyer) => {
      const matchesQuery =
        !normalizedQuery ||
        [buyer.fullName, buyer.email, buyer.market, buyer.stage].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const needsAttention = missingItemCount(buyer.missingItems) > 0 || buyer.loanStatus === "Documents needed";
      const ready = buyer.loanStatus === "Pre-approved" && missingItemCount(buyer.missingItems) === 0;
      const matchesFilter =
        filter === "all" || (filter === "attention" && needsAttention) || (filter === "ready" && ready);

      return matchesQuery && matchesFilter;
    });
  }, [buyers, filter, query]);

  const marketSummary = useMemo(() => {
    const markets = new Map<string, { households: number; buyingPower: number }>();

    for (const buyer of buyers) {
      const current = markets.get(buyer.market) ?? { households: 0, buyingPower: 0 };
      markets.set(buyer.market, {
        households: current.households + 1,
        buyingPower: current.buyingPower + buyer.budgetMax,
      });
    }

    return [...markets.entries()]
      .map(([market, details]) => ({ market, ...details }))
      .sort((a, b) => b.buyingPower - a.buyingPower)
      .slice(0, 5);
  }, [buyers]);

  async function handleCreateBuyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      market: String(formData.get("market") ?? ""),
      budgetMin: Number(formData.get("budgetMin") ?? 0),
      budgetMax: Number(formData.get("budgetMax") ?? 0),
      downPayment: Number(formData.get("downPayment") ?? 0),
      creditBand: String(formData.get("creditBand") ?? "Unknown"),
      loanStatus: String(formData.get("loanStatus") ?? "Not started"),
      timeline: String(formData.get("timeline") ?? "Exploring"),
      stage: String(formData.get("stage") ?? "New inquiry"),
      missingItems: String(formData.get("missingItems") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { buyer?: BuyerRecord; error?: string };

      if (!response.ok || !result.buyer) {
        throw new Error(result.error ?? "The buyer record could not be saved.");
      }

      setBuyers((current) => [result.buyer as BuyerRecord, ...current]);
      form.reset();
      setSheetOpen(false);
      toast.success("Buyer record saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The buyer record could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStageChange(id: string, stage: BuyerStage) {
    const previousBuyers = buyers;
    setBuyers((current) =>
      current.map((buyer) => (buyer.id === id ? { ...buyer, stage, updatedAt: new Date().toISOString() } : buyer)),
    );

    try {
      const response = await fetch(`/api/buyers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "The pipeline stage could not be updated.");
      }

      toast.success("Pipeline stage updated.");
    } catch (error) {
      setBuyers(previousBuyers);
      toast.error(error instanceof Error ? error.message : "The pipeline stage could not be updated.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs md:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                <ShieldCheck />
                Private operations workspace
              </Badge>
              <Badge variant="secondary">Persistent records</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl tracking-tight md:text-4xl">Black Ridge Realty Terminal</h1>
              <p className="max-w-2xl text-muted-foreground">
                See buyer readiness, financing gaps, target markets, and pipeline movement in one real-estate command
                center.
              </p>
            </div>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus data-icon="inline-start" />
                Add buyer
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Add buyer record</SheetTitle>
                <SheetDescription>
                  Capture the household, financing position, target market, and known intake gaps.
                </SheetDescription>
              </SheetHeader>
              <form className="px-4 pb-6" onSubmit={handleCreateBuyer}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fullName">Buyer or household name</FieldLabel>
                    <Input id="fullName" name="fullName" placeholder="Avery & Jordan Reed" required />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input id="email" name="email" type="email" placeholder="avery@example.com" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input id="phone" name="phone" type="tel" placeholder="(859) 555-0142" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="market">Target market</FieldLabel>
                    <Input id="market" name="market" placeholder="Lexington, KY" required />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="budgetMin">Minimum budget</FieldLabel>
                      <Input
                        id="budgetMin"
                        name="budgetMin"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="250000"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="budgetMax">Maximum budget</FieldLabel>
                      <Input
                        id="budgetMax"
                        name="budgetMax"
                        type="number"
                        min="1"
                        step="1000"
                        placeholder="375000"
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="downPayment">Available down payment</FieldLabel>
                    <Input id="downPayment" name="downPayment" type="number" min="0" step="500" placeholder="25000" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="creditBand">Credit band</FieldLabel>
                      <Select name="creditBand" defaultValue="Unknown">
                        <SelectTrigger id="creditBand" className="w-full">
                          <SelectValue placeholder="Select credit band" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {creditOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="loanStatus">Loan status</FieldLabel>
                      <Select name="loanStatus" defaultValue="Not started">
                        <SelectTrigger id="loanStatus" className="w-full">
                          <SelectValue placeholder="Select loan status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {LOAN_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="timeline">Purchase timeline</FieldLabel>
                      <Select name="timeline" defaultValue="Exploring">
                        <SelectTrigger id="timeline" className="w-full">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {timelineOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="stage">Pipeline stage</FieldLabel>
                      <Select name="stage" defaultValue="New inquiry">
                        <SelectTrigger id="stage" className="w-full">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {BUYER_STAGES.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="missingItems">Missing intake items</FieldLabel>
                    <Input id="missingItems" name="missingItems" placeholder="Income documents, pre-approval letter" />
                    <FieldDescription>Separate multiple gaps with commas.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="notes">Advisor notes</FieldLabel>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Household priorities, property requirements, or follow-up context."
                      rows={4}
                    />
                  </Field>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
                    {isSaving ? "Saving record…" : "Save buyer record"}
                  </Button>
                </FieldGroup>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section aria-label="Buyer operations metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active households"
          value={String(metrics.activeCount)}
          description="Open buyer relationships"
          icon={UsersRound}
          loading={isLoading}
        />
        <MetricCard
          label="Represented buying power"
          value={formatCurrency(metrics.representedBuyingPower)}
          description="Maximum active budgets"
          icon={CircleDollarSign}
          loading={isLoading}
        />
        <MetricCard
          label="Financing ready"
          value={`${metrics.readyRate}%`}
          description="Active buyers pre-approved"
          icon={CheckCircle2}
          loading={isLoading}
        />
        <MetricCard
          label="Open intake gaps"
          value={String(metrics.missingItems)}
          description="Documents or details needed"
          icon={FileWarning}
          loading={isLoading}
        />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="pipeline-heading">
        <div className="flex flex-col gap-1">
          <h2 id="pipeline-heading" className="font-medium text-xl tracking-tight">
            Buyer pipeline
          </h2>
          <p className="text-muted-foreground text-sm">Households grouped by their current purchase stage.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {BUYER_STAGES.map((stage) => {
            const stageBuyers = buyers.filter((buyer) => buyer.stage === stage);
            return (
              <Card key={stage} size="sm">
                <CardHeader>
                  <CardDescription>{stage}</CardDescription>
                  <CardAction>
                    <Badge variant={stageVariant(stage)}>{stageBuyers.length}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="font-medium tabular-nums">
                    {formatCurrency(stageBuyers.reduce((sum, buyer) => sum + buyer.budgetMax, 0))}
                  </p>
                  <Progress
                    value={buyers.length ? Math.round((stageBuyers.length / buyers.length) * 100) : 0}
                    aria-label={`${stage} share of buyer pipeline`}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {loadError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Records unavailable</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{loadError}</span>
            <Button variant="outline" size="sm" onClick={() => void loadBuyers()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <Card id="buyers" className="scroll-mt-24 xl:col-span-8">
          <CardHeader>
            <CardTitle>Buyer records</CardTitle>
            <CardDescription>
              Search households, review gaps, and move buyers through the live pipeline.
            </CardDescription>
            <CardAction className="hidden md:block">
              <Badge variant="outline">{buyers.length} stored</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <Tabs value={filter} onValueChange={(value) => setFilter(value as BuyerFilter)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="attention">Needs attention</TabsTrigger>
                  <TabsTrigger value="ready">Financing ready</TabsTrigger>
                </TabsList>
              </Tabs>
              <InputGroup className="w-full lg:max-w-xs">
                <InputGroupInput
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search buyer or market"
                  aria-label="Search buyer records"
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-3" role="status" aria-label="Loading buyer records">
                {buyerSkeletons.map((skeleton) => (
                  <Skeleton key={skeleton} className="h-12 w-full" />
                ))}
              </div>
            ) : null}

            {!isLoading && filteredBuyers.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Financing</TableHead>
                    <TableHead>Gaps</TableHead>
                    <TableHead className="min-w-48">Stage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyers.map((buyer) => {
                    const gaps = missingItemCount(buyer.missingItems);
                    return (
                      <TableRow key={buyer.id}>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{buyer.fullName}</span>
                            <span className="text-muted-foreground text-xs">{buyer.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{buyer.market}</TableCell>
                        <TableCell className="tabular-nums">{formatCurrency(buyer.budgetMax)}</TableCell>
                        <TableCell>
                          <Badge variant={buyer.loanStatus === "Pre-approved" ? "default" : "outline"}>
                            {buyer.loanStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {gaps ? (
                            <Badge variant="destructive">{gaps} open</Badge>
                          ) : (
                            <Badge variant="secondary">Complete</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={buyer.stage}
                            onValueChange={(value) => void handleStageChange(buyer.id, value as BuyerStage)}
                          >
                            <SelectTrigger className="w-full" aria-label={`Pipeline stage for ${buyer.fullName}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {BUYER_STAGES.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : null}

            {!isLoading && !filteredBuyers.length ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UsersRound />
                  </EmptyMedia>
                  <EmptyTitle>{buyers.length ? "No matching buyers" : "No buyer records yet"}</EmptyTitle>
                  <EmptyDescription>
                    {buyers.length
                      ? "Try a different search or pipeline filter."
                      : "Add the first household to begin tracking buyer readiness and intake gaps."}
                  </EmptyDescription>
                </EmptyHeader>
                {!buyers.length ? (
                  <EmptyContent>
                    <Button onClick={() => setSheetOpen(true)}>
                      <Plus data-icon="inline-start" />
                      Add first buyer
                    </Button>
                  </EmptyContent>
                ) : null}
              </Empty>
            ) : null}
          </CardContent>
        </Card>

        <div id="markets" className="flex scroll-mt-24 flex-col gap-6 xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Target markets</CardTitle>
              <CardDescription>Where current buyer demand is concentrated.</CardDescription>
              <CardAction>
                <MapPinned />
              </CardAction>
            </CardHeader>
            <CardContent>
              {marketSummary.length ? (
                <div className="flex flex-col gap-4">
                  {marketSummary.map((market, index) => (
                    <div key={market.market} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted font-medium text-sm",
                          index === 0 && "border-primary/40 bg-primary/5",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-medium">{market.market}</p>
                          <p className="shrink-0 text-sm tabular-nums">{formatCurrency(market.buyingPower)}</p>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {market.households} {market.households === 1 ? "household" : "households"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MapPinned />
                    </EmptyMedia>
                    <EmptyTitle>No market data</EmptyTitle>
                    <EmptyDescription>Markets appear as buyer records are added.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Readiness signal</CardTitle>
              <CardDescription>A concise view of what moves the current pipeline forward.</CardDescription>
              <CardAction>
                <Building2 />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Financing coverage</p>
                  <p className="text-muted-foreground text-xs">Pre-approved active households</p>
                </div>
                <span className="font-medium tabular-nums">{metrics.readyRate}%</span>
              </div>
              <Progress value={metrics.readyRate} aria-label="Financing-ready buyer percentage" />
              <Button variant="outline" onClick={() => setFilter("attention")}>
                Review intake gaps
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        Buyer information is stored in the private workspace database. Only enter information you are authorized to
        collect and manage.
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof UsersRound;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardAction>
          <Icon />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {loading ? <Skeleton className="h-9 w-28" /> : <p className="text-3xl tabular-nums tracking-tight">{value}</p>}
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
