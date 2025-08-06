import { compression, defineAlgorithm } from 'vite-plugin-compression2';

export default function setupConfigCompressPlugin(compress) {
  if (compress === 'none') {
    return [];
  }

  const gz = {
    algorithms: ['gzip', defineAlgorithm('deflate', { level: 9 })],
    // 体积大于1KB才会被压缩
    threshold: 1024,
    // 默认压缩html|xml|css|json|js|mjs|svg|yaml|yml|toml后缀文件，exclude=[填写不压缩的文件]
    // 压缩后是否删除原始文件
    deleteOriginalAssets: false
  };

  const codeList = { k: 'gzip', v: gz };

  const plugins = [];

  if (compress.includes(codeList.k)) {
    if (compress.includes('clear')) {
      plugins.push(
        compression(Object.assign(codeList.v, { deleteOriginalAssets: true }))
      );
    } else {
      plugins.push(compression(codeList.v));
    }
  }

  return plugins;
}
