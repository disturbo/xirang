# 息壤 V9 — AI Agent 协作方法论

> **AI Agent 团队的作战手册。** 定义谁做什么、怎么流转、出错了谁修、怎么证明活干完了。

**在线文档** → [disturbo.github.io/xirang](https://disturbo.github.io/xirang/)  
**部署骨架** → [xirang-starter-Vualt](https://github.com/disturbo/xirang-starter-Vualt)（Clone 即用）

---

## 息壤是什么

息壤是一套**基于 Obsidian Vault 的多智能体协作方法论**，让 6 个 AI Agent 在文件系统上有序协作，产出结构化交付物（PRD、设计方案、代码原型）。

核心设计理念：

- **文件系统即协作黑板** — Agent 通过读写 Markdown 文件协作，一切可审计
- **一个判断统一所有规则** — "这个任务会写文件吗？" 写→声明；不写→直接做
- **第一反射器** — 九源治理巡检 + 独立 runtime checks，验证调度、消费者、效果与新鲜度，区分真静默与假静默
- **自证回归** — harness eval 用 positive/negative fixture 证明门禁、巡检、状态机不会假绿
- **渐进收敛，不强制完全体** — L0~L3 四阶段，按需升级

---

## 核心能力

| 维度 | 说明 |
|:---:|------|
| **角色分工** | 6 个原子 Agent，各有职责边界，不越权不重叠 |
| **流程管道** | 六步流程：拆分 → 计划 → 执行 → 监控 → 检核 → 验收 |
| **通信协议** | CLI 直连（同步）+ Vault 文件（持久化审计）双层 |
| **合规框架** | 二元触发器 + M3/M4/M5 声明 + Gate 门禁自动拦截 |
| **错误处理** | 五级升级链；Phoenix 当前仅为 design/reference，无自动修复执行器 |
| **成本治理** | 预算分级 + 熔断机制 + 可观测周报 |
| **反射器巡检** | `health-latest.json` + `sources_run` 自省，证明系统真的看过 |
| **自证回归** | harness eval、starter strict、review 状态机、Handoff 扫描 |

---

## 版本演进

```
2026-04 ─── V5   单智能体知识库（1人1Agent，纯 prompt）
              │
2026-04 ─── V6   多智能体协作（3 Agent，看板通信）
              │
2026-05 ─── V7   单智能体方法论升级（角色设定 + 工具链）
              │
2026-05 ─── V8   多智能体作战手册（M0-M5 六档 + 生命周期 + 通信协议）
              │
2026-05 ─── V8.5 运行时工具层（Gate 门禁 + 子任务 + 消息队列 + 成本熔断）
              │
2026-05 ─── V9   合规框架重构
              │     ├─ 9.0  二元触发器 + prompt-build 单源分发
              │     ├─ 9.1  自包含重写（脱离 V8 依赖）
              │     ├─ 9.2  完整版（六脉/六步/外部Agent/运行时契约）
              │     ├─ 9.2.1 治理基建闭环（Hook参数化 + 成本三阶段 + 平台能力矩阵）
              │     ├─ 9.3.0 第一反射器入编（常驻巡检 + 自省 + 规范冲突扫描）
              │     ├─ 9.4.0 自证阶段（HITL + eval + starter 泄漏扫描）
              │     ├─ 9.4.1 self-accept 硬门禁（v9_accept + pre-accept）
              │     ├─ 9.4.2 Handoff 状态机 + 工具注册表
              │     └─ 9.4.3 starter strict + review 状态机 + usage token
              ▼
         V9.4.3 · 2026-07-18 runtime recovery
```

### 迭代记录

| 版本 | 日期 | 关键变化 |
|:---:|:---:|------|
| V9.4.3 runtime recovery | 2026-07-18 | 单一 runtime、Codex 适配、Harness hash 新鲜度、知识/熵/成本消费链、Phoenix 设计态降级；不改变方法论版本 |
| V9.4.3 | 2026-06-27 | starter strict 复扫；历史 advisory 降噪；review 状态机补强；usage token 成本最小闭环 |
| V9.4.2 | 2026-06-27 | Handoff 可接手性扫描；第八反射器源；工具注册表；发布与自演进闸口 |
| V9.4.1 | 2026-06-27 | self-accept 硬门禁；`v9_accept`；eval 新鲜度；pre-commit 触发 |
| V9.4.0 | 2026-06-26 | HITL 拍板清单；harness eval-runner；starter 泄漏扫描；任务验收状态 validator |
| V9.3.0 | 2026-06-26 | 第一反射器常驻巡检；`sources_run/sources_failed` 自省；规范冲突扫描；成本真实计费未接入标注 |
| V9.2.6 | 2026-06-09 | OCR vs 多模态识图来源标注铁律 |
| V9.2.1 | 2026-05-31 | Hook 参数化、三阶段成本事件、模型降级链、平台能力矩阵 |

### 关键转折点

| 版本 | 核心突破 | 解决的问题 |
|:---:|------|------|
| V5→V6 | 从单 Agent 到多 Agent | 复杂任务无法由单一角色完成 |
| V6→V7 | 角色设定工程化 | Agent 行为不稳定、产出质量波动 |
| V7→V8 | 六档判定 + 生命周期 | 多 Agent 协作缺乏规则，互相覆盖 |
| V8→V8.5 | Gate 自动门禁 | 人工审查跟不上 Agent 产出速度 |
| V8.5→V9 | 二元触发器替代六档 | 六档判定过重，80%场景不需要 |
| V9.2→V9.3 | 第一反射器接入 | 系统能记录异常，但不能证明自己看过所有巡检源 |
| V9.3→V9.4 | 自证阶段接入 | 系统能看见异常后，还要证明门禁和巡检本身可信 |

---

## 快速开始

### 看文档（2 分钟）

访问 → [disturbo.github.io/xirang](https://disturbo.github.io/xirang/)

### 部署使用

```bash
# 下载 Starter Vault
git clone https://github.com/disturbo/xirang-starter-Vualt.git ~/Desktop/obsidianVault

# 打开 Obsidian → 选择该目录
# 按 Cmd/Ctrl + O → 搜索 "Home"
```

详细部署指南 → [部署页面](https://disturbo.github.io/xirang/deploy/)

---

## 站点结构

```
xirang/
├── index.html              ← 首页（核心创新 + 能力总览）
├── architecture/           ← 架构（四层模型 + 六脉体系 + Agent 拓扑）
├── workflow/               ← 流程（二元触发器 + 档位系统 + 六步管道）
├── agents/                 ← Agent（6 原子角色 + 通信协议）
├── rules/                  ← 规则（8 铁律 + 22 条 Gate 规则）
├── deploy/                 ← 部署（L0-L3 四级交互式指南）
├── cost/                   ← 成本（预算分级 + 熔断 + 事件流）
├── releases/               ← 迭代记录（V9.3.0 起，当前 V9.4.3）
├── _archive/               ← 历史版本（V8.5 回顾）
└── assets/                 ← 共享样式和脚本
```

---

## 运行时工具链

息壤 V9 附带 **30+ 个运行时脚本**（`.standards/` + `02-项目管理/脚本/`），零外部依赖，纯 Python 标准库 + Bash：

| 类别 | 数量 | 代表工具 |
|------|:---:|------|
| 生命周期管理 | 2 | `v8-handshake.sh`、`xirang` CLI |
| Gate 门禁 | 1 | `gate-enforce.py`（4 子命令） |
| 合规扫描 | 6 | `xirang-lint.py`、`frontmatter-lint.py`、`brand-lint.py` ... |
| 子任务与通信 | 3 | `subtask-record.py`、`msg-queue.py`、`spawn-budget-check.py` |
| 成本治理 | 4 | `cost-fuse.py`、`agent-cost-events.py`、`v8-cost-observability.py` ... |
| Hooks | 6 | `pre-write-hook.sh`、`post-write-hook.sh`、`session-guard.sh` ... |
| 可观测性 | 3 | `v8-health-metrics.py`、`error-patterns.py`、`event-rotate.py` |
| 反射器巡检 | 3 | `project-ops-check.py`、`v9-reflex-check.py`、`v9-policy-conflict-check.py` |
| Schema | 3 | `agent-state.schema.json`、`msg-queue.schema.json` ... |

---

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [xirang](https://github.com/disturbo/xirang)（本仓库） | 方法论文档站（GitHub Pages） |
| [xirang-starter-Vualt](https://github.com/disturbo/xirang-starter-Vualt) | 最小化部署骨架（Clone 即用的 Obsidian Vault） |

---

## License

MIT
