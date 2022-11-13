import axios from "axios"

import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

interface Entropy {
  data: Record<string, any>
  hash: string
  hashType: string
  signature: string
  signatureType: string
}

import { ENTROPY_LATEST_URL } from "./constants"

function fetchLatestEntropy(): Promise<Entropy> {
  return axios.get(ENTROPY_LATEST_URL).then((response) => response.data)
}

export function useLatestEntropy() {
  return useQuery<Entropy, Error>(
    ["entropy", "latest"],
    () => fetchLatestEntropy(),
    {
      retry: 10,
      retryDelay: (attempt) =>
        Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 60,
      refetchInterval: 1000 * 10,
    }
  )
}
