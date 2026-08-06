"use client";

import React, { useState, useEffect } from "react";
import { Star, GitFork, Terminal, Search, ArrowUpRight } from "lucide-react";

interface Review {
  tag: string;
  bg: string;
  func: string;
  tech: string;
  scene: string;
  insight: string;
}

interface Repo {
  rank: number;
  name: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  review: Review;
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/j1nkai/github-trending-dashboard/main/data/github-trending-top15.json")
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch((err) => console.error("Failed to load trending data:", err));
  }, []);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(filter.toLowerCase()) ||
      repo.description.toLowerCase().includes(filter.toLowerCase()) ||
      repo.language.toLowerCase().includes(filter.toLowerCase()) ||
      repo.review?.tag.toLowerCase().includes(filter.toLowerCase())
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
          STATUS: <span className="text-[#16A34A] font-bold">ONLINE</span> | NEXT.JS + TAILWIND
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="搜索开源项目、语言、架构标签或关键词..."
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
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-6 rounded-sm transition-all shadow-sm hover:shadow-none relative group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 w-full">
                  <span className="text-xl font-bold text-[#A3A3A3] w-8">
                    {repo.rank < 10 ? `0${repo.rank}` : repo.rank}
                  </span>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-lg text-[#0A0A0A] hover:underline flex items-center gap-1.5"
                      >
                        {repo.name}
                        <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-[#0A0A0A] transition-colors" />
                      </a>
                      <span className="text-xs bg-[#F5F5F5] border border-[#E5E5E5] text-[#525252] px-2 py-0.5 rounded-sm">
                        {repo.review?.tag || repo.language}
                      </span>
                    </div>

                    <p className="text-sm text-[#525252] mt-2 leading-relaxed">
                      {repo.description}
                    </p>

                    {/* AI 洞察分析区块 */}
                    {repo.review && (
                      <div className="mt-4 p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm text-xs space-y-2 text-[#404040]">
                        <div>
                          <span className="font-bold text-[#0A0A0A]">【业务痛点与背景】</span>
                          <p className="mt-0.5 text-[#525252]">{repo.review.bg}</p>
                        </div>
                        <div>
                          <span className="font-bold text-[#0A0A0A]">【核心功能】</span>
                          <p className="mt-0.5 text-[#525252]">{repo.review.func}</p>
                        </div>
                        <div>
                          <span className="font-bold text-[#0A0A0A]">【技术亮点】</span>
                          <p className="mt-0.5 whitespace-pre-line text-[#525252]">{repo.review.tech}</p>
                        </div>
                        <div>
                          <span className="font-bold text-[#0A0A0A]">【适用场景】</span>
                          <p className="mt-0.5 text-[#525252]">{repo.review.scene}</p>
                        </div>
                      </div>
                    )}
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
                  {repo.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks.toLocaleString()}
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
