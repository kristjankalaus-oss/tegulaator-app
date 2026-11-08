import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plaatija24 – Plaatimistööde AI Kalkulaator & Meistrite Võrk',
  description:
    'Professionaalne platvorm plaatijatele ja tellijatele: täpne materjali- ja tööeelarve (Mira, Mapei, Kiilto), 3D AI visuaalne ruumikontseptsioon ja 1-kliki hinnapakkumised. Platvormi operaator: Tegulaator OÜ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900 min-h-screen flex flex-col font-sans`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
