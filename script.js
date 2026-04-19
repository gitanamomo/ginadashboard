const policyData = [
    {
        id: 'p1',
        rank: 'TOP 1',
        title: '中国人民银行 国家外汇管理局关于调整银行业金融机构境外贷款业务有关事宜的通知',
        source: '中国人民银行、国家外汇管理局',
        date: '2025年',
        tag: '重要',
        tagClass: 'policy-tag-critical',
        desc: '将境内外商独资银行、境内中外合资银行、外国银行境内分行的境外贷款杠杆率由0.5上调至1.5...',
        link: 'https://m.thepaper.cn/newsDetail_forward_32976753',
        isTop: true,
        category: '政策'
    },
    {
        id: 'p2',
        rank: 'TOP 2',
        title: '关于金融领域在有条件的自由贸易试验区(港)试点对接国际高标准推进制度型开放的意见',
        source: '人民银行、商务部、金融监管总局等五部门',
        date: '2025-02-18',
        tag: '重要',
        tagClass: 'policy-tag-critical',
        desc: '允许外资金融机构开展与中资金融机构同类新金融服务，支持依法跨境购买一定种类的境外金融服务...',
        link: 'http://www.safe.gov.cn/shenzhen/2025/0218/2055.html',
        isTop: true,
        category: '政策'
    },
    {
        id: 'p3',
        rank: 'TOP 3',
        title: '银行保险机构金融消费投诉处理管理办法（修订征求意见稿）',
        source: '国家金融监督管理总局',
        date: '2026年',
        tag: '重要',
        tagClass: 'policy-tag-important',
        desc: '确立金融消费者权益保护新机制，通过强制调解、责任穿透、科学考核三大突破，构建多元共治格局...',
        link: 'https://www.nfra.gov.cn/cn/view/pages/ItemDetail.html?docId=1252215',
        isTop: true,
        category: '政策'
    },
    {
        id: 'p4',
        rank: 'TOP 4',
        title: '深圳本外币一体化资金池迎来"升级"支持总部经济高质量发展',
        source: '国家外汇管理局深圳市分局',
        date: '2025-02-05',
        tag: '重要',
        tagClass: 'policy-tag-important',
        desc: '允许跨国公司境内成员企业间错币种借贷用于经常项目跨境支付业务，降低企业资金融资成本...',
        link: 'https://www.safe.gov.cn/shenzhen/2025/0205/2041.html',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p5',
        rank: 'TOP 5',
        title: '人民银行深圳市分行、国家外汇管理局深圳市分局2025年三季度新闻发布会',
        source: '人民银行深圳市分行、深圳外汇局',
        date: '2025-11-03',
        tag: '新闻',
        tagClass: 'policy-tag-normal',
        desc: '进一步深化跨境投融资改革，推动涵盖跨境投资、融资以及资本项目收付等一揽子便利化政策在深圳落地...',
        link: 'http://www.safe.gov.cn/shenzhen/2025/1103/2244.html',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p6',
        rank: 'TOP 6',
        title: '统筹做好科技金融大文章 支持深圳打造产业科技创新中心的行动方案',
        source: '国家金融监督管理总局深圳监管局等六部门',
        date: '2025年',
        tag: '政策',
        tagClass: 'policy-tag-normal',
        desc: '支持国有大型银行和股份制银行积极向总行争取科技金融业务授权，在深设立科技金融中心...',
        link: 'https://www.nfra.gov.cn/branch/shenzhen/view/pages/common/ItemDetail.html?docId=1208593&itemId=1038',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p7',
        rank: 'TOP 7',
        title: '银行外汇展业改革深化 外贸外资发展获强劲助力',
        source: '深圳新闻网',
        date: '2026-03-24',
        tag: '新闻',
        tagClass: 'policy-tag-normal',
        desc: '2026年改革聚焦有序扩围提质、政策协同与风险可控，推动展业改革与跨境贸易投资便利化等政策融合...',
        link: 'http://www.sznews.com/news/content/2026-03/24/content_31989891.htm',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p8',
        rank: 'TOP 8',
        title: '2025年深圳经济运行情况',
        source: '深圳市统计局',
        date: '2025年',
        tag: '数据',
        tagClass: 'policy-tag-normal',
        desc: '2025年全市地区生产总值38731.80亿元，按不变价格计算，同比增长5.5%...',
        link: 'https://tjj.sz.gov.cn/zwgk/zfxxgkml/tjsj/tjfx/content/post_12624244.html',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p9',
        rank: 'TOP 9',
        title: '关于推进金融纠纷调解工作高质量发展的意见',
        source: '金融监管总局、人民银行、证监会',
        date: '2025年',
        tag: '政策',
        tagClass: 'policy-tag-normal',
        desc: '建立完善应调响应、调解权限动态授予和异地授权、解纷方案快速审批等机制...',
        link: 'https://www.nfra.gov.cn/cn/view/pages/ItemDetail.html?docId=1203542&itemId=917',
        isTop: false,
        category: '政策'
    },
    {
        id: 'p10',
        rank: 'TOP 10',
        title: '外汇便利新举措 深圳先行先试!"科薪通"试点落地',
        source: '国家外汇管理局深圳市分局',
        date: '2026年4月',
        tag: '新闻',
        tagClass: 'policy-tag-normal',
        desc: '率先落地"科薪通"试点，进一步便利辖内优质企业，特别是重点科研机构涉外员工薪酬用汇...',
        link: 'http://m.163.com/dy/article/KPK5G36V0530NLC9.html',
        isTop: false,
        category: '政策'
    }
];

