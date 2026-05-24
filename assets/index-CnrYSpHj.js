(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();/**
* @vue/shared v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Hr(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return n=>n in t}const ce={},Kt=[],pt=()=>{},uo=()=>!1,$n=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Br=e=>e.startsWith("onUpdate:"),be=Object.assign,Ur=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},Vi=Object.prototype.hasOwnProperty,re=(e,t)=>Vi.call(e,t),J=Array.isArray,qt=e=>Tn(e)==="[object Map]",fo=e=>Tn(e)==="[object Set]",ps=e=>Tn(e)==="[object Date]",z=e=>typeof e=="function",ge=e=>typeof e=="string",Xe=e=>typeof e=="symbol",se=e=>e!==null&&typeof e=="object",go=e=>(se(e)||z(e))&&z(e.then)&&z(e.catch),ho=Object.prototype.toString,Tn=e=>ho.call(e),$i=e=>Tn(e).slice(8,-1),mo=e=>Tn(e)==="[object Object]",jr=e=>ge(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,an=Hr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Wn=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},Wi=/-\w/g,Me=Wn(e=>e.replace(Wi,t=>t.slice(1).toUpperCase())),Ji=/\B([A-Z])/g,Vt=Wn(e=>e.replace(Ji,"-$1").toLowerCase()),Jn=Wn(e=>e.charAt(0).toUpperCase()+e.slice(1)),sr=Wn(e=>e?`on${Jn(e)}`:""),dt=(e,t)=>!Object.is(e,t),or=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},xo=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},Ki=e=>{const t=parseFloat(e);return isNaN(t)?e:t},qi=e=>{const t=ge(e)?Number(e):NaN;return isNaN(t)?e:t};let us;const Kn=()=>us||(us=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Gr(e){if(J(e)){const t={};for(let n=0;n<e.length;n++){const r=e[n],s=ge(r)?Qi(r):Gr(r);if(s)for(const o in s)t[o]=s[o]}return t}else if(ge(e)||se(e))return e}const Yi=/;(?![^(]*\))/g,zi=/:([^]+)/,Xi=/\/\*[^]*?\*\//g;function Qi(e){const t={};return e.replace(Xi,"").split(Yi).forEach(n=>{if(n){const r=n.split(zi);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t}function $e(e){let t="";if(ge(e))t=e;else if(J(e))for(let n=0;n<e.length;n++){const r=$e(e[n]);r&&(t+=r+" ")}else if(se(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const Zi="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",el=Hr(Zi);function bo(e){return!!e||e===""}function tl(e,t){if(e.length!==t.length)return!1;let n=!0;for(let r=0;n&&r<e.length;r++)n=Vr(e[r],t[r]);return n}function Vr(e,t){if(e===t)return!0;let n=ps(e),r=ps(t);if(n||r)return n&&r?e.getTime()===t.getTime():!1;if(n=Xe(e),r=Xe(t),n||r)return e===t;if(n=J(e),r=J(t),n||r)return n&&r?tl(e,t):!1;if(n=se(e),r=se(t),n||r){if(!n||!r)return!1;const s=Object.keys(e).length,o=Object.keys(t).length;if(s!==o)return!1;for(const i in e){const l=e.hasOwnProperty(i),a=t.hasOwnProperty(i);if(l&&!a||!l&&a||!Vr(e[i],t[i]))return!1}}return String(e)===String(t)}const yo=e=>!!(e&&e.__v_isRef===!0),Ke=e=>ge(e)?e:e==null?"":J(e)||se(e)&&(e.toString===ho||!z(e.toString))?yo(e)?Ke(e.value):JSON.stringify(e,vo,2):String(e),vo=(e,t)=>yo(t)?vo(e,t.value):qt(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[r,s],o)=>(n[ir(r,o)+" =>"]=s,n),{})}:fo(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>ir(n))}:Xe(t)?ir(t):se(t)&&!J(t)&&!mo(t)?String(t):t,ir=(e,t="")=>{var n;return Xe(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Be;class nl{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Be,!t&&Be&&(this.index=(Be.scopes||(Be.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].pause();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].resume();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].resume()}}run(t){if(this._active){const n=Be;try{return Be=this,t()}finally{Be=n}}}on(){++this._on===1&&(this.prevScope=Be,Be=this)}off(){this._on>0&&--this._on===0&&(Be=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function rl(){return Be}let ae;const lr=new WeakSet;class Eo{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Be&&Be.active&&Be.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,lr.has(this)&&(lr.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ao(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,fs(this),_o(this);const t=ae,n=qe;ae=this,qe=!0;try{return this.fn()}finally{To(this),ae=t,qe=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Jr(t);this.deps=this.depsTail=void 0,fs(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?lr.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Er(this)&&this.run()}get dirty(){return Er(this)}}let So=0,cn,dn;function Ao(e,t=!1){if(e.flags|=8,t){e.next=dn,dn=e;return}e.next=cn,cn=e}function $r(){So++}function Wr(){if(--So>0)return;if(dn){let t=dn;for(dn=void 0;t;){const n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;cn;){let t=cn;for(cn=void 0;t;){const n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(r){e||(e=r)}t=n}}if(e)throw e}function _o(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function To(e){let t,n=e.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),Jr(r),sl(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}e.deps=t,e.depsTail=n}function Er(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ro(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ro(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===mn)||(e.globalVersion=mn,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Er(e))))return;e.flags|=2;const t=e.dep,n=ae,r=qe;ae=e,qe=!0;try{_o(e);const s=e.fn(e._value);(t.version===0||dt(s,e._value))&&(e.flags|=128,e._value=s,t.version++)}catch(s){throw t.version++,s}finally{ae=n,qe=r,To(e),e.flags&=-3}}function Jr(e,t=!1){const{dep:n,prevSub:r,nextSub:s}=e;if(r&&(r.nextSub=s,e.prevSub=void 0),s&&(s.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let o=n.computed.deps;o;o=o.nextDep)Jr(o,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function sl(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let qe=!0;const Co=[];function yt(){Co.push(qe),qe=!1}function vt(){const e=Co.pop();qe=e===void 0?!0:e}function fs(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const n=ae;ae=void 0;try{t()}finally{ae=n}}}let mn=0;class ol{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Kr{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ae||!qe||ae===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==ae)n=this.activeLink=new ol(ae,this),ae.deps?(n.prevDep=ae.depsTail,ae.depsTail.nextDep=n,ae.depsTail=n):ae.deps=ae.depsTail=n,wo(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=ae.depsTail,n.nextDep=void 0,ae.depsTail.nextDep=n,ae.depsTail=n,ae.deps===n&&(ae.deps=r)}return n}trigger(t){this.version++,mn++,this.notify(t)}notify(t){$r();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Wr()}}}function wo(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let r=t.deps;r;r=r.nextDep)wo(r)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const Sr=new WeakMap,jt=Symbol(""),Ar=Symbol(""),xn=Symbol("");function Se(e,t,n){if(qe&&ae){let r=Sr.get(e);r||Sr.set(e,r=new Map);let s=r.get(n);s||(r.set(n,s=new Kr),s.map=r,s.key=n),s.track()}}function bt(e,t,n,r,s,o){const i=Sr.get(e);if(!i){mn++;return}const l=a=>{a&&a.trigger()};if($r(),t==="clear")i.forEach(l);else{const a=J(e),p=a&&jr(n);if(a&&n==="length"){const c=Number(r);i.forEach((d,g)=>{(g==="length"||g===xn||!Xe(g)&&g>=c)&&l(d)})}else switch((n!==void 0||i.has(void 0))&&l(i.get(n)),p&&l(i.get(xn)),t){case"add":a?p&&l(i.get("length")):(l(i.get(jt)),qt(e)&&l(i.get(Ar)));break;case"delete":a||(l(i.get(jt)),qt(e)&&l(i.get(Ar)));break;case"set":qt(e)&&l(i.get(jt));break}}Wr()}function $t(e){const t=te(e);return t===e?t:(Se(t,"iterate",xn),Je(e)?t:t.map(Qe))}function qn(e){return Se(e=te(e),"iterate",xn),e}function at(e,t){return Et(e)?Qt(Gt(e)?Qe(t):t):Qe(t)}const il={__proto__:null,[Symbol.iterator](){return ar(this,Symbol.iterator,e=>at(this,e))},concat(...e){return $t(this).concat(...e.map(t=>J(t)?$t(t):t))},entries(){return ar(this,"entries",e=>(e[1]=at(this,e[1]),e))},every(e,t){return ft(this,"every",e,t,void 0,arguments)},filter(e,t){return ft(this,"filter",e,t,n=>n.map(r=>at(this,r)),arguments)},find(e,t){return ft(this,"find",e,t,n=>at(this,n),arguments)},findIndex(e,t){return ft(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return ft(this,"findLast",e,t,n=>at(this,n),arguments)},findLastIndex(e,t){return ft(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return ft(this,"forEach",e,t,void 0,arguments)},includes(...e){return cr(this,"includes",e)},indexOf(...e){return cr(this,"indexOf",e)},join(e){return $t(this).join(e)},lastIndexOf(...e){return cr(this,"lastIndexOf",e)},map(e,t){return ft(this,"map",e,t,void 0,arguments)},pop(){return nn(this,"pop")},push(...e){return nn(this,"push",e)},reduce(e,...t){return gs(this,"reduce",e,t)},reduceRight(e,...t){return gs(this,"reduceRight",e,t)},shift(){return nn(this,"shift")},some(e,t){return ft(this,"some",e,t,void 0,arguments)},splice(...e){return nn(this,"splice",e)},toReversed(){return $t(this).toReversed()},toSorted(e){return $t(this).toSorted(e)},toSpliced(...e){return $t(this).toSpliced(...e)},unshift(...e){return nn(this,"unshift",e)},values(){return ar(this,"values",e=>at(this,e))}};function ar(e,t,n){const r=qn(e),s=r[t]();return r!==e&&!Je(e)&&(s._next=s.next,s.next=()=>{const o=s._next();return o.done||(o.value=n(o.value)),o}),s}const ll=Array.prototype;function ft(e,t,n,r,s,o){const i=qn(e),l=i!==e&&!Je(e),a=i[t];if(a!==ll[t]){const d=a.apply(e,o);return l?Qe(d):d}let p=n;i!==e&&(l?p=function(d,g){return n.call(this,at(e,d),g,e)}:n.length>2&&(p=function(d,g){return n.call(this,d,g,e)}));const c=a.call(i,p,r);return l&&s?s(c):c}function gs(e,t,n,r){const s=qn(e),o=s!==e&&!Je(e);let i=n,l=!1;s!==e&&(o?(l=r.length===0,i=function(p,c,d){return l&&(l=!1,p=at(e,p)),n.call(this,p,at(e,c),d,e)}):n.length>3&&(i=function(p,c,d){return n.call(this,p,c,d,e)}));const a=s[t](i,...r);return l?at(e,a):a}function cr(e,t,n){const r=te(e);Se(r,"iterate",xn);const s=r[t](...n);return(s===-1||s===!1)&&zr(n[0])?(n[0]=te(n[0]),r[t](...n)):s}function nn(e,t,n=[]){yt(),$r();const r=te(e)[t].apply(e,n);return Wr(),vt(),r}const al=Hr("__proto__,__v_isRef,__isVue"),Io=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Xe));function cl(e){Xe(e)||(e=String(e));const t=te(this);return Se(t,"has",e),t.hasOwnProperty(e)}class Oo{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,r){if(n==="__v_skip")return t.__v_skip;const s=this._isReadonly,o=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return o;if(n==="__v_raw")return r===(s?o?yl:Po:o?Lo:Do).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(r)?t:void 0;const i=J(t);if(!s){let a;if(i&&(a=il[n]))return a;if(n==="hasOwnProperty")return cl}const l=Reflect.get(t,n,Re(t)?t:r);if((Xe(n)?Io.has(n):al(n))||(s||Se(t,"get",n),o))return l;if(Re(l)){const a=i&&jr(n)?l:l.value;return s&&se(a)?Tr(a):a}return se(l)?s?Tr(l):Yn(l):l}}class No extends Oo{constructor(t=!1){super(!1,t)}set(t,n,r,s){let o=t[n];const i=J(t)&&jr(n);if(!this._isShallow){const p=Et(o);if(!Je(r)&&!Et(r)&&(o=te(o),r=te(r)),!i&&Re(o)&&!Re(r))return p||(o.value=r),!0}const l=i?Number(n)<t.length:re(t,n),a=Reflect.set(t,n,r,Re(t)?t:s);return t===te(s)&&(l?dt(r,o)&&bt(t,"set",n,r):bt(t,"add",n,r)),a}deleteProperty(t,n){const r=re(t,n);t[n];const s=Reflect.deleteProperty(t,n);return s&&r&&bt(t,"delete",n,void 0),s}has(t,n){const r=Reflect.has(t,n);return(!Xe(n)||!Io.has(n))&&Se(t,"has",n),r}ownKeys(t){return Se(t,"iterate",J(t)?"length":jt),Reflect.ownKeys(t)}}class dl extends Oo{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const pl=new No,ul=new dl,fl=new No(!0);const _r=e=>e,On=e=>Reflect.getPrototypeOf(e);function gl(e,t,n){return function(...r){const s=this.__v_raw,o=te(s),i=qt(o),l=e==="entries"||e===Symbol.iterator&&i,a=e==="keys"&&i,p=s[e](...r),c=n?_r:t?Qt:Qe;return!t&&Se(o,"iterate",a?Ar:jt),be(Object.create(p),{next(){const{value:d,done:g}=p.next();return g?{value:d,done:g}:{value:l?[c(d[0]),c(d[1])]:c(d),done:g}}})}}function Nn(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function hl(e,t){const n={get(s){const o=this.__v_raw,i=te(o),l=te(s);e||(dt(s,l)&&Se(i,"get",s),Se(i,"get",l));const{has:a}=On(i),p=t?_r:e?Qt:Qe;if(a.call(i,s))return p(o.get(s));if(a.call(i,l))return p(o.get(l));o!==i&&o.get(s)},get size(){const s=this.__v_raw;return!e&&Se(te(s),"iterate",jt),s.size},has(s){const o=this.__v_raw,i=te(o),l=te(s);return e||(dt(s,l)&&Se(i,"has",s),Se(i,"has",l)),s===l?o.has(s):o.has(s)||o.has(l)},forEach(s,o){const i=this,l=i.__v_raw,a=te(l),p=t?_r:e?Qt:Qe;return!e&&Se(a,"iterate",jt),l.forEach((c,d)=>s.call(o,p(c),p(d),i))}};return be(n,e?{add:Nn("add"),set:Nn("set"),delete:Nn("delete"),clear:Nn("clear")}:{add(s){const o=te(this),i=On(o),l=te(s),a=!t&&!Je(s)&&!Et(s)?l:s;return i.has.call(o,a)||dt(s,a)&&i.has.call(o,s)||dt(l,a)&&i.has.call(o,l)||(o.add(a),bt(o,"add",a,a)),this},set(s,o){!t&&!Je(o)&&!Et(o)&&(o=te(o));const i=te(this),{has:l,get:a}=On(i);let p=l.call(i,s);p||(s=te(s),p=l.call(i,s));const c=a.call(i,s);return i.set(s,o),p?dt(o,c)&&bt(i,"set",s,o):bt(i,"add",s,o),this},delete(s){const o=te(this),{has:i,get:l}=On(o);let a=i.call(o,s);a||(s=te(s),a=i.call(o,s)),l&&l.call(o,s);const p=o.delete(s);return a&&bt(o,"delete",s,void 0),p},clear(){const s=te(this),o=s.size!==0,i=s.clear();return o&&bt(s,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=gl(s,e,t)}),n}function qr(e,t){const n=hl(e,t);return(r,s,o)=>s==="__v_isReactive"?!e:s==="__v_isReadonly"?e:s==="__v_raw"?r:Reflect.get(re(n,s)&&s in r?n:r,s,o)}const ml={get:qr(!1,!1)},xl={get:qr(!1,!0)},bl={get:qr(!0,!1)};const Do=new WeakMap,Lo=new WeakMap,Po=new WeakMap,yl=new WeakMap;function vl(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function El(e){return e.__v_skip||!Object.isExtensible(e)?0:vl($i(e))}function Yn(e){return Et(e)?e:Yr(e,!1,pl,ml,Do)}function Mo(e){return Yr(e,!1,fl,xl,Lo)}function Tr(e){return Yr(e,!0,ul,bl,Po)}function Yr(e,t,n,r,s){if(!se(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const o=El(e);if(o===0)return e;const i=s.get(e);if(i)return i;const l=new Proxy(e,o===2?r:n);return s.set(e,l),l}function Gt(e){return Et(e)?Gt(e.__v_raw):!!(e&&e.__v_isReactive)}function Et(e){return!!(e&&e.__v_isReadonly)}function Je(e){return!!(e&&e.__v_isShallow)}function zr(e){return e?!!e.__v_raw:!1}function te(e){const t=e&&e.__v_raw;return t?te(t):e}function Sl(e){return!re(e,"__v_skip")&&Object.isExtensible(e)&&xo(e,"__v_skip",!0),e}const Qe=e=>se(e)?Yn(e):e,Qt=e=>se(e)?Tr(e):e;function Re(e){return e?e.__v_isRef===!0:!1}function Ye(e){return ko(e,!1)}function Al(e){return ko(e,!0)}function ko(e,t){return Re(e)?e:new _l(e,t)}class _l{constructor(t,n){this.dep=new Kr,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:te(t),this._value=n?t:Qe(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){const n=this._rawValue,r=this.__v_isShallow||Je(t)||Et(t);t=r?t:te(t),dt(t,n)&&(this._rawValue=t,this._value=r?t:Qe(t),this.dep.trigger())}}function ut(e){return Re(e)?e.value:e}const Tl={get:(e,t,n)=>t==="__v_raw"?e:ut(Reflect.get(e,t,n)),set:(e,t,n,r)=>{const s=e[t];return Re(s)&&!Re(n)?(s.value=n,!0):Reflect.set(e,t,n,r)}};function Fo(e){return Gt(e)?e:new Proxy(e,Tl)}class Rl{constructor(t,n,r){this.fn=t,this.setter=n,this._value=void 0,this.dep=new Kr(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=mn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&ae!==this)return Ao(this,!0),!0}get value(){const t=this.dep.track();return Ro(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function Cl(e,t,n=!1){let r,s;return z(e)?r=e:(r=e.get,s=e.set),new Rl(r,s,n)}const Dn={},Fn=new WeakMap;let Ht;function wl(e,t=!1,n=Ht){if(n){let r=Fn.get(n);r||Fn.set(n,r=[]),r.push(e)}}function Il(e,t,n=ce){const{immediate:r,deep:s,once:o,scheduler:i,augmentJob:l,call:a}=n,p=y=>s?y:Je(y)||s===!1||s===0?It(y,1):It(y);let c,d,g,b,N=!1,R=!1;if(Re(e)?(d=()=>e.value,N=Je(e)):Gt(e)?(d=()=>p(e),N=!0):J(e)?(R=!0,N=e.some(y=>Gt(y)||Je(y)),d=()=>e.map(y=>{if(Re(y))return y.value;if(Gt(y))return p(y);if(z(y))return a?a(y,2):y()})):z(e)?t?d=a?()=>a(e,2):e:d=()=>{if(g){yt();try{g()}finally{vt()}}const y=Ht;Ht=c;try{return a?a(e,3,[b]):e(b)}finally{Ht=y}}:d=pt,t&&s){const y=d,_=s===!0?1/0:s;d=()=>It(y(),_)}const P=rl(),H=()=>{c.stop(),P&&P.active&&Ur(P.effects,c)};if(o&&t){const y=t;t=(..._)=>{y(..._),H()}}let h=R?new Array(e.length).fill(Dn):Dn;const m=y=>{if(!(!(c.flags&1)||!c.dirty&&!y))if(t){const _=c.run();if(s||N||(R?_.some((C,D)=>dt(C,h[D])):dt(_,h))){g&&g();const C=Ht;Ht=c;try{const D=[_,h===Dn?void 0:R&&h[0]===Dn?[]:h,b];h=_,a?a(t,3,D):t(...D)}finally{Ht=C}}}else c.run()};return l&&l(m),c=new Eo(d),c.scheduler=i?()=>i(m,!1):m,b=y=>wl(y,!1,c),g=c.onStop=()=>{const y=Fn.get(c);if(y){if(a)a(y,4);else for(const _ of y)_();Fn.delete(c)}},t?r?m(!0):h=c.run():i?i(m.bind(null,!0),!0):c.run(),H.pause=c.pause.bind(c),H.resume=c.resume.bind(c),H.stop=H,H}function It(e,t=1/0,n){if(t<=0||!se(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,Re(e))It(e.value,t,n);else if(J(e))for(let r=0;r<e.length;r++)It(e[r],t,n);else if(fo(e)||qt(e))e.forEach(r=>{It(r,t,n)});else if(mo(e)){for(const r in e)It(e[r],t,n);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&It(e[r],t,n)}return e}/**
* @vue/runtime-core v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Rn(e,t,n,r){try{return r?e(...r):e()}catch(s){zn(s,t,n)}}function Ze(e,t,n,r){if(z(e)){const s=Rn(e,t,n,r);return s&&go(s)&&s.catch(o=>{zn(o,t,n)}),s}if(J(e)){const s=[];for(let o=0;o<e.length;o++)s.push(Ze(e[o],t,n,r));return s}}function zn(e,t,n,r=!0){const s=t?t.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:i}=t&&t.appContext.config||ce;if(t){let l=t.parent;const a=t.proxy,p=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const c=l.ec;if(c){for(let d=0;d<c.length;d++)if(c[d](e,a,p)===!1)return}l=l.parent}if(o){yt(),Rn(o,null,10,[e,a,p]),vt();return}}Ol(e,n,s,r,i)}function Ol(e,t,n,r=!0,s=!1){if(s)throw e;console.error(e)}const Le=[];let it=-1;const Yt=[];let Ct=null,Wt=0;const Ho=Promise.resolve();let Hn=null;function Bo(e){const t=Hn||Ho;return e?t.then(this?e.bind(this):e):t}function Nl(e){let t=it+1,n=Le.length;for(;t<n;){const r=t+n>>>1,s=Le[r],o=bn(s);o<e||o===e&&s.flags&2?t=r+1:n=r}return t}function Xr(e){if(!(e.flags&1)){const t=bn(e),n=Le[Le.length-1];!n||!(e.flags&2)&&t>=bn(n)?Le.push(e):Le.splice(Nl(t),0,e),e.flags|=1,Uo()}}function Uo(){Hn||(Hn=Ho.then(Go))}function Dl(e){J(e)?Yt.push(...e):Ct&&e.id===-1?Ct.splice(Wt+1,0,e):e.flags&1||(Yt.push(e),e.flags|=1),Uo()}function hs(e,t,n=it+1){for(;n<Le.length;n++){const r=Le[n];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;Le.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function jo(e){if(Yt.length){const t=[...new Set(Yt)].sort((n,r)=>bn(n)-bn(r));if(Yt.length=0,Ct){Ct.push(...t);return}for(Ct=t,Wt=0;Wt<Ct.length;Wt++){const n=Ct[Wt];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Ct=null,Wt=0}}const bn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Go(e){try{for(it=0;it<Le.length;it++){const t=Le[it];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),Rn(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;it<Le.length;it++){const t=Le[it];t&&(t.flags&=-2)}it=-1,Le.length=0,jo(),Hn=null,(Le.length||Yt.length)&&Go()}}let Pe=null,Vo=null;function Bn(e){const t=Pe;return Pe=e,Vo=e&&e.type.__scopeId||null,t}function Dt(e,t=Pe,n){if(!t||e._n)return e;const r=(...s)=>{r._d&&Gn(-1);const o=Bn(t);let i;try{i=e(...s)}finally{Bn(o),r._d&&Gn(1)}return i};return r._n=!0,r._c=!0,r._d=!0,r}function Lt(e,t,n,r){const s=e.dirs,o=t&&t.dirs;for(let i=0;i<s.length;i++){const l=s[i];o&&(l.oldValue=o[i].value);let a=l.dir[r];a&&(yt(),Ze(a,n,8,[e.el,l,e,t]),vt())}}function Ln(e,t){if(_e){let n=_e.provides;const r=_e.parent&&_e.parent.provides;r===n&&(n=_e.provides=Object.create(r)),n[e]=t}}function ze(e,t,n=!1){const r=Ti();if(r||Xt){let s=Xt?Xt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&e in s)return s[e];if(arguments.length>1)return n&&z(t)?t.call(r&&r.proxy):t}}const Ll=Symbol.for("v-scx"),Pl=()=>ze(Ll);function pn(e,t,n){return $o(e,t,n)}function $o(e,t,n=ce){const{immediate:r,deep:s,flush:o,once:i}=n,l=be({},n),a=t&&r||!t&&o!=="post";let p;if(Sn){if(o==="sync"){const b=Pl();p=b.__watcherHandles||(b.__watcherHandles=[])}else if(!a){const b=()=>{};return b.stop=pt,b.resume=pt,b.pause=pt,b}}const c=_e;l.call=(b,N,R)=>Ze(b,c,N,R);let d=!1;o==="post"?l.scheduler=b=>{He(b,c&&c.suspense)}:o!=="sync"&&(d=!0,l.scheduler=(b,N)=>{N?b():Xr(b)}),l.augmentJob=b=>{t&&(b.flags|=4),d&&(b.flags|=2,c&&(b.id=c.uid,b.i=c))};const g=Il(e,t,l);return Sn&&(p?p.push(g):a&&g()),g}function Ml(e,t,n){const r=this.proxy,s=ge(e)?e.includes(".")?Wo(r,e):()=>r[e]:e.bind(r,r);let o;z(t)?o=t:(o=t.handler,n=t);const i=Cn(this),l=$o(s,o.bind(r),n);return i(),l}function Wo(e,t){const n=t.split(".");return()=>{let r=e;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const kl=Symbol("_vte"),Jo=e=>e.__isTeleport,lt=Symbol("_leaveCb"),rn=Symbol("_enterCb");function Fl(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Zn(()=>{e.isMounted=!0}),ei(()=>{e.isUnmounting=!0}),e}const We=[Function,Array],Ko={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:We,onEnter:We,onAfterEnter:We,onEnterCancelled:We,onBeforeLeave:We,onLeave:We,onAfterLeave:We,onLeaveCancelled:We,onBeforeAppear:We,onAppear:We,onAfterAppear:We,onAppearCancelled:We},qo=e=>{const t=e.subTree;return t.component?qo(t.component):t},Hl={name:"BaseTransition",props:Ko,setup(e,{slots:t}){const n=Ti(),r=Fl();return()=>{const s=t.default&&Xo(t.default(),!0);if(!s||!s.length)return;const o=Yo(s),i=te(e),{mode:l}=i;if(r.isLeaving)return dr(o);const a=ms(o);if(!a)return dr(o);let p=Rr(a,i,r,n,d=>p=d);a.type!==Ae&&yn(a,p);let c=n.subTree&&ms(n.subTree);if(c&&c.type!==Ae&&!Bt(c,a)&&qo(n).type!==Ae){let d=Rr(c,i,r,n);if(yn(c,d),l==="out-in"&&a.type!==Ae)return r.isLeaving=!0,d.afterLeave=()=>{r.isLeaving=!1,n.job.flags&8||n.update(),delete d.afterLeave,c=void 0},dr(o);l==="in-out"&&a.type!==Ae?d.delayLeave=(g,b,N)=>{const R=zo(r,c);R[String(c.key)]=c,g[lt]=()=>{b(),g[lt]=void 0,delete p.delayedLeave,c=void 0},p.delayedLeave=()=>{N(),delete p.delayedLeave,c=void 0}}:c=void 0}else c&&(c=void 0);return o}}};function Yo(e){let t=e[0];if(e.length>1){for(const n of e)if(n.type!==Ae){t=n;break}}return t}const Bl=Hl;function zo(e,t){const{leavingVNodes:n}=e;let r=n.get(t.type);return r||(r=Object.create(null),n.set(t.type,r)),r}function Rr(e,t,n,r,s){const{appear:o,mode:i,persisted:l=!1,onBeforeEnter:a,onEnter:p,onAfterEnter:c,onEnterCancelled:d,onBeforeLeave:g,onLeave:b,onAfterLeave:N,onLeaveCancelled:R,onBeforeAppear:P,onAppear:H,onAfterAppear:h,onAppearCancelled:m}=t,y=String(e.key),_=zo(n,e),C=(I,G)=>{I&&Ze(I,r,9,G)},D=(I,G)=>{const Y=G[1];C(I,G),J(I)?I.every(k=>k.length<=1)&&Y():I.length<=1&&Y()},$={mode:i,persisted:l,beforeEnter(I){let G=a;if(!n.isMounted)if(o)G=P||a;else return;I[lt]&&I[lt](!0);const Y=_[y];Y&&Bt(e,Y)&&Y.el[lt]&&Y.el[lt](),C(G,[I])},enter(I){if(_[y]===e)return;let G=p,Y=c,k=d;if(!n.isMounted)if(o)G=H||p,Y=h||c,k=m||d;else return;let Z=!1;I[rn]=Ce=>{Z||(Z=!0,Ce?C(k,[I]):C(Y,[I]),$.delayedLeave&&$.delayedLeave(),I[rn]=void 0)};const he=I[rn].bind(null,!1);G?D(G,[I,he]):he()},leave(I,G){const Y=String(e.key);if(I[rn]&&I[rn](!0),n.isUnmounting)return G();C(g,[I]);let k=!1;I[lt]=he=>{k||(k=!0,G(),he?C(R,[I]):C(N,[I]),I[lt]=void 0,_[Y]===e&&delete _[Y])};const Z=I[lt].bind(null,!1);_[Y]=e,b?D(b,[I,Z]):Z()},clone(I){const G=Rr(I,t,n,r,s);return s&&s(G),G}};return $}function dr(e){if(Xn(e))return e=Ot(e),e.children=null,e}function ms(e){if(!Xn(e))return Jo(e.type)&&e.children?Yo(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&z(n.default))return n.default()}}function yn(e,t){e.shapeFlag&6&&e.component?(e.transition=t,yn(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Xo(e,t=!1,n){let r=[],s=0;for(let o=0;o<e.length;o++){let i=e[o];const l=n==null?i.key:String(n)+String(i.key!=null?i.key:o);i.type===ve?(i.patchFlag&128&&s++,r=r.concat(Xo(i.children,t,l))):(t||i.type!==Ae)&&r.push(l!=null?Ot(i,{key:l}):i)}if(s>1)for(let o=0;o<r.length;o++)r[o].patchFlag=-2;return r}function tt(e,t){return z(e)?be({name:e.name},t,{setup:e}):e}function Qo(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function xs(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}const Un=new WeakMap;function un(e,t,n,r,s=!1){if(J(e)){e.forEach((R,P)=>un(R,t&&(J(t)?t[P]:t),n,r,s));return}if(zt(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&un(e,t,n,r.component.subTree);return}const o=r.shapeFlag&4?rs(r.component):r.el,i=s?null:o,{i:l,r:a}=e,p=t&&t.r,c=l.refs===ce?l.refs={}:l.refs,d=l.setupState,g=te(d),b=d===ce?uo:R=>xs(c,R)?!1:re(g,R),N=(R,P)=>!(P&&xs(c,P));if(p!=null&&p!==a){if(bs(t),ge(p))c[p]=null,b(p)&&(d[p]=null);else if(Re(p)){const R=t;N(p,R.k)&&(p.value=null),R.k&&(c[R.k]=null)}}if(z(a))Rn(a,l,12,[i,c]);else{const R=ge(a),P=Re(a);if(R||P){const H=()=>{if(e.f){const h=R?b(a)?d[a]:c[a]:N()||!e.k?a.value:c[e.k];if(s)J(h)&&Ur(h,o);else if(J(h))h.includes(o)||h.push(o);else if(R)c[a]=[o],b(a)&&(d[a]=c[a]);else{const m=[o];N(a,e.k)&&(a.value=m),e.k&&(c[e.k]=m)}}else R?(c[a]=i,b(a)&&(d[a]=i)):P&&(N(a,e.k)&&(a.value=i),e.k&&(c[e.k]=i))};if(i){const h=()=>{H(),Un.delete(e)};h.id=-1,Un.set(e,h),He(h,n)}else bs(e),H()}}}function bs(e){const t=Un.get(e);t&&(t.flags|=8,Un.delete(e))}Kn().requestIdleCallback;Kn().cancelIdleCallback;const zt=e=>!!e.type.__asyncLoader,Xn=e=>e.type.__isKeepAlive;function Ul(e,t){Zo(e,"a",t)}function jl(e,t){Zo(e,"da",t)}function Zo(e,t,n=_e){const r=e.__wdc||(e.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return e()});if(Qn(t,r,n),n){let s=n.parent;for(;s&&s.parent;)Xn(s.parent.vnode)&&Gl(r,t,n,s),s=s.parent}}function Gl(e,t,n,r){const s=Qn(t,e,r,!0);Qr(()=>{Ur(r[t],s)},n)}function Qn(e,t,n=_e,r=!1){if(n){const s=n[e]||(n[e]=[]),o=t.__weh||(t.__weh=(...i)=>{yt();const l=Cn(n),a=Ze(t,n,e,i);return l(),vt(),a});return r?s.unshift(o):s.push(o),o}}const At=e=>(t,n=_e)=>{(!Sn||e==="sp")&&Qn(e,(...r)=>t(...r),n)},Vl=At("bm"),Zn=At("m"),$l=At("bu"),Wl=At("u"),ei=At("bum"),Qr=At("um"),Jl=At("sp"),Kl=At("rtg"),ql=At("rtc");function Yl(e,t=_e){Qn("ec",e,t)}const ti="components";function zl(e,t){return ri(ti,e,!0,t)||e}const ni=Symbol.for("v-ndc");function Xl(e){return ge(e)?ri(ti,e,!1)||e:e||ni}function ri(e,t,n=!0,r=!1){const s=Pe||_e;if(s){const o=s.type;{const l=ka(o,!1);if(l&&(l===t||l===Me(t)||l===Jn(Me(t))))return o}const i=ys(s[e]||o[e],t)||ys(s.appContext[e],t);return!i&&r?o:i}}function ys(e,t){return e&&(e[t]||e[Me(t)]||e[Jn(Me(t))])}function Zr(e,t,n,r){let s;const o=n,i=J(e);if(i||ge(e)){const l=i&&Gt(e);let a=!1,p=!1;l&&(a=!Je(e),p=Et(e),e=qn(e)),s=new Array(e.length);for(let c=0,d=e.length;c<d;c++)s[c]=t(a?p?Qt(Qe(e[c])):Qe(e[c]):e[c],c,void 0,o)}else if(typeof e=="number"){s=new Array(e);for(let l=0;l<e;l++)s[l]=t(l+1,l,void 0,o)}else if(se(e))if(e[Symbol.iterator])s=Array.from(e,(l,a)=>t(l,a,void 0,o));else{const l=Object.keys(e);s=new Array(l.length);for(let a=0,p=l.length;a<p;a++){const c=l[a];s[a]=t(e[c],c,a,o)}}else s=[];return s}function Ql(e,t,n={},r,s){if(Pe.ce||Pe.parent&&zt(Pe.parent)&&Pe.parent.ce){const p=Object.keys(n).length>0;return pe(),St(ve,null,[de("slot",n,r)],p?-2:64)}let o=e[t];o&&o._c&&(o._d=!1),pe();const i=o&&si(o(n)),l=n.key||i&&i.key,a=St(ve,{key:(l&&!Xe(l)?l:`_${t}`)+(!i&&r?"_fb":"")},i||[],i&&e._===1?64:-2);return a.scopeId&&(a.slotScopeIds=[a.scopeId+"-s"]),o&&o._c&&(o._d=!0),a}function si(e){return e.some(t=>En(t)?!(t.type===Ae||t.type===ve&&!si(t.children)):!0)?e:null}const Cr=e=>e?Ri(e)?rs(e):Cr(e.parent):null,fn=be(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Cr(e.parent),$root:e=>Cr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>ii(e),$forceUpdate:e=>e.f||(e.f=()=>{Xr(e.update)}),$nextTick:e=>e.n||(e.n=Bo.bind(e.proxy)),$watch:e=>Ml.bind(e)}),pr=(e,t)=>e!==ce&&!e.__isScriptSetup&&re(e,t),Zl={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:o,accessCache:i,type:l,appContext:a}=e;if(t[0]!=="$"){const g=i[t];if(g!==void 0)switch(g){case 1:return r[t];case 2:return s[t];case 4:return n[t];case 3:return o[t]}else{if(pr(r,t))return i[t]=1,r[t];if(s!==ce&&re(s,t))return i[t]=2,s[t];if(re(o,t))return i[t]=3,o[t];if(n!==ce&&re(n,t))return i[t]=4,n[t];wr&&(i[t]=0)}}const p=fn[t];let c,d;if(p)return t==="$attrs"&&Se(e.attrs,"get",""),p(e);if((c=l.__cssModules)&&(c=c[t]))return c;if(n!==ce&&re(n,t))return i[t]=4,n[t];if(d=a.config.globalProperties,re(d,t))return d[t]},set({_:e},t,n){const{data:r,setupState:s,ctx:o}=e;return pr(s,t)?(s[t]=n,!0):r!==ce&&re(r,t)?(r[t]=n,!0):re(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(o[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:s,props:o,type:i}},l){let a;return!!(n[l]||e!==ce&&l[0]!=="$"&&re(e,l)||pr(t,l)||re(o,l)||re(r,l)||re(fn,l)||re(s.config.globalProperties,l)||(a=i.__cssModules)&&a[l])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:re(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function vs(e){return J(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let wr=!0;function ea(e){const t=ii(e),n=e.proxy,r=e.ctx;wr=!1,t.beforeCreate&&Es(t.beforeCreate,e,"bc");const{data:s,computed:o,methods:i,watch:l,provide:a,inject:p,created:c,beforeMount:d,mounted:g,beforeUpdate:b,updated:N,activated:R,deactivated:P,beforeDestroy:H,beforeUnmount:h,destroyed:m,unmounted:y,render:_,renderTracked:C,renderTriggered:D,errorCaptured:$,serverPrefetch:I,expose:G,inheritAttrs:Y,components:k,directives:Z,filters:he}=t;if(p&&ta(p,r,null),i)for(const ee in i){const K=i[ee];z(K)&&(r[ee]=K.bind(n))}if(s){const ee=s.call(n,n);se(ee)&&(e.data=Yn(ee))}if(wr=!0,o)for(const ee in o){const K=o[ee],me=z(K)?K.bind(n,n):z(K.get)?K.get.bind(n,n):pt,we=!z(K)&&z(K.set)?K.set.bind(n):pt,Ie=Ue({get:me,set:we});Object.defineProperty(r,ee,{enumerable:!0,configurable:!0,get:()=>Ie.value,set:ie=>Ie.value=ie})}if(l)for(const ee in l)oi(l[ee],r,n,ee);if(a){const ee=z(a)?a.call(n):a;Reflect.ownKeys(ee).forEach(K=>{Ln(K,ee[K])})}c&&Es(c,e,"c");function ue(ee,K){J(K)?K.forEach(me=>ee(me.bind(n))):K&&ee(K.bind(n))}if(ue(Vl,d),ue(Zn,g),ue($l,b),ue(Wl,N),ue(Ul,R),ue(jl,P),ue(Yl,$),ue(ql,C),ue(Kl,D),ue(ei,h),ue(Qr,y),ue(Jl,I),J(G))if(G.length){const ee=e.exposed||(e.exposed={});G.forEach(K=>{Object.defineProperty(ee,K,{get:()=>n[K],set:me=>n[K]=me,enumerable:!0})})}else e.exposed||(e.exposed={});_&&e.render===pt&&(e.render=_),Y!=null&&(e.inheritAttrs=Y),k&&(e.components=k),Z&&(e.directives=Z),I&&Qo(e)}function ta(e,t,n=pt){J(e)&&(e=Ir(e));for(const r in e){const s=e[r];let o;se(s)?"default"in s?o=ze(s.from||r,s.default,!0):o=ze(s.from||r):o=ze(s),Re(o)?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>o.value,set:i=>o.value=i}):t[r]=o}}function Es(e,t,n){Ze(J(e)?e.map(r=>r.bind(t.proxy)):e.bind(t.proxy),t,n)}function oi(e,t,n,r){let s=r.includes(".")?Wo(n,r):()=>n[r];if(ge(e)){const o=t[e];z(o)&&pn(s,o)}else if(z(e))pn(s,e.bind(n));else if(se(e))if(J(e))e.forEach(o=>oi(o,t,n,r));else{const o=z(e.handler)?e.handler.bind(n):t[e.handler];z(o)&&pn(s,o,e)}}function ii(e){const t=e.type,{mixins:n,extends:r}=t,{mixins:s,optionsCache:o,config:{optionMergeStrategies:i}}=e.appContext,l=o.get(t);let a;return l?a=l:!s.length&&!n&&!r?a=t:(a={},s.length&&s.forEach(p=>jn(a,p,i,!0)),jn(a,t,i)),se(t)&&o.set(t,a),a}function jn(e,t,n,r=!1){const{mixins:s,extends:o}=t;o&&jn(e,o,n,!0),s&&s.forEach(i=>jn(e,i,n,!0));for(const i in t)if(!(r&&i==="expose")){const l=na[i]||n&&n[i];e[i]=l?l(e[i],t[i]):t[i]}return e}const na={data:Ss,props:As,emits:As,methods:ln,computed:ln,beforeCreate:Ne,created:Ne,beforeMount:Ne,mounted:Ne,beforeUpdate:Ne,updated:Ne,beforeDestroy:Ne,beforeUnmount:Ne,destroyed:Ne,unmounted:Ne,activated:Ne,deactivated:Ne,errorCaptured:Ne,serverPrefetch:Ne,components:ln,directives:ln,watch:sa,provide:Ss,inject:ra};function Ss(e,t){return t?e?function(){return be(z(e)?e.call(this,this):e,z(t)?t.call(this,this):t)}:t:e}function ra(e,t){return ln(Ir(e),Ir(t))}function Ir(e){if(J(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Ne(e,t){return e?[...new Set([].concat(e,t))]:t}function ln(e,t){return e?be(Object.create(null),e,t):t}function As(e,t){return e?J(e)&&J(t)?[...new Set([...e,...t])]:be(Object.create(null),vs(e),vs(t??{})):t}function sa(e,t){if(!e)return t;if(!t)return e;const n=be(Object.create(null),e);for(const r in t)n[r]=Ne(e[r],t[r]);return n}function li(){return{app:null,config:{isNativeTag:uo,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let oa=0;function ia(e,t){return function(r,s=null){z(r)||(r=be({},r)),s!=null&&!se(s)&&(s=null);const o=li(),i=new WeakSet,l=[];let a=!1;const p=o.app={_uid:oa++,_component:r,_props:s,_container:null,_context:o,_instance:null,version:Ha,get config(){return o.config},set config(c){},use(c,...d){return i.has(c)||(c&&z(c.install)?(i.add(c),c.install(p,...d)):z(c)&&(i.add(c),c(p,...d))),p},mixin(c){return o.mixins.includes(c)||o.mixins.push(c),p},component(c,d){return d?(o.components[c]=d,p):o.components[c]},directive(c,d){return d?(o.directives[c]=d,p):o.directives[c]},mount(c,d,g){if(!a){const b=p._ceVNode||de(r,s);return b.appContext=o,g===!0?g="svg":g===!1&&(g=void 0),e(b,c,g),a=!0,p._container=c,c.__vue_app__=p,rs(b.component)}},onUnmount(c){l.push(c)},unmount(){a&&(Ze(l,p._instance,16),e(null,p._container),delete p._container.__vue_app__)},provide(c,d){return o.provides[c]=d,p},runWithContext(c){const d=Xt;Xt=p;try{return c()}finally{Xt=d}}};return p}}let Xt=null;const la=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Me(t)}Modifiers`]||e[`${Vt(t)}Modifiers`];function aa(e,t,...n){if(e.isUnmounted)return;const r=e.vnode.props||ce;let s=n;const o=t.startsWith("update:"),i=o&&la(r,t.slice(7));i&&(i.trim&&(s=n.map(c=>ge(c)?c.trim():c)),i.number&&(s=n.map(Ki)));let l,a=r[l=sr(t)]||r[l=sr(Me(t))];!a&&o&&(a=r[l=sr(Vt(t))]),a&&Ze(a,e,6,s);const p=r[l+"Once"];if(p){if(!e.emitted)e.emitted={};else if(e.emitted[l])return;e.emitted[l]=!0,Ze(p,e,6,s)}}const ca=new WeakMap;function ai(e,t,n=!1){const r=n?ca:t.emitsCache,s=r.get(e);if(s!==void 0)return s;const o=e.emits;let i={},l=!1;if(!z(e)){const a=p=>{const c=ai(p,t,!0);c&&(l=!0,be(i,c))};!n&&t.mixins.length&&t.mixins.forEach(a),e.extends&&a(e.extends),e.mixins&&e.mixins.forEach(a)}return!o&&!l?(se(e)&&r.set(e,null),null):(J(o)?o.forEach(a=>i[a]=null):be(i,o),se(e)&&r.set(e,i),i)}function er(e,t){return!e||!$n(t)?!1:(t=t.slice(2).replace(/Once$/,""),re(e,t[0].toLowerCase()+t.slice(1))||re(e,Vt(t))||re(e,t))}function _s(e){const{type:t,vnode:n,proxy:r,withProxy:s,propsOptions:[o],slots:i,attrs:l,emit:a,render:p,renderCache:c,props:d,data:g,setupState:b,ctx:N,inheritAttrs:R}=e,P=Bn(e);let H,h;try{if(n.shapeFlag&4){const y=s||r,_=y;H=ct(p.call(_,y,c,d,b,g,N)),h=l}else{const y=t;H=ct(y.length>1?y(d,{attrs:l,slots:i,emit:a}):y(d,null)),h=t.props?l:da(l)}}catch(y){gn.length=0,zn(y,e,1),H=de(Ae)}let m=H;if(h&&R!==!1){const y=Object.keys(h),{shapeFlag:_}=m;y.length&&_&7&&(o&&y.some(Br)&&(h=pa(h,o)),m=Ot(m,h,!1,!0))}return n.dirs&&(m=Ot(m,null,!1,!0),m.dirs=m.dirs?m.dirs.concat(n.dirs):n.dirs),n.transition&&yn(m,n.transition),H=m,Bn(P),H}const da=e=>{let t;for(const n in e)(n==="class"||n==="style"||$n(n))&&((t||(t={}))[n]=e[n]);return t},pa=(e,t)=>{const n={};for(const r in e)(!Br(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function ua(e,t,n){const{props:r,children:s,component:o}=e,{props:i,children:l,patchFlag:a}=t,p=o.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&a>=0){if(a&1024)return!0;if(a&16)return r?Ts(r,i,p):!!i;if(a&8){const c=t.dynamicProps;for(let d=0;d<c.length;d++){const g=c[d];if(ci(i,r,g)&&!er(p,g))return!0}}}else return(s||l)&&(!l||!l.$stable)?!0:r===i?!1:r?i?Ts(r,i,p):!0:!!i;return!1}function Ts(e,t,n){const r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let s=0;s<r.length;s++){const o=r[s];if(ci(t,e,o)&&!er(n,o))return!0}return!1}function ci(e,t,n){const r=e[n],s=t[n];return n==="style"&&se(r)&&se(s)?!Vr(r,s):r!==s}function fa({vnode:e,parent:t},n){for(;t;){const r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=t.vnode).el=n,t=t.parent;else break}}const di={},pi=()=>Object.create(di),ui=e=>Object.getPrototypeOf(e)===di;function ga(e,t,n,r=!1){const s={},o=pi();e.propsDefaults=Object.create(null),fi(e,t,s,o);for(const i in e.propsOptions[0])i in s||(s[i]=void 0);n?e.props=r?s:Mo(s):e.type.props?e.props=s:e.props=o,e.attrs=o}function ha(e,t,n,r){const{props:s,attrs:o,vnode:{patchFlag:i}}=e,l=te(s),[a]=e.propsOptions;let p=!1;if((r||i>0)&&!(i&16)){if(i&8){const c=e.vnode.dynamicProps;for(let d=0;d<c.length;d++){let g=c[d];if(er(e.emitsOptions,g))continue;const b=t[g];if(a)if(re(o,g))b!==o[g]&&(o[g]=b,p=!0);else{const N=Me(g);s[N]=Or(a,l,N,b,e,!1)}else b!==o[g]&&(o[g]=b,p=!0)}}}else{fi(e,t,s,o)&&(p=!0);let c;for(const d in l)(!t||!re(t,d)&&((c=Vt(d))===d||!re(t,c)))&&(a?n&&(n[d]!==void 0||n[c]!==void 0)&&(s[d]=Or(a,l,d,void 0,e,!0)):delete s[d]);if(o!==l)for(const d in o)(!t||!re(t,d))&&(delete o[d],p=!0)}p&&bt(e.attrs,"set","")}function fi(e,t,n,r){const[s,o]=e.propsOptions;let i=!1,l;if(t)for(let a in t){if(an(a))continue;const p=t[a];let c;s&&re(s,c=Me(a))?!o||!o.includes(c)?n[c]=p:(l||(l={}))[c]=p:er(e.emitsOptions,a)||(!(a in r)||p!==r[a])&&(r[a]=p,i=!0)}if(o){const a=te(n),p=l||ce;for(let c=0;c<o.length;c++){const d=o[c];n[d]=Or(s,a,d,p[d],e,!re(p,d))}}return i}function Or(e,t,n,r,s,o){const i=e[n];if(i!=null){const l=re(i,"default");if(l&&r===void 0){const a=i.default;if(i.type!==Function&&!i.skipFactory&&z(a)){const{propsDefaults:p}=s;if(n in p)r=p[n];else{const c=Cn(s);r=p[n]=a.call(null,t),c()}}else r=a;s.ce&&s.ce._setProp(n,r)}i[0]&&(o&&!l?r=!1:i[1]&&(r===""||r===Vt(n))&&(r=!0))}return r}const ma=new WeakMap;function gi(e,t,n=!1){const r=n?ma:t.propsCache,s=r.get(e);if(s)return s;const o=e.props,i={},l=[];let a=!1;if(!z(e)){const c=d=>{a=!0;const[g,b]=gi(d,t,!0);be(i,g),b&&l.push(...b)};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}if(!o&&!a)return se(e)&&r.set(e,Kt),Kt;if(J(o))for(let c=0;c<o.length;c++){const d=Me(o[c]);Rs(d)&&(i[d]=ce)}else if(o)for(const c in o){const d=Me(c);if(Rs(d)){const g=o[c],b=i[d]=J(g)||z(g)?{type:g}:be({},g),N=b.type;let R=!1,P=!0;if(J(N))for(let H=0;H<N.length;++H){const h=N[H],m=z(h)&&h.name;if(m==="Boolean"){R=!0;break}else m==="String"&&(P=!1)}else R=z(N)&&N.name==="Boolean";b[0]=R,b[1]=P,(R||re(b,"default"))&&l.push(d)}}const p=[i,l];return se(e)&&r.set(e,p),p}function Rs(e){return e[0]!=="$"&&!an(e)}const es=e=>e==="_"||e==="_ctx"||e==="$stable",ts=e=>J(e)?e.map(ct):[ct(e)],xa=(e,t,n)=>{if(t._n)return t;const r=Dt((...s)=>ts(t(...s)),n);return r._c=!1,r},hi=(e,t,n)=>{const r=e._ctx;for(const s in e){if(es(s))continue;const o=e[s];if(z(o))t[s]=xa(s,o,r);else if(o!=null){const i=ts(o);t[s]=()=>i}}},mi=(e,t)=>{const n=ts(t);e.slots.default=()=>n},xi=(e,t,n)=>{for(const r in t)(n||!es(r))&&(e[r]=t[r])},ba=(e,t,n)=>{const r=e.slots=pi();if(e.vnode.shapeFlag&32){const s=t._;s?(xi(r,t,n),n&&xo(r,"_",s,!0)):hi(t,r)}else t&&mi(e,t)},ya=(e,t,n)=>{const{vnode:r,slots:s}=e;let o=!0,i=ce;if(r.shapeFlag&32){const l=t._;l?n&&l===1?o=!1:xi(s,t,n):(o=!t.$stable,hi(t,s)),i=t}else t&&(mi(e,t),i={default:1});if(o)for(const l in s)!es(l)&&i[l]==null&&delete s[l]},He=_a;function va(e){return Ea(e)}function Ea(e,t){const n=Kn();n.__VUE__=!0;const{insert:r,remove:s,patchProp:o,createElement:i,createText:l,createComment:a,setText:p,setElementText:c,parentNode:d,nextSibling:g,setScopeId:b=pt,insertStaticContent:N}=e,R=(u,f,x,S=null,T=null,A=null,F=void 0,L=null,O=!!f.dynamicChildren)=>{if(u===f)return;u&&!Bt(u,f)&&(S=E(u),ie(u,T,A,!0),u=null),f.patchFlag===-2&&(O=!1,f.dynamicChildren=null);const{type:w,ref:W,shapeFlag:B}=f;switch(w){case tr:P(u,f,x,S);break;case Ae:H(u,f,x,S);break;case Pn:u==null&&h(f,x,S,F);break;case ve:k(u,f,x,S,T,A,F,L,O);break;default:B&1?_(u,f,x,S,T,A,F,L,O):B&6?Z(u,f,x,S,T,A,F,L,O):(B&64||B&128)&&w.process(u,f,x,S,T,A,F,L,O,j)}W!=null&&T?un(W,u&&u.ref,A,f||u,!f):W==null&&u&&u.ref!=null&&un(u.ref,null,A,u,!0)},P=(u,f,x,S)=>{if(u==null)r(f.el=l(f.children),x,S);else{const T=f.el=u.el;f.children!==u.children&&p(T,f.children)}},H=(u,f,x,S)=>{u==null?r(f.el=a(f.children||""),x,S):f.el=u.el},h=(u,f,x,S)=>{[u.el,u.anchor]=N(u.children,f,x,S,u.el,u.anchor)},m=({el:u,anchor:f},x,S)=>{let T;for(;u&&u!==f;)T=g(u),r(u,x,S),u=T;r(f,x,S)},y=({el:u,anchor:f})=>{let x;for(;u&&u!==f;)x=g(u),s(u),u=x;s(f)},_=(u,f,x,S,T,A,F,L,O)=>{if(f.type==="svg"?F="svg":f.type==="math"&&(F="mathml"),u==null)C(f,x,S,T,A,F,L,O);else{const w=u.el&&u.el._isVueCE?u.el:null;try{w&&w._beginPatch(),I(u,f,T,A,F,L,O)}finally{w&&w._endPatch()}}},C=(u,f,x,S,T,A,F,L)=>{let O,w;const{props:W,shapeFlag:B,transition:V,dirs:q}=u;if(O=u.el=i(u.type,A,W&&W.is,W),B&8?c(O,u.children):B&16&&$(u.children,O,null,S,T,ur(u,A),F,L),q&&Lt(u,null,S,"created"),D(O,u,u.scopeId,F,S),W){for(const le in W)le!=="value"&&!an(le)&&o(O,le,null,W[le],A,S);"value"in W&&o(O,"value",null,W.value,A),(w=W.onVnodeBeforeMount)&&ot(w,S,u)}q&&Lt(u,null,S,"beforeMount");const Q=Sa(T,V);Q&&V.beforeEnter(O),r(O,f,x),((w=W&&W.onVnodeMounted)||Q||q)&&He(()=>{w&&ot(w,S,u),Q&&V.enter(O),q&&Lt(u,null,S,"mounted")},T)},D=(u,f,x,S,T)=>{if(x&&b(u,x),S)for(let A=0;A<S.length;A++)b(u,S[A]);if(T){let A=T.subTree;if(f===A||Ei(A.type)&&(A.ssContent===f||A.ssFallback===f)){const F=T.vnode;D(u,F,F.scopeId,F.slotScopeIds,T.parent)}}},$=(u,f,x,S,T,A,F,L,O=0)=>{for(let w=O;w<u.length;w++){const W=u[w]=L?xt(u[w]):ct(u[w]);R(null,W,f,x,S,T,A,F,L)}},I=(u,f,x,S,T,A,F)=>{const L=f.el=u.el;let{patchFlag:O,dynamicChildren:w,dirs:W}=f;O|=u.patchFlag&16;const B=u.props||ce,V=f.props||ce;let q;if(x&&Pt(x,!1),(q=V.onVnodeBeforeUpdate)&&ot(q,x,f,u),W&&Lt(f,u,x,"beforeUpdate"),x&&Pt(x,!0),(B.innerHTML&&V.innerHTML==null||B.textContent&&V.textContent==null)&&c(L,""),w?G(u.dynamicChildren,w,L,x,S,ur(f,T),A):F||K(u,f,L,null,x,S,ur(f,T),A,!1),O>0){if(O&16)Y(L,B,V,x,T);else if(O&2&&B.class!==V.class&&o(L,"class",null,V.class,T),O&4&&o(L,"style",B.style,V.style,T),O&8){const Q=f.dynamicProps;for(let le=0;le<Q.length;le++){const oe=Q[le],ke=B[oe],Fe=V[oe];(Fe!==ke||oe==="value")&&o(L,oe,ke,Fe,T,x)}}O&1&&u.children!==f.children&&c(L,f.children)}else!F&&w==null&&Y(L,B,V,x,T);((q=V.onVnodeUpdated)||W)&&He(()=>{q&&ot(q,x,f,u),W&&Lt(f,u,x,"updated")},S)},G=(u,f,x,S,T,A,F)=>{for(let L=0;L<f.length;L++){const O=u[L],w=f[L],W=O.el&&(O.type===ve||!Bt(O,w)||O.shapeFlag&198)?d(O.el):x;R(O,w,W,null,S,T,A,F,!0)}},Y=(u,f,x,S,T)=>{if(f!==x){if(f!==ce)for(const A in f)!an(A)&&!(A in x)&&o(u,A,f[A],null,T,S);for(const A in x){if(an(A))continue;const F=x[A],L=f[A];F!==L&&A!=="value"&&o(u,A,L,F,T,S)}"value"in x&&o(u,"value",f.value,x.value,T)}},k=(u,f,x,S,T,A,F,L,O)=>{const w=f.el=u?u.el:l(""),W=f.anchor=u?u.anchor:l("");let{patchFlag:B,dynamicChildren:V,slotScopeIds:q}=f;q&&(L=L?L.concat(q):q),u==null?(r(w,x,S),r(W,x,S),$(f.children||[],x,W,T,A,F,L,O)):B>0&&B&64&&V&&u.dynamicChildren&&u.dynamicChildren.length===V.length?(G(u.dynamicChildren,V,x,T,A,F,L),(f.key!=null||T&&f===T.subTree)&&bi(u,f,!0)):K(u,f,x,W,T,A,F,L,O)},Z=(u,f,x,S,T,A,F,L,O)=>{f.slotScopeIds=L,u==null?f.shapeFlag&512?T.ctx.activate(f,x,S,F,O):he(f,x,S,T,A,F,O):Ce(u,f,O)},he=(u,f,x,S,T,A,F)=>{const L=u.component=Na(u,S,T);if(Xn(u)&&(L.ctx.renderer=j),Da(L,!1,F),L.asyncDep){if(T&&T.registerDep(L,ue,F),!u.el){const O=L.subTree=de(Ae);H(null,O,f,x),u.placeholder=O.el}}else ue(L,u,f,x,T,A,F)},Ce=(u,f,x)=>{const S=f.component=u.component;if(ua(u,f,x))if(S.asyncDep&&!S.asyncResolved){ee(S,f,x);return}else S.next=f,S.update();else f.el=u.el,S.vnode=f},ue=(u,f,x,S,T,A,F)=>{const L=()=>{if(u.isMounted){let{next:B,bu:V,u:q,parent:Q,vnode:le}=u;{const rt=yi(u);if(rt){B&&(B.el=le.el,ee(u,B,F)),rt.asyncDep.then(()=>{He(()=>{u.isUnmounted||w()},T)});return}}let oe=B,ke;Pt(u,!1),B?(B.el=le.el,ee(u,B,F)):B=le,V&&or(V),(ke=B.props&&B.props.onVnodeBeforeUpdate)&&ot(ke,Q,B,le),Pt(u,!0);const Fe=_s(u),nt=u.subTree;u.subTree=Fe,R(nt,Fe,d(nt.el),E(nt),u,T,A),B.el=Fe.el,oe===null&&fa(u,Fe.el),q&&He(q,T),(ke=B.props&&B.props.onVnodeUpdated)&&He(()=>ot(ke,Q,B,le),T)}else{let B;const{el:V,props:q}=f,{bm:Q,m:le,parent:oe,root:ke,type:Fe}=u,nt=zt(f);Pt(u,!1),Q&&or(Q),!nt&&(B=q&&q.onVnodeBeforeMount)&&ot(B,oe,f),Pt(u,!0);{ke.ce&&ke.ce._hasShadowRoot()&&ke.ce._injectChildStyle(Fe,u.parent?u.parent.type:void 0);const rt=u.subTree=_s(u);R(null,rt,x,S,u,T,A),f.el=rt.el}if(le&&He(le,T),!nt&&(B=q&&q.onVnodeMounted)){const rt=f;He(()=>ot(B,oe,rt),T)}(f.shapeFlag&256||oe&&zt(oe.vnode)&&oe.vnode.shapeFlag&256)&&u.a&&He(u.a,T),u.isMounted=!0,f=x=S=null}};u.scope.on();const O=u.effect=new Eo(L);u.scope.off();const w=u.update=O.run.bind(O),W=u.job=O.runIfDirty.bind(O);W.i=u,W.id=u.uid,O.scheduler=()=>Xr(W),Pt(u,!0),w()},ee=(u,f,x)=>{f.component=u;const S=u.vnode.props;u.vnode=f,u.next=null,ha(u,f.props,S,x),ya(u,f.children,x),yt(),hs(u),vt()},K=(u,f,x,S,T,A,F,L,O=!1)=>{const w=u&&u.children,W=u?u.shapeFlag:0,B=f.children,{patchFlag:V,shapeFlag:q}=f;if(V>0){if(V&128){we(w,B,x,S,T,A,F,L,O);return}else if(V&256){me(w,B,x,S,T,A,F,L,O);return}}q&8?(W&16&&ye(w,T,A),B!==w&&c(x,B)):W&16?q&16?we(w,B,x,S,T,A,F,L,O):ye(w,T,A,!0):(W&8&&c(x,""),q&16&&$(B,x,S,T,A,F,L,O))},me=(u,f,x,S,T,A,F,L,O)=>{u=u||Kt,f=f||Kt;const w=u.length,W=f.length,B=Math.min(w,W);let V;for(V=0;V<B;V++){const q=f[V]=O?xt(f[V]):ct(f[V]);R(u[V],q,x,null,T,A,F,L,O)}w>W?ye(u,T,A,!0,!1,B):$(f,x,S,T,A,F,L,O,B)},we=(u,f,x,S,T,A,F,L,O)=>{let w=0;const W=f.length;let B=u.length-1,V=W-1;for(;w<=B&&w<=V;){const q=u[w],Q=f[w]=O?xt(f[w]):ct(f[w]);if(Bt(q,Q))R(q,Q,x,null,T,A,F,L,O);else break;w++}for(;w<=B&&w<=V;){const q=u[B],Q=f[V]=O?xt(f[V]):ct(f[V]);if(Bt(q,Q))R(q,Q,x,null,T,A,F,L,O);else break;B--,V--}if(w>B){if(w<=V){const q=V+1,Q=q<W?f[q].el:S;for(;w<=V;)R(null,f[w]=O?xt(f[w]):ct(f[w]),x,Q,T,A,F,L,O),w++}}else if(w>V)for(;w<=B;)ie(u[w],T,A,!0),w++;else{const q=w,Q=w,le=new Map;for(w=Q;w<=V;w++){const Ge=f[w]=O?xt(f[w]):ct(f[w]);Ge.key!=null&&le.set(Ge.key,w)}let oe,ke=0;const Fe=V-Q+1;let nt=!1,rt=0;const tn=new Array(Fe);for(w=0;w<Fe;w++)tn[w]=0;for(w=q;w<=B;w++){const Ge=u[w];if(ke>=Fe){ie(Ge,T,A,!0);continue}let st;if(Ge.key!=null)st=le.get(Ge.key);else for(oe=Q;oe<=V;oe++)if(tn[oe-Q]===0&&Bt(Ge,f[oe])){st=oe;break}st===void 0?ie(Ge,T,A,!0):(tn[st-Q]=w+1,st>=rt?rt=st:nt=!0,R(Ge,f[st],x,null,T,A,F,L,O),ke++)}const as=nt?Aa(tn):Kt;for(oe=as.length-1,w=Fe-1;w>=0;w--){const Ge=Q+w,st=f[Ge],cs=f[Ge+1],ds=Ge+1<W?cs.el||vi(cs):S;tn[w]===0?R(null,st,x,ds,T,A,F,L,O):nt&&(oe<0||w!==as[oe]?Ie(st,x,ds,2):oe--)}}},Ie=(u,f,x,S,T=null)=>{const{el:A,type:F,transition:L,children:O,shapeFlag:w}=u;if(w&6){Ie(u.component.subTree,f,x,S);return}if(w&128){u.suspense.move(f,x,S);return}if(w&64){F.move(u,f,x,j);return}if(F===ve){r(A,f,x);for(let B=0;B<O.length;B++)Ie(O[B],f,x,S);r(u.anchor,f,x);return}if(F===Pn){m(u,f,x);return}if(S!==2&&w&1&&L)if(S===0)L.beforeEnter(A),r(A,f,x),He(()=>L.enter(A),T);else{const{leave:B,delayLeave:V,afterLeave:q}=L,Q=()=>{u.ctx.isUnmounted?s(A):r(A,f,x)},le=()=>{A._isLeaving&&A[lt](!0),B(A,()=>{Q(),q&&q()})};V?V(A,Q,le):le()}else r(A,f,x)},ie=(u,f,x,S=!1,T=!1)=>{const{type:A,props:F,ref:L,children:O,dynamicChildren:w,shapeFlag:W,patchFlag:B,dirs:V,cacheIndex:q}=u;if(B===-2&&(T=!1),L!=null&&(yt(),un(L,null,x,u,!0),vt()),q!=null&&(f.renderCache[q]=void 0),W&256){f.ctx.deactivate(u);return}const Q=W&1&&V,le=!zt(u);let oe;if(le&&(oe=F&&F.onVnodeBeforeUnmount)&&ot(oe,f,u),W&6)je(u.component,x,S);else{if(W&128){u.suspense.unmount(x,S);return}Q&&Lt(u,null,f,"beforeUnmount"),W&64?u.type.remove(u,f,x,j,S):w&&!w.hasOnce&&(A!==ve||B>0&&B&64)?ye(w,f,x,!1,!0):(A===ve&&B&384||!T&&W&16)&&ye(O,f,x),S&&_t(u)}(le&&(oe=F&&F.onVnodeUnmounted)||Q)&&He(()=>{oe&&ot(oe,f,u),Q&&Lt(u,null,f,"unmounted")},x)},_t=u=>{const{type:f,el:x,anchor:S,transition:T}=u;if(f===ve){Oe(x,S);return}if(f===Pn){y(u);return}const A=()=>{s(x),T&&!T.persisted&&T.afterLeave&&T.afterLeave()};if(u.shapeFlag&1&&T&&!T.persisted){const{leave:F,delayLeave:L}=T,O=()=>F(x,A);L?L(u.el,A,O):O()}else A()},Oe=(u,f)=>{let x;for(;u!==f;)x=g(u),s(u),u=x;s(f)},je=(u,f,x)=>{const{bum:S,scope:T,job:A,subTree:F,um:L,m:O,a:w}=u;Cs(O),Cs(w),S&&or(S),T.stop(),A&&(A.flags|=8,ie(F,u,f,x)),L&&He(L,f),He(()=>{u.isUnmounted=!0},f)},ye=(u,f,x,S=!1,T=!1,A=0)=>{for(let F=A;F<u.length;F++)ie(u[F],f,x,S,T)},E=u=>{if(u.shapeFlag&6)return E(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const f=g(u.anchor||u.el),x=f&&f[kl];return x?g(x):f};let U=!1;const M=(u,f,x)=>{let S;u==null?f._vnode&&(ie(f._vnode,null,null,!0),S=f._vnode.component):R(f._vnode||null,u,f,null,null,null,x),f._vnode=u,U||(U=!0,hs(S),jo(),U=!1)},j={p:R,um:ie,m:Ie,r:_t,mt:he,mc:$,pc:K,pbc:G,n:E,o:e};return{render:M,hydrate:void 0,createApp:ia(M)}}function ur({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Pt({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Sa(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function bi(e,t,n=!1){const r=e.children,s=t.children;if(J(r)&&J(s))for(let o=0;o<r.length;o++){const i=r[o];let l=s[o];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=s[o]=xt(s[o]),l.el=i.el),!n&&l.patchFlag!==-2&&bi(i,l)),l.type===tr&&(l.patchFlag===-1&&(l=s[o]=xt(l)),l.el=i.el),l.type===Ae&&!l.el&&(l.el=i.el)}}function Aa(e){const t=e.slice(),n=[0];let r,s,o,i,l;const a=e.length;for(r=0;r<a;r++){const p=e[r];if(p!==0){if(s=n[n.length-1],e[s]<p){t[r]=s,n.push(r);continue}for(o=0,i=n.length-1;o<i;)l=o+i>>1,e[n[l]]<p?o=l+1:i=l;p<e[n[o]]&&(o>0&&(t[r]=n[o-1]),n[o]=r)}}for(o=n.length,i=n[o-1];o-- >0;)n[o]=i,i=t[i];return n}function yi(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:yi(t)}function Cs(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function vi(e){if(e.placeholder)return e.placeholder;const t=e.component;return t?vi(t.subTree):null}const Ei=e=>e.__isSuspense;function _a(e,t){t&&t.pendingBranch?J(e)?t.effects.push(...e):t.effects.push(e):Dl(e)}const ve=Symbol.for("v-fgt"),tr=Symbol.for("v-txt"),Ae=Symbol.for("v-cmt"),Pn=Symbol.for("v-stc"),gn=[];let Ve=null;function pe(e=!1){gn.push(Ve=e?null:[])}function Ta(){gn.pop(),Ve=gn[gn.length-1]||null}let vn=1;function Gn(e,t=!1){vn+=e,e<0&&Ve&&t&&(Ve.hasOnce=!0)}function Si(e){return e.dynamicChildren=vn>0?Ve||Kt:null,Ta(),vn>0&&Ve&&Ve.push(e),e}function Te(e,t,n,r,s,o){return Si(v(e,t,n,r,s,o,!0))}function St(e,t,n,r,s){return Si(de(e,t,n,r,s,!0))}function En(e){return e?e.__v_isVNode===!0:!1}function Bt(e,t){return e.type===t.type&&e.key===t.key}const Ai=({key:e})=>e??null,Mn=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?ge(e)||Re(e)||z(e)?{i:Pe,r:e,k:t,f:!!n}:e:null);function v(e,t=null,n=null,r=0,s=null,o=e===ve?0:1,i=!1,l=!1){const a={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Ai(t),ref:t&&Mn(t),scopeId:Vo,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:Pe};return l?(ns(a,n),o&128&&e.normalize(a)):n&&(a.shapeFlag|=ge(n)?8:16),vn>0&&!i&&Ve&&(a.patchFlag>0||o&6)&&a.patchFlag!==32&&Ve.push(a),a}const de=Ra;function Ra(e,t=null,n=null,r=0,s=null,o=!1){if((!e||e===ni)&&(e=Ae),En(e)){const l=Ot(e,t,!0);return n&&ns(l,n),vn>0&&!o&&Ve&&(l.shapeFlag&6?Ve[Ve.indexOf(e)]=l:Ve.push(l)),l.patchFlag=-2,l}if(Fa(e)&&(e=e.__vccOpts),t){t=Ca(t);let{class:l,style:a}=t;l&&!ge(l)&&(t.class=$e(l)),se(a)&&(zr(a)&&!J(a)&&(a=be({},a)),t.style=Gr(a))}const i=ge(e)?1:Ei(e)?128:Jo(e)?64:se(e)?4:z(e)?2:0;return v(e,t,n,r,s,i,o,!0)}function Ca(e){return e?zr(e)||ui(e)?be({},e):e:null}function Ot(e,t,n=!1,r=!1){const{props:s,ref:o,patchFlag:i,children:l,transition:a}=e,p=t?wa(s||{},t):s,c={__v_isVNode:!0,__v_skip:!0,type:e.type,props:p,key:p&&Ai(p),ref:t&&t.ref?n&&o?J(o)?o.concat(Mn(t)):[o,Mn(t)]:Mn(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:l,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ve?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:a,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Ot(e.ssContent),ssFallback:e.ssFallback&&Ot(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return a&&r&&yn(c,a.clone(c)),c}function Ee(e=" ",t=0){return de(tr,null,e,t)}function _i(e,t){const n=de(Pn,null,e);return n.staticCount=t,n}function Nt(e="",t=!1){return t?(pe(),St(Ae,null,e)):de(Ae,null,e)}function ct(e){return e==null||typeof e=="boolean"?de(Ae):J(e)?de(ve,null,e.slice()):En(e)?xt(e):de(tr,null,String(e))}function xt(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Ot(e)}function ns(e,t){let n=0;const{shapeFlag:r}=e;if(t==null)t=null;else if(J(t))n=16;else if(typeof t=="object")if(r&65){const s=t.default;s&&(s._c&&(s._d=!1),ns(e,s()),s._c&&(s._d=!0));return}else{n=32;const s=t._;!s&&!ui(t)?t._ctx=Pe:s===3&&Pe&&(Pe.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else z(t)?(t={default:t,_ctx:Pe},n=32):(t=String(t),r&64?(n=16,t=[Ee(t)]):n=8);e.children=t,e.shapeFlag|=n}function wa(...e){const t={};for(let n=0;n<e.length;n++){const r=e[n];for(const s in r)if(s==="class")t.class!==r.class&&(t.class=$e([t.class,r.class]));else if(s==="style")t.style=Gr([t.style,r.style]);else if($n(s)){const o=t[s],i=r[s];i&&o!==i&&!(J(o)&&o.includes(i))&&(t[s]=o?[].concat(o,i):i)}else s!==""&&(t[s]=r[s])}return t}function ot(e,t,n,r=null){Ze(e,t,7,[n,r])}const Ia=li();let Oa=0;function Na(e,t,n){const r=e.type,s=(t?t.appContext:e.appContext)||Ia,o={uid:Oa++,vnode:e,type:r,parent:t,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new nl(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(s.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:gi(r,s),emitsOptions:ai(r,s),emit:null,emitted:null,propsDefaults:ce,inheritAttrs:r.inheritAttrs,ctx:ce,data:ce,props:ce,attrs:ce,slots:ce,refs:ce,setupState:ce,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=t?t.root:o,o.emit=aa.bind(null,o),e.ce&&e.ce(o),o}let _e=null;const Ti=()=>_e||Pe;let Vn,Nr;{const e=Kn(),t=(n,r)=>{let s;return(s=e[n])||(s=e[n]=[]),s.push(r),o=>{s.length>1?s.forEach(i=>i(o)):s[0](o)}};Vn=t("__VUE_INSTANCE_SETTERS__",n=>_e=n),Nr=t("__VUE_SSR_SETTERS__",n=>Sn=n)}const Cn=e=>{const t=_e;return Vn(e),e.scope.on(),()=>{e.scope.off(),Vn(t)}},ws=()=>{_e&&_e.scope.off(),Vn(null)};function Ri(e){return e.vnode.shapeFlag&4}let Sn=!1;function Da(e,t=!1,n=!1){t&&Nr(t);const{props:r,children:s}=e.vnode,o=Ri(e);ga(e,r,o,t),ba(e,s,n||t);const i=o?La(e,t):void 0;return t&&Nr(!1),i}function La(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Zl);const{setup:r}=n;if(r){yt();const s=e.setupContext=r.length>1?Ma(e):null,o=Cn(e),i=Rn(r,e,0,[e.props,s]),l=go(i);if(vt(),o(),(l||e.sp)&&!zt(e)&&Qo(e),l){if(i.then(ws,ws),t)return i.then(a=>{Is(e,a)}).catch(a=>{zn(a,e,0)});e.asyncDep=i}else Is(e,i)}else Ci(e)}function Is(e,t,n){z(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:se(t)&&(e.setupState=Fo(t)),Ci(e)}function Ci(e,t,n){const r=e.type;e.render||(e.render=r.render||pt);{const s=Cn(e);yt();try{ea(e)}finally{vt(),s()}}}const Pa={get(e,t){return Se(e,"get",""),e[t]}};function Ma(e){const t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,Pa),slots:e.slots,emit:e.emit,expose:t}}function rs(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Fo(Sl(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in fn)return fn[n](e)},has(t,n){return n in t||n in fn}})):e.proxy}function ka(e,t=!0){return z(e)?e.displayName||e.name:e.name||t&&e.__name}function Fa(e){return z(e)&&"__vccOpts"in e}const Ue=(e,t)=>Cl(e,t,Sn);function ss(e,t,n){try{Gn(-1);const r=arguments.length;return r===2?se(t)&&!J(t)?En(t)?de(e,null,[t]):de(e,t):de(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&En(n)&&(n=[n]),de(e,t,n))}finally{Gn(1)}}const Ha="3.5.30";/**
* @vue/runtime-dom v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Dr;const Os=typeof window<"u"&&window.trustedTypes;if(Os)try{Dr=Os.createPolicy("vue",{createHTML:e=>e})}catch{}const wi=Dr?e=>Dr.createHTML(e):e=>e,Ba="http://www.w3.org/2000/svg",Ua="http://www.w3.org/1998/Math/MathML",mt=typeof document<"u"?document:null,Ns=mt&&mt.createElement("template"),ja={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{const s=t==="svg"?mt.createElementNS(Ba,e):t==="mathml"?mt.createElementNS(Ua,e):n?mt.createElement(e,{is:n}):mt.createElement(e);return e==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:e=>mt.createTextNode(e),createComment:e=>mt.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>mt.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,s,o){const i=n?n.previousSibling:t.lastChild;if(s&&(s===o||s.nextSibling))for(;t.insertBefore(s.cloneNode(!0),n),!(s===o||!(s=s.nextSibling)););else{Ns.innerHTML=wi(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const l=Ns.content;if(r==="svg"||r==="mathml"){const a=l.firstChild;for(;a.firstChild;)l.appendChild(a.firstChild);l.removeChild(a)}t.insertBefore(l,n)}return[i?i.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Tt="transition",sn="animation",An=Symbol("_vtc"),Ii={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},Ga=be({},Ko,Ii),Va=e=>(e.displayName="Transition",e.props=Ga,e),$a=Va((e,{slots:t})=>ss(Bl,Wa(e),t)),Mt=(e,t=[])=>{J(e)?e.forEach(n=>n(...t)):e&&e(...t)},Ds=e=>e?J(e)?e.some(t=>t.length>1):e.length>1:!1;function Wa(e){const t={};for(const k in e)k in Ii||(t[k]=e[k]);if(e.css===!1)return t;const{name:n="v",type:r,duration:s,enterFromClass:o=`${n}-enter-from`,enterActiveClass:i=`${n}-enter-active`,enterToClass:l=`${n}-enter-to`,appearFromClass:a=o,appearActiveClass:p=i,appearToClass:c=l,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:g=`${n}-leave-active`,leaveToClass:b=`${n}-leave-to`}=e,N=Ja(s),R=N&&N[0],P=N&&N[1],{onBeforeEnter:H,onEnter:h,onEnterCancelled:m,onLeave:y,onLeaveCancelled:_,onBeforeAppear:C=H,onAppear:D=h,onAppearCancelled:$=m}=t,I=(k,Z,he,Ce)=>{k._enterCancelled=Ce,kt(k,Z?c:l),kt(k,Z?p:i),he&&he()},G=(k,Z)=>{k._isLeaving=!1,kt(k,d),kt(k,b),kt(k,g),Z&&Z()},Y=k=>(Z,he)=>{const Ce=k?D:h,ue=()=>I(Z,k,he);Mt(Ce,[Z,ue]),Ls(()=>{kt(Z,k?a:o),gt(Z,k?c:l),Ds(Ce)||Ps(Z,r,R,ue)})};return be(t,{onBeforeEnter(k){Mt(H,[k]),gt(k,o),gt(k,i)},onBeforeAppear(k){Mt(C,[k]),gt(k,a),gt(k,p)},onEnter:Y(!1),onAppear:Y(!0),onLeave(k,Z){k._isLeaving=!0;const he=()=>G(k,Z);gt(k,d),k._enterCancelled?(gt(k,g),Fs(k)):(Fs(k),gt(k,g)),Ls(()=>{k._isLeaving&&(kt(k,d),gt(k,b),Ds(y)||Ps(k,r,P,he))}),Mt(y,[k,he])},onEnterCancelled(k){I(k,!1,void 0,!0),Mt(m,[k])},onAppearCancelled(k){I(k,!0,void 0,!0),Mt($,[k])},onLeaveCancelled(k){G(k),Mt(_,[k])}})}function Ja(e){if(e==null)return null;if(se(e))return[fr(e.enter),fr(e.leave)];{const t=fr(e);return[t,t]}}function fr(e){return qi(e)}function gt(e,t){t.split(/\s+/).forEach(n=>n&&e.classList.add(n)),(e[An]||(e[An]=new Set)).add(t)}function kt(e,t){t.split(/\s+/).forEach(r=>r&&e.classList.remove(r));const n=e[An];n&&(n.delete(t),n.size||(e[An]=void 0))}function Ls(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let Ka=0;function Ps(e,t,n,r){const s=e._endId=++Ka,o=()=>{s===e._endId&&r()};if(n!=null)return setTimeout(o,n);const{type:i,timeout:l,propCount:a}=qa(e,t);if(!i)return r();const p=i+"end";let c=0;const d=()=>{e.removeEventListener(p,g),o()},g=b=>{b.target===e&&++c>=a&&d()};setTimeout(()=>{c<a&&d()},l+1),e.addEventListener(p,g)}function qa(e,t){const n=window.getComputedStyle(e),r=N=>(n[N]||"").split(", "),s=r(`${Tt}Delay`),o=r(`${Tt}Duration`),i=Ms(s,o),l=r(`${sn}Delay`),a=r(`${sn}Duration`),p=Ms(l,a);let c=null,d=0,g=0;t===Tt?i>0&&(c=Tt,d=i,g=o.length):t===sn?p>0&&(c=sn,d=p,g=a.length):(d=Math.max(i,p),c=d>0?i>p?Tt:sn:null,g=c?c===Tt?o.length:a.length:0);const b=c===Tt&&/\b(?:transform|all)(?:,|$)/.test(r(`${Tt}Property`).toString());return{type:c,timeout:d,propCount:g,hasTransform:b}}function Ms(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((n,r)=>ks(n)+ks(e[r])))}function ks(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function Fs(e){return(e?e.ownerDocument:document).body.offsetHeight}function Ya(e,t,n){const r=e[An];r&&(t=(t?[t,...r]:[...r]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const Hs=Symbol("_vod"),za=Symbol("_vsh"),Xa=Symbol(""),Qa=/(?:^|;)\s*display\s*:/;function Za(e,t,n){const r=e.style,s=ge(n);let o=!1;if(n&&!s){if(t)if(ge(t))for(const i of t.split(";")){const l=i.slice(0,i.indexOf(":")).trim();n[l]==null&&kn(r,l,"")}else for(const i in t)n[i]==null&&kn(r,i,"");for(const i in n)i==="display"&&(o=!0),kn(r,i,n[i])}else if(s){if(t!==n){const i=r[Xa];i&&(n+=";"+i),r.cssText=n,o=Qa.test(n)}}else t&&e.removeAttribute("style");Hs in e&&(e[Hs]=o?r.display:"",e[za]&&(r.display="none"))}const Bs=/\s*!important$/;function kn(e,t,n){if(J(n))n.forEach(r=>kn(e,t,r));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const r=ec(e,t);Bs.test(n)?e.setProperty(Vt(r),n.replace(Bs,""),"important"):e[r]=n}}const Us=["Webkit","Moz","ms"],gr={};function ec(e,t){const n=gr[t];if(n)return n;let r=Me(t);if(r!=="filter"&&r in e)return gr[t]=r;r=Jn(r);for(let s=0;s<Us.length;s++){const o=Us[s]+r;if(o in e)return gr[t]=o}return t}const js="http://www.w3.org/1999/xlink";function Gs(e,t,n,r,s,o=el(t)){r&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(js,t.slice(6,t.length)):e.setAttributeNS(js,t,n):n==null||o&&!bo(n)?e.removeAttribute(t):e.setAttribute(t,o?"":Xe(n)?String(n):n)}function Vs(e,t,n,r,s){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?wi(n):n);return}const o=e.tagName;if(t==="value"&&o!=="PROGRESS"&&!o.includes("-")){const l=o==="OPTION"?e.getAttribute("value")||"":e.value,a=n==null?e.type==="checkbox"?"on":"":String(n);(l!==a||!("_value"in e))&&(e.value=a),n==null&&e.removeAttribute(t),e._value=n;return}let i=!1;if(n===""||n==null){const l=typeof e[t];l==="boolean"?n=bo(n):n==null&&l==="string"?(n="",i=!0):l==="number"&&(n=0,i=!0)}try{e[t]=n}catch{}i&&e.removeAttribute(s||t)}function tc(e,t,n,r){e.addEventListener(t,n,r)}function nc(e,t,n,r){e.removeEventListener(t,n,r)}const $s=Symbol("_vei");function rc(e,t,n,r,s=null){const o=e[$s]||(e[$s]={}),i=o[t];if(r&&i)i.value=r;else{const[l,a]=sc(t);if(r){const p=o[t]=lc(r,s);tc(e,l,p,a)}else i&&(nc(e,l,i,a),o[t]=void 0)}}const Ws=/(?:Once|Passive|Capture)$/;function sc(e){let t;if(Ws.test(e)){t={};let r;for(;r=e.match(Ws);)e=e.slice(0,e.length-r[0].length),t[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Vt(e.slice(2)),t]}let hr=0;const oc=Promise.resolve(),ic=()=>hr||(oc.then(()=>hr=0),hr=Date.now());function lc(e,t){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;Ze(ac(r,n.value),t,5,[r])};return n.value=e,n.attached=ic(),n}function ac(e,t){if(J(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(r=>s=>!s._stopped&&r&&r(s))}else return t}const Js=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,cc=(e,t,n,r,s,o)=>{const i=s==="svg";t==="class"?Ya(e,r,i):t==="style"?Za(e,n,r):$n(t)?Br(t)||rc(e,t,n,r,o):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):dc(e,t,r,i))?(Vs(e,t,r),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Gs(e,t,r,i,o,t!=="value")):e._isVueCE&&(pc(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!ge(r)))?Vs(e,Me(t),r,o,t):(t==="true-value"?e._trueValue=r:t==="false-value"&&(e._falseValue=r),Gs(e,t,r,i))};function dc(e,t,n,r){if(r)return!!(t==="innerHTML"||t==="textContent"||t in e&&Js(t)&&z(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const s=e.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Js(t)&&ge(n)?!1:t in e}function pc(e,t){const n=e._def.props;if(!n)return!1;const r=Me(t);return Array.isArray(n)?n.some(s=>Me(s)===r):Object.keys(n).some(s=>Me(s)===r)}const uc=["ctrl","shift","alt","meta"],fc={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>uc.some(n=>e[`${n}Key`]&&!t.includes(n))},mr=(e,t)=>{if(!e)return e;const n=e._withMods||(e._withMods={}),r=t.join(".");return n[r]||(n[r]=(s,...o)=>{for(let i=0;i<t.length;i++){const l=fc[t[i]];if(l&&l(s,t))return}return e(s,...o)})},gc=be({patchProp:cc},ja);let Ks;function hc(){return Ks||(Ks=va(gc))}const mc=(...e)=>{const t=hc().createApp(...e),{mount:n}=t;return t.mount=r=>{const s=bc(r);if(!s)return;const o=t._component;!z(o)&&!o.render&&!o.template&&(o.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const i=n(s,!1,xc(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),i},t};function xc(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function bc(e){return ge(e)?document.querySelector(e):e}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const Jt=typeof document<"u";function Oi(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function yc(e){return e.__esModule||e[Symbol.toStringTag]==="Module"||e.default&&Oi(e.default)}const ne=Object.assign;function xr(e,t){const n={};for(const r in t){const s=t[r];n[r]=et(s)?s.map(e):e(s)}return n}const hn=()=>{},et=Array.isArray;function qs(e,t){const n={};for(const r in e)n[r]=r in t?t[r]:e[r];return n}const Ni=/#/g,vc=/&/g,Ec=/\//g,Sc=/=/g,Ac=/\?/g,Di=/\+/g,_c=/%5B/g,Tc=/%5D/g,Li=/%5E/g,Rc=/%60/g,Pi=/%7B/g,Cc=/%7C/g,Mi=/%7D/g,wc=/%20/g;function os(e){return e==null?"":encodeURI(""+e).replace(Cc,"|").replace(_c,"[").replace(Tc,"]")}function Ic(e){return os(e).replace(Pi,"{").replace(Mi,"}").replace(Li,"^")}function Lr(e){return os(e).replace(Di,"%2B").replace(wc,"+").replace(Ni,"%23").replace(vc,"%26").replace(Rc,"`").replace(Pi,"{").replace(Mi,"}").replace(Li,"^")}function Oc(e){return Lr(e).replace(Sc,"%3D")}function Nc(e){return os(e).replace(Ni,"%23").replace(Ac,"%3F")}function Dc(e){return Nc(e).replace(Ec,"%2F")}function _n(e){if(e==null)return null;try{return decodeURIComponent(""+e)}catch{}return""+e}const Lc=/\/$/,Pc=e=>e.replace(Lc,"");function br(e,t,n="/"){let r,s={},o="",i="";const l=t.indexOf("#");let a=t.indexOf("?");return a=l>=0&&a>l?-1:a,a>=0&&(r=t.slice(0,a),o=t.slice(a,l>0?l:t.length),s=e(o.slice(1))),l>=0&&(r=r||t.slice(0,l),i=t.slice(l,t.length)),r=Hc(r??t,n),{fullPath:r+o+i,path:r,query:s,hash:_n(i)}}function Mc(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function Ys(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function kc(e,t,n){const r=t.matched.length-1,s=n.matched.length-1;return r>-1&&r===s&&Zt(t.matched[r],n.matched[s])&&ki(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function Zt(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function ki(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var n in e)if(!Fc(e[n],t[n]))return!1;return!0}function Fc(e,t){return et(e)?zs(e,t):et(t)?zs(t,e):(e==null?void 0:e.valueOf())===(t==null?void 0:t.valueOf())}function zs(e,t){return et(t)?e.length===t.length&&e.every((n,r)=>n===t[r]):e.length===1&&e[0]===t}function Hc(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),r=e.split("/"),s=r[r.length-1];(s===".."||s===".")&&r.push("");let o=n.length-1,i,l;for(i=0;i<r.length;i++)if(l=r[i],l!==".")if(l==="..")o>1&&o--;else break;return n.slice(0,o).join("/")+"/"+r.slice(i).join("/")}const Rt={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let Pr=function(e){return e.pop="pop",e.push="push",e}({}),yr=function(e){return e.back="back",e.forward="forward",e.unknown="",e}({});function Bc(e){if(!e)if(Jt){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),Pc(e)}const Uc=/^[^#]+#/;function jc(e,t){return e.replace(Uc,"#")+t}function Gc(e,t){const n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}const nr=()=>({left:window.scrollX,top:window.scrollY});function Vc(e){let t;if("el"in e){const n=e.el,r=typeof n=="string"&&n.startsWith("#"),s=typeof n=="string"?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!s)return;t=Gc(s,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function Xs(e,t){return(history.state?history.state.position-t:-1)+e}const Mr=new Map;function $c(e,t){Mr.set(e,t)}function Wc(e){const t=Mr.get(e);return Mr.delete(e),t}function Jc(e){return typeof e=="string"||e&&typeof e=="object"}function Fi(e){return typeof e=="string"||typeof e=="symbol"}let fe=function(e){return e[e.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",e[e.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",e[e.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",e[e.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",e[e.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",e}({});const Hi=Symbol("");fe.MATCHER_NOT_FOUND+"",fe.NAVIGATION_GUARD_REDIRECT+"",fe.NAVIGATION_ABORTED+"",fe.NAVIGATION_CANCELLED+"",fe.NAVIGATION_DUPLICATED+"";function en(e,t){return ne(new Error,{type:e,[Hi]:!0},t)}function ht(e,t){return e instanceof Error&&Hi in e&&(t==null||!!(e.type&t))}const Kc=["params","query","hash"];function qc(e){if(typeof e=="string")return e;if(e.path!=null)return e.path;const t={};for(const n of Kc)n in e&&(t[n]=e[n]);return JSON.stringify(t,null,2)}function Yc(e){const t={};if(e===""||e==="?")return t;const n=(e[0]==="?"?e.slice(1):e).split("&");for(let r=0;r<n.length;++r){const s=n[r].replace(Di," "),o=s.indexOf("="),i=_n(o<0?s:s.slice(0,o)),l=o<0?null:_n(s.slice(o+1));if(i in t){let a=t[i];et(a)||(a=t[i]=[a]),a.push(l)}else t[i]=l}return t}function Qs(e){let t="";for(let n in e){const r=e[n];if(n=Oc(n),r==null){r!==void 0&&(t+=(t.length?"&":"")+n);continue}(et(r)?r.map(s=>s&&Lr(s)):[r&&Lr(r)]).forEach(s=>{s!==void 0&&(t+=(t.length?"&":"")+n,s!=null&&(t+="="+s))})}return t}function zc(e){const t={};for(const n in e){const r=e[n];r!==void 0&&(t[n]=et(r)?r.map(s=>s==null?null:""+s):r==null?r:""+r)}return t}const Xc=Symbol(""),Zs=Symbol(""),rr=Symbol(""),is=Symbol(""),kr=Symbol("");function on(){let e=[];function t(r){return e.push(r),()=>{const s=e.indexOf(r);s>-1&&e.splice(s,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function wt(e,t,n,r,s,o=i=>i()){const i=r&&(r.enterCallbacks[s]=r.enterCallbacks[s]||[]);return()=>new Promise((l,a)=>{const p=g=>{g===!1?a(en(fe.NAVIGATION_ABORTED,{from:n,to:t})):g instanceof Error?a(g):Jc(g)?a(en(fe.NAVIGATION_GUARD_REDIRECT,{from:t,to:g})):(i&&r.enterCallbacks[s]===i&&typeof g=="function"&&i.push(g),l())},c=o(()=>e.call(r&&r.instances[s],t,n,p));let d=Promise.resolve(c);e.length<3&&(d=d.then(p)),d.catch(g=>a(g))})}function vr(e,t,n,r,s=o=>o()){const o=[];for(const i of e)for(const l in i.components){let a=i.components[l];if(!(t!=="beforeRouteEnter"&&!i.instances[l]))if(Oi(a)){const p=(a.__vccOpts||a)[t];p&&o.push(wt(p,n,r,i,l,s))}else{let p=a();o.push(()=>p.then(c=>{if(!c)throw new Error(`Couldn't resolve component "${l}" at "${i.path}"`);const d=yc(c)?c.default:c;i.mods[l]=c,i.components[l]=d;const g=(d.__vccOpts||d)[t];return g&&wt(g,n,r,i,l,s)()}))}}return o}function Qc(e,t){const n=[],r=[],s=[],o=Math.max(t.matched.length,e.matched.length);for(let i=0;i<o;i++){const l=t.matched[i];l&&(e.matched.find(p=>Zt(p,l))?r.push(l):n.push(l));const a=e.matched[i];a&&(t.matched.find(p=>Zt(p,a))||s.push(a))}return[n,r,s]}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let Zc=()=>location.protocol+"//"+location.host;function Bi(e,t){const{pathname:n,search:r,hash:s}=t,o=e.indexOf("#");if(o>-1){let i=s.includes(e.slice(o))?e.slice(o).length:1,l=s.slice(i);return l[0]!=="/"&&(l="/"+l),Ys(l,"")}return Ys(n,e)+r+s}function ed(e,t,n,r){let s=[],o=[],i=null;const l=({state:g})=>{const b=Bi(e,location),N=n.value,R=t.value;let P=0;if(g){if(n.value=b,t.value=g,i&&i===N){i=null;return}P=R?g.position-R.position:0}else r(b);s.forEach(H=>{H(n.value,N,{delta:P,type:Pr.pop,direction:P?P>0?yr.forward:yr.back:yr.unknown})})};function a(){i=n.value}function p(g){s.push(g);const b=()=>{const N=s.indexOf(g);N>-1&&s.splice(N,1)};return o.push(b),b}function c(){if(document.visibilityState==="hidden"){const{history:g}=window;if(!g.state)return;g.replaceState(ne({},g.state,{scroll:nr()}),"")}}function d(){for(const g of o)g();o=[],window.removeEventListener("popstate",l),window.removeEventListener("pagehide",c),document.removeEventListener("visibilitychange",c)}return window.addEventListener("popstate",l),window.addEventListener("pagehide",c),document.addEventListener("visibilitychange",c),{pauseListeners:a,listen:p,destroy:d}}function eo(e,t,n,r=!1,s=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:s?nr():null}}function td(e){const{history:t,location:n}=window,r={value:Bi(e,n)},s={value:t.state};s.value||o(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function o(a,p,c){const d=e.indexOf("#"),g=d>-1?(n.host&&document.querySelector("base")?e:e.slice(d))+a:Zc()+e+a;try{t[c?"replaceState":"pushState"](p,"",g),s.value=p}catch(b){console.error(b),n[c?"replace":"assign"](g)}}function i(a,p){o(a,ne({},t.state,eo(s.value.back,a,s.value.forward,!0),p,{position:s.value.position}),!0),r.value=a}function l(a,p){const c=ne({},s.value,t.state,{forward:a,scroll:nr()});o(c.current,c,!0),o(a,ne({},eo(r.value,a,null),{position:c.position+1},p),!1),r.value=a}return{location:r,state:s,push:l,replace:i}}function nd(e){e=Bc(e);const t=td(e),n=ed(e,t.state,t.location,t.replace);function r(o,i=!0){i||n.pauseListeners(),history.go(o)}const s=ne({location:"",base:e,go:r,createHref:jc.bind(null,e)},t,n);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>t.state.value}),s}function rd(e){return e=location.host?e||location.pathname+location.search:"",e.includes("#")||(e+="#"),nd(e)}let Ut=function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.Group=2]="Group",e}({});var xe=function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.ParamRegExp=2]="ParamRegExp",e[e.ParamRegExpEnd=3]="ParamRegExpEnd",e[e.EscapeNext=4]="EscapeNext",e}(xe||{});const sd={type:Ut.Static,value:""},od=/[a-zA-Z0-9_]/;function id(e){if(!e)return[[]];if(e==="/")return[[sd]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(b){throw new Error(`ERR (${n})/"${p}": ${b}`)}let n=xe.Static,r=n;const s=[];let o;function i(){o&&s.push(o),o=[]}let l=0,a,p="",c="";function d(){p&&(n===xe.Static?o.push({type:Ut.Static,value:p}):n===xe.Param||n===xe.ParamRegExp||n===xe.ParamRegExpEnd?(o.length>1&&(a==="*"||a==="+")&&t(`A repeatable param (${p}) must be alone in its segment. eg: '/:ids+.`),o.push({type:Ut.Param,value:p,regexp:c,repeatable:a==="*"||a==="+",optional:a==="*"||a==="?"})):t("Invalid state to consume buffer"),p="")}function g(){p+=a}for(;l<e.length;){if(a=e[l++],a==="\\"&&n!==xe.ParamRegExp){r=n,n=xe.EscapeNext;continue}switch(n){case xe.Static:a==="/"?(p&&d(),i()):a===":"?(d(),n=xe.Param):g();break;case xe.EscapeNext:g(),n=r;break;case xe.Param:a==="("?n=xe.ParamRegExp:od.test(a)?g():(d(),n=xe.Static,a!=="*"&&a!=="?"&&a!=="+"&&l--);break;case xe.ParamRegExp:a===")"?c[c.length-1]=="\\"?c=c.slice(0,-1)+a:n=xe.ParamRegExpEnd:c+=a;break;case xe.ParamRegExpEnd:d(),n=xe.Static,a!=="*"&&a!=="?"&&a!=="+"&&l--,c="";break;default:t("Unknown state");break}}return n===xe.ParamRegExp&&t(`Unfinished custom RegExp for param "${p}"`),d(),i(),s}const to="[^/]+?",ld={sensitive:!1,strict:!1,start:!0,end:!0};var De=function(e){return e[e._multiplier=10]="_multiplier",e[e.Root=90]="Root",e[e.Segment=40]="Segment",e[e.SubSegment=30]="SubSegment",e[e.Static=40]="Static",e[e.Dynamic=20]="Dynamic",e[e.BonusCustomRegExp=10]="BonusCustomRegExp",e[e.BonusWildcard=-50]="BonusWildcard",e[e.BonusRepeatable=-20]="BonusRepeatable",e[e.BonusOptional=-8]="BonusOptional",e[e.BonusStrict=.7000000000000001]="BonusStrict",e[e.BonusCaseSensitive=.25]="BonusCaseSensitive",e}(De||{});const ad=/[.+*?^${}()[\]/\\]/g;function cd(e,t){const n=ne({},ld,t),r=[];let s=n.start?"^":"";const o=[];for(const p of e){const c=p.length?[]:[De.Root];n.strict&&!p.length&&(s+="/");for(let d=0;d<p.length;d++){const g=p[d];let b=De.Segment+(n.sensitive?De.BonusCaseSensitive:0);if(g.type===Ut.Static)d||(s+="/"),s+=g.value.replace(ad,"\\$&"),b+=De.Static;else if(g.type===Ut.Param){const{value:N,repeatable:R,optional:P,regexp:H}=g;o.push({name:N,repeatable:R,optional:P});const h=H||to;if(h!==to){b+=De.BonusCustomRegExp;try{`${h}`}catch(y){throw new Error(`Invalid custom RegExp for param "${N}" (${h}): `+y.message)}}let m=R?`((?:${h})(?:/(?:${h}))*)`:`(${h})`;d||(m=P&&p.length<2?`(?:/${m})`:"/"+m),P&&(m+="?"),s+=m,b+=De.Dynamic,P&&(b+=De.BonusOptional),R&&(b+=De.BonusRepeatable),h===".*"&&(b+=De.BonusWildcard)}c.push(b)}r.push(c)}if(n.strict&&n.end){const p=r.length-1;r[p][r[p].length-1]+=De.BonusStrict}n.strict||(s+="/?"),n.end?s+="$":n.strict&&!s.endsWith("/")&&(s+="(?:/|$)");const i=new RegExp(s,n.sensitive?"":"i");function l(p){const c=p.match(i),d={};if(!c)return null;for(let g=1;g<c.length;g++){const b=c[g]||"",N=o[g-1];d[N.name]=b&&N.repeatable?b.split("/"):b}return d}function a(p){let c="",d=!1;for(const g of e){(!d||!c.endsWith("/"))&&(c+="/"),d=!1;for(const b of g)if(b.type===Ut.Static)c+=b.value;else if(b.type===Ut.Param){const{value:N,repeatable:R,optional:P}=b,H=N in p?p[N]:"";if(et(H)&&!R)throw new Error(`Provided param "${N}" is an array but it is not repeatable (* or + modifiers)`);const h=et(H)?H.join("/"):H;if(!h)if(P)g.length<2&&(c.endsWith("/")?c=c.slice(0,-1):d=!0);else throw new Error(`Missing required param "${N}"`);c+=h}}return c||"/"}return{re:i,score:r,keys:o,parse:l,stringify:a}}function dd(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?e.length===1&&e[0]===De.Static+De.Segment?-1:1:e.length>t.length?t.length===1&&t[0]===De.Static+De.Segment?1:-1:0}function Ui(e,t){let n=0;const r=e.score,s=t.score;for(;n<r.length&&n<s.length;){const o=dd(r[n],s[n]);if(o)return o;n++}if(Math.abs(s.length-r.length)===1){if(no(r))return 1;if(no(s))return-1}return s.length-r.length}function no(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const pd={strict:!1,end:!0,sensitive:!1};function ud(e,t,n){const r=cd(id(e.path),n),s=ne(r,{record:e,parent:t,children:[],alias:[]});return t&&!s.record.aliasOf==!t.record.aliasOf&&t.children.push(s),s}function fd(e,t){const n=[],r=new Map;t=qs(pd,t);function s(d){return r.get(d)}function o(d,g,b){const N=!b,R=so(d);R.aliasOf=b&&b.record;const P=qs(t,d),H=[R];if("alias"in d){const y=typeof d.alias=="string"?[d.alias]:d.alias;for(const _ of y)H.push(so(ne({},R,{components:b?b.record.components:R.components,path:_,aliasOf:b?b.record:R})))}let h,m;for(const y of H){const{path:_}=y;if(g&&_[0]!=="/"){const C=g.record.path,D=C[C.length-1]==="/"?"":"/";y.path=g.record.path+(_&&D+_)}if(h=ud(y,g,P),b?b.alias.push(h):(m=m||h,m!==h&&m.alias.push(h),N&&d.name&&!oo(h)&&i(d.name)),ji(h)&&a(h),R.children){const C=R.children;for(let D=0;D<C.length;D++)o(C[D],h,b&&b.children[D])}b=b||h}return m?()=>{i(m)}:hn}function i(d){if(Fi(d)){const g=r.get(d);g&&(r.delete(d),n.splice(n.indexOf(g),1),g.children.forEach(i),g.alias.forEach(i))}else{const g=n.indexOf(d);g>-1&&(n.splice(g,1),d.record.name&&r.delete(d.record.name),d.children.forEach(i),d.alias.forEach(i))}}function l(){return n}function a(d){const g=md(d,n);n.splice(g,0,d),d.record.name&&!oo(d)&&r.set(d.record.name,d)}function p(d,g){let b,N={},R,P;if("name"in d&&d.name){if(b=r.get(d.name),!b)throw en(fe.MATCHER_NOT_FOUND,{location:d});P=b.record.name,N=ne(ro(g.params,b.keys.filter(m=>!m.optional).concat(b.parent?b.parent.keys.filter(m=>m.optional):[]).map(m=>m.name)),d.params&&ro(d.params,b.keys.map(m=>m.name))),R=b.stringify(N)}else if(d.path!=null)R=d.path,b=n.find(m=>m.re.test(R)),b&&(N=b.parse(R),P=b.record.name);else{if(b=g.name?r.get(g.name):n.find(m=>m.re.test(g.path)),!b)throw en(fe.MATCHER_NOT_FOUND,{location:d,currentLocation:g});P=b.record.name,N=ne({},g.params,d.params),R=b.stringify(N)}const H=[];let h=b;for(;h;)H.unshift(h.record),h=h.parent;return{name:P,path:R,params:N,matched:H,meta:hd(H)}}e.forEach(d=>o(d));function c(){n.length=0,r.clear()}return{addRoute:o,resolve:p,removeRoute:i,clearRoutes:c,getRoutes:l,getRecordMatcher:s}}function ro(e,t){const n={};for(const r of t)r in e&&(n[r]=e[r]);return n}function so(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:gd(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function gd(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const r in e.components)t[r]=typeof n=="object"?n[r]:n;return t}function oo(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function hd(e){return e.reduce((t,n)=>ne(t,n.meta),{})}function md(e,t){let n=0,r=t.length;for(;n!==r;){const o=n+r>>1;Ui(e,t[o])<0?r=o:n=o+1}const s=xd(e);return s&&(r=t.lastIndexOf(s,r-1)),r}function xd(e){let t=e;for(;t=t.parent;)if(ji(t)&&Ui(e,t)===0)return t}function ji({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function io(e){const t=ze(rr),n=ze(is),r=Ue(()=>{const a=ut(e.to);return t.resolve(a)}),s=Ue(()=>{const{matched:a}=r.value,{length:p}=a,c=a[p-1],d=n.matched;if(!c||!d.length)return-1;const g=d.findIndex(Zt.bind(null,c));if(g>-1)return g;const b=lo(a[p-2]);return p>1&&lo(c)===b&&d[d.length-1].path!==b?d.findIndex(Zt.bind(null,a[p-2])):g}),o=Ue(()=>s.value>-1&&Sd(n.params,r.value.params)),i=Ue(()=>s.value>-1&&s.value===n.matched.length-1&&ki(n.params,r.value.params));function l(a={}){if(Ed(a)){const p=t[ut(e.replace)?"replace":"push"](ut(e.to)).catch(hn);return e.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>p),p}return Promise.resolve()}return{route:r,href:Ue(()=>r.value.href),isActive:o,isExactActive:i,navigate:l}}function bd(e){return e.length===1?e[0]:e}const yd=tt({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:io,setup(e,{slots:t}){const n=Yn(io(e)),{options:r}=ze(rr),s=Ue(()=>({[ao(e.activeClass,r.linkActiveClass,"router-link-active")]:n.isActive,[ao(e.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const o=t.default&&bd(t.default(n));return e.custom?o:ss("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},o)}}}),vd=yd;function Ed(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Sd(e,t){for(const n in t){const r=t[n],s=e[n];if(typeof r=="string"){if(r!==s)return!1}else if(!et(s)||s.length!==r.length||r.some((o,i)=>o.valueOf()!==s[i].valueOf()))return!1}return!0}function lo(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const ao=(e,t,n)=>e??t??n,Ad=tt({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const r=ze(kr),s=Ue(()=>e.route||r.value),o=ze(Zs,0),i=Ue(()=>{let p=ut(o);const{matched:c}=s.value;let d;for(;(d=c[p])&&!d.components;)p++;return p}),l=Ue(()=>s.value.matched[i.value]);Ln(Zs,Ue(()=>i.value+1)),Ln(Xc,l),Ln(kr,s);const a=Ye();return pn(()=>[a.value,l.value,e.name],([p,c,d],[g,b,N])=>{c&&(c.instances[d]=p,b&&b!==c&&p&&p===g&&(c.leaveGuards.size||(c.leaveGuards=b.leaveGuards),c.updateGuards.size||(c.updateGuards=b.updateGuards))),p&&c&&(!b||!Zt(c,b)||!g)&&(c.enterCallbacks[d]||[]).forEach(R=>R(p))},{flush:"post"}),()=>{const p=s.value,c=e.name,d=l.value,g=d&&d.components[c];if(!g)return co(n.default,{Component:g,route:p});const b=d.props[c],N=b?b===!0?p.params:typeof b=="function"?b(p):b:null,P=ss(g,ne({},N,t,{onVnodeUnmounted:H=>{H.component.isUnmounted&&(d.instances[c]=null)},ref:a}));return co(n.default,{Component:P,route:p})||P}}});function co(e,t){if(!e)return null;const n=e(t);return n.length===1?n[0]:n}const _d=Ad;function Td(e){const t=fd(e.routes,e),n=e.parseQuery||Yc,r=e.stringifyQuery||Qs,s=e.history,o=on(),i=on(),l=on(),a=Al(Rt);let p=Rt;Jt&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const c=xr.bind(null,E=>""+E),d=xr.bind(null,Dc),g=xr.bind(null,_n);function b(E,U){let M,j;return Fi(E)?(M=t.getRecordMatcher(E),j=U):j=E,t.addRoute(j,M)}function N(E){const U=t.getRecordMatcher(E);U&&t.removeRoute(U)}function R(){return t.getRoutes().map(E=>E.record)}function P(E){return!!t.getRecordMatcher(E)}function H(E,U){if(U=ne({},U||a.value),typeof E=="string"){const x=br(n,E,U.path),S=t.resolve({path:x.path},U),T=s.createHref(x.fullPath);return ne(x,S,{params:g(S.params),hash:_n(x.hash),redirectedFrom:void 0,href:T})}let M;if(E.path!=null)M=ne({},E,{path:br(n,E.path,U.path).path});else{const x=ne({},E.params);for(const S in x)x[S]==null&&delete x[S];M=ne({},E,{params:d(x)}),U.params=d(U.params)}const j=t.resolve(M,U),X=E.hash||"";j.params=c(g(j.params));const u=Mc(r,ne({},E,{hash:Ic(X),path:j.path})),f=s.createHref(u);return ne({fullPath:u,hash:X,query:r===Qs?zc(E.query):E.query||{}},j,{redirectedFrom:void 0,href:f})}function h(E){return typeof E=="string"?br(n,E,a.value.path):ne({},E)}function m(E,U){if(p!==E)return en(fe.NAVIGATION_CANCELLED,{from:U,to:E})}function y(E){return D(E)}function _(E){return y(ne(h(E),{replace:!0}))}function C(E,U){const M=E.matched[E.matched.length-1];if(M&&M.redirect){const{redirect:j}=M;let X=typeof j=="function"?j(E,U):j;return typeof X=="string"&&(X=X.includes("?")||X.includes("#")?X=h(X):{path:X},X.params={}),ne({query:E.query,hash:E.hash,params:X.path!=null?{}:E.params},X)}}function D(E,U){const M=p=H(E),j=a.value,X=E.state,u=E.force,f=E.replace===!0,x=C(M,j);if(x)return D(ne(h(x),{state:typeof x=="object"?ne({},X,x.state):X,force:u,replace:f}),U||M);const S=M;S.redirectedFrom=U;let T;return!u&&kc(r,j,M)&&(T=en(fe.NAVIGATION_DUPLICATED,{to:S,from:j}),Ie(j,j,!0,!1)),(T?Promise.resolve(T):G(S,j)).catch(A=>ht(A)?ht(A,fe.NAVIGATION_GUARD_REDIRECT)?A:we(A):K(A,S,j)).then(A=>{if(A){if(ht(A,fe.NAVIGATION_GUARD_REDIRECT))return D(ne({replace:f},h(A.to),{state:typeof A.to=="object"?ne({},X,A.to.state):X,force:u}),U||S)}else A=k(S,j,!0,f,X);return Y(S,j,A),A})}function $(E,U){const M=m(E,U);return M?Promise.reject(M):Promise.resolve()}function I(E){const U=Oe.values().next().value;return U&&typeof U.runWithContext=="function"?U.runWithContext(E):E()}function G(E,U){let M;const[j,X,u]=Qc(E,U);M=vr(j.reverse(),"beforeRouteLeave",E,U);for(const x of j)x.leaveGuards.forEach(S=>{M.push(wt(S,E,U))});const f=$.bind(null,E,U);return M.push(f),ye(M).then(()=>{M=[];for(const x of o.list())M.push(wt(x,E,U));return M.push(f),ye(M)}).then(()=>{M=vr(X,"beforeRouteUpdate",E,U);for(const x of X)x.updateGuards.forEach(S=>{M.push(wt(S,E,U))});return M.push(f),ye(M)}).then(()=>{M=[];for(const x of u)if(x.beforeEnter)if(et(x.beforeEnter))for(const S of x.beforeEnter)M.push(wt(S,E,U));else M.push(wt(x.beforeEnter,E,U));return M.push(f),ye(M)}).then(()=>(E.matched.forEach(x=>x.enterCallbacks={}),M=vr(u,"beforeRouteEnter",E,U,I),M.push(f),ye(M))).then(()=>{M=[];for(const x of i.list())M.push(wt(x,E,U));return M.push(f),ye(M)}).catch(x=>ht(x,fe.NAVIGATION_CANCELLED)?x:Promise.reject(x))}function Y(E,U,M){l.list().forEach(j=>I(()=>j(E,U,M)))}function k(E,U,M,j,X){const u=m(E,U);if(u)return u;const f=U===Rt,x=Jt?history.state:{};M&&(j||f?s.replace(E.fullPath,ne({scroll:f&&x&&x.scroll},X)):s.push(E.fullPath,X)),a.value=E,Ie(E,U,M,f),we()}let Z;function he(){Z||(Z=s.listen((E,U,M)=>{if(!je.listening)return;const j=H(E),X=C(j,je.currentRoute.value);if(X){D(ne(X,{replace:!0,force:!0}),j).catch(hn);return}p=j;const u=a.value;Jt&&$c(Xs(u.fullPath,M.delta),nr()),G(j,u).catch(f=>ht(f,fe.NAVIGATION_ABORTED|fe.NAVIGATION_CANCELLED)?f:ht(f,fe.NAVIGATION_GUARD_REDIRECT)?(D(ne(h(f.to),{force:!0}),j).then(x=>{ht(x,fe.NAVIGATION_ABORTED|fe.NAVIGATION_DUPLICATED)&&!M.delta&&M.type===Pr.pop&&s.go(-1,!1)}).catch(hn),Promise.reject()):(M.delta&&s.go(-M.delta,!1),K(f,j,u))).then(f=>{f=f||k(j,u,!1),f&&(M.delta&&!ht(f,fe.NAVIGATION_CANCELLED)?s.go(-M.delta,!1):M.type===Pr.pop&&ht(f,fe.NAVIGATION_ABORTED|fe.NAVIGATION_DUPLICATED)&&s.go(-1,!1)),Y(j,u,f)}).catch(hn)}))}let Ce=on(),ue=on(),ee;function K(E,U,M){we(E);const j=ue.list();return j.length?j.forEach(X=>X(E,U,M)):console.error(E),Promise.reject(E)}function me(){return ee&&a.value!==Rt?Promise.resolve():new Promise((E,U)=>{Ce.add([E,U])})}function we(E){return ee||(ee=!E,he(),Ce.list().forEach(([U,M])=>E?M(E):U()),Ce.reset()),E}function Ie(E,U,M,j){const{scrollBehavior:X}=e;if(!Jt||!X)return Promise.resolve();const u=!M&&Wc(Xs(E.fullPath,0))||(j||!M)&&history.state&&history.state.scroll||null;return Bo().then(()=>X(E,U,u)).then(f=>f&&Vc(f)).catch(f=>K(f,E,U))}const ie=E=>s.go(E);let _t;const Oe=new Set,je={currentRoute:a,listening:!0,addRoute:b,removeRoute:N,clearRoutes:t.clearRoutes,hasRoute:P,getRoutes:R,resolve:H,options:e,push:y,replace:_,go:ie,back:()=>ie(-1),forward:()=>ie(1),beforeEach:o.add,beforeResolve:i.add,afterEach:l.add,onError:ue.add,isReady:me,install(E){E.component("RouterLink",vd),E.component("RouterView",_d),E.config.globalProperties.$router=je,Object.defineProperty(E.config.globalProperties,"$route",{enumerable:!0,get:()=>ut(a)}),Jt&&!_t&&a.value===Rt&&(_t=!0,y(s.location).catch(j=>{}));const U={};for(const j in Rt)Object.defineProperty(U,j,{get:()=>a.value[j],enumerable:!0});E.provide(rr,je),E.provide(is,Mo(U)),E.provide(kr,a);const M=E.unmount;Oe.add(E),E.unmount=function(){Oe.delete(E),Oe.size<1&&(p=Rt,Z&&Z(),Z=null,a.value=Rt,_t=!1,ee=!1),M()}}};function ye(E){return E.reduce((U,M)=>U.then(()=>I(M)),Promise.resolve())}return je}function wn(){return ze(rr)}function ls(e){return ze(is)}const Rd=["src"],Ft=tt({__name:"DesktopIcon",props:{label:{},iconClass:{},iconSrc:{},color:{},onClick:{type:Function}},setup(e){const t=Ye(!1);return(n,r)=>(pe(),Te("div",{class:"group flex flex-col items-center gap-1 w-[88px] cursor-pointer select-none",onClick:r[0]||(r[0]=(...s)=>e.onClick&&e.onClick(...s)),onMousedown:r[1]||(r[1]=s=>t.value=!0),onMouseup:r[2]||(r[2]=s=>t.value=!1),onMouseleave:r[3]||(r[3]=s=>t.value=!1)},[v("div",{class:$e(["w-12 h-12 text-[40px] flex justify-center items-center transition-transform duration-75",[e.color||"text-white",t.value?"scale-90":"group-hover:scale-110"]]),style:{filter:"drop-shadow(2px 2px 1px rgba(0,0,0,0.6))"}},[e.iconClass?(pe(),Te("i",{key:0,class:$e(e.iconClass)},null,2)):Nt("",!0),e.iconSrc?(pe(),Te("img",{key:1,src:e.iconSrc,class:"w-full h-full object-contain"},null,8,Rd)):Nt("",!0)],2),v("span",{class:$e(["text-white text-xs px-1 py-0.5 max-w-full break-words text-center leading-tight rounded-sm",t.value?"bg-navy border border-dotted border-white":"bg-transparent group-hover:bg-navy group-hover:border group-hover:border-dotted group-hover:border-white"])},Ke(e.label),3)],32))}}),Cd={key:0,id:"start-menu",class:"absolute bottom-10 left-1 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] w-52 flex flex-col z-[60] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"},wd={class:"flex"},Id={class:"flex-1 py-1 text-sm text-black"},Od={class:"h-10 bg-[#c0c0c0] shadow-[inset_0_1px_0_#ffffff,inset_0_2px_0_#dfdfdf] flex items-center px-0.5 py-0.5 gap-1 z-50 fixed bottom-0 w-full select-none border-t-2 border-t-[#ffffff]"},Nd={class:"flex-1 flex justify-start gap-1 overflow-hidden px-0.5 min-w-0"},Dd=["onClick"],Ld={class:"truncate"},Pd={class:"px-2.5 py-0.5 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] flex items-center gap-2 text-xs h-[26px] shrink-0 bg-[#c0c0c0]"},Md={class:"flex flex-col items-end leading-none"},kd={class:"text-[11px]"},Fd={class:"text-[9px] text-gray-600"},Hd=tt({__name:"Taskbar",props:{openWindows:{}},emits:["activate-window","navigate","shutdown"],setup(e,{emit:t}){const n=Ye(!1),r=Ye(""),s=Ye(""),o=()=>{const c=new Date,d=c.getHours().toString().padStart(2,"0"),g=c.getMinutes().toString().padStart(2,"0");r.value=`${d}:${g}`;const b=c.getFullYear(),N=(c.getMonth()+1).toString().padStart(2,"0"),R=c.getDate().toString().padStart(2,"0");s.value=`${b}-${N}-${R}`};let i;Zn(()=>{o(),i=setInterval(o,3e4),document.addEventListener("click",a)}),Qr(()=>{clearInterval(i),document.removeEventListener("click",a)});const l=c=>{c.stopPropagation(),n.value=!n.value},a=c=>{const d=document.getElementById("start-menu"),g=document.getElementById("start-btn");d&&!d.contains(c.target)&&g&&!g.contains(c.target)&&(n.value=!1)},p=t;return(c,d)=>(pe(),Te(ve,null,[de($a,{name:"start-menu"},{default:Dt(()=>[n.value?(pe(),Te("div",Cd,[v("div",wd,[d[11]||(d[11]=v("div",{class:"w-8 bg-[#000080] text-[#c0c0c0] flex items-end justify-center pb-2 shrink-0"},[v("span",{class:"transform -rotate-90 text-lg font-bold whitespace-nowrap tracking-[4px] mb-6 origin-center",style:{"font-family":"'Georgia', serif"}}," YF-Blog ")],-1)),v("div",Id,[v("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:d[0]||(d[0]=g=>p("navigate","/"))},[...d[4]||(d[4]=[v("i",{class:"fa fa-desktop w-4 text-center"},null,-1),v("span",null,"桌面",-1)])]),v("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:d[1]||(d[1]=g=>p("navigate","/all-notes"))},[...d[5]||(d[5]=[v("i",{class:"fa fa-folder-open w-4 text-center"},null,-1),v("span",null,"我的文档",-1)])]),v("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:d[2]||(d[2]=g=>p("navigate","/categories"))},[...d[6]||(d[6]=[v("i",{class:"fa fa-cog w-4 text-center"},null,-1),v("span",null,"控制面板",-1)])]),d[8]||(d[8]=v("hr",{class:"border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1"},null,-1)),d[9]||(d[9]=v("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onclick:"window.open('https://github.com', '_blank')"},[v("i",{class:"fa fa-globe w-4 text-center"}),v("span",null,"Internet 浏览器")],-1)),d[10]||(d[10]=v("hr",{class:"border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1"},null,-1)),v("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:d[3]||(d[3]=g=>p("shutdown"))},[...d[7]||(d[7]=[v("i",{class:"fa fa-power-off w-4 text-center"},null,-1),v("span",null,"关闭系统...",-1)])])])])])):Nt("",!0)]),_:1}),v("footer",Od,[v("button",{id:"start-btn",onClick:l,class:$e(["flex items-center gap-1.5 px-2 py-1 font-bold text-sm win-btn text-black h-[28px] shrink-0",n.value?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]"])},[...d[12]||(d[12]=[v("img",{src:"https://win98icons.alexmeub.com/icons/png/windows-0.png",class:"w-5 h-5",alt:"win"},null,-1),Ee(" 开始 ",-1)])],2),d[14]||(d[14]=v("div",{class:"w-[3px] h-[22px] bg-[#808080] border-r border-[#ffffff] shrink-0"},null,-1)),v("div",Nd,[(pe(!0),Te(ve,null,Zr(e.openWindows,g=>(pe(),Te("div",{key:g.id,class:$e(["px-2 py-1 font-bold text-xs flex items-center gap-1.5 w-[140px] md:w-[170px] shrink min-w-0 cursor-pointer text-black h-[26px]",g.isActive?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] bg-[#c0c0c0]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]"]),onClick:b=>p("activate-window",g.id)},[v("i",{class:$e([g.icon,"shrink-0 text-xs"])},null,2),v("span",Ld,Ke(g.title),1)],10,Dd))),128))]),v("div",Pd,[d[13]||(d[13]=v("i",{class:"fa fa-volume-up text-[11px]"},null,-1)),v("div",Md,[v("span",kd,Ke(r.value),1),v("span",Fd,Ke(s.value),1)])])])],64))}}),Bd=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},Ud=Bd(Hd,[["__scopeId","data-v-12ad2e01"]]),Fr=[{id:"hello-world",title:"Hello World",date:"2023-10-01",icon:"fa fa-file-text-o",path:"/notes/hello-world",category:"java"},{id:"idea-shortcuts",title:"IDEA Shortcuts",date:"2023-11-01",icon:"fa fa-file-text-o",path:"/notes/idea-shortcuts",category:"java"},{id:"java-collections-framework",title:"Java Collections",date:"2023-11-15",icon:"fa fa-file-text-o",path:"/notes/java-collections-framework",category:"java"},{id:"vue-migration",title:"Vue Migration",date:"2024-03-15",icon:"fa fa-file-code-o",path:"/notes/vue-migration",category:"frontend"},{id:"spring-boot-guide",title:"Spring Boot Guide",date:"2024-03-20",icon:"fa fa-leaf",path:"/notes/spring-boot-guide",category:"spring"},{id:"mysql-basics",title:"MySQL Basics",date:"2024-03-22",icon:"fa fa-database",path:"/notes/mysql-basics",category:"database"},{id:"git-basics",title:"Git 常用命令",date:"2024-04-05",icon:"fa fa-code-fork",path:"/notes/git-basics",category:"devops"},{id:"docker-intro",title:"Docker 入门指南",date:"2024-04-12",icon:"fa fa-ship",path:"/notes/docker-intro",category:"devops"},{id:"linux-commands",title:"Linux 基础命令",date:"2024-04-20",icon:"fa fa-terminal",path:"/notes/linux-commands",category:"devops"},{id:"javascript-es6",title:"JavaScript ES6+ 新特性",date:"2024-05-01",icon:"fa fa-file-code-o",path:"/notes/javascript-es6",category:"frontend"},{id:"design-patterns",title:"设计模式入门",date:"2024-05-15",icon:"fa fa-puzzle-piece",path:"/notes/design-patterns",category:"java"},{id:"redis-basics",title:"Redis 基础入门",date:"2024-05-28",icon:"fa fa-database",path:"/notes/redis-basics",category:"database"}],jd={class:"h-screen w-screen overflow-hidden flex flex-col relative bg-[url('/wallpaper.jpg')] bg-cover bg-center"},Gd={class:"absolute top-0 left-0 bottom-10 w-full p-4 flex flex-col gap-4 flex-wrap content-start z-0"},Vd={class:"z-10 w-full h-full pointer-events-none"},$d={key:0,class:"fixed inset-0 bg-[#008080] z-[100] flex flex-col items-center justify-center gap-6 font-bold font-mono"},Wd=tt({__name:"App",setup(e){const t=wn(),n=ls(),r=Ye([{id:"welcome",title:"欢迎来到 YF 的 Blog.exe",icon:"fa fa-info-circle",isActive:!0}]);pn(()=>n.path,c=>{const d=[],g=r.value.find(b=>b.id==="welcome");if(g&&d.push({...g,isActive:!1}),c==="/computer")d.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!0});else if(c==="/all-notes")d.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!1}),d.push({id:"docs",title:"我的文档",icon:"fa fa-folder-open",isActive:!0});else if(c==="/categories")d.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!1}),d.push({id:"categories",title:"分类",icon:"fa fa-cog",isActive:!0});else if(c.startsWith("/notes/")){const b=n.params.id,N=Fr.find(P=>P.id===b),R=N?N.title:"Note";d.push({id:"docs",title:"我的文档",icon:"fa fa-folder-open",isActive:!1}),d.push({id:"note",title:R,icon:"fa fa-file-text-o",isActive:!0})}r.value=d},{immediate:!0});const s=c=>{c.startsWith("http")?window.open(c,"_blank"):t.push(c)},o=c=>{c==="computer"&&t.push("/computer"),c==="docs"&&t.push("/all-notes"),r.value.forEach(d=>d.isActive=d.id===c)},i=Ye(!1),l=()=>{i.value=!0},a=()=>{window.close(),window.location.href="about:blank"},p=c=>{alert(c)};return(c,d)=>{const g=zl("router-view");return pe(),Te("div",jd,[v("main",Gd,[de(Ft,{label:"我的电脑",iconClass:"fa fa-desktop",color:"text-white",onClick:d[0]||(d[0]=b=>s("/computer"))}),de(Ft,{label:"我的文档",iconClass:"fa fa-folder-open",color:"text-yellow-400",onClick:d[1]||(d[1]=b=>s("/all-notes"))}),de(Ft,{label:"控制面板",iconClass:"fa fa-cog",color:"text-pink-300",onClick:d[2]||(d[2]=b=>s("/categories"))}),de(Ft,{label:"Internet 浏览器",iconClass:"fa fa-globe",color:"text-blue-300",onClick:d[3]||(d[3]=b=>s("https://github.com"))}),de(Ft,{label:"记事本",iconClass:"fa fa-pencil-square-o",color:"text-white",onClick:d[4]||(d[4]=b=>s("/notes/hello-world"))}),de(Ft,{label:"回收站",iconClass:"fa fa-trash-o",color:"text-gray-400",onClick:d[5]||(d[5]=b=>p("回收站是空的。"))}),de(Ft,{label:"电子邮件",iconClass:"fa fa-envelope-o",color:"text-white",onClick:d[6]||(d[6]=b=>p("未配置邮件客户端。"))})]),v("div",Vd,[de(g,null,{default:Dt(({Component:b})=>[(pe(),St(Xl(b),{class:"pointer-events-auto"}))]),_:1})]),de(Ud,{openWindows:r.value,onActivateWindow:o,onNavigate:s,onShutdown:l},null,8,["openWindows"]),i.value?(pe(),Te("div",$d,[d[7]||(d[7]=_i('<div class="bg-[#c0c0c0] p-8 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] text-center border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"><div class="flex items-center gap-4 mb-4"><img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" class="w-12 h-12" alt="windows"><div><div class="text-xl text-black">Windows 98</div><div class="text-sm text-gray-600">正在关机...</div></div></div><hr class="border-t-[#808080] border-b-[#ffffff] mb-4"><div class="text-lg text-black">It is now safe to turn off your computer.</div><div class="text-xs text-gray-600 mt-1">(现在可以安全地关闭浏览器了)</div></div>',1)),v("button",{onClick:a,class:"px-6 py-2 bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-bold font-sans border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"}," 关闭页面 ")])):Nt("",!0)])}}}),Jd={class:"bg-navy px-1 py-1 flex justify-between items-center select-none"},Kd={class:"flex items-center gap-1 text-white font-bold text-sm"},qd={class:"flex gap-1"},Yd={class:"flex-1 bg-white shadow-win95-inset m-1 p-4 overflow-y-auto text-black min-h-0"},In=tt({__name:"Window",props:{title:{},icon:{},isOpen:{type:Boolean},isActive:{type:Boolean}},emits:["close","minimize","maximize","focus"],setup(e,{emit:t}){const n=t;return(r,s)=>e.isOpen?(pe(),Te("div",{key:0,class:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-silver shadow-win95-outset p-1 flex flex-col max-h-[80vh]",onMousedown:s[3]||(s[3]=o=>n("focus"))},[v("div",Jd,[v("div",Kd,[e.icon?(pe(),Te("i",{key:0,class:$e(e.icon)},null,2)):Nt("",!0),v("span",null,Ke(e.title),1)]),v("div",qd,[v("button",{onClick:s[0]||(s[0]=mr(o=>n("minimize"),["stop"])),class:"w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1",title:"最小化"},"_"),v("button",{onClick:s[1]||(s[1]=mr(o=>n("maximize"),["stop"])),class:"w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1",title:"最大化"},"□"),v("button",{onClick:s[2]||(s[2]=mr(o=>n("close"),["stop"])),class:"w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1",title:"关闭"},"×")])]),s[4]||(s[4]=_i('<div class="flex px-1 py-1 text-sm select-none border-b border-gray-300 bg-silver"><div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">文</span>件(F)</div><div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">编</span>辑(E)</div><div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">查</span>看(V)</div><div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">帮</span>助(H)</div></div>',1)),v("div",Yd,[Ql(r.$slots,"default")]),s[5]||(s[5]=v("div",{class:"px-2 py-1 text-xs text-gray-600 border-t border-gray shadow-none flex justify-between bg-silver"},[v("span",null,"Ready"),v("span",null,"100%")],-1))],32)):Nt("",!0)}}),zd=tt({__name:"Desktop",setup(e){const t=Ye(!0),n=()=>{t.value=!1};return(r,s)=>t.value?(pe(),St(In,{key:0,title:"欢迎来到 YF 的 Blog.exe",icon:"fa fa-info-circle",isOpen:t.value,isActive:!0,onClose:n},{default:Dt(()=>[...s[0]||(s[0]=[v("div",{class:"flex flex-col items-center text-center gap-3"},[v("div",{class:"flex items-center gap-4"},[v("img",{src:"https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png",class:"w-16 h-16",alt:"computer"}),v("div",{class:"text-left"},[v("h1",{class:"text-xl font-bold text-[#000080]"},"YF's Blog"),v("p",{class:"text-xs text-gray-600"},"Version 2.0 · Windows 98 Edition")])]),v("hr",{class:"w-full border-t-[#808080] border-b-[#ffffff]"}),v("div",{class:"text-left w-full text-sm space-y-2"},[v("p",null,"👋 欢迎来到我的个人博客！"),v("p",null,[Ee("这是一个复刻 "),v("strong",null,"Windows 98"),Ee(" 风格的技术博客，记录了我的编程学习笔记和开发经验。")]),v("p",null,"你可以："),v("ul",{class:"list-disc ml-6 space-y-1"},[v("li",null,[Ee("点击桌面上的 "),v("strong",null,'"我的文档"'),Ee(" 图标查看所有文章")]),v("li",null,[Ee("通过 "),v("strong",null,'"控制面板"'),Ee(" 按分类浏览文章")]),v("li",null,[Ee("点击 "),v("strong",null,'"Internet 浏览器"'),Ee(" 访问 GitHub")]),v("li",null,[Ee("随时点击左下角 "),v("strong",null,'"开始"'),Ee(" 按钮打开菜单")])])]),v("hr",{class:"w-full border-t-[#808080] border-b-[#ffffff]"}),v("div",{class:"grid grid-cols-3 gap-4 w-full text-xs"},[v("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[v("div",{class:"font-bold text-lg text-[#000080]"},"12+"),v("div",{class:"text-gray-600"},"技术文章")]),v("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[v("div",{class:"font-bold text-lg text-[#000080]"},"6"),v("div",{class:"text-gray-600"},"分类方向")]),v("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[v("div",{class:"font-bold text-lg text-[#000080]"},"∞"),v("div",{class:"text-gray-600"},"持续更新")])]),v("p",{class:"text-[10px] text-gray-500 mt-2"},"© 2024 YF. All rights reserved. · Powered by Vue 3 + Vite")],-1)])]),_:1},8,["isOpen"])):Nt("",!0)}}),Xd={class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3"},Qd={class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},Zd={class:"grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 content-start"},ep=["onClick"],tp={class:"w-12 h-12 flex justify-center items-center text-[36px] text-gray-600 group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.15))"}},np={class:"text-[11px] text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white break-words w-full leading-tight rounded-sm"},rp={key:0,class:"text-center text-gray-500 py-8"},sp={class:"mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300"},op=tt({__name:"AllNotes",setup(e){const t=wn(),n=ls(),r=Ue(()=>n.query.category),s=Ue(()=>r.value?Fr.filter(a=>a.category===r.value):Fr),o=Ue(()=>r.value?`C:\\我的文档\\${r.value}\\`:"C:\\我的文档\\文章"),i=a=>{a.startsWith("http")?window.open(a,"_blank"):t.push(a)},l=()=>{r.value?t.push("/categories"):t.push("/computer")};return(a,p)=>(pe(),St(In,{title:"我的文档",icon:"fa fa-folder-open",isOpen:!0,isActive:!0,onClose:p[0]||(p[0]=c=>ut(t).push("/"))},{default:Dt(()=>[v("div",Xd,[p[3]||(p[3]=v("span",{class:"text-xs"},"地址(D)",-1)),v("div",Qd,[p[1]||(p[1]=v("i",{class:"fa fa-folder text-yellow-400"},null,-1)),Ee(" "+Ke(o.value),1)]),v("button",{onClick:l,class:"px-2 py-0.5 bg-silver shadow-win95-outset active:shadow-win95-inset text-xs flex items-center gap-1 win-btn",title:"向上"},[...p[2]||(p[2]=[v("i",{class:"fa fa-arrow-up"},null,-1),Ee(" 向上 ",-1)])])]),v("div",Zd,[(pe(!0),Te(ve,null,Zr(s.value,c=>(pe(),Te("div",{key:c.id,class:"flex flex-col items-center gap-1 cursor-pointer group w-[80px]",onClick:d=>i(c.path)},[v("div",tp,[v("i",{class:$e(c.icon)},null,2)]),v("span",np,Ke(c.title),1)],8,ep))),128))]),s.value.length===0?(pe(),Te("div",rp,[...p[4]||(p[4]=[v("i",{class:"fa fa-folder-open-o text-4xl mb-2 block"},null,-1),v("p",null,"此分类下暂无文章。",-1)])])):Nt("",!0),v("div",sp,Ke(s.value.length)+" 个对象 ",1)]),_:1}))}}),ip={class:"grid grid-cols-4 md:grid-cols-6 gap-4"},lp=["onClick"],ap={class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm"},cp={class:"mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300"},dp=tt({__name:"Categories",setup(e){const t=wn(),n=Ye([{id:"java",title:"Java",icon:"fa fa-coffee",color:"text-orange-500"},{id:"spring",title:"Spring",icon:"fa fa-leaf",color:"text-green-500"},{id:"database",title:"Database",icon:"fa fa-database",color:"text-blue-500"},{id:"frontend",title:"Frontend",icon:"fa fa-code",color:"text-pink-500"},{id:"devops",title:"DevOps",icon:"fa fa-server",color:"text-purple-500"}]),r=s=>{s.startsWith("http")?window.open(s,"_blank"):t.push(s)};return(s,o)=>(pe(),St(In,{title:"控制面板",icon:"fa fa-cog",isOpen:!0,isActive:!0,onClose:o[0]||(o[0]=i=>ut(t).push("/"))},{default:Dt(()=>[o[1]||(o[1]=v("div",{class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-2"},[v("span",{class:"text-xs"},"地址(D)"),v("div",{class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},[v("i",{class:"fa fa-folder-open text-yellow-400"}),Ee(" C:\\控制面板\\分类 ")])],-1)),v("div",ip,[(pe(!0),Te(ve,null,Zr(n.value,i=>(pe(),Te("div",{key:i.id,class:"flex flex-col items-center gap-1 cursor-pointer group w-20",onClick:l=>r("/all-notes?category="+i.id)},[v("div",{class:$e(["w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",i.color]),style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[v("i",{class:$e(i.icon)},null,2)],2),v("span",ap,Ke(i.title),1)],8,lp))),128))]),v("div",cp,Ke(n.value.length)+" 个分类 ",1)]),_:1}))}});var po=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function pp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Gi={exports:{}};(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var n=function(r){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,o=0,i={},l={manual:r.Prism&&r.Prism.manual,disableWorkerMessageHandler:r.Prism&&r.Prism.disableWorkerMessageHandler,util:{encode:function h(m){return m instanceof a?new a(m.type,h(m.content),m.alias):Array.isArray(m)?m.map(h):m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(h){return Object.prototype.toString.call(h).slice(8,-1)},objId:function(h){return h.__id||Object.defineProperty(h,"__id",{value:++o}),h.__id},clone:function h(m,y){y=y||{};var _,C;switch(l.util.type(m)){case"Object":if(C=l.util.objId(m),y[C])return y[C];_={},y[C]=_;for(var D in m)m.hasOwnProperty(D)&&(_[D]=h(m[D],y));return _;case"Array":return C=l.util.objId(m),y[C]?y[C]:(_=[],y[C]=_,m.forEach(function($,I){_[I]=h($,y)}),_);default:return m}},getLanguage:function(h){for(;h;){var m=s.exec(h.className);if(m)return m[1].toLowerCase();h=h.parentElement}return"none"},setLanguage:function(h,m){h.className=h.className.replace(RegExp(s,"gi"),""),h.classList.add("language-"+m)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(_){var h=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(_.stack)||[])[1];if(h){var m=document.getElementsByTagName("script");for(var y in m)if(m[y].src==h)return m[y]}return null}},isActive:function(h,m,y){for(var _="no-"+m;h;){var C=h.classList;if(C.contains(m))return!0;if(C.contains(_))return!1;h=h.parentElement}return!!y}},languages:{plain:i,plaintext:i,text:i,txt:i,extend:function(h,m){var y=l.util.clone(l.languages[h]);for(var _ in m)y[_]=m[_];return y},insertBefore:function(h,m,y,_){_=_||l.languages;var C=_[h],D={};for(var $ in C)if(C.hasOwnProperty($)){if($==m)for(var I in y)y.hasOwnProperty(I)&&(D[I]=y[I]);y.hasOwnProperty($)||(D[$]=C[$])}var G=_[h];return _[h]=D,l.languages.DFS(l.languages,function(Y,k){k===G&&Y!=h&&(this[Y]=D)}),D},DFS:function h(m,y,_,C){C=C||{};var D=l.util.objId;for(var $ in m)if(m.hasOwnProperty($)){y.call(m,$,m[$],_||$);var I=m[$],G=l.util.type(I);G==="Object"&&!C[D(I)]?(C[D(I)]=!0,h(I,y,null,C)):G==="Array"&&!C[D(I)]&&(C[D(I)]=!0,h(I,y,$,C))}}},plugins:{},highlightAll:function(h,m){l.highlightAllUnder(document,h,m)},highlightAllUnder:function(h,m,y){var _={callback:y,container:h,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};l.hooks.run("before-highlightall",_),_.elements=Array.prototype.slice.apply(_.container.querySelectorAll(_.selector)),l.hooks.run("before-all-elements-highlight",_);for(var C=0,D;D=_.elements[C++];)l.highlightElement(D,m===!0,_.callback)},highlightElement:function(h,m,y){var _=l.util.getLanguage(h),C=l.languages[_];l.util.setLanguage(h,_);var D=h.parentElement;D&&D.nodeName.toLowerCase()==="pre"&&l.util.setLanguage(D,_);var $=h.textContent,I={element:h,language:_,grammar:C,code:$};function G(k){I.highlightedCode=k,l.hooks.run("before-insert",I),I.element.innerHTML=I.highlightedCode,l.hooks.run("after-highlight",I),l.hooks.run("complete",I),y&&y.call(I.element)}if(l.hooks.run("before-sanity-check",I),D=I.element.parentElement,D&&D.nodeName.toLowerCase()==="pre"&&!D.hasAttribute("tabindex")&&D.setAttribute("tabindex","0"),!I.code){l.hooks.run("complete",I),y&&y.call(I.element);return}if(l.hooks.run("before-highlight",I),!I.grammar){G(l.util.encode(I.code));return}if(m&&r.Worker){var Y=new Worker(l.filename);Y.onmessage=function(k){G(k.data)},Y.postMessage(JSON.stringify({language:I.language,code:I.code,immediateClose:!0}))}else G(l.highlight(I.code,I.grammar,I.language))},highlight:function(h,m,y){var _={code:h,grammar:m,language:y};if(l.hooks.run("before-tokenize",_),!_.grammar)throw new Error('The language "'+_.language+'" has no grammar.');return _.tokens=l.tokenize(_.code,_.grammar),l.hooks.run("after-tokenize",_),a.stringify(l.util.encode(_.tokens),_.language)},tokenize:function(h,m){var y=m.rest;if(y){for(var _ in y)m[_]=y[_];delete m.rest}var C=new d;return g(C,C.head,h),c(h,C,m,C.head,0),N(C)},hooks:{all:{},add:function(h,m){var y=l.hooks.all;y[h]=y[h]||[],y[h].push(m)},run:function(h,m){var y=l.hooks.all[h];if(!(!y||!y.length))for(var _=0,C;C=y[_++];)C(m)}},Token:a};r.Prism=l;function a(h,m,y,_){this.type=h,this.content=m,this.alias=y,this.length=(_||"").length|0}a.stringify=function h(m,y){if(typeof m=="string")return m;if(Array.isArray(m)){var _="";return m.forEach(function(G){_+=h(G,y)}),_}var C={type:m.type,content:h(m.content,y),tag:"span",classes:["token",m.type],attributes:{},language:y},D=m.alias;D&&(Array.isArray(D)?Array.prototype.push.apply(C.classes,D):C.classes.push(D)),l.hooks.run("wrap",C);var $="";for(var I in C.attributes)$+=" "+I+'="'+(C.attributes[I]||"").replace(/"/g,"&quot;")+'"';return"<"+C.tag+' class="'+C.classes.join(" ")+'"'+$+">"+C.content+"</"+C.tag+">"};function p(h,m,y,_){h.lastIndex=m;var C=h.exec(y);if(C&&_&&C[1]){var D=C[1].length;C.index+=D,C[0]=C[0].slice(D)}return C}function c(h,m,y,_,C,D){for(var $ in y)if(!(!y.hasOwnProperty($)||!y[$])){var I=y[$];I=Array.isArray(I)?I:[I];for(var G=0;G<I.length;++G){if(D&&D.cause==$+","+G)return;var Y=I[G],k=Y.inside,Z=!!Y.lookbehind,he=!!Y.greedy,Ce=Y.alias;if(he&&!Y.pattern.global){var ue=Y.pattern.toString().match(/[imsuy]*$/)[0];Y.pattern=RegExp(Y.pattern.source,ue+"g")}for(var ee=Y.pattern||Y,K=_.next,me=C;K!==m.tail&&!(D&&me>=D.reach);me+=K.value.length,K=K.next){var we=K.value;if(m.length>h.length)return;if(!(we instanceof a)){var Ie=1,ie;if(he){if(ie=p(ee,me,h,Z),!ie||ie.index>=h.length)break;var ye=ie.index,_t=ie.index+ie[0].length,Oe=me;for(Oe+=K.value.length;ye>=Oe;)K=K.next,Oe+=K.value.length;if(Oe-=K.value.length,me=Oe,K.value instanceof a)continue;for(var je=K;je!==m.tail&&(Oe<_t||typeof je.value=="string");je=je.next)Ie++,Oe+=je.value.length;Ie--,we=h.slice(me,Oe),ie.index-=me}else if(ie=p(ee,0,we,Z),!ie)continue;var ye=ie.index,E=ie[0],U=we.slice(0,ye),M=we.slice(ye+E.length),j=me+we.length;D&&j>D.reach&&(D.reach=j);var X=K.prev;U&&(X=g(m,X,U),me+=U.length),b(m,X,Ie);var u=new a($,k?l.tokenize(E,k):E,Ce,E);if(K=g(m,X,u),M&&g(m,K,M),Ie>1){var f={cause:$+","+G,reach:j};c(h,m,y,K.prev,me,f),D&&f.reach>D.reach&&(D.reach=f.reach)}}}}}}function d(){var h={value:null,prev:null,next:null},m={value:null,prev:h,next:null};h.next=m,this.head=h,this.tail=m,this.length=0}function g(h,m,y){var _=m.next,C={value:y,prev:m,next:_};return m.next=C,_.prev=C,h.length++,C}function b(h,m,y){for(var _=m.next,C=0;C<y&&_!==h.tail;C++)_=_.next;m.next=_,_.prev=m,h.length-=C}function N(h){for(var m=[],y=h.head.next;y!==h.tail;)m.push(y.value),y=y.next;return m}if(!r.document)return r.addEventListener&&(l.disableWorkerMessageHandler||r.addEventListener("message",function(h){var m=JSON.parse(h.data),y=m.language,_=m.code,C=m.immediateClose;r.postMessage(l.highlight(_,l.languages[y],y)),C&&r.close()},!1)),l;var R=l.util.currentScript();R&&(l.filename=R.src,R.hasAttribute("data-manual")&&(l.manual=!0));function P(){l.manual||l.highlightAll()}if(!l.manual){var H=document.readyState;H==="loading"||H==="interactive"&&R&&R.defer?document.addEventListener("DOMContentLoaded",P):window.requestAnimationFrame?window.requestAnimationFrame(P):window.setTimeout(P,16)}return l}(t);e.exports&&(e.exports=n),typeof po<"u"&&(po.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",function(r){r.type==="entity"&&(r.attributes.title=r.content.replace(/&amp;/,"&"))}),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(s,o){var i={};i["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[o]},i.cdata=/^<!\[CDATA\[|\]\]>$/i;var l={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:i}};l["language-"+o]={pattern:/[\s\S]+/,inside:n.languages[o]};var a={};a[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:l},n.languages.insertBefore("markup","cdata",a)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(r,s){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+r+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:n.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,function(r){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;r.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},r.languages.css.atrule.inside.rest=r.languages.css;var o=r.languages.markup;o&&(o.tag.addInlined("style","css"),o.tag.addAttribute("style","css"))}(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,function(){if(typeof n>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var r="Loading…",s=function(R,P){return"✖ Error "+R+" while fetching file: "+P},o="✖ Error: File does not exist or is empty",i={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},l="data-src-status",a="loading",p="loaded",c="failed",d="pre[data-src]:not(["+l+'="'+p+'"]):not(['+l+'="'+a+'"])';function g(R,P,H){var h=new XMLHttpRequest;h.open("GET",R,!0),h.onreadystatechange=function(){h.readyState==4&&(h.status<400&&h.responseText?P(h.responseText):h.status>=400?H(s(h.status,h.statusText)):H(o))},h.send(null)}function b(R){var P=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(R||"");if(P){var H=Number(P[1]),h=P[2],m=P[3];return h?m?[H,Number(m)]:[H,void 0]:[H,H]}}n.hooks.add("before-highlightall",function(R){R.selector+=", "+d}),n.hooks.add("before-sanity-check",function(R){var P=R.element;if(P.matches(d)){R.code="",P.setAttribute(l,a);var H=P.appendChild(document.createElement("CODE"));H.textContent=r;var h=P.getAttribute("data-src"),m=R.language;if(m==="none"){var y=(/\.(\w+)$/.exec(h)||[,"none"])[1];m=i[y]||y}n.util.setLanguage(H,m),n.util.setLanguage(P,m);var _=n.plugins.autoloader;_&&_.loadLanguages(m),g(h,function(C){P.setAttribute(l,p);var D=b(P.getAttribute("data-range"));if(D){var $=C.split(/\r\n?|\n/g),I=D[0],G=D[1]==null?$.length:D[1];I<0&&(I+=$.length),I=Math.max(0,Math.min(I-1,$.length)),G<0&&(G+=$.length),G=Math.max(0,Math.min(G,$.length)),C=$.slice(I,G).join(`
`),P.hasAttribute("data-start")||P.setAttribute("data-start",String(I+1))}H.textContent=C,n.highlightElement(H)},function(C){P.setAttribute(l,c),H.textContent=C})}}),n.plugins.fileHighlight={highlight:function(P){for(var H=(P||document).querySelectorAll(d),h=0,m;m=H[h++];)n.highlightElement(m)}};var N=!1;n.fileHighlight=function(){N||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),N=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}}()})(Gi);var up=Gi.exports;const fp=pp(up);(function(e){var t=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,n=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,r={pattern:RegExp(/(^|[^\w.])/.source+n+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};e.languages.java=e.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[r,{pattern:RegExp(/(^|[^\w.])/.source+n+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:r.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+n+/[A-Z]\w*\b/.source),lookbehind:!0,inside:r.inside}],keyword:t,function:[e.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),e.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),e.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":r,keyword:t,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+n+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:r.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+n+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:r.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,function(){return t.source})),lookbehind:!0,inside:{punctuation:/\./}}})})(Prism);(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",n={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},r={bash:n,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:r},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:n}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:r},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:r.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:r.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},n.inside=e.languages.bash;for(var s=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],o=r.variable[1].inside,i=0;i<s.length;i++)o[s[i]]=e.languages.bash[s[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.sql={comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,lookbehind:!0},variable:[{pattern:/@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,greedy:!0},/@[\w.$]+/],string:{pattern:/(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,greedy:!0,lookbehind:!0},identifier:{pattern:/(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,greedy:!0,lookbehind:!0,inside:{punctuation:/^`|`$/}},function:/\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,keyword:/\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,boolean:/\b(?:FALSE|NULL|TRUE)\b/i,number:/\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,operator:/[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,punctuation:/[;[\]()`,.]/};const gp=["innerHTML"],hp=tt({__name:"NoteDetail",setup(e){const t=ls(),n=wn(),r=t.params.id,s=Ye("Note Detail"),o=Ye("<p>Loading...</p>"),i=()=>{r==="hello-world"?(s.value="Hello World",o.value=`	      <h1>Java 入门：从 Hello World 到理解 JVM 运行原理</h1>

	      <p>大家好！这是我的第一篇 Java 学习笔记。我相信每一位程序员的编程之路，都是从一行 <code>Hello, World!</code> 开始的。但你真的理解这短短几行代码背后发生了什么吗？今天我们不只写代码，更要<strong>理解代码</strong>——从环境搭建到编译原理，从 JVM 内存模型到字节码，一次性讲透。</p>

	      <h2>1. 为什么选择 Java？</h2>
	      <p>Java 诞生于 1995 年，近 30 年来始终稳居编程语言排行榜前三。它凭什么？</p>
	      <ul>
	          <li><strong>跨平台：</strong>"Write Once, Run Anywhere" 不是口号。Java 程序编译成字节码后在 JVM 上运行，只要装了对应平台的 JVM，同一份代码可以在 Windows、Linux、macOS 上无差别运行。这是它区别于 C/C++ 最大的优势。</li>
	          <li><strong>生态庞大：</strong>Spring 全家桶、Hadoop 大数据生态、Android 开发、企业级中间件——Java 的库和框架覆盖了几乎所有领域。你遇到的绝大多数问题，社区都已经有解决方案了。</li>
	          <li><strong>健壮安全：</strong>强类型检查、自动垃圾回收（GC）、完善的异常处理机制、安全管理器——这些让 Java 成为金融、电信等关键系统的首选语言。</li>
	          <li><strong>人才需求大：</strong>国内后端开发岗位中 Java 占比超过 60%，尤其是 Spring Boot + 微服务体系，就业面非常广。</li>
	      </ul>
	      <p>相比 C++，Java 去掉了指针和多继承这两个"劝退"概念；相比 Python，Java 的静态类型在大型项目中更容易维护和重构。如果你奔着后端开发去的，Java 绝对值得花时间深入。</p>

	      <h2>2. JDK、JRE、JVM：别再傻傻分不清</h2>
	      <p>这三个概念是 Java 面试的高频考点，也是一切的基础。用一句话概括它们的关系：<strong>JDK 包含 JRE，JRE 包含 JVM。</strong></p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">概念</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">全称</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">角色</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">核心组成</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>JVM</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Java Virtual Machine</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">执行引擎</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">类加载器、运行时数据区（堆/栈/方法区）、执行引擎、GC</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>JRE</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Java Runtime Environment</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">运行环境</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">JVM + 核心类库（rt.jar，包含 String、ArrayList 等基础类）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>JDK</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Java Development Kit</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">开发工具包</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">JRE + 开发工具（javac, java, jar, javadoc, jdb, jconsole 等）</td>
	          </tr>
	      </table>
	      <p>简单记忆：开发时装 JDK，部署时只装 JRE 就够了（但现在大多直接用 JDK，不差那点空间）。</p>

	      <h2>3. 选择合适的 JDK 版本</h2>
	      <p>Oracle JDK 从 Java 11 开始对商业用途收费，但社区有多个免费选择：</p>
	      <ul>
	          <li><strong>Eclipse Temurin (Adoptium)：</strong>社区维护，最流行的 OpenJDK 发行版，推荐个人开发者和中小企业首选。</li>
	          <li><strong>Amazon Corretto：</strong>AWS 维护，生产环境免费，自带长期安全补丁，云上部署首选。</li>
	          <li><strong>Oracle OpenJDK：</strong>Oracle 维护的开源版本，每半年一个大版本，仅最新版有安全更新。</li>
	          <li><strong>Azul Zulu：</strong>老牌 OpenJDK 构建，对嵌入式设备和 ARM 架构支持好。</li>
	      </ul>
	      <p><strong>版本怎么选？</strong>2024 年新项目直接上 <strong>Java 21 LTS</strong>（虚拟线程、模式匹配、Record 模式等重磅特性）。维护老项目用 Java 17 LTS。还在用 Java 8 的团队，官方免费更新已于 2019 年停止，能升则升——Spring Boot 3.x 已经要求 Java 17+ 了。</p>

	      <h2>4. 环境变量配置：为什么要配 PATH？</h2>
	      <p>很多新手照着教程一步步配环境变量，却不知道每步在干什么。简单理解：当你在命令行输入 <code>java</code> 并回车时，操作系统会去 <code>PATH</code> 环境变量里列出的所有目录中，按顺序找有没有叫 <code>java.exe</code>（Windows）或 <code>java</code>（Unix）的可执行文件。<strong>配置 PATH 的目的就是让系统在任何目录下都能找到 javac 和 java 这两个命令。</strong></p>
	      <p><strong>Windows 配置步骤：</strong></p>
	      <ol>
	          <li>下载并安装 JDK（推荐 Eclipse Temurin，安装过程一路 Next 即可，记住安装路径）。</li>
	          <li>打开"系统属性" → "高级" → "环境变量"。</li>
	          <li><strong>新建系统变量</strong>：变量名 <code>JAVA_HOME</code>，变量值是 JDK 安装路径（例如 <code>C:Program FilesEclipse Adoptiumjdk-21.0.2.13-hotspot</code>）。这步不是操作系统必需的，但 Maven、Gradle、Tomcat、IDE 等工具都会读取 <code>JAVA_HOME</code> 来定位 JDK，<strong>所以强烈建议配置</strong>。</li>
	          <li><strong>编辑 Path 变量</strong>：新增一条 <code>%JAVA_HOME%\bin</code>（注意不要删掉 Path 里已有的其他内容）。</li>
	          <li>打开<strong>新的</strong> CMD 窗口（旧的不会自动刷新环境变量），依次输入 <code>java -version</code> 和 <code>javac -version</code>，都正常显示版本号即配置成功。</li>
	      </ol>
	      <p><strong>常见坑：</strong>改完环境变量后一定要重新打开命令行窗口！如果还是提示"不是内部或外部命令"，检查 Path 里是否有拼写错误、是否有多余的分号或空格。实在不行，重启电脑是最稳妥的办法。</p>
	      <p><strong>Mac/Linux 用户</strong>在 <code>~/.zshrc</code>（Mac）或 <code>~/.bashrc</code>（Linux）中添加：</p>
	      <pre><code class="language-bash">export JAVA_HOME=$(/usr/libexec/java_home -v 21)  # Mac 取巧写法
export PATH=$JAVA_HOME/bin:$PATH</code></pre>
	      <p>执行 <code>source ~/.zshrc</code> 使其生效。</p>

	      <h2>5. 第一个程序：逐行拆解</h2>
	      <p>先上代码，再用"显微镜"看每一行：</p>
	      <pre><code class="language-java">// HelloWorld.java —— 文件名必须与 public class 名完全一致！
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>

	      <h3>逐行深度解析：</h3>
	      <ul>
	          <li><code>public class HelloWorld</code> —— <strong>public</strong> 表示这个类可以被任何其他类访问（一个 .java 文件最多只能有一个 public class）；<strong>class</strong> 是定义类的关键字；<strong>HelloWorld</strong> 是类名，Java 约定类名用大驼峰（PascalCase）。<strong>铁律：public 类的类名必须与文件名完全一致（大小写敏感）</strong>，否则编译器直接报错。</li>
	          <li><code>public static void main(String[] args)</code> —— 这是 Java 程序的<strong>入口方法签名</strong>，JVM 从这里开始执行。逐词拆解：
	              <ul>
	                  <li><code>public</code>：JVM 需要从类外部调用这个方法，所以必须是公开的。</li>
	                  <li><code>static</code>：JVM 还没创建 HelloWorld 的对象实例时就要调用它，所以必须是静态方法，属于类而不是对象。</li>
	                  <li><code>void</code>：main 方法执行完程序就结束了，不需要返回值给 JVM。</li>
	                  <li><code>main</code>：方法名，JVM 规定就叫 main，不能改。</li>
	                  <li><code>String[] args</code>：命令行参数数组。你在终端写 <code>java HelloWorld hello java world</code>，args 的值就是 <code>["hello", "java", "world"]</code>。</li>
	              </ul>
	          </li>
	          <li><code>System.out.println("Hello, World!")</code> —— 这一行看似简单，背后藏着三层调用：<code>System</code> 是 java.lang 包下的 final 类（自动导入，无需 import）；<code>out</code> 是 System 类的一个 public static final 的 PrintStream 成员变量；<code>println</code> 是 PrintStream 的方法。最终它通过 native 方法调用操作系统的标准输出流，把字符串送到控制台。</li>
	      </ul>

	      <h2>6. 编译与运行：从源码到屏幕，中间发生了什么？</h2>
	      <p>这是理解 Java 核心机制的关键。你执行两条命令，背后有一整套复杂流程：</p>
	      <pre><code class="language-bash">javac HelloWorld.java   # 编译：源码 → 字节码
java HelloWorld         # 运行：字节码 → 机器码 → 执行</code></pre>

	      <p><strong>编译阶段（javac）：</strong></p>
	      <ol>
	          <li><strong>词法分析：</strong>把源码字符流拆成一个个 token（关键字、标识符、字面量、运算符……）。</li>
	          <li><strong>语法分析：</strong>按 Java 语法规则检查 token 序列，构建抽象语法树（AST）。</li>
	          <li><strong>语义分析：</strong>检查类型是否匹配、变量是否先声明后使用、访问权限是否合法等。</li>
	          <li><strong>字节码生成：</strong>将 AST 转换为 <code>HelloWorld.class</code> 文件。这个文件不是机器码，而是 JVM 指令——一段与操作系统和 CPU 架构无关的中间代码。</li>
	      </ol>

	      <p><strong>运行阶段（java）：</strong></p>
	      <ol>
	          <li><strong>类加载：</strong>ClassLoader 根据类名找到 HelloWorld.class，读入 JVM 的方法区。</li>
	          <li><strong>字节码验证：</strong>检查 .class 文件的格式（魔数 CAFEBABE？）、字节码是否安全（没有非法跳转、栈溢出等）。</li>
	          <li><strong>解释执行 + JIT 编译：</strong>JVM 先把字节码逐条解释为机器码执行；发现热点代码（频繁执行的代码块）后，JIT（Just-In-Time）编译器把它直接编译成机器码并缓存——下次直接执行机器码，速度飞起。这就是 Java 被调侃"先慢后快"的原因。</li>
	          <li><strong>输出到控制台：</strong>println 最终通过 native 方法（JNI）调用操作系统 API，字符出现在你的终端上。</li>
	      </ol>

	      <p>想亲眼看看字节码长什么样？<strong>强烈推荐试一下这个命令：</strong></p>
	      <pre><code class="language-bash">javap -c -v HelloWorld.class   # -c 显示字节码指令，-v 显示详细信息</code></pre>
	      <p>你会看到 <code>aload_0</code>、<code>invokespecial #1</code>、<code>getstatic #2</code>、<code>ldc #3</code> 等 JVM 指令。这就是 Java "跨平台" 的终极秘密：不管底层是 x86 还是 ARM，是 Windows 还是 Linux，JVM 执行的始终是同一套字节码指令集。</p>

	      <h2>7. 常见新手错误速查表</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">错误信息</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">根本原因</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">解决办法</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>'javac' 不是内部或外部命令</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Path 环境变量没有 JDK 的 bin 目录</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">检查 Path 是否包含 <code>%JAVA_HOME%\bin</code>，重新打开 CMD</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>类 HelloWorld 是公共的，应在名为 HelloWorld.java 的文件中声明</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">文件名与 public class 名不一致（大小写也算）</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">确保两者完全一致，包括大小写</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>找不到或无法加载主类 HelloWorld</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">类名写错、或 .class 不在 classpath 中、或写了 .class 后缀</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">在 .class 所在目录执行 <code>java HelloWorld</code>（不加后缀）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>需要 ';'</code> / <code>需要 '{'</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Java 每条语句必须以分号结尾，代码块用花括号</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">找到报错行号，补上缺失的符号。IDE 会帮你标红。</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>java 和 javac 版本不一致</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">电脑上装了多个 JDK，Path 里顺序混乱</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">检查 Path 中 java 相关的条目，把想用的版本放在最前面</td>
	          </tr>
	      </table>

	      <h2>8. 从 Hello World 再往前一步</h2>
	      <ul>
	          <li><strong>包（package）：</strong>真实项目绝不会把类丢在默认包里。用 <code>package com.example.demo;</code> 声明包名，源文件也要放到对应的目录结构下（com/example/demo/HelloWorld.java）。包名 + 类名 = 全限定类名，这是 JVM 识别类的唯一标识。</li>
	          <li><strong>IDE 才是日常：</strong>用记事本写代码只是为了理解底层流程。实际开发请用 <strong>IntelliJ IDEA</strong>（社区版完全免费且功能足够）。它能自动导包、实时编译、智能提示、一键重构——效率是记事本的 10 倍以上。</li>
	          <li><strong>构建工具：</strong>单文件项目手动 javac 还行，一旦项目有几十上百个文件、几十个第三方依赖，就必须用 <strong>Maven</strong> 或 <strong>Gradle</strong> 来管理依赖和构建流程。Spring Boot 项目默认就带 Maven 配置。</li>
	          <li><strong>推荐的 JDK 自带工具：</strong>jps（查看 Java 进程）、jmap（查看堆内存）、jstack（查看线程栈）、jconsole（可视化监控）。这些是性能调优和排查问题的利器，知道它们的存在就行，后续深入。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>今天我们不仅写了一行 Java 代码，还深入理解了 <strong>JDK/JRE/JVM 的关系、编译运行的完整流程、字节码的概念、以及环境变量背后的原理</strong>。你可能觉得"Hello World 而已，至于讲这么多吗？"——但这些基础概念会在你未来的每一行代码中反复出现：当 ClassNotFoundException 报错时、当你理解 Maven 依赖冲突时、当面试官问你"Java 为什么能跨平台"时，你会发现今天的底层原理格外有用。</p>
	      <p>编程学习就像拼拼图——每一块看似零散的知识，最终都会连成一片完整的版图。<strong>不急不躁，把基础打牢，我们下一篇文章见。</strong></p>`):r==="idea-shortcuts"?(s.value="IDEA Shortcuts",o.value=`	      <h1>IntelliJ IDEA 高效开发：从快捷键到生产力飞跃</h1>

	      <p>IntelliJ IDEA 被绝大多数 Java 开发者评为"最好的 Java IDE"。但遗憾的是，很多同学只用了它 20% 的功能——敲代码、运行、调试，然后抱怨"电脑卡"。<strong>IDEA 真正的威力在于它帮你做的事情</strong>：智能补全、自动重构、一键导航、模板生成……今天我们不列清单，而是按<strong>实际开发场景</strong>来组织——你在写代码时遇到什么操作，对应的快捷键是什么。</p>

	      <h2>1. 为什么 IDEA 能成为 Java 开发的事实标准？</h2>
	      <p>简单对比一下市面上主流的 Java 开发工具：</p>
	      <ul>
	          <li><strong>Eclipse：</strong>免费、插件多，但界面老旧，索引速度慢，重构功能弱。老项目维护可能还会碰到。</li>
	          <li><strong>VS Code：</strong>轻量、前端开发王者，但 Java 支持靠插件堆砌，大型项目的智能提示和重构远不如 IDEA。</li>
	          <li><strong>IntelliJ IDEA：</strong>开箱即用的智能（Smart Code Completion 能根据上下文推断类型）、强大的重构引擎、与 Spring/Maven/Git 的深度集成。社区版免费且功能足够个人开发。</li>
	      </ul>
	      <p>简单说：<strong>写 Java，用 IDEA 就对了。</strong>接下来是核心——怎么用得高效。</p>

	      <h2>2. 场景一：写代码——别再一个个字母敲了</h2>
	      <p>这是日常最高频的操作。记住下面几个，写代码的速度能翻倍。</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">快捷键</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">功能</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">使用场景</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Space</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">基础代码补全</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">输入类名、方法名、变量名前几个字母，按它自动补全</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Shift + Space</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">智能类型补全</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">根据上下文预期的类型来过滤候选项，比如该传 List 的地方只显示 List 类型变量</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Alt + Enter</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">万能修复键</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">自动导包、创建不存在的方法、生成 try-catch、实现接口方法……看到灯泡就按它</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + L</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">格式化代码</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">代码写得歪歪扭扭？一键对齐缩进和换行</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + D</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">复制当前行</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">快速复制一行代码到下一行（不用 Ctrl+C Ctrl+V）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Y</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">删除当前行</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">删掉整行，不用鼠标选中</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Shift + ↑/↓</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">移动当前行</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">把一行代码整体上移或下移，比剪切粘贴快 10 倍</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Shift + U</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">切换大小写</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">选中一段文本，一键切换大小写</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>看到代码有问题（红线/黄线），鼠标移到上面看一眼提示，然后按 <code>Alt + Enter</code>，IDEA 通常已经帮你把解决方案列出来了。</p>

	      <h2>3. 场景二：找东西——项目大了怎么快速定位？</h2>
	      <p>当你接手一个几十万行的项目，最耗时的不是写代码，而是<strong>找到要改的代码在哪里</strong>。</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">快捷键</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">功能</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">使用场景</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Double Shift</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">万能搜索</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">搜类、文件、符号、Git 操作、设置……任何东西都能搜</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + N</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">搜索类</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">按类名搜索，支持驼峰匹配（搜 <code>UsSe</code> 匹配 <code>UserService</code>）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Shift + N</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">搜索文件</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">按文件名搜索，包括配置文件、前端文件等</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Shift + F</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">全局字符串搜索</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">在整个项目里搜关键字，比如搜一个 SQL 表名出现在哪</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + B</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">跳转到定义</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">鼠标按住 Ctrl 再点类/方法/变量，直接跳过去。这是最常用的导航键。</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + B</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">跳转到实现</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">在接口方法上按，列出所有实现类——看源码的必备技能</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Alt + F7</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">查找所有引用</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">想知道某个方法/变量在哪些地方被用到了？用这个。重构前必查。</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + ←/→</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">前进/后退</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">跳来跳去后回到刚才的位置，就像浏览器的前进后退按钮</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>养成习惯——不要用鼠标在项目树里翻文件，用 <code>Ctrl + N</code> 和 <code>Ctrl + Shift + N</code> 直接搜。</p>

	      <h2>4. 场景三：改代码——重构不止是改个名</h2>
	      <p>重构是日常开发的高频操作，但手动重构容易出错。IDEA 的重构引擎能<strong>自动更新所有引用</strong>，安全又高效。</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">快捷键</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">功能</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">使用场景</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Shift + F6</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">安全重命名</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">重命名变量/方法/类，IDEA 会自动更新项目中所有引用它的地方</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + V</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">提取变量</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">选中一个表达式，自动声明为变量并推断类型</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + M</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">提取方法</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">选中一段代码，抽成一个独立方法——"这个函数太长了"的解决方案</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + C</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">提取常量</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">把硬编码的数字或字符串抽成 <code>private static final</code> 常量</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Ctrl + Alt + O</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">优化导入</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">删除无用的 import，按规范重新排序。提交代码前必做。</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>重构不用怕——IDEA 的重构是基于 AST（抽象语法树）的，不是简单的文本替换。它不会把字符串里的同名文本也给改了。</p>

	      <h2>5. 场景四：调试——别只会用 System.out.println</h2>
	      <p>很多新手调试靠 <code>System.out.println</code> 打日志，效率极低。IDEA 的调试器要强大得多：</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">快捷键</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">功能</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">说明</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Shift + F9</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Debug 运行</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">以调试模式启动程序</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>F8</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Step Over</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">执行当前行，不进入方法内部</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>F7</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Step Into</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">进入当前行调用的方法内部</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Shift + F8</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Step Out</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">执行完当前方法并跳出到调用处</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>Alt + F8</code></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">表达式求值</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">断点处可以执行任意 Java 代码！比如执行 <code>list.size()</code>、修改变量值等</td>
	          </tr>
	      </table>
	      <p><strong>高玩技巧——条件断点：</strong>在断点上右键，设置条件（如 <code>i == 99</code>），只有满足条件时程序才会停住。在循环里排查某个特定迭代的问题时特别好用。</p>

	      <h2>6. 场景五：Live Templates —— 你敲几个字母，它写一段代码</h2>
	      <p>Live Template 是 IDEA 的代码模板系统，输入缩写 + Tab，自动展开为完整代码块。内置的常用模板：</p>
	      <pre><code class="language-java">psvm + Tab    →  public static void main(String[] args) {}
sout + Tab    →  System.out.println();
soutv + Tab   →  System.out.println("变量名 = " + 变量);  // 自动带上变量名
fori + Tab    →  for (int i = 0; i < ; i++) {}
iter + Tab    →  for (Object o : iterable) {}  // 增强 for 循环
ifn + Tab     →  if (var == null) {}
inn + Tab     →  if (var != null) {}</code></pre>
	      <p><strong>你还可以自定义模板！</strong>比如 Spring Boot 项目里经常写 <code>@Autowired</code> 和 <code>@RestController</code>，可以创建自己的缩写。进入 Settings → Editor → Live Templates，添加你的模板即可。</p>

	      <h2>7. 进阶技巧：少有人知但超实用的功能</h2>
	      <ul>
	          <li><strong>多光标编辑：</strong>按住 <code>Alt + Shift</code>，鼠标在多个位置点击，同时编辑多处——批量修改变量名的利器。</li>
	          <li><strong>列模式：</strong>按住 <code>Alt</code>，鼠标拖动选择矩形区域——处理列对齐的数据时超好用。</li>
	          <li><strong>最近文件：</strong><code>Ctrl + E</code> 弹出最近打开的文件列表——在几个文件之间反复横跳时比用鼠标点 tab 快。</li>
	          <li><strong>书签：</strong><code>F11</code> 在当前行打书签，<code>Ctrl + F11</code> 打带编号的书签，<code>Shift + F11</code> 查看所有书签——追踪关键代码位置。</li>
	          <li><strong>Postfix Completion：</strong>输入 <code>list.for</code> + Tab 自动生成 for 循环；<code>user.nn</code> + Tab 生成 if (user != null)；<code>name.sout</code> + Tab 生成 System.out.println(name)。这是比 Live Template 更自然的补全方式。</li>
	      </ul>

	      <h2>8. 性能优化：IDEA 卡怎么办？</h2>
	      <ul>
	          <li><strong>调大内存：</strong>Help → Edit Custom VM Options，把 <code>-Xmx</code> 调到 4096m 或更高（内存够的话）。</li>
	          <li><strong>排除不需要索引的目录：</strong>右键 node_modules、target、.git 等目录 → Mark Directory as → Excluded。</li>
	          <li><strong>关闭不需要的插件：</strong>Settings → Plugins，禁用你没用到的插件（每次启动都加载它们）。</li>
	          <li><strong>使用 SSD：</strong>把项目和 IDEA 的缓存目录放在固态硬盘上，效果立竿见影。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>IDEA 的学习曲线是阶梯式的：入门只需知道怎么运行和调试；进一步提升靠记住核心快捷键；真正高手则会把重构、模板、多光标这些组合起来用。<strong>不需要一次记住所有快捷键</strong>——把本文收藏起来，每次写代码时挑一两个刻意练习，两周后你会发现自己再也回不去了。</p>
	      <p>最后推荐一个 IDEA 插件：<strong>Key Promoter X</strong>，它会在你用鼠标操作时弹出提示"这个操作用快捷键 X 也能完成"。用上一个月，你会感谢它的。</p>`):r==="java-collections-framework"?(s.value="Java Collections",o.value=`	      <h1>Java 集合框架深度解析：从 ArrayList 到 HashMap 底层原理</h1>

	      <p>如果说 Java 基础语法是骨架，那集合框架就是血肉。实际开发中，你几乎不可能不跟集合打交道——从接口返回的 List 到缓存用的 Map，从去重用的 Set 到消息队列用的 Queue，<strong>选对集合类型，代码效率和可读性能提升一个档次；选错了，可能直接导致线上 OOM。</strong>今天我们从使用场景出发，把常用的集合类型和使用技巧一次讲清楚。</p>

	      <h2>1. 集合框架全景图</h2>
	      <p>Java 集合框架分为两大体系：</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">体系</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">顶层接口</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">核心特点</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">常用子接口</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Collection</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Collection&lt;E&gt;</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">单列数据集合</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">List（有序可重复）、Set（无序不重复）、Queue（队列）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Map</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Map&lt;K, V&gt;</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">键值对数据集合</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">HashMap、TreeMap、LinkedHashMap、ConcurrentHashMap</td>
	          </tr>
	      </table>
	      <p><strong>选型的核心决策树：</strong>需要键值对 → Map；只需要存值 → Collection；需要有序 + 可重复 → List；需要去重 → Set；需要先进先出 → Queue。</p>

	      <h2>2. List 家族：有序可重复的集合</h2>
	      <h3>ArrayList —— 你最常用的列表</h3>
	      <p><strong>底层数据结构：</strong>Object[] 动态数组。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>查询快（O(1)）：</strong>底层是数组，按索引访问直接定位内存地址。</li>
	          <li><strong>增删慢（O(n)）：</strong>在中间插入或删除元素时，需要把后面的所有元素整体移动。</li>
	          <li><strong>扩容机制：</strong>默认容量 10，每次扩容为原来的 1.5 倍（10 → 15 → 22 → 33...）。频繁扩容会涉及数组复制，影响性能。</li>
	      </ul>
	      <pre><code class="language-java">// 最佳实践：如果能预估大小，在构造时指定初始容量
List&lt;String&gt; list = new ArrayList&lt;&gt;(100);  // 避免频繁扩容

// 常用操作
list.add("Java");
list.add(0, "Python");          // 在索引 0 插入
String item = list.get(0);      // 按索引获取
list.remove(0);                  // 按索引删除
list.contains("Java");           // 判断是否包含（O(n)，需要遍历）</code></pre>

	      <h3>LinkedList —— 链表实现的列表</h3>
	      <p><strong>底层数据结构：</strong>双向链表。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>增删快（O(1)）：</strong>只需修改前后节点的指针。</li>
	          <li><strong>查询慢（O(n)）：</strong>需要从头或尾遍历到目标位置。</li>
	          <li><strong>额外实现了 Deque 接口：</strong>可以当队列或栈使用。<code>addFirst()</code>、<code>addLast()</code>、<code>pollFirst()</code>、<code>pollLast()</code>。</li>
	      </ul>
	      <p><strong>什么时候用 LinkedList？</strong>频繁在头部或中间插入/删除、且很少按索引随机访问时。实际开发中 ArrayList 用得更多，因为大多数场景是"追加 + 遍历"。</p>

	      <h3>ArrayList vs LinkedList 对比总结</h3>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">对比维度</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">ArrayList</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">LinkedList</th>
	          </tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">底层结构</td><td style="border: 1px solid #ccc; padding: 8px;">动态数组 Object[]</td><td style="border: 1px solid #ccc; padding: 8px;">双向链表 Node</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">随机访问</td><td style="border: 1px solid #ccc; padding: 8px;">O(1) 快</td><td style="border: 1px solid #ccc; padding: 8px;">O(n) 慢</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">头/尾插入</td><td style="border: 1px solid #ccc; padding: 8px;">尾部 O(1)，头部 O(n)</td><td style="border: 1px solid #ccc; padding: 8px;">头尾均 O(1)</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">中间插入</td><td style="border: 1px solid #ccc; padding: 8px;">O(n) 需移动元素</td><td style="border: 1px solid #ccc; padding: 8px;">O(n) 需要定位 + O(1) 修改指针</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">内存占用</td><td style="border: 1px solid #ccc; padding: 8px;">连续内存，仅存数据</td><td style="border: 1px solid #ccc; padding: 8px;">每个节点需额外存前驱/后继指针</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">适用场景</td><td style="border: 1px solid #ccc; padding: 8px;">日常开发首选，查询多</td><td style="border: 1px solid #ccc; padding: 8px;">频繁头部操作，或需要队列/栈功能</td></tr>
	      </table>

	      <h2>3. Set 家族：无序不重复的集合</h2>
	      <h3>HashSet —— 最常用的去重集合</h3>
	      <p><strong>底层：</strong>基于 HashMap 实现（元素存为 HashMap 的 Key，Value 是一个固定的 Object 占位符）。</p>
	      <p><strong>核心特性：</strong>无序、不允许重复、允许一个 null、增删查都是 O(1)。</p>
	      <p><strong>去重原理：</strong>HashSet 依赖 <code>hashCode()</code> 和 <code>equals()</code> 方法。先比较 hash 值，hash 相同再用 equals 判断。所以<strong>存入 HashSet 的对象必须正确重写 hashCode() 和 equals()</strong>。</p>
	      <pre><code class="language-java">Set&lt;String&gt; set = new HashSet&lt;&gt;();
set.add("Java");
set.add("Java");   // 重复，添加失败，返回 false
set.contains("Java");  // true

// 常用操作：去重
List&lt;String&gt; list = Arrays.asList("A", "B", "A", "C", "B");
Set&lt;String&gt; uniqueSet = new HashSet&lt;&gt;(list);  // 结果：["A", "B", "C"]（顺序不定）</code></pre>

	      <h3>TreeSet —— 需要排序的去重集合</h3>
	      <p><strong>底层：</strong>红黑树（TreeMap）。元素按<strong>自然顺序</strong>或指定的 Comparator 排序。增删查都是 O(log n)。</p>
	      <p><strong>适用场景：</strong>需要去重 + 排序时使用，比如"所有不重复的用户积分排名"。</p>

	      <h3>LinkedHashSet —— 保持插入顺序的去重集合</h3>
	      <p><strong>底层：</strong>HashSet + 双向链表维护插入顺序。<strong>遍历时按插入顺序输出</strong>，但查找仍然是 O(1)。</p>

	      <h2>4. Map 家族：键值对的王者</h2>
	      <h3>HashMap —— 面试必问，开发必用</h3>
	      <p><strong>底层数据结构（Java 8+）：</strong>数组 + 链表 + 红黑树。</p>
	      <ul>
	          <li>默认容量 16，负载因子 0.75（当元素数量达到容量的 75% 时触发扩容）。</li>
	          <li>扩容为原来的 2 倍，扩容时需要 rehash（重新计算每个元素的位置），开销较大。</li>
	          <li><strong>JDK 8 的重大优化：</strong>当链表长度超过 8 且数组长度达到 64 时，链表转为红黑树（查找从 O(n) 变成 O(log n)），解决了哈希碰撞严重时退化为链表的性能问题。</li>
	          <li><strong>线程不安全：</strong>多线程环境请用 ConcurrentHashMap。</li>
	      </ul>
	      <pre><code class="language-java">Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();

// 常用操作
map.put("apple", 3);
map.put("banana", 5);
map.get("apple");                // 3
map.getOrDefault("orange", 0);   // key 不存在时返回默认值 0
map.containsKey("apple");        // true

// 遍历 Map 的三种方式
// 1. 遍历 entrySet（推荐，一次获取 key 和 value）
for (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}

// 2. Java 8 Lambda（最简洁）
map.forEach((k, v) -> System.out.println(k + " -> " + v));

// 3. 只遍历 key 或 value
for (String key : map.keySet()) { ... }
for (Integer val : map.values()) { ... }</code></pre>

	      <h3>TreeMap —— 按 Key 排序的 Map</h3>
	      <p><strong>底层：</strong>红黑树。Key 按自然顺序或 Comparator 排序。如果 Key 是自定义对象，必须实现 Comparable 或传入 Comparator。</p>

	      <h3>LinkedHashMap —— 保持插入顺序的 Map</h3>
	      <p>继承自 HashMap，额外维护一个双向链表记录插入顺序。特别适合实现 LRU 缓存（构造函数里设 accessOrder=true，按访问顺序排序）。</p>

	      <h2>5. 遍历集合的正确姿势</h2>
	      <pre><code class="language-java">// 1. for-each（最常用，底层是迭代器）
for (String item : list) {
    System.out.println(item);
}

// 2. Java 8 Stream + Lambda（推荐用于过滤、转换等操作）
list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);

// 3. 普通 for 循环（需要索引时使用）
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}

// 4. Iterator（需要在遍历中安全删除元素时使用）
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    if (it.next().length() < 3) {
        it.remove();  // 安全删除！不要用 list.remove()
    }
}

// 5. Java 8 removeIf（最简洁的删除方式）
list.removeIf(s -> s.length() < 3);</code></pre>

	      <p><strong>常见错误：</strong>在 for-each 循环里直接调用 <code>list.remove()</code> 会抛出 <code>ConcurrentModificationException</code>。必须用迭代器的 <code>remove()</code> 方法或 <code>removeIf()</code>。</p>

	      <h2>6. 线程安全的集合</h2>
	      <ul>
	          <li><strong>ConcurrentHashMap：</strong>分段锁（JDK 7）→ CAS + synchronized（JDK 8），并发读写性能远超 Hashtable 和 Collections.synchronizedMap。</li>
	          <li><strong>CopyOnWriteArrayList：</strong>写时复制，适合"读多写少"的场景。每次写操作都会复制整个数组，所以写操作很昂贵。</li>
	          <li><strong>Collections.synchronizedXxx()：</strong>给集合套一层同步包装，所有方法加 synchronized，性能较差，不如用 JUC 包下的并发集合。</li>
	      </ul>

	      <h2>7. 集合选型速查表</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">你的需求</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">推荐集合</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">备选</th>
	          </tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">日常列表，查询多，追加多</td><td style="border: 1px solid #ccc; padding: 8px;">ArrayList</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">频繁头部插入删除</td><td style="border: 1px solid #ccc; padding: 8px;">LinkedList</td><td style="border: 1px solid #ccc; padding: 8px;">ArrayDeque</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">去重，不关心顺序</td><td style="border: 1px solid #ccc; padding: 8px;">HashSet</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">去重 + 排序</td><td style="border: 1px solid #ccc; padding: 8px;">TreeSet</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">去重 + 保持插入顺序</td><td style="border: 1px solid #ccc; padding: 8px;">LinkedHashSet</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">键值对，不关心顺序</td><td style="border: 1px solid #ccc; padding: 8px;">HashMap</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">键值对 + 按 Key 排序</td><td style="border: 1px solid #ccc; padding: 8px;">TreeMap</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">键值对 + 保持插入顺序</td><td style="border: 1px solid #ccc; padding: 8px;">LinkedHashMap</td><td style="border: 1px solid #ccc; padding: 8px;">-</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">多线程并发</td><td style="border: 1px solid #ccc; padding: 8px;">ConcurrentHashMap</td><td style="border: 1px solid #ccc; padding: 8px;">CopyOnWriteArrayList</td></tr>
	      </table>

	      <h2>小结</h2>
	      <p>集合框架是 Java 最常用的 API，掌握好它有三个层次：第一层是会 CRUD 操作；第二层是理解底层数据结构，能根据场景正确选型；第三层是理解扩容机制、线程安全问题，能写出高性能代码。<strong>大部分开发者停留在第一层，你至少要到第二层——选对集合，很多性能问题根本不会出现。</strong></p>`):r==="vue-migration"?(s.value="Vue Migration",o.value=`	      <h1>网站重构实战：从静态 HTML 到 Vue 3 + TypeScript 的现代化改造</h1>

	      <p>这个网站最初是用纯 HTML + CSS 搭建的静态页面——每个页面一个 .html 文件，公共头部和底部靠复制粘贴维护，交互全靠原生 JavaScript。当文章越来越多、功能越来越复杂后，<strong>静态站点的维护成本呈指数级上升</strong>。本文将完整记录我如何把这个网站重构为 Vue 3 + TypeScript + Vite 的现代化项目，希望对同样想升级技术栈的你有所启发。</p>

	      <h2>1. 为什么要重构？—— 静态站点的痛点</h2>
	      <p>先说说原来纯静态方案的具体问题，这些应该是很多个人网站的"通病"：</p>
	      <ul>
	          <li><strong>无法复用公共部分：</strong>导航栏、侧边栏、页脚每个页面都复制一份。改一个导航链接要手动改几十个 .html 文件。后来用 SSI（Server Side Includes）缓解了一些，但本地开发无法预览。</li>
	          <li><strong>JavaScript 散落各处：</strong>每个页面的 <code>&lt;script&gt;</code> 标签里写一段逻辑，全局变量满天飞，事件绑定混乱。随着交互增多（窗口系统、任务栏、文件管理器），代码越来越难以维护。</li>
	          <li><strong>CSS 全局污染：</strong>虽然是 Windows 98 风格的小站点，但样式文件越来越大后，改一个按钮样式可能影响其他页面的布局。</li>
	          <li><strong>没有构建流程：</strong>想用 ES6 语法得手动考虑浏览器兼容性，想压缩代码得手动跑工具，图片和字体没有统一管理。</li>
	      </ul>
	      <p>重构的目标很明确：<strong>组件化、可维护、可扩展，同时保留 Windows 98 的怀旧风格。</strong></p>

	      <h2>2. 技术选型：为什么是 Vue 3 + Vite + TypeScript？</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">技术</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">选择理由</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">对比</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Vue 3</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">学习曲线平缓，中文文档完善，Composition API 让逻辑复用更优雅</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">React: JSX 和 hooks 上手成本更高；Svelte: 生态还不够成熟</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Vite</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">开发服务器秒启动，HMR 极快，天然支持 TypeScript</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">Webpack: 配置繁琐，大型项目冷启动慢（Vite 利用浏览器原生 ES Module）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>TypeScript</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">类型安全，重构时有信心，IDE 智能提示更准确</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">纯 JS: 大型项目重构时容易遗漏，类型错误要到运行时才发现</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>TailwindCSS</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">原子化 CSS，不用想类名，写样式快</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">传统 CSS: 需要维护大量自定义类名和文件</td>
	          </tr>
	      </table>

	      <h2>3. 项目结构设计</h2>
	      <p>重构后的目录结构遵循 Vue 3 单文件组件的惯例，同时根据"Windows 98 桌面模拟器"的特殊需求做了定制：</p>
	      <pre><code class="language-bash">vue-project/
├── src/
│   ├── main.ts              # 入口：创建 app、注册路由、挂载
│   ├── App.vue               # 根组件：桌面背景 + 全局布局
│   ├── router/
│   │   └── index.ts          # vue-router 路由配置
│   ├── views/                # 页面级组件（每个"窗口"对应一个 view）
│   │   ├── Desktop.vue       # 桌面主页
│   │   ├── Computer.vue      # "我的电脑"——分类浏览
│   │   ├── AllNotes.vue      # "我的文档"——文章列表
│   │   ├── Categories.vue    # 文章分类页
│   │   └── NoteDetail.vue    # 文章详情页
│   ├── components/           # 可复用的 UI 组件
│   │   ├── Window.vue        # 通用窗口容器（标题栏 + 内容区）
│   │   ├── Taskbar.vue       # 底部任务栏（开始菜单 + 时钟）
│   │   └── DesktopIcon.vue   # 桌面图标
│   ├── data/
│   │   └── notes.ts          # 文章数据（标题、日期、分类、路径）
│   └── style.css             # 全局样式 + Windows 98 风格
├── index.html                # Vite 入口 HTML
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── package.json</code></pre>

	      <h2>4. 核心组件设计：Window.vue —— 一切皆窗口</h2>
	      <p>Windows 98 桌面模拟器的核心概念是<strong>"一切皆窗口"</strong>——文章列表是窗口，文章详情是窗口，设置是窗口，每个功能都运行在自己的窗口中。因此，<code>Window.vue</code> 是整个项目最重要的组件：</p>
	      <pre><code class="language-java">&lt;!-- Window.vue 的简化设计 --&gt;
&lt;script setup lang="ts"&gt;
defineProps&lt;{
  title: string;          // 窗口标题
  icon: string;           // 标题栏图标 class
  isOpen: boolean;        // 是否显示
  isActive: boolean;      // 是否当前活动窗口（影响标题栏颜色）
}&gt;();

const emit = defineEmits&lt;{
  close: [];
  minimize: [];
}&gt;();
&lt;/script&gt;</code></pre>
	      <p><strong>设计思路：</strong></p>
	      <ul>
	          <li><strong>Props 驱动：</strong>窗口的状态（标题、图标、是否打开、是否活动）全部通过 props 传入，组件自身不管理业务状态。这保证了 Window 组件的<strong>纯展示性</strong>——任何功能只要套上 Window，就有了 Windows 98 的窗口外观。</li>
	          <li><strong>事件上报：</strong>关闭和最小化操作通过 emit 通知父组件，由父组件（Desktop.vue）统一管理窗口的开关状态。</li>
	          <li><strong>插槽（Slot）：</strong>窗口内容区使用 <code>&lt;slot /&gt;</code>，这样每个页面可以自由填充内容——文章详情、列表、设置页等。</li>
	      </ul>

	      <h2>5. 路由设计：模拟操作系统的导航体验</h2>
	      <p>虽然是 SPA（单页应用），但为了模拟 Windows 的导航体验，路由设计做了一些"反常规"的选择：</p>
	      <pre><code class="language-java">const routes = [
  { path: '/', name: 'Desktop', component: Desktop },
  { path: '/computer', name: 'Computer', component: Computer },
  { path: '/categories', name: 'Categories', component: Categories },
  { path: '/all-notes', name: 'AllNotes', component: AllNotes },
  { path: '/notes/:id', name: 'NoteDetail', component: NoteDetail },
];</code></pre>
	      <ul>
	          <li><strong>桌面是根路径：</strong><code>/</code> 对应 Desktop.vue，这是用户进入网站看到的第一个画面——就像 Windows 开机后的桌面。</li>
	          <li><strong>文章详情用动态路由：</strong><code>/notes/:id</code> 通过 URL 参数定位到具体文章，方便分享链接（比如发给朋友一篇教程，URL 直接就是那篇文章）。</li>
	          <li><strong>分类筛选用 query 参数：</strong><code>/all-notes?category=java</code> 使用 query 而非路径参数，因为分类是筛选条件而不是资源定位——语义上更准确。</li>
	      </ul>

	      <h2>6. 数据管理：简单的集中式数据源</h2>
	      <p>目前项目规模不大，没有引入 Pinia 或 Vuex。所有文章数据集中定义在 <code>data/notes.ts</code> 中：</p>
	      <pre><code class="language-java">export interface Note {
  id: string;
  title: string;
  date: string;
  icon: string;
  path: string;
  category?: string;  // 可选分类：java | frontend | spring | database | devops
}

export const notes: Note[] = [
  { id: 'hello-world', title: 'Hello World', date: '2023-10-01',
    icon: 'fa fa-file-text-o', path: '/notes/hello-world', category: 'java' },
  // ... 更多文章
];</code></pre>
	      <p><strong>设计考量：</strong></p>
	      <ul>
	          <li><strong>当前方案：</strong>文章内容和元数据分开存储——元数据在 notes.ts（用于列表展示），HTML 内容直接在 NoteDetail.vue 中硬编码（用于详情页）。这样做的好处是简单直接，不需要数据库。</li>
	          <li><strong>未来演进方向：</strong>当文章数量超过 20 篇，考虑用 Markdown 文件存储文章内容，通过 Vite 的 <code>import.meta.glob</code> 动态加载。再往后可以考虑 Headless CMS。</li>
	      </ul>

	      <h2>7. Windows 98 风格实现</h2>
	      <p>保留怀旧风格是这次重构的重要目标。具体实现方式：</p>
	      <ul>
	          <li><strong>配色方案：</strong>经典 Win98 配色——银色按钮 <code>#C0C0C0</code>、海军蓝标题栏 <code>#000080</code>、灰色窗口背景 <code>#C0C0C0</code>、凹陷/凸起边框模拟 3D 效果。</li>
	          <li><strong>CSS 阴影技巧：</strong>使用 <code>box-shadow: inset 1px 1px #fff, inset -1px -1px #808080</code> 实现 Win98 经典的凹陷效果，<code>1px 1px #fff, -1px -1px #808080</code> 实现凸起效果。</li>
	          <li><strong>像素字体：</strong>使用系统默认的 sans-serif 字体，搭配 <code>font-smooth: never</code> 模拟低分辨率下的像素感（酌情使用）。</li>
	          <li><strong>响应式布局：</strong>虽然是桌面风格，但用 Flexbox 和 Grid 做了响应式适配，移动端也能正常使用（图标变小、网格列数自适应）。</li>
	      </ul>

	      <h2>8. 部署：GitHub Pages + GitHub Actions</h2>
	      <p>重构后的部署流程：</p>
	      <ol>
	          <li>本地执行 <code>npm run build</code>，Vite 将项目打包为静态文件到 <code>dist/</code> 目录。</li>
	          <li>通过 GitHub Actions，每次 push 到 main 分支自动触发构建和部署。</li>
	          <li>GitHub Pages 直接托管 <code>dist/</code> 目录的内容，绑定自定义域名后通过 HTTPS 访问。</li>
	      </ol>
	      <p>关键配置：<code>vite.config.ts</code> 中需要设置 <code>base: '/static-website/'</code>（或你的仓库名），否则 GitHub Pages 部署后路径会出错。</p>

	      <h2>9. 重构的得失与经验总结</h2>
	      <p><strong>做得好的地方：</strong></p>
	      <ul>
	          <li>组件拆分合理——Window、Taskbar、DesktopIcon 三个核心组件的边界清晰，新增功能页面只需写 View + 路由，无需改组件。</li>
	          <li>TypeScript 在定义 Note 接口和 props 类型时避免了大量低级错误。</li>
	          <li>保留了 Windows 98 风格的核心视觉特征，重构后外观和之前基本一致。</li>
	      </ul>
	      <p><strong>可以改进的地方：</strong></p>
	      <ul>
	          <li>文章内容是硬编码的 HTML 字符串——更新文章需要改 Vue 文件并重新部署，不够方便。后续应该迁移到 Markdown 或 CMS。</li>
	          <li>目前没有状态管理库——当窗口管理逻辑复杂到一定程度，需要引入 Pinia。</li>
	          <li>缺少单元测试——核心组件（Window、Taskbar）应该有基础的渲染测试。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>从静态 HTML 到 Vue 3 的迁移，本质上是一次<strong>"从手工作坊到工业化生产"</strong>的升级。组件化让你不用再复制粘贴 HTML，TypeScript 让你在重构时有底气，Vite 让开发体验从"等待"变成"即时"。如果你的个人网站也到了维护瓶颈期，强烈建议走一遍这个流程——<strong>边做边学，是最好的学习方式。</strong></p>
	      <p>启动开发服务器只需一行命令：</p>
	      <pre><code class="language-bash">cd vue-project
npm install    # 首次运行需安装依赖
npm run dev    # 启动开发服务器，浏览器自动打开 http://localhost:5173</code></pre>`):r==="spring-boot-guide"?(s.value="Spring Boot Guide",o.value=`	      <h1>Spring Boot 快速入门：从零搭建你的第一个 RESTful API</h1>

	      <p>如果说 Java 是企业级开发的标准语言，那 Spring Boot 就是 Java 企业开发的"标准起手式"。它解决了传统 Spring 项目配置繁琐、依赖管理混乱、部署复杂三大痛点，让你能用几分钟而不是几天来启动一个新项目。本文从实际开发角度出发，带你走完从项目创建到写出第一个 CRUD 接口的全流程。</p>

	      <h2>1. Spring Boot 解决了什么问题？</h2>
	      <p>在 Spring Boot 出现之前（大约 2014 年之前），搭建一个 Spring Web 项目有多痛苦？</p>
	      <ul>
	          <li>你需要手动配置 web.xml（Servlet 3.0 之后可以不用，但遗留项目大量存在）。</li>
	          <li>你需要手动管理几十个 Maven 依赖的版本兼容性（Spring Core、Spring MVC、Spring JDBC……版本不一致直接报错）。</li>
	          <li>你需要配置 DispatcherServlet、视图解析器、事务管理器、数据源……每一个都要写一大段 XML 或 Java Config。</li>
	          <li>部署时要打 WAR 包，放到 Tomcat 的 webapps 目录下，Tomcat 版本和项目里用到的 Servlet API 版本还得匹配。</li>
	      </ul>
	      <p>Spring Boot 做了一件革命性的事：<strong>"约定优于配置"（Convention over Configuration）</strong>。它通过 Starter 依赖统一管理版本、通过自动配置（Auto Configuration）按需装配 Bean、通过内嵌 Tomcat 让应用直接以 JAR 包运行。你只需关注业务代码。</p>

	      <h2>2. Spring Boot 的核心特性</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">特性</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">说明</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">解决了什么</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>起步依赖（Starter）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">一个 Starter 聚合一组相关依赖，如 <code>spring-boot-starter-web</code> 自动引入 Spring MVC + Jackson + Tomcat</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">依赖地狱</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>自动配置</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">根据 classpath 中的 jar 自动配置 Bean，如检测到 H2 数据库的 jar 就自动配好 DataSource</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">繁琐的手动配置</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>内嵌服务器</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">内嵌 Tomcat/Jetty/Undertow，打成一个 fat JAR 直接 <code>java -jar</code> 运行</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">部署 WAR 包 + 配置独立 Servlet 容器</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Actuator</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">生产就绪的监控端点：健康检查、指标、环境信息、线程 dump 等</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">线上问题排查困难</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>外部化配置</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">通过 application.yml / 环境变量 / 命令行参数覆盖配置，不同环境无需改代码</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">多环境配置管理</td>
	          </tr>
	      </table>

	      <h2>3. 创建你的第一个 Spring Boot 项目</h2>
	      <p>推荐两种方式：</p>
	      <ol>
	          <li><strong>Spring Initializr（在线生成）：</strong>打开 <code>start.spring.io</code>，选择 Maven、Java、Spring Boot 版本（选最新的稳定版），添加 <strong>Spring Web</strong> 和 <strong>Lombok</strong> 依赖，点击 Generate 下载 ZIP 包，解压后用 IDEA 打开。</li>
	          <li><strong>IDEA 内置创建：</strong>New Project → Spring Initializr → 勾选 Spring Web → 完成。IDEA 会直接生成并打开项目。</li>
	      </ol>
	      <p>生成后的项目结构：</p>
	      <pre><code class="language-bash">demo/
├── src/
│   ├── main/java/com/example/demo/
│   │   └── DemoApplication.java      # 启动类（有 @SpringBootApplication 注解）
│   └── main/resources/
│       ├── application.properties     # 配置文件
│       ├── static/                    # 静态资源（HTML, CSS, JS）
│       └── templates/                 # 模板文件（Thymeleaf 等）
├── pom.xml                            # Maven 配置（已自动引入父 POM 和 Starter）
└── mvnw / mvnw.cmd                    # Maven Wrapper（无需预装 Maven）</code></pre>
	      <p><strong>关键：</strong><code>DemoApplication.java</code> 上的 <code>@SpringBootApplication</code> 注解是一个组合注解，它等价于：<code>@SpringBootConfiguration</code> + <code>@EnableAutoConfiguration</code> + <code>@ComponentScan</code>。三合一，一个注解搞定配置。</p>

	      <h2>4. 编写第一个 REST API</h2>
	      <p>用三层架构创建用户管理的 CRUD 接口：</p>
	      <pre><code class="language-java">// UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 构造器注入（推荐，比 @Autowired 字段注入更容易测试）
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List&lt;User&gt; list() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(@RequestBody @Valid UserCreateRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}</code></pre>

	      <h3>关键注解解释：</h3>
	      <ul>
	          <li><code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>，表示这个类的每个方法返回值都直接序列化为 JSON 写入 HTTP 响应体。</li>
	          <li><code>@RequestMapping("/api/users")</code> 定义了这个 Controller 下所有接口的 URL 前缀。</li>
	          <li><code>@GetMapping</code>、<code>@PostMapping</code> 等是 <code>@RequestMapping(method = ...)</code> 的简写，语义更清晰。</li>
	          <li><code>@PathVariable</code> 从 URL 路径中提取参数（如 <code>/api/users/5</code> 中的 5）。</li>
	          <li><code>@RequestBody</code> 把 HTTP 请求体的 JSON 字符串自动反序列化为 Java 对象。</li>
	          <li><code>@Valid</code> 触发参数校验（需要配合 Jakarta Validation 注解如 <code>@NotBlank</code> 使用）。</li>
	          <li><code>@ResponseStatus(HttpStatus.CREATED)</code> 自定义 HTTP 响应状态码（默认 200，创建资源应返回 201）。</li>
	      </ul>

	      <h2>5. 全局异常处理：别再写 try-catch 了</h2>
	      <p>用 <code>@RestControllerAdvice</code> 统一处理异常，Controller 层代码会干净很多：</p>
	      <pre><code class="language-java">@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return new ErrorResponse(404, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return new ErrorResponse(400, msg);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleOther(Exception ex) {
        return new ErrorResponse(500, "服务器内部错误");
    }
}</code></pre>
	      <p>这样，Controller 里就不用写 try-catch 了——业务代码抛异常，全局异常处理器自动拦截并返回结构化的 JSON 错误响应。</p>

	      <h2>6. application.yml 核心配置项</h2>
	      <pre><code class="language-bash">server:
  port: 8080                          # 服务端口

spring:
  application:
    name: demo                        # 应用名（注册到注册中心时用）
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: \${DB_PASSWORD}          # 敏感信息用环境变量！
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate              # 生产用 validate，开发可用 update
    show-sql: true                    # 打印 SQL（开发环境开，生产关）

# Actuator 配置
management:
  endpoints:
    web:
      exposure:
        include: health,info          # 生产只暴露必要的端点</code></pre>
	      <p><strong>重要提醒：</strong>不要把数据库密码直接写在 application.yml 里提交到 Git！使用环境变量 <code>\${DB_PASSWORD}</code> 或 Spring Cloud Config 等配置中心。</p>

	      <h2>7. 运行与打包</h2>
	      <pre><code class="language-bash"># 开发模式运行（热重载，改代码自动重启）
mvn spring-boot:run

# 打包成可执行的 JAR 文件
mvn clean package -DskipTests

# 运行 JAR 包
java -jar target/demo-0.0.1-SNAPSHOT.jar

# 指定 profile（比如用生产环境配置）
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 覆盖配置项
java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=9090</code></pre>

	      <h2>8. Spring Boot 3.x 的重要变化</h2>
	      <ul>
	          <li><strong>最低 Java 17：</strong>Spring Boot 3.x 不再支持 Java 8 和 11。如果你在维护老项目，需要先升级 JDK。</li>
	          <li><strong>Jakarta EE 替换 Java EE：</strong>所有 <code>javax.*</code> 包名改为 <code>jakarta.*</code>（如 <code>javax.servlet</code> → <code>jakarta.servlet</code>）。这是最大的迁移成本。</li>
	          <li><strong>GraalVM 原生镜像支持：</strong>可以将 Spring Boot 应用编译为原生可执行文件，启动时间从秒级降到毫秒级，适合 Serverless 场景。</li>
	          <li><strong>虚拟线程支持（Java 21 + Spring Boot 3.2+）：</strong>开启 <code>spring.threads.virtual.enabled=true</code> 即可使用虚拟线程处理 HTTP 请求。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>Spring Boot 的精髓在三个词：<strong>简化、约定、自动</strong>。它把 Spring 生态的复杂性封装成一套开箱即用的框架，让你能把精力集中在业务逻辑上而不是配置上。本文覆盖了开发中最常用的场景——REST 接口、参数校验、异常处理、配置管理。掌握了这些，你已经能独立完成 80% 的后端 CRUD 需求了。</p>
	      <p>接下来值得深入的方向：Spring Security（认证授权）、Spring Data JPA（持久层）、Spring Cloud（微服务）、以及自动化测试（单元测试 + 集成测试）。</p>`):r==="mysql-basics"?(s.value="MySQL Basics",o.value=`	      <h1>MySQL 从入门到高效使用：SQL 语法、设计规范与性能优化</h1>

	      <p>MySQL 是目前最流行的开源关系型数据库。从个人博客到大型电商，从日志存储到数据分析，MySQL 几乎无处不在。但会用 SQL 和用好 MySQL 是两回事——本文从基础语法讲起，延伸到表设计规范和常见的性能优化技巧，帮你从一个"会写增删改查"的开发者成长为"知道怎么写更高效"的工程师。</p>

	      <h2>1. 关系型数据库核心概念</h2>
	      <p>在写 SQL 之前，先搞清楚几个基本概念。这些词在面试和工作中会反复出现：</p>
	      <ul>
	          <li><strong>数据库（Database）：</strong>一个 MySQL 实例下可以有多个数据库，每个数据库是一个独立的命名空间。类似一个 Excel 文件。</li>
	          <li><strong>表（Table）：</strong>数据库里的"数据表"，由行和列组成。类似 Excel 里的一个 Sheet。</li>
	          <li><strong>行（Row）/ 记录（Record）：</strong>表中的一条数据。</li>
	          <li><strong>列（Column）/ 字段（Field）：</strong>表中的一个属性，如 username、age。</li>
	          <li><strong>主键（Primary Key）：</strong>唯一标识表中每一行的列。一张表只能有一个主键，通常用自增 ID。</li>
	          <li><strong>外键（Foreign Key）：</strong>用于关联两张表，保证引用完整性。实际开发中很多团队选择不用物理外键，而是在应用层维护关联关系（为了性能和灵活性）。</li>
	          <li><strong>索引（Index）：</strong>加速查询的数据结构，类似书的目录。没有索引的查询需要全表扫描，数据量一大就慢得要命。</li>
	      </ul>

	      <h2>2. 数据库与表的基本操作</h2>
	      <pre><code class="language-sql">-- 创建数据库，指定字符集
CREATE DATABASE mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 切换数据库
USE mydb;

-- 删除数据库（慎用！生产环境这条命令基本是禁止的）
DROP DATABASE IF EXISTS mydb;</code></pre>

	      <p><strong>字符集为什么选 utf8mb4？</strong>MySQL 的 utf8 最多只能用 3 个字节，存不了 Emoji 表情（😂）和部分生僻汉字。utf8mb4 用 4 个字节，是真正的 UTF-8 完整实现。<strong>新项目一律用 utf8mb4。</strong></p>

	      <h2>3. 表设计与数据类型选择</h2>
	      <p>建表时选对数据类型，直接影响存储空间和查询性能：</p>
	      <pre><code class="language-sql">CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username    VARCHAR(50)  NOT NULL UNIQUE COMMENT '用户名',
    email       VARCHAR(100) NOT NULL COMMENT '邮箱',
    age         TINYINT UNSIGNED COMMENT '年龄（0-255，无符号）',
    balance     DECIMAL(10, 2) DEFAULT 0.00 COMMENT '余额（定点数，不要用FLOAT）',
    status      ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '状态',
    bio         TEXT COMMENT '个人简介',
    avatar_url  VARCHAR(500) COMMENT '头像URL',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';</code></pre>

	      <h3>常见数据类型选择指南：</h3>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">场景</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">推荐类型</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">原因</th>
	          </tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">主键/ID</td><td style="border: 1px solid #ccc; padding: 8px;"><code>BIGINT AUTO_INCREMENT</code></td><td style="border: 1px solid #ccc; padding: 8px;">INT 最大 21 亿，高并发场景可能不够</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">金额/价格</td><td style="border: 1px solid #ccc; padding: 8px;"><code>DECIMAL(M, D)</code></td><td style="border: 1px solid #ccc; padding: 8px;">FLOAT/DOUBLE 有精度丢失，金额计算会出错</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">长文本</td><td style="border: 1px solid #ccc; padding: 8px;"><code>TEXT / MEDIUMTEXT</code></td><td style="border: 1px solid #ccc; padding: 8px;">VARCHAR 最多 65535 字节</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">状态/类型</td><td style="border: 1px solid #ccc; padding: 8px;"><code>TINYINT</code> 或 <code>VARCHAR(20)</code></td><td style="border: 1px solid #ccc; padding: 8px;">ENUM 修改需要 ALTER TABLE，生产环境很麻烦</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">时间</td><td style="border: 1px solid #ccc; padding: 8px;"><code>TIMESTAMP</code></td><td style="border: 1px solid #ccc; padding: 8px;">自动处理时区转换（DATETIME 不处理）</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;">布尔值</td><td style="border: 1px solid #ccc; padding: 8px;"><code>TINYINT(1)</code></td><td style="border: 1px solid #ccc; padding: 8px;">MySQL 没有真正的 BOOLEAN 类型</td></tr>
	      </table>

	      <h2>4. CRUD 进阶：不止是简单的 SELECT</h2>
	      <pre><code class="language-sql">-- ====== 查询 ======
-- 基本查询 + 条件过滤 + 排序 + 分页
SELECT id, username, email
FROM users
WHERE status = 'active'
  AND created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;     -- 跳过 20 条，取 10 条（第 3 页）

-- 聚合查询：统计 + 分组
SELECT status, COUNT(*) AS cnt, AVG(age) AS avg_age
FROM users
GROUP BY status
HAVING cnt > 5;          -- 对分组结果过滤（不用 WHERE，WHERE 在 GROUP BY 之前过滤行）

-- 多表关联查询
SELECT u.username, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'paid';

-- 子查询
SELECT username
FROM users
WHERE id IN (
    SELECT DISTINCT user_id FROM orders WHERE amount > 1000
);

-- ====== 插入 ======
INSERT INTO users (username, email, age) VALUES
    ('alice', 'alice@example.com', 25),
    ('bob', 'bob@example.com', 30);

-- 插入或更新（如果有唯一键冲突则更新）
INSERT INTO users (username, email, age) VALUES ('alice', 'new_email@example.com', 26)
ON DUPLICATE KEY UPDATE email = VALUES(email), age = VALUES(age);

-- ====== 更新（生产环境 update 必须带 WHERE！）======
UPDATE users
SET status = 'inactive', updated_at = NOW()
WHERE id = 1;

-- ====== 删除（软删除——推荐做法）======
-- 不要用 DELETE！加一个 is_deleted 字段标记为已删除
UPDATE users SET is_deleted = 1, deleted_at = NOW() WHERE id = 1;</code></pre>
	      <p><strong>核心要点：</strong></p>
	      <ul>
	          <li><strong>SELECT * 别乱用：</strong>只查需要的字段，减少网络传输和内存占用。尤其在表有 TEXT 等大字段时。</li>
	          <li><strong>LIMIT 必须配合 ORDER BY：</strong>没有 ORDER BY 的 LIMIT 返回顺序是不确定的。</li>
	          <li><strong>软删除优于硬删除：</strong>数据是资产，用 <code>is_deleted</code> 字段标记删除而非真正 DELETE，方便数据恢复和审计。</li>
	      </ul>

	      <h2>5. 索引：查询快的核心秘诀</h2>
	      <p><strong>索引是什么？</strong>类比书的目录——没有目录你要一页页翻找内容（全表扫描），有了目录可以直接定位（索引查找）。</p>
	      <p><strong>MySQL 常用索引类型：</strong></p>
	      <ul>
	          <li><strong>B+ Tree 索引（默认）：</strong>InnoDB 的默认索引结构，适合范围查询和排序。所有数据都存在 B+ Tree 的叶子节点中。</li>
	          <li><strong>唯一索引（UNIQUE）：</strong>索引列的值必须唯一，但允许 NULL（可以有多个 NULL）。</li>
	          <li><strong>联合索引：</strong>多列组合成一个索引。<strong>最重要的原则：最左前缀匹配。</strong>比如联合索引 (a, b, c)，查询条件只用 b 时<strong>不会</strong>命中该索引。</li>
	          <li><strong>全文索引（FULLTEXT）：</strong>用于文本搜索，InnoDB 从 MySQL 5.6 开始支持。</li>
	      </ul>
	      <pre><code class="language-sql">-- 创建索引
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_username_email ON users(username, email);  -- 联合索引
CREATE UNIQUE INDEX uk_email ON users(email);                -- 唯一索引

-- 查看查询是否用到了索引
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- 关注 type 列：ALL（全表扫描，最差）→ index → range → ref → const（最好）
-- 关注 key 列：实际使用的索引名
-- 关注 rows 列：预估扫描行数</code></pre>

	      <h2>6. SQL 调优清单</h2>
	      <ol>
	          <li><strong>WHERE 条件里的列加索引：</strong>这是最有效的优化。但不要给每列都加索引——索引占空间，且写操作需要维护索引。</li>
	          <li><strong>避免在 WHERE 中对列做函数操作：</strong><code>WHERE DATE(created_at) = '2024-01-01'</code> 不走索引，应改为 <code>WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02'</code>。</li>
	          <li><strong>LIKE 前缀模糊走不了索引：</strong><code>LIKE '%keyword%'</code> 或 <code>LIKE '%keyword'</code> 不走索引，<code>LIKE 'keyword%'</code> 可以走。</li>
	          <li><strong>用 JOIN 替代子查询（很多时候）：</strong>MySQL 的查询优化器对 JOIN 的优化比子查询好。</li>
	          <li><strong>大表分页优化：</strong><code>LIMIT 100000, 10</code> 会扫描前 100010 行再扔掉前 100000 行，非常慢。用"延迟关联"或"游标分页"替代。</li>
	      </ol>

	      <h2>7. InnoDB 存储引擎——你需要知道的</h2>
	      <p>MySQL 的默认存储引擎是 InnoDB，它提供了几个关键特性：</p>
	      <ul>
	          <li><strong>事务（ACID）：</strong>支持事务，通过 MVCC（多版本并发控制）实现高并发下的读不阻塞写。</li>
	          <li><strong>行级锁：</strong>相比 MyISAM 的表级锁，并发性能大幅提升。</li>
	          <li><strong>外键约束：</strong>支持外键（虽然很多团队选择不用）。</li>
	          <li><strong>崩溃恢复：</strong>通过 redo log（重做日志）保证事务的持久性，即使数据库崩溃也能恢复已提交的事务。</li>
	      </ul>
	      <p><strong>关于事务隔离级别：</strong>InnoDB 默认是 <code>REPEATABLE READ</code>（可重复读），通过 Next-Key Lock 在一定程度上避免了幻读问题。</p>

	      <h2>小结</h2>
	      <p>MySQL 这门技术，入门容易精通难。本文覆盖了从 SQL 语法到表设计规范再到索引优化的核心知识。如果你只能记住三点，请记住：<strong>① 字符集用 utf8mb4；② 金额用 DECIMAL；③ WHERE 条件里的列要建索引。</strong>这三点做到了，至少能避免 80% 的初级错误。</p>
	      <p>下一步推荐学习的方向：慢查询日志分析（<code>slow_query_log</code>）、EXPLAIN 执行计划详解、分库分表方案（ShardingSphere）、以及 MySQL 8.0 的新特性（窗口函数、CTE 递归查询等）。</p>`):r==="git-basics"?(s.value="Git 常用命令",o.value=`	      <h1>Git 从入门到团队协作：常用命令、工作流与踩坑指南</h1>

	      <p>Git 是目前最流行的分布式版本控制系统。不管你是一个人写 side project 还是和团队协同开发，Git 都是每天必用的工具。但 Git 的命令繁多、概念抽象，很多新手"只会 add、commit、push，遇到冲突就慌了"。本文从日常开发的实际场景出发，把 Git 的核心概念、高频命令、团队协作工作流和常见踩坑场景一次性讲清楚。</p>

	      <h2>1. Git 的核心概念：先搞懂这几个词</h2>
	      <p>Git 最难的地方不是命令多，而是<strong>概念抽象</strong>——如果不理解下面这几个词，遇到问题你就只能靠百度瞎试：</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">概念</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">解释</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">类比</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>工作区（Working Directory）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">你电脑上能看到的项目文件夹</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">你的办公桌</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>暂存区（Staging Area）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">通过 <code>git add</code> 把修改加入暂存区，等待提交</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">你把要交的文件整理放在一个文件夹里</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>本地仓库（Local Repository）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;"><code>git commit</code> 后修改进入本地仓库（.git 目录）</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">你把文件夹封存交给了档案室</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>远程仓库（Remote Repository）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">GitHub / GitLab / Gitee 上的仓库</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">你把档案寄到了总部存档</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>HEAD</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">指向当前所在分支的最新提交</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">一个指针，指向你"现在"在哪</td>
	          </tr>
	      </table>
	      <p><strong>数据流转方向：</strong>工作区 → (git add) → 暂存区 → (git commit) → 本地仓库 → (git push) → 远程仓库。</p>

	      <h2>2. 基础配置与仓库初始化</h2>
	      <pre><code class="language-bash"># 首次使用 Git 必须配置（不配的话 Git 不让你 commit）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 推荐配置：改默认分支名为 main（GitHub 已默认用 main 而非 master）
git config --global init.defaultBranch main

# 推荐配置：设置别名（alias），省时间
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all --decorate"

# 创建仓库的两种方式
git init                              # 在现有项目中初始化 Git
git clone git@github.com:user/repo.git # 克隆远程仓库</code></pre>

	      <h2>3. 日常工作流：从写代码到推代码</h2>
	      <pre><code class="language-bash"># 1. 查看当前状态（最常用的命令，没有之一）
git status

# 2. 查看具体改了什么
git diff                    # 工作区 vs 暂存区
git diff --staged           # 暂存区 vs 本地仓库（即上次 commit）

# 3. 添加修改到暂存区
git add filename.txt        # 添加指定文件
git add .                   # 添加当前目录下所有修改
git add -p                  # 交互式暂存（一个文件里改了 10 行只想交 5 行时用）

# 4. 提交到本地仓库
git commit -m "feat: add user login feature"

# 5. 推送到远程仓库
git push origin main

# 6. 拉取远程更新
git pull origin main        # = git fetch + git merge（注意：可能产生合并提交）
git pull --rebase origin main  # = git fetch + git rebase（提交历史更干净，推荐）</code></pre>

	      <h2>4. 分支管理：并行开发的基石</h2>
	      <p><strong>分支是 Git 最强大的功能。</strong>它让你能在不影响主代码的情况下开发新功能、修复 Bug、做实验性改动。</p>
	      <pre><code class="language-bash"># 查看分支
git branch                  # 本地分支
git branch -r               # 远程分支
git branch -a               # 所有分支

# 创建分支
git branch feature-login    # 创建但不切换
git checkout -b feature-payment  # 创建并切换（最常用）
git switch -c feature-payment    # 新命令，功能同上（Git 2.23+）

# 切换分支
git checkout feature-login
git switch feature-login    # 新命令（推荐，语义更清晰）

# 合并分支
git checkout main
git merge feature-login     # 把 feature-login 合入 main

# 删除分支
git branch -d feature-login      # 安全删除（未合并的分支删不掉）
git branch -D feature-login      # 强制删除（放弃该分支的所有改动）

# 把本地新建的分支推送到远程
git push -u origin feature-login  # -u 设置上游，之后直接 git push 即可</code></pre>

	      <h2>5. 提交信息规范：别乱写 commit message</h2>
	      <p>好的 commit message 能让半年后的你也看得懂这次改了什么。推荐使用 <strong>Conventional Commits</strong> 规范：</p>
	      <pre><code class="language-bash"># 格式：type(scope): description
feat: add user registration API       # 新功能
fix: fix null pointer in login        # Bug 修复
docs: update README installation guide # 文档改动
refactor: extract auth logic to service # 重构
style: format code with prettier       # 格式调整
test: add unit tests for UserService   # 测试
chore: update dependency versions      # 杂务（构建、依赖等）

# 好的 commit message：
feat(user): add email verification on registration

# 不好的 commit message：
update
fix bug
改了点东西</code></pre>

	      <h2>6. 撤销与回退：出错了怎么办？</h2>
	      <p>这是新手最容易慌的场景。别怕，Git 几乎所有操作都有"后悔药"：</p>
	      <pre><code class="language-bash"># --- 场景一：改错了工作区的文件，想回到上次 commit 的状态 ---
git checkout -- filename.txt        # 丢弃单个文件的工作区修改
git restore filename.txt            # 新命令（Git 2.23+），等价于上面
git restore .                       # 丢弃所有工作区修改

# --- 场景二：git add 错了，想从暂存区撤回来 ---
git reset HEAD filename.txt         # 将文件从暂存区移回工作区（修改保留）
git restore --staged filename.txt   # 新命令

# --- 场景三：git commit 错了/不完整，想修改最后一次 commit ---
git commit --amend -m "新的提交信息"  # 修改最后一次 commit（注意：不要 amend 已 push 的 commit！）

# --- 场景四：想回到以前的某个版本 ---
git log --oneline                     # 先找到目标 commit 的 hash
git reset --soft HEAD~1              # 撤销 commit，修改保留在暂存区（最安全）
git reset --mixed HEAD~1             # 撤销 commit + add，修改保留在工作区（默认）
git reset --hard HEAD~1              # 彻底回到之前，丢弃所有修改（危险！不可逆！）

# --- 场景五：已经 push 了，想撤销 ---
git revert HEAD                       # 创建一个新 commit 来撤销上次 commit（安全，推荐）
# revert 不会改变历史，适合已经 push 的 commit
# reset 会修改历史，只能用于还没 push 的 commit</code></pre>

	      <h2>7. 解决冲突：合并时冲突了怎么办？</h2>
	      <p>当两个分支修改了同一个文件的同一行时，Git 无法自动决定保留哪个，就会产生冲突：</p>
	      <pre><code class="language-bash"># 冲突文件的标记：
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
你的改动
=======
别人的改动
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch

# 解决步骤：
# 1. 手动编辑文件，保留需要的代码，删除冲突标记（&lt;&lt;&lt; / === / &gt;&gt;&gt;）
# 2. git add 已解决的文件
# 3. git commit（不要加 -m，Git 会自动生成 merge commit 信息）
# 4. 如果 rebase 过程中冲突，解决后执行 git rebase --continue</code></pre>

	      <h2>8. 常用 Git 工作流</h2>
	      <ul>
	          <li><strong>Git Flow：</strong>main + develop + feature + release + hotfix 分支，适合有固定发布周期的团队。缺点是分支多、流程重。</li>
	          <li><strong>GitHub Flow：</strong>只有 main + feature 分支，feature 通过 PR 合入 main 后立即部署。适合持续部署的小团队或个人项目。</li>
	          <li><strong>GitLab Flow：</strong>在 GitHub Flow 基础上加入环境分支（如 staging、production），适合有多个部署环境的项目。</li>
	      </ul>
	      <p><strong>个人项目推荐 GitHub Flow，简单够用。</strong></p>

	      <h2>9. Git 实用技巧与常见问题</h2>
	      <pre><code class="language-bash"># 查看某行代码是谁写的（追责神器）
git blame filename.txt

# 暂存当前工作，切换到其他分支（工作区有未提交的修改时）
git stash                   # 暂存
git stash pop               # 恢复
git stash list              # 查看暂存列表

# 查看某次 commit 的详细改动
git show COMMIT_HASH

# 比较两个分支的差异
git diff branch1..branch2

# 把某个 commit 从一个分支"复制"到另一个分支
git cherry-pick COMMIT_HASH

# 合并多个 commit 为一个（整理提交历史）
git rebase -i HEAD~3        # 交互式 rebase 最近 3 个 commit</code></pre>

	      <h2>10. .gitignore 文件：千万别把不该传的传上去</h2>
	      <pre><code class="language-bash"># 每个项目必备的 .gitignore 模板
node_modules/          # 依赖目录
dist/                  # 构建产物
.env                   # 环境变量（含敏感信息！）
*.log                  # 日志文件
.idea/                 # IDEA 配置（可选：团队共享的放仓库，个人的忽略）
*.class                # Java 编译产物
target/                # Maven 构建目录
.DS_Store              # Mac 系统文件
Thumbs.db              # Windows 系统文件</code></pre>
	      <p><strong>重要提醒：</strong>.env 文件、数据库密码、API 密钥等<strong>绝对不能提交到 Git</strong>。一旦提交，即使在后续 commit 中删除，Git 历史里仍然能找到。如果不小心提交了敏感信息，需要重写 Git 历史（<code>git filter-branch</code> 或 BFG Repo-Cleaner），并在相关平台吊销已泄露的密钥。</p>

	      <h2>小结</h2>
	      <p>Git 的命令很多，但 80% 的时间你只需要：<strong>status、add、commit、push、pull、branch、checkout、merge</strong> 这 8 个命令。其余命令是"救火"用的——遇到问题时知道有对应解决方案就行，不必死记硬背。<strong>最好的学习方式是在真实项目中使用 Git</strong>，遇到冲突不要怕，这正是理解 Git 原理的好机会。</p>`):r==="docker-intro"?(s.value="Docker 入门指南",o.value=`	      <h1>Docker 容器化实战：从镜像构建到多容器编排</h1>

	      <p>"在我电脑上能跑啊"——这句话大概是软件开发史上最经典的甩锅台词。Docker 的出现就是为了解决这个根本问题：<strong>让应用在任何环境中以相同的方式运行</strong>。本文将带你从 Docker 的核心概念出发，逐步深入到编写 Dockerfile、使用 Docker Compose 编排多容器应用，以及生产环境的最佳实践。</p>

	      <h2>1. Docker 解决了什么问题？</h2>
	      <p>在没有 Docker 的时代（其实也就是 2013 年以前），部署一个 Java Web 应用大概是这样的：</p>
	      <ol>
	          <li>在服务器上安装 JDK（版本必须和开发环境一致）。</li>
	          <li>安装 Tomcat（版本也得一致）。</li>
	          <li>配置环境变量、JVM 参数。</li>
	          <li>把 WAR 包放到 Tomcat 的 webapps 目录。</li>
	          <li>如果服务器上是旧版 JDK → "在我电脑上能跑啊" → 开始排查。</li>
	          <li>如果依赖了某个系统库（比如 ImageMagick 处理图片）→ 服务器上没装 → 继续排查。</li>
	      </ol>
	      <p><strong>Docker 的做法：</strong>把应用 + JDK + Tomcat + 系统库 + 所有依赖<strong>全部打包进一个镜像</strong>。这个镜像在你电脑上跑是什么样，在服务器上跑就是什么样。没有"环境不一致"这回事。</p>

	      <h2>2. 核心概念：镜像、容器、仓库</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">概念</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">解释</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">类比</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>镜像（Image）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">一个只读模板，包含运行应用所需的一切（代码、运行时、库、配置）</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">一个虚拟机快照 / 一个安装盘 ISO</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>容器（Container）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">镜像的运行实例，可以启动、停止、删除。每个容器是相互隔离的。</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">从安装盘启动的一台正在运行的虚拟机</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Dockerfile</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">用来构建镜像的文本文件，包含一系列构建指令</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">一个说明书/配方</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>仓库（Registry）</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">存放和分发镜像的地方</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">应用商店（Docker Hub 就是最大的公共仓库）</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Docker Compose</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">定义和运行多容器应用的工具</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">管弦乐队的指挥</td>
	          </tr>
	      </table>

	      <h2>3. 常用 Docker 命令速查</h2>
	      <pre><code class="language-bash"># ====== 镜像操作 ======
docker images                              # 查看本地所有镜像
docker pull nginx:latest                   # 从 Docker Hub 拉取镜像
docker pull nginx:1.25-alpine              # 拉取特定版本（Alpine 版极小，只有约 5MB！）
docker rmi nginx:latest                    # 删除镜像
docker build -t myapp:1.0 .               # 从当前目录的 Dockerfile 构建镜像

# ====== 容器操作 ======
docker ps                                  # 查看运行中的容器
docker ps -a                               # 查看所有容器（包括已停止的）
docker run -d -p 8080:80 --name my-nginx nginx  # 运行容器
#     -d: 后台运行（detach）
#     -p 8080:80: 主机 8080 映射到容器的 80 端口
#     --name: 给容器取名
docker stop my-nginx                       # 停止容器
docker start my-nginx                      # 启动已停止的容器
docker restart my-nginx                    # 重启容器
docker rm my-nginx                         # 删除容器（必须先停止）
docker rm -f my-nginx                      # 强制删除（运行中的也直接删）
docker logs -f my-nginx                    # 查看容器日志（-f 实时跟踪）

# ====== 进入容器内部调试 ======
docker exec -it my-nginx /bin/bash         # 进入容器的 bash（Alpine 用 /bin/sh）

# ====== 清理 ======
docker system prune -a                     # 清理所有未使用的镜像、容器、网络、构建缓存</code></pre>

	      <h2>4. 编写高质量的 Dockerfile</h2>
	      <p>以 Spring Boot 应用为例，先看一个"能用但不够好"的版本，再看优化后的版本：</p>

	      <pre><code class="language-bash"># === 基础版（能用，但镜像比较大） ===
FROM openjdk:17
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

	      <pre><code class="language-bash"># === 优化版（利用多阶段构建，镜像更小更安全） ===
# 第一阶段：构建
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline       # 先下载依赖（利用 Docker 缓存层）
COPY src ./src
RUN mvn package -DskipTests

# 第二阶段：运行（只保留运行需要的）
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app   # 非 root 用户运行
USER app
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]</code></pre>

	      <h3>Dockerfile 最佳实践清单：</h3>
	      <ul>
	          <li><strong>多阶段构建：</strong>构建阶段用 Maven/Gradle 镜像（含 JDK + 构建工具），运行阶段只用 JRE 镜像。最终的运行镜像能瘦身 50% 以上。</li>
	          <li><strong>利用构建缓存：</strong>先 COPY 不常变的文件（如 pom.xml），再 COPY 源码。Docker 每一层有缓存，改源码不会触发重新下载依赖。</li>
	          <li><strong>用特定版本标签：</strong><code>FROM openjdk:17</code> 危险——你不知道具体是哪个小版本，且每次构建可能拉到不同版本。用 <code>FROM eclipse-temurin:21-jre-alpine</code>。</li>
	          <li><strong>非 root 用户运行：</strong>默认容器内是 root 用户，有安全风险。创建专用用户来运行应用。</li>
	          <li><strong>添加 HEALTHCHECK：</strong>告诉 Docker 如何判断容器是否健康，配合编排工具做自动恢复。</li>
	          <li><strong>使用 .dockerignore：</strong>类似 .gitignore，排除 node_modules、.git、target 等大目录，避免它们被 COPY 进镜像。</li>
	      </ul>

	      <h2>5. Docker Compose：编排多容器应用</h2>
	      <p>一个典型的 Web 应用通常需要：Web 服务 + 数据库 + 缓存 + 消息队列。Docker Compose 用一个 YAML 文件定义所有这些服务：</p>
	      <pre><code class="language-bash"># docker-compose.yml
version: '3.8'
services:
  # Spring Boot 应用
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/mydb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}  # 用环境变量，不写在文件里
      SPRING_REDIS_HOST: redis
    depends_on:
      db:
        condition: service_healthy   # 等 MySQL 健康检查通过再启动
      redis:
        condition: service_started
    restart: unless-stopped

  # MySQL 数据库
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}
      MYSQL_DATABASE: mydb
    volumes:
      - mysql_data:/var/lib/mysql    # 持久化数据
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  mysql_data:     # 命名卷，数据不会因容器删除而丢失
  redis_data:</code></pre>

	      <pre><code class="language-bash"># Docker Compose 常用命令
docker-compose up -d              # 启动所有服务（-d 后台）
docker-compose down               # 停止并删除所有服务
docker-compose down -v            # 同时删除数据卷（慎用！）
docker-compose logs -f app        # 查看 app 服务的日志
docker-compose restart app        # 重启单个服务
docker-compose ps                 # 查看所有服务状态</code></pre>

	      <h2>6. Docker 网络：容器之间怎么通信？</h2>
	      <p>Docker Compose 默认会创建一个 bridge 网络，所有服务加入同一个网络后，可以通过<strong>服务名</strong>互相访问。比如 app 容器里可以用 <code>jdbc:mysql://db:3306/mydb</code> 连接数据库，<code>db</code> 会被自动解析为 MySQL 容器的 IP。</p>
	      <p><strong>常见的网络模式：</strong></p>
	      <ul>
	          <li><strong>bridge（默认）：</strong>容器连接到一个虚拟网桥，各自有独立 IP，通过端口映射对外暴露。</li>
	          <li><strong>host：</strong>容器直接使用宿主机网络，性能最好但失去了网络隔离。</li>
	          <li><strong>none：</strong>容器没有网络，适合不需要网络的批处理任务。</li>
	      </ul>

	      <h2>7. 数据持久化：容器删了数据不能丢</h2>
	      <p>容器是无状态的——删除容器后，容器内的所有数据都会丢失。要保留数据，必须用<strong>数据卷（Volume）</strong>或<strong>绑定挂载（Bind Mount）</strong>：</p>
	      <ul>
	          <li><strong>Volume（推荐）：</strong>Docker 管理，存储在 <code>/var/lib/docker/volumes/</code>，与宿主机文件系统解耦。跨平台、可备份、可共享。</li>
	          <li><strong>Bind Mount：</strong>把宿主机的一个目录挂载到容器中。适合开发环境（改代码即时生效），但不适合生产。</li>
	      </ul>

	      <h2>8. 镜像瘦身技巧</h2>
	      <ul>
	          <li><strong>选 Alpine 版本的基础镜像：</strong><code>eclipse-temurin:21-jre-alpine</code> 比 <code>openjdk:17</code> 小几倍。</li>
	          <li><strong>合并 RUN 命令：</strong>每个 RUN 产生一个新层，合并后减少层数。用 <code>&&</code> 连接多个命令，最后 <code>rm -rf /var/cache/apk/*</code> 清理包管理器缓存。</li>
	          <li><strong>.dockerignore 排除无关文件：</strong>node_modules、.git、target、*.md 等构建时不需要的文件。</li>
	          <li><strong>多阶段构建：</strong>把编译和运行分开，最终的镜像只包含运行时依赖。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>Docker 是云原生时代的基石技术。<strong>学会 Docker，你的应用可以以相同的方式在任何地方运行</strong>——本地开发、测试环境、生产服务器、Kubernetes 集群。本文覆盖了日常开发中最常用的场景：从基础命令到 Dockerfile 编写，再到 Compose 多容器编排。掌握这些，你已经能应对 90% 的容器化需求。</p>
	      <p>下一步推荐学习：Docker 镜像优化和安全性（镜像扫描、签名）、Kubernetes 基础（Pod、Service、Deployment）、CI/CD 中的 Docker 集成（GitHub Actions + Docker Build）。</p>`):r==="linux-commands"?(s.value="Linux 基础命令",o.value=`	      <h1>Linux 基础命令速查：从文件操作到进程管理</h1>

	      <p>Linux 是服务器端的绝对王者——全球超过 96% 的服务器运行在 Linux 上。作为后端开发者或运维人员，<strong>在 Linux 服务器上排查问题是日常操作</strong>：查看日志、检查内存、杀掉卡死的进程、修改配置文件……这些操作都离不开命令行。本文按实际工作场景组织，每个命令都附有常用参数和实战示例。</p>

	      <h2>1. Linux 哲学：为什么后端开发者必须学 Linux？</h2>
	      <ul>
	          <li><strong>你的代码跑在 Linux 上：</strong>绝大多数生产服务器是 Linux。你不会 Linux，出问题就只能等运维帮忙。</li>
	          <li><strong>命令行效率远超 GUI：</strong>熟练后，在终端里完成文件操作、日志分析、进程管理的速度比鼠标操作快得多。</li>
	          <li><strong>面试必问：</strong>后端岗位几乎都会考察基本的 Linux 命令——ls、grep、top、chmod 这些是常识级别的问题。</li>
	          <li><strong>容器化时代更需要：</strong>Docker 容器内通常只有一个 shell，没有图形界面，一切操作都靠命令行。</li>
	      </ul>

	      <h2>2. 文件与目录操作——最基础也最重要</h2>
	      <pre><code class="language-bash"># 列出文件（最常用的命令，没有之一）
ls -la              # -l 详细列表，-a 显示隐藏文件
ls -lh              # -h 文件大小人类可读（1K, 234M, 2G 而不是字节数）
ls -lt              # -t 按修改时间排序
ls -ltr             # -r 反向排序（最旧的在最前面）

# 目录导航
cd /path/to/dir     # 切换到绝对路径
cd ..               # 上级目录
cd -                # 回到上一个目录（在 A 和 B 之间来回切换的神键）
cd ~                # 回到 home 目录

# 创建和删除
mkdir -p a/b/c      # -p 递归创建父目录（不用一层层建）
touch README.md     # 创建空文件 或 更新文件的修改时间
rm file.txt         # 删除文件
rm -rf directory/   # 递归强制删除目录（-r 递归，-f 不确认。慎用！）

# 复制和移动
cp source dest      # 复制文件
cp -r dir1 dir2     # 复制目录（-r 递归）
mv old.txt new.txt  # 移动/重命名（同一个命令，取决于目标是否是已有目录）</code></pre>

	      <h2>3. 文件查看与内容搜索——排查问题的核心技能</h2>
	      <pre><code class="language-bash"># 查看文件
cat file.txt        # 全部输出（文件大时别用，会刷屏）
less file.txt       # 分页查看（Space 翻页，/搜索，q 退出）
head -n 20 file.txt # 前 20 行
tail -n 50 file.txt # 后 50 行
tail -f app.log     # 实时追踪日志（排查线上问题的必备命令）

# 搜索文件内容（grep 是 Linux 最强大的文本搜索工具）
grep "ERROR" app.log                          # 搜索包含 ERROR 的行
grep -i "error" app.log                       # -i 忽略大小写
grep -n "ERROR" app.log                       # -n 显示行号
grep -r "TODO" ./src/                         # -r 递归搜索目录
grep -v "DEBUG" app.log                       # -v 反向匹配（排除 DEBUG 行）
grep -A 3 -B 2 "ERROR" app.log                # 匹配行前 2 行、后 3 行（看上下文）
grep -c "ERROR" app.log                       # -c 计数

# 组合技：用管道连接命令
grep "ERROR" app.log | tail -20               # 最近的 20 条错误
cat app.log | grep "ERROR" | wc -l            # 统计错误数量
find /var/log -name "*.log" -mtime -1 | xargs grep "ERROR"  # 搜索昨天的日志</code></pre>

	      <p><strong>管道（|）是 Linux 命令行的灵魂。</strong>它把前一个命令的输出作为后一个命令的输入，让你可以像搭乐高一样组合出强大的数据处理流程。</p>

	      <h2>4. 文件权限管理——安全的第一道防线</h2>
	      <p>Linux 的文件权限分三组：<strong>所有者（user）、所属组（group）、其他人（others）</strong>，每组有<strong>读（r=4）、写（w=2）、执行（x=1）</strong>三种权限。</p>
	      <pre><code class="language-bash"># 查看权限
ls -l filename
# 输出示例：-rwxr-xr--  1 alice dev  1024 May 20 10:00 script.sh
#         -  rwx  r-x  r--
#         类型 所有者 组  其他人
# 解读：所有者 alice 可读写执行，dev 组可读可执行，其他人只能读

# 修改权限
chmod 755 script.sh    # 数字模式：7=rwx, 5=r-x, 5=r-x
chmod u+x script.sh    # 符号模式：u(所有者)+x(执行权限)
chmod g-w file.txt     # 符号模式：g(组)-w(写权限)
chmod -R 755 dir/      # -R 递归修改整个目录

# 修改所有者
chown alice:dev file.txt          # 改为 alice 所有，dev 组
chown -R alice:dev /app/          # -R 递归</code></pre>

	      <h2>5. 进程管理——服务器卡了先看这里</h2>
	      <pre><code class="language-bash"># 查看进程
ps aux                  # 查看所有进程（BSD 风格）
ps aux | grep java      # 过滤出 Java 进程
ps -ef | grep nginx     # System V 风格（效果类似）

# 实时系统监控
top                     # 实时查看 CPU、内存、进程负载
# top 界面中常用快捷键：
#   shift+m: 按内存使用排序
#   shift+p: 按 CPU 使用排序
#   q: 退出
htop                    # top 的增强版（界面更友好，需要安装）

# 杀死进程
kill PID                # 优雅地结束进程（发送 SIGTERM 信号）
kill -9 PID             # 强制杀死（SIGKILL，进程无法捕获）
kill -15 PID            # 默认信号，同 kill PID
pkill -f "java -jar"    # 按进程名/命令行参数匹配并杀死

# 后台运行
nohup java -jar app.jar > app.log 2>&1 &   # 后台运行，关闭终端也不会停
# > app.log: 标准输出重定向到文件
# 2>&1: 标准错误也重定向到同一个文件
# &: 后台运行

# 查看端口占用
netstat -tlnp            # 查看所有监听的 TCP 端口
ss -tlnp                 # 更快的替代（推荐）
lsof -i :8080            # 查看 8080 端口被哪个进程占用</code></pre>

	      <h2>6. 磁盘与内存——服务器空间去哪了？</h2>
	      <pre><code class="language-bash"># 磁盘空间
df -h                    # 查看各分区的磁盘使用情况（-h 人类可读）
df -i                    # 查看 inode 使用情况（小文件太多也会占满）

# 目录大小
du -sh /var/log/         # 查看某个目录的总大小
du -sh *                 # 当前目录下每个子目录的大小
du -sh * | sort -hr      # 按大小降序排列（找到哪个目录最大）

# 内存使用
free -h                  # 查看内存和 swap 使用情况
free -h -s 1             # 每秒刷新一次

# 系统信息
uname -a                 # 内核版本、架构等
cat /etc/os-release      # 操作系统版本
uptime                   # 系统运行了多久 + 平均负载
lscpu                    # CPU 详细信息
lsblk                    # 磁盘和分区信息</code></pre>

	      <h2>7. 网络操作——服务通不通？</h2>
	      <pre><code class="language-bash"># 测试连通性
ping -c 4 baidu.com      # -c 4 只发 4 个包（Linux 不会自动停止）
ping -c 4 10.0.0.1       # 测试内网连通性

# 查看网络配置
ip addr                  # 查看 IP 地址（替代旧的 ifconfig）
ip route                 # 查看路由表

# DNS 查询
nslookup example.com     # 查询域名 A 记录
dig example.com          # 更详细的 DNS 信息
dig +short example.com   # 只显示结果

# 下载文件
curl -O https://example.com/file.tar.gz    # 下载（-O 保留原文件名）
curl -L https://short.link                 # -L 跟随重定向
wget https://example.com/file.tar.gz       # 另一种下载工具

# 测试 HTTP 接口
curl -X POST http://localhost:8080/api/users   -H "Content-Type: application/json"   -d '{"username":"alice","email":"alice@example.com"}'</code></pre>

	      <h2>8. Vim 基础——服务器上改配置必须会</h2>
	      <p>服务器上通常只有 Vim（或 Nano）。掌握 Vim 的基本操作可以让你在服务器上改配置时不至于手足无措：</p>
	      <pre><code class="language-bash"># 打开文件
vim /etc/nginx/nginx.conf

# 基本操作（必须有耐心，Vim 的学习曲线是陡峭的）
i       # 进入编辑模式（Insert）
Esc     # 退出编辑模式，回到命令模式
:wq     # 保存并退出（write + quit）
:q!     # 强制退出不保存
dd      # 删除当前行
yy      # 复制当前行
p       # 粘贴
/       # 搜索（/keyword + Enter，n 下一个，N 上一个）
u       # 撤销
Ctrl+r  # 重做</code></pre>

	      <h2>9. 常见实战场景</h2>
	      <pre><code class="language-bash"># 场景一：线上应用突然很慢，先看什么？
top                         # 看 CPU 和内存
free -h                     # 看内存是否不足
df -h                       # 看磁盘是否满了
tail -200 app.log | grep ERROR  # 看最近有没有报错

# 场景二：日志文件太大，找出访问最多的 IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 场景三：找出并删除所有超过 7 天的日志文件
find /var/log -name "*.log" -mtime +7 -delete

# 场景四：批量替换多个文件中的字符串
sed -i 's/old-text/new-text/g' *.txt     # 当前目录所有 .txt 文件</code></pre>

	      <h2>小结</h2>
	      <p>Linux 命令不需要死记硬背——<strong>记住最常用的 20 个</strong>（ls、cd、cat、less、tail、grep、find、chmod、ps、top、kill、df、du、free、ping、curl、ssh、scp、tar、vim），其余的遇到时查 <code>man</code>（manual）或 <code>--help</code> 就行。最重要的是<strong>理解管道的理念</strong>——通过组合简单命令来完成复杂任务，这是 Linux 命令行真正的威力所在。</p>`):r==="javascript-es6"?(s.value="JavaScript ES6+ 新特性",o.value=`	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

	      <p>ES6（ECMAScript 2015）是 JavaScript 历史上最大的一次更新，此后的 ES7-ES14 每年一个版本，持续带来新特性。这些新特性不仅让代码更简洁，更重要的是<strong>改变了我们组织代码的方式</strong>。本文按"日常使用频率"组织，从每天都在用的 let/const 到彻底改变异步编程的 async/await，逐一讲解。</p>

	      <h2>1. let 和 const：告别 var 的种种问题</h2>
	      <p>var 有三个"反直觉"的问题：变量提升（hoisting）、没有块级作用域、可以重复声明。let 和 const 彻底解决了这些问题：</p>
	      <pre><code class="language-java">// var 的问题一：变量提升
console.log(x);   // undefined（var 声明被提升，但赋值没有）
var x = 5;

console.log(y);   // ReferenceError（let 不存在提升导致的意外）
let y = 5;

// var 的问题二：没有块级作用域
for (var i = 0; i < 3; i++) { }
console.log(i);   // 3（i 泄露到循环外了！）

for (let j = 0; j < 3; j++) { }
console.log(j);   // ReferenceError（j 只在 for 块内有效）

// var 的问题三：在 setTimeout 循环中的经典 bug
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 输出 3, 3, 3（共享同一个 i）
}
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 输出 0, 1, 2（每次迭代是新的 i）
}

// const：声明常量
const PI = 3.14159;
PI = 3;           // TypeError: Assignment to constant variable
const arr = [1, 2, 3];
arr.push(4);      // 可以！const 保护的是引用，不是内容
arr = [5, 6];     // TypeError（不能重新赋值）</code></pre>
	      <p><strong>使用原则：</strong>默认用 const，需要重新赋值时改用 let。<strong>永远不要再使用 var。</strong></p>

	      <h2>2. 箭头函数：更短、更清晰的函数写法</h2>
	      <p>箭头函数不仅仅是"更短的 function"，它最大的区别是<strong>不绑定自己的 this</strong>——它从定义时的外层作用域继承 this。</p>
	      <pre><code class="language-java">// 语法简写
const add = (a, b) => a + b;                // 单行表达式自动 return
const greet = name => "Hello, " + name;      // 单个参数可省略括号
const sayHi = () => console.log("Hi");       // 无参数需要空括号
const getObj = () => ({ name: "Alice" });    // 返回对象字面量需要加括号

// 关键区别：this 绑定
class Counter {
    constructor() {
        this.count = 0;
        // 传统函数：this 丢失
        setTimeout(function() {
            console.log(this.count);  // undefined（this 指向 window/global）
        }, 100);
        // 箭头函数：this 正确继承
        setTimeout(() => {
            console.log(this.count);  // 0（this 指向 Counter 实例）
        }, 100);
    }
}

// 什么时候不能用箭头函数？
// 1. 对象方法（需要 this 指向调用者时）
const obj = {
    name: "Alice",
    sayHi: () => console.log(this.name)  // undefined，this 指向外层
};
// 应改为：
const obj2 = {
    name: "Alice",
    sayHi() { console.log(this.name); }  // "Alice"
};

// 2. 需要 arguments 对象时（箭头函数没有 arguments）</code></pre>

	      <h2>3. 模板字符串：终于可以优雅地拼接字符串了</h2>
	      <p>ES6 引入了<strong>模板字符串（Template Literals）</strong>，使用反引号（backtick）包围，支持变量插值和多行文本。语法是使用反引号代替单引号或双引号，用 <code>\${变量名}</code> 嵌入表达式：</p>
	      <pre><code class="language-java">// 之前：字符串拼接，可读性极差
const msg = "Hello, " + name + "! You have " + count + " messages.";

// 使用模板字符串（反引号 + \${} 语法）
// 写法: 用反引号包围字符串，\${变量名} 直接嵌入变量

// 多行字符串——不需要 
 了！
const cardHtml = "<div class='card'>
" +
    "    <h2>" + title + "</h2>
" +
    "    <p>" + content + "</p>
" +
    "</div>";

// 支持任意表达式
// 写法: 反引号内可以使用任意 JavaScript 表达式

// 标签模板（Tagged Templates）——高级用法
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) =>
        result + str + (values[i] ? "<mark>" + values[i] + "</mark>" : ""), "");
}
// 调用方式: highlight(模板字符串)
// 效果: 自动将插入的变量用 <mark> 标签包裹</code></pre>

	      <h2>4. 解构赋值：从对象和数组中提取值的优雅方式</h2>
	      <pre><code class="language-java">// 对象解构
const { name, age, city = "Beijing" } = user;
// 等价于：
// const name = user.name;
// const age = user.age;
// const city = user.city ?? "Beijing";  // 默认值

const { name: userName } = user;         // 重命名
const { address: { street } } = user;    // 嵌套解构

// 函数参数解构（React 组件中非常常见）
function UserCard({ name, age, avatar }) {
    console.log(name, age, avatar);
}

// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3, 4, 5]

// 交换变量（不需要临时变量了！）
let a = 1, b = 2;
[a, b] = [b, a];   // a=2, b=1

// 忽略某些元素
const [, , third] = [1, 2, 3, 4];  // third=3</code></pre>

	      <h2>5. 扩展运算符与剩余参数：... 的两种身份</h2>
	      <pre><code class="language-java">// 扩展运算符：把数组/对象"展开"
const arr1 = [1, 2, 3];
const arr2 = [0, ...arr1, 4, 5];         // [0, 1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3, b: 99 };   // { a: 1, b: 99, c: 3 }（后面的覆盖前面的）

// 浅拷贝
const copyArr = [...arr];
const copyObj = { ...obj };

// 合并
const merged = { ...defaultConfig, ...userConfig };

// 剩余参数：收集剩余参数到数组
function sum(first, ...others) {
    return first + others.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5);  // 15</code></pre>

	      <h2>6. Promise 与 Async/Await：异步编程的进化史</h2>
	      <p>这是现代 JavaScript 最重要的概念之一。先回顾一下异步编程的进化：</p>
	      <pre><code class="language-java">// 第一阶段：回调地狱（Callback Hell）
getUser(id, function(user) {
    getOrders(user.id, function(orders) {
        getOrderDetail(orders[0].id, function(detail) {
            console.log(detail);  // 缩进越来越深，错误处理困难...
        });
    });
});

// 第二阶段：Promise 链
getUser(id)
    .then(user => getOrders(user.id))
    .then(orders => getOrderDetail(orders[0].id))
    .then(detail => console.log(detail))
    .catch(err => console.error(err));  // 统一错误处理

// 第三阶段：Async/Await（语法糖，本质仍是 Promise）
async function showOrderDetail(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const detail = await getOrderDetail(orders[0].id);
        console.log(detail);
    } catch (err) {
        console.error(err);
    }
}
// async 函数自动返回 Promise，await 等待 Promise 完成并取出值</code></pre>

	      <p><strong>关键理解：</strong>async/await 不是替代 Promise，而是 Promise 的语法糖。它让异步代码<strong>看起来像同步代码</strong>，极大提升了可读性。但它们依然是异步非阻塞的——await 不会阻塞主线程。</p>

	      <h2>7. 其他实用新特性速览</h2>
	      <pre><code class="language-java">// 可选链（Optional Chaining, ES2020）——避免 Cannot read property of undefined
const street = user?.address?.street ?? "Unknown";
// 等价于：
// const street = user && user.address ? user.address.street : "Unknown";

// 空值合并运算符（Nullish Coalescing, ES2020）
const name = input ?? "Default";      // 只有 null/undefined 才取默认值
// 注意：|| 会把空字符串和 0 也当作 falsy，?? 不会

// 对象方法简写
const obj = {
    name: "Alice",
    sayHi() { /* ... */ }   // 不需要 function 关键字
};

