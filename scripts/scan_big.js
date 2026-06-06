const fs=require('fs'),p=require('path'),z=require('zlib');
const dir='E:/学生课件/高三/物理/新建文件夹 (2)/学生讲word';

function extractSmall(fp,maxKB){
  var b=fs.readFileSync(fp);
  var i=0;
  while(i<b.length-30){
    if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){
      var c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);
      var n=b.toString('utf8',i+30,i+30+nl);
      var cs=b.readUInt32LE(i+18),o=i+30+nl+el;
      if(n==='word/document.xml'){
        var rd=b.slice(o,o+Math.min(cs,maxKB*1024));
        var dc=null;
        if(c===8){try{dc=z.inflateRawSync(rd)}catch(e1){try{dc=z.inflateSync(rd)}catch(e2){try{dc=z.gunzipSync(rd)}catch(e3){}}}}
        else if(c===0)dc=rd;
        if(dc){var xml=dc.toString('utf8');var t='',re=/<w:t[^>]*>([^<]*)<\/w:t>/g,m;while((m=re.exec(xml))!==null)t+=m[1]+'\n';return t}
      }
      i+=30+nl+el+cs;
    }else{i++;}
  }
  return null;
}

// Group files by topic area
var uniq=fs.readdirSync(dir).filter(function(f){return f.endsWith('.docx')&&!f.match(/\(\d\)\.docx$/)}).sort();
var topics=[];
uniq.forEach(function(f){
  var sz=fs.statSync(p.join(dir,f)).size;
  var topic='';
  if(f.includes('力与直线'))topic='力学';
  else if(f.includes('力与曲线'))topic='力学';
  else if(f.includes('能量和动量'))topic='力学';
  else if(f.includes('电场和磁场'))topic='电磁学';
  else if(f.includes('电磁感应'))topic='电磁学';
  else if(f.includes('电路'))topic='电磁学/电路';
  else if(f.includes('运动'))topic='运动学';
  else if(f.includes('相互作用'))topic='力学';
  else if(f.includes('运动与力'))topic='力学';
  else if(f.includes('万有引力'))topic='力学';
  else if(f.includes('机械能'))topic='力学';
  else if(f.includes('动量'))topic='力学';
  else if(f.includes('抛体'))topic='力学';
  else if(f.includes('交变电流'))topic='电磁学';
  else if(f.includes('振动与机械波'))topic='波动';
  else if(f.includes('光学'))topic='光学';
  else if(f.includes('热学'))topic='热学';
  else if(f.includes('原子'))topic='近代物理';
  else if(f.includes('静电场'))topic='电磁学';
  else topic='其他';
  topics.push({file:f,size:sz,topic:topic});
});

console.log('=== Student Word Docs by Topic ===');
var byTopic={};
topics.forEach(function(t){
  if(!byTopic[t.topic])byTopic[t.topic]=[];
  byTopic[t.topic].push(t);
});
Object.keys(byTopic).forEach(function(topic){
  console.log('  '+topic+': '+byTopic[topic].map(function(x){return x.file.replace('.docx','')}).join(', '));
  var totalMB=byTopic[topic].reduce(function(s,x){return s+x.size},0)/1024/1024;
  console.log('    Total: '+totalMB.toFixed(0)+'MB');
});

// Try smallest file
var smallest=topics.sort(function(a,b){return a.size-b.size})[0];
console.log('\n=== Testing smallest file ===');
console.log('File: '+smallest.file+' ('+(smallest.size/1024/1024).toFixed(0)+'MB)');
var t0=Date.now();
var txt=extractSmall(p.join(dir,smallest.file),5000); // 5MB limit
var elapsed=((Date.now()-t0)/1000).toFixed(1);
if(txt){console.log('Extracted: '+txt.length+' chars in '+elapsed+'s');console.log('Preview: '+txt.substring(0,500)})
else{console.log('Failed in '+elapsed+'s')}
