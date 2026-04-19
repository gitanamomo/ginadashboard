import random
import time

# 每次请求前随机休眠 1~3 秒
def safe_request(url, max_retries=3):
    for i in range(max_retries):
        try:
            time.sleep(random.uniform(1, 3))  # 新增延时
            resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding or 'utf-8'
            return resp
        except Exception as e:
            print(f"请求失败 ({i+1}/{max_retries}): {url}, 错误: {e}")
            time.sleep(5)  # 失败后等待更久
    return None#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
深圳金融资讯爬虫 - 用于 GitHub Actions 自动化更新
抓取：深圳金融局、统计局、外管局深圳分局、人行深圳分行、深圳金融监管局
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import time
from datetime import datetime
import os

# 配置
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}
TIMEOUT = 30
DATA_FILE = 'scripts/data.json'

# ========== 辅助函数 ==========
def safe_request(url, max_retries=3):
    """安全请求，带重试"""
    for i in range(max_retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding or 'utf-8'
            return resp
        except Exception as e:
            print(f"请求失败 ({i+1}/{max_retries}): {url}, 错误: {e}")
            time.sleep(2)
    return None

def extract_news_from_list(soup, base_url, source_name, selector_patterns):
    """通用的新闻列表提取函数"""
    news_list = []
    for pattern in selector_patterns:
        items = soup.select(pattern['item'])
        if items:
            for item in items[:15]:  # 最多取15条
                try:
                    title_elem = item.select_one(pattern['title']) if pattern.get('title') else item
                    link_elem = item.select_one(pattern['link']) if pattern.get('link') else item
                    date_elem = item.select_one(pattern['date']) if pattern.get('date') else None
                    
                    title = title_elem.get_text(strip=True) if title_elem else ''
                    link = link_elem.get('href', '') if link_elem else ''
                    date = date_elem.get_text(strip=True) if date_elem else ''
                    
                    # 补全链接
                    if link and not link.startswith('http'):
                        if link.startswith('/'):
                            link = base_url.rstrip('/') + link
                        else:
                            link = base_url.rstrip('/') + '/' + link
                    
                    # 简单过滤：标题包含金融/银行/外资等关键词
                    keywords = ['金融', '银行', '外资', '跨境', '资金池', '外汇', '贷款', '存款', 
                                '理财', '资本', '监管', '保险', '证券', '科技金融', '绿色金融']
                    if any(kw in title for kw in keywords) or source_name in ['外管局', '人行', '金融监管局']:
                        if title and link:
                            news_list.append({
                                'title': title,
                                'link': link,
                                'date': date,
                                'source': source_name
                            })
                except Exception as e:
                    print(f"解析单条新闻失败: {e}")
                    continue
            break  # 如果当前pattern匹配成功，不再尝试其他pattern
    return news_list

# ========== 各官网爬取函数 ==========

def scrape_sz_finance():
    """爬取深圳市地方金融管理局（原金融局）"""
    print("正在爬取：深圳金融局...")
    url = 'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    
    # 查找政策列表
    list_items = soup.select('.list li, .news-list li, .list-item, .article-list li, .list-content a')
    for item in list_items[:15]:
        try:
            link = item.select_one('a')
            if not link:
                continue
            title = link.get_text(strip=True)
            href = link.get('href', '')
            if not title or not href:
                continue
            
            # 补全链接
            if not href.startswith('http'):
                href = 'https://jr.sz.gov.cn' + href if href.startswith('/') else 'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/' + href
            
            # 查找日期
            date_span = item.select_one('.date, .time, span[class*="date"], span[class*="time"]')
            date = date_span.get_text(strip=True) if date_span else ''
            
            keywords = ['金融', '银行', '外资', '跨境', '资金', '贷款', '融资', '保险', '证券']
            if any(kw in title for kw in keywords):
                news.append({
                    'title': title,
                    'link': href,
                    'date': date,
                    'source': '深圳金融局'
                })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:10]

def scrape_sz_stats():
    """爬取深圳市统计局"""
    print("正在爬取：深圳统计局...")
    url = 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    
    list_items = soup.select('.list li, .news-list li, .list-item, .article-list li, ul li a')
    for item in list_items[:15]:
        try:
            link = item if item.name == 'a' else item.select_one('a')
            if not link:
                continue
            title = link.get_text(strip=True)
            href = link.get('href', '') if link.name == 'a' else link.select_one('a').get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                href = 'https://tjj.sz.gov.cn' + href if href.startswith('/') else 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/' + href
            
            date_span = item.select_one('.date, .time') if item.name != 'a' else None
            date = date_span.get_text(strip=True) if date_span else ''
            
            keywords = ['金融', '银行', '存款', '贷款', '经济', 'GDP']
            if any(kw in title for kw in keywords):
                news.append({
                    'title': title,
                    'link': href,
                    'date': date,
                    'source': '深圳统计局'
                })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:10]

