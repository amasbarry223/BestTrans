import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StripExtensionAttrs } from "@/components/strip-extension-attrs";
import { STRIP_EXTENSION_ATTRS_SCRIPT } from "@/lib/strip-extension-attrs-script";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ricash Web Agent",
  description: "Tableau de bord agent pour les services financiers Ricash au Mali",
  keywords: ["Ricash", "agent", "Mali", "mobile money", "transfert"],
  openGraph: {
    title: "Ricash Web Agent",
    description: "Tableau de bord agent Ricash",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: STRIP_EXTENSION_ATTRS_SCRIPT }}
        />
        <StripExtensionAttrs />
        <div suppressHydrationWarning>{children}</div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
