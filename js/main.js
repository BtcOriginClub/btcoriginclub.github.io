// 网站初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('BtcOriginClub website loaded');
    
    // 检测用户浏览器语言
    const userLang = navigator.language || navigator.userLanguage;
    console.log('User language:', userLang);
    
    // 初始化页面交互
    initializeInteractions();
});

// 页面交互初始化
function initializeInteractions() {
    // 添加页面交互效果
    document.querySelectorAll('.features li').forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'translateX(10px)';
            item.style.transition = 'transform 0.3s';
        });
        
        item.addEventListener('mouseout', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}
