import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flashy Cardy App",
  description: "A flashcard application with Clerk authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: "#000000",
          colorPrimary: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorInputBackground: "#18181b",
          colorInputText: "#ffffff",
        },
        elements: {
          card: "bg-black border border-zinc-800",
          headerTitle: "text-white",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white",
          formButtonPrimary: "bg-white text-black hover:bg-zinc-200",
          footerActionLink: "text-white hover:text-zinc-300",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-zinc-900 border-zinc-800 text-white",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-zinc-400 hover:text-white",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${poppins.variable} antialiased`}
        >
          <header className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h1 className="text-xl font-semibold">Flashy Cardy App</h1>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-md bg-zinc-50 text-black hover:bg-zinc-200 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10",
                      userButtonPopoverCard: "bg-black border border-zinc-800",
                      userButtonPopoverActionButton: "text-white hover:bg-zinc-900",
                      userButtonPopoverActionButtonText: "text-white",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
