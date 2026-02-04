import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const createApolloClient = (baseUrl?: string) => {
  const uri = baseUrl ? `${baseUrl}/api/graphql` : '/api/graphql'

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri,
      useGETForQueries: true
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first'
      },
      query: {
        fetchPolicy: 'cache-first'
      }
    }
  })
}

export const initializeApollo = (
  initialState: NormalizedCacheObject | null = null,
  baseUrl?: string
) => {
  const _apolloClient = apolloClient ?? createApolloClient(baseUrl)

  if (initialState) {
    const existingCache = _apolloClient.cache.extract()
    _apolloClient.cache.restore({
      ...existingCache,
      ...initialState
    })
  }

  if (typeof window === 'undefined') {
    return _apolloClient
  }

  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export const useApollo = (initialState?: NormalizedCacheObject | null) => {
  return useMemo(() => initializeApollo(initialState ?? null), [initialState])
}
