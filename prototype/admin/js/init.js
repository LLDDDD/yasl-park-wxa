// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLogin()) return;

    // 更新登录时间
    updateLoginTime();

    // 初始化权限控制
    initializePermissions();

    // 设置当前页面标题和面包屑
    setPageInfo();

    // 初始化用户菜单
    initUserMenu();

    // 初始化通知中心
    initNotifications();

    // 初始化侧边栏
    initSidebar();
});

// 设置页面信息
function setPageInfo() {
    const pagePath = window.location.pathname;
    const pageName = pagePath.split('/').pop();
    
    // 页面标题映射
    const pageTitles = {
        'dashboard.html': '系统概览',
        'users.html': '用户列表',
        'user-behavior.html': '用户行为分析',
        'activities.html': '活动列表',
        'activity-registration.html': '报名管理',
        'activity-reviews.html': '评价管理',
        'activity-statistics.html': '数据统计',
        'news.html': '新闻列表',
        'booking.html': '预约记录',
        'points-shop.html': '商品管理',
        'points-history.html': '积分记录',
        'marketing.html': '营销活动',
        'settings.html': '基础设置'
    };

    // 设置页面标题
    document.title = `${pageTitles[pageName] || '未知页面'} - 森林公园管理后台`;
    document.getElementById('page-title').textContent = pageTitles[pageName] || '未知页面';
    
    // 更新面包屑
    document.getElementById('current-page').textContent = pageTitles[pageName] || '未知页面';
}

// 初始化用户菜单
function initUserMenu() {
    const userMenu = document.getElementById('user-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    
    userMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
    });

    // 获取用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userNameElement = userMenuButton.querySelector('span');
    if (userNameElement) {
        userNameElement.textContent = userInfo.name || '管理员';
    }
}

// 初始化通知中心
function initNotifications() {
    const notificationButton = document.getElementById('notification-button');
    const notificationMenu = document.getElementById('notification-menu');
    
    notificationButton.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationMenu.classList.toggle('hidden');
    });

    // 获取通知数量
    updateNotificationCount();
}

// 更新通知数量
function updateNotificationCount() {
    const notificationCount = document.querySelector('#notification-button span');
    // TODO: 从API获取实际的通知数量
    const count = 3;
    notificationCount.textContent = count;
    notificationCount.style.display = count > 0 ? 'flex' : 'none';
}

// 初始化侧边栏
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');
    const mobileSidebarButton = document.getElementById('mobile-sidebar-button');
    
    // 切换侧边栏显示
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
    });
    
    mobileSidebarButton.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
    });

    // 设置当前页面对应的菜单项高亮
    setActiveMenuItem();
}

// 设置当前页面对应的菜单项高亮
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    document.querySelectorAll('#sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('bg-green-700');
        }
    });
}

// 点击页面其他区域关闭下拉菜单
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('user-menu');
    const notificationMenu = document.getElementById('notification-menu');
    
    if (!event.target.closest('#user-menu-button')) {
        userMenu.classList.add('hidden');
    }
    
    if (!event.target.closest('#notification-button')) {
        notificationMenu.classList.add('hidden');
    }
}); 