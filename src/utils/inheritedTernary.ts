import type { Term, ConversionStep } from '../types'
// 定义ψ-Ω-2表示的映射关系
const psiOmega2Map: Record<number, string> = {
  1: 'Ω<sup>ψ(Ω<sub>2</sub>x)</sup>',
  2: 'Ω<sup>Ω+ψ(Ω<sub>2</sub>x)</sup>',
  3: 'Ω<sup>Ω2+ψ(Ω<sub>2</sub>x)</sup>',
  4: 'Ω<sup>Ωψ(Ω<sub>2</sub>x)</sup>',
  5: 'Ω<sup>Ω<sup>2</sup>+ψ(Ω<sub>2</sub>x)</sup>',
  6: 'Ω<sup>Ω<sup>2</sup>+Ω+ψ(Ω<sub>2</sub>x)</sup>',
  7: 'Ω<sup>Ω<sup>2</sup>+Ω2+ψ(Ω<sub>2</sub>x)</sup>',
  8: 'Ω<sup>Ω<sup>2</sup>+Ωψ(Ω<sub>2</sub>x)</sup>',
  9: 'Ω<sup>Ω<sup>2</sup>2+Ω+ψ(Ω<sub>2</sub>x)</sup>',
  10: 'Ω<sup>Ω<sup>2</sup>2+Ω2+ψ(Ω<sub>2</sub>x)</sup>',
  11: 'Ω<sup>Ω<sup>2</sup>2+Ωψ(Ω<sub>2</sub>x)</sup>',
  12: 'Ω<sup>Ω<sup>2</sup>ψ(Ω<sub>2</sub>x)</sup>',
  13: 'Ω<sup>Ω<sup>ψ(Ω<sub>2</sub>x)</sup></sup>',
  14: 'ψ<sub>1</sub>(Ω<sub>2</sub>x)',
  15: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>2</sup>x)',
  16: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>x</sup>)',
  17: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub></sup>x)',
  18: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>+1</sup>x)',
  19: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>+2</sup>x)',
  20: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>+x</sup>)',
  21: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>2</sup>x)',
  22: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>2+1</sup>x)',
  23: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>2+2</sup>x)',
  24: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>2+x</sup>)',
  25: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub>x</sup>)',
  26: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup></sup>x)',
  27: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+1</sup>x)',
  28: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+2</sup>x)',
  29: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+x</sup>)',
  30: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub></sup>x)',
  31: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>+1</sup>x)',
  32: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>+2</sup>x)',
  33: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>+x</sup>)',
  34: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>2</sup>x)',
  35: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>2+1</sup>x)',
  36: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>2+2</sup>x)',
  37: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>2+x</sup>)',
  38: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>+Ω<sub>2</sub>x</sup>)',
  39: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2</sup>x)',
  40: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+1</sup>x)',
  41: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+2</sup>x)',
  42: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+x</sup>)',
  43: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub></sup>x)',
  44: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>+1</sup>x)',
  45: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>+2</sup>x)',
  46: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>+x</sup>)',
  47: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>2</sup>x)',
  48: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>2+1</sup>x)',
  49: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>2+2</sup>x)',
  50: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>2+x</sup>)',
  51: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>2+Ω<sub>2</sub>x</sup>)',
  52: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>2</sup>x</sup>)',
  53: 'ψ<sub>1</sub>(Ω<sub>2</sub><sup>Ω<sub>2</sub><sup>x</sup></sup>)',
}

