import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chase Vandiver",
  description: "Apps, models and AI systems built by Chase Vandiver.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
