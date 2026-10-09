/* Mode relecture REROOM EDIT. Sendo touche un texte, le corrige sur place, puis envoie ou valide.
   Les retours partent vers un webhook Make, sans compte ni mot de passe. */
(function(){
 'use strict';
 var CFG=window.RELECTURE||{};
 var NUM=CFG.numero||'N01', HOOK=CFG.webhook, CLE='rr-relecture-'+NUM;
 var blocs=[].slice.call(document.querySelectorAll('[data-ed]'));
 var origine={};
 blocs.forEach(function(b){origine[b.dataset.ed]=b.innerText.trim();b.setAttribute('contenteditable','true');b.setAttribute('spellcheck','true')});
 // brouillon local, pour ne rien perdre si la page se ferme
 try{var br=JSON.parse(localStorage.getItem(CLE)||'null');if(br&&br.textes){blocs.forEach(function(b){var t=br.textes[b.dataset.ed];if(typeof t==='string'&&t!==origine[b.dataset.ed])b.innerText=t})}}catch(e){}
 function el(t,a,h){var n=document.createElement(t);for(var k in a)n.setAttribute(k,a[k]);if(h!=null)n.innerHTML=h;document.body.appendChild(n);return n}
 var top=el('div',{id:'rl-top'},'<span><b>Mode relecture</b> · touche un texte pour le modifier</span>');
 setTimeout(function(){top.classList.add('cache')},6000);
 var bar=el('div',{id:'rl-bar'},'<div class="in"><div class="compte"><b id="rl-n">Aucune modification</b>REROOM EDIT N°01 · lundi 10h</div><button class="rl-btn clair" id="rl-env" disabled>Envoyer</button><button class="rl-btn fonce" id="rl-val">Je valide</button></div>');
 var voile=el('div',{id:'rl-voile'});
 var sheet=el('div',{id:'rl-sheet'},'<div class="in"><h4 id="rl-st"></h4><p id="rl-sp"></p><ul id="rl-sl"></ul><textarea id="rl-note" placeholder="Un mot pour l\'équipe ? (facultatif)"></textarea><div class="actions"><button class="rl-btn clair" id="rl-ann">Retour</button><button class="rl-btn fonce" id="rl-ok"></button></div></div>');
 var toast=el('div',{id:'rl-toast'});
 var $=function(i){return document.getElementById(i)};
 var NOMS={titre:'Titre',piece:'La pièce',idee:'Idée de shoot',enclair:'En clair',mot:'Le Mot'};
 function nom(id){if(NOMS[id])return NOMS[id];var m=id.match(/breve0(\d)(_titre)?/);return m?('Brève 0'+m[1]+(m[2]?' (titre)':'')):id}
 function changes(){return blocs.filter(function(b){return b.innerText.trim()!==origine[b.dataset.ed]}).map(function(b){return{id:b.dataset.ed,bloc:nom(b.dataset.ed),avant:origine[b.dataset.ed],apres:b.innerText.trim()}})}
 function maj(){var c=changes();blocs.forEach(function(b){b.classList.toggle('modifie',b.innerText.trim()!==origine[b.dataset.ed])});
  $('rl-n').textContent=c.length?(c.length+(c.length>1?' modifications':' modification')):'Aucune modification';$('rl-env').disabled=!c.length;
  try{var t={};blocs.forEach(function(b){t[b.dataset.ed]=b.innerText.trim()});localStorage.setItem(CLE,JSON.stringify({textes:t}))}catch(e){}}
 blocs.forEach(function(b){b.addEventListener('input',maj);b.addEventListener('focus',function(){top.classList.add('cache')})});
 // coller sans mise en forme
 document.addEventListener('paste',function(e){var t=e.target.closest&&e.target.closest('[data-ed]');if(!t)return;e.preventDefault();var x=(e.clipboardData||window.clipboardData).getData('text');document.execCommand('insertText',false,x)});
 var mode=null;
 function ouvrir(m){mode=m;var c=changes();
  $('rl-st').textContent=m==='validation'?'Valider pour lundi 10h':'Envoyer tes corrections';
  $('rl-sp').textContent=m==='validation'?(c.length?(c.length>1?'Le numéro part lundi à 10h avec tes '+c.length+' modifications.':'Le numéro part lundi à 10h avec ta modification.'):'Le numéro part lundi à 10h tel quel.'):'L\'équipe reçoit tes changements. Tu peux revenir et valider plus tard.';
  $('rl-sl').innerHTML=c.map(function(x){return'<li>Changement dans <b>'+x.bloc+'</b></li>'}).join('');
  $('rl-ok').textContent=m==='validation'?'Je valide 🖤':'Envoyer';
  voile.style.display='block';requestAnimationFrame(function(){sheet.classList.add('ouvert')})}
 function fermer(){sheet.classList.remove('ouvert');setTimeout(function(){voile.style.display='none'},250)}
 function dire(h){toast.innerHTML=h;toast.classList.add('vu');setTimeout(function(){toast.classList.remove('vu')},4200)}
 $('rl-env').onclick=function(){ouvrir('corrections')};$('rl-val').onclick=function(){ouvrir('validation')};
 $('rl-ann').onclick=fermer;voile.onclick=fermer;
 $('rl-ok').onclick=function(){var b=this;b.disabled=true;
  var data={numero:NUM,action:mode,changes:changes(),note:$('rl-note').value.trim(),page:location.href,quand:new Date().toISOString()};
  fetch(HOOK,{method:'POST',mode:'no-cors',body:new URLSearchParams({payload:JSON.stringify(data)})}).then(function(){
   fermer();b.disabled=false;$('rl-note').value='';
   if(mode==='validation'){dire('<b>C\'est validé.</b> Départ lundi 10h 🖤');$('rl-val').textContent='Validé ✓';$('rl-val').disabled=true}
   else dire('<b>Corrections envoyées.</b> L\'équipe les reporte dans la newsletter.');
  }).catch(function(){b.disabled=false;dire('Pas de réseau, réessaie dans un instant.')})};
 maj();
})();
