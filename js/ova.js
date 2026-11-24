/* Voz en off (síntesis de voz del navegador, en inglés) */
let voiceOn=false,lastK=-1;
const tts=window.speechSynthesis;
function speak(txt){if(!voiceOn||!tts)return;tts.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang='en-US';u.rate=.85;tts.speak(u)}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S={A:0,B:0,C:0,Q:0};
function stars(){const t=S.A+S.B+S.C+S.Q;$('#stars').textContent='⭐ '+t+' / 12';$('#bar i').style.width=t/12*100+'%';save()}
function tabs(host,labels,prefix){const h=$(host);labels.forEach((l,i)=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('role','tab');b.setAttribute('aria-selected',i==0);b.onclick=()=>{[...h.children].forEach((x,j)=>x.setAttribute('aria-selected',i==j));labels.forEach((_,j)=>$('#'+prefix+j).hidden=i!=j)};h.appendChild(b)})}
tabs('#gtabs',['Resumen','Ejemplos','Errores'],'g');tabs('#ctabs',['Reto A','Reto B','Reto C'],'c');

/* Warm-up */
const duels=[['🐆','🦅','cheetah','falcon',1,'Cheetah is fast, but the falcon is faster!'],['🦒','🐘','giraffe','elephant',0,'The giraffe is taller than the elephant!'],['🪐','🔵','Jupiter','Neptune',0,'Jupiter is bigger than Neptune!'],['🌕','🔥','Venus','Mercury',0,'Venus is hotter than Mercury!']];
duels.forEach(d=>{const el=document.createElement('div');el.innerHTML=`<p>${d[2]} vs. ${d[3]}</p><div class="opt"><button aria-label="${d[2]}">${d[0]}</button><button aria-label="${d[3]}">${d[1]}</button></div>`;el.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{$('#say').textContent=(i==d[4]?'🎉 ':'🤔 ')+d[5]});$('#duel').appendChild(el)});

/* Video preview */
const sc=[
[0,'🐆🐢','Hi, explorers! The cheetah is faster than the turtle. The turtle is slower than the cheetah. Today you learn to compare things and find the champion!','faster than · slower than'],
[15,'📏','Short adjectives have one syllable. Add e r for the comparative, and the, e s t, for the superlative. Tall, taller, the tallest. The giraffe is taller than the elephant. Big, bigger, the biggest. Heavy, heavier, the heaviest.','tall → taller → the tallest<br>big → bigger → the biggest'],
[55,'🦁','Long adjectives have two or more syllables. Use more for the comparative and the most for the superlative. Dangerous, more dangerous, the most dangerous. Never say more taller, or the most fast!','dangerous → more dangerous → the most dangerous'],
[95,'😈','Irregular adjectives are rebels. Good, better, the best. Bad, worse, the worst. Far, farther, the farthest. You must memorize them!','good → better → the best<br>bad → worse → the worst'],
[125,'🔑','Two key words. Use than for comparatives: Jupiter is bigger than Earth. Use the for superlatives: Jupiter is the biggest planet.','bigger <b>than</b> · <b>the</b> biggest'],
[145,'🏁','Now it is your turn, Record Detective! Go to the challenges.','¡A los retos!']];
const names=['Intro','Cortos','Largos','Irregulares','Than / The','¡Vamos!'];let t=0,timer=null,done=false;
const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function show(){let k=0;sc.forEach((x,i)=>{if(t>=x[0])k=i});$('#scene').textContent=sc[k][1];$('#formula').innerHTML=sc[k][3];if(k!==lastK){lastK=k;if(timer)speak(sc[k][2])}$('#vo').textContent=$('#cc').getAttribute('aria-pressed')=='true'?sc[k][2]:'';$('#prog').style.width=t/160*100+'%';$('#time').textContent=fmt(t)}
function unlock(){if(done)return;done=true;$('#challenges').classList.remove('lock');$('#quiz').classList.remove('lock');$('#lockmsg').textContent='¡Genial! Gana hasta 3 estrellas en cada reto.'}
$('#play').onclick=()=>{if(timer){clearInterval(timer);timer=null;if(tts)tts.cancel();$('#play').textContent='▶';return}$('#play').textContent='⏸';timer=setInterval(()=>{t+=1;if(t>=160){t=160;clearInterval(timer);timer=null;$('#play').textContent='▶';unlock()}show()},1000)};
$('#cc').onclick=e=>{e.target.setAttribute('aria-pressed',e.target.getAttribute('aria-pressed')!='true');show()};
names.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.onclick=()=>{t=sc[i][0];show()};$('#chap').appendChild(b)});
$('#skip').onclick=unlock;show();

