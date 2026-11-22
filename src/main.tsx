import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/i18n";
import "./index.css";
import { applyTheme } from "./config";

applyTheme();

// React replaces the static search fallback only when the application commits.
const root = document.getElementById("root");
if (!root) throw new Error('Missing application root');

createRoot(root).render(
  <HelmetProvider>
    <I18nProvider>
      <App />
    </I18nProvider>
  </HelmetProvider>
);
