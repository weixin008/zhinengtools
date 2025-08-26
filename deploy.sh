#!/bin/bash

# 知能工具站部署脚本
echo "🚀 开始部署知能工具站..."

# 检查Git状态
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改"
    read -p "是否继续部署? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 更新sitemap时间戳
echo "📅 更新sitemap时间戳..."
current_date=$(date -u +%Y-%m-%d)
sed -i.bak "s/<lastmod>.*<\/lastmod>/<lastmod>$current_date<\/lastmod>/g" sitemap.xml
rm -f sitemap.xml.bak

# 提交更改
echo "📝 提交更改..."
git add .
git commit -m "chore: 更新部署时间戳 - $(date)"

# 推送到GitHub
echo "⬆️  推送到GitHub..."
git push origin main

# 完成
echo "✅ 部署完成！"
echo "🌐 访问地址: https://zhineng-tech.ip-ddns.com"
echo "📊 GitHub Pages: https://weixin008.github.io/zhinengtools"

# 提示下一步
echo ""
echo "📋 下一步操作："
echo "1. 检查GitHub Pages是否部署成功"
echo "2. 配置Cloudflare CDN（如需要）"
echo "3. 申请广告联盟账号"
echo "4. 添加原创内容优化SEO" 