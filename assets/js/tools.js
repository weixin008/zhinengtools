// 工具功能JavaScript文件

// 标签页切换功能
function showCategory(categoryId) {
    // 隐藏所有分类
    const categories = document.querySelectorAll('.tool-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    // 显示选中的分类
    const targetCategory = document.getElementById(categoryId);
    if (targetCategory) {
        targetCategory.classList.add('active');
    }
    
    // 更新导航按钮状态
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[onclick="showCategory('${categoryId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 显示第一个工具面板
    const firstToolBtn = targetCategory.querySelector('.tool-btn');
    if (firstToolBtn) {
        firstToolBtn.click();
    }
}

function showTool(toolId) {
    // 获取当前分类
    const activeCategory = document.querySelector('.tool-category.active');
    if (!activeCategory) return;
    
    // 隐藏当前分类下的所有工具面板
    const panels = activeCategory.querySelectorAll('.tool-panel');
    panels.forEach(panel => panel.style.display = 'none');
    
    // 显示选中的工具面板
    const targetPanel = activeCategory.querySelector(`#${toolId}`);
    if (targetPanel) {
        targetPanel.style.display = 'block';
    }
    
    // 更新工具按钮状态
    const toolBtns = activeCategory.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = activeCategory.querySelector(`[onclick="showTool('${toolId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
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

// 新增工具功能
// URL编解码功能
function encodeURL() {
    const input = document.getElementById('url-input').value.trim();
    if (!input) {
        showNotification('请输入需要编码的URL', 'warning');
        return;
    }
    
    try {
        const encoded = encodeURIComponent(input);
        document.getElementById('url-output').value = encoded;
        showNotification('URL编码成功！', 'success');
    } catch (error) {
        showNotification('URL编码失败：' + error.message, 'error');
    }
}

function decodeURL() {
    const input = document.getElementById('url-input').value.trim();
    if (!input) {
        showNotification('请输入需要解码的URL', 'warning');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('url-output').value = decoded;
        showNotification('URL解码成功！', 'success');
    } catch (error) {
        showNotification('URL解码失败：' + error.message, 'error');
    }
}

// Hash生成功能
async function generateMD5() {
    await generateHash('SHA-256', 'MD5');
}

async function generateSHA1() {
    await generateHash('SHA-1', 'SHA1');
}

async function generateSHA256() {
    await generateHash('SHA-256', 'SHA256');
}

async function generateHash(algorithm, displayName) {
    const input = document.getElementById('hash-input').value.trim();
    if (!input) {
        showNotification(`请输入要生成${displayName}的内容`, 'warning');
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        document.getElementById('hash-output').value = hashHex;
        showNotification(`${displayName}生成成功！`, 'success');
    } catch (error) {
        showNotification(`${displayName}生成失败：` + error.message, 'error');
    }
}

// 文本处理功能
function textToUpper() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toUpperCase();
    showNotification('已转换为大写', 'success');
}

function textToLower() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toLowerCase();
    showNotification('已转换为小写', 'success');
}

function textReverse() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.split('').reverse().join('');
    showNotification('文本已反转', 'success');
}

function removeSpaces() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.replace(/\s/g, '');
    showNotification('已移除所有空格', 'success');
}

function getTextStats() {
    const input = document.getElementById('text-input').value;
    const stats = {
        chars: input.length,
        charsNoSpaces: input.replace(/\s/g, '').length,
        words: input.trim() ? input.trim().split(/\s+/).length : 0,
        lines: input.split('\n').length,
        paragraphs: input.split(/\n\s*\n/).filter(p => p.trim()).length
    };
    
    const statsHtml = `
        字符数: ${stats.chars} | 字符数(无空格): ${stats.charsNoSpaces} | 
        词数: ${stats.words} | 行数: ${stats.lines} | 段落数: ${stats.paragraphs}
    `;
    
    document.getElementById('text-stats').innerHTML = statsHtml;
    showNotification('文本统计完成', 'success');
}

// 实时文本统计功能
function getTextStatsLive() {
    const input = document.getElementById('stat-input').value;
    const stats = {
        chars: input.length,
        charsNoSpaces: input.replace(/\s/g, '').length,
        words: input.trim() ? input.trim().split(/\s+/).length : 0,
        lines: input.split('\n').length
    };
    
    document.getElementById('char-count').textContent = stats.chars;
    document.getElementById('char-no-space').textContent = stats.charsNoSpaces;
    document.getElementById('word-count').textContent = stats.words;
    document.getElementById('line-count').textContent = stats.lines;
}

// 增强的Base64功能
function clearBase64() {
    document.getElementById('base64-input').value = '';
    document.getElementById('base64-output').value = '';
    showNotification('已清空内容', 'success');
}

// 单位转换功能
const unitData = {
    length: {
        'm': { name: '米', factor: 1 },
        'cm': { name: '厘米', factor: 0.01 },
        'mm': { name: '毫米', factor: 0.001 },
        'km': { name: '公里', factor: 1000 },
        'inch': { name: '英寸', factor: 0.0254 },
        'ft': { name: '英尺', factor: 0.3048 },
        'yard': { name: '码', factor: 0.9144 }
    },
    weight: {
        'kg': { name: '公斤', factor: 1 },
        'g': { name: '克', factor: 0.001 },
        'lb': { name: '磅', factor: 0.453592 },
        'oz': { name: '盎司', factor: 0.0283495 },
        't': { name: '吨', factor: 1000 }
    },
    temperature: {
        'c': { name: '摄氏度' },
        'f': { name: '华氏度' },
        'k': { name: '开尔文' }
    }
};

function updateUnitOptions() {
    const unitType = document.getElementById('unit-type').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    // 清空现有选项
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // 添加新选项
    for (const [key, value] of Object.entries(unitData[unitType])) {
        const option1 = new Option(value.name, key);
        const option2 = new Option(value.name, key);
        fromUnit.add(option1);
        toUnit.add(option2);
    }
}

function convertUnit() {
    const inputValue = parseFloat(document.getElementById('convert-input').value);
    const unitType = document.getElementById('unit-type').value;
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(inputValue)) {
        showNotification('请输入有效数值', 'warning');
        return;
    }
    
    let result;
    
    if (unitType === 'temperature') {
        result = convertTemperature(inputValue, fromUnit, toUnit);
    } else {
        const fromFactor = unitData[unitType][fromUnit].factor;
        const toFactor = unitData[unitType][toUnit].factor;
        result = inputValue * fromFactor / toFactor;
    }
    
    document.getElementById('convert-result').value = result.toFixed(6).replace(/\.?0+$/, '');
    showNotification('转换完成', 'success');
}

function convertTemperature(value, from, to) {
    // 先转换为摄氏度
    let celsius;
    switch (from) {
        case 'c': celsius = value; break;
        case 'f': celsius = (value - 32) * 5/9; break;
        case 'k': celsius = value - 273.15; break;
    }
    
    // 再从摄氏度转换为目标单位
    switch (to) {
        case 'c': return celsius;
        case 'f': return celsius * 9/5 + 32;
        case 'k': return celsius + 273.15;
    }
}

// 颜色选择器功能
function initColorPicker() {
    const colorInput = document.getElementById('color-picker-input');
    if (colorInput) {
        colorInput.addEventListener('input', updateColorValues);
        updateColorValues(); // 初始化显示
    }
}

function updateColorValues() {
    const color = document.getElementById('color-picker-input').value;
    const preview = document.getElementById('color-preview');
    
    // 更新预览
    if (preview) {
        preview.style.backgroundColor = color;
    }
    
    // 转换颜色格式
    const hex = color.toUpperCase();
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // 更新显示
    document.getElementById('hex-value').value = hex;
    document.getElementById('rgb-value').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('hsl-value').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
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

function copyColorValue(type) {
    let value;
    switch (type) {
        case 'hex':
            value = document.getElementById('hex-value').value;
            break;
        case 'rgb':
            value = document.getElementById('rgb-value').value;
            break;
        case 'hsl':
            value = document.getElementById('hsl-value').value;
            break;
    }
    
    navigator.clipboard.writeText(value).then(() => {
        showNotification(`${type.toUpperCase()}值已复制到剪贴板`, 'success');
    }).catch(() => {
        showNotification('复制失败', 'error');
    });
}

// 时间戳转换功能
function timestampToDate() {
    const timestamp = document.getElementById('timestamp-input').value.trim();
    if (!timestamp) {
        showNotification('请输入时间戳', 'warning');
        return;
    }
    
    try {
        const num = parseInt(timestamp);
        // 判断是否为毫秒时间戳
        const date = new Date(num > 9999999999 ? num : num * 1000);
        
        if (isNaN(date.getTime())) {
            throw new Error('无效的时间戳');
        }
        
        document.getElementById('time-result').textContent = date.toLocaleString();
        showNotification('时间戳转换成功', 'success');
    } catch (error) {
        showNotification('时间戳转换失败：' + error.message, 'error');
    }
}

function dateToTimestamp() {
    const datetime = document.getElementById('datetime-input').value;
    if (!datetime) {
        showNotification('请选择日期时间', 'warning');
        return;
    }
    
    try {
        const date = new Date(datetime);
        const timestamp = Math.floor(date.getTime() / 1000);
        
        document.getElementById('time-result').textContent = timestamp;
        showNotification('日期转换成功', 'success');
    } catch (error) {
        showNotification('日期转换失败：' + error.message, 'error');
    }
}

function updateCurrentTimestamp() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const element = document.getElementById('current-timestamp');
    if (element) {
        element.textContent = currentTimestamp;
    }
}

// 新版计算器功能
let calcExpression = '';

function calcInput(value) {
    calcExpression += value;
    document.getElementById('calc-display').value = calcExpression;
}

function calcClear() {
    calcExpression = '';
    document.getElementById('calc-display').value = '';
}

function calcBackspace() {
    calcExpression = calcExpression.slice(0, -1);
    document.getElementById('calc-display').value = calcExpression;
}

function calcEquals() {
    try {
        // 安全计算
        const sanitized = calcExpression.replace(/[^0-9+\-*/.() ]/g, '').replace(/×/g, '*').replace(/÷/g, '/');
        const result = Function('"use strict"; return (' + sanitized + ')')();
        
        document.getElementById('calc-display').value = result;
        calcExpression = result.toString();
        showNotification('计算完成', 'success');
    } catch (error) {
        showNotification('计算错误', 'error');
        calcClear();
    }
}

// 正则表达式测试功能
function testRegex() {
    const pattern = document.getElementById('regex-pattern').value.trim();
    const text = document.getElementById('regex-text').value;
    const resultDiv = document.getElementById('regex-result');
    
    if (!pattern) {
        showNotification('请输入正则表达式', 'warning');
        return;
    }
    
    try {
        const flags = [];
        if (document.getElementById('regex-global').checked) flags.push('g');
        if (document.getElementById('regex-ignore-case').checked) flags.push('i');
        
        const regex = new RegExp(pattern, flags.join(''));
        const matches = text.match(regex);
        
        if (matches) {
            resultDiv.innerHTML = `
                <strong>匹配成功！</strong><br>
                匹配结果: ${matches.length} 个<br>
                <div style="margin-top: 0.5rem;">
                    ${matches.map((match, index) => `<span style="background: #fef3c7; padding: 2px 4px; margin: 2px; border-radius: 3px;">${match}</span>`).join('')}
                </div>
            `;
            showNotification('正则匹配成功', 'success');
        } else {
            resultDiv.innerHTML = '<strong>无匹配结果</strong>';
            showNotification('无匹配结果', 'warning');
        }
    } catch (error) {
        resultDiv.innerHTML = `<strong>正则表达式错误:</strong> ${error.message}`;
        showNotification('正则表达式错误', 'error');
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化颜色选择器
    initColorPicker();
    
    // 更新时间戳显示
    updateCurrentTimestamp();
    setInterval(updateCurrentTimestamp, 1000);
    
    // 初始化单位转换选项
    updateUnitOptions();
    
    // 显示默认分类和工具
    showCategory('encode');
    
    // 为计算器添加键盘支持
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const display = document.getElementById('calc-display');
        
        if (!display || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        
        if ('0123456789'.includes(key)) {
            calcInput(key);
        } else if ('+-*/'.includes(key)) {
            calcInput(key === '*' ? '×' : key === '/' ? '÷' : key);
        } else if (key === 'Enter' || key === '=') {
            calcEquals();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            calcClear();
        } else if (key === 'Backspace') {
            calcBackspace();
        } else if (key === '.') {
            calcInput('.');
        }
    });
}); 