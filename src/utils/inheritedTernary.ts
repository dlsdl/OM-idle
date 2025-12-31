import type { Term, ConversionStep } from '../types'

function toTernary(n: number): number[] {
  if (n === 0) return [0]
  const digits: number[] = []
  while (n > 0) {
    digits.push(n % 3)
    n = Math.floor(n / 3)
  }
  return digits
}

function convertToInheritedTernary(n: number): { result: string; steps: ConversionStep[] } {
  if (n < 0) {
    return { result: '请输入非负整数', steps: [] }
  }
  if (n === 0) {
    return { result: '0', steps: [{ step: 1, description: '0的继承3进制表示', expression: '0' }] }
  }
  if(n >= 7625597484987) {
    return { result: 'ψ(Ω)', steps: [] }
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
        let expHasLarge = false
        
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
              expHasLarge = true
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

export { convertToInheritedTernary }

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
