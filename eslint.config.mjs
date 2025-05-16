import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'no-console': 'off',
    'yaml/plain-scalar': 'off',
  },
  vue: true,
}, {
  files: ['packages/core/src/**/*.{ts,js,vue}'],
}, {
  ignores: [
    './dist/*',
  ],
})
