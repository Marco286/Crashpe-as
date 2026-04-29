import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Phone, MessageCircle, Calendar, Gauge, Car, Fuel, Zap, Settings, Palette, DoorOpen } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

const CarroDetalhePage = () => {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagemAtiva, setImagemAtiva] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/cars/${id}`);
        setCarro(res.data);
      } catch {
        setCarro(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-neutral-400">A carregar...</p>
      </div>
    );
  }

  if (!carro) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Viatura não encontrada</h2>
          <Link to="/catalogo">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
              Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fotos = carro.images?.length > 0 ? carro.images : [];
  const carroStructuredData = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${carro.brand} ${carro.model} ${carro.year}`,
    "description": carro.description,
    "brand": { "@type": "Brand", "name": carro.brand },
    "modelDate": carro.year,
    "fuelType": carro.fuel,
    "mileageFromOdometer": carro.mileage ? { "@type": "QuantitativeValue", "value": carro.mileage, "unitCode": "KMT" } : undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": carro.price || undefined,
      "availability": carro.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "CrashPeças" }
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre o ${carro.brand} ${carro.model} (${carro.year})${carro.price ? ` - ${carro.price.toLocaleString('pt-PT')}€` : ""}`
    );
    window.open(`https://wa.me/351937257079?text=${message}`, "_blank");
  };

  const specs = [
    { icon: Calendar, label: "Ano", value: carro.year },
    { icon: Gauge, label: "Quilómetros", value: carro.mileage ? `${carro.mileage.toLocaleString('pt-PT')} km` : "—" },
    { icon: Fuel, label: "Combustível", value: carro.fuel },
    { icon: Settings, label: "Transmissão", value: carro.transmission },
    { icon: Zap, label: "Potência", value: carro.power || "—" },
    { icon: Palette, label: "Cor", value: carro.color || "—" },
    { icon: DoorOpen, label: "Portas", value: carro.doors || "—" },
    { icon: Car, label: "Estado", value: carro.in_stock ? "Disponível" : "Vendido" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]">
      <SEO
        title={`${carro.brand} ${carro.model} ${carro.year}`}
        description={`${carro.brand} ${carro.model} (${carro.year}) — ${carro.fuel}, ${carro.mileage ? `${carro.mileage.toLocaleString('pt-PT')} km` : ""}. ${carro.description.slice(0, 100)}. CrashPeças, Palmela.`}
        image={fotos[0]}
        url={`/catalogo/carro/${carro.id}`}
        type="product"
        structuredData={carroStructuredData}
      />
      {/* Breadcrumb */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{carro.brand} {carro.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Galeria */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-[#171717] rounded-sm overflow-hidden border border-neutral-800 flex items-center justify-center">
              {fotos.length > 0 ? (
                <>
                  <img src={fotos[imagemAtiva]} alt={`${carro.brand} ${carro.model}`}
                    className="w-full h-full object-cover" />
                  {fotos.length > 1 && (
                    <>
                      <button onClick={() => setImagemAtiva(i => (i - 1 + fotos.length) % fotos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button onClick={() => setImagemAtiva(i => (i + 1) % fotos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-[#404040] gap-3">
                  <Car className="w-16 h-16" />
                  <span className="text-sm uppercase tracking-wider">Sem imagem</span>
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                {carro.in_stock ? "Disponível" : "Vendido"}
              </Badge>
            </div>

            {fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {fotos.map((img, i) => (
                  <button key={i} onClick={() => setImagemAtiva(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      imagemAtiva === i ? "border-red-600" : "border-neutral-800 hover:border-neutral-600"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Chivo, sans-serif' }}>
                  {carro.brand} {carro.model}
                </h1>
                <p className="text-neutral-400 mt-1">{carro.year} • {carro.fuel}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-neutral-500">Preço</p>
                <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Chivo, sans-serif' }}>
                  {carro.price ? `${carro.price.toLocaleString('pt-PT')}€` : "Sob consulta"}
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-500 uppercase">{label}</p>
                      <p className="text-white font-medium text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6">
              <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Chivo, sans-serif' }}>
                Descrição
              </h3>
              <p className="text-neutral-400 leading-relaxed">{carro.description}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.href = "tel:+351937257079"}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-6 rounded-sm"
              >
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </Button>
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="flex-1 border-neutral-700 text-white hover:border-green-600 hover:bg-green-600/10 font-bold uppercase tracking-wider py-6 rounded-sm"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarroDetalhePage;
