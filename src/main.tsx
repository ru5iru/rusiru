import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Clear pre-rendered SEO content inside #root before React hydrates
const root = document.getElementById("root")!;
root.innerHTML = "";

createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
