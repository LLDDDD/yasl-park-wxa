// 登录状态检查
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = new Date().getTime();
    
    // 登录状态超过12小时自动退出
    if (!isLoggedIn || !loginTime || (currentTime - loginTime > 12 * 60 * 60 * 1000)) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 更新登录时间
function updateLoginTime() {
    localStorage.setItem('loginTime', new Date().getTime());
}

// 退出登录
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'login.html';
}

// 显示加载状态
function showLoading(message = '加载中...') {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loading.innerHTML = `
        <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-4 border-green-500 border-t-transparent"></div>
            <span class="text-gray-700">${message}</span>
        </div>
    `;
    document.body.appendChild(loading);
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// 显示提示消息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-0 opacity-100
        ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`;
    toast.innerHTML = `
        <div class="flex items-center text-white">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 确认对话框
function showConfirm(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">确认操作</h3>
            <p class="text-gray-700 mb-6">${message}</p>
            <div class="flex justify-end space-x-3">
                <button class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" id="cancel-btn">
                    取消
                </button>
                <button class="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md" id="confirm-btn">
                    确认
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // 绑定按钮事件
    modal.querySelector('#confirm-btn').addEventListener('click', () => {
        onConfirm && onConfirm();
        modal.remove();
    });
    modal.querySelector('#cancel-btn').addEventListener('click', () => {
        onCancel && onCancel();
        modal.remove();
    });
}

// 格式化日期时间
function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// 表单验证
const validators = {
    required: (value) => value !== undefined && value !== null && value !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^1[3-9]\d{9}$/.test(value),
    url: (value) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
    number: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    integer: (value) => Number.isInteger(Number(value)),
    min: (value, min) => Number(value) >= min,
    max: (value, max) => Number(value) <= max,
    minLength: (value, min) => String(value).length >= min,
    maxLength: (value, max) => String(value).length <= max
};

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出Excel
function exportToExcel(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// 图片上传预览
function previewImage(input, previewElement) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 检查权限
function checkPermission(permission) {
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
    return userPermissions.includes(permission);
}

// 初始化页面通用功能
function initializePage() {
    // 检查登录状态
    if (!checkLogin()) return;

    // 更新登录时间
    updateLoginTime();

    // 绑定退出登录事件
    document.querySelector('a[href="login.html"]').addEventListener('click', (e) => {
        e.preventDefault();
        showConfirm('确定要退出登录吗？', logout);
    });

    // 设置页面标题和激活菜单
    setActivePage();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage); 