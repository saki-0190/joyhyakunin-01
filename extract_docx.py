import zipfile
import re
path = '9班RFP_百人一首ビジネス交流アプリ.docx'
with zipfile.ZipFile(path) as z:
    xml = z.read('word/document.xml').decode('utf-8')
    text = re.sub(r'<[^>]+>', '', xml)
    print(text)
