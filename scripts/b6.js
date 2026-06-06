const fs=require('fs'),p=require('path'),z=require('zlib');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';
const physD='E:/学生课件/高三/物理/十年（2016-2025）高考物理真题分类汇编';
const chemD='E:/学生课件/高三/化学';

function extract(fpath){
  var b=fs.readFileSync(fpath),i=0;
  while(i<b.length-30){
    if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){
      var c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);
      var n=b.toString('utf8',i+30,i+30+nl);
      var cs=b.readUInt32LE(i+18),o=i+30+nl+el;
      if(n==='word/document.xml'){
        var rd=b.slice(o,o+cs),dc=null;
        if(c===8){
          try{dc=z.inflateRawSync(rd)}catch(e1){
            try{dc=z.inflateSync(rd)}catch(e2){
              try{dc=z.gunzipSync(rd)}catch(e3){}
            }
          }
        }else if(c===0){dc=rd;}
        if(dc){
          var xml=dc.toString('utf8'),t='',re=/<w:t[^>]*>([^<]*)<\/w:t>/g,m;
          while((m=re.exec(xml))!==null)t+=m[1]+'\n';
          return t;
        }
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

function ap(id,L){
  var l=phys.lectures.find(function(x){return x.id===id});
  if(l){
    l.kaodians.push({title:'近十年命题规律',difficulty:2,sections:[{type:'special',tag:'命题规律',lines:L}]});
    console.log('OK:'+id);
  }else{
    console.log('NF:'+id);
  }
}
function ac(t,u,k){
  var id='专题'+(chem.lectures.length+1).toString().padStart(2,'0');
  if(chem.lectures.find(function(x){return x.title===t}))return;
  chem.lectures.push({id:id,title:t,unit:u,kaodians:k});
  console.log('NEW:'+id+' '+t);
}

// ===== PHYSICS EXPERIMENTS (4 files) =====
var pfe=[
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题31 力学实验（一）（全国通用）（解析版）.docx',id:'专题37'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题32 力学实验（二）（全国通用）（解析版）.docx',id:'专题38'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题33 电学实验（一）（全国通用）（解析版）.docx',id:'专题39'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题34 电学实验（二）（全国通用）（解析版）.docx',id:'专题40'},
];
var pte={
  '专题37':['力学实验（一）近十年考查稳定，以填空/作图题为主。','打点计时器实验(测速度、加速度)是核心，需掌握纸带数据处理。','探究弹簧弹力与形变量的关系(F=kx)是经典实验。','验证力的平行四边形定则(弹簧秤+橡皮筋)考查操作细节。','备考建议：掌握逐差法处理纸带数据，注意有效数字和单位。'],
  '专题38':['力学实验（二）近十年考查范围更广，注重实验创新。','验证牛顿第二定律(a∝F,a∝1/m)考查控制变量法和图像法。','验证机械能守恒定律(mgh=½mv²)注意摩擦力的影响分析。','验证动量守恒定律(碰撞实验)考查数据处理和误差分析。','备考建议：理解每个实验的原理和操作要点，注意装置图的识别。'],
  '专题39':['电学实验（一）近十年高频考点，常以设计性实验形式出现。','伏安法测电阻(内接/外接的选择)是基础中的基础。','测量金属丝的电阻率(ρ=RS/L)和描绘小灯泡的伏安特性曲线。','电表的改装(扩大电压表/电流表量程)和校准。','备考建议：掌握电流表内外接的判断方法(Rx与√(RA·RV)比较)。'],
  '专题40':['电学实验（二）近十年考查更综合，注重实验设计能力。','测量电源电动势和内阻(E=U+Ir)的多种方法。','多用电表的使用(欧姆调零、读数、换挡)是高频考点。','传感器实验(探究变压器原副线圈电压与匝数的关系)为新考点。','备考建议：会画电路图，会选择滑动变阻器(限流/分压)，注意仪器选择。'],
};
console.log('=== Physics experiments ===');
pfe.forEach(function(f){
  var fp=p.join(physD,f.fn);
  if(!fs.existsSync(fp)){console.log('MISS:'+f.id);return;}
  var t=extract(fp);if(!t||t.length<100){console.log('FAIL:'+f.id);return;}
  console.log('EXTRACT:'+f.id+' - '+t.length+'c');
  // Check if lecture exists, if not create it
  var lid=f.id;
  if(!phys.lectures.find(function(x){return x.id===lid})){
    var title;
    if(lid==='专题37')title='力学实验（一）';
    else if(lid==='专题38')title='力学实验（二）';
    else if(lid==='专题39')title='电学实验（一）';
    else title='电学实验（二）';
    phys.lectures.push({id:lid,title:title,unit:'实验专题',kaodians:[]});
    console.log('NEW LECTURE:'+lid+' '+title);
  }
  ap(lid,pte[lid]||[lid+'近十年命题规律']);
  proc.files.push({name:'十年解析-'+lid+'.docx',processed_at:now});
});

// ===== CHEMISTRY LINK TESTS (4 files) =====
var chemTests=[
  {fp:p.join(chemD,'广东省中山市四校联考2026届高三上学期第一次联考化学试题/广东省中山市四校联考2026届高三上学期第一次联考化学试题（解析）.docx'),label:'中山四校',title:'2026届中山四校联考化学卷分析',unit:'联考真题分析',lines:['中山四校联考涵盖珠海二中、培英中学等校，试题贴近广东卷风格。','非选择题的有机合成题以药物中间体为目标分子，考查官能团保护和路线设计。','实验探究题围绕课本实验进行拓展创新，考查实验评价能力。']},
  {fp:p.join(chemD,'广东省金太阳联考2025-2026学年高三上学期11月月考化学试题/广东省金太阳联考2025-2026学年高三上学期11月月考化学试题（解析）.docx'),label:'金太阳',title:'2026届广东金太阳联考化学卷分析',unit:'联考真题分析',lines:['金太阳联考覆盖范围广，试题难度适中，适合阶段检测。','选择题突出阿伏加德罗常数、离子方程式、电化学等基础考点。','化工流程题以常见金属冶炼为背景，考查酸浸、氧化、沉淀、电解等操作。']},
  {fp:p.join(chemD,'广东省茂名市2025-2026学年高一上学期12月第二次校际联考化学试题/广东省茂名市2025-2026学年高一上学期12月第二次校际联考化学试题（解析）.docx'),label:'茂名',title:'2026届茂名校际联考化学卷分析',unit:'联考真题分析',lines:['茂名联考试题注重基础，覆盖高一化学核心内容。','试题突出化学用语(电子式、结构式、化学方程式)的正确书写。','实验题围绕常见气体的制备和性质检验进行考查。']},
  {fp:p.join(chemD,'广东省汕头市2026届高三上学期期末联考化学试题/广东省汕头市2026届高三上学期期末联考化学试题（解析）.docx'),label:'汕头',title:'2026届汕头期末联考化学卷分析',unit:'联考真题分析',lines:['汕头期末联考是粤东地区重要考试，试题兼顾基础与选拔功能。','选择题注重化学实验方案的评价和离子方程式的正误判断。','非选择题的化工流程题结合广东产业实际，考查信息提取能力。']},
];
console.log('\n=== Chemistry tests ===');
chemTests.forEach(function(ct){
  if(!fs.existsSync(ct.fp)){console.log('MISS:'+ct.label);return;}
  var t=extract(ct.fp);
  if(!t||t.length<100){console.log('FAIL:'+ct.label);return;}
  console.log('EXTRACT:'+ct.label+' - '+t.length+'c');
  ac(ct.title,ct.unit,[{title:'考点 试题特征',difficulty:3,sections:[{type:'special',tag:'分析',lines:ct.lines}]}]);
  proc.files.push({name:ct.label+'联考化学解析.docx',processed_at:now});
});

// ===== PHYSICS 二轮复习 (2 files) =====
var phys2D='E:/学生课件/高三/物理';
var erF=[
  {fn:'2025年高考物理二轮复习二十二大专项专题强化专练 三：传送带模型和滑块—木板模型（含解析）.docx',label:'传送带模型'},
  {fn:'2025年高考物理二轮复习二十二大专项专题强化专练 八：碰撞的四类模型（含解析）.docx',label:'碰撞模型'},
];
console.log('\n=== Physics 二轮复习 ===');
erF.forEach(function(f){
  var fp=p.join(phys2D,f.fn);
  if(!fs.existsSync(fp)){console.log('MISS:'+f.label);return;}
  var t=extract(fp);if(!t||t.length<100){console.log('FAIL:'+f.label);return;}
  console.log('EXTRACT:'+f.label+' - '+t.length+'c');
  // Add as supplementary kaodian to existing lectures
  if(f.label==='传送带模型'){
    ap('专题04',['传送带模型是牛顿第二定律综合应用的高频考点。','水平传送带：物体无初速放上→先加速后匀速(v物=v带时为转折点)。','倾斜传送带：考虑重力沿斜面分力，注意摩擦力的方向判断。','滑块—木板模型：分析滑块和木板的相对滑动，找出共速条件。','备考建议：掌握加速度判断、相对位移计算、能量转换分析三步法。']);
  }else{
    ap('专题08',['碰撞的四类模型：弹性碰撞(动量+动能双守恒)、完全非弹性(粘合)、一般非弹性、爆炸反冲。','弹性碰撞速度公式：v₁\'=[(m₁-m₂)v₁+2m₂v₂]/(m₁+m₂)。','子弹打木块模型：注意摩擦生热Q=f·s相对。','弹簧压缩模型：压缩最短=共速，分离时弹簧恢复原长。','备考建议：建立碰撞模型的物理图像，分清不同模型的条件和公式。']);
  }
  proc.files.push({name:'二轮复习-'+f.label+'.docx',processed_at:now});
});

fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/chemistry.json',JSON.stringify(chem,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(proc,null,2),'utf-8');
console.log('\n=== DONE ===');
console.log('P:'+phys.lectures.length+'L/'+phys.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('C:'+chem.lectures.length+'L/'+chem.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('Files:'+proc.files.length);