// 定义ψ-Ω表示的映射关系
const psiOmegaMap: Record<number, string> = {
  1: 'ψ(Ωx)',
  2: 'ψ(Ω<sup>2</sup>x)',
  3: 'ψ(Ω<sup>x</sup>)',
  4: 'ψ(Ω<sup>Ω</sup>x)',
  5: 'ψ(Ω<sup>Ω+1</sup>x)',
  6: 'ψ(Ω<sup>Ω+2</sup>x)',
  7: 'ψ(Ω<sup>Ω+x</sup>)',
  8: 'ψ(Ω<sup>Ω2</sup>x)',
  9: 'ψ(Ω<sup>Ω2+1</sup>x)',
  10: 'ψ(Ω<sup>Ω2+2</sup>x)',
  11: 'ψ(Ω<sup>Ω2+x</sup>)',
  12: 'ψ(Ω<sup>Ωx</sup>)',
  13: 'ψ(Ω<sup>Ω<sup>2</sup></sup>x)',
  14: 'ψ(Ω<sup>Ω<sup>2</sup>+1</sup>x)',
  15: 'ψ(Ω<sup>Ω<sup>2</sup>+2</sup>x)',
  16: 'ψ(Ω<sup>Ω<sup>2</sup>+x</sup>)',
  17: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω</sup>x)',
  18: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω+1</sup>x)',
  19: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω+2</sup>x)',
  20: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω+x</sup>)',
  21: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω2</sup>x)',
  22: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω2+1</sup>x)',
  23: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω2+2</sup>x)',
  24: 'ψ(Ω<sup>Ω<sup>2</sup>+Ω2+x</sup>)',
  25: 'ψ(Ω<sup>Ω<sup>2</sup>+Ωx</sup>)',
  26: 'ψ(Ω<sup>Ω<sup>2</sup>2</sup>x)',
  27: 'ψ(Ω<sup>Ω<sup>2</sup>2+1</sup>x)',
  28: 'ψ(Ω<sup>Ω<sup>2</sup>2+2</sup>x)',
  29: 'ψ(Ω<sup>Ω<sup>2</sup>2+x</sup>)',
  30: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω</sup>x)',
  31: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω+1</sup>x)',
  32: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω+2</sup>x)',
  33: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω+x</sup>)',
  34: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω2</sup>x)',
  35: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω2+1</sup>x)',
  36: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω2+2</sup>x)',
  37: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ω2+x</sup>)',
  38: 'ψ(Ω<sup>Ω<sup>2</sup>2+Ωx</sup>)',
  39: 'ψ(Ω<sup>Ω<sup>2</sup>x</sup>)',
  40: 'ψ(Ω<sup>Ω<sup>x</sup></sup>)',
}

// 辅助函数：将整数转换为三进制表示（从高位到低位）
function toTernary(n: number): number[] {
  if (n === 0) return [0]
  const digits: number[] = []
  while (n > 0) {
    digits.push(n % 3)
    n = Math.floor(n / 3)
  }
  return digits
}

// ψ-Ω表示的核心转换算法
function convertToPsiOmega(n: number): { result: string; error?: string } {
  // 验证输入
  if (!Number.isInteger(n)) {
    return { result: '', error: '请输入整数' }
  }
  if (n < 0) {
    return { result: '', error: '请输入非负整数' }
  }
  if (n === 0) {
    return { result: 'x' }
  }

  // 第一步：将数字转换为三进制表示
  const ternaryDigits = toTernary(n)
  let result = 'x'

  // 第二步：从高位到低位进行嵌套转换
  for (let i = 0; i < ternaryDigits.length; i++) {
    const digit = ternaryDigits[i]
    if (digit === 0) {
      continue // 跳过0位
    }

    // 获取当前位对应的映射字符串
    const level = i + 1
    const basePattern = psiOmegaMap[level] || `😰x`

    // 根据位上的数字进行嵌套
    let nestedResult = result
    for (let j = 0; j < digit; j++) {
      nestedResult = basePattern.replace('x', nestedResult)
    }

    result = nestedResult
  }

  return { result }
}

