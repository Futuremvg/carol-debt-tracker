import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const CreditLine = lazy(() => import("./pages/CreditLine"));
const PagamentosFixos = lazy(() => import("./pages/PagamentosFixos"));
const VehicleCarolFinancials = lazy(() => import("./pages/VehicleCarolFinancials"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/credit-line" element={<CreditLine />} />
            <Route path="/pagamentos-fixos" element={<PagamentosFixos />} />
            <Route path="/vehicle-carol" element={<VehicleCarolFinancials />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
