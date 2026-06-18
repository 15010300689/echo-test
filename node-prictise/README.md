# node-prictise `.mjs` 学习模板

这个目录是一个最小可运行的 Node ESM (`.mjs`) 练习工程。

## 目录结构

- `scripts/hello.mjs`：最简单的参数脚本练习
- `scripts/deploy.mjs`：部署脚本骨架（list/download/publish）
- `package.json`：快捷命令入口

## 使用方式

```bash
cd /Applications/heyanzhen/test/node-prictise
npm run hello -- --name hyz
npm run deploy:list
npm run deploy:download -- --version 1.0.0
npm run deploy:publish -- --version 1.0.0
```

## 学习建议

1. 先看 `hello.mjs`，熟悉 `process.argv` 和 `import/export`。
2. 再看 `deploy.mjs` 里的 `parseArgs -> command switch`。
3. 最后把接口和发布命令换成你自己的项目配置。

