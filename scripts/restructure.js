const fs=require('fs'),p=require('path');
const KB='C:/Users/方向容/Documents/教育方案改进和工程项目/data/knowledge';

function readJSON(fp){
  var raw=fs.readFileSync(fp,'utf-8');
  if(raw.charCodeAt(0)===0xFEFF)raw=raw.slice(1);
  return JSON.parse(raw);
}

var phys=readJSON(KB+'/physics.json');
var chem=readJSON(KB+'/chemistry.json');

function isPhase2(kd){
  var t=kd.title||'';
  if(t.includes('命题规律')||t.includes('命题趋势')||t.includes('二轮强化')||t.includes('备考建议')||t.includes('备课指导'))return true;
  if(t.includes('近十年'))return true;
  for(var i=0;i<kd.sections.length;i++){
    var s=kd.sections[i];
    if(s.tag&&(s.tag.includes('命题规律')||s.tag.includes('二轮专项')||s.tag.includes('命题趋势')))return true;
  }
  return false;
}

// Restructure physics
var physOut=[];
phys.lectures.forEach(function(l){
  var r1=[], r2=[];
  l.kaodians.forEach(function(kd){
    if(isPhase2(kd))r2.push(kd);else r1.push(kd);
  });
  physOut.push({
    id:l.id,
    title:l.title,
    unit:l.unit,
    phase1:{label:'一轮知识模块',kaodians:r1},
    phase2:{label:'二轮题型突破',kaodians:r2}
  });
});
phys.lectures=physOut;

// Restructure chemistry  
var chemOut=[];
chem.lectures.forEach(function(l){
  var r1=[], r2=[];
  l.kaodians.forEach(function(kd){
    if(isPhase2(kd))r2.push(kd);else r1.push(kd);
  });
  chemOut.push({
    id:l.id,
    title:l.title,
    unit:l.unit,
    phase1:{label:'一轮知识模块',kaodians:r1},
    phase2:{label:'二轮题型突破',kaodians:r2}
  });
});
chem.lectures=chemOut;

// Write with BOM for compatibility
function writeJSON(fp,data){
  var json='\ufeff'+JSON.stringify(data,null,2);
  fs.writeFileSync(fp,json,'utf-8');
}
writeJSON(KB+'/physics.json',phys);
writeJSON(KB+'/chemistry.json',chem);

console.log('Restructuring complete');
// Stats
var p1=phys.lectures.reduce(function(s,l){return s+l.phase1.kaodians.length},0);
var p2=phys.lectures.reduce(function(s,l){return s+l.phase2.kaodians.length},0);
var c1=chem.lectures.reduce(function(s,l){return s+l.phase1.kaodians.length},0);
var c2=chem.lectures.reduce(function(s,l){return s+l.phase2.kaodians.length},0);
console.log('Physics: '+phys.lectures.length+' lectures, phase1='+p1+'kd, phase2='+p2+'kd');
console.log('Chemistry: '+chem.lectures.length+' lectures, phase1='+c1+'kd, phase2='+c2+'kd');
