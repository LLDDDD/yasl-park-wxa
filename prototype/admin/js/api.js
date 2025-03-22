// API基础配置
const API_BASE_URL = 'http://api.example.com/v1';
const API_TIMEOUT = 30000; // 30秒超时

// 请求拦截器
const requestInterceptor = (config) => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
    // 统一处理响应
    if (response.status === 200) {
        return response.data;
    }
    throw new Error(response.statusText);
};

// 错误处理
const errorHandler = (error) => {
    if (error.response) {
        // 服务器返回错误
        switch (error.response.status) {
            case 401:
                // 未授权，跳转到登录页
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                break;
            case 403:
                showToast('没有权限执行此操作', 'error');
                break;
            case 404:
                showToast('请求的资源不存在', 'error');
                break;
            case 500:
                showToast('服务器错误，请稍后重试', 'error');
                break;
            default:
                showToast(error.response.data.message || '请求失败', 'error');
        }
    } else if (error.request) {
        // 请求发出但没有收到响应
        showToast('网络错误，请检查网络连接', 'error');
    } else {
        // 请求配置出错
        showToast('请求配置错误', 'error');
    }
    return Promise.reject(error);
};

// 基础请求函数
async function request(url, options = {}) {
    const config = {
        url: API_BASE_URL + url,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(config.url, {
            method: config.method || 'GET',
            headers: config.headers,
            body: config.data ? JSON.stringify(config.data) : null
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        return responseInterceptor(data);
    } catch (error) {
        return errorHandler(error);
    }
}

// API函数
const api = {
    // 用户相关
    user: {
        login: (data) => request('/auth/login', { method: 'POST', data }),
        logout: () => request('/auth/logout', { method: 'POST' }),
        getInfo: () => request('/user/info'),
        updateInfo: (data) => request('/user/info', { method: 'PUT', data }),
        changePassword: (data) => request('/user/password', { method: 'PUT', data }),
        list: (params) => request('/users', { params }),
        create: (data) => request('/users', { method: 'POST', data }),
        update: (id, data) => request(`/users/${id}`, { method: 'PUT', data }),
        delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
        export: (params) => request('/users/export', { params, responseType: 'blob' })
    },

    // 活动相关
    activity: {
        list: (params) => request('/activities', { params }),
        detail: (id) => request(`/activities/${id}`),
        create: (data) => request('/activities', { method: 'POST', data }),
        update: (id, data) => request(`/activities/${id}`, { method: 'PUT', data }),
        delete: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
        publish: (id) => request(`/activities/${id}/publish`, { method: 'POST' }),
        unpublish: (id) => request(`/activities/${id}/unpublish`, { method: 'POST' }),
        registrations: (id, params) => request(`/activities/${id}/registrations`, { params }),
        approveRegistration: (id, registrationId) => 
            request(`/activities/${id}/registrations/${registrationId}/approve`, { method: 'POST' }),
        rejectRegistration: (id, registrationId) => 
            request(`/activities/${id}/registrations/${registrationId}/reject`, { method: 'POST' })
    },

    // 新闻相关
    news: {
        list: (params) => request('/news', { params }),
        detail: (id) => request(`/news/${id}`),
        create: (data) => request('/news', { method: 'POST', data }),
        update: (id, data) => request(`/news/${id}`, { method: 'PUT', data }),
        delete: (id) => request(`/news/${id}`, { method: 'DELETE' }),
        publish: (id) => request(`/news/${id}/publish`, { method: 'POST' }),
        unpublish: (id) => request(`/news/${id}/unpublish`, { method: 'POST' })
    },

    // 预约相关
    booking: {
        list: (params) => request('/bookings', { params }),
        detail: (id) => request(`/bookings/${id}`),
        approve: (id) => request(`/bookings/${id}/approve`, { method: 'POST' }),
        reject: (id) => request(`/bookings/${id}/reject`, { method: 'POST' }),
        export: (params) => request('/bookings/export', { params, responseType: 'blob' })
    },

    // 积分相关
    points: {
        list: (params) => request('/points', { params }),
        detail: (id) => request(`/points/${id}`),
        award: (userId, points, reason) => 
            request('/points/award', { method: 'POST', data: { userId, points, reason } }),
        deduct: (userId, points, reason) => 
            request('/points/deduct', { method: 'POST', data: { userId, points, reason } }),
        goods: {
            list: (params) => request('/points/goods', { params }),
            create: (data) => request('/points/goods', { method: 'POST', data }),
            update: (id, data) => request(`/points/goods/${id}`, { method: 'PUT', data }),
            delete: (id) => request(`/points/goods/${id}`, { method: 'DELETE' })
        }
    },

    // 营销相关
    marketing: {
        coupons: {
            list: (params) => request('/marketing/coupons', { params }),
            create: (data) => request('/marketing/coupons', { method: 'POST', data }),
            update: (id, data) => request(`/marketing/coupons/${id}`, { method: 'PUT', data }),
            delete: (id) => request(`/marketing/coupons/${id}`, { method: 'DELETE' })
        },
        activities: {
            list: (params) => request('/marketing/activities', { params }),
            create: (data) => request('/marketing/activities', { method: 'POST', data }),
            update: (id, data) => request(`/marketing/activities/${id}`, { method: 'PUT', data }),
            delete: (id) => request(`/marketing/activities/${id}`, { method: 'DELETE' })
        }
    },

    // 系统设置
    settings: {
        get: () => request('/settings'),
        update: (data) => request('/settings', { method: 'PUT', data }),
        logs: {
            list: (params) => request('/settings/logs', { params }),
            export: (params) => request('/settings/logs/export', { params, responseType: 'blob' })
        }
    },

    // 文件上传
    upload: {
        image: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return request('/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            });
        },
        file: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return request('/upload/file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            });
        }
    }
};

// 导出API
export default api; 