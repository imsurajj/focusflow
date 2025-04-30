import type { Metadata } from "next";
import { Courier_Prime } from 'next/font/google';
import "./globals.css";

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
      <body className={courierPrime.className}>
        {children}
      </body>
    </html>
  );
}
