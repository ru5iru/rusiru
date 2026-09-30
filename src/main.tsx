import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/i18n";
import "./index.css";

// Clear pre-rendered SEO content inside #root before React hydrates
const root = document.getElementById("root")!;
root.innerHTML = "";

createRoot(root).render(
  <HelmetProvider>
    <I18nProvider>
      <App />
    </I18nProvider>
  </HelmetProvider>
);
