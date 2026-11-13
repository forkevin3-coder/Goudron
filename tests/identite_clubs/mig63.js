// Ancienne sauvegarde v62 (avec clubs déjà supprimés) ouverte dans la v63, puis 3 saisons de plus.
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/auto4g.js','utf8');
let setup=src.slice(src.indexOf('await p.evaluate(([MODE_CID,MODE])=>{')+'await p.evaluate('.length,src.indexOf(",[process.env.CID||'div',process.env.MODE||'pro']);"));
const setupNoNew=setup.replace('newGame(MODE_CID,MODE);shell();advance();','');
const RX=/\b(d_[a-z]{3}(?:_\d+)?|a_[a-z]{3})\b/;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();const errs=[];
const run=async(p,N)=>{for(let i=0;i<2000;i++){const r=await Promise.race([p.evaluate(N=>{let o;for(let k=0;k<10;k++){o=H.step();if(o==='END'||o==='STOP')break;if(G.sn>N)return 'DONE'}return o},N),new Promise(r=>setTimeout(()=>r('TIMEOUT'),20000))]);if(r!=='ok'&&r!=='adv'&&r!=='retry'&&r!=='B')return r}};
const st=p=>p.evaluate(src=>{const RX=new RegExp(src);const all=[...Object.values(G.players),...Object.values(G.gone||{})].flatMap(x=>x.hs||[]);
  return {saison:G.sn,clubs:Object.keys(G.clubs).length,actualitesBrutes:G.news.filter(n=>RX.test(n.t)).length,parcoursSansNom:all.filter(h=>h.cid&&!h.c).length,parcoursVersClubAbsent:all.filter(h=>h.cid&&!G.clubs[h.cid]).length,histJoueurClubsAbsents:(G.hist||[]).filter(h=>!G.clubs[h.club]).map(h=>h.club)}},RX.source);
// 1. v62 : 8 saisons en carrière District
const p1=await ctx.newPage();p1.on('pageerror',e=>errs.push('v62 '+e.message));await p1.addInitScript(()=>{window.NOCINE=1;window.NOMGR=1});
await p1.goto('file://'+__dirname+'/page62.html');await p1.evaluate(()=>localStorage.clear());
await p1.evaluate(`(${setup})(['d_com','district'])`);console.log('v62 :',await run(p1,8));
await p1.evaluate(()=>save());const avant=await st(p1);console.log('AVANT (v62)',JSON.stringify(avant));
const keys=await p1.evaluate(()=>Object.keys(localStorage));const backup=await p1.evaluate(()=>JSON.stringify(localStorage));fs.writeFileSync(__dirname+'/sauvegarde_v62_copie.json',backup);
await p1.close();
// 2. v63 : reprise de la même sauvegarde
const p2=await ctx.newPage();p2.on('pageerror',e=>errs.push('v63 '+e.message));await p2.addInitScript(()=>{window.NOCINE=1;window.NOMGR=1});
await p2.goto('file://'+__dirname+'/page.html');await p2.waitForTimeout(500);const btn=await p2.$('#cont');console.log('bouton Reprendre',!!btn);if(btn){await btn.click();await p2.waitForTimeout(600)}
const apres=await st(p2);console.log('APRÈS CHARGEMENT (v63)',JSON.stringify(apres),'échec affiché',await p2.evaluate(()=>document.body.innerText.includes("n'a pas pu")));
await p2.evaluate(`(${setupNoNew})(['d_com','district'])`);
await p2.evaluate(()=>{window.MK={};const o=window.mkClub;window.mkClub=function(a){MK[a[0]]=(MK[a[0]]||0)+1;return o(a)}});
console.log('v63 :',await run(p2,11));const fin=await st(p2);console.log('APRÈS 3 SAISONS (v63)',JSON.stringify(fin),'recréations',JSON.stringify(await p2.evaluate(()=>Object.entries(MK).filter(([k,v])=>v>0))));
console.log('clés sauvegarde',keys.join(','),'copie',backup.length,'octets');console.log('erreurs',errs.slice(0,5));await b.close();process.exit(0)})();
