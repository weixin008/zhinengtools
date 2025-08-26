// 主要JavaScript文件 - 包含广告系统和通用功能

// 获取今天日期（避免重复展示）
function getTodayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

// 智能广告系统
function loadAd(pageType) {
    // 加载内容区域广告
    const containers = [
        'ad-container-banner',
        'ad-container-sidebar', 
        'ad-container-tools-1',
        'ad-container-tools-2',
        'ad-container-article-1',
        'ad-container-article-2',
        'ad-container-player-1',
        'ad-container-player-2'
    ];
    
    containers.forEach(containerId => {
        const adContainer = document.getElementById(containerId);
        if (!adContainer) return;
        
        const todayKey = getTodayKey();
        const clickedKey = "adClicked_" + todayKey + "_" + containerId;
        const clicked = localStorage.getItem(clickedKey);
        
        // 如果用户今天已点击此广告位，则隐藏
        if (clicked) {
            adContainer.style.display = "none";
            return;
        }
        
        // 根据页面类型和广告位置选择合适的广告
        const adContent = getAdContent(pageType, containerId);
        if (adContent) {
            adContainer.innerHTML = adContent;
            
            // 为广告添加点击事件
            const adLinks = adContainer.querySelectorAll('.ad-content');
            adLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // 记录点击
                    localStorage.setItem(clickedKey, "true");
                    
                    // 统计点击
                    trackAdClick(pageType, containerId);
                    
                    // 延迟隐藏广告
                    setTimeout(() => {
                        adContainer.style.display = "none";
                    }, 100);
                });
            });
        }
    });
    
    // 加载侧边栏广告
    loadSidebarAds(pageType);
}

// 侧边栏广告系统
function loadSidebarAds(pageType) {
    // 检查屏幕宽度，只在大屏幕上显示
    if (window.innerWidth < 1400) return;
    
    const todayKey = getTodayKey();
    const leftAdKey = "sidebarAdClicked_" + todayKey + "_left";
    const rightAdKey = "sidebarAdClicked_" + todayKey + "_right";
    
    // 左侧广告
    if (!localStorage.getItem(leftAdKey)) {
        createSidebarAd('left', pageType, leftAdKey);
    }
    
    // 右侧广告
    if (!localStorage.getItem(rightAdKey)) {
        createSidebarAd('right', pageType, rightAdKey);
    }
}

function createSidebarAd(position, pageType, storageKey) {
    const existingAd = document.querySelector(`.sidebar-ad.${position}`);
    if (existingAd) return; // 已存在则不重复创建
    
    const adDiv = document.createElement('div');
    adDiv.className = `sidebar-ad ${position}`;
    
    const adContent = getSidebarAdContent(pageType, position);
    
    adDiv.innerHTML = `
        <button class="sidebar-ad-close" onclick="closeSidebarAd('${position}', '${storageKey}')">&times;</button>
        ${adContent}
    `;
    
    document.body.appendChild(adDiv);
    
    // 延迟显示以实现淡入效果
    setTimeout(() => {
        adDiv.style.display = 'block';
        adDiv.style.opacity = '0';
        adDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            adDiv.style.opacity = '1';
        }, 10);
    }, 1000);
}

function closeSidebarAd(position, storageKey) {
    const adDiv = document.querySelector(`.sidebar-ad.${position}`);
    if (adDiv) {
        // 记录关闭操作
        localStorage.setItem(storageKey, "true");
        
        // 淡出效果
        adDiv.style.opacity = '0';
        setTimeout(() => {
            adDiv.remove();
        }, 300);
        
        // 统计关闭行为
        trackUserBehavior('sidebar_ad_closed', { position: position });
    }
}

function getSidebarAdContent(pageType, position) {
    const ads = {
        left: {
            home: `
                <a href="https://example.com/efficiency-tools" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">效率工具包</h4>
                    <p style="font-size: 0.8rem; color: #666;">专业办公软件<br/>提升工作效率</p>
                </a>
            `,
            tools: `
                <a href="https://example.com/premium-tools" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔧</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">高级工具</h4>
                    <p style="font-size: 0.8rem; color: #666;">更多专业功能<br/>批量处理工具</p>
                </a>
            `,
            player: `
                <a href="https://example.com/video-services" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🎬</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">视频服务</h4>
                    <p style="font-size: 0.8rem; color: #666;">高清视频托管<br/>CDN加速服务</p>
                </a>
            `,
            articles: `
                <a href="https://example.com/tech-courses" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📚</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">技术课程</h4>
                    <p style="font-size: 0.8rem; color: #666;">在线编程教程<br/>提升技术技能</p>
                </a>
            `
        },
        right: {
            home: `
                <a href="https://example.com/cloud-storage" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">☁️</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">云存储服务</h4>
                    <p style="font-size: 0.8rem; color: #666;">安全可靠<br/>随时访问</p>
                </a>
            `,
            tools: `
                <a href="https://example.com/api-services" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔗</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">API接口</h4>
                    <p style="font-size: 0.8rem; color: #666;">开发者工具<br/>集成简单</p>
                </a>
            `,
            player: `
                <a href="https://example.com/streaming-tools" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📡</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">直播工具</h4>
                    <p style="font-size: 0.8rem; color: #666;">专业直播软件<br/>多平台推流</p>
                </a>
            `,
            articles: `
                <a href="https://example.com/ebooks" target="_blank" class="sidebar-ad-content">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📖</div>
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">电子书籍</h4>
                    <p style="font-size: 0.8rem; color: #666;">技术图书推荐<br/>知识充电</p>
                </a>
            `
        }
    };
    
    return ads[position][pageType] || ads[position]['home'];
}

