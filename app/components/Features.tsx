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

export function Features() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-12 md:py-[72px]">
        <h2 className="text-center text-2xl md:text-[32px] font-bold tracking-tight text-gray-900">
          11 Built-in Templates
        </h2>
        <p className="text-center mt-3 mb-10 md:mb-12 text-base text-gray-500">
          Everything you need to explore, test, and debug your APIs.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="border border-gray-200 rounded-xl p-4 md:p-5 bg-white transition-all duration-200 hover:shadow-md hover:border-indigo-200"
            >
              <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
