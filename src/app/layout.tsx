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
  title: "TransitPro — Plateforme de Gestion Transit & Logistique",
  description: "Plateforme numérique de gestion pour société de transit et logistique — Dédouanement, Transport, Entreposage, Facturation",
  keywords: ["TransitPro", "transit", "logistique", "dédouanement", "Mali", "UEMOA", "FCFA"],
  openGraph: {
    title: "TransitPro — Transit & Logistique",
    description: "Plateforme de gestion transit et logistique",
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
