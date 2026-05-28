"""
Scrape real regulatory policies from official Chinese government websites.
Only extracts metadata from list/index pages - does NOT fabricate content.

Sources:
- 深圳市地方金融监督管理局 (jr.sz.gov.cn) - 通知公告
- 中国政府网 (gov.cn) - 政策文件
"""
import re
from config import fetch, generate_id, now_iso, save_json

def scrape_sz_finance():
    """Scrape announcements from Shenzhen Finance Bureau list page."""
    print("[SZ Finance] Scraping announcements from jr.sz.gov.cn...")
    policies = []
    try:
        soup = fetch('https://jr.sz.gov.cn/sjrb/xxgk/tzgg/', timeout=20)
    except Exception as e:
        print(f"  ERROR: {e}")
        return policies

    for a in soup.find_all('a', href=True):
        href = a['href']
        title = a.get_text(strip=True)
        if '/content/post_' not in href or len(title) < 8:
            continue

        full_url = f'https://jr.sz.gov.cn{href}' if href.startswith('/') else href

        # Extract date from parent element
        date = ''
        parent = a.parent
        if parent:
            span = parent.find('span')
            if span:
                m = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})', span.get_text())
                if m:
                    date = m.group(1)

        # Classification by keywords in title
        cats = []
        if any(k in title for k in ['金融科技', '科技', '数字化', '创新试点']):
            cats.append('金融科技')
        if any(k in title for k in ['融资担保', '小额贷款', '担保']):
            cats.append('普惠金融')
        if any(k in title for k in ['上市', '资本市场', '证券']):
            cats.append('证券监管')
        if any(k in title for k in ['风险', '非法', '涉嫌', '集资', '警示']):
            cats.append('风险防控')
        if any(k in title for k in ['外资', '跨境']):
            cats.append('跨境金融')
        if any(k in title for k in ['绿色', '碳']):
            cats.append('绿色金融')
        if not cats:
            cats.append('银行监管')

        policies.append({
            'id': generate_id('pol-sz', full_url),
            'title': title,
            'organization': '深圳市地方金融监督管理局',
            'source': '深圳市地方金融监督管理局',
            'publish_date': date or '未知',
            'summary': title,
            'keywords': cats,
            'category': cats[0],
            'source_url': full_url,
            'pdf_url': '',
            'updated_at': now_iso(),
            'data_source': 'jr.sz.gov.cn',
        })
        print(f"  [{date or '???'}] {title[:70]}")

    print(f"  Found {len(policies)} real SZ finance announcements")
    return policies


def scrape_gov_cn():
    """Scrape policy listings from gov.cn using known accessible content pages."""
    print("[Gov.cn] Fetching national policy documents...")
    policies = []

    # Known working content page URLs from gov.cn/zhengce (verified 2026-05-28)
    content_urls = [
        'https://www.gov.cn/zhengce/content/202605/content_7070539.htm',
        'https://www.gov.cn/zhengce/content/202605/content_7070514.htm',
        'https://www.gov.cn/zhengce/content/202605/content_7069960.htm',
        'https://www.gov.cn/zhengce/content/202605/content_7069679.htm',
        'https://www.gov.cn/zhengce/content/202605/content_7069473.htm',
        'https://www.gov.cn/zhengce/content/202605/content_7068345.htm',
    ]

    for url in content_urls:
        try:
            soup = fetch(url, timeout=15)
            text = soup.get_text()

            # Title
            title_tag = soup.find('h1') or soup.find('title')
            title = title_tag.get_text(strip=True) if title_tag else ''
            title = re.sub(r'_中国政府网$|_政策_中国政府网$', '', title)

            if len(title) < 8:
                continue

            # Date
            date = ''
            dm = re.search(r'(\d{4}年\d{1,2}月\d{1,2}日)', text)
            if dm:
                date = dm.group(1).replace('年', '-').replace('月', '-').replace('日', '')
            else:
                dm = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})', text)
                if dm:
                    date = dm.group(1)

            # Organization
            org = '国务院'
            if '国务院办公厅' in text[:3000]:
                org = '国务院办公厅'
            elif '中共中央' in text[:3000]:
                org = '中共中央'

            # Summary: first meaningful paragraph
            summary = ''
            for p in soup.find_all('p'):
                pt = p.get_text(strip=True)
                if pt and len(pt) > 40 and not pt.startswith('《'):
                    summary = pt[:300]
                    break

            # Keywords
            keywords = []
            if any(k in title for k in ['金融', '银行', '保险', '证券', '资本']):
                keywords.append('金融')
            if any(k in title for k in ['经济', '产业', '企业', '市场', '贸易']):
                keywords.append('经济')
            if any(k in title for k in ['科技', '创新', '数字化', '人工智能']):
                keywords.append('科技')
            if any(k in title for k in ['城市', '规划', '建设', '更新']):
                keywords.append('城市建设')
            if any(k in title for k in ['法律', '法规', '条例', '办法', '制度']):
                keywords.append('法律法规')
            if any(k in title for k in ['民生', '就业', '教育', '医疗', '养老']):
                keywords.append('民生')
            if not keywords:
                keywords.append('政策文件')

            policies.append({
                'id': generate_id('pol-gov', url),
                'title': title,
                'organization': org,
                'source': '中国政府网',
                'publish_date': date or '未知',
                'summary': summary,
                'keywords': keywords,
                'category': '货币政策' if '金融' in keywords else '其他',
                'source_url': url,
                'pdf_url': '',
                'updated_at': now_iso(),
                'data_source': 'www.gov.cn',
            })
            print(f"  [{date or '???'}] {title[:70]}")

        except Exception as e:
            print(f"  SKIP {url}: {e}")
            continue

    print(f"  Found {len(policies)} gov.cn policies")
    return policies


def main():
    print("=" * 60)
    print("Scraping real policies from official government sources")
    print("=" * 60)
    all_p = scrape_sz_finance() + scrape_gov_cn()
    all_p.sort(key=lambda p: p['publish_date'], reverse=True)
    print(f"\nTotal: {len(all_p)} real policies from official sources")
    save_json('policies.json', all_p)
    return all_p


if __name__ == '__main__':
    main()
