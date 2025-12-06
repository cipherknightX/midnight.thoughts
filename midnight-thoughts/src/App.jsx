import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Moon, Sun, Terminal, Search, Coffee, Calendar, Tag } from "lucide-react";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [stars, setStars] = useState([]);

  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  const PAGE_SIZE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Load all markdown posts
  useEffect(() => {
    const files = import.meta.glob("./posts/*.md", { as: "raw", eager: true });

    console.log("📁 Files found:", Object.keys(files));

    const load = async () => {
      try {
        const loaded = await Promise.all(
          Object.entries(files).map(async ([path, content]) => {
            console.log("📄 Processing:", path);
            
            const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
            const match = content.match(frontmatterRegex);
            
            let data = {};
            let markdownContent = content;
            
            if (match) {
              const frontmatter = match[1];
              markdownContent = match[2];
              
              frontmatter.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                  const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                  data[key.trim()] = value;
                }
              });
            }

            return {
              ...data,
              content: markdownContent,
              slug: path.split("/").pop().replace(".md", ""),
            };
          })
        );

        console.log("✅ Loaded posts:", loaded);
        loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(loaded);
      } catch (err) {
        console.error("❌ Error loading posts:", err);
      }
    };

    load();
  }, []);

  const tags = ["all", ...new Set(posts.map((p) => p.tag))];

  const filtered = posts.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);

    const matchesTag = tagFilter === "all" || p.tag === tagFilter;

    return matchesQuery && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, tagFilter]);

  useEffect(() => {
    if (!darkMode) return setStars([]);

    const stars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 3,
    }));

    setStars(stars);
  }, [darkMode]);

  return (
    <div className={darkMode ? "min-h-screen bg-black text-gray-300" : "min-h-screen bg-gray-50 text-gray-900"}>
      {/* ✨ Enhanced Starfield */}
      {darkMode &&
        stars.map((star) => (
          <div
            key={star.id}
            className="fixed rounded-full bg-white pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: "twinkle 3s ease-in-out infinite",
              animationDelay: `${star.delay}s`,
              zIndex: 0,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.3)`,
            }}
          />
        ))}

      <style>{`
        @keyframes twinkle { 
          0%,100%{opacity:.3} 
          50%{opacity:1} 
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* ✨ Header */}
      <header
        className={
          darkMode
            ? "relative z-10 border-b border-gray-800/50 backdrop-blur-sm bg-black/30"
            : "relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm"
        }
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:opacity-100 transition-all group-hover:scale-110" />
              <h1 className="text-2xl sm:text-3xl font-bold">
                midnight.thoughts
              </h1>
            </div>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className={
                darkMode
                  ? "p-2 rounded-full border border-gray-700 hover:border-gray-500 hover:scale-110 transition-all duration-300"
                  : "p-2 rounded-full border border-gray-300 hover:border-gray-500 hover:scale-110 transition-all duration-300"
              }
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity">
            {/* <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-600/30 flex-shrink-0"></div> */}
            <span className="leading-tight">/ just a guy writing stuff when he should be sleeping</span>
          </div>
        </div>
      </header>

      {/* ✨ Main */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {!selectedPost && (
          <>
            {/* ✨ Search */}
            <div className="relative mb-4 sm:mb-6 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 w-4 h-4 transition-opacity" />
              <input
                className={
                  darkMode
                    ? "w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-lg bg-black/40 border border-gray-800 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/50 outline-none transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/50 text-sm sm:text-base"
                    : "w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/20 outline-none transition-all duration-300 hover:border-gray-400 hover:shadow-lg text-sm sm:text-base"
                }
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* ✨ Tags */}
            <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(t)}
                  className={
                    tagFilter === t
                      ? darkMode
                        ? "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-800 text-white text-xs font-medium transform hover:scale-105 transition-all duration-300 shadow-lg shadow-gray-900/50"
                        : "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-900 text-white text-xs font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
                      : darkMode
                      ? "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-700 text-xs opacity-70 hover:opacity-100 hover:border-gray-600 hover:scale-105 transition-all duration-300 hover:shadow-md hover:shadow-gray-900/50"
                      : "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 text-xs opacity-70 hover:opacity-100 hover:border-gray-400 hover:scale-105 transition-all duration-300 hover:shadow-md"
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* ✨ Posts List */}
            <div className="space-y-4 sm:space-y-6">
              {paginated.map((post, idx) => (
                <article
                  key={post.slug}
                  onClick={() => setSelectedPost(post)}
                  className={
                    darkMode
                      ? "border border-gray-800 p-4 sm:p-6 rounded-xl bg-black/40 backdrop-blur-sm cursor-pointer hover:border-gray-700 hover:shadow-2xl hover:shadow-gray-900/50 transform hover:-translate-y-1 transition-all duration-300 group animate-slide-up"
                      : "border border-gray-200 p-4 sm:p-6 rounded-xl bg-white cursor-pointer hover:border-gray-300 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group animate-slide-up"
                  }
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 opacity-60" />
                      <span className="text-xs font-medium opacity-80">
                        {post.tag}
                      </span>
                    </div>
                    <span className="text-xs opacity-40">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 opacity-60" />
                      <span className="text-xs opacity-60">{post.date}</span>
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-all">
                    {post.title}
                  </h2>

                  <p className="text-sm opacity-70 line-clamp-2 group-hover:opacity-90 transition-opacity">
                    {post.content.replace(/[#*\[\]]/g, '').slice(0, 120)}...
                  </p>

                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                    <span>Read more</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </article>
              ))}
            </div>

            {/* ✨ Pagination */}
            <div className="flex justify-center gap-2 mt-8 sm:mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={
                    currentPage === n
                      ? darkMode
                        ? "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-800 text-white font-medium transform hover:scale-105 transition-all duration-300 shadow-lg shadow-gray-900/50 text-sm"
                        : "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-900 text-white font-medium transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                      : darkMode
                      ? "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-700 opacity-70 hover:opacity-100 hover:border-gray-600 transform hover:scale-105 transition-all duration-300 hover:shadow-md hover:shadow-gray-900/50 text-sm"
                      : "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 opacity-70 hover:opacity-100 hover:border-gray-400 transform hover:scale-105 transition-all duration-300 hover:shadow-md text-sm"
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ✨ Single Post View */}
        {selectedPost && (
          <div className="animate-slide-up">
            <button 
              className={
                darkMode
                  ? "mb-6 sm:mb-8 opacity-70 hover:opacity-100 flex items-center gap-2 group transition-all text-sm sm:text-base"
                  : "mb-6 sm:mb-8 opacity-70 hover:opacity-100 flex items-center gap-2 group transition-all text-sm sm:text-base"
              }
              onClick={() => setSelectedPost(null)}
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>back</span>
            </button>

            <article
              className={
                darkMode
                  ? "border border-gray-800 p-6 sm:p-8 lg:p-12 rounded-2xl bg-black/40 backdrop-blur-sm shadow-2xl shadow-gray-900/50"
                  : "border border-gray-200 p-6 sm:p-8 lg:p-12 rounded-2xl bg-white shadow-2xl"
              }
            >
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <span className={
                    darkMode
                      ? "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-700 text-xs bg-gray-800/50 font-medium"
                      : "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-300 text-xs bg-gray-100 font-medium"
                  }>
                    {selectedPost.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs opacity-60">
                    <Calendar className="w-3 h-3" />
                    {selectedPost.date}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 sm:mt-4">
                  {selectedPost.title}
                </h1>
              </div>

              {/* ✅ Render Markdown */}
              <div className={darkMode ? "prose prose-sm sm:prose-base prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-gray-400 prose-a:no-underline hover:prose-a:text-gray-200 prose-strong:text-gray-200 prose-code:text-gray-300 prose-code:bg-gray-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:text-sm" : "prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-gray-700 hover:prose-a:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:text-sm"}>
                <ReactMarkdown>
                  {selectedPost.content}
                </ReactMarkdown>
              </div>
            </article>
          </div>
        )}
      </main>

      {/* ✨ Footer */}
      <footer
        className={
          darkMode
            ? "border-t border-gray-800/50 py-8 sm:py-10 text-center opacity-70 hover:opacity-100 transition-opacity backdrop-blur-sm"
            : "border-t border-gray-200 py-8 sm:py-10 text-center opacity-70 hover:opacity-100 transition-opacity"
        }
      >
        <p className="flex items-center justify-center gap-2 group text-xs sm:text-sm px-4">
          <span>made with overthinking and poor sleep decisions</span>
          <Coffee className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform flex-shrink-0" />
        </p>
      </footer>
    </div>
  );
}