/* A */
const ca=[['fast',0],['tall',0],['small',0],['hot',0],['cold',0],['big',0],['heavy',0],['large',0],['dangerous',1],['beautiful',1],['intelligent',1],['expensive',1]];
const hintA={dangerous:'dan-ge-rous = 3 sílabas → ¡LARGO!',beautiful:'beau-ti-ful = 3 sílabas → ¡LARGO!',intelligent:'in-tel-li-gent = 4 sílabas → ¡LARGO!',expensive:'ex-pen-sive = 3 sílabas → ¡LARGO!'};
let selA=null,okA=0,errA=0,placed=0;
ca.forEach(c=>{const b=document.createElement('button');b.textContent=c[0];b.onclick=()=>{$$('#cardsA .sel').forEach(x=>x.classList.remove('sel'));selA={b,c};b.classList.add('sel')};$('#cardsA').appendChild(b)});
[['#bs',0],['#bl',1]].forEach(([id,k])=>{const bx=$(id);const go=()=>{if(!selA)return;const{b,c}=selA;if(c[1]==k){const s=document.createElement('span');s.textContent=c[0];bx.appendChild(s);b.remove();selA=null;placed++;if(!errA||true)okA++;$('#fbA').className='fb ok';$('#fbA').textContent='¡Bien! '+(k?'Los adjetivos largos usan more / most.':'“'+c[0]+'” es corto: -er / -est.');if(placed==12){S.A=errA<=1?3:errA<=4?2:1;stars();$('#fbA').textContent='🎉 ¡Terminaste! Errores: '+errA+'. Estrellas: '+S.A}}else{errA++;$('#fbA').className='fb bad';$('#fbA').textContent='Casi. '+(hintA[c[0]]||'Cuenta las sílabas: '+c[0]+' tiene una → ¡CORTO!')}};bx.onclick=go;bx.onkeydown=e=>{if(e.key=='Enter')go()}});

/* B */
const rb=[['🪐','Jupiter is ___ planet in the Solar System.','the biggest','the bigger','the most big'],['☿️','Mercury is ___ planet.','the smallest','the most small','smaller'],['🔥','Venus is ___ planet.','the hottest','the hotest','the most hot'],['🔭','Neptune is ___ planet from the Sun.','the farthest','the most far','farer'],['🐆','The cheetah is ___ land animal.','the fastest','the most fast','faster'],['🦒','The giraffe is ___ animal on land.','the tallest','the most tall','taller'],['🐋','The blue whale is ___ animal in the world.','the heaviest','the most heavy','the heavyest'],['🦥','The sloth is one of ___ animals.','the slowest','the most slow','slower']];
const fun=['¡En Júpiter cabrían más de 1.000 Tierras!','Mercurio es solo un poco más grande que nuestra Luna.','Venus es más caliente que Mercurio por su atmósfera espesa.','Neptuno está unas 30 veces más lejos del Sol que la Tierra.','¡Un guepardo corre unos 110 km/h!','Una jirafa mide cerca de 5 metros.','El corazón de una ballena azul es tan grande como un carro pequeño.','Un perezoso duerme hasta 15 horas al día.'];
rb.forEach((r,i)=>{const o=[r[2],r[3],r[4]].sort(()=>Math.random()-.5);const d=document.createElement('div');d.className='row';d.innerHTML=`<span class="e">${r[0]}</span><span>${r[1].split('___')[0]}</span><select aria-label="respuesta ${i+1}"><option value="">elige…</option>${o.map(x=>`<option>${x}</option>`).join('')}</select><span>${r[1].split('___')[1]}</span><div class="m" id="m${i}"></div>`;$('#rowsB').appendChild(d)});
$('#chkB').onclick=()=>{let n=0;$$('#rowsB select').forEach((s,i)=>{const m=$('#m'+i);if(s.value==rb[i][2]){n++;m.className='m ok';m.textContent='✅ Dato curioso: '+fun[i]}else{m.className='m bad';m.textContent=s.value?'❌ Revisa la regla: cortos → the -est; largos → the most. ¡Cuidado con la ortografía!':'Elige una respuesta.'}});S.B=n==8?3:n>=6?2:n>=4?1:0;stars();$('#fbB').textContent=n+' / 8 correctas · '+S.B+' ⭐'};

