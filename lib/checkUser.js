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

    // Bugfix 1: Handle missing lastNames gracefully instead of sending 'null' strings
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    let sanitizedName = `${firstName} ${lastName}`.trim();

    // Fallback if the user has no name configured in their account profile
    if (!sanitizedName && user.emailAddresses?.[0]?.emailAddress) {
      sanitizedName = user.emailAddresses[0].emailAddress.split("@")[0];
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: sanitizedName || "Kuber User",
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    // This will print cleanly in your Vercel logs dashboard
    console.error("CRITICAL ERROR IN CHECKUSER DATABASE TRANSACTION:", error);
    // Bugfix 2: Rethrow the error so that Next.js treats this as a defined error boundary 
    // instead of letting page.jsx read fields off an undefined object response
    throw error;
  }
};