const scNewsData = [
    {
        id: 'sc1',
        badge: '📊 业绩',
        title: '渣打集团：2025年净利润同比增长26% 核心指标表现亮眼',
        source: '渣打集团',
        date: '2026-03-26',
        tag: '重要',
        tagClass: 'policy-tag-critical',
        desc: '2025年溢利50.97亿美元、同比增26%，基本经营收入、每股盈利等核心指标超市场预期。',
        link: 'https://finance.sina.cn/2026-03-26/detail-inhsikaq0154435.d.html',
        category: '同业'
    },
    {
        id: 'sc2',
        badge: '🏃 活动',
        title: '初夏跑者盛会：渣打上海10公里跑定档，报名即将启动',
        source: '渣打中国',
        date: '2026-03-30',
        tag: '新闻',
        tagClass: 'policy-tag-normal',
        desc: '渣打上海10公里跑活动正式定档，报名工作即将启动，助力健康生活。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc3',
        badge: '🏎️ 品牌',
        title: '渣打首次亮相 FORMULA 1 喜力中国大奖赛',
        source: '渣打中国',
        date: '2026-03-13',
        tag: '重要',
        tagClass: 'policy-tag-important',
        desc: '渣打首次亮相F1中国大奖赛，进一步提升品牌影响力。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc4',
        badge: '📈 研究',
        title: '渣打银行发布《流动的人民币：企业跨境新动能》报告',
        source: '渣打银行',
        date: '2026-03-11',
        tag: '报告',
        tagClass: 'policy-tag-normal',
        desc: '发布最新研究报告，深入分析人民币流动趋势及企业跨境发展新机遇。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc5',
        badge: '💼 财富',
        title: '渣打中国大湾区首家优先私人理财中心落地，持续加码财富管理市场',
        source: '渣打中国',
        date: '2026-01-29',
        tag: '重要',
        tagClass: 'policy-tag-important',
        desc: '大湾区首家优先私人理财中心正式落地，持续拓展中国财富管理市场。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc6',
        badge: '🏢 创新',
        title: '渣打中国推出国际及创新企业银行业务，赋能科创企业全球发展',
        source: '渣打中国',
        date: '2026-01-27',
        tag: '业务',
        tagClass: 'policy-tag-normal',
        desc: '推出国际及创新企业银行业务，助力科创企业实现全球化发展。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc7',
        badge: '🌊 自贸',
        title: '渣打中国成为自贸账户功能升级首批试点行',
        source: '渣打中国',
        date: '2025-12-05',
        tag: '重要',
        tagClass: 'policy-tag-important',
        desc: '成为自贸账户功能升级首批试点银行，进一步提升跨境金融服务能力。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    },
    {
        id: 'sc8',
        badge: '🚀 出海',
        title: '渣打中国推出中小企业"出海通" 助力中小企业共享全球新机遇',
        source: '渣打中国',
        date: '2025-11-06',
        tag: '业务',
        tagClass: 'policy-tag-normal',
        desc: '推出中小企业"出海通"产品，助力中小企业拓展国际市场，共享全球发展机遇。',
        link: 'https://www.sc.com/cn/cn/news-media/',
        category: '同业'
    }
];

let basketItems = [];

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    renderPolicyList();
    renderScNewsList();
    initCharts();
    initTabs();
    smoothScroll();
});

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateStr = now.toLocaleDateString('zh-CN', options);
    document.getElementById('currentDate').textContent = dateStr;
}

