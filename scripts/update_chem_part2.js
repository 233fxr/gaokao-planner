const fs = require('fs');

// Read temp extracted text
const tempPath = 'C:\\Users\\方向容\\Documents\\教育方案改进和工程项目\\data\\knowledge\\temp_extract.json';
const extracted = JSON.parse(fs.readFileSync(tempPath, 'utf-8').replace(/^\uFEFF/, ''));
const texts = {};
extracted.forEach(e => { texts[e.num] = e.text; });

const newLectures = [];

// 专题11: 硫及其化合物
newLectures.push({
  id: '专题11', title: '硫及其化合物', unit: '元素化合物',
  kaodians: [
    { title: '考点一 硫单质的性质', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 硫的物理与化学性质', lines: [
        '硫是淡黄色固体，不溶于水，微溶于酒精，易溶于CS2。硫有正交硫、单斜硫等同素异形体。',
        '硫与金属反应生成低价金属硫化物：2Cu+S=Cu2S(黑色)；Fe+S=FeS(黑色)。',
        '硫与非金属反应：S+O2=点燃=SO2(蓝紫色火焰)；S+H2=H2S。',
        '硫在自然界中以游离态(火山口)和化合态(硫化物FeS2、硫酸盐)存在。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '硫与变价金属反应生成低价硫化物(Cu2S、FeS)，体现硫的弱氧化性。',
        'Hg+S=HgS可用于处理散落的汞(水银)。'
      ]}
    ]},
    { title: '考点二 二氧化硫的性质', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 SO2的特性', lines: [
        'SO2是无色有刺激性气味的有毒气体，密度比空气大，易溶于水(1:40)。',
        'SO2+H2O=H2SO3(亚硫酸，中强酸，不稳定易分解)。',
        'SO2漂白性：与有色物质结合生成不稳定的无色物质，加热恢复原色(区别于HClO的氧化漂白)。',
        'SO2还原性：2SO2+O2=2SO3(催化剂加热)；SO2+Br2+2H2O=H2SO4+2HBr(使溴水褪色)。',
        'SO2弱氧化性：SO2+2H2S=3S+2H2O(生成S沉淀)。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        'SO2使品红褪色是特征反应(用于检验)，加热品红溶液恢复红色证明其漂白可逆。',
        'SO2漂白范围窄(品红等少数物质)，不能漂白酸碱指示剂。'
      ]}
    ]},
    { title: '考点三 浓硫酸的特性', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 浓硫酸三大特性', lines: [
        '吸水性：浓硫酸吸收空气中的水分(常用干燥剂，不能干燥NH3、H2S、HI等)。',
        '脱水性：浓硫酸按2:1比例脱去有机物中的H、O(如蔗糖炭化变黑)。',
        '强氧化性：Cu+2H2SO4(浓)=CuSO4+SO2+2H2O。常温下使Fe、Al钝化。',
        '稀硫酸由H+体现弱氧化性，与活泼金属反应生成H2，不与Cu反应。',
        'C+2H2SO4(浓)=CO2+2SO2+2H2O(同时生成两种气体)。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '浓硫酸与金属反应时，随反应进行浓度降低为稀硫酸后不再产生SO2。'
      ]}
    ]}
  ]
});

