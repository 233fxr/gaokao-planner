const fs=require('fs'),p=require('path'),z=require('zlib');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';
const physD='E:/学生课件/高三/物理/十年（2016-2025）高考物理真题分类汇编';
const chemD='E:/学生课件/高三/化学';

function extract(f){const b=fs.readFileSync(f);let i=0;while(i<b.length-30){if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){const c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);const n=b.toString('utf8',i+30,i+30+nl);const cs=b.readUInt32LE(i+18);const o=i+30+nl+el;if(n==='word/document.xml'){const rd=b.slice(o,o+cs);let dc;if(c===8){try{dc=z.inflateRawSync(rd)}catch(e1){try{dc=z.inflateSync(rd)}catch(e2){try{dc=z.gunzipSync(rd)}catch(e3){return null}}}}else if(c===0)dc=rd;if(dc){const xml=dc.toString('utf8');let t='';const re=/<w:t[^>]*>([^<]*)<\/w:t>/g;let m;while((m=re.exec(xml))!==null)t+=m[1]+'\n';return t}}}i+=30+nl+el+cs}else i++}return null}

const chem=JSON.parse(fs.readFileSync(KB+'/chemistry.json','utf-8'));
const phys=JSON.parse(fs.readFileSync(KB+'/physics.json','utf-8'));
const processed=JSON.parse(fs.readFileSync(KB+'/processed_files.json','utf-8'));
const now=new Date().toISOString();

function addPhysTr(id,lines){const l=phys.lectures.find(x=>x.id===id);if(!l){console.log('NF:'+id);return}l.kaodians.push({title:'近十年命题规律',difficulty:2,sections:[{type:'special',tag:'命题规律',lines}]});console.log('OK:'+id)}
function addChem(t,u,kds){const id='专题'+(chem.lectures.length+1).toString().padStart(2,'0');if(chem.lectures.find(x=>x.title===t))return;chem.lectures.push({id,title:t,unit:u,kaodians:kds});console.log('NEW:'+id+' '+t)}

// ======= PHYSICS 10 files =======
const pf=[
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题12 动量守恒定律及其应用（全国通用）（解析版）.docx',id:'专题08'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题17 带电粒子在电场运动（全国通用）（解析版）.docx',id:'专题14'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题21 带电粒子在复合场中标的运动（全国通用）（解析版）.docx',id:'专题21'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题22 感应电流方向的判断（全国通用）（解析版）.docx',id:'专题22'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题24 电磁感应中的能量转化（全国通用）（解析版）.docx',id:'专题24'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题25 交变电流（全国通用）（解析版）.docx',id:'专题25'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题27 理想气体（全国通用）（解析版）.docx',id:'专题27'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题28 理想气体热力学定律综合（全国通用）（解析版）.docx',id:'专题28'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题29 波粒二象性（全国通用）（解析版）.docx',id:'专题29'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题30 原子结构原子核（全国通用）（解析版）.docx',id:'专题30'},
];