// 获取广告内容
function getAdContent(pageType, containerId) {
    const ads = {
        home: {
            banner: `
                <a href="https://example.com/productivity-tools" target="_blank" class="ad-content">
                    <h4>🚀 提升工作效率</h4>
                    <p>专业办公软件，免费试用30天，助您事半功倍</p>
                </a>
            `,
            sidebar: `
                <a href="https://example.com/online-courses" target="_blank" class="ad-content">
                    <h4>📚 在线课程推荐</h4>
                    <p>IT技能提升课程，专业讲师授课，证书认证</p>
                </a>
            `
        },
        tools: {
            banner: `
                <a href="https://example.com/premium-tools" target="_blank" class="ad-content">
                    <h4>⭐ 高级工具套装</h4>
                    <p>更多专业工具，批量处理，API接口，企业级服务</p>
                </a>
            `,
            sidebar: `
                <a href="https://example.com/developer-resources" target="_blank" class="ad-content">
                    <h4>💻 开发者资源</h4>
                    <p>免费API接口，开发工具包，技术文档齐全</p>
                </a>
            `
        },
        player: {
            banner: `
                <a href="https://example.com/video-hosting" target="_blank" class="ad-content">
                    <h4>🎬 视频托管服务</h4>
                    <p>高速CDN，支持4K播放，专业视频解决方案</p>
                </a>
            `,
            sidebar: `
                <a href="https://example.com/streaming-tools" target="_blank" class="ad-content">
                    <h4>📡 直播工具包</h4>
                    <p>专业直播软件，多平台同步，弹幕互动</p>
                </a>
            `
        },
        articles: {
            banner: `
                <a href="https://example.com/tech-books" target="_blank" class="ad-content">
                    <h4>📖 技术图书推荐</h4>
                    <p>最新IT技术图书，电子版限时优惠，终身阅读</p>
                </a>
            `,
            sidebar: `
                <a href="https://example.com/blog-platform" target="_blank" class="ad-content">
                    <h4>✍️ 博客平台</h4>
                    <p>专业博客系统，SEO优化，社区互动</p>
                </a>
            `
        }
    };
    
    // 根据容器ID选择广告类型
    let adType = 'banner';
    if (containerId.includes('sidebar') || containerId.includes('tools')) {
        adType = 'sidebar';
    }
    
    // 返回对应的广告内容
    if (ads[pageType] && ads[pageType][adType]) {
        return ads[pageType][adType];
    }
    
    // 默认广告
    return `
        <a href="https://example.com/default-ad" target="_blank" class="ad-content">
            <h4>🌟 推荐内容</h4>
            <p>发现更多优质资源和工具，提升您的工作效率</p>
        </a>
    `;
}

// 广告点击统计
function trackAdClick(pageType, containerId) {
    // 发送统计数据到服务器（示例）
    const data = {
        page: pageType,
        container: containerId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // 使用fetch发送统计数据（需要后端API）
    // fetch('/api/ad-stats', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // });
    
    // 本地存储统计（用于分析）
    const stats = JSON.parse(localStorage.getItem('adStats') || '[]');
    stats.push(data);
    
    // 只保留最近100条记录
    if (stats.length > 100) {
        stats.splice(0, stats.length - 100);
    }
    
    localStorage.setItem('adStats', JSON.stringify(stats));
}

// 页面访问统计
function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent
    };
    
    // 发送到Google Analytics或其他统计服务
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // 本地统计
    const views = JSON.parse(localStorage.getItem('pageViews') || '[]');
    views.push(pageData);
    
    if (views.length > 50) {
        views.splice(0, views.length - 50);
    }
    
    localStorage.setItem('pageViews', JSON.stringify(views));
}

