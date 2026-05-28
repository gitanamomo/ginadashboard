"""
Shared configuration and utilities for regulatory data scrapers.
All data sourced from official Chinese government websites.
"""
import os
import json
import hashlib
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup

# Output paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, 'src', 'data')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

VERIFY_SSL = False

def fetch(url, timeout=30):
    """Fetch a URL and return BeautifulSoup object."""
    r = requests.get(url, headers=HEADERS, timeout=timeout, verify=VERIFY_SSL)
    r.encoding = r.apparent_encoding or 'utf-8'
    return BeautifulSoup(r.text, 'lxml')

def fetch_text(url, timeout=30):
    """Fetch a URL and return raw text."""
    r = requests.get(url, headers=HEADERS, timeout=timeout, verify=VERIFY_SSL)
    r.encoding = r.apparent_encoding or 'utf-8'
    return r.text

def generate_id(prefix, url):
    """Generate a stable ID from a URL."""
    h = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{prefix}-{h}"

def now_iso():
    """Current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

def ensure_data_dir():
    """Ensure the data directory exists."""
    os.makedirs(DATA_DIR, exist_ok=True)

def save_json(filename, data):
    """Save data to JSON file in the data directory."""
    ensure_data_dir()
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Saved: {filepath} ({len(data)} items)")
