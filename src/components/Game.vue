<template>
  <div class="game">
    <!-- 结果显示区域 -->
    <div class="result-section">
      <h4 class="result-title">序数增量放置版</h4>
      <div class="result-content" v-if="value < 7625597484987" v-html="convertedValue"></div>
      <div class="result-content" v-if="value >= 7625597484987 && value2 < 12157665459056928801" v-html="convertedValue2"></div>
      <div class="result-content" v-if="value2 >= 12157665459056928801 && value3 < 1.938324566768e25" v-html="convertedValue3"></div>
      <div class="result-content" v-if="value3 >= 1.938324566768e25">ψ(Ω<sub>ω</sub>)</div>
      <div class="result-content" v-if="value3 >= 1.938324566768e25" style="color:#00ff00">
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
      <!-- 康托尔化选项卡，仅在满足条件时显示 -->
      <button 
        v-if="value >= 7625597484987 || hasCantorified" 
        class="tab-button" 
        :class="{ active: activeTab === 'cantor' }" 
        @click="activeTab = 'cantor'"
      >
        康托尔化
      </button>
      <!-- 霍华德化选项卡，仅在满足条件时显示 -->
      <button 
        v-if="value2 >= 12157665459056928801 || hasHowardefied" 
        class="tab-button" 
        :class="{ active: activeTab === 'howard' }" 
        @click="activeTab = 'howard'"
      >
        霍华德化
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
        <div class="current-value">序数点: {{ formatNumber(value) }}</div><br />

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
          <h2>加速器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ amplifierLevel }}</div>
            <div class="stat">加速倍数: 2<sup>{{ amplifierLevel }}</sup></div>
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

      <!-- 康托尔化选项卡 -->
      <div v-if="activeTab === 'cantor'" class="upgrade-tab">
        <!-- 康托尔化重置按钮，仅在数值达到阈值时显示 -->
        <button v-if="value >= 7625597484987" 
            class="upgrade-button2"
            @click="cantorify"
          >
          <h2>康托尔化重置</h2>
          <div>重置序数、自动器、加速器</div>
          <div>+ {{ formatNumber(Math.max(value2,1)) }} 康托尔点</div>
        </button>

        <div class="current-value">
          康托尔点: {{ formatNumber(cantorPoints) }}(总计{{ formatNumber(totalCantorPoints) }})<br />
          序数点2: {{ formatNumber(value2) }} | 增幅: {{ formatNumber(incrementy) }}<br />
          总计康托尔点使自动器速度×{{ formatNumber(Math.sqrt(totalCantorPoints * 8 + 1)) }}<br />
          增幅使所有自动器速度×{{ formatNumber(incrementy + 1) }}
        </div><br />

        <!-- 康托尔自动器 -->
        <div class="upgrade-card2">
          <h2>康托尔自动器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ cantorUpgrades.cantorAutomator }}</div>
            <div class="stat">效果: {{ formatNumber(cantorUpgrades.cantorAutomator/3) }} × {{ formatNumber(Math.pow(2, cantorUpgrades.cantorAmplifier)) }} × {{ formatNumber(1+incrementy) }}/s</div>
            <div class="stat">升级成本: {{ formatNumber(cantorAutomatorCost) }}</div>
          </div>
          <button 
            class="upgrade-button2" 
            @click="upgradeCantorAutomator" 
            :disabled="cantorPoints < cantorAutomatorCost"
          >
            升级
          </button>
        </div>

        <!-- 康托尔增幅器 -->
        <div class="upgrade-card2">
          <h2>康托尔加速器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ cantorUpgrades.cantorAmplifier }}</div>
            <div class="stat">效果: 康托尔自动器 × {{ formatNumber(Math.pow(2, cantorUpgrades.cantorAmplifier)) }}</div>
            <div class="stat">升级成本: {{ formatNumber(cantorAmplifierCost) }}</div>
          </div>
          <button 
            class="upgrade-button2" 
            @click="upgradeCantorAmplifier" 
            :disabled="cantorPoints < cantorAmplifierCost"
          >
            升级
          </button>
        </div>

        <!-- 解锁增幅 -->
        <div class="upgrade-card2">
          <h2>增幅获取</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ cantorUpgrades.unlockIncrement }}</div>
            <div class="stat">效果: {{ formatNumber(cantorUpgrades.unlockIncrement/3) }} × {{ Math.pow(2,cantorUpgrades.multIncrement) }}/s</div>
            <div class="stat">升级成本: {{ formatNumber(unlockIncrementCost) }}</div>
          </div>
          <button 
            class="upgrade-button2" 
            @click="upgradeUnlockIncrement" 
            :disabled="cantorPoints < unlockIncrementCost"
          >
            升级
          </button>
        </div>

        <!-- 增加增幅获取 -->
        <div class="upgrade-card2">
          <h2>增加增幅获取</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ cantorUpgrades.multIncrement }}</div>
            <div class="stat">效果: 增幅获取 × {{ formatNumber(Math.pow(2,cantorUpgrades.multIncrement)) }}</div>
            <div class="stat">升级成本: {{ formatNumber(multIncrementCost) }}</div>
          </div>
          <button 
            class="upgrade-button2" 
            @click="upgradeMultIncrement" 
            :disabled="cantorPoints < multIncrementCost"
          >
            升级
          </button>
        </div>
      </div>

      <!-- 霍华德化选项卡 -->
      <div v-if="activeTab === 'howard'" class="upgrade-tab">
        <!-- 霍华德化重置按钮，仅在数值2达到阈值时显示 -->
        <button v-if="value2 >= 12157665459056928801" 
            class="upgrade-button3"
            @click="howardify"
          >
          <h2>霍华德化重置</h2>
          <div>重置序数、自动器、加速器、康托尔化相关内容</div>
          <div>+ {{ formatNumber(Math.max(value3,1)) }} 霍华德点</div>
        </button>

        <div class="current-value">
          霍华德点: {{ formatNumber(howardPoints) }}(总计{{ formatNumber(totalHowardPoints) }})<br />
          序数点3: {{ formatNumber(value3) }}<br />
          阿列夫能量: {{ formatNumber(alephPower) }} | 奇点能量: {{ formatNumber(singularityPower) }}<br />
          总霍华德点使前两种自动器速度×{{ formatNumber(Math.sqrt(totalHowardPoints * 80 + 1)) }}<br />
          阿列夫能量使所有自动器速度×{{ formatNumber(alephPower + 1) }}<br />
          奇点能量使阿列夫能量产量×{{ formatNumber(singularityPower + 1) }}<br />
        </div><br />

        <!-- 霍华德自动器 -->
        <div class="upgrade-card3">
          <h2>霍华德自动器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.howardAutomator }}</div>
            <div class="stat">效果: {{ formatNumber(howardUpgrades.howardAutomator/10) }} × {{ formatNumber(Math.pow(2, howardUpgrades.howardAmplifier)) }}/s</div>
            <div class="stat">升级成本: {{ formatNumber(howardAutomatorCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeHowardAutomator" 
            :disabled="howardPoints < howardAutomatorCost"
          >
            升级
          </button>
        </div>

        <!-- 霍华德增幅器 -->
        <div class="upgrade-card3">
          <h2>霍华德增幅器</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.howardAmplifier }}</div>
            <div class="stat">效果: 霍华德自动器速度 × {{ formatNumber(Math.pow(2, howardUpgrades.howardAmplifier)) }}</div>
            <div class="stat">升级成本: {{ formatNumber(howardAmplifierCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeHowardAmplifier" 
            :disabled="howardPoints < howardAmplifierCost"
          >
            升级
          </button>
        </div>

        <!-- 解锁阿列夫 -->
        <div class="upgrade-card3">
          <h2>解锁阿列夫</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.unlockAleph }}</div>
            <div class="stat">效果: {{ formatNumber(howardUpgrades.unlockAleph/10) }} × {{ Math.pow(2,howardUpgrades.alephMultiplier) }}/s</div>
            <div class="stat">升级成本: {{ formatNumber(unlockAlephCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeUnlockAleph" 
            :disabled="howardPoints < unlockAlephCost"
          >
            升级
          </button>
        </div>

        <!-- 阿列夫倍数 -->
        <div class="upgrade-card3">
          <h2>阿列夫倍数</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.alephMultiplier }}</div>
            <div class="stat">效果: 阿列夫能量获取 × {{ formatNumber(Math.pow(2,howardUpgrades.alephMultiplier)) }}</div>
            <div class="stat">升级成本: {{ formatNumber(alephMultiplierCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeAlephMultiplier" 
            :disabled="howardPoints < alephMultiplierCost"
          >
            升级
          </button>
        </div>

        <!-- 解锁奇点 -->
        <div class="upgrade-card3">
          <h2>解锁奇点</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.unlockSingularity }}</div>
            <div class="stat">效果: {{ formatNumber(howardUpgrades.unlockSingularity/10) }} × {{ Math.pow(2,howardUpgrades.singularityMultiplier) }}/s</div>
            <div class="stat">升级成本: {{ formatNumber(unlockSingularityCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeUnlockSingularity" 
            :disabled="howardPoints < unlockSingularityCost"
          >
            升级
          </button>
        </div>

        <!-- 奇点倍数 -->
        <div class="upgrade-card3">
          <h2>奇点倍数</h2>
          <div class="upgrade-info">
            <div class="stat">等级: {{ howardUpgrades.singularityMultiplier }}</div>
            <div class="stat">效果: 奇点能量获取 × {{ formatNumber(Math.pow(2,howardUpgrades.singularityMultiplier)) }}</div>
            <div class="stat">升级成本: {{ formatNumber(singularityMultiplierCost) }}</div>
          </div>
          <button 
            class="upgrade-button3" 
            @click="upgradeSingularityMultiplier" 
            :disabled="howardPoints < singularityMultiplierCost"
          >
            升级
          </button>
        </div>
      </div>

      <!-- 设置选项卡 -->
      <div v-if="activeTab === 'settings'" class="settings-tab">
        <div class="settings-card">
          <div align="center">序数增量放置版 - 作者:dlsdl(6左爷6)</div>
          <div class="nav-link">
            <router-link to="/converter">果糕</router-link>
          </div>
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
// 为解决“找不到模块 vue 或其类型声明”问题，保持原有导入即可
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { convertToInheritedTernary, convertToPsiOmega, convertToPsiOmega2, remnant, remnant2 } from '../utils/inheritedTernary'

// 游戏状态
const value = ref(1)
const automatorLevel = ref(0)
const amplifierLevel = ref(0)
const activeTab = ref('upgrade')
const musicEnabled = ref(true)
const saveImportInput = ref<HTMLInputElement | null>(null)
const refreshRate = ref(30) // 刷新率，单位ms
const currentMusicIndex = ref(0) // 当前音乐索引

// 康托尔化相关状态
const hasCantorified = ref(false) // 标识是否已进行过康托尔化
const cantorPoints = ref(0) // 康托尔点
const totalCantorPoints = ref(0) // 总康托尔点
const value2 = ref(1) // 第二数值
const incrementy = ref(0) // 增幅值
// 康托尔升级信息
const cantorUpgrades = ref({
  cantorAutomator: 0, // 康托尔自动器等级
  cantorAmplifier: 0, // 康托尔增幅器等级
  unlockIncrement: 0, // 解锁增幅等级
  multIncrement: 0 // 增幅乘数等级
})

// 霍华德化相关状态
const hasHowardefied = ref(false) // 标识是否已进行过霍华德化
const howardPoints = ref(0) // 霍华德点
const totalHowardPoints = ref(0) // 总霍华德点
const value3 = ref(1) // 第三数值
const alephPower = ref(0) // 阿列夫能量
const singularityPower = ref(0) // 奇点能量
// 霍华德升级信息
const howardUpgrades = ref({
  howardAutomator: 0, // 霍华德自动器等级
  howardAmplifier: 0, // 霍华德增幅器等级
  unlockAleph: 0, // 解锁阿列夫等级
  alephMultiplier: 0, // 阿列夫倍数等级
  unlockSingularity: 0, // 解锁奇点等级
  singularityMultiplier: 0 // 奇点倍数等级
})

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

// 计算属性 - 原始数值生产速度
const productionPerSecond = computed(() => {
  return automatorLevel.value * Math.pow(2, amplifierLevel.value) * Math.sqrt(totalCantorPoints.value*8 + 1) * (1 + incrementy.value) * Math.sqrt(totalHowardPoints.value * 80 + 1) * (alephPower.value + 1)
})

// 计算属性 - 康托尔自动器生产速度
const cantorProductionPerSecond = computed(() => {
  return cantorUpgrades.value.cantorAutomator * Math.pow(2, cantorUpgrades.value.cantorAmplifier) * (1 + incrementy.value) * Math.sqrt(totalHowardPoints.value * 80 + 1) * (alephPower.value + 1) / 3
})

// 计算属性 - 增幅生产速度
const incrementProductionPerSecond = computed(() => {
  return cantorUpgrades.value.unlockIncrement * Math.pow(2, cantorUpgrades.value.multIncrement) / 3
})

// 计算属性 - 霍华德自动器生产速度
const howardProductionPerSecond = computed(() => {
  return howardUpgrades.value.howardAutomator * Math.pow(2, howardUpgrades.value.howardAmplifier) * (alephPower.value + 1) / 9
})

// 计算属性 - 阿列夫能量生产速度
const alephProductionPerSecond = computed(() => {
  return howardUpgrades.value.unlockAleph * Math.pow(2, howardUpgrades.value.alephMultiplier) * (singularityPower.value + 1) / 9
})

// 计算属性 - 奇点能量生产速度
const singularityProductionPerSecond = computed(() => {
  return howardUpgrades.value.unlockSingularity * Math.pow(2, howardUpgrades.value.singularityMultiplier) / 9
})

// 计算属性 - 升级成本
const automatorCost = computed(() => {
  return Math.pow(2, automatorLevel.value)
})

const amplifierCost = computed(() => {
  return Math.pow(2.5, amplifierLevel.value)*40
})

// 计算属性 - 康托尔升级成本
const cantorAutomatorCost = computed(() => {
  return Math.pow(3, cantorUpgrades.value.cantorAutomator)
})

const cantorAmplifierCost = computed(() => {
  return Math.pow(4, cantorUpgrades.value.cantorAmplifier)*40
})

const unlockIncrementCost = computed(() => {
  return Math.pow(5, cantorUpgrades.value.unlockIncrement)*1600
})

const multIncrementCost = computed(() => {
  return Math.pow(6, cantorUpgrades.value.multIncrement)*64000
})

// 计算属性 - 霍华德升级成本
const howardAutomatorCost = computed(() => {
  return Math.pow(8, howardUpgrades.value.howardAutomator)
})

const howardAmplifierCost = computed(() => {
  return Math.pow(10, howardUpgrades.value.howardAmplifier)*40
})

const unlockAlephCost = computed(() => {
  return Math.pow(12, howardUpgrades.value.unlockAleph)*1600
})

const alephMultiplierCost = computed(() => {
  return Math.pow(16, howardUpgrades.value.alephMultiplier)*64000
})

const unlockSingularityCost = computed(() => {
  return Math.pow(20, howardUpgrades.value.unlockSingularity)*2560000
})

const singularityMultiplierCost = computed(() => {
  return Math.pow(24, howardUpgrades.value.singularityMultiplier)*102400000
})

const convertedValue = computed(() => {
  const result = convertToInheritedTernary(Math.floor(value.value))
  return result.result
})

const convertedValue2 = computed(() => {
  const result = convertToPsiOmega(Math.floor(value2.value)).result.replace('x', remnant(value2.value - Math.floor(value2.value)))
  return result
})

const convertedValue3 = computed(() => {
  const result = convertToPsiOmega2(Math.floor(value3.value+1594322)).result.replace('x', remnant2(value3.value - Math.floor(value3.value)))
  return result
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num < 1000) return num.toFixed(3)
  if (num < 1000000) return (num / 1000).toFixed(3) + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(3) + 'M'
  if (num < 1000000000000) return (num / 1000000000).toFixed(3) + 'B'
  if (num < 1e15) return (num / 1e12).toFixed(3) + 'T'
  if (num < 1e18) return (num / 1e15).toFixed(3) + 'Qa'
  if (num < 1e21) return (num / 1e18).toFixed(3) + 'Qi'
  if (num < 1e24) return (num / 1e21).toFixed(3) + 'Sx'
  return (num / 1e24).toFixed(3) + 'Sp'
}

// 游戏循环
const startGameLoop = () => {
  if (gameLoop) return
  const updateInterval = refreshRate.value
  gameLoop = window.setInterval(() => {
    // 更新原始数值
    if (value.value < 7625597484987) {
      value.value += productionPerSecond.value / (1000 / updateInterval)
    } else {
      value.value = 7625597484987
    }

    // 更新第二数值（仅当已进行过康托尔化时）
    if (hasCantorified.value && value.value >= 7625597484987) {
      if (value2.value < 12157665459056928801) {
      value2.value += cantorProductionPerSecond.value / (1000 / updateInterval)
      } else {
      value2.value = 12157665459056928801
      }
    }

    // 更新增幅值（仅当已进行过康托尔化时）
    if (hasCantorified.value) {
      incrementy.value += incrementProductionPerSecond.value / (1000 / updateInterval)
    }

    // 更新第三数值（仅当已进行过霍华德化时）
    if (hasHowardefied.value && value2.value >= 12157665459056928801) {
      if (value3.value < 1.938324566768e25) {
        value3.value += howardProductionPerSecond.value / (1000 / updateInterval)
      } else {
        value3.value = 1.938324566768e25
      }
    }

    // 更新阿列夫能量（仅当已进行过霍华德化时）
    if (hasHowardefied.value) {
      alephPower.value += alephProductionPerSecond.value / (1000 / updateInterval)
    }

    // 更新奇点能量（仅当已进行过霍华德化时）
    if (hasHowardefied.value) {
      singularityPower.value += singularityProductionPerSecond.value / (1000 / updateInterval)
    }
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

// 康托尔化核心功能
const cantorify = () => {
  // 检查条件：数值达到阈值
  if (value.value >= 7625597484987) {
    // 标记已进行过康托尔化
    hasCantorified.value = true
    
    // 获得康托尔点奖励
    cantorPoints.value += Math.max(1,value2.value)
    totalCantorPoints.value += Math.max(1,value2.value)
    
    // 重置原始数值和自动器、增幅器等级
    value.value = 1
    value2.value = 1
    automatorLevel.value = 0
    amplifierLevel.value = 0
    incrementy.value = 0
    
    // 保存游戏状态
    saveGame()
  }
}

// 霍华德化核心功能
const howardify = () => {
  // 检查条件：数值2达到阈值
  if (value2.value >= 12157665459056928801) {
    // 标记已进行过霍华德化
    hasHowardefied.value = true
    
    // 获得霍华德点奖励
    howardPoints.value += Math.max(1,value3.value)
    totalHowardPoints.value += Math.max(1,value3.value)
    
    // 重置游戏状态
    value.value = 1
    value2.value = 1
    value3.value = 1
    automatorLevel.value = 0
    amplifierLevel.value = 0
    cantorPoints.value = 0
    totalCantorPoints.value = 0
    incrementy.value = 0
    alephPower.value = 0
    singularityPower.value = 0
    
    // 重置康托尔升级
    cantorUpgrades.value = {
      cantorAutomator: 0,
      cantorAmplifier: 0,
      unlockIncrement: 0,
      multIncrement: 0
    }
    
    // 保存游戏状态
    saveGame()
  }
}

// 康托尔升级函数
const upgradeCantorAutomator = () => {
  if (cantorPoints.value >= cantorAutomatorCost.value) {
    cantorPoints.value -= cantorAutomatorCost.value
    cantorUpgrades.value.cantorAutomator++
    saveGame()
  }
}

const upgradeCantorAmplifier = () => {
  if (cantorPoints.value >= cantorAmplifierCost.value) {
    cantorPoints.value -= cantorAmplifierCost.value
    cantorUpgrades.value.cantorAmplifier++
    saveGame()
  }
}

const upgradeUnlockIncrement = () => {
  if (cantorPoints.value >= unlockIncrementCost.value) {
    cantorPoints.value -= unlockIncrementCost.value
    cantorUpgrades.value.unlockIncrement++
    saveGame()
  }
}

const upgradeMultIncrement = () => {
  if (cantorPoints.value >= multIncrementCost.value) {
    cantorPoints.value -= multIncrementCost.value
    cantorUpgrades.value.multIncrement++
    saveGame()
  }
}

// 霍华德升级函数
const upgradeHowardAutomator = () => {
  if (howardPoints.value >= howardAutomatorCost.value) {
    howardPoints.value -= howardAutomatorCost.value
    howardUpgrades.value.howardAutomator++
    saveGame()
  }
}

const upgradeHowardAmplifier = () => {
  if (howardPoints.value >= howardAmplifierCost.value) {
    howardPoints.value -= howardAmplifierCost.value
    howardUpgrades.value.howardAmplifier++
    saveGame()
  }
}

const upgradeUnlockAleph = () => {
  if (howardPoints.value >= unlockAlephCost.value) {
    howardPoints.value -= unlockAlephCost.value
    howardUpgrades.value.unlockAleph++
    saveGame()
  }
}

const upgradeAlephMultiplier = () => {
  if (howardPoints.value >= alephMultiplierCost.value) {
    howardPoints.value -= alephMultiplierCost.value
    howardUpgrades.value.alephMultiplier++
    saveGame()
  }
}

const upgradeUnlockSingularity = () => {
  if (howardPoints.value >= unlockSingularityCost.value) {
    howardPoints.value -= unlockSingularityCost.value
    howardUpgrades.value.unlockSingularity++
    saveGame()
  }
}

const upgradeSingularityMultiplier = () => {
  if (howardPoints.value >= singularityMultiplierCost.value) {
    howardPoints.value -= singularityMultiplierCost.value
    howardUpgrades.value.singularityMultiplier++
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
    timestamp: Date.now(),
    // 康托尔化相关数据
    hasCantorified: hasCantorified.value,
    cantorPoints: cantorPoints.value,
    totalCantorPoints: totalCantorPoints.value,
    value2: value2.value,
    incrementy: incrementy.value,
    cantorUpgrades: cantorUpgrades.value,
    // 霍华德化相关数据
    hasHowardefied: hasHowardefied.value,
    howardPoints: howardPoints.value,
    totalHowardPoints: totalHowardPoints.value,
    value3: value3.value,
    alephPower: alephPower.value,
    singularityPower: singularityPower.value,
    howardUpgrades: howardUpgrades.value
  }
  localStorage.setItem('inheritedTernaryGame', JSON.stringify(saveData))
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
    
    // 加载康托尔化相关数据
    hasCantorified.value = data.hasCantorified || false
    cantorPoints.value = data.cantorPoints || 0
    totalCantorPoints.value = data.totalCantorPoints || 0
    value2.value = data.value2 || 0
    incrementy.value = data.incrementy || 0
    cantorUpgrades.value = data.cantorUpgrades || {
      cantorAutomator: 0,
      cantorAmplifier: 0,
      unlockIncrement: 0,
      multIncrement: 0
    }
    
    // 加载霍华德化相关数据
    hasHowardefied.value = data.hasHowardefied || false
    howardPoints.value = data.howardPoints || 0
    totalHowardPoints.value = data.totalHowardPoints || 0
    value3.value = data.value3 || 0
    alephPower.value = data.alephPower || 0
    singularityPower.value = data.singularityPower || 0
    howardUpgrades.value = data.howardUpgrades || {
      howardAutomator: 0,
      howardAmplifier: 0,
      unlockAleph: 0,
      alephMultiplier: 0,
      unlockSingularity: 0,
      singularityMultiplier: 0
    }
  }
}

const exportSave = () => {
  saveGame()
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
        
        // 加载康托尔化相关数据
        hasCantorified.value = saveData.hasCantorified || false
        cantorPoints.value = saveData.cantorPoints || 0
        totalCantorPoints.value = saveData.totalCantorPoints || 0
        value2.value = saveData.value2 || 0
        incrementy.value = saveData.incrementy || 0
        cantorUpgrades.value = saveData.cantorUpgrades || {
          cantorAutomator: 0,
          cantorAmplifier: 0,
          unlockIncrement: 0,
          multIncrement: 0
        }
        
        // 加载霍华德化相关数据
        hasHowardefied.value = saveData.hasHowardefied || false
        howardPoints.value = saveData.howardPoints || 0
        totalHowardPoints.value = saveData.totalHowardPoints || 0
        value3.value = saveData.value3 || 0
        alephPower.value = saveData.alephPower || 0
        singularityPower.value = saveData.singularityPower || 0
        howardUpgrades.value = saveData.howardUpgrades || {
          howardAutomator: 0,
          howardAmplifier: 0,
          unlockAleph: 0,
          alephMultiplier: 0,
          unlockSingularity: 0,
          singularityMultiplier: 0
        }
        
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
    
    // 重置康托尔化相关数据
    hasCantorified.value = false
    cantorPoints.value = 0
    totalCantorPoints.value = 0
    value2.value = 1
    incrementy.value = 0
    cantorUpgrades.value = {
      cantorAutomator: 0,
      cantorAmplifier: 0,
      unlockIncrement: 0,
      multIncrement: 0
    }
    
    // 重置霍华德化相关数据
    hasHowardefied.value = false
    howardPoints.value = 0
    totalHowardPoints.value = 0
    value3.value = 1
    alephPower.value = 0
    singularityPower.value = 0
    howardUpgrades.value = {
      howardAutomator: 0,
      howardAmplifier: 0,
      unlockAleph: 0,
      alephMultiplier: 0,
      unlockSingularity: 0,
      singularityMultiplier: 0
    }
    
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
    audio.value.play().catch((error: any) => {
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
.nav-link {
  margin-bottom: 1rem;
  text-align: center;
}

.nav-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.nav-link a:hover {
  text-decoration: underline;
}

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
  font-size: 1rem;
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
  font-size: 1.2rem;
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
  border-radius: 10px;
  width: 300px;
  border: 2px solid #0f3460;
  transition: all 0.2s;
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

.upgrade-card2 {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  border: 2px solid #0f3460;
  transition: all 0.3s;
}

.upgrade-card2:hover {
  transform: translateY(-5px);
  border-color: #10c200;
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.2);
}

.upgrade-card2 h2 {
  color: #10c200;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* 霍华德化升级卡片样式 */
.upgrade-card3 {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  border: 2px solid #0f3460;
  transition: all 0.3s;
}

.upgrade-card3:hover {
  transform: translateY(-5px);
  border-color: #00b7c2;
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.2);
}

.upgrade-card3 h2 {
  color: #00b7c2;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* 霍华德化升级按钮样式 */
.upgrade-button3 {
  width: 100%;
  padding: 1rem;
  background: #00b7c2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.upgrade-button3:hover:not(:disabled) {
  background: #00b7c2;
  transform: scale(1.05);
}

.upgrade-button3:disabled {
  background: #444;
  cursor: not-allowed;
  opacity: 0.5;
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
  font-size: 1.2rem;
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

.upgrade-button2 {
  width: 100%;
  padding: 1rem;
  background: #10c200;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.upgrade-button2:hover:not(:disabled) {
  background: #10c200;
  transform: scale(1.05);
}

.upgrade-button2:disabled {
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
