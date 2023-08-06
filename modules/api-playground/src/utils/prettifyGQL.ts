import { parse, print } from 'graphql';

export const prettifyGQL = (q: string): string => print(parse(q));
