# 我的朋友們 LINE Bot

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

一個用於管理朋友資料的 LINE 聊天機器人，可以記錄朋友的興趣、口頭禪、生日等資訊。

## 功能特色

- 查看所有朋友清單（支援 Flex Message 輪播）
- 查看特定朋友的詳細資料（含興趣、口頭禪、生日）
- 為朋友新增興趣（支援多筆輸入）
- 為朋友新增口頭禪（支援多筆輸入）
- 查看今天生日的朋友
- 生日倒數功能
- 支援指令別名，操作更便捷
- 互動式按鈕介面

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
| 查看隨機朋友 | r, random | 隨機查看一位朋友的詳細資料 | `查看隨機朋友` |
| 新增興趣 | i, interest | 為朋友新增興趣 | `小明 新增興趣 發呆、睡覺` |
| 新增口頭禪 | c, catchphrase | 為朋友新增口頭禪 | `小明 新增口頭禪 好懶、不想動` |
| 今天生日的朋友 | bd, birthday | 查看今天生日的朋友 | `今天生日的朋友` |
| 生日倒數 | countdown | 查看即將到來的生日 | `生日倒數` |

### 互動按鈕

- 在朋友卡片中點擊「新增興趣」或「新增口頭禪」按鈕
- 直接輸入內容（支援多筆，以頓號或逗號分隔）
- 系統會自動將輸入內容加入對應欄位

### 注意事項

1. 指令不區分大小寫
2. 多個興趣或口頭禪請用頓號（、）或逗號（,）分隔
3. 朋友名稱中若有空格，請用引號包起來
4. 使用互動按鈕時，請在 60 秒內回覆，否則需重新操作

## 快速開始

### 環境需求

- Node.js 16.0.0 或更新版本
- LINE Developer 帳號
- MongoDB 資料庫（用於儲存朋友資料）

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
    MONGODB_URI=mongodb://localhost:27017/my-friends-bot
    SESSION_TTL_SECONDS=60
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
│   ├── messages.js       # 訊息模板
│   └── flexTemplates.js  # Flex Message 模板
└── webhook/        # LINE Webhook 處理
    ├── commandRouter.js  # 指令路由
    ├── handler.js        # Webhook 處理器
    ├── postbackRouter.js # 按鈕事件處理
    └── sessionState.js   # 使用者會話狀態管理
```

## 開發指令

```bash
# 啟動開發伺服器（使用 nodemon）
npm run dev

# 檢查程式碼風格
npm run lint

# 自動修復程式碼風格問題
npm run lint:fix

# 格式化程式碼
npm run format

# 啟動生產環境
npm start
```

## 授權

本專案採用 [ISC](LICENSE) 授權。

## 貢獻

歡迎提交 Issue 或 Pull Request！
