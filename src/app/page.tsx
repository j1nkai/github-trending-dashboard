"use client";

import React, { useState } from "react";
import { Star, GitFork, Terminal, Search, ArrowUpRight } from "lucide-react";

interface Repo {
  rank: number;
  name: string;
  author: string;
  url: string;
  description: string;
  language: string;
  stars: string;
  forks: string;
  todayStars: string;
  avatar: string;
}

const SAMPLE_REPOS: Repo[] = [
  {
    rank: 1,
    name: "openclaw",
    author: "openclaw",
    url: "https://github.com/openclaw/openclaw",
    description: "自主 AI Agent 框架，专注于本地私有化控制与多模态自动化工作流。",
    language: "TypeScript",
    stars: "14,230",
    forks: "1,820",
    todayStars: "+412 stars today",
    avatar: "https://github.com/openclaw.png",
  },
  {
    rank: 2,
    name: "tailwindcss",
    author: "tailwindcss",
    url: "https://github.com/tailwindcss/tailwindcss",
    description: "原子化 CSS 框架，基于下一代高性能 Rust 引擎构建，极速响应 UI 迭代。",
    language: "Rust",
    stars: "83,500",
    forks: "4,100",
    todayStars: "+289 stars today",
    avatar: "https://github.com/tailwindcss.png",
  },
  {
    rank: 3,
    name: "next.js",
    author: "vercel",
    url: "https://github.com/vercel/next.js",
    description: "React 现代化全栈框架，支持 App Router 与极速静态导出 (SSG/ISR)。",
    language: "TypeScript",
    stars: "125,400",
    forks: "26,100",
    todayStars: "+195 stars today",
    avatar: "https://github.com/vercel.png",
  }
];

export default function Home() {
  const [filter, setFilter] = useState("");

  const filteredRepos = SAMPLE_REPOS.filter(
    (repo) =>
      repo.name.toLowerCase().includes(filter.toLowerCase()) ||
      repo.description.toLowerCase().includes(filter.toLowerCase()) ||
      repo.language.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] font-mono selection:bg-[#E5E5E5] p-6 md:p-12">
      {/* Header */}
      <header className="max-w-5xl mx-auto border-b border-[#E5E5E5] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-1">
            <Terminal className="w-4 h-4" />
            <span>JAPANESE CYBER-CORE / PAPER PRINT EDITION</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">
            GitHub Daily Trending Top 15
          </h1>
        </div>
        <div className="text-xs text-[#737373] bg-[#F5F5F5] border border-[#E5E5E5] px-3 py-1.5 rounded-sm">
          STATUS: <span className="text-[#16A34A] font-bold">ONLINE</span> | SYNC: 2026-08-06
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="搜索项目、语言或关键词..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white border border-[#E5E5E5] pl-9 pr-4 py-2 text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#0A0A0A] rounded-sm transition-colors"
          />
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.rank}
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-5 rounded-sm transition-all shadow-sm hover:shadow-none relative group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-xl font-bold text-[#A3A3A3] w-6">
                    0{repo.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={repo.avatar}
                        alt={repo.author}
                        className="w-5 h-5 rounded-full border border-[#E5E5E5] object-cover object-center"
                      />
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-base text-[#0A0A0A] hover:underline flex items-center gap-1"
                      >
                        {repo.author} / <span className="font-bold">{repo.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                    <p className="text-sm text-[#525252] mt-2 max-w-2xl leading-relaxed">
                      {repo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-[#F5F5F5] text-xs text-[#737373]">
                <span className="flex items-center gap-1 bg-[#F5F5F5] px-2 py-0.5 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#D97706]" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks}
                </span>
                <span className="text-[#16A34A] font-medium ml-auto">
                  {repo.todayStars}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-12 pt-6 border-t border-[#E5E5E5] text-xs text-[#A3A3A3] flex justify-between items-center">
        <span>Powered by Next.js & Tailwind CSS | OpenClaw Architecture</span>
        <span>Paper-texture Cyber-Core Aesthetic</span>
      </footer>
    </div>
  );
}
