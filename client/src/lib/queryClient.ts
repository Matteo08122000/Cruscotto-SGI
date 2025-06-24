import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    
    if (res.status === 401) {
      
      // Tenta di estendere la sessione prima di fallire
      try {
        const extendResponse = await fetch('/api/extend-session', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include'
        });
        
        // Se l'estensione della sessione ha successo, ritenta la richiesta originale
        if (extendResponse.ok) {
          
          // Ritenta la richiesta originale
          const retryRes = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            credentials: "include",
          });
          
          if (retryRes.ok) {
            return retryRes;
          }
        }
      } catch (retryError) {
       
      }
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
   
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      let res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      // Gestione speciale per errori di autenticazione
      if (res.status === 401) {
        
        // Se l'opzione è returnNull, restituiamo null come richiesto
        if (unauthorizedBehavior === "returnNull") {
          // Prima proviamo a estendere la sessione
          try {
            const authStatusResponse = await fetch('/api/auth-status', {
              credentials: 'include'
            });
            
            // Se la risposta auth-status è ok, forse la sessione è stata estesa,
            // quindi ritenta la richiesta originale una volta
            if (authStatusResponse.ok) {
              
              // Ritenta la richiesta originale
              const retryRes = await fetch(queryKey[0] as string, {
                credentials: "include",
              });
              
              if (retryRes.ok) {
                return await retryRes.json();
              }
            }
          } catch (retryError) {
            
          }
          
          // Se ancora non ha funzionato, restituisci null come da comportamento richiesto
          return null;
        }
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
 
      throw error;
    }
  };

// Funzione helper per gestire gli errori
export function handleQueryError(error: unknown): void {
  console.error('Query error:', error);
  // Qui puoi aggiungere notifiche toast, logging, ecc.
}

export function handleMutationError(error: unknown): void {
  console.error('Mutation error:', error);
  // Qui puoi aggiungere notifiche toast, logging, ecc.
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      // Retry logic robusta
      retry: (failureCount, error) => {
        // Non riprovare per errori 4xx (tranne 408, 429)
        if (error instanceof Error) {
          const statusMatch = error.message.match(/^(\d+):/);
          if (statusMatch) {
            const status = parseInt(statusMatch[1]);
            if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
              return false;
            }
          }
        }
        
        // Riprova massimo 3 volte con backoff esponenziale
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry per mutazioni (solo per errori di rete)
      retry: (failureCount, error) => {
        if (error instanceof Error) {
          const statusMatch = error.message.match(/^(\d+):/);
          if (statusMatch) {
            const status = parseInt(statusMatch[1]);
            // Riprova solo per errori 5xx e errori di rete
            return (status >= 500 || status === 0) && failureCount < 2;
          }
        }
        
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});
