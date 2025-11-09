import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://test-project.yeab.works";

export const metadata: Metadata = {
  title: {
    default: "Furnizen - Your Comfort Zone Begins Here",
    template: "%s | Furnizen",
  },
  description:
    "Discover the perfect blend of quality, comfort, and modern design. Furnizen hand-selects signature pieces that refresh every room and reflect your unique taste. Shop authentic craftsmanship, personalized styling, and sustainable materials.",
  keywords: [
    "furniture",
    "home decor",
    "modern furniture",
    "furniture store",
    "sustainable furniture",
    "artisan furniture",
    "interior design",
    "home furnishings",
    "furniture shopping",
    "design furniture",
  ],
  authors: [{ name: "Furnizen" }],
  creator: "Furnizen",
  publisher: "Furnizen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Furnizen",
    title: "Furnizen - Your Comfort Zone Begins Here",
    description:
      "Discover the perfect blend of quality, comfort, and modern design. Furnizen hand-selects signature pieces that refresh every room and reflect your unique taste.",
    images: [
      {
        url: "/hero-light.png",
        width: 1200,
        height: 630,
        alt: "Furnizen - Modern Furniture Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Furnizen - Your Comfort Zone Begins Here",
    description:
      "Discover the perfect blend of quality, comfort, and modern design. Furnizen hand-selects signature pieces that refresh every room.",
    images: ["/hero-light.png"],
    creator: "@furnizen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
