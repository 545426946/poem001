# Netlify 部署指南

## 部署步骤

### 1. 准备代码
确保所有代码已提交到GitHub：
```bash
git add .
git commit -m "准备Netlify部署"
git push origin main
```

### 2. 在Netlify上创建新项目
1. 访问 https://www.netlify.com/
2. 点击 "Sign up" 注册账户（或登录）
3. 点击 "Add new site" → "Import an existing project"
4. 选择 GitHub 作为 Git 提供商
5. 授权 Netlify 访问您的 GitHub 账户
6. 选择您的仓库：`545426946/poem001`

### 3. 配置构建设置
Netlify 会自动检测到 Vue.js 项目，配置如下：
- **构建命令**: `npm run build`
- **发布目录**: `dist`
- **Node.js 版本**: 18

### 4. 设置环境变量（关键步骤）
在 Netlify 控制台中设置以下环境变量：

1. 进入您的站点设置
2. 点击 "Site settings" → "Environment variables"
3. 添加以下变量：

```
VITE_SUPABASE_URL = https://pebojoawdugipthkxxpe.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlYm9qb2F3ZHVnaXB0aGt4eHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkyOTksImV4cCI6MjA3NjA4NTI5OX0.LKgN51CrKEv-8u453T042FKHiOwVaZ9QB0wMbXBzpKA
VITE_APP_NAME = 诗词赏析平台
VITE_APP_VERSION = 1.0.0
```

### 5. 部署
1. 点击 "Deploy site"
2. Netlify 会自动开始构建和部署
3. 等待部署完成（约2-5分钟）

### 6. 验证部署
1. 访问 Netlify 提供的域名（如：`your-site-name.netlify.app`）
2. 检查控制台是否有错误
3. 测试 Supabase 数据库连接

## 故障排除

### 如果数据库连接失败：
1. 检查环境变量是否正确设置
2. 确认 Supabase 项目是否正常运行
3. 检查浏览器控制台错误信息

### 如果构建失败：
1. 检查 Node.js 版本是否为 18+
2. 确认所有依赖已正确安装
3. 查看 Netlify 构建日志中的详细错误信息

## 自定义域名（可选）
1. 在 Netlify 站点设置中点击 "Domain management"
2. 添加自定义域名
3. 按照指引配置 DNS 记录

## 环境变量安全说明
- 环境变量在构建时注入到前端代码中
- 这些变量对访问者可见，但 Supabase 的匿名密钥设计为可以公开
- 不要将敏感信息（如服务角色密钥）放在前端环境变量中