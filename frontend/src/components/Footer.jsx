import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-neutral-800" data-testid="footer">
      {/* Red accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src="https://customer-assets.emergentagent.com/job_carpartshub-2/artifacts/dapp11bf_Captura%20de%20ecra%CC%83%202026-01-30%2C%20a%CC%80s%2017.55.26.png"
                alt="CrashPeças Logo"
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              Importação e exportação de carros e peças usadas. Qualidade, confiança e rapidez em Olhos de Água, Palmela.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/solicitar", label: "Solicitar Peça" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/contactos", label: "Contactos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral-500 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">
              Categorias
            </h4>
            <ul className="space-y-3">
              {["Carroçaria", "Mecânica", "Sistema Elétrico", "Iluminação", "Airbags", "Rodas e Pneus"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/solicitar"
                    className="text-neutral-500 hover:text-white transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">
              Contactos
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-500 text-sm leading-relaxed">
                  Rua Marquês de Pombal<br />2950-693 Olhos de Água, Palmela
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <a href="tel:+351212131390" className="block text-neutral-500 hover:text-white transition-colors" data-testid="footer-phone-1">
                    21 213 1390
                  </a>
                  <a href="tel:+351937257079" className="block text-neutral-500 hover:text-white transition-colors" data-testid="footer-phone-2">
                    937 257 079
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <a href="mailto:info@crashpecas.pt" className="text-neutral-500 hover:text-white transition-colors text-sm" data-testid="footer-email">
                  info@crashpecas.pt
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-neutral-500 text-sm space-y-0.5">
                  <p>Seg — Sex: 9h00 – 18h00</p>
                  <p>Sábado: 9h00 – 13h00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-neutral-600 text-xs">
            © {new Date().getFullYear()} CrashPeças. Todos os direitos reservados.
          </p>
          <div className="flex gap-5">
            <Link to="/privacidade" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
