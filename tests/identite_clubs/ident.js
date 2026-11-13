// Test d'identité des clubs (v63). Usage : PAGE=page.html MODE=pro SEASONS=12 FORCE=1 node ident.js
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/auto4g.js','utf8');
const setup=src.slice(src.indexOf('await p.evaluate(([MODE_CID,MODE])=>{')+'await p.evaluate('.length,src.indexOf(",[process.env.CID||'div',process.env.MODE||'pro']);"));
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext();const p=await ctx.newPage({viewport:{width:1366,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));
await p.addInitScript(()=>{window.NOCINE=1;window.NOMGR=1});
await p.goto('file://'+__dirname+'/'+(process.env.PAGE||'page.html'));
await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});
// instrumentation : chaque création d'objet club est comptée par identifiant
await p.evaluate(()=>{window.MK={};const o=window.mkClub;window.mkClub=function(a){MK[a[0]]=(MK[a[0]]||0)+1;return o(a)}});
await p.evaluate(`(${setup})(['${process.env.CID||'div'}','${process.env.MODE||'pro'}'])`);
await p.evaluate(c=>{window.CID0=G.start==='district'?G.club:null},0);const FORCE=!!process.env.FORCE;
if(FORCE)await p.evaluate(()=>{
  // scénario forcé : un club entrant de district est relégué de Ligue 2, puis remonte la saison suivante
  window.F={phase:0,log:[]};
  const wc=window.worldClose;window.worldClose=function(){wc();const S=G.S;
    if(F.phase===0){const k=G.l2.find(id=>G.clubs[id]&&G.clubs[id].origin==='district'&&id!==G.club);
      if(k){const c=G.clubs[k];F.k=k;F.snap={name:c.name,stadium:c.stadium,c1:c.c1,c2:c.c2,since:c.since,pl:c.pl.slice()};F.phase=1;F.log.push('s'+G.sn+' relégation forcée de '+k+' ('+c.name+')')}}
    if(F.phase===1&&S.l2final)S.l2final=S.l2final.filter(x=>x!==F.k).concat(F.k)};
  const nq=window.nouQualified;window.nouQualified=function(n){const q=nq(n);if(F.phase===2&&F.k&&!inLeague(F.k)){F.phase=3;F.log.push('s'+G.sn+' remontée forcée de '+F.k);return [F.k,...q.filter(x=>x!==F.k)].slice(0,n)}return q};
  const pr=window.promoteRelegate;window.promoteRelegate=function(){pr();if(F.phase===1){F.phase=2;const c=G.clubs[F.k];F.after={moves:JSON.stringify(G.S.moves),tail:JSON.stringify(G.S.l2final.slice(-5)),dk:distKey(distBase(F.k)),l1:G.l1.includes(F.k),club:G.club,exists:!!c,inL2:G.l2.includes(F.k),inDistrict:c?distKey(distBase(F.k))===F.k:false,name:c&&c.name,pl:c?c.pl.filter(id=>F.snap.pl.includes(id)).length:0}}
    else if(F.phase===3){const c=G.clubs[F.k];F.phase=4;F.back={inL2:G.l2.includes(F.k),name:c.name,stadium:c.stadium,since:c.since,same:c.name===F.snap.name&&c.stadium===F.snap.stadium&&c.c1===F.snap.c1&&c.since===F.snap.since,keptPlayers:c.pl.filter(id=>F.snap.pl.includes(id)).length}}}});
const N=+process.env.SEASONS||12;
for(let i=0;i<2000;i++){
 const r=await Promise.race([p.evaluate(N=>{let o;for(let k=0;k<10;k++){o=H.step();if(o==='END'||o==='STOP')break;if(G.sn>N)return 'DONE'}return o},N),new Promise(r=>setTimeout(()=>r('TIMEOUT'),20000))]);
 if(r==='TIMEOUT'){console.log('HANG',await p.evaluate(()=>H.last+' sn '+G.sn).catch(()=>'?'));break}
 if(r==='END'||r==='STOP'||r==='DONE'){console.log('fin :',r,'saison',await p.evaluate(()=>G.sn));break}
}
const RX=/\b(d_[a-z]{3}(?:_\d+)?|a_[a-z]{3})\b/;
const chk=()=>p.evaluate(src=>{const RX=new RegExp(src);
  const reuse=Object.entries(MK).filter(([k,v])=>v>1).map(([k,v])=>k+'×'+v);
  const rawNews=G.news.filter(n=>RX.test(n.t)).map(n=>n.t).slice(0,3);
  const allHs=[...Object.values(G.players),...Object.values(G.gone||{})].flatMap(x=>(x.hs||[]).map(h=>({h,who:x.n})));
  const empty=allHs.filter(o=>o.h.cid&&!o.h.c).length;
  const mism=allHs.filter(o=>o.h.cid&&o.h.c&&G.clubs[o.h.cid]&&o.h.c!==G.clubs[o.h.cid].name).map(o=>o.h.cid+':'+o.h.c+'≠'+G.clubs[o.h.cid].name).slice(0,5);
  const inL=id=>G.l1.includes(id)||G.l2.includes(id);const outD=Object.keys(G.clubs).filter(id=>id!==G.club&&!inL(id)).map(id=>id+'('+G.clubs[id].origin+','+G.clubs[id].pl.length+' j.)');
  const dupNames={};Object.values(G.clubs).forEach(c=>{dupNames[c.name]=(dupNames[c.name]||0)+1});
  return {clubDepart:(window.CID0&&G.clubs[CID0])?CID0+' conservé ('+G.clubs[CID0].name+')':(window.CID0?CID0+' SUPPRIMÉ':'-'),clubJoueur:G.club,saison:G.sn,clubs:Object.keys(G.clubs).length,recreations:reuse,actualitesBrutes:rawNews,parcoursSansNom:empty,parcoursNomDifferent:mism,horsDivision:outD,nomsEnDouble:Object.entries(dupNames).filter(([k,v])=>v>1),taille:JSON.stringify(G).length}},RX.source);
const res=await chk();console.log(JSON.stringify(res,null,1));
if(FORCE)console.log('FORCÉ',JSON.stringify(await p.evaluate(()=>F),null,1));
// sauvegarde, fermeture, reprise
if(process.env.RELOAD){const before=await p.evaluate(()=>{save();return JSON.stringify(Object.values(G.clubs).map(c=>[c.id,c.name,c.stadium,c.since,c.pl.length]).sort())});
  await p.reload();await p.waitForTimeout(500);const btn=await p.$('#cont');if(btn){await btn.click();await p.waitForTimeout(500)}
  const after=await p.evaluate(()=>G?JSON.stringify(Object.values(G.clubs).map(c=>[c.id,c.name,c.stadium,c.since,c.pl.length]).sort()):'pas de partie');
  console.log('REPRISE identique :',before===after,'bouton',!!btn)}
console.log('erreurs',errs.slice(0,5));await b.close();process.exit(0)})();
