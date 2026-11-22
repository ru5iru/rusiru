"""Build a preview-only comparison from recorded evidence; never changes the app."""
import collections
import csv
import html
import json
import re
from pathlib import Path

OUT = Path(__file__).parent
BASE = OUT.parent/'seo-audit-2026-11-22'
HTTP = json.loads((OUT/'evidence/http-evidence.json').read_text())
BROWSER = json.loads((OUT/'evidence/browser-evidence.json').read_text())
ASSET = json.loads((OUT/'evidence/asset-evidence.json').read_text())
http = {r['name']:r for r in HTTP}
browser = {r['name']:r for r in BROWSER}
with (BASE/'reviewed-audit.csv').open(encoding='utf-8-sig', newline='') as handle:
    rows = list(csv.DictReader(handle))

updates = {
 3: ('Pass','Preview server HTML and rendered homepage each have one canonical, description and robots directive; OG/Twitter image tags are now present. Scope is the observed preview homepage.','Keep one metadata owner. Check the residual social-description issue on rendered errors separately.'),
 4: ('Pass','Preview robots.txt returns 200 and allows crawling, while intentionally referencing the production sitemap at https://rusiru.cc/sitemap.xml.','Preserve production discovery settings; separately decide whether preview URLs should be indexable.'),
 5: ('Needs review','Preview sitemap returns valid XML and lists https://rusiru.cc/. That is the intended production URL, not a preview canonicalization defect. Search-engine submission and production deployment are not rechecked.','After release, verify production sitemap delivery and webmaster-tool processing.'),
 7: ('Needs review','Preview homepage is index,follow with a single production canonical. The unknown URL still returns 200/homepage HTML before rendering noindex and a 404 UI. Actual Google indexing is unknown.','Verify true missing-path HTTP 404 behavior on the final hosting configuration; keep the intended production canonical.'),
 14: ('Pass','Certificate-verified HTTPS preview requests and observed browser resource loads succeeded. The preview HTTP URL redirects to HTTPS. Production TLS was not retested.','Maintain HTTPS and validate the production domain after release.'),
 15: ('Not tested','Production HTTP/www domain consolidation cannot be revalidated from a Lovable preview; rusiru.cc variants were deliberately not requested in this recheck.','Retest production host/scheme variants after deployment.'),
 16: ('Fail','The preview unknown path returns HTTP 200 with the homepage title, index,follow and fallback content. JavaScript subsequently displays the improved 404 UI and noindex. /404.html is deployed but does not establish the unknown-path HTTP status.','Ensure the production host serves the static error document with HTTP 404 for unknown paths. This is observed on the preview host, not proof the updated Netlify configuration is wrong.'),
 17: ('Needs review','With cache disabled/cleared, one preview desktop run observed LCP 1.328 s/CLS 0.0136; mobile observed LCP 0.764 s/CLS 0.0159. Both are unthrottled lab samples, not field CWV.','Use repeated controlled runs and field LCP/INP/CLS when available. Different host/cache/network conditions prevent attributing improvement solely to code.'),
 18: ('Needs review','All rendered preview fragment targets resolve and no same-host resource HTTP errors were observed. Social-card preview copy returns 200 image/png. Outbound blog/credential destinations were not audited.','Perform a separately scoped outbound check and verify production share-image URL after deployment.'),
 19: ('Pass','Observed preview resource/href/src URLs use HTTPS; no same-host insecure resource was observed. The older local source scanner found no automatic HTTP-upgrade candidates.','Keep HTTPS assets. Scope is the recorded preview and the explicitly older local checkout.'),
 20: ('Needs review','1440px desktop and 390px mobile views have no horizontal overflow. Controls under 24px dropped from 29/21 in the baseline to 1/1, including platform UI; a full accessibility review was not done.','Check zoom, keyboard behavior, actual tap-target spacing and additional devices. Do not treat the platform badge as application source.'),
 21: ('Pass','Preview serves a one-page portfolio at / and points to the intended production root canonical. Section anchors remain document fragments.','Maintain readable future page paths and intentional handling of index.html aliases.'),
 22: ('Needs review','Preview JSON-LD parses and now states Software Engineer, matching the current visible role. The unverified ProfilePage dateCreated is no longer emitted. Formal Rich Results/schema validation is not completed.','Validate the final deployed graph with the appropriate validator; retain only verified factual dates.'),
 23: ('Pass','Seven primary portfolio sections and their fragment targets are present in server HTML and the rendered preview. One same-host document was discovered by the bounded crawler.','Keep future indexable pages linked from normal anchors.'),
 24: ('Pass','The one tested preview scheme redirect is HTTP 301, not 302. Production redirect rules were not retested.','Recheck production rules after release. Scope: preview HTTP-to-HTTPS only.'),
 25: ('Not tested','The previous two-hop HTTP www chain was on rusiru.cc. It cannot be assessed from the preview host and was not retested.','Verify the final production redirect chain after deployment.'),
 26: ('Needs review','Preview has a descriptive title in raw and rendered HTML. Actual search-selected title, truncation and CTR remain unverified.','Use search-performance evidence before rewriting the title.'),
 27: ('Pass','Preview desktop and mobile each have one description. The rendered error page also has one route-appropriate description. The prior duplicate-description defect is fixed in the observed states.','Retain ownership markers/single-owner behavior and confirm after production deployment.'),
 28: ('Pass','The preview homepage has one H1 in raw and rendered states, containing the person name. No duplicate primary heading was observed.','Preserve the clear heading hierarchy.'),
 30: ('Needs review','Substantial portfolio content remains crawlable and the previous job-title conflict is fixed. The social-description punctuation and error social descriptions still need copy cleanup; performance evidence for pruning is absent.','Correct the verified metadata copy issues; use engagement/search data for broader content decisions.'),
 31: ('Pass','All three preview images have descriptive alt attributes. After scrolling, all load successfully; both education logos are now 132x132 while rendering at 44x44.','Keep alt text and aspect ratios intact during optimization.'),
 32: ('Needs review','Primary preview fragment links work and there are no missing fragment targets. Cross-site topic mapping and contextual link coverage remain unverified.','Evaluate additional case-study routes only when useful content justifies them.'),
 35: ('Needs review','Current visible and structured job titles now agree. Full biographical/factual accuracy is not independently verified. OG/Twitter description text contains mojibake, also present in the baseline, rather than a newly proven regression.','Clean the garbled separator in the configuration/locale source and maintain verified personal facts.'),
 42: ('Pass','Preview retains readable static portfolio content, semantic headings and linked entity JSON-LD. Content extraction is not entirely dependent on JavaScript.','Preserve server-readable content; this does not prove AI-system visibility.'),
 43: ('Pass','Preview llms.txt is available and references the intended production sitemap. Its optional publication is not treated as evidence of ranking or AI visibility.','Keep it aligned with the actual site content without prioritizing it over verified defects.'),
 44: ('Needs review','Preview is responsive and the initial application script is 397,129 bytes decoded/125,802 compressed, versus 403,158/122,786 in the baseline. Lovable adds a separate telemetry script and badge, so payloads/hosts differ.','Use controlled production profiling; do not infer a field-CWV pass or code-only speed gain from these samples.'),
 45: ('Pass','Deployed preview preserves the one-page, seven-section information architecture with working primary anchors. The local checkout is older and is not the source of truth for the new implementation.','Keep site navigation and canonical-page sitemap aligned.'),
 46: ('Needs review','The served-logo defect is fixed: both logos are 132px and total 26,184 bytes versus 171,528, an 84.73% reduction. Whether optimization is repeatably automated cannot be confirmed from the older local source.','Confirm the optimization command/pipeline in the updated source before calling the full automation checklist complete.'),
 47: ('Needs review','A static branded 404 document now exists, but preview unknown paths still return 200. No historical traffic/backlink evidence was supplied to prioritize retired URLs.','Verify production HTTP 404s and evaluate valuable historical URLs using authoritative evidence.'),
 50: ('Needs review','Preview copy and UI remain readable, but social descriptions contain a garbled separator. Error social-description tags still retain homepage copy.','Repair those exact metadata strings without inventing or replacing personal claims.'),
 51: ('Needs review','Project and credential links remain present; their remote destinations were not crawled in this preview recheck.','Check actual destinations in a separately authorized outbound/blog audit.'),
 52: ('Needs review','Social-preview image tags were added and the matching preview PNG is available at 1200x630. Project screenshots/diagrams remain an optional content choice, not a verified indexing defect.','Verify the advertised production image URL after release; add further visuals only when they help visitors.'),
}
for row in rows:
    number = int(row['Item_Number'])
    row['Website']='https://rusiru.lovable.app/'
    row['Audit_Date']='2026-11-22'
    if number in updates:
        row['Status'],row['Observation'],row['Recommended_Action']=updates[number]
    row['Evidence']='evidence/http-evidence.json; evidence/browser-evidence.json; evidence/asset-evidence.json' if row['Status'] not in ('Not tested','Not applicable') else 'Account/scope limitation described in Observation'
    row['Reviewed_Priority']='High' if number==16 else 'Medium' if row['Status']=='Needs review' else ''
    if number in (49,53):
        row['Observation']='No long-form blog article route is hosted on the audited preview. The blog subdomain was not crawled.'

