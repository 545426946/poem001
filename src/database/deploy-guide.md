# Supabase 数据库部署指南

## 🚀 快速部署步骤

### 1. 访问 Supabase 控制台
1. 登录 [Supabase 官网](https://supabase.com)
2. 进入您的项目控制台
3. 选择左侧菜单的 **SQL Editor**

### 2. 部署表结构
复制以下SQL脚本到SQL Editor中执行：

```sql
-- 部署完整表结构
-- 复制 src/database/supabase-schema.sql 中的内容到这里执行
```

### 3. 插入示例数据
表结构部署完成后，执行示例数据插入：

```sql
-- 插入示例数据
-- 复制 src/database/sample-data.sql 中的内容到这里执行
```

### 4. 验证部署
在SQL Editor中执行以下查询验证部署：

```sql
-- 验证表结构
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 验证数据
SELECT '诗歌数量' as type, COUNT(*) as count FROM poems
UNION ALL
SELECT '学生数量', COUNT(*) FROM students
UNION ALL
SELECT '教师数量', COUNT(*) FROM teachers;
```

## 📋 完整的部署脚本

### 表结构部署脚本
```sql
-- 完整的表结构创建脚本
-- 内容来自: src/database/supabase-schema.sql

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 教师表
CREATE TABLE teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    department VARCHAR(100),
    title VARCHAR(50),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学生表
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    class_id INTEGER,
    enrollment_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    studied_poems INTEGER DEFAULT 0,
    avg_score INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    weekly_goal INTEGER DEFAULT 3,
    total_poems INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 班级表
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade_level INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    teacher_id UUID REFERENCES teachers(id),
    max_students INTEGER DEFAULT 50,
    academic_year VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    avg_progress INTEGER DEFAULT 0,
    high_risk_students INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 诗歌表
CREATE TABLE poems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50),
    content TEXT NOT NULL,
    translation TEXT,
    appreciation TEXT,
    background TEXT,
    keywords TEXT[],
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    category VARCHAR(50),
    tags TEXT[],
    literary_devices TEXT[],
    themes TEXT[],
    annotation TEXT,
    study_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    popularity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学习活动表
CREATE TABLE student_learning_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    poem_id INTEGER REFERENCES poems(id),
    activity_type VARCHAR(50) NOT NULL,
    score INTEGER,
    duration INTEGER,
    overall_progress INTEGER DEFAULT 0,
    read_progress INTEGER DEFAULT 0,
    analyze_progress INTEGER DEFAULT 0,
    recite_progress INTEGER DEFAULT 0,
    quiz_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 1,
    mastery_level VARCHAR(20) DEFAULT 'not_started',
    last_study_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 知识库片段表
CREATE TABLE knowledge_base_chunks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    source_type VARCHAR(50),
    source_id INTEGER,
    keywords TEXT[],
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI代理状态表
CREATE TABLE ai_agent_state (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    current_state JSONB,
    conversation_history JSONB,
    preferences JSONB,
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_poems_difficulty ON poems(difficulty);
CREATE INDEX idx_learning_activities_student_id ON student_learning_activities(student_id);
CREATE INDEX idx_knowledge_base_keywords ON knowledge_base_chunks USING GIN(keywords);

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_state ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "允许匿名读取诗歌" ON poems FOR SELECT USING (true);
CREATE POLICY "允许学生查看自己的学习活动" ON student_learning_activities FOR SELECT USING (auth.uid() = student_id);

-- 完成消息
SELECT '表结构部署完成！' as message;
```

### 示例数据插入脚本
```sql
-- 完整的示例数据插入脚本
-- 内容来自: src/database/sample-data.sql

-- 插入用户数据
INSERT INTO users (id, email, name, avatar_url, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@school.edu', '系统管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin'),
('00000000-0000-0000-0000-000000000002', 'liming@school.edu', '李明', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1', 'teacher');

-- 插入教师数据
INSERT INTO teachers (id, user_id, teacher_id, name, gender, phone, email, department, title, hire_date) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'T2023001', '李明', 'male', '13800138001', 'liming@school.edu', '语文教研组', '高级教师', '2020-09-01');

-- 插入班级数据
INSERT INTO classes (name, grade_level, class_number, teacher_id, max_students, academic_year, avg_progress, high_risk_students, total_students) VALUES
('高一(1)班', 1, 1, '10000000-0000-0000-0000-000000000001', 50, '2023-2024', 78, 3, 45);

-- 插入学生数据
INSERT INTO students (user_id, student_id, name, gender, phone, email, class_id, enrollment_date, progress, studied_poems, avg_score, current_streak) VALUES
('00000000-0000-0000-0000-000000000001', 'S2023001', '张三', 'male', '13900000001', 'zhangsan@student.edu', 1, '2023-09-01', 85, 15, 88, 7);

-- 插入诗歌数据
INSERT INTO poems (title, author, dynasty, content, translation, appreciation, background, keywords, difficulty, category, tags, literary_devices, themes, study_count, like_count, view_count, popularity) VALUES
('静夜思', '李白', '唐代', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头来看着明月，不由得低头思念起故乡。', '这首诗通过简洁的语言描绘了游子思乡之情，意境深远，语言优美。', '李白在扬州旅舍时所作，表达了对故乡的深切思念。', ARRAY['思乡', '明月', '故乡'], 'beginner', '抒情', ARRAY['思乡', '明月', '唐诗'], ARRAY['比喻', '对偶'], ARRAY['思乡', '孤独'], 1500, 800, 3000, 90);

-- 完成消息
SELECT '示例数据插入完成！' as message;
```

## 🔧 高级配置

### 启用向量搜索（可选）
如果需要在知识库中启用向量搜索：

```sql
-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建向量搜索函数
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base_chunks.id,
    knowledge_base_chunks.content,
    1 - (knowledge_base_chunks.embedding <=> query_embedding) AS similarity
  FROM knowledge_base_chunks
  WHERE 1 - (knowledge_base_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 配置行级安全策略
确保数据安全：

```sql
-- 为所有表启用行级安全
DO $$ 
DECLARE 
    table_name text;
BEGIN 
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
    LOOP 
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;
```

## 🐛 故障排除

### 常见问题

1. **表创建失败**
   - 检查是否有重复的表名
   - 确认扩展是否已启用

2. **权限错误**
   - 确认使用正确的数据库用户
   - 检查行级安全策略

3. **数据插入失败**
   - 验证外键约束
   - 检查数据类型匹配

### 验证命令

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 检查数据完整性
SELECT 
    (SELECT COUNT(*) FROM poems) as poem_count,
    (SELECT COUNT(*) FROM students) as student_count,
    (SELECT COUNT(*) FROM teachers) as teacher_count;
```

## 📞 支持

如果遇到问题：
1. 查看 Supabase 官方文档
2. 检查控制台错误信息
3. 联系技术支持

---

**部署完成时间**: 2024年10月15日  
**数据库版本**: Supabase PostgreSQL 15  
**兼容性**: Vue 3.x + Supabase JS 2.x