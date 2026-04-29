import "@/App.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import AdminPage from "@/pages/AdminPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import PrivacidadePage from "@/pages/PrivacidadePage";
import TermosPage from "@/pages/TermosPage";

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return isAdmin ? (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
    </Routes>
  ) : (
    <SiteLayout>
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
        <Route path="/privacidade" element={<PrivacidadePage />} />
        <Route path="/termos" element={<TermosPage />} />
      </Routes>
    </SiteLayout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
