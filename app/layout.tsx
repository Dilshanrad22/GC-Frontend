import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'G.C. Print Shop | Admin',
  description: 'G.C. Print Shop business management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: some browser extensions (translators, grammar
    // checkers, antivirus toolbars) tag <html>/<body> with their own
    // attributes before React hydrates. That's a real DOM difference but not
    // a bug in this app, so warning about it here is the React-sanctioned
    // way to silence it without masking other, real hydration mismatches.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
