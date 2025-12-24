# 🚀 使用 Render 部署 - 超简单！

## 为什么选择 Render？

- ✅ 比 Railway 更简单，配置更少
- ✅ 自动检测 Python 项目
- ✅ 界面更清晰
- ✅ 完全免费（免费版够用）

---

## 第一步：注册 Render（2分钟）

1. **打开浏览器，访问：https://render.com**
2. **点击右上角 "Get Started for Free"（免费开始）**
3. **选择 "Sign up with GitHub"（用 GitHub 登录）**
4. **授权 Render 访问你的 GitHub 账号**

---

## 第二步：创建 Web Service（5分钟）

1. **登录后，点击 "New +" 按钮（在右上角）**
2. **选择 "Web Service"（Web 服务）**

3. **连接 GitHub 仓库：**
   - 在 "Connect a repository" 部分
   - 找到并选择你的 `philosopher-chat` 仓库
   - 点击 "Connect"

4. **配置服务：**
   - **Name（名称）**：`philosopher-chat-backend`（或你喜欢的名字）
   - **Region（区域）**：选择 `Singapore` 或 `Oregon`（离中国近）
   - **Branch（分支）**：`main`
   - **Root Directory（根目录）**：`backend` ⚠️ **重要！**
   - **Runtime（运行时）**：`Python 3`（会自动检测）
   - **Build Command（构建命令）**：`pip install -r requirements.txt`（会自动填充）
   - **Start Command（启动命令）**：`uvicorn app.main:app --host 0.0.0.0 --port $PORT`（会自动填充）

5. **点击 "Create Web Service"（创建 Web 服务）**

---

## 第三步：添加环境变量（2分钟）

1. **在服务页面，找到左侧菜单**
2. **点击 "Environment"（环境变量）**
3. **点击 "Add Environment Variable"（添加环境变量）**

4. **添加第一个变量：**
   - **Key**：`DEEPSEEK_API_KEY`
   - **Value**：`sk-27b719807adf432a977ace6fdfb58d59`
   - 点击 **"Save Changes"**

5. **再次点击 "Add Environment Variable"，添加第二个：**
   - **Key**：`DEEPSEEK_API_BASE`
   - **Value**：`https://api.deepseek.com`
   - 点击 **"Save Changes"**

6. **再次点击 "Add Environment Variable"，添加第三个：**
   - **Key**：`DEEPSEEK_MODEL`
   - **Value**：`deepseek-chat`
   - 点击 **"Save Changes"**

---

## 第四步：等待部署（3分钟）

1. **添加环境变量后，Render 会自动开始部署**
2. **在服务页面顶部，可以看到部署进度**
3. **等待 2-3 分钟**
4. **当状态显示 "Live"（运行中）时，说明部署成功！** ✅

---

## 第五步：获取后端 URL（1分钟）

1. **部署成功后，在服务页面顶部**
2. **你会看到一个 URL，例如：**
   - `https://philosopher-chat-backend.onrender.com`
3. **复制这个 URL**，后面部署前端时会用到！

---

## 第六步：测试后端（可选）

1. **打开浏览器，访问：你的URL + `/api/health`**
   - 例如：`https://philosopher-chat-backend.onrender.com/api/health`
2. **应该看到：`{"status":"ok"}`**
3. **如果看到这个，说明后端部署成功！** ✅

---

## 🎯 重要提示

- ✅ **Root Directory 必须是 `backend`**（在创建服务时设置）
- ✅ 环境变量添加后会自动重新部署
- ✅ 免费版可能需要等待 30 秒左右才能启动（冷启动）
- ✅ 免费版如果 15 分钟没有访问会自动休眠，但重新访问会自动唤醒

---

## 📝 检查清单

- [ ] 已注册 Render 账号
- [ ] 已创建 Web Service
- [ ] Root Directory 设置为 `backend`
- [ ] 已添加三个环境变量
- [ ] 部署状态显示 "Live"
- [ ] 已获取后端 URL

---

## 🎊 完成！

后端部署成功后，继续按照原来的教程部署前端到 Vercel（Vercel 很简单，不会有问题）！

如果 Render 部署过程中遇到任何问题，告诉我，我会继续帮你！

