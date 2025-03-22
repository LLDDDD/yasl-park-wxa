// 页面加载器
class PageLoader {
    constructor() {
        this.contentContainer = document.getElementById('page-content');
        this.loadingTemplate = `
            <div class="flex items-center justify-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
        `;
    }

    // 显示加载状态
    showLoading() {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = this.loadingTemplate;
        }
    }

    // 加载页面内容
    async loadContent(url) {
        try {
            this.showLoading();
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // 提取 main 标签中的内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main');
            
            if (mainContent && this.contentContainer) {
                this.contentContainer.innerHTML = mainContent.innerHTML;
                
                // 执行页面特定的初始化脚本
                this.executePageScripts();
            } else {
                throw new Error('无法找到页面内容');
            }
        } catch (error) {
            console.error('加载页面失败:', error);
            this.showError(error.message);
        }
    }

    // 显示错误信息
    showError(message) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64">
                    <div class="text-red-500 mb-4">
                        <i class="fas fa-exclamation-circle text-4xl"></i>
                    </div>
                    <p class="text-gray-700">${message}</p>
                    <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        重新加载
                    </button>
                </div>
            `;
        }
    }

    // 执行页面特定的初始化脚本
    executePageScripts() {
        // 查找并执行页面中的所有脚本
        const scripts = this.contentContainer.getElementsByTagName('script');
        for (let script of scripts) {
            const newScript = document.createElement('script');
            
            // 复制脚本属性
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // 复制脚本内容
            newScript.textContent = script.textContent;
            
            // 替换原有脚本
            script.parentNode.replaceChild(newScript, script);
        }
    }
}

// 创建页面加载器实例
const pageLoader = new PageLoader();

// 处理导航链接点击
document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (link && link.href && link.href.endsWith('.html') && !link.href.includes('login.html')) {
        event.preventDefault();
        
        // 更新 URL 而不刷新页面
        window.history.pushState({}, '', link.href);
        
        // 加载新页面内容
        pageLoader.loadContent(link.href);
    }
});

// 处理浏览器前进/后退
window.addEventListener('popstate', function() {
    pageLoader.loadContent(window.location.href);
});

// 页面首次加载
document.addEventListener('DOMContentLoaded', function() {
    // 如果不是登录页面，加载当前页面内容
    if (!window.location.href.includes('login.html')) {
        pageLoader.loadContent(window.location.href);
    }
}); 