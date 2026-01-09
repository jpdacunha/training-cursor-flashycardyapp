import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashy Cardy App",
  description: "A flashcard application with Clerk authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
