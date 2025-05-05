import type { Metadata } from "next";
import { Courier_Prime } from 'next/font/google';
import "./globals.css";
import GoogleAnalytics from './components/GoogleAnalytics';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import GoogleAdSense from './components/GoogleAdSense';

// Initialize the Courier Prime font
const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FocusFlow - Pomodoro Timer & Task Manager",
  description: "A simple, elegant Pomodoro timer with task management and statistics tracking.",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#333333" />
        <meta name="google-adsense-account" content="ca-pub-1667462772689046" />
      </head>
      <body className={courierPrime.className}>
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <GoogleAdSense />
        {children}
      </body>
    </html>
  );
}
