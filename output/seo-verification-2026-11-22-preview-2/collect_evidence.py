import hashlib
import ipaddress
import json
import socket
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

OUT = Path(__file__).parent / 'evidence'
OUT.mkdir(exist_ok=True)
ALLOWED = {'rusiru.lovable.app'}

def validate(url):
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme not in ('http', 'https') or parsed.hostname not in ALLOWED:
        raise ValueError('Out-of-scope request: ' + url)
    for record in socket.getaddrinfo(parsed.hostname, None, type=socket.SOCK_STREAM):
        if not ipaddress.ip_address(record[4][0]).is_global:
            raise ValueError('Non-public destination')

class Redirects(urllib.request.HTTPRedirectHandler):
    def __init__(self):
        self.chain = []
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        validate(newurl)
        self.chain.append({'from': req.full_url, 'status': code, 'to': newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = []
        self.links = []
        self.scripts = []
        self.images = []
        self.ids = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta': self.meta.append(a)
        if tag == 'link': self.links.append(a)
        if tag == 'script': self.scripts.append(a)
        if tag == 'img': self.images.append(a)
        if a.get('id'): self.ids.append(a['id'])

results = []
robots = None
paths = [('robots', 'https://rusiru.lovable.app/robots.txt'), ('home', 'https://rusiru.lovable.app/'), ('sitemap', 'https://rusiru.lovable.app/sitemap.xml'), ('llms', 'https://rusiru.lovable.app/llms.txt'), ('manifest', 'https://rusiru.lovable.app/site.webmanifest'), ('missing', 'https://rusiru.lovable.app/__seo-audit-not-found-20261122-v2'), ('index-html', 'https://rusiru.lovable.app/index.html'), ('error-document', 'https://rusiru.lovable.app/404.html'), ('http', 'http://rusiru.lovable.app/')]
for name, url in paths:
    if robots and not robots.can_fetch('SEOWebsiteAuditor/2.0', url):
        results.append({'name': name, 'requested_url': url, 'skipped': 'robots.txt'})
        continue
    redirects = Redirects()
    opener = urllib.request.build_opener(redirects)
    started = time.monotonic()
    record = {'name': name, 'requested_url': url, 'observed_at_utc': datetime.now(timezone.utc).isoformat()}
    try:
        validate(url)
        request = urllib.request.Request(url, headers={'User-Agent': 'SEOWebsiteAuditor/2.0', 'Accept': '*/*', 'Cache-Control': 'no-cache'})
        try:
            response = opener.open(request, timeout=15)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000: raise ValueError('Response exceeds 2 MB')
            record.update(status=response.status, final_url=response.geturl(), headers=dict(response.headers),
                          bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(), redirects=redirects.chain)
            suffix = '.html' if 'html' in response.headers.get('Content-Type', '') else '.txt'
            target = OUT / (name + suffix)
            target.write_bytes(raw)
            record['body_file'] = target.name
            if name == 'robots' and response.status == 200:
                robots = urllib.robotparser.RobotFileParser()
                robots.parse(raw.decode('utf-8', errors='replace').splitlines())
            if 'html' in response.headers.get('Content-Type', ''):
                parser = Head()
                parser.feed(raw.decode('utf-8', errors='replace'))
                record.update(meta=parser.meta, links=parser.links, scripts=parser.scripts,
                              images=parser.images, ids=parser.ids)
    except Exception as error:
        record.update(error=str(error), redirects=redirects.chain)
    record['elapsed_seconds'] = round(time.monotonic() - started, 3)
    results.append(record)
    print(json.dumps({k: v for k, v in record.items() if k in ('name', 'status', 'error', 'redirects', 'bytes', 'elapsed_seconds')}), flush=True)
    (OUT / 'http-evidence.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    time.sleep(0.25)
