import React, { useState, useEffect } from "react";
import { Coffee, Moon, Sun, Terminal, Search } from "lucide-react";
// If you want to load from JSON later, create src/posts.json and uncomment:
import postsJSON from "./posts.json";

export default function MinimalBlog() {
  // THEME
  const [darkMode, setDarkMode] = useState(true);

  // POSTS (fallback to inline array; easy to swap to JSON later)
  const inlinePosts = [
    {
      id: 1,
      title: "why i think at 3am better than 3pm",
      date: "nov 8",
      content:
        "there's something about the quiet of 3am that just hits different. no notifications, no people, just me and my thoughts. it's like the world is on mute and suddenly all my best ideas show up uninvited. is this healthy? probably not. do i care? also probably not.",
      tag: "thoughts",
    },
    {
      id: 2,
      title: "my coffee dependency: a timeline",
      date: "nov 5",
      content:
        "age 15: coffee is gross. age 18: ok maybe one cup. age 20: two cups. age 22: i've lost count and my blood type is now espresso. age 25: i am the coffee. there's no going back. send help (but make it iced).",
      tag: "life",
    },
    {
      id: 3,
      title: "the art of pretending to be productive",
      date: "nov 2",
      content:
        "opened my laptop 4 hours ago. stared at the screen. rearranged my desk. made coffee. checked the time. it's been 4 hours. i've done nothing except convince myself that 'thinking about doing it' counts as progress. it doesn't. but tomorrow is a new day to repeat this exact cycle.",
      tag: "mood",
    },
    {
      id: 4,
      title: "introvert survival guide",
      date: "oct 30",
      content:
        "someone: 'let's hang out!' me: 'sounds good!' also me: *immediately starts planning excuses for 3 days from now* it's not that i don't like people. i just like the idea of people more than actual people. is that weird? don't answer that.",
      tag: "social",
    },
  ];

  // Use JSON if you add it, else inline:
  // const blogPosts = inlinePosts; // or: postsJSON
  const blogPosts = postsJSON;

  // UI STATE
  const [selectedPost, setSelectedPost] = useState(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // FILTER + SEARCH
  const tags = ["all", ...new Set(blogPosts.map((p) => p.tag))];
  const filtered = blogPosts.filter((p) => {
    const q = query.trim().toLowerCase();
    const inTitle = p.title.toLowerCase().includes(q);
    const inContent = p.content.toLowerCase().includes(q);
    const matchesQuery = !q || inTitle || inContent;
    const matchesTag = tagFilter === "all" || p.tag === tagFilter;
    return matchesQuery && matchesTag;
  });

  // PAGINATION
  const PAGE_SIZE = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  useEffect(() => {
    // reset to first page when filters/search change
    setCurrentPage(1);
  }, [query, tagFilter]);

  // STARFIELD — dark mode only
  const [stars, setStars] = useState([]);
  useEffect(() => {
    if (!darkMode) { setStars([]); return; }
    const newStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, [darkMode]);

  return (
    <div className={darkMode ? "min-h-screen bg-black text-gray-300" : "min-h-screen bg-gray-50 text-gray-900"}>
      {/* Starfield background (dark only) */}
      {darkMode && stars.map((star) => (
        <div
          key={star.id}
          className="fixed rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle 3s ease-in-out infinite` ,
            animationDelay: `${star.delay}s`,
            zIndex: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.3;} 50%{opacity:1;} }
      `}</style>
      {/* Header */}
      <header className={darkMode ? "relative z-10 border-b border-gray-800" : "relative z-10 border-b border-gray-200 bg-white/60 backdrop-blur"}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Terminal className={darkMode ? "w-5 h-5 sm:w-6 sm:h-6 text-gray-500" : "w-5 h-5 sm:w-6 sm:h-6 text-gray-600"} />
              <h1 className={darkMode ? "text-2xl sm:text-3xl font-bold text-white" : "text-2xl sm:text-3xl font-bold text-gray-900"}>
                midnight.thoughts
              </h1>
            </div>
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={darkMode ? "shrink-0 rounded-full p-2 border border-gray-700 hover:scale-105 transition" : "shrink-0 rounded-full p-2 border border-gray-300 hover:scale-105 transition bg-white shadow-sm"}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* profile metadata */}
          <div className={darkMode ? "flex items-center gap-4 text-xs sm:text-sm text-gray-500" : "flex items-center gap-4 text-xs sm:text-sm text-gray-600"}>
            <div className={darkMode ? "w-8 h-8 rounded-full bg-gray-700/40 grid place-items-center" : "w-8 h-8 rounded-full bg-gray-200 grid place-items-center shadow-inner"}>☕</div>
            <p>/ just a guy writing stuff when he should be sleeping</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search + filters (only on list view) */}
        {!selectedPost && (
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className={darkMode ? "w-full pl-9 pr-4 py-2 rounded-md border bg-black/40 border-gray-800 text-gray-300" : "w-full pl-9 pr-4 py-2 rounded-md border bg-white border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(t)}
                  className={tagFilter === t
                    ? (darkMode ? "px-3 py-1 rounded-full border text-xs uppercase tracking-wider bg-gray-800 border-gray-700 text-white" : "px-3 py-1 rounded-full border text-xs uppercase tracking-wider bg-gray-900 text-white border-gray-900")
                    : (darkMode ? "px-3 py-1 rounded-full border text-xs uppercase tracking-wider border-gray-800 text-gray-400 hover:text-gray-200" : "px-3 py-1 rounded-full border text-xs uppercase tracking-wider border-gray-300 text-gray-600 hover:text-gray-900 bg-white")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {!selectedPost ? (
          <div className="space-y-6 sm:space-y-8">
            {paginated.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={darkMode
                  ? "border border-gray-800 rounded-lg p-4 sm:p-6 cursor-pointer transition-all group backdrop-blur-sm bg-black/50 hover:border-gray-700 hover:-translate-y-1"
                  : "border border-gray-200 rounded-lg p-4 sm:p-6 cursor-pointer transition-all group bg-white hover:border-gray-300 hover:-translate-y-1 shadow-sm hover:shadow-md"}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h2 className={darkMode ? "text-lg sm:text-xl font-semibold text-white group-hover:text-gray-300" : "text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-gray-700"}>
                    {post.title}
                  </h2>
                  <span className={darkMode ? "text-xs uppercase tracking-wider whitespace-nowrap text-gray-500" : "text-xs uppercase tracking-wider whitespace-nowrap text-gray-500"}>
                    {post.tag}
                  </span>
                </div>
                <p className={darkMode ? "text-xs text-gray-600 mb-3" : "text-xs text-gray-500 mb-3"}>{post.date}</p>
                <p className={darkMode ? "text-sm text-gray-400 line-clamp-2" : "text-sm text-gray-700 line-clamp-2"}>
                  {post.content}
                </p>
              </article>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={currentPage === n
                      ? (darkMode ? "px-3 py-1 rounded-md border bg-gray-800 border-gray-700 text-white" : "px-3 py-1 rounded-md border bg-gray-900 text-white border-gray-900")
                      : (darkMode ? "px-3 py-1 rounded-md border border-gray-800 text-gray-400 hover:text-gray-200" : "px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 bg-white")}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedPost(null)}
              className={darkMode ? "mb-6 text-sm text-gray-500 hover:text-gray-300" : "mb-6 text-sm text-gray-600 hover:text-gray-900"}
            >
              ← back
            </button>
            <article
              className={darkMode ? "border border-gray-800 rounded-lg p-6 sm:p-8 backdrop-blur-sm bg-black/50" : "border border-gray-200 rounded-lg p-6 sm:p-8 bg-white shadow-sm"}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={darkMode ? "text-xs uppercase tracking-wider border px-3 py-1 rounded-full text-gray-500 border-gray-800" : "text-xs uppercase tracking-wider border px-3 py-1 rounded-full text-gray-600 border-gray-300 bg-white"}>
                    {selectedPost.tag}
                  </span>
                  <span className={darkMode ? "text-xs text-gray-600" : "text-xs text-gray-500"}>
                    {selectedPost.date}
                  </span>
                </div>
                <h1 className={darkMode ? "text-2xl sm:text-3xl font-bold text-white mb-6" : "text-2xl sm:text-3xl font-bold text-gray-900 mb-6"}>
                  {selectedPost.title}
                </h1>
              </div>
              <div className="prose max-w-none">
                <p className={darkMode ? "text-gray-300 leading-relaxed" : "text-gray-800 leading-relaxed"}>
                  {selectedPost.content}
                </p>
              </div>
            </article>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={darkMode ? "relative z-10 border-t mt-12 sm:mt-20 border-gray-800" : "relative z-10 border-t mt-12 sm:mt-20 border-gray-200 bg-white/60 backdrop-blur"}>
        <div
          className={darkMode ? "max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-600" : "max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500"}
        >
          <p>made with coffee and poor sleep decisions</p>
          <Coffee className="w-4 h-4" />
        </div>
      </footer>
    </div>
  );
}
