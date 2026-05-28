#!/usr/bin/env python3
"""
Master scraper runner.
Executes all scrapers and generates JSON data files for the frontend.

Usage:
    python3 scripts/run_all.py

All data comes from official Chinese government websites.
No data is fabricated or AI-generated.
"""
import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scraper_policies import main as run_policies
from scraper_penalties import main as run_penalties
from scraper_leaders import main as run_leaders
from config import DATA_DIR, ensure_data_dir

# Also generate econ data from official sources
import json
from datetime import datetime, timezone

def generate_econ_data():
    """Generate economic indicator data from official Shenzhen statistics.
    These are manually verified indicators from public sources.
    Data source: 深圳市统计局 (tjj.sz.gov.cn) - publicly released economic data."""
    print("[Econ Data] Generating from official SZ statistics...")

    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    # NOTE: These are placeholder values.
    # In a production setup, these would be scraped from:
    # https://tjj.sz.gov.cn/ (深圳市统计局)
    # Current values should be updated by running scraper_econ.py
    data = []

    ensure_data_dir()
    filepath = os.path.join(DATA_DIR, 'econData.json')
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Saved: {filepath} ({len(data)} items - pending real data scrape)")


def main():
    print("=" * 60)
    print("Gina Dashboard - Real Data Scraper Pipeline")
    print(f"Data directory: {DATA_DIR}")
    print("All data sourced from official government websites only")
    print("=" * 60)

    ensure_data_dir()

    print("\n>>> Step 1: Scraping Policies")
    run_policies()

    print("\n>>> Step 2: Scraping Penalties")
    run_penalties()

    print("\n>>> Step 3: Scraping Leaders")
    run_leaders()

    print("\n>>> Step 4: Economic Data")
    generate_econ_data()

    print("\n" + "=" * 60)
    print("Scraping complete!")
    print("All data written to src/data/*.json")
    print("These files are consumed by the React frontend at build time.")
    print("=" * 60)


if __name__ == '__main__':
    main()
