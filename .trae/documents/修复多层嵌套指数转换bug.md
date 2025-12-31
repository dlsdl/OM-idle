## 修复第三层指数无法转换的bug

### 问题
`hasLargeExponent` 函数只检查第一层和第二层的指数，导致第三层及更深的指数（如 ω^ω^3 中的 3）无法被转换为 ω。

### 修复方案
修改 `hasLargeExponent` 函数，使其递归检查所有层级的指数：
- 检查第一层：term.exponent 是否 >= 3
- 检查第二层：subTerm.exponent 是否 >= 3
- **递归检查**：如果 subTerm.exponent 是 Term[] 类型，继续递归检查其内部的指数

### 修改文件
- `src/utils/inheritedTernary.ts` 中的 `hasLargeExponent` 函数