// 专题12: 氮及其化合物
newLectures.push({
  id: '专题12', title: '氮及其化合物', unit: '元素化合物',
  kaodians: [
    { title: '考点一 氮气与氮的固定', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 氮气的性质与固定', lines: [
        'N2无色无味气体，密度略小于空气，难溶于水。N=N键能大(946 kJ/mol)，化学性质稳定。',
        'N2+O2=放电/高温=2NO(汽车发动机中产生氮氧化物)。',
        '氮的固定：自然界(雷电固氮、根瘤菌固氮)和人工(合成氨N2+3H2=2NH3、制硝酸)。'
      ]}
    ]},
    { title: '考点二 氨与铵盐', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 氨的性质与制取', lines: [
        'NH3无色有刺激性气味，密度比空气小，极易溶于水(1:700，形成喷泉实验)。',
        'NH3+H2O=NH3.H2O=NH4++OH-，氨水呈弱碱性。',
        '实验室制NH3：2NH4Cl+Ca(OH)2=CaCl2+2H2O+2NH3。向下排空气法收集，碱石灰干燥。',
        'NH3催化氧化(工业制硝酸)：4NH3+5O2=催化剂/加热=4NO+6H2O。',
        'NH3+HCl=NH4Cl(产生白烟，检验NH3的方法)。'
      ]},
      { type: 'zhishi', title: '知识点二 铵盐的性质', lines: [
        '铵盐受热易分解：NH4Cl=NH3+HCl(遇冷又结合)；NH4HCO3=NH3+H2O+CO2。',
        'NH4++OH-=NH3+H2O(加热产生NH3)是NH4+的检验方法。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '喷泉实验原理：NH3极易溶使烧瓶内压强迅速降低，大气压将水压入烧瓶。'
      ]}
    ]},
    { title: '考点三 硝酸的性质', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 硝酸的强氧化性', lines: [
        'HNO3无色易挥发液体，浓HNO3呈黄色(溶有NO2)。浓HNO3常温下使Fe、Al钝化。',
        'Cu+4HNO3(浓)=Cu(NO3)2+2NO2+2H2O。3Cu+8HNO3(稀)=3Cu(NO3)2+2NO+4H2O。',
        '硝酸浓度不同还原产物不同：浓NO2，稀NO，更稀N2O/N2/NH4+。',
        '王水(浓HNO3:浓HCl=1:3)能溶解金铂。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '硝酸与金属反应计算用电子守恒法：N降价的数目等于金属升价总数。'
      ]}
    ]}
  ]
});

// 专题13: 碳硅及其化合物
newLectures.push({
  id: '专题13', title: '碳硅及其化合物', unit: '元素化合物',
  kaodians: [
    { title: '考点一 碳及其化合物', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 碳族元素', lines: [
        '碳同素异形体：金刚石(原子晶体最硬)、石墨(混合型可导电)、C60(分子晶体)。',
        'CO2+H2O=H2CO3；CO2+Ca(OH)2=CaCO3+H2O(检验CO2)。',
        'CO可燃性(2CO+O2=2CO2蓝色火焰)、还原性(CO+CuO=Cu+CO2冶炼金属)。',
        'CO2少量与碱生成碳酸盐，过量生成碳酸氢盐。'
      ]}
    ]},
    { title: '考点二 硅与二氧化硅', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 硅的性质与用途', lines: [
        'Si半导体材料，制芯片、太阳能电池。晶体硅原子晶体。',
        'Si+2NaOH+H2O=Na2SiO3+2H2。Si+2F2=SiF4。',
        'SiO2原子晶体(石英、水晶、沙石)，制光导纤维。',
        'SiO2+2NaOH=Na2SiO3+H2O(试剂瓶用橡胶塞)。SiO2+4HF=SiF4+2H2O(HF腐蚀玻璃)。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        'C和Si同属IVA族，但SiO2原子晶体(高熔点)，CO2分子晶体(常温气态)。',
        '硅酸H2SiO3不溶于水，由可溶性硅酸盐与酸反应制得。'
      ]}
    ]}
  ]
});

// 专题14: 实验装置操作与安全
newLectures.push({
  id: '专题14', title: '化学实验装置与操作', unit: '化学实验',
  kaodians: [
    { title: '考点一 常见仪器与基本操作', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 常用仪器使用', lines: [
        '可直接加热：试管、坩埚、蒸发皿、燃烧匙。垫石棉网加热：烧杯、烧瓶、锥形瓶。',
        '量筒精确到0.1 mL，不能加热、不能作反应容器。滴定管精确到0.01 mL。',
        '容量瓶使用前需检漏，不能作反应容器，不能加热，不能长期存放溶液。',
        '托盘天平精确到0.1 g(左物右码)。pH试纸使用前不能用蒸馏水润湿。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '仪器选择根据实验目的(制气、分离、提纯、检验、定量分析)选择对应仪器。',
        '过滤操作口诀：一贴二低三靠。蒸馏温度计水银球在支管口处。'
      ]}
    ]},
    { title: '考点二 实验安全与事故处理', difficulty: 1, sections: [
      { type: 'zhishi', title: '知识点一 常见事故处理', lines: [
        '酒精灯着火用湿抹布盖灭。浓H2SO4沾皮肤：先干布擦再用大量水冲，涂NaHCO3。',
        '碱液沾皮肤：大量水冲洗后涂硼酸。苯酚：酒精清洗。',
        '金属钠着火用沙土盖灭(不能用水或CO2灭火器)。可燃性气体点燃前需验纯。',
        '有毒气体(Cl2、CO、SO2等)需尾气处理。安全瓶防倒吸。'
      ]}
    ]}
  ]
});

