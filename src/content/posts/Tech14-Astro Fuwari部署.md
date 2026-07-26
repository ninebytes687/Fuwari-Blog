---
title: Astro Fuwari食用教程
published: 2026-07-25
updated: 2026-07-25
description: "Astro Fuwari部署指南，教你如何快速搭建自己的博客"
image: "/covers/Fuwari.png"
tags: [Astro, Fuwari]
category: 'Tech'
draft: false
---

# 1、准备环境
Fuwari README 已经写了要求：

| 依赖 | 版本要求 |
| --- | --- |
| Node.js | >=20 |
| pnpm | >=9 |

先检查你的电脑有没有 Node，打开 PowerShell：
```shell
node -v
```
没有安装的话会报错，如果有的话则会输出：
```shell
PS C:\Users\NineBytes> node -v
v22.14.0
```
如果没有安装：点击[这里](https://nodejs.org/)安装Node.js，建议安装LTS版本。

安装 pnpm
执行：
```shell
npm install -g pnpm
```
检查：
```shell
pnpm -v
```
然后将会输出：
```shell
PS C:\Users\NineBytes> npm install -g pnpm

added 1 package in 2s

1 package is looking for funding
  run `npm fund` for details
PS C:\Users\NineBytes> pnpm -v
11.17.0
```
# 2、下载Fuwari源码
提供2种方式下载Fuwari源码，2种方法择一即可：
## 1.Git Clone
找一个你放博客的位置，例如`D:\Fuwari`
切换到你的博客存放目录：
```
cd 'D:\Fuwari'
```
克隆Fuwari仓库：
```shell
git clone https://github.com/saicaca/fuwari.git
```
然后：
```shell
cd fuwari
```
## 2.下载ZIP
点击[这里](https://github.com/saicaca/fuwari)打开Fuwari Github仓库
```
Code
 ↓
Download ZIP
```
解压即可。
# 3、安装依赖
进入 fuwari
```shell
cd 'fuwari'
```
下载依赖
```shell
pnpm install
```
第一次下载会下载很多东西，耐心等待即可，我就等了十几秒  
下载完成后可能会出现：
```shell
Done in 17.8s
```
# 4、本地启动
使用：
```shell
pnpm dev
```
然后会出现类似：
```shell
PS C:\Users\NineBytes\***\***\Fuwari> pnpm dev

> fuwari@0.0.1 dev C:\Users\NineBytes\Documents\Blog Project\Fuwari
> astro dev

15:57:50 [types] Generated 2ms
15:57:51 [content] Syncing content
15:57:51 [content] Synced content
15:57:51 [vite] Forced re-optimization of dependencies

 astro  v5.13.10 ready in 3521 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose
```
在PowerShell窗口内按住`Ctrl`键对着`Local`后边的链接单击  
或使用浏览器在地址栏内输入`http://localhost:4321`打开Fuwari首页
![1](/article/Tech/20260725/1.png)
至此，Fuwari已经部署到你的电脑上，修改各项配置文件还有编写你的文章即可食用😋