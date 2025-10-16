<template>
  <div class="poets-container">
    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1 class="brand-title">古韵诗香</h1>
          </router-link>
          <span class="brand-subtitle">诗人名录</span>
        </div>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/poems" class="nav-link">诗词库</router-link></li>
          <li><router-link to="/poets" class="nav-link">诗人</router-link></li>
          <li><router-link to="/appreciation" class="nav-link">赏析</router-link></li>
          <li><router-link to="/about" class="nav-link">关于</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="poets-main">
      <div class="container">
        <!-- 诗人筛选 -->
        <div class="filters-section">
          <div class="filter-options">
            <select v-model="selectedDynasty" class="filter-select">
              <option value="">全部朝代</option>
              <option value="唐">唐代</option>
              <option value="宋">宋代</option>
              <option value="元">元代</option>
              <option value="明">明代</option>
              <option value="清">清代</option>
            </select>
            
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索诗人..." 
                class="search-input"
              />
            </div>
          </div>
        </div>

        <!-- 诗人列表 -->
        <div class="poets-grid">
          <div class="poet-card" v-for="poet in filteredPoets" :key="poet.id">
            <div class="poet-avatar">
              <div class="avatar-placeholder">{{ poet.name.charAt(0) }}</div>
            </div>
            <div class="poet-info">
              <h3 class="poet-name">{{ poet.name }}</h3>
              <p class="poet-dynasty">{{ poet.dynasty }}诗人</p>
              <p class="poet-bio">{{ poet.bio }}</p>
              <div class="poet-stats">
                <span class="stat">作品: {{ poet.worksCount }}首</span>
                <span class="stat">朝代: {{ poet.dynasty }}</span>
              </div>
              <router-link :to="`/poet/${poet.id}`" class="view-profile">查看详情</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import mcpService from '../services/mcpService.js'

export default {
  name: 'Poets',
  data() {
    return {
      searchQuery: '',
      selectedDynasty: '',
      poets: [],
      loading: true,
      error: null
    }
  },
  computed: {
    filteredPoets() {
      let filtered = this.poets;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(poet => 
          poet.name.toLowerCase().includes(query)
        );
      }
      
      if (this.selectedDynasty) {
        filtered = filtered.filter(poet => poet.dynasty === this.selectedDynasty);
      }
      
      return filtered;
    }
  },
  
  async mounted() {
    await this.fetchPoets();
  },
  
  methods: {
    async fetchPoets() {
      try {
        this.loading = true;
        // 初始化MCP服务
        await mcpService.initialize();
        const poets = await mcpService.getPoets('all');
        
        if (poets && poets.length > 0) {
          this.poets = poets.map(poet => ({
            id: poet.id,
            name: poet.name,
            dynasty: poet.dynasty,
            bio: poet.bio || `${poet.name}，${poet.dynasty}时期著名诗人`,
            worksCount: poet.works_count || 0
          }));
        } else {
          // 使用回退数据
          this.poets = this.getFallbackPoets();
        }
      } catch (err) {
        console.error('获取诗人数据失败:', err);
        this.error = '获取诗人数据失败，请检查网络连接';
        // 使用回退数据
        this.poets = this.getFallbackPoets();
      } finally {
        this.loading = false;
      }
    },
    
    getFallbackPoets() {
      return [
        {
          id: 1,
          name: '李白',
          dynasty: '唐',
          bio: '唐代伟大的浪漫主义诗人，被誉为"诗仙"，作品豪放飘逸，想象丰富。',
          worksCount: 1000
        },
        {
          id: 2,
          name: '杜甫',
          dynasty: '唐',
          bio: '唐代伟大的现实主义诗人，被誉为"诗圣"，作品沉郁顿挫，反映社会现实。',
          worksCount: 1400
        },
        {
          id: 3,
          name: '苏轼',
          dynasty: '宋',
          bio: '宋代文学巨匠，诗词文书画俱佳，豪放词派的代表人物。',
          worksCount: 2700
        },
        {
          id: 4,
          name: '李清照',
          dynasty: '宋',
          bio: '宋代著名女词人，婉约词派的代表，作品情感细腻，语言优美。',
          worksCount: 60
        },
        {
          id: 5,
          name: '白居易',
          dynasty: '唐',
          bio: '唐代现实主义诗人，作品通俗易懂，关注民生疾苦。',
          worksCount: 2800
        },
        {
          id: 6,
          name: '王维',
          dynasty: '唐',
          bio: '唐代山水田园诗人，诗中有画，画中有诗，意境优美。',
          worksCount: 400
        },
        {
          id: 7,
          name: '辛弃疾',
          dynasty: '宋',
          bio: '宋代豪放派词人，作品气势雄浑，充满爱国热情。',
          worksCount: 600
        },
        {
          id: 8,
          name: '陆游',
          dynasty: '宋',
          bio: '宋代爱国诗人，作品充满忧国忧民的情怀。',
          worksCount: 9000
        }
      ];
    }
  }
}
</script>

<style scoped>
.poets-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.poetry-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(210, 180, 140, 0.3);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
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

.brand-link {
  text-decoration: none;
}

.brand-title {
  font-size: 2.2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin: 0;
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

.nav-link {
  text-decoration: none;
  color: #666;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.router-link-active {
  color: #8B4513;
  background: rgba(210, 180, 140, 0.2);
}

.poets-main {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filters-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.filter-options {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 8px;
  background: white;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 8px;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.poet-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  transition: transform 0.3s ease;
}

.poet-card:hover {
  transform: translateY(-5px);
}

.poet-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.poet-info {
  flex: 1;
}

.poet-name {
  font-size: 1.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 5px;
}

.poet-dynasty {
  color: #666;
  margin-bottom: 10px;
}

.poet-bio {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.poet-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.stat {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.view-profile {
  color: #8B4513;
  text-decoration: none;
  font-weight: bold;
}

@media (max-width: 768px) {
  .poet-card {
    flex-direction: column;
    text-align: center;
  }
  
  .filter-options {
    flex-direction: column;
  }
}
</style>