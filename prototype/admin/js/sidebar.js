// 侧边栏配置
const sidebarConfig = {
    title: '森林公园管理后台',
    logo: 'https://picsum.photos/id/64/32/32',
    menus: [
        {
            title: null,
            items: [
                {
                    name: '系统概览',
                    icon: 'fas fa-chart-line',
                    link: 'dashboard.html',
                    permission: null
                }
            ]
        },
        {
            title: '用户管理',
            permission: 'user:view',
            items: [
                {
                    name: '用户列表',
                    icon: 'fas fa-users',
                    link: 'users.html'
                },
                // {
                //     name: '用户行为分析',
                //     icon: 'fas fa-chart-bar',
                //     link: 'user-behavior.html'
                // }
            ]
        },
        {
            title: '活动管理',
            permission: 'activity:view',
            items: [
                {
                    name: '活动列表',
                    icon: 'fas fa-calendar-alt',
                    link: 'activities.html'
                },
                {
                    name: '报名管理',
                    icon: 'fas fa-clipboard-list',
                    link: 'activity-registration.html'
                },
                {
                    name: '评价管理',
                    icon: 'fas fa-star',
                    link: 'activity-reviews.html'
                },
                {
                    name: '数据统计(后续)',
                    icon: 'fas fa-chart-pie',
                    link: 'activity-statistics.html'
                }
            ]
        },
        {
            title: '新闻管理',
            permission: 'news:view',
            items: [
                {
                    name: '新闻列表',
                    icon: 'fas fa-newspaper',
                    link: 'news.html'
                }
            ]
        },
        {
            title: '预约管理',
            permission: 'booking:view',
            items: [
                {
                    name: '预约记录',
                    icon: 'fas fa-calendar-check',
                    link: 'booking.html'
                }
            ]
        },
        {
            title: '积分商城',
            permission: 'points:view',
            items: [
                {
                    name: '商品管理',
                    icon: 'fas fa-shopping-cart',
                    link: 'points-shop.html'
                },
                {
                    name: '积分记录',
                    icon: 'fas fa-history',
                    link: 'points-history.html'
                }
            ]
        },
        {
            title: '营销工具',
            permission: 'marketing:view',
            items: [
                // {
                //     name: '营销活动',
                //     icon: 'fas fa-bullhorn',
                //     link: 'marketing.html'
                // },
                {
                    name: '邀请注册',
                    icon: 'fas fa-user-plus',
                    link: 'marketing-invite.html'
                },
                {
                    name: '活动分享',
                    icon: 'fas fa-share-alt',
                    link: 'marketing-share.html'
                }
            ]
        },
        {
            title: '系统设置',
            permission: 'settings:view',
            items: [
                {
                    name: '基础设置',
                    icon: 'fas fa-cog',
                    link: 'settings.html'
                }
            ]
        }
    ]
};

// 生成侧边栏 HTML
function generateSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // 生成标题栏
    const titleBar = document.createElement('div');
    titleBar.className = 'flex items-center justify-between px-4 py-3 bg-green-700';
    titleBar.innerHTML = `
        <div class="flex items-center space-x-2">
            <img src="${sidebarConfig.logo}" alt="Logo" class="w-8 h-8 rounded">
            <span class="text-lg font-semibold">${sidebarConfig.title}</span>
        </div>
        <button id="toggle-sidebar" class="lg:hidden">
            <i class="fas fa-bars"></i>
        </button>
    `;
    sidebar.appendChild(titleBar);

    // 生成导航菜单
    const nav = document.createElement('nav');
    nav.className = 'mt-4 px-2';
    const menuContainer = document.createElement('div');
    menuContainer.className = 'space-y-2';

    sidebarConfig.menus.forEach(menu => {
        // 检查权限
        if (menu.permission && !hasPermission(menu.permission)) {
            return;
        }

        // 添加菜单标题
        if (menu.title) {
            const title = document.createElement('p');
            title.className = 'px-4 py-2 text-xs uppercase tracking-wider text-green-200';
            title.textContent = menu.title;
            menuContainer.appendChild(title);
        }

        // 添加菜单项
        menu.items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.link;
            link.className = 'flex items-center px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition-colors';
            
            // 判断当前页面是否激活
            if (isCurrentPage(item.link)) {
                link.classList.add('bg-green-700');
            }

            link.innerHTML = `
                <i class="${item.icon} w-5 h-5 mr-3"></i>
                <span>${item.name}</span>
            `;
            menuContainer.appendChild(link);
        });
    });

    nav.appendChild(menuContainer);
    sidebar.appendChild(nav);

    // 初始化侧边栏切换功能
    initSidebarToggle();
}

// 检查权限
function hasPermission(permission) {
    // TODO: 实现实际的权限检查逻辑
    return true;
}

// 判断当前页面
function isCurrentPage(link) {
    return window.location.pathname.endsWith(link);
}

// 初始化侧边栏切换功能
function initSidebarToggle() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (toggleBtn && sidebar && content) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
            content.classList.toggle('content-expanded');
        });
    }
}

// 页面加载完成后初始化侧边栏
document.addEventListener('DOMContentLoaded', generateSidebar); 