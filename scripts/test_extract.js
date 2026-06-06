const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function extractDocxText(filePath) {
    const buf = fs.readFileSync(filePath);
    let i = 0;
    while (i < buf.length - 30) {
        if (buf[i] === 0x50 && buf[i+1] === 0x4B && buf[i+2] === 0x03 && buf[i+3] === 0x04) {
            const compression = buf.readUInt16LE(i + 8);
            const nameLen = buf.readUInt16LE(i + 26);
            const extraLen = buf.readUInt16LE(i + 28);
            const name = buf.toString('utf8', i + 30, i + 30 + nameLen);
            const compSize = buf.readUInt32LE(i + 18);
            const dataOffset = i + 30 + nameLen + extraLen;
            
            if (name === 'word/document.xml') {
                const data = buf.slice(dataOffset, dataOffset + compSize);
                let xml;
                try {
                    if (compression === 8) {
                        xml = zlib.inflateRawSync(data).toString('utf8');
                    } else {
                        xml = data.toString('utf8');
                    }
                } catch(e) {
                    return 'EXTRACT_ERR: ' + e.message;
                }
                // Extract text from w:t elements
                let text = '';
                const re = /<w:t[^>]*>([^<]*)<\/w:t>/g;
                let m;
                while ((m = re.exec(xml)) !== null) {
                    text += m[1] + '\n';
                }
                if (!text) {
                    text = xml.replace(/<[^>]+>/g, '').trim();
                }
                return text;
            }
            i += 30 + nameLen + extraLen + compSize;
        } else {
            i++;
        }
    }
    return null;
}

const physDir = 'E:/学生课件/高三/物理/十年（2016-2025）高考物理真题分类汇编';
const physFile = path.join(physDir, '十年（2016-2025）高考物理真题分类汇编 专题04 牛顿第二定律（全国通用）（解析版）.docx');
if (fs.existsSync(physFile)) {
    const text = extractDocxText(physFile);
    if (text && text.startsWith('EXTRACT_ERR')) {
        console.log('Extraction error:', text);
    } else {
        console.log('Text length:', text ? text.length : 0);
        console.log('First 2000 chars:');
        console.log(text ? text.substring(0, 2000) : 'null');
    }
} else {
    console.log('File not found');
}
