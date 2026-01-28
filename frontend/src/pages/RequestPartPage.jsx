import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, Upload, X, Check, Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RequestPartPage = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    car_brand: "",
    car_model: "",
    car_year: "",
    engine_type: "",
    part_type: "",
    part_condition: "Indiferente",
    additional_description: "",
    image_base64: null
  });

  const carBrands = [
    "Audi", "BMW", "Citroën", "Fiat", "Ford", "Honda", "Hyundai", "Kia",
    "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", "Seat",
    "Skoda", "Toyota", "Volkswagen", "Volvo", "Outra"
  ];

  const partTypes = [
    "Motor", "Caixa de Velocidades", "Porta", "Volante", "Suspensão",
    "Sistema Elétrico", "Faróis", "Espelhos", "Para-choques", "Capô",
    "Tejadilho", "Interior", "Travões", "Radiador", "Escape", "Outra"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter menos de 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData(prev => ({ ...prev, image_base64: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_base64: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name || !formData.email || !formData.phone ||
        !formData.car_brand || !formData.car_model || !formData.car_year ||
        !formData.part_type) {
      toast.error("Por favor preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/part-requests`, formData);
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success("Pedido enviado com sucesso!");
        
        // Open WhatsApp
        if (response.data.whatsapp_url) {
          window.open(response.data.whatsapp_url, "_blank");
        }
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="request-success">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-4"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Pedido Enviado!
          </h1>
          <p className="text-neutral-400 text-lg mb-8">
            Entraremos em contacto o mais breve possível. <br />
            Obrigado pela sua preferência!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button 
                variant="outline"
                className="border-neutral-700 text-white hover:border-white rounded-sm px-8 py-4"
              >
                Voltar ao Início
              </Button>
            </Link>
            <Link to="/loja">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm"
              >
                Ver Loja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="request-part-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Solicitar Peça</span>
          </nav>

          <h1 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Solicitar Peça
          </h1>
          <p className="text-neutral-400 mt-2">
            Preencha o formulário abaixo para solicitar uma peça específica
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info Section */}
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6 md:p-8">
            <h2 
              className="text-xl font-bold text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Dados Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Nome Completo *
                </Label>
                <Input
                  name="full_name"
                  placeholder="O seu nome completo"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-full-name"
                  required
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Email *
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-email"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Telefone *
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+351 912 345 678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-phone"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Info Section */}
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6 md:p-8">
            <h2 
              className="text-xl font-bold text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Dados do Veículo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Marca *
                </Label>
                <Select 
                  value={formData.car_brand} 
                  onValueChange={(value) => handleSelectChange("car_brand", value)}
                >
                  <SelectTrigger 
                    className="bg-[#0A0A0A] border-neutral-800 text-white h-12 rounded-sm"
                    data-testid="select-car-brand"
                  >
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171717] border-neutral-800">
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Modelo *
                </Label>
                <Input
                  name="car_model"
                  placeholder="Ex: Golf, Série 3, Mégane..."
                  value={formData.car_model}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-car-model"
                  required
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Ano *
                </Label>
                <Input
                  name="car_year"
                  placeholder="Ex: 2018"
                  value={formData.car_year}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-car-year"
                  required
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Motorização
                </Label>
                <Input
                  name="engine_type"
                  placeholder="Ex: 1.6 TDI, 2.0 TSI..."
                  value={formData.engine_type}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="input-engine-type"
                />
              </div>
            </div>
          </div>

          {/* Part Info Section */}
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6 md:p-8">
            <h2 
              className="text-xl font-bold text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Peça Pretendida
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Tipo de Peça *
                </Label>
                <Select 
                  value={formData.part_type} 
                  onValueChange={(value) => handleSelectChange("part_type", value)}
                >
                  <SelectTrigger 
                    className="bg-[#0A0A0A] border-neutral-800 text-white h-12 rounded-sm"
                    data-testid="select-part-type"
                  >
                    <SelectValue placeholder="Selecione o tipo de peça" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171717] border-neutral-800">
                    {partTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-3 block">
                  Estado da Peça *
                </Label>
                <RadioGroup 
                  value={formData.part_condition}
                  onValueChange={(value) => handleSelectChange("part_condition", value)}
                  className="flex flex-wrap gap-4"
                  data-testid="radio-part-condition"
                >
                  {["Nova", "Usada", "Indiferente"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={condition} 
                        id={condition}
                        className="border-neutral-600 text-red-600"
                      />
                      <Label 
                        htmlFor={condition} 
                        className="text-neutral-300 cursor-pointer"
                      >
                        {condition}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Descrição Adicional
                </Label>
                <Textarea
                  name="additional_description"
                  placeholder="Descreva com mais detalhe a peça que procura, referências, números de série, etc..."
                  value={formData.additional_description}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm min-h-[120px] resize-none"
                  data-testid="textarea-description"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Imagem (opcional)
                </Label>
                
                {imagePreview ? (
                  <div className="relative w-48 h-48 bg-[#0A0A0A] rounded-sm overflow-hidden border border-neutral-800">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      data-testid="remove-image-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-neutral-700 rounded-sm cursor-pointer hover:border-neutral-600 transition-colors text-center"
                    data-testid="upload-area"
                  >
                    <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                    <p className="text-neutral-400 text-sm">
                      Clique para carregar uma imagem
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="file-input"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-6 rounded-sm shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300 disabled:opacity-50"
            data-testid="submit-request-btn"
          >
            {loading ? (
              "A enviar..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Pedido
              </>
            )}
          </Button>

          <p className="text-center text-neutral-500 text-sm">
            Ao enviar, será redirecionado para o WhatsApp para confirmar o seu pedido.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RequestPartPage;
