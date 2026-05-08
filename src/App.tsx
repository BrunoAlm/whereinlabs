import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Target, 
  Globe, 
  MessageSquare, 
  ChevronRight,
  Hexagon,
  Layers,
  Cpu,
  Mail,
  ExternalLink,
  Info,
  FileText,
  Lock,
  ArrowRight
} from "lucide-react";
import { WigButton, WigCard, WigStatusChip, WigSectionHeader } from "./components/WigUI";

type Route = "home" | "about" | "products" | "terms" | "privacy" | "contact";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "Quem Somos" },
    { id: "products", label: "Produtos" },
    { id: "terms", label: "Termos" },
    { id: "privacy", label: "Privacidade" },
  ];

  const renderContent = () => {
    switch (currentRoute) {
      case "home": return <HomeView setRoute={setCurrentRoute} />;
      case "about": return <AboutView />;
      case "products": return <ProductsView />;
      case "terms": return <TermsView />;
      case "privacy": return <PrivacyView />;
      case "contact": return <ContactView />;
      default: return <HomeView setRoute={setCurrentRoute} />;
    }
  };

  return (
    <div className="min-h-screen institutional-bg relative overflow-x-hidden selection:bg-wig-gold selection:text-wig-black">
      {/* Background Decorative Element */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-wig-gold/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 h-24 border-b border-white/5 bg-wig-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-10 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentRoute("home")}
          >
            <div className="w-10 h-10 bg-wig-gold flex items-center justify-center transition-transform duration-500 group-hover:rotate-12" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
              <Hexagon size={20} className="text-wig-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Wherein<span className="text-wig-gold transition-colors group-hover:text-white">Labs</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setCurrentRoute(item.id as Route)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-wig-gold ${currentRoute === item.id ? "text-wig-gold" : "text-wig-text-secondary"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-wig-text-muted tracking-widest uppercase">Brand ID // v.1.0</span>
                <span className="text-[10px] font-black text-wig-gold/60 tracking-widest uppercase">Project_Status: ACTIVE</span>
             </div>
             <WigButton variant="secondary" size="sm" onClick={() => setCurrentRoute("contact")}>
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
      <footer className="bg-wig-black border-t border-white/5 py-20 px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-wig-gold flex items-center justify-center opacity-80" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                <Hexagon size={16} className="text-wig-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic text-white">Wherein<span className="text-wig-gold">Labs</span></span>
            </div>
            <p className="text-sm text-wig-text-secondary max-w-sm leading-relaxed mb-8">
              Laboratório de inovação digital e estúdio criativo focado na construção de experiências interativas premium e produtos autorais com identidade única.
            </p>
            <div className="flex gap-4">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setCurrentRoute(item.id as Route)} className="text-[10px] font-bold uppercase tracking-widest text-wig-text-muted hover:text-wig-gold transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
             <div>
                <h5 className="text-xs font-black uppercase tracking-[0.3em] text-wig-gold mb-6">// Institucional</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => setCurrentRoute("about")} className="text-sm text-wig-text-secondary hover:text-white transition-colors">Sobre a Marca</button></li>
                  <li><button onClick={() => setCurrentRoute("products")} className="text-sm text-wig-text-secondary hover:text-white transition-colors">Ecossistema de Projetos</button></li>
                </ul>
             </div>
             <div>
                <h5 className="text-xs font-black uppercase tracking-[0.3em] text-wig-gold mb-6">// Conformidade</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => setCurrentRoute("terms")} className="text-sm text-wig-text-secondary hover:text-white transition-colors">Termos de Uso</button></li>
                  <li><button onClick={() => setCurrentRoute("privacy")} className="text-sm text-wig-text-secondary hover:text-white transition-colors">Política de Privacidade</button></li>
                  <li><span className="text-sm text-wig-text-muted">© 2026 All Rights Reserved</span></li>
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
      <section className="px-10 py-32 lg:py-48 flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <WigStatusChip label="Institutional Brand Site" active />
            </div>
            <h1 className="text-6xl lg:text-9xl font-black text-white uppercase italic leading-[0.8] tracking-tighter mb-10">
              WHEREIN<br /><span className="text-wig-gold">LABS</span>
            </h1>
            <p className="text-xl text-wig-text-secondary leading-relaxed mb-12 max-w-xl">
              Estúdio de criação e laboratório tecnológico independente. Desenvolvemos ecossistemas digitais onde <span className="text-white italic">identidade visual e funcionalidade</span> se fundem em experiências premium.
            </p>
            <div className="flex flex-wrap gap-6">
              <WigButton size="lg" onClick={() => setRoute("about")}>Conhecer a Marca</WigButton>
              <WigButton variant="secondary" size="lg" onClick={() => setRoute("products")}>Ver Produtos</WigButton>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block aspect-square relative"
          >
            <div className="absolute inset-0 border border-wig-gold/10 rotate-12 transition-transform duration-1000 hover:rotate-45" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
            <div className="absolute inset-10 border border-white/5 -rotate-6" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Hexagon size={120} className="text-wig-gold/20" />
            </div>
            <div className="absolute bottom-0 right-0 p-8 bg-wig-surface-base border border-white/5 backdrop-blur-md" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}>
              <div className="text-[10px] font-black text-wig-gold uppercase tracking-[0.4em] mb-2">AUTH_ID: 182-90-X</div>
              <div className="text-xl font-black italic text-white">STUDIO_INIT</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="px-10 py-32 bg-wig-surface-base/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <WigSectionHeader 
            title="Nossa Vocação" 
            subtitle="Identidade e Inovação" 
          />
          <div className="space-y-10">
            <p className="text-lg text-wig-text-secondary leading-relaxed">
              WhereinLabs não é apenas um estúdio, é uma mentalidade de construção. Acreditamos que a interface é a ponte emocional entre o código e o usuário, e por isso cada pixel é tratado com rigor técnico e sensibilidade estética.
            </p>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <div className="text-3xl font-black text-wig-gold mb-2 italic">01.</div>
                  <div className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Design Autoral</div>
                  <p className="text-xs text-wig-text-muted leading-relaxed">Criamos nossos próprios sistemas de design para garantir total integridade visual.</p>
               </div>
               <div>
                  <div className="text-3xl font-black text-wig-gold mb-2 italic">02.</div>
                  <div className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Foco em Produto</div>
                  <p className="text-xs text-wig-text-muted leading-relaxed">Do conceito à entrega, o foco é na utilidade e no acabamento premium.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="px-10 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <WigSectionHeader title="O Ecossistema" subtitle="Portfólio de Produtos" center />
          </div>
          <div className="p-1 lg:p-1.5 bg-gradient-to-br from-wig-gold/20 via-transparent to-white/5" style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)" }}>
            <div className="bg-wig-surface-base p-12 lg:p-20 relative overflow-hidden" style={{ clipPath: "polygon(0 0, calc(100% - 39px) 0, 100% 39px, 100% 100%, 0 100%)" }}>
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
               <div className="max-w-3xl relative z-10">
                 <div className="inline-flex items-center gap-3 px-3 py-1 bg-wig-gold/10 border border-wig-gold/30 mb-8">
                   <Target size={14} className="text-wig-gold" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wig-gold">Main Project</span>
                 </div>
                 <h3 className="text-4xl lg:text-6xl font-black text-white uppercase italic leading-none mb-6">Where<span className="text-wig-gold">In</span>Games</h3>
                 <p className="text-lg text-wig-text-secondary leading-relaxed mb-10 max-w-xl">
                   Nosso principal produto focado em maestria geográfica e reconhecimento de mapas. Onde a precisão encontra o instinto em universos digitais icônicos.
                 </p>
                 <WigButton variant="secondary" onClick={() => setRoute("products")}>Explorar Projeto</WigButton>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutView() {
  return (
    <section className="px-10 py-32">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Quem Somos" subtitle="Manifesto Institucional" />
        <div className="space-y-12 text-lg text-wig-text-secondary leading-relaxed">
          <p>
            WhereinLabs nasceu da necessidade de criar produtos digitais que não se perdessem na multidão do "flat design" genérico. Somos um laboratório de exploração onde tecnologia e arte se encontram para construir identidades fortes.
          </p>
          <div className="grid md:grid-cols-2 gap-12 py-12 border-y border-white/5">
            <WigCard title="Missão" icon={Target}>
              <p className="text-sm text-wig-text-muted mt-2">Construir ecossistemas digitais que entreguem valor real através de interfaces autorais e sofisticadas, elevando o padrão de interação para o usuário final.</p>
            </WigCard>
            <WigCard title="Visão" icon={Globe}>
              <p className="text-sm text-wig-text-muted mt-2">Tornar-se o selo de referência em design tático e experiências de maestria, unificando diferentes produtos sob uma mesma estética premium.</p>
            </WigCard>
          </div>
          <p>
            Nossa abordagem é centrada em sistemas. Não criamos apenas páginas, criamos linguagens. O <span className="text-wig-gold font-bold">Wig Design System</span> é o coração pulsante de tudo o que fazemos, garantindo que cada novo projeto herde o DNA de precisão e tecnologia que nos define.
          </p>
          <div className="flex items-center gap-6 p-8 bg-white/2 border-l-2 border-wig-gold">
            <Info size={24} className="text-wig-gold shrink-0" />
            <p className="text-sm italic font-medium">Localizado na fronteira entre o design conceitual e o desenvolvimento tático, o laboratório WhereinLabs opera como uma entidade criativa independente.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsView() {
  return (
    <section className="px-10 py-32">
      <div className="max-w-7xl mx-auto">
        <WigSectionHeader title="Produtos & Projetos" subtitle="Nosso Ecossistema Digital" />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="lg:col-span-2">
            <WigCard title="WhereInGames" subtitle="Master Project" icon={Target} highlight>
              <div className="grid md:grid-cols-2 gap-12 mt-4">
                <div>
                  <p className="text-sm text-wig-text-secondary leading-relaxed mb-6">
                    A principal experiência de reconhecimento de mapas da marca. Uma fusão de geografia virtual, precisão estatística e competição premium. O projeto serviu como base para a criação da nossa identidade visual atual.
                  </p>
                  <div className="flex gap-4">
                    <WigStatusChip label="Projeto Ativo" active />
                    <WigStatusChip label="Map Mastery" />
                    <WigStatusChip label="Competitive Hub" />
                  </div>
                </div>
                <div className="aspect-video bg-wig-surface-alt border border-white/5 flex items-center justify-center relative group overflow-hidden">
                   <div className="absolute inset-0 bg-wig-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Target size={48} className="text-wig-gold opacity-30" />
                   <div className="absolute bottom-4 right-4 text-[9px] font-black uppercase text-wig-text-muted tracking-widest">WIG_PROD_RENDER_VIEW</div>
                </div>
              </div>
            </WigCard>
          </div>
          
          <WigCard title="Wig UI Library" subtitle="Internal Tooling" icon={Cpu}>
            <p className="text-sm text-wig-text-secondary mb-8">Nossa biblioteca proprietária de componentes HUD premium, servindo como base técnica para todos os produtos WhereinLabs.</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-wig-gold">Em Uso Interno</span>
              <Layers size={16} className="text-wig-text-muted" />
            </div>
          </WigCard>

          <WigCard title="Upcoming_Project_03" subtitle="Research Phase" icon={Hexagon}>
            <p className="text-sm text-wig-text-muted italic mb-8">Novo produto em fase de pesquisa e prototipação. Acompanhe nossos canais institucionais para comunicados oficiais e datas de lançamento.</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-wig-text-muted tracking-widest">CLASSIFIED</span>
              <Lock size={16} className="text-wig-text-muted" />
            </div>
          </WigCard>
        </div>
      </div>
    </section>
  );
}

function TermsView() {
  return (
    <section className="px-10 py-32">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Termos de Uso" subtitle="Diretrizes Legais" />
        <div className="space-y-10 text-sm text-wig-text-secondary leading-relaxed bg-wig-surface-base p-12 border border-white/5" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">1. Aceitação dos Termos</h4>
             <p>Ao acessar este site institucional da WhereinLabs, você concorda em cumprir estes termos e todas as leis aplicáveis. Se você não concordar com algum termo, está proibido de usar ou acessar este site.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">2. Propriedade Intelectual</h4>
             <p>A marca WhereinLabs, o WhereInGames, o Wig Design System e todo o conteúdo deste site (textos, gráficos, logos, ícones e código) são propriedade exclusiva da WhereinLabs, protegidos por leis de direitos autorais internacionais.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">3. Uso de Licença</h4>
             <p>Este site é estritamente institucional. É concedida permissão para visualizar e interagir com o conteúdo informativo apenas para fim pessoal e não comercial. Esta é uma concessão de licença de visualização, não uma transferência de título.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">4. Limitação de Responsabilidade</h4>
             <p>Os materiais no site da WhereinLabs são fornecidos 'como estão'. A marca não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.</p>
           </div>
           <div className="pt-8 border-t border-white/5 text-[10px] uppercase font-bold tracking-widest text-wig-text-muted">
             Última Atualização: 08 de Maio de 2026
           </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyView() {
  return (
    <section className="px-10 py-32">
      <div className="max-w-4xl mx-auto">
        <WigSectionHeader title="Política de Privacidade" subtitle="Compromisso com a Proteção" />
        <div className="space-y-10 text-sm text-wig-text-secondary leading-relaxed bg-wig-surface-base p-12 border border-white/5" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
           <div className="space-y-4">
             <p>A privacidade dos nossos visitantes é uma prioridade fundamental na WhereinLabs. Esta política detalha como lidamos com as informações coletadas através deste domínio institucional.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">Coleta de Dados</h4>
             <p>Neste site institucional, não coletamos dados pessoais sensíveis de forma automática. Qualquer informação fornecida voluntariamente através de canais de contato será tratada com o máximo de confidencialidade.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">Uso de Cookies</h4>
             <p>Podemos utilizar cookies básicos para melhorar a performance técnica do site e para análises anônimas de tráfego, visando sempre a melhoria da experiência do usuário.</p>
           </div>
           <div className="space-y-2">
             <h4 className="font-black uppercase text-white tracking-widest">Segurança</h4>
             <p>Empregamos medidas técnicas de segurança padrão da indústria (como criptografia SSL) para garantir que sua interação com nosso site institucional seja segura e protegida contra acessos não autorizados.</p>
           </div>
           <div className="pt-8 border-t border-white/5 flex items-center gap-4">
              <Lock size={16} className="text-wig-gold" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-wig-text-muted">Data Protection Standard v.1.0</span>
           </div>
        </div>
      </div>
    </section>
  );
}

function ContactView() {
  return (
    <section className="px-10 py-32">
      <div className="max-w-5xl mx-auto">
        <WigSectionHeader title="Canais de Contato" subtitle="Estabelecendo Conexões" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-lg text-wig-text-secondary leading-relaxed">
              Interessado em saber mais sobre nosso estúdio, propostas de colaboração ou informações sobre os produtos WhereinLabs? Utilize nossos canais oficiais listados abaixo.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-wig-surface-alt border border-white/5 transition-transform hover:-translate-y-1">
                 <Mail size={24} className="text-wig-gold" />
                 <div>
                    <div className="text-[10px] font-black uppercase text-wig-text-muted mb-1 tracking-widest">E-mail Corporativo</div>
                    <div className="text-lg font-black text-white italic">contact@whereinlabs.com</div>
                 </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-wig-surface-alt border border-white/5 transition-transform hover:-translate-y-1">
                 <MessageSquare size={24} className="text-wig-gold" />
                 <div>
                    <div className="text-[10px] font-black uppercase text-wig-text-muted mb-1 tracking-widest">Comunidade</div>
                    <div className="text-lg font-black text-white italic">discord.gg/whereinlabs</div>
                 </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-wig-surface-alt border border-white/5 transition-transform hover:-translate-y-1">
                 <ArrowRight size={24} className="text-wig-gold" />
                 <div>
                    <div className="text-[10px] font-black uppercase text-wig-text-muted mb-1 tracking-widest">Novidades</div>
                    <div className="text-lg font-black text-white italic">twitter.com/whereinlabs</div>
                 </div>
              </div>
            </div>
          </div>
          <div className="bg-wig-surface-base p-10 border border-white/5 relative">
            <div className="absolute top-0 right-0 p-4">
              <Hexagon size={40} className="text-wig-gold opacity-10" />
            </div>
            <h4 className="text-xl font-black uppercase text-white mb-8 italic">Direto ao Estúdio</h4>
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-2 tracking-widest">Nome Completo</label>
                  <input type="text" className="w-full bg-wig-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors" placeholder="Seu nome..." />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-2 tracking-widest">E-mail</label>
                  <input type="email" className="w-full bg-wig-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors" placeholder="seuemail@empresa.com" />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase text-wig-text-muted mb-2 tracking-widest">Mensagem</label>
                  <textarea rows={4} className="w-full bg-wig-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-wig-gold transition-colors resize-none" placeholder="Sua mensagem institucional..."></textarea>
               </div>
               <WigButton className="w-full" variant="primary">Enviar Mensagem</WigButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