comparison=[
 {'id':'SEO-01','finding':'Missing-path HTTP 404 handling','result':'Partially fixed / hosting validation pending','before':'Unknown production URL returned 200 and showed an unstyled client 404.','now':'Static branded /404.html exists; rendered unknown page has noindex and no canonical. The preview still returns 200/homepage HTML for unknown paths.','next':'Retest the final production hosting rule after deployment; preview behavior cannot confirm Netlify behavior.'},
 {'id':'SEO-02','finding':'Duplicate/conflicting description, canonical and robots tags','result':'Fixed in observed preview states','before':'Homepage had two descriptions/two canonicals; error route had conflicting index/noindex and canonicals.','now':'Homepage has one description/canonical/robots tag; rendered error has one error description, no canonical and one noindex. A separate residual social-description issue is recorded below.','next':'Verify the same tag counts on production after publishing.'},
 {'id':'SEO-03','finding':'Oversized education logos','result':'Served assets fixed; automation not verified','before':'500px and 337px PNGs totaling 171,528 bytes displayed at 44px.','now':'Both are 132px; 9,227 + 16,957 = 26,184 bytes, 84.73% smaller. Both load at 44px on desktop/mobile.','next':'Confirm a repeatable optimization workflow in the updated source.'},
 {'id':'SEO-04','finding':'Structured job-title mismatch and unverified profile date','result':'Fixed in observed preview markup','before':'Person.jobTitle said Associate Software Engineer while current visible role said Software Engineer.','now':'Person.jobTitle is Software Engineer, matching the current visible role. ProfilePage no longer emits the unverified dateCreated. Historical Associate roles remain valid history, not a conflict.','next':'Validate final structured data on production; do not reintroduce unverified dates.'},
 {'id':'SEO-05','finding':'Loading performance investigation','result':'Better lab observation; field outcome unverified','before':'One cold desktop LCP was 4.636 s; the baseline mobile sample used a warm cache.','now':'Cache-disabled preview samples: desktop 1.328 s/CLS 0.0136; mobile 0.764 s/CLS 0.0159. Different hosting, time and measurement conditions prevent code-only attribution. No INP/field percentile is available.','next':'Run repeated controlled tests and review field data after production deployment.'},
 {'id':'SEO-06','finding':'Missing social share image','result':'Fixed on preview; production asset check pending','before':'summary_large_image was declared with no og:image/twitter:image.','now':'Both image tags exist with alt/dimensions. Preview image returns 200 image/png, 1200x630, 220,012 bytes. Tags intentionally advertise the production asset URL.','next':'Ensure the advertised rusiru.cc image URL returns the new PNG after release.'},
 {'id':'SEO-07','finding':'Two-hop HTTP www production redirect','result':'Not retested: production-only','before':'http://www.rusiru.cc/ required two 301 hops.','now':'Only preview HTTP-to-HTTPS was checked (one 301). No claim is made about the new production chain.','next':'Check apex/www HTTP/HTTPS variants on the final host after release.'},
]
followups=[
 {'priority':'High','title':'Unknown paths still return 200 on the preview host','evidence':'evidence/http-evidence.json: missing status 200; missing.html has homepage title/index,follow; browser-evidence.json later shows a noindex 404 UI.','action':'Verify static 404 generation and final hosting configuration together after deployment. Do not mark server response behavior fixed solely because /404.html exists.'},
 {'priority':'Low','title':'Rendered error social descriptions retain homepage copy','evidence':'missing-rendered og:title/twitter:title correctly become Page Not Found, but og:description and twitter:description still describe the portfolio. The direct static 404 document has correct error descriptions.','action':'Make the dynamic error head use the localized error descriptions too, then check direct navigation and client navigation.'},
 {'priority':'Low','title':'Social description punctuation is garbled','evidence':'Browser OG/Twitter description contains Unicode U+00E2 U+20AC U+201D where an em dash is intended. The same mojibake occurs in baseline evidence, so this is newly noticed, not a proven new regression.','action':'Correct the source description string with proper UTF-8 punctuation and regenerate; raw response is valid UTF-8, so changing HTTP charset alone will not repair it.'},
]

