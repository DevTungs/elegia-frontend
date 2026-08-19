import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import Events from "./pages/Events";
import About from "./pages/About";
import Merch from "./pages/Merch";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import EchoOfOrigin from "./pages/EchoOfOrigin";
import SanguePodre from "./pages/AoVivoSanguePodre";
import MyOrders from "./pages/MyOrders";
import Origins from "./pages/Origins";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/merch/success" element={<OrderSuccess />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/origins" element={<Origins />} />
            <Route path="/echooforigin" element={<EchoOfOrigin />} />
            <Route path="/ao-vivo/sangue-podre" element={<SanguePodre />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartDrawer />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
