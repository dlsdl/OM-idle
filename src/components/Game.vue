<template>
  <div class="game">
    <!-- 结果显示区域 -->
    <div class="result-section">
      <h1 class="result-title">序数增量放置版</h1>
      <div class="result-content" v-html="convertedValue"></div>
      <div class="result-content" v-if="value >= 7625597484987">
        恭喜通关！您已到达该版本结局！
      </div>
    </div>

    <!-- 选项卡导航 -->
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'upgrade' }" 
        @click="activeTab = 'upgrade'"
      >
        升级
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'settings' }" 
        @click="activeTab = 'settings'"
      >
        设置
      </button>
    </div>

    <!-- 选项卡内容 -->
    <div class="tab-content">
    
      <!-- 升级选项卡 -->
      <div v-if="activeTab === 'upgrade'" class="upgrade-tab">
        <div class="current-value">序数点: {{ formatNumber(value) }}</div>

        <div class="upgrade-card">
          <h2>自动器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ automatorLevel }}</div>
            <div class="stat">每秒推演: {{ automatorLevel }} × 2<sup>{{ amplifierLevel }}</sup> = {{ formatNumber(productionPerSecond) }}</div>
            <div class="stat">升级成本: {{ formatNumber(automatorCost) }}</div>
          </div>
          <button 
            class="upgrade-button" 
            @click="upgradeAutomator" 
            :disabled="value < automatorCost"
          >
            升级
          </button>
        </div>

        <div class="upgrade-card">
          <h2>增幅器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ amplifierLevel }}</div>
            <div class="stat">增幅倍数: 2<sup>{{ amplifierLevel }}</sup></div>
            <div class="stat">升级成本: {{ formatNumber(amplifierCost) }}</div>
          </div>
          <button 
            class="upgrade-button" 
            @click="upgradeAmplifier" 
            :disabled="value < amplifierCost"
          >
            升级
          </button>
        </div>
      </div>

      <!-- 设置选项卡 -->
      <div v-if="activeTab === 'settings'" class="settings-tab">
        <div class="settings-card">
          <div align="center">序数增量放置版 - 作者:dlsdl(6左爷6)</div><br />

          <h3>游戏设置</h3>
          
          <div class="setting-item">
            <button class="setting-button" @click="saveGame">保存游戏</button>
            <button class="setting-button danger" @click="resetGame">重置游戏</button>
          </div>

          <div class="setting-item">
            <button class="setting-button" @click="exportSave">导出存档</button>
            <button class="setting-button" @click="importSave">导入存档</button>
            <input 
              type="file" 
              id="save-import" 
              ref="saveImportInput" 
              style="display: none;" 
              @change="handleFileImport"
            />
          </div>

          <div class="setting-item settings-row">
            <label class="setting-label">刷新率</label>
            <div class="setting-controls">
              <input 
                type="range" 
                min="30" 
                max="200" 
                step="10" 
                v-model.number="refreshRate"
                @change="restartGameLoop"
                class="slider"
              />
              <span class="setting-value">{{ refreshRate }}ms</span>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">背景音乐</label>
            <div class="music-controls">
              <button class="setting-button small" @click="prevMusic">上一首</button>
              <div class="music-info">
                <span class="music-name">{{ musicName[currentMusicIndex] }}</span>
              </div>
              <button class="setting-button small" @click="nextMusic">下一首</button>
            </div>
          </div>

            <div class="progress-bar" v-if="Date.now() >= 1767196800000 && Date.now() <= 1798732800000">
              <div class="progress-fill" :style="{ width: `${(Date.now() - 1767196800000) / (1798732800000 - 1767196800000) * 100}`+`%`}">
                <div style="position: absolute; align-items: center;">
                  您已经过完2026年的 {{((Date.now() - 1767196800000) / (1798732800000 - 1767196800000) * 100).toFixed(6)}}%
                </div>
              </div>
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { convertToInheritedTernary } from '../utils/inheritedTernary'

// 游戏状态
const value = ref(1)
const automatorLevel = ref(0)
const amplifierLevel = ref(0)
const activeTab = ref('upgrade')
const musicEnabled = ref(true)
const saveImportInput = ref<HTMLInputElement | null>(null)
const refreshRate = ref(50) // 刷新率，单位ms
const currentMusicIndex = ref(0) // 当前音乐索引

// 音乐列表
const musicList = [
  "",
  "https://cdn.glitch.com/03a4b67b-6f18-4f6d-8d37-50a18fb615c8%2FGoing%20Down%20by%20Jake%20Chudnow%20%5BHD%5D.mp3?v=1581538237884",
  "https://cdn.glitch.com/03a4b67b-6f18-4f6d-8d37-50a18fb615c8%2FHypnothis.mp3?v=1584285594822",
  "https://cdn.glitch.com/310d7aca-4728-445f-9084-db26ceccd7b5%2FArseniy%20Shkljaev%20-%20Nuclearoids%20%5BTrance%5D.mp3?v=1591548196791",
  "https://cdn.glitch.com/310d7aca-4728-445f-9084-db26ceccd7b5%2FHeaven%20and%20Hell%20-%20Jeremy%20Blake%20%5BMpgun.com%5D.mp3?v=1592859293921",
  "https://cdn.glitch.com/6f7e4eb0-585a-45ff-a8c1-2d13a9a7d93f%2FLesion%20X%20-%20A%20Journey%20Through%20The%20Universe%20%5BMpgun.com%5D.mp3?v=1596376734350",
  "https://cdn.glitch.com/310d7aca-4728-445f-9084-db26ceccd7b5%2FMan%20Down.mp3?v=1593650783387"
]

