<template>
  <div class="ai-chat-assistant">
    <!-- 悬浮按钮 -->
    <button 
      class="chat-toggle-btn"
      :class="{ 'active': isOpen }"
      @click="toggleChat"
      aria-label="打开AI助手"
    >
      <span v-if="!isOpen" class="ai-icon">🤖</span>
      <span v-else class="close-icon">✕</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window">
      <!-- 头部 -->
      <div class="chat-header">
        <h3>诗词AI助手</h3>
        <span class="status-dot" :class="connectionStatus"></span>
      </div>

      <!-- 消息区域 -->
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.role]"
        >
          <div class="message-content">
            <div class="message-avatar">
              <span v-if="message.role === 'assistant'">🤖</span>
              <span v-else>👤</span>
            </div>
            <div class="message-bubble">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-message">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>AI助手正在思考...</span>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-container">
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.text"
            @click="sendQuickMessage(action.text)"
            class="quick-action-btn"
          >
            {{ action.text }}
          </button>
        </div>
        
        <div class="input-wrapper">
          <textarea
            v-model="inputMessage"
            @keydown.enter.prevent="handleSendMessage"
            placeholder="请输入关于诗词的问题..."
            rows="1"
            ref="messageInput"
            class="message-input"
          ></textarea>
          <button 
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            class="send-btn"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useN8nService } from '../services/n8nService'

export default {
  name: 'AIChatAssistant',
  
  setup() {
    const isOpen = ref(false)
    const inputMessage = ref('')
    const messages = ref([])
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    
    const { sendMessageToN8n, connectionStatus } = useN8nService()

    // 快速操作按钮
    const quickActions = ref([
      { text: '推荐一首经典诗词' },
      { text: '帮我赏析这首诗' },
      { text: '解释诗词含义' },
      { text: '推荐学习路径' }
    ])

    // 切换聊天窗口
    const toggleChat = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        nextTick(() => {
          scrollToBottom()
          messageInput.value?.focus()
        })
        
        // 如果没有消息，显示欢迎消息
        if (messages.value.length === 0) {
          addMessage({
            role: 'assistant',
            content: '您好！我是诗词AI助手，可以帮您：\n• 赏析诗词作品\n• 解释诗词含义\n• 推荐学习路径\n• 解答诗词相关问题\n\n请问有什么可以帮您的吗？',
            timestamp: new Date()
          })
        }
      }
    }

    // 添加消息
    const addMessage = (message) => {
      messages.value.push(message)
      nextTick(scrollToBottom)
    }

    // 滚动到底部
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    // 发送消息
    const sendMessage = async () => {
      const message = inputMessage.value.trim()
      if (!message || isLoading.value) return

      // 添加用户消息
      addMessage({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      inputMessage.value = ''
      isLoading.value = true

      try {
        // 调用n8n服务
        const response = await sendMessageToN8n(message, messages.value)
        
        // 添加AI回复
        addMessage({
          role: 'assistant',
          content: response,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        addMessage({
          role: 'assistant',
          content: '抱歉，我暂时无法处理您的请求。请检查网络连接或稍后再试。',
          timestamp: new Date()
        })
      } finally {
        isLoading.value = false
        nextTick(() => {
          messageInput.value?.focus()
        })
      }
    }

    // 处理回车键发送
    const handleSendMessage = (event) => {
      if (event.shiftKey) {
        // Shift+Enter 换行
        return
      }
      event.preventDefault()
      sendMessage()
    }

    // 发送快速消息
    const sendQuickMessage = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    // 格式化消息内容
    const formatMessage = (content) => {
      return content.replace(/\n/g, '<br>')
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 监听输入框变化，自动调整高度
    watch(inputMessage, () => {
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.style.height = 'auto'
          messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
        }
      })
    })

    return {
      isOpen,
      inputMessage,
      messages,
      isLoading,
      connectionStatus,
      quickActions,
      messagesContainer,
      messageInput,
      toggleChat,
      sendMessage,
      handleSendMessage,
      sendQuickMessage,
      formatMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.ai-chat-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(139, 69, 19, 0.4);
}

.chat-toggle-btn.active {
  background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CAF50;
}

.status-dot.connecting {
  background: #FFC107;
  animation: pulse 1.5s infinite;
}

.status-dot.error {
  background: #F44336;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.messages-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 15px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.message.assistant .message-content {
  flex-direction: row;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  background: white;
  padding: 12px 15px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.assistant .message-bubble {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border-bottom-left-radius: 5px;
}

.message.user .message-bubble {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 5px;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 5px;
  display: block;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  color: #666;
}

.typing-indicator {
  display: flex;
  gap: 3px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8B4513;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-container {
  border-top: 1px solid #e9ecef;
  background: white;
}

.quick-actions {
  padding: 10px 15px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid #e9ecef;
}

.quick-action-btn {
  padding: 6px 12px;
  border: 1px solid #8B4513;
  border-radius: 15px;
  background: transparent;
  color: #8B4513;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #8B4513;
  color: white;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  padding: 15px;
  gap: 10px;
}

.message-input {
  flex: 1;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 10px 15px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  max-height: 120px;
}

.message-input:focus {
  border-color: #8B4513;
}

.send-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #8B4513;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #A0522D;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    right: -10px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}
</style>