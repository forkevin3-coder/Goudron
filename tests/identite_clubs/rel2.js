// Club du joueur dans les 4 derniers de Ligue 2. Usage : PAGE=page.html CID=a_hor CHOIX=B|rejouer node rel2.js
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/auto4g.js','utf8');
const setup=src.slice(src.indexOf('await p.evaluate(([MODE_CID,MODE])=>{')+'await p.evaluate('.length,src.indexOf(",[process.env.CID||'div',process.env.MODE||'pro']);"));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.NOCINE=1;window.NOMGR=1});await p.goto('file://'+__dirname+'/'+(process.env.PAGE||'page.html'));await p.evaluate(()=>localStorage.clear());
const CID=process.env.CID||'a_hor',CHOIX=process.env.CHOIX||'B';
await p.evaluate(()=>{window.S_acIds=()=>ACADEMIES.map(a=>a.id)});await p.evaluate(`(${setup})(['${CID}','pro'])`);
await p.evaluate(([CID,CHOIX])=>{window.Z={cid:CID,choix:CHOIX,log:[]};
  // équipe affaiblie : le club du joueur finit dans la zone de relégation de Ligue 2
  window.weak=()=>{for(const q of squad(G.club)){q.ovr=Math.min(q.ovr,46);for(const k in q.at)q.at[k]=Math.min(q.at[k],46)}};weak();},[CID,CHOIX]);
let done=false;
for(let i=0;i<3000&&!done;i++){
 const r=await p.evaluate(()=>{for(let k=0;k<10;k++){
   if(G.over){const o=G.over;
     if(!Z.over){const c=G.clubs[Z.cid];Z.over={kind:o.kind,pos:o.pos,saison:G.sn,clubJoueur:G.club,enL2:G.l2.includes(Z.cid),offre:o.offer};
       Z.snap={name:c.name,stadium:c.stadium,pl:c.pl.slice(),since:c.since};
       if(Z.choix==='rejouer'){const s=localStorage.getItem('mdc-season-start');G=JSON.parse(s);G.over=null;Z.rejoue={saison:G.sn,club:G.club,existe:!!G.clubs[Z.cid],enL2:G.l2.includes(Z.cid)};return 'FIN'}
       overTakeB();Z.apresChoix={clubJoueur:G.club,role:G.role,ancienEnL2:G.l2.includes(Z.cid),ancienExiste:!!G.clubs[Z.cid]};continue}
     return 'OVER2 '+o.kind}
   const sn=G.sn;const o=H.step();
   if(Z.over&&G.sn>Z.over.saison&&!Z.apres){const c=G.clubs[Z.cid];Z.apres={saison:G.sn,ancienExiste:!!c,ancienEnL2:G.l2.includes(Z.cid),ancienEnL1:G.l1.includes(Z.cid),
       memeNom:c?c.name===Z.snap.name:false,memeStade:c?c.stadium===Z.snap.stadium:false,joueursConserves:c?c.pl.filter(id=>Z.snap.pl.includes(id)).length+'/'+Z.snap.pl.length:'-',
       equipeDuDistrictOuAcademie:c?(c.origin==='district'?distKey(distBase(Z.cid))===Z.cid:c.origin==='academie'?S_acIds().includes(Z.cid):'club pro'):'-',
       L1:G.l1.length,L2:G.l2.length,doublons:G.l1.concat(G.l2).length-new Set(G.l1.concat(G.l2)).size,clubJoueur:G.club,actualite:G.news.filter(n=>/Quittent la division/.test(n.t)).slice(0,1).map(n=>n.t)};return 'FIN'}
   if(G.sn>6)return 'TROP';if(G.sn!==sn)weak()}return 'ok'});
 if(r==='FIN'||r==='TROP'||String(r).startsWith('OVER2')){console.log('arrêt :',r);done=true}}
await p.evaluate(()=>{window.S_acIds=()=>ACADEMIES.map(a=>a.id)});
console.log(JSON.stringify(await p.evaluate(()=>({over:Z.over,apresChoix:Z.apresChoix,apres:Z.apres,rejoue:Z.rejoue})),null,1));console.log('erreurs',errs.slice(0,5));await b.close();process.exit(0)})();
