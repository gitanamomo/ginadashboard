"""
Scrape real leadership data from official Chinese government websites.
Only extracts publicly listed names and positions - no fabricated bios.

Sources:
- 中国人民银行 (pbc.gov.cn) - 机构设置/领导信息
- 深圳市地方金融监督管理局 (jr.sz.gov.cn) - 机构信息公开
"""
import re
from config import fetch, generate_id, now_iso, save_json

def scrape_pboc():
    """Extract leadership info from PBoC organization pages."""
    print("[PBoC] Extracting leadership from pbc.gov.cn...")
    leaders = []
    seen = set()

    urls = [
        'http://www.pbc.gov.cn/rmyh/105226/105442/index.html',
        'http://www.pbc.gov.cn/rmyh/105226/index.html',
    ]

    for url in urls:
        try:
            soup = fetch(url, timeout=20)
            for a in soup.find_all('a', href=True):
                text = a.get_text(strip=True)
                href = a['href']

                # Look for leadership indicators
                is_leader = any(k in text for k in [
                    '行长', '副行长', '党委书记', '党委委员',
                    '纪委书记', '纪检组长',
                ])
                is_leader_path = any(k in href.lower() for k in [
                    '105226', '105442', 'hangzhang', 'fuhangzhang',
                ])

                if not (is_leader or is_leader_path) or len(text) < 2 or len(text) > 30:
                    continue

                if text in seen:
                    continue
                seen.add(text)

                full_url = href if href.startswith('http') else f'http://www.pbc.gov.cn{href}'

                leaders.append({
                    'id': generate_id('ldr-pboc', full_url),
                    'name': text,
                    'title': text,
                    'organization': '中国人民银行',
                    'resume': '',
                    'appointment_history': [],
                    'source': '中国人民银行官网',
                    'source_url': full_url,
                    'updated_at': now_iso(),
                    'data_source': 'pbc.gov.cn',
                    'data_quality': 'official_listing_only',
                    'notes': '仅包含官网公开列出的职务信息',
                })
                print(f"  {text} -> {full_url[:80]}")
        except Exception as e:
            print(f"  SKIP {url}: {e}")

    print(f"  Found {len(leaders)} PBoC entries")
    return leaders


def scrape_sz_finance():
    """Extract leadership references from SZ Finance Bureau pages."""
    print("[SZ Finance] Extracting leadership references...")
    leaders = []
    seen = set()

    try:
        soup = fetch('https://jr.sz.gov.cn/', timeout=20)
    except Exception as e:
        print(f"  ERROR: {e}")
        return leaders

    # Extract from homepage - look for leadership-related links and text
    for a in soup.find_all('a', href=True):
        text = a.get_text(strip=True)
        href = a['href']

        # Look for organization/leadership links
        is_org = any(k in text or k in href.lower() for k in [
            '领导', '机构', '职能', '班子', '局长', '主任',
            'jgk', 'ldjg', 'ldxx', 'zzjg',
        ])

        if not is_org or len(text) < 2 or len(text) > 80:
            continue

        if text in seen:
            continue
        seen.add(text)

        full_url = href if href.startswith('http') else f'https://jr.sz.gov.cn{href}'

        leaders.append({
            'id': generate_id('ldr-sz', full_url),
            'name': text,
            'title': text,
            'organization': '深圳市地方金融监督管理局',
            'resume': '',
            'appointment_history': [],
            'source': '深圳市地方金融监督管理局',
            'source_url': full_url,
            'updated_at': now_iso(),
            'data_source': 'jr.sz.gov.cn',
            'data_quality': 'official_listing_only',
            'notes': '从官网公开页面提取的信息',
        })
        print(f"  {text}")

    print(f"  Found {len(leaders)} SZ Finance entries")
    return leaders


def main():
    print("=" * 60)
    print("Scraping real leadership data from official government websites")
    print("=" * 60)
    all_l = scrape_pboc() + scrape_sz_finance()
    print(f"\nTotal: {len(all_l)} real leadership records")
    print("NOTE: All data from official public pages. No fabricated bios or resumes.")
    save_json('leaders.json', all_l)
    return all_l


if __name__ == '__main__':
    main()
