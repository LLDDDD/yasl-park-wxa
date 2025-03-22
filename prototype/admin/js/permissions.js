// 权限配置
const permissions = {
    // 用户管理权限
    'user:view': '查看用户',
    'user:add': '添加用户',
    'user:edit': '编辑用户',
    'user:delete': '删除用户',
    'user:export': '导出用户',
    
    // 活动管理权限
    'activity:view': '查看活动',
    'activity:add': '添加活动',
    'activity:edit': '编辑活动',
    'activity:delete': '删除活动',
    'activity:publish': '发布活动',
    'activity:registration': '报名管理',
    
    // 新闻管理权限
    'news:view': '查看新闻',
    'news:add': '添加新闻',
    'news:edit': '编辑新闻',
    'news:delete': '删除新闻',
    'news:publish': '发布新闻',
    
    // 预约管理权限
    'booking:view': '查看预约',
    'booking:approve': '审核预约',
    'booking:export': '导出预约',
    
    // 积分商城权限
    'points:view': '查看积分',
    'points:manage': '管理积分',
    'points:goods': '商品管理',
    
    // 营销工具权限
    'marketing:view': '查看营销',
    'marketing:manage': '管理营销',
    
    // 系统设置权限
    'settings:view': '查看设置',
    'settings:edit': '编辑设置'
};

// 角色权限配置
const roles = {
    'superadmin': Object.keys(permissions), // 超级管理员拥有所有权限
    'admin': [ // 普通管理员
        'user:view',
        'activity:view', 'activity:add', 'activity:edit', 'activity:publish',
        'news:view', 'news:add', 'news:edit', 'news:publish',
        'booking:view', 'booking:approve',
        'points:view',
        'marketing:view'
    ],
    'editor': [ // 内容编辑
        'activity:view', 'activity:add', 'activity:edit',
        'news:view', 'news:add', 'news:edit'
    ],
    'operator': [ // 运营人员
        'booking:view', 'booking:approve',
        'points:view',
        'marketing:view'
    ]
};

// 获取当前用户角色
function getCurrentUserRole() {
    return localStorage.getItem('userRole') || 'operator';
}

// 获取当前用户权限
function getCurrentUserPermissions() {
    const role = getCurrentUserRole();
    return roles[role] || [];
}

// 检查是否有权限
function hasPermission(permission) {
    const userPermissions = getCurrentUserPermissions();
    return userPermissions.includes(permission);
}

// 检查是否有多个权限中的任意一个
function hasAnyPermission(permissionList) {
    return permissionList.some(permission => hasPermission(permission));
}

// 检查是否有多个权限
function hasAllPermissions(permissionList) {
    return permissionList.every(permission => hasPermission(permission));
}

// 根据权限显示/隐藏元素
function updateElementsByPermission() {
    document.querySelectorAll('[data-permission]').forEach(element => {
        const permission = element.dataset.permission;
        if (!hasPermission(permission)) {
            element.style.display = 'none';
        }
    });
}

// 权限检查装饰器
function requirePermission(permission) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
            if (hasPermission(permission)) {
                return originalMethod.apply(this, args);
            } else {
                showToast('您没有权限执行此操作', 'error');
                return false;
            }
        };
        return descriptor;
    };
}

// 初始化权限控制
function initializePermissions() {
    // 更新元素显示状态
    updateElementsByPermission();
    
    // 绑定权限相关事件
    document.addEventListener('click', function(e) {
        const target = e.target;
        const permission = target.dataset.permission;
        
        if (permission && !hasPermission(permission)) {
            e.preventDefault();
            e.stopPropagation();
            showToast('您没有权限执行此操作', 'error');
        }
    }, true);
}

// 导出权限相关函数
export {
    permissions,
    roles,
    getCurrentUserRole,
    getCurrentUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    requirePermission,
    initializePermissions
}; 