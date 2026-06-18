// 引入decimal.js库
import Decimal from 'decimal.js';

// 创建Decimal对象
const num1 = new Decimal('0.1');
const num2 = new Decimal('0.2');

// 进行数学运算
const result = num1.plus(num2);

// 将结果转换为字符串并显示
console.log(result.toString()); // 输出 '0.3'