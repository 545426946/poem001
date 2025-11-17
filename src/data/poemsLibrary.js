import { tangPoetry } from './tangPoetry.js';
import { songPoetry } from './songPoetry.js';
import { yuanPoetry } from './yuanPoetry.js';
import { modernPoetry } from './modernPoetry.js';
import { classicPoetry } from './classicPoetry.js';

// 诗歌库 - 整合所有经典诗词
export const poemsLibrary = [
  // 基础诗歌
  {
    id: 1,
    title: "静夜思",
    author: "李白",
    dynasty: "唐",
    category: "思乡诗",
    difficulty: "初级",
    content: `床前明月光，疑是地上霜。
举头望明月，低头思故乡。`,
    translation: "明亮的月光洒在床前，好像地上铺了一层霜。抬头望着天上的明月，低头思念远方的故乡。",
    background: "这首诗写于李白客居他乡的夜晚，表达了诗人对故乡的深切思念之情。",
    appreciation: "全诗语言朴素自然，意境深远，通过对比手法，将思乡之情表达得淋漓尽致。",
    keywords: ["思乡", "月光", "孤独", "怀念"],
    audioUrl: "/audio/jingyesi.mp3",
    imageUrl: "/images/jingyesi.jpg"
  },
  {
    id: 2,
    title: "春晓",
    author: "孟浩然",
    dynasty: "唐",
    category: "田园诗",
    difficulty: "初级",
    content: `春眠不觉晓，处处闻啼鸟。
夜来风雨声，花落知多少。`,
    translation: "春天睡得香甜，不知不觉天就亮了，到处都能听到鸟儿的啼叫声。回想昨夜的风雨声，不知道有多少花儿被打落了。",
    background: "这是孟浩然的代表作之一，描写了春天早晨的美好景象和诗人的闲适心情。",
    appreciation: "诗歌通过听觉和想象，展现了春天的生机勃勃，体现了诗人对自然的热爱。",
    keywords: ["春天", "鸟鸣", "花落", "自然"],
    audioUrl: "/audio/chunxiao.mp3",
    imageUrl: "/images/chunxiao.jpg"
  },
  {
    id: 3,
    title: "登鹳雀楼",
    author: "王之涣",
    dynasty: "唐",
    category: "边塞诗",
    difficulty: "初级",
    content: `白日依山尽，黄河入海流。
欲穷千里目，更上一层楼。`,
    translation: "太阳依傍着山峦沉落，黄河向着大海奔流。想要看到千里之外的景色，就要再登上一层楼。",
    background: "诗人登上鹳雀楼，眺望壮丽的山河景色，抒发了积极向上的人生态度。",
    appreciation: "后两句蕴含深刻哲理，成为千古名句，激励人们不断进取，追求更高的境界。",
    keywords: ["登高", "远望", "哲理", "进取"],
    audioUrl: "/audio/dengguanquelou.mp3",
    imageUrl: "/images/dengguanquelou.jpg"
  },
  {
    id: 4,
    title: "望庐山瀑布",
    author: "李白",
    dynasty: "唐",
    category: "山水诗",
    difficulty: "中级",
    content: `日照香炉生紫烟，遥看瀑布挂前川。
飞流直下三千尺，疑是银河落九天。`,
    translation: "太阳照射香炉峰产生紫色烟雾，远远望去瀑布像挂在山前的白练。飞流直泻而下三千尺，好像是银河从九天落下来。",
    background: "李白游览庐山时所作，描绘了庐山瀑布的壮观景象。",
    appreciation: "诗人运用夸张和比喻的手法，将瀑布的雄伟气势描绘得淋漓尽致。",
    keywords: ["瀑布", "壮观", "夸张", "想象"],
    audioUrl: "/audio/wanglushanpubu.mp3",
    imageUrl: "/images/wanglushanpubu.jpg"
  },
  {
    id: 5,
    title: "咏鹅",
    author: "骆宾王",
    dynasty: "唐",
    category: "咏物诗",
    difficulty: "初级",
    content: `鹅，鹅，鹅，曲项向天歌。
白毛浮绿水，红掌拨清波。`,
    translation: "鹅，鹅，鹅，弯着脖子向天高歌。洁白的羽毛漂浮在碧绿的水面上，红色的脚掌拨动着清澈的水波。",
    background: "据传骆宾王七岁时所作，是其代表作之一。",
    appreciation: "诗歌语言简洁明快，形象生动，展现了儿童诗的天真烂漫。",
    keywords: ["咏物", "生动", "天真", "形象"],
    audioUrl: "/audio/yonge.mp3",
    imageUrl: "/images/yonge.jpg"
  },
  // 整合其他分类的诗歌
  ...tangPoetry,
  ...songPoetry,
  ...yuanPoetry,
  ...modernPoetry,
  ...classicPoetry
];

