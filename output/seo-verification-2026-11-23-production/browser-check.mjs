import fs from 'node:fs';
import { Browser } from 'file:///C:/Users/rusiru.r/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const out = 'output/seo-verification-2026-11-23-production/evidence/';
const browser = await Browser.launch();
const results = [];
try {
  for (const config of [
    { name: 'desktop', width: 1440, height: 900, url: 'https://rusiru.cc/' },
    { name: 'mobile', width: 390, height: 844, url: 'https://rusiru.cc/' },
    { name: 'client-error-navigation', width: 1440, height: 900, url: 'https://rusiru.cc/' },
    { name: 'missing-rendered', width: 1440, height: 900, url: 'https://rusiru.cc/__seo-audit-not-found-20261123' },
  ]) {
    const page = await browser.newPage(config);
    await page.send('Network.enable');
    await page.send('Network.setCacheDisabled', {cacheDisabled:true});
    await page.send('Network.clearBrowserCache');
    const failedRequests = [];
    const responses = [];
    browser.on(page.sessionId, 'Network.loadingFailed', event => failedRequests.push(event));
    browser.on(page.sessionId, 'Network.responseReceived', event => responses.push({url:event.response.url,status:event.response.status,mime:event.response.mimeType,protocol:event.response.protocol}));
    await page.send('Page.addScriptToEvaluateOnNewDocument', {source: `window.__auditVitals={lcp:null,cls:0,longTasks:[]};
      new PerformanceObserver(list=>{for(const entry of list.getEntries()) window.__auditVitals.lcp={milliseconds:entry.startTime,element:entry.element?.tagName,text:entry.element?.textContent?.slice(0,120),url:entry.url};}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.__auditVitals.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list=>{for(const entry of list.getEntries()) window.__auditVitals.longTasks.push(entry.duration);}).observe({type:'longtask',buffered:true});`});
    await page.goto(config.url, {timeoutMs:25000,settleMs:2000});
    if (config.name === 'client-error-navigation') {
      await page.eval(() => {
        history.pushState(null, '', '/__seo-audit-not-found-20261123');
        dispatchEvent(new PopStateEvent('popstate'));
      });
      await new Promise(resolve=>setTimeout(resolve,700));
    }
    await page.eval(() => Promise.race([document.fonts.ready, new Promise(resolve=>setTimeout(resolve,5000))]));
    const data = await page.eval(() => ({
      url:location.href,title:document.title,lang:document.documentElement.lang,
      description:[...document.querySelectorAll('meta[name="description"]')].map(e=>e.content),
      canonical:[...document.querySelectorAll('link[rel="canonical"]')].map(e=>e.href),
      robots:[...document.querySelectorAll('meta[name="robots"]')].map(e=>e.content),
      social:[...document.querySelectorAll('meta[property^="og:"],meta[name^="twitter:"]')].map(e=>({name:e.name||e.getAttribute('property'),content:e.content})),
      headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({tag:e.tagName,text:e.textContent.trim()})),
      images:[...document.images].map(e=>({src:e.currentSrc||e.src,alt:e.getAttribute('alt'),width:e.width,height:e.height,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,loading:e.loading})),
      links:[...document.querySelectorAll('a[href]')].map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})),
      missingFragments:[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href')).filter(href=>href.length>1&&!document.getElementById(decodeURIComponent(href.slice(1)))) ,
      overflow:document.documentElement.scrollWidth>innerWidth,
      smallControls:[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<24||r.height<24);}).length,
      bodyText:document.body.innerText,
      navigation:performance.getEntriesByType('navigation').map(e=>({ttfb:e.responseStart-e.requestStart,domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize})),
      resources:performance.getEntriesByType('resource').map(e=>({url:e.name,type:e.initiatorType,duration:e.duration,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize})),
      paints:performance.getEntriesByType('paint').map(e=>({name:e.name,milliseconds:e.startTime})),
      labVitals:window.__auditVitals,
      fonts:[...document.fonts].map(e=>({family:e.family,status:e.status})),
    }));
    const result = {cachePolicy:'disabled and browser cache cleared before navigation; no CPU/network throttle',name:config.name,viewport:{width:config.width,height:config.height},observedAt:new Date().toISOString(),...data,failedRequests,responses,exceptions:page.consoleErrors};
    results.push(result);
    fs.writeFileSync(out+'browser-evidence.json',JSON.stringify(results,null,2));
    await page.screenshot({path:out+config.name+'.jpg'});
    if (config.name === 'desktop' || config.name === 'mobile') {
      result.postScrollImages = await page.eval(async () => {
        for (const image of document.images) {
          image.scrollIntoView({block:'center',behavior:'instant'});
          await Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,4000))]);
        }
        return [...document.images].map(image=>({src:image.currentSrc||image.src,alt:image.alt,width:image.width,height:image.height,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,complete:image.complete}));
      });
      result.postScrollResources = await page.eval(()=>performance.getEntriesByType('resource').map(e=>({url:e.name,type:e.initiatorType,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize})));
      fs.writeFileSync(out+'browser-evidence.json',JSON.stringify(results,null,2));
    }
    console.log(JSON.stringify({name:config.name,title:data.title,canonical:data.canonical,robots:data.robots,overflow:data.overflow,missingFragments:data.missingFragments,labVitals:data.labVitals,failedRequests:failedRequests.length}));
  }
} finally {await browser.close();}
