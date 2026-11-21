/* ===== حط بيانات مشروعك من Supabase هنا (Project Settings > API) ===== */
var SUPABASE_URL = "https://awwvnlcbwqaydmirxsgr.supabase.co";
var SUPABASE_KEY = "sb_publishable_4SsUamsquAbt0MA9lMuN0g_iViIV3AT";

var sb=null,user=null,jobs=[],myLoc=null,pubLoc=null,mode="login";
try{if(/^https?:\/\//.test(SUPABASE_URL))sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY)}catch(e){}
function $(i){return document.getElementById(i)}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
var VIEWS=["home","seek","auth","dash","form"];
function show(id){VIEWS.forEach(function(x){var e=$(x);e.classList.toggle("hide",x!==id);if(x===id){e.style.animation="none";e.offsetWidth;e.style.animation=""}});window.scrollTo(0,0)}
function norm(p){return String(p).replace(/[\u0660-\u0669]/g,function(c){return c.charCodeAt(0)-1632}).replace(/[\u06F0-\u06F9]/g,function(c){return c.charCodeAt(0)-1776}).replace(/\D/g,"")}
function intl(p){var n=norm(p);if(n.indexOf("0")===0)n="20"+n.slice(1);return n}
function km(a,b,c,d){var R=6371,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r;var h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h))}
function waLink(n,m){return "https://wa.me/"+n+"?text="+encodeURIComponent(m)}
function icon(t){var m=[[/كاشير|بيع|محاسب/,"🛒"],[/سائق|سواق|توصيل|دليفري/,"🛵"],[/نجار|حداد|سباك|كهرباء|عامل|فني/,"🛠️"],[/سكرتير|مكتب|إدار/,"💼"],[/طباخ|شيف|مطعم|كافيه|جرسون/,"👨‍🍳"],[/مدرس|معلم|تدريس/,"📚"],[/أمن|حارس/,"🛡️"],[/تنظيف|نظافة/,"🧹"]];
 for(var i=0;i<m.length;i++)if(m[i][0].test(t))return m[i][1];return "💼"}
function arErr(x){var m=(x&&x.message||"").toLowerCase();
 if(m.indexOf("invalid login")>=0)return "الإيميل أو كلمة السر غلط";
 if(m.indexOf("not confirmed")>=0)return "لازم تأكد الإيميل الأول من الرسالة اللي وصلتك";
 if(m.indexOf("already")>=0)return "الإيميل ده مسجل قبل كده، سجّل دخول";
 if(m.indexOf("rate")>=0||m.indexOf("seconds")>=0)return "حاولت كتير، استنى شوية وجرب تاني";
 if(m.indexOf("valid email")>=0||m.indexOf("invalid")>=0)return "اتأكد من الإيميل";
 return "حصلت مشكلة، حاول تاني"}
function locate(ok,fail){if(!navigator.geolocation){fail();return}navigator.geolocation.getCurrentPosition(function(p){ok({lat:p.coords.latitude,lng:p.coords.longitude})},fail,{timeout:10000})}

async function loadJobs(){
 if(!sb){return "setup"}
 var r=await sb.from("jobs").select("*").eq("is_open",true).order("created_at",{ascending:false}).limit(300);
 if(r.error)return "error";jobs=r.data||[];return "ok"}
