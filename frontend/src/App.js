import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import CatalogoPage from "@/pages/CatalogoPage";
import CarroDetalhePage from "@/pages/CarroDetalhePage";
import ProductPage from "@/pages/ProductPage";
import RequestPartPage from "@/pages/RequestPartPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/catalogo/carro/:id" element={<CarroDetalhePage />} />
            <Route path="/loja" element={<CatalogPage />} />
            <Route path="/loja/:category" element={<CatalogPage />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/solicitar" element={<RequestPartPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contactos" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
