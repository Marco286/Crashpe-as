import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

const PrivacidadePage = () => {
  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]">
      <SEO
        title="Política de Privacidade"
        description="Política de privacidade e proteção de dados da CrashPeças, de acordo com o RGPD."
        url="/privacidade"
      />

      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Política de Privacidade</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
            Política de Privacidade
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">Última atualização: abril de 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10 text-neutral-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Responsável pelo Tratamento de Dados</h2>
          <p>
            <strong className="text-white">CrashPeças</strong><br />
            Rua Marquês de Pombal, 2950-693 Olhos de Água, Palmela<br />
            Telefone: <a href="tel:+351937257079" className="text-red-500 hover:text-red-400">937 257 079</a><br />
            Email: <a href="mailto:info@crashpecas.pt" className="text-red-500 hover:text-red-400">info@crashpecas.pt</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Dados Recolhidos</h2>
          <p>Recolhemos os seguintes dados pessoais quando preenche os nossos formulários:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Número de telefone</li>
            <li>Informações sobre o veículo (marca, modelo, ano)</li>
            <li>Descrição da peça pretendida</li>
            <li>Imagens anexadas voluntariamente</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Finalidade do Tratamento</h2>
          <p>Os dados recolhidos são utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li>Responder a pedidos de informação e contacto</li>
            <li>Localizar e orçamentar peças automóveis solicitadas</li>
            <li>Comunicar com o cliente sobre a sua encomenda</li>
          </ul>
          <p className="mt-3">Os seus dados <strong className="text-white">não são partilhados com terceiros</strong> nem utilizados para fins comerciais ou de marketing.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Base Legal</h2>
          <p>O tratamento dos seus dados baseia-se no <strong className="text-white">consentimento explícito</strong> que nos fornece ao submeter o formulário, nos termos do Artigo 6.º, n.º 1, alínea a) do RGPD (Regulamento Geral sobre a Proteção de Dados — UE 2016/679).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Prazo de Conservação</h2>
          <p>Os dados são conservados pelo período necessário para responder ao seu pedido e, no máximo, por <strong className="text-white">12 meses</strong> após o último contacto. Após esse prazo, os dados são eliminados.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Os Seus Direitos</h2>
          <p>Ao abrigo do RGPD, tem direito a:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-400">
            <li><strong className="text-white">Acesso</strong> — saber que dados temos sobre si</li>
            <li><strong className="text-white">Retificação</strong> — corrigir dados incorretos</li>
            <li><strong className="text-white">Apagamento</strong> — solicitar a eliminação dos seus dados</li>
            <li><strong className="text-white">Oposição</strong> — opor-se ao tratamento dos dados</li>
            <li><strong className="text-white">Portabilidade</strong> — receber os seus dados em formato legível</li>
          </ul>
          <p className="mt-3">Para exercer qualquer um destes direitos, contacte-nos por email: <a href="mailto:info@crashpecas.pt" className="text-red-500 hover:text-red-400">info@crashpecas.pt</a></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Segurança</h2>
          <p>Adotamos medidas técnicas adequadas para proteger os seus dados contra acesso não autorizado, alteração ou divulgação, incluindo comunicações cifradas (HTTPS) e acesso restrito à base de dados.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Contacto e Reclamações</h2>
          <p>Se tiver dúvidas sobre esta política ou quiser exercer os seus direitos, contacte-nos em <a href="mailto:info@crashpecas.pt" className="text-red-500 hover:text-red-400">info@crashpecas.pt</a>.</p>
          <p className="mt-2">Tem também o direito de apresentar reclamação à autoridade de controlo portuguesa: <strong className="text-white">CNPD — Comissão Nacional de Proteção de Dados</strong> (<a href="https://www.cnpd.pt" target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400">www.cnpd.pt</a>).</p>
        </section>

      </div>
    </div>
  );
};

export default PrivacidadePage;
