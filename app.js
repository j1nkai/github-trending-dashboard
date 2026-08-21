// GitHub Trending Dashboard - Cyber-Core Edition
// 安全渲染与性能优化版本

class Dashboard {
  constructor() {
    this.allRepos = [];
    this.cacheKey = 'github-trending-cache';
    this.cacheTTL = 5 * 60 * 1000; // 5分钟缓存
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadData();
  }

  setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }

    // 快捷键 ⌘K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
      }
    });

    // 极简模式切换
    const minimalToggle = document.getElementById('minimalToggle');
    if (minimalToggle) {
      minimalToggle.addEventListener('click', () => this.toggleMinimalMode());
    }
  }

  async loadData() {
    // 尝试从缓存加载
    const cached = this.getFromCache();
    if (cached) {
      this.allRepos = cached;
      this.render(cached);
      return;
    }

    try {
      const response = await fetch('https://raw.githubusercontent.com/j1nkai/github-trending-dashboard/main/data/github-trending-top15.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.allRepos = data;
      this.saveToCache(data);
      this.render(data);
    } catch (err) {
      console.error('Failed to load trending data:', err);
      this.renderError();
    }
  }

  getFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.cacheTTL) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  saveToCache(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save to cache:', e);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  handleSearch(e) {
    const filter = e.target.value.toLowerCase();
    const filtered = this.allRepos.filter(repo => 
      repo.name.toLowerCase().includes(filter) ||
      (repo.description && repo.description.toLowerCase().includes(filter)) ||
      (repo.language && repo.language.toLowerCase().includes(filter)) ||
      (repo.review && repo.review.tag.toLowerCase().includes(filter))
    );
    this.render(filtered);
  }

  toggleMinimalMode() {
    document.body.classList.toggle('minimal-mode');
    const isMinimal = document.body.classList.contains('minimal-mode');
    localStorage.setItem('minimal-mode', isMinimal);
  }

  render(repos) {
    const listEl = document.getElementById('repoList');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (repos.length === 0) {
      listEl.innerHTML = this.createEmptyState();
      lucide.createIcons();
      return;
    }

    repos.forEach((repo, index) => {
      const card = this.createCard(repo, index);
      listEl.appendChild(card);
    });

    lucide.createIcons();
  }

  createEmptyState() {
    return `
      <div class="text-center py-16 text-muted border border-dashed border-border rounded-sm animate-fade-in">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-3 text-muted/50"></i>
        <p>没有找到匹配的项目</p>
      </div>
    `;
  }

  createCard(repo, index) {
    const rankStr = repo.rank < 10 ? `0${repo.rank}` : repo.rank;
    const starCount = repo.stars ? repo.stars.toLocaleString() : '0';
    const forkCount = repo.forks ? repo.forks.toLocaleString() : '0';
    const tag = repo.review?.tag || repo.language || '未知';

    const card = document.createElement('article');
    card.className = 'cyber-card stagger-item group';
    
    // 使用 textContent 防 XSS
    const safeName = this.escapeHtml(repo.name);
    const safeDesc = this.escapeHtml(repo.description || '暂无描述');
    const safeTag = this.escapeHtml(tag);
    const safeLang = this.escapeHtml(repo.language || '未知');

    card.innerHTML = `
      <div class="flex items-start gap-5">
        <div class="flex flex-col items-center">
          <span class="rank-number">${rankStr}</span>
          <div class="w-8 h-px bg-border mt-2 group-hover:bg-ink/30 transition-colors"></div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3 flex-wrap">
            <a href="${repo.url}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 text-lg font-bold text-ink hover:text-accent transition-colors group/link">
              <span class="group-hover/link:underline underline-offset-4">${safeName}</span>
              <i data-lucide="arrow-up-right" class="w-4 h-4 text-muted group-hover/link:text-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all"></i>
            </a>
            
            <span class="tag-pulse inline-flex items-center gap-1.5 text-xs bg-paper border border-border text-muted px-2.5 py-1 rounded-sm font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
              ${safeTag}
            </span>
          </div>

          <p class="text-sm text-muted mt-2 leading-relaxed line-clamp-2">${safeDesc}</p>

          ${this.createReviewHtml(repo.review)}
          
          <div class="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-border/50">
            <span class="inline-flex items-center gap-1.5 text-xs text-muted">
              <span class="w-2 h-2 rounded-full bg-accent"></span>
              ${safeLang}
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs text-muted">
              <i data-lucide="star" class="w-3.5 h-3.5 text-warning"></i>
              ${starCount}
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs text-muted">
              <i data-lucide="git-fork" class="w-3.5 h-3.5"></i>
              ${forkCount}
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs text-muted/60 ml-auto font-mono">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
              TODAY
            </span>
          </div>
        </div>
      </div>
      
      <div class="data-stream"></div>
    `;
    
    return card;
  }

  createReviewHtml(review) {
    if (!review) return '';

    const sections = [
      { icon: 'target', title: '业务痛点与背景', content: review.bg },
      { icon: 'cpu', title: '核心功能', content: review.func },
      { icon: 'sparkles', title: '技术亮点', content: review.tech },
      { icon: 'layout-grid', title: '适用场景', content: review.scene }
    ];

    return `
      <div class="mt-5 space-y-3">
        ${sections.map(({ icon, title, content }) => `
          <div class="insight-block p-3">
            <div class="flex items-center gap-2 mb-1.5">
              <i data-lucide="${icon}" class="w-3.5 h-3.5 text-accent"></i>
              <span class="text-xs font-bold text-ink tracking-wide">${title}</span>
            </div>
            <p class="text-xs text-muted leading-relaxed">${this.escapeHtml(content)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderError() {
    const listEl = document.getElementById('repoList');
    if (!listEl) return;
    
    listEl.innerHTML = `
      <div class="text-center py-16 text-muted border border-dashed border-border rounded-sm">
        <i data-lucide="alert-circle" class="w-8 h-8 mx-auto mb-3 text-muted/50"></i>
        <p>数据加载失败，请稍后重试</p>
      </div>
    `;
    lucide.createIcons();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});
