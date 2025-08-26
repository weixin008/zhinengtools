// 播放器功能JavaScript文件

let currentPlayer = null;
let playHistory = [];

// 初始化播放器
function initPlayer() {
    const video = document.getElementById('video-player');
    if (!video) return;
    
    // 加载播放历史
    loadPlayHistory();
    
    // 监听播放器事件
    video.addEventListener('loadstart', () => {
        console.log('视频开始加载');
        showPlayerInfo('正在加载视频...');
    });
    
    video.addEventListener('loadedmetadata', () => {
        console.log('视频元数据加载完成');
        const duration = formatTime(video.duration);
        const size = `${video.videoWidth}x${video.videoHeight}`;
        showPlayerInfo(`视频信息：时长 ${duration}，分辨率 ${size}`);
    });
    
    video.addEventListener('canplay', () => {
        console.log('视频可以播放');
        showPlayerInfo('视频加载完成，可以播放');
    });
    
    video.addEventListener('play', () => {
        console.log('视频开始播放');
        trackUserBehavior('video_play', { 
            url: video.src,
            duration: video.duration 
        });
    });
    
    video.addEventListener('pause', () => {
        console.log('视频暂停');
        trackUserBehavior('video_pause', { 
            url: video.src,
            currentTime: video.currentTime 
        });
    });
    
    video.addEventListener('ended', () => {
        console.log('视频播放结束');
        trackUserBehavior('video_ended', { 
            url: video.src,
            duration: video.duration 
        });
    });
    
    video.addEventListener('error', (e) => {
        console.error('视频播放错误', e);
        showPlayerInfo('视频播放失败：' + getErrorMessage(video.error), 'error');
    });
    
    // 监听进度
    video.addEventListener('timeupdate', () => {
        // 每30秒记录一次播放进度
        if (Math.floor(video.currentTime) % 30 === 0) {
            trackUserBehavior('video_progress', {
                url: video.src,
                currentTime: video.currentTime,
                duration: video.duration,
                progress: (video.currentTime / video.duration * 100).toFixed(2)
            });
        }
    });
}

// 加载视频
function loadVideo() {
    const urlInput = document.getElementById('video-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('请输入视频链接', 'warning');
        return;
    }
    
    if (!isValidUrl(url)) {
        showNotification('请输入有效的视频链接', 'error');
        return;
    }
    
    const video = document.getElementById('video-player');
    
    // 清除之前的源
    clearVideoSources(video);
    
    // 检测视频格式并加载
    const format = detectVideoFormat(url);
    
    if (format === 'm3u8') {
        loadHLSVideo(video, url);
    } else {
        loadProgressiveVideo(video, url);
    }
    
    // 保存到播放历史
    addToHistory(url);
    
    showNotification('开始加载视频...', 'info');
}

// 检测视频格式
function detectVideoFormat(url) {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('.m3u8') || urlLower.includes('hls')) {
        return 'm3u8';
    } else if (urlLower.includes('.mp4')) {
        return 'mp4';
    } else if (urlLower.includes('.webm')) {
        return 'webm';
    } else if (urlLower.includes('.ogg')) {
        return 'ogg';
    } else {
        return 'unknown';
    }
}

// 加载HLS视频
function loadHLSVideo(video, url) {
    // 检查是否支持原生HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.load();
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        // 使用hls.js库
        if (currentPlayer) {
            currentPlayer.destroy();
        }
        
        currentPlayer = new Hls();
        currentPlayer.loadSource(url);
        currentPlayer.attachMedia(video);
        
        currentPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded');
            showPlayerInfo('HLS流加载成功');
        });
        
        currentPlayer.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error', data);
            if (data.fatal) {
                showPlayerInfo('HLS播放错误：' + data.details, 'error');
            }
        });
    } else {
        // 回退到直接播放
        video.src = url;
        video.load();
        showPlayerInfo('浏览器不支持HLS，尝试直接播放', 'warning');
    }
}

// 加载渐进式视频
function loadProgressiveVideo(video, url) {
    video.src = url;
    video.load();
}

// 清除视频源
function clearVideoSources(video) {
    video.pause();
    video.removeAttribute('src');
    
    // 清除source标签
    const sources = video.querySelectorAll('source');
    sources.forEach(source => source.remove());
    
    video.load();
}

// 清空播放器
function clearPlayer() {
    const video = document.getElementById('video-player');
    const urlInput = document.getElementById('video-url');
    
    clearVideoSources(video);
    urlInput.value = '';
    
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }
    
    hidePlayerInfo();
    showNotification('播放器已清空', 'info');
}