// 专题15: 物质的分离提纯与检验
newLectures.push({
  id: '专题15', title: '物质的分离提纯与检验', unit: '化学实验',
  kaodians: [
    { title: '考点一 物质的分离与提纯', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 分离提纯方法', lines: [
        '过滤：分离不溶性固体和液体。蒸发结晶：获得可溶性固体晶体(余热蒸干)。',
        '蒸馏：分离沸点不同的液体。温度计水银球在支管口，加碎瓷片防暴沸。',
        '分液：分离互不相溶液体。分液漏斗需检漏，下层下口出上层上口出。',
        '萃取：溶质在互不相溶溶剂中溶解度不同。萃取剂与溶剂不互溶不反应。',
        '除杂原则：不增不减易分离。Cl2中HCl用饱和食盐水洗涤。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '洗气除杂：饱和NaHCO3溶液除去CO2中的HCl。饱和食盐水除去Cl2中的HCl。'
      ]}
    ]},
    { title: '考点二 物质的检验与鉴别', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 常见物质检验', lines: [
        '气体：O2(带火星木条复燃)；H2(淡蓝色火焰产物只有水)；CO2(澄清石灰水变浑)；Cl2(湿润KI淀粉试纸变蓝)。',
        '离子：Fe3+(KSCN变红)；Fe2+(KSCN不变加氯水变红)；NH4+(加碱加热湿润红石蕊试纸变蓝)。',
        '有机官能团：C2H5OH(酸性K2Cr2O7变绿)；-CHO(银镜反应/新制Cu(OH)2加热产生红色沉淀)。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '实验方案评价四要点：科学性、可行性、安全性、简约性。',
        '控制变量法探究影响反应因素时每次只改变一个变量。'
      ]}
    ]}
  ]
});

// 专题16: 化学综合实验
newLectures.push({
  id: '专题16', title: '化学综合实验', unit: '化学实验',
  kaodians: [
    { title: '考点一 常见气体的实验室制备', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 气体的发生与收集', lines: [
        '固+固加热型(O2、NH3)：大试管管口略向下倾斜防冷凝水倒流。',
        '固+液不加热型(H2、CO2)：启普发生器。固+液加热型(Cl2、SO2)：圆底烧瓶+分液漏斗。',
        '收集方法：向上排空气法(密度>空气)、向下排空气法(密度<空气)、排水法(难溶气体)。',
        '尾气处理：可溶性气体水/碱液吸收(防倒吸)；可燃性气体(CO)点燃处理。'
      ]},
      { type: 'zhishi', title: '知识点二 综合实验设计', lines: [
        '设计思路：明确目的→选原理→设计装置(发生→除杂→干燥→主体→尾气处理)→操作→分析结论。',
        '产率=实际产量/理论产量×100%。误差分析从操作规范性、试剂用量分析。',
        '实验顺序：先检装置气密性→再加药品；先通气体排空气→再加热；先撤导管→再停止加热防倒吸。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '综合实验题是高考压轴题型，考查装置连接、除杂顺序、实验操作、现象描述和定量计算。'
      ]}
    ]}
  ]
});