// 按朝代分类
export const poetryByDynasty = {
  '汉': poemsLibrary.filter(poem => poem.dynasty === '汉'),
  '南北朝': poemsLibrary.filter(poem => poem.dynasty === '南北朝'),
  '唐': poemsLibrary.filter(poem => poem.dynasty === '唐'),
  '宋': poemsLibrary.filter(poem => poem.dynasty === '宋'),
  '元': poemsLibrary.filter(poem => poem.dynasty === '元'),
  '明': poemsLibrary.filter(poem => poem.dynasty === '明'),
  '现代': poemsLibrary.filter(poem => poem.dynasty === '现代')
};

// 按难度分类
export const poetryByDifficulty = {
  '初级': poemsLibrary.filter(poem => poem.difficulty === '初级'),
  '中级': poemsLibrary.filter(poem => poem.difficulty === '中级'),
  '高级': poemsLibrary.filter(poem => poem.difficulty === '高级')
};

// 按类别分类
export const poetryByCategory = {
  '思乡诗': poemsLibrary.filter(poem => poem.category === '思乡诗'),
  '田园诗': poemsLibrary.filter(poem => poem.category === '田园诗'),
  '边塞诗': poemsLibrary.filter(poem => poem.category === '边塞诗'),
  '豪放诗': poemsLibrary.filter(poem => poem.category === '豪放诗'),
  '山水诗': poemsLibrary.filter(poem => poem.category === '山水诗'),
  '豪放词': poemsLibrary.filter(poem => poem.category === '豪放词'),
  '怀古词': poemsLibrary.filter(poem => poem.category === '怀古词'),
  '婉约词': poemsLibrary.filter(poem => poem.category === '婉约词'),
  '散曲': poemsLibrary.filter(poem => poem.category === '散曲'),
  '咏物诗': poemsLibrary.filter(poem => poem.category === '咏物诗'),
  '现代诗': poemsLibrary.filter(poem => poem.category === '现代诗'),
  '现实诗': poemsLibrary.filter(poem => poem.category === '现实诗'),
  '送别诗': poemsLibrary.filter(poem => poem.category === '送别诗'),
  '亲情诗': poemsLibrary.filter(poem => poem.category === '亲情诗'),
  '乐府诗': poemsLibrary.filter(poem => poem.category === '乐府诗'),
  '羁旅诗': poemsLibrary.filter(poem => poem.category === '羁旅诗'),
  '怀古诗': poemsLibrary.filter(poem => poem.category === '怀古诗'),
  '爱情诗': poemsLibrary.filter(poem => poem.category === '爱情诗')
};

// 获取随机诗歌
export const getRandomPoems = (count = 5) => {
  const shuffled = [...poemsLibrary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 搜索诗歌
export const searchPoems = (query) => {
  const lowerQuery = query.toLowerCase();
  return poemsLibrary.filter(poem => 
    poem.title.toLowerCase().includes(lowerQuery) ||
    poem.author.toLowerCase().includes(lowerQuery) ||
    poem.content.toLowerCase().includes(lowerQuery) ||
    poem.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
};

// 获取诗人作品
export const getPoemsByAuthor = (author) => {
  return poemsLibrary.filter(poem => poem.author === author);
};

// 获取推荐诗歌（基于难度和用户水平）
export const getRecommendedPoems = (userLevel = '初级', count = 10) => {
  let targetDifficulties = [];
  
  switch (userLevel) {
    case '初级':
      targetDifficulties = ['初级'];
      break;
    case '中级':
      targetDifficulties = ['初级', '中级'];
      break;
    case '高级':
      targetDifficulties = ['初级', '中级', '高级'];
      break;
    default:
      targetDifficulties = ['初级'];
  }
  
  const filteredPoems = poemsLibrary.filter(poem => 
    targetDifficulties.includes(poem.difficulty)
  );
  
  return getRandomPoems(count).filter(poem => 
    targetDifficulties.includes(poem.difficulty)
  ).slice(0, count);
};

// 获取热门诗歌（基于关键词热度）
export const getPopularPoems = (count = 10) => {
  const popularKeywords = ['思乡', '春天', '月光', '母爱', '友情', '哲理', '自然'];
  
  return poemsLibrary
    .filter(poem => 
      poem.keywords.some(keyword => popularKeywords.includes(keyword))
    )
    .slice(0, count);
};

// 获取诗歌统计信息
export const getPoemsStats = () => {
  return {
    total: poemsLibrary.length,
    byDynasty: Object.keys(poetryByDynasty).map(dynasty => ({
      dynasty,
      count: poetryByDynasty[dynasty].length
    })),
    byDifficulty: Object.keys(poetryByDifficulty).map(difficulty => ({
      difficulty, 
      count: poetryByDifficulty[difficulty].length
    })),
    byCategory: Object.keys(poetryByCategory).map(category => ({
      category,
      count: poetryByCategory[category].length
    })),
    authors: [...new Set(poemsLibrary.map(poem => poem.author))].length
  };
};