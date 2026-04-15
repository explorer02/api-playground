import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="max-w-[1120px] mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
      {/* Left */}
      <div>
        <span className="inline-block mb-6 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[13px] font-semibold text-indigo-600">
          v2.0 &mdash; Open Source
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
          Interactive GraphQL &amp; REST API Explorer
        </h1>
        <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-500">
          A React component library with 11 built-in templates for testing APIs, inspecting schemas, managing cache, and
          building form-driven workflows.
        </p>
        <div className="mt-6 md:mt-9 flex items-center gap-3 md:gap-4 flex-wrap">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 md:px-7 py-3 rounded-[10px] text-[15px] font-semibold"
          >
            Try Live Demo
            <span className="text-lg">&rarr;</span>
          </Link>
          <code className="bg-slate-800 text-indigo-300 px-4 md:px-5 py-3 rounded-[10px] text-sm font-mono select-all">
            npm i @explorer02/api-playground
          </code>
        </div>
      </div>

      {/* Right — Screenshot */}
      <div className="rounded-2xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
        <Image
          src="/screenshot.png"
          alt="API Playground screenshot"
          width={1200}
          height={900}
          className="w-full h-auto block"
          priority
        />
      </div>
    </section>
  );
}