const musicName = [
  "无",
  "Going Down",
  "Hypnothis",
  "Nuclearoids",
  "Heaven and Hell",
  "A Journey Through The Universe",
  "Man Down"
]

// 音频元素
const audio = ref<HTMLAudioElement | null>(null)

// 定时器
let gameLoop: number | null = null

// 计算属性
const productionPerSecond = computed(() => {
  return automatorLevel.value * Math.pow(2, amplifierLevel.value)
})

const automatorCost = computed(() => {
  return Math.pow(2, automatorLevel.value)
})

const amplifierCost = computed(() => {
  return Math.pow(2.5, amplifierLevel.value + 4)
})

const convertedValue = computed(() => {
  const result = convertToInheritedTernary(Math.floor(value.value))
  return result.result
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num < 1000) return num.toFixed(3)
  if (num < 1000000) return (num / 1000).toFixed(3) + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(3) + 'M'
  if (num < 1000000000000) return (num / 1000000000).toFixed(3) + 'B'
  return (num / 1000000000000).toFixed(3) + 'T'
}

// 游戏循环
const startGameLoop = () => {
  if (gameLoop) return
  const updateInterval = refreshRate.value
  gameLoop = window.setInterval(() => {
    if (value.value < 7625597484987) value.value += productionPerSecond.value / (1000 / updateInterval); // 根据刷新率计算每次更新量
    else value.value = 7625597484987;
  }, updateInterval)
}

const stopGameLoop = () => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
}

// 重启游戏循环（用于刷新率改变时）
const restartGameLoop = () => {
  stopGameLoop()
  startGameLoop()
}

//每10秒自动保存游戏
const autoSaveGame = () => {
  setInterval(() => {
    saveGame()
  }, 10000)
}

// 升级函数
const upgradeAutomator = () => {
  if (value.value >= automatorCost.value) {
    value.value -= automatorCost.value
    automatorLevel.value++
    saveGame()
  }
}

const upgradeAmplifier = () => {
  if (value.value >= amplifierCost.value) {
    value.value -= amplifierCost.value
    amplifierLevel.value++
    saveGame()
  }
}

// 存档功能
const saveGame = () => {
  const saveData = {
    value: value.value,
    automatorLevel: automatorLevel.value,
    amplifierLevel: amplifierLevel.value,
    musicEnabled: musicEnabled.value,
    refreshRate: refreshRate.value,
    currentMusicIndex: currentMusicIndex.value,
    timestamp: Date.now()
  }
  localStorage.setItem('inheritedTernaryGame', JSON.stringify(saveData))
  console.log('拜谢')
}

const loadGame = () => {
  const saveData = localStorage.getItem('inheritedTernaryGame')
  if (saveData) {
    const data = JSON.parse(saveData)
    value.value = data.value || 0
    automatorLevel.value = data.automatorLevel || 0
    amplifierLevel.value = data.amplifierLevel || 0
    musicEnabled.value = data.musicEnabled !== undefined ? data.musicEnabled : true
    refreshRate.value = data.refreshRate || 100
    currentMusicIndex.value = data.currentMusicIndex || 0
  }
}

