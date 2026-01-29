import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Por favor preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/contacts`, formData);

      if (response.data.success) {
        toast.success("Mensagem enviada com sucesso!");
        
        // Open WhatsApp
        if (response.data.whatsapp_url) {
          window.open(response.data.whatsapp_url, "_blank");
        }

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Morada",
      content: "Rua Marquês de Pombal, 2950-693 Olhos de Água",
      link: "https://maps.google.com/?q=Rua+Marquês+de+Pombal,+Olhos+de+Água,+Portugal"
    },
    {
      icon: Phone,
      title: "Telefones",
      content: "21 213 1390 | 937 257 079",
      link: "tel:+351937257079"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@crashpecas.pt",
      link: "mailto:info@crashpecas.pt"
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Seg-Sex: 9h-18h | Sáb: 9h-13h",
      link: null
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="contact-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Contactos</span>
          </nav>

          <h1 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Contactos
          </h1>
          <p className="text-neutral-400 mt-2">
            Entre em contacto connosco
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="p-6 bg-[#171717] border border-neutral-800 rounded-sm hover:border-red-600/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a 
                          href={info.link}
                          target={info.link.startsWith('http') ? "_blank" : undefined}
                          rel={info.link.startsWith('http') ? "noopener noreferrer" : undefined}
                          className="text-neutral-400 hover:text-white transition-colors text-sm"
                          data-testid={`contact-${info.title.toLowerCase()}`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <span className="text-neutral-400 text-sm">{info.content}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="bg-[#171717] border border-neutral-800 rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.5!2d-8.8447!3d38.5789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd194e8b8b8b8b8b%3A0x0!2sRua%20Marqu%C3%AAs%20de%20Pombal%2C%20Olhos%20de%20%C3%81gua%2C%20Portugal!5e0!3m2!1spt-PT!2spt"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização CrashPeças"
                data-testid="google-map"
              />
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/351937257079?text=Ol%C3%A1!%20Gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-6 bg-green-600/10 border border-green-600/30 rounded-sm hover:bg-green-600/20 transition-colors"
              data-testid="whatsapp-cta"
            >
              <MessageCircle className="w-6 h-6 text-green-500" />
              <span className="text-green-500 font-bold uppercase tracking-wider">
                Contacte-nos via WhatsApp
              </span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-[#171717] border border-neutral-800 rounded-sm p-6 md:p-8">
            <h2 
              className="text-2xl font-bold text-white uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Envie-nos uma mensagem
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                    Nome *
                  </Label>
                  <Input
                    name="name"
                    placeholder="O seu nome"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                    data-testid="contact-input-name"
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
                    data-testid="contact-input-email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Telefone
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+351 912 345 678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="contact-input-phone"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Assunto *
                </Label>
                <Input
                  name="subject"
                  placeholder="Assunto da mensagem"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm h-12"
                  data-testid="contact-input-subject"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Mensagem *
                </Label>
                <Textarea
                  name="message"
                  placeholder="Escreva a sua mensagem..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-[#0A0A0A] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm min-h-[150px] resize-none"
                  data-testid="contact-input-message"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-6 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 disabled:opacity-50"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  "A enviar..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>

              <p className="text-center text-neutral-500 text-sm">
                Ao enviar, será redirecionado para o WhatsApp para confirmar a sua mensagem.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
