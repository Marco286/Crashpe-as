import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Wrench, Truck, Phone, CheckCircle } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIAS = [
  {
    nome: "Carroçaria",
    img: "/categorias/carrocaria.jpg",
    itens: ["Portas", "Pára-Choques", "Malas", "Grelhas", "Capôs", "Vidros/Pára-Brisas"],
  },
  {
    nome: "Mecânica",
    img: "/categorias/mecanica.jpg",
    itens: ["Motores", "Kit Embraiagem", "Caixas de Velocidades", "Mangas de Eixo", "Transmissões", "Amortecedores"],
  },
  {
    nome: "Sistema Elétrico",
    img: "/categorias/eletrico.jpg",
    itens: ["Alternadores", "Quadrantes", "Motores de Arranque", "Sensores", "Baterias", "Bobines"],
  },
  {
    nome: "Iluminação",
    img: "/categorias/iluminacao.jpg",
    itens: ["Faróis", "Luzes de Nevoeiro", "Farolins", "Luzes de Travagem", "Balastros de Xénon", "Lâmpadas"],
  },
  {
    nome: "Airbags",
    img: "/categorias/airbags.jpg",
    itens: ["Centralinas", "Coberturas de Tablier", "Módulos de Airbag", "Bancos com Airbag", "Sensores de Impacto", "Cintos com Airbag"],
  },
  {
    nome: "Rodas e Pneus",
    img: "/categorias/rodas.jpg",
    itens: ["Jantes Especiais", "Tampões", "Pneus", "Parafusos"],
  },
];

const STATS = [
  { value: "500+", label: "Peças em Stock" },
  { value: "20+", label: "Anos de Experiência" },
  { value: "24-48h", label: "Envio para Portugal" },
];

const RAZOES = [
  {
    num: "01",
    titulo: "Resposta rápida via WhatsApp",
    desc: "Respondemos a todos os pedidos em poucas horas. Sem esperas, sem burocracia.",
  },
  {
    num: "02",
    titulo: "Peças testadas e verificadas",
    desc: "Todas as peças passam por verificação antes de serem comercializadas.",
  },
  {
    num: "03",
    titulo: "Envio para todo o país",
    desc: "Enviamos para qualquer ponto de Portugal continental em 24 a 48 horas úteis.",
  },
];

