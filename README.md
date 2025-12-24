# 哲学家群聊应用

一个基于 AI 的多角色思想碰撞系统，让马克思、韦伯、福柯、哈耶克、尼采五位哲学家在群聊中展开讨论。

## 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 后端：FastAPI + Python
- LLM：DeepSeek API

## 本地开发

### 第一步：配置后端

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境（Windows）：
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. **重要：配置 API Key**
   - 打开 `backend/.env` 文件（如果不存在，复制 `.env.example` 并重命名为 `.env`）
   - 将 `your_deepseek_api_key_here` 替换为你的 DeepSeek API Key

5. 启动后端：
```bash
uvicorn app.main:app --reload --port 8000
```

看到 `Uvicorn running on http://127.0.0.1:8000` 说明后端启动成功。

### 第二步：配置前端

1. 打开**新的** PowerShell 窗口，进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动前端：
```bash
npm run dev
```

看到 `Local: http://localhost:3000` 说明前端启动成功。

### 第三步：使用

1. 打开浏览器访问：http://localhost:3000
2. 输入你的想法或研究问题
3. 点击"发送"，等待哲学家们展开讨论

## 部署（免费方案）

### 后端部署到 Railway

1. 访问 https://railway.app，用 GitHub 账号登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库，Root Directory 设为 `backend`
4. 在 Variables 中添加环境变量：
   - `DEEPSEEK_API_KEY`: 你的 DeepSeek API Key
   - `DEEPSEEK_API_BASE`: `https://api.deepseek.com`
   - `DEEPSEEK_MODEL`: `deepseek-chat`
5. Railway 会自动部署，完成后会提供一个 URL（如 `https://xxx.railway.app`）

### 前端部署到 Vercel

1. 访问 https://vercel.com，用 GitHub 账号登录
2. 点击 "Add New Project" → 导入你的 GitHub 仓库
3. Root Directory 设为 `frontend`
4. 在 Environment Variables 中添加：
   - `VITE_API_BASE_URL`: 你的 Railway 后端 URL
5. Vercel 会自动部署，完成后会提供一个 URL

## 注意事项

1. **DeepSeek API Key**：确保在 `.env` 文件或 Railway 环境变量中正确配置
2. **CORS**：后端已配置允许所有来源，生产环境建议限制为 Vercel 域名
3. **费用**：Railway 免费额度每月 500 小时，Vercel 免费版通常足够使用

## 项目结构

```
tarot/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 入口
│   │   ├── models/              # 数据模型
│   │   ├── services/            # 业务逻辑
│   │   └── api/                 # API 路由
│   ├── requirements.txt
│   └── .env                     # 环境变量（需要配置）
├── frontend/
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

