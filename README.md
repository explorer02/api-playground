# API Playground

An interactive React component library for exploring GraphQL and REST APIs.

[![npm version](https://img.shields.io/npm/v/@explorer02/api-playground.svg)](https://www.npmjs.com/package/@explorer02/api-playground)

## Links

- [Live Demo](https://api-playground-git-main-explorer02s-projects.vercel.app/demo) — try the playground with the Rick & Morty GraphQL API
- [npm](https://www.npmjs.com/package/@explorer02/api-playground)
- [GitHub](https://github.com/explorer02/api-playground)
- [Full Documentation](./packages/api-playground/README.md)

## Quick Start

```bash
npm install @explorer02/api-playground
```

```tsx
import { ApolloProvider } from '@apollo/client';
import { APIPlayground, Template } from '@explorer02/api-playground';
import '@explorer02/api-playground/dist/index.css';

<ApolloProvider client={client}>
  <APIPlayground config={config} />
</ApolloProvider>
```

See the [package README](./packages/api-playground/README.md) for full template documentation and API reference.

## Development

```bash
yarn install
yarn dev        # Start the Next.js dev server
```

## License

MIT + Commons Clause. See [LICENSE](./LICENSE) for details.
