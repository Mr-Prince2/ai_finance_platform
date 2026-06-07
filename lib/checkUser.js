import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // 1. Handle missing names gracefully instead of sending 'null' strings to Prisma
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    let sanitizedName = `${firstName} ${lastName}`.trim();

    // 2. Fallback: If both names are blank, use their email prefix
    if (!sanitizedName && user.emailAddresses?.[0]?.emailAddress) {
      sanitizedName = user.emailAddresses[0].emailAddress.split("@")[0];
    }

    // 3. Create the new row in Supabase safely
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: sanitizedName || "Kuber User", // Absolute fallback string
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    // This logs the precise database failure message to your Vercel console
    console.error("CRITICAL DATABASE INSERTION ERROR:", error.message);
    // Rethrow so Next.js doesn't treat the user as 'undefined' and crash the dashboard page
    throw error;
  }
};