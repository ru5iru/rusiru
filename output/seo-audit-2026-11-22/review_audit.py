"""Assemble a reviewed report from the recorded live evidence; no site changes."""
import collections
import csv
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
SOURCE = Path('C:/Users/rusiru.r/.codex/skills/seo-website-auditor/references/checklist.csv')
HTTP = json.loads((ROOT/'evidence/http-evidence.json').read_text(encoding='utf-8'))
BROWSER = json.loads((ROOT/'evidence/browser-evidence.json').read_text(encoding='utf-8'))
records = {r['name']:r for r in HTTP}
rendered = {r['name']:r for r in BROWSER}

# Reviewed statuses retain the original checklist IDs, tasks, and attribution.
# Public observations are our measurements, never represented as user-provided account exports.
review = {
 1: ('Not tested','Verification meta tag exists, but Search Console ownership, Bing setup, and coverage reports are not accessible.','Obtain dated property verification and indexing exports.',''),
 2: ('Not tested','No account evidence supplied. No GA4 tag detected in inspected HTML/source; that does not prove an account is absent.','Decide whether analytics is wanted; inspect GA4 account evidence if available.',''),
 3: ('Needs review','Server HTML has metadata and JSON-LD; rendered homepage contains two descriptions and two canonical tags.','Give server metadata and React Helmet a single ownership strategy.','Medium'),
 4: ('Pass','Live robots.txt returns 200, allows the audited homepage/assets, and references https://rusiru.cc/sitemap.xml.','Maintain the current canonical sitemap directive.',''),
 5: ('Needs review','Live XML sitemap returns 200, parses, and lists only the canonical homepage; submission to Google/Bing is unverified.','Check sitemap submission and processing in webmaster tools. Do not add fragment sections as separate pages.','Low'),
 6: ('Not tested','Manual-actions and security reports require Search Console access.','Review dated Search Console reports.',''),
 7: ('Needs review','Homepage returns 200 with index,follow and the correct canonical; actual indexing and Google-selected canonical remain unknown. Unknown routes have conflicting rendered metadata.','Inspect homepage in Search Console and correct error-page responses.','Medium'),
 14: ('Pass','Certificate-verified HTTPS requests succeeded for apex and www; homepage browser resources use HTTPS and HSTS is present.','Maintain TLS and HTTPS assets; this is a bounded observation, not a security penetration test.',''),
 15: ('Pass','HTTP apex and HTTPS www permanently redirect to https://rusiru.cc/; HTTP www reaches the same preferred origin through two 301 hops.','Keep canonical origin consistent; simplify the two-hop variant if practical.',''),
 16: ('Fail','The intentional missing URL returns 200 and identical homepage HTML (same SHA-256), then renders a 404 via JavaScript. netlify.toml rewrites /* to /index.html with status 200.','Serve an actual HTTP 404 and an appropriate static error response for unknown paths.','High'),
 17: ('Needs review','One unthrottled cold desktop run observed LCP 4.636 s and CLS 0.0123. Mobile used the same browser cache and observed LCP 2.008 s; runs are not directly comparable. INP and field CWV were not measured.','Run repeated mobile Lighthouse diagnostics and inspect CrUX/Search Console field data before declaring CWV pass/fail. Investigate font/JS loading and removal/replacement of initial content.','Medium'),
 18: ('Needs review','All rendered homepage fragment targets exist; observed same-host resources returned no HTTP errors. Outbound destinations and complete historical URL inventory were not crawled.','Run a scoped outbound-link check, including blog and credential URLs, separately.','Low'),
 19: ('Pass','No insecure same-host href/src links were found by the source scan; inspected live HTML and browser resource URLs use HTTPS.','Retain HTTPS resource URLs. Scope: observed homepage/resources.',''),
 20: ('Needs review','Desktop 1440px and mobile 390px rendered without horizontal overflow. Mobile has 21 visible controls below 24px in at least one dimension; spacing/inline exceptions need manual accessibility review.','Check tap-target spacing, keyboard navigation, zoom and legibility across the full page.','Medium'),
 21: ('Pass','The intended indexable portfolio route is the short canonical root /. Section fragments are navigation within that document.','Keep distinct future pages at descriptive stable paths; review /index.html alias handling.',''),
 22: ('Needs review','Live JSON-LD parses and contains linked Person, ProfilePage, WebSite, ItemList and Blog nodes. Person.jobTitle says Associate Software Engineer while visible current role says Software Engineer. Rich Results/schema validation and factual verification remain incomplete.','Confirm current job title in site.json and validate the emitted graph. Verify dateCreated rather than assuming the configured date is accurate.','Medium'),
 23: ('Pass','Seven primary sections are present in the static fallback and rendered navigation; all inspected fragment targets resolve. Only one canonical HTML page was discovered.','Keep new indexable pages linked in normal crawlable anchors.',''),
 24: ('Pass','Observed domain-version redirects use 301, not temporary 302; no 302 appeared in the tested chains.','Recheck if hosting redirects change. Scope: three tested domain variants only.',''),
 25: ('Needs review','http://www.rusiru.cc/ redirects to https://www.rusiru.cc/ and then https://rusiru.cc/; no loop found in the tested variants.','If hosting permits, redirect that variant directly to the preferred HTTPS apex in one hop.','Low'),
 26: ('Needs review','A complete descriptive title exists in live HTML and after rendering; SERP truncation and search-selected title cannot be determined from this sample.','Review actual Search Console queries/CTR and search appearance before rewriting title copy.','Low'),
 27: ('Needs review','Description exists in raw HTML, but React Helmet adds a second description. On a missing page the original homepage description remains beside the error description.','Deduplicate metadata and verify route-specific head output.','Medium'),
 28: ('Pass','Raw homepage HTML has one H1; rendered desktop and mobile each have one H1 containing the person name, followed by descriptive section headings.','Maintain one clear primary heading. This is not a keyword-ranking guarantee.',''),
 29: ('Not tested','No search-performance or CTR export was supplied.','Use dated query/impression/click data to evaluate copy changes.',''),
 30: ('Needs review','Substantial work, project, education and skill content is crawlable. The job-title inconsistency needs review; traffic and performance evidence for content pruning is absent.','Confirm facts and evaluate engagement/search data before removing or expanding content.','Medium'),
 31: ('Pass','All three rendered homepage images have descriptive alt attributes: portrait and two institution logos; no missing alt attributes were observed.','Keep decorative future images at alt="" and informative images descriptive. Scope: three observed images.',''),
 32: ('Needs review','Primary fragment navigation and jump links work. Topic-map-driven contextual linking and a full outbound review were not supplied.','Consider separate project case studies only if there is enough distinct useful content.','Low'),
 33: ('Not tested','Keyword targets, search queries and a cross-subdomain content inventory were not supplied.','Compare query/page performance and content intent before diagnosing cannibalization.',''),
 34: ('Not tested','Crawling found one canonical page, but no CMS, Search Console or server-log URL inventory is available to establish whether orphan URLs exist.','Compare discovered URLs with authoritative page inventory.',''),
 35: ('Needs review','Visible current experience says Software Engineer while config and JSON-LD identify Associate Software Engineer. Profile creation date is configured but not independently verified.','Confirm current facts with the owner, then align configuration and visible/structured content.','Medium'),
 40: ('Not tested','Business Profile eligibility and account evidence were not supplied. A personal portfolio does not by itself establish an eligible local business.','Determine eligibility before recommending a profile.',''),
 42: ('Pass','The server response contains semantic headings and readable text for all configured sections, plus linked entity JSON-LD. Extraction does not depend entirely on JavaScript.','Retain readable static content. This does not establish visibility or citations in AI systems.',''),
 43: ('Pass','llms.txt is published, readable, and references the correct sitemap. Its presence is recorded as an optional experiment, not an established ranking benefit.','Maintain consistency without prioritizing it over crawlability or content accuracy.',''),
 44: ('Needs review','Responsive layout and semantic fallback exist, but initial JavaScript is about 403 KB decoded (123 KB compressed) plus section chunks. Cold desktop LCP warrants investigation.','Profile initialization and font delivery; retain the established design while reducing unnecessary work.','Medium'),
 45: ('Pass','Config, source routes and live navigation agree on a one-page portfolio with seven sections. No broken primary fragment targets were observed.','Keep the sitemap aligned with actual canonical pages, not fragment sections.',''),
 46: ('Fail','Two logos render at 44x44 CSS px but use 500x500 and 337x337 PNGs, totaling 171,528 source bytes. No automated resize/compression step was found in the project workflow.','Add a repeatable optimization step and serve appropriately sized logo variants (for example 88-132px for high-density displays), preserving transparency and aspect ratio.','Medium'),
 47: ('Needs review','Unknown-path handling is incorrect, but no traffic/backlink inventory exists to decide which historical URLs should be restored, redirected or retired.','First serve correct 404s; then evaluate valuable missing URLs using search/link evidence.','Medium'),
 49: ('Not applicable','No blog article route is served on the audited hostname; blog links point to blog.rusiru.cc, which was not crawled.','Assess introductions in a separate authorized blog audit.',''),
 50: ('Needs review','Portfolio copy is readable but the long hero headline occupies much of the mobile first screen. No replacement copy or unsupported claims were introduced.','Review clarity and length with the owner while preserving the Broadsheet identity.','Low'),
 51: ('Needs review','Project, source-code, institution and credential links exist, but their destination accuracy and supporting evidence were not independently verified.','Check direct credential and project URLs before treating them as verified support for claims.','Low'),
 52: ('Needs review','Portrait and institution logos are present. Project screenshots/diagrams could help visitors evaluate the work, but their absence is not itself a technical indexing error.','Add relevant project evidence only when useful and available.','Low'),
 53: ('Not applicable','No long-form article is hosted at the audited root; portfolio section links already provide within-page navigation.','Review tables of contents separately for the blog subdomain.',''),
}
for n in [8,9,10,11,12,13,36,37,38,39,41,48,54]:
    review[n] = ('Not tested','No dated keyword, competitor, backlink, outreach or AI-visibility evidence was supplied for this check.','Collect the relevant documented evidence before assigning a pass or fail.','')

