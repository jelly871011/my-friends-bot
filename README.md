# 我的朋友們 LINE Bot

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

一個用於管理朋友資料的 LINE 聊天機器人，可以記錄朋友的興趣、口頭禪等資訊。

## 功能特色

- 查看所有朋友清單
- 查看特定朋友的詳細資料
- 為朋友新增興趣
- 為朋友新增口頭禪
- 支援指令別名，操作更便捷

## 指令說明

### 基本指令格式
```
[朋友名稱] [指令] [參數1, 參數2, ...]
```

### 可用指令

| 指令 | 別名 | 說明 | 範例 |
|------|------|------|------|
| 幫助 | h, help | 顯示幫助訊息 | `幫助` |
| 查看所有朋友 | ls, list | 列出所有朋友 | `查看所有朋友` |
| 查看這個朋友 | v, view | 查看特定朋友資料 | `小明 查看這個朋友` |
| 新增興趣 | i, interest | 為朋友新增興趣 | `小明 新增興趣 發呆、睡覺` |
| 新增口頭禪 | c, catchphrase | 為朋友新增口頭禪 | `小明 新增口頭禪 好懶、不想動` |

### 注意事項

1. 指令不區分大小寫
2. 多個興趣或口頭禪請用頓號（、）或逗號（,）分隔
3. 朋友名稱中若有空格，請用引號包起來

## 快速開始

### 環境需求

- Node.js 16.0.0 或更新版本
- LINE Developer 帳號

### 安裝步驟

1. 下載專案
    ```bash
    git clone https://github.com/jelly871011/my-friends-bot.git
    cd my-friends-bot
    ```

2. 安裝依賴
    ```bash
    npm install
    ```

3. 設定環境變數
   複製 `.env.example` 並重新命名為 `.env`，然後填入您的設定：
    ```env
    PORT=3000
    LINE_CHANNEL_SECRET=your_channel_secret
    LINE_ACCESS_TOKEN=your_access_token
    ```

4. 啟動開發伺服器
    ```bash
    npm run dev
    ```

## 專案結構

```
src/
├── config/         # 設定檔
├── controllers/    # 控制器
├── models/         # 資料模型
├── services/       # 業務邏輯
├── utils/          # 工具函數
│   ├── commandParser.js  # 指令解析
│   ├── commonData.js     # 共用資料
│   └── messages.js       # 訊息模板
└── webhook/        # LINE Webhook 處理
    ├── commandRouter.js  # 指令路由
    └── handler.js       # Webhook 處理器
```

## 開發指令

```bash
# 啟動開發伺服器（使用 nodemon）
npm run dev

# 建置專案
npm run build

# 啟動生產環境
npm start
```

## 授權

本專案採用 [ISC](LICENSE) 授權。

## 貢獻

歡迎提交 Issue 或 Pull Request！