function renderPolicyList() {
    const container = document.getElementById('policy-list');
    container.innerHTML = policyData.map(item => `
        <div class="policy-item ${item.isTop ? 'top-policy' : ''}" data-id="${item.id}">
            <div class="policy-checkbox" onclick="event.stopPropagation(); toggleItem('${item.id}')">
                <input type="checkbox" id="check-${item.id}" ${isInBasket(item.id) ? 'checked' : ''}>
                <label for="check-${item.id}"></label>
            </div>
            <a href="${item.link}" target="_blank" class="policy-link-wrapper" onclick="event.stopPropagation()">
                <div class="policy-rank">${item.rank}</div>
                <div class="policy-content">
                    <div class="policy-title">${item.title}</div>
                    <div class="policy-meta">
                        <span class="policy-source">${item.source}</span>
                        <span class="policy-date">${item.date}</span>
                        <span class="policy-tag ${item.tagClass}">${item.tag}</span>
                    </div>
                    <div class="policy-desc">${item.desc}</div>
                </div>
            </a>
        </div>
    `).join('');
}

function renderScNewsList() {
    const container = document.getElementById('sc-news-list');
    container.innerHTML = scNewsData.map(item => `
        <div class="policy-item sc-news-item" data-id="${item.id}">
            <div class="policy-checkbox" onclick="event.stopPropagation(); toggleItem('${item.id}')">
                <input type="checkbox" id="check-${item.id}" ${isInBasket(item.id) ? 'checked' : ''}>
                <label for="check-${item.id}"></label>
            </div>
            <a href="${item.link}" target="_blank" class="policy-link-wrapper" onclick="event.stopPropagation()">
                <div class="sc-badge">${item.badge}</div>
                <div class="policy-content">
                    <div class="policy-title">${item.title}</div>
                    <div class="policy-meta">
                        <span class="policy-source">${item.source}</span>
                        <span class="policy-date">${item.date}</span>
                        <span class="policy-tag ${item.tagClass}">${item.tag}</span>
                    </div>
                    <div class="policy-desc">${item.desc}</div>
                </div>
            </a>
        </div>
    `).join('');
}

function getAllItems() {
    return [...policyData, ...scNewsData];
}

function isInBasket(id) {
    return basketItems.some(item => item.id === id);
}

function toggleItem(id) {
    const allItems = getAllItems();
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    if (isInBasket(id)) {
        basketItems = basketItems.filter(i => i.id !== id);
    } else {
        basketItems.push(item);
    }
    
    updateBasketUI();
    updateCheckboxes();
}

function updateCheckboxes() {
    getAllItems().forEach(item => {
        const checkbox = document.getElementById(`check-${item.id}`);
        if (checkbox) {
            checkbox.checked = isInBasket(item.id);
        }
    });
}

function updateBasketUI() {
    const countEl = document.getElementById('basket-count');
    const itemsEl = document.getElementById('basket-items');
    
    countEl.textContent = basketItems.length;
    
    if (basketItems.length === 0) {
        itemsEl.innerHTML = '<div class="basket-empty">暂无勾选项，请勾选政策或新闻</div>';
    } else {
        itemsEl.innerHTML = basketItems.map((item, index) => `
            <div class="basket-item">
                <span class="basket-item-title">${index + 1}. ${item.title}</span>
                <button class="basket-remove" onclick="removeFromBasket('${item.id}')">×</button>
            </div>
        `).join('');
    }
}

