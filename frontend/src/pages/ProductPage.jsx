import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, MessageCircle, Phone, Check, ArrowLeft, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/parts/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getConditionBadge = (condition) => {
    switch (condition) {
      case "Nova":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "Usada":
        return "bg-amber-600/20 text-amber-400 border-amber-600/30";
      case "Recondicionada":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-600/30";
    }
  };

  const handleRequestInfo = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Por favor preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post(`${API}/parts/${id}/request-info`, null, {
        params: {
          name: formData.name,
          phone: formData.phone
        }
      });

      if (response.data.whatsapp_url) {
        window.open(response.data.whatsapp_url, "_blank");
        setDialogOpen(false);
        toast.success("A redirecionar para WhatsApp...");
      }
    } catch (error) {
      console.error("Error requesting info:", error);
      toast.error("Erro ao processar pedido");
    }
  };

  const handleDirectWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de obter mais informações sobre a peça:\n\n*${product.name}*\nPreço: ${product.price ? `${product.price}€` : "Sob consulta"}\nEstado: ${product.condition}`
    );
    window.open(`https://wa.me/351912345678?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-neutral-800 animate-pulse rounded-sm" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-800 animate-pulse rounded-sm w-1/3" />
              <div className="h-12 bg-neutral-800 animate-pulse rounded-sm w-2/3" />
              <div className="h-24 bg-neutral-800 animate-pulse rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h2>
          <Link to="/loja">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
              Voltar à Loja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url || undefined,
    "brand": { "@type": "Brand", "name": "CrashPeças" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": product.price || undefined,
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "CrashPeças" }
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="product-page">
      <SEO
        title={product.name}
        description={`${product.name} — ${product.condition}. ${product.description.slice(0, 120)}. CrashPeças, Palmela.`}
        image={product.image_url}
        url={`/produto/${product.id}`}
        type="product"
        structuredData={productStructuredData}
      />
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/loja" className="hover:text-white transition-colors">Loja</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/loja/${product.category}`} className="hover:text-white transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <Link 
          to="/loja" 
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          data-testid="back-to-shop-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Loja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-[#171717] rounded-sm overflow-hidden border border-neutral-800 flex items-center justify-center">
              {(() => {
                const photos = product.images?.length > 0 ? product.images : product.image_url ? [product.image_url] : [];
                return photos.length > 0 ? (
                  <>
                    <img
                      src={photos[activePhoto]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setActivePhoto(i => (i - 1 + photos.length) % photos.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActivePhoto(i => (i + 1) % photos.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {photos.map((_, i) => (
                            <button key={i} onClick={() => setActivePhoto(i)}
                              className={`w-2 h-2 rounded-full transition-colors ${i === activePhoto ? "bg-white" : "bg-white/40"}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#404040] gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    <span className="text-sm uppercase tracking-wider">Sem imagem</span>
                  </div>
                );
              })()}
              <div className="absolute top-4 left-4">
                <Badge className={`${getConditionBadge(product.condition)} border text-sm font-bold uppercase tracking-wider px-4 py-2`}>
                  {product.condition}
                </Badge>
              </div>
            </div>
            {/* Thumbnails */}
            {(product.images?.length > 1) && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-colors ${i === activePhoto ? "border-[#DC2626]" : "border-[#262626] hover:border-[#404040]"}`}>
                    <img src={img} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
              {product.category}
            </span>

            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="product-title"
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {product.price ? (
                <span className="text-4xl font-bold text-white" data-testid="product-price">
                  {product.price.toLocaleString('pt-PT')}€
                </span>
              ) : (
                <span className="text-xl text-neutral-400">Preço sob consulta</span>
              )}
              {product.in_stock ? (
                <span className="flex items-center gap-1 text-green-500 text-sm">
                  <Check className="w-4 h-4" />
                  Em stock
                </span>
              ) : (
                <span className="text-amber-500 text-sm">Indisponível</span>
              )}
            </div>

            {/* Description */}
            <div className="py-6 border-t border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Descrição
              </h3>
              <p className="text-neutral-400 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Compatibility */}
            <div>
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Compatibilidade
              </h3>
              <p className="text-white" data-testid="product-compatibility">
                {product.compatibility}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-6 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300"
                    data-testid="request-info-btn"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Pedir Informações
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#171717] border-neutral-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Chivo, sans-serif' }}>
                      Pedir Informações
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-300 mb-2 block">
                        Nome *
                      </label>
                      <Input
                        placeholder="O seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm"
                        data-testid="request-name-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-300 mb-2 block">
                        Telefone *
                      </label>
                      <Input
                        placeholder="O seu telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm"
                        data-testid="request-phone-input"
                      />
                    </div>
                    <Button
                      onClick={handleRequestInfo}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-4 rounded-sm"
                      data-testid="submit-request-btn"
                    >
                      Enviar via WhatsApp
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline"
                onClick={handleDirectWhatsApp}
                className="flex-1 border-green-600 text-green-500 hover:bg-green-600/10 font-bold uppercase tracking-wider py-6 rounded-sm transition-all duration-300"
                data-testid="whatsapp-direct-btn"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Direto
              </Button>
            </div>

            {/* Info Note */}
            <p className="text-sm text-neutral-500 text-center pt-4">
              Ao clicar, será redirecionado para o WhatsApp para contacto direto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