// 属性名表达式
const key = "email";
const obj2 = { [key]: "alice@example.com" };  // { email: "alice@example.com" }

// Array 新方法
[1, 2, 3].includes(2);            // true（比 indexOf !== -1 更语义化）
[1, 2, 3].flatMap(x => [x, x*2]); // [1, 2, 2, 4, 3, 6]
[1, [2, [3]]].flat(2);            // [1, 2, 3]（扁平化指定层数）</code></pre>

	      <h2>小结</h2>
	      <p>ES6+ 的新特性远不止这些，但以上 6 类是最常用、最能提升开发效率的。<strong>如果你只能记住三点：永远用 const/let 而非 var、用箭头函数处理回调（注意 this）、用 async/await 写异步代码。</strong>掌握这些，你的 JavaScript 代码会从一个时代跨入另一个时代。</p>`):r==="design-patterns"?(s.value="设计模式入门",o.value=`	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

	      <p>设计模式（Design Patterns）是软件开发中<strong>经过反复验证的、可复用的解决方案</strong>。它们不是具体的代码，而是解决某类问题的最佳实践模板。GoF（Gang of Four，四人帮）在 1994 年总结了 23 种经典设计模式。本文聚焦于日常开发中最常用的几种，通过 Java 代码示例带你理解它们的核心思想和使用场景。</p>

	      <h2>1. 学设计模式之前，先懂六大原则</h2>
	      <p>设计模式是"术"，设计原则是"道"。理解原则后，你会发现很多模式其实是在不同场景下对同一原则的具体应用：</p>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">原则</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">一句话解释</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">应用</th>
	          </tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>单一职责（SRP）</strong></td><td style="border: 1px solid #ccc; padding: 8px;">一个类只做一件事</td><td style="border: 1px solid #ccc; padding: 8px;">UserService 只管用户逻辑，不管发邮件</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>开闭原则（OCP）</strong></td><td style="border: 1px solid #ccc; padding: 8px;">对扩展开放，对修改关闭</td><td style="border: 1px solid #ccc; padding: 8px;">加新支付方式不改 PaymentService，而是实现 PaymentStrategy 接口</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>里氏替换（LSP）</strong></td><td style="border: 1px solid #ccc; padding: 8px;">子类必须能完全替换父类</td><td style="border: 1px solid #ccc; padding: 8px;">不要重写父类方法让它抛异常</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>依赖倒置（DIP）</strong></td><td style="border: 1px solid #ccc; padding: 8px;">依赖抽象而非具体实现</td><td style="border: 1px solid #ccc; padding: 8px;">Controller 依赖 UserService 接口，不依赖具体实现类</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>接口隔离（ISP）</strong></td><td style="border: 1px solid #ccc; padding: 8px;">接口要小而精，不要大而全</td><td style="border: 1px solid #ccc; padding: 8px;">不要强迫实现类实现它不需要的方法</td></tr>
	          <tr><td style="border: 1px solid #ccc; padding: 8px;"><strong>迪米特法则</strong></td><td style="border: 1px solid #ccc; padding: 8px;">最少知道原则，只和直接朋友通信</td><td style="border: 1px solid #ccc; padding: 8px;">A 不要直接调用 C 的方法，应通过 B 转发</td></tr>
	      </table>

	      <h2>2. 单例模式（Singleton）—— 全局唯一的实例</h2>
	      <p><strong>场景：</strong>数据库连接池、配置管理器、日志对象——这些在整个应用中只需要一个实例。</p>
	      <p><strong>核心思想：</strong>私有构造器 + 静态方法访问唯一实例。</p>
	      <pre><code class="language-java">// 推荐：枚举单例（最安全，自动防反射攻击和序列化破坏）