function render(){
 var q=$("q").value.trim().toLowerCase();
 var arr=jobs.filter(function(j){return !q||(j.title+" "+j.details+" "+j.address).toLowerCase().indexOf(q)>=0}).map(function(j){return Object.assign({},j,{dist:myLoc?km(myLoc.lat,myLoc.lng,j.lat,j.lng):null})});
 if(myLoc)arr.sort(function(a,b){return a.dist-b.dist});
 $("list").innerHTML=arr.length?arr.map(function(j,i){
  var m="السلام عليكم، أنا عايز أشتغل شغلانة \""+j.title+"\" اللي معروضة على موقع شغلانة، وموافق عليها.";
  return '<div class="card job" style="animation-delay:'+Math.min(i,8)*70+'ms"><div class="jh"><div class="ic">'+icon(j.title)+'</div><h3>'+esc(j.title)+'</h3><div class="price">'+esc(j.pay||"")+'</div></div><p class="jd">'+esc(j.details)+'</p><div class="meta"><span class="tag">📍 '+esc(j.address)+'</span>'
  +(j.dist!=null?'<span class="tag dist">'+j.dist.toFixed(1)+' كم منك</span>':'')+'</div><a class="wa" target="_blank" rel="noopener" href="'+waLink(intl(j.phone),m)+'">💬 عايز أشتغل الشغلانة دي</a></div>'}).join(""):'<div class="empty"><b>🔭</b>مفيش شغلانات مناسبة دلوقتي</div>'}
function countUp(n){var c=0,e=$("cnt");if(!n){e.textContent="0";return}var step=Math.max(1,Math.round(n/20));
 var iv=setInterval(function(){c=Math.min(n,c+step);e.textContent=c;if(c>=n)clearInterval(iv)},50)}
loadJobs().then(function(){countUp(jobs.length)});

$("logo").onclick=function(){show("home")};
document.querySelectorAll("[data-back]").forEach(function(b){b.onclick=function(){show("home")}});
$("q").oninput=render;
$("pickSeek").onclick=async function(){show("seek");myLoc=null;$("list").innerHTML="";$("locMsg").textContent="جاري تحميل الشغلانات...";
 var st=await loadJobs();
 if(st==="setup"){$("locMsg").textContent="الموقع لسه مش متربط بـ Supabase (راجع الإعدادات في index.html).";return}
 if(st==="error"){$("locMsg").textContent="مقدرناش نحمّل الشغلانات، جرب تاني.";return}
 $("locMsg").textContent="جاري تحديد موقعك...";render();
 locate(function(l){myLoc=l;$("locMsg").textContent="📍 مرتبة من الأقرب للأبعد";render()},function(){$("locMsg").textContent="مقدرناش نحدد موقعك، فبنعرض كل الشغلانات."})};

function setMode(m){mode=m;$("tLogin").classList.toggle("on",m==="login");$("tReg").classList.toggle("on",m==="reg");
 $("nameBox").classList.toggle("hide",m==="login");$("aGo").textContent=m==="login"?"دخول":"إنشاء حساب";$("aErr").textContent="";$("aPass").autocomplete=m==="login"?"current-password":"new-password"}
$("tLogin").onclick=function(){setMode("login")};$("tReg").onclick=function(){setMode("reg")};
$("pickEmp").onclick=async function(){
 if(!sb){show("auth");$("aErr").textContent="الموقع لسه مش متربط بـ Supabase.";return}
 var r=await sb.auth.getSession();user=r.data.session?r.data.session.user:null;
 if(user)goDash();else{setMode("login");$("aNote").textContent="";show("auth")}};
$("aGo").onclick=async function(){
 var e=$("aErr");e.textContent="";$("aNote").textContent="";
 if(!sb){e.textContent="الموقع لسه مش متربط بـ Supabase.";return}
 var mail=$("aMail").value.trim(),pw=$("aPass").value;
 if(!mail||pw.length<6){e.textContent="اكتب إيميل صحيح وكلمة سر 6 حروف على الأقل";return}
 var nm="",ph="";
 if(mode==="reg"){nm=$("aName").value.trim();ph=norm($("aPhone").value);if(!nm||ph.length<10){e.textContent="اكتب الاسم ورقم الواتساب";return}}
 $("aGo").disabled=true;
 try{
  var r;
  if(mode==="reg"){r=await sb.auth.signUp({email:mail,password:pw,options:{data:{name:nm,phone:ph},emailRedirectTo:location.origin+location.pathname}});
   if(r.error)throw r.error;
   if(!r.data.session){setMode("login");$("aNote").textContent="📧 بعتنالك إيميل تأكيد، افتحه وبعدين سجّل دخول.";return}}
  else{r=await sb.auth.signInWithPassword({email:mail,password:pw});if(r.error)throw r.error}
  user=r.data.user;$("aPass").value="";goDash();
 }catch(x){e.textContent=arErr(x)}finally{$("aGo").disabled=false}};