/* C */
const sc2=[['Jupiter is more big than Mars.',3,'bigger',['bigger','biggest','most big'],'Adjetivo corto: no lleva “more”.'],['The cheetah is the most fast animal on land.',3,'the fastest',['the fastest','the faster','fastest'],'Adjetivo corto → the -est.'],['A blue whale is heavier that an elephant.',4,'than',['than','then','of'],'Comparativo + THAN.'],['This is the most good pet in my house.',3,'the best',['the best','the goodest','the better'],'Irregular: good → better → best.'],['Mercury is more small than Venus.',2,'smaller',['smaller','smallest','most small'],'Adjetivo corto: small → smaller.'],['A lion is dangerouser than a rabbit.',3,'more dangerous',['more dangerous','most dangerous','dangerer'],'Adjetivo largo → more.']];
/* word index = position among words, spans mark wrong word ranges */
const wrongC=[[3,4],[3,5],[4],[3,4],[2,3],[3]];let doneC=0,errC=0;
sc2.forEach((s,i)=>{const ws=s[0].replace('.','').split(' ');const d=document.createElement('div');d.className='sent';const wd=document.createElement('div');ws.forEach((w,j)=>{const sp=document.createElement('span');sp.className='w';sp.textContent=w+' ';sp.onclick=()=>{if(d.dataset.done)return;if(wrongC[i].includes(j)){ws.forEach((_,k)=>wd.children[k].classList.remove('x'));wrongC[i].forEach(k=>wd.children[k].classList.add('x'));ch.hidden=false;f.className='ok';f.textContent='¡Encontraste el error! Ahora elige la corrección.'}else{errC++;sp.classList.add('x');f.className='bad';f.textContent='Esa palabra está bien. Mira otra vez.'}};wd.appendChild(sp)});
const ch=document.createElement('div');ch.className='ch';ch.hidden=true;s[3].forEach(o=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{if(o==s[2]){d.dataset.done=1;f.className='ok';f.textContent='✅ Correcto: '+s[2]+'. '+s[4];wrongC[i].forEach(k=>wd.children[k].className='w g');ch.hidden=true;doneC++;if(doneC==6){S.C=errC==0?3:errC<=3?2:1;stars();$('#fbC').textContent='🎉 ¡Corregiste todos los errores! '+S.C+' ⭐'}}else{errC++;f.className='bad';f.textContent='❌ Esa no. '+s[4]}};ch.appendChild(b)});
const f=document.createElement('div');f.className='fb';d.append(wd,ch,f);$('#sentC').appendChild(d)});