// 全屏切换
function toggleFullscreen() {
    const videoContainer = document.getElementById('video-container');
    
    if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// 快速加载测试源
function loadQuickSource(url) {
    document.getElementById('video-url').value = url;
    loadVideo();
}

// 显示播放器信息
function showPlayerInfo(message, type = 'info') {
    const playerInfo = document.getElementById('player-info');
    const videoInfo = document.getElementById('video-info');
    
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    videoInfo.innerHTML = `
        <div style="color: ${colors[type]}; margin-bottom: 0.5rem;">
            ${message}
        </div>
    `;
    
    playerInfo.style.display = 'block';
    
    // 自动隐藏成功和信息消息
    if (type === 'info' || type === 'success') {
        setTimeout(() => {
            if (playerInfo.style.display === 'block') {
                playerInfo.style.display = 'none';
            }
        }, 5000);
    }
}

// 隐藏播放器信息
function hidePlayerInfo() {
    const playerInfo = document.getElementById('player-info');
    playerInfo.style.display = 'none';
}

// 获取错误信息
function getErrorMessage(error) {
    if (!error) return '未知错误';
    
    const errorMessages = {
        1: '视频加载被中止',
        2: '网络错误导致视频下载失败',
        3: '视频解码失败',
        4: '视频格式不支持或视频源无效'
    };
    
    return errorMessages[error.code] || '播放错误 (代码: ' + error.code + ')';
}

// 格式化时间
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// 验证URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// 添加到播放历史
function addToHistory(url) {
    const now = new Date();
    const historyItem = {
        url: url,
        timestamp: now.toISOString(),
        formatTime: now.toLocaleString('zh-CN')
    };
    
    // 检查是否已存在
    const existingIndex = playHistory.findIndex(item => item.url === url);
    if (existingIndex !== -1) {
        playHistory.splice(existingIndex, 1);
    }
    
    // 添加到开头
    playHistory.unshift(historyItem);
    
    // 只保留最近20条记录
    if (playHistory.length > 20) {
        playHistory = playHistory.slice(0, 20);
    }
    
    // 保存到localStorage
    localStorage.setItem('videoPlayHistory', JSON.stringify(playHistory));
    
    // 更新显示
    updateHistoryDisplay();
}

// 加载播放历史
function loadPlayHistory() {
    try {
        const saved = localStorage.getItem('videoPlayHistory');
        if (saved) {
            playHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.error('加载播放历史失败', error);
        playHistory = [];
    }
    
    updateHistoryDisplay();
}

// 更新历史显示
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('play-history');
    
    if (playHistory.length === 0) {
        historyContainer.innerHTML = '<p style="color: #6b7280;">暂无播放记录</p>';
        return;
    }
    
    const historyHTML = playHistory.map(item => `
        <div class="play-history-item">
            <div class="url">${item.url}</div>
            <div class="time">${item.formatTime}</div>
            <button onclick="loadHistoryItem('${item.url}')" class="btn-tool">播放</button>
            <button onclick="removeHistoryItem('${item.url}')" class="btn-tool" style="background-color: #ef4444;">删除</button>
        </div>
    `).join('');
    
    historyContainer.innerHTML = historyHTML;
}

// 播放历史项目
function loadHistoryItem(url) {
    document.getElementById('video-url').value = url;
    loadVideo();
}

// 删除历史项目
function removeHistoryItem(url) {
    playHistory = playHistory.filter(item => item.url !== url);
    localStorage.setItem('videoPlayHistory', JSON.stringify(playHistory));
    updateHistoryDisplay();
    showNotification('已删除播放记录', 'success');
}

// 清空播放历史
function clearHistory() {
    if (playHistory.length === 0) {
        showNotification('播放历史已为空', 'info');
        return;
    }
    
    if (confirm('确定要清空所有播放历史吗？')) {
        playHistory = [];
        localStorage.removeItem('videoPlayHistory');
        updateHistoryDisplay();
        showNotification('播放历史已清空', 'success');
    }
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    const video = document.getElementById('video-player');
    if (!video || document.activeElement.tagName === 'INPUT') return;
    
    switch (e.key) {
        case ' ':
            e.preventDefault();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 10);
            break;
        case 'ArrowRight':
            e.preventDefault();
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
            break;
        case 'ArrowUp':
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.1);
            break;
        case 'm':
        case 'M':
            e.preventDefault();
            video.muted = !video.muted;
            break;
    }
});

// 画中画功能
function togglePictureInPicture() {
    const video = document.getElementById('video-player');
    
    if (!document.pictureInPictureEnabled) {
        showNotification('浏览器不支持画中画功能', 'warning');
        return;
    }
    
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture().catch(error => {
            showNotification('画中画启动失败：' + error.message, 'error');
        });
    }
}

// 截图功能
function captureFrame() {
    const video = document.getElementById('video-player');
    
    if (video.videoWidth === 0) {
        showNotification('请先加载视频', 'warning');
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-frame-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('截图已保存', 'success');
    });
}

// 导出播放历史
function exportHistory() {
    if (playHistory.length === 0) {
        showNotification('没有播放历史可导出', 'info');
        return;
    }
    
    const data = JSON.stringify(playHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('播放历史已导出', 'success');
}

// 导入播放历史
function importHistory(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedHistory = JSON.parse(e.target.result);
            if (Array.isArray(importedHistory)) {
                playHistory = importedHistory.slice(0, 20); // 只保留前20条
                localStorage.setItem('videoPlayHistory', JSON.stringify(playHistory));
                updateHistoryDisplay();
                showNotification('播放历史导入成功', 'success');
            } else {
                showNotification('文件格式错误', 'error');
            }
        } catch (error) {
            showNotification('文件解析失败', 'error');
        }
    };
    reader.readAsText(file);
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (currentPlayer) {
        currentPlayer.destroy();
    }
}); 