$("out").onclick=async function(){try{await sb.auth.signOut()}catch(x){}user=null;show("home")};

function goDash(){var md=user.user_metadata||{};$("hello").textContent="أهلًا "+(md.name||"")+" 👋";show("dash");loadMine()}
async function loadMine(){
 $("mine").innerHTML='<p class="note">جاري التحميل...</p>';
 var r=await sb.from("jobs").select("*").eq("owner",user.id).order("created_at",{ascending:false});
 if(r.error){$("mine").innerHTML='<p class="note">مقدرناش نحمّل إعلاناتك، جرب تاني.</p>';return}
 var arr=r.data||[];
 $("mine").innerHTML=arr.length?arr.map(function(j){
  return '<div class="card"><div class="jh"><div class="ic">'+icon(j.title)+'</div><h3>'+esc(j.title)+'</h3><span class="tag" style="margin-inline-start:auto">'+(j.is_open?"🟢 شغال":"⚪ اتقفل")+'</span></div><div class="meta"><span class="tag">💰 '+esc(j.pay||"-")+'</span><span class="tag">📍 '+esc(j.address)+'</span></div>'
  +(j.is_open?'<button class="btn s" data-close="'+j.id+'">✅ لقيت حد يشتغل - إلغاء الإعلان</button>':'')+'</div>'}).join(""):'<div class="empty"><b>📭</b>لسه ما نشرتش إعلانات</div>';
 document.querySelectorAll("[data-close]").forEach(function(b){b.onclick=async function(){
  if(!confirm("متأكد إنك لقيت حد؟ الإعلان هيختفي من الموقع."))return;
  b.disabled=true;var u=await sb.from("jobs").update({is_open:false}).eq("id",b.dataset.close);
  if(u.error)alert("حصلت مشكلة، حاول تاني");loadMine()}})}
$("newAd").onclick=function(){$("ph").value=(user.user_metadata||{}).phone||"";show("form")};
$("backDash").onclick=goDash;
$("getLoc").onclick=function(){$("locOk").textContent="جاري التحديد...";
 locate(function(l){pubLoc=l;$("locOk").textContent="✅ تم تحديد الموقع"},function(){$("locOk").textContent="تعذر تحديد الموقع، اسمح للمتصفح بالوصول للموقع."})};
$("pub").onclick=async function(){
 var f=$("fErr");f.textContent="";
 var j={title:$("t").value.trim(),details:$("d").value.trim(),pay:$("p").value.trim(),phone:norm($("ph").value),address:$("ad").value.trim()};
 if(j.title.length<2||j.address.length<2||j.phone.length<10||!pubLoc){f.textContent="اكتب اسم الشغلانة والرقم والمكان وحدد موقعك";return}
 j.lat=pubLoc.lat;j.lng=pubLoc.lng;
 $("pub").disabled=true;
 var r=await sb.from("jobs").insert(j);$("pub").disabled=false;
 if(r.error){f.textContent="مقدرناش ننشر الإعلان، اتأكد من البيانات وحاول تاني";return}
 ["t","d","p","ad"].forEach(function(i){$(i).value=""});pubLoc=null;$("locOk").textContent="";goDash()};