// 专题17: 反应热与盖斯定律
newLectures.push({
  id: '专题17', title: '反应热与盖斯定律', unit: '化学反应与能量',
  kaodians: [
    { title: '考点一 反应热与焓变', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 反应热基本概念', lines: [
        '反应热(H)：反应中吸收或放出的热量(kJ/mol)。放热H<0，吸热H>0。',
        '中和热：稀强酸碱生成1 mol水时的反应热，H=-57.3 kJ/mol。',
        '燃烧热：1 mol纯物质完全燃烧生成稳定氧化物时放出的热量。H2燃烧热285.8 kJ/mol。',
        '常见吸热反应：大多数分解反应、盐类水解、电离；C+CO2=2CO(高温)。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        'H=反应物总键能-生成物总键能。放热不意味常温自发，吸热不意味不自发。'
      ]}
    ]},
    { title: '考点二 热化学方程式', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 书写规则', lines: [
        '需注明物质状态(s/l/g/aq)和H的符号、数值、单位。',
        'H与化学计量数成正比，计量数可以是分数。可逆反应的H表示完全反应。',
        '比较H大小注意符号：放热越多H越小(负得多)。'
      ]}
    ]},
    { title: '考点三 盖斯定律及应用', difficulty: 4, sections: [
      { type: 'zhishi', title: '知识点一 盖斯定律计算', lines: [
        '盖斯定律：反应不管一步还是多步完成，总反应热相同。H=各步H代数和。',
        '加减法：将已知方程式加减消去中间物得目标方程。',
        '注意：方程式反转H符号反转，计量数乘n时H也乘n。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '盖斯定律计算是高考必考点，掌握首尾消去法和加合法。'
      ]}
    ]}
  ]
});

// 专题18: 原电池及其应用
newLectures.push({
  id: '专题18', title: '原电池及其应用', unit: '化学反应与能量',
  kaodians: [
    { title: '考点一 原电池原理', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 原电池构成与原理', lines: [
        '原电池将化学能转化为电能。构成：自发氧化还原反应、不同活性电极、电解质溶液、闭合回路。',
        '负极较活泼，失电子发生氧化反应(溶解)。正极较不活泼，得电子发生还原反应(产生气体或析出金属)。',
        'Zn-Cu原电池(稀H2SO4)：负极Zn-2e=Zn2+(溶解)，正极2H++2e=H2(产生H2)。',
        '盐桥保持两溶液电中性，形成闭合回路，提高电池效率。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '电极反应式书写：负极失电子(活泼金属阳离子)，正极得电子(H+/O2/氧化性离子)。'
      ]}
    ]},
    { title: '考点二 常见化学电源', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 一次与二次电池', lines: [
        '铅蓄电池(二次电池)：放电Pb+SO42--2e=PbSO4(负极)；PbO2+4H++SO42-+2e=PbSO4+2H2O(正极)。',
        '锂电池能量密度高。燃料电池将燃料(H2/CH4/CH3OH)和O2的化学能直接转化为电能。',
        '氢氧燃料电池(酸)：负极2H2-4e=4H+；正极O2+4H++4e=2H2O。',
        '(碱)：负极2H2+4OH--4e=4H2O；正极O2+2H2O+4e=4OH-。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '电极反应式书写关键：根据电解质环境确定产物，注意介质酸碱性影响。'
      ]}
    ]},
    { title: '考点三 金属腐蚀与防护', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 电化学腐蚀与防护', lines: [
        '钢铁吸氧腐蚀：负极Fe-2e=Fe2+；正极O2+2H2O+4e=4OH-。生成Fe(OH)2再氧化为铁锈。',
        '析氢腐蚀(酸性环境)：正极2H++2e=H2。',
        '金属防护：覆盖保护层、牺牲阳极法(连接更活泼Zn，被保护金属作正极)、外加电流阴极保护法。'
      ]}
    ]}
  ]
});

