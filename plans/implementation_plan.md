# 遊戲中心實施計劃

## 項目概述
本計劃旨在改進現有遊戲中心，添加繁體中文完整支援和黑暗/明亮模式切換功能。

## 當前狀態分析
### 優勢
1. 已有8個完整可玩的遊戲
2. 現有3D太空站介面具有獨特風格
3. 已使用CSS變數，便於主題管理
4. 已有部分繁體中文內容
5. 已有響應式設計基礎

### 需要改進
1. 語言使用不一致（中英混合）
2. 缺少主題切換功能
3. 首頁導航可改進為更直觀的卡片式佈局
4. 遊戲頁面缺少統一返回機制

## 實施階段

### 階段一：基礎架構準備 (預計1-2天)
#### 1.1 創建主題管理系統
- 擴展現有CSS變數，添加明亮模式變數
- 創建主題切換JavaScript函數
- 添加主題持久化儲存（localStorage）
- 添加系統主題偏好偵測

#### 1.2 統一語言管理
- 創建語言常量文件 `lang.js`
- 定義繁體中文和英文的文字內容
- 實現簡單的語言切換函數
- 更新HTML使用語言變數

#### 1.3 改進檔案結構
```
/
├── assets/           # 靜態資源
│   ├── icons/       # 圖標
│   └── images/      # 圖片
├── css/             # 樣式文件
│   ├── themes/      # 主題樣式
│   └── components/  # 組件樣式
├── js/              # JavaScript文件
│   ├── themes.js    # 主題管理
│   ├── lang.js      # 語言管理
│   └── utils.js     # 工具函數
└── games/           # 遊戲文件
```

### 階段二：首頁改進 (預計2-3天)
#### 2.1 創建新的首頁佈局
- 設計響應式卡片網格佈局
- 每張遊戲卡片包含：
  - 遊戲圖標/預覽圖
  - 遊戲名稱（中英文）
  - 簡短描述
  - 最高分顯示
  - 開始按鈕
  - 難度標示

#### 2.2 添加主題切換控件
- 在頁面右上角添加主題切換按鈕
- 圖標：🌙（黑暗模式）/ ☀️（明亮模式）
- 平滑過渡動畫
- 即時預覽效果

#### 2.3 改進導航和頁腳
- 統一的Header包含網站標題和slogan
- 完整的繁體中文頁腳
- 版權資訊和聯絡方式

#### 2.4 保留現有3D效果作為可選視圖
- 添加"3D視圖"/"卡片視圖"切換
- 保持現有太空站效果作為特色模式

### 階段三：遊戲頁面統一化 (預計2-3天)
#### 3.1 創建統一的遊戲頁面模板
- 標準化的遊戲容器佈局
- 統一的控制欄（返回、重置、設定）
- 主題一致的樣式
- 響應式設計

#### 3.2 更新現有遊戲頁面
- 為每個遊戲頁面添加主題支援
- 統一返回按鈕樣式和位置
- 確保語言一致性
- 添加遊戲頁面的主題切換

#### 3.3 改進遊戲間導航
- 添加"下一個遊戲"/"上一個遊戲"導航
- 遊戲完成後的推薦系統
- 統一的遊戲統計顯示

### 階段四：增強功能 (預計1-2天)
#### 4.1 用戶設定頁面
- 主題偏好設定
- 語言選擇
- 音效控制
- 遊戲難度預設

#### 4.2 遊戲統計和成就系統
- 統一的遊戲統計面板
- 成就系統（徽章、獎盃）
- 遊戲進度追蹤

#### 4.3 無障礙訪問改進
- 適當的ARIA標籤
- 鍵盤導航支援
- 高對比度模式

## 技術實施細節

### 主題切換技術方案
```css
/* 基礎主題變數 */
:root {
  /* 黑暗模式 (預設) */
  --bg-color: #0b0c15;
  --card-bg: #151621;
  --primary-color: #00f2ff;
  --secondary-color: #ff0055;
  --text-color: #ffffff;
  --text-muted: #a0a0a0;
}

[data-theme="light"] {
  /* 明亮模式 */
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --primary-color: #007acc;
  --secondary-color: #e63946;
  --text-color: #1a1a1a;
  --text-muted: #666666;
}
```

```javascript
// 主題管理函數
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    this.setTheme(savedTheme);
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },
  
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};
```

