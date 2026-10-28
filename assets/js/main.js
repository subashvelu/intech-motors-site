var NUM="919500165968";
document.getElementById("f").addEventListener("submit",function(e){e.preventDefault();
var t="Hello Intech Motors, I’d like to book a service.\nName: "+n.value+"\nPhone: "+p.value+"\nVehicle: "+v.value+"\nService: "+s.value+"\nDetails: "+m.value;
window.open("https://wa.me/"+NUM+"?text="+encodeURIComponent(t),"_blank");});
var lb=document.getElementById("lb");
document.querySelectorAll(".gal button").forEach(function(b){b.onclick=function(){lb.firstChild.src=b.querySelector("img").src;lb.classList.add("on")}});
lb.onclick=function(){lb.classList.remove("on")};
var g=document.getElementById("gal"),sl=g.children,dt=document.getElementById("dots");
for(var i=0;i<sl.length;i++){dt.appendChild(document.createElement("i"))}
function st(){return sl[0].offsetWidth+14}
function up(){var k=Math.round(g.scrollLeft/st());[].forEach.call(dt.children,function(d,j){d.className=j==k?"on":""})}
g.addEventListener("scroll",up);up();
document.getElementById("pv").onclick=function(){g.scrollBy({left:-st(),behavior:"smooth"})};
document.getElementById("nx").onclick=function(){g.scrollBy({left:st(),behavior:"smooth"})};
