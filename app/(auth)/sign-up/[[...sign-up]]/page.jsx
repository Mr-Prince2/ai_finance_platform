import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <SignUp 
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "border border-border bg-card",
          },
        }}
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}