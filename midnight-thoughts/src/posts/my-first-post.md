---
title: "My First Post"
date: "2024-01-15"
tag: "personal"
---

This is my blog post content...

hello guys whats good 
ith eager: true, the files object no longer contains promises/loaders. Instead, it contains the modules themselves, which hold the raw content. The loader variable in your map becomes the module object, and the raw content is often found under a default or raw property (depending on the exact Vite version/config, but usually the module itself when using { as: "raw" }).