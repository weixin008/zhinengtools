// 安全防护模块
(function() {
    'use strict';
    
    // 安全配置
    const SECURITY_CONFIG = {
        allowedDomains: [
            'zhineng-tech.ip-ddns.com',
            'localhost',
            '127.0.0.1'
        ],
        maxRequestsPerMinute: 60,
        blockSuspiciousPatterns: true,
        enableCSRFProtection: true
    };
    
    // 请求频率限制
    const RateLimiter = {
        requests: new Map(),
        
        check: function(identifier = 'default') {
            const now = Date.now();
            const windowStart = now - 60000; // 1分钟窗口
            
            if (!this.requests.has(identifier)) {
                this.requests.set(identifier, []);
            }
            
            const userRequests = this.requests.get(identifier);
            
            // 清理过期记录
            const validRequests = userRequests.filter(time => time > windowStart);
            this.requests.set(identifier, validRequests);
            
            // 检查是否超限
            if (validRequests.length >= SECURITY_CONFIG.maxRequestsPerMinute) {
                return false;
            }
            
            // 记录新请求
            validRequests.push(now);
            return true;
        }
    };
    
    // 域名白名单检查
    function checkReferrer() {
        const referrer = document.referrer;
        const currentHost = window.location.hostname;
        
        // 允许直接访问
        if (!referrer) return true;
        
        try {
            const referrerHost = new URL(referrer).hostname;
            return SECURITY_CONFIG.allowedDomains.includes(referrerHost) || 
                   SECURITY_CONFIG.allowedDomains.includes(currentHost);
        } catch (e) {
            console.warn('Invalid referrer:', referrer);
            return false;
        }
    }
    
    // XSS防护
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, function(match) {
                return match === '<' ? '&lt;' : '&gt;';
            })
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    }
    
    // 可疑行为检测
    function detectSuspiciousActivity() {
        const patterns = [
            /script/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /onload/gi,
            /onerror/gi,
            /eval\(/gi,
            /document\.cookie/gi
        ];
        
        const currentUrl = window.location.href;
        const suspiciousFound = patterns.some(pattern => pattern.test(currentUrl));
        
        if (suspiciousFound) {
            console.warn('Suspicious activity detected');
            trackUserBehavior('security_alert', {
                type: 'suspicious_url',
                url: currentUrl,
                timestamp: new Date().toISOString()
            });
            return true;
        }
        
        return false;
    }
    
    // 防盗链检查
    function checkHotlinking() {
        if (!checkReferrer()) {
            console.warn('Potential hotlinking detected');
            trackUserBehavior('security_alert', {
                type: 'hotlinking',
                referrer: document.referrer,
                timestamp: new Date().toISOString()
            });
            return false;
        }
        return true;
    }
    
    // CSRF Token生成
    function generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // 存储CSRF Token
    function setCSRFToken() {
        if (SECURITY_CONFIG.enableCSRFProtection) {
            const token = generateCSRFToken();
            sessionStorage.setItem('csrf_token', token);
            
            // 在所有表单中添加CSRF token
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = token;
                form.appendChild(input);
            });
        }
    }
    
    // 验证CSRF Token
    function validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return storedToken && storedToken === token;
    }
    
    // 控制台警告
    function consoleWarning() {
        const warningStyle = 'color: red; font-size: 30px; font-weight: bold;';
        const infoStyle = 'color: orange; font-size: 14px;';
        
        console.log('%c⚠️ 警告！', warningStyle);
        console.log('%c如果有人告诉您在此粘贴代码，这很可能是诈骗！', infoStyle);
        console.log('%c粘贴代码可能会让攻击者访问您的账户。', infoStyle);
        console.log('%c除非您完全理解这些代码的作用，否则不要继续。', infoStyle);
    }
    
    // 键盘事件监控（检测调试器）
    function setupKeyboardMonitoring() {
        document.addEventListener('keydown', function(e) {
            // 检测开发者工具快捷键
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'U')) {
                
                trackUserBehavior('security_alert', {
                    type: 'devtools_attempt',
                    key: e.key,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // 页面可见性变化监控
    function setupVisibilityMonitoring() {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // 页面被隐藏时的处理
                trackUserBehavior('page_hidden', {
                    timestamp: new Date().toISOString()
                });
            } else {
                // 页面重新可见时检查安全状态
                initSecurity();
            }
        });
    }
    
    // 监控异常的用户行为
    function setupBehaviorMonitoring() {
        let clickCount = 0;
        let rapidClicks = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', function(e) {
            const now = Date.now();
            
            // 检测快速连续点击（可能是机器人）
            if (now - lastClickTime < 100) {
                rapidClicks++;
                if (rapidClicks > 10) {
                    trackUserBehavior('security_alert', {
                        type: 'rapid_clicking',
                        count: rapidClicks,
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                rapidClicks = 0;
            }
            
            lastClickTime = now;
            clickCount++;
            
            // 频率限制检查
            if (!RateLimiter.check('clicks')) {
                e.preventDefault();
                showNotification('操作过于频繁，请稍后再试', 'warning');
                return false;
            }
        });
    }
    
    // 初始化安全措施
    function initSecurity() {
        // 检查页面完整性
        if (!checkHotlinking()) {
            // 可以选择重定向到错误页面或显示警告
            return;
        }
        
        // 检测可疑活动
        if (detectSuspiciousActivity()) {
            console.warn('Security check failed');
            return;
        }
        
        // 设置CSRF保护
        setCSRFToken();
        
        // 显示控制台警告
        consoleWarning();
        
        // 设置监控
        setupKeyboardMonitoring();
        setupVisibilityMonitoring();
        setupBehaviorMonitoring();
        
        // 记录安全初始化
        trackUserBehavior('security_initialized', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });
    }
    
    // 导出安全函数供其他模块使用
    window.SecurityModule = {
        sanitizeInput: sanitizeInput,
        validateCSRFToken: validateCSRFToken,
        checkRateLimit: RateLimiter.check.bind(RateLimiter),
        checkReferrer: checkReferrer
    };
    
    // 页面加载完成后初始化安全措施
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
})(); 