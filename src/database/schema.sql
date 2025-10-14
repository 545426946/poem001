-- 启明星诗歌赏析平台数据库设计
-- 数据库：poetry_platform

-- ============================
-- 用户相关表
-- ============================

-- 学生表
CREATE TABLE students (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('male', 'female') DEFAULT 'male',
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    class_id INT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status ENUM('active', 'graduated', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_class_id (class_id),
    INDEX idx_status (status)
);

-- 教师表
CREATE TABLE teachers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('male', 'female') DEFAULT 'male',
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    department VARCHAR(100),
    title VARCHAR(50), -- 职称
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_status (status)
);

-- 管理员表
CREATE TABLE admins (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    role ENUM('college_admin', 'system_admin') DEFAULT 'college_admin',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 班级课程相关表
-- ============================

-- 班级表
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade_level INT NOT NULL, -- 年级：1-高一，2-高二，3-高三
    class_number INT NOT NULL, -- 班级号
    teacher_id VARCHAR(20), -- 班主任
    max_students INT DEFAULT 50,
    academic_year VARCHAR(20), -- 学年：如 2023-2024
    status ENUM('active', 'graduated', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    UNIQUE KEY unique_class (grade_level, class_number, academic_year),
    INDEX idx_grade_level (grade_level),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_academic_year (academic_year)
);

-- 课程表
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    teacher_id VARCHAR(20) NOT NULL,
    class_id INT NOT NULL,
    semester ENUM('spring', 'fall') NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    total_hours INT DEFAULT 36,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_class_id (class_id),
    INDEX idx_academic_year (academic_year)
);

-- ============================
-- 诗歌相关表
-- ============================

-- 诗歌表
CREATE TABLE poems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT, -- 翻译
    annotation TEXT, -- 注释
    appreciation TEXT, -- 赏析
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    category VARCHAR(50), -- 分类：如 landscape, romantic, philosophical
    tags JSON, -- 标签数组
    background_info TEXT, -- 创作背景
    literary_devices JSON, -- 文学手法
    themes JSON, -- 主题
    audio_url TEXT, -- 朗读音频
    image_url TEXT, -- 配图
    view_count INT DEFAULT 0,
    study_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    status ENUM('active', 'draft', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty),
    INDEX idx_category (category),
    INDEX idx_dynasty (dynasty),
    INDEX idx_author (author),
    INDEX idx_status (status),
    FULLTEXT idx_content (title, content, author)
);

-- 诗歌知识点表
CREATE TABLE poem_knowledge_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poem_id INT NOT NULL,
    type ENUM('vocabulary', 'grammar', 'rhetoric', 'background', 'theme') NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    INDEX idx_poem_id (poem_id),
    INDEX idx_type (type)
);

-- ============================
-- 学习活动相关表
-- ============================

-- 学习活动表
CREATE TABLE learning_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    poem_id INT NOT NULL,
    activity_type ENUM('read', 'analyze', 'recite', 'quiz', 'discussion') NOT NULL,
    score DECIMAL(5,2), -- 得分
    duration INT, -- 学习时长（秒）
    progress DECIMAL(5,2) DEFAULT 0, -- 完成进度百分比
    ai_feedback TEXT, -- AI反馈
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (poem_id) REFERENCES poems(id),
    INDEX idx_student_id (student_id),
    INDEX idx_poem_id (poem_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- 学习进度表
CREATE TABLE learning_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    poem_id INT NOT NULL,
    overall_progress DECIMAL(5,2) DEFAULT 0, -- 总体进度
    read_progress DECIMAL(5,2) DEFAULT 0, -- 阅读进度
    analyze_progress DECIMAL(5,2) DEFAULT 0, -- 分析进度
    recite_progress DECIMAL(5,2) DEFAULT 0, -- 背诵进度
    quiz_score DECIMAL(5,2), -- 测验得分
    best_score DECIMAL(5,2), -- 最佳得分
    attempt_count INT DEFAULT 0, -- 尝试次数
    mastery_level ENUM('not_started', 'learning', 'practiced', 'mastered') DEFAULT 'not_started',
    last_study_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (poem_id) REFERENCES poems(id),
    UNIQUE KEY unique_student_poem (student_id, poem_id),
    INDEX idx_student_id (student_id),
    INDEX idx_poem_id (poem_id),
    INDEX idx_mastery_level (mastery_level)
);

