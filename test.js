// 临时测试脚本，用于验证转换结果
const { convertToInheritedTernary } = require('./src/utils/inheritedTernary.ts');

console.log('Testing 3^4:');
const result3_4 = convertToInheritedTernary(3**4);
console.log('Result:', result3_4.result);
console.log('Steps:', result3_4.steps);

console.log('\nTesting 3^3^4:');
const result3_3_4 = convertToInheritedTernary(3**3**4);
console.log('Result:', result3_3_4.result);
console.log('Steps:', result3_3_4.steps);
