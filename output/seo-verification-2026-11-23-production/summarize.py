import collections
import csv
import html
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

root=Path(__file__).parent
prior=root.parent/'seo-verification-2026-11-22-preview-2'
http={r['name']:r for r in json.loads((root/'evidence/http-evidence.json').read_text())}
browser={r['name']:r for r in json.loads((root/'evidence/browser-evidence.json').read_text())}
asset=json.loads((root/'evidence/asset-evidence.json').read_text())
repeats=json.loads((root/'evidence/performance-repeat.json').read_text())
source=(root/'evidence/home.html').read_text(encoding='utf-8')
graph=json.loads(re.search(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',source,re.S).group(1))
person=next(n for n in graph['@graph'] if n.get('@type')=='Person')
def social(state,key):return [m['content'] for m in browser[state]['social'] if m['name']==key]
checks=[]
def add(name,status,observation):checks.append({'check':name,'status':status,'observation':observation})

assert http['home']['status']==200
assert all(http[name]['status']==404 for name in ['missing','missing-nested','missing-asset'])
for name in ['missing','missing-nested','missing-asset']:
    meta=http[name].get('meta',[])
    assert any(m.get('name')=='robots' and 'noindex' in m.get('content','') for m in meta)
add('Real HTTP 404 responses','Pass','Production unknown page, nested missing path and nonexistent JS asset all return HTTP 404 with the static noindex error document. Homepage remains HTTP 200. This fixes the original soft-404 response defect before JavaScript.')
for name in ['desktop','mobile']:
    state=browser[name]
    assert len(state['description'])==1 and state['canonical']==['https://rusiru.cc/'] and state['robots']==['index, follow']
    assert not state['overflow'] and not state['missingFragments']
add('Homepage metadata and navigation','Pass','One description, canonical and robots directive on desktop/mobile; canonical is https://rusiru.cc/. Exactly one H1, no horizontal overflow and no missing primary fragment target were observed.')
error_copy="The page you're looking for doesn't exist. Return to the homepage to explore projects, experience, and contact details."
for name in ['missing-rendered','client-error-navigation']:
    state=browser[name]
    assert state['canonical']==[] and state['robots']==['noindex, follow'] and state['description']==[error_copy]
    assert social(name,'og:description')==social(name,'twitter:description')==[error_copy]
add('Error-page metadata, direct and client navigation','Pass','Both routes have one noindex directive, no canonical, one correct error description and correct OG/Twitter error descriptions. The direct error response is a true HTTP 404; client-side routing does not create a new HTTP page response.')
assert person['jobTitle']=='Software Engineer'
profile=next(n for n in graph['@graph'] if n.get('@type')=='ProfilePage')
assert 'dateCreated' not in profile
add('Structured identity','Pass','Person.jobTitle is Software Engineer, matching current visible experience. The unverified ProfilePage dateCreated is absent. JSON-LD parses; formal external rich-result eligibility is not claimed.')
for name in ['desktop','mobile']:
    logos=[i for i in browser[name]['postScrollImages'] if '/logos/' in i['src']]
    assert len(logos)==2 and all(i['naturalWidth']==132 and i['width']==44 and i['complete'] for i in logos)
logo_bytes=sum(r['decodedBodySize'] for r in browser['desktop']['postScrollResources'] if '/logos/' in r['url'])
assert logo_bytes==26184
add('Optimized production logos','Pass','Both education logos are 132x132, render at 44x44, and total 26,184 bytes (84.73% below the original 171,528). Image alt attributes and successful loading are retained. Pipeline automation cannot be proven from HTTP responses.')
assert asset['status']==200 and asset['content_type']=='image/png' and (asset['width'],asset['height'])==(1200,630)
assert social('desktop','og:image')==social('desktop','twitter:image')==[asset['url']]
add('Advertised production social image','Pass','The exact URL advertised in og:image and twitter:image returns HTTP 200 image/png at 1200x630, 220,012 bytes, on rusiru.cc.')
sitemap=ET.fromstring((root/'evidence/sitemap.txt').read_text())
locations=[node.text for node in sitemap.iter() if node.tag.endswith('loc')]
assert locations==['https://rusiru.cc/']
assert 'Sitemap: https://rusiru.cc/sitemap.xml' in (root/'evidence/robots.txt').read_text()
add('Sitemap and robots','Pass','Both production endpoints return 200; XML parses and lists only the canonical homepage; robots references the correct production sitemap. Google/Bing submission and processing remain unverified.')
for name in ['http','www-https','www-http']:
    assert http[name]['final_url']=='https://rusiru.cc/' and all(h['status']==301 for h in http[name]['redirects'])
assert http['index-html']['final_url']=='https://rusiru.cc/' and http['index-html']['redirects'][0]['status']==301
add('Canonical host and index.html redirect','Pass','HTTP apex, HTTPS www and HTTP www all reach the HTTPS apex using permanent redirects; /index.html now redirects to /. No tested redirect loop or temporary 302 was observed.')
add('HTTP www redirect efficiency','Needs review','http://www.rusiru.cc/ still takes two 301 hops: HTTPS www, then HTTPS apex. Consolidation works; a direct one-hop redirect would remove an extra request if the host permits it.')
bad='\u00e2\u20ac\u201d'
garbled=any(bad in text for name in ['desktop','mobile'] for key in ['og:description','twitter:description'] for text in social(name,key))
add('Homepage social-description punctuation','Needs review' if garbled else 'Pass','The homepage OG/Twitter description still contains mojibake U+00E2 U+20AC U+201D instead of the intended separator. Fix the source string; valid UTF-8 response headers alone do not repair already-garbled text.' if garbled else 'Previously garbled punctuation is no longer present.')
desktop_samples=[browser['desktop']['labVitals']['lcp']['milliseconds']]+[s['lcpMs'] for s in repeats]
add('Performance verification','Needs review',f"Unthrottled desktop LCP samples with browser cache cleared/disabled: {', '.join(f'{v/1000:.3f} s' for v in desktop_samples)}. One mobile sample: {browser['mobile']['labVitals']['lcp']['milliseconds']/1000:.3f} s. Timing varies; INP and field p75 CWV are not available. No field-CWV pass/fail or Lighthouse score is asserted.")

with (prior/'reviewed-audit.csv').open(encoding='utf-8-sig',newline='') as handle:rows=list(csv.DictReader(handle))
updates={
 4:('Pass','Production robots.txt returns 200, allows the audited site, and references the correct canonical sitemap.'),
 5:('Needs review','Production sitemap is valid and contains only https://rusiru.cc/; submission and search-engine processing remain unverified.'),
 7:('Needs review','Homepage is 200/index,follow with one correct canonical; tested unknown paths are now server-side 404/noindex. Actual indexing and Google-selected canonical require Search Console evidence.'),
 14:('Pass','Certificate-verified HTTPS requests succeeded for apex/www; HTTP reaches HTTPS and observed resources are secure.'),
 15:('Pass','All tested HTTP/HTTPS apex/www variants converge on the HTTPS apex through permanent redirects.'),
 16:('Pass','A fresh unknown page, nested path and nonexistent asset all return actual HTTP 404 with static error content; no known linked same-host resource error was observed. Scope: tested URLs.'),
 17:('Needs review',checks[-1]['observation']),
 18:('Needs review','Primary fragments and observed same-host assets resolve, and the production share image is available. Outbound links and historical URL inventories are not comprehensively tested.'),
 21:('Pass','Production canonical is the clean root URL, and /index.html now permanently redirects to it. Portfolio section anchors remain fragments, not separate pages.'),
 22:('Needs review','Production JSON-LD parses; current job title is aligned and unverified profile creation date removed. Formal schema/Rich Results validation and factual verification remain incomplete.'),
 24:('Pass','All tested domain/index redirects use 301 rather than temporary 302 responses.'),
 25:('Needs review','HTTP www still uses two permanent hops; other tested variants and index.html take one. No loop was observed.'),
 30:('Needs review','Current job-title conflict and error-page metadata are fixed in production. Homepage social-description punctuation still needs cleanup; content-performance data is not supplied.'),
 35:('Needs review','Current structured/visible titles agree and unverified profile date is removed. Homepage social descriptions still have mojibake. Full personal-fact accuracy is not independently confirmed.'),
 44:('Needs review','Production renders responsively and all observed application resources load. Desktop lab LCP varies across three cold-browser samples; field performance and full accessibility remain unverified.'),
 46:('Needs review','Production logo payload/dimension defects are fixed (132px each, total 26,184 bytes). A repeatable compression pipeline cannot be confirmed from the deployed output alone.'),
 47:('Needs review','Correct production server 404s are verified. Restoration/redirect decisions for valuable historical URLs still require traffic/backlink evidence.'),
 50:('Needs review','Error descriptions are fixed, but homepage social descriptions retain garbled punctuation. Broader copy decisions need content-owner review.'),
 52:('Needs review','Portrait/logos are present and the advertised social card is verified on the actual production host. Further project screenshots remain optional content work, not an indexing defect.'),
}
for row in rows:
    number=int(row['Item_Number'])
    row.update(Website='https://rusiru.cc/',Audit_Date='2026-11-23',Verification_Scope='Production release verification; no new private account evidence.')
    if number in updates:row['Status'],row['Observation']=updates[number]
    if row['Status'] not in ('Not tested','Not applicable'):row['Evidence']='evidence/http-evidence.json; evidence/browser-evidence.json; evidence/asset-evidence.json; evidence/performance-repeat.json'
    row['Reviewed_Priority']='Low' if number in (25,35,50) else 'Medium' if row['Status']=='Needs review' else ''
    if number==16:row['Recommended_Action']='Retain correct 404 handling and regression-check it after routing changes.'
    if number==15:row['Recommended_Action']='Retain one preferred HTTPS apex; optionally simplify the HTTP www chain.'
    if number==25:row['Recommended_Action']='If hosting allows, redirect HTTP www directly to the HTTPS apex.'
    if number in (30,35,50):row['Recommended_Action']='Correct the exact source social-description separator and regenerate; preserve verified personal facts.'

with (root/'reviewed-audit.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
with (root/'verification.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(checks[0]));writer.writeheader();writer.writerows(checks)
limits=[
 'Production rusiru.cc and its apex/www scheme variants were tested. The blog subdomain, social-account destinations, and complete historical URL inventory were not crawled.',
 'One canonical page under the 200-page cap, thirteen supplemental HTTP probes, four browser states, one production social asset and two additional desktop performance samples were recorded.',
 'No source edit, commit, deployment or account action was performed. The existing local checkout may lag deployment, so current fixes are verified from HTTP/browser output. No rollback is needed.',
 'Search Console/Bing submission, manual actions, actual index coverage, GA4, rankings, keywords, backlinks, outreach and AI-visibility metrics remain untested without supplied account evidence.',
 'Formal third-party schema validation, complete accessibility review and real-user CWV are not completed. Browser sizes were 1440x900 and 390x844; cache was disabled/cleared and CPU/network were not throttled.',
 'Raw packaged crawler classification remains affected by its CSV item-ID string/integer bug. Reviewed CSV preserves all 54 original IDs, tasks and source references and incorporates the verified observations.',
]
summary={'target':'https://rusiru.cc/','date':'2026-11-23','observed_at_utc':asset['observed_at_utc'],
         'app_bundle':re.findall(r'<script[^>]+src="(/assets/[^\"]+)"',source),'checks':checks,
         'reviewed_54_status_counts':dict(collections.Counter(r['Status'] for r in rows)),
         'remaining_copy_issue':garbled,'desktop_lcp_samples_ms':desktop_samples,'limitations':limits,'changes_applied':False}
(root/'verification-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
esc=lambda text:html.escape(str(text),quote=True)
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>rusiru.cc production release verification</title>',
 '<style>body{font:16px/1.6 system-ui,sans-serif;max-width:1150px;margin:40px auto;padding:0 24px;color:#20252b}h1,h2{line-height:1.25}h2{margin-top:40px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ccd1d7;padding:11px;text-align:left;vertical-align:top}th{background:#f1f3f5}.table{overflow:auto}a{color:#1553a0}</style>',
 '<h1>rusiru.cc — Production release verification</h1><p>23 November 2026 · Read-only production checks</p>',
 '<p><strong>The main production fixes are verified.</strong> Unknown paths now return real server-side HTTP 404s with static error content. Head ownership, direct/client error descriptions, structured job title, optimized logos and the advertised production social card pass the recorded regression checks.</p>',
 '<p>Remaining: garbled punctuation in homepage social descriptions; two-hop HTTP www redirect; performance/account-only evidence still requires review. Zero reviewed checklist Fail statuses does not mean every SEO/account/field-performance check passed.</p>',
 '<p><a href="verification.csv">Focused verification CSV</a> · <a href="reviewed-audit.csv">All 54 reviewed checklist items</a> · <a href="verification-summary.json">Summary JSON</a></p>',
 '<h2>Production verification outcomes</h2><div class="table"><table><thead><tr><th>Check</th><th>Status</th><th>Recorded evidence</th></tr></thead><tbody>']
for row in checks:parts.append('<tr><td>'+esc(row['check'])+'</td><td><strong>'+esc(row['status'])+'</strong></td><td>'+esc(row['observation'])+'</td></tr>')
parts += ['</tbody></table></div><h2>Remaining recommendations</h2><ol><li>Replace the garbled source separator in the homepage OG/Twitter descriptions and regenerate metadata.</li><li>If hosting allows, make HTTP www redirect directly to the HTTPS apex. Consolidation already works; this is a low-priority efficiency improvement.</li><li>Use repeated controlled diagnostics and real-user/Search Console evidence before declaring CWV or indexing success. Observed desktop LCP variability is recorded without a fabricated score.</li></ol>',
 '<h2>Limits and change control</h2><ul>'+''.join('<li>'+esc(item)+'</li>' for item in limits)+'</ul>',
 '<h2>Evidence</h2><ul><li><a href="evidence/http-evidence.json">Status codes, redirects and response metadata</a></li><li><a href="evidence/browser-evidence.json">Rendered head, links, image dimensions and resource sizes</a></li><li><a href="evidence/asset-evidence.json">Production share-image evidence</a></li><li><a href="evidence/performance-repeat.json">Repeated desktop lab observations</a></li><li><a href="evidence/desktop.jpg">Desktop</a> · <a href="evidence/mobile.jpg">Mobile</a> · <a href="evidence/missing-rendered.jpg">Direct error page</a> · <a href="evidence/client-error-navigation.jpg">Client error navigation</a></li><li><a href="site/pages.csv">Bounded crawler page inventory</a></li></ul>',
 '<p>Primary references: <a href="https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors">Google error handling</a> · <a href="https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics">JavaScript metadata</a> · <a href="https://web.dev/articles/vitals">Web Vitals measurement</a>.</p></html>']
(root/'verification-report.html').write_text('\n'.join(parts),encoding='utf-8')
assert len(rows)==54 and {int(row['Item_Number']) for row in rows}==set(range(1,55))
print(json.dumps({'checks':len(checks),'reviewed_54_status_counts':summary['reviewed_54_status_counts'],'desktop_lcp_samples_ms':desktop_samples},indent=2))
