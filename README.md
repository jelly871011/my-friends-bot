# 我的朋友們 LINE Bot

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

一個讓您可以與虛擬朋友角色互動的 LINE Bot，提供多種有趣的對話和遊戲功能。

## 功能特色

- **角色模擬聊天**：與預設的多個朋友角色進行對話
- **經典語錄**：獲取角色的經典語錄
- **猜猜誰說的**：挑戰你對角色的了解
- **生日提醒**：查詢當天生日的角色
- **完整的角色管理**：透過 RESTful API 管理角色資料

## 快速開始

### 環境需求

- Node.js 16.0.0 或更新版本
- LINE Developer 帳號
- Zeabur 帳號（部署用）

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
   LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
   LINE_CHANNEL_SECRET=your_channel_secret
   ```

4. 啟動開發伺服器
   ```bash
   npm run dev
   ```

## 使用說明

### 可用指令

- `/list` - 查看所有朋友角色
- `/chat [角色名]` - 與指定角色對話
- `/quote [角色名]` - 隨機獲取角色語錄
- `/guess` - 玩「猜猜誰說的」遊戲
- `/today` - 查看今天生日的角色

## 開發

### 專案結構

```
src/
├── config/           # 設定檔
│   ├── db.js         # 資料庫連線設定
│   └── lineClient.js # LINE 客戶端設定
├── controllers/     # 控制器
│   └── friendController.js # 朋友相關邏輯處理
├── models/          # 資料模型
│   └── friend.js    # 朋友資料模型
├── routes/          # 路由
│   └── friend.js    # 朋友相關路由
└── webhook/         # Webhook 處理
    └── handler.js   # Webhook 事件處理器
```

### 開發指令

```bash
# 啟動開發伺服器（使用 nodemon）
npm run dev
```

## 部署

本專案使用 Zeabur 進行部署，詳細部署步驟請參考 [Zeabur 文件](https://docs.zeabur.com/)。

## 授權

本專案採用 [ISC](LICENSE) 授權。
