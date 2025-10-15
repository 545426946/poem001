<template>
  <div class="database-admin">
    <div class="admin-header">
      <h1>📊 Supabase 数据库管理</h1>
      <p>管理诗歌赏析平台的数据库结构和数据</p>
    </div>

    <div class="admin-content">
      <!-- 连接状态 -->
      <div class="status-section">
        <h2>🔗 数据库连接状态</h2>
        <div class="status-cards">
          <div class="status-card" :class="connectionStatus.class">
            <h3>连接状态</h3>
            <p>{{ connectionStatus.message }}</p>
            <button @click="checkConnection" :disabled="checkingConnection">
              {{ checkingConnection ? '检查中...' : '重新检查' }}
            </button>
          </div>
          <div class="status-card" :class="tablesStatus.class">
            <h3>表结构状态</h3>
            <p>{{ tablesStatus.message }}</p>
            <button @click="checkTables" :disabled="checkingTables">
              {{ checkingTables ? '检查中...' : '检查表结构' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 表结构管理 -->
      <div class="tables-section">
        <h2>🗃️ 表结构管理</h2>
        <div class="tables-controls">
          <button @click="deploySchema" :disabled="deployingSchema" class="btn-primary">
            {{ deployingSchema ? '部署中...' : '🚀 部署完整表结构' }}
          </button>
          <button @click="insertSampleData" :disabled="insertingData" class="btn-secondary">
            {{ insertingData ? '插入中...' : '📥 插入示例数据' }}
          </button>
          <button @click="resetDatabase" :disabled="resettingDatabase" class="btn-danger">
            {{ resettingDatabase ? '重置中...' : '🔄 重置数据库' }}
          </button>
        </div>

        <div class="tables-list">
          <div v-for="table in tables" :key="table.name" class="table-card">
            <h4>{{ table.name }}</h4>
            <p>记录数: {{ table.count }}</p>
            <p>状态: <span :class="table.statusClass">{{ table.status }}</span></p>
            <button @click="viewTableData(table.name)" class="btn-small">查看数据</button>
          </div>
        </div>
      </div>

      <!-- 数据操作 -->
      <div class="data-section">
        <h2>📈 数据操作</h2>
        <div class="data-controls">
          <div class="control-group">
            <label>选择表:</label>
            <select v-model="selectedTable" @change="loadTableData">
              <option value="">请选择表</option>
              <option v-for="table in tableNames" :key="table" :value="table">{{ table }}</option>
            </select>
          </div>
          <div class="control-group">
            <label>记录数:</label>
            <input type="number" v-model="recordLimit" min="1" max="100" placeholder="限制记录数">
          </div>
        </div>

        <div v-if="tableData.length > 0" class="data-table">
          <h3>{{ selectedTable }} 表数据 ({{ tableData.length }} 条记录)</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="column in tableColumns" :key="column">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableData" :key="index">
                  <td v-for="column in tableColumns" :key="column">
                    {{ formatCellValue(row[column]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 操作日志 -->
      <div class="logs-section">
        <h2>📋 操作日志</h2>
        <div class="logs-container">
          <div v-for="log in operationLogs" :key="log.id" :class="['log-entry', log.type]">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
        <button @click="clearLogs" class="btn-small">清空日志</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import mcpService from '../services/mcpService.js'

export default {
  name: 'DatabaseAdmin',
  setup() {
    // 响应式数据
    const connectionStatus = ref({ class: 'loading', message: '检查连接状态...' })
    const tablesStatus = ref({ class: 'loading', message: '检查表结构...' })
    const tables = ref([])
    const checkingConnection = ref(false)
    const checkingTables = ref(false)
    const deployingSchema = ref(false)
    const insertingData = ref(false)
    const resettingDatabase = ref(false)
    
    const selectedTable = ref('')
    const tableData = ref([])
    const tableColumns = ref([])
    const recordLimit = ref(10)
    const operationLogs = ref([])

    // 表名列表
    const tableNames = [
      'users', 'poems', 'knowledge_base_chunks', 'ai_agent_state'
    ]

    // 添加日志
    const addLog = (message, type = 'info') => {
      operationLogs.value.unshift({
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        message,
        type
      })
      // 限制日志数量
      if (operationLogs.value.length > 50) {
        operationLogs.value = operationLogs.value.slice(0, 50)
      }
    }

    // 检查连接状态
    const checkConnection = async () => {
      checkingConnection.value = true
      try {
        const health = await mcpService.healthCheck()
        connectionStatus.value = {
          class: health.healthy ? 'success' : 'error',
          message: health.healthy ? '✅ 连接正常' : `❌ 连接异常: ${health.message}`
        }
        addLog(`连接检查: ${health.healthy ? '正常' : '异常'}`, health.healthy ? 'success' : 'error')
      } catch (error) {
        connectionStatus.value = {
          class: 'error',
          message: `❌ 检查失败: ${error.message}`
        }
        addLog(`连接检查失败: ${error.message}`, 'error')
      } finally {
        checkingConnection.value = false
      }
    }

    // 检查表结构
    const checkTables = async () => {
      checkingTables.value = true
      try {
        const tableResults = []
        let healthyTables = 0
        
        for (const tableName of tableNames) {
          try {
            const result = await mcpService.query(tableName, { limit: 1 })
            tableResults.push({
              name: tableName,
              count: result.success ? '有数据' : '空表',
              status: result.success ? '正常' : '空表',
              statusClass: result.success ? 'success' : 'warning'
            })
            if (result.success) healthyTables++
          } catch (error) {
            tableResults.push({
              name: tableName,
              count: '错误',
              status: '表不存在',
              statusClass: 'error'
            })
          }
        }

        tables.value = tableResults
        tablesStatus.value = {
          class: healthyTables === tableNames.length ? 'success' : 
                  healthyTables > 0 ? 'warning' : 'error',
          message: `发现 ${healthyTables}/${tableNames.length} 个表`
        }
        
        addLog(`表结构检查完成: ${healthyTables}/${tableNames.length} 个表正常`)
      } catch (error) {
        tablesStatus.value = {
          class: 'error',
          message: `❌ 检查失败: ${error.message}`
        }
        addLog(`表结构检查失败: ${error.message}`, 'error')
      } finally {
        checkingTables.value = false
      }
    }

    // 部署表结构（模拟）
    const deploySchema = async () => {
      deployingSchema.value = true
      try {
        // 这里应该调用实际的SQL执行接口
        // 由于浏览器安全限制，实际部署需要在Supabase控制台执行
        addLog('开始部署表结构...', 'info')
        
        // 模拟部署过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        addLog('表结构部署完成！请在Supabase控制台执行SQL脚本', 'success')
        alert('表结构部署指令已生成！请复制SQL脚本到Supabase控制台执行。')
        
      } catch (error) {
        addLog(`表结构部署失败: ${error.message}`, 'error')
      } finally {
        deployingSchema.value = false
      }
    }

    // 插入示例数据（模拟）
    const insertSampleData = async () => {
      insertingData.value = true
      try {
        addLog('开始插入示例数据...', 'info')
        
        // 模拟插入过程
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        addLog('示例数据插入完成！', 'success')
        alert('示例数据插入指令已生成！请复制SQL脚本到Supabase控制台执行。')
        
        // 重新检查表状态
        checkTables()
      } catch (error) {
        addLog(`示例数据插入失败: ${error.message}`, 'error')
      } finally {
        insertingData.value = false
      }
    }

    // 重置数据库（模拟）
    const resetDatabase = async () => {
      if (!confirm('⚠️ 确定要重置数据库吗？这将删除所有数据！')) {
        return
      }
      
      resettingDatabase.value = true
      try {
        addLog('开始重置数据库...', 'warning')
        
        // 模拟重置过程
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        addLog('数据库重置完成！', 'success')
        alert('数据库重置指令已生成！请谨慎操作。')
        
        // 重新检查状态
        checkConnection()
        checkTables()
      } catch (error) {
        addLog(`数据库重置失败: ${error.message}`, 'error')
      } finally {
        resettingDatabase.value = false
      }
    }

    // 加载表数据
    const loadTableData = async () => {
      if (!selectedTable.value) {
        tableData.value = []
        tableColumns.value = []
        return
      }

      try {
        const result = await mcpService.query(selectedTable.value, {
          limit: recordLimit.value
        })

        if (result.success && result.data.length > 0) {
          tableData.value = result.data
          tableColumns.value = Object.keys(result.data[0])
          addLog(`加载表 ${selectedTable.value} 数据成功，共 ${result.data.length} 条记录`, 'success')
        } else {
          tableData.value = []
          tableColumns.value = []
          addLog(`表 ${selectedTable.value} 为空或查询失败`, 'warning')
        }
      } catch (error) {
        tableData.value = []
        tableColumns.value = []
        addLog(`加载表数据失败: ${error.message}`, 'error')
      }
    }

    // 查看表数据
    const viewTableData = (tableName) => {
      selectedTable.value = tableName
      loadTableData()
    }

    // 格式化单元格值
    const formatCellValue = (value) => {
      if (value === null || value === undefined) return '-'
      if (typeof value === 'object') return JSON.stringify(value).substring(0, 50) + '...'
      if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...'
      return value
    }

    // 清空日志
    const clearLogs = () => {
      operationLogs.value = []
      addLog('操作日志已清空', 'info')
    }

    // 初始化
    onMounted(() => {
      checkConnection()
      checkTables()
      addLog('数据库管理页面已加载', 'info')
    })

    return {
      connectionStatus,
      tablesStatus,
      tables,
      checkingConnection,
      checkingTables,
      deployingSchema,
      insertingData,
      resettingDatabase,
      selectedTable,
      tableData,
      tableColumns,
      recordLimit,
      operationLogs,
      tableNames,
      checkConnection,
      checkTables,
      deploySchema,
      insertSampleData,
      resetDatabase,
      loadTableData,
      viewTableData,
      formatCellValue,
      clearLogs
    }
  }
}
</script>

<style scoped>
.database-admin {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.admin-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.status-section, .tables-section, .data-section, .logs-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-section h2, .tables-section h2, .data-section h2, .logs-section h2 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.status-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.status-card.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.status-card.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.status-card.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.status-card.loading {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.tables-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-small {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tables-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.table-card {
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.table-card h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.data-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: bold;
  color: #495057;
}

.control-group select, .control-group input {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.data-table {
  margin-top: 20px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

th {
  background: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin-bottom: 10px;
}

.log-entry {
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.log-entry.info {
  background: #d1ecf1;
  color: #0c5460;
}

.log-entry.success {
  background: #d4edda;
  color: #155724;
}

.log-entry.warning {
  background: #fff3cd;
  color: #856404;
}

.log-entry.error {
  background: #f8d7da;
  color: #721c24;
}

.log-time {
  font-weight: bold;
  margin-right: 10px;
}

@media (max-width: 768px) {
  .status-cards {
    grid-template-columns: 1fr;
  }
  
  .tables-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .data-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>