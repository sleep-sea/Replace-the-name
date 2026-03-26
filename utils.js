// utils.js - 通用工具函数

// 显示浮动提示消息
function showToast(msg, type = 'info') {
    let toast = document.getElementById('dynamicToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dynamicToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '40px';
        toast.style.fontSize = '0.85rem';
        toast.style.fontWeight = '500';
        toast.style.zIndex = '1000';
        toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
        toast.style.backdropFilter = 'blur(8px)';
        toast.style.pointerEvents = 'none';
        document.body.appendChild(toast);
    }
    if (type === 'success') toast.style.background = '#2b7e3ae6';
    else if (type === 'warning') toast.style.background = '#e68a2ee6';
    else toast.style.background = '#2c6280e6';
    toast.textContent = msg;
    toast.style.opacity = '1';
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

// 获取当前页面基础URL（去掉参数部分）
function getBaseUrl() {
    return window.location.href.split('?')[0];
}