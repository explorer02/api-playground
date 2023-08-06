import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const recursivelyExpandData = (data: Record<string, any>, cache: NormalizedCacheObject): Record<string, any> => {
  if (typeof data !== 'object' || !data) {
    return data;
  }

  if (data.__ref) {
    return recursivelyExpandData(cache[data.__ref]!, cache);
  }

  return Object.keys(data).reduce((acc, key) => {
    if (typeof data[key] === 'object') {
      if (Array.isArray(data[key])) {
        acc[key] = data[key].map((obj: Record<string, any>) => recursivelyExpandData(obj, cache));
      } else {
        acc[key] = recursivelyExpandData(data[key], cache);
      }
    } else {
      acc[key] = data[key];
    }

    return acc;
  }, {} as Record<string, any>);
};

export const getExpandedData = (client: ApolloClient<NormalizedCacheObject>): object => {
  const cache = client.cache.extract();

  if (cache.ROOT_QUERY) {
    return Object.keys(cache.ROOT_QUERY).reduce((acc, key) => {
      acc[key] = recursivelyExpandData(cache.ROOT_QUERY![key] as Record<string, any>, cache);
      return acc;
    }, {} as Record<string, any>);
  }

  return {};
};
