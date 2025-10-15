-- Supabase示例数据插入脚本
-- 为诗歌赏析平台插入测试数据

-- 插入用户数据
INSERT INTO users (id, email, name, avatar_url, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@school.edu', '系统管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin'),
('00000000-0000-0000-0000-000000000002', 'liming@school.edu', '李明', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1', 'teacher'),
('00000000-0000-0000-0000-000000000003', 'wangfang@school.edu', '王芳', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2', 'teacher'),
('00000000-0000-0000-0000-000000000004', 'zhangwei@school.edu', '张伟', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3', 'teacher');

-- 插入教师数据
INSERT INTO teachers (id, user_id, teacher_id, name, gender, phone, email, department, title, hire_date) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'T2023001', '李明', 'male', '13800138001', 'liming@school.edu', '语文教研组', '高级教师', '2020-09-01'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'T2023002', '王芳', 'female', '13800138002', 'wangfang@school.edu', '语文教研组', '一级教师', '2021-09-01'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'T2023003', '张伟', 'male', '13800138003', 'zhangwei@school.edu', '语文教研组', '高级教师', '2019-09-01');

-- 插入班级数据
INSERT INTO classes (name, grade_level, class_number, teacher_id, max_students, academic_year, avg_progress, high_risk_students, total_students) VALUES
('高一(1)班', 1, 1, '10000000-0000-0000-0000-000000000001', 50, '2023-2024', 78, 3, 45),
('高一(2)班', 1, 2, '10000000-0000-0000-0000-000000000002', 50, '2023-2024', 72, 5, 48),
('高一(3)班', 1, 3, '10000000-0000-0000-0000-000000000003', 50, '2023-2024', 65, 7, 46),
('高二(1)班', 2, 1, '10000000-0000-0000-0000-000000000001', 50, '2023-2024', 85, 1, 44);

-- 插入学生数据
INSERT INTO students (user_id, student_id, name, gender, phone, email, class_id, enrollment_date, progress, studied_poems, avg_score, current_streak) VALUES
('00000000-0000-0000-0000-000000000001', 'S2023001', '张三', 'male', '13900000001', 'zhangsan@student.edu', 1, '2023-09-01', 85, 15, 88, 7),
('00000000-0000-0000-0000-000000000001', 'S2023002', '李四', 'female', '13900000002', 'lisi@student.edu', 1, '2023-09-01', 78, 12, 82, 5),
('00000000-0000-0000-0000-000000000001', 'S2023003', '王五', 'male', '13900000003', 'wangwu@student.edu', 2, '2023-09-01', 92, 18, 95, 12),
('00000000-0000-0000-0000-000000000001', 'S2023004', '赵六', 'female', '13900000004', 'zhaoliu@student.edu', 2, '2023-09-01', 65, 8, 70, 2),
('00000000-0000-0000-0000-000000000001', 'S2023005', '钱七', 'male', '13900000005', 'qianqi@student.edu', 3, '2023-09-01', 45, 5, 60, 1);

-- 插入经典诗歌数据
INSERT INTO poems (title, author, dynasty, content, translation, appreciation, background, keywords, difficulty, category, tags, literary_devices, themes, study_count, like_count, view_count, popularity) VALUES
('静夜思', '李白', '唐代', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', 
 '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头来看着明月，不由得低头思念起故乡。',
 '这首诗通过简洁的语言描绘了游子思乡之情，意境深远，语言优美。',
 '李白在扬州旅舍时所作，表达了对故乡的深切思念。',
 ARRAY['思乡', '明月', '故乡'], 'beginner', '抒情', 
 ARRAY['思乡', '明月', '唐诗'], ARRAY['比喻', '对偶'], ARRAY['思乡', '孤独'], 
 1500, 800, 3000, 90),

('春晓', '孟浩然', '唐代', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
 '春天睡醒不觉天已大亮，到处是鸟儿清脆的叫声。回想昨夜的阵阵风雨，不知道吹落了多少花朵。',
 '描绘春天早晨的景色，语言清新自然，意境优美。',
 '孟浩然隐居鹿门山时所作，表现了对大自然的热爱。',
 ARRAY['春天', '鸟鸣', '风雨'], 'beginner', '写景',
 ARRAY['春天', '自然', '唐诗'], ARRAY['拟人', '对比'], ARRAY['自然', '时光'],
 1200, 600, 2500, 85),

('登鹳雀楼', '王之涣', '唐代', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
 '夕阳依傍着西山慢慢沉落，滔滔黄河朝着东海汹涌奔流。想要看到千里之外的风光，那就要再登上更高的一层楼。',
 '这首诗描绘了壮丽的自然景色，并寓含积极向上的人生哲理。',
 '王之涣登鹳雀楼时所作，表达了对壮丽河山的热爱和进取精神。',
 ARRAY['登高', '黄河', '进取'], 'intermediate', '抒情',
 ARRAY['登高', '黄河', '唐诗'], ARRAY['对偶', '夸张'], ARRAY['进取', '壮丽'],
 800, 400, 1800, 80),

('悯农', '李绅', '唐代', '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
 '农民在正午烈日的暴晒下锄禾，汗水从身上滴落在禾苗生长的土地上。谁知道盘中的饭食，每颗每粒都是农民用辛勤的劳动换来的呢？',
 '这首诗表达了诗人对农民辛勤劳动的同情和珍惜粮食的思想。',
 '李绅目睹农民劳作的艰辛而作，具有深刻的社会意义。',
 ARRAY['农民', '劳动', '珍惜'], 'beginner', '社会',
 ARRAY['农民', '劳动', '唐诗'], ARRAY['对比', '反问'], ARRAY['劳动', '珍惜'],
 1000, 500, 2200, 75),

('望庐山瀑布', '李白', '唐代', '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
 '太阳照射香炉峰升起袅袅紫烟，远远望去瀑布像长河悬挂山前。仿佛三千尺水流飞奔直冲而下，莫非是银河从九天垂落山崖间。',
 '这首诗以夸张的手法描绘了庐山瀑布的雄伟壮观，想象奇特，气势磅礴。',
 '李白游庐山时所作，展现了大自然的壮美和诗人的豪迈情怀。',
 ARRAY['瀑布', '庐山', '壮观'], 'intermediate', '写景',
 ARRAY['瀑布', '庐山', '唐诗'], ARRAY['夸张', '比喻'], ARRAY['壮丽', '自然'],
 600, 300, 1500, 85),

('相思', '王维', '唐代', '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
 '红豆生长在南方，春天来了又生出了多少新枝呢？希望你多多采摘它，因为它最能寄托相思之情。',
 '这首诗借红豆表达相思之情，语言含蓄优美，情感真挚动人。',
 '王维表达对友人的思念之情，红豆在古代常被用来象征相思。',
 ARRAY['相思', '红豆', '春天'], 'intermediate', '抒情',
 ARRAY['相思', '红豆', '唐诗'], ARRAY['象征', '拟人'], ARRAY['相思', '友情'],
 700, 350, 1600, 78),

('江雪', '柳宗元', '唐代', '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
 '所有的山上飞鸟的身影已经绝迹，所有道路都不见人的踪迹。江面孤舟上一位披蓑戴笠的老翁，独自在寒冷的江面上钓鱼。',
 '这首诗描绘了一幅寒江独钓图，意境孤寂清冷，表现了诗人不屈的精神。',
 '柳宗元被贬永州时所作，借景抒情表达了自己的孤高情怀。',
 ARRAY['江雪', '孤独', '钓鱼'], 'advanced', '抒情',
 ARRAY['江雪', '孤独', '唐诗'], ARRAY['对比', '象征'], ARRAY['孤独', '坚韧'],
 500, 250, 1200, 82),

('黄鹤楼送孟浩然之广陵', '李白', '唐代', '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。',
 '老朋友在黄鹤楼与我辞别，在鲜花烂漫的三月去往扬州。孤帆的影子远去在碧空中消逝，只看见浩浩荡荡的长江向天边流去。',
 '这首诗描绘了送别友人的场景，意境开阔，情感真挚，表现了诗人对友人的深厚情谊。',
 '李白在黄鹤楼送别好友孟浩然时所作，是送别诗中的经典之作。',
 ARRAY['送别', '黄鹤楼', '扬州'], 'intermediate', '送别',
 ARRAY['送别', '黄鹤楼', '唐诗'], ARRAY['借景抒情', '对比'], ARRAY['友情', '离别'],
 400, 200, 1000, 75);

-- 插入学生学习活动数据
INSERT INTO student_learning_activities (student_id, poem_id, activity_type, score, duration, overall_progress, read_progress, analyze_progress, quiz_score, mastery_level, last_study_at) VALUES
('10000000-0000-0000-0000-000000000001', 1, 'poem_study', 85, 30, 80, 90, 70, 85, 'practiced', NOW() - INTERVAL '1 day'),
('10000000-0000-0000-0000-000000000001', 2, 'poem_study', 92, 25, 85, 95, 75, 92, 'mastered', NOW() - INTERVAL '2 days'),
('10000000-0000-0000-0000-000000000002', 1, 'poem_study', 78, 35, 70, 85, 55, 78, 'learning', NOW() - INTERVAL '3 days'),
('10000000-0000-0000-0000-000000000002', 3, 'poem_study', 88, 40, 75, 80, 70, 88, 'practiced', NOW() - INTERVAL '1 day'),
('10000000-0000-0000-0000-000000000003', 4, 'poem_study', 95, 20, 90, 95, 85, 95, 'mastered', NOW() - INTERVAL '4 days');

-- 插入知识库片段数据
INSERT INTO knowledge_base_chunks (title, content, source_type, source_id, keywords) VALUES
('静夜思赏析', '《静夜思》是唐代诗人李白的代表作之一，通过简洁的语言表达了深切的思乡之情。诗中"床前明月光"营造出宁静的夜晚氛围，"疑是地上霜"运用比喻手法增强意境。', 'analysis', 1, ARRAY['静夜思', '李白', '思乡', '赏析']),
('春晓创作背景', '《春晓》是孟浩然隐居鹿门山时所作，诗中描绘了春天早晨的生机勃勃景象，表现了诗人对大自然的热爱和对生活的乐观态度。', 'background', 2, ARRAY['春晓', '孟浩然', '创作背景']),
('登鹳雀楼哲理', '《登鹳雀楼》不仅描绘了壮丽的自然景色，更寓含了"欲穷千里目，更上一层楼"的深刻人生哲理，鼓励人们不断进取。', 'analysis', 3, ARRAY['登鹳雀楼', '王之涣', '人生哲理']),
('唐诗特点', '唐诗是中国古代诗歌的黄金时期，以格律严谨、意境深远、语言精炼著称，反映了唐代社会的繁荣和文化的鼎盛。', 'knowledge', NULL, ARRAY['唐诗', '特点', '文学']);

-- 插入AI代理状态数据
INSERT INTO ai_agent_state (student_id, agent_type, current_state, conversation_history, preferences) VALUES
('10000000-0000-0000-0000-000000000001', 'learning_coach', 
 '{"current_goal": "掌握唐诗基础知识", "progress": 65, "next_recommendation": "学习《春晓》赏析"}',
 '[{"role": "assistant", "content": "欢迎使用学习助手！"}, {"role": "user", "content": "我想学习唐诗"}]',
 '{"preferred_difficulty": "intermediate", "learning_style": "visual", "daily_goal": 3}'),

('10000000-0000-0000-0000-000000000002', 'analysis_assistant',
 '{"current_focus": "诗歌修辞手法", "analyzed_poems": [1, 2], "analysis_depth": "basic"}',
 '[{"role": "assistant", "content": "我是您的诗歌分析助手"}, {"role": "user", "content": "帮我分析《静夜思》"}]',
 '{"analysis_level": "detailed", "preferred_themes": ["思乡", "自然"]}');

-- 统计信息更新
UPDATE poems SET 
    study_count = study_count + 100,
    like_count = like_count + 50,
    view_count = view_count + 200,
    popularity = (study_count * 0.4 + like_count * 0.3 + view_count * 0.3)
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8);

-- 完成消息
SELECT '示例数据插入完成！共插入：' || 
       (SELECT COUNT(*) FROM poems) || ' 首诗歌，' ||
       (SELECT COUNT(*) FROM students) || ' 名学生，' ||
       (SELECT COUNT(*) FROM teachers) || ' 名教师' as message;