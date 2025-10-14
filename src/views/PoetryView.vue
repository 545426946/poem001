<template>
  <div class="poetry-container">
    <!-- 古风背景装饰 -->
    <div class="background-decoration">
      <div class="mountain"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1 class="brand-title">古韵诗香</h1>
          <span class="brand-subtitle">诗词赏析平台</span>
        </div>
        <ul class="nav-menu">
          <li><a href="#tangshi" :class="{ active: activeSection === 'tangshi' }" @click="setActiveSection('tangshi')">唐诗</a></li>
          <li><a href="#songci" :class="{ active: activeSection === 'songci' }" @click="setActiveSection('songci')">宋词</a></li>
          <li><a href="#gushi" :class="{ active: activeSection === 'gushi' }" @click="setActiveSection('gushi')">古诗</a></li>
          <li><a href="#about" :class="{ active: activeSection === 'about' }" @click="setActiveSection('about')">关于</a></li>
        </ul>
      </div>
    </nav>

    <!-- 主布局 -->
    <div class="main-layout">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-section">
            <h3>诗词分类</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id" 
                  :class="{ active: activeCategory === category.id }"
                  @click="setActiveCategory(category.id)">
                {{ category.name }} <span class="count">({{ category.count }})</span>
              </li>
            </ul>
          </div>
          
          <div class="sidebar-section">
            <h3>热门诗人</h3>
            <ul class="poet-list">
              <li v-for="poet in topPoets" :key="poet.name">
                <span class="poet-name">{{ poet.name }}</span>
                <span class="poet-count">{{ poet.count }}首</span>
              </li>
            </ul>
          </div>

          <div class="sidebar-section">
            <h3>今日推荐</h3>
            <div class="recommendation">
              <div class="rec-poem">
                <div class="rec-title">{{ todayRecommendation.title }}</div>
                <div class="rec-author">{{ todayRecommendation.author }}</div>
                <div class="rec-preview">{{ todayRecommendation.preview }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="poetry-main">
        <div class="poetry-content">
          <!-- 搜索框 -->
          <div class="search-section">
            <div class="search-container">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索诗词、作者或关键词..." 
                class="search-input"
              />
              <button class="search-btn">搜索</button>
            </div>
          </div>

          <!-- 诗词展示区 -->
          <section class="poetry-section" v-for="category in filteredCategories" :key="category.id">
            <h2 class="section-title">{{ category.name }}</h2>
            <div class="poetry-grid">
              <div class="poetry-card" v-for="poem in getPoemsByCategory(category.id)" :key="poem.id">
                <div class="poetry-header">
                  <div class="poetry-title">{{ poem.title }}</div>
                  <div class="poetry-author">【{{ poem.dynasty }}】{{ poem.author }}</div>
                </div>
                <div class="poetry-content">
                  <p v-for="(line, index) in poem.content" :key="index" class="poetry-line">
                    {{ line }}
                  </p>
                </div>
                <div class="poetry-appreciation">
                  <h3>赏析</h3>
                  <p>{{ poem.appreciation }}</p>
                </div>
                <div class="poetry-tags">
                  <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PoetryView',
  data() {
    return {
      activeSection: 'tangshi',
      activeCategory: 'all',
      searchQuery: '',
      categories: [
        { id: 'all', name: '全部诗词', count: 25 },
        { id: 'love', name: '爱情诗词', count: 8 },
        { id: 'landscape', name: '山水田园', count: 6 },
        { id: 'farewell', name: '送别思念', count: 5 },
        { id: 'patriotic', name: '爱国忧民', count: 6 }
      ],
      topPoets: [
        { name: '李白', count: 5 },
        { name: '杜甫', count: 4 },
        { name: '苏轼', count: 4 },
        { name: '白居易', count: 3 },
        { name: '王维', count: 3 }
      ],
      todayRecommendation: {
        title: '水调歌头·明月几时有',
        author: '苏轼',
        preview: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。'
      },
      poems: [
        // 唐诗
        {
          id: 1,
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          category: 'love',
          tags: ['思乡', '明月'],
          content: [
            '床前明月光，',
            '疑是地上霜。',
            '举头望明月，',
            '低头思故乡。'
          ],
          appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉；后两句通过动作神态的刻画，深化思乡之情。'
        },
        {
          id: 2,
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐',
          category: 'landscape',
          tags: ['春天', '自然'],
          content: [
            '春眠不觉晓，',
            '处处闻啼鸟。',
            '夜来风雨声，',
            '花落知多少。'
          ],
          appreciation: '这首诗是诗人隐居在鹿门山时所作，意境十分优美。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。'
        },
        {
          id: 3,
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐',
          category: 'landscape',
          tags: ['登高', '望远'],
          content: [
            '白日依山尽，',
            '黄河入海流。',
            '欲穷千里目，',
            '更上一层楼。'
          ],
          appreciation: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。前两句写所见，后两句写所想。'
        },
        {
          id: 4,
          title: '相思',
          author: '王维',
          dynasty: '唐',
          category: 'love',
          tags: ['相思', '红豆'],
          content: [
            '红豆生南国，',
            '春来发几枝。',
            '愿君多采撷，',
            '此物最相思。'
          ],
          appreciation: '这是借咏物而寄相思的诗，是眷怀友人之作。全诗情调健美高雅，怀思饱满奔放，语言朴素无华，韵律和谐柔美。'
        },
        {
          id: 5,
          title: '黄鹤楼送孟浩然之广陵',
          author: '李白',
          dynasty: '唐',
          category: 'farewell',
          tags: ['送别', '友情'],
          content: [
            '故人西辞黄鹤楼，',
            '烟花三月下扬州。',
            '孤帆远影碧空尽，',
            '唯见长江天际流。'
          ],
          appreciation: '这首诗是李白出蜀壮游期间的作品，写诗人送别友人时无限依恋的感情，也写出祖国河山的壮丽美好。'
        },
        {
          id: 6,
          title: '春望',
          author: '杜甫',
          dynasty: '唐',
          category: 'patriotic',
          tags: ['忧国', '思家'],
          content: [
            '国破山河在，',
            '城春草木深。',
            '感时花溅泪，',
            '恨别鸟惊心。',
            '烽火连三月，',
            '家书抵万金。',
            '白头搔更短，',
            '浑欲不胜簪。'
          ],
          appreciation: '这首诗全篇情景交融，感情深沉，而又含蓄凝练，言简意赅，充分体现了"沉郁顿挫"的艺术风格。'
        },
        {
          id: 7,
          title: '望庐山瀑布',
          author: '李白',
          dynasty: '唐',
          category: 'landscape',
          tags: ['瀑布', '庐山'],
          content: [
            '日照香炉生紫烟，',
            '遥看瀑布挂前川。',
            '飞流直下三千尺，',
            '疑是银河落九天。'
          ],
          appreciation: '这首诗形象地描绘了庐山瀑布雄奇壮丽的景色，反映了诗人对祖国大好河山的无限热爱。'
        },
        {
          id: 8,
          title: '江雪',
          author: '柳宗元',
          dynasty: '唐',
          category: 'landscape',
          tags: ['冬景', '孤独'],
          content: [
            '千山鸟飞绝，',
            '万径人踪灭。',
            '孤舟蓑笠翁，',
            '独钓寒江雪。'
          ],
          appreciation: '诗人只用了二十个字，就描绘了一幅幽静寒冷的画面：在下着大雪的江面上，一叶小舟，一个老渔翁，独自在寒冷的江心垂钓。'
        },
        // 宋词
        {
          id: 9,
          title: '水调歌头·明月几时有',
          author: '苏轼',
          dynasty: '宋',
          category: 'love',
          tags: ['中秋', '思念'],
          content: [
            '明月几时有？把酒问青天。',
            '不知天上宫阙，今夕是何年。',
            '我欲乘风归去，又恐琼楼玉宇，',
            '高处不胜寒。',
            '起舞弄清影，何似在人间。'
          ],
          appreciation: '此词是中秋望月怀人之作，表达了对胞弟苏辙的无限怀念。词人运用形象描绘手法，勾勒出一种皓月当空、亲人千里、孤高旷远的境界氛围。'
        },
        {
          id: 10,
          title: '声声慢·寻寻觅觅',
          author: '李清照',
          dynasty: '宋',
          category: 'love',
          tags: ['愁绪', '孤独'],
          content: [
            '寻寻觅觅，冷冷清清，',
            '凄凄惨惨戚戚。',
            '乍暖还寒时候，最难将息。',
            '三杯两盏淡酒，',
            '怎敌他、晚来风急？'
          ],
          appreciation: '作品通过描写残秋所见、所闻、所感，抒发自己因国破家亡、天涯沦落而产生的孤寂落寞、悲凉愁苦的心绪，具有浓厚的时代色彩。'
        },
        {
          id: 11,
          title: '满江红·写怀',
          author: '岳飞',
          dynasty: '宋',
          category: 'patriotic',
          tags: ['爱国', '壮志'],
          content: [
            '怒发冲冠，凭栏处、潇潇雨歇。',
            '抬望眼，仰天长啸，壮怀激烈。',
            '三十功名尘与土，',
            '八千里路云和月。',
            '莫等闲、白了少年头，空悲切！'
          ],
          appreciation: '此词上片抒写作者对中原重陷敌手的悲愤，对局势前功尽弃的痛惜，表达了自己继续努力争取壮年立功的心愿；下片抒写作者对民族敌人的深仇大恨，对祖国统一的殷切愿望。'
        },
        {
          id: 12,
          title: '青玉案·元夕',
          author: '辛弃疾',
          dynasty: '宋',
          category: 'love',
          tags: ['元宵', '爱情'],
          content: [
            '东风夜放花千树，',
            '更吹落、星如雨。',
            '宝马雕车香满路。',
            '凤箫声动，玉壶光转，',
            '一夜鱼龙舞。'
          ],
          appreciation: '此词从极力渲染元宵节绚丽多彩的热闹场面入手，反衬出一个孤高淡泊、超群拔俗、不同于金翠脂粉的女性形象，寄托着作者政治失意后不愿与世俗同流合污的孤高品格。'
        },
        // 更多诗词...
        {
          id: 13,
          title: '悯农',
          author: '李绅',
          dynasty: '唐',
          category: 'patriotic',
          tags: ['农民', '劳动'],
          content: [
            '锄禾日当午，',
            '汗滴禾下土。',
            '谁知盘中餐，',
            '粒粒皆辛苦。'
          ],
          appreciation: '这首诗语言朴实无华，浅显易懂，但却十分感人，主要原因是由于这首诗所抒写的内容是人们经常接触到的最熟悉的事情。'
        },
        {
          id: 14,
          title: '枫桥夜泊',
          author: '张继',
          dynasty: '唐',
          category: 'landscape',
          tags: ['夜景', '思乡'],
          content: [
            '月落乌啼霜满天，',
            '江枫渔火对愁眠。',
            '姑苏城外寒山寺，',
            '夜半钟声到客船。'
          ],
          appreciation: '这首七绝以一"愁"字统起。前二句意象密集：落月、啼乌、满天霜、江枫、渔火、不眠人，造成一种意韵浓郁的审美情境。'
        },
        {
          id: 15,
          title: '游子吟',
          author: '孟郊',
          dynasty: '唐',
          category: 'love',
          tags: ['母爱', '亲情'],
          content: [
            '慈母手中线，',
            '游子身上衣。',
            '临行密密缝，',
            '意恐迟迟归。',
            '谁言寸草心，',
            '报得三春晖。'
          ],
          appreciation: '这是一首母爱的颂歌。全诗共六句三十字，采用白描的手法，通过回忆一个看似平常的临行前缝衣的场景，凸显并歌颂了母爱的伟大与无私。'
        }
      ]
    }
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(cat => 
        this.activeCategory === 'all' || cat.id === this.activeCategory
      )
    }
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section
    },
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId
    },
    getPoemsByCategory(categoryId) {
      if (categoryId === 'all') {
        return this.poems
      }
      return this.poems.filter(poem => poem.category === categoryId)
    }
  }
}
</script>

