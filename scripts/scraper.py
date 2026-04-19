import json
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import time
import random
import urllib3

# 禁用 SSL 警告，保持日志整洁
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 模拟真实浏览器的请求头
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0'
}

def safe_request(url, max_retries=2):
    """带有重试和随机延时的请求函数"""
    for i in range(max_retries):
        try:
            # 关键修改：verify=False 绕过 SSL 证书验证，timeout 避免长时间阻塞
            response = requests.get(
                url, 
                headers=HEADERS, 
                verify=False, 
                timeout=20,
                allow_redirects=True
            )
            response.raise_for_status()
            # 手动设置编码，解决中文乱码
            if response.encoding == 'ISO-8859-1':
                response.encoding = response.apparent_encoding if response.apparent_encoding else 'utf-8'
            return response
        except requests.exceptions.SSLError as e:
            print(f"SSL错误 ({i+1}/{max_retries}): {url}, 错误: {e}")
            time.sleep(random.uniform(2, 4))
        except requests.exceptions.RequestException as e:
            print(f"请求失败 ({i+1}/{max_retries}): {url}, 错误: {e}")
            if i < max_retries - 1:
                time.sleep(random.uniform(3, 6))
    return None

def scrape_sz_finance():
    print("正在爬取：深圳金融局...")
    # 尝试不同的 URL
    urls = [
        'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/index.html',
        'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/'
    ]
    for url in urls:
        resp = safe_request(url)
        if resp:
            break
    if not resp: 
        print("  无法访问深圳金融局网站")
        return []
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    news = []
    
    # 尝试多种可能的选择器
    for selector in ['.list li', '.news-list li', '.list-item', 'ul.list li', '.article-list li']:
        items = soup.select(selector)
        if items:
            break
    
    for item in items[:8]:
        try:
            a_tag = item.select_one('a')
            if not a_tag:
                continue
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
            if not title or not href:
                continue
            
            # 补全链接
            if not href.startswith('http'):
                if href.startswith('/'):
                    href = 'https://jr.sz.gov.cn' + href
                elif href.startswith('./'):
                    href = 'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/' + href[2:]
                else:
                    href = 'https://jr.sz.gov.cn/sjrb/zwgk/zcfg/' + href
            
            # 查找日期
            date_span = item.select_one('.date, .time, .publish-time')
            date = date_span.get_text(strip=True) if date_span else ''
            
            news.append({
                'title': title,
                'link': href,
                'date': date,
                'source': '深圳金融局'
            })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_sz_stats():
    print("正在爬取：深圳统计局...")
    urls = [
        'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/index.html',
        'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/'
    ]
    for url in urls:
        resp = safe_request(url)
        if resp:
            break
    if not resp:
        print("  无法访问深圳统计局网站")
        return []
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    news = []
    
    for selector in ['.list li', '.news-list li', '.list-item', 'ul.list li']:
        items = soup.select(selector)
        if items:
            break
    
    for item in items[:8]:
        try:
            a_tag = item.select_one('a')
            if not a_tag:
                continue
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                if href.startswith('/'):
                    href = 'https://tjj.sz.gov.cn' + href
                elif href.startswith('./'):
                    href = 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/' + href[2:]
                else:
                    href = 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/' + href
            
            date_span = item.select_one('.date, .time')
            date = date_span.get_text(strip=True) if date_span else ''
            
            news.append({
                'title': title,
                'link': href,
                'date': date,
                'source': '深圳统计局'
            })
        except Exception as e:
            continue
    
    print(f"  获取到 {len(news)} 条")
    return news[:5]

def scrape_safe():
    print("正在爬取：外管局深圳分局...")
    url = 'https://www.safe.gov.cn/shenzhen/'
    resp = safe_request(url)
    if not resp:
        print("  无法访问外管局网站")
        return []
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    news = []
    
    for selector in ['.list li', '.list-item', '.con .list li', '.main .list a']:
        items = soup.select(selector)
        if items:
            break
    
    for item in items[:8]:
        try:
            a_tag = item.select_one('a')
            if not a_tag:
                if item.name == 'a':
                    a_tag = item
                else:
                    continue
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
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
    return news[:5]

def scrape_pbc():
    print("正在爬取：人行深圳分行...")
    url = 'https://shenzhen.pbc.gov.cn/shenzhen/122807/index.html'
    resp = safe_request(url)
    if not resp:
        print("  无法访问人行深圳分行网站")
        return []
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    news = []
    
    for selector in ['.list li', '.news-list li', '.list-item']:
        items = soup.select(selector)
        if items:
            break
    
    for item in items[:8]:
        try:
            a_tag = item.select_one('a')
            if not a_tag:
                continue
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
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
    return news[:5]

def scrape_nfra():
    print("正在爬取：深圳金融监管局...")
    url = 'https://www.nfra.gov.cn/branch/shenzhen/view/pages/index/index.html'
    resp = safe_request(url)
    if not resp:
        print("  无法访问深圳金融监管局网站")
        return []
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    news = []
    
    for selector in ['.list li', '.news-list li', '.list-item', '.index-list li']:
        items = soup.select(selector)
        if items:
            break
    
    for item in items[:8]:
        try:
            a_tag = item.select_one('a')
            if not a_tag:
                continue
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
            if not title or not href:
                continue
            
            if not href.startswith('http'):
                href = 'https://www.nfra.gov.cn' + href
            
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
    return news[:5]

def main():
    print(f"========== 开始爬取 {datetime.now()} ==========")
    all_news = {
        'gov_policies': [],
        'reg_policies': [],
        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # 爬取政府政策
    all_news['gov_policies'].extend(scrape_sz_finance())
    all_news['gov_policies'].extend(scrape_sz_stats())
    
    # 爬取监管政策
    all_news['reg_policies'].extend(scrape_safe())
    all_news['reg_policies'].extend(scrape_pbc())
    all_news['reg_policies'].extend(scrape_nfra())
    
    # 保存数据
    with open('scripts/data.json', 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)
    
    print(f"数据已保存，共政府政策 {len(all_news['gov_policies'])} 条，监管政策 {len(all_news['reg_policies'])} 条")

if __name__ == '__main__':
    main()
