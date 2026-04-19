import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, sum, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ used: 0 });

  const result = await db
    .select({ total: sum(files.size) })
    .from(files)
    .where(
      and(
        eq(files.userId, userId),
        eq(files.isTrash, false)
      )
    );

  return Response.json({
    used: Number(result[0].total || 0) / (1024 * 1024 ), // MB
  });
}