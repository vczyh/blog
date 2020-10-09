---
title: 使用 nvm 管理你的 node.js 版本
date: 2020-10-09
categories:
  - 前端
tags:
  - node
  - npm
---

nvm 支持通过命令行更换`node.js`版本，支持动态切换，如果对环境有不同的需求，那么 nvm 很适合你。

项目发起自 Github

- [Linux/Mac](https://github.com/nvm-sh/nvm)
- [Windows](https://github.com/coreybutler/nvm-windows)

## Windows

到 [Release](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7) 下载，然后安装，nvm 支持设置`nodejs`镜像和`npm`镜像，你可以设置镜像加速下载。

```
nvm node_mirror: https://npm.taobao.org/mirrors/node/
nvm npm_mirror: https://npm.taobao.org/mirrors/npm/
```

可以这样使用。

```bash
nvm install 12 # node v12.0.0
nvm use 12
```

验证。

```bash
nvm -v
node -v
npm -v
```

## Linux

// todo