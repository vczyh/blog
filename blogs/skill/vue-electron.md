---
title: Electron + Vue 开发桌面应用
date: 2020-5-1
categories:
  - 技术
sidebar: auto
tags:
  - Vue
  - Electron
---

## Electron是什么

1. Electron 基于 `Chromium` 和 `Node.js`。
2. 可以使用 HTML，CSS 和 JavaScript 构建应用。
3. Electron 兼容 Mac、Windows 和 Linux，可以构建出三个平台的应用程序。

## 需要做的工作

`Electron` 只包含 `Chromium ` 和 `系统API`，并不提供集成 Vue 的功能。其实，只需要将 Vue 编译后的代码以 `Electron` 规定的结构组织，就可以使用 Vue 写桌面应用了~

### electron-vue

[electron-vue](https://github.com/SimulatedGREG/electron-vue) 类似于 Vue 脚手架，只需要在规定的文件夹里写代码就行，使用中的问题：

- 感觉脚手架作者不怎么维护。
- Vue 和其他依赖比较旧，直接改版本出不出问题不好说。
- 如果在现有的 Vue 项目中引入 `Electron`，还得来回拷贝，报错改错。

### vue-cli-plugin-electron-builder

[vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) 相对于 `electron-vue` 灵活了许多，更有在 Vue 项目中集成 `Electron` 的感觉，因此这篇博客主要说明 `vue-cli-plugin-electron-builder` 的使用。这里列出几个个人认为的优点：

- 目录结构基本按照 Vue 脚手架的结构。
- 非侵入式，依赖版本的管理与 一般的 Vue 应用管理相同。
- 以 `Vue CLI` 插件的形式安装，命令统一使用 `vue-cli-service` ，[Vue CLI  插件](https://cli.vuejs.org/zh/guide/plugins-and-presets.html#插件)。

## 使用 vue-cli-plugin-electron-builder

1. 创建一个 Vue项目，[参考这里](https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create)。

2. 引入依赖：
   ```bash
   yarn add -D electron electron-builder vue-cli-plugin-electron-builder
   ```

   **electron-builder** 是将项目打包成各个平台的工具。

3. 添加运行脚本：

   ```bash
   "scripts": {
     "electron:serve": "vue-cli-service electron:serve",
     "electron:build": "vue-cli-service electron:build"
   }
   ```
   
4. 创建 入口文件，相当于 `Electron` 项目中的 `main.js`：

   ```javascript
   // src/background.js
   
   import { app, protocol, BrowserWindow } from 'electron';
   import {
     createProtocol,
     installVueDevtools,
   } from 'vue-cli-plugin-electron-builder/lib';
   

   const isDevelopment = process.env.NODE_ENV !== 'production';
   
   // Keep a global reference of the window object, if you don't, the window will
   // be closed automatically when the JavaScript object is garbage collected.
   let win;
   
   // Scheme must be registered before the app is ready
   protocol.registerSchemesAsPrivileged([{
     scheme: 'app',
     privileges: {
       secure: true,
       standard: true,
     },
   }]);
   
   function createWindow() {
     // Create the browser window.
     win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         nodeIntegration: true,
       },
     });
   
     if (process.env.WEBPACK_DEV_SERVER_URL) {
       // Load the url of the dev server if in development mode
       win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
       if (!process.env.IS_TEST) win.webContents.openDevTools();
     } else {
       createProtocol('app');
       // Load the index.html when not in development
       win.loadURL('app://./index.html');
     }
   
     win.on('closed', () => {
       win = null;
     });
   }
   
   // Quit when all windows are closed.
   app.on('window-all-closed', () => {
     // On macOS it is common for applications and their menu bar
     // to stay active until the user quits explicitly with Cmd + Q
     if (process.platform !== 'darwin') {
       app.quit();
     }
   });
   
   app.on('activate', () => {
     // On macOS it's common to re-create a window in the app when the
     // dock icon is clicked and there are no other windows open.
     if (win === null) {
       createWindow();
     }
   });
   
   // This method will be called when Electron has finished
   // initialization and is ready to create browser windows.
   // Some APIs can only be used after this event occurs.
   app.on('ready', async () => {
     if (isDevelopment && !process.env.IS_TEST) {
       // Install Vue Devtools
       try {
         await installVueDevtools();
       } catch (e) {
         console.error('Vue Devtools failed to install:', e.toString());
       }
     }
     createWindow();
   });
   
   // Exit cleanly on request from parent process in development mode.
   if (isDevelopment) {
     if (process.platform === 'win32') {
       process.on('message', (data) => {
         if (data === 'graceful-exit') {
           app.quit();
         }
       });
     } else {
       process.on('SIGTERM', () => {
         app.quit();
       });
     }
   }
   
   ```
   
   记得修改 `package.json` ：
   
   ```
   "main": "background.js"
   ```
   
5. 运行：

   ```bash
   yarn electron:serve
   ```

   