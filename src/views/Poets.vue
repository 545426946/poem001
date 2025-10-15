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
        const { data, error } = await this.$supabase
          .from('poets')
          .select('*')
          .order('name');
          
        if (error) throw error;
        this.poets = data;
      } catch (err) {
        console.error('获取诗人数据失败:', err);
        this.error = '获取诗人数据失败，请检查网络连接';
      } finally {
        this.loading = false;
      }
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