<style scoped>
.poetry-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.mountain {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 300px;
  height: 200px;
  background: linear-gradient(45deg, #8B7355 0%, #A0522D 100%);
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  opacity: 0.3;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0.6;
}

.cloud-1 {
  width: 120px;
  height: 60px;
  top: 20%;
  left: 5%;
  animation: float 20s infinite linear;
}

.cloud-2 {
  width: 80px;
  height: 40px;
  top: 30%;
  right: 10%;
  animation: float 25s infinite linear reverse;
}

.cloud-3 {
  width: 100px;
  height: 50px;
  top: 60%;
  left: 15%;
  animation: float 30s infinite linear;
}

@keyframes float {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
}

/* 导航栏样式 */
.poetry-nav {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(210, 180, 140, 0.3);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-title {
  font-size: 2.2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  font-size: 1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  font-style: italic;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-menu a {
  text-decoration: none;
  color: #666;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #8B4513;
  background: rgba(210, 180, 140, 0.2);
}

.nav-menu a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: #8B4513;
}

/* 主布局 */
.main-layout {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  min-height: calc(100vh - 70px);
}

/* 侧边栏样式 */
.sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-section h3 {
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(210, 180, 140, 0.3);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: '宋体', 'SimSun', serif;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-list li:hover,
.category-list li.active {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
}

.category-list .count {
  font-size: 0.9rem;
  opacity: 0.7;
}

.poet-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.poet-list li {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(210, 180, 140, 0.2);
  font-family: '宋体', 'SimSun', serif;
  color: #666;
}

.poet-list li:last-child {
  border-bottom: none;
}

.poet-name {
  font-weight: bold;
}

.poet-count {
  font-size: 0.9rem;
  opacity: 0.7;
}

.recommendation {
  background: rgba(210, 180, 140, 0.1);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #D2B48C;
}

.rec-poem .rec-title {
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  color: #8B4513;
  font-weight: bold;
  margin-bottom: 5px;
}

.rec-poem .rec-author {
  font-family: '宋体', 'SimSun', serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.rec-poem .rec-preview {
  font-family: '楷体', 'STKaiti', serif;
  font-size: 0.9rem;
  color: #888;
  line-height: 1.4;
}

/* 主内容区域 */
.poetry-main {
  min-height: 600px;
}

.search-section {
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  gap: 10px;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 25px;
  font-family: '宋体', 'SimSun', serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #D2B48C;
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.3);
}

.search-btn {
  padding: 12px 25px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

/* 诗词展示区 */
.poetry-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #D2B48C;
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.poetry-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.poetry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.poetry-header {
  text-align: center;
  margin-bottom: 20px;
}

.poetry-title {
  font-size: 1.6rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin-bottom: 8px;
}

.poetry-author {
  font-size: 1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  font-style: italic;
}

.poetry-content {
  margin-bottom: 20px;
}

.poetry-line {
  font-size: 1.2rem;
  color: #333;
  font-family: '楷体', 'STKaiti', serif;
  line-height: 1.8;
  text-align: center;
  margin: 8px 0;
}

.poetry-appreciation {
  background: rgba(210, 180, 140, 0.1);
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid #D2B48C;
  margin-bottom: 15px;
}

.poetry-appreciation h3 {
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.poetry-appreciation p {
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  line-height: 1.6;
  font-size: 0.95rem;
  text-align: justify;
}

.poetry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-family: '宋体', 'SimSun', serif;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    position: static;
    order: 2;
  }
  
  .poetry-main {
    order: 1;
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }
  
  .nav-menu {
    gap: 15px;
  }
  
  .nav-menu a {
    font-size: 1rem;
    padding: 6px 12px;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .main-layout {
    padding: 20px 15px;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .poetry-card {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .poetry-title {
    font-size: 1.4rem;
  }
  
  .poetry-line {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .poetry-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .sidebar {
    padding: 20px;
  }
}
</style>