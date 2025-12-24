# 部署指南 - 免费方案

## 部署方案（完全免费）

### 方案一：Railway + Vercel（推荐）

#### 1. 后端部署到 Railway

1. **注册账号**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录（如果没有 GitHub，先注册一个）

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 授权 Railway 访问你的 GitHub
   - 选择你的仓库

3. **配置项目**
   - 在项目设置中，找到 "Settings" → "Root Directory"
   - 设置为 `backend`
   - 在 "Variables" 中添加环境变量：
     ```
     DEEPSEEK_API_KEY=你的DeepSeek_API_Key
     DEEPSEEK_API_BASE=https://api.deepseek.com
     DEEPSEEK_MODEL=deepseek-chat
     ```

4. **部署**
   - Railway 会自动检测到 Python 项目并开始部署
   - 等待部署完成（通常 2-3 分钟）
   - 部署完成后，Railway 会提供一个 URL（如 `https://xxx.railway.app`）
   - **重要**：复制这个 URL，后面会用到

#### 2. 前端部署到 Vercel

1. **注册账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "Add New Project"
   - 导入你的 GitHub 仓库
   - 在 "Root Directory" 中设置为 `frontend`

3. **配置环境变量**
   - 在项目设置中，找到 "Environment Variables"
   - 添加：
     ```
     VITE_API_BASE_URL=你的Railway后端URL
     ```
   - 例如：`VITE_API_BASE_URL=https://xxx.railway.app`

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（通常 1-2 分钟）
   - 部署完成后，Vercel 会提供一个 URL（如 `https://xxx.vercel.app`）

5. **访问网站**
   - 打开 Vercel 提供的 URL
   - 你的网站就可以访问了！

---

### 方案二：Render（备选）

如果 Railway 有问题，可以用 Render：

#### 后端部署到 Render

1. 访问 https://render.com，注册账号
2. 点击 "New" → "Web Service"
3. 连接 GitHub 仓库
4. 设置：
   - Name: `philosopher-chat-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 添加环境变量（同 Railway）
6. 部署

#### 前端部署到 Render

1. 点击 "New" → "Static Site"
2. 连接 GitHub 仓库
3. 设置：
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. 添加环境变量：
   - `VITE_API_BASE_URL`: 你的 Render 后端 URL
5. 部署

---

## 部署前准备

### 1. 确保代码已推送到 GitHub

```bash
# 在项目根目录
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 检查文件

确保以下文件存在：
- `backend/.env`（不要提交到 GitHub，只在本地）
- `backend/requirements.txt`
- `backend/Procfile`
- `frontend/package.json`
- `frontend/vite.config.ts`

---

## 部署后检查

1. **后端检查**
   - 访问 `https://你的railway地址/api/health`
   - 应该返回 `{"status":"ok"}`

2. **前端检查**
   - 访问 Vercel 提供的 URL
   - 应该能看到界面
   - 尝试发送一条消息测试

---

## 常见问题

### 问题1：前端无法连接后端
- 检查 `VITE_API_BASE_URL` 环境变量是否正确
- 检查后端 URL 是否以 `https://` 开头（不是 `http://`）

### 问题2：后端启动失败
- 检查 Railway 的日志（Logs 标签）
- 确认环境变量已正确设置
- 确认 `DEEPSEEK_API_KEY` 是正确的

### 问题3：CORS 错误
- 后端已配置允许所有来源，应该不会有问题
- 如果还有问题，检查后端日志

---

## 费用说明

- **Railway**：免费额度每月 500 小时，足够使用
- **Vercel**：免费版完全够用
- **总计**：完全免费！

---

## 分享给朋友

部署完成后，把 Vercel 提供的 URL 分享给朋友就可以了！
