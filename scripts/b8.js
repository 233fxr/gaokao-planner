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

// Map: filename substring -> {lectureId, topicName, lines}
var M=[
  {k:'一：追及相遇问题',id:'专题02',name:'追及相遇',L:['追及相遇问题：用速度-时间图分析两物体间距变化。','多过程问题：将复杂运动分解为多个简单阶段，逐段分析初末状态。','制动安全问题(刹车距+反应距)是高频情境。']},
  {k:'二：动态平衡',id:'专题03',name:'动态平衡',L:['动态平衡：用矢量三角形法或相似三角形法分析力的变化。','临界问题：找出受力突变的条件(如绳子松弛、静摩擦力换向)。','极值问题：利用函数极值求解力的最值。']},
  {k:'四：圆周运动的临界',id:'专题05',name:'圆周临界',L:['竖直面圆周运动临界条件：绳模型vmin=sqrt(gR)，杆模型vmin=0。','水平面圆周运动临界：最大静摩擦力提供向心力。','圆锥摆周期和参数关系是重要题型。']},
  {k:'五：双星及多星',id:'专题06',name:'双星多星',L:['双星模型：两星角速度相同，绕质心做圆周运动。','r1+r2=L(间距)，周期T=2pi sqrt(L^3/G(m1+m2))。','三星/四星模型可分解为对称性分析。']},
  {k:'六：动能定理在多过程',id:'专题32',name:'动能多过程',L:['动能定理避免中间过程受力分析，直接从初末动能差计算。','多过程问题分段求功再求和：Wtotal=Sum(Wi)=Delta Ek。','弹簧模型中弹力做功W=0.5k(x1^2-x2^2)的符号判断。']},
  {k:'七：能量观点',id:'专题33',name:'能量观点',L:['一类：只有重力/弹力做功，机械能守恒。','二类：有摩擦力等非保守力做功，用功能关系。','功能关系：W非保=Delta E机械能，W重力=-Delta Ep。']},
  {k:'九：力学三大观点',id:'专题08',name:'三大观点',L:['力学三大观点：牛顿定律(过程)、动量(碰撞)、能量(守恒)。','碰撞/爆炸用动量，多过程用能量，过程细节用牛顿。','三大观点的综合应用是压轴题的常见形式。']},
  {k:'十：电场性质的综合',id:'专题12',name:'电场综合',L:['电场强度E与电势phi的关系：E=-d(phi)/dx。','等势面与电场线垂直，电场线指向电势降低方向。','E-x和phi-x图像的综合分析是近年热点。']},
  {k:'十一：带电粒子',id:'专题14',name:'粒子电场',L:['带电粒子在匀强电场中的偏转可类比平抛运动。','示波管原理：加速区间+偏转区间组合分析。','带电体(带电小球)结合重力场的综合受力分析。']},
  {k:'十二：电学实验基础',id:'专题39',name:'电学基础',L:['电流表内外接的选择：Rx与sqrt(RA*RV)比较。','滑动变阻器的限流式与分压式接法选择。','电表的改装：扩大电压表量程串联分压电阻。']},
  {k:'十三：电学实验综合',id:'专题40',name:'电学综合',L:['测定金属电阻率的实验设计和数据处理。','测量电源电动势和内阻的三种方法。','多用电表的原理和使用(欧姆调零、换挡、读数)。']},
  {k:'十四：磁场中的',id:'专题16',name:'磁场圆模型',L:['带电粒子在磁场中圆周运动：r=mv/qB，T=2pi m/qB。','动态圆模型：入射速度方向或大小变化时轨迹变化规律。','圆形边界磁场中的对称性分析。']},
  {k:'十五：交变',id:'专题21',name:'交变电磁',L:['交变电场中粒子的运动按半周期分段分析。','交变磁场中粒子做螺旋运动。','周期性变化的力和加速度需要分段求解。']},
  {k:'十六：立体空间',id:'专题21',name:'立体空间',L:['立体空间问题考查三维受力分析和运动分解。','将三维运动分解到x、y、z方向分别求解。','磁场与电场垂直时粒子做摆线运动。']},
  {k:'十七：电磁感应中的电路',id:'专题22',name:'电磁电路',L:['电磁感应产生的感应电流在电路中的等效分析。','导体棒在导轨上运动→电源模型(内阻r=R棒)。','感应电流I-t图和安培力F-t图的综合分析。']},
  {k:'十八：电磁感应中的动力学',id:'专题24',name:'电磁动力',L:['电磁感应中的牛顿第二定律联立求解。','安培力做负功→机械能减少→电能增加→焦耳热。','导体棒运动的v-t图分析和收尾速度判断。']},
  {k:'十九：动量观点',id:'专题24',name:'动量电磁',L:['安培力的冲量I=F安t=BLq(与电荷量有关)。','动量定理：BLq=m*Delta v，绕过复杂的变力过程。','双棒模型：动量守恒+能量守恒联立求解。']},
  {k:'二十：波的多解',id:'专题35',name:'波多解',L:['波的多解性来源于波长、传播方向、时间周期性。','已知两质点振动状态求解波长和波速的多解。','波的传播方向不确定导致多解。']},
  {k:'二十一：几何光学',id:'专题31',name:'几何光学',L:['折射定律n1*sin(theta1)=n2*sin(theta2)，全反射sinC=1/n。','透镜成像公式1/f=1/u+1/v和放大率。','双缝干涉Delta x=L*lambda/d和薄膜干涉是高频考点。']},
  {k:'二十二：气体实验',id:'专题27',name:'气体定律',L:['气体三定律：玻意耳(pV=C)、查理(p/T=C)、盖吕萨克(V/T=C)。','理想气体状态方程pV=nRT联系宏观量与微观量。','气体实验中的温度控制和压强测量方法。']},
];

console.log('=== Processing '+M.length+' files ===');
var pn=0;
var allFiles=fs.readdirSync(erDir).filter(function(f){return f.endsWith('.docx')});
M.forEach(function(cfg){
  var fn=allFiles.find(function(f){return f.includes(cfg.k)});
  if(!fn){console.log('NOMATCH:'+cfg.k);return}
  var fp=p.join(erDir,fn);
  var t=extract(fp);
  if(!t||t.length<200){console.log('FAIL:'+cfg.name+' ('+(t?t.length:0)+')');return}
  console.log('EXTRACT:'+cfg.name+' - '+t.length+'c');
  var l=phys.lectures.find(function(x){return x.id===cfg.id});
  if(!l){console.log('NF:'+cfg.id);return}
  l.kaodians.push({title:'二轮强化：'+cfg.name,difficulty:3,sections:[{type:'special',tag:'二轮专项',lines:cfg.L}]});
  proc.files.push({name:'二轮复习-'+cfg.name+'.docx',processed_at:now});
  pn++;
});

fs.writeFileSync(KB+'/physics.json',JSON.stringify(phys,null,2),'utf-8');
fs.writeFileSync(KB+'/processed_files.json',JSON.stringify(proc,null,2),'utf-8');
console.log('\n=== DONE ===');
console.log('Added trends:'+pn);
console.log('P:'+phys.lectures.length+'L/'+phys.lectures.reduce(function(s,l){return s+l.kaodians.length},0)+'kd');
console.log('Files:'+proc.files.length);
