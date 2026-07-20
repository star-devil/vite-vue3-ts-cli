import { config } from '@vue/test-utils';

// @vue/test-utils 全局配置
config.global.stubs = {
  transition: false
};