public enum ConfigManager {
    INSTANCE;

    private Properties props = new Properties();

    public void load(String path) { /* 加载配置 */ }
    public String get(String key) { return props.getProperty(key); }
}

// 使用
ConfigManager.INSTANCE.load("app.properties");
String dbUrl = ConfigManager.INSTANCE.get("db.url");

// 另一种推荐：静态内部类（懒加载，线程安全，无锁）
public class DbConnectionPool {
    private DbConnectionPool() {}

    private static class Holder {
        static final DbConnectionPool INSTANCE = new DbConnectionPool();
    }

    public static DbConnectionPool getInstance() {
        return Holder.INSTANCE;  // 类加载时才初始化，天然线程安全
    }
}</code></pre>
	      <p><strong>面试常见追问：</strong>双重检查锁定（DCL）为什么要用 volatile？因为 new 操作不是原子性的，volatile 禁止指令重排序，防止返回未初始化完成的实例。</p>

	      <h2>3. 工厂模式（Factory）—— 把对象的创建和使用分离</h2>
	      <p><strong>场景：</strong>支付系统中根据支付方式创建不同的支付处理器。如果不用工厂，你需要在业务代码里写一堆 if-else 来 new 不同的实现类。</p>
	      <pre><code class="language-java">// 定义支付接口
