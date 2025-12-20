
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata = {
  title: "U'n'IVERSE",
  description: "U'n'IVERSE — Create your own profile card easily and share it with the people you meet to expand your universe.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "U'n'IVERSE",
    description: "U'n'IVERSE — Create your own profile card easily and share it with the people you meet to expand your universe.",
    images: '/favicon.png',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${notoSansJP.variable} antialiased`}
      >
        {children}
        {/* Register the service worker on the client */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore (imported client component) */}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(e=>console.error('sw reg',e))}` }} />
      </body>
    </html>
  );
}
