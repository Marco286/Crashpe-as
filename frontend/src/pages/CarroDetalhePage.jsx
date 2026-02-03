import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Phone, MessageCircle, Calendar, Gauge, Users, Car, Fuel, Zap, Settings, Palette, DoorOpen, Star, Shield, Share2, FileText } from "lucide-react";

// Dados dos carros (em produção viria da API)
const carrosData = {
  1: {
    id: 1,
    marca: "BMW",
    modelo: "Série 3 E90",
    versao: "320d Executive",
    ano: "2008",
    preco: "8.500",
    descricao: "Viatura em excelente estado geral. Motor 2.0D muito económico e fiável. Interior bem conservado, sem desgaste excessivo. Manutenção sempre feita na marca.",
    imagens: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=srgb&fm=jpg&w=800"
    ],
    specs: {
      registo: "Mar. 2008",
      quilometros: "215.000",
      lugares: "5",
      segmento: "Berlina",
      combustivel: "Gasóleo",
      potencia: "177 Cv",
      cilindrada: "1995 Cc",
      transmissao: "Manual 6 velocidades",
      cor: "Preto",
      portas: "4",
      estado: "Usado",
      garantia: "3 meses"
    }
  },
  2: {
    id: 2,
    marca: "Volkswagen",
    modelo: "Golf VII",
    versao: "1.6 TDI Confortline",
    ano: "2015",
    preco: "12.900",
    descricao: "Golf 1.6 TDI muito bem estimado. Interior em excelente estado. Carro de proprietário único, sempre com revisões em dia. Equipamento completo.",
    imagens: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=800"
    ],
    specs: {
      registo: "Jun. 2015",
      quilometros: "142.000",
      lugares: "5",
      segmento: "Compacto",
      combustivel: "Gasóleo",
      potencia: "110 Cv",
      cilindrada: "1598 Cc",
      transmissao: "Manual 5 velocidades",
      cor: "Cinzento",
      portas: "5",
      estado: "Usado",
      garantia: "3 meses"
    }
  },
  3: {
    id: 3,
    marca: "Mercedes-Benz",
    modelo: "Classe C W204",
    versao: "C200 CDI Avantgarde",
    ano: "2012",
    preco: "14.500",
    descricao: "Mercedes Classe C com caixa automática. Interior em pele, muito bem conservado. Equipamento de topo incluindo navegação, sensores de estacionamento e câmara traseira.",
    imagens: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?crop=entropy&cs=srgb&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=srgb&fm=jpg&w=800"
    ],
    specs: {
      registo: "Set. 2012",
      quilometros: "178.000",
      lugares: "5",
      segmento: "Berlina",
      combustivel: "Gasóleo",
      potencia: "136 Cv",
      cilindrada: "2143 Cc",
      transmissao: "Automática 7 velocidades",
      cor: "Branco",
      portas: "4",
      estado: "Usado",
      garantia: "6 meses"
    }
  }
};

const CarroDetalhePage = () => {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);

  useEffect(() => {
    const carroData = carrosData[id];
    if (carroData) {
      setCarro(carroData);
    }
  }, [id]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de obter mais informações sobre o ${carro.marca} ${carro.modelo} (${carro.ano}) - ${carro.preco}€`
    );
    window.open(`https://wa.me/351937257079?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:+351937257079";
  };

  const nextImage = () => {
    setImagemAtiva((prev) => (prev + 1) % carro.imagens.length);
  };

  const prevImage = () => {
    setImagemAtiva((prev) => (prev - 1 + carro.imagens.length) % carro.imagens.length);
  };

  if (!carro) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Carro não encontrado</h2>
          <Link to="/catalogo">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
              Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const specsIcons = {
    registo: Calendar,
    quilometros: Gauge,
    lugares: Users,
    segmento: Car,
    combustivel: Fuel,
    potencia: Zap,
    cilindrada: Settings,
    transmissao: Settings,
    cor: Palette,
    portas: DoorOpen,
    estado: Star,
    garantia: Shield
  };

  const specsLabels = {
    registo: "Registo",
    quilometros: "Quilómetros",
    lugares: "Lugares",
    segmento: "Segmento",
    combustivel: "Combustível",
    potencia: "Potência",
    cilindrada: "Cilindrada",
    transmissao: "Transmissão",
    cor: "Cor",
    portas: "Portas",
    estado: "Estado",
    garantia: "Garantia"
  };

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="carro-detalhe-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{carro.marca} {carro.modelo}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative aspect-[4/3] bg-[#171717] rounded-sm overflow-hidden border border-neutral-800">
              <img
                src={carro.imagens[imagemAtiva]}
                alt={`${carro.marca} ${carro.modelo}`}
                className="w-full h-full object-cover"
              />
              
              {/* Badge */}
              <Badge className="absolute top-4 left-4 bg-green-600 text-white text-sm px-3 py-1">
                DISPONÍVEL
              </Badge>

              {/* Navegação */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {carro.imagens.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtiva(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                    imagemAtiva === index ? "border-red-600" : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <p className="text-neutral-500 text-sm">{carro.imagens.length} Fotos</p>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            {/* Título e Preço */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                >
                  {carro.marca}
                </h1>
                <p className="text-xl text-neutral-300 mt-1">
                  {carro.modelo} {carro.versao}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Preço</p>
                <p className="text-4xl font-bold text-red-600" style={{ fontFamily: 'Chivo, sans-serif' }}>
                  {carro.preco}€
                </p>
              </div>
            </div>

            {/* Especificações Grid */}
            <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(carro.specs).map(([key, value]) => {
                  const Icon = specsIcons[key] || Settings;
                  return (
                    <div key={key} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">{specsLabels[key]}</p>
                        <p className="text-white font-medium text-sm">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6">
              <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Chivo, sans-serif' }}>
                Descrição
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                {carro.descricao}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCall}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-6 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all"
                data-testid="ligar-btn"
              >
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </Button>
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="flex-1 border-neutral-700 text-white hover:border-green-600 hover:bg-green-600/10 font-bold uppercase tracking-wider py-6 rounded-sm transition-all"
                data-testid="whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Pedir Informações
              </Button>
            </div>

            {/* Ações Secundárias */}
            <div className="flex gap-4 pt-2">
              <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
                <FileText className="w-4 h-4" />
                Criar PDF
              </button>
              <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
                <Share2 className="w-4 h-4" />
                Partilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarroDetalhePage;
