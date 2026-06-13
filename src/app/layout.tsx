import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StripExtensionAttrs } from "@/components/strip-extension-attrs";
import { STRIP_EXTENSION_ATTRS_SCRIPT } from "@/lib/strip-extension-attrs-script";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestTrans — Dashboard Admin",
  description: "Dashboard d'administration BestTrans — Supervision de la plateforme VTC, gestion des courses, chauffeurs et paiements",
  keywords: ["BestTrans", "VTC", "dashboard", "admin", "courses", "chauffeurs", "Mali"],
  openGraph: {
    title: "BestTrans — Dashboard Admin",
    description: "Plateforme d'administration BestTrans",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: STRIP_EXTENSION_ATTRS_SCRIPT }}
          />
          <StripExtensionAttrs />
          <div suppressHydrationWarning>{children}</div>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
