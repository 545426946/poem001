# Supabase服务启动指南

## 快速开始

### 1. 创建Supabase项目
1. 访问 [Supabase官网](https://supabase.com)
2. 注册并登录账户
3. 点击"New Project"创建新项目
4. 填写项目信息：
   - **Name**: poetry-appreciation-platform
   - **Database Password**: 设置一个安全的密码
   - **Region**: 选择离您最近的区域（如ap-southeast-1）
5. 点击"Create new project"等待创建完成

### 2. 获取项目配置
项目创建完成后，在项目设置中获取：
- **Project URL**: 类似 `https://xxxxxxxxxxxx.supabase.co`
- **anon/public key**: 以 `eyJ` 开头的长字符串

### 3. 配置环境变量
编辑 `.env` 文件，填入您的配置：
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 部署数据库表结构
1. 在Supabase控制台左侧菜单点击"SQL Editor"
2. 复制 `src/database/supabase-schema.sql` 文件内容
3. 粘贴到SQL编辑器中并执行

### 5. 启动应用
```bash
npm run dev
```
访问 http://localhost:3002/ 测试连接

## 验证连接

### 检查数据库连接
在浏览器中访问数据库管理页面：http://localhost:3002/admin/database

### 测试功能
1. 检查数据库连接状态
2. 部署表结构
3. 插入示例数据

## 故障排除

### 常见问题
1. **连接失败**: 检查环境变量是否正确配置
2. **表结构部署失败**: 确保SQL语法正确
3. **权限错误**: 检查RLS策略设置

### 获取帮助
- Supabase文档: https://supabase.com/docs
- 项目文档: 查看项目中的README文件