/*
 * @Author: wangqiaoling
 * @Date: 2024-12-06 14:55:37
 * @LastEditTime: 2024-12-06 14:56:55
 * @LastEditors: wangqiaoling
 * @Description: 根目录 rem 适配脚本
 */

class RemAdapter {
  private designWidth: number;
  private rootValue: number;

  constructor(designWidth: number = 1920, rootValue: number = 14) {
    this.designWidth = designWidth;
    this.rootValue = rootValue;
    this.init();
  }

  private calculateRem(): void {
    const html: HTMLElement = document.documentElement;
    const width: number = html.clientWidth;

    html.style.fontSize = `${(width / this.designWidth) * this.rootValue}px`;
  }

  private init(): void {
    this.calculateRem();
    window.addEventListener('resize', this.calculateRem.bind(this));
  }
}

// 创建实例
new RemAdapter();

export default RemAdapter;
