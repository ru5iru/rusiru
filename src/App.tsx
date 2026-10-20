import { siteConfig } from '@/config';
import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import { LoadingState, LoadBoundary } from '@/components/LoadState';

const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
    <ThemeProvider attribute="class" defaultTheme={siteConfig.theme.default} enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<LoadBoundary><Suspense fallback={<LoadingState />}><NotFound /></Suspense></LoadBoundary>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
);

export default App;
