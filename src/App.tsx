
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VoltMarket } from "./pages/VoltMarket";
import VoltScout from "./pages/VoltScout";
import { VoltMarketAuthProvider } from "./contexts/VoltMarketAuthContext";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* VoltScout routes (requires VoltScout approval) */}
          <Route path="/app/*" element={<VoltScout />} />
          
          {/* VoltMarket/GridBazaar routes (separate auth system) */}
          <Route path="/*" element={
            <VoltMarketAuthProvider>
              <VoltMarket />
            </VoltMarketAuthProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
