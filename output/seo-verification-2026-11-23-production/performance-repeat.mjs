import fs from 'node:fs';
import { Browser } from 'file:///C:/Users/rusiru.r/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const browser = await Browser.launch();
const samples=[];
try {
  for(let run=1;run<=2;run++) {
    const page=await browser.newPage({width:1440,height:900});
    await page.send('Network.enable');
    await page.send('Network.setCacheDisabled',{cacheDisabled:true});
    await page.send('Network.clearBrowserCache');
    await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__sample={lcp:null,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__sample.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__sample.cls+=e.value;}).observe({type:'layout-shift',buffered:true});`});
    await page.goto('https://rusiru.cc/',{timeoutMs:25000,settleMs:2000});
    await page.eval(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
    const sample=await page.eval(()=>({lcpMs:window.__sample.lcp,cls:window.__sample.cls,navigation:performance.getEntriesByType('navigation').map(n=>({ttfb:n.responseStart-n.requestStart,load:n.loadEventEnd}))}));
    samples.push({run,observedAt:new Date().toISOString(),conditions:'1440x900, browser cache cleared/disabled; no CPU/network throttle',...sample});
    fs.writeFileSync('output/seo-verification-2026-11-23-production/evidence/performance-repeat.json',JSON.stringify(samples,null,2));
    console.log(JSON.stringify(samples.at(-1)));
  }
} finally {await browser.close();}
