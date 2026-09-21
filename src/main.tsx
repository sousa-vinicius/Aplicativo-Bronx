import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o service worker (necessário pro navegador oferecer "Instalar app" /
// "Adicionar à tela inicial"). Só roda em produção com HTTPS — em localhost sem
// HTTPS o navegador pode bloquear, o que é esperado e não quebra o app.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Falha silenciosa: sem service worker o app continua funcionando
      // normalmente, só sem o recurso de instalação/cache offline.
    })
  })
}
