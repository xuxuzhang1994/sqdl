import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  proxy: {
    '/servers/': {
      target: 'https://thethroneofgirl-pre-registration-api.smartplay.com.tw',
      changeOrigin: true,
      pathRewrite: { '^/servers': '' },
    },
  },
  publicPath: './',
  // base: '/dist',
  history: { type: 'hash' },
  hash: true,
});
