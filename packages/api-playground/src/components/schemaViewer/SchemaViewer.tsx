// lib
import { useCallback, useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';

// components
import { Snippet } from '~/components/snippet';

// hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';

// utils
import { prettifyJSON } from '~/utils/prettifyJSON';

// types
import { SchemaViewerConfig } from '~/types';

const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        name
        kind
        description
        fields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                      ofType {
                        name
                        kind
                      }
                    }
                  }
                }
              }
            }
          }
          args {
            name
            description
            defaultValue
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                      ofType {
                        name
                        kind
                        ofType {
                          name
                          kind
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        inputFields {
          name
          description
          defaultValue
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                      ofType {
                        name
                        kind
                      }
                    }
                  }
                }
              }
            }
          }
        }
        interfaces {
          name
          kind
          ofType {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        }
        enumValues {
          name
          description
        }
        possibleTypes {
          name
          kind
        }
      }
      directives {
        name
        description
        locations
        args {
          name
          description
          defaultValue
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                      ofType {
                        name
                        kind
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const SchemaViewer = ({ config }: { config: SchemaViewerConfig }): JSX.Element => {
  const [loading, setLoading] = useState(true);

  const { editorRef, onMount } = useMonacoMount();

  const fetchSchema = useCallback(async () => {
    setLoading(true);
    try {
      const result = await config.client.query({ query: INTROSPECTION_QUERY });
      const formatted = prettifyJSON(result.data);
      editorRef.current?.setValue(formatted);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to fetch schema';
      editorRef.current?.setValue(errMsg);
    } finally {
      setLoading(false);
    }
  }, [config.client, editorRef]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const editorProps = useMemo(() => ({ onMount, readOnly: true }), [onMount]);

  return <Snippet title="Schema" editorProps={editorProps} loading={loading} />;
};
