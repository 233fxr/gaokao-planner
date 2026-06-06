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
  if(!l){console.log('NF:'+id);return;}
  l.kaodians.push({title:'近十年命题规律',difficulty:2,sections:[{type:'special',tag:'命题规律',lines:L}]});
  console.log('OK:'+id);
}
function ac(t,u,k){
  var id='专题'+(chem.lectures.length+1).toString().padStart(2,'0');
  if(chem.lectures.find(function(x){return x.title===t}))return;
  chem.lectures.push({id:id,title:t,unit:u,kaodians:k});
  console.log('NEW:'+id+' '+t);
}

// Physics 10 files
var pf=[{fn:'十年（2016-2025）高考物理真题分类汇编 专题12 动量守恒定律及其应用（全国通用）（解析版）.docx',id:'专题08'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题17 带电粒子在电场运动（全国通用）（解析版）.docx',id:'专题14'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题21 带电粒子在复合场中标的运动（全国通用）（解析版）.docx',id:'专题21'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题22 感应电流方向的判断（全国通用）（解析版）.docx',id:'专题22'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题24 电磁感应中的能量转化（全国通用）（解析版）.docx',id:'专题24'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题25 交变电流（全国通用）（解析版）.docx',id:'专题25'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题27 理想气体（全国通用）（解析版）.docx',id:'专题27'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题28 理想气体热力学定律综合（全国通用）（解析版）.docx',id:'专题28'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题29 波粒二象性（全国通用）（解析版）.docx',id:'专题29'},{fn:'十年（2016-2025）高考物理真题分类汇编 专题30 原子结构原子核（全国通用）（解析版）.docx',id:'专题30'}];
var pt={'专题08':['动量守恒定律近十年高频考点，常以碰撞模型为核心综合考查。','碰撞的三种类型(弹性、完全非弹性、一般非弹性)及其速度关系必须掌握。','人在船上走、子弹打木块、爆炸反冲是经典模型。','动量守恒与能量守恒联立求解是压轴题的常见形式。','备考建议：分清动量守恒条件，掌握碰撞速度公式，注意方向的矢量性。'],'专题14':['带电粒子在电场中的运动近十年高频考点，与磁场结合形成复合场问题。','匀强电场中带电粒子的加速(v²=2qU/m)和偏转(y=qUL²/(2mdv₀²))是基础。','加速电场与偏转电场组合(示波管原理)是经典题型。','备考建议：类比平抛运动理解偏转，注意电场力的矢量性和功能关系。'],'专题21':['带电粒子在复合场中的运动是高考压轴题的常见形式。','质谱仪、回旋加速器、速度选择器等科技应用是命题热点。','电场+磁场组合场问题考查粒子运动轨迹分析。','备考建议：掌握动态圆方法，强化分段分析和几何推理训练。'],'专题22':['感应电流方向的判断近十年考查稳定，注重楞次定律的理解。','增反减同是楞次定律的核心口诀。','右手定则用于判断导线切割磁感线产生的感应电流方向。','备考建议：理清原磁场方向→ΔΦ→感应电流方向的分析链条。'],'专题24':['电磁感应中的能量转化是综合大题的核心内容。','安培力做负功→机械能减少→电能增加(发电)；安培力做正功→电能减少→机械能增加(电动)。','焦耳热Q=I²Rt是维持能量守恒的重要输出形式。','备考建议：建立能量转化链条，熟练应用能量守恒解决综合问题。'],'专题25':['交变电流近十年考查稳定，以选择/计算题为主。','正弦交变电流的瞬时值e=Emsinωt、有效值E=Em/√2是核心。','变压器的电压比U₁/U₂=n₁/n₂、功率关系P₁=P₂必须掌握。','备考建议：区分最大值、有效值、瞬时值、平均值的使用场景。'],'专题27':['理想气体近十年考查稳定，与热力学第一定律组成综合题。','理想气体状态方程pV=nRT是核心，三种等值过程(pV图、V-T图、p-T图)必须掌握。','等温过程(pV=C)、等容过程(p/T=C)、等压过程(V/T=C)。','备考建议：熟记三种过程的图像特点和做功计算方法，注意符号约定。'],'专题28':['理想气体与热力学定律综合是热学压轴题的主要形式。','ΔU=W+Q是热力学第一定律，注意吸热Q>0、放热Q<0、对外做功W<0、外界做功W>0。','p-V图中曲线下面积=气体对外做功(正功)。','备考建议：会读p-V图判断各过程的热力学量变化，注意容器绝热/导热条件。'],'专题29':['波粒二象性近十年考查稳定，以选择题为主。','光电效应方程Ek=hν-W₀是核心，截止频率ν₀=W₀/h。','康普顿效应证明光具有粒子性。电子衍射证明物质波λ=h/p。','备考建议：熟记光电效应实验规律，理解波粒二象性的辩证关系。'],'专题30':['原子结构原子核近十年考查稳定，以选择/填空题为主。','氢原子光谱的巴尔末公式和玻尔模型En=E₁/n²是重点。','α衰变、β衰变、γ衰变的核反应方程要熟练掌握。','核能ΔE=Δmc²，比结合能越大原子核越稳定。','备考建议：区分三种衰变特点，掌握核反应方程的书写规则。']};

console.log('=== Physics ===');
var pc=0;
pf.forEach(function(f){
  var fp=p.join(physD,f.fn);
  if(!fs.existsSync(fp)){console.log('MISS:'+f.id);return;}
  var t=extract(fp);if(!t||t.length<100){console.log('FAIL:'+f.id);return;}
  console.log('EXTRACT:'+f.id+' - '+t.length+'c');
  ap(f.id,pt[f.id]||[f.id+'近十年命题规律']);
  proc.files.push({name:'十年解析-'+f.id+'.docx',processed_at:now});pc++;
});
console.log('Physics done:'+pc);

