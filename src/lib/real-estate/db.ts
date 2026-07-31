import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { BuyerRecord, BuyerStage, CreateBuyerInput, LoanStatus } from "./types";

const createBuyersTableSql = `
  CREATE TABLE IF NOT EXISTS buyers (
    id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    market TEXT NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    down_payment INTEGER NOT NULL DEFAULT 0,
    credit_band TEXT NOT NULL DEFAULT 'Unknown',
    loan_status TEXT NOT NULL DEFAULT 'Not started',
    timeline TEXT NOT NULL DEFAULT 'Exploring',
    stage TEXT NOT NULL DEFAULT 'New inquiry',
    missing_items TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

const createStageIndexSql = "CREATE INDEX IF NOT EXISTS buyers_stage_idx ON buyers (stage)";
const createMarketIndexSql = "CREATE INDEX IF NOT EXISTS buyers_market_idx ON buyers (market)";

const selectBuyerFields = `
  SELECT
    id,
    full_name AS fullName,
    email,
    phone,
    market,
    budget_min AS budgetMin,
    budget_max AS budgetMax,
    down_payment AS downPayment,
    credit_band AS creditBand,
    loan_status AS loanStatus,
    timeline,
    stage,
    missing_items AS missingItems,
    notes,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM buyers
`;

function getDatabase() {
  const database = getCloudflareContext().env.DB;

  if (!database) {
    throw new Error("The real-estate database binding is unavailable.");
  }

  return database;
}

async function ensureSchema(database: D1Database) {
  await database.batch([
    database.prepare(createBuyersTableSql),
    database.prepare(createStageIndexSql),
    database.prepare(createMarketIndexSql),
  ]);
}

function normalizeBuyer(row: BuyerRecord): BuyerRecord {
  return {
    ...row,
    budgetMin: Number(row.budgetMin),
    budgetMax: Number(row.budgetMax),
    downPayment: Number(row.downPayment),
    loanStatus: row.loanStatus as LoanStatus,
    stage: row.stage as BuyerStage,
  };
}

export async function listBuyers() {
  const database = getDatabase();
  await ensureSchema(database);

  const result = await database.prepare(`${selectBuyerFields} ORDER BY updated_at DESC`).all<BuyerRecord>();
  return result.results.map(normalizeBuyer);
}

export async function createBuyer(input: CreateBuyerInput) {
  const database = getDatabase();
  await ensureSchema(database);

  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await database
    .prepare(
      `
        INSERT INTO buyers (
          id, full_name, email, phone, market, budget_min, budget_max, down_payment,
          credit_band, loan_status, timeline, stage, missing_items, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .bind(
      id,
      input.fullName,
      input.email,
      input.phone,
      input.market,
      input.budgetMin,
      input.budgetMax,
      input.downPayment,
      input.creditBand,
      input.loanStatus,
      input.timeline,
      input.stage,
      input.missingItems,
      input.notes,
      timestamp,
      timestamp,
    )
    .run();

  const buyer = await database.prepare(`${selectBuyerFields} WHERE id = ?`).bind(id).first<BuyerRecord>();

  if (!buyer) {
    throw new Error("The buyer record was saved but could not be reloaded.");
  }

  return normalizeBuyer(buyer);
}

export async function updateBuyerStage(id: string, stage: BuyerStage) {
  const database = getDatabase();
  await ensureSchema(database);

  await database
    .prepare("UPDATE buyers SET stage = ?, updated_at = ? WHERE id = ?")
    .bind(stage, new Date().toISOString(), id)
    .run();

  const buyer = await database.prepare(`${selectBuyerFields} WHERE id = ?`).bind(id).first<BuyerRecord>();

  if (!buyer) {
    return null;
  }

  return normalizeBuyer(buyer);
}
