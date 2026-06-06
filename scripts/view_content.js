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
                const rawData = buf.slice(dataOffset, dataOffset + compSize);
                let decompressed;
                if (compression === 8) {
                    try { decompressed = zlib.inflateRawSync(rawData); } catch(e1) {
                        try { decompressed = zlib.inflateSync(rawData); } catch(e2) {
                            try { decompressed = zlib.gunzipSync(rawData); } catch(e3) { return null; }
                        }
                    }
                } else { decompressed = rawData; }
                const xml = decompressed.toString('utf8');
                let text = '';
                const re = /<w:t[^>]*>([^<]*)<\/w:t>/g;
                let m;
                while ((m = re.exec(xml)) !== null) { text += m[1]; }
                return text;
            }
            i += 30 + nameLen + extraLen + compSize;
        } else { i++; }
    }
    return null;
}

const chemDir = 'E:/学生课件/高三/化学';
const f1 = path.join(chemDir, '高中化学全册必背章节知识清单（人教2019选择性必修3）/第一章 有机化合物的结构特点与研究方法 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx');
const f2 = path.join(chemDir, '高中化学全册必背章节知识清单（人教2019选择性必修3）/第二章 烃 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx');
const f3 = path.join(chemDir, '2025安徽/精品解析：2025年安徽高考真题化学试题（解析版）.docx');
const f4 = path.join(chemDir, '2025河南/精品解析：2025河南高考真题化学试题（解析版）.docx');

console.log('=== Chapter 1: Organic Chemistry Structure ===');
console.log(extractDocxText(f1));

console.log('\n=== Chapter 2: Hydrocarbons ===');
console.log(extractDocxText(f2));

console.log('\n=== Anhui 2025 Exam ===');
console.log((extractDocxText(f3) || '').substring(0, 3000));
