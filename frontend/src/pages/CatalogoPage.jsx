import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Car, Sparkles, ArrowRight } from "lucide-react";

const CatalogoPage = () => {
  const [activeTab, setActiveTab] = useState("carros");

  // Carros à venda
  const carrosVenda = [
    {
      id: 1,
      titulo: "BMW Série 3 E90 - Para Peças",
      ano: "2008",
      descricao: "Viatura completa para aproveitamento de peças. Motor 2.0D em bom estado.",
      preco: "Sob consulta",
      imagem: "https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=srgb&fm=jpg&w=800",
      estado: "Para Peças"
    },
    {
      id: 2,
      titulo: "VW Golf VII - Para Peças",
      ano: "2015",
      descricao: "Golf 1.6 TDI para aproveitamento. Interior em excelente estado.",
      preco: "Sob consulta",
      imagem: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=800",
      estado: "Para Peças"
    },
    {
      id: 3,
      titulo: "Mercedes C200 W204 - Para Peças",
      ano: "2012",
      descricao: "Mercedes Classe C para aproveitamento. Caixa automática disponível.",
      preco: "Sob consulta",
      imagem: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=srgb&fm=jpg&w=800",
      estado: "Para Peças"
    }
  ];

  // Novidades de peças
  const novidadesPecas = [
    {
      id: 1,
      titulo: "Motor 2.0 TDI VAG",
      categoria: "Motores",
      descricao: "Motor completo acabado de chegar. Baixa quilometragem.",
      preco: "2.800€",
      imagem: "https://images.unsplash.com/photo-1655103955791-aae53be125c6?crop=entropy&cs=srgb&fm=jpg&w=800",
      novo: true
    },
    {
      id: 2,
      titulo: "Caixa de Velocidades DSG",
      categoria: "Transmissões",
      descricao: "Caixa DSG 7 velocidades. Testada e garantida.",
      preco: "1.200€",
      imagem: "https://images.unsplash.com/photo-1633281256183-c0f106f70d76?crop=entropy&cs=srgb&fm=jpg&w=800",
      novo: true
    },
    {
      id: 3,
      titulo: "Kit Faróis LED BMW F30",
      categoria: "Iluminação",
      descricao: "Par de faróis full LED originais. Como novos.",
      preco: "950€",
      imagem: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?crop=entropy&cs=srgb&fm=jpg&w=800",
      novo: true
    },
    {
      id: 4,
      titulo: "Jantes 19'' AMG",
      categoria: "Rodas e Pneus",
      descricao: "Conjunto de 4 jantes AMG originais com pneus.",
      preco: "1.500€",
      imagem: "https://images.unsplash.com/photo-1611826249213-35c55d2c2a81?crop=entropy&cs=srgb&fm=jpg&w=800",
      novo: true
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="catalogo-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Catálogo</span>
          </nav>

          <h1 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Catálogo
          </h1>
          <p className="text-neutral-400 mt-2">
            Carros para peças e novidades em stock
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("carros")}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-all ${
              activeTab === "carros"
                ? "bg-red-600 text-white"
                : "bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
            data-testid="tab-carros"
          >
            <Car className="w-5 h-5" />
            Carros à Venda
          </button>
          <button
            onClick={() => setActiveTab("novidades")}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-all ${
              activeTab === "novidades"
                ? "bg-red-600 text-white"
                : "bg-[#171717] text-neutral-400 hover:text-white border border-neutral-800"
            }`}
            data-testid="tab-novidades"
          >
            <Sparkles className="w-5 h-5" />
            Novidades de Peças
          </button>
        </div>

        {/* Carros à Venda */}
        {activeTab === "carros" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carrosVenda.map((carro) => (
                <div 
                  key={carro.id}
                  className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden hover:border-red-600/50 transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={carro.imagem} 
                      alt={carro.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30 mb-3">
                      {carro.estado}
                    </Badge>
                    <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Chivo, sans-serif' }}>
                      {carro.titulo}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-2">Ano: {carro.ano}</p>
                    <p className="text-neutral-400 text-sm mb-4">{carro.descricao}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{carro.preco}</span>
                      <Link to="/contactos">
                        <Button 
                          variant="outline" 
                          className="border-neutral-700 text-white hover:border-red-600 hover:bg-red-600/10 rounded-sm text-sm"
                        >
                          Contactar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center py-8">
              <p className="text-neutral-400 mb-4">Não encontra o que procura?</p>
              <Link to="/solicitar">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm">
                  Solicitar Peça Específica
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Novidades de Peças */}
        {activeTab === "novidades" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {novidadesPecas.map((peca) => (
                <div 
                  key={peca.id}
                  className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden hover:border-red-600/50 transition-colors"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={peca.imagem} 
                      alt={peca.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {peca.novo && (
                      <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                        Novo
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{peca.categoria}</span>
                    <h3 className="text-base font-bold text-white mt-1 mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
                      {peca.titulo}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{peca.descricao}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{peca.preco}</span>
                      <Link to="/contactos">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-neutral-700 text-white hover:border-red-600 hover:bg-red-600/10 rounded-sm text-xs"
                        >
                          Info
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
      </div>
    </div>
  );
};

export default CatalogoPage;
