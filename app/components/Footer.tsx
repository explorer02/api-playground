import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <span>MIT + Commons Clause &copy; {new Date().getFullYear()} Ajay Bhardwaj</span>
        <div className="flex items-center gap-6">
          <a href="https://github.com/explorer02/api-playground" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@explorer02/api-playground" target="_blank" rel="noopener noreferrer">
            npm
          </a>
          <Link href="/demo">Demo</Link>
        </div>
      </div>
    </footer>
  );
}