function removeFromBasket(id) {
    basketItems = basketItems.filter(i => i.id !== id);
    updateBasketUI();
    updateCheckboxes();
}

function clearBasket() {
    basketItems = [];
    updateBasketUI();
    updateCheckboxes();
}

let basketExpanded = true;
function toggleBasket() {
    basketExpanded = !basketExpanded;
    const content = document.getElementById('basket-content');
    const arrow = document.getElementById('basket-arrow');
    
    if (basketExpanded) {
        content.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▶';
    }
}

function generateReport() {
    if (basketItems.length === 0) {
        alert('请先勾选要加入报告的政策或新闻！');
        return;
    }

    const now = new Date();
    const yearMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
    
    let policiesContent = basketItems.filter(i => i.category === '政策').map((item, idx) => 
        `${idx + 1}. ${item.title}\n   来源：${item.source} | 日期：${item.date}\n   摘要：${item.desc}\n`
    ).join('\n');

    let peersContent = basketItems.filter(i => i.category === '同业').map((item, idx) => 
        `${idx + 1}. ${item.title}\n   来源：${item.source} | 日期：${item.date}\n   摘要：${item.desc}\n`
    ).join('\n');

    if (!policiesContent) policiesContent = '（无）';
    if (!peersContent) peersContent = '（无）';

    const economicContent = `1. 2025年深圳GDP：38,731.80亿元，同比增长5.5%
2. 第一产业增加值：28.04亿元，同比-4.5%
3. 第二产业增加值：14,482.54亿元，同比+4.1%
4. 第三产业增加值：24,221.22亿元，同比+6.3%`;

    const regulatoryContent = `1. 消费者权益保护：严格执行《银行保险机构金融消费投诉处理管理办法》
2. 跨境业务：持续落实跨境投融资便利化政策
3. 反洗钱合规：定期开展合规自查与培训`;

    const content = `${yearMonth}月度行政报告

一、重点政策
${policiesContent}

二、经济数据
${economicContent}

三、监管重点
${regulatoryContent}

四、同业信息
${peersContent}

报告生成时间：${now.toLocaleString('zh-CN')}
`;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `${yearMonth}月度行政报告.doc`);
}

function initCharts() {
    const colors = {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const gdpCtx = document.getElementById('gdpChart').getContext('2d');
    new Chart(gdpCtx, {
        type: 'line',
        data: {
            labels: ['2024Q4', '2025Q1', '2025Q2', '2025Q3', '2025Q4'],
            datasets: [{
                label: 'GDP（亿元）',
                data: [9200, 9350, 9500, 9700, 10181.8],
                borderColor: colors.primary,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const loanCtx = document.getElementById('loanChart').getContext('2d');
    new Chart(loanCtx, {
        type: 'bar',
        data: {
            labels: ['2025年11月', '2025年12月', '2026年1月', '2026年2月', '2026年3月'],
            datasets: [{
                label: '贷款余额（万亿元）',
                data: [11.8, 12.1, 12.3, 12.5, 12.8],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.7)',
                    'rgba(118, 75, 162, 0.7)',
                    'rgba(240, 147, 251, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    colors.primary,
                    colors.secondary,
                    colors.accent,
                    colors.info,
                    colors.success
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const cpiCtx = document.getElementById('cpiChart').getContext('2d');
    new Chart(cpiCtx, {
        type: 'line',
        data: {
            labels: ['2025年11月', '2025年12月', '2026年1月', '2026年2月', '2026年3月'],
            datasets: [{
                label: 'CPI同比（%）',
                data: [0.8, 1.0, 1.2, 1.5, 1.8],
                borderColor: colors.warning,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.warning,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const tradeCtx = document.getElementById('tradeChart').getContext('2d');
    new Chart(tradeCtx, {
        type: 'line',
        data: {
            labels: ['2025年11月', '2025年12月', '2026年1月', '2026年2月', '2026年3月'],
            datasets: [
                {
                    label: '进口（亿美元）',
                    data: [220, 235, 215, 225, 240],
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: '出口（亿美元）',
                    data: [240, 255, 230, 227, 245],
                    borderColor: colors.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: colors.success,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
