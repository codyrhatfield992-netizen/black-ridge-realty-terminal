export function formatUsd(amount: number, options?: { compact?: boolean; maximumFractionDigits?: number }) {
  const { compact = false, maximumFractionDigits = compact ? 1 : 0 } = options ?? {};

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits,
  }).format(amount);
}

export function formatPercent(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMonths(value: number) {
  return `${value.toFixed(1)} mo`;
}

export function formatMultiple(value: number) {
  return `${value.toFixed(2)}x`;
}
