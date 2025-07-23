import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
// import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
//   variable: '--font-poppins',
// });
export const metadata: Metadata = {
  title: 'UTMS',
  description: 'University transport management system',
};
export default function RootLayout(props: any) {
  const children = props.children;
  const session = props.session;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-neutral-200 antialiased dark:bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <Toaster />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
