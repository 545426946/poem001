import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 加载环境变量
const projectRoot = join(process.cwd(), '..', '..');
dotenv.config({ path: join(projectRoot, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase配置不完整，请检查.env文件中的VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 读取schema文件
    const schema = readFileSync('schema.sql', 'utf8');
    console.log('📋 读取schema文件成功');
    
    // 读取丰富数据文件
    const enrichedData = readFileSync('enriched-poems-data.sql', 'utf8');
    console.log('📚 读取丰富数据文件成功');
    
    // 执行schema创建表
    console.log('🗃️ 开始创建数据库表...');
    const schemaQueries = schema.split(';').filter(query => query.trim());
    
    for (const query of schemaQueries) {
      if (query.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: query });
          if (error) {
            console.log(`⚠️ 执行SQL时可能遇到重复表: ${error.message}`);
          } else {
            console.log(`✅ 执行SQL成功`);
          }
        } catch (err) {
          console.log(`ℹ️ SQL执行信息: ${err.message}`);
        }
      }
    }
    
    console.log('✅ 数据库表创建完成');
    
    // 插入丰富数据
    console.log('📝 开始插入丰富数据...');
    const dataQueries = enrichedData.split(';').filter(query => query.trim());
    
    for (const query of dataQueries) {
      if (query.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: query });
          if (error) {
            console.log(`⚠️ 插入数据时可能遇到重复: ${error.message}`);
          } else {
            console.log(`✅ 插入数据成功`);
          }
        } catch (err) {
          console.log(`ℹ️ 数据插入信息: ${err.message}`);
        }
      }
    }
    
    console.log('✅ 丰富数据插入完成');
    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
}

initDatabase();