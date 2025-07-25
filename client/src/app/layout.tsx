import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster as HotToaster } from 'react-hot-toast';

import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskManager Pro',
  description: 'Professional task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div id="root">{children}</div>
          <Toaster />
          <HotToaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}