# 🚀 快速开始指南

本指南将帮你在5分钟内完成知能工具站的部署！

## 📋 准备工作

- ✅ GitHub账号
- ✅ 基本的Git操作知识
- ✅ 域名（可选，可以先用GitHub提供的域名）

## 🎯 第一步：获取代码

### 方式一：直接下载
1. 点击页面上的 "Code" → "Download ZIP"
2. 解压到本地文件夹

### 方式二：Git克隆
```bash
git clone https://github.com/weixin008/zhinengtools.git
cd zhinengtools
```

## 🎯 第二步：上传到GitHub

### 如果是新仓库：
```bash
# 初始化Git仓库
git init
git add .
git commit -m "Initial commit: 知能工具站"

# 创建GitHub仓库后，连接并推送
git remote add origin https://github.com/weixin008/zhinengtools.git
git branch -M main
git push -u origin main
```

### 如果是Fork的仓库：
代码已经在你的GitHub账号下，跳过此步骤。

## 🎯 第三步：启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 **Settings** 选项卡
3. 滚动到 **Pages** 部分
4. **Source** 选择：`Deploy from a branch`
5. **Branch** 选择：`main`
6. **Folder** 选择：`/ (root)`
7. 点击 **Save**

等待1-2分钟，你的网站就可以通过以下地址访问：
`https://weixin008.github.io/zhinengtools`

## 🎯 第四步：配置自定义域名（可选）

### 如果你有域名：

1. 在GitHub Pages设置中，**Custom domain** 填入你的域名
2. 勾选 **Enforce HTTPS**
3. 在你的域名服务商处设置CNAME记录：
   ```
   类型: CNAME
   名称: www (或其他子域名)
   值: weixin008.github.io
   ```

### 使用No-IP动态域名：
在No-IP控制台设置：
```
类型: CNAME
主机名: zhineng-tech
目标: weixin008.github.io
```

## 🎯 第五步：添加Cloudflare CDN（推荐）

1. 注册Cloudflare账号
2. 添加你的域名
3. 按提示修改域名服务器
4. 在DNS设置中确保CNAME记录正确
5. 开启代理模式（橙色云朵）

## 🎯 第六步：自定义配置

### 修改网站信息：
编辑以下文件中的个人信息：
- `index.html` - 首页标题和描述
- `about.html` - 关于页面
- 所有页面的footer部分

### 更新联系方式：
将以下信息替换为你的：
- 邮箱：l250061120@gmail.com → 你的邮箱
- QQ群：728132798 → 你的QQ群

### 配置广告（获得广告代码后）：
编辑 `assets/js/ad-manager.js`：
```javascript
adsense: {
    enabled: true,
    publisherId: 'ca-pub-你的发布商ID',
    // ...
}
```

## 🎯 第七步：申请广告联盟

### Google AdSense：
1. 访问 https://www.google.com/adsense/
2. 添加你的网站
3. 等待审核（1-14天）

### PopCash：
1. 访问 https://www.popcash.net/
2. 注册并添加网站
3. 获得代码（通常秒通过）

## 📊 验证部署

### 检查清单：
- [ ] 网站可以正常访问
- [ ] 所有工具功能正常
- [ ] 移动端显示正确
- [ ] 页面加载速度 < 3秒
- [ ] SEO信息正确显示

### 测试工具：
- [Google PageSpeed](https://pagespeed.web.dev/) - 性能测试
- [17CE](https://www.17ce.com/) - 中国访问速度测试
- [GTmetrix](https://gtmetrix.com/) - 综合性能测试

## 🔧 日常维护

### 内容更新：
```bash
# 添加新文章或功能
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

### 定期任务：
- 每周添加1-2篇原创文章
- 每月检查工具功能
- 季度性能优化
- 监控广告收益

## 🆘 常见问题

### Q: GitHub Pages没有更新？
A: 等待5-10分钟，或者检查Actions是否有错误

### Q: 域名无法访问？
A: 检查DNS设置，等待DNS传播（最多24小时）

### Q: 某个工具不工作？
A: 检查浏览器控制台错误，确保CDN资源可以访问

### Q: 如何添加新工具？
A: 参考现有工具的代码结构，在`tools.html`和`tools.js`中添加

## 📞 获得帮助

- 📧 邮箱：l250061120@gmail.com
- 💬 QQ群：728132798
- 🐛 GitHub Issues：报告问题和建议

---

🎉 **恭喜！你的知能工具站已经成功部署！**

下一步建议：
1. 添加原创内容提升SEO
2. 申请广告联盟开始赚钱
3. 监控网站数据和用户反馈
4. 持续优化用户体验 