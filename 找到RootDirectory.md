# 🔍 如何找到 Root Directory 设置

## 重要：Root Directory 在服务设置中，不在项目设置中！

---

## ✅ 正确步骤

### 方法一：通过服务卡片

1. **在项目页面，找到左侧的服务列表**
   - 应该能看到一个卡片，显示 "philosopher-chat" 和 GitHub 图标
   - 可能显示 "Build failed" 或 "Deploying" 状态

2. **点击这个服务卡片**
   - 点击 "philosopher-chat" 卡片进入服务详情

3. **在服务详情页面，点击 "Settings" 标签**
   - 顶部导航栏应该有：Deployments、Variables、Metrics、Settings
   - 点击 "Settings"

4. **在服务设置中查找 Root Directory**
   - 应该在 "Source" 或 "Configuration" 部分
   - 找到 "Root Directory" 或 "Working Directory"
   - 设置为：`backend`

### 方法二：通过服务菜单

1. **点击左侧的 "philosopher-chat" 服务**
2. **在服务详情页面，找到右上角的 "..."（三个点）菜单**
3. **选择 "Settings" 或 "Configure"**
4. **查找 Root Directory 设置**

### 方法三：如果还是找不到

1. **删除当前服务，重新添加**
   - 点击服务卡片右侧的 "..." 菜单
   - 选择 "Delete" 删除服务
   - 然后重新添加 GitHub 仓库
   - 在添加时，应该会有 Root Directory 选项

---

## 📸 应该在哪里看到

Root Directory 通常在以下位置之一：

- **服务设置页面的 "Source" 部分**
- **服务设置页面的 "Configuration" 部分**
- **添加服务时的配置选项**

---

## 🆘 如果完全找不到

告诉我你现在看到的页面内容，我会根据实际情况给你更精确的指导！

