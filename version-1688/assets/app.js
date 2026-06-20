(function(){
function ready(fn){if(document.readyState!="loading")fn();else document.addEventListener("DOMContentLoaded",fn)}
ready(function(){
var menu=document.querySelector(".menu-btn"),mobile=document.querySelector(".mobile-nav");
if(menu&&mobile){menu.addEventListener("click",function(){mobile.classList.toggle("open")})}
var slides=[].slice.call(document.querySelectorAll(".hero-slide"));
var dots=[].slice.call(document.querySelectorAll(".hero-dot"));
if(slides.length){var current=0;var show=function(i){slides[current].classList.remove("active");if(dots[current])dots[current].classList.remove("active");current=(i+slides.length)%slides.length;slides[current].classList.add("active");if(dots[current])dots[current].classList.add("active")};dots.forEach(function(dot,i){dot.addEventListener("click",function(){show(i)})});setInterval(function(){show(current+1)},5200)}
var params=new URLSearchParams(location.search);var q=params.get("q")||"";var input=document.querySelector(".filter-input");if(input&&q){input.value=q}
var year=document.querySelector(".filter-year"),region=document.querySelector(".filter-region");
function filter(){var term=(input&&input.value||"").toLowerCase().trim();var y=year&&year.value||"";var r=region&&region.value||"";document.querySelectorAll(".movie-card").forEach(function(card){var ok=true;if(term&&!(card.dataset.search||"").includes(term))ok=false;if(y&&card.dataset.year!==y)ok=false;if(r&&card.dataset.region!==r)ok=false;card.classList.toggle("hidden",!ok)})}
[input,year,region].forEach(function(el){if(el)el.addEventListener("input",filter);if(el)el.addEventListener("change",filter)});filter();
document.querySelectorAll(".scroll-play").forEach(function(a){a.addEventListener("click",function(e){var target=document.querySelector("#play");if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}})})
})
window.bindPlayer=function(url){var video=document.querySelector(".movie-video"),overlay=document.querySelector(".play-overlay");if(!video)return;var started=false;function start(){if(started)return;started=true;if(overlay)overlay.classList.add("hide");video.controls=true;if(video.canPlayType("application/vnd.apple.mpegurl")){video.src=url;video.play().catch(function(){})}else if(window.Hls&&window.Hls.isSupported()){var hls=new Hls();hls.loadSource(url);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,function(){video.play().catch(function(){})})}else{video.src=url;video.play().catch(function(){})}}if(overlay)overlay.addEventListener("click",start);video.addEventListener("click",function(){if(!started)start()})}
})();