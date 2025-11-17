/**
 * 诗词数据 - 回退数据源
 * 当Supabase连接不可用时提供默认数据
 */

export const fallbackPoems = [
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    category: '唐诗',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    tags: ['思乡', '月亮', '夜晚'],
    analysis: '这首诗通过简洁的语言描绘了游子思乡之情，意境深远。'
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    category: '唐诗',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    tags: ['春天', '自然', '生活'],
    analysis: '描绘春天早晨的清新景象，语言简练，意境优美。'
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    category: '唐诗',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    tags: ['登高', '黄河', '哲理'],
    analysis: '通过登高望远表达积极向上的精神追求。'
  },
  {
    id: 4,
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋代',
    category: '宋词',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。',
    tags: ['月亮', '思念', '中秋'],
    analysis: '中秋怀人之作，情感真挚，意境开阔。'
  },
  {
    id: 5,
    title: '声声慢·寻寻觅觅',
    author: '李清照',
    dynasty: '宋代',
    category: '宋词',
    content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。',
    tags: ['忧愁', '孤独', '秋天'],
    analysis: '通过叠字手法表达深沉的愁苦之情。'
  },
  {
    id: 6,
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元代',
    category: '元曲',
    content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。',
    tags: ['秋天', '思乡', '旅途'],
    analysis: '元曲小令的典范，意象丰富，情感深沉。'
  },
  {
    id: 7,
    title: '再别康桥',
    author: '徐志摩',
    dynasty: '现代',
    category: '现代诗',
    content: '轻轻的我走了，正如我轻轻的来；我轻轻的招手，作别西天的云彩。',
    tags: ['离别', '剑桥', '浪漫'],
    analysis: '现代诗歌的经典之作，语言优美，情感细腻。'
  },
  {
    id: 8,
    title: '面朝大海，春暖花开',
    author: '海子',
    dynasty: '现代',
    category: '现代诗',
    content: '从明天起，做一个幸福的人，喂马、劈柴，周游世界。',
    tags: ['幸福', '生活', '理想'],
    analysis: '表达对简单幸福生活的向往和追求。'
  },
  {
    id: 9,
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    category: '唐诗',
    content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    tags: ['庐山', '瀑布', '壮观'],
    analysis: '夸张手法描绘庐山瀑布的雄伟壮观。'
  },
  {
    id: 10,
    title: '相思',
    author: '王维',
    dynasty: '唐代',
    category: '唐诗',
    content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
    tags: ['相思', '爱情', '红豆'],
    analysis: '借物抒情，表达深沉的相思之情。'
  },
  {
    id: 11,
    title: '青玉案·元夕',
    author: '辛弃疾',
    dynasty: '宋代',
    category: '宋词',
    content: '东风夜放花千树，更吹落、星如雨。宝马雕车香满路。',
    tags: ['元宵', '热闹', '爱情'],
    analysis: '描绘元宵佳节的热闹景象和爱情主题。'
  },
  {
    id: 12,
    title: '雨巷',
    author: '戴望舒',
    dynasty: '现代',
    category: '现代诗',
    content: '撑着油纸伞，独自彷徨在悠长、悠长又寂寥的雨巷，我希望逢着一个丁香一样地结着愁怨的姑娘。',
    tags: ['雨巷', '忧愁', '浪漫'],
    analysis: '现代派诗歌的代表作，意象独特，情感含蓄。'
  }
]

export const fallbackPoets = [
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    style: '浪漫主义',
    description: '诗仙，唐代伟大的浪漫主义诗人。'
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    style: '现实主义',
    description: '诗圣，唐代伟大的现实主义诗人。'
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    style: '豪放派',
    description: '宋代文学巨匠，诗词文书画俱佳。'
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋代',
    style: '婉约派',
    description: '宋代著名女词人，婉约词派的代表。'
  }
]

// 导出默认数据
export default {
  poems: fallbackPoems,
  poets: fallbackPoets
}