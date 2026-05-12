import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether Studios | Danny Rao",
  description:
    "Solo B2B product design consultancy specializing in compliance UX for regulated industries.",
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
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
