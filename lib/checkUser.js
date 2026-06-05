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

    // 1. Safely evaluate names, handling null/undefined values gracefully
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    
    // Combine names and trim any accidental white space
    let sanitizedName = `${firstName} ${lastName}`.trim();

    // 2. Ultimate Fallback: If both firstName and lastName are missing,
    // split their email address to generate a default username (e.g., "alex" from alex@gmail.com)
    if (!sanitizedName && user.emailAddresses?.[0]?.emailAddress) {
      sanitizedName = user.emailAddresses[0].emailAddress.split("@")[0];
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: sanitizedName || "Kuber User", // Absolute emergency fallback string
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    // Log it on the server console so you can see it in Vercel logs
    console.error("Error inside checkUser pipeline:", error.message);
    // Rethrow the error so that the calling Server Component doesn't receive an unexpected 'undefined'
    throw error;
  }
};