const exportSave = () => {
  const saveData = localStorage.getItem('inheritedTernaryGame')
  if (saveData) {
    const blob = new Blob([saveData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `OM-idle-save-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

const importSave = () => {
  saveImportInput.value?.click()
}

const handleFileImport = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target?.result as string)
        value.value = saveData.value || 0
        automatorLevel.value = saveData.automatorLevel || 0
        amplifierLevel.value = saveData.amplifierLevel || 0
        musicEnabled.value = saveData.musicEnabled !== undefined ? saveData.musicEnabled : true
        saveGame()
        alert('存档导入成功')
      } catch (error) {
        alert('存档导入失败：无效的存档文件')
      }
    }
    reader.readAsText(input.files[0])
  }
}

const resetGame = () => {
  if (confirm('确定要重置游戏数据吗？此操作不可恢复。')) {
    value.value = 1
    automatorLevel.value = 0
    amplifierLevel.value = 0
    musicEnabled.value = true
    localStorage.removeItem('inheritedTernaryGame')
  }
}

// 音乐控制
const initAudio = () => {
  if (!audio.value) {
    audio.value = new Audio()
    audio.value.loop = true
    audio.value.volume = 0.5
  }
}

const playMusic = () => {
  if (audio.value && !audio.value.paused && musicEnabled.value) {
    return
  }
  if (audio.value && musicEnabled.value) {
    audio.value.play().catch(error => {
      console.log('拜谢', error)
    })
  }
}

const changeMusic = (index: number) => {
  if (audio.value && index >= 0 && index < musicList.length) {
    currentMusicIndex.value = index
    audio.value.src = musicList[index]
    saveGame()
    if (musicEnabled.value) {
      playMusic()
    }
  }
}

const nextMusic = () => {
  const nextIndex = (currentMusicIndex.value + 1) % musicList.length
  changeMusic(nextIndex)
}

const prevMusic = () => {
  const prevIndex = (currentMusicIndex.value - 1 + musicList.length) % musicList.length
  changeMusic(prevIndex)
}

// 生命周期
onMounted(() => {
  loadGame()
  startGameLoop()
  initAudio()
  autoSaveGame()
  // 设置当前音乐
  if (audio.value) {
    audio.value.src = musicList[currentMusicIndex.value]
    if (musicEnabled.value) {
      playMusic()
    }
  }
})

onUnmounted(() => {
  stopGameLoop()
  if (audio.value) {
    audio.value.pause()
  }
})
</script>

<style scoped>
.game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 结果显示区域 */
.result-section {
  height: 256px;
  padding: 2rem;
  text-align: left;
  background: linear-gradient(135deg, #000000, #000000);
  border-bottom: 2px solid #0f3460;
}

.result-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #630875;
}

.result-content {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffffff;
  word-break: break-all;
  text-align: left;
}

.current-value {
  font-size: 1.2rem;
  color: #f5f5f5;
  text-align: left;
}

/* 选项卡导航 */
.tabs {
  display: flex;
  background: #0f3460;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #16213e;
}

.tab-button.active {
  background: #16213e;
  border-bottom-color: #0f3460;
}

/* 选项卡内容 */
.tab-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #16213e;
}

/* 升级选项卡 */
.upgrade-tab {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.upgrade-card {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  width: 300px;
  border: 2px solid #0f3460;
  transition: all 0.3s;
}

.upgrade-card:hover {
  transform: translateY(-5px);
  border-color: #ffb310;
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.2);
}

.upgrade-card h2 {
  color: #ffb310;
  margin-bottom: 1.5rem;
  text-align: center;
}

.upgrade-info {
  margin-bottom: 1.5rem;
}

.stat {
  margin-bottom: 0.8rem;
  font-size: 1rem;
  color: #f5f5f5;
  display: block;
  justify-content: space-between;
}

.upgrade-button {
  width: 100%;
  padding: 1rem;
  background: #ffb310;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.upgrade-button:hover:not(:disabled) {
  background: #ffb310;
  transform: scale(1.05);
}

.upgrade-button:disabled {
  background: #444;
  cursor: not-allowed;
  opacity: 0.5;
}

/* 设置选项卡 */
.settings-tab {
  display: flex;
  justify-content: center;
}

.settings-card {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  width: 600px;
  border: 2px solid #0f3460;
}

.settings-card h3 {
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
}

.setting-item {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.setting-button {
  padding: 0.8rem 1.5rem;
  background: #0f3460;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.setting-button:hover {
  background: #e94560;
  transform: translateY(-2px);
}

.setting-button.danger {
  background: #d63031;
}

.setting-button.danger:hover {
  background: #e17055;
}

/* 设置行样式 */
.settings-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.setting-label {
  font-size: 1rem;
  color: #f5f5f5;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.setting-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.setting-value {
  color: #00b7c2;
  font-weight: bold;
  min-width: 60px;
}

/* 滑块样式 */
.slider {
  flex: 1;
  height: 8px;
  border-radius: 5px;
  background: #444;
  outline: none;
  transition: all 0.3s;
}

.slider:hover {
  background: #555;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e94560;
  cursor: pointer;
  transition: all 0.3s;
}

.slider::-webkit-slider-thumb:hover {
  background: #d63031;
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e94560;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.slider::-moz-range-thumb:hover {
  background: #d63031;
  transform: scale(1.2);
}

/* 音乐控制样式 */
.music-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.music-info {
  flex: 1;
  text-align: center;
}

.music-name {
  color: #00b7c2;
  font-weight: bold;
}

.setting-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* 切换开关 */
.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1rem;
}

.toggle-label input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  width: 50px;
  height: 25px;
  background: #444;
  border-radius: 25px;
  position: relative;
  transition: all 0.3s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle-label input[type="checkbox"]:checked + .toggle-slider {
  background: #e94560;
}

.toggle-label input[type="checkbox"]:checked + .toggle-slider::after {
  transform: translateX(25px);
}

.toggle-text {
  font-size: 1rem;
  color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upgrade-tab {
    flex-direction: column;
    align-items: center;
  }
  
  .upgrade-card {
    width: 100%;
    max-width: 400px;
  }
  
  .settings-card {
    width: 100%;
  }
  
  .result-content {
    font-size: 1.5rem;
  }
}

.progress-bar {
  width: 100%;
  height: 25px;
  background: #444;
  border-radius: 5px;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: #009e1a;
  border-radius: 5px;
}
</style>
