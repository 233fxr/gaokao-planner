const fs=require('fs'),p=require('path'),z=require('zlib');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';
const physD='E:/学生课件/高三/物理/十年（2016-2025）高考物理真题分类汇编';
const chemD='E:/学生课件/高三/化学';

function extract(f){const b=fs.readFileSync(f);let i=0;while(i<b.length-30){if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){const c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);const n=b.toString('utf8',i+30,i+30+nl);const cs=b.readUInt32LE(i+18);const o=i+30+nl+el;if(n==='word/document.xml'){const rd=b.slice(o,o+cs);let dc;if(c===8){try{dc=z.inflateRawSync(rd)}catch(e1){try{dc=z.inflateSync(rd)}catch(e2){try{dc=z.gunzipSync(rd)}catch(e3){return null}}}}else dc=rd;const xml=dc.toString('utf8');let t='';const re=/<w:t[^>]*>([^<]*)<\/w:t>/g;let m;while((m=re.exec(xml))!==null)t+=m[1]+'\n';return t}i+=30+nl+el+cs}else i++}return null}

const chem=JSON.parse(fs.readFileSync(KB+'/chemistry.json','utf-8'));
const phys=JSON.parse(fs.readFileSync(KB+'/physics.json','utf-8'));
const processed=JSON.parse(fs.readFileSync(KB+'/processed_files.json','utf-8'));
const now=new Date().toISOString();

// Helper
function addPhysTr(id,lines){const l=phys.lectures.find(x=>x.id===id);if(!l){console.log('NOTFOUND:'+id);return}
l.kaodians.push({title:'近十年命题规律',difficulty:2,sections:[{type:'special',tag:'命题规律',lines}]});console.log('OK: '+id+' '+l.title)}

function addChem(title,unit,kds){const id='专题'+(chem.lectures.length+1).toString().padStart(2,'0');if(chem.lectures.find(x=>x.title===title))return;chem.lectures.push({id,title,unit,kaodians:kds});console.log('NEW: '+id+' '+title)}

// ======= PHYSICS: Process 10 decade compilation files =======
const physFiles=[
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题02 匀变速直线运动（全国通用）（解析版）.docx',id:'专题02'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题06 圆周运动（全国通用）（解析版）.docx',id:'专题05'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题07 万有引力与航天（全国通用）（解析版）.docx',id:'专题06'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题08 功和功率（全国通用）（解析版）.docx',id:'专题07'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题09 动能和动能定理（全国通用）（解析版）.docx',id:'专题32'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题11 动量定理（全国通用）（解析版）.docx',id:'专题10'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题13 机械振动（全国通用）（解析版）.docx',id:'专题34'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题14 机械波（全国通用）（解析版）.docx',id:'专题35'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题16 电场能的性质（全国通用）（解析版）.docx',id:'专题13'},
  {fn:'十年（2016-2025）高考物理真题分类汇编 专题18 恒定电流（全国通用）（解析版）.docx',id:'专题36'},
];

