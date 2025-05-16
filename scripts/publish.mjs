import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { exec } from './exec.mjs'

const cwd = process.cwd()
const packageJsonPath = path.resolve(cwd, 'packages', 'core', 'package.json')
const rawString = fs.readFileSync(packageJsonPath).toString()
const packageJson = JSON.parse(rawString)

// Temporarily remove dependencies to avoid issues during publish
packageJson.dependencies = undefined

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// 开始打包
console.log('开始打包过程...')

exec('pnpm', [
  'run',
  'build', // 添加打包步骤，如果需要的话
]).then((res) => {
  console.log('打包完成！')
  console.log('现在开始发布过程...')

  // 开始发布
  return exec('pnpm', [
    '-F',
    '@shuke~/request',
    'publish',
    '--access',
    'public',
    '--no-git-checks',
  ])
}).then((publishRes) => {
  console.log('发布完成！')
  console.log(publishRes.stderr || publishRes.stdout) // 输出发布结果
}).finally(() => {
  // 恢复原始的 package.json 内容
  fs.writeFileSync(packageJsonPath, rawString)
  console.log('已恢复原始的 package.json 内容。')
})