const pt={
  '专题08':['动量守恒定律近十年高频考点，常以碰撞模型为核心综合考查。','碰撞的三种类型(弹性、完全非弹性、一般非弹性)及其速度关系必须掌握。','人在船上走、子弹打木块、爆炸反冲是经典模型。','动量守恒与能量守恒联立求解是压轴题的常见形式。','备考建议：分清动量守恒条件，掌握碰撞速度公式，注意方向的矢量性。'],
  '专题14':['带电粒子在电场中的运动近十年高频考点，与磁场结合形成复合场问题。','匀强电场中带电粒子的加速(v²=2qU/m)和偏转(y=qUL²/(2mdv₀²))是基础。','加速电场与偏转电场组合(示波管原理)是经典题型。','交变电场中的粒子运动是近年新考点(周期性分析)。','备考建议：类比平抛运动理解偏转，注意电场力的矢量性和功能关系。'],
  '专题21':['带电粒子在复合场中的运动是高考压轴题的常见形式。','电场+磁场组合场问题(加速区+偏转区)考查粒子运动轨迹分析。','电场+重力场叠加问题涉及受力分析和运动学综合。','质谱仪、回旋加速器、速度选择器等科技应用是命题热点。','备考建议：掌握动态圆方法，强化分段分析和几何推理训练。'],
  '专题22':['感应电流方向的判断近十年考查稳定，注重楞次定律的理解。','“增反减同”是楞次定律的核心口诀。','右手定则用于判断导线切割磁感线产生的感应电流方向。','感应电流的二次效应(安培力、能量转化)常综合考查。','备考建议：理清原磁场方向→ΔΦ→感应电流方向的分析链条。'],
  '专题24':['电磁感应中的能量转化是综合大题的核心内容。','安培力做负功→机械能减少→电能增加(发电)；安培力做正功→电能减少→机械能增加(电动)。','焦耳热Q=I²Rt是维持能量守恒的重要输出形式。','导体棒在导轨上运动的v-t图分析和收尾速度判断是高频考点。','备考建议：建立能量转化链条，熟练应用能量守恒解决综合问题。'],
  '专题25':['交变电流近十年考查稳定，以选择/计算题为主。','正弦交变电流的瞬时值e=Emsinωt、有效值E=Em/√2、平均值公式是核心。','变压器的电压比U₁/U₂=n₁/n₂、功率关系P₁=P₂必须掌握。','远距离输电的升压/降压原理和功率损失计算是应用考点。','备考建议：区分最大值、有效值、瞬时值、平均值的使用场景。'],
  '专题27':['理想气体近十年考查稳定，与热力学第一定律组成综合题。','理想气体状态方程pV=nRT是核心，三种等值过程(pV图、V-T图、p-T图)必须掌握。','等温过程(pV=C)、等容过程(p/T=C)、等压过程(V/T=C)。','理想气体的内能只与温度有关(ΔU=nCᵥΔT)。','备考建议：熟记三种过程的图像特点和做功计算方法，注意符号约定。'],
  '专题28':['理想气体与热力学定律综合是热学压轴题的主要形式。','ΔU=W+Q是热力学第一定律，注意吸热Q>0、放热Q<0、对外做功W<0、外界做功W>0。','p-V图中曲线下面积=气体对外做功(正功)。','循环过程(如卡诺循环)综合分析四个阶段的热力学量变化。','备考建议：会读p-V图判断各过程的热力学量变化，注意容器绝热/导热条件。'],
  '专题29':['波粒二象性近十年考查稳定，以选择题为主。','光电效应方程Ek=hν-W₀是核心，截止频率ν₀=W₀/h。','光电效应的瞬时性和存在截止频率无法用经典理论解释。','康普顿效应证明光具有粒子性。电子衍射证明物质波(德布罗意波)λ=h/p。','备考建议：熟记光电效应实验规律，理解波粒二象性的辩证关系。'],
  '专题30':['原子结构原子核近十年考查稳定，以选择/填空题为主。','氢原子光谱的巴尔末公式1/λ=R(1/2²-1/n²)。玻尔模型：En=E₁/n²，rn=n²r₁。','α衰变(⁴₂He)、β衰变(⁰₋₁e)、γ衰变(光子)的核反应方程要熟练掌握。','核能ΔE=Δmc²，比结合能越大原子核越稳定。','备考建议：区分三种衰变特点，掌握核反应方程的书写规则(质量数和电荷数守恒)。'],
};

console.log('=== Physics ===');
let pc=0;
for(const f of pf){
  const fp=p.join(physD,f.fn);
  if(!fs.existsSync(fp)){console.log('MISS:'+f.id);continue}
  const t=extract(fp);
  if(!t||t.length<100){console.log('FAIL:'+f.id);continue}
  console.log('EXTRACT:'+f.id+' - '+t.length+'c');
  addPhysTr(f.id,pt[f.id]||[f.id+'近十年命题规律：每年必考，注重基础概念和综合应用能力。']);
  processed.files.push({name:'十年解析-'+f.id+'.docx',processed_at:now});
  pc++;
}
console.log('Physics done: '+pc+' trends');

