import{d as e,s as t}from"./api-BmDTKv8y.js";import{F as n,P as r,a as i}from"./index-BAW7CLwq.js";var a=i(`download`,[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]),o=i(`shopping-basket`,[[`path`,{d:`m15 11-1 9`,key:`5wnq3a`}],[`path`,{d:`m19 11-4-7`,key:`cnml18`}],[`path`,{d:`M2 11h20`,key:`3eubbj`}],[`path`,{d:`m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4`,key:`yiazzp`}],[`path`,{d:`M4.5 15.5h15`,key:`13mye1`}],[`path`,{d:`m5 11 4-7`,key:`116ra9`}],[`path`,{d:`m9 11 1 9`,key:`1ojof7`}]]),s=i(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]);function c(){return e({queryKey:[`policies`],queryFn:t})}var l=n(r(),1),u=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},d=(e=>e?u(e):u),f=e=>e;function p(e,t=f){let n=l.useSyncExternalStore(e.subscribe,l.useCallback(()=>t(e.getState()),[e,t]),l.useCallback(()=>t(e.getInitialState()),[e,t]));return l.useDebugValue(n),n}var m=e=>{let t=d(e),n=e=>p(t,e);return Object.assign(n,t),n},h=(e=>e?m(e):m)(e=>({selectedPolicies:[],policyData:[],togglePolicy:t=>e(e=>({selectedPolicies:e.selectedPolicies.includes(t)?e.selectedPolicies.filter(e=>e!==t):[...e.selectedPolicies,t]})),setPolicyData:t=>e({policyData:t}),clearPolicies:()=>e({selectedPolicies:[]}),searchQuery:``,setSearchQuery:t=>e({searchQuery:t})}));function g(e){if(e.length===0)return;let t=e.map((e,t)=>`
    <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #ddd">
      <h3 style="color:#1a3a5c;margin:0 0 8px">${t+1}. ${e.title}</h3>
      <p style="margin:4px 0;color:#555"><strong>发布机构：</strong>${e.organization}</p>
      <p style="margin:4px 0;color:#555"><strong>发布日期：</strong>${e.publish_date}</p>
      <p style="margin:4px 0;color:#555"><strong>分类：</strong>${e.category}</p>
      <p style="margin:4px 0;color:#555"><strong>关键词：</strong>${e.keywords.join(`、`)}</p>
      <p style="margin:8px 0;color:#333;line-height:1.8">${e.summary}</p>
      <p style="margin:4px 0;color:#1a73e8"><strong>原文链接：</strong><a href="${e.source_url}" style="color:#1a73e8">${e.source_url}</a></p>
      <p style="margin:4px 0;color:#888;font-size:12px">数据来源：${e.data_source} | 更新时间：${e.updated_at?.slice(0,10)}</p>
    </div>
  `).join(`
`),n=`
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>政策报告</title>
      <style>
        body { font-family: 'SimSun', '宋体', serif; font-size: 14px; line-height: 1.8; padding: 40px; color: #333; }
        h2 { font-family: 'SimHei', '黑体', sans-serif; font-size: 20px; text-align: center; color: #1a3a5c; margin-bottom: 24px; }
        h3 { font-family: 'SimHei', '黑体', sans-serif; font-size: 15px; color: #1a3a5c; }
        a { color: #1a73e8; }
      </style>
    </head>
    <body>
      <h2>华南外资银行金融监管政策报告</h2>
      <p style="text-align:center;color:#888;margin-bottom:32px">生成时间：${new Date().toLocaleString(`zh-CN`)} | 共 ${e.length} 条政策</p>
      ${t}
      <hr style="margin-top:32px">
      <p style="text-align:center;color:#aaa;font-size:11px">
        Ginadashboard · 华南外资银行监管情报平台 · 所有数据来自官方网站 · 可溯源
      </p>
    </body>
    </html>
  `,r=new Blob([`﻿`+n],{type:`application/msword;charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=`政策报告_${new Date().toISOString().slice(0,10)}.doc`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(i)}export{o as a,s as i,h as n,a as o,c as r,g as t};