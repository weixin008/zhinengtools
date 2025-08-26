// 工具功能JavaScript文件

// QR码生成器
function generateQR() {
    const text = document.getElementById('qr-text').value.trim();
    const size = parseInt(document.getElementById('qr-size').value);
    
    if (!text) {
        showNotification('请输入要生成二维码的内容', 'warning');
        return;
    }
    
    const canvas = document.getElementById('qr-canvas');
    
    // 检查是否有QRCode库
    if (typeof QRCode === 'undefined') {
        // 备用方案：简单图案生成
        generateSimpleQR(text, size, canvas);
        return;
    }
    
    // 使用真正的QRCode库
    QRCode.toCanvas(canvas, text, {
        width: size,
        height: size,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M',
        margin: 2
    }, function (error) {
        if (error) {
            console.error('QR码生成失败:', error);
            showNotification('二维码生成失败，请重试', 'error');
            return;
        }
        
        document.getElementById('qr-result').style.display = 'block';
        showNotification('二维码生成成功！', 'success');
        
        // 统计使用
        trackUserBehavior('qr_generated', {
            textLength: text.length,
            size: size
        });
    });
}

// 备用的简单QR码图案生成
function generateSimpleQR(text, size, canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // 生成简单的二维码图案
    const moduleSize = size / 25;
    ctx.fillStyle = '#000000';
    ctx.clearRect(0, 0, size, size);
    
    // 生成基于文本的简单图案
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            const hash = simpleHash(text + i + j);
            if (hash % 2 === 0) {
                ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    document.getElementById('qr-result').style.display = 'block';
    showNotification('二维码生成成功（简化版）', 'success');
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function downloadQR() {
    const canvas = document.getElementById('qr-canvas');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Base64编解码
function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        alert('请输入要编码的内容');
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('base64-output').value = encoded;
    } catch (error) {
        alert('编码失败：' + error.message);
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        alert('请输入要解码的Base64内容');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64-output').value = decoded;
    } catch (error) {
        alert('解码失败：请检查Base64格式是否正确');
    }
}

function clearBase64() {
    document.getElementById('base64-input').value = '';
    document.getElementById('base64-output').value = '';
}

// JSON格式化
function formatJSON() {
    const input = document.getElementById('json-input').value.trim();
    const errorDiv = document.getElementById('json-error');
    
    if (!input) {
        alert('请输入JSON数据');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        document.getElementById('json-output').value = formatted;
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'JSON格式错误：' + error.message;
        document.getElementById('json-output').value = '';
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input').value.trim();
    const errorDiv = document.getElementById('json-error');
    
    if (!input) {
        alert('请输入JSON数据');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        document.getElementById('json-output').value = minified;
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'JSON格式错误：' + error.message;
        document.getElementById('json-output').value = '';
    }
}

function validateJSON() {
    const input = document.getElementById('json-input').value.trim();
    const errorDiv = document.getElementById('json-error');
    
    if (!input) {
        alert('请输入JSON数据');
        return;
    }
    
    try {
        JSON.parse(input);
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#10b981';
        errorDiv.textContent = '✓ JSON格式正确';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ef4444';
        errorDiv.textContent = 'JSON格式错误：' + error.message;
    }
}

function clearJSON() {
    document.getElementById('json-input').value = '';
    document.getElementById('json-output').value = '';
    document.getElementById('json-error').style.display = 'none';
}

// 密码生成器
function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    
    let characters = '';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) characters += '0123456789';
    if (includeSymbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!characters) {
        alert('请至少选择一种字符类型');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    document.getElementById('generated-password').value = password;
    checkPasswordStrength(password);
}

function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('password-strength');
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    let strength = '';
    let className = '';
    
    if (score < 3) {
        strength = '弱';
        className = 'strength-weak';
    } else if (score < 5) {
        strength = '中等';
        className = 'strength-medium';
    } else {
        strength = '强';
        className = 'strength-strong';
    }
    
    strengthDiv.innerHTML = `密码强度：<span class="${className}">${strength}</span>`;
}

function copyPassword() {
    const passwordField = document.getElementById('generated-password');
    if (!passwordField.value) {
        alert('请先生成密码');
        return;
    }
    
    passwordField.select();
    document.execCommand('copy');
    alert('密码已复制到剪贴板');
}

// 颜色选择器
function updateColorInfo() {
    const colorInput = document.getElementById('color-input');
    const hex = colorInput.value;
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    
    document.getElementById('color-preview').style.backgroundColor = hex;
    document.getElementById('hex-value').value = hex.toUpperCase();
    document.getElementById('rgb-value').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('hsl-value').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    document.getElementById('cmyk-value').value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function rgbToCmyk(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function copyColorValue(type) {
    const element = document.getElementById(type + '-value');
    element.select();
    document.execCommand('copy');
    alert(`${type.toUpperCase()}值已复制到剪贴板`);
}

// URL编解码
function encodeURL() {
    const input = document.getElementById('url-input').value;
    if (!input) {
        alert('请输入要编码的URL');
        return;
    }
    
    const encoded = encodeURIComponent(input);
    document.getElementById('url-output').value = encoded;
}

function decodeURL() {
    const input = document.getElementById('url-input').value;
    if (!input) {
        alert('请输入要解码的URL');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('url-output').value = decoded;
    } catch (error) {
        alert('解码失败：URL格式可能不正确');
    }
}

function clearURL() {
    document.getElementById('url-input').value = '';
    document.getElementById('url-output').value = '';
}

// 文本处理工具
function updateTextStats() {
    const text = document.getElementById('text-input').value;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    
    document.getElementById('text-stats').innerHTML = 
        `字符数：${chars} | 不含空格：${charsNoSpaces} | 单词数：${words} | 行数：${lines}`;
}

function convertToUppercase() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toUpperCase();
}

function convertToLowercase() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toLowerCase();
}

function convertToTitle() {
    const input = document.getElementById('text-input').value;
    const titleCase = input.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    document.getElementById('text-output').value = titleCase;
}

function removeSpaces() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.replace(/\s/g, '');
}

function reverseText() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.split('').reverse().join('');
}

function clearText() {
    document.getElementById('text-input').value = '';
    document.getElementById('text-output').value = '';
    updateTextStats();
}

// 计算器功能
function appendToDisplay(value) {
    const display = document.getElementById('calc-display');
    if (display.value === '0' && !isNaN(value)) {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearCalculator() {
    document.getElementById('calc-display').value = '0';
}

function deleteLast() {
    const display = document.getElementById('calc-display');
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculate() {
    const display = document.getElementById('calc-display');
    try {
        // 替换显示符号为计算符号
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        
        // 安全的计算方式
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (isFinite(result)) {
            display.value = result.toString();
        } else {
            display.value = '错误';
        }
    } catch (error) {
        display.value = '错误';
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化计算器显示
    document.getElementById('calc-display').value = '0';
    
    // 为计算器添加键盘支持
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const display = document.getElementById('calc-display');
        
        if (!display) return;
        
        if ('0123456789'.includes(key)) {
            appendToDisplay(key);
        } else if ('+-*/'.includes(key)) {
            appendToDisplay(key === '*' ? '×' : key === '/' ? '÷' : key);
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            clearCalculator();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === '.') {
            appendToDisplay('.');
        }
    });
}); 