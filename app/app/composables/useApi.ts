/**
 * Composable for making authenticated API calls
 * Automatically adds Authorization header from auth store
 */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit & { query?: Record<string, any> } = {}
  ): Promise<T> => {
    const url = endpoint.startsWith('http') ? endpoint : `${config.public.apiBase}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    // Add Authorization header if we have a token
    if (authStore.tokens?.accessToken) {
      ;(headers as Record<string, string>)['Authorization'] =
        `Bearer ${authStore.tokens.accessToken}`
    }

    return $fetch<T>(url, {
      ...options,
      headers,
    } as Parameters<typeof $fetch>[1]) as Promise<T>
  }

  return {
    apiFetch,
    // Convenience methods
    get: <T>(endpoint: string, options?: RequestInit) =>
      apiFetch<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
      apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
      apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
      apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
  }
}
