import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    /* 1. Added a flex container with bg-background to cover the whole screen */
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <SignIn 
        appearance={{
          /* 2. Used the Clerk dark theme */
          baseTheme: dark,
          elements: {
            /* 3. Styled the primary button and card to match your finance app theme */
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "border border-border bg-card",
          },
        }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}