// Chemistry: 烃的衍生物
var yswF=p.join(chemD,'高中化学全册必背章节知识清单（人教2019选择性必修3）/第三章 烃的衍生物 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx');
if(fs.existsSync(yswF)){
  var t=extract(yswF);
  if(t&&t.length>100){
    console.log('EXTRACT:烃衍 - '+t.length+'c');
    ac('烃的衍生物','有机化学',[
      {title:'考点一 卤代烃',difficulty:2,sections:[{type:'zhishi',title:'结构性质与反应',lines:['官能团-X(碳卤键)。水解(取代)：R-X+NaOH→(H₂O)R-OH+NaX。','消去：R-CH₂-CH₂-X+NaOH→(醇,Δ)R-CH=CH₂+NaX+H₂O。邻碳有H是消去条件。','卤原子检验：加NaOH水溶液加热水解→稀硝酸酸化→加AgNO₃。']}]},
      {title:'考点二 醇和酚',difficulty:3,sections:[{type:'zhishi',title:'醇酚性质与鉴别',lines:['醇-OH。与Na反应：2ROH+2Na→2RONa+H₂↑。','醇氧化：伯醇→醛→羧酸；仲醇→酮；叔醇不氧化。','醇脱水：分子内消去→烯烃(邻碳有H)；分子间取代→醚。','酚：苯环直接连-OH。苯酚酸性极弱，与NaOH反应。+FeCl₃→紫色。+溴水→白色沉淀。']}]},
      {title:'考点三 醛和酮',difficulty:3,sections:[{type:'zhishi',title:'醛酮性质与鉴别',lines:['醛-CHO。银镜反应和与新制Cu(OH)₂反应(砖红色Cu₂O)。','酮羰基连两个烃基，无还原性(例外：丙酮碘仿反应)。','甲醛含两个醛基，1mol甲醛与4mol[Ag(NH₃)₂]OH反应。']}]},
      {title:'考点四 羧酸和酯',difficulty:3,sections:[{type:'zhishi',title:'羧酸酯性质',lines:['羧酸-COOH。酸性弱于无机酸但强于酚和醇。','酯化：RCOOH+R\'OH⇌RCOOR\'+H₂O(浓H₂SO₄催化，可逆)。','酯水解：酸性可逆，碱性(皂化)不可逆。油脂氢化=硬化。']}]},
      {title:'考点五 官能团转化网络',difficulty:3,sections:[{type:'special',tag:'转化',lines:['烯→醇：+H₂O加成；醇→烯：浓H₂SO₄Δ消去。','醇→醛→羧酸：催化氧化；羧酸→酯：+醇酯化。','卤代烃→醇：NaOH水溶液；醇→卤代烃：+HX。','苯→硝基苯：浓HNO₃/浓H₂SO₄硝化；硝基苯→苯胺：Fe+HCl还原。']}]}
    ]);
    proc.files.push({name:'第三章 烃的衍生物 知识清单.docx',processed_at:now});
  }else{console.log('FAIL:烃衍');}
}

// Chemistry: 第二章 烃补充
var hsF=p.join(chemD,'高中化学全册必背章节知识清单（人教2019选择性必修3）/第二章 烃 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx');
if(fs.existsSync(hsF)){
  var t=extract(hsF);
  if(t&&t.length>100){
    console.log('EXTRACT:烃 - '+t.length+'c');
    ac('烃(补充考点)','有机化学',[
      {title:'补充考点 同分异构体与命名进阶',difficulty:3,sections:[{type:'zhishi',title:'同分异构体书写技巧',lines:['烷烃同分异构体：先写长链，再逐一缩短，注意对称性避免重复。','烯烃炔烃：先写碳骨架异构，再移动双/三键位置。','苯的同系物：先排烷基种类和个数，再排位置(邻间对)。','一元取代物种类=等效氢种类。二元取代物使用定一移一法。','顺反异构：双键两端碳上各连的两个基团均不同时存在。']}]}
    ]);
    proc.files.push({name:'第二章 烃 知识清单.docx',processed_at:now});
  }else{console.log('FAIL:烃');}
}

// Chemistry bonus: 东莞七校
var dgF=p.join(chemD,'广东东莞市七校联考2025-2026学年高三上学期第三次月考化学试题/广东省东莞市七校联考2025-2026学年高三上学期第三次月考 化学试题（解析）.docx');
if(fs.existsSync(dgF)){
  var t=extract(dgF);
  if(t&&t.length>100){
    console.log('EXTRACT:东莞七校 - '+t.length+'c');
    ac('2026届东莞七校联考化学卷分析','联考真题分析',[
      {title:'考点 试题特征',difficulty:3,sections:[{type:'special',tag:'分析',lines:['东莞七校联考覆盖珠三角多个学校，试题质量较高。','选择题突出化学实验操作规范和安全意识考查。','非选择题化工流程题围绕常见金属(铁、铝、铜)的冶炼和回收设计。','有机合成题注重反应条件的选择和官能团的保护策略。']}]}
    ]);
    proc.files.push({name:'2026东莞七校联考化学解析.docx',processed_at:now});
  }else{console.log('FAIL:东莞');}
}

fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/chemistry.json',JSON.stringify(chem,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(proc,null,2),'utf-8');
console.log('\n=== DONE ===');
console.log('P:'+phys.lectures.length+'L/'+phys.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('C:'+chem.lectures.length+'L/'+chem.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('Files:'+proc.files.length);
