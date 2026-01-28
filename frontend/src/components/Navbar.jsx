import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/solicitar", label: "Solicitar Peça" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/contactos", label: "Contactos" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-neutral-800"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group"
            data-testid="logo-link"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_carpartshub-2/artifacts/6qoqwf5j_logo%20cras...jpg" 
              alt="CrashPeças Logo"
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link to="/solicitar">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-6 py-2 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300"
                data-testid="cta-solicitar-btn"
              >
                Solicitar Peça
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden py-6 border-t border-neutral-800 animate-fade-in"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-bold uppercase tracking-wider py-2 transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-neutral-400"
                  }`}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/solicitar" onClick={() => setIsOpen(false)}>
                <Button 
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-4 rounded-sm"
                  data-testid="mobile-cta-btn"
                >
                  Solicitar Peça
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
