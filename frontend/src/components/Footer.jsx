import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer 
      className="bg-[#0A0A0A] border-t border-neutral-800 pt-16 pb-8"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_carpartshub-2/artifacts/6qoqwf5j_logo%20cras...jpg" 
                alt="CrashPeças Logo"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Importação - Exportação de Carros e Peças Usadas. Qualidade, confiança e rapidez.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/loja", label: "Loja" },
                { href: "/solicitar", label: "Solicitar Peça" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/contactos", label: "Contactos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">
              Categorias
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/loja/motores", label: "Motores" },
                { href: "/loja/portas", label: "Portas" },
                { href: "/loja/transmissoes", label: "Transmissões" },
                { href: "/loja/suspensao", label: "Suspensão" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">
              Contactos
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-400 text-sm">
                  Rua Marquês de Pombal<br />2950-693 Olhos de Água
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <a 
                    href="tel:+351212131390" 
                    className="text-neutral-400 hover:text-white transition-colors block"
                    data-testid="footer-phone-1"
                  >
                    21 213 1390
                  </a>
                  <a 
                    href="tel:+351937257079" 
                    className="text-neutral-400 hover:text-white transition-colors block"
                    data-testid="footer-phone-2"
                  >
                    937 257 079
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                <a 
                  href="mailto:info@crashpecas.pt" 
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                  data-testid="footer-email"
                >
                  info@crashpecas.pt
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-neutral-400 text-sm">
                  <p>Seg-Sex: 9h - 18h</p>
                  <p>Sáb: 9h - 13h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} CrashPeças. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/privacidade" className="text-neutral-500 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-neutral-500 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
