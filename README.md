# 诗词赏析平台 - Vercel部署指南

## 项目概述
基于Vue 3 + Vite + Supabase构建的诗词赏析平台，提供诗词库、诗人信息、深度赏析等功能。

## Vercel部署步骤

### 1. 准备部署文件
确保以下文件已提交到GitHub：
- `vercel.json` - Vercel配置文件
- `package.json` - 项目依赖配置
- 所有源代码文件

### 2. 在Vercel配置环境变量
在Vercel项目设置中，添加以下环境变量：

```
VITE_SUPABASE_URL=https://pebojoawdugipthkxxpe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlYm9qb2F3ZHVnaXB0aGt4eHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkyOTksImV4cCI6MjA3NjA4NTI5OX0.LKgN51CrKEv-8u453T042FKHiOwVaZ9QB0wMbXBzpKA
VITE_APP_NAME=诗词赏析平台
VITE_APP_VERSION=1.0.0
```

### 3. 连接GitHub仓库到Vercel
1. 访问 [Vercel控制台](https://vercel.com)
2. 点击"New Project"
3. 选择您的GitHub仓库
4. 配置项目设置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 4. 部署验证
部署完成后，访问生成的Vercel域名，检查功能：
- ✅ 首页加载正常
- ✅ 诗词库页面显示数据
- ✅ 诗人信息页面
- ✅ 赏析文章页面
- ✅ 诗词详情页面跳转

## Supabase数据库配置

### 1. 确保数据库表结构
在Supabase控制台中，确保以下表已创建：
- `poems` - 诗词表
- `poets` - 诗人表
- `appreciations` - 赏析文章表

### 2. 导入示例数据
使用Supabase SQL编辑器执行以下SQL导入示例数据：

```sql
-- 导入诗词数据
INSERT INTO poems (title, author, dynasty, content, category, tags) VALUES 
('静夜思', '李白', '唐', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', 'love', '{"思乡","明月"}'),
('水调歌头', '苏轼', '宋', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。', 'philosophy', '{"中秋","明月"}');

-- 导入诗人数据
INSERT INTO poets (name, dynasty, biography, works_count) VALUES
('李白', '唐', '唐代著名浪漫主义诗人，被誉为诗仙。', 1000),
('苏轼', '宋', '北宋文学家、书画家，唐宋八大家之一。', 800);
```

### 3. 启用Row Level Security (RLS)
确保表已启用RLS并配置适当的策略。

## 故障排除

### 常见问题
1. **环境变量未生效**：检查Vercel环境变量名称和值是否正确
2. **Supabase连接失败**：验证Supabase项目URL和匿名密钥
3. **路由404错误**：确保Vercel配置了SPA回退路由

### 调试步骤
1. 检查浏览器控制台错误信息
2. 验证Supabase网络请求是否成功
3. 检查Vercel构建日志

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 技术支持
如有部署问题，请检查：
- Vercel文档：https://vercel.com/docs
- Supabase文档：https://supabase.com/docs
- 项目GitHub Issues