// 用户行为分析
function trackUserBehavior(action, data = {}) {
    const behaviorData = {
        action: action,
        data: data,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    const behaviors = JSON.parse(localStorage.getItem('userBehaviors') || '[]');
    behaviors.push(behaviorData);
    
    if (behaviors.length > 100) {
        behaviors.splice(0, behaviors.length - 100);
    }
    
    localStorage.setItem('userBehaviors', JSON.stringify(behaviors));
}

// 搜索引擎优化辅助功能
function initSEO() {
    // 添加结构化数据
    addStructuredData();
    
    // 优化图片加载
    lazyLoadImages();
    
    // 添加面包屑导航
    addBreadcrumbs();
    
    // 监听用户交互
    trackUserInteractions();
}

// 添加结构化数据
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "聚合工具平台",
        "url": window.location.origin,
        "description": "提供各种免费在线工具的聚合平台",
        "potentialAction": {
            "@type": "SearchAction",
            "target": window.location.origin + "/tools.html?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// 懒加载图片
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 添加面包屑导航
function addBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    
    if (!breadcrumbContainer) return;
    
    const breadcrumbs = [
        { name: '首页', url: '/' }
    ];
    
    if (path.includes('tools')) {
        breadcrumbs.push({ name: '在线工具', url: '/tools.html' });
    } else if (path.includes('player')) {
        breadcrumbs.push({ name: '视频播放器', url: '/player.html' });
    } else if (path.includes('articles')) {
        breadcrumbs.push({ name: '技术文章', url: '/articles.html' });
    }
    
    const breadcrumbHTML = breadcrumbs.map(item => 
        `<a href="${item.url}">${item.name}</a>`
    ).join(' > ');
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// 监听用户交互
function trackUserInteractions() {
    // 工具使用统计
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-tool')) {
            trackUserBehavior('tool_use', {
                tool: e.target.closest('.tool-container')?.id || 'unknown',
                button: e.target.textContent
            });
        }
        
        if (e.target.classList.contains('tool-card')) {
            trackUserBehavior('tool_navigate', {
                tool: e.target.querySelector('h4')?.textContent || 'unknown'
            });
        }
    });
    
    // 滚动深度统计
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // 每25%记录一次
                trackUserBehavior('scroll_depth', { percent: maxScroll });
            }
        }
    });
}

// 性能监控
function initPerformanceMonitoring() {
    // 页面加载性能
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            trackUserBehavior('page_performance', {
                loadTime: loadTime,
                domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            });
        }, 0);
    });
    
    // 监控错误
    window.addEventListener('error', (e) => {
        trackUserBehavior('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
        });
    });
}

// 移动端优化
function initMobileOptimization() {
    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // 移动端特定优化
        optimizeForMobile();
    }
}

function optimizeForMobile() {
    // 添加触摸友好的点击区域
    const buttons = document.querySelectorAll('.btn, .tool-card, .nav-link');
    buttons.forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
    });
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        trackUserBehavior('theme_change', { theme: newTheme });
    });
}

// 通知系统
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 设置颜色
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// 页面初始化逻辑已移至文件末尾统一处理

// 预加载关键页面
function preloadCriticalPages() {
    const criticalPages = ['/tools.html', '/player.html'];
    
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// 地理位置检测和优化
function detectUserLocation() {
    // 检测用户地理位置，为中国用户提供特殊优化
    const isChinaUser = navigator.language.includes('zh') || 
                       navigator.languages.some(lang => lang.includes('zh'));
    
    if (isChinaUser) {
        // 中国用户特殊优化
        document.documentElement.setAttribute('data-region', 'cn');
        
        // 预加载关键资源
        preloadCriticalResourcesForChina();
        
        // 使用国内CDN资源
        loadChinaOptimizedAssets();
        
        // 记录中国用户访问
        trackUserBehavior('china_user_detected', {
            language: navigator.language,
            timestamp: new Date().toISOString()
        });
    }
}

function preloadCriticalResourcesForChina() {
    // 预加载关键CSS和JS文件
    const criticalResources = [
        'assets/css/style.css',
        'assets/js/tools.js',
        'assets/js/player.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
}

function loadChinaOptimizedAssets() {
    // 将某些第三方库替换为国内CDN
    const scripts = document.querySelectorAll('script[src*="cdn.jsdelivr.net"]');
    scripts.forEach(script => {
        const originalSrc = script.src;
        
        // QRCode库使用国内CDN
        if (originalSrc.includes('qrcode')) {
            script.src = originalSrc.replace('cdn.jsdelivr.net', 'cdn.bootcdn.net');
            console.log('Switched to China CDN for QRCode');
        }
        
        // HLS.js使用国内CDN
        if (originalSrc.includes('hls.js')) {
            script.src = originalSrc.replace('cdn.jsdelivr.net', 'cdn.bootcdn.net');
            console.log('Switched to China CDN for HLS.js');
        }
    });
}

// 增强的预加载函数
function preloadCriticalPages() {
    const criticalPages = ['/tools.html', '/player.html'];
    
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
    
    // 为中国用户额外预加载
    if (document.documentElement.getAttribute('data-region') === 'cn') {
        const extraPages = ['/articles.html'];
        extraPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种功能
    initSEO();
    initPerformanceMonitoring();
    initMobileOptimization();
    initThemeToggle();
    trackPageView();
    
    // 地理位置检测（优先执行）
    detectUserLocation();
    
    // 添加页面加载动画
    document.body.classList.add('page-loaded');
    
    // 预加载关键页面
    setTimeout(() => {
        preloadCriticalPages();
    }, 1000);
});

// 导出函数供其他脚本使用
window.ToolsPlatform = {
    loadAd,
    trackUserBehavior,
    showNotification,
    getTodayKey,
    detectUserLocation
}; 