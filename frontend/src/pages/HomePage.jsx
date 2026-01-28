import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Wrench, Shield, Truck, Phone } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredParts, setFeaturedParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, partsRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/parts`)
        ]);
        setCategories(catRes.data);
        setFeaturedParts(partsRes.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: Wrench,
      title: "Peças de Qualidade",
      description: "Peças novas e usadas testadas e garantidas"
    },
    {
      icon: Shield,
      title: "Garantia",
      description: "Garantia em todas as peças comercializadas"
    },
    {
      icon: Truck,
      title: "Entrega Rápida",
      description: "Envio para todo o país em 24-48h"
    },
    {
      icon: Phone,
      title: "Suporte",
      description: "Atendimento personalizado via WhatsApp"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85"
            alt="CrashPeças Workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0A0A0A]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center pt-20">
          <div className="animate-fade-in">
            <span className="inline-block text-red-600 font-bold uppercase tracking-widest text-sm mb-6">
              Peças Automóveis em Palmela
            </span>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Crash<span className="text-red-600">Peças</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto mb-10">
              A sua solução em peças automóveis
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/solicitar">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-10 py-6 rounded-sm text-base shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300"
                  data-testid="hero-solicitar-btn"
                >
                  Solicitar Peça
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contactos">
                <Button 
                  variant="outline"
                  className="border-neutral-600 text-white hover:border-white hover:bg-white/5 font-bold uppercase tracking-wider px-10 py-6 rounded-sm text-base transition-all duration-300"
                  data-testid="hero-contactar-btn"
                >
                  Contactar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neutral-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-neutral-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 md:p-8 bg-[#171717] border border-neutral-800 rounded-sm hover:border-red-600/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-red-600/10 rounded-sm flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
              Navegue por
            </span>
            <h2 
              className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-2"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Categorias
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-neutral-800 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="bento-grid">
              {categories.slice(0, 6).map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  className={index === 0 ? "bento-large" : index === 3 ? "bento-wide" : ""}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/loja">
              <Button 
                variant="outline"
                className="border-neutral-700 text-white hover:border-white hover:bg-white/5 font-bold uppercase tracking-wider px-8 py-4 rounded-sm transition-all duration-300"
                data-testid="ver-todas-categorias-btn"
              >
                Ver Todas as Categorias
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-32 bg-[#171717]" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
                Em Destaque
              </span>
              <h2 
                className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-2"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                Peças Recentes
              </h2>
            </div>
            <Link to="/loja" className="mt-4 md:mt-0">
              <Button 
                variant="ghost"
                className="text-neutral-400 hover:text-white font-medium transition-colors p-0"
                data-testid="ver-todas-pecas-btn"
              >
                Ver todas as peças
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-neutral-800 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredParts.map((part) => (
                <ProductCard key={part.id} product={part} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A] relative overflow-hidden" data-testid="cta-section">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Não encontra a peça que procura?
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            Envie-nos o seu pedido e faremos todos os esforços para encontrar a peça que necessita.
          </p>
          <Link to="/solicitar">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-12 py-6 rounded-sm text-lg shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300"
              data-testid="cta-solicitar-btn"
            >
              Solicitar Peça Personalizada
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
