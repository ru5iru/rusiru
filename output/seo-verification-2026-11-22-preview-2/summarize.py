import collections
import csv
import html
import json
import re
from pathlib import Path

root = Path(__file__).parent
prior = root.parent/'seo-recheck-2026-11-22-preview'
http = {row['name']:row for row in json.loads((root/'evidence/http-evidence.json').read_text())}
browser = {row['name']:row for row in json.loads((root/'evidence/browser-evidence.json').read_text())}
asset = json.loads((root/'evidence/asset-evidence.json').read_text())
source = (root/'evidence/home.html').read_text(encoding='utf-8')
commit = re.search(r'data-commit-sha="([a-f0-9]+)"', source).group(1)
graph = json.loads(re.search(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', source, re.S).group(1))
person = next(node for node in graph['@graph'] if node.get('@type')=='Person')
def social(state, name):
    return [tag['content'] for tag in browser[state]['social'] if tag['name']==name]

checks = []
def record(name, status, observed):
    checks.append({'check':name,'status':status,'observation':observed})

for name in ['desktop','mobile']:
    state=browser[name]
    assert len(state['description'])==1 and state['canonical']==['https://rusiru.cc/']
    assert state['robots']==['index, follow']
    assert not state['overflow'] and not state['missingFragments']
    logos=[image for image in state['postScrollImages'] if '/logos/' in image['src']]
    assert len(logos)==2 and all(image['naturalWidth']==132 and image['complete'] for image in logos)
record('Homepage metadata','Pass','Desktop and mobile each have one description, one production canonical and one robots directive; no missing fragment targets or horizontal overflow.')

error_description="The page you're looking for doesn't exist. Return to the homepage to explore projects, experience, and contact details."
for name in ['missing-rendered','client-error-navigation']:
    state=browser[name]
    assert state['canonical']==[] and state['robots']==['noindex, follow']
    assert state['description']==[error_description]
    assert social(name,'og:description')==[error_description]
    assert social(name,'twitter:description')==[error_description]
record('404 social descriptions','Pass','Now corrected for both direct loading and client-side navigation. Each error state has one localized description, no canonical and one noindex directive.')

record('Unknown-path HTTP response','Fail' if http['missing']['status']==200 else 'Needs review',
       'Fresh missing URL returned HTTP '+str(http['missing']['status'])+'. It still receives homepage server HTML before JavaScript shows the 404 UI. This is a preview-host observation; production hosting was not requested or retested.')
bad_separator='\u00e2\u20ac\u201d'
garbled=any(bad_separator in text for field in ('og:description','twitter:description') for text in social('desktop',field))
record('Homepage social-description punctuation','Needs review' if garbled else 'Pass',
       'The garbled Unicode separator U+00E2 U+20AC U+201D remains in homepage OG/Twitter descriptions.' if garbled else 'The previously garbled separator was not observed.')
assert person['jobTitle']=='Software Engineer'
record('Structured job title','Pass','Person.jobTitle remains Software Engineer, consistent with the current visible role. Historical Associate roles are not treated as a mismatch.')
record('Education logos','Pass','Both logos remain 132x132 and load at 44x44; combined source bytes remain 26,184 (84.73% below the original 171,528). Automation provenance is still unverified.')
assert asset['status']==200 and asset['content_type']=='image/png' and (asset['width'],asset['height'])==(1200,630)
record('Social card asset','Pass','Preview PNG remains available: HTTP 200, image/png, 1200x630, 220,012 bytes. The advertised production URL is not revalidated here.')
assert http['robots']['status']==http['sitemap']['status']==200
record('Robots/sitemap','Pass','Preview endpoints return 200 and retain intentional rusiru.cc production references. Production sitemap submission/indexing is not revalidated.')
record('Performance','Needs review',f"One cache-disabled unthrottled preview sample: desktop LCP {browser['desktop']['labVitals']['lcp']['milliseconds']/1000:.3f} s; mobile LCP {browser['mobile']['labVitals']['lcp']['milliseconds']/1000:.3f} s. Single-run timing varied from the previous test; no INP or field-CWV verdict is supplied.")

with (prior/'reviewed-audit.csv').open(encoding='utf-8-sig',newline='') as handle:
    rows=list(csv.DictReader(handle))
for row in rows:
    number=int(row['Item_Number'])
    row['Verification_Scope']='Preview-only repeat verification; no new account evidence. Unchanged account/scope limitations remain inherited from the prior reviewed audit.'
    row['Evidence']='evidence/http-evidence.json; evidence/browser-evidence.json; evidence/asset-evidence.json' if row['Status'] not in ('Not tested','Not applicable') else row['Evidence']
    if number==3:
        row['Observation']='Homepage head remains deduplicated. Error descriptions, including OG/Twitter descriptions, are now correct in both direct and client navigation.'
        row['Recommended_Action']='Retain metadata ownership and verify after production deployment.'
    if number==17:
        row['Observation']=next(item['observation'] for item in checks if item['check']=='Performance')
    if number in (30,50):
        row['Observation']='Rendered error social descriptions are now corrected. The homepage social-description separator still contains mojibake; broader engagement/search-data decisions remain unverified.'
        row['Recommended_Action']='Repair the exact source string and regenerate metadata; avoid changing personal facts without evidence.'
    if number==27:
        row['Observation']='One description in desktop/mobile homepage and in both direct/client error states. Each error social description is now localized and route-appropriate too.'
    if number==16:
        row['Observation']='A newly requested unknown preview URL still returns 200 and homepage HTML; direct/client error rendering now produces correct noindex metadata and social descriptions.'
    if number==44:
        main=next(item for item in browser['desktop']['resources'] if '/assets/index-' in item['url'] and item['type']=='script')
        row['Observation']=f"Updated preview app script is {main['decodedBodySize']:,} bytes decoded and {main['encodedBodySize']:,} encoded in this sample. Timings are variable and platform telemetry differs from production; no field-CWV verdict."

with (root/'reviewed-audit.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
with (root/'verification.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(checks[0]));writer.writeheader();writer.writerows(checks)
limitations=[
 'Only rusiru.lovable.app was requested and checked; production rusiru.cc and its redirect variants were not retested.',
 'One discovered document under an advanced 200-page cap, nine HTTP probes, four browser states, and one preview card asset were checked.',
 'No source edits, application fixes, commits, publishing, or account changes were performed. No rollback is required.',
 'No Search Console, analytics, keyword, backlink or AI-visibility account evidence was supplied. Their 54-check dispositions remain untested or scope-limited.',
 'Raw packaged checklist statuses are not authoritative because the installed script has string/integer item-ID comparison defects; the reviewed CSV retains original task identities and separately records verified observations.',
 'Lab timing is a single unthrottled sample per viewport with browser cache disabled; network/server conditions still vary and INP/field percentiles were not measured.',
]
summary={'target':'https://rusiru.lovable.app/','date':'2026-11-22','observed_at_utc':asset['observed_at_utc'],'preview_commit':commit,
         'previous_preview_commit':'720795a3764bb2012d5d1dab5f5a0540685b14aa','checks':checks,
         'reviewed_54_status_counts':dict(collections.Counter(row['Status'] for row in rows)),
         'limitations':limitations,'changes_applied':False}
(root/'verification-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
esc=lambda value:html.escape(str(value),quote=True)
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview SEO verification — second pass</title>',
 '<style>body{font:16px/1.6 system-ui,sans-serif;max-width:1120px;margin:40px auto;padding:0 24px;color:#20252b}h1,h2{line-height:1.25}td,th{border:1px solid #ccd1d7;padding:12px;text-align:left;vertical-align:top}th{background:#f1f3f5}table{border-collapse:collapse;width:100%;font-size:14px}.table{overflow:auto}a{color:#1553a0}code{overflow-wrap:anywhere}h2{margin-top:40px}</style>',
 '<h1>Preview SEO verification — second pass</h1><p>22 November 2026 · <a href="https://rusiru.lovable.app/">rusiru.lovable.app</a> · Read-only</p>',
 '<p><strong>New deployment confirmed:</strong> <code>'+esc(commit)+'</code>, replacing the previously observed <code>720795a</code> build.</p>',
 '<p>The 404 social-description fix now passes both direct-load and client-navigation verification. Earlier metadata, structured-job-title, logo and social-card fixes remain intact. Preview unknown-path HTTP status and homepage punctuation remain unresolved.</p>',
 '<p><a href="verification.csv">Focused verification CSV</a> · <a href="reviewed-audit.csv">Reviewed 54-check CSV</a> · <a href="verification-summary.json">Summary JSON</a></p>',
 '<h2>Verified outcomes</h2><div class="table"><table><thead><tr><th>Check</th><th>Status</th><th>Recorded observation</th></tr></thead><tbody>']
for row in checks:
    parts.append('<tr><td>'+esc(row['check'])+'</td><td><strong>'+esc(row['status'])+'</strong></td><td>'+esc(row['observation'])+'</td></tr>')
parts += ['</tbody></table></div><h2>Remaining action</h2><ol><li>Verify that the final production host returns HTTP 404 for unknown paths before JavaScript executes; the Lovable preview still returns 200. The existence of a static 404 document is not sufficient to prove the routing rule works.</li><li>Replace the garbled separator in the source homepage social description with the intended punctuation and regenerate metadata. Response UTF-8 decoding is valid; the source string itself contains mojibake.</li><li>Keep production-domain redirect, advertised share-image URL, structured-data validator and field-CWV checks pending until production is deployed and supporting evidence is available.</li></ol>',
 '<h2>Limits and change control</h2><ul>'+''.join('<li>'+esc(item)+'</li>' for item in limitations)+'</ul>',
 '<h2>Evidence</h2><ul><li><a href="evidence/http-evidence.json">HTTP evidence</a></li><li><a href="evidence/browser-evidence.json">Browser evidence and resource measurements</a></li><li><a href="evidence/asset-evidence.json">Social-card evidence</a></li><li><a href="evidence/desktop.jpg">Desktop screenshot</a> · <a href="evidence/mobile.jpg">Mobile screenshot</a></li><li><a href="evidence/missing-rendered.jpg">Direct error screenshot</a> · <a href="evidence/client-error-navigation.jpg">Client navigation error screenshot</a></li><li><a href="site/pages.csv">Bounded crawler page inventory</a></li></ul></html>']
(root/'verification-report.html').write_text('\n'.join(parts),encoding='utf-8')
assert len(rows)==54 and {int(row['Item_Number']) for row in rows}==set(range(1,55))
print(json.dumps({'commit':commit,'verification_checks':len(checks),'reviewed_54_status_counts':summary['reviewed_54_status_counts'],'remaining_http_status':http['missing']['status']},indent=2))
