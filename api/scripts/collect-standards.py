"""Archive official specification sources; preserve PDF page numbers and hashes."""
import sys,json,hashlib,datetime,urllib.request,urllib.parse,concurrent.futures,re
from pathlib import Path
sys.path.insert(0,str(Path('output/standards-tools').resolve()))
from bs4 import BeautifulSoup
ROOT=Path('output/curriculum-review/standards-mapping'); SOURCES=ROOT/'sources'; SOURCES.mkdir(parents=True,exist_ok=True)
subjects=[('Maths','mathematics','8300','mathematics-2015','mathematics-programmes-of-study'),('Science','science','8464','sciences-2016','science-programmes-of-study'),('English Language','english','8700','english-language-2015','english-programmes-of-study'),('English Literature','english','8702','english-literature-2015',None),('History','history','8145','history-2016','history-programme-of-study'),('Geography','geography','8035','geography-b-2016','geography-programmes-of-study'),('Computing','computer-science','8525','computer-science-2020','computing-programmes-of-study'),('Design & Technology','design-and-technology','8552','design-and-technology-2017','design-and-technology-programmes-of-study')]
def fetch(url):
 url=urllib.parse.quote(url,safe=':/?=&%_-.*')
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 Curriculum-source-review'})
 with urllib.request.urlopen(req,timeout=90) as r:return r.read(),r.url
def discover(item):
 id,subject,board,url=item
 try:
  raw,final=fetch(url);(SOURCES/f'{id}.html').write_bytes(raw)
  soup=BeautifulSoup(raw,'html.parser');links=[]
  for a in soup.select('a[href]'):
   u=urllib.parse.urljoin(final,a['href']);label=a.get_text(' ',strip=True)
   if '.pdf' in u.lower() and urllib.parse.urlparse(u).hostname in ['www.gov.uk','assets.publishing.service.gov.uk','qualifications.pearson.com','cdn.sanity.io','www.aqa.org.uk']:
    links.append({'url':u,'label':label})
  seen=set();links=[l for l in links if not(l['url'] in seen or seen.add(l['url']))]
  return {'id':id,'subject':subject,'board':board,'landingUrl':final,'pdfCandidates':links,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 except Exception as e:return {'id':id,'subject':subject,'board':board,'landingUrl':url,'error':str(e)}
if sys.argv[1]=='discover':
 jobs=[]
 for subject,slug,code,pearson,dfe in subjects:
  jobs.append((f'aqa-{code}',subject,'AQA',f'https://www.aqa.org.uk/subjects/{slug}/gcse/{slug}-{code}/specification'))
  jobs.append((f'edexcel-{pearson}',subject,'Edexcel',f'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/{pearson}.html'))
  if dfe:jobs.append((f'dfe-{slug}',subject.replace(' Language',''),'DfE',f'https://www.gov.uk/government/publications/national-curriculum-in-england-{dfe}'))
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(discover,jobs))
 (ROOT/'source-discovery.json').write_text(json.dumps(results,indent=2),encoding='utf8')
 for r in results:print(r['id'],json.dumps(r.get('pdfCandidates',r.get('error'))))
elif sys.argv[1]=='download':
 import fitz
 selected=json.loads((ROOT/'source-selection.json').read_text(encoding='utf8'))
 def download(r):
  try:
   existing=SOURCES/f"{r['id']}.json"
   if existing.exists():
    cached=json.loads(existing.read_text(encoding='utf8'))
    if cached.get('url')==urllib.parse.quote(r['url'],safe=':/?=&%_-.*'):return {k:v for k,v in cached.items() if k!='pages'}
   raw,url=fetch(r['url']);assert raw.startswith(b'%PDF'), 'Not a PDF'
   path=SOURCES/f"{r['id']}.pdf";path.write_bytes(raw);pdf=fitz.open(path)
   pages=[]
   for i,p in enumerate(pdf):
    bold=[s['text'] for b in p.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans'] if s['flags']&16]
    pages.append({'page':i+1,'text':p.get_text(sort=True),'boldSpans':bold})
   record={**r,'url':url,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(raw).hexdigest(),'pages':pages,'pageCount':len(pages),'metadata':pdf.metadata}
   (SOURCES/f"{r['id']}.json").write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
   return {k:v for k,v in record.items() if k!='pages'}
  except Exception as e:return {**r,'error':str(e)}
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(download,selected))
 (ROOT/'source-register.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
 for r in results:print(r['id'],r.get('pageCount',r.get('error')))
elif sys.argv[1]=='render':
 import pymupdf
 doc=pymupdf.open(SOURCES/f'{sys.argv[2]}.pdf');page=int(sys.argv[3]);out=ROOT/f'{sys.argv[2]}-page-{page}.png'
 doc[page-1].get_pixmap(matrix=pymupdf.Matrix(1.4,1.4)).save(out);print(out)
elif sys.argv[1]=='layout':
 import pymupdf
 path=SOURCES/'aqa-8300.json';record=json.loads(path.read_text(encoding='utf8'));doc=pymupdf.open(SOURCES/'aqa-8300.pdf')
 for page in record['pages']:
  if 'Basic foundation' in page['text'] and 'Higher content only' in page['text']:
   p=doc[page['page']-1]
   page['tierColumns']={k:p.get_text(clip=pymupdf.Rect(x1,80,x2,775),sort=True) for k,x1,x2 in [('basicFoundation',55,217),('additionalFoundation',217,364),('higherOnly',364,540)]}
 record['layoutNote']='Maths column coordinates checked against rendered physical PDF page 17; refer to full page for clause IDs and notes.'
 path.write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
 path=SOURCES/'edexcel-design-and-technology-2017.json';record=json.loads(path.read_text(encoding='utf8'))
 record['pages'][0]['rawExtractedText']=record['pages'][0]['text']
 record['pages'][0]['text']=re.sub(r'This draft qualification.*?first award in 2018\.', '',record['pages'][0]['text'],flags=re.S)
 record['extractionNote']='Rendered cover inspected: Issue 4, first teaching September 2017, certification 2019. Invisible leftover Music-draft text was removed from the model-facing cover text; raw extraction and PDF are preserved.'
 record['landingUrl']='https://qualifications.pearson.com/en/qualifications/edexcel-gcses/design-and-technology-9-1-from-2017.html'
 path.write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
 print('Added visually checked Maths tier columns and excluded invisible cover extraction debris.')
