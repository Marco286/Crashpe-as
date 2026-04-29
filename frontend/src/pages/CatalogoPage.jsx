import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Car, Sparkles, ArrowRight } from "lucide-react";
import axios from "axios";
import SEO from "@/components/SEO";

const API = process.env.REACT_APP_BACKEND_URL;

const CATEGORY_LABELS = {
  motores: "Motores", portas: "Portas", volantes: "Volantes",
  transmissoes: "Transmissões", "pecas-eletricas": "Peças Elétricas",
  suspensao: "Suspensão", outros: "Outros",
};

const CatalogoPage = () => {
  const [activeTab, setActiveTab] = useState("pecas");
  const [parts, setParts] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [partsRes, carsRes] = await Promise.all([
          axios.get(`${API}/api/parts`),
          axios.get(`${API}/api/cars`),
        ]);
        setParts(partsRes.data);
        setCars(carsRes.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="catalogo-page">
      <SEO
        title="Catálogo — Peças e Viaturas"
        description="Catálogo de peças automóveis novas, usadas e recondicionadas. Viaturas usadas disponíveis para venda. CrashPeças, Olhos de Água, Palmela."
        url="/catalogo"
      />
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Catálogo</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
            Catálogo
          </h1>
          <p className="text-neutral-400 mt-2">Novidades em peças e viaturas disponíveis</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("pecas")}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-all ${
              activeTab === "pecas"
                ? "bg-red-600 text-white"
                : "bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Novidades de Peças
            {parts.length > 0 && <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">{parts.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("carros")}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-all ${
              activeTab === "carros"
                ? "bg-red-600 text-white"
                : "bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Car className="w-5 h-5" />
            Viaturas à Venda
            {cars.length > 0 && <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">{cars.length}</span>}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[#262626]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#262626] rounded w-1/3" />
                  <div className="h-5 bg-[#262626] rounded w-3/4" />
                  <div className="h-3 bg-[#262626] rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Novidades de Peças */}
            {activeTab === "pecas" && (
              <div className="space-y-8">
                {parts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-neutral-400 text-lg mb-2">Nenhuma peça disponível no momento.</p>
                    <p className="text-neutral-600 text-sm">Volte em breve ou solicite a peça que precisa.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {parts.map((peca) => (
                      <Link
                        key={peca.id}
                        to={`/produto/${peca.id}`}
                        className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden hover:border-red-600/50 transition-colors group"
                      >
                        <div className="aspect-[4/3] overflow-hidden relative bg-[#0A0A0A] flex items-center justify-center">
                          {peca.image_url ? (
                            <img
                              src={peca.image_url}
                              alt={peca.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-[#404040] gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3 bg-[#DC2626] text-white border-0 text-xs">
                            Novo
                          </Badge>
                        </div>
                        <div className="p-5">
                          <span className="text-xs text-neutral-500 uppercase tracking-wider">
                            {CATEGORY_LABELS[peca.category] || peca.category}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1 mb-2 line-clamp-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
                            {peca.name}
                          </h3>
                          <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{peca.description}</p>
                          <div className="flex items-center justify-between">
                            {peca.price ? (
                              <span className="text-white font-bold">{peca.price.toLocaleString('pt-PT')}€</span>
                            ) : (
                              <span className="text-neutral-500 text-sm">Sob consulta</span>
                            )}
                            <Button variant="outline" size="sm"
                              className="border-neutral-700 text-white hover:border-red-600 hover:bg-red-600/10 rounded-sm text-xs">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="text-center py-8">
                  <p className="text-neutral-400 mb-4">Procura uma peça específica?</p>
                  <Link to="/solicitar">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm">
                      Solicitar Peça
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Viaturas à Venda */}
            {activeTab === "carros" && (
              <div className="space-y-8">
                {cars.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-neutral-400 text-lg mb-2">Nenhuma viatura disponível no momento.</p>
                    <p className="text-neutral-600 text-sm">Contacte-nos para mais informações.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((carro) => (
                      <Link
                        key={carro.id}
                        to={`/catalogo/carro/${carro.id}`}
                        className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden hover:border-red-600/50 transition-colors group"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
                          {(carro.images?.[0] || carro.image_base64) ? (
                            <img
                              src={carro.images?.[0] || carro.image_base64}
                              alt={`${carro.brand} ${carro.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-[#404040] gap-2">
                              <Car className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mb-3">
                            {carro.in_stock ? "Disponível" : "Vendido"}
                          </Badge>
                          <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Chivo, sans-serif' }}>
                            {carro.brand} {carro.model}
                          </h3>
                          <p className="text-neutral-500 text-sm mb-2">
                            {carro.year} • {carro.fuel} • {carro.mileage ? `${carro.mileage.toLocaleString('pt-PT')} km` : ""}
                          </p>
                          <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{carro.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold">
                              {carro.price ? `${carro.price.toLocaleString('pt-PT')}€` : "Sob consulta"}
                            </span>
                            <Button variant="outline"
                              className="border-neutral-700 text-white hover:border-red-600 hover:bg-red-600/10 rounded-sm text-sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="text-center py-8">
                  <p className="text-neutral-400 mb-4">Não encontra o que procura?</p>
                  <Link to="/contactos">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm">
                      Contactar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogoPage;
