import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
          return status >= 500 && failureCount < 2;
        },
      },
      mutations: { retry: 0 },
    },
  });
}
