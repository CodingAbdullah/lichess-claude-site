import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lichess Hub - Chess Statistics and Profile Lookup",
  description: "Explore Lichess chess statistics, player profiles, and global leaderboards. Your ultimate destination for chess data analysis.",
  keywords: ["Lichess", "Chess", "Statistics", "Player Profiles", "Chess Analytics", "Tournament Data"],
  openGraph: {
    title: "Lichess Hub - Chess Statistics",
    description: "Comprehensive chess statistics and player analysis platform",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>♔</text></svg>" />
      </head>
      <body
        className={`${jetBrainsMono.variable} ${jetBrainsMono.className} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
          {children}
        </div>
      </body>
    </html>
  );
}
