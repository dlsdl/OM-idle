// 简单测试脚本，用于测试convertToPsiOmega函数
const { convertToPsiOmega } = require('./src/utils/inheritedTernary.ts')

// 测试输入26
const result = convertToPsiOmega(26)
console.log('输入:', 26)
console.log('结果:', result.result)
console.log('预期:', 'ψ(Ω<sup>ψ(Ω<sup>ψ(Ω<sup>2</sup>ψ(Ω<sup>2</sup>ψ(Ωψ(Ωx))))</sup>)</sup>')