counts=dict(collections.Counter(row['Status'] for row in rows))
preview_html=(OUT/'evidence/home.html').read_text(encoding='utf-8')
commit_match=re.search('data-commit-sha="([a-f0-9]+)"',preview_html)
provenance={
 'preview_commit':commit_match.group(1) if commit_match else None,
 'local_commit':'c3bc012',
 'local_source_status':'Older than the preview; no pull, reset or source mutation was performed.',
 'raw_scanner':{'files_scanned':85,'heuristic_findings':5,'caveat':'Includes raw templates, the design prototype and a prior audit HTML artifact. These warnings do not establish defects in the deployed preview.'},
}
limitations=[
 'Preview only: rusiru.cc and its www variants were not refetched. No fixes are claimed live in production.',
 'The intended production canonical, sitemap locations and share-image URLs remain on rusiru.cc. Cross-host canonical references are expected here, not automatic defects.',
 'The 200-page advanced cap discovered one same-host HTML page. Nine supplemental HTTP endpoints, three browser states and one preview image were checked.',
 'Preview robots.txt permits crawling and its homepage is index,follow. A production canonical is a hint, not a preview access control. Decide preview indexation policy separately; do not accidentally add production noindex.',
 'Local source is behind deployed preview commit '+str(provenance['preview_commit'])+'. New fix verification relies on preview HTTP/browser evidence, not stale source line assumptions.',
 'No GSC, Bing, GA4, search-performance, backlink, keyword, competitor or AI-visibility evidence was supplied. Those account-dependent checks remain untested.',
 'Lab LCP/CLS are single unthrottled cache-disabled observations. No Lighthouse score, INP measurement or real-user CWV pass/fail is reported. Cross-host before/after timing is not a controlled experiment.',
 'The packaged auditor still emits all 54 statuses as Not tested because it compares string CSV IDs with integers; raw files are preserved. The reviewed checklist is the authoritative human-reviewed result for this recheck.',
 'No source edits, automatic fixes, commits, deployment or account changes were made. proposed_fixes.patch is empty; no rollback is needed.',
]