// ψ-Ω-2表示的核心转换算法
function convertToPsiOmega2(n: number): { result: string; error?: string } {
  // 验证输入
  if (!Number.isInteger(n)) {
    return { result: '', error: '请输入整数' }
  }
  if (n < 0) {
    return { result: '', error: '请输入非负整数' }
  }
  if (n === 0) {
    return { result: 'x' }
  }

  // 第一步：将数字转换为三进制表示
  const ternaryDigits = toTernary(n)
  let result = 'x'

  // 第二步：从高位到低位进行嵌套转换
  for (let i = 0; i < ternaryDigits.length; i++) {
    const digit = ternaryDigits[i]
    if (digit === 0) {
      continue // 跳过0位
    }

    // 获取当前位对应的映射字符串
    const level = i + 1
    const basePattern = psiOmega2Map[level] || `😥x`

    // 根据位上的数字进行嵌套
    let nestedResult = result
    for (let j = 0; j < digit; j++) {
      nestedResult = basePattern.replace('x', nestedResult)
    }

    result = nestedResult.replace('<sub>1</sub>','')
  }

  return { result }
}

function remnant(n: number): string {
  return n==0?'':n<1/8?'ω':n<2/8?'ω2':n<3/8?'ω<sup>2</sup>':n<4/8?'ω<sup>2</sup>2':n<5/8?'ω<sup>ω</sup>':n<6/8?'ω<sup>ω2</sup>':n<7/8?'ω<sup>ω<sup>2</sup></sup>':'ω<sup>ω<sup>2</sup>2</sup>'
}

function remnant2(n: number): string {
  return n==0?'':n<1/8?'ω':n<2/8?'Ω':n<3/8?'Ω<sup>ω</sup>':n<4/8?'Ω<sup>ω<sup>ω</sup></sup>':n<5/8?'Ω<sup>ψ(Ω)</sup>':n<6/8?'Ω<sup>ψ(Ω<sup>ω</sup>)</sup>':n<7/8?'Ω<sup>ψ(Ω<sup>Ω</sup>)</sup>':'Ω<sup>ψ(Ω<sup>Ω<sup>ω</sup></sup>)</sup>'
}

// 原始的继承3进制表示转换函数
function convertToInheritedTernary(n: number): { result: string; steps: ConversionStep[] } {
  if (n < 0) {
    return { result: '请输入非负整数', steps: [] }
  }
  if (n === 0) {
    return { result: '0', steps: [{ step: 1, description: '0的继承3进制表示', expression: '0' }] }
  }

  const steps: ConversionStep[] = []
  let stepNum = 1

  // 第一步：将数字转换为3进制表示
  const digits = toTernary(n)
  const initialTerms: Term[] = []
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] !== 0) {
      initialTerms.push({
        base: 3,
        exponent: i,
        coefficient: digits[i]
      })
    }
  }

  // 第二步：转换所有指数，直到所有指数都不超过3
  let currentTerms = initialTerms
  const initialExpression = formatTerms(currentTerms)
  steps.push({
    step: stepNum++,
    description: `${n} 转换为 3 进制表示`,
    expression: `${n}=${initialExpression}`
  })

  // 检查是否有需要转换的指数
  let hasLargeExp = true
  let iteration = 1
  
  while (hasLargeExp) {
    hasLargeExp = false
    const newTerms: Term[] = []
    
    for (const term of currentTerms) {
      if (typeof term.exponent === 'number') {
        if (term.exponent > 3) {
          // 转换单个大指数
          const expDigits = toTernary(term.exponent)
          const expTerms: Term[] = []
          for (let i = expDigits.length - 1; i >= 0; i--) {
            if (expDigits[i] !== 0) {
              expTerms.push({
                base: 3,
                exponent: i,
                coefficient: expDigits[i]
              })
            }
          }
          newTerms.push({
            base: term.base,
            exponent: expTerms,
            coefficient: term.coefficient
          })
          hasLargeExp = true
        } else {
          newTerms.push(term)
        }
      } else {
        // 处理已经是数组的指数，检查其中是否有大指数
        const newExpTerms: Term[] = []
        
        for (const subTerm of term.exponent) {
          if (typeof subTerm.exponent === 'number') {
            if (subTerm.exponent > 3) {
              // 转换嵌套的大指数
              const expDigits = toTernary(subTerm.exponent)
              const expSubTerms: Term[] = []
              for (let i = expDigits.length - 1; i >= 0; i--) {
                if (expDigits[i] !== 0) {
                  expSubTerms.push({
                    base: 3,
                    exponent: i,
                    coefficient: expDigits[i]
                  })
                }
              }
              newExpTerms.push({
                base: subTerm.base,
                exponent: expSubTerms,
                coefficient: subTerm.coefficient
              })
              hasLargeExp = true
            } else {
              newExpTerms.push(subTerm)
            }
          } else {
            // 如果子指数已经是数组，不再递归处理，防止过度嵌套
            newExpTerms.push(subTerm)
          }
        }
        
        newTerms.push({
          base: term.base,
          exponent: newExpTerms,
          coefficient: term.coefficient
        })
      }
    }
    
    if (hasLargeExp) {
      const oldExpression = formatTerms(currentTerms)
      currentTerms = newTerms
      const newExpression = formatTerms(currentTerms)
      
      steps.push({
        step: stepNum++,
        description: `第 ${iteration} 次迭代：转换大指数`,
        expression: `${oldExpression}=${newExpression}`
      })
      
      iteration++
      if (iteration > 100) {
        break
      }
    }
  }

  const result = formatTerms(currentTerms)
  steps.push({
    step: stepNum,
    description: '最终结果：所有指数都不超过 3',
    expression: result
  })

  return { result, steps }
}

