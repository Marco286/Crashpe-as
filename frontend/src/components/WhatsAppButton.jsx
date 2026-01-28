import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = "351912345678";
  const message = encodeURIComponent("Olá! Gostaria de obter mais informações sobre peças automóveis.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
      data-testid="whatsapp-float-btn"
      aria-label="Contactar via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
