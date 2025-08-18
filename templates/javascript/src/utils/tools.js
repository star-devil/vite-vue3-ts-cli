/**
 * @description 删除对象中的空值
 * @param obj 对象
 * @returns 返回删除空值后的新对象
 */
export const removeEmpty = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );

/**
 * @description assets下的静态文件动态路径转化为相对地址
 * @param url 传入 assets/ 之后的文件路径
 * @returns 返回相对地址文件路径
 */
export const getAssetsFile = (url) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

/**
 * @description 创建浏览器 a 标签下载文件
 * @param data 下载文件blob对象
 * @param name 下载的文件名
 */
export const downloadFile = (data, name) => {
  try {
    const downloadUrl = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = downloadUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    // 可换成 UI 组件的 message 方法
    console.log('已加入浏览器下载队列，请稍后查看');
  } catch {
    // 可换成 UI 组件的 message 方法
    console.log('下载失败，请重试');
  }
};
