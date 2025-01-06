// 等待页面加载完成
window.onload = function() {
    // 语言配置
    const translations = {
        'en': {
            'title': 'BtcOriginClub - Pixel Survival Universe',
            'description': 'A mysterious pixel ocean where you become a unique Island Master.',
            'token-title': 'Game Token: BtcOrigin (BTOG)',
            'token-description': 'Explore, build, and trade to earn BTOG tokens',
            'features-title': 'Features:',
            'feature-1': 'Draw your own items',
            'feature-2': 'Fishing & crafting',
            'feature-3': 'Island building',
            'feature-4': 'Social trading',
            'feature-5': 'Realm warfare',
            'join': 'Join the adventure!'
        },
        'zh-TW': {
            'title': 'BtcOriginClub - 像素生存宇宙',
            'description': '在這片神秘的像素海域，你將成為獨一無二的島主。',
            'token-title': '遊戲代幣：BtcOrigin (BTOG)',
            'token-description': '探索、建設、交易，在像素海域中賺取BTOG代幣',
            'features-title': '特色玩法：',
            'feature-1': '自己繪製遊戲道具',
            'feature-2': '釣魚與製造',
            'feature-3': '島嶼建設',
            'feature-4': '社交貿易',
            'feature-5': '領域戰爭',
            'join': '加入冒險吧！'
        }
    };

    // 切换语言函数
    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // 获取语言选择器并添加事件监听
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            switchLanguage(this.value);
        });
    }

    // 初始化默认语言
    switchLanguage('en');
};