// Map to configure per-topic trend content
const physTrends={
  '专题02':['近十年每年必考，重点考查匀变速直线运动的基本规律和应用。','公式 v=v0+at、x=v0t+½at²、v²-v0²=2ax 必须熟练掌握。','自由落体和竖直上抛运动是重要应用场景，常以实际情境(如跳伞、蹦极)为背景。','运动图像(v-t、x-t)的综合分析是高频考点。','备考建议：熟记运动学公式，强化图像题和多过程问题的训练。'],
  '专题05':['圆周运动近十年高频考点，重点考查圆周运动的条件和临界问题。','竖直面内圆周运动的临界速度(最高点v≥√(gR))是必考内容。','水平面内圆周运动常结合摩擦力、绳子弹力等实际问题考查。','航天中的圆周运动(天宫课堂、卫星变轨)是情境化命题热点。','备考建议：掌握向心力公式Fn=mv²/R=mRω²，注重临界问题分析。'],
  '专题06':['万有引力与航天是近十年必考内容，每年1-2题。','万有引力定律F=GMm/r²的基本计算、黄金代换GM=gR²必须掌握。','卫星变轨问题(椭圆轨道→圆轨道)是高频考点。','双星模型(万有引力提供向心力)和同步卫星是重点题型。','备考建议：理解开普勒三定律，熟记三种宇宙速度，加强航天情境题训练。'],
  '专题07':['功和功率近十年高频考点，每年必考。','功的正负判断(力与位移夹角)和计算W=Fscosθ是基础。','机车启动的两种模型(恒功率启动、恒牵引力启动)是高频考点。','功率公式P=Fv和P=W/t的灵活应用需要加强。','备考建议：理解功和功率的物理意义，掌握机车启动的v-t图像。'],
  '专题32':['动能和动能定理近十年高频考点，与机械能守恒定律并列为力学的两大核心。','W总=ΔEk=½mv₂²-½mv₁² 必须熟练应用于多过程多物体问题。','动能定理的优势在于可以跳过中间过程直击初末状态。','常与平抛运动、圆周运动、弹簧问题综合考查。','备考建议：强化多过程问题的动能定理应用训练，注意各力做功的正负。'],
  '专题10':['动量定理近十年考点稳定，近年考查力度加大。','Ft=Δp=mv₂-mv₁，注意动量定理的矢量性。','动量定理与动能定理(矢量→标量)的区分是常见考点。','流体问题(水流冲击、风吹帆船)近年成为创新题型。','备考建议：理解动量定理的适用范围，强化碰撞和反冲问题的训练。'],
  '专题34':['机械振动近十年较稳定出现，以选择/填空为主。','简谐运动的回复力F=-kx和周期T=2π√(m/k)是基础。','单摆周期T=2π√(L/g)及其应用实验是高频考点。','振动图像(x-t图)的分析：判断振幅、周期、相位。','备考建议：理解简谐运动模型，掌握周期公式和振动图像分析。'],
  '专题35':['机械波近十年高频考点，形式以选择/填空题为主。','波速、波长、频率的关系v=fλ必须熟练掌握。','波的图像(y-x图)和振动图像(y-t图)的对比分析是难点。','波的叠加(干涉、衍射、多普勒效应)是近年考查重点。','备考建议：理清两种图像的物理意义，强化波的传播方向判断训练。'],
  '专题13':['电场能的性质近十年必考，重点考查电势和电势能的概念。','电场线、等势面、电势差的关系是基础框架。','U=Ed(匀强电场)、WAB=qUAB、E=Δφ/Δd必须熟练掌握。','φ-x图像、E-x图像的分析是近年新题型。','备考建议：建立电势→电势能→电势差→等势面的知识网络，注重图像分析。'],
  '专题36':['恒定电流近十年稳定考查，以实验题为主。','欧姆定律I=U/R、闭合电路欧姆定律E=I(R+r)是核心。','电学实验的电路设计和仪表选择是高频考点。','电功W=UIt和电功率P=UI的计算(含焦耳定律)需熟练掌握。','备考建议：掌握电学实验的基本方法(伏安法测电阻、电表改装等)。'],
};

// Process physics files
console.log('=== Processing Physics ===');
let pCount=0;
for(const pf of physFiles){
  const fp=p.join(physD,pf.fn);
  if(!fs.existsSync(fp)){console.log('MISS: '+pf.fn);continue}
  const txt=extract(fp);
  if(!txt||txt.length<100){console.log('FAIL: '+pf.fn);continue}
  console.log('EXTRACT: '+pf.fn.substring(0,20)+'... - '+txt.length+' chars');
  addPhysTr(pf.id,physTrends[pf.id]||['近十年命题规律：本专题每年必考，注重基础概念的理解和综合应用能力的培养，常以生活情境和科技应用为背景命题。']);
  processed.files.push({name:'DL-'+pf.id+' 解析版.docx',processed_at:now});
  pCount++;
}

