-- Supabase数据库完整表结构
-- 诗词赏析平台数据库架构

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表（简化版，仅用于管理员）
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'admin', -- admin, user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 诗歌表
CREATE TABLE poems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50), -- 唐朝、宋朝等
    content TEXT NOT NULL,
    translation TEXT, -- 现代文翻译
    appreciation TEXT, -- 赏析内容
    background TEXT, -- 创作背景
    keywords TEXT[], -- 关键词数组
    difficulty VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced
    category VARCHAR(50), -- 抒情、写景、咏物等
    tags TEXT[], -- 标签数组
    literary_devices TEXT[], -- 修辞手法
    themes TEXT[], -- 主题数组
    annotation TEXT, -- 注释说明
    study_count INTEGER DEFAULT 0, -- 学习次数
    like_count INTEGER DEFAULT 0, -- 点赞数
    view_count INTEGER DEFAULT 0, -- 浏览数
    popularity INTEGER DEFAULT 0, -- 受欢迎程度
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 知识库片段表（用于RAG搜索）
CREATE TABLE knowledge_base_chunks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    source_type VARCHAR(50), -- poem, analysis, background等
    source_id INTEGER, -- 关联的诗歌ID或其他源ID
    keywords TEXT[],
    embedding TEXT, -- 文本嵌入向量（存储为JSON字符串）
    metadata JSONB, -- 额外元数据
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI代理状态表（简化版）
CREATE TABLE ai_agent_state (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL, -- analysis_assistant, search_helper等
    current_state JSONB, -- 当前状态数据
    conversation_history JSONB, -- 对话历史
    preferences JSONB, -- 用户偏好
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_poems_difficulty ON poems(difficulty);
CREATE INDEX idx_poems_category ON poems(category);
CREATE INDEX idx_knowledge_base_keywords ON knowledge_base_chunks USING GIN(keywords);
CREATE INDEX idx_ai_agent_user_id ON ai_agent_state(user_id);

-- 启用行级安全（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_state ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许匿名读取，限制写入）
-- 用户表策略
CREATE POLICY "允许匿名读取用户" ON users FOR SELECT USING (true);
CREATE POLICY "允许用户插入自己的数据" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "允许用户更新自己的数据" ON users FOR UPDATE USING (auth.uid() = id);

-- 诗歌表策略（公开读取）
CREATE POLICY "允许匿名读取诗歌" ON poems FOR SELECT USING (true);
CREATE POLICY "允许管理员管理诗歌" ON poems FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- AI代理状态表策略
CREATE POLICY "允许用户查看自己的AI状态" ON ai_agent_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "允许用户管理自己的AI状态" ON ai_agent_state FOR ALL USING (auth.uid() = user_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要updated_at的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agent_state_updated_at BEFORE UPDATE ON ai_agent_state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建用于文本搜索的函数（基于关键词匹配）
CREATE OR REPLACE FUNCTION search_documents(
  search_query TEXT,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(200),
  content TEXT,
  similarity_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    CASE 
      WHEN kb.title ILIKE '%' || search_query || '%' THEN 1.0
      WHEN kb.content ILIKE '%' || search_query || '%' THEN 0.8
      WHEN array_to_string(kb.keywords, ' ') ILIKE '%' || search_query || '%' THEN 0.6
      ELSE 0.0
    END as similarity_score
  FROM knowledge_base_chunks kb
  WHERE kb.title ILIKE '%' || search_query || '%' 
     OR kb.content ILIKE '%' || search_query || '%'
     OR array_to_string(kb.keywords, ' ') ILIKE '%' || search_query || '%'
  ORDER BY similarity_score DESC
  LIMIT match_count;
END;
$$;

-- 注释表说明
COMMENT ON TABLE poems IS '诗歌库表，存储所有诗歌内容和元数据';
COMMENT ON TABLE knowledge_base_chunks IS '知识库片段表，支持RAG搜索';
COMMENT ON TABLE ai_agent_state IS 'AI代理状态表，存储用户与AI的交互状态';

-- 完成消息
SELECT '数据库架构创建完成！' as message;