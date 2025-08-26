# 知能工具站 🛠️

> 一个现代化的在线工具集合平台，提供各种免费实用工具

🌐 **在线访问**: [https://zhineng-tech.ip-ddns.com](https://zhineng-tech.ip-ddns.com)
📂 **GitHub仓库**: [https://github.com/weixin008/zhinengtools](https://github.com/weixin008/zhinengtools)

## ✨ 功能特色

### 🔧 在线工具
- **QR码生成器** - 支持多种格式，可自定义大小
- **Base64编解码** - 文本与Base64互转
- **JSON格式化** - 格式化、压缩、验证JSON
- **密码生成器** - 生成安全随机密码
- **颜色选择器** - HEX、RGB、HSL、CMYK转换
- **URL编解码** - URL编码解码工具
- **文本处理** - 大小写转换、去重、统计
- **在线计算器** - 基础数学计算

### 📺 M3U8播放器
- **HLS视频播放** - 支持直播和点播
- **多格式兼容** - M3U8、MP4等格式
- **播放历史** - 自动保存播放记录
- **快捷键支持** - 键盘控制播放
- **全屏播放** - 沉浸式观看体验

### 📚 技术文章
- **工具教程** - 详细使用指南
- **技术分享** - 开发经验和技巧
- **最佳实践** - 前端开发规范

## 🚀 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **UI框架**: 原生CSS，响应式设计
- **工具库**: QRCode.js, HLS.js
- **部署**: GitHub Pages + Cloudflare CDN
- **SEO**: 完整的搜索引擎优化

## 📁 项目结构

```
知能工具站/
├── index.html              # 首页
├── tools.html              # 工具集合页
├── player.html             # 视频播放器页
├── articles.html           # 技术文章页
├── about.html              # 关于页面
├── assets/                 # 资源文件
│   ├── css/
│   │   └── style.css       # 主样式文件
│   ├── js/
│   │   ├── main.js         # 核心功能
│   │   ├── tools.js        # 工具逻辑
│   │   ├── player.js       # 播放器逻辑
│   │   ├── security.js     # 安全防护
│   │   └── ad-manager.js   # 广告管理
│   └── images/
│       └── logo-design.svg # 网站Logo
├── robots.txt              # 搜索引擎爬虫规则
├── sitemap.xml             # 网站地图
└── vercel.json            # Vercel部署配置
```

## 🛠️ 本地开发

### 快速开始

```bash
# 克隆项目
git clone https://github.com/weixin008/zhinengtools.git
cd zhinengtools

# 启动本地服务器
# 方式一：使用Python
python -m http.server 8000

# 方式二：使用Node.js
npx serve .

# 方式三：使用PHP
php -S localhost:8000
```

### 访问地址
- 本地访问：http://localhost:8000
- GitHub Pages：https://weixin008.github.io/zhinengtools

## 🌐 部署说明

### GitHub Pages部署
1. Fork本仓库或上传代码到你的GitHub仓库
2. 进入仓库Settings → Pages
3. Source选择：Deploy from a branch
4. Branch选择：main，文件夹选择：/ (root)
5. 保存设置，等待部署完成

### Cloudflare CDN配置
1. 注册Cloudflare账号
2. 添加你的域名
3. 设置DNS解析指向GitHub Pages
4. 开启CDN代理（橙色云朵）
5. 配置SSL和性能优化

## 🔧 自定义配置

### 修改网站信息
编辑各HTML文件中的：
- 网站标题和描述
- 联系邮箱和QQ群
- 友情链接

### 广告配置
在 `assets/js/ad-manager.js` 中配置：
```javascript
// Google AdSense配置
adsense: {
    enabled: true,
    publisherId: 'ca-pub-你的发布商ID',
    slots: {
        banner: '广告位ID',
        sidebar: '广告位ID'
    }
}
```

### SEO优化
- 更新 `sitemap.xml` 中的URL和时间戳
- 修改各页面的Meta标签
- 添加原创内容到 `articles.html`

## 📊 性能特色

- ⚡ **极速加载** - 优化的资源加载策略
- 📱 **移动友好** - 完美适配各种设备
- 🌏 **全球CDN** - Cloudflare加速
- 🔒 **安全防护** - 多层安全机制
- 🎯 **SEO优化** - 搜索引擎友好

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 贡献流程
1. Fork本仓库：https://github.com/weixin008/zhinengtools
2. 创建功能分支：`git checkout -b feature/新功能`
3. 提交更改：`git commit -m '添加新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 提交Pull Request

### 开发规范
- 保持代码简洁易读
- 添加必要的注释
- 确保响应式设计
- 测试所有功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **邮箱**: l250061120@gmail.com
- **QQ群**: 728132798
- **网站**: https://zhineng-tech.ip-ddns.com

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个Star！

[![Star History Chart](https://api.star-history.com/svg?repos=weixin008/zhinengtools&type=Date)](https://star-history.com/#weixin008/zhinengtools&Date)

---

⭐ **如果觉得有用，请点个Star支持一下！** ⭐ 