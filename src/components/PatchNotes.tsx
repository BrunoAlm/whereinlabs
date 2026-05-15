import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Post, PostsResponse } from "../types";
import { WigCard, WigStatusChip, WigHudFrame } from "./WigUI";
import { AlertCircle, Terminal, Download, Calendar, Timer, Gamepad2 } from "lucide-react";
import { motion } from "motion/react";

export const PatchNotes = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.whereingames.com/v1/content/posts?limit=8");
        if (!response.ok) {
          throw new Error("Falha ao carregar conteúdos");
        }
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatchNotes();
  }, []);

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

  return (
    <div className="space-y-12">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
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

      {posts.length === 0 && (
        <div className="text-center py-20 opacity-30 italic">
          Nenhum registro encontrado no servidor central.
        </div>
      )}
    </div>
  );
};