/* ===== بصمة PeterParker: خيوط وعناكب وبارتكلز ===== */
(function(){
var cv=$("web"),cx=cv.getContext("2d"),foot=$("foot"),W=0,H=0,P=[],S=[],run=false,raf=0,t0=0;
var still=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
var COL=["#ff2d3d","#3b7bff","#ffffff","#ff7a85"];
function size(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
 S=[[.1,60,0],[.27,100,1.7],[.73,80,3.1],[.9,115,4.6]].map(function(a){return{x:a[0]*W,base:a[1],ph:a[2]}})}
function web(ox,dir){var R=Math.min(W*.36,170),n=7,k=4,i,j;cx.strokeStyle="rgba(255,255,255,.28)";cx.lineWidth=1;
 for(i=0;i<=n;i++){var a=Math.PI/2*i/n;cx.beginPath();cx.moveTo(ox,0);cx.lineTo(ox+dir*Math.cos(a)*R,Math.sin(a)*R);cx.stroke()}
 for(j=1;j<=k;j++){var r=R*j/k;cx.beginPath();for(i=0;i<=n;i++){var a2=Math.PI/2*i/n,px=ox+dir*Math.cos(a2)*r,py=Math.sin(a2)*r;
  if(i===0)cx.moveTo(px,py);else{var am=Math.PI/2*(i-.5)/n,cxp=ox+dir*Math.cos(am)*r*.86,cyp=Math.sin(am)*r*.86;cx.quadraticCurveTo(cxp,cyp,px,py)}}cx.stroke()}}
function spider(x,y,t){cx.strokeStyle="#ddd";cx.lineWidth=1.4;
 for(var s=-1;s<=1;s+=2)for(var i=0;i<4;i++){var o=(i-1.5)*5,w=Math.sin(t*6+i)*2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+s*(10+i*2),y+o+w-4);cx.lineTo(x+s*(17+i*2),y+o+w+6);cx.stroke()}
 cx.fillStyle="#ff2d3d";cx.beginPath();cx.ellipse(x,y+3,8,10,0,0,7);cx.fill();
 cx.fillStyle="#1b2a8a";cx.beginPath();cx.ellipse(x,y-7,5.5,5.5,0,0,7);cx.fill();
 cx.fillStyle="#fff";cx.fillRect(x-4,y-9,3,3);cx.fillRect(x+1,y-9,3,3)}
function burst(x,y){var n=34,i;for(i=0;i<n;i++){var a=Math.random()*6.283,v=1.5+Math.random()*6;
 P.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:1,d:.012+Math.random()*.012,c:COL[i%4],s:2+Math.random()*3.5,g:i%7===0})}
 if(!run)start()}
function draw(ts){t0=ts/1000;cx.clearRect(0,0,W,H);web(0,1);web(W,-1);
 S.forEach(function(s){var y=s.base+(still?0:Math.sin(t0*1.3+s.ph)*26);cx.strokeStyle="rgba(255,255,255,.55)";cx.lineWidth=1;cx.beginPath();cx.moveTo(s.x,0);cx.lineTo(s.x,y-10);cx.stroke();spider(s.x,y,t0)});
 for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.vx*=.99;p.l-=p.d;
  if(p.l<=0){P.splice(i,1);continue}cx.globalAlpha=p.l;
  if(p.g){cx.font="16px serif";cx.fillText("🕷️",p.x,p.y)}else{cx.fillStyle=p.c;cx.shadowColor=p.c;cx.shadowBlur=8;cx.beginPath();cx.arc(p.x,p.y,p.s*p.l+.5,0,7);cx.fill();cx.shadowBlur=0}}
 cx.globalAlpha=1}
function loop(ts){draw(ts);if(run&&(!still||P.length))raf=requestAnimationFrame(loop);else run=false}
function start(){if(run)return;run=true;raf=requestAnimationFrame(loop)}
function stop(){run=false;cancelAnimationFrame(raf)}
size();draw(0);window.addEventListener("resize",function(){size();draw(t0*1000)});
if("IntersectionObserver" in window)new IntersectionObserver(function(e){if(e[0].isIntersecting&&!still)start();else if(!P.length)stop()}).observe(foot);else if(!still)start();
foot.addEventListener("pointerdown",function(e){var r=cv.getBoundingClientRect();burst(e.clientX-r.left,e.clientY-r.top)});
})();
