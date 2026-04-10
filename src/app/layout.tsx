import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nguyen Quang | Professional FE Developer",
  description:
    "Professional profile and career journey of Nguyen Quang, Frontend Developer and Project Leader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