interface PaymentStrategy {
    void pay(BigDecimal amount);
}

// 具体实现
@Component
class WeChatPay implements PaymentStrategy {
    public void pay(BigDecimal amount) {
        System.out.println("微信支付：" + amount + " 元");
    }
}

@Component
class AliPay implements PaymentStrategy {
    public void pay(BigDecimal amount) {
        System.out.println("支付宝支付：" + amount + " 元");
    }
}

// 工厂类：Spring Boot 中可以用 Map 自动注入
@Component
class PaymentFactory {
    // Spring 会自动把所有 PaymentStrategy 的实现注入到这个 Map 中
    // Key 是 Bean 的名字（weChatPay, aliPay）
    @Autowired
    private Map&lt;String, PaymentStrategy&gt; strategyMap;

    public PaymentStrategy getStrategy(String type) {
        PaymentStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式: " + type);
        }
        return strategy;
    }
}

// 使用（Controller 层）
@RestController
public class OrderController {
    @Autowired
    private PaymentFactory paymentFactory;

    @PostMapping("/pay")
    public String pay(@RequestBody PayRequest request) {
        PaymentStrategy strategy = paymentFactory.getStrategy(request.getType());
        strategy.pay(request.getAmount());
        return "支付成功";
    }
}</code></pre>
	      <p>这个例子展示了工厂模式 + 策略模式 + Spring 依赖注入的经典组合：<strong>新增支付方式只需加一个新类，不用改任何已有代码</strong>——完美符合开闭原则。</p>

	      <h2>4. 建造者模式（Builder）—— 优雅地构造复杂对象</h2>
	      <p><strong>场景：</strong>一个对象有十几个可选参数。用构造器传参的话调用方根本不知道第 5 个参数是什么意思；用 setter 的话对象可能处于不完整状态。</p>
	      <pre><code class="language-java">// 使用 Lombok @Builder（最简单的方式）
@Builder
@Data
@AllArgsConstructor
public class User {
    private String name;      // 必填
    private int age;          // 必填
    private String email;     // 可选
    private String phone;     // 可选
    private String address;   // 可选
}

// 使用
User user = User.builder()
    .name("张三")
    .age(25)
    .email("zhangsan@example.com")
    .phone("13800138000")
    .build();
// 调用方只需要关心自己需要的字段，而且链式调用比构造器参数表清晰得多</code></pre>

	      <h2>5. 策略模式（Strategy）—— 用组合替代 if-else</h2>
	      <p><strong>场景：</strong>电商促销系统中，不同的优惠策略（满减、折扣、立减）。如果业务代码里写满 if-else，加一个新策略就要改核心逻辑。</p>
	      <pre><code class="language-java">// 定义策略接口
interface DiscountStrategy {
    BigDecimal apply(BigDecimal originalPrice);
}

// 满减策略
@Component
class FullReductionStrategy implements DiscountStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.compareTo(new BigDecimal("100")) >= 0
            ? price.subtract(new BigDecimal("20"))
            : price;
    }
}

// 折扣策略
@Component
class PercentageStrategy implements DiscountStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.multiply(new BigDecimal("0.8")); // 8折
    }
}

// 使用：通过工厂获取策略后调用，业务逻辑极其简洁
BigDecimal finalPrice = discountStrategy.apply(originalPrice);</code></pre>

	      <h2>6. 观察者模式（Observer）—— 一对多的通知机制</h2>
	      <p><strong>场景：</strong>用户注册后需要发欢迎邮件 + 发优惠券 + 记录日志。把这些"副作用"写在注册方法里会让它越来越臃肿。</p>
	      <pre><code class="language-java">// Spring 事件机制就是经典的观察者模式实现

// 1. 定义事件
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;
    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    public User getUser() { return user; }
}

// 2. 发布事件（在注册服务中）
@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void register(User user) {
        // ... 保存用户到数据库
        publisher.publishEvent(new UserRegisteredEvent(this, user));
        // 注册逻辑到此结束，后续操作由监听器处理
    }
}

// 3. 监听事件（多个监听器、互不耦合）
@Component
class EmailListener {
    @EventListener
    public void sendWelcomeEmail(UserRegisteredEvent event) {
        // 发送欢迎邮件
    }
}

@Component
class CouponListener {
    @EventListener
    public void issueCoupon(UserRegisteredEvent event) {
        // 发放新用户优惠券
    }
}

// 要增加新的副作用（比如发送短信通知），只需新增一个监听器类，
// 完全不用改 UserService 的代码——这就是观察者模式的威力。</code></pre>

	      <h2>7. 设计模式使用心法</h2>
	      <ul>
	          <li><strong>不要为了用模式而用模式：</strong>模式是解决问题的工具，不是炫技的资本。如果一段简单的 if-else 就够用了，不要强行套工厂模式。</li>
	          <li><strong>优先考虑简单方案：</strong>在模式和 KISS（Keep It Simple, Stupid）原则冲突时，优先选简单的。</li>
	          <li><strong>模式是演进而来的：</strong>好的设计往往是重构出来的，不是设计出来的。先写能用的代码，当 if-else 太多或类太臃肿时，再考虑引入合适的模式。</li>
	          <li><strong>Spring 框架本身就是设计模式的最佳教材：</strong>IoC 容器（工厂模式）、AOP（代理模式）、事件机制（观察者模式）、JdbcTemplate（模板方法模式）……读 Spring 源码是学习设计模式的最好方式。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂、建造者、策略、观察者这 5 种最常用的</strong>，其余的随着实践慢慢补充。</p>`):r==="redis-basics"?(s.value="Redis 基础入门",o.value=`	      <h1>Redis 缓存实战：从数据结构到缓存击穿解决方案</h1>

	      <p>Redis（Remote Dictionary Server）是目前最流行的内存数据库。它以极高的读写速度（单机 10 万+ QPS）和丰富的数据结构（String、Hash、List、Set、Sorted Set、Stream 等）成为后端开发中不可或缺的基础设施。但 Redis 用得不好反而会引入各种问题——缓存穿透、缓存击穿、缓存雪崩、数据不一致……本文从数据结构讲起，深入到 Spring Boot 集成和使用中的常见问题与解决方案。</p>

	      <h2>1. Redis 为什么这么快？</h2>
	      <ul>
	          <li><strong>纯内存操作：</strong>所有数据存在内存中，读写不涉及磁盘 I/O。</li>
	          <li><strong>单线程模型：</strong>Redis 6.0 之前核心网络 I/O 和命令执行都是单线程的，没有锁竞争和上下文切换开销。6.0+ 引入了多线程 I/O，但命令执行仍然是单线程。</li>
	          <li><strong>I/O 多路复用：</strong>使用 epoll（Linux）等技术，一个线程能同时监听多个网络连接。</li>
	          <li><strong>高效的数据结构：</strong>底层用 C 语言实现，数据结构经过精心优化（如压缩列表、跳跃表）。</li>
	      </ul>
	      <p><strong>一句话：</strong>Redis 快是因为数据在内存、处理在单线程、I/O 多路复用三者叠加的结果。</p>

	      <h2>2. 五大基础数据类型及应用场景</h2>
	      <table style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
	          <tr style="background: #efefef;">
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">类型</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">特点</th>
	              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">典型场景</th>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>String</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">最基础，可以是字符串、数字、二进制</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">缓存对象（JSON 序列化的用户信息）、分布式锁、计数器</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Hash</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">键值对集合，适合存储对象</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">用户信息（每个字段单独存取）、购物车、配置项</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>List</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">有序列表，支持从两端操作</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">消息队列、最新动态时间线、阻塞队列</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Set</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">无序集合，自动去重，支持交集/并集/差集</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">标签系统、共同好友、抽奖去重、黑名单</td>
	          </tr>
	          <tr>
	              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Sorted Set</strong></td>
	              <td style="border: 1px solid #ccc; padding: 8px;">有序集合，每个元素带分数（score），按分数排序</td>
	              <td style="border: 1px solid #ccc; padding: 8px;">排行榜、延迟队列、按时间排序的时间线</td>
	          </tr>
	      </table>

	      <h2>3. 基础命令实战</h2>
	      <pre><code class="language-bash"># String —— 最常用
SET user:1 '{"name":"Alice","age":25}'     # 设置
SET user:1 '{"name":"Alice"}' EX 3600     # 设置 + 过期时间（秒）
GET user:1                                  # 获取
DEL user:1                                  # 删除
INCR view_count:article:100                 # 原子递增（计数器）
SETNX lock:order:1001 "locked" EX 10       # SET if Not eXists（分布式锁）

# Hash —— 比 String 存 JSON 更灵活
HSET user:1 name "Alice" age "25" city "Beijing"
HGET user:1 name                           # 获取单个字段
HGETALL user:1                             # 获取所有字段和值
HDEL user:1 city                           # 删除字段
HINCRBY user:1 login_count 1              # 原子递增数值字段

# List —— 当做队列或栈
LPUSH queue:tasks "task1" "task2"          # 从左边推入
RPOP queue:tasks                            # 从右边弹出（FIFO 队列）
BLPOP queue:tasks 10                        # 阻塞弹出（BRPOP），等 10 秒
LRANGE timeline:user:1 0 9                # 最新 10 条（0 到 9）

# Set —— 去重 + 集合运算
SADD tags:post:1 "java" "spring" "redis"
SMEMBERS tags:post:1                       # 查看所有标签
SINTER tags:post:1 tags:post:2            # 两个文章的公共标签（交集）
SUNION tags:post:1 tags:post:2            # 两个文章的所有标签（并集）
SISMEMBER tags:post:1 "java"              # 判断是否存在

