import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "@/lib/react-query";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Trainer Base",
  description: "All in one PT management platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trainer Base",
    startupImage: [
      {
        url: "/icon-512x512.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icon-512x512.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icon-512x512.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  icons: {
    apple: [
      {
        url: "/touch-icon-iphone.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
      { url: "/touch-icon-ipad.svg", sizes: "152x152", type: "image/svg+xml" },
      {
        url: "/touch-icon-iphone-retina.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
      {
        url: "/touch-icon-ipad-retina.svg",
        sizes: "167x167",
        type: "image/svg+xml",
      },
    ],
  },
};

export function generateViewport() {
  return {
    themeColor: "#ffffff",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased pt-[env(safe-area-inset-top)] bg-surface-page`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