issues = [
 {'id':'SEO-01','priority':'High','title':'Missing pages return HTTP 200 and homepage HTML','items':[7,16,47],
  'evidence':'evidence/http-evidence.json (missing/home hashes); evidence/missing-rendered.jpg; netlify.toml:5-8; src/pages/NotFound.tsx:20-33',
  'impact':'Wrong success responses create a soft-404 risk. A genuine Google soft-404 classification is not confirmed without Search Console.',
  'proposal':'Generate a localized static 404.html through the existing generator and remove or narrow the blanket 200 SPA rewrite. There is only one intended public document; fragments do not require a catch-all rewrite. Use Netlify custom-404 handling or an explicitly verified 404 rule.',
  'validation':'After a preview deployment, / must return 200; a random path must return 404 before JavaScript and show an appropriate error document; /#projects, real assets, robots and sitemap must still work.',
  'reference':'https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors'},
 {'id':'SEO-02','priority':'Medium','title':'Server metadata and React Helmet create duplicate/conflicting head tags','items':[3,7,27],
  'evidence':'evidence/browser-evidence.json: homepage has two descriptions and two canonicals; missing-rendered has homepage/error canonicals and index/noindex. scripts/search-content.ts:39-50; src/pages/Index.tsx:32-38; src/pages/NotFound.tsx:20-33',
  'impact':'Duplicates on the homepage currently agree; on the error route they disagree. This complicates canonicalization and metadata maintenance; no ranking penalty is claimed.',
  'proposal':'Use one metadata owner per rendered field. For Helmet-managed tags, serialize the expected ownership markers in static output or avoid re-inserting identical homepage tags. Ensure error responses have route-appropriate metadata from the server.',
  'validation':'Count tags before and after rendering: one canonical, one description, and one appropriate robots directive on each tested route.',
  'reference':'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics'},
 {'id':'SEO-03','priority':'Medium','title':'Education logos are much larger than their displayed size','items':[17,46],
  'evidence':'evidence/browser-evidence.json: ucsc 500x500/92,158 bytes, mcg 337x337/79,370 bytes; both render at 44x44. src/components/sections/Education.tsx:30',
  'impact':'About 167.5 KiB of source PNG logo data for two small graphics, although lazy loading defers their initial mobile requests.',
  'proposal':'Create optimized high-density logo variants and reference them through siteConfig.educationLogos. Add a repeatable asset optimization command; preserve transparency and visual quality.',
  'validation':'Inspect final dimensions/bytes, verify logos at 1x/2x/3x display density and confirm no layout shift or broken paths.',
  'reference':'https://web.dev/learn/images/performance'},
 {'id':'SEO-04','priority':'Medium','title':'Structured job title differs from the current visible role','items':[22,30,35],
  'evidence':'Live JSON-LD and src/config/site.json:6 say Associate Software Engineer; rendered current experience and biography say Software Engineer. scripts/search-content.ts:21',
  'impact':'Search engines receive inconsistent professional identity information.',
  'proposal':'Confirm the current title, then update the configuration so microdata, JSON-LD and visible facts agree. Also verify that dateCreated is a real publication/profile-creation date.',
  'validation':'Compare the confirmed title with Person.jobTitle, ProfilePage microdata and visible experience after generation and deployment.',
  'reference':'https://developers.google.com/search/docs/appearance/structured-data/profile-page'},
 {'id':'SEO-05','priority':'Medium','title':'Cold-load performance needs diagnosis, not a field-CWV verdict','items':[17,44],
  'evidence':'evidence/browser-evidence.json: desktop LCP 4.636 s (hero H2), CLS 0.0123; initial script 403,158 bytes decoded / 122,786 compressed. Main CSS about 65.5 KB. Mobile 2.008 s was warm-cache.',
  'impact':'One desktop lab observation suggests loading improvements may help, but location, network and cache strongly affect this result. No INP or field percentile was measured.',
  'proposal':'Run repeated cold-cache mobile/desktop Lighthouse tests and inspect Search Console/CrUX. Profile main-bundle work, font delivery, and the deliberate clearing/replacement of static root content before React mounts.',
  'validation':'Compare repeated controlled runs and inspect field p75 LCP/INP/CLS when data exists. Do not compare these cold desktop and warm mobile samples as device scores.',
  'reference':'https://web.dev/articles/vitals'},
 {'id':'SEO-06','priority':'Low','title':'Large social preview card has no configured image','items':[3,52],
  'evidence':'evidence/home.html has twitter:card=summary_large_image but no og:image or twitter:image. scripts/search-content.ts:44-50',
  'impact':'Social link previews may lack the intended image. This is a sharing improvement, not a demonstrated Google ranking defect.',
  'proposal':'Add a share-image path to site.json, validate it in the schema and emit absolute og:image/twitter:image URLs from the generator, with relevant image text in locale data if needed.',
  'validation':'Check the deployed image returns an image MIME type and renders in actual social preview tooling.',
  'reference':'https://ogp.me/'},
 {'id':'SEO-07','priority':'Low','title':'HTTP www requires two permanent redirects','items':[15,25],
  'evidence':'evidence/http-evidence.json: http://www.rusiru.cc/ -> https://www.rusiru.cc/ -> https://rusiru.cc/ (301 + 301). Other tested variants take one hop.',
  'impact':'A small extra request for that variant; canonical consolidation already works.',
  'proposal':'If Netlify domain configuration permits, point the HTTP www variant directly at the HTTPS apex.',
  'validation':'Recheck all four scheme/host variants with certificate validation enabled; preserve one preferred origin and avoid loops.',
  'reference':'https://docs.netlify.com/manage/routing/redirects/redirect-options/'},
]

