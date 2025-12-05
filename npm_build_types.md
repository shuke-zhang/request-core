# tsconfig.build.json 说明

```json
{
  "extends": ["./tsconfig.json"],
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "temp",
    "stripInternal": true
  }
}
```

### 字段解释：

| 字段                        | 说明                                      |
| --------------------------- | ----------------------------------------- |
| `declaration: true`         | 生成 `.d.ts` 类型文件                     |
| `emitDeclarationOnly: true` | **只生成类型，不生成 JS**                 |
| `outDir: "temp"`            | 把临时声明文件输出到 `packages/core/temp` |
| `stripInternal: true`       | 忽略所有带 `/** @internal */` 的 API      |

### 输出结构示例：

```
packages/core/temp/
  hooks/
    index.d.ts
    useHttpRequest.d.ts
  request/
    index.d.ts
    http.d.ts
    shared.d.ts
```

---

# 🔧 rollup-plugin-dts 的作用

第二阶段，Rollup 使用插件 `rollup-plugin-dts` 将 temp 下所有 `.d.ts` **合并成一个声明文件**。

最终输出：

```
packages/core/dist/index.d.ts
```

包含整个项目完整的类型信息。

---

# 自动生成 types 入口文件（temp/index.d.ts）

构建流程会自动生成统一的声明入口：

```ts
export * from './hooks'
export * from './request'
```

用于减少手动维护，提高发布一致性。

# 最终 NPM 包结构

```
dist/
  index.esm.js
  index.cjs.js
  index.d.ts   ← 类型声明入口
```

---
