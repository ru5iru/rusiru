import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clear pre-rendered SEO content inside #root before React hydrates
const root = document.getElementById("root")!;
root.innerHTML = "";

createRoot(root).render(<App />);
