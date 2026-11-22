import { siteConfig } from '@/config';
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import { LoadingState, LoadBoundary } from '@/components/LoadState';

const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
    <ThemeProvider attribute="class" defaultTheme={siteConfig.theme.default} enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<LoadBoundary><Suspense fallback={<LoadingState />}><NotFound /></Suspense></LoadBoundary>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);

export default App;
