import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const buyers = sqliteTable(
  "buyers",
  {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    market: text("market").notNull(),
    budgetMin: integer("budget_min").notNull(),
    budgetMax: integer("budget_max").notNull(),
    downPayment: integer("down_payment").notNull().default(0),
    creditBand: text("credit_band").notNull().default("Unknown"),
    loanStatus: text("loan_status").notNull().default("Not started"),
    timeline: text("timeline").notNull().default("Exploring"),
    stage: text("stage").notNull().default("New inquiry"),
    missingItems: text("missing_items").notNull().default(""),
    notes: text("notes").notNull().default(""),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("buyers_stage_idx").on(table.stage), index("buyers_market_idx").on(table.market)],
);
