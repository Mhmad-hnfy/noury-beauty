import { Geist, Geist_Mono, Playfair_Display, Poppins, Cairo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

import ScrollButton from "@/_Components/ScrollButton";

export const metadata = {
  title: "Noury Beauty",
  description: "Best beauty products in Egypt",
  manifest: "/manifest.json",
  themeColor: "#d4af37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Noury Beauty",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6d1616" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>
          {children}
          <ScrollButton />
        </StoreProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
