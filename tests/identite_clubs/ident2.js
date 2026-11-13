// Tests complémentaires (retour sur le correctif) : deux clubs d'un même district, Ligue 2 à 16 clubs
// à chaque transition, continuité des joueurs hors division, statut affiché. Usage : SEASONS=10 node ident2.js
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/auto4g.js','utf8');
const setup=src.slice(src.indexOf('await p.evaluate(([MODE_CID,MODE])=>{')+'await p.evaluate('.length,src.indexOf(",[process.env.CID||'div',process.env.MODE||'pro']);"));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.NOCINE=1;window.NOMGR=1});await p.goto('file://'+__dirname+'/'+(process.env.PAGE||'page.html'));await p.evaluate(()=>localStorage.clear());
await p.evaluate(()=>{window.MK={};const o=window.mkClub;window.mkClub=function(a){MK[a[0]]=(MK[a[0]]||0)+1;return o(a)}});
await p.evaluate(`(${setup})(['div','pro'])`);
await p.evaluate(()=>{
 window.X={phase:0,log:[],inv:[],track:{},cont:[]};
 // saison 1 : un club du district Montagnes monte (d_mon) ; le district reforme une équipe (d_mon_2), forcée en Ligue 2 la saison suivante ;
 // puis les deux clubs de Montagnes sont relégués la même saison.
 const nq=window.nouQualified;window.nouQualified=function(n){let q=nq(n);
   if(X.phase===0&&!inLeague('d_mon')){X.phase=1;X.log.push('s'+G.sn+' montée forcée de d_mon');q=['d_mon',...q.filter(x=>x!=='d_mon')]}
   else if(X.phase===1&&inLeague('d_mon')){const k=distKey(distBase('d_mon'));X.k2=k;X.phase=2;X.log.push('s'+G.sn+' montée forcée de '+k+' (2e club du district)');q=[k,...q.filter(x=>x!==k)]}
   return q.slice(0,n)};
 const wc=window.worldClose;window.worldClose=function(){wc();const S=G.S;if(X.phase===2&&G.l2.includes('d_mon')&&G.l2.includes(X.k2)){X.phase=3;X.snap=['d_mon',X.k2].map(k=>({k,name:G.clubs[k].name,stadium:G.clubs[k].stadium,pl:G.clubs[k].pl.slice()}));X.log.push('s'+G.sn+' relégation forcée des deux clubs de Montagnes')}
 if(X.phase===3&&S.l2final){const two=['d_mon',X.k2];S.l2final=S.l2final.filter(x=>!two.includes(x)).concat(two)}};
 const pr=window.promoteRelegate;window.promoteRelegate=function(){
   pr();
   if(X.phase===3){X.phase=4;const c1=G.clubs['d_mon'],c2=G.clubs[X.k2];X.after={existentLesDeux:!!c1&&!!c2,nomsDistincts:c1.name!==c2.name,noms:[c1.name,c2.name],effectifsDisjoints:!c1.pl.some(id=>c2.pl.includes(id)),joueursConserves:X.snap.map(s=>G.clubs[s.k].pl.filter(id=>s.pl.includes(id)).length+'/'+s.pl.length),equipeDuDistrict:distKey(distBase('d_mon')),enLigue2:[inLeague('d_mon'),inLeague(X.k2)]}}};
});
const N=+process.env.SEASONS||10;let last=0;
for(let i=0;i<3000;i++){
 const r=await Promise.race([p.evaluate(()=>{let o;for(let k=0;k<10;k++){const sn=G.sn;o=H.step();
   if(G.sn!==sn){ // nouvelle saison : contrôles
     const all=G.l1.concat(G.l2),dup=all.length-new Set(all).size;
     X.inv.push({s:G.sn,l1:G.l1.length,l2:G.l2.length,doublons:dup,absents:all.filter(id=>!G.clubs[id]).length});
     for(const id of horsDiv())for(const pid of G.clubs[id].pl){const q=P(pid);if(!q)continue;const t=X.track[pid];
       if(t&&t.s===G.sn-1)X.cont.push({age:q.age-t.age,apps:q.apps,ctr:q.ctr,club:q.club===id});X.track[pid]={s:G.sn,age:q.age}}}
   if(o==='END'||o==='STOP')break;if(G.sn>11)return 'DONE'}return o}),new Promise(r=>setTimeout(()=>r('TIMEOUT'),20000))]);
 if(r==='TIMEOUT'){console.log('HANG');break}if(r==='END'||r==='STOP'||r==='DONE'){console.log('fin',r);break}}
const res=await p.evaluate(()=>{const c=X.cont;return {scenario:X.log,apresRelegation:X.after,
 transitions:X.inv.map(x=>`s${x.s}: L1 ${x.l1} · L2 ${x.l2} · doublons ${x.doublons} · absents ${x.absents}`),
 horsDivision:{suivis:c.length,ageAugmenteDe1:c.filter(x=>x.age===1).length,matchsJoues:c.filter(x=>x.apps>0).length,contratsNegatifs:c.filter(x=>x.ctr<0).length,toujoursAuClub:c.filter(x=>x.club).length},
 recreations:Object.entries(MK).filter(([k,v])=>v>1)}});
// statut affiché dans la fiche du club redescendu et dans le tableau des académies
const aff=await p.evaluate(()=>{const out={};const k=horsDiv().find(id=>G.clubs[id].origin==='district');if(k){openClub(k);out.fiche=k+' → '+(document.querySelector('#ov')||document.body).innerText.split('\n').slice(0,4).join(' | ');closeModal()}
 go('comp','acad');const t=document.body.innerHTML;out.ecranAcademies=t.includes('Championnat des académies');out.academies=(t.match(/club en (Ligue 2|Ligue des Pros)/g)||[]).length+' mentions ; académies en division : '+Object.values(G.clubs).filter(c=>c.origin==='academie'&&inLeague(c.id)).length;return out});
console.log(JSON.stringify(res,null,1));console.log('AFFICHAGE',JSON.stringify(aff,null,1));console.log('erreurs',errs.slice(0,5));await b.close();process.exit(0)})();
