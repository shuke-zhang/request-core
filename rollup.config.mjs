// 它允许 Rollup 在构建过程中执行自定义操作
import commonjs from '@rollup/plugin-commonjs' // 它允许 Rollup 处理 CommonJS 模块
import json from '@rollup/plugin-json' // 它允许 Rollup 从 JSON 文件中导入数据
import { nodeResolve } from '@rollup/plugin-node-resolve' //     它允许 Rollup 查找和打包外部依赖项
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser' // 对此输出进行压缩
import typescript from '@rollup/plugin-typescript'
// 它允许 Rollup 处理 TypeScript 文件
import { defineConfig } from 'rollup' // 定义配置
import del from 'rollup-plugin-delete' // 删除文件

import dts from 'rollup-plugin-dts' // 它允许 Rollup 生成声明文件（.d.ts 文件）
import { exec } from './scripts/exec.mjs'
/**
 *  @type {import('rollup').InputOptions['plugins']}
 */
const devPlugins = [
  del({
    targets: ['packages/core/dist/*', 'packages/core/temp/*'],
    force: true,
    hook: 'buildStart',
  }),
  typescript({
    tsconfig: './packages/core/tsconfig.json', // 指定 tsconfig.json 文件的路径
    declaration: false, // 生成声明文件（.d.ts）
  }),
  nodeResolve(),
  replace({
    preventAssignment: true, // 防止赋值操作
  }),
  commonjs(),
  terser(),
  json(),
]

/**
 * 打包为js
 */
const buildJs = {
  input: {
    index: './packages/core/src/request/index.ts',
    http: './packages/core/src/request/http.ts',
  },
  output: [
    {
      format: 'es', // 输出 esm 模块 esm 是指 ECMAScript 模块 commonjs 是指 CommonJS 模块
      dir: './packages/core/dist', // 指定目录
      entryFileNames: '[name].esm.js', // 表示输出文件名将是入口文件名加上 .esm.js 后缀。name 是指入口文件名。
      sourcemap: true, // 会为每个输出文件生成对应的源映射文件（.map 文件）。
    },
    {
      format: 'commonjs',
      dir: './packages/core/dist',
      entryFileNames: '[name].cjs.js',
      sourcemap: true,
    },

  ],
  external: [
    'axios',
    'qs',
  ],
  plugins: devPlugins,
}

const buildTs = {
  input: {
    index: './packages/core/temp/index.d.ts',
  },
  output: [
    {
      dir: './packages/core/dist',
      format: 'es',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    dts({
      // respectExternal: true,
    }),
    // 生成ts文件
    {
      name: 'before',
      buildStart: async () => {
        const { ok, stderr } = await exec('tsc', ['-p', './packages/core/tsconfig.build.json'])
        if (!ok) {
          console.error('TypeScript compilation failed:', stderr)
          // eslint-disable-next-line node/prefer-global/process
          process.exit(1)
        }
        const fs = await import('node:fs')
        const path = await import('node:path')

        const tempDir = path.resolve('packages/core/temp')
        const indexPath = path.join(tempDir, 'index.d.ts')

        const content = `export * from './hooks';\nexport * from './request';\n`

        fs.writeFileSync(indexPath, content)
        console.log('自动生成 temp/index.d.ts ✔')
      },
    },
  ],
}
export default defineConfig([
  buildJs,
  buildTs,
])
