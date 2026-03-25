import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide pre-rendered SEO fallback once React mounts
const seoFallback = document.getElementById("seo-fallback");
if (seoFallback) seoFallback.remove();

createRoot(document.getElementById("root")!).render(<App />);