with (OUT/'reviewed-audit.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
with (OUT/'comparison.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(comparison[0]));writer.writeheader();writer.writerows(comparison)
summary={'target':'https://rusiru.lovable.app/','production_canonical':'https://rusiru.cc/','date':'2026-11-22',
         'scope':'Advanced preview-only re-audit against prior production evidence','status_counts':counts,
         'comparison':comparison,'remaining_findings':followups,'source_provenance':provenance,'limitations':limitations,'changes_applied':False}
(OUT/'reviewed-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')

esc=lambda value:html.escape(str(value),quote=True)
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEO fixes recheck — Lovable preview</title>',
 '<style>body{font:16px/1.6 system-ui,sans-serif;color:#20252b;max-width:1180px;margin:40px auto;padding:0 24px}h1,h2,h3{line-height:1.25}h2{margin-top:44px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ccd1d7;text-align:left;padding:10px;vertical-align:top}th{background:#f1f3f5}.table{overflow:auto}a{color:#1553a0}article{border-top:2px solid #33424d;padding-top:12px;margin-top:26px}.status{font-weight:650}code{overflow-wrap:anywhere;background:#f2f4f6}@media print{body{margin:0;font-size:11px}article{break-inside:avoid}}</style>',
 '<h1>SEO fixes recheck — Lovable preview</h1><p>22 November 2026 · Target: <a href="https://rusiru.lovable.app/">rusiru.lovable.app</a> · Read-only</p>',
 '<p><strong>This report verifies the preview, not a production release.</strong> The strongest verified changes are deduplicated metadata, corrected structured job title, resized logos and a deployed social preview image. Unknown preview paths still return HTTP 200.</p>',
 '<p>54 reviewed checks: '+esc(', '.join(f'{v} {k}' for k,v in counts.items()))+'. Checklist dispositions are not a ranking score.</p>',
 '<p><a href="reviewed-audit.csv">54-check CSV</a> · <a href="comparison.csv">Before/after comparison CSV</a> · <a href="reviewed-summary.json">Reviewed JSON</a> · <a href="evidence/browser-evidence.json">Browser evidence</a></p>',
 '<h2>Original seven findings: before and after</h2><div class="table"><table><thead><tr><th>ID / finding</th><th>Disposition</th><th>Before</th><th>Preview now</th><th>Next validation</th></tr></thead><tbody>']
for row in comparison:
    parts.append('<tr><td>'+esc(row['id'])+'<br>'+esc(row['finding'])+'</td><td class="status">'+esc(row['result'])+'</td><td>'+esc(row['before'])+'</td><td>'+esc(row['now'])+'</td><td>'+esc(row['next'])+'</td></tr>')
parts += ['</tbody></table></div><h2>Remaining preview findings</h2>']
for issue in followups:
    parts += ['<article><h3>'+esc(issue['priority'])+' · '+esc(issue['title'])+'</h3><p><strong>Evidence:</strong> '+esc(issue['evidence'])+'</p><p><strong>Proposed action:</strong> '+esc(issue['action'])+'</p></article>']
parts += ['<h2>Production release verification</h2><ol><li>Unknown paths must return HTTP 404 before JavaScript, with appropriate noindex error content.</li><li>Confirm one canonical, description and robots tag per route, including dynamic error navigation and social descriptions.</li><li>Verify production PNG card URL returns image/png at 1200x630, and both 132px logos remain optimized.</li><li>Confirm the production sitemap and robots.txt, then check all apex/www HTTP/HTTPS redirects.</li><li>Validate structured data and review field/search-account evidence when it becomes available.</li></ol>',
 '<h2>Scope and limitations</h2><ul>'+''.join('<li>'+esc(item)+'</li>' for item in limitations)+'</ul>',
 '<p><strong>Source provenance:</strong> preview commit <code>'+esc(provenance['preview_commit'])+'</code>; local checkout <code>c3bc012</code>. Deployment/hosting implementations may differ. No source changes were made.</p>',
 '<h2>All 54 reviewed checklist items</h2><div class="table"><table><thead><tr><th>ID</th><th>Task</th><th>Status</th><th>Observation</th><th>Next action</th><th>Original source</th></tr></thead><tbody>']
for row in rows:
    parts.append('<tr><td>'+esc(row['Item_Number'])+'</td><td>'+esc(row['Category'])+'<br><strong>'+esc(row['Checklist_Task'])+'</strong></td><td class="status">'+esc(row['Status'])+'</td><td>'+esc(row['Observation'])+'</td><td>'+esc(row['Recommended_Action'])+'</td><td><a href="'+esc(row['Learn_More_URL'])+'">'+esc(row['Source'])+'</a></td></tr>')
parts += ['</tbody></table></div><h2>Evidence files</h2><ul><li><a href="evidence/http-evidence.json">HTTP responses and headers</a></li><li><a href="evidence/asset-evidence.json">Social card HTTP evidence</a> · <a href="evidence/social-card.png">Preview social card</a></li><li><a href="evidence/desktop.jpg">Desktop</a> · <a href="evidence/mobile.jpg">Mobile</a> · <a href="evidence/missing-rendered.jpg">Rendered error page</a></li><li><a href="code/code_findings.csv">Raw older-source heuristic scan</a> · <a href="site/pages.csv">Crawler page inventory</a></li></ul>',
 '<p>Primary guidance: <a href="https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors">Google soft-404 guidance</a> · <a href="https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics">JavaScript metadata</a> · <a href="https://docs.netlify.com/manage/routing/redirects/redirect-options/">Netlify 404 handling</a> · <a href="https://web.dev/articles/vitals">Lab/field measurement limits</a>.</p></html>']
(OUT/'reviewed-report.html').write_text('\n'.join(parts),encoding='utf-8')
print(json.dumps({'status_counts':counts,'comparison_items':len(comparison),'report':str(OUT/'reviewed-report.html')},indent=2))
