<<<<<<< Updated upstream
# lunoralabs
=======
# Lunora BaZi · Lunora Labs

**Lunora BaZi** — Lunora Labs 的八字聊天产品。聊天宠物角色：**小弦**（English: **Nox**）。男女声共用同一角色名。本仓库为 **Demo1** 可点击产品原型（中文优先）。

## Demo1 功能

- 品牌首屏：Lunora BaZi / Lunora Labs；角色小弦（Nox）
- 首次见面：男声 / 女声欢迎语试听（可跳过），设置中可再切换（角色名不变）
- **正确八字门禁**：生辰录入 → 排盘展示 → 用户确认后才进入专属聊天
- 专属聊天 + 快捷提问（今日宜忌 / 事业 / 心事）
- **画面式解读**：八字是不断与外界互动的画；先描述变化，再问是否符合愿望（「美」≠仅安稳）
- **聊天模式**：短、快——变化 / 愿望 / 可做
- **分析模式**：原局画面 → 入画元素 → 变化 → 愿望 → 行动 + 排盘图工具（知识库 A/B/C 边界）
- 知识库：Lunora 八字命理知识体系 v1.0（见 Project `docs/knowledge/`）
- 回答可文字 + Web Speech API 朗读（演示解读标注）
- 轻度外观定制（Mint / Ice / Cyan）
- 浮层小弦挂件感 + 日运主动问候横幅（stub）

**未包含**：麦克风 / 实时语音、完整订阅商城、深度多流派命理引擎。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 设计方向

Revolut / Robinhood 式暗色 fintech：冷静精确、强标题层级、稀疏留白；避免玄学紫 / 奶油庙宇风。角色仍是小弦（Nox）。

## 栈

Next.js · React · TypeScript · Tailwind CSS · Web Speech API（TTS） · Space Grotesk + Noto Sans SC

## 创始人

Qi Wu（GitHub [Jwqoy](https://github.com/Jwqoy)）· Lunora Labs
>>>>>>> Stashed changes
