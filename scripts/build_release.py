import json, os, tempfile, zipfile
from pathlib import Path

ROOT = Path(r"C:\Users\方向容\Documents\教育方案改进和工程项目")
DATA_DIR = ROOT / "data" / "knowledge"
OUT_DIR = ROOT / "_release"
OUT_DIR.mkdir(parents=True, exist_ok=True)

chem = json.loads((DATA_DIR / "chemistry.json").read_text("utf-8-sig"))
phys = json.loads((DATA_DIR / "physics.json").read_text("utf-8-sig"))
chem_j = json.dumps(chem, ensure_ascii=False)
phys_j = json.dumps(phys, ensure_ascii=False)

template = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>WuHua-note — 高三复习物化资料</title>
<style>
:root{--bg:#f5f6f8;--surface:#fff;--border:#e2e5ea;--text:#1a1a2e;--text2:#6b7280;--accent:#2563eb;--accent-light:#dbeafe;--radius:6px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);display:flex;flex-direction:column;height:100vh;overflow:hidden;font-size:15px;line-height:1.6}
.header{background:var(--surface);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;gap:16px;flex-shrink:0;flex-wrap:wrap}
.header h1{font-size:18px;font-weight:700}
.header h1 small{font-size:13px;font-weight:400;color:var(--text2);margin-left:8px}
.tabs{display:flex;gap:0;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.tabs button{padding:6px 18px;border:none;background:var(--surface);cursor:pointer;font-size:14px;color:var(--text2)}
.tabs button.active{background:var(--accent);color:#fff}
.tabs button:not(.active):hover{background:var(--accent-light);color:var(--accent)}
.sbar{padding:0 24px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}
.sb{display:flex;align-items:center;gap:8px;padding:8px 0}
.sb input{flex:1;border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;font-size:14px;outline:none}
.sb input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.sb .st{font-size:13px;color:var(--text2);white-space:nowrap}
.body{display:flex;flex:1;overflow:hidden}
.side{width:270px;background:var(--surface);border-right:1px solid var(--border);overflow-y:auto;flex-shrink:0;padding:8px 0}
.grp{margin-bottom:2px}
.gl{padding:8px 16px 4px;font-size:11px;font-weight:600;color:var(--text2);letter-spacing:.3px}
.li{padding:7px 16px 7px 28px;cursor:pointer;font-size:13px;border-left:3px solid transparent;transition:all .1s;display:flex;justify-content:space-between;align-items:center}
.li:hover{background:var(--accent-light)}
.li.active{background:var(--accent-light);color:var(--accent);font-weight:500;border-left-color:var(--accent)}
.li .lm{font-size:11px;color:var(--text2);flex-shrink:0;margin-left:8px}
.main{flex:1;overflow-y:auto;padding:24px;background:var(--bg)}
.card{background:var(--surface);border-radius:var(--radius);box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:16px;overflow:hidden}
.ch{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.ct{font-size:15px;font-weight:600}
.cd{font-size:12px;padding:2px 10px;border-radius:99px;background:var(--accent-light);color:var(--accent);white-space:nowrap;flex-shrink:0}
.sec{padding:12px 20px;border-bottom:1px solid #f0f0f0}
.sec:last-child{border-bottom:none}
.stl{font-size:13px;font-weight:500;color:var(--accent);margin-bottom:6px}
.sl{font-size:14px;line-height:1.8}
.sl p{margin-bottom:3px}
.rh{border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px;font-size:14px;color:var(--text2)}
.ri{padding:12px 16px;margin-bottom:8px;background:var(--surface);border-radius:var(--radius);box-shadow:0 1px 2px rgba(0,0,0,.05);cursor:pointer;border-left:3px solid var(--accent)}
.ri:hover{background:var(--accent-light)}
.ri .rs{font-size:11px;color:var(--text2);margin-bottom:2px}
.ri .rl{font-size:13px;font-weight:600;margin-bottom:4px}
.ri .re{font-size:13px;color:var(--text2);line-height:1.5}
.ri mark{background:#fef08a;padding:0 2px;border-radius:2px}
.em{text-align:center;padding:64px 20px;color:var(--text2);font-size:14px}
</style>
</head>
<body>
<div class="header">
  <h1>WuHua-note <small>高三复习 · 物化资料</small></h1>
  <div class="tabs" id="tabs">
    <button data-s="all" class="active">全部</button>
    <button data-s="化学">化学</button>
    <button data-s="物理">物理</button>
  </div>
</div>
<div class="sbar">
  <div class="sb">
    <input type="text" id="q" placeholder="搜索知识点、考点、关键词…" autofocus>
    <span class="st" id="st"></span>
  </div>
</div>
<div class="body">
  <div class="side" id="side"></div>
  <div class="main" id="main"></div>
</div>
<script>
var C = CHEM_DATA;
var P = PHYS_DATA;
var AL = {};
[C,P].forEach(function(d){
  d.lectures.forEach(function(l){
    l._s = d.subject;
    AL[l._s + "::" + l.id] = l;
  });
});

var AS = "all", AK = null;

  function getKds(l){
    if (l.phase1) {
      var p1 = l.phase1.kaodians || [];
      var p2 = (l.phase2 && l.phase2.kaodians) || [];
      return p1.concat(p2);
    }
    return l.kaodians || [];
  }

function FL(){
  var a = [];
  for(var k in AL){
    var l = AL[k];
    if(AS === "all" || l._s === AS) a.push(l);
  }
  return a;
}

function E(s){
  if(!s) return "";
  var d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function RS(){
  var q = document.getElementById("q").value;
  if(q.trim()){ S(q); return; }
  var ls = FL(), us = {};
  for(var i = 0; i < ls.length; i++){
    var l = ls[i], u = l.unit || "其他";
    if(!us[u]) us[u] = [];
    us[u].push(l);
  }
  var h = "";
  for(var u in us){
    h += '<div class="grp"><div class="gl">' + E(u) + '</div>';
    for(var j = 0; j < us[u].length; j++){
      var l = us[u][j], k = l._s + "::" + l.id;
      var a = (k === AK) ? " active" : "";
        var kc = l.phase1 ? (l.phase1.kaodians || []).length + (l.phase2 ? (l.phase2.kaodians || []).length : 0) : (l.kaodians || []).length;
        h += '<div class="li' + a + '" data-k="' + E(k) + '"><span>' + E(l.id) + ' ' + E(l.title) + '</span><span class="lm">' + kc + '</span></div>';
    }
    h += '</div>';
  }
  document.getElementById("side").innerHTML = h || '<div class="em">暂无内容</div>';
  document.querySelectorAll(".li").forEach(function(el){
    el.addEventListener("click", function(){
      AK = el.dataset.k;
      RS();
      var l = AL[AK];
      if(l) document.getElementById("main").innerHTML = RL(l);
    });
  });
  if(!document.getElementById("q").value.trim())
    document.getElementById("main").innerHTML = '<div class="em">选择一个专题浏览，或输入关键词搜索</div>';
  US();
}

function RL(l){
  var h = '<div class="card"><div class="ch"><div class="ct">' + E(l.id) + ' ' + E(l.title) + '</div><span style="font-size:13px;color:var(--text2)">' + E(l._s) + ' · ' + E(l.unit) + '</span></div>';
  var kds = getKds(l); for(var i = 0; i < kds.length; i++){
    var kd = kds[i];
    h += '<div class="ch" style="background:#fafafa;padding:10px 20px"><div class="ct" style="font-size:14px">' + E(kd.title) + '</div>' + (kd.difficulty ? '<span class="cd">' + E(kd.difficulty) + '</span>' : '') + '</div>';
    for(var j = 0; j < kd.sections.length; j++){
      var s = kd.sections[j];
      if(!s.lines || !s.lines.length) continue;
      var lb = {zhishi:"\u2605 \u77e5\u8bc6\u70b9",kaodian:"\u25b6 \u8003\u70b9",yiqing:"\u26a0 \u6613\u6df7\u70b9",special:"\u2726 \u7279\u6b8a\u8bf4\u660e",fangfa:"\u2699 \u65b9\u6cd5\u6280\u5de7"};
      h += '<div class="sec"><div class="stl">' + (lb[s.type] || s.type) + (s.title ? ' · ' + E(s.title) : '') + '</div><div class="sl">';
      for(var k = 0; k < s.lines.length; k++) h += '<p>' + E(s.lines[k]) + '</p>';
      h += '</div></div>';
    }
  }
  h += '</div>';
  return h;
}

function S(q){
  var Q = q.toLowerCase();
  document.getElementById("side").innerHTML = '<div class="grp"><div class="gl">搜索结果</div></div>';
  var rs = [];
  for(var k in AL){
    var l = AL[k];
    if(AS !== "all" && l._s !== AS) continue;
    for(var i = 0; i < getKds(l).length; i++){
      var kd = getKds(l)[i], sc = 0, ex = [];
      var chk = function(t){
        if(!t) return;
        var lo = t.toLowerCase(), idx = lo.indexOf(Q);
        if(idx !== -1){
          sc++;
          var st = Math.max(0, idx - 15);
          var en = Math.min(t.length, idx + Q.length + 30);
          ex.push((st > 0 ? "..." : "") + t.slice(st, en) + (en < t.length ? "..." : ""));
        }
      };
      chk(kd.title);
      for(var j = 0; j < kd.sections.length; j++){
        chk(kd.sections[j].title);
        for(var m = 0; m < kd.sections[j].lines.length; m++) chk(kd.sections[j].lines[m]);
      }
      if(sc > 0) rs.push({s:l._s, lec:l, kd:kd, ex:ex, sc:sc});
    }
  }
  rs.sort(function(a,b){ return b.sc - a.sc; });
  if(rs.length === 0){
    document.getElementById("main").innerHTML = '<div class="em">未找到相关结果</div>';
    US(0); return;
  }
  var h = '<div class="rh">共找到 ' + rs.length + ' 个相关知识点</div>';
  var rq = Q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for(var i = 0; i < rs.length; i++){
    var r = rs[i];
    var ex = r.ex[0] ? r.ex[0].replace(new RegExp(rq, "gi"), function(m){ return '<mark>' + m + '</mark>'; }) : '';
    h += '<div class="ri" data-k="' + E(r.lec._s + '::' + r.lec.id) + '"><div class="rs">' + E(r.s) + ' · ' + E(r.lec.unit) + ' · ' + E(r.lec.id) + ' ' + E(r.lec.title) + '</div><div class="rl">' + E(r.kd.title) + '</div><div class="re">' + ex + '</div></div>';
  }
  document.getElementById("main").innerHTML = h;
  document.querySelectorAll(".ri").forEach(function(el){
    el.addEventListener("click", function(){
      AK = el.dataset.k;
      RS();
      var l = AL[AK];
      if(l) document.getElementById("main").innerHTML = RL(l);
    });
  });
  US(rs.length);
}

function US(c){
  var e = document.getElementById("st");
  if(c !== undefined){ e.textContent = c + " 条结果"; return; }
  var qv = document.getElementById("q").value.trim();
  if(qv){ e.textContent = ""; return; }
  e.textContent = FL().length + " 个专题";
}

document.getElementById("tabs").addEventListener("click", function(ev){
  var btn = ev.target.closest("button");
  if(!btn) return;
  document.querySelectorAll("#tabs button").forEach(function(b){ b.classList.remove("active"); });
  btn.classList.add("active");
  AS = btn.dataset.s;
  AK = null;
  RS();
});

var searchTimer;
document.getElementById("q").addEventListener("input", function(){
  clearTimeout(searchTimer);
  var inp = this;
  searchTimer = setTimeout(function(){ RS(); }, 150);
});

RS();
</script>
</body>
</html>
"""
html = template.replace("CHEM_DATA", chem_j).replace("PHYS_DATA", phys_j)

search_path = OUT_DIR / "search.html"
search_path.write_text(html, "utf-8")
print(f"search.html: {len(html)/1024:.0f} KB")

version = "1.0"
for platform, lname in [("win", "启动.bat"), ("mac", "启动.command")]:
    with tempfile.TemporaryDirectory() as tmp:
        tp = Path(tmp)
        (tp / "search.html").write_text(html, "utf-8")
        if platform == "win":
            (tp / lname).write_text('@echo off\r\nstart "" "%~dp0search.html"\r\n', "utf-8")
        else:
            (tp / lname).write_text('#!/bin/bash\nopen "$(dirname "$0")/search.html"\n', "utf-8")
            os.chmod(tp / lname, 0o755)
        zname = OUT_DIR / f"WuHua-note-v{version}-{platform}.zip"
        with zipfile.ZipFile(zname, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in tp.iterdir():
                zf.write(f, f.name)
        print(f"{zname.name}: {zname.stat().st_size/1024:.0f} KB")

print("Done!")
