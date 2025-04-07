import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppShell from '@/components/layout/app-shell';
import { Toaster } from "@/components/ui/sonner";
// import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskTrack - Manage Your Tasks Efficiently',
  description: 'TaskTrack helps you track and manage your tasks and time efficiently across teams and projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        // forcedTheme="dark"
        > */}
        <AppShell>{children}</AppShell>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}