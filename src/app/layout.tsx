import type { Metadata } from "next";
import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { WaveVariantPicker } from "@/components/WaveVariantPicker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danyal Rao — Product Designer",
  description:
    "Product designer for B2B AI and insurance. Sole design lead at Complify (Conviction-backed) and SafetyWing (YC). Based in San Francisco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/3c9a33e9913448d684afff5b4b0cc59c?family=SCE-PS3+Rodin+LATIN+Regular"
        />
      </head>
      <body className="min-h-full antialiased">
        {/*
         * WaveBackground and Sparkles live in the root layout (not per page)
         * so the GL canvas and sparkle layer persist across route changes.
         * Previously each page mounted its own, causing a blue flash on
         * every navigation while the new wave canvas reinitialized.
         */}
        <WaveBackground />
        <Sparkles />
        <WaveVariantPicker />
        {children}
      </body>
    </html>
  );
}