with SOURCE.open(encoding='utf-8-sig', newline='') as handle:
    tasks = list(csv.DictReader(handle))
assert len(tasks) == 54 and len(review) == 54
rows=[]
for task in tasks:
    number=int(task['Item_Number'])
    status, observation, action, priority=review[number]
    row={**task,'Status':status,'Audit_Date':'2026-11-22','Website':'https://rusiru.cc/',
         'Observation':observation,'Recommended_Action':action,'Reviewed_Priority':priority,
         'Evidence':'evidence/http-evidence.json; evidence/browser-evidence.json; source inventory' if status not in ('Not tested','Not applicable') else 'Scope/account limitation described in Observation'}
    rows.append(row)
counts=dict(collections.Counter(row['Status'] for row in rows))
with (ROOT/'reviewed-audit.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.DictWriter(handle,fieldnames=list(rows[0]))
    writer.writeheader();writer.writerows(rows)

limitations=[
 'One canonical portfolio HTML document was discovered using an advanced crawler cap of 200. A cap is not a statement that 200 pages exist or were audited.',
 'Supplemental evidence covers ten requested URL/host variants and three browser states: desktop, mobile and one intentional missing URL.',
 'No GSC, Bing, GA4, rankings, backlink, competitor, outreach or AI-visibility account evidence was supplied. Actual index status, selected canonical, clicks, CTR and manual actions remain unknown.',
 'The blog subdomain and outbound destinations were not crawled. The main-host sitemap is correctly limited to its one canonical page; fragments and external blog URLs were not added.',
 'Desktop and mobile browser samples were unthrottled and shared a browser cache. The first desktop sample was cold; mobile was warm. No Lighthouse score, INP measurement or field-CWV pass/fail is reported.',
 'Mobile screenshots show no overflow at 390px; a complete accessibility/device matrix was not performed. Lazy mobile logos were not yet requested at the initial viewport, not broken.',
 'The packaged source scanner reported four heuristic warnings: three in unprocessed index.html and one in the design prototype. Live generated metadata/H1 are present, so those warnings are not promoted to production failures.',
 'The raw packaged checklist labeled all 54 tasks Not tested because its comparisons use integer item numbers while CSV IDs are strings. Raw outputs are retained; this reviewed report and reviewed-audit.csv incorporate independently verified evidence instead.',
 'Codebase proposed_fixes.patch is empty; no safe same-host HTTP upgrades were identified. Application source, configuration and deployment were not changed by this audit.',
]
summary={'site':'https://rusiru.cc/','date':'2026-11-22','mode':'advanced, reviewed public/source evidence',
         'canonical_documents_crawled':1,'crawl_cap':200,'http_probes':len(HTTP),'browser_states':len(BROWSER),
         'source_files_scanned':78,'status_counts':counts,'issues':issues,'limitations':limitations,
         'changes_applied':False,'rollback':'No application change to roll back; delete only this audit output directory if the report is no longer wanted.'}
(ROOT/'reviewed-summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')

esc=lambda text:html.escape(str(text),quote=True)
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>rusiru.cc — Advanced SEO audit</title>',
 '<style>body{font:16px/1.6 system-ui,sans-serif;color:#20252b;background:#fff;max-width:1150px;margin:40px auto;padding:0 24px}h1,h2,h3{line-height:1.25}h2{margin-top:48px}a{color:#1553a0}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ccd1d7;text-align:left;padding:10px;vertical-align:top}th{background:#f1f3f5}.table{overflow:auto}article{border-top:2px solid #263238;margin:28px 0;padding-top:10px}.status{white-space:nowrap;font-weight:650}code{overflow-wrap:anywhere;background:#f1f3f5}small{color:#50565d}@media print{body{margin:0;font-size:11px}article{break-inside:avoid}}</style>',
 '<h1>rusiru.cc — Advanced SEO audit</h1><p>22 November 2026 · Public website + local source · Read-only</p>',
 '<p><strong>The live sitemap is correct.</strong> The highest-priority issue is missing-page handling: an unknown path returns 200 and homepage HTML before JavaScript displays a 404.</p>',
 '<p>Scope: one discovered canonical page, a 200-page crawl cap, ten supplemental HTTP probes, three browser states and 78 source files. '+esc(', '.join(f'{v} {k}' for k,v in counts.items()))+'. These are checklist dispositions, not an SEO or ranking score.</p>',
 '<p><a href="reviewed-audit.csv">All 54 reviewed checks (CSV)</a> · <a href="reviewed-summary.json">Reviewed evidence summary (JSON)</a> · <a href="site/pages.csv">Crawler pages</a> · <a href="code/code_findings.csv">Raw source findings</a></p>',
 '<h2>Prioritized findings and proposed remediation</h2>']
