# 构建

    把宿主不能识别的资源,转换成能识别的资源且加工

- esm
- cjs 只支持同步导入
- umd 支持多种场景导入
- iife

根据产出的文件类型,可以分为

bundle: 一般指的是 js 文件,可以直接在浏览器中运行,把所有产物合成一个文件
preserve: 保留原始文件,不做任何处理 (gulp ,rollup)