const HomePage = () => {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/parts`)
      .then(res => setFeaturedParts(res.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "CrashPeças",
    "description": "Peças automóveis novas, usadas e recondicionadas. Venda e importação de viaturas usadas.",
    "url": "https://crashpecas.pt",
    "telephone": "+351212131390",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Marquês de Pombal",
      "addressLocality": "Olhos de Água",
      "postalCode": "2950-693",
      "addressRegion": "Setúbal",
      "addressCountry": "PT",
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:00", "closes": "13:00" },
    ],
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <SEO structuredData={structuredData} />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
            alt="CrashPeças Instalações"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-24">
          <div className="max-w-3xl">
            <span className="inline-block text-red-500 font-bold uppercase tracking-widest text-sm mb-4 border border-red-600/30 px-3 py-1">
              Olhos de Água, Palmela
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none mb-6"
              style={{ fontFamily: "Chivo, sans-serif" }}
            >
              Crash<span className="text-red-600">Peças</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-xl mb-10 leading-relaxed">
              A sua solução em peças automóveis. Importação, exportação e venda de peças novas, usadas e recondicionadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/solicitar">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-10 py-6 rounded-sm text-base shadow-[0_0_30px_rgba(220,38,38,0.35)] hover:shadow-[0_0_45px_rgba(220,38,38,0.55)] transition-all duration-300">
                  Solicitar Peça
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/catalogo">
                <Button variant="outline" className="border-neutral-600 text-white hover:border-white hover:bg-white/5 font-bold uppercase tracking-wider px-10 py-6 rounded-sm text-base transition-all duration-300">
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-[#111111] border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-neutral-800">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-7 px-6 text-center">
                <p className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "Chivo, sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
            {[
              { icon: Wrench, title: "Peças de Qualidade", desc: "Novas, usadas e recondicionadas. Todas testadas." },
              { icon: Truck, title: "Envio Rápido", desc: "Entrega em 24-48h para todo o Portugal continental." },
              { icon: Phone, title: "Suporte Direto", desc: "Atendimento personalizado via WhatsApp e telefone." },
            ].map((f) => (
              <div key={f.title} className="bg-[#0A0A0A] p-8 hover:bg-[#111] transition-colors group">
                <div className="w-10 h-10 border border-red-600/40 flex items-center justify-center mb-5 group-hover:bg-red-600/10 transition-colors">
                  <f.icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "Chivo, sans-serif" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="pb-20 md:pb-28 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-10">
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Navegue por</span>
            <h2
              className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-1"
              style={{ fontFamily: "Chivo, sans-serif" }}
            >
              Categorias
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIAS.map((cat) => (
              <div key={cat.nome} className="flex bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden hover:border-red-600/50 transition-colors">
                <div className="w-1/3 min-h-[200px] flex-shrink-0">
                  <img
                    src={cat.img}
                    alt={cat.nome}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="w-2/3 p-6">
                  <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "Chivo, sans-serif" }}>
                    {cat.nome}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-400 mb-6">
                    {cat.itens.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <Link to="/solicitar">
                    <Button variant="outline" className="border-neutral-600 text-white hover:border-white hover:bg-white/5 rounded-sm text-sm">
                      Saiba Mais <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORQUÊ NÓS ── */}
      <section className="py-20 md:py-28 bg-[#111111] border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Porquê nós</span>
              <h2
                className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-2 mb-10"
                style={{ fontFamily: "Chivo, sans-serif" }}
              >
                A escolha certa para o seu veículo
              </h2>
              <div className="space-y-8">
                {RAZOES.map((r) => (
                  <div key={r.num} className="flex gap-5 group">
                    <span className="text-red-600 font-black text-3xl leading-none flex-shrink-0 w-10" style={{ fontFamily: "Chivo, sans-serif" }}>
                      {r.num}
                    </span>
                    <div className="border-t border-neutral-800 pt-1 flex-1">
                      <h4 className="text-white font-bold mb-1">{r.titulo}</h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-square overflow-hidden rounded-sm">
                <img
                  src="/instalacoes.jpg"
                  alt="Instalações CrashPeças"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-red-600 px-8 py-6">
                <p className="text-white font-black text-5xl leading-none" style={{ fontFamily: "Chivo, sans-serif" }}>20+</p>
                <p className="text-red-200 text-sm mt-1 uppercase tracking-wider">Anos de experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PEÇAS RECENTES ── */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Em Destaque</span>
              <h2
                className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-1"
                style={{ fontFamily: "Chivo, sans-serif" }}
              >
                Peças Recentes
              </h2>
            </div>
            <Link to="/catalogo" className="mt-4 md:mt-0 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-neutral-800 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : featuredParts.length === 0 ? (
            <div className="text-center py-20 border border-neutral-800 rounded-sm">
              <p className="text-neutral-400 mb-1">Nenhuma peça adicionada ainda.</p>
              <p className="text-neutral-600 text-sm">As peças do painel admin aparecem aqui automaticamente.</p>
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

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-[#111111] border-t border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-red-600/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Não encontra?</span>
          <h2
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-2 mb-6"
            style={{ fontFamily: "Chivo, sans-serif" }}
          >
            Nós encontramos a peça por si
          </h2>
          <p className="text-neutral-400 mb-10 leading-relaxed">
            Envie-nos o pedido com os dados do veículo e da peça pretendida. Respondemos via WhatsApp com disponibilidade e preço.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/solicitar">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-12 py-6 rounded-sm text-base shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_45px_rgba(220,38,38,0.5)] transition-all duration-300">
                Solicitar Peça
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contactos">
              <Button variant="outline" className="border-neutral-700 text-white hover:border-white hover:bg-white/5 font-bold uppercase tracking-wider px-12 py-6 rounded-sm text-base transition-all duration-300">
                Contactar
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            {["Resposta rápida", "Sem compromisso", "Envio para todo o país"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-600/60" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
