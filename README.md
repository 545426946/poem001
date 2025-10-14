# 启明星 - AI驱动的诗歌赏析智慧学习与管理平台

基于L.I.G.H.T.架构设计的现代化诗歌学习平台，为河北师范大学软件学院提供智能化的诗歌教学管理解决方案。

## 🌟 项目特色

- **AI驱动学习**: 集成智能AI助手，提供个性化诗歌分析和学习建议
- **三级AI架构**: 学生级、教师级、学院级AI智能体协同工作
- **实时数据洞察**: 基于Supabase的实时数据同步和可视化分析
- **现代化技术栈**: React + Vite + TailwindCSS + Supabase
- **响应式设计**: 完美适配桌面端和移动端

## 🏗️ 技术架构

### L.I.G.H.T. 架构模式
- **L (Lean Backend)**: 精简后端API，专注核心业务逻辑
- **I (Intelligent Frontend)**: 智能化前端，集成AI交互能力
- **G (Git-driven Workflow)**: Git驱动的开发流程和版本控制
- **H (Hyper-scalable Data)**: 超大规模数据层，支持向量搜索
- **T (Templated AI Agents)**: 模板化AI智能体，支持快速部署

### 核心技术栈
- **前端**: React 18, Vite, TailwindCSS, Lucide Icons
- **后端**: Supabase (PostgreSQL + 实时引擎)
- **AI服务**: 自定义AI服务层，支持RAG知识库检索
- **部署**: Vercel/Netlify + Supabase

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm/yarn/pnpm

### 安装依赖
```bash
npm install
```

### 环境配置
复制 `.env.example` 为 `.env.local` 并配置相应参数：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key (可选)
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── StudentDashboard.jsx    # 学生工作台
│   ├── TeacherDashboard.jsx    # 教师管理台
│   ├── CollegeDashboard.jsx    # 学院大屏
│   ├── Login.jsx               # 登录页面
│   ├── Navigation.jsx         # 导航组件
│   └── AIChatAssistant.jsx    # AI聊天助手
├── contexts/           # React上下文
│   └── AuthContext.jsx       # 认证上下文
├── services/           # 业务服务
│   ├── aiService.js           # AI服务
│   └── dataService.js         # 数据服务
├── config/            # 配置模块
│   └── supabase.js           # Supabase配置
└── index.css          # 全局样式
```

## 🎯 核心功能

### 学生端功能
- 📚 个性化诗歌学习计划
- 🤖 AI智能诗歌分析助手
- 📊 学习进度可视化
- 🎯 智能学习推荐

### 教师端功能
- 👥 班级学情监控
- ⚠️ 学生风险预警
- 📈 教学数据分析
- 💡 AI教学建议

### 学院端功能
- 🖥️ 全局数据大屏
- 📋 多维度统计分析
- 🔔 系统预警管理
- 🎓 教学质量评估

## 🔧 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循React Hooks最佳实践
- 组件采用函数式编程风格
- 使用TypeScript进行类型检查（计划中）

### 数据模型
项目使用Supabase作为后端，主要数据表包括：
- `users` - 用户信息
- `students` - 学生档案
- `teachers` - 教师信息
- `courses` - 课程信息
- `enrollments` - 选课记录
- `learning_activities` - 学习活动记录
- `knowledge_base` - RAG知识库

### AI集成
平台支持多种AI服务集成：
- OpenAI GPT系列
- 本地部署的LLM模型
- 自定义AI服务端点

## 📈 部署指南

### 生产环境部署
1. 配置生产环境变量
2. 构建生产版本：`npm run build`
3. 部署到Vercel/Netlify等平台
4. 配置Supabase生产环境

### 数据库迁移
使用Supabase的迁移工具进行数据库结构更新：

```bash
# 安装Supabase CLI
npm install -g supabase

# 初始化迁移
supabase migration new init
```

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下流程：

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

**启明星项目组** - 致力于通过AI技术提升诗歌教育质量 📚✨