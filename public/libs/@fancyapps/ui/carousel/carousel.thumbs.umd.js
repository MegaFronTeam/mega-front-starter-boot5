!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).window=t.window||{})}(this,(function(t){"use strict";const e=(t,...i)=>{const n=i.length;for(let s=0;s<n;s++){const n=i[s]||{};Object.entries(n).forEach((([i,n])=>{const s=Array.isArray(n)?[]:{};var r;t[i]||Object.assign(t,{[i]:s}),"object"==typeof(r=n)&&null!==r&&r.constructor===Object&&"[object Object]"===Object.prototype.toString.call(r)?Object.assign(t[i],e(s,n)):Array.isArray(n)?Object.assign(t,{[i]:[...n]}):Object.assign(t,{[i]:n})}))}return t},i=function(t){var e=(new DOMParser).parseFromString(t,"text/html").body;if(e.childElementCount>1){for(var i=document.createElement("div");e.firstChild;)i.appendChild(e.firstChild);return i}return e.firstChild},n=t=>`${t||""}`.split(" ").filter((t=>!!t)),s=(t,e)=>{t&&n(e).forEach((e=>{t.classList.add(e)}))},r=(t,e,i)=>{n(e).forEach((e=>{t&&t.classList.toggle(e,i||!1)}))},o=function(t,e){return t.split(".").reduce(((t,e)=>"object"==typeof t?t[e]:void 0),e)};class a{constructor(t={}){Object.defineProperty(this,"options",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"events",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),this.setOptions(t);for(const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))t.startsWith("on")&&"function"==typeof this[t]&&(this[t]=this[t].bind(this))}setOptions(t){this.options=t?e({},this.constructor.defaults,t):{};for(const[t,e]of Object.entries(this.option("on")||{}))this.on(t,e)}option(t,...e){let i=o(t,this.options);return i&&"function"==typeof i&&(i=i.call(this,this,...e)),i}optionFor(t,e,i,...n){let s=o(e,t);var r;"string"!=typeof(r=s)||isNaN(r)||isNaN(parseFloat(r))||(s=parseFloat(s)),"true"===s&&(s=!0),"false"===s&&(s=!1),s&&"function"==typeof s&&(s=s.call(this,this,t,...n));let a=o(e,this.options);return a&&"function"==typeof a?s=a.call(this,this,t,...n,s):void 0===s&&(s=a),void 0===s?i:s}cn(t){const e=this.options.classes;return e&&e[t]||""}localize(t,e=[]){t=String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g,((t,e,i)=>{let n="";return i?n=this.option(`${e[0]+e.toLowerCase().substring(1)}.l10n.${i}`):e&&(n=this.option(`l10n.${e}`)),n||(n=t),n}));for(let i=0;i<e.length;i++)t=t.split(e[i][0]).join(e[i][1]);return t=t.replace(/\{\{(.*?)\}\}/g,((t,e)=>e))}on(t,e){let i=[];"string"==typeof t?i=t.split(" "):Array.isArray(t)&&(i=t),this.events||(this.events=new Map),i.forEach((t=>{let i=this.events.get(t);i||(this.events.set(t,[]),i=[]),i.includes(e)||i.push(e),this.events.set(t,i)}))}off(t,e){let i=[];"string"==typeof t?i=t.split(" "):Array.isArray(t)&&(i=t),i.forEach((t=>{const i=this.events.get(t);if(Array.isArray(i)){const t=i.indexOf(e);t>-1&&i.splice(t,1)}}))}emit(t,...e){[...this.events.get(t)||[]].forEach((t=>t(this,...e))),"*"!==t&&this.emit("*",t,...e)}}Object.defineProperty(a,"version",{enumerable:!0,configurable:!0,writable:!0,value:"5.0.20"}),Object.defineProperty(a,"defaults",{enumerable:!0,configurable:!0,writable:!0,value:{}});class l extends a{constructor(t,e){super(e),Object.defineProperty(this,"instance",{enumerable:!0,configurable:!0,writable:!0,value:t})}attach(){}detach(){}}var h,c;!function(t){t[t.Init=0]="Init",t[t.Error=1]="Error",t[t.Ready=2]="Ready",t[t.Panning=3]="Panning",t[t.Mousemove=4]="Mousemove",t[t.Destroy=5]="Destroy"}(h||(h={})),function(t){t[t.Init=0]="Init",t[t.Ready=1]="Ready",t[t.Destroy=2]="Destroy"}(c||(c={}));const u=(t,e=1e4)=>(t=parseFloat(t+"")||0,Math.round((t+Number.EPSILON)*e)/e),d={classes:{container:"f-thumbs f-carousel__thumbs",viewport:"f-thumbs__viewport",track:"f-thumbs__track",slide:"f-thumbs__slide",isResting:"is-resting",isSelected:"is-selected",isLoading:"is-loading",hasThumbs:"has-thumbs"},minCount:2,parentEl:null,thumbTpl:'<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',type:"modern"};t.States=void 0,function(t){t[t.Init=0]="Init",t[t.Ready=1]="Ready",t[t.Hidden=2]="Hidden",t[t.Disabled=3]="Disabled"}(t.States||(t.States={}));class p extends l{constructor(){super(...arguments),Object.defineProperty(this,"type",{enumerable:!0,configurable:!0,writable:!0,value:"modern"}),Object.defineProperty(this,"container",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"track",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"carousel",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"panzoom",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"thumbWidth",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"thumbClipWidth",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"thumbHeight",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"thumbGap",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"thumbExtraGap",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"shouldCenter",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.defineProperty(this,"state",{enumerable:!0,configurable:!0,writable:!0,value:t.States.Init})}formatThumb(t,e){return this.instance.localize(e,[["%i",t.index],["%d",t.index+1],["%s",t.thumbSrc||"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"]])}getSlides(){const t=[],e=this.option("thumbTpl")||"";if(e)for(const i of this.instance.slides||[]){let n="";i.type&&(n=`for-${i.type}`,i.type&&["video","youtube","vimeo","html5video"].includes(i.type)&&(n+=" for-video")),t.push({html:this.formatThumb(i,e),customClass:n})}return t}onInitSlide(t,e){const i=e.el;i&&(e.thumbSrc=i.dataset.thumbSrc||e.thumbSrc||"",e.thumbClipWidth=parseFloat(i.dataset.thumbClipWidth||"")||e.thumbClipWidth||0,e.thumbHeight=parseFloat(i.dataset.thumbHeight||"")||e.thumbHeight||0)}onInitSlides(){this.state===t.States.Init&&this.build()}onRefreshM(){this.refreshModern()}onChangeM(){"modern"===this.type&&(this.shouldCenter=!0,this.centerModern())}onClickModern(t){t.preventDefault(),t.stopPropagation();const e=this.instance,i=e.page,n=t=>{if(t){const e=t.closest("[data-carousel-index]");if(e)return parseInt(e.dataset.carouselIndex||"",10)||0}return-1},s=(t,e)=>{const i=document.elementFromPoint(t,e);return i?n(i):-1};let r=n(t.target);r<0&&(r=s(t.clientX+this.thumbGap,t.clientY),r===i&&(r=i-1)),r<0&&(r=s(t.clientX-this.thumbGap,t.clientY),r===i&&(r=i+1)),r<0&&(r=(e=>{let n=s(t.clientX-e,t.clientY),o=s(t.clientX+e,t.clientY);return r<0&&n===i&&(r=i+1),r<0&&o===i&&(r=i-1),r})(this.thumbExtraGap)),r===i?this.centerModern():r>-1&&r<e.pages.length&&e.slideTo(r)}onTransformM(){if("modern"!==this.type)return;const{instance:t,container:e,track:i}=this,n=t.panzoom;if(!(e&&i&&n&&this.panzoom))return;r(e,this.cn("isResting"),n.state!==h.Init&&n.isResting);const s=this.thumbGap,o=this.thumbExtraGap,a=this.thumbClipWidth;let l=0,c=0,u=0;for(const e of t.slides){let i=e.index,n=e.thumbSlideEl;if(!n)continue;r(n,this.cn("isSelected"),i===t.page),c=1-Math.abs(t.getProgress(i)),n.style.setProperty("--progress",c?c+"":"");const h=.5*((e.thumbWidth||0)-a);l+=s,l+=h,c&&(l-=c*(h+o)),n.style.setProperty("--shift",l-s+""),l+=h,c&&(l-=c*(h+o)),l-=s,0===i&&(u=o*c)}i&&(i.style.setProperty("--left",u+""),i.style.setProperty("--width",l+u+s+o*c+"")),this.shouldCenter&&this.centerModern()}buildClassic(){const{container:t,track:i}=this,n=this.getSlides();if(!t||!i||!n)return;const s=new this.instance.constructor(t,e({track:i,infinite:!1,center:!0,fill:!0,dragFree:!0,slidesPerPage:1,transition:!1,Dots:!1,Navigation:!1,classes:{container:"f-thumbs",viewport:"f-thumbs__viewport",track:"f-thumbs__track",slide:"f-thumbs__slide"}},this.option("Carousel")||{},{Sync:{target:this.instance},slides:n}));this.carousel=s,this.track=i,s.on("ready",(()=>{this.emit("ready")})),s.on("createSlide",((t,e)=>{this.emit("createSlide",e,e.el)}))}buildModern(){if("modern"!==this.type)return;const{container:t,track:e,instance:n}=this,r=this.option("thumbTpl")||"";if(!t||!e||!r)return;s(t,"is-horizontal"),this.updateModern();for(const t of n.slides||[]){const n=document.createElement("div");if(s(n,this.cn("slide")),t.type){let e=`for-${t.type}`;["video","youtube","vimeo","html5video"].includes(t.type)&&(e+=" for-video"),s(n,e)}n.appendChild(i(this.formatThumb(t,r))),this.emit("createSlide",t,n),t.thumbSlideEl=n,e.appendChild(n),this.resizeModernSlide(t)}const o=new n.constructor.Panzoom(t,{content:e,lockAxis:"x",zoom:!1,panOnlyZoomed:!1,bounds:()=>{let t=0,e=0,i=n.slides[0],s=n.slides[n.slides.length-1],r=n.slides[n.page];return i&&s&&r&&(e=-1*this.getModernThumbPos(0),0!==n.page&&(e+=.5*(i.thumbWidth||0)),t=-1*this.getModernThumbPos(n.slides.length-1),n.page!==n.slides.length-1&&(t+=(s.thumbWidth||0)-(r.thumbWidth||0)-.5*(s.thumbWidth||0))),{x:{min:t,max:e},y:{min:0,max:0}}}});o.on("touchStart",((t,e)=>{this.shouldCenter=!1})),o.on("click",((t,e)=>this.onClickModern(e))),o.on("ready",(()=>{this.centerModern(),this.emit("ready")})),o.on(["afterTransform","refresh"],(t=>{this.lazyLoadModern()})),this.panzoom=o,this.refreshModern()}updateModern(){if("modern"!==this.type)return;const{container:t}=this;t&&(this.thumbGap=parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-gap"))||0,this.thumbExtraGap=parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-extra-gap"))||0,this.thumbWidth=parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-width"))||40,this.thumbClipWidth=parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-clip-width"))||40,this.thumbHeight=parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-height"))||40)}refreshModern(){var t;if("modern"===this.type){this.updateModern();for(const t of this.instance.slides||[])this.resizeModernSlide(t);this.onTransformM(),null===(t=this.panzoom)||void 0===t||t.updateMetrics(!0),this.centerModern(0)}}centerModern(t){const e=this.instance,{container:i,panzoom:n}=this;if(!i||!n||n.state===h.Init)return;const s=e.page;let r=this.getModernThumbPos(s),o=r;for(let t=e.page-3;t<e.page+3;t++){if(t<0||t>e.pages.length-1||t===e.page)continue;const i=1-Math.abs(e.getProgress(t));i>0&&i<1&&(o+=i*(this.getModernThumbPos(t)-r))}let a=100;void 0===t&&(t=.2,e.inTransition.size>0&&(t=.12),Math.abs(-1*n.current.e-o)>n.containerRect.width&&(t=.5,a=0)),n.options.maxVelocity=a,n.applyChange({panX:u(-1*o-n.target.e,1e3),friction:null===e.prevPage?0:t})}lazyLoadModern(){const{instance:t,panzoom:e}=this;if(!e)return;const n=-1*e.current.e||0;let r=this.getModernThumbPos(t.page);if(e.state!==h.Init||0===r)for(const r of t.slides||[]){const t=r.thumbSlideEl;if(!t)continue;const o=t.querySelector("img[data-lazy-src]"),a=r.index,l=this.getModernThumbPos(a),h=n-.5*e.containerRect.innerWidth,c=h+e.containerRect.innerWidth;if(!o||l<h||l>c)continue;let u=o.dataset.lazySrc;if(!u||!u.length)continue;if(delete o.dataset.lazySrc,o.src=u,o.complete)continue;s(t,this.cn("isLoading"));const d=i('<div class="f-spinner"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle><circle cx="25" cy="25" r="20"></circle></svg></div>');t.appendChild(d),o.addEventListener("load",(()=>{t.offsetParent&&(t.classList.remove(this.cn("isLoading")),d.remove())}),!1)}}resizeModernSlide(t){if("modern"!==this.type)return;if(!t.thumbSlideEl)return;const e=t.thumbClipWidth&&t.thumbHeight?Math.round(this.thumbHeight*(t.thumbClipWidth/t.thumbHeight)):this.thumbWidth;t.thumbWidth=e}getModernThumbPos(t){const e=this.instance.slides[t],i=this.panzoom;if(!i||!i.contentRect.fitWidth)return 0;let n=i.containerRect.innerWidth,s=i.contentRect.width;2===this.instance.slides.length&&(t-=1,s=2*this.thumbClipWidth);let r=t*(this.thumbClipWidth+this.thumbGap)+this.thumbExtraGap+.5*(e.thumbWidth||0);return r-=s>n?.5*n:.5*s,u(r||0,1)}build(){const e=this.instance,i=e.container,n=this.option("minCount")||0;if(n){let i=0;for(const t of e.slides||[])t.thumbSrc&&i++;if(i<n)return this.cleanup(),void(this.state=t.States.Disabled)}const r=this.option("type");if(["modern","classic"].indexOf(r)<0)return void(this.state=t.States.Disabled);this.type=r;const o=document.createElement("div");s(o,this.cn("container")),s(o,`is-${r}`);const a=this.option("parentEl");a?a.appendChild(o):i.after(o),this.container=o,s(i,this.cn("hasThumbs"));const l=document.createElement("div");s(l,this.cn("track")),o.appendChild(l),this.track=l,"classic"===r?this.buildClassic():this.buildModern(),this.state=t.States.Ready,o.addEventListener("click",(t=>{setTimeout((()=>{var t;null===(t=null==o?void 0:o.querySelector(`[data-carousel-index="${e.page}"]`))||void 0===t||t.focus()}),100)}))}cleanup(){var e,i;this.carousel&&this.carousel.destroy(),this.carousel=null,this.panzoom&&this.panzoom.destroy(),this.panzoom=null,this.container&&this.container.remove(),this.container=null,this.track=null,this.state=t.States.Init,e=this.instance.container,i=this.cn("hasThumbs"),e&&n(i).forEach((t=>{e.classList.remove(t)}))}attach(){const t=this,e=t.instance;e.on("initSlide",t.onInitSlide),e.state===c.Init?e.on("initSlides",t.onInitSlides):t.onInitSlides(),e.on("Panzoom.afterTransform",t.onTransformM),e.on("Panzoom.refresh",t.onRefreshM),e.on("change",t.onChangeM)}detach(){const t=this,e=t.instance;e.off("initSlide",t.onInitSlide),e.off("initSlides",t.onInitSlides),e.off("Panzoom.afterTransform",t.onTransformM),e.off("Panzoom.refresh",t.onRefreshM),e.off("change",t.onChangeM),t.cleanup()}}Object.defineProperty(p,"defaults",{enumerable:!0,configurable:!0,writable:!0,value:d}),t.Thumbs=p,t.defaultOptions=d}));