# Sorted Set —— 排行榜神器
ZADD leaderboard 1000 "alice" 800 "bob" 1200 "charlie"
ZRANGE leaderboard 0 -1 REV WITHSCORES    # 按分数降序排列
ZRANK leaderboard "alice"                  # alice 的排名（0-based）
ZSCORE leaderboard "alice"                 # alice 的分数
ZINCRBY leaderboard 50 "alice"            # 加 50 分</code></pre>

	      <h2>4. Spring Boot 集成 Redis</h2>
	      <pre><code class="language-java">// 依赖 (pom.xml)
// spring-boot-starter-data-redis
// commons-pool2  (连接池)

// application.yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: \${REDIS_PASSWORD}
      timeout: 3000ms
      lettuce:          # 默认客户端（比 Jedis 性能更好，响应式支持）
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 2

// Redis 配置类（设置序列化方式）
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate&lt;String, Object&gt; redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate&lt;String, Object&gt; template = new RedisTemplate&lt;&gt;();
        template.setConnectionFactory(factory);

        // Key 用 String 序列化（可读性好）
        template.setKeySerializer(new StringRedisSerializer());

        // Value 用 JSON 序列化（比 JDK 序列化省空间、可跨语言）
        Jackson2JsonRedisSerializer&lt;Object&gt; jsonSerializer =
            new Jackson2JsonRedisSerializer&lt;&gt;(Object.class);
        template.setValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}</code></pre>

	      <h2>5. 缓存三大问题及解决方案</h2>
	      <p>这是 Redis 面试最爱问的题目，也是线上事故的高发区：</p>

	      <h3>问题一：缓存穿透</h3>
	      <p><strong>现象：</strong>查询一个<strong>根本不存在</strong>的数据，缓存里没有，数据库里也没有。每次请求都穿过缓存直接打到数据库。如果有人恶意用不存在的 ID 大量请求，数据库直接被打挂。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>缓存空值：</strong>数据库查不到也往 Redis 存一个短过期时间的 null 值（如 5 分钟），下次请求就直接返回 null 不打数据库了。</li>
	          <li><strong>布隆过滤器（Bloom Filter）：</strong>在缓存前加一层布隆过滤器，它可以用很小的内存判断一个 key "一定不存在"或"可能存在"。先把所有合法的 ID 加载到布隆过滤器，请求来了先过过滤器——不存在的直接返回。</li>
	      </ul>

	      <h3>问题二：缓存击穿</h3>
	      <p><strong>现象：</strong>一个<strong>热点 Key</strong>（比如秒杀商品的库存）在过期的一瞬间，大量并发请求同时打到数据库——数据库瞬间压力暴增，可能直接崩溃。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>互斥锁（Mutex Lock）：</strong>缓存过期后，只让一个线程去查数据库并回填缓存，其他线程等待。Spring Cache 的 <code>sync = true</code> 参数就是干这个的。</li>
	          <li><strong>逻辑过期：</strong>不设 Redis 的 TTL，而是在 Value 里存一个过期时间戳。获取时判断是否过期，过期了先返回旧数据，然后异步更新——用户永远能看到数据，不会阻塞。</li>
	          <li><strong>永不过期：</strong>对于极其热点的数据，干脆不设过期时间，通过后台任务异步更新。</li>
	      </ul>

	      <h3>问题三：缓存雪崩</h3>
	      <p><strong>现象：</strong><strong>大量 Key 在同一时间过期</strong>，或者 Redis 集群宕机，导致所有请求直接打到数据库，数据库可能直接崩溃，引发连锁反应。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>过期时间加随机值：</strong>在基础过期时间上加上一个随机偏移（如 <code>TTL = 3600 + random(0, 600)</code>），避免大量 Key 同时过期。</li>
	          <li><strong>Redis 高可用：</strong>主从 + 哨兵，或者 Redis Cluster，保证 Redis 本身不单点故障。</li>
	          <li><strong>多级缓存：</strong>本地缓存（Caffeine）+ Redis + 数据库，每一层都有兜底。</li>
	          <li><strong>限流降级：</strong>用 Sentinel 或 Hystrix 对数据库访问做限流，超出后直接返回降级响应。</li>
	      </ul>

	      <h2>6. 缓存更新策略：如何保证数据一致性？</h2>
	      <p>这是缓存使用中最棘手的难题——<strong>数据库更新了，缓存怎么同步？</strong></p>
	      <ul>
	          <li><strong>Cache Aside（旁路缓存，最常用）：</strong>读的时候先读缓存，miss 了读数据库并回填；写的时候<strong>先更新数据库，再删除缓存</strong>（注意：是删缓存，不是更新缓存！更新缓存会有并发问题）。</li>
	          <li><strong>Read/Write Through：</strong>缓存层代理数据读写，应用只和缓存打交道。实现复杂，需要专门的缓存中间件。</li>
	          <li><strong>Write Behind：</strong>先写缓存，异步批量写数据库。性能最高但数据丢失风险也最大（缓存宕机可能丢数据）。</li>
	      </ul>
	      <p><strong>为什么写操作是"删缓存"而不是"更新缓存"？</strong>因为更新缓存有并发顺序问题：线程 A 更新数据库 → 线程 B 更新数据库 → 线程 B 更新缓存 → 线程 A 更新缓存 → 缓存里的值最终是线程 A 的旧值，而数据库是线程 B 的新值，数据不一致。而删缓存则没有这个问题——下次读自然会回填最新值。</p>

	      <h2>小结</h2>
	      <p>Redis 入门容易精通难。<strong>会用五种数据类型只是第一层；理解缓存穿透/击穿/雪崩是第二层；深入持久化机制（RDB/AOF）、集群方案（Sentinel/Cluster）、内存淘汰策略、以及分布式锁的正确实现才是真正的进阶之路。</strong>本文覆盖了日常开发中 90% 的 Redis 使用场景，足以应对大多数业务需求。但记住：<strong>缓存不是万能的，加缓存之前先优化 SQL，很多场景下慢查询不是缓存能解决的。</strong></p>`):(s.value=r,o.value=`<p>Content for ${r} not migrated yet.</p>`)};return Zn(()=>{i(),setTimeout(()=>fp.highlightAll(),100)}),(l,a)=>(pe(),St(In,{title:s.value,icon:"fa fa-file-text-o",isOpen:"",isActive:"",onClose:a[0]||(a[0]=p=>ut(n).push("/all-notes"))},{default:Dt(()=>[v("div",{class:"notepad-content font-sans",innerHTML:o.value},null,8,gp)]),_:1},8,["title"]))}}),mp={class:"flex gap-6 flex-wrap"},xp=tt({__name:"Computer",setup(e){const t=wn(),n=r=>{r.startsWith("http")?window.open(r,"_blank"):t.push(r)};return(r,s)=>(pe(),St(In,{title:"我的电脑",icon:"fa fa-desktop",isOpen:!0,isActive:!0,onClose:s[3]||(s[3]=o=>ut(t).push("/"))},{default:Dt(()=>[s[7]||(s[7]=v("div",{class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3"},[v("span",{class:"text-xs"},"地址(D)"),v("div",{class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},[v("i",{class:"fa fa-desktop text-blue-500"}),Ee(" 我的电脑 ")])],-1)),v("div",mp,[v("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[0]||(s[0]=o=>n("/all-notes"))},[...s[4]||(s[4]=[v("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform text-gray-500",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[v("i",{class:"fa fa-hdd-o"})],-1),v("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 本地磁盘 (C:) ",-1),v("span",{class:"text-[10px] text-gray-500"},"12 篇文档",-1)])]),v("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[1]||(s[1]=o=>n("/categories"))},[...s[5]||(s[5]=[v("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[v("i",{class:"fa fa-cog text-pink-500"})],-1),v("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 控制面板 ",-1),v("span",{class:"text-[10px] text-gray-500"},"5 个分类",-1)])]),v("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[2]||(s[2]=o=>n("https://github.com"))},[...s[6]||(s[6]=[v("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[v("i",{class:"fa fa-globe text-blue-400"})],-1),v("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 网上邻居 ",-1),v("span",{class:"text-[10px] text-gray-500"},"GitHub",-1)])])]),s[8]||(s[8]=v("div",{class:"mt-auto pt-4 text-xs text-gray-500 border-t border-gray-300 mt-6"}," 3 个对象 ",-1))]),_:1}))}}),bp=[{path:"/",component:zd},{path:"/computer",component:xp},{path:"/all-notes",component:op},{path:"/categories",component:dp},{path:"/notes/:id",component:hp}],yp=Td({history:rd(),routes:bp});mc(Wd).use(yp).mount("#app");