// 导出函数
export { convertToInheritedTernary, convertToPsiOmega, convertToPsiOmega2, remnant, remnant2, toTernary }

// 辅助函数：格式化术语（仅用于原始继承3进制表示）
function formatTerm(term: Term): string {
  const exp = term.exponent
  const coeff = term.coefficient

  let expStr: string
  if (typeof exp === 'number') {
    if (exp === 3) {
      // 3 -> ω
      expStr = '<sup>ω</sup>'
    } else if (exp === 1) {
      // 1 -> 不显示指数
      expStr = ''
    } else {
      // 其他数字直接显示
      expStr = `<sup>${exp}</sup>`
    }
  } else {
    // 处理指数数组
    const expParts = exp.map(t => {
      if (typeof t.exponent === 'number') {
        if (t.exponent === 3) {
          // 子指数为3 -> ω
          const subCoeff = t.coefficient === 1 ? '' : `${t.coefficient}`
          return `ω<sup>ω</sup>${subCoeff}`
        } else if (t.exponent === 1) {
          // 子指数为1 -> 3
          const subCoeff = t.coefficient === 1 ? '' : `${t.coefficient}`
          return `ω${subCoeff}`
        } else if (t.exponent === 0) {
          // 子指数为0 -> 系数
          return `${t.coefficient}`
        } else {
          // 其他数字指数
          const subCoeff = t.coefficient === 1 ? '' : `${t.coefficient}`
          return `ω<sup>${t.exponent}</sup>${subCoeff}`
        }
      } else {
        // 递归处理嵌套指数数组
        const subTermStr = formatTerm(t)
        return subTermStr
      }
    })
    
    // 将指数数组转换为字符串，处理特殊情况
    expStr = `<sup>${expParts.join('+')}</sup>`
  }

  // 最终格式化
  if (exp === 0) {
    return `${coeff}`
  } else if (exp === 1) {
    return coeff === 1 ? `ω` : `ω${coeff}`
  } else {
    // 对于3的幂，转换为ω
    return coeff === 1 ? `ω${expStr}` : `ω${expStr}${coeff}`
  }
}

function formatTerms(terms: Term[]): string {
  const formatted = terms.map(formatTerm)
  return formatted.join('+')
}
