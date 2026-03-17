import zipfile
import xml.etree.ElementTree as ET

try:
    with zipfile.ZipFile(r'd:\desktop\Hackathonclg\marketingsuit\MarketAI Pro Overview.docx') as docx:
        xml_content = docx.read('word/document.xml')
        tree = ET.XML(xml_content)
        texts = []
        for p in tree.iter():
            if p.tag.endswith('}p'):
                p_text = ''
                for t in p.iter():
                    if t.tag.endswith('}t') and t.text:
                        p_text += t.text
                if p_text:
                    texts.append(p_text)
        with open(r'd:\desktop\Hackathonclg\marketingsuit\MarketAI_Pro_Text.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(texts))
except Exception as e:
    with open(r'd:\desktop\Hackathonclg\marketingsuit\MarketAI_Pro_Text.txt', 'w', encoding='utf-8') as f:
        f.write("Error: " + str(e))
