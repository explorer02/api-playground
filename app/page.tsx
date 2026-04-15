import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CodeBlock } from './components/CodeBlock';

export const metadata: Metadata = {
  title: 'API Playground - Interactive GraphQL & REST API Explorer',
  description:
    'A React component library for interactive GraphQL and REST API exploration. Built with Apollo Client, Monaco Editor, and TypeScript.',
};

const FEATURES = [
  { title: 'Query Executor', desc: 'Free-form GraphQL query editor with variables and response panes.' },
  { title: 'Mutation Executor', desc: 'Execute GraphQL mutations with preset selections and variable support.' },
  { title: 'REST API Client', desc: 'Test HTTP endpoints with configurable URL, method, headers, and body.' },
  { title: 'Schema Viewer', desc: 'Introspect and browse your full GraphQL schema.' },
  { title: 'Custom Query', desc: 'Form-driven query execution with validation and field layouts.' },
  { title: 'Custom Mutation', desc: 'Form-driven mutations with configurable inputs and validators.' },
  { title: 'Fetch & Mutate', desc: 'Two-step workflow: fetch data first, then mutate using the result.' },
  { title: 'Cache Viewer', desc: 'Inspect and edit the Apollo Client normalized cache in real time.' },
  { title: 'Nested Templates', desc: 'Group multiple templates under a single sidebar entry.' },
  { title: 'Custom Component', desc: 'Render any React component when built-in templates don\u2019t fit.' },
  { title: 'Static Data', desc: 'Display read-only JSON, GraphQL, or code with syntax highlighting.' },
];

const CODE = `import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { APIPlayground, Template } from '@explorer02/api-playground';
import '@explorer02/api-playground/dist/index.css';

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache(),
});

const config = [
  {
    id: 'queries',
    type: Template.QUERY_EXECUTOR,
    title: 'Query Executor',
    client,
  },
];

export default function App() {
  return (
    <ApolloProvider client={client}>
      <APIPlayground config={config} />
    </ApolloProvider>
  );
}`;

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', color: '#111' }}>
      {/* ── Nav ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#6366f1' }}>&lt;/&gt;</span> API Playground
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a
              href="https://github.com/explorer02/api-playground"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@explorer02/api-playground"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}
            >
              npm
            </a>
            <Link
              href="/demo"
              style={{
                fontSize: 14,
                fontWeight: 600,
                background: '#4f46e5',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: 8,
              }}
            >
              Live Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '80px 32px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'center',
        }}
      >
        {/* Left */}
        <div>
          <span
            style={{
              display: 'inline-block',
              marginBottom: 24,
              padding: '4px 14px',
              borderRadius: 20,
              background: '#eef2ff',
              border: '1px solid #e0e7ff',
              fontSize: 13,
              fontWeight: 600,
              color: '#4f46e5',
            }}
          >
            v1.0 &mdash; Open Source
          </span>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#111827',
              margin: 0,
            }}
          >
            Interactive GraphQL &amp; REST API Explorer
          </h1>
          <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.7, color: '#6b7280' }}>
            A React component library with 11 built-in templates for testing APIs, inspecting schemas, managing cache,
            and building form-driven workflows.
          </p>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#4f46e5',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Try Live Demo
              <span style={{ fontSize: 18 }}>&rarr;</span>
            </Link>
            <code
              style={{
                background: '#1e1e2e',
                color: '#a5b4fc',
                padding: '12px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'monospace',
                userSelect: 'all',
              }}
            >
              npm i @explorer02/api-playground
            </code>
          </div>
        </div>

        {/* Right — Screenshot */}
        <div
          style={{
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <Image
            src="/screenshot.png"
            alt="API Playground screenshot"
            width={1200}
            height={900}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: '#fff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#111827',
              margin: 0,
            }}
          >
            11 Built-in Templates
          </h2>
          <p style={{ textAlign: 'center', marginTop: 12, marginBottom: 48, fontSize: 16, color: '#6b7280' }}>
            Everything you need to explore, test, and debug your APIs.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="hover:shadow-md hover:border-indigo-200"
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '20px 20px',
                  background: '#fff',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Start ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#111827',
            margin: 0,
          }}
        >
          Quick Start
        </h2>
        <p style={{ textAlign: 'center', marginTop: 12, marginBottom: 40, fontSize: 16, color: '#6b7280' }}>
          Get up and running in under a minute.
        </p>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <CodeBlock code={CODE} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            color: '#9ca3af',
          }}
        >
          <span>MIT + Commons Clause &copy; {new Date().getFullYear()} Ajay Bhardwaj</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="https://github.com/explorer02/api-playground" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@explorer02/api-playground"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </a>
            <Link href="/demo">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
