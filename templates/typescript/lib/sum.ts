/**
 * @description 求数字类型组成数组中的和
 * @param list 数字类型组成数组
 * @returns 求和值
 */
const sum = (list: Array<number>): number => {
  // 处理空数组的情况
  if (!list || list.length === 0) {
    return 0;
  }

  // 使用 reduce 方法求和
  return list.reduce((acc, curr) => acc + curr, 0);
};

export default sum;