def scrape_safe():
    """爬取国家外汇管理局深圳市分局"""
    print("正在爬取：外管局深圳分局...")
    url = 'https://www.safe.gov.cn/shenzhen/'
    resp = safe_request(url)
    if not resp:
        return []
    
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    
    # 外管局网站结构：.list li 或 .main .list a
    list_items = soup.select('.list li, .list-content li, .news-list li, .main .list a, .con .list li')
    for item in list_items[:15]:
        try:
            link = item.select_one('a')
            if not link:
                if item.name == 'a':
                    link = item
                else:
                    continue
            title = link.get_text(strip=True)
            href = link.get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                if href.startswith('./'):
                    href = 'https://www.safe.gov.cn/shenzhen/' + href[2:]
                elif href.startswith('/'):
                    href = 'https://www.safe.gov.cn' + href
                else:
                    href = 'https://www.safe.gov.cn/shenzhen/' + href
            
            date_span = item.select_one('.date, .time')
            date = date_span.get_text(strip=True) if date_span else ''
            
            news.append({
                'title': title,
                'link': href,
                'date': date,
                'source': '外管局深圳分局'
            })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:10]

def scrape_pbc():
    """爬取中国人民银行深圳市分行"""
    print("正在爬取：人行深圳分行...")
    url = 'https://shenzhen.pbc.gov.cn/shenzhen/122807/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    
    list_items = soup.select('.list li, .news-list li, .list-item, .main .list a')
    for item in list_items[:15]:
        try:
            link = item.select_one('a')
            if not link:
                if item.name == 'a':
                    link = item
                else:
                    continue
            title = link.get_text(strip=True)
            href = link.get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                if href.startswith('../../'):
                    href = 'https://shenzhen.pbc.gov.cn/shenzhen/122807/' + href.replace('../../', '').replace('./', '')
                elif href.startswith('/'):
                    href = 'https://shenzhen.pbc.gov.cn' + href
                else:
                    href = 'https://shenzhen.pbc.gov.cn/shenzhen/122807/' + href
            
            date_span = item.select_one('.date, .time')
            date = date_span.get_text(strip=True) if date_span else ''
            
            news.append({
                'title': title,
                'link': href,
                'date': date,
                'source': '人行深圳分行'
            })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:10]

def scrape_nfra():
    """爬取国家金融监督管理总局深圳监管局"""
    print("正在爬取：深圳金融监管局...")
    url = 'https://www.nfra.gov.cn/branch/shenzhen/view/pages/index/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    
    # 金融监管局网站可能使用动态加载，尝试多种选择器
    list_items = soup.select('.list li, .news-list li, .list-item, .index-list li, a[href*="content"]')
    for item in list_items[:15]:
        try:
            link = item.select_one('a')
            if not link:
                if item.name == 'a':
                    link = item
                else:
                    continue
            title = link.get_text(strip=True)
            href = link.get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                href = 'https://www.nfra.gov.cn' + href if href.startswith('/') else 'https://www.nfra.gov.cn/branch/shenzhen/view/pages/index/' + href
            
            date_span = item.select_one('.date, .time')
            date = date_span.get_text(strip=True) if date_span else ''
            
            news.append({
                'title': title,
                'link': href,
                'date': date,
                'source': '深圳金融监管局'
            })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:10]

# ========== 主函数 ==========
def main():
    print(f"========== 开始爬取，时间：{datetime.now()} ==========")
    
    all_news = {
        'gov_policies': [],      # 政府政策（金融局+统计局）
        'reg_policies': [],      # 监管政策（外管局+人行+金融监管局）
        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # 政府政策模块
    all_news['gov_policies'].extend(scrape_sz_finance())
    all_news['gov_policies'].extend(scrape_sz_stats())
    
    # 监管政策模块
    all_news['reg_policies'].extend(scrape_safe())
    all_news['reg_policies'].extend(scrape_pbc())
    all_news['reg_policies'].extend(scrape_nfra())
    
    # 去重（按标题）
    seen = set()
    for category in ['gov_policies', 'reg_policies']:
        unique = []
        for item in all_news[category]:
            if item['title'] not in seen:
                seen.add(item['title'])
                unique.append(item)
        all_news[category] = unique[:10]  # 每类最多10条
    
    # 保存到 JSON 文件
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)
    
    print(f"\n========== 爬取完成 ==========")
    print(f"政府政策: {len(all_news['gov_policies'])} 条")
    print(f"监管政策: {len(all_news['reg_policies'])} 条")
    print(f"数据已保存到 {DATA_FILE}")

if __name__ == '__main__':
    main()
