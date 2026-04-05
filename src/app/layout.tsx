import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FileStoreProvider from '@/components/FileStoreProvider';
import { createBaseMetadata } from '@/lib/seo/metadata';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = createBaseMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <FileStoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </FileStoreProvider>
      </body>
    </html>
  );
}

