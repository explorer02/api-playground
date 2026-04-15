import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'API Playground - Interactive GraphQL & REST API Explorer',
  description:
    'A React component library for interactive GraphQL and REST API exploration. Built with Apollo Client, Monaco Editor, and TypeScript.',
  openGraph: {
    title: 'API Playground',
    description: 'Interactive GraphQL & REST API Explorer',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