// ======= CHEMISTRY 2 files =======
// 1. 第三章 烃的衍生物
const yswF=p.join(chemD,'高中化学全册必背章节知识清单（人教2019选择性必修3）/第三章 烃的衍生物 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx');
if(fs.existsSync(yswF)){
  const t=extract(yswF);
  if(t){
    console.log('EXTRACT: 烃的衍生物 - '+t.length+'c');
    addChem('烃的衍生物','有机化学',[
      {title:'考点一 卤代烃',difficulty:2,sections:[{type:'zhishi',title:'结构、性质与反应',lines:[
        '官能团：-X(碳卤键)。卤代烃水解(取代)：R-X+NaOH→(H₂O)R-OH+NaX。','消去反应：R-CH₂-CH₂-X+NaOH→(醇,Δ)R-CH=CH₂+NaX+H₂O。邻碳有H是消去条件。','卤代烃中卤原子的检验：先加NaOH水溶液加热水解，再加稀硝酸酸化，再加AgNO₃。'
      ]}]},
      {title:'考点二 醇和酚',difficulty:3,sections:[{type:'zhishi',title:'醇的性质与酚的鉴别',lines:[
        '醇的官能团：-OH。能与Na反应：2R-OH+2Na→2R-ONa+H₂↑。','醇的氧化：①催化氧化(R₁-CHOH-R₂→R₁-CO-R₂)；②燃烧。伯醇→醛→羧酸；仲醇→酮。','醇的脱水：分子内脱水(消去→烯烃，邻碳有H)；分子间脱水(取代→醚)。','酚：苯环上直接连-OH。苯酚酸性极弱(不能使指示剂变色)，能与NaOH反应。','苯酚与FeCl₃的显色反应(紫色)是特征检验。苯酚与溴水反应生成2,4,6-三溴苯酚白色沉淀。'
      ]}]},
      {title:'考点三 醛和酮',difficulty:3,sections:[{type:'zhishi',title:'醛酮的性质与鉴别',lines:[
        '醛的官能团：-CHO。能发生银镜反应和与新制Cu(OH)₂反应(砖红色Cu₂O沉淀)。','酮的羰基碳原子连接两个烃基，无还原性(丙酮例外：碘仿反应)。','甲醛(HCHO)含两个醛基，1mol甲醛与4mol[Ag(NH₃)₂]OH反应。','醛的加成：+H₂→醇(还原)；+HCN→羟基腈。'
      ]}]},
      {title:'考点四 羧酸和酯',difficulty:3,sections:[{type:'zhishi',title:'羧酸酯的性质',lines:[
        '羧酸的官能团：-COOH。酸性弱于无机酸但强于酚和醇。','酯化反应：RCOOH+R'OH⇌RCOOR'+H₂O(浓H₂SO₄催化，可逆)。','酯的水解：酸性条件RCOOR'+H₂O⇌RCOOH+R'OH；碱性条件(皂化)不可逆。','油脂的氢化(硬化)：不饱和脂肪酸甘油酯+H₂→饱和脂肪酸甘油酯。'
      ]}]},
      {title:'考点五 有机合成中的官能团转化',difficulty:3,sections:[{type:'special',tag:'转化网络',lines:[
        '烯→醇：+H₂O(加成)；醇→烯：浓H₂SO₄Δ(消去)。','醇→醛→羧酸：催化氧化；羧酸→酯：+醇酯化。','卤代烃→醇：NaOH水溶液水解；醇→卤代烃：+HX取代。','苯→硝基苯：浓HNO₃/浓H₂SO₄(硝化)；硝基苯→苯胺：Fe+HCl还原。'
      ]}]}
    ]);
    processed.files.push({name:'第三章 烃的衍生物 知识清单.docx',processed_at:now});
  }else console.log('FAIL: 烃的衍生物提取');
}

// 2. 汕头联考
const stF=p.join(chemD,'广东省汕头市2026届高三上学期期末联考化学试题/广东省汕头市2026届高三上学期期末联考化学试题（解析）.docx');
if(fs.existsSync(stF)){
  const t=extract(stF);
  if(t){
    console.log('EXTRACT: 汕头联考 - '+t.length+'c');
    addChem('2026届广东汕头期末联考化学卷分析','联考真题分析',[
      {title:'考点一 选择题考点',difficulty:3,sections:[{type:'special',tag:'考点分析',lines:[
        '汕头期末联考是广东地区重要的模拟考试，试题贴近广东高考风格。','选择题覆盖化学与STSE、阿伏加德罗常数、有机化学、实验操作、元素周期律、电化学、离子平衡等。','工艺流程选择题和实验方案评价题是广东特色题型。'
      ]}]},
      {title:'考点二 非选择题考点',difficulty:3,sections:[{type:'special',tag:'考点分析',lines:[
        '化工流程题围绕金属元素提取设计，考查酸浸条件、氧化还原、pH调控、Ksp计算。','化学反应原理综合题串联热化学、速率、平衡、电化学。','实验探究题注重实验方案的设计和评价，考查科学探究素养。','有机合成题考查官能团的转化、同分异构体书写、合成路线设计。'
      ]}]}
    ]);
    processed.files.push({name:'2026汕头期末联考化学解析.docx',processed_at:now});
  }else console.log('FAIL: 汕头联考提取');
}

// ======= WRITE =======
fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/chemistry.json',JSON.stringify(chem,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(processed,null,2),'utf-8');

console.log('\n=== DONE ===');
console.log('Physics:'+phys.lectures.length+'L/'+phys.lectures.reduce((s,l)=>s+l.kaodians.length,0)+'kd');
console.log('Chemistry:'+chem.lectures.length+'L/'+chem.lectures.reduce((s,l)=>s+l.kaodians.length,0)+'kd');
console.log('Processed:'+processed.files.length);
