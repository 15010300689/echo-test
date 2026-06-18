/** @description 数学运算相关 */
import NP from 'number-precision';

/** @desc 如果参数是非数值类型，返回0 */
function fine(args: number[] = []) {
    return args.map((item: number) => (/^-?\d+(\.\d+)?$/.test(`${item}`) ? item : 0));
}

/**
 * @description [数学运算相关]加法运算
 * @param {<number|string>} ...args 要相加的参数
 * @return {number} 相加后的值
 * @example plus(1.1, 2.2) => 3.2
 */
export function plus(...args: any[]): number {
    return NP.plus(...fine(args));
}

/**
 * @description [数学运算相关]减法运算
 * @param {<number|string>} ...args 要相减的参数
 * @return {number} 相减后的值
 * @example minus(3, 2) => 1
 */
export function minus(...args: any[]): number {
    return NP.minus(...fine(args));
}

/**
 * @description [数学运算相关]乘法运算
 * @param {<number|string>} ...args 要相乘的参数
 * @return {number} 相乘后的值
 * @example times(2, 3) => 6
 */
export function times(...args: any[]): number {
    return NP.times(...fine(args));
}

/**
 * @description [数学运算相关]除法运算
 * @param {<number|string>} ...args 要相除的参数
 * @return {number} 相除后的值
 * @example divide(4, 2) => 2
 */
export function divide(...args: any[]): number {
    return NP.divide(...fine(args));
}

/**
 * @description [数学运算相关]根据比率四舍五入
 * @param num 需要四舍五入的数字
 * @param ratio 比率
 * @returns {number} 根据比率四舍五入后的值
 * @example round(0.105, 2) => 0.11
 */

export function round(num: number, ratio: number): number {
    return NP.round(num, ratio);
}

/**
 * @description [数学运算相关] strip a number to nearest right number
 * @param num 
 * @returns {number}
 * @example strip(0.09999999999999998) => 0.1
 */

export function strip(num:number): number {
    return NP.strip(num);
}

/**
 * @description [数学运算相关]保留两位小数，直接截取，不四舍五入
 */
export function numToTwo(num: number): number {
    return +(`${num}`.replace(/\.(\d\d)\d*/, '.$1'));
}
