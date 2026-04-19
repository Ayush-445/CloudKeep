import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();

  if (!userId) return Response.json({ error: "Unauthorized" });

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    firstName: body.name,
    publicMetadata: {
      avatar: body.imageUrl,
    },
  });

  return Response.json({ success: true });
}