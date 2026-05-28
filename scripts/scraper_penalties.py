"""
Scrape real regulatory penalty/enforcement data from official sources.
Only extracts from list pages - each entry links to the official source.

Sources:
- 深圳市地方金融监督管理局 - 通知公告 (penalty-related items)
"""
import re
from config import fetch, generate_id, now_iso, save_json

def main():
    print("=" * 60)
    print("Scraping real penalty/enforcement data from official sources")
    print("=" * 60)
    penalties = []

    try:
        soup = fetch('https://jr.sz.gov.cn/sjrb/xxgk/tzgg/', timeout=20)
    except Exception as e:
        print(f"  ERROR: {e}")
        save_json('penalties.json', [])
        return []

    for a in soup.find_all('a', href=True):
        href = a['href']
        title = a.get_text(strip=True)
        if '/content/post_' not in href or len(title) < 5:
            continue

        # Only penalty/risk/enforcement items
        is_penalty = any(k in title for k in [
            '处罚', '罚款', '违法', '违规', '风险提示', '风险警示',
            '非法', '涉嫌', '查处', '注销', '责令', '整改',
            '取消', '暂停', '行政处罚', '行政监管', '吊销',
        ])
        if not is_penalty:
            continue

        full_url = f'https://jr.sz.gov.cn{href}' if href.startswith('/') else href

        # Date from parent element
        date = ''
        parent = a.parent
        if parent:
            span = parent.find('span')
            if span:
                m = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})', span.get_text())
                if m:
                    date = m.group(1)

        # Risk level
        risk = 'medium'
        if any(k in title for k in ['严重', '重大', '非法集资', '涉嫌犯罪', '刑事']):
            risk = 'critical'
        elif any(k in title for k in ['风险', '处罚', '罚款', '违法', '违规']):
            risk = 'high'
        elif any(k in title for k in ['注销', '取消', '整改', '暂停', '吊销']):
            risk = 'medium'

        ptype = '行政处罚' if any(k in title for k in ['处罚', '罚款', '违法', '违规']) else '行政监管措施'

        penalties.append({
            'id': generate_id('pen-sz', full_url),
            'institution': '',
            'institution_type': '',
            'penalty_type': ptype,
            'amount': '',
            'date': date or '未知',
            'reason': title,
            'region': '深圳',
            'source': '深圳市地方金融监督管理局',
            'source_url': full_url,
            'risk_level': risk,
            'tags': [],
            'updated_at': now_iso(),
            'data_source': 'jr.sz.gov.cn',
        })
        print(f"  [{risk.upper()}] {title[:80]}")

    # Sort by date
    penalties.sort(key=lambda p: p['date'], reverse=True)
    print(f"\nTotal: {len(penalties)} real penalty/enforcement records")
    save_json('penalties.json', penalties)
    return penalties


if __name__ == '__main__':
    main()
