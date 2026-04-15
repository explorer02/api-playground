import type { ApolloClient } from '@apollo/client';

function escapeShellArg(str: string): string {
  return str.replace(/'/g, "'\\''");
}

type GenerateCurlParams = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

export function generateCurl({ url, method, headers, body }: GenerateCurlParams): string {
  const parts: string[] = [`curl -X ${method} '${escapeShellArg(url)}'`];

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (key.trim()) {
        parts.push(`-H '${escapeShellArg(`${key}: ${value}`)}'`);
      }
    }
  }

  if (body && method !== 'GET') {
    parts.push(`-d '${escapeShellArg(body)}'`);
  }

  return parts.join(' \\\n  ');
}

type GenerateGraphQLCurlParams = {
  endpoint: string;
  query: string;
  variables?: string;
};

export function generateGraphQLCurl({ endpoint, query, variables }: GenerateGraphQLCurlParams): string {
  const bodyObj: Record<string, unknown> = { query };

  if (variables) {
    try {
      bodyObj.variables = JSON.parse(variables);
    } catch {
      // If variables aren't valid JSON, include as-is
      bodyObj.variables = variables;
    }
  }

  return generateCurl({
    url: endpoint,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyObj),
  });
}

export function getApolloUri(client: ApolloClient<unknown>): string {
  try {
    return (client as any).link?.options?.uri ?? '';
  } catch {
    return '';
  }
}