-- ============================
-- AI交互相关表
-- ============================

-- AI对话记录表
CREATE TABLE ai_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    poem_id INT,
    question TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_type ENUM('poem_analysis', 'general_question', 'learning_guidance') NOT NULL,
    satisfaction_rating INT, -- 1-5星评分
    is_helpful BOOLEAN,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (poem_id) REFERENCES poems(id),
    INDEX idx_student_id (student_id),
    INDEX idx_poem_id (poem_id),
    INDEX idx_context_type (context_type),
    INDEX idx_created_at (created_at)
);

-- ============================
-- 统计分析相关表
-- ============================

-- 学生学习统计表
CREATE TABLE student_learning_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    total_study_time INT DEFAULT 0, -- 总学习时间（秒）
    poems_studied INT DEFAULT 0, -- 当日学习诗歌数
    activities_completed INT DEFAULT 0, -- 完成的活动数
    average_score DECIMAL(5,2), -- 平均得分
    streak_days INT DEFAULT 0, -- 连续学习天数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_date (student_id, date),
    INDEX idx_student_id (student_id),
    INDEX idx_date (date)
);

-- 班级学习统计表
CREATE TABLE class_learning_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    date DATE NOT NULL,
    total_students INT DEFAULT 0,
    active_students INT DEFAULT 0, -- 当日活跃学生数
    average_progress DECIMAL(5,2), -- 平均进度
    poems_completed INT DEFAULT 0, -- 完成的诗歌学习数
    high_risk_students INT DEFAULT 0, -- 高风险学生数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    UNIQUE KEY unique_class_date (class_id, date),
    INDEX idx_class_id (class_id),
    INDEX idx_date (date)
);

-- ============================
-- 系统配置相关表
-- ============================

-- 系统配置表
CREATE TABLE system_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
);

-- ============================
-- 视图定义
-- ============================

-- 学生详细信息视图
CREATE VIEW v_student_details AS
SELECT 
    s.id,
    s.name,
    s.gender,
    s.phone,
    s.email,
    s.avatar_url,
    s.enrollment_date,
    s.status,
    c.name as class_name,
    c.grade_level,
    c.class_number,
    t.name as teacher_name,
    COUNT(DISTINCT lp.poem_id) as studied_poems,
    AVG(lp.overall_progress) as avg_progress,
    MAX(sls.streak_days) as current_streak
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers t ON c.teacher_id = t.id
LEFT JOIN learning_progress lp ON s.id = lp.student_id
LEFT JOIN student_learning_stats sls ON s.id = sls.student_id
GROUP BY s.id;

-- 班级统计视图
CREATE VIEW v_class_stats AS
SELECT 
    c.id,
    c.name,
    c.grade_level,
    c.class_number,
    c.academic_year,
    COUNT(s.id) as total_students,
    AVG(lp.overall_progress) as avg_progress,
    COUNT(CASE WHEN lp.overall_progress < 30 THEN 1 END) as high_risk_students,
    t.name as teacher_name
FROM classes c
LEFT JOIN students s ON c.id = s.class_id AND s.status = 'active'
LEFT JOIN learning_progress lp ON s.id = lp.student_id
LEFT JOIN teachers t ON c.teacher_id = t.id
WHERE c.status = 'active'
GROUP BY c.id;

-- 热门诗歌视图
CREATE VIEW v_popular_poems AS
SELECT 
    p.id,
    p.title,
    p.author,
    p.dynasty,
    p.difficulty,
    p.category,
    p.study_count,
    p.like_count,
    p.view_count,
    COUNT(DISTINCT lp.student_id) as learner_count,
    AVG(lp.overall_progress) as avg_completion
FROM poems p
LEFT JOIN learning_progress lp ON p.id = lp.poem_id
WHERE p.status = 'active'
GROUP BY p.id
ORDER BY p.study_count DESC, p.like_count DESC;

-- ============================
-- 初始化数据插入
-- ============================

