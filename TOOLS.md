# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Obsidian Vault Organization (CRITICAL)

**Lesson Learned (2026-04-23):**
- Before organizing content in Obsidian, ALWAYS traverse existing structure first
- Use `find ~/Documents/Obsidian-Vaults/JK-Knowledge-Network/ -type d -maxdepth 4`
- The vault has a well-defined taxonomy under `🤖 AI Agent/03 - Knowledge/`
- GSD (AI coding framework) → `03.03 - AI-ML/`, NOT root `03 - Resources/`
- Never assume root-level folders are appropriate — check existing categories first

---

## ComfyUI 技能

**生成写实风格图片 (FLUX)**
- Skill: `flux-nsfw-lora-caller`
- 路径: `~/.openclaw/workspace/skills/flux-nsfw-lora-caller/`
- 命令: `flux-nsfw-call "<prompt>" [preset]`
- 基础模型: FLUX.1 Schnell (写实/真人)
- 可用 LoRA: Asian-Girls-Face, Realistic-Style, Lustly-NSFW-v1, CultriX-NSFW-HighRes, Flux-NSFW-Uncensored
- 预设: `asian-realistic`, `nsfw-detailed`, `uncensored`, `default`

**生成 Anime 风格图片 (AnimagineXL)**
- Skill: `anime-nsfw-lora-caller`
- 路径: `~/.openclaw/workspace/skills/anime-nsfw-lora-caller/`
- 命令: `anime-nsfw-call "<prompt>" [preset]`
- 基础模型: AnimagineXL 4.0 (日本 Anime)
- 可用 LoRA: ExpressiveH-Hentai, Nudify-XL, Detail-Tweaker-XL, Anime-Style-Large, Anime-Style-V2
- 预设: `hentai`, `nudify`, `anime-clean`, `anime-v2`, `default`

**LoRA 管理器**
- Skill: `comfyui-lora-manager`
- 路径: `~/.openclaw/workspace/skills/comfyui-lora-manager/`
- 命令: `lora-manager [list|search|download-civitai|download-hf]`
- 功能:
  - `list` — 列出已安装 LoRA (大小、类型)
  - `search <关键词>` — 搜索 CivitAI 上的 LoRA
  - `download-civitai <version_id> [文件名]` — 下载 CivitAI LoRA
  - `download-hf <URL> [文件名]` — 下载 HuggingFace LoRA
- 用法示例:
  ```bash
  lora-manager list
  lora-manager search "asian face"
  lora-manager search "nsfw" --nsfw
  lora-manager download-civitai 135867 "Detail-Tweaker-XL.safetensors"
  lora-manager download-hf "https://hf-mirror.com/.../lora.safetensors"
  ```

**API 端点**
- URL: `http://127.0.0.1:8188`
- 提交: `POST /prompt` (JSON workflow)
- 查询: `GET /history/{prompt_id}`
- 下载: `GET /view?filename=...`

**注意事项**
- FLUX 和 ComfyUI 生成图片时，Gemma 4 需暂停（内存冲突）
- 24GB 内存：Gemma 26B (~15GB) + ComfyUI (~5-8GB) ≈ 20-23GB，刚好够用但不可并发
- 推荐分时复用：聊天时 Gemma，生图时暂停 Gemma

---

**Usage**:
```bash
# Manual cleanup
~/.openclaw/workspace/scripts/agent-browser-cleanup.sh

# Or kill all Chrome Helper processes
ps aux | grep "agent-browser-chrome" | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {} 2>/dev/null
```

**When to use**:
- After using `agent-browser` skill
- When Mac mini temperature is high
- When Load Average > 5
- When CPU idle < 10%

**Symptoms of zombie processes**:
- Multiple `Google Chrome Helper` at 100% CPU
- Fan noise / high temperature
- Load Average > 5

---

## Emby VPS 内网穿透

**Emby 外网 HTTPS 访问地址**: `https://192-220-34-136.sslip.io:8920` (或 `:8443`)
**VPS IP**: `192.220.34.136` (Caddy 反向代理 + SSL)
**本地源站**: `http://192.168.100.25:8096` ("深夜图书馆")
**守护进程**: `scripts/vps-tunnel-daemon.py` (自动重连 SSH 反向隧道 `8096 -> 192.168.100.25:8096`)

---

## 单一旋钮配置系统 (Single-Knob Config) — 借鉴 nanochat

**核心思想**：像 nanochat 的 `--depth` 一样，用一个参数控制所有行为复杂度。

### Depth 映射表

| Depth | 响应速度 | 思考深度 | 工具使用 | 子代理 | 适用场景 |
|-------|---------|---------|---------|--------|---------|
| **minimal** | ⚡ 最快 | 无推理 | 无 | 无 | 快速确认、简单查询、已读不回 |
| **light** | 🔥 快 | 基础推理 | 读文件/搜索 | 无 | 日常问答、信息查找 |
| **medium** | 🚀 标准 | 完整推理 | 全工具链 | 无 | 标准任务、代码修改、文件操作 |
| **deep** | 🧠 深入 | 深度分析 | 全工具链 | 可启动 | 复杂问题、多步骤任务、需要验证 |
| **maximum** | 🔬 极致 | 穷尽分析 | 全工具链 | 多代理 | 研究项目、深度调试、生产级变更 |

### 自动推导规则

```
depth = minimal →
  - 不启用 reasoning
  - 不搜索/不浏览
  - 只读已有记忆
  - 单行回复优先

depth = light →
  - 基础推理 (thinking=off 或 minimal)
  - 可用搜索、读文件
  - 不启动子代理
  - 简要回复

depth = medium →
  - 标准推理 (thinking=medium)
  - 全工具链可用
  - 不启动子代理（除非明确请求）
  - 详细回复，但不过度

depth = deep →
  - 深度推理 (thinking=on 或 deep)
  - 全工具链可用
  - 可启动子代理进行并行分析
  - 详尽回复，包含验证步骤

depth = maximum →
  - 穷尽推理 (thinking=on 或 maximum)
  - 全工具链 + 多代理协作
  - 全面验证、回滚方案
  - 适合生产级变更
```

### 使用方式

主人可以在消息中指定：
- `"快速确认一下..."` → depth=minimal
- `"简单查一下..."` → depth=light
- `"帮我处理这个..."` → depth=medium (默认)
- `"深入研究一下..."` → depth=deep
- `"全面审查并给出方案..."` → depth=maximum

雷姆自动识别语境并选择 depth，无需主人显式指定。

---

## 工具降级链 (Graceful Degradation) — 借鉴 nanochat FA3→SDPA

**核心思想**：不假设所有工具都可用，定义明确的降级路径。

### Web 内容获取降级链

```
1. browser (agent-browser skill)
   → JavaScript 渲染，最佳体验
   ↓ 如果不可用/失败

2. browser (普通 Chrome profile)
   → 标准页面加载
   ↓ 如果不可用/失败

3. web_fetch (Playwright 渲染)
   → 中等质量，无 JS 执行
   ↓ 如果不可用/失败

4. web_fetch (纯文本)
   → 快速提取，可能丢失格式
   ↓ 如果不可用/失败

5. web_search (搜索引擎摘要)
   → 最快，但信息有限
   ↓ 如果不可用/失败

6. 告知用户：无法获取该内容
```

### 图片生成降级链

```
1. ComfyUI (FLUX.1 + LoRA)
   → 最高质量，本地 GPU
   ↓ 如果内存不足/冲突

2. ComfyUI (简化工作流)
   → 减少 LoRA 数量，降低分辨率
   ↓ 如果 ComfyUI 未启动

3. 告知用户：需要启动 ComfyUI 或降低要求
```

### 代码执行降级链

```
1. exec (本地 shell，有所有工具)
   → 完整环境，可读写文件
   ↓ 如果权限不足

2. exec (sandbox)
   → 隔离环境，安全但受限
   ↓ 如果 sandbox 不可用

3. 告知用户：需要手动执行或提升权限
```

### 降级规则

- **自动降级**：当首选工具失败时，自动尝试下一个
- **通知用户**：降级时简要说明原因（如 "browser 不可用，使用 web_fetch 替代"）
- **记录降级**：在 memory 中记录降级事件，用于后续优化
- **不无限降级**：最多 3 次降级，然后告知用户失败

---

## 工具可用性检查清单

```
每次 session 启动时快速检查：
□ browser 可用？（检查 agent-browser skill）
□ web_search 可用？（检查搜索 provider）
□ mac-system-control 可用？（检查 AppleScript 权限）
□ ComfyUI 运行中？（检查 http://127.0.0.1:8188）
□ Git 仓库状态？（git status）
□ Obsidian 同步可用？（检查 obsidian-bridge）
```

