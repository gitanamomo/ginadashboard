#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
from datetime import datetime

def build_policy_html(news_list, prefix='gov'):
    if not news_list:
        return '<div class="empty-state"><i class="far fa-newspaper"></i> 暂无数据，请稍后刷新</div>'
    html = ''
    for i, item in enumerate(news_list):
        badge = '政府政策' if prefix == 'gov' else '监管政策'
        badge_class = 'policy-badge'
        if prefix == 'reg':
            if '外管局' in item.get('source', ''):
                badge_class += ' orange'
            elif '人行' in item.get('source', ''):
                badge_class += ' blue'
        title = item.get('title', '').replace('"', '&quot;')
        html += f'''
        <div class="news-item" data-id="{prefix}-{i}">
            <input type="checkbox" class="policy-checkbox" id="chk-{prefix}-{i}" data-id="{prefix}-{i}">
            <div class="policy-content">
                <span class="{badge_class}">{badge}</span>
                <div class="policy-title">
                    <a href="{item.get('link', '#')}" target="_blank">{title}</a>
                </div>
                <div class="policy-meta">
                    <span><i class="far fa-building"></i> {item.get('source', '')}</span>
                    <span><i class="far fa-calendar"></i> {item.get('date', '')}</span>
                </div>
                <p class="news-summary">点击标题查看详情</p>
            </div>
        </div>
        '''
    return html

def update_html():
    with open('scripts/data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    gov_html = build_policy_html(data.get('gov_policies', []), 'gov')
    reg_html = build_policy_html(data.get('reg_policies', []), 'reg')
    
    # 替换政府政策区域
    gov_pattern = r'(<div class="policy-list" id="govPolicyList">)(.*?)(</div>)'
    html = re.sub(gov_pattern, r'\1' + gov_html + r'\3', html, flags=re.DOTALL)
    
    # 替换监管政策区域
    reg_pattern = r'(<div class="policy-list" id="regulatoryPolicyList">)(.*?)(</div>)'
    html = re.sub(reg_pattern, r'\1' + reg_html + r'\3', html, flags=re.DOTALL)
    
    # 更新时间
    update_time = data.get('last_update', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    time_pattern = r'(<span class="update-time" id="updateTime">).*?(</span>)'
    html = re.sub(time_pattern, r'\1<i class="far fa-clock"></i> 更新于 ' + update_time + r'\2', html)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"HTML 已更新，时间：{update_time}")

if __name__ == '__main__':
    update_html()