/* Quiz */
const Q=[['An elephant is ___ a mouse.',['bigger than','more big than','biggest than'],0,'short'],['Saturn is ___ planet with famous rings.',['more beautiful','the most beautiful','the beautifulest'],1,'long'],['This movie is ___ than that one.',['gooder','more good','better'],2,'irr'],['Elige la oración correcta.',['The snail is slowest animal.','The snail is the slowest animal.','The snail is the most slow animal.'],1,'short'],['Venus is ___ Earth.',['hotter than','hoter than','more hot than'],0,'short'],['A shark is ___ a dolphin.',['more dangerous than','dangerouser than','the most dangerous'],0,'long'],['Encuentra el error: “Mars is smaller that Earth.”',['smaller','that','Mars'],1,'than'],['Neptune is ___ planet from the Sun.',['the farthest','the most far','farer'],0,'irr']];
const tip={short:'Adjetivos cortos → -er / the -est (columna azul).',long:'Adjetivos largos → more / the most (columna naranja).',irr:'¡Los irregulares son rebeldes! good → better → best.',than:'Comparativo + THAN. Superlativo + THE.'};
let qi=0,qs=0;
function renderQ(){const b=$('#qbox');if(qi>=Q.length){const lv=qs>=7?['🏆','Champion Explorer','¡Eres un maestro de los récords!']:qs>=5?['🥈','Skilled Detective','¡Casi lo logras! Repite los retos para ganar más estrellas.']:qs>=3?['🥉','Junior Explorer','¡Buen comienzo! Mira el video otra vez e inténtalo de nuevo.']:['🌱','Rookie','¡No te rindas! Mira el video otra vez.'];S.Q=qs>=7?3:qs>=5?2:qs>=3?1:0;stars();b.innerHTML=`<div class="res"><div class="big">${lv[0]}</div><h2>${lv[1]}</h2><p>${lv[2]}</p><p>Puntaje: ${qs} / 8 · Estrellas totales: ${S.A+S.B+S.C+S.Q} / 12</p><p>¿Puedo comparar animales y planetas en inglés?<br><button>😟</button> <button>😐</button> <button>😀</button></p><button id="rt">Intentar de nuevo</button></div>`;$('#rt').onclick=()=>{qi=0;qs=0;renderQ()};return}
const q=Q[qi];b.innerHTML=`<p>Pregunta ${qi+1} de 8</p><h3>${q[0]}</h3><div class="ans">${q[1].map((o,i)=>`<button data-i="${i}">${String.fromCharCode(97+i)}) ${o}</button>`).join('')}</div><div class="fb" id="fbQ" aria-live="polite"></div>`;
$$('#qbox .ans button').forEach(x=>x.onclick=()=>{const i=+x.dataset.i;$$('#qbox .ans button').forEach(y=>y.disabled=true);const f=$('#fbQ');if(i==q[2]){qs++;x.classList.add('c');f.className='fb ok';f.textContent='¡Muy bien! 🎉 '+tip[q[3]]}else{x.classList.add('w2');$$('#qbox .ans button')[q[2]].classList.add('c');f.className='fb bad';f.innerHTML='Recuerda: '+tip[q[3]]+' <a href="#lab" class="link-review">Repasar el laboratorio</a>'}
const n=document.createElement('button');n.textContent=qi<7?'Siguiente pregunta':'Ver mi resultado';n.onclick=()=>{qi++;renderQ()};f.after(n)})}
renderQ();

/* Page navigation */
const PG=['warm','lab','challenges','quiz'];let cur='warm',initial=true;
function save(){try{localStorage.setItem('ova7',JSON.stringify({page:cur,S,done}))}catch(e){}}
function go(p){if(!PG.includes(p))p='warm';PG.forEach(x=>$('#'+x).classList.toggle('on',x==p));$$('nav a').forEach(a=>a.classList.toggle('cur',a.getAttribute('href')=='#'+p));try{history.replaceState(null,'','#'+p)}catch(e){}cur=p;save();if(!initial)window.scrollTo(0,0)}
document.addEventListener('click',e=>{const el=e.target.closest('a[href^="#"],[data-go]');if(!el)return;const p=el.dataset.go||el.getAttribute('href').slice(1);if(!PG.includes(p))return;e.preventDefault();go(p)});
addEventListener('hashchange',()=>go(location.hash.slice(1)));
let st=null;try{st=JSON.parse(localStorage.getItem('ova7'))}catch(e){}
if(st){Object.assign(S,st.S||{});stars();if(st.done)unlock()}
const h0=location.hash.slice(1);go(PG.includes(h0)?h0:(st&&st.page)||'warm');initial=false;
$('#voice').onclick=e=>{voiceOn=!voiceOn;e.currentTarget.setAttribute('aria-pressed',voiceOn);if(!voiceOn&&tts)tts.cancel();else if(timer){lastK=-1;show()}};
if(!tts)$('#voice').hidden=true;
