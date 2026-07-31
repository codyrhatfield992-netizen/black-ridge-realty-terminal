import { z } from "zod";

import { createBuyer, listBuyers } from "@/lib/real-estate/db";
import { BUYER_STAGES, LOAN_STATUSES } from "@/lib/real-estate/types";

export const dynamic = "force-dynamic";

const createBuyerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z.email(),
    phone: z.string().trim().max(30),
    market: z.string().trim().min(2).max(100),
    budgetMin: z.number().int().nonnegative(),
    budgetMax: z.number().int().positive(),
    downPayment: z.number().int().nonnegative(),
    creditBand: z.string().trim().min(2).max(40),
    loanStatus: z.enum(LOAN_STATUSES),
    timeline: z.string().trim().min(2).max(50),
    stage: z.enum(BUYER_STAGES),
    missingItems: z.string().trim().max(500),
    notes: z.string().trim().max(2000),
  })
  .refine((value) => value.budgetMax >= value.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget.",
    path: ["budgetMax"],
  });

export async function GET() {
  try {
    return Response.json({ buyers: await listBuyers() });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Buyer records could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = createBuyerSchema.parse(await request.json());
    const buyer = await createBuyer(input);
    return Response.json({ buyer }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Buyer information is invalid." }, { status: 400 });
    }

    console.error(error);
    return Response.json({ error: "The buyer record could not be saved." }, { status: 500 });
  }
}
