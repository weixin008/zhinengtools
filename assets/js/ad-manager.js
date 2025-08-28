// 多广告联盟管理系统
(function() {
    'use strict';
    
    // 广告配置
    const AD_CONFIG = {
        // Google AdSense 配置（替换为你的实际ID）
        adsense: {
            enabled: true, // 启用AdSense测试模式
            publisherId: 'ca-pub-YOUR_ADSENSE_PUBLISHER_ID', // 替换为你的发布商ID
            slots: {
                banner: 'YOUR_BANNER_SLOT_ID', // 横幅广告位ID（728x90）
                sidebar: 'YOUR_SIDEBAR_SLOT_ID', // 侧边栏广告位ID（160x600）
                footer: 'YOUR_FOOTER_SLOT_ID'  // 底部广告位ID（970x250）
            }
        },
        
        // 百度联盟配置（替换为你的实际ID）
        baidu: {
            enabled: false, // 申请通过后设为true
            publisherId: 'xxxxxxxxxx', // 替换为你的联盟ID
            slots: {
                banner: 'xxxxxxxxxx',
                sidebar: 'xxxxxxxxxx',
                article: 'xxxxxxxxxx'
            }
        },
        
        // Amazon Associates配置
        amazon: {
            enabled: false, // 申请通过后设为true
            associateTag: 'your-associate-tag', // 替换为你的Associate Tag
            region: 'cn' // 或 'us', 'uk' 等
        },
        
        // PopCash配置
        popcash: {
            enabled: true, // 启用PopCash测试模式
            websiteId: 'YOUR_POPCASH_WEBSITE_ID', // 替换为你的Website ID
            frequency: 2, // 每个用户每天最多显示2次
            delay: 30000 // 页面加载30秒后显示（避免影响用户体验）
        },
        
        // 广告显示策略
        strategy: {
            rotation: true, // 是否轮换显示不同广告联盟
            fallback: true, // 是否使用后备广告
            respectUserChoice: true, // 是否尊重用户广告偏好
            maxAdsPerPage: 6 // 每页最大广告数量
        }
    };
    
    // 广告管理器
    const AdManager = {
        loadedNetworks: new Set(),
        activeAds: new Map(),
        
        // 初始化广告系统
        init: function() {
            this.loadAdNetworks();
            this.setupAdBlockDetection();
            this.setupUserPreferences();
        },
        
        // 加载广告网络
        loadAdNetworks: function() {
            // 加载Google AdSense
            if (AD_CONFIG.adsense.enabled) {
                this.loadAdSense();
            }
            
            // 加载百度联盟
            if (AD_CONFIG.baidu.enabled) {
                this.loadBaiduUnion();
            }
            
            // 加载PopCash
            if (AD_CONFIG.popcash.enabled) {
                this.loadPopCash();
            }
            
            // 如果没有启用的广告网络，使用示例广告
            if (!AD_CONFIG.adsense.enabled && !AD_CONFIG.baidu.enabled) {
                this.loadExampleAds();
            }
        },
        
        // 加载Google AdSense
        loadAdSense: function() {
            if (this.loadedNetworks.has('adsense')) return;
            
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.setAttribute('data-ad-client', AD_CONFIG.adsense.publisherId);
            
            script.onload = () => {
                this.loadedNetworks.add('adsense');
                console.log('AdSense loaded successfully');
            };
            
            script.onerror = () => {
                console.warn('Failed to load AdSense');
                this.loadFallbackAd();
            };
            
            document.head.appendChild(script);
        },
        
        // 加载百度联盟
        loadBaiduUnion: function() {
            if (this.loadedNetworks.has('baidu')) return;
            
            // 百度联盟通常需要特定的HTML结构
            this.loadedNetworks.add('baidu');
            console.log('Baidu Union configured');
        },
        
        // 加载PopCash
        loadPopCash: function() {
            if (this.loadedNetworks.has('popcash')) return;
            
            // 检查用户今日弹窗次数
            const todayKey = getTodayKey();
            const popCountKey = 'popcount_' + todayKey;
            const todayCount = parseInt(localStorage.getItem(popCountKey) || '0');
            
            if (todayCount >= AD_CONFIG.popcash.frequency) {
                console.log('PopCash daily limit reached');
                return;
            }
            
            // 延迟加载PopCash
            setTimeout(() => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '//cdn.popcash.net/show.js';
                
                script.onload = () => {
                    // PopCash初始化
                    if (typeof pop_under !== 'undefined') {
                        pop_under(AD_CONFIG.popcash.websiteId);
                        
                        // 记录弹窗次数
                        localStorage.setItem(popCountKey, (todayCount + 1).toString());
                        
                        // 统计
                        trackUserBehavior('popcash_shown', {
                            count: todayCount + 1,
                            timestamp: new Date().toISOString()
                        });
                    }
                    
                    this.loadedNetworks.add('popcash');
                    console.log('PopCash loaded successfully');
                };
                
                document.head.appendChild(script);
            }, AD_CONFIG.popcash.delay);
        },
        
        // 加载示例广告（用于演示）
        loadExampleAds: function() {
            this.loadedNetworks.add('example');
            console.log('Example ads loaded');
        },
        
        // 创建AdSense广告
        createAdSenseAd: function(containerId, slotType) {
            const container = document.getElementById(containerId);
            if (!container || !AD_CONFIG.adsense.enabled) return false;
            
            const slotId = AD_CONFIG.adsense.slots[slotType];
            if (!slotId) return false;
            
            // 设置不同广告位的尺寸
            const adStyles = {
                banner: 'display:block;width:728px;height:90px',
                sidebar: 'display:block;width:160px;height:600px', 
                footer: 'display:block;width:970px;height:250px'
            };
            
            const style = adStyles[slotType] || 'display:block';
            
            const adHTML = `
                <ins class="adsbygoogle"
                     style="${style}"
                     data-ad-client="${AD_CONFIG.adsense.publisherId}"
                     data-ad-slot="${slotId}"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            
            container.innerHTML = adHTML;
            container.classList.add('loaded');
            
            // 推送广告
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                this.activeAds.set(containerId, 'adsense');
                console.log(`AdSense ${slotType} ad loaded successfully`);
                return true;
            } catch (e) {
                console.error('AdSense error:', e);
                return false;
            }
        },
        
        // 创建百度联盟广告
        createBaiduAd: function(containerId, slotType) {
            const container = document.getElementById(containerId);
            if (!container || !AD_CONFIG.baidu.enabled) return false;
            
            const slotId = AD_CONFIG.baidu.slots[slotType];
            if (!slotId) return false;
            
            // 百度联盟广告代码（需要根据实际获得的代码调整）
            const adHTML = `
                <script type="text/javascript">
                    /*${slotType}广告*/
                    var cpro_id = "${slotId}";
                </script>
                <script type="text/javascript" src="http://cpro.baidustatic.com/cpro/ui/c.js"></script>
            `;
            
            container.innerHTML = adHTML;
            this.activeAds.set(containerId, 'baidu');
            return true;
        },
        
        // 创建Amazon Associates产品推荐
        createAmazonAd: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container || !AD_CONFIG.amazon.enabled) return false;
            
            // Amazon产品推荐示例
            const products = [
                {
                    title: "编程入门教程",
                    price: "¥89.00",
                    image: "https://via.placeholder.com/150x200",
                    link: `https://www.amazon.cn/dp/example?tag=${AD_CONFIG.amazon.associateTag}`
                },
                {
                    title: "Web开发实战",
                    price: "¥128.00", 
                    image: "https://via.placeholder.com/150x200",
                    link: `https://www.amazon.cn/dp/example2?tag=${AD_CONFIG.amazon.associateTag}`
                }
            ];
            
            const adHTML = `
                <div class="amazon-products">
                    <h4>📚 相关书籍推荐</h4>
                    ${products.map(product => `
                        <div class="amazon-product">
                            <img src="${product.image}" alt="${product.title}">
                            <div class="product-info">
                                <h5>${product.title}</h5>
                                <span class="price">${product.price}</span>
                                <a href="${product.link}" target="_blank" rel="nofollow">查看详情</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.innerHTML = adHTML;
            this.activeAds.set(containerId, 'amazon');
            return true;
        },
        
        // 创建后备广告
        createFallbackAd: function(containerId, slotType) {
            const container = document.getElementById(containerId);
            if (!container) return false;
            
            const fallbackAds = {
                banner: `
                    <div class="fallback-ad banner">
                        <a href="https://example.com/upgrade" target="_blank" class="ad-content">
                            <div class="ad-text">
                                <h3>🚀 升级你的工具箱</h3>
                                <p>发现更多强大功能，提升工作效率</p>
                                <span class="cta">立即了解 →</span>
                            </div>
                        </a>
                    </div>
                `,
                sidebar: `
                    <div class="fallback-ad sidebar">
                        <a href="https://example.com/premium" target="_blank" class="ad-content">
                            <div class="ad-icon">⭐</div>
                            <h4>高级功能</h4>
                            <p>解锁专业工具集</p>
                            <span class="cta">了解更多</span>
                        </a>
                    </div>
                `,
                article: `
                    <div class="fallback-ad article">
                        <a href="https://example.com/courses" target="_blank" class="ad-content">
                            <div class="ad-image">📖</div>
                            <div class="ad-text">
                                <h4>在线学习课程</h4>
                                <p>掌握最新技术技能</p>
                            </div>
                        </a>
                    </div>
                `
            };
            
            container.innerHTML = fallbackAds[slotType] || fallbackAds.banner;
            this.activeAds.set(containerId, 'fallback');
            return true;
        },
        
        // 智能广告放置
        placeAd: function(containerId, slotType = 'banner') {
            // 检查容器是否存在
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Ad container ${containerId} not found`);
                return false;
            }
            
            // 检查用户偏好
            if (!this.checkUserConsent()) {
                return false;
            }
            
            // 按优先级尝试不同广告网络
            let success = false;
            
            // 1. 尝试Google AdSense
            if (AD_CONFIG.adsense.enabled && !success) {
                success = this.createAdSenseAd(containerId, slotType);
            }
            
            // 2. 尝试百度联盟
            if (AD_CONFIG.baidu.enabled && !success) {
                success = this.createBaiduAd(containerId, slotType);
            }
            
            // 3. 如果是特定容器，尝试Amazon
            if (AD_CONFIG.amazon.enabled && !success && slotType === 'sidebar') {
                success = this.createAmazonAd(containerId);
            }
            
            // 4. 使用后备广告
            if (!success && AD_CONFIG.strategy.fallback) {
                success = this.createFallbackAd(containerId, slotType);
            }
            
            if (success) {
                this.trackAdPlacement(containerId, slotType);
            }
            
            return success;
        },
        
        // 检测广告拦截器
        setupAdBlockDetection: function() {
            // 创建一个测试广告元素
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox';
            testAd.style.position = 'absolute';
            testAd.style.left = '-999px';
            testAd.style.width = '1px';
            testAd.style.height = '1px';
            
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                const isBlocked = testAd.offsetHeight === 0;
                if (isBlocked) {
                    this.handleAdBlockDetected();
                }
                document.body.removeChild(testAd);
            }, 100);
        },
        
        // 处理广告拦截器检测
        handleAdBlockDetected: function() {
            console.log('Ad blocker detected');
            
            // 显示友好提示
            const notification = document.createElement('div');
            notification.className = 'adblock-notice';
            notification.innerHTML = `
                <div class="notice-content">
                    <h4>🚫 检测到广告拦截器</h4>
                    <p>我们的服务依靠广告收入维持运营，请考虑将本站加入白名单。</p>
                    <button onclick="this.parentElement.parentElement.style.display='none'">我知道了</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // 统计
            trackUserBehavior('adblock_detected', {
                timestamp: new Date().toISOString()
            });
        },
        
        // 设置用户偏好
        setupUserPreferences: function() {
            // 检查用户是否已经设置过广告偏好
            const consent = localStorage.getItem('ad_consent');
            if (!consent) {
                this.showConsentDialog();
            }
        },
        
        // 显示同意对话框
        showConsentDialog: function() {
            const dialog = document.createElement('div');
            dialog.className = 'consent-dialog';
            dialog.innerHTML = `
                <div class="consent-content">
                    <h3>🍪 隐私与广告设置</h3>
                    <p>我们使用广告来维持网站的免费服务。您可以选择：</p>
                    <div class="consent-options">
                        <label>
                            <input type="radio" name="ad_preference" value="personalized"> 
                            接受个性化广告（更相关的内容）
                        </label>
                        <label>
                            <input type="radio" name="ad_preference" value="non_personalized"> 
                            只接受非个性化广告
                        </label>
                        <label>
                            <input type="radio" name="ad_preference" value="none"> 
                            不显示广告
                        </label>
                    </div>
                    <div class="consent-buttons">
                        <button onclick="AdManager.saveConsent('personalized')">接受并继续</button>
                        <button onclick="AdManager.saveConsent('none')">拒绝广告</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
        },
        
        // 保存用户同意设置
        saveConsent: function(preference) {
            localStorage.setItem('ad_consent', preference);
            localStorage.setItem('ad_consent_date', new Date().toISOString());
            
            // 移除对话框
            const dialog = document.querySelector('.consent-dialog');
            if (dialog) {
                dialog.remove();
            }
            
            // 根据用户选择调整广告设置
            if (preference === 'none') {
                AD_CONFIG.adsense.enabled = false;
                AD_CONFIG.baidu.enabled = false;
                AD_CONFIG.amazon.enabled = false;
            }
            
            // 统计
            trackUserBehavior('ad_consent', {
                preference: preference,
                timestamp: new Date().toISOString()
            });
        },
        
        // 检查用户同意
        checkUserConsent: function() {
            const consent = localStorage.getItem('ad_consent');
            return consent !== 'none';
        },
        
        // 统计广告放置
        trackAdPlacement: function(containerId, slotType) {
            trackUserBehavior('ad_placed', {
                containerId: containerId,
                slotType: slotType,
                network: this.activeAds.get(containerId),
                timestamp: new Date().toISOString()
            });
        },
        
        // 获取广告统计
        getStats: function() {
            return {
                activeAds: this.activeAds.size,
                loadedNetworks: Array.from(this.loadedNetworks),
                userConsent: localStorage.getItem('ad_consent')
            };
        }
    };
    
    // 导出到全局
    window.AdManager = AdManager;
    
    // 增强原有的loadAd函数
    const originalLoadAd = window.loadAd;
    window.loadAd = function(pageType) {
        // 初始化广告管理器
        AdManager.init();
        
        // 调用原有逻辑（示例广告）
        if (originalLoadAd) {
            originalLoadAd(pageType);
        }
        
        // 使用新的广告管理系统
        setTimeout(() => {
            const containers = [
                { id: 'ad-container-banner', type: 'banner' },
                { id: 'ad-container-sidebar', type: 'sidebar' },
                { id: 'adsense-banner-1', type: 'banner' },
                { id: 'adsense-sidebar-1', type: 'sidebar' },
                { id: 'adsense-sidebar-2', type: 'sidebar' },
                { id: 'adsense-footer', type: 'footer' },
                { id: 'ad-container-article-1', type: 'article' },
                { id: 'ad-container-article-2', type: 'sidebar' },
                { id: 'ad-container-player-1', type: 'banner' },
                { id: 'ad-container-player-2', type: 'sidebar' }
            ];
            
            containers.forEach(container => {
                if (document.getElementById(container.id)) {
                    AdManager.placeAd(container.id, container.type);
                }
            });
        }, 1000);
    };
    
    // 工具页面广告初始化
    window.initToolsPageAds = function() {
        // 确保广告管理器已初始化
        AdManager.init();
        
        // 延迟加载广告，避免影响页面性能
        setTimeout(() => {
            const toolsAdContainers = [
                { id: 'adsense-banner-1', type: 'banner' },
                { id: 'adsense-sidebar-1', type: 'sidebar' },
                { id: 'adsense-sidebar-2', type: 'sidebar' },
                { id: 'adsense-footer', type: 'footer' }
            ];
            
            toolsAdContainers.forEach(container => {
                AdManager.displayAd(container.id, container.type);
            });
            
            console.log('Tools page ads initialized');
        }, 2000); // 页面加载2秒后显示广告
    };
    
})(); 