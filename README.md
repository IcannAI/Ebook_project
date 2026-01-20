# 線上書店系統 (E-Book Store)

一個前後端分離的線上書籍購物平台，類似博客來風格。支援會員購書、購物車、訂單管理；後台支援書籍上架、訂單處理、員工管理。

## 技術棧

**後端**
- Java 17 / 21
- Spring Boot 3.x
- Spring Security + JWT 認證
- Spring Data JPA + Hibernate
- MySQL 8.x
- Lombok

**前端**
- HTML5 + CSS3 + JavaScript
- jQuery (AJAX 呼叫 REST API)
- 分離資料夾：user/、admin/
- 靜態資源：assets/、books/ (書籍圖片)、images/ (banner)

**目前狀態**
- 前後端分離，已完成核心購物流程與後台管理
- 認證使用 JWT（會員與管理員角色分離）
- 密碼暫時明文儲存（開發階段專用，生產環境請務必改回 BCrypt）

## 功能模組

### 前台（會員端）
- 首頁（Banner 輪播、推薦書籍、分類瀏覽）
- 書籍列表 / 搜尋 / 分頁
- 書籍詳情頁
- 購物車
- 結帳流程（配送地址、付款方式）
- 訂單列表 / 訂單詳情
- 會員註冊 / 登入 / 忘記密碼
- 個人資料 / 修改密碼

### 後台（管理員端）
- 管理員登入
- 員工管理（CRUD）
- 書籍管理（新增/編輯/上傳封面/折扣/出版日期）
- 分類與子分類管理（巢狀）
- 出版社管理
- Banner 管理
- 訂單列表 / 訂單詳情 / 狀態變更

## 專案結構
ebook-project/
├── backend/
│   ├── src/main/java/com/demo/ebook/
│   │   ├── config/          → SecurityConfig, PasswordEncoderConfig
│   │   ├── controller/      → AuthController, AdminAuthController, BookController...
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── filter/          → JwtAuthenticationFilter
│   │   ├── repository/
│   │   ├── service/
│   │   └── utility/         → JwtUtil
│   └── pom.xml
│
├── frontend/
│   ├── user/
│   │   ├── index.html, productpage.html, cart.html, checkout.html...
│   ├── admin/
│   │   ├── admin-dashboard.html, admin-book-list.html...
│   ├── assets/              → css, js
│   └── books/               → image1.png ~ image30.png
│
└── README.md


## 快速啟動

### 後端
1. 建立 MySQL 資料庫 `ebook`
2. 修改 `application.yml` / `application.properties` 中的資料庫連線資訊
3. 執行 `mvn spring-boot:run` 或使用 IDE 啟動 `DemoApplication`

### 前端
直接用瀏覽器開啟 `frontend/user/index.html`（建議使用 Live Server 插件）

API 預設位址：`http://localhost:8080`

## 已知限制（開發階段）

- 密碼明文儲存（請勿用於生產環境）
- 圖片上傳路徑為本地檔案系統（未使用雲端儲存）
- 前端使用 jQuery + 原生 HTML，尚未使用現代框架（Vue/React）
- 尚未實作書籍搜尋的高級功能（全文搜尋、分頁優化）
- 尚未完整處理併發下單超賣問題

---
# 專案 Roadmap

## 目前階段（已完成 70–80% MVP）
- 會員註冊/登入/個人資料（JWT）
- 管理員登入/員工管理
- 書籍/分類/出版社/作者 CRUD + 圖片上傳
- 購物車 → 訂單建立
- Banner 管理
- 前後端基本串接（jQuery AJAX）
- 角色區分（ROLE_USER / ROLE_ADMIN）

## 短期目標（1–4 週內，衝刺 MVP 上線）
1. 修復所有已知 405 / 404 / 401 錯誤（登入、who、權限）
2. 完成前端購物車數量即時更新、結帳流程驗證
3. 後台訂單狀態變更（已付款 → 已出貨 → 已完成）
4. 加入簡單書籍搜尋（書名、作者模糊查詢）
5. 修正 N+1 問題（書籍列表使用 @EntityGraph 或 JOIN FETCH）
6. 加入基本的錯誤處理頁面與統一 API 回應格式（{ success, message, data }）
7. 部署測試環境（Docker + Nginx 靜態 + Spring Boot jar）

## 中期目標（1–3 個月）
- 重新啟用 BCrypt 密碼加密
- 加入書籍評價 / 星等系統
- 實作進階搜尋與篩選（價格區間、出版年份、折扣）
- 前端升級：考慮引入 Vue 3 或 HTMX 改善體驗
- 加入庫存管理與超賣防護（樂觀鎖 / 悲觀鎖）
- 訂單狀態通知（email 或簡訊，開發階段可 console.log）
- 後台報表（銷售統計、熱門書籍）

## 長期目標（3–12 個月）
- 支援第三方登入（Google、Line）
- 加入推薦系統（基於購買紀錄 / 瀏覽紀錄）
- 支援多語言（中/英）
- 行動版 RWD 優化
- 加入優惠券 / 促銷活動模組
- 完整 CI/CD（GitHub Actions + Docker）
- 雲端部署（AWS / GCP / Railway / Render）

## 優先順序排序（2026 Q1 參考）

1. 登入流程穩定（無 405/401/404）
2. 訂單建立與狀態管理完整
3. 密碼重新加密（BCrypt）
4. 基本搜尋與分頁優化
5. 部署測試版上線
6. 前端 UX 細節打磨（loading、錯誤提示、表單驗證）
7. 後台報表與統計