### 語言管理技術方案
```javascript
// 語言常量
const translations = {
  'zh-HK': {
    'welcome': '歡迎來到遊戲中心',
    'play': '開始遊戲',
    'settings': '設定',
    'theme': '主題',
    'dark': '黑暗模式',
    'light': '明亮模式',
    // ... 更多翻譯
  },
  'en': {
    'welcome': 'Welcome to Game Center',
    'play': 'Play Game',
    'settings': 'Settings',
    'theme': 'Theme',
    'dark': 'Dark Mode',
    'light': 'Light Mode',
    // ... more translations
  }
};

// 語言切換函數
const LanguageManager = {
  currentLang: 'zh-HK',
  
  setLanguage(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;
    this.updateTexts();
    localStorage.setItem('language', lang);
  },
  
  updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[this.currentLang] && translations[this.currentLang][key]) {
        element.textContent = translations[this.currentLang][key];
      }
    });
  }
};
```

### 遊戲卡片組件設計
```html
<!-- 遊戲卡片示例 -->
<div class="game-card" data-game="ronin-duel">
  <div class="game-icon">⚔️</div>
  <h3 class="game-title" data-i18n="game.ronin.title">浪人對決</h3>
  <p class="game-desc" data-i18n="game.ronin.desc">武士風格的對戰遊戲，挑戰AI對手</p>
  <div class="game-meta">
    <span class="difficulty">難度: 中等</span>
    <span class="high-score">最高分: 1250</span>
  </div>
  <button class="play-btn" onclick="location.href='game1.html'">
    <span data-i18n="play">開始遊戲</span>
  </button>
</div>
```

## 文件更新計劃

### 需要修改的文件
1. **index.html** - 完全重構首頁佈局
2. **style.css** - 擴展為模組化CSS，添加主題支援
3. **common.js** - 添加主題和語言管理功能
4. **所有遊戲HTML文件** - 添加統一導航和主題支援

### 新創建的文件
1. **css/themes.css** - 主題變數定義
2. **css/components.css** - 可重用組件樣式
3. **js/theme-manager.js** - 主題管理邏輯
4. **js/language-manager.js** - 語言管理邏輯
5. **js/game-card.js** - 遊戲卡片組件
6. **plans/implementation_plan.md** - 本實施計劃

## 測試計劃

### 功能測試
1. 主題切換功能測試
   - 黑暗/明亮模式切換
   - 主題持久化
   - 系統偏好偵測
2. 語言切換測試
   - 繁體中文顯示
   - 語言切換按鈕
   - 語言持久化
3. 遊戲功能測試
   - 所有遊戲可正常遊玩
   - 返回首頁功能
   - 高分保存功能

### 兼容性測試
1. 瀏覽器兼容性
   - Chrome, Firefox, Safari, Edge
   - 移動端瀏覽器
2. 設備兼容性
   - 桌面電腦
   - 平板電腦
   - 手機
3. 無障礙訪問測試
   - 屏幕閱讀器兼容性
   - 鍵盤導航

### 性能測試
1. 加載性能
   - 首頁加載時間
   - 遊戲加載時間
2. 主題切換性能
   - 切換響應時間
   - 動畫流暢度

## 風險與緩解措施

### 技術風險
1. **現有3D效果兼容性**：主題切換可能影響3D渲染
   - 緩解：為3D場景創建獨立的主題處理邏輯
   
2. **遊戲頁面修改工作量**：8個遊戲頁面需要統一修改
   - 緩解：創建模板系統，批量應用更改

3. **CSS變數瀏覽器支援**：舊版瀏覽器可能不支援
   - 緩解：提供回退方案，使用傳統CSS覆蓋

### 設計風險
1. **主題色彩選擇**：明亮模式色彩可能影響可讀性
   - 緩解：進行對比度測試，確保WCAG AA標準

2. **語言翻譯質量**：非專業翻譯可能不準確
   - 緩解：使用簡單明確的翻譯，避免複雜表達

## 成功標準
1. 用戶可以一鍵切換黑暗/明亮模式
2. 所有介面文字使用一致的繁體中文
3. 主題切換平滑無閃爍
4. 所有遊戲功能正常運作
5. 移動設備體驗良好
6. 加載性能無明顯下降

## 時間線
- **第1周**：基礎架構和主題系統
- **第2周**：首頁改進和卡片佈局
- **第3周**：遊戲頁面統一化
- **第4周**：測試、優化和部署

## 下一步行動
1. 確認本實施計劃
2. 開始階段一開發
3. 定期檢查進度
4. 用戶測試和反饋收集

---
*計劃版本: 1.0*
*創建日期: 2026-02-20*
*最後更新: 2026-02-20*