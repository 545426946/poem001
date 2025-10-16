/**
 * 数据库丰富脚本
 * 用于向Supabase数据库插入丰富的诗词数据
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// 加载环境变量 - 从项目根目录加载
const currentFile = fileURLToPath(import.meta.url)
const projectRoot = join(currentFile, '..', '..', '..')
dotenv.config({ path: join(projectRoot, '.env') })

console.log('当前文件:', currentFile)
console.log('项目根目录:', projectRoot)
console.log('加载.env文件:', join(projectRoot, '.env'))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('环境变量检查:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '已设置' : '未设置')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '已设置' : '未设置')

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: Supabase配置不完整')
  console.log('请检查.env文件中的VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY配置')
  process.exit(1)
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 丰富的诗词数据
const enrichedPoems = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    translation: '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头来看着明月，不由得低头思念起故乡。',
    appreciation: '这首诗通过简洁的语言描绘了游子思乡之情，意境深远，语言优美。',
    background: '李白在扬州旅舍时所作，表达了对故乡的深切思念。',
    keywords: ['思乡', '明月', '故乡'],
    difficulty: 'beginner',
    category: '抒情',
    tags: ['思乡', '明月', '唐诗'],
    literary_devices: ['比喻', '对偶'],
    themes: ['思乡', '孤独'],
    study_count: 1500,
    like_count: 800,
    view_count: 3000,
    popularity: 90
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    translation: '春天睡醒不觉天已大亮，到处是鸟儿清脆的叫声。回想昨夜的阵阵风雨，不知道吹落了多少花朵。',
    appreciation: '描绘春天早晨的景色，语言清新自然，意境优美。',
    background: '孟浩然隐居鹿门山时所作，表现了对大自然的热爱。',
    keywords: ['春天', '鸟鸣', '风雨'],
    difficulty: 'beginner',
    category: '写景',
    tags: ['春天', '自然', '唐诗'],
    literary_devices: ['拟人', '对比'],
    themes: ['自然', '时光'],
    study_count: 1200,
    like_count: 600,
    view_count: 2500,
    popularity: 85
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    translation: '夕阳依傍着西山慢慢沉落，滔滔黄河朝着东海汹涌奔流。想要看到千里之外的风光，那就要再登上更高的一层楼。',
    appreciation: '这首诗描绘了壮丽的自然景色，并寓含积极向上的人生哲理。',
    background: '王之涣登鹳雀楼时所作，表达了对壮丽河山的热爱和进取精神。',
    keywords: ['登高', '黄河', '进取'],
    difficulty: 'intermediate',
    category: '抒情',
    tags: ['登高', '黄河', '唐诗'],
    literary_devices: ['对偶', '夸张'],
    themes: ['进取', '壮丽'],
    study_count: 800,
    like_count: 400,
    view_count: 1800,
    popularity: 80
  },
  {
    title: '望岳',
    author: '杜甫',
    dynasty: '唐代',
    content: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。',
    translation: '泰山到底怎么样？在齐鲁大地上，那青翠的山色没有尽头。大自然把神奇秀丽的景色都汇聚于泰山，山南和山北的天色被分割为一明一暗两部分。冉冉升起的云霞荡涤我的心灵，睁大眼睛追踪那暮归的鸟儿隐入山林。我一定要登上泰山的顶峰，俯瞰那众山，而众山在我眼中是多么的渺小。',
    appreciation: '这首诗通过描绘泰山的雄伟壮丽，表达了诗人不怕困难、敢于攀登绝顶、俯视一切的雄心和气概。',
    background: '杜甫青年时期漫游齐赵时所作，展现了他的豪情壮志。',
    keywords: ['泰山', '登高', '壮志'],
    difficulty: 'intermediate',
    category: '抒情',
    tags: ['泰山', '登高', '唐诗'],
    literary_devices: ['夸张', '对偶'],
    themes: ['壮志', '自然'],
    study_count: 850,
    like_count: 420,
    view_count: 1800,
    popularity: 82
  },
  {
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋代',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
    translation: '明月从什么时候开始有的呢？我拿着酒杯遥问苍天。不知道天上的宫殿，今晚是哪一年。我想凭借着风力回到天上去看一看，又担心美玉砌成的楼宇太高，我经受不住寒冷。起身舞蹈玩赏着月光下自己清朗的影子，月宫哪里比得上在人间。月儿转过朱红色的楼阁，低低地挂在雕花的窗户上，照着没有睡意的自己。明月不该对人们有什么怨恨吧，为什么偏在人们离别时才圆呢？人有悲欢离合的变迁，月有阴晴圆缺的转换，这种事自古来难以周全。只希望这世上所有人的亲人能平安健康，即便相隔千里，也能共享这美好的月光。',
    appreciation: '这首词以月起兴，围绕中秋明月展开想象和思考，把人世间的悲欢离合之情纳入对宇宙人生的哲理性追寻之中，表达了词人对亲人的思念和美好祝愿。',
    background: '苏轼在密州任太守时中秋望月怀人之作，是中秋词的经典。',
    keywords: ['中秋', '明月', '思念'],
    difficulty: 'advanced',
    category: '抒情',
    tags: ['中秋', '明月', '宋词'],
    literary_devices: ['想象', '哲理'],
    themes: ['思念', '人生'],
    study_count: 1200,
    like_count: 600,
    view_count: 2500,
    popularity: 88
  }
]

// 诗人数据
const enrichedPoets = [
  {
    name: '李白',
    dynasty: '唐代',
    biography: '李白（701年－762年），字太白，号青莲居士，唐朝浪漫主义诗人，被后人誉为"诗仙"。其诗风格豪放飘逸，想象丰富，语言流转自然，音律和谐多变。',
    works_count: 1000,
    popularity: 95,
    tags: ['诗仙', '浪漫主义', '豪放']
  },
  {
    name: '杜甫',
    dynasty: '唐代',
    biography: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被尊称为"诗圣"。他的诗被称为"诗史"。',
    works_count: 1400,
    popularity: 92,
    tags: ['诗圣', '现实主义', '沉郁']
  },
  {
    name: '苏轼',
    dynasty: '宋代',
    biography: '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋著名文学家、书法家、画家。其诗、词、散文均有很高成就。',
    works_count: 2700,
    popularity: 90,
    tags: ['东坡居士', '豪放派', '文学家']
  },
  {
    name: '李清照',
    dynasty: '宋代',
    biography: '李清照（1084年－1155年），号易安居士，宋代女词人，婉约词派代表，有"千古第一才女"之称。',
    works_count: 78,
    popularity: 88,
    tags: ['易安居士', '婉约派', '才女']
  },
  {
    name: '辛弃疾',
    dynasty: '宋代',
    biography: '辛弃疾（1140年－1207年），字幼安，号稼轩，南宋豪放派词人，有"词中之龙"之称。与苏轼合称"苏辛"。',
    works_count: 600,
    popularity: 89,
    tags: ['稼轩', '豪放派', '爱国']
  }
]

async function enrichDatabase() {
  console.log('开始丰富数据库...')
  
  try {
    // 检查连接
    const { data: testData, error: testError } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('数据库连接失败:', testError.message)
      console.log('请检查Supabase配置和环境变量')
      return
    }
    
    console.log('数据库连接成功')
    
    // 插入诗词数据
    console.log('插入诗词数据...')
    for (const poem of enrichedPoems) {
      const { data, error } = await supabase
        .from('poems')
        .insert(poem)
        .select()
      
      if (error) {
        console.error(`插入诗词 "${poem.title}" 失败:`, error.message)
      } else {
        console.log(`✓ 成功插入诗词: ${poem.title}`)
      }
    }
    
    // 插入诗人数据
    console.log('插入诗人数据...')
    for (const poet of enrichedPoets) {
      const { data, error } = await supabase
        .from('poets')
        .insert(poet)
        .select()
      
      if (error) {
        console.error(`插入诗人 "${poet.name}" 失败:`, error.message)
      } else {
        console.log(`✓ 成功插入诗人: ${poet.name}`)
      }
    }
    
    // 查询插入结果
    const { data: poemsData, error: poemsError } = await supabase
      .from('poems')
      .select('title, author, dynasty')
      .order('created_at', { ascending: false })
      .limit(10)
    
    const { data: poetsData, error: poetsError } = await supabase
      .from('poets')
      .select('name, dynasty')
      .order('popularity', { ascending: false })
      .limit(5)
    
    if (!poemsError && !poetsError) {
      console.log('\n📊 数据库丰富完成！')
      console.log(`📚 诗词总数: ${poemsData.length}`)
      console.log(`👥 诗人总数: ${poetsData.length}`)
      console.log('\n最新插入的诗词:')
      poemsData.forEach(poem => {
        console.log(`  • ${poem.title} - ${poem.author} (${poem.dynasty})`)
      })
      console.log('\n最受欢迎的诗人:')
      poetsData.forEach(poet => {
        console.log(`  • ${poet.name} (${poet.dynasty})`)
      })
    }
    
  } catch (error) {
    console.error('数据库丰富过程中出现错误:', error)
  }
}

// 执行数据库丰富
enrichDatabase().catch(console.error)