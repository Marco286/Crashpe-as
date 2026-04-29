import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

const TermosPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]">
      <SEO
        title="Termos de Uso"
        description="Termos e condições de utilização do site CrashPeças."
        url="/termos"
      />

      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Termos de Uso</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
            Termos de Uso
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">Última atualização: abril de 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10 text-neutral-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Identificação</h2>
          <p>
            Este site é operado pela <strong className="text-white">CrashPeças</strong>, com sede em Rua Marquês de Pombal, 2950-693 Olhos de Água, Palmela, Portugal.<br />
            Contacto: <a href="tel:+351937257079" className="text-red-500 hover:text-red-400">937 257 079</a> | <a href="mailto:info@crashpecas.pt" className="text-red-500 hover:text-red-400">info@crashpecas.pt</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Aceitação dos Termos</h2>
          <p>Ao aceder e utilizar este site, o utilizador aceita os presentes Termos de Uso na íntegra. Caso não concorde com alguma condição, deverá abster-se de utilizar o site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Utilização do Site</h2>
          <p>O site destina-se exclusivamente a fins informativos e comerciais legítimos. É proibido:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li>Utilizar o site para fins ilegais ou fraudulentos</li>
            <li>Submeter informações falsas nos formulários</li>
            <li>Tentar aceder a áreas restritas do site sem autorização</li>
            <li>Reproduzir ou copiar conteúdos sem autorização prévia</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Informações sobre Produtos</h2>
          <p>A CrashPeças esforça-se por apresentar informações precisas sobre as peças e viaturas disponíveis. No entanto:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li>Os preços indicados podem ser alterados sem aviso prévio</li>
            <li>A disponibilidade de stock pode variar</li>
            <li>As fotografias são meramente ilustrativas</li>
            <li>A confirmação final de preço e disponibilidade é feita por contacto direto</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Processo de Compra</h2>
          <p>A submissão de um formulário de pedido ou contacto através deste site <strong className="text-white">não constitui um contrato de compra e venda</strong>. Toda a transação é formalizada diretamente entre o cliente e a CrashPeças, após confirmação de preço, disponibilidade e condições de entrega.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Garantias</h2>
          <p>As peças vendidas pela CrashPeças estão sujeitas às seguintes condições de garantia:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li><strong className="text-white">Peças Novas:</strong> garantia do fabricante</li>
            <li><strong className="text-white">Peças Usadas:</strong> garantia de 3 meses, salvo acordo em contrário</li>
            <li><strong className="text-white">Peças Recondicionadas:</strong> garantia de 6 meses</li>
          </ul>
          <p className="mt-3">A garantia cobre defeitos de funcionamento e não inclui danos causados por má utilização, montagem incorreta ou acidentes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Responsabilidade</h2>
          <p>A CrashPeças não se responsabiliza por danos resultantes de:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li>Utilização incorreta das peças adquiridas</li>
            <li>Montagem por técnico não qualificado</li>
            <li>Interrupções ou erros temporários no funcionamento do site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Propriedade Intelectual</h2>
          <p>Todo o conteúdo deste site (textos, imagens, logótipo, design) é propriedade da CrashPeças e está protegido por direitos de autor. A reprodução sem autorização expressa é proibida.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">9. Privacidade</h2>
          <p>O tratamento dos dados pessoais é efetuado de acordo com a nossa <Link to="/privacidade" className="text-red-500 hover:text-red-400">Política de Privacidade</Link>, em conformidade com o RGPD.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">10. Lei Aplicável</h2>
          <p>Os presentes Termos de Uso são regidos pela legislação portuguesa. Em caso de litígio, as partes submetem-se à jurisdição dos tribunais da comarca de Setúbal.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">11. Alterações</h2>
          <p>A CrashPeças reserva-se o direito de atualizar estes Termos de Uso a qualquer momento. As alterações entram em vigor no momento da sua publicação no site.</p>
        </section>

      </div>
    </div>
  );
};

export default TermosPage;
