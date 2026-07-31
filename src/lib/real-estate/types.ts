export const BUYER_STAGES = [
  "New inquiry",
  "Intake in progress",
  "Financing review",
  "Home search",
  "Offer submitted",
  "Under contract",
  "Closed",
] as const;

export const LOAN_STATUSES = ["Not started", "Documents needed", "Pre-qualification", "Pre-approved"] as const;

export type BuyerStage = (typeof BUYER_STAGES)[number];
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export interface BuyerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  market: string;
  budgetMin: number;
  budgetMax: number;
  downPayment: number;
  creditBand: string;
  loanStatus: LoanStatus;
  timeline: string;
  stage: BuyerStage;
  missingItems: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyerInput {
  fullName: string;
  email: string;
  phone: string;
  market: string;
  budgetMin: number;
  budgetMax: number;
  downPayment: number;
  creditBand: string;
  loanStatus: LoanStatus;
  timeline: string;
  stage: BuyerStage;
  missingItems: string;
  notes: string;
}
