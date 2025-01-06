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
        'description': '一個神秘的像素海洋，在這裡你將成為獨特的島主。',
        'token-title': '遊戲代幣：BtcOrigin (BTOG)',
        'token-description': '探索、建設和交易來賺取 BTOG 代幣',
        'features-title': '特色功能：',
        'feature-1': '繪製自己的物品',
        'feature-2': '釣魚和製作',
        'feature-3': '島嶼建設',
        'feature-4': '社交交易',
        'feature-5': '領域戰爭',
        'join': '加入冒險吧！'
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    
    // 设置初始语言
    const userLang = navigator.language || navigator.userLanguage;
    const initialLang = userLang.startsWith('zh') ? 'zh-TW' : 'en';
    languageSelect.value = initialLang;
    setLanguage(initialLang);

    // 语言切换监听
    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
});
