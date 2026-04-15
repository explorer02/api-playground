import type { Metadata } from 'next';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { QuickStart } from './components/QuickStart';
import { Footer } from './components/Footer';

export const metadata: Metadata = {
  title: 'API Playground - Interactive GraphQL & REST API Explorer',
  description:
    'A React component library for interactive GraphQL and REST API exploration. Built with Apollo Client, Monaco Editor, and TypeScript.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <QuickStart />
      <Footer />
    </div>
  );
}
