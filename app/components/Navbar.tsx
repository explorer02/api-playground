import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-indigo-500">&lt;/&gt;</span> API Playground
        </span>
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="https://github.com/explorer02/api-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@explorer02/api-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500"
          >
            npm
          </a>
          <Link href="/demo" className="text-sm font-semibold bg-indigo-600 text-white px-4 md:px-5 py-2 rounded-lg">
            Live Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
