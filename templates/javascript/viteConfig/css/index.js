import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';

export default function () {
  const preprocessorOptions = {
    scss: {
      api: 'modern-compiler',
      additionalData: '$color: red;'
    }
  };
  const postcss = {
    plugins: [
      autoprefixer({
        overrideBrowserslist: [
          'Android 4.1',
          'iOS 7.1',
          'Chrome > 31',
          'ff > 31',
          'ie >= 8',
          'last 2 versions'
        ],
        grid: true
      }),
      pxtorem({
        rootValue: 14, // 1rem = 14px
        propList: ['*', '!border'], // 需要转换的属性，除 border 外所有px 转 rem
        exclude: '/node_modules/*', // 排除node_modules
        mediaQuery: false, // 是否要在媒体查询中转换px
        minPixelValue: 2 // 设置要转换的最小像素值
      })
    ]
  };
  return { preprocessorOptions, postcss };
}