for issue in issues:
    parts += [f'<article><h3>{esc(issue["id"])} · {esc(issue["priority"])} · {esc(issue["title"])}</h3>',
              f'<p><strong>Evidence:</strong> {esc(issue["evidence"])}</p>',
              f'<p><strong>Implication:</strong> {esc(issue["impact"])}</p>',
              f'<p><strong>Proposed action:</strong> {esc(issue["proposal"])}</p>',
              f'<p><strong>Verification after a future fix:</strong> {esc(issue["validation"])}</p>',
              f'<p><a href="{esc(issue["reference"])}">Primary technical reference</a></p></article>']
parts += ['<h2>What is already working</h2><ul><li>Homepage responds over verified HTTPS with readable, substantial server-side HTML fallback.</li><li>robots.txt references the live, valid, canonical sitemap; both return HTTP 200.</li><li>Tested HTTP/www variants converge on the HTTPS apex with permanent redirects.</li><li>One H1 is present in raw and rendered homepage states; primary fragment navigation resolves.</li><li>Observed images have alt text, local resources load successfully, and 390px mobile rendering has no horizontal overflow.</li><li>JSON-LD is parseable and llms.txt is available; neither establishes rankings or AI citations.</li></ul>',
 '<h2>Coverage, limitations and verification</h2><ul>'+''.join('<li>'+esc(item)+'</li>' for item in limitations)+'</ul>',
 '<p><strong>Rollback:</strong> No source changes or deployment were made. No application rollback is needed.</p>',
 '<h2>All 54 checklist dispositions</h2><div class="table"><table><thead><tr><th>ID</th><th>Category / task</th><th>Status</th><th>Observation</th><th>Next action</th><th>Original source</th></tr></thead><tbody>']