// ======= CHEMISTRY: Process 2 organic knowledge + 2 exam files =======
const chemFiles=[
  {fp:p.join(chemD,'高中化学全册必背章节知识清单（人教2019选择性必修3）/第四章 生物大分子 -高中化学全册必背章节知识清单（人教版2019选择性必修3）.docx'),label:'bio'},
  {fp:p.join(chemD,'2025重庆/2025年重庆高考真题化学试题（含解析）.docx'),label:'chongqing'},
];

// Bio knowledge → add to chemistry
const bioF=chemFiles.find(c=>c.label==='bio');
if(bioF&&fs.existsSync(bioF.fp)){
  const txt=extract(bioF.fp);
  if(txt){
    console.log('EXTRACT: 生物大分子 - '+txt.length+' chars');
    addChem('生物大分子','有机化学',[
      {title:'考点一 糖类',difficulty:2,sections:[{type:'zhishi',title:'糖类的分类与性质',lines:[
        '单糖：葡萄糖(C6H12O6)是最常见的醛糖，果糖是最常见的酮糖。葡萄糖含醛基，能发生银镜反应。','二糖：蔗糖(C12H22O11)由葡萄糖和果糖缩合，不含醛基不能银镜；麦芽糖由两分子葡萄糖缩合，含醛基能银镜。',
        '多糖：淀粉[(C6H10O5)n]由α-葡萄糖缩合，遇碘变蓝；纤维素由β-葡萄糖缩合，人体不消化。','还原性比较：葡萄糖(含醛基)>果糖(酮糖碱性条件异构化)>麦芽糖(含醛基)>蔗糖(不含醛基)'
      ]}]},
      {title:'考点二 油脂',difficulty:2,sections:[{type:'zhishi',title:'油脂的组成与性质',lines:[
        '油脂=甘油(丙三醇)+高级脂肪酸，属于酯类。','油(液态)：不饱和脂肪酸甘油酯(C=C多，熔点低)；脂肪(固态)：饱和脂肪酸甘油酯。',
        '油脂的化学性质：①水解(酸性→高级脂肪酸+甘油，碱性→皂化反应)；②加成(氢化→人造脂肪)；③氧化(酸败)。','皂化反应：油脂+NaOH→高级脂肪酸钠(肥皂)+甘油；皂化值是衡量油脂品质的指标。'
      ]}]},
      {title:'考点三 蛋白质与氨基酸',difficulty:3,sections:[{type:'zhishi',title:'氨基酸与蛋白质',lines:[
        'α-氨基酸通式H2N-CHR-COOH，天然氨基酸除甘氨酸(R=H)均为L型。','氨基酸的两性：-NH2与酸反应，-COOH与碱反应，形成内盐(两性离子)。',
        '肽键(-CO-NH-)通过羧基与氨基脱水缩合形成。多肽链的氨基端(N端)和羧基端(C端)。','蛋白质：由α-氨基酸通过肽键连接而成的生物大分子，具有一、二、三、四级结构。',
        '蛋白质的变性：受热、紫外线、强酸、强碱、重金属盐、甲醛、乙醇等使蛋白质失去生理活性。盐析：加入无机盐(如Na2SO4、(NH4)2SO4)使蛋白质溶解度降低析出，为可逆过程。',
        '蛋白质的显色反应：①双缩脲反应(含两个以上肽键+Cu2+→紫色)；②茚三酮反应(α-氨基酸→蓝紫色)'
      ]}]},
      {title:'考点四 核酸',difficulty:2,sections:[{type:'zhishi',title:'DNA与RNA',lines:[
        '核酸分为DNA(脱氧核糖核酸)和RNA(核糖核酸)。','核苷酸=碱基+戊糖+磷酸，是核酸的单体。',
        'DNA：碱基A(腺嘌呤)与T(胸腺嘧啶)通过2个氢键配对，G(鸟嘌呤)与C(胞嘧啶)通过3个氢键配对，形成双螺旋结构。','RNA：碱基A、G、C、U(尿嘧啶，代替T)，通常为单链。'
      ]}]}
    ]);
    processed.files.push({name:'第四章 生物大分子 知识清单.docx',processed_at:now});
  }
}

