<template>
  <div class="inherited-ternary">
    <div class="header">
      <h1>继承3进制表示转换器</h1>
      <p class="subtitle">将自然数转换为继承3进制表示</p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label for="number-input">输入自然数：</label>
        <input
          id="number-input"
          v-model.number="inputNumber"
          type="number"
          min="0"
          placeholder="请输入一个非负整数"
          @keyup.enter="convert"
        />
        <button @click="convert" >转换</button>
      </div>
      <div class="examples">
        <span>示例：</span>
        <button @click="setExample(7625597484986)">7625597484986</button>
        <button @click="setExample(Number.MAX_SAFE_INTEGER)">Max_safe_integer</button>
        <button @click="setExample(Number.MAX_VALUE)">Max_value</button>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="result" class="result-section">
      <div class="result-card">
        <h2>转换结果</h2>
        <div class="result-expression" v-html="result"></div>
      </div>

      <div v-if="steps.length > 0" class="steps-section">
        <h2>转换步骤</h2>
        <div class="steps-list">
          <div v-for="(step, index) in steps" :key="index" class="step-item">
            <div class="step-number">步骤 {{ step.step }}</div>
            <div class="step-description">{{ step.description }}</div>
            <div class="step-expression" v-html="step.expression"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { convertToInheritedTernary } from '../utils/inheritedTernary'
import type { ConversionStep } from '../types'

const inputNumber = ref<number | null>(null)
const result = ref('')
const steps = ref<ConversionStep[]>([])
const error = ref('')

function setExample(n: number): void {
  inputNumber.value = n
  convert()
}

function convert(): void {
  error.value = ''
  result.value = ''
  steps.value = []

  if (inputNumber.value === null) {
    error.value = '请输入一个数字'
    return
  }

  if (inputNumber.value < 0) {
    error.value = '请输入非负整数'
    return
  }

  if (!Number.isInteger(inputNumber.value)) {
    error.value = '请输入整数'
    return
  }

  const conversion = convertToInheritedTernary(inputNumber.value)
  result.value = conversion.result
  steps.value = conversion.steps
}
</script>

<style scoped>
.inherited-ternary {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.input-section {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.input-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.input-group button {
  padding: 0.75rem 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.input-group button:hover:not(:disabled) {
  background: #357abd;
}

.input-group button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.examples {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.examples span {
  color: #666;
  font-size: 0.9rem;
}

.examples button {
  padding: 0.5rem 1rem;
  background: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.examples button:hover {
  background: #4a90e2;
  color: white;
}

.error {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c33;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #4a90e2;
}

.result-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.result-expression {
  font-size: 1.5rem;
  font-family: 'Courier New', monospace;
  color: #4a90e2;
  word-break: break-all;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.steps-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.steps-section h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #4a90e2;
}

.step-number {
  font-weight: 600;
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #666;
  margin-bottom: 0.5rem;
}

.step-expression {
  font-family: 'Courier New', monospace;
  color: #333;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  word-break: break-all;
}
</style>
