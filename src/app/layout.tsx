import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uhh Counter - Track Uhh in Public Speaking",
  description: "Track and analyze filler words like 'uhh' during public speaking to improve your communication skills.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/manifest.json',
  applicationName: "Uhh Counter",
  appleWebApp: {
    capable: true,
    title: "Uhh Counter",
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false
  },
  creator: "Quinten Cabo",
  keywords: ['public speaking', 'filler words', 'uhh counter', 'speech analysis', 'communication skills'],
};

export const viewport : Viewport = {
  colorScheme: "light dark",
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1.0
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}> 
        <ThemeProvider defaultTheme="system" storageKey="filler-word-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
