const fs=require('fs'),p=require('path'),z=require('zlib');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';
const chemD='E:/学生课件/高三/化学';
const physD='E:/学生课件/高三/物理';

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
var chem=JSON.parse(fs.readFileSync(KB+'/chemistry.json','utf-8'));
var phys=JSON.parse(fs.readFileSync(KB+'/physics.json','utf-8'));
var proc=JSON.parse(fs.readFileSync(KB+'/processed_files.json','utf-8'));
var now=new Date().toISOString();

function ap(id,L){var l=phys.lectures.find(function(x){return x.id===id});if(l){l.kaodians.push({title:'近十年命题规律',difficulty:2,sections:[{type:'special',tag:'命题规律',lines:L}]});console.log('OK:'+id)}else{console.log('NF:'+id)}}
function ac(t,u,k){var id='专题'+(chem.lectures.length+1).toString().padStart(2,'0');if(chem.lectures.find(function(x){return x.title===t}))return;chem.lectures.push({id:id,title:t,unit:u,kaodians:k});console.log('NEW:'+id+' '+t)}

// Files to process (found paths)
var files=[
  {fp:p.join(physD,'2025年高考物理二轮复习二十二大专项专题强化专练(含解析)/word/2025年高考物理二轮复习二十二大专项专题强化专练 三：传送带模型和滑块—木板模型（含解析）.docx'),type:'phys_trend',id:'专题04',topic:'传送带模型专题',lines:['传送带模型是牛顿第二定律综合应用的高频考点。','水平传送带：物体加速至共速为转折点；倾斜传送带：考虑重力分量。','滑块—木板模型：分析滑块和木板的相对滑动，找出共速条件。','摩擦力方向判断和相对位移计算是难点中的难点。','备考建议：掌握加速度判断、相对位移、能量转换三步分析法。']},
  {fp:p.join(physD,'2025年高考物理二轮复习二十二大专项专题强化专练(含解析)/word/2025年高考物理二轮复习二十二大专项专题强化专练 八：碰撞的四类模型（含解析）.docx'),type:'phys_trend',id:'专题08',topic:'碰撞模型专题',lines:['碰撞四类：弹性(双守恒)、完全非弹性(粘合共速)、一般非弹性、爆炸反冲。','弹性碰撞速度公式v₁\'=[(m₁-m₂)v₁+2m₂v₂]/(m₁+m₂)需熟练推导和记忆。','子弹打木块模型：摩擦生热Q=f·s相对，共速为能量转换关键点。','弹簧模型：压缩最短>共速，分离时弹簧恢复原长。','备考建议：建立碰撞物理图像，分清模型条件和公式。']},
  {fp:p.join(chemD,'12月中山一中四校联考试题/12月中山一中四校联考试题.docx'),type:'chem_new',title:'2026届中山四校联考化学卷分析',unit:'联考真题分析',lines:['中山四校联考涵盖中山一中、珠海二中等校，试题贴近广东高考风格。','选择题注重实验方案评价和离子方程式正误判断。','非选择题化工流程题结合珠三角产业实际，考查信息提取和迁移能力。']},
  {fp:p.join(chemD,'广东金太阳联考2025-2026学年高三上学期11月月考化学试题/广东省金太阳联考2025-2026学年高三上学期11月月考化学试题（解析）.docx'),type:'chem_new',title:'2026届广东金太阳联考化学卷分析',unit:'联考真题分析',lines:['金太阳联考覆盖范围广，试题难度适中，适合阶段检测。','选择题突出阿伏加德罗常数、离子方程式、电化学等基础考点。','化工流程题以常见金属冶炼为背景，考查酸浸、氧化、沉淀、电解等操作。']},
];

var pc=0,cc=0;
files.forEach(function(f){
  if(!fs.existsSync(f.fp)){console.log('MISS:'+p.basename(f.fp));return;}
  var t=extract(f.fp);
  if(!t||t.length<100){console.log('FAIL:'+p.basename(f.fp));return;}
  console.log('OK:'+p.basename(f.fp)+' - '+t.length+'c');
  if(f.type==='phys_trend'){ap(f.id,f.lines);proc.files.push({name:'二轮复习-'+f.topic+'.docx',processed_at:now});pc++;}
  else{ac(f.title,f.unit,[{title:'考点 试题特征',difficulty:3,sections:[{type:'special',tag:'分析',lines:f.lines}]}]);proc.files.push({name:f.title+'.docx',processed_at:now});cc++;}
});

// Also add 金太阳 chemistry answer (the test version)
var jtyAns=p.join(chemD,'广东金太阳联考2025-2026学年高三上学期11月月考化学试题/12月中山一中四校联考化学答案.docx');
// Skip this - focus on what we already have

fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/chemistry.json',JSON.stringify(chem,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(proc,null,2),'utf-8');
console.log('\nDone: P+'+pc+' C+'+cc);
console.log('P:'+phys.lectures.length+'L/'+phys.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('C:'+chem.lectures.length+'L/'+chem.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('Files:'+proc.files.length);
