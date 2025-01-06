document.addEventListener('DOMContentLoaded', () => {
    // 页面加载完成后的初始化代码
    
    // 处理移动端触摸事件
    if ('ontouchstart' in window) {
        document.addEventListener('touchmove', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // 添加页面主题切换功能（如果需要的话，可以在未来实现）
    
    // 添加页面加载动画
    document.body.classList.add('loaded');
});

// 错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

// 防止在某些移动浏览器中出现弹性滚动
document.body.addEventListener('touchmove', function(e) {
    if (e.target.tagName !== 'CANVAS') {
        e.preventDefault();
    }
}, { passive: false });
