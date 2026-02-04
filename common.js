/**
 * 遊戲共用工具函數庫
 * 提供跨遊戲的共用功能
 */

const GameUtils = {
    // 防抖函數
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 節流函數
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 生成隨機整數
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 檢查移動設備
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    },

    // 格式化時間 (秒轉為 MM:SS)
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // 保存高分到 localStorage
    saveHighScore: function(gameName, score) {
        const key = `highscore_${gameName}`;
        const current = localStorage.getItem(key);
        if (!current || score > parseInt(current)) {
            localStorage.setItem(key, score.toString());
            return true; // 新紀錄
        }
        return false;
    },

    // 讀取高分
    getHighScore: function(gameName) {
        const key = `highscore_${gameName}`;
        return parseInt(localStorage.getItem(key)) || 0;
    },

    // 創建按鈕元素
    createButton: function(text, onClick, className = 'btn') {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.onclick = onClick;
        return button;
    },

    // 顯示通知
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#e94560' : type === 'success' ? '#39ff14' : '#00f2ff'};
            color: white;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// 添加 CSS 動畫
if (!document.querySelector('#gameUtilsStyles')) {
    const style = document.createElement('style');
    style.id = 'gameUtilsStyles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        .btn {
            padding: 10px 20px;
            background: #e94560;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s, background 0.2s;
        }
        .btn:hover {
            background: #ff2e4d;
            transform: scale(1.05);
        }
        .btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 遊戲統計追蹤系統
 */
const GameStats = {
    // 獲取遊戲統計數據
    getStats: function(gameName = 'all') {
        const stats = JSON.parse(localStorage.getItem('game_stats') || '{}');
        if (gameName === 'all') {
            return stats;
        }
        return stats[gameName] || { plays: 0, wins: 0, totalScore: 0, playTime: 0 };
    },
    
    // 記錄遊戲開始
    recordGameStart: function(gameName) {
        const stats = this.getStats('all');
        if (!stats[gameName]) {
            stats[gameName] = { plays: 0, wins: 0, totalScore: 0, playTime: 0, lastPlayed: null };
        }
        stats[gameName].plays++;
        stats[gameName].lastPlayed = new Date().toISOString();
        stats[gameName].currentStartTime = Date.now();
        localStorage.setItem('game_stats', JSON.stringify(stats));
    },
    
    // 記錄遊戲結束
    recordGameEnd: function(gameName, score = 0, win = false) {
        const stats = this.getStats('all');
        if (!stats[gameName]) return;
        
        if (win) stats[gameName].wins++;
        stats[gameName].totalScore += score;
        
        // 計算遊玩時間
        if (stats[gameName].currentStartTime) {
            const playTime = Date.now() - stats[gameName].currentStartTime;
            stats[gameName].playTime += playTime;
            delete stats[gameName].currentStartTime;
        }
        
        localStorage.setItem('game_stats', JSON.stringify(stats));
    },
    
    // 獲取總遊玩時間（格式化）
    getFormattedPlayTime: function(gameName) {
        const stats = this.getStats(gameName);
        const ms = stats.playTime || 0;
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}小時 ${minutes}分 ${seconds}秒`;
        } else if (minutes > 0) {
            return `${minutes}分 ${seconds}秒`;
        } else {
            return `${seconds}秒`;
        }
    },
    
    // 顯示統計面板
    showStatsPanel: function() {
        const stats = this.getStats('all');
        let html = '<div class="stats-panel" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); color: white; padding: 30px; border-radius: 15px; border: 2px solid var(--primary); z-index: 9999; max-width: 90%; max-height: 80%; overflow-y: auto;">';
        html += '<h2 style="color: var(--primary); margin-top: 0;">遊戲統計</h2>';
        
        if (Object.keys(stats).length === 0) {
            html += '<p>尚無遊戲統計數據</p>';
        } else {
            for (const [game, data] of Object.entries(stats)) {
                const winRate = data.plays > 0 ? ((data.wins / data.plays) * 100).toFixed(1) : 0;
                html += `
                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
                        <h3 style="margin-top: 0; color: #00f2ff;">${game}</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                            <div>遊玩次數: <strong>${data.plays}</strong></div>
                            <div>勝利次數: <strong>${data.wins}</strong></div>
                            <div>勝率: <strong>${winRate}%</strong></div>
                            <div>總得分: <strong>${data.totalScore}</strong></div>
                            <div colspan="2">總遊玩時間: <strong>${this.getFormattedPlayTime(game)}</strong></div>
                        </div>
                    </div>
                `;
            }
        }
        
        html += '<button onclick="this.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: #e94560; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">關閉</button>';
        html += '</div>';
        
        const panel = document.createElement('div');
        panel.innerHTML = html;
        document.body.appendChild(panel);
    }
};

// 導出到全局
window.GameUtils = GameUtils;
window.GameStats = GameStats;