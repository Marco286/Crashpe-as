import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Award, Users, Clock, ChevronRight, ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="about-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Sobre Nós</span>
          </nav>

          <h1 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Sobre Nós
          </h1>
          <p className="text-neutral-400 mt-2">
            Conheça a CrashPeças e a nossa história
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-neutral-800">
              <img
                src="https://customer-assets.emergentagent.com/job_carpartshub-2/artifacts/w9vmtxiy_Padra%CC%83o%20de%20Fundo%20da%20Galeria%20de%20Fotografias%20do%20Windows%20Live.jpg"
                alt="Instalações CrashPeças"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
                Desde Palmela, Portugal
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mt-2 mb-6"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                A sua solução em peças automóveis
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  A <strong className="text-white">CrashPeças</strong> é uma empresa especializada na comercialização de peças automóveis novas e usadas, oferecendo qualidade, confiança e rapidez aos seus clientes.
                </p>
                <p>
                  Localizada em Palmela, servimos clientes em todo o território nacional com um compromisso inabalável com a excelência e satisfação do cliente.
                </p>
                <p>
                  Com uma vasta gama de peças para todas as marcas e modelos, trabalhamos diariamente para encontrar a solução perfeita para cada necessidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 md:py-24 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
              O que nos define
            </span>
            <h2 
              className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mt-2"
              style={{ fontFamily: 'Chivo, sans-serif' }}
            >
              Missão, Visão & Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="p-8 bg-[#0A0A0A] border border-neutral-800 rounded-sm hover:border-red-600/30 transition-colors">
              <div className="w-14 h-14 bg-red-600/10 rounded-sm flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-red-600" />
              </div>
              <h3 
                className="text-xl font-bold text-white uppercase tracking-tight mb-4"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                Missão
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Fornecer peças automóveis de qualidade a preços competitivos, com um serviço personalizado e eficiente que supere as expectativas dos nossos clientes.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 bg-[#0A0A0A] border border-neutral-800 rounded-sm hover:border-red-600/30 transition-colors">
              <div className="w-14 h-14 bg-red-600/10 rounded-sm flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-red-600" />
              </div>
              <h3 
                className="text-xl font-bold text-white uppercase tracking-tight mb-4"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                Visão
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Ser a referência nacional no mercado de peças automóveis, reconhecida pela qualidade, confiança e pela relação próxima com cada cliente.
              </p>
            </div>

            {/* Values */}
            <div className="p-8 bg-[#0A0A0A] border border-neutral-800 rounded-sm hover:border-red-600/30 transition-colors">
              <div className="w-14 h-14 bg-red-600/10 rounded-sm flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <h3 
                className="text-xl font-bold text-white uppercase tracking-tight mb-4"
                style={{ fontFamily: 'Chivo, sans-serif' }}
              >
                Valores
              </h3>
              <ul className="text-neutral-400 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  Qualidade e Confiança
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  Transparência
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  Compromisso com o Cliente
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  Inovação Contínua
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, number: "10+", label: "Anos de Experiência" },
              { icon: Users, number: "5000+", label: "Clientes Satisfeitos" },
              { icon: Clock, number: "24h", label: "Resposta Rápida" },
              { icon: Target, number: "98%", label: "Taxa de Sucesso" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-red-600/10 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-red-600" />
                </div>
                <div 
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                >
                  {stat.number}
                </div>
                <div className="text-neutral-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#171717] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            Precisa de uma peça?
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            Entre em contacto connosco e teremos todo o gosto em ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/solicitar">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider px-10 py-6 rounded-sm shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300"
                data-testid="about-solicitar-btn"
              >
                Solicitar Peça
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contactos">
              <Button 
                variant="outline"
                className="border-neutral-600 text-white hover:border-white hover:bg-white/5 font-bold uppercase tracking-wider px-10 py-6 rounded-sm transition-all duration-300"
                data-testid="about-contactar-btn"
              >
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
