import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Resume Screening',
  description: 'AI Resume Screening',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>{children}</body>
    </html>
  );
}
