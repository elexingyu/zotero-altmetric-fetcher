# Zotero Altmetric Fetcher

这是一个 Zotero 7 插件，用于获取文献的 Altmetric 关注度分数。

## 功能

- 获取选中条目的 Altmetric 分数
- 获取当前库中所有条目的 Altmetric 分数
- 将 Altmetric 分数保存在条目的 Extra 字段中

## 安装

1. 从 Releases 页面下载最新的 .xpi 文件
2. 在 Zotero 中打开 Tools > Add-ons
3. 点击齿轮图标，选择 "Install Add-on From File..."
4. 选择下载的 .xpi 文件

## 使用方法

1. 选择一个或多个文献条目
2. 右键点击，选择 "获取选中条目的 Altmetric 分数"
3. 插件会自动获取每个条目的 Altmetric 分数，并将其添加到 Extra 字段

您也可以右键点击并选择 "获取所有条目的 Altmetric 分数" 来处理当前库中的所有条目。

## 开发

### 环境设置

1. 克隆本仓库
2. 运行 `npm install` 安装依赖
3. 复制 `.env.example` 为 `.env` 并编辑以匹配你的本地 Zotero 安装
4. 运行 `npm run start` 启动开发环境

### 构建

运行 `npm run build` 生成 .xpi 文件

## 许可证

MIT 