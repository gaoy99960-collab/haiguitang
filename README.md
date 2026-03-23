# AI 海龟汤

一款 AI 驱动的海龟汤推理游戏。玩家选择谜题，通过向 AI 主持人提问来推理出隐藏真相，AI 只回答"是""否""无关"。

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- DeepSeek API（兼容 OpenAI 格式）

## 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 API Key
```

### 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_AI_API_KEY` | DeepSeek API Key | （必填） |
| `VITE_AI_BASE_URL` | API 地址 | `https://api.deepseek.com/v1` |
| `VITE_AI_MODEL` | 模型名称 | `deepseek-chat` |

```bash
# 启动开发服务器
npm run dev
```

## 项目结构

```
src/
├── components/     # 可复用组件
├── hooks/          # 自定义 Hooks
├── pages/          # 页面组件
├── services/       # AI API 服务
├── data/           # 题库数据
└── types/          # TypeScript 类型
```
