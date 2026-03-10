#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenClaw 资讯抓取脚本
每天自动收集 OpenClaw 相关资讯并更新到网站
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# 项目目录
SCRIPT_DIR = Path(__file__).parent
SITE_DIR = SCRIPT_DIR.parent
DATA_DIR = SITE_DIR / 'data'

# 确保数据目录存在
DATA_DIR.mkdir(exist_ok=True)

# OpenClaw 官方信息源
OPENCLAW_SOURCES = {
    'github': {
        'name': 'GitHub',
        'url': 'https://github.com/openclaw/openclaw',
        'releases_url': 'https://api.github.com/repos/openclaw/openclaw/releases',
        'commits_url': 'https://api.github.com/repos/openclaw/openclaw/commits'
    },
    'docs': {
        'name': '官方文档',
        'url': 'https://docs.openclaw.ai'
    },
    'discord': {
        'name': 'Discord 社区',
        'url': 'https://discord.com/invite/clawd'
    },
    'clawhub': {
        'name': 'ClawHub 技能市场',
        'url': 'https://clawhub.com'
    }
}


def fetch_github_releases():
    """获取 GitHub Releases 信息"""
    import urllib.request
    import ssl
    
    news_items = []
    
    try:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            OPENCLAW_SOURCES['github']['releases_url'],
            headers={'User-Agent': 'OpenClaw-News-Bot/1.0'}
        )
        
        with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
            releases = json.loads(response.read().decode('utf-8'))
            
            for release in releases[:5]:
                published_at = release.get('published_at', '')
                try:
                    # 解析 ISO 8601 日期
                    if published_at.endswith('Z'):
                        published_at = published_at[:-1] + '+00:00'
                    date_obj = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                    timestamp = int(date_obj.timestamp() * 1000)
                except:
                    timestamp = int(datetime.now().timestamp() * 1000)
                
                news_items.append({
                    'title': release.get('name', release.get('tag_name', 'New Release')),
                    'url': release.get('html_url', OPENCLAW_SOURCES['github']['url']),
                    'summary': (release.get('body', '新版本发布')[:300] or '新版本发布'),
                    'source': OPENCLAW_SOURCES['github']['name'],
                    'date': timestamp
                })
    except Exception as e:
        print(f"⚠️  获取 GitHub Releases 失败：{e}", file=sys.stderr)
    
    return news_items


def fetch_github_commits():
    """获取最近的 commits 作为更新动态"""
    import urllib.request
    import ssl
    
    news_items = []
    
    try:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            OPENCLAW_SOURCES['github']['commits_url'],
            headers={'User-Agent': 'OpenClaw-News-Bot/1.0'}
        )
        
        with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
            commits = json.loads(response.read().decode('utf-8'))
            
            for commit in commits[:3]:
                commit_info = commit.get('commit', {})
                author = commit_info.get('author', {})
                
                news_items.append({
                    'title': commit_info.get('message', 'Code Update')[:60],
                    'url': commit.get('html_url', OPENCLAW_SOURCES['github']['url']),
                    'summary': f"Author: {author.get('name', 'Unknown')}",
                    'source': 'GitHub Commits',
                    'date': int(datetime.now().timestamp() * 1000)
                })
    except Exception as e:
        print(f"⚠️  获取 GitHub Commits 失败：{e}", file=sys.stderr)
    
    return news_items


def generate_static_news():
    """生成静态资讯条目（作为补充）"""
    now = int(datetime.now().timestamp() * 1000)
    
    return [
        {
            'title': 'OpenClaw 官方文档',
            'url': OPENCLAW_SOURCES['docs']['url'],
            'summary': '查看 OpenClaw 完整文档，包括安装指南、工具使用、技能开发、配置说明等完整教程。',
            'source': OPENCLAW_SOURCES['docs']['name'],
            'date': now
        },
        {
            'title': 'Discord 开发者社区',
            'url': OPENCLAW_SOURCES['discord']['url'],
            'summary': '加入 OpenClaw Discord 社区，与其他开发者和用户交流经验、获取支持、分享技能。',
            'source': OPENCLAW_SOURCES['discord']['name'],
            'date': now
        },
        {
            'title': 'ClawHub 技能市场',
            'url': OPENCLAW_SOURCES['clawhub']['url'],
            'summary': '浏览和安装各种 Agent Skills，扩展你的 OpenClaw 助手能力。发现社区开发的实用技能。',
            'source': OPENCLAW_SOURCES['clawhub']['name'],
            'date': now
        }
    ]


def load_existing_news():
    """加载现有的新闻数据"""
    news_file = DATA_DIR / 'news.json'
    if news_file.exists():
        try:
            with open(news_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {'news': [], 'lastUpdate': 0}


def save_news_data(news_data):
    """保存新闻数据"""
    news_file = DATA_DIR / 'news.json'
    with open(news_file, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    print(f"✅ 新闻数据已保存到：{news_file}")


def main():
    """主函数"""
    print("=" * 60)
    print("🦞 OpenClaw 资讯抓取脚本")
    print(f"运行时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # 收集新闻
    all_news = []
    
    print("\n📌 获取 GitHub Releases...")
    github_releases = fetch_github_releases()
    all_news.extend(github_releases)
    print(f"  ✓ 获取到 {len(github_releases)} 条 Releases")
    
    print("\n📌 获取 GitHub Commits...")
    github_commits = fetch_github_commits()
    all_news.extend(github_commits)
    print(f"  ✓ 获取到 {len(github_commits)} 条 Commits")
    
    print("\n📌 添加官方资源...")
    static_news = generate_static_news()
    all_news.extend(static_news)
    print(f"  ✓ 添加 {len(static_news)} 条官方资源")
    
    # 去重（按 URL）
    seen_urls = set()
    unique_news = []
    for item in all_news:
        if item['url'] not in seen_urls:
            seen_urls.add(item['url'])
            unique_news.append(item)
    
    # 按日期排序（最新的在前）
    unique_news.sort(key=lambda x: x.get('date', 0), reverse=True)
    
    # 只保留最新的 15 条
    unique_news = unique_news[:15]
    
    # 构建最终数据
    news_data = {
        'news': unique_news,
        'lastUpdate': int(datetime.now().timestamp() * 1000),
        'sources': list(OPENCLAW_SOURCES.keys())
    }
    
    # 保存数据
    save_news_data(news_data)
    
    print("\n" + "=" * 60)
    print(f"✅ 完成！共收集 {len(unique_news)} 条资讯")
    print("=" * 60)
    
    # 打印摘要
    print("\n📰 最新资讯摘要:")
    for i, item in enumerate(unique_news[:5], 1):
        print(f"  {i}. {item['title']} [{item['source']}]")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
