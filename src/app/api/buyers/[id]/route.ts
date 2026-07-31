import { z } from "zod";

import { updateBuyerStage } from "@/lib/real-estate/db";
import { BUYER_STAGES } from "@/lib/real-estate/types";

export const dynamic = "force-dynamic";

const updateStageSchema = z.object({
  stage: z.enum(BUYER_STAGES),
});

export async function PATCH(request: Request, context: RouteContext<"/api/buyers/[id]">) {
  try {
    const { id } = await context.params;
    const { stage } = updateStageSchema.parse(await request.json());
    const buyer = await updateBuyerStage(id, stage);

    if (!buyer) {
      return Response.json({ error: "Buyer record not found." }, { status: 404 });
    }

    return Response.json({ buyer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "The requested pipeline stage is invalid." }, { status: 400 });
    }

    console.error(error);
    return Response.json({ error: "The pipeline stage could not be updated." }, { status: 500 });
  }
}