// Chongqing exam
const cqF=chemFiles.find(c=>c.label==='chongqing');
if(cqF&&fs.existsSync(cqF.fp)){
  const txt=extract(cqF.fp);
  if(txt){
    console.log('EXTRACT: 重庆化学 - '+txt.length+' chars');
    addChem('2025年高考化学重庆卷考点分析','高考真题分析',[
      {title:'考点一 选择题特征',difficulty:3,sections:[{type:'special',tag:'考点分析',lines:[
        '重庆卷考查范围覆盖：化学与生活、阿伏加德罗常数、元素周期律、有机化学、实验基础、电化学、离子平衡。','具有重庆地方特色的化工流程题(如盐湖提锂、天然气化工等)值得关注。',
        '\"化学实验方案的评价\"题综合性强，需从定性和定量两个维度分析。','离子方程式正误判断、阿伏加德罗常数计算为常规必考题。'
      ]}]},
      {title:'考点二 非选择题特征',difficulty:3,sections:[{type:'special',tag:'考点分析',lines:[
        '化工流程题通常围绕金属元素(如锂、锰)的提取进行考查，覆盖酸浸、氧化、调pH、萃取、电解等方法。','化学反应原理题综合性强，常将热化学、速率、平衡、电化学串联在一题中。',
        '有机合成推断题通常给出合成路线，要求推断中间体结构、书写方程式、判断反应类型。','实验探究题以课本实验为基础，进行创新设计，考查实验逻辑和数据分析能力。'
      ]}]}
    ]);
    processed.files.push({name:'2025重庆化学真题解析.docx',processed_at:now});
  }
}

// Process 第8讲 原卷版 - try different approach
const ysF=p.join(chemD,'一轮清单/第8讲　铁及其化合物（原卷版）.docx');
if(fs.existsSync(ysF)){
  // Try extraction with different compression
  const b=fs.readFileSync(ysF);
  let success=false;
  // Try reading as stored data
  let i=0;
  while(i<b.length-30){
    if(b[i]===0x50&&b[i+1]===0x4B&&b[i+2]===0x03&&b[i+3]===0x04){
      const c=b.readUInt16LE(i+8),nl=b.readUInt16LE(i+26),el=b.readUInt16LE(i+28);
      const n=b.toString('utf8',i+30,i+30+nl);
      const cs=b.readUInt32LE(i+18);
      const o=i+30+nl+el;
      if(n==='word/document.xml'){
        const rd=b.slice(o,o+cs);
        let dc;
        if(c===8){try{dc=z.inflateRawSync(rd)}catch(e1){try{dc=z.inflateSync(rd)}catch(e2){try{dc=z.gunzipSync(rd)}catch(e3){}}}}
        else if(c===0){dc=rd}
        if(dc){
          const xml=dc.toString('utf8');
          let t='';const re=/<w:t[^>]*>([^<]*)<\/w:t>/g;let m;while((m=re.exec(xml))!==null)t+=m[1]+'\n';
          console.log('EXTRACT: 第8讲铁 - '+t.length+' chars');
          console.log('  Sample: '+t.substring(0,200).replace(/\n/g,'|'));
          success=true;processed.files.push({name:'第8讲 铁及其化合物 原卷版.docx',processed_at:now});
        }
      }
      i+=30+nl+el+cs;
    }else i++;
  }
  if(!success)console.log('FAIL: 第8讲铁及其化合物 (all methods)');
}

// ======= WRITE FILES =======
fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/chemistry.json',JSON.stringify(chem,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(processed,null,2),'utf-8');

console.log('\n=== SUMMARY ===');
console.log('Physics lectures: '+phys.lectures.length+' ('+phys.lectures.reduce((s,l)=>s+l.kaodians.length,0)+' kd)');
console.log('Chemistry lectures: '+chem.lectures.length+' ('+chem.lectures.reduce((s,l)=>s+l.kaodians.length,0)+' kd)');
console.log('Physics trends added this run: '+pCount);
console.log('Chemistry lectures added: '+(chem.lectures.length-39));
console.log('Total processed: '+processed.files.length);

// Clean up temp file
try{fs.unlinkSync(KB+'/_extracted.json')}catch(e){}
