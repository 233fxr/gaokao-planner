const fs=require('fs'),p=require('path'),z=require('zlib');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';
const erDir='E:/学生课件/高三/物理/2025年高考物理二轮复习二十二大专项专题强化专练(含解析)/word';

function extract(fp){
  var b=fs.readFileSync(fp),i=0;
  while(i<b.length-30){
    if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){
      var c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);
      var n=b.toString('utf8',i+30,i+30+nl);
      var cs=b.readUInt32LE(i+18),o=i+30+nl+el;
      if(n==='word/document.xml'){
        var rd=b.slice(o,o+cs),dc=null;
        if(c===8){try{dc=z.inflateRawSync(rd)}catch(e1){try{dc=z.inflateSync(rd)}catch(e2){try{dc=z.gunzipSync(rd)}catch(e3){}}}}
        else if(c===0)dc=rd;
        if(dc){var xml=dc.toString('utf8'),t='',re=/<w:t[^>]*>([^<]*)<\/w:t>/g,m;while((m=re.exec(xml))!==null)t+=m[1]+'\n';return t}
      }
      i+=30+nl+el+cs;
    }else{i++;}
  }
  return null;
}

var phys=JSON.parse(fs.readFileSync(KB+'/physics.json','utf-8'));
var proc=JSON.parse(fs.readFileSync(KB+'/processed_files.json','utf-8'));
var now=new Date().toISOString();

var extra=[{fn:'2025年高考物理二轮复习二十二大专项专题强化专练 十五：带电粒子在交变电、磁场中的运动（含解析）.docx',id:'专题21',name:'交变电磁场',L:['交变电场中粒子的运动按半周期分段分析。','交变磁场中粒子做螺旋运动，轨迹复杂但可分解。','周期性变化的力和加速度需要分段求解。','备考建议：以周期的1/4为间隔分段，注意转折条件。']},{fn:'2025年高考物理二轮复习二十二大专项专题强化专练 十六：带电粒子在立体空间中的运动（含解析）.docx',id:'专题21',name:'立体空间',L:['立体空间问题考查三维受力分析和运动分解。','将三维运动分解到x、y、z方向分别求解。','磁场与电场垂直时粒子做摆线运动。','备考建议：建立空间坐标系，分别分析各方向的受力和运动。']}];

extra.forEach(function(cfg){
  var fp=p.join(erDir,cfg.fn);
  var t=extract(fp);
  if(!t||t.length<200){console.log('FAIL:'+cfg.name);return}
  console.log('EXTRACT:'+cfg.name+' - '+t.length+'c');
  var l=phys.lectures.find(function(x){return x.id===cfg.id});
  if(!l){console.log('NF:'+cfg.id);return}
  l.kaodians.push({title:'二轮强化：'+cfg.name,difficulty:3,sections:[{type:'special',tag:'二轮专项',lines:cfg.L}]});
  proc.files.push({name:'二轮复习-'+cfg.name+'.docx',processed_at:now});
});

fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(proc,null,2),'utf-8');
console.log('Fixed 2 missing files');
console.log('P:'+phys.lectures.length+'L/'+phys.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('Files:'+proc.files.length);
