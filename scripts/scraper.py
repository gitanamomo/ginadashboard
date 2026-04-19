#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
深圳金融资讯爬虫 - 用于 GitHub Actions 自动化更新
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}
TIMEOUT = 30

def safe_request(url, max_retries=3):
    for i in range(max_retries):
        try:
            time.sleep(random.uniform(1, 2))
            resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding or 'utf-8'
            return resp
        except Exception as e:
            print(f"请求失败 ({i+1}/{max_retries}): {url}, 错误: {e}")
            time.sleep(3)
    return None

def scrape_sz_finance():
    print("正在爬取：深圳金融局...")
    url = 'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    for item in soup.select('.list li, .news-list li')[:10]:
        try:
            a = item.select_one('a')
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get('href', '')
            if not href.startswith('http'):
                href = 'https://jr.sz.gov.cn' + href
            date_span = item.select_one('.date, .time')
            date = date_span.get_text(strip=True) if date_span else ''
            if '金融' in title or '银行' in title:
                news.append({'title': title, 'link': href, 'date': date, 'source': '深圳金融局'})
        except:
            continue
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_sz_stats():
    print("正在爬取：深圳统计局...")
    url = 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    for item in soup.select('.list li')[:10]:
        try:
            a = item.select_one('a')
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get('href', '')
            if not href.startswith('http'):
                href = 'https://tjj.sz.gov.cn' + href
            date_span = item.select_one('.date')
            date = date_span.get_text(strip=True) if date_span else ''
            news.append({'title': title, 'link': href, 'date': date, 'source': '深圳统计局'})
        except:
            continue
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_safe():
    print("正在爬取：外管局深圳分局...")
    url = 'https://www.safe.gov.cn/shenzhen/'
    resp = safe_request(url)
    if not resp:
        return []
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    for item in soup.select('.list li, .con .list li')[:10]:
        try:
            a = item.select_one('a')
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get('href', '')
            if not href.startswith('http'):
                if href.startswith('./'):
                    href = 'https://www.safe.gov.cn/shenzhen/' + href[2:]
                else:
                    href = 'https://www.safe.gov.cn' + href
            date_span = item.select_one('.date')
            date = date_span.get_text(strip=True) if date_span else ''
            news.append({'title': title, 'link': href, 'date': date, 'source': '外管局深圳分局'})
        except:
            continue
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_pbc():
    print("正在爬取：人行深圳分行...")
    url = 'https://shenzhen.pbc.gov.cn/shenzhen/122807/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    for item in soup.select('.list li')[:10]:
        try:
            a = item.select_one('a')
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get('href', '')
            if not href.startswith('http'):
                href = 'https://shenzhen.pbc.gov.cn' + href
            date_span = item.select_one('.date')
            date = date_span.get_text(strip=True) if date_span else ''
            news.append({'title': title, 'link': href, 'date': date, 'source': '人行深圳分行'})
        except:
            continue
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_nfra():
    print("正在爬取：深圳金融监管局...")
    url = 'https://www.nfra.gov.cn/branch/shenzhen/view/pages/index/index.html'
    resp = safe_request(url)
    if not resp:
        return []
    soup = BeautifulSoup(resp.text, 'lxml')
    news = []
    for item in soup.select('.list li')[:10]:
        try:
            a = item.select_one('a')
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get('href', '')
            if not href.startswith('http'):
                href = 'https://www.nfra.gov.cn' + href
            date_span = item.select_one('.date')
            date = date_span.get_text(strip=True) if date_span else ''
            news.append({'title': title, 'link': href, 'date': date, 'source': '深圳金融监管局'})
        except:
            continue
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def main():
    print(f"========== 开始爬取 {datetime.now()} ==========")
    all_news = {
        'gov_policies': [],
        'reg_policies': [],
        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    all_news['gov_policies'].extend(scrape_sz_finance())
    all_news['gov_policies'].extend(scrape_sz_stats())
    all_news['reg_policies'].extend(scrape_safe())
    all_news['reg_policies'].extend(scrape_pbc())
    all_news['reg_policies'].extend(scrape_nfra())
    
    with open('scripts/data.json', 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)
    print(f"数据已保存，共政府政策 {len(all_news['gov_policies'])} 条，监管政策 {len(all_news['reg_policies'])} 条")

if __name__ == '__main__':
    main()
