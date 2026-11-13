const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));
await p.goto('file://'+process.cwd()+'/page.html');
await p.evaluate(([MODE_CID,MODE])=>{
 window.H={log:[],
 playMatch(){const ev=G.ev;const M=prepMatch(ev.match);const E=newEngine(M,{auto:true});if(R()<.15)eComplain(E);eSimAll(E);finalizeMatch(M);afterMatch(ev,M,true);complete()},
 step(){const ev=G.ev;
  if(G.over){if(G.over.kind==='end')return 'END';if(G.over.offer&&R()<.6){H.log.push('OVER '+G.over.kind+' s'+G.sn+' -> B '+G.over.offer);overTakeB();return 'B'}const s=localStorage.getItem('mdc-season-start');H.log.push('OVER '+G.over.kind+' s'+G.sn+' pos '+G.over.pos+' xi '+userXI().map(id=>P(id).ovr).join(',')+' sq '+squad(G.club).length+' inj '+squad(G.club).filter(p=>p.inj>0).length+' tb '+leagueTable().slice(0,16).map(r=>r.id+':'+r.pts).join(' ')+' str '+G.l1.map(id=>id+':'+teamStr(id).toFixed(0)).join(' '));G=JSON.parse(s);G.over=null;H.retry=(H.retry||0)+1;if(H.retry>3)return 'STOP';advance();return 'retry'}
  if(!ev){advance();return 'adv'}
  H.last=ev.t+(ev.match?' '+ev.match.label:'');
  switch(ev.t){
   case 'intro':G.introDone=1;complete();break;
   case 'prep':prepDo(ev,pick(['stage','local','repos']));complete();break;
   case 'alea':{const i=ri(0,ev.ch.length-1);aleaChoose(ev,i);H.log.push('ALEA s'+G.sn+' '+ev.ak+' -> '+i);complete();break}
   case 'comite':vacStart(['local','abj','tour'][ri(0,2)]);complete();break;
   case 'tournoi':{const ps=G.S.mara.reports.flatMap(r=>r.ps).sort((a,b)=>b.note-a.note).slice(0,2);ps.forEach(p=>{runTrial(p.id).cut=false});G.vacDone=1;console.log('VAC',JSON.stringify(G.S.vac.res.map(r=>r.gf+'-'+r.ga+r.won)),'place',G.S.vac.place);complete();break}
   case 'pre':if(ev.offers&&!ev.chosen){signSponsor(ev.offers[1]);ev.chosen=1}if(!G.S.goal)G.S.goal=['conf','cup','star'][G.sn%3];complete();break;
   case 'mercato':for(const o of ev.offers){const pl=P(o.pid);const room=capRoom();resolveOffer(o,'neg',{sal:Math.max(pl.sal,Math.min(pl.sal*6,pl.sal+room)),promise:true,dur:3,clause:o.fee*2});if(o.status==='failed')resolveOffer(o,'sell',20)}
     for(const id of [...ev.free,...ev.expats]){const q=P(id);if(q&&!q.club)delete G.players[id]}complete();break;
   case 'md':case 'cup':case 'co':case 'mondial':H.playMatch();break;
   case 'drec':{drecAuto(ev);complete();break}
   case 'inv':{if(ev.offers[0])invAccept(ev,0);H.log.push('INV s'+G.sn+' '+ev.offers.map(o=>o.k+':'+o.pct).join(',')+' total '+invTotal());complete();break}
   case 'esp':{if(ev.phase==='pre'){const N=G.S.nl;G.nlStyle=['rue','collectif','costaud'][ri(0,2)];if(N.fx[N.r]&&N.fx[N.r].some(x=>x.h===0||x.a===0)){ev.r=N.r;nlRound()}else ev.none=1;ev.phase='post'}complete();break}
   case 'interim':{const y=R()<.7;H.log.push('INTERIM s'+G.sn+' j'+ev.k+' pos '+ev.pos+' '+(y?'oui':'non'));interimDecide(y);break}
   case 'nou':if(ev.k==='bilan'&&G.S.nou.pro&&G.start==='district'){const N=G.S.nou,q=N.qual.includes(G.club);const ch=q?(N.offerL1&&R()<.5?'l1':'l2'):'B';H.log.push('PROLOGUE '+G.club+' reach '+N.my.reach+' qual '+q+' -> '+ch);finishPrologue(ch);break}
   if(ev.k==='bilan'&&G.S.nou.me<0){complete();break}
   if(ev.k==='bilan'){const N=G.S.nou;const y=G.u18.slice().sort((a,b)=>b.pot-a.pot)[0];if(y)nouSignU18(y.id);if(N.rev[0]&&G.cash>N.rev[0].fee*5)nouSignRev(0);H.log.push('NOU s'+G.sn+' reach '+N.my.reach+' champ '+N.teams[N.champ].name+' qual '+N.qual.join(',')+' myStr '+nouMyStr().toFixed(1));complete()}else{nouPlay(ev,['simple','talents','bloc'][ri(0,2)]);complete()}break;
   case 'end':H.log.push('DIV '+G.l1.length+'/'+G.l2.length+' '+(G.S.moves?JSON.stringify(G.S.moves):'')+' NL '+(G.S.nl?G.S.nl.pos:'-')+' '+squad(G.club).filter(p=>p.nlj).map(p=>p.nlj+'/'+p.nlb).join(',')+' BOARD s'+G.sn+' '+(ev.board?ev.board.items.map(i=>i.l.slice(0,30)+':'+i.d).join(' / ')+' => '+ev.board.conf:'')+' mgrcards');if(G.over){G.ev=null;G.pending=false}else complete();break;
   case 'mara1':{const sc=G.staff.scouts;const used=[];const as=[];for(const x of sc){const t=MARACANAS.filter(m=>m.lvl<=x.lvl&&!used.includes(m.id)).pop();if(t){used.push(t.id);as.push({sid:x.id,tid:t.id})}}sendScouts(as);complete();break}
   case 'mara2':{const mx=Math.min(G.S.mara.reports.length,4-aspCount());G.S.mara.reports.flatMap(r=>r.ps).sort((a,b)=>b.note-a.note).slice(0,Math.max(0,mx)).forEach(p=>runTrial(p.id));complete();break}
   case 'mara3':{for(const tr of G.S.mara.trials.filter(t=>!t.cut)){if(aspCount()>=4)break;const N=genVillage(tr);if(G.S.goal==='star'&&(tr.range[0]+tr.range[1])/2>=80)G.S.starSigned=tr.p.n;N.fam.acc[N.fam.extra.k]=true;N.pres.items.forEach(d=>N.pres.acc[d.k]=true);if(R()<villageProb(N)){addMoney(-villageCost(N),'rec');const x=tr.p;const np=newPlayer({n:x.n,pos:x.pos,age:x.age,ovr:x.ovr,pot:x.pot,club:G.club,ctr:3,sal:N.fam.sal,origin:'maracana',known:false,rev:tr.keys});np.at=x.at;np.asp=true;np.plan=x.at.phy<x.at.men?'muscle':'tactique';np.scoutNote=60;np.qPromise=!!N.fam.acc.temps;me().pl.push(np.id);trackStart(np,'Repéré en juin.');H.signed=(H.signed||0)+1}}complete();break}
   case 'review':{const h=G.hist[G.hist.length-1];const sq=squad(G.club);
     H.log.push(`S${G.sn} ${G.club} role ${G.role} div ${G.S.div} L2 ${G.l2.length} inv ${invTotal()} her ${heritage().tot} pos ${h.pos}/${h.obj} cash ${money(G.cash)} coef ${G.coef} caf ${G.rep.caf} world ${G.rep.world} best ${Math.max(...sq.map(p=>p.ovr))} avg ${(sq.reduce((s,p)=>s+p.ovr,0)/sq.length).toFixed(1)} n=${sq.length} wage ${money(monthlyWage())} cap ${money(wageCap())} c1 ${h.myC1||'-'} c2 ${h.myC2||'-'} tr ${G.fac.train} ac ${G.fac.acad} sold ${G.sold.length} ret ${G.retained.length} conf ${G.board.conf} ferv ${Math.round(G.ferveur)} form ${G.rep.form} asp ${aspCount()} signed ${H.signed||0} sellOn ${G.sellOn.length} mod ${modLevel()} track ${Object.keys(G.track||{}).length} abroad ${Object.values(G.track||{}).filter(t=>t.status==='abroad').length} youth ${JSON.stringify(youthStats())} derby ${(G.S.derby||[]).join('')} size ${JSON.stringify(G).length}`);
     for(const x of INFRA){const l=inf(x.k);if(l<x.lv.length-1&&G.cash>x.cost[l+1]*2){addMoney(-x.cost[l+1],'ins');G.inf[x.k]=l+1;syncTrain()}}
     if(G.fac.acad<4&&!G.fac.proj&&G.cash>150e6){G.fac.proj=3;addMoney(-35e6,'ins')}
     for(const r of ev.renew){const q=P(r.id);if(!q)continue;if(capRoom(q.asp?q.ask:q.ask-q.sal)>=0&&(q.ovr>=60||r.pro)){q.sal=q.ask;q.ctr=r.pro?3:2;if(r.pro)q.asp=false;r.dec='keep'}else{r.dec='go';removeFromClub(q)}}for(const f of ev.family){P(f.id).qPromise=true;f.dec='promise'}
     G.lastLedger={...G.S.ledger};G.pending=false;G.ev=null;startNextSeason();break}
  }return 'ok'}};
 newGame(MODE_CID,MODE);shell();advance();
},[process.env.CID||'div',process.env.MODE||'pro']);
for(let i=0;i<1500;i++){
 const r=await Promise.race([p.evaluate(()=>{let o;for(let k=0;k<10;k++){o=H.step();if(o==='END'||o==='STOP')break}return o}),new Promise(r=>setTimeout(()=>r('TIMEOUT'),15000))]);
 if(r==='TIMEOUT'){console.log('HANG at',await Promise.race([p.evaluate(()=>H.last+' si '+G.S.si+' sn '+G.sn).catch(e=>'?'),new Promise(r=>setTimeout(()=>r('page frozen'),3000))]));break}
 if(r==='END'||r==='STOP'){console.log(r);break}
}
const log=await Promise.race([p.evaluate(()=>H.log.concat(['TRACK '+Object.values(G.track||{}).slice(0,6).map(t=>t.n+': '+t.ev.map(e=>e.y+' '+e.t.slice(0,40)).join(' | ')).join('\n'),'last '+H.last,'ach '+Object.keys(G.ach).join(',')])),new Promise(r=>setTimeout(()=>r(['frozen']),3000))]);
console.log(log.join('\n'));console.log('errors',errs.slice(0,5));
await b.close();process.exit(0)})();