-- 插入示例教师数据
INSERT INTO teachers (id, name, gender, phone, email, department, title, hire_date) VALUES
('T2023001', '李明', 'male', '13800138001', 'liming@school.edu', '语文教研组', '高级教师', '2020-09-01'),
('T2023002', '王芳', 'female', '13800138002', 'wangfang@school.edu', '语文教研组', '一级教师', '2021-09-01'),
('T2023003', '张伟', 'male', '13800138003', 'zhangwei@school.edu', '语文教研组', '高级教师', '2019-09-01'),
('T2023004', '刘丽', 'female', '13800138004', 'liuli@school.edu', '语文教研组', '一级教师', '2022-09-01'),
('T2023005', '陈强', 'male', '13800138005', 'chenqiang@school.edu', '语文教研组', '特级教师', '2018-09-01');

-- 插入示例班级数据
INSERT INTO classes (name, grade_level, class_number, teacher_id, academic_year) VALUES
('高一(1)班', 1, 1, 'T2023001', '2023-2024'),
('高一(2)班', 1, 2, 'T2023002', '2023-2024'),
('高一(3)班', 1, 3, 'T2023003', '2023-2024'),
('高一(4)班', 1, 4, 'T2023004', '2023-2024'),
('高二(1)班', 2, 1, 'T2023005', '2023-2024'),
('高二(2)班', 2, 2, 'T2023001', '2023-2024');

-- 插入示例学生数据
INSERT INTO students (id, name, gender, phone, email, class_id, enrollment_date) VALUES
('S2023001', '张三', 'male', '13900139001', 'zhangsan@student.edu', 1, '2023-09-01'),
('S2023002', '李四', 'male', '13900139002', 'lisi@student.edu', 1, '2023-09-01'),
('S2023003', '王五', 'female', '13900139003', 'wangwu@student.edu', 2, '2023-09-01'),
('S2023004', '赵六', 'male', '13900139004', 'zhaoliu@student.edu', 2, '2023-09-01'),
('S2023005', '孙七', 'female', '13900139005', 'sunqi@student.edu', 3, '2023-09-01');

-- 插入示例诗歌数据
INSERT INTO poems (title, author, dynasty, content, translation, difficulty, category, tags, study_count, like_count, view_count) VALUES
('静夜思', '李白', '唐代', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', 
 '床前洒下的月光，好像地上的霜一样。抬头看着明月，低头思念故乡。', 
 'beginner', 'nostalgia', '["思乡", "月亮", "夜晚"]', 1856, 892, 3245),
 
('春晓', '孟浩然', '唐代', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
 '春天睡觉不知不觉就到了天亮，到处都能听到鸟儿的啼叫声。夜里风雨的声音，不知道有多少花朵凋落了。',
 'beginner', 'nature', '["春天", "自然", "生活"]', 1642, 756, 2891),
 
('登鹳雀楼', '王之涣', '唐代', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
 '太阳依傍着山峦沉落，黄河向着大海奔流。想要看到千里之外的风光，就要再登上更高的一层楼。',
 'intermediate', 'philosophy', '["登高", "哲理", "壮丽"]', 1428, 634, 2567),
 
('相思', '王维', '唐代', '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
 '红豆生长在南方，春天来了不知发了多少新枝。希望你多多采摘，这东西最能寄托相思之情。',
 'beginner', 'romantic', '["相思", "爱情", "红豆"]', 1315, 578, 2234),
 
('望庐山瀑布', '李白', '唐代', '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
 '太阳照在香炉峰上生起紫色烟雾，远远望见瀑布悬挂在山前。飞流直泻而下三千尺，好像是银河从九天垂落。',
 'intermediate', 'landscape', '["山水", "瀑布", "壮美"]', 1198, 523, 2012);

-- 插入管理员数据
INSERT INTO admins (id, name, phone, email, role) VALUES
('A2023001', '王院长', '13700137000', 'admin@school.edu', 'college_admin');

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, description, config_type, is_public) VALUES
('platform_name', '启明星诗歌赏析平台', '平台名称', 'string', TRUE),
('max_daily_study_time', '7200', '每日最大学习时间（秒）', 'number', FALSE),
('ai_enabled', 'true', '是否启用AI功能', 'boolean', FALSE),
('difficulty_levels', '["beginner", "intermediate", "advanced"]', '难度级别配置', 'json', TRUE);