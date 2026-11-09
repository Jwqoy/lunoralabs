# Lunora BaZi · Lunora Labs

**Lunora BaZi** — Lunora Labs 的八字聊天产品。角色：**小弦**（English: **Nox**），男女声共用同一角色名。本仓库为 **Demo1** 可点击原型（中文优先）。

## Demo1

- 品牌首屏：Lunora BaZi / Lunora Labs；角色小弦（Nox）
- 声音试听 → 生辰录入 → **确认四柱后才进入聊天**
- **排盘引擎**：`lunar-javascript` 节气定月；默认晚子时（23点）换日，对齐问真八字；可切换午夜换日
- **画面式解读**：先看变化，再问是否符合愿望（「美」≠仅安稳）
- **聊天模式** / **分析模式**（排盘图 · 五行势能 · 关系工具）
- Web Speech API 朗读；软性 Download App CTA（海外 Web 先粘性）

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

校验排盘金标用例：

```bash
npm run test:bazi
```

## 排盘口径（Demo1）

| 项 | 默认 |
| --- | --- |
| 历法 | 公历输入 |
| 月柱 | 二十四节气 |
| 子时 | 晚子时换日（23:00） |
| 真太阳时 | 未按经纬度校正（用钟表时间） |

## 设计

温暖米白 journaling 风（`#F8F7F3` + sage），传统四柱竖排 + 五行色。

## 栈

Next.js · React · TypeScript · Tailwind · `lunar-javascript` · Web Speech API

## 创始人

Qi Wu（GitHub [Jwqoy](https://github.com/Jwqoy)）· Lunora Labs
