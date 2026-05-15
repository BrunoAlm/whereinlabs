import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Post, PostsResponse } from "../types";
import { WigCard, WigStatusChip, WigHudFrame } from "./WigUI";
import { AlertCircle, Terminal, Download, Calendar, Timer, Gamepad2 } from "lucide-react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";

export const PatchNotes = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState("all");

  const [syncStatus, setSyncStatus] = useState<{last_sync?: string, status?: string}>({});

  const sources = [
    { id: "all", label: "Geral", type: "internal", url: "https://api.whereingames.com/v1/content/posts?limit=12", description: "Todas as atualizações e logs do sistema WhereinLabs." },
    { id: "community", label: "Reddit", type: "reddit", url: "https://www.reddit.com/r/Games/hot.json?limit=15", description: "Discussões e notícias quentes da comunidade r/Games." },
    { id: "ign", label: "IGN", type: "rss-local", url: "/data/ign-news.json", description: "Últimas notícias globais via IGN." },
    { id: "eurogamer", label: "Eurogamer", type: "rss-local", url: "/data/eurogamer-news.json", description: "Análises e notícias da Eurogamer." },
    { id: "meups", label: "MeuPS", type: "rss-local", url: "/data/meups-news.json", description: "Portal brasileiro focado em PlayStation." },
    { id: "steam", label: "Steam", type: "steam", url: "/data/steam-news.json", description: "Atualizações oficiais de grandes títulos na Steam (via Sync)." },
  ];

  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const timestamp = Date.now();
        
        // Fetch status progressivo
        fetch(`/data/status.json?t=${timestamp}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => data && setSyncStatus(data))
          .catch(() => {});

        const source = sources.find(s => s.id === activeSource) || sources[0];
        
        let mappedPosts: Post[] = [];

        if (source.id === "all") {
          // ABA GERAL: Agrega API interna + feeds locais se disponíveis
          const [internalRes, redditRes, ignRes] = await Promise.allSettled([
            fetch(sources.find(s => s.id === "all")!.url),
            fetch("https://www.reddit.com/r/Games/hot.json?limit=8"),
            fetch(`/data/ign-news.json?t=${timestamp}`)
          ]);

          if (internalRes.status === "fulfilled" && internalRes.value.ok) {
            const data = await internalRes.value.json();
            mappedPosts = [...(data.posts || [])];
          }

          if (redditRes.status === "fulfilled" && redditRes.value.ok) {
               const data = await redditRes.value.json();
               const redditItems = data.data.children.map((child: any) => ({
                 id: `reddit-${child.data.id}`,
                 title: `[Reddit] ${child.data.title}`,
                 summary: child.data.selftext?.substring(0, 120) || "Discussão na r/Games",
                 content_markdown: child.data.selftext || child.data.url,
                 category: "COMMUNITY",
                 published_at: new Date(child.data.created_utc * 1000).toISOString(),
                 game: { id: "reddit", name: "r/Games", slug: "reddit" }
               }));
               mappedPosts = [...mappedPosts, ...redditItems];
          }

          if (ignRes.status === "fulfilled" && ignRes.value.ok) {
            const data = await ignRes.value.json();
            if (data.items && data.items.length > 0) {
              const ignItems = data.items.slice(0, 5).map((item: any) => ({
                id: `ign-${item.id || item.link}`,
                title: `[IGN] ${item.title}`,
                summary: item.description?.substring(0, 120).replace(/<[^>]*>?/gm, ''),
                category: "NEWS",
                published_at: item.published || item.date || new Date().toISOString(),
                game: { id: "ign", name: "IGN", slug: "ign" }
              }));
              mappedPosts = [...mappedPosts, ...ignItems];
            }
          }
          
          // Ordenar por data
          mappedPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        } else {
          // OUTRAS ABAS (IGN, Eurogamer, MeuPS, Steam)
          const fetchUrl = source.type === "rss-local" || source.id === "steam" 
            ? `${source.url}?t=${timestamp}` 
            : source.url;

          const response = await fetch(fetchUrl);
          
          if (!response.ok) {
            if (response.status === 404) throw new Error(`O feed ${source.label} está sendo sincronizado. Tente em 1 minuto.`);
            throw new Error("Fonte temporariamente indisponível");
          }
          
          const data = await response.json();

          // Se a API retornou o arquivo de fallback "syncing"
          if (data.status === "syncing" || (data.items && data.items.length === 0 && source.type === "rss-local")) {
            throw new Error(`Aguardando primeira sincronização do bot para ${source.label}... Abra o console do GitHub para ver o status.`);
          }

          if (source.type === "reddit") {
            mappedPosts = data.data.children.map((child: any) => ({
              id: child.data.id,
              slug: child.data.id,
              title: child.data.title,
              summary: child.data.selftext?.substring(0, 160) || "Discussão no Reddit...",
              content_markdown: child.data.selftext || `Link original: ${child.data.url}`,
              cover_image_url: (child.data.thumbnail && child.data.thumbnail.startsWith('http')) ? child.data.thumbnail : "",
              category: "REDDIT",
              type: "NEWS",
              published_at: new Date(child.data.created_utc * 1000).toISOString(),
              game: { id: "reddit", name: "r/Games", slug: "reddit" }
            }));
          } else if (source.type === "rss-local") {
            mappedPosts = (data.items || []).map((item: any) => ({
              id: item.id || item.link,
              slug: item.id || item.link,
              title: item.title,
              summary: item.summary || item.description?.substring(0, 160).replace(/<[^>]*>?/gm, ''),
              content_markdown: item.content || item.description,
              cover_image_url: item.image || item.enclosures?.[0]?.url || "",
              category: source.label.toUpperCase(),
              type: "NEWS",
              published_at: item.published || item.date || new Date().toISOString(),
              game: { id: source.id, name: source.label, slug: source.id }
            }));
          } else if (source.type === "steam") {
            mappedPosts = data.appnews?.newsitems.map((item: any) => ({
              id: item.gid,
              slug: item.gid,
              title: item.title,
              summary: item.contents.substring(0, 160).replace(/<[^>]*>?/gm, '') + "...",
              content_markdown: item.contents,
              category: "STEAM",
              type: "PATCH_NOTES",
              published_at: new Date(item.date * 1000).toISOString(),
              game: { id: "steam", name: "Steam Official", slug: "steam" }
            })) || [];
          }
        }
        
        setPosts(mappedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro de conexão");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatchNotes();
  }, [activeSource]);

  const currentSourceInfo = sources.find(s => s.id === activeSource) || sources[0];

  const preprocessMarkdown = (content: string) => {
    if (!content) return "";
    // react-markdown + rehype-raw doesn't parse markdown markers inside HTML tags.
    // To fix headers, bold text and images returning as plain text inside alignment tags,
    // we strip these tags but keep the content.
    // Standard JS regex doesn't support 's' flag for dot-all easily in all envs,
    // so we use [\s\S] to match any character including newlines.
    return content
      .replace(/<p align="[^"]+">([\s\S]*?)<\/p>/g, "$1\n")
      .replace(/<div align="[^"]+">([\s\S]*?)<\/div>/g, "$1\n")
      .replace(/<center>([\s\S]*?)<\/center>/g, "$1\n");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <WigCard key={i} title="Carregando..." subtitle="Syncing_Data">
            <div className="h-24 bg-white/5 rounded-sm mb-4" />
            <div className="h-4 bg-white/5 rounded-sm w-3/4" />
          </WigCard>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <WigHudFrame preset="panel" className="p-12 text-center border-wig-orange/30">
        <AlertCircle size={48} className="text-wig-orange mx-auto mb-6 opacity-50" />
        <h4 className="text-xl font-black text-white uppercase italic mb-2">Erro de Conexão</h4>
        <p className="text-wig-text-secondary text-sm mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs font-black uppercase text-wig-gold hover:underline"
        >
          Tentar Reconectar
        </button>
      </WigHudFrame>
    );
  }

  // Generate Structured Data for News/Articles
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": posts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": post.title,
        "datePublished": post.published_at,
        "dateModified": post.published_at,
        "author": {
          "@type": "Organization",
          "name": "WhereinLabs",
          "url": "https://us.whereingames.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "WhereinLabs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://us.whereingames.com/logo.png"
          }
        },
        "description": `${post.category} update for ${post.game?.name || "WhereinGames"}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://us.whereingames.com/news#${post.id}`
        }
      }
    }))
  };

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{`${currentSourceInfo.label} | News & Updates | WhereinLabs`}</title>
        <meta name="description" content={currentSourceInfo.description} />
        <meta property="og:title" content={`${currentSourceInfo.label} | WhereinLabs News`} />
        <meta property="og:description" content={currentSourceInfo.description} />
        <link rel="canonical" href={`https://us.whereingames.com/news${activeSource !== "all" ? "?source=" + activeSource : ""}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Source Switcher */}
      <div className="flex flex-wrap gap-3 mb-16 p-2 bg-white/5 border border-white/10 rounded-sm backdrop-blur-sm">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setActiveSource(source.id)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
              activeSource === source.id 
                ? "text-wig-black bg-wig-gold" 
                : "text-wig-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            {source.label}
            {activeSource === source.id && (
              <motion.div 
                layoutId="source-glitch"
                className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase text-wig-gold/80 mb-2 tracking-tighter">
            {currentSourceInfo.label} Updates
          </h2>
          <p className="text-xs text-wig-text-muted uppercase tracking-[0.3em]">
            Source_Feed: {currentSourceInfo.id} // Status: {syncStatus.status || "Online"}
          </p>
        </div>
        {syncStatus.last_sync && (
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-wig-text-muted uppercase tracking-widest mb-1">Last Sync</p>
            <p className="text-[10px] font-mono text-wig-gold/50">
              {new Date(syncStatus.last_sync).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </div>

      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          id={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <WigCard 
            title={post.title} 
            subtitle={`${post.category} // ${post.version}`}
            icon={Terminal}
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {post.game && (
                <div className="flex items-center gap-2 bg-wig-gold/10 border border-wig-gold/20 px-3 py-1 rounded-sm">
                  <Gamepad2 size={12} className="text-wig-gold" />
                  <span className="text-[10px] font-black uppercase text-wig-gold tracking-widest leading-none">
                    {post.game.name}
                  </span>
                </div>
              )}
              <WigStatusChip label={`IMPACT: ${post.impact}`} active={post.impact === "MAXIMO"} />
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-wig-text-muted">
                <Calendar size={12} />
                {new Date(post.published_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-wig-text-muted">
                <Timer size={12} />
                {new Date(post.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {post.cover_image_url && (
              <div className="mb-10 group relative">
                <div className="absolute -inset-1 bg-wig-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <WigHudFrame preset="subtle" className="overflow-hidden">
                   <img 
                    src={post.cover_image_url.startsWith('http') ? post.cover_image_url : `https://api.whereingames.com${post.cover_image_url}`} 
                    alt={post.title} 
                    className="w-full h-auto object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  />
                </WigHudFrame>
              </div>
            )}

            <div className="markdown-body mb-8">
              <Markdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => {
                    const src = props.src || "";
                    const fullSrc = src.startsWith('http') ? src : `https://api.whereingames.com${src}`;
                    return (
                      <img 
                        {...props} 
                        src={fullSrc} 
                        className="rounded border border-white/10 my-6 max-w-full h-auto mx-auto block" 
                        loading="lazy"
                      />
                    );
                  }
                }}
              >
                {preprocessMarkdown(post.content_markdown)}
              </Markdown>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="text-[9px] font-black text-white/20 tracking-[0.4em]">
                POST_ID: {post.id.substring(0, 8)}...
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-wig-gold/40 hover:text-wig-gold transition-colors">
                <Download size={14} />
                Download Logs
              </button>
            </div>
          </WigCard>
        </motion.div>
      ))}

      {posts.length === 0 && !error && (
        <div className="text-center py-20 opacity-30 italic">
          Nenhum registro encontrado para esta fonte no momento.
        </div>
      )}
    </div>
  );
};
