/**
 * 字节单位映射
 */
const BYTE_UNITS = [
  { unit: 'B', value: 1 },
  { unit: 'KB', value: 1024 },
  { unit: 'MB', value: 1024 * 1024 },
  { unit: 'GB', value: 1024 * 1024 * 1024 },
  { unit: 'TB', value: 1024 * 1024 * 1024 * 1024 },
  { unit: 'PB', value: 1024 * 1024 * 1024 * 1024 * 1024 },
  { unit: 'EB', value: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
  { unit: 'ZB', value: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
  { unit: 'YB', value: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 }
];

/**
 * @description 将字节单位智能转化成 `Bytes` 、 `KB` 、 `MB` 、 `GB` 、 `TB` 、 `PB` 、 `EB` 、 `ZB` 、 `YB` 其中的一种
 * @param byte 字节
 * @param digits 四舍五入保留几位小数（默认四舍五入保留两位小数）
 * @returns 智能转化字节单位后的值
 */
const formatBytes = (byte, digits = 2) => {
  // 处理负数
  const isNegative = byte < 0;
  const absByte = Math.abs(byte);

  // 处理 0 的情况
  if (absByte === 0) {
    return '0 B';
  }

  // 找到合适的单位
  let unitIndex = 0;
  for (let i = BYTE_UNITS.length - 1; i >= 0; i--) {
    if (absByte >= BYTE_UNITS[i].value) {
      unitIndex = i;
      break;
    }
  }

  // 计算转换后的值
  const unit = BYTE_UNITS[unitIndex];
  const convertedValue = absByte / unit.value;

  // 四舍五入到指定小数位
  const roundedValue =
    Math.round(convertedValue * Math.pow(10, digits)) / Math.pow(10, digits);

  // 格式化数字，移除不必要的小数位
  const formattedValue =
    roundedValue % 1 === 0
      ? Math.floor(roundedValue).toString()
      : roundedValue.toString();

  // 添加负号前缀
  const sign = isNegative ? '-' : '';

  return `${sign}${formattedValue} ${unit.unit}`;
};

export default formatBytes;
