// Service worker mínimo: só o suficiente pra deixar o app "instalável" (ícone na
// tela inicial, abrir em tela cheia) e dar uma camada básica de cache do "shell"
// (HTML/CSS/JS) para abrir mais rápido em conexões ruins. Os dados (Supabase)
// nunca são cacheados aqui — sempre buscados direto da rede.

const CACHE_NAME = "bronx-shell-v1"
const APP_SHELL = ["/", "/manifest.webmanifest"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  // Nunca interceptar chamadas de API (Supabase ou qualquer domínio externo) —
  // só cachear os arquivos estáticos do próprio app.
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
