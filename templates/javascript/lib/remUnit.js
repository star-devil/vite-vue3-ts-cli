class RemAdapter {
  constructor(designWidth = 1920, rootValue = 14) {
    this.designWidth = designWidth;
    this.rootValue = rootValue;
    this.init();
  }

  calculateRem() {
    const html = document.documentElement;
    const width = html.clientWidth;

    html.style.fontSize = `${(width / this.designWidth) * this.rootValue}px`;
  }

  init() {
    this.calculateRem();
    window.addEventListener('resize', this.calculateRem.bind(this));
  }
}

// 创建实例
new RemAdapter();

export default RemAdapter;