// 专题19: 电解池及其应用
newLectures.push({
  id: '专题19', title: '电解池及其应用', unit: '化学反应与能量',
  kaodians: [
    { title: '考点一 电解原理', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 电解池构成与原理', lines: [
        '电解池将电能转化为化学能。构成：直流电源、两电极、电解质溶液(或熔融电解质)。',
        '阳极(接正极)发生氧化反应。阴极(接负极)发生还原反应。',
        '阳极放电顺序：活性电极>S2->I->Br->Cl->OH->含氧酸根。',
        '阴极放电顺序：Ag+>Fe3+>Cu2+>H+>Fe2+>Zn2+>Al3+。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '记住阴极放电顺序的金口诀：金铂银汞铜铁锌，铝镁钠钙钾。'
      ]}
    ]},
    { title: '考点二 电解规律与计算', difficulty: 4, sections: [
      { type: 'zhishi', title: '知识点一 电解四种基本类型', lines: [
        '电解水型：含氧酸(H2SO4)、强碱(NaOH)、活泼金属含氧酸盐(Na2SO4)。',
        '电解电解质型：无氧酸(HCl)、不活泼金属无氧酸盐(CuCl2)。',
        '放H2生碱型：NaCl溶液。放O2生酸型：CuSO4溶液。',
        '电解计算遵循电子守恒。Q=I.t=n(e-).F(F=96500 C/mol)。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '电解计算常用关系：4e-O2-2H2-2Cl2-2Cu-4Ag，各电极产物电子对应关系。',
        '电解原理常与原电池联合考查。'
      ]}
    ]},
    { title: '考点三 电解的应用', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 工业应用', lines: [
        '氯碱工业：电解饱和食盐水，阳极Cl2，阴极H2和NaOH。',
        '电镀：镀件作阴极，镀层金属作阳极。电解精炼铜：粗铜阳极纯铜阴极。',
        '电冶金：电解熔融NaCl制Na，电解熔融Al2O3制Al(加冰晶石降低熔点)。'
      ]},
      { type: 'special', tag: '名师点拨', lines: [
        '四种电解类型(电解水、电解质、放H2生碱、放O2生酸)根据电解质成分判断产物。',
        '氯碱工业常与离子交换膜结合考查。'
      ]}
    ]}
  ]
});

// 专题20: 化学反应速率
newLectures.push({
  id: '专题20', title: '化学反应速率', unit: '化学反应原理',
  kaodians: [
    { title: '考点一 反应速率概念与计算', difficulty: 2, sections: [
      { type: 'zhishi', title: '知识点一 反应速率的表达', lines: [
        'v=c/t，单位mol/(L.s)或mol/(L.min)。',
        '同一反应中各物质速率之比等于化学计量数之比。比较快慢需换算为同一物质。'
      ]}
    ]},
    { title: '考点二 影响反应速率的因素', difficulty: 3, sections: [
      { type: 'zhishi', title: '知识点一 影响因素', lines: [
        '内因(决定)：反应物自身性质(Na与水比Fe剧烈得多)。',
        '浓度：增大反应物浓度速率加快(气体或溶液)。固体、纯液体视为常数。',
        '压强：增大压强(缩小体积)使气体浓度增大从而加快反应。',
        '温度：升温加快反应。每升高10度速率约增为2-4倍(范特霍夫规则)。',
        '催化剂：正催化剂加快反应(降低活化能)，具有选择性。'
      ]},
      { type: 'zhishi', title: '知识点二 碰撞理论与活化能', lines: [
        '有效碰撞条件：足够能量+适当取向。活化分子：能量达到活化能的分子。',
        '催化剂降低活化能提高活化分子百分数。温度升高使更多分子获得能量成为活化分子。',
        '增大浓度/压强使单位体积内活化分子总数增多加快反应。'
      ]},
      { type: 'special', tag: '考法归纳', lines: [
        '反应速率影响是高考必考点，常以图像题考查。',
        '控制变量法探究时每次只改变一个变量其他相同。'
      ]}
    ]}
  ]
});

// Read existing chemistry.json and append
const chemPath = 'C:\\Users\\方向容\\Documents\\教育方案改进和工程项目\\data\\knowledge\\chemistry.json';
const chemistry = JSON.parse(fs.readFileSync(chemPath, 'utf-8').replace(/^\uFEFF/, ''));
chemistry.lectures = chemistry.lectures.concat(newLectures);
fs.writeFileSync(chemPath, JSON.stringify(chemistry, null, 2), 'utf-8');

// Summary
console.log('Updated chemistry.json with lectures 11-20');
console.log('Total lectures: ' + chemistry.lectures.length);
let totalKaodian = 0, totalSection = 0, totalLine = 0;
newLectures.forEach(l => {
  totalKaodian += l.kaodians.length;
  l.kaodians.forEach(k => {
    totalSection += k.sections.length;
    k.sections.forEach(s => totalLine += s.lines.length);
  });
});
console.log('New kaodian: ' + totalKaodian);
console.log('New sections: ' + totalSection);
console.log('New lines: ' + totalLine);

// Clean up temp file
fs.unlinkSync(tempPath);
console.log('Temp file cleaned up');