for row in rows:
    parts.append('<tr><td>'+esc(row['Item_Number'])+'</td><td>'+esc(row['Category'])+'<br><strong>'+esc(row['Checklist_Task'])+'</strong></td><td class="status">'+esc(row['Status'])+'</td><td>'+esc(row['Observation'])+'</td><td>'+esc(row['Recommended_Action'])+'</td><td><a href="'+esc(row['Learn_More_URL'])+'">'+esc(row['Source'])+'</a></td></tr>')
parts += ['</tbody></table></div><h2>Recorded evidence</h2><ul><li><a href="evidence/http-evidence.json">HTTP headers, status codes, redirect chains and body hashes</a></li><li><a href="evidence/browser-evidence.json">Rendered head, links, images, resource sizes and diagnostic lab observations</a></li><li><a href="evidence/desktop.jpg">Desktop screenshot</a> · <a href="evidence/mobile.jpg">Mobile screenshot</a> · <a href="evidence/missing-rendered.jpg">Missing-page screenshot</a></li><li><a href="evidence/robots.txt">robots.txt snapshot</a> · <a href="evidence/sitemap.txt">Sitemap snapshot</a> · <a href="evidence/home.html">Homepage source snapshot</a></li></ul>',
 '<p><small>Original checklist: 54 Semrush + Ahrefs tasks supplied with the SEO Website Auditor skill. Source labels, task identifiers and original reference URLs are preserved. Account-only checks remain untested without dated evidence.</small></p></html>']
(ROOT/'reviewed-report.html').write_text('\n'.join(parts),encoding='utf-8')
print(json.dumps({'status_counts':counts,'reviewed_checks':len(rows),'findings':len(issues),'report':str(ROOT/'reviewed-report.html')},indent=2))
