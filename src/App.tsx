import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Target, 
  Globe, 
  ChevronRight,
  Hexagon,
  Layers,
  Cpu,
  Mail,
  ExternalLink,
  Info,
  Lock,
  ArrowRight
} from "lucide-react";
import { WigButton, WigCard, WigStatusChip, WigSectionHeader, WigHudFrame } from "./components/WigUI";
import { WigProductShowcase } from "./components/WigProductShowcase";
import { WigBackground } from "./components/WigBackground";
import { PatchNotes } from "./components/PatchNotes";

type Route = "home" | "about" | "products" | "news" | "terms" | "privacy" | "contact";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>("home");

  // Sync route state with URL hash for static hosting compatibility (GitHub Pages)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Route;
      const validRoutes: Route[] = ["home", "about", "products", "news", "terms", "privacy", "contact"];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      } else if (!hash) {
        setCurrentRoute("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  const setRoute = (route: Route) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Produtos" },
    { id: "news", label: "News" },
    { id: "about", label: "Quem Somos" },
  ];

  const renderContent = () => {
    switch (currentRoute) {
      case "home": return <HomeView setRoute={setCurrentRoute} />;
      case "about": return <AboutView />;
      case "products": return <ProductsView />;
      case "news": return <NewsView />;
      case "terms": return <TermsView />;
      case "privacy": return <PrivacyView />;
      case "contact": return <ContactView />;
      default: return <HomeView setRoute={setRoute} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-wig-gold selection:text-wig-black">
      {/* High-Fidelity Tactical Background */}
      <WigBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 h-24 border-b border-white/5 bg-wig-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-10 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setRoute("home")}
          >
            <div className="w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="WhereinLabs Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Wherein<span className="text-wig-gold transition-colors group-hover:text-white">Labs</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setRoute(item.id as Route)}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${currentRoute === item.id ? "text-wig-gold" : "text-wig-text-secondary hover:text-white"}`}
              >
                {item.label}
                {currentRoute === item.id && (
                  <motion.div layoutId="nav-glow" className="absolute -bottom-1 left-0 w-full h-[1px] bg-wig-gold shadow-[0_0_8px_var(--color-wig-gold)]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-4 opacity-50">
                <span className="text-[10px] font-black text-wig-text-muted tracking-widest uppercase">Brand ID // v.2.0</span>
                <span className="text-[10px] font-black text-wig-gold/60 tracking-widest uppercase">System_Active</span>
             </div>
             <WigButton variant="secondary" size="md" onClick={() => setRoute("contact")}>
               Contato
             </WigButton>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-wig-black border-t border-white/5 py-24 px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-20 relative z-10 text-center lg:text-left">
          <div className="col-span-2">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-10">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="WhereinLabs Logo" className="w-full h-full object-contain opacity-80" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-white font-mono">Wherein<span className="text-wig-gold">Labs</span></span>
            </div>
            <p className="text-sm text-wig-text-secondary max-w-sm mx-auto lg:mx-0 leading-relaxed mb-10">
              Laboratório criativo especializado em design tático e experiências digitais de alta performance. Desenvolvedores do ecossistema WhereInGames.
            </p>
            <div className="flex justify-center lg:justify-start gap-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setRoute(item.id as Route)} className="text-[10px] font-black uppercase tracking-[0.2em] text-wig-text-muted hover:text-wig-gold transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-12">
             <div>
                <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-wig-gold mb-8 opacity-60">// Institucional</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => setRoute("about")} className="text-sm text-wig-text-secondary hover:text-white transition-all hover:translate-x-1">Sobre a Marca</button></li>
                  <li><button onClick={() => setRoute("products")} className="text-sm text-wig-text-secondary hover:text-white transition-all hover:translate-x-1">Nossos Produtos</button></li>
                  <li><button onClick={() => setRoute("contact")} className="text-sm text-wig-text-secondary hover:text-white transition-all hover:translate-x-1">Suporte e Parcerias</button></li>
                </ul>
             </div>
             <div>
                <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-wig-gold mb-8 opacity-60">// Legal</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => setRoute("terms")} className="text-sm text-wig-text-secondary hover:text-white transition-all hover:translate-x-1">Diretrizes de Uso</button></li>
                  <li><button onClick={() => setRoute("privacy")} className="text-sm text-wig-text-secondary hover:text-white transition-all hover:translate-x-1">Dados e Privacidade</button></li>
                  <li className="pt-4"><span className="text-[10px] font-bold text-wig-text-muted tracking-[0.1em]">© 2026 WHEREINLABS. ALL RIGHTS RESERVED.</span></li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-wig-text-muted">
          <span>WHEREINLABS DIGITAL STUDIO</span>
          <span className="text-wig-gold/30 italic">Crafted by Wig Design System</span>
        </div>
      </footer>
    </div>
  );
}

function HomeView({ setRoute }: { setRoute: (r: Route) => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="px-10 py-32 lg:py-56 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto h-full flex items-center">
          <WigHudFrame preset="screen" accent="both" className="p-12 lg:p-24 w-full" showHoneycomb={true}>
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <WigStatusChip label="Digital Production Studio" active />
                  <div className="w-8 h-8 opacity-50">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
                <h1 className="text-6xl lg:text-9xl font-black text-white uppercase italic leading-[0.8] tracking-tighter mb-10">
                  WHEREIN<br /><span className="text-wig-gold animate-pulse">LABS</span>
                </h1>
                <p className="text-xl text-wig-text-secondary leading-relaxed mb-12 max-w-lg">
                  Nascido da fusão entre <span className="text-white italic">design tático</span> e tecnologia de ponta. Criamos mundos onde cada detalhe é uma questão de precisão.
                </p>
                <div className="flex flex-wrap gap-6">
                  <WigButton size="lg" onClick={() => setRoute("about")}>Conhecer Estúdio</WigButton>
                  <WigButton variant="secondary" size="lg" onClick={() => setRoute("products")}>Explorar Projetos</WigButton>
                </div>
              </motion.div>
              <div className="hidden lg:flex items-center justify-center relative">
                 <div className="w-[400px] h-[400px] border border-wig-gold/20 flex items-center justify-center animate-spin-slow" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                   <div className="w-full h-full p-10">
                     <div className="w-full h-full border border-white/5 opacity-50" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                   </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center p-20">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="WhereinLabs Logo" className="w-full h-full object-contain opacity-30 animate-pulse" />
                 </div>
              </div>
            </div>
          </WigHudFrame>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 md:px-10 py-24 md:py-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-32">
            <div>
              <WigSectionHeader title="Design Tático" subtitle="Manifesto da Marca" />
              <div className="space-y-8 md:space-y-10 text-base md:text-lg text-wig-text-secondary leading-relaxed">
                <p>
                  Acreditamos na interface como uma <span className="text-white font-bold italic">extensão do instinto</span>. Cada projeto WhereinLabs herda uma arquitetura visual rigorosa, inspirada em sistemas HUD e aviação tática.
                </p>
                <WigButton variant="ghost" onClick={() => setRoute("about")} className="group">
                  Nossa Visão <ChevronRight size={16} className="transition-transform group-hover:translate-x-2" />
                </WigButton>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Sistemas Autorais", icon: Layers, desc: "Processo de criação baseado em design systems exclusivos." },
                { title: "Identidade Premium", icon: Shield, desc: "Estética sofisticada com foco em acabamento e detalhe." },
                { title: "Tecnologia Nativa", icon: Cpu, desc: "Produtos robustos construídos com as melhores stacks digitais." },
                { title: "Foco Global", icon: Globe, desc: "Escalabilidade e presença internacional em todos os projetos." }
              ].map((item, i) => (
                <WigCard key={item.title} title={item.title} icon={item.icon}>
                  <p className="text-xs text-wig-text-muted mt-2 leading-relaxed">{item.desc}</p>
                </WigCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5 bg-wig-surface-base/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <WigSectionHeader title="O Ecossistema" subtitle="Maestria em Desenvolvimento" center />
          </div>
          <WigProductShowcase 
             title="Principal Operação"
             subtitle="Recognition & Map Mastery"
             productName="WhereInGames"
             embedUrl="https://whereingames.com"
             externalUrl="https://whereingames.com"
             fallbackDescription="O site WhereInGames utiliza protocolos de segurança que podem impedir a visualização direta nesta moldura institucional. Utilize o botão acima para abrir a experiência completa."
          />
        </div>
      </section>

      {/* News Section */}
      <section className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <WigSectionHeader title="News" subtitle="WIG_LOG_STREAM" />
            <WigButton variant="ghost" onClick={() => setRoute("news")}>
              Ver Histórico Completo <ArrowRight size={16} className="ml-3" />
            </WigButton>
          </div>
          <PatchNotes />
        </div>
      </section>
    </>
  );
}

function AboutView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-5xl mx-auto">
        <WigSectionHeader title="Quem Somos" subtitle="O Laboratório Creativo" />
        <div className="space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <div className="space-y-8 text-lg text-wig-text-secondary leading-relaxed">
              <p>
                WhereinLabs é um estúdio de design digital e desenvolvimento técnico focado na criação de experiências interativas premium. Operamos como um laboratório onde a estética tática encontra a funcionalidade moderna.
              </p>
              <p>
                Nossa jornada começou com o desejo de traduzir a complexidade e a beleza das interfaces de sistemas de precisão para a Web e aplicações móveis, mantendo sempre o rigor artístico.
              </p>
            </div>
            <WigHudFrame preset="panel" className="p-10" showHoneycomb={true} accent="top">
               <div className="space-y-8">
                 <div>
                    <h4 className="text-xs font-black uppercase text-wig-gold tracking-[0.3em] mb-4">// DNA da Marca</h4>
                    <ul className="space-y-4">
                      {["Rigor Técnico", "Maestria Visual", "Inovação Tática"].map(item => (
                        <li key={item} className="flex items-center gap-4 text-sm text-white italic">
                          <div className="w-1.5 h-1.5 bg-wig-gold" />
                          {item}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div className="pt-8 border-t border-white/5">
                    <p className="text-xs text-wig-text-muted leading-relaxed">
                      Wig Design System: O coração tecnológico que unifica todos os nossos projetos.
                    </p>
                 </div>
               </div>
            </WigHudFrame>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <WigCard title="Propósito" icon={Target}>
                <p className="text-sm text-wig-text-muted mt-2">Redefinir o contato entre usuário e sistema através de linguagens visuais únicas.</p>
             </WigCard>
             <WigCard title="Visão" icon={Shield}>
                <p className="text-sm text-wig-text-muted mt-2">Ser a referência global em HUD Design e interfaces de precisão na Web.</p>
             </WigCard>
             <WigCard title="Cultura" icon={Hexagon}>
                <p className="text-sm text-wig-text-muted mt-2">Sempre em modo Laboratório. Exploração constante é o nosso combustível.</p>
             </WigCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <WigSectionHeader title="Ecossistema Labs" subtitle="Produtos em Destaque" />
        <div className="space-y-32">
          {/* Main Product Showcase */}
          <WigProductShowcase 
             title="Produto Flagship"
             subtitle="A Experiência Definitiva de Map Mastery"
             productName="WhereInGames"
             embedUrl="https://whereingames.com"
             externalUrl="https://whereingames.com"
             fallbackDescription="O ecossistema WhereInGames foi construído para performance máxima. Caso o renderizador instantâneo encontre dificuldades de conexão abaixo, você pode abrir o projeto diretamente."
          />

          {/* Secondary Products Grid */}
          <div className="grid lg:grid-cols-2 gap-12 pt-20 border-t border-white/5">
            <WigCard title="Wig UI Library" subtitle="INTERNAL_TOOL" icon={Cpu} highlight>
              <p className="text-sm text-wig-text-secondary leading-relaxed mb-8">
                Nossa biblioteca de componentes visualmente síncronos. Permite que qualquer aplicação herde instantaneamente os traços HUD premium da marca WhereinLabs.
              </p>
              <div className="flex items-center justify-between">
                <WigStatusChip label="Em Uso" active />
                <span className="text-[10px] font-black text-wig-text-muted uppercase tracking-widest">Version 1.4.0</span>
              </div>
            </WigCard>

            <WigCard title="Project_Hex" subtitle="RESEARCH_LAB" icon={Hexagon}>
              <p className="text-sm text-wig-text-muted italic leading-relaxed mb-8">
                Fase de exploração de novos paradigmas de navegação espacial aplicados a sistemas de dados e estatísticas esportivas. Em desenvolvimento silencioso.
              </p>
              <div className="flex items-center justify-between">
                <WigStatusChip label="Classificado" />
                <Lock size={16} className="text-wig-text-muted opacity-30" />
              </div>
            </WigCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Novidades & Updates" subtitle="Protocol_History" />
        <PatchNotes />
      </div>
    </section>
  );
}

function TermsView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Termos de Uso" subtitle="Legal_Compliance" />
        <WigHudFrame preset="panel" className="p-8 md:p-12 lg:p-16" showHoneycomb={false} accent="top">
          <div className="prose prose-invert max-w-none space-y-8 md:space-y-10 text-xs md:text-sm text-wig-text-secondary leading-relaxed">
             <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-4">1. Institucional</h4>
               <p>O site whereinlabs.com é uma plataforma institucional para apresentação da marca e seus produtos subsidiários. Todo o conteúdo visual aqui exposto é de propriedade intelectual restrita.</p>
             </div>
             <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-4">2. Propriedade Intelectual</h4>
               <p>A marca WhereinLabs, o WhereInGames e o Wig Design System são criações autorais. É proibida a reprodução de elementos do Design System ou código fonte para fins comerciais sem autorização via contrato oficial.</p>
             </div>
             <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-4">3. Limitações</h4>
               <p>Este site não oferece serviços de assinatura direta ou garantias de operação ininterrupta. A finalidade é estritamente informativa e de posicionamento de mercado.</p>
             </div>
             <div className="pt-10 border-t border-white/5 flex items-center justify-between opacity-50">
                <span className="text-[10px] font-black uppercase tracking-widest">Última Revisão: 08.05.2026</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-wig-gold">Auth_Verified</span>
             </div>
          </div>
        </WigHudFrame>
      </div>
    </section>
  );
}

function PrivacyView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Privacidade" subtitle="Data_Protection" />
        <WigHudFrame preset="panel" className="p-8 md:p-12 lg:p-16" showHoneycomb={false} accent="bottom">
          <div className="space-y-8 md:space-y-10 text-xs md:text-sm text-wig-text-secondary leading-relaxed">
             <div className="p-6 bg-white/2 border-l-2 border-wig-gold flex items-center gap-6 mb-10">
                <span className="text-wig-gold">
                  <Info size={24} />
                </span>
                <p className="italic">Sua privacidade é codificada no nosso DNA técnico. Não comercializamos dados ou monitoramos usuários fora estritamente do necessário para a experiência do site.</p>
             </div>
             <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-4">Coleta Transparente</h4>
               <p>Coletamos apenas dados técnicos fundamentais para a performance do site (como idioma e resolução de tela) via cookies funcionais. Não armazenamos informações pessoais identificáveis sem o seu consentimento explícito em formulários.</p>
             </div>
             <div>
               <h4 className="text-lg font-black text-white uppercase italic mb-4">Segurança de Camada Ativa</h4>
               <p>Utilizamos criptografia moderna e padrões de segurança de alto nível para garantir que sua visita institucional seja livre de ameaças e monitoramento externo.</p>
             </div>
             <div className="pt-10 flex items-center gap-4 text-wig-text-muted">
                <Lock size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">PrivacyShield_Standard v1.0</span>
             </div>
          </div>
        </WigHudFrame>
      </div>
    </section>
  );
}

function ContactView() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 lg:py-48">
      <div className="max-w-5xl mx-auto">
        <WigSectionHeader title="Contact_Lab" subtitle="Abra uma Conexão" />
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-lg md:text-xl text-wig-text-secondary leading-relaxed mb-8 md:ml-12 md:mb-12">
              Dúvidas sobre o ecossistema WhereinLabs, sugestões de parcerias ou suporte técnico para nossos produtos? Estamos prontos para o comando.
            </p>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "E-mail Oficial", val: "contact@whereinlabs.com" },
                { icon: ArrowRight, label: "Feed de Novidades", val: "twitter.com/whereinlabs" },
                { icon: Hexagon, label: "Support Node", val: "discord.gg/whereinlabs" }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-8 p-8 bg-wig-surface-base border border-white/5 transition-all hover:border-wig-gold/20">
                  <item.icon size={24} className="text-wig-gold opacity-50" />
                  <div>
                    <div className="text-[10px] font-black text-wig-text-muted uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-black text-white italic">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <WigHudFrame preset="panel" className="p-12" showHoneycomb={true} accent="top">
             <div className="space-y-8">
               <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Enviar Mensagem</h4>
               <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-3 tracking-widest">Identificação</label>
                    <input type="text" className="w-full bg-wig-black border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors font-mono" placeholder="NAME_OR_ORG_ID" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-3 tracking-widest">Email Node</label>
                    <input type="email" className="w-full bg-wig-black border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors font-mono" placeholder="CONTACT_SOURCE" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-3 tracking-widest">Data_Payload</label>
                    <textarea rows={4} className="w-full bg-wig-black border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors resize-none font-mono" placeholder="ENTER_MESSAGE..."></textarea>
                 </div>
                 <WigButton size="lg" className="w-full">Initialize_Transfer</WigButton>
               </div>
             </div>
          </WigHudFrame>
        </div>
      </div>
    </section>
  );
}
