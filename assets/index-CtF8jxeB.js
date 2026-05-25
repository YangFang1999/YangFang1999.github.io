(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();/**
* @vue/shared v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Qr(e){const t=Object.create(null);for(const r of e.split(","))t[r]=1;return r=>r in t}const xe={},sn=[],yt=()=>{},wo=()=>!1,rr=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Zr=e=>e.startsWith("onUpdate:"),ke=Object.assign,es=(e,t)=>{const r=e.indexOf(t);r>-1&&e.splice(r,1)},el=Object.prototype.hasOwnProperty,pe=(e,t)=>el.call(e,t),z=Array.isArray,on=e=>Fn(e)==="[object Map]",sr=e=>Fn(e)==="[object Set]",vs=e=>Fn(e)==="[object Date]",X=e=>typeof e=="function",Ae=e=>typeof e=="string",it=e=>typeof e=="symbol",ue=e=>e!==null&&typeof e=="object",To=e=>(ue(e)||X(e))&&X(e.then)&&X(e.catch),Co=Object.prototype.toString,Fn=e=>Co.call(e),tl=e=>Fn(e).slice(8,-1),Ro=e=>Fn(e)==="[object Object]",ts=e=>Ae(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,vn=Qr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),or=e=>{const t=Object.create(null);return r=>t[r]||(t[r]=e(r))},nl=/-\w/g,Ge=or(e=>e.replace(nl,t=>t.slice(1).toUpperCase())),rl=/\B([A-Z])/g,Zt=or(e=>e.replace(rl,"-$1").toLowerCase()),ir=or(e=>e.charAt(0).toUpperCase()+e.slice(1)),vr=or(e=>e?`on${ir(e)}`:""),bt=(e,t)=>!Object.is(e,t),Vn=(e,...t)=>{for(let r=0;r<e.length;r++)e[r](...t)},Io=(e,t,r,n=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:n,value:r})},lr=e=>{const t=parseFloat(e);return isNaN(t)?e:t},sl=e=>{const t=Ae(e)?Number(e):NaN;return isNaN(t)?e:t};let Ss;const ar=()=>Ss||(Ss=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Ut(e){if(z(e)){const t={};for(let r=0;r<e.length;r++){const n=e[r],s=Ae(n)?al(n):Ut(n);if(s)for(const o in s)t[o]=s[o]}return t}else if(Ae(e)||ue(e))return e}const ol=/;(?![^(]*\))/g,il=/:([^]+)/,ll=/\/\*[^]*?\*\//g;function al(e){const t={};return e.replace(ll,"").split(ol).forEach(r=>{if(r){const n=r.split(il);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function _e(e){let t="";if(Ae(e))t=e;else if(z(e))for(let r=0;r<e.length;r++){const n=_e(e[r]);n&&(t+=n+" ")}else if(ue(e))for(const r in e)e[r]&&(t+=r+" ");return t.trim()}const cl="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",dl=Qr(cl);function Oo(e){return!!e||e===""}function pl(e,t){if(e.length!==t.length)return!1;let r=!0;for(let n=0;r&&n<e.length;n++)r=Hn(e[n],t[n]);return r}function Hn(e,t){if(e===t)return!0;let r=vs(e),n=vs(t);if(r||n)return r&&n?e.getTime()===t.getTime():!1;if(r=it(e),n=it(t),r||n)return e===t;if(r=z(e),n=z(t),r||n)return r&&n?pl(e,t):!1;if(r=ue(e),n=ue(t),r||n){if(!r||!n)return!1;const s=Object.keys(e).length,o=Object.keys(t).length;if(s!==o)return!1;for(const i in e){const l=e.hasOwnProperty(i),a=t.hasOwnProperty(i);if(l&&!a||!l&&a||!Hn(e[i],t[i]))return!1}}return String(e)===String(t)}function ul(e,t){return e.findIndex(r=>Hn(r,t))}const Mo=e=>!!(e&&e.__v_isRef===!0),Ce=e=>Ae(e)?e:e==null?"":z(e)||ue(e)&&(e.toString===Co||!X(e.toString))?Mo(e)?Ce(e.value):JSON.stringify(e,ko,2):String(e),ko=(e,t)=>Mo(t)?ko(e,t.value):on(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((r,[n,s],o)=>(r[Sr(n,o)+" =>"]=s,r),{})}:sr(t)?{[`Set(${t.size})`]:[...t.values()].map(r=>Sr(r))}:it(t)?Sr(t):ue(t)&&!z(t)&&!Ro(t)?String(t):t,Sr=(e,t="")=>{var r;return it(e)?`Symbol(${(r=e.description)!=null?r:t})`:e};/**
* @vue/reactivity v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ke;class fl{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Ke,!t&&Ke&&(this.index=(Ke.scopes||(Ke.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,r;if(this.scopes)for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].pause();for(t=0,r=this.effects.length;t<r;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,r;if(this.scopes)for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].resume();for(t=0,r=this.effects.length;t<r;t++)this.effects[t].resume()}}run(t){if(this._active){const r=Ke;try{return Ke=this,t()}finally{Ke=r}}}on(){++this._on===1&&(this.prevScope=Ke,Ke=this)}off(){this._on>0&&--this._on===0&&(Ke=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let r,n;for(r=0,n=this.effects.length;r<n;r++)this.effects[r].stop();for(this.effects.length=0,r=0,n=this.cleanups.length;r<n;r++)this.cleanups[r]();if(this.cleanups.length=0,this.scopes){for(r=0,n=this.scopes.length;r<n;r++)this.scopes[r].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function gl(){return Ke}let be;const Er=new WeakSet;class Po{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Ke&&Ke.active&&Ke.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Er.has(this)&&(Er.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||No(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Es(this),Lo(this);const t=be,r=st;be=this,st=!0;try{return this.fn()}finally{Fo(this),be=t,st=r,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)ss(t);this.deps=this.depsTail=void 0,Es(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Er.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Nr(this)&&this.run()}get dirty(){return Nr(this)}}let Do=0,Sn,En;function No(e,t=!1){if(e.flags|=8,t){e.next=En,En=e;return}e.next=Sn,Sn=e}function ns(){Do++}function rs(){if(--Do>0)return;if(En){let t=En;for(En=void 0;t;){const r=t.next;t.next=void 0,t.flags&=-9,t=r}}let e;for(;Sn;){let t=Sn;for(Sn=void 0;t;){const r=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(n){e||(e=n)}t=r}}if(e)throw e}function Lo(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Fo(e){let t,r=e.depsTail,n=r;for(;n;){const s=n.prevDep;n.version===-1?(n===r&&(r=s),ss(n),hl(n)):t=n,n.dep.activeLink=n.prevActiveLink,n.prevActiveLink=void 0,n=s}e.deps=t,e.depsTail=r}function Nr(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ho(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ho(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Rn)||(e.globalVersion=Rn,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Nr(e))))return;e.flags|=2;const t=e.dep,r=be,n=st;be=e,st=!0;try{Lo(e);const s=e.fn(e._value);(t.version===0||bt(s,e._value))&&(e.flags|=128,e._value=s,t.version++)}catch(s){throw t.version++,s}finally{be=r,st=n,Fo(e),e.flags&=-3}}function ss(e,t=!1){const{dep:r,prevSub:n,nextSub:s}=e;if(n&&(n.nextSub=s,e.prevSub=void 0),s&&(s.prevSub=n,e.nextSub=void 0),r.subs===e&&(r.subs=n,!n&&r.computed)){r.computed.flags&=-5;for(let o=r.computed.deps;o;o=o.nextDep)ss(o,!0)}!t&&!--r.sc&&r.map&&r.map.delete(r.key)}function hl(e){const{prevDep:t,nextDep:r}=e;t&&(t.nextDep=r,e.prevDep=void 0),r&&(r.prevDep=t,e.nextDep=void 0)}let st=!0;const Bo=[];function It(){Bo.push(st),st=!1}function Ot(){const e=Bo.pop();st=e===void 0?!0:e}function Es(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const r=be;be=void 0;try{t()}finally{be=r}}}let Rn=0;class xl{constructor(t,r){this.sub=t,this.dep=r,this.version=r.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class os{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!be||!st||be===this.computed)return;let r=this.activeLink;if(r===void 0||r.sub!==be)r=this.activeLink=new xl(be,this),be.deps?(r.prevDep=be.depsTail,be.depsTail.nextDep=r,be.depsTail=r):be.deps=be.depsTail=r,Uo(r);else if(r.version===-1&&(r.version=this.version,r.nextDep)){const n=r.nextDep;n.prevDep=r.prevDep,r.prevDep&&(r.prevDep.nextDep=n),r.prevDep=be.depsTail,r.nextDep=void 0,be.depsTail.nextDep=r,be.depsTail=r,be.deps===r&&(be.deps=n)}return r}trigger(t){this.version++,Rn++,this.notify(t)}notify(t){ns();try{for(let r=this.subs;r;r=r.prevSub)r.sub.notify()&&r.sub.dep.notify()}finally{rs()}}}function Uo(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let n=t.deps;n;n=n.nextDep)Uo(n)}const r=e.dep.subs;r!==e&&(e.prevSub=r,r&&(r.nextSub=e)),e.dep.subs=e}}const Lr=new WeakMap,zt=Symbol(""),Fr=Symbol(""),In=Symbol("");function Le(e,t,r){if(st&&be){let n=Lr.get(e);n||Lr.set(e,n=new Map);let s=n.get(r);s||(n.set(r,s=new os),s.map=n,s.key=r),s.track()}}function Ct(e,t,r,n,s,o){const i=Lr.get(e);if(!i){Rn++;return}const l=a=>{a&&a.trigger()};if(ns(),t==="clear")i.forEach(l);else{const a=z(e),p=a&&ts(r);if(a&&r==="length"){const d=Number(n);i.forEach((c,f)=>{(f==="length"||f===In||!it(f)&&f>=d)&&l(c)})}else switch((r!==void 0||i.has(void 0))&&l(i.get(r)),p&&l(i.get(In)),t){case"add":a?p&&l(i.get("length")):(l(i.get(zt)),on(e)&&l(i.get(Fr)));break;case"delete":a||(l(i.get(zt)),on(e)&&l(i.get(Fr)));break;case"set":on(e)&&l(i.get(zt));break}}rs()}function tn(e){const t=ce(e);return t===e?t:(Le(t,"iterate",In),tt(e)?t:t.map(lt))}function cr(e){return Le(e=ce(e),"iterate",In),e}function xt(e,t){return Mt(e)?pn(Xt(e)?lt(t):t):lt(t)}const ml={__proto__:null,[Symbol.iterator](){return _r(this,Symbol.iterator,e=>xt(this,e))},concat(...e){return tn(this).concat(...e.map(t=>z(t)?tn(t):t))},entries(){return _r(this,"entries",e=>(e[1]=xt(this,e[1]),e))},every(e,t){return St(this,"every",e,t,void 0,arguments)},filter(e,t){return St(this,"filter",e,t,r=>r.map(n=>xt(this,n)),arguments)},find(e,t){return St(this,"find",e,t,r=>xt(this,r),arguments)},findIndex(e,t){return St(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return St(this,"findLast",e,t,r=>xt(this,r),arguments)},findLastIndex(e,t){return St(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return St(this,"forEach",e,t,void 0,arguments)},includes(...e){return Ar(this,"includes",e)},indexOf(...e){return Ar(this,"indexOf",e)},join(e){return tn(this).join(e)},lastIndexOf(...e){return Ar(this,"lastIndexOf",e)},map(e,t){return St(this,"map",e,t,void 0,arguments)},pop(){return hn(this,"pop")},push(...e){return hn(this,"push",e)},reduce(e,...t){return _s(this,"reduce",e,t)},reduceRight(e,...t){return _s(this,"reduceRight",e,t)},shift(){return hn(this,"shift")},some(e,t){return St(this,"some",e,t,void 0,arguments)},splice(...e){return hn(this,"splice",e)},toReversed(){return tn(this).toReversed()},toSorted(e){return tn(this).toSorted(e)},toSpliced(...e){return tn(this).toSpliced(...e)},unshift(...e){return hn(this,"unshift",e)},values(){return _r(this,"values",e=>xt(this,e))}};function _r(e,t,r){const n=cr(e),s=n[t]();return n!==e&&!tt(e)&&(s._next=s.next,s.next=()=>{const o=s._next();return o.done||(o.value=r(o.value)),o}),s}const bl=Array.prototype;function St(e,t,r,n,s,o){const i=cr(e),l=i!==e&&!tt(e),a=i[t];if(a!==bl[t]){const c=a.apply(e,o);return l?lt(c):c}let p=r;i!==e&&(l?p=function(c,f){return r.call(this,xt(e,c),f,e)}:r.length>2&&(p=function(c,f){return r.call(this,c,f,e)}));const d=a.call(i,p,n);return l&&s?s(d):d}function _s(e,t,r,n){const s=cr(e),o=s!==e&&!tt(e);let i=r,l=!1;s!==e&&(o?(l=n.length===0,i=function(p,d,c){return l&&(l=!1,p=xt(e,p)),r.call(this,p,xt(e,d),c,e)}):r.length>3&&(i=function(p,d,c){return r.call(this,p,d,c,e)}));const a=s[t](i,...n);return l?xt(e,a):a}function Ar(e,t,r){const n=ce(e);Le(n,"iterate",In);const s=n[t](...r);return(s===-1||s===!1)&&as(r[0])?(r[0]=ce(r[0]),n[t](...r)):s}function hn(e,t,r=[]){It(),ns();const n=ce(e)[t].apply(e,r);return rs(),Ot(),n}const yl=Qr("__proto__,__v_isRef,__isVue"),jo=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(it));function vl(e){it(e)||(e=String(e));const t=ce(this);return Le(t,"has",e),t.hasOwnProperty(e)}class $o{constructor(t=!1,r=!1){this._isReadonly=t,this._isShallow=r}get(t,r,n){if(r==="__v_skip")return t.__v_skip;const s=this._isReadonly,o=this._isShallow;if(r==="__v_isReactive")return!s;if(r==="__v_isReadonly")return s;if(r==="__v_isShallow")return o;if(r==="__v_raw")return n===(s?o?Ol:Jo:o?Wo:Vo).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(n)?t:void 0;const i=z(t);if(!s){let a;if(i&&(a=ml[r]))return a;if(r==="hasOwnProperty")return vl}const l=Reflect.get(t,r,Be(t)?t:n);if((it(r)?jo.has(r):yl(r))||(s||Le(t,"get",r),o))return l;if(Be(l)){const a=i&&ts(r)?l:l.value;return s&&ue(a)?Br(a):a}return ue(l)?s?Br(l):dr(l):l}}class Go extends $o{constructor(t=!1){super(!1,t)}set(t,r,n,s){let o=t[r];const i=z(t)&&ts(r);if(!this._isShallow){const p=Mt(o);if(!tt(n)&&!Mt(n)&&(o=ce(o),n=ce(n)),!i&&Be(o)&&!Be(n))return p||(o.value=n),!0}const l=i?Number(r)<t.length:pe(t,r),a=Reflect.set(t,r,n,Be(t)?t:s);return t===ce(s)&&(l?bt(n,o)&&Ct(t,"set",r,n):Ct(t,"add",r,n)),a}deleteProperty(t,r){const n=pe(t,r);t[r];const s=Reflect.deleteProperty(t,r);return s&&n&&Ct(t,"delete",r,void 0),s}has(t,r){const n=Reflect.has(t,r);return(!it(r)||!jo.has(r))&&Le(t,"has",r),n}ownKeys(t){return Le(t,"iterate",z(t)?"length":zt),Reflect.ownKeys(t)}}class Sl extends $o{constructor(t=!1){super(!0,t)}set(t,r){return!0}deleteProperty(t,r){return!0}}const El=new Go,_l=new Sl,Al=new Go(!0);const Hr=e=>e,jn=e=>Reflect.getPrototypeOf(e);function wl(e,t,r){return function(...n){const s=this.__v_raw,o=ce(s),i=on(o),l=e==="entries"||e===Symbol.iterator&&i,a=e==="keys"&&i,p=s[e](...n),d=r?Hr:t?pn:lt;return!t&&Le(o,"iterate",a?Fr:zt),ke(Object.create(p),{next(){const{value:c,done:f}=p.next();return f?{value:c,done:f}:{value:l?[d(c[0]),d(c[1])]:d(c),done:f}}})}}function $n(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function Tl(e,t){const r={get(s){const o=this.__v_raw,i=ce(o),l=ce(s);e||(bt(s,l)&&Le(i,"get",s),Le(i,"get",l));const{has:a}=jn(i),p=t?Hr:e?pn:lt;if(a.call(i,s))return p(o.get(s));if(a.call(i,l))return p(o.get(l));o!==i&&o.get(s)},get size(){const s=this.__v_raw;return!e&&Le(ce(s),"iterate",zt),s.size},has(s){const o=this.__v_raw,i=ce(o),l=ce(s);return e||(bt(s,l)&&Le(i,"has",s),Le(i,"has",l)),s===l?o.has(s):o.has(s)||o.has(l)},forEach(s,o){const i=this,l=i.__v_raw,a=ce(l),p=t?Hr:e?pn:lt;return!e&&Le(a,"iterate",zt),l.forEach((d,c)=>s.call(o,p(d),p(c),i))}};return ke(r,e?{add:$n("add"),set:$n("set"),delete:$n("delete"),clear:$n("clear")}:{add(s){const o=ce(this),i=jn(o),l=ce(s),a=!t&&!tt(s)&&!Mt(s)?l:s;return i.has.call(o,a)||bt(s,a)&&i.has.call(o,s)||bt(l,a)&&i.has.call(o,l)||(o.add(a),Ct(o,"add",a,a)),this},set(s,o){!t&&!tt(o)&&!Mt(o)&&(o=ce(o));const i=ce(this),{has:l,get:a}=jn(i);let p=l.call(i,s);p||(s=ce(s),p=l.call(i,s));const d=a.call(i,s);return i.set(s,o),p?bt(o,d)&&Ct(i,"set",s,o):Ct(i,"add",s,o),this},delete(s){const o=ce(this),{has:i,get:l}=jn(o);let a=i.call(o,s);a||(s=ce(s),a=i.call(o,s)),l&&l.call(o,s);const p=o.delete(s);return a&&Ct(o,"delete",s,void 0),p},clear(){const s=ce(this),o=s.size!==0,i=s.clear();return o&&Ct(s,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(s=>{r[s]=wl(s,e,t)}),r}function is(e,t){const r=Tl(e,t);return(n,s,o)=>s==="__v_isReactive"?!e:s==="__v_isReadonly"?e:s==="__v_raw"?n:Reflect.get(pe(r,s)&&s in n?r:n,s,o)}const Cl={get:is(!1,!1)},Rl={get:is(!1,!0)},Il={get:is(!0,!1)};const Vo=new WeakMap,Wo=new WeakMap,Jo=new WeakMap,Ol=new WeakMap;function Ml(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function kl(e){return e.__v_skip||!Object.isExtensible(e)?0:Ml(tl(e))}function dr(e){return Mt(e)?e:ls(e,!1,El,Cl,Vo)}function Ko(e){return ls(e,!1,Al,Rl,Wo)}function Br(e){return ls(e,!0,_l,Il,Jo)}function ls(e,t,r,n,s){if(!ue(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const o=kl(e);if(o===0)return e;const i=s.get(e);if(i)return i;const l=new Proxy(e,o===2?n:r);return s.set(e,l),l}function Xt(e){return Mt(e)?Xt(e.__v_raw):!!(e&&e.__v_isReactive)}function Mt(e){return!!(e&&e.__v_isReadonly)}function tt(e){return!!(e&&e.__v_isShallow)}function as(e){return e?!!e.__v_raw:!1}function ce(e){const t=e&&e.__v_raw;return t?ce(t):e}function Pl(e){return!pe(e,"__v_skip")&&Object.isExtensible(e)&&Io(e,"__v_skip",!0),e}const lt=e=>ue(e)?dr(e):e,pn=e=>ue(e)?Br(e):e;function Be(e){return e?e.__v_isRef===!0:!1}function ge(e){return Yo(e,!1)}function Dl(e){return Yo(e,!0)}function Yo(e,t){return Be(e)?e:new Nl(e,t)}class Nl{constructor(t,r){this.dep=new os,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=r?t:ce(t),this._value=r?t:lt(t),this.__v_isShallow=r}get value(){return this.dep.track(),this._value}set value(t){const r=this._rawValue,n=this.__v_isShallow||tt(t)||Mt(t);t=n?t:ce(t),bt(t,r)&&(this._rawValue=t,this._value=n?t:lt(t),this.dep.trigger())}}function Ye(e){return Be(e)?e.value:e}const Ll={get:(e,t,r)=>t==="__v_raw"?e:Ye(Reflect.get(e,t,r)),set:(e,t,r,n)=>{const s=e[t];return Be(s)&&!Be(r)?(s.value=r,!0):Reflect.set(e,t,r,n)}};function qo(e){return Xt(e)?e:new Proxy(e,Ll)}class Fl{constructor(t,r,n){this.fn=t,this.setter=r,this._value=void 0,this.dep=new os(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Rn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!r,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&be!==this)return No(this,!0),!0}get value(){const t=this.dep.track();return Ho(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function Hl(e,t,r=!1){let n,s;return X(e)?n=e:(n=e.get,s=e.set),new Fl(n,s,r)}const Gn={},Yn=new WeakMap;let Jt;function Bl(e,t=!1,r=Jt){if(r){let n=Yn.get(r);n||Yn.set(r,n=[]),n.push(e)}}function Ul(e,t,r=xe){const{immediate:n,deep:s,once:o,scheduler:i,augmentJob:l,call:a}=r,p=T=>s?T:tt(T)||s===!1||s===0?Rt(T,1):Rt(T);let d,c,f,y,L=!1,P=!1;if(Be(e)?(c=()=>e.value,L=tt(e)):Xt(e)?(c=()=>p(e),L=!0):z(e)?(P=!0,L=e.some(T=>Xt(T)||tt(T)),c=()=>e.map(T=>{if(Be(T))return T.value;if(Xt(T))return p(T);if(X(T))return a?a(T,2):T()})):X(e)?t?c=a?()=>a(e,2):e:c=()=>{if(f){It();try{f()}finally{Ot()}}const T=Jt;Jt=d;try{return a?a(e,3,[y]):e(y)}finally{Jt=T}}:c=yt,t&&s){const T=c,C=s===!0?1/0:s;c=()=>Rt(T(),C)}const H=gl(),j=()=>{d.stop(),H&&H.active&&es(H.effects,d)};if(o&&t){const T=t;t=(...C)=>{T(...C),j()}}let b=P?new Array(e.length).fill(Gn):Gn;const v=T=>{if(!(!(d.flags&1)||!d.dirty&&!T))if(t){const C=d.run();if(s||L||(P?C.some((R,S)=>bt(R,b[S])):bt(C,b))){f&&f();const R=Jt;Jt=d;try{const S=[C,b===Gn?void 0:P&&b[0]===Gn?[]:b,y];b=C,a?a(t,3,S):t(...S)}finally{Jt=R}}}else d.run()};return l&&l(v),d=new Po(c),d.scheduler=i?()=>i(v,!1):v,y=T=>Bl(T,!1,d),f=d.onStop=()=>{const T=Yn.get(d);if(T){if(a)a(T,4);else for(const C of T)C();Yn.delete(d)}},t?n?v(!0):b=d.run():i?i(v.bind(null,!0),!0):d.run(),j.pause=d.pause.bind(d),j.resume=d.resume.bind(d),j.stop=j,j}function Rt(e,t=1/0,r){if(t<=0||!ue(e)||e.__v_skip||(r=r||new Map,(r.get(e)||0)>=t))return e;if(r.set(e,t),t--,Be(e))Rt(e.value,t,r);else if(z(e))for(let n=0;n<e.length;n++)Rt(e[n],t,r);else if(sr(e)||on(e))e.forEach(n=>{Rt(n,t,r)});else if(Ro(e)){for(const n in e)Rt(e[n],t,r);for(const n of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,n)&&Rt(e[n],t,r)}return e}/**
* @vue/runtime-core v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Bn(e,t,r,n){try{return n?e(...n):e()}catch(s){pr(s,t,r)}}function at(e,t,r,n){if(X(e)){const s=Bn(e,t,r,n);return s&&To(s)&&s.catch(o=>{pr(o,t,r)}),s}if(z(e)){const s=[];for(let o=0;o<e.length;o++)s.push(at(e[o],t,r,n));return s}}function pr(e,t,r,n=!0){const s=t?t.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:i}=t&&t.appContext.config||xe;if(t){let l=t.parent;const a=t.proxy,p=`https://vuejs.org/error-reference/#runtime-${r}`;for(;l;){const d=l.ec;if(d){for(let c=0;c<d.length;c++)if(d[c](e,a,p)===!1)return}l=l.parent}if(o){It(),Bn(o,null,10,[e,a,p]),Ot();return}}jl(e,r,s,n,i)}function jl(e,t,r,n=!0,s=!1){if(s)throw e;console.error(e)}const $e=[];let gt=-1;const ln=[];let Ht=null,nn=0;const zo=Promise.resolve();let qn=null;function ur(e){const t=qn||zo;return e?t.then(this?e.bind(this):e):t}function $l(e){let t=gt+1,r=$e.length;for(;t<r;){const n=t+r>>>1,s=$e[n],o=On(s);o<e||o===e&&s.flags&2?t=n+1:r=n}return t}function cs(e){if(!(e.flags&1)){const t=On(e),r=$e[$e.length-1];!r||!(e.flags&2)&&t>=On(r)?$e.push(e):$e.splice($l(t),0,e),e.flags|=1,Xo()}}function Xo(){qn||(qn=zo.then(Zo))}function Gl(e){z(e)?ln.push(...e):Ht&&e.id===-1?Ht.splice(nn+1,0,e):e.flags&1||(ln.push(e),e.flags|=1),Xo()}function As(e,t,r=gt+1){for(;r<$e.length;r++){const n=$e[r];if(n&&n.flags&2){if(e&&n.id!==e.uid)continue;$e.splice(r,1),r--,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function Qo(e){if(ln.length){const t=[...new Set(ln)].sort((r,n)=>On(r)-On(n));if(ln.length=0,Ht){Ht.push(...t);return}for(Ht=t,nn=0;nn<Ht.length;nn++){const r=Ht[nn];r.flags&4&&(r.flags&=-2),r.flags&8||r(),r.flags&=-2}Ht=null,nn=0}}const On=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Zo(e){try{for(gt=0;gt<$e.length;gt++){const t=$e[gt];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),Bn(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;gt<$e.length;gt++){const t=$e[gt];t&&(t.flags&=-2)}gt=-1,$e.length=0,Qo(),qn=null,($e.length||ln.length)&&Zo()}}let De=null,ei=null;function zn(e){const t=De;return De=e,ei=e&&e.type.__scopeId||null,t}function rt(e,t=De,r){if(!t||e._n)return e;const n=(...s)=>{n._d&&Zn(-1);const o=zn(t);let i;try{i=e(...s)}finally{zn(o),n._d&&Zn(1)}return i};return n._n=!0,n._c=!0,n._d=!0,n}function ws(e,t){if(De===null)return e;const r=mr(De),n=e.dirs||(e.dirs=[]);for(let s=0;s<t.length;s++){let[o,i,l,a=xe]=t[s];o&&(X(o)&&(o={mounted:o,updated:o}),o.deep&&Rt(i),n.push({dir:o,instance:r,value:i,oldValue:void 0,arg:l,modifiers:a}))}return e}function $t(e,t,r,n){const s=e.dirs,o=t&&t.dirs;for(let i=0;i<s.length;i++){const l=s[i];o&&(l.oldValue=o[i].value);let a=l.dir[n];a&&(It(),at(a,r,8,[e.el,l,e,t]),Ot())}}function _n(e,t){if(He){let r=He.provides;const n=He.parent&&He.parent.provides;n===r&&(r=He.provides=Object.create(n)),r[e]=t}}function nt(e,t,r=!1){const n=Ni();if(n||cn){let s=cn?cn._context.provides:n?n.parent==null||n.ce?n.vnode.appContext&&n.vnode.appContext.provides:n.parent.provides:void 0;if(s&&e in s)return s[e];if(arguments.length>1)return r&&X(t)?t.call(n&&n.proxy):t}}const Vl=Symbol.for("v-scx"),Wl=()=>nt(Vl);function Qt(e,t,r){return ti(e,t,r)}function ti(e,t,r=xe){const{immediate:n,deep:s,flush:o,once:i}=r,l=ke({},r),a=t&&n||!t&&o!=="post";let p;if(Dn){if(o==="sync"){const y=Wl();p=y.__watcherHandles||(y.__watcherHandles=[])}else if(!a){const y=()=>{};return y.stop=yt,y.resume=yt,y.pause=yt,y}}const d=He;l.call=(y,L,P)=>at(y,d,L,P);let c=!1;o==="post"?l.scheduler=y=>{Je(y,d&&d.suspense)}:o!=="sync"&&(c=!0,l.scheduler=(y,L)=>{L?y():cs(y)}),l.augmentJob=y=>{t&&(y.flags|=4),c&&(y.flags|=2,d&&(y.id=d.uid,y.i=d))};const f=Ul(e,t,l);return Dn&&(p?p.push(f):a&&f()),f}function Jl(e,t,r){const n=this.proxy,s=Ae(e)?e.includes(".")?ni(n,e):()=>n[e]:e.bind(n,n);let o;X(t)?o=t:(o=t.handler,r=t);const i=Un(this),l=ti(s,o.bind(n),r);return i(),l}function ni(e,t){const r=t.split(".");return()=>{let n=e;for(let s=0;s<r.length&&n;s++)n=n[r[s]];return n}}const Kl=Symbol("_vte"),ri=e=>e.__isTeleport,ht=Symbol("_leaveCb"),xn=Symbol("_enterCb");function Yl(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return vt(()=>{e.isMounted=!0}),pi(()=>{e.isUnmounting=!0}),e}const et=[Function,Array],si={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:et,onEnter:et,onAfterEnter:et,onEnterCancelled:et,onBeforeLeave:et,onLeave:et,onAfterLeave:et,onLeaveCancelled:et,onBeforeAppear:et,onAppear:et,onAfterAppear:et,onAppearCancelled:et},oi=e=>{const t=e.subTree;return t.component?oi(t.component):t},ql={name:"BaseTransition",props:si,setup(e,{slots:t}){const r=Ni(),n=Yl();return()=>{const s=t.default&&ai(t.default(),!0);if(!s||!s.length)return;const o=ii(s),i=ce(e),{mode:l}=i;if(n.isLeaving)return wr(o);const a=Ts(o);if(!a)return wr(o);let p=Ur(a,i,n,r,c=>p=c);a.type!==Fe&&Mn(a,p);let d=r.subTree&&Ts(r.subTree);if(d&&d.type!==Fe&&!Kt(d,a)&&oi(r).type!==Fe){let c=Ur(d,i,n,r);if(Mn(d,c),l==="out-in"&&a.type!==Fe)return n.isLeaving=!0,c.afterLeave=()=>{n.isLeaving=!1,r.job.flags&8||r.update(),delete c.afterLeave,d=void 0},wr(o);l==="in-out"&&a.type!==Fe?c.delayLeave=(f,y,L)=>{const P=li(n,d);P[String(d.key)]=d,f[ht]=()=>{y(),f[ht]=void 0,delete p.delayedLeave,d=void 0},p.delayedLeave=()=>{L(),delete p.delayedLeave,d=void 0}}:d=void 0}else d&&(d=void 0);return o}}};function ii(e){let t=e[0];if(e.length>1){for(const r of e)if(r.type!==Fe){t=r;break}}return t}const zl=ql;function li(e,t){const{leavingVNodes:r}=e;let n=r.get(t.type);return n||(n=Object.create(null),r.set(t.type,n)),n}function Ur(e,t,r,n,s){const{appear:o,mode:i,persisted:l=!1,onBeforeEnter:a,onEnter:p,onAfterEnter:d,onEnterCancelled:c,onBeforeLeave:f,onLeave:y,onAfterLeave:L,onLeaveCancelled:P,onBeforeAppear:H,onAppear:j,onAfterAppear:b,onAppearCancelled:v}=t,T=String(e.key),C=li(r,e),R=(w,U)=>{w&&at(w,n,9,U)},S=(w,U)=>{const W=U[1];R(w,U),z(w)?w.every(B=>B.length<=1)&&W():w.length<=1&&W()},M={mode:i,persisted:l,beforeEnter(w){let U=a;if(!r.isMounted)if(o)U=H||a;else return;w[ht]&&w[ht](!0);const W=C[T];W&&Kt(e,W)&&W.el[ht]&&W.el[ht](),R(U,[w])},enter(w){if(C[T]===e)return;let U=p,W=d,B=c;if(!r.isMounted)if(o)U=j||p,W=b||d,B=v||c;else return;let Q=!1;w[xn]=we=>{Q||(Q=!0,we?R(B,[w]):R(W,[w]),M.delayedLeave&&M.delayedLeave(),w[xn]=void 0)};const se=w[xn].bind(null,!1);U?S(U,[w,se]):se()},leave(w,U){const W=String(e.key);if(w[xn]&&w[xn](!0),r.isUnmounting)return U();R(f,[w]);let B=!1;w[ht]=se=>{B||(B=!0,U(),se?R(P,[w]):R(L,[w]),w[ht]=void 0,C[W]===e&&delete C[W])};const Q=w[ht].bind(null,!1);C[W]=e,y?S(y,[w,Q]):Q()},clone(w){const U=Ur(w,t,r,n,s);return s&&s(U),U}};return M}function wr(e){if(fr(e))return e=jt(e),e.children=null,e}function Ts(e){if(!fr(e))return ri(e.type)&&e.children?ii(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:t,children:r}=e;if(r){if(t&16)return r[0];if(t&32&&X(r.default))return r.default()}}function Mn(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Mn(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function ai(e,t=!1,r){let n=[],s=0;for(let o=0;o<e.length;o++){let i=e[o];const l=r==null?i.key:String(r)+String(i.key!=null?i.key:o);i.type===me?(i.patchFlag&128&&s++,n=n.concat(ai(i.children,t,l))):(t||i.type!==Fe)&&n.push(l!=null?jt(i,{key:l}):i)}if(s>1)for(let o=0;o<n.length;o++)n[o].patchFlag=-2;return n}function Ve(e,t){return X(e)?ke({name:e.name},t,{setup:e}):e}function ci(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function Cs(e,t){let r;return!!((r=Object.getOwnPropertyDescriptor(e,t))&&!r.configurable)}const Xn=new WeakMap;function An(e,t,r,n,s=!1){if(z(e)){e.forEach((P,H)=>An(P,t&&(z(t)?t[H]:t),r,n,s));return}if(an(n)&&!s){n.shapeFlag&512&&n.type.__asyncResolved&&n.component.subTree.component&&An(e,t,r,n.component.subTree);return}const o=n.shapeFlag&4?mr(n.component):n.el,i=s?null:o,{i:l,r:a}=e,p=t&&t.r,d=l.refs===xe?l.refs={}:l.refs,c=l.setupState,f=ce(c),y=c===xe?wo:P=>Cs(d,P)?!1:pe(f,P),L=(P,H)=>!(H&&Cs(d,H));if(p!=null&&p!==a){if(Rs(t),Ae(p))d[p]=null,y(p)&&(c[p]=null);else if(Be(p)){const P=t;L(p,P.k)&&(p.value=null),P.k&&(d[P.k]=null)}}if(X(a))Bn(a,l,12,[i,d]);else{const P=Ae(a),H=Be(a);if(P||H){const j=()=>{if(e.f){const b=P?y(a)?c[a]:d[a]:L()||!e.k?a.value:d[e.k];if(s)z(b)&&es(b,o);else if(z(b))b.includes(o)||b.push(o);else if(P)d[a]=[o],y(a)&&(c[a]=d[a]);else{const v=[o];L(a,e.k)&&(a.value=v),e.k&&(d[e.k]=v)}}else P?(d[a]=i,y(a)&&(c[a]=i)):H&&(L(a,e.k)&&(a.value=i),e.k&&(d[e.k]=i))};if(i){const b=()=>{j(),Xn.delete(e)};b.id=-1,Xn.set(e,b),Je(b,r)}else Rs(e),j()}}}function Rs(e){const t=Xn.get(e);t&&(t.flags|=8,Xn.delete(e))}ar().requestIdleCallback;ar().cancelIdleCallback;const an=e=>!!e.type.__asyncLoader,fr=e=>e.type.__isKeepAlive;function Xl(e,t){di(e,"a",t)}function Ql(e,t){di(e,"da",t)}function di(e,t,r=He){const n=e.__wdc||(e.__wdc=()=>{let s=r;for(;s;){if(s.isDeactivated)return;s=s.parent}return e()});if(gr(t,n,r),r){let s=r.parent;for(;s&&s.parent;)fr(s.parent.vnode)&&Zl(n,t,r,s),s=s.parent}}function Zl(e,t,r,n){const s=gr(t,e,n,!0);en(()=>{es(n[t],s)},r)}function gr(e,t,r=He,n=!1){if(r){const s=r[e]||(r[e]=[]),o=t.__weh||(t.__weh=(...i)=>{It();const l=Un(r),a=at(t,r,e,i);return l(),Ot(),a});return n?s.unshift(o):s.push(o),o}}const kt=e=>(t,r=He)=>{(!Dn||e==="sp")&&gr(e,(...n)=>t(...n),r)},ea=kt("bm"),vt=kt("m"),ta=kt("bu"),na=kt("u"),pi=kt("bum"),en=kt("um"),ra=kt("sp"),sa=kt("rtg"),oa=kt("rtc");function ia(e,t=He){gr("ec",e,t)}const ui="components";function la(e,t){return gi(ui,e,!0,t)||e}const fi=Symbol.for("v-ndc");function aa(e){return Ae(e)?gi(ui,e,!1)||e:e||fi}function gi(e,t,r=!0,n=!1){const s=De||He;if(s){const o=s.type;{const l=Ya(o,!1);if(l&&(l===t||l===Ge(t)||l===ir(Ge(t))))return o}const i=Is(s[e]||o[e],t)||Is(s.appContext[e],t);return!i&&n?o:i}}function Is(e,t){return e&&(e[t]||e[Ge(t)]||e[ir(Ge(t))])}function ot(e,t,r,n){let s;const o=r,i=z(e);if(i||Ae(e)){const l=i&&Xt(e);let a=!1,p=!1;l&&(a=!tt(e),p=Mt(e),e=cr(e)),s=new Array(e.length);for(let d=0,c=e.length;d<c;d++)s[d]=t(a?p?pn(lt(e[d])):lt(e[d]):e[d],d,void 0,o)}else if(typeof e=="number"){s=new Array(e);for(let l=0;l<e;l++)s[l]=t(l+1,l,void 0,o)}else if(ue(e))if(e[Symbol.iterator])s=Array.from(e,(l,a)=>t(l,a,void 0,o));else{const l=Object.keys(e);s=new Array(l.length);for(let a=0,p=l.length;a<p;a++){const d=l[a];s[a]=t(e[d],d,a,o)}}else s=[];return s}function ca(e,t,r={},n,s){if(De.ce||De.parent&&an(De.parent)&&De.parent.ce){const p=Object.keys(r).length>0;return q(),Ze(me,null,[he("slot",r,n)],p?-2:64)}let o=e[t];o&&o._c&&(o._d=!1),q();const i=o&&hi(o(r)),l=r.key||i&&i.key,a=Ze(me,{key:(l&&!it(l)?l:`_${t}`)+(!i&&n?"_fb":"")},i||[],i&&e._===1?64:-2);return o&&o._c&&(o._d=!0),a}function hi(e){return e.some(t=>Pn(t)?!(t.type===Fe||t.type===me&&!hi(t.children)):!0)?e:null}const jr=e=>e?Li(e)?mr(e):jr(e.parent):null,wn=ke(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>jr(e.parent),$root:e=>jr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>mi(e),$forceUpdate:e=>e.f||(e.f=()=>{cs(e.update)}),$nextTick:e=>e.n||(e.n=ur.bind(e.proxy)),$watch:e=>Jl.bind(e)}),Tr=(e,t)=>e!==xe&&!e.__isScriptSetup&&pe(e,t),da={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:r,setupState:n,data:s,props:o,accessCache:i,type:l,appContext:a}=e;if(t[0]!=="$"){const f=i[t];if(f!==void 0)switch(f){case 1:return n[t];case 2:return s[t];case 4:return r[t];case 3:return o[t]}else{if(Tr(n,t))return i[t]=1,n[t];if(s!==xe&&pe(s,t))return i[t]=2,s[t];if(pe(o,t))return i[t]=3,o[t];if(r!==xe&&pe(r,t))return i[t]=4,r[t];$r&&(i[t]=0)}}const p=wn[t];let d,c;if(p)return t==="$attrs"&&Le(e.attrs,"get",""),p(e);if((d=l.__cssModules)&&(d=d[t]))return d;if(r!==xe&&pe(r,t))return i[t]=4,r[t];if(c=a.config.globalProperties,pe(c,t))return c[t]},set({_:e},t,r){const{data:n,setupState:s,ctx:o}=e;return Tr(s,t)?(s[t]=r,!0):n!==xe&&pe(n,t)?(n[t]=r,!0):pe(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(o[t]=r,!0)},has({_:{data:e,setupState:t,accessCache:r,ctx:n,appContext:s,props:o,type:i}},l){let a;return!!(r[l]||e!==xe&&l[0]!=="$"&&pe(e,l)||Tr(t,l)||pe(o,l)||pe(n,l)||pe(wn,l)||pe(s.config.globalProperties,l)||(a=i.__cssModules)&&a[l])},defineProperty(e,t,r){return r.get!=null?e._.accessCache[t]=0:pe(r,"value")&&this.set(e,t,r.value,null),Reflect.defineProperty(e,t,r)}};function Os(e){return z(e)?e.reduce((t,r)=>(t[r]=null,t),{}):e}let $r=!0;function pa(e){const t=mi(e),r=e.proxy,n=e.ctx;$r=!1,t.beforeCreate&&Ms(t.beforeCreate,e,"bc");const{data:s,computed:o,methods:i,watch:l,provide:a,inject:p,created:d,beforeMount:c,mounted:f,beforeUpdate:y,updated:L,activated:P,deactivated:H,beforeDestroy:j,beforeUnmount:b,destroyed:v,unmounted:T,render:C,renderTracked:R,renderTriggered:S,errorCaptured:M,serverPrefetch:w,expose:U,inheritAttrs:W,components:B,directives:Q,filters:se}=t;if(p&&ua(p,n,null),i)for(const re in i){const K=i[re];X(K)&&(n[re]=K.bind(r))}if(s){const re=s.call(r,r);ue(re)&&(e.data=dr(re))}if($r=!0,o)for(const re in o){const K=o[re],fe=X(K)?K.bind(r,r):X(K.get)?K.get.bind(r,r):yt,Re=!X(K)&&X(K.set)?K.set.bind(r):yt,Ie=Te({get:fe,set:Re});Object.defineProperty(n,re,{enumerable:!0,configurable:!0,get:()=>Ie.value,set:ae=>Ie.value=ae})}if(l)for(const re in l)xi(l[re],n,r,re);if(a){const re=X(a)?a.call(r):a;Reflect.ownKeys(re).forEach(K=>{_n(K,re[K])})}d&&Ms(d,e,"c");function oe(re,K){z(K)?K.forEach(fe=>re(fe.bind(r))):K&&re(K.bind(r))}if(oe(ea,c),oe(vt,f),oe(ta,y),oe(na,L),oe(Xl,P),oe(Ql,H),oe(ia,M),oe(oa,R),oe(sa,S),oe(pi,b),oe(en,T),oe(ra,w),z(U))if(U.length){const re=e.exposed||(e.exposed={});U.forEach(K=>{Object.defineProperty(re,K,{get:()=>r[K],set:fe=>r[K]=fe,enumerable:!0})})}else e.exposed||(e.exposed={});C&&e.render===yt&&(e.render=C),W!=null&&(e.inheritAttrs=W),B&&(e.components=B),Q&&(e.directives=Q),w&&ci(e)}function ua(e,t,r=yt){z(e)&&(e=Gr(e));for(const n in e){const s=e[n];let o;ue(s)?"default"in s?o=nt(s.from||n,s.default,!0):o=nt(s.from||n):o=nt(s),Be(o)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>o.value,set:i=>o.value=i}):t[n]=o}}function Ms(e,t,r){at(z(e)?e.map(n=>n.bind(t.proxy)):e.bind(t.proxy),t,r)}function xi(e,t,r,n){let s=n.includes(".")?ni(r,n):()=>r[n];if(Ae(e)){const o=t[e];X(o)&&Qt(s,o)}else if(X(e))Qt(s,e.bind(r));else if(ue(e))if(z(e))e.forEach(o=>xi(o,t,r,n));else{const o=X(e.handler)?e.handler.bind(r):t[e.handler];X(o)&&Qt(s,o,e)}}function mi(e){const t=e.type,{mixins:r,extends:n}=t,{mixins:s,optionsCache:o,config:{optionMergeStrategies:i}}=e.appContext,l=o.get(t);let a;return l?a=l:!s.length&&!r&&!n?a=t:(a={},s.length&&s.forEach(p=>Qn(a,p,i,!0)),Qn(a,t,i)),ue(t)&&o.set(t,a),a}function Qn(e,t,r,n=!1){const{mixins:s,extends:o}=t;o&&Qn(e,o,r,!0),s&&s.forEach(i=>Qn(e,i,r,!0));for(const i in t)if(!(n&&i==="expose")){const l=fa[i]||r&&r[i];e[i]=l?l(e[i],t[i]):t[i]}return e}const fa={data:ks,props:Ps,emits:Ps,methods:yn,computed:yn,beforeCreate:Ue,created:Ue,beforeMount:Ue,mounted:Ue,beforeUpdate:Ue,updated:Ue,beforeDestroy:Ue,beforeUnmount:Ue,destroyed:Ue,unmounted:Ue,activated:Ue,deactivated:Ue,errorCaptured:Ue,serverPrefetch:Ue,components:yn,directives:yn,watch:ha,provide:ks,inject:ga};function ks(e,t){return t?e?function(){return ke(X(e)?e.call(this,this):e,X(t)?t.call(this,this):t)}:t:e}function ga(e,t){return yn(Gr(e),Gr(t))}function Gr(e){if(z(e)){const t={};for(let r=0;r<e.length;r++)t[e[r]]=e[r];return t}return e}function Ue(e,t){return e?[...new Set([].concat(e,t))]:t}function yn(e,t){return e?ke(Object.create(null),e,t):t}function Ps(e,t){return e?z(e)&&z(t)?[...new Set([...e,...t])]:ke(Object.create(null),Os(e),Os(t??{})):t}function ha(e,t){if(!e)return t;if(!t)return e;const r=ke(Object.create(null),e);for(const n in t)r[n]=Ue(e[n],t[n]);return r}function bi(){return{app:null,config:{isNativeTag:wo,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let xa=0;function ma(e,t){return function(n,s=null){X(n)||(n=ke({},n)),s!=null&&!ue(s)&&(s=null);const o=bi(),i=new WeakSet,l=[];let a=!1;const p=o.app={_uid:xa++,_component:n,_props:s,_container:null,_context:o,_instance:null,version:za,get config(){return o.config},set config(d){},use(d,...c){return i.has(d)||(d&&X(d.install)?(i.add(d),d.install(p,...c)):X(d)&&(i.add(d),d(p,...c))),p},mixin(d){return o.mixins.includes(d)||o.mixins.push(d),p},component(d,c){return c?(o.components[d]=c,p):o.components[d]},directive(d,c){return c?(o.directives[d]=c,p):o.directives[d]},mount(d,c,f){if(!a){const y=p._ceVNode||he(n,s);return y.appContext=o,f===!0?f="svg":f===!1&&(f=void 0),e(y,d,f),a=!0,p._container=d,d.__vue_app__=p,mr(y.component)}},onUnmount(d){l.push(d)},unmount(){a&&(at(l,p._instance,16),e(null,p._container),delete p._container.__vue_app__)},provide(d,c){return o.provides[d]=c,p},runWithContext(d){const c=cn;cn=p;try{return d()}finally{cn=c}}};return p}}let cn=null;const ba=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Ge(t)}Modifiers`]||e[`${Zt(t)}Modifiers`];function ya(e,t,...r){if(e.isUnmounted)return;const n=e.vnode.props||xe;let s=r;const o=t.startsWith("update:"),i=o&&ba(n,t.slice(7));i&&(i.trim&&(s=r.map(d=>Ae(d)?d.trim():d)),i.number&&(s=r.map(lr)));let l,a=n[l=vr(t)]||n[l=vr(Ge(t))];!a&&o&&(a=n[l=vr(Zt(t))]),a&&at(a,e,6,s);const p=n[l+"Once"];if(p){if(!e.emitted)e.emitted={};else if(e.emitted[l])return;e.emitted[l]=!0,at(p,e,6,s)}}const va=new WeakMap;function yi(e,t,r=!1){const n=r?va:t.emitsCache,s=n.get(e);if(s!==void 0)return s;const o=e.emits;let i={},l=!1;if(!X(e)){const a=p=>{const d=yi(p,t,!0);d&&(l=!0,ke(i,d))};!r&&t.mixins.length&&t.mixins.forEach(a),e.extends&&a(e.extends),e.mixins&&e.mixins.forEach(a)}return!o&&!l?(ue(e)&&n.set(e,null),null):(z(o)?o.forEach(a=>i[a]=null):ke(i,o),ue(e)&&n.set(e,i),i)}function hr(e,t){return!e||!rr(t)?!1:(t=t.slice(2).replace(/Once$/,""),pe(e,t[0].toLowerCase()+t.slice(1))||pe(e,Zt(t))||pe(e,t))}function Ds(e){const{type:t,vnode:r,proxy:n,withProxy:s,propsOptions:[o],slots:i,attrs:l,emit:a,render:p,renderCache:d,props:c,data:f,setupState:y,ctx:L,inheritAttrs:P}=e,H=zn(e);let j,b;try{if(r.shapeFlag&4){const T=s||n,C=T;j=mt(p.call(C,T,d,c,y,f,L)),b=l}else{const T=t;j=mt(T.length>1?T(c,{attrs:l,slots:i,emit:a}):T(c,null)),b=t.props?l:Sa(l)}}catch(T){Tn.length=0,pr(T,e,1),j=he(Fe)}let v=j;if(b&&P!==!1){const T=Object.keys(b),{shapeFlag:C}=v;T.length&&C&7&&(o&&T.some(Zr)&&(b=Ea(b,o)),v=jt(v,b,!1,!0))}return r.dirs&&(v=jt(v,null,!1,!0),v.dirs=v.dirs?v.dirs.concat(r.dirs):r.dirs),r.transition&&Mn(v,r.transition),j=v,zn(H),j}const Sa=e=>{let t;for(const r in e)(r==="class"||r==="style"||rr(r))&&((t||(t={}))[r]=e[r]);return t},Ea=(e,t)=>{const r={};for(const n in e)(!Zr(n)||!(n.slice(9)in t))&&(r[n]=e[n]);return r};function _a(e,t,r){const{props:n,children:s,component:o}=e,{props:i,children:l,patchFlag:a}=t,p=o.emitsOptions;if(t.dirs||t.transition)return!0;if(r&&a>=0){if(a&1024)return!0;if(a&16)return n?Ns(n,i,p):!!i;if(a&8){const d=t.dynamicProps;for(let c=0;c<d.length;c++){const f=d[c];if(vi(i,n,f)&&!hr(p,f))return!0}}}else return(s||l)&&(!l||!l.$stable)?!0:n===i?!1:n?i?Ns(n,i,p):!0:!!i;return!1}function Ns(e,t,r){const n=Object.keys(t);if(n.length!==Object.keys(e).length)return!0;for(let s=0;s<n.length;s++){const o=n[s];if(vi(t,e,o)&&!hr(r,o))return!0}return!1}function vi(e,t,r){const n=e[r],s=t[r];return r==="style"&&ue(n)&&ue(s)?!Hn(n,s):n!==s}function Aa({vnode:e,parent:t},r){for(;t;){const n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.el=e.el),n===e)(e=t.vnode).el=r,t=t.parent;else break}}const Si={},Ei=()=>Object.create(Si),_i=e=>Object.getPrototypeOf(e)===Si;function wa(e,t,r,n=!1){const s={},o=Ei();e.propsDefaults=Object.create(null),Ai(e,t,s,o);for(const i in e.propsOptions[0])i in s||(s[i]=void 0);r?e.props=n?s:Ko(s):e.type.props?e.props=s:e.props=o,e.attrs=o}function Ta(e,t,r,n){const{props:s,attrs:o,vnode:{patchFlag:i}}=e,l=ce(s),[a]=e.propsOptions;let p=!1;if((n||i>0)&&!(i&16)){if(i&8){const d=e.vnode.dynamicProps;for(let c=0;c<d.length;c++){let f=d[c];if(hr(e.emitsOptions,f))continue;const y=t[f];if(a)if(pe(o,f))y!==o[f]&&(o[f]=y,p=!0);else{const L=Ge(f);s[L]=Vr(a,l,L,y,e,!1)}else y!==o[f]&&(o[f]=y,p=!0)}}}else{Ai(e,t,s,o)&&(p=!0);let d;for(const c in l)(!t||!pe(t,c)&&((d=Zt(c))===c||!pe(t,d)))&&(a?r&&(r[c]!==void 0||r[d]!==void 0)&&(s[c]=Vr(a,l,c,void 0,e,!0)):delete s[c]);if(o!==l)for(const c in o)(!t||!pe(t,c))&&(delete o[c],p=!0)}p&&Ct(e.attrs,"set","")}function Ai(e,t,r,n){const[s,o]=e.propsOptions;let i=!1,l;if(t)for(let a in t){if(vn(a))continue;const p=t[a];let d;s&&pe(s,d=Ge(a))?!o||!o.includes(d)?r[d]=p:(l||(l={}))[d]=p:hr(e.emitsOptions,a)||(!(a in n)||p!==n[a])&&(n[a]=p,i=!0)}if(o){const a=ce(r),p=l||xe;for(let d=0;d<o.length;d++){const c=o[d];r[c]=Vr(s,a,c,p[c],e,!pe(p,c))}}return i}function Vr(e,t,r,n,s,o){const i=e[r];if(i!=null){const l=pe(i,"default");if(l&&n===void 0){const a=i.default;if(i.type!==Function&&!i.skipFactory&&X(a)){const{propsDefaults:p}=s;if(r in p)n=p[r];else{const d=Un(s);n=p[r]=a.call(null,t),d()}}else n=a;s.ce&&s.ce._setProp(r,n)}i[0]&&(o&&!l?n=!1:i[1]&&(n===""||n===Zt(r))&&(n=!0))}return n}const Ca=new WeakMap;function wi(e,t,r=!1){const n=r?Ca:t.propsCache,s=n.get(e);if(s)return s;const o=e.props,i={},l=[];let a=!1;if(!X(e)){const d=c=>{a=!0;const[f,y]=wi(c,t,!0);ke(i,f),y&&l.push(...y)};!r&&t.mixins.length&&t.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!o&&!a)return ue(e)&&n.set(e,sn),sn;if(z(o))for(let d=0;d<o.length;d++){const c=Ge(o[d]);Ls(c)&&(i[c]=xe)}else if(o)for(const d in o){const c=Ge(d);if(Ls(c)){const f=o[d],y=i[c]=z(f)||X(f)?{type:f}:ke({},f),L=y.type;let P=!1,H=!0;if(z(L))for(let j=0;j<L.length;++j){const b=L[j],v=X(b)&&b.name;if(v==="Boolean"){P=!0;break}else v==="String"&&(H=!1)}else P=X(L)&&L.name==="Boolean";y[0]=P,y[1]=H,(P||pe(y,"default"))&&l.push(c)}}const p=[i,l];return ue(e)&&n.set(e,p),p}function Ls(e){return e[0]!=="$"&&!vn(e)}const ds=e=>e==="_"||e==="_ctx"||e==="$stable",ps=e=>z(e)?e.map(mt):[mt(e)],Ra=(e,t,r)=>{if(t._n)return t;const n=rt((...s)=>ps(t(...s)),r);return n._c=!1,n},Ti=(e,t,r)=>{const n=e._ctx;for(const s in e){if(ds(s))continue;const o=e[s];if(X(o))t[s]=Ra(s,o,n);else if(o!=null){const i=ps(o);t[s]=()=>i}}},Ci=(e,t)=>{const r=ps(t);e.slots.default=()=>r},Ri=(e,t,r)=>{for(const n in t)(r||!ds(n))&&(e[n]=t[n])},Ia=(e,t,r)=>{const n=e.slots=Ei();if(e.vnode.shapeFlag&32){const s=t._;s?(Ri(n,t,r),r&&Io(n,"_",s,!0)):Ti(t,n)}else t&&Ci(e,t)},Oa=(e,t,r)=>{const{vnode:n,slots:s}=e;let o=!0,i=xe;if(n.shapeFlag&32){const l=t._;l?r&&l===1?o=!1:Ri(s,t,r):(o=!t.$stable,Ti(t,s)),i=t}else t&&(Ci(e,t),i={default:1});if(o)for(const l in s)!ds(l)&&i[l]==null&&delete s[l]},Je=Na;function Ma(e){return ka(e)}function ka(e,t){const r=ar();r.__VUE__=!0;const{insert:n,remove:s,patchProp:o,createElement:i,createText:l,createComment:a,setText:p,setElementText:d,parentNode:c,nextSibling:f,setScopeId:y=yt,insertStaticContent:L}=e,P=(g,h,A,D=null,m=null,x=null,E=void 0,k=null,O=!!h.dynamicChildren)=>{if(g===h)return;g&&!Kt(g,h)&&(D=I(g),ae(g,m,x,!0),g=null),h.patchFlag===-2&&(O=!1,h.dynamicChildren=null);const{type:u,ref:N,shapeFlag:F}=h;switch(u){case xr:H(g,h,A,D);break;case Fe:j(g,h,A,D);break;case Wn:g==null&&b(h,A,D,E);break;case me:B(g,h,A,D,m,x,E,k,O);break;default:F&1?C(g,h,A,D,m,x,E,k,O):F&6?Q(g,h,A,D,m,x,E,k,O):(F&64||F&128)&&u.process(g,h,A,D,m,x,E,k,O,J)}N!=null&&m?An(N,g&&g.ref,x,h||g,!h):N==null&&g&&g.ref!=null&&An(g.ref,null,x,g,!0)},H=(g,h,A,D)=>{if(g==null)n(h.el=l(h.children),A,D);else{const m=h.el=g.el;h.children!==g.children&&p(m,h.children)}},j=(g,h,A,D)=>{g==null?n(h.el=a(h.children||""),A,D):h.el=g.el},b=(g,h,A,D)=>{[g.el,g.anchor]=L(g.children,h,A,D,g.el,g.anchor)},v=({el:g,anchor:h},A,D)=>{let m;for(;g&&g!==h;)m=f(g),n(g,A,D),g=m;n(h,A,D)},T=({el:g,anchor:h})=>{let A;for(;g&&g!==h;)A=f(g),s(g),g=A;s(h)},C=(g,h,A,D,m,x,E,k,O)=>{if(h.type==="svg"?E="svg":h.type==="math"&&(E="mathml"),g==null)R(h,A,D,m,x,E,k,O);else{const u=g.el&&g.el._isVueCE?g.el:null;try{u&&u._beginPatch(),w(g,h,m,x,E,k,O)}finally{u&&u._endPatch()}}},R=(g,h,A,D,m,x,E,k)=>{let O,u;const{props:N,shapeFlag:F,transition:G,dirs:Y}=g;if(O=g.el=i(g.type,x,N&&N.is,N),F&8?d(O,g.children):F&16&&M(g.children,O,null,D,m,Cr(g,x),E,k),Y&&$t(g,null,D,"created"),S(O,g,g.scopeId,E,D),N){for(const le in N)le!=="value"&&!vn(le)&&o(O,le,null,N[le],x,D);"value"in N&&o(O,"value",null,N.value,x),(u=N.onVnodeBeforeMount)&&ft(u,D,g)}Y&&$t(g,null,D,"beforeMount");const te=Pa(m,G);te&&G.beforeEnter(O),n(O,h,A),((u=N&&N.onVnodeMounted)||te||Y)&&Je(()=>{u&&ft(u,D,g),te&&G.enter(O),Y&&$t(g,null,D,"mounted")},m)},S=(g,h,A,D,m)=>{if(A&&y(g,A),D)for(let x=0;x<D.length;x++)y(g,D[x]);if(m){let x=m.subTree;if(h===x||ki(x.type)&&(x.ssContent===h||x.ssFallback===h)){const E=m.vnode;S(g,E,E.scopeId,E.slotScopeIds,m.parent)}}},M=(g,h,A,D,m,x,E,k,O=0)=>{for(let u=O;u<g.length;u++){const N=g[u]=k?Tt(g[u]):mt(g[u]);P(null,N,h,A,D,m,x,E,k)}},w=(g,h,A,D,m,x,E)=>{const k=h.el=g.el;let{patchFlag:O,dynamicChildren:u,dirs:N}=h;O|=g.patchFlag&16;const F=g.props||xe,G=h.props||xe;let Y;if(A&&Gt(A,!1),(Y=G.onVnodeBeforeUpdate)&&ft(Y,A,h,g),N&&$t(h,g,A,"beforeUpdate"),A&&Gt(A,!0),(F.innerHTML&&G.innerHTML==null||F.textContent&&G.textContent==null)&&d(k,""),u?U(g.dynamicChildren,u,k,A,D,Cr(h,m),x):E||K(g,h,k,null,A,D,Cr(h,m),x,!1),O>0){if(O&16)W(k,F,G,A,m);else if(O&2&&F.class!==G.class&&o(k,"class",null,G.class,m),O&4&&o(k,"style",F.style,G.style,m),O&8){const te=h.dynamicProps;for(let le=0;le<te.length;le++){const ne=te[le],Oe=F[ne],We=G[ne];(We!==Oe||ne==="value")&&o(k,ne,Oe,We,m,A)}}O&1&&g.children!==h.children&&d(k,h.children)}else!E&&u==null&&W(k,F,G,A,m);((Y=G.onVnodeUpdated)||N)&&Je(()=>{Y&&ft(Y,A,h,g),N&&$t(h,g,A,"updated")},D)},U=(g,h,A,D,m,x,E)=>{for(let k=0;k<h.length;k++){const O=g[k],u=h[k],N=O.el&&(O.type===me||!Kt(O,u)||O.shapeFlag&198)?c(O.el):A;P(O,u,N,null,D,m,x,E,!0)}},W=(g,h,A,D,m)=>{if(h!==A){if(h!==xe)for(const x in h)!vn(x)&&!(x in A)&&o(g,x,h[x],null,m,D);for(const x in A){if(vn(x))continue;const E=A[x],k=h[x];E!==k&&x!=="value"&&o(g,x,k,E,m,D)}"value"in A&&o(g,"value",h.value,A.value,m)}},B=(g,h,A,D,m,x,E,k,O)=>{const u=h.el=g?g.el:l(""),N=h.anchor=g?g.anchor:l("");let{patchFlag:F,dynamicChildren:G,slotScopeIds:Y}=h;Y&&(k=k?k.concat(Y):Y),g==null?(n(u,A,D),n(N,A,D),M(h.children||[],A,N,m,x,E,k,O)):F>0&&F&64&&G&&g.dynamicChildren&&g.dynamicChildren.length===G.length?(U(g.dynamicChildren,G,A,m,x,E,k),(h.key!=null||m&&h===m.subTree)&&Ii(g,h,!0)):K(g,h,A,N,m,x,E,k,O)},Q=(g,h,A,D,m,x,E,k,O)=>{h.slotScopeIds=k,g==null?h.shapeFlag&512?m.ctx.activate(h,A,D,E,O):se(h,A,D,m,x,E,O):we(g,h,O)},se=(g,h,A,D,m,x,E)=>{const k=g.component=Ga(g,D,m);if(fr(g)&&(k.ctx.renderer=J),Va(k,!1,E),k.asyncDep){if(m&&m.registerDep(k,oe,E),!g.el){const O=k.subTree=he(Fe);j(null,O,h,A),g.placeholder=O.el}}else oe(k,g,h,A,m,x,E)},we=(g,h,A)=>{const D=h.component=g.component;if(_a(g,h,A))if(D.asyncDep&&!D.asyncResolved){re(D,h,A);return}else D.next=h,D.update();else h.el=g.el,D.vnode=h},oe=(g,h,A,D,m,x,E)=>{const k=()=>{if(g.isMounted){let{next:F,bu:G,u:Y,parent:te,vnode:le}=g;{const pt=Oi(g);if(pt){F&&(F.el=le.el,re(g,F,E)),pt.asyncDep.then(()=>{Je(()=>{g.isUnmounted||u()},m)});return}}let ne=F,Oe;Gt(g,!1),F?(F.el=le.el,re(g,F,E)):F=le,G&&Vn(G),(Oe=F.props&&F.props.onVnodeBeforeUpdate)&&ft(Oe,te,F,le),Gt(g,!0);const We=Ds(g),dt=g.subTree;g.subTree=We,P(dt,We,c(dt.el),I(dt),g,m,x),F.el=We.el,ne===null&&Aa(g,We.el),Y&&Je(Y,m),(Oe=F.props&&F.props.onVnodeUpdated)&&Je(()=>ft(Oe,te,F,le),m)}else{let F;const{el:G,props:Y}=h,{bm:te,m:le,parent:ne,root:Oe,type:We}=g,dt=an(h);Gt(g,!1),te&&Vn(te),!dt&&(F=Y&&Y.onVnodeBeforeMount)&&ft(F,ne,h),Gt(g,!0);{Oe.ce&&Oe.ce._hasShadowRoot()&&Oe.ce._injectChildStyle(We,g.parent?g.parent.type:void 0);const pt=g.subTree=Ds(g);P(null,pt,A,D,g,m,x),h.el=pt.el}if(le&&Je(le,m),!dt&&(F=Y&&Y.onVnodeMounted)){const pt=h;Je(()=>ft(F,ne,pt),m)}(h.shapeFlag&256||ne&&an(ne.vnode)&&ne.vnode.shapeFlag&256)&&g.a&&Je(g.a,m),g.isMounted=!0,h=A=D=null}};g.scope.on();const O=g.effect=new Po(k);g.scope.off();const u=g.update=O.run.bind(O),N=g.job=O.runIfDirty.bind(O);N.i=g,N.id=g.uid,O.scheduler=()=>cs(N),Gt(g,!0),u()},re=(g,h,A)=>{h.component=g;const D=g.vnode.props;g.vnode=h,g.next=null,Ta(g,h.props,D,A),Oa(g,h.children,A),It(),As(g),Ot()},K=(g,h,A,D,m,x,E,k,O=!1)=>{const u=g&&g.children,N=g?g.shapeFlag:0,F=h.children,{patchFlag:G,shapeFlag:Y}=h;if(G>0){if(G&128){Re(u,F,A,D,m,x,E,k,O);return}else if(G&256){fe(u,F,A,D,m,x,E,k,O);return}}Y&8?(N&16&&Se(u,m,x),F!==u&&d(A,F)):N&16?Y&16?Re(u,F,A,D,m,x,E,k,O):Se(u,m,x,!0):(N&8&&d(A,""),Y&16&&M(F,A,D,m,x,E,k,O))},fe=(g,h,A,D,m,x,E,k,O)=>{g=g||sn,h=h||sn;const u=g.length,N=h.length,F=Math.min(u,N);let G;for(G=0;G<F;G++){const Y=h[G]=O?Tt(h[G]):mt(h[G]);P(g[G],Y,A,null,m,x,E,k,O)}u>N?Se(g,m,x,!0,!1,F):M(h,A,D,m,x,E,k,O,F)},Re=(g,h,A,D,m,x,E,k,O)=>{let u=0;const N=h.length;let F=g.length-1,G=N-1;for(;u<=F&&u<=G;){const Y=g[u],te=h[u]=O?Tt(h[u]):mt(h[u]);if(Kt(Y,te))P(Y,te,A,null,m,x,E,k,O);else break;u++}for(;u<=F&&u<=G;){const Y=g[F],te=h[G]=O?Tt(h[G]):mt(h[G]);if(Kt(Y,te))P(Y,te,A,null,m,x,E,k,O);else break;F--,G--}if(u>F){if(u<=G){const Y=G+1,te=Y<N?h[Y].el:D;for(;u<=G;)P(null,h[u]=O?Tt(h[u]):mt(h[u]),A,te,m,x,E,k,O),u++}}else if(u>G)for(;u<=F;)ae(g[u],m,x,!0),u++;else{const Y=u,te=u,le=new Map;for(u=te;u<=G;u++){const ze=h[u]=O?Tt(h[u]):mt(h[u]);ze.key!=null&&le.set(ze.key,u)}let ne,Oe=0;const We=G-te+1;let dt=!1,pt=0;const gn=new Array(We);for(u=0;u<We;u++)gn[u]=0;for(u=Y;u<=F;u++){const ze=g[u];if(Oe>=We){ae(ze,m,x,!0);continue}let ut;if(ze.key!=null)ut=le.get(ze.key);else for(ne=te;ne<=G;ne++)if(gn[ne-te]===0&&Kt(ze,h[ne])){ut=ne;break}ut===void 0?ae(ze,m,x,!0):(gn[ut-te]=u+1,ut>=pt?pt=ut:dt=!0,P(ze,h[ut],A,null,m,x,E,k,O),Oe++)}const ms=dt?Da(gn):sn;for(ne=ms.length-1,u=We-1;u>=0;u--){const ze=te+u,ut=h[ze],bs=h[ze+1],ys=ze+1<N?bs.el||Mi(bs):D;gn[u]===0?P(null,ut,A,ys,m,x,E,k,O):dt&&(ne<0||u!==ms[ne]?Ie(ut,A,ys,2):ne--)}}},Ie=(g,h,A,D,m=null)=>{const{el:x,type:E,transition:k,children:O,shapeFlag:u}=g;if(u&6){Ie(g.component.subTree,h,A,D);return}if(u&128){g.suspense.move(h,A,D);return}if(u&64){E.move(g,h,A,J);return}if(E===me){n(x,h,A);for(let F=0;F<O.length;F++)Ie(O[F],h,A,D);n(g.anchor,h,A);return}if(E===Wn){v(g,h,A);return}if(D!==2&&u&1&&k)if(D===0)k.beforeEnter(x),n(x,h,A),Je(()=>k.enter(x),m);else{const{leave:F,delayLeave:G,afterLeave:Y}=k,te=()=>{g.ctx.isUnmounted?s(x):n(x,h,A)},le=()=>{x._isLeaving&&x[ht](!0),F(x,()=>{te(),Y&&Y()})};G?G(x,te,le):le()}else n(x,h,A)},ae=(g,h,A,D=!1,m=!1)=>{const{type:x,props:E,ref:k,children:O,dynamicChildren:u,shapeFlag:N,patchFlag:F,dirs:G,cacheIndex:Y}=g;if(F===-2&&(m=!1),k!=null&&(It(),An(k,null,A,g,!0),Ot()),Y!=null&&(h.renderCache[Y]=void 0),N&256){h.ctx.deactivate(g);return}const te=N&1&&G,le=!an(g);let ne;if(le&&(ne=E&&E.onVnodeBeforeUnmount)&&ft(ne,h,g),N&6)ve(g.component,A,D);else{if(N&128){g.suspense.unmount(A,D);return}te&&$t(g,null,h,"beforeUnmount"),N&64?g.type.remove(g,h,A,J,D):u&&!u.hasOnce&&(x!==me||F>0&&F&64)?Se(u,h,A,!1,!0):(x===me&&F&384||!m&&N&16)&&Se(O,h,A),D&&qe(g)}(le&&(ne=E&&E.onVnodeUnmounted)||te)&&Je(()=>{ne&&ft(ne,h,g),te&&$t(g,null,h,"unmounted")},A)},qe=g=>{const{type:h,el:A,anchor:D,transition:m}=g;if(h===me){ye(A,D);return}if(h===Wn){T(g);return}const x=()=>{s(A),m&&!m.persisted&&m.afterLeave&&m.afterLeave()};if(g.shapeFlag&1&&m&&!m.persisted){const{leave:E,delayLeave:k}=m,O=()=>E(A,x);k?k(g.el,x,O):O()}else x()},ye=(g,h)=>{let A;for(;g!==h;)A=f(g),s(g),g=A;s(h)},ve=(g,h,A)=>{const{bum:D,scope:m,job:x,subTree:E,um:k,m:O,a:u}=g;Fs(O),Fs(u),D&&Vn(D),m.stop(),x&&(x.flags|=8,ae(E,g,h,A)),k&&Je(k,h),Je(()=>{g.isUnmounted=!0},h)},Se=(g,h,A,D=!1,m=!1,x=0)=>{for(let E=x;E<g.length;E++)ae(g[E],h,A,D,m)},I=g=>{if(g.shapeFlag&6)return I(g.component.subTree);if(g.shapeFlag&128)return g.suspense.next();const h=f(g.anchor||g.el),A=h&&h[Kl];return A?f(A):h};let V=!1;const $=(g,h,A)=>{let D;g==null?h._vnode&&(ae(h._vnode,null,null,!0),D=h._vnode.component):P(h._vnode||null,g,h,null,null,null,A),h._vnode=g,V||(V=!0,As(D),Qo(),V=!1)},J={p:P,um:ae,m:Ie,r:qe,mt:se,mc:M,pc:K,pbc:U,n:I,o:e};return{render:$,hydrate:void 0,createApp:ma($)}}function Cr({type:e,props:t},r){return r==="svg"&&e==="foreignObject"||r==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:r}function Gt({effect:e,job:t},r){r?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Pa(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ii(e,t,r=!1){const n=e.children,s=t.children;if(z(n)&&z(s))for(let o=0;o<n.length;o++){const i=n[o];let l=s[o];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=s[o]=Tt(s[o]),l.el=i.el),!r&&l.patchFlag!==-2&&Ii(i,l)),l.type===xr&&(l.patchFlag===-1&&(l=s[o]=Tt(l)),l.el=i.el),l.type===Fe&&!l.el&&(l.el=i.el)}}function Da(e){const t=e.slice(),r=[0];let n,s,o,i,l;const a=e.length;for(n=0;n<a;n++){const p=e[n];if(p!==0){if(s=r[r.length-1],e[s]<p){t[n]=s,r.push(n);continue}for(o=0,i=r.length-1;o<i;)l=o+i>>1,e[r[l]]<p?o=l+1:i=l;p<e[r[o]]&&(o>0&&(t[n]=r[o-1]),r[o]=n)}}for(o=r.length,i=r[o-1];o-- >0;)r[o]=i,i=t[i];return r}function Oi(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Oi(t)}function Fs(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Mi(e){if(e.placeholder)return e.placeholder;const t=e.component;return t?Mi(t.subTree):null}const ki=e=>e.__isSuspense;function Na(e,t){t&&t.pendingBranch?z(e)?t.effects.push(...e):t.effects.push(e):Gl(e)}const me=Symbol.for("v-fgt"),xr=Symbol.for("v-txt"),Fe=Symbol.for("v-cmt"),Wn=Symbol.for("v-stc"),Tn=[];let Qe=null;function q(e=!1){Tn.push(Qe=e?null:[])}function La(){Tn.pop(),Qe=Tn[Tn.length-1]||null}let kn=1;function Zn(e,t=!1){kn+=e,e<0&&Qe&&t&&(Qe.hasOnce=!0)}function Pi(e){return e.dynamicChildren=kn>0?Qe||sn:null,La(),kn>0&&Qe&&Qe.push(e),e}function ee(e,t,r,n,s,o){return Pi(_(e,t,r,n,s,o,!0))}function Ze(e,t,r,n,s){return Pi(he(e,t,r,n,s,!0))}function Pn(e){return e?e.__v_isVNode===!0:!1}function Kt(e,t){return e.type===t.type&&e.key===t.key}const Di=({key:e})=>e??null,Jn=({ref:e,ref_key:t,ref_for:r})=>(typeof e=="number"&&(e=""+e),e!=null?Ae(e)||Be(e)||X(e)?{i:De,r:e,k:t,f:!!r}:e:null);function _(e,t=null,r=null,n=0,s=null,o=e===me?0:1,i=!1,l=!1){const a={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Di(t),ref:t&&Jn(t),scopeId:ei,slotScopeIds:null,children:r,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:n,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:De};return l?(us(a,r),o&128&&e.normalize(a)):r&&(a.shapeFlag|=Ae(r)?8:16),kn>0&&!i&&Qe&&(a.patchFlag>0||o&6)&&a.patchFlag!==32&&Qe.push(a),a}const he=Fa;function Fa(e,t=null,r=null,n=0,s=null,o=!1){if((!e||e===fi)&&(e=Fe),Pn(e)){const l=jt(e,t,!0);return r&&us(l,r),kn>0&&!o&&Qe&&(l.shapeFlag&6?Qe[Qe.indexOf(e)]=l:Qe.push(l)),l.patchFlag=-2,l}if(qa(e)&&(e=e.__vccOpts),t){t=Ha(t);let{class:l,style:a}=t;l&&!Ae(l)&&(t.class=_e(l)),ue(a)&&(as(a)&&!z(a)&&(a=ke({},a)),t.style=Ut(a))}const i=Ae(e)?1:ki(e)?128:ri(e)?64:ue(e)?4:X(e)?2:0;return _(e,t,r,n,s,i,o,!0)}function Ha(e){return e?as(e)||_i(e)?ke({},e):e:null}function jt(e,t,r=!1,n=!1){const{props:s,ref:o,patchFlag:i,children:l,transition:a}=e,p=t?Ua(s||{},t):s,d={__v_isVNode:!0,__v_skip:!0,type:e.type,props:p,key:p&&Di(p),ref:t&&t.ref?r&&o?z(o)?o.concat(Jn(t)):[o,Jn(t)]:Jn(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:l,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==me?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:a,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&jt(e.ssContent),ssFallback:e.ssFallback&&jt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return a&&n&&Mn(d,a.clone(d)),d}function Ne(e=" ",t=0){return he(xr,null,e,t)}function Ba(e,t){const r=he(Wn,null,e);return r.staticCount=t,r}function Xe(e="",t=!1){return t?(q(),Ze(Fe,null,e)):he(Fe,null,e)}function mt(e){return e==null||typeof e=="boolean"?he(Fe):z(e)?he(me,null,e.slice()):Pn(e)?Tt(e):he(xr,null,String(e))}function Tt(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:jt(e)}function us(e,t){let r=0;const{shapeFlag:n}=e;if(t==null)t=null;else if(z(t))r=16;else if(typeof t=="object")if(n&65){const s=t.default;s&&(s._c&&(s._d=!1),us(e,s()),s._c&&(s._d=!0));return}else{r=32;const s=t._;!s&&!_i(t)?t._ctx=De:s===3&&De&&(De.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else X(t)?(t={default:t,_ctx:De},r=32):(t=String(t),n&64?(r=16,t=[Ne(t)]):r=8);e.children=t,e.shapeFlag|=r}function Ua(...e){const t={};for(let r=0;r<e.length;r++){const n=e[r];for(const s in n)if(s==="class")t.class!==n.class&&(t.class=_e([t.class,n.class]));else if(s==="style")t.style=Ut([t.style,n.style]);else if(rr(s)){const o=t[s],i=n[s];i&&o!==i&&!(z(o)&&o.includes(i))&&(t[s]=o?[].concat(o,i):i)}else s!==""&&(t[s]=n[s])}return t}function ft(e,t,r,n=null){at(e,t,7,[r,n])}const ja=bi();let $a=0;function Ga(e,t,r){const n=e.type,s=(t?t.appContext:e.appContext)||ja,o={uid:$a++,vnode:e,type:n,parent:t,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new fl(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(s.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:wi(n,s),emitsOptions:yi(n,s),emit:null,emitted:null,propsDefaults:xe,inheritAttrs:n.inheritAttrs,ctx:xe,data:xe,props:xe,attrs:xe,slots:xe,refs:xe,setupState:xe,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=t?t.root:o,o.emit=ya.bind(null,o),e.ce&&e.ce(o),o}let He=null;const Ni=()=>He||De;let er,Wr;{const e=ar(),t=(r,n)=>{let s;return(s=e[r])||(s=e[r]=[]),s.push(n),o=>{s.length>1?s.forEach(i=>i(o)):s[0](o)}};er=t("__VUE_INSTANCE_SETTERS__",r=>He=r),Wr=t("__VUE_SSR_SETTERS__",r=>Dn=r)}const Un=e=>{const t=He;return er(e),e.scope.on(),()=>{e.scope.off(),er(t)}},Hs=()=>{He&&He.scope.off(),er(null)};function Li(e){return e.vnode.shapeFlag&4}let Dn=!1;function Va(e,t=!1,r=!1){t&&Wr(t);const{props:n,children:s}=e.vnode,o=Li(e);wa(e,n,o,t),Ia(e,s,r||t);const i=o?Wa(e,t):void 0;return t&&Wr(!1),i}function Wa(e,t){const r=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,da);const{setup:n}=r;if(n){It();const s=e.setupContext=n.length>1?Ka(e):null,o=Un(e),i=Bn(n,e,0,[e.props,s]),l=To(i);if(Ot(),o(),(l||e.sp)&&!an(e)&&ci(e),l){if(i.then(Hs,Hs),t)return i.then(a=>{Bs(e,a)}).catch(a=>{pr(a,e,0)});e.asyncDep=i}else Bs(e,i)}else Fi(e)}function Bs(e,t,r){X(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:ue(t)&&(e.setupState=qo(t)),Fi(e)}function Fi(e,t,r){const n=e.type;e.render||(e.render=n.render||yt);{const s=Un(e);It();try{pa(e)}finally{Ot(),s()}}}const Ja={get(e,t){return Le(e,"get",""),e[t]}};function Ka(e){const t=r=>{e.exposed=r||{}};return{attrs:new Proxy(e.attrs,Ja),slots:e.slots,emit:e.emit,expose:t}}function mr(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(qo(Pl(e.exposed)),{get(t,r){if(r in t)return t[r];if(r in wn)return wn[r](e)},has(t,r){return r in t||r in wn}})):e.proxy}function Ya(e,t=!0){return X(e)?e.displayName||e.name:e.name||t&&e.__name}function qa(e){return X(e)&&"__vccOpts"in e}const Te=(e,t)=>Hl(e,t,Dn);function fs(e,t,r){try{Zn(-1);const n=arguments.length;return n===2?ue(t)&&!z(t)?Pn(t)?he(e,null,[t]):he(e,t):he(e,null,t):(n>3?r=Array.prototype.slice.call(arguments,2):n===3&&Pn(r)&&(r=[r]),he(e,t,r))}finally{Zn(1)}}const za="3.5.30";/**
* @vue/runtime-dom v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Jr;const Us=typeof window<"u"&&window.trustedTypes;if(Us)try{Jr=Us.createPolicy("vue",{createHTML:e=>e})}catch{}const Hi=Jr?e=>Jr.createHTML(e):e=>e,Xa="http://www.w3.org/2000/svg",Qa="http://www.w3.org/1998/Math/MathML",wt=typeof document<"u"?document:null,js=wt&&wt.createElement("template"),Za={insert:(e,t,r)=>{t.insertBefore(e,r||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,r,n)=>{const s=t==="svg"?wt.createElementNS(Xa,e):t==="mathml"?wt.createElementNS(Qa,e):r?wt.createElement(e,{is:r}):wt.createElement(e);return e==="select"&&n&&n.multiple!=null&&s.setAttribute("multiple",n.multiple),s},createText:e=>wt.createTextNode(e),createComment:e=>wt.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>wt.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,r,n,s,o){const i=r?r.previousSibling:t.lastChild;if(s&&(s===o||s.nextSibling))for(;t.insertBefore(s.cloneNode(!0),r),!(s===o||!(s=s.nextSibling)););else{js.innerHTML=Hi(n==="svg"?`<svg>${e}</svg>`:n==="mathml"?`<math>${e}</math>`:e);const l=js.content;if(n==="svg"||n==="mathml"){const a=l.firstChild;for(;a.firstChild;)l.appendChild(a.firstChild);l.removeChild(a)}t.insertBefore(l,r)}return[i?i.nextSibling:t.firstChild,r?r.previousSibling:t.lastChild]}},Nt="transition",mn="animation",Nn=Symbol("_vtc"),Bi={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},ec=ke({},si,Bi),tc=e=>(e.displayName="Transition",e.props=ec,e),nc=tc((e,{slots:t})=>fs(zl,rc(e),t)),Vt=(e,t=[])=>{z(e)?e.forEach(r=>r(...t)):e&&e(...t)},$s=e=>e?z(e)?e.some(t=>t.length>1):e.length>1:!1;function rc(e){const t={};for(const B in e)B in Bi||(t[B]=e[B]);if(e.css===!1)return t;const{name:r="v",type:n,duration:s,enterFromClass:o=`${r}-enter-from`,enterActiveClass:i=`${r}-enter-active`,enterToClass:l=`${r}-enter-to`,appearFromClass:a=o,appearActiveClass:p=i,appearToClass:d=l,leaveFromClass:c=`${r}-leave-from`,leaveActiveClass:f=`${r}-leave-active`,leaveToClass:y=`${r}-leave-to`}=e,L=sc(s),P=L&&L[0],H=L&&L[1],{onBeforeEnter:j,onEnter:b,onEnterCancelled:v,onLeave:T,onLeaveCancelled:C,onBeforeAppear:R=j,onAppear:S=b,onAppearCancelled:M=v}=t,w=(B,Q,se,we)=>{B._enterCancelled=we,Wt(B,Q?d:l),Wt(B,Q?p:i),se&&se()},U=(B,Q)=>{B._isLeaving=!1,Wt(B,c),Wt(B,y),Wt(B,f),Q&&Q()},W=B=>(Q,se)=>{const we=B?S:b,oe=()=>w(Q,B,se);Vt(we,[Q,oe]),Gs(()=>{Wt(Q,B?a:o),Et(Q,B?d:l),$s(we)||Vs(Q,n,P,oe)})};return ke(t,{onBeforeEnter(B){Vt(j,[B]),Et(B,o),Et(B,i)},onBeforeAppear(B){Vt(R,[B]),Et(B,a),Et(B,p)},onEnter:W(!1),onAppear:W(!0),onLeave(B,Q){B._isLeaving=!0;const se=()=>U(B,Q);Et(B,c),B._enterCancelled?(Et(B,f),Ks(B)):(Ks(B),Et(B,f)),Gs(()=>{B._isLeaving&&(Wt(B,c),Et(B,y),$s(T)||Vs(B,n,H,se))}),Vt(T,[B,se])},onEnterCancelled(B){w(B,!1,void 0,!0),Vt(v,[B])},onAppearCancelled(B){w(B,!0,void 0,!0),Vt(M,[B])},onLeaveCancelled(B){U(B),Vt(C,[B])}})}function sc(e){if(e==null)return null;if(ue(e))return[Rr(e.enter),Rr(e.leave)];{const t=Rr(e);return[t,t]}}function Rr(e){return sl(e)}function Et(e,t){t.split(/\s+/).forEach(r=>r&&e.classList.add(r)),(e[Nn]||(e[Nn]=new Set)).add(t)}function Wt(e,t){t.split(/\s+/).forEach(n=>n&&e.classList.remove(n));const r=e[Nn];r&&(r.delete(t),r.size||(e[Nn]=void 0))}function Gs(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let oc=0;function Vs(e,t,r,n){const s=e._endId=++oc,o=()=>{s===e._endId&&n()};if(r!=null)return setTimeout(o,r);const{type:i,timeout:l,propCount:a}=ic(e,t);if(!i)return n();const p=i+"end";let d=0;const c=()=>{e.removeEventListener(p,f),o()},f=y=>{y.target===e&&++d>=a&&c()};setTimeout(()=>{d<a&&c()},l+1),e.addEventListener(p,f)}function ic(e,t){const r=window.getComputedStyle(e),n=L=>(r[L]||"").split(", "),s=n(`${Nt}Delay`),o=n(`${Nt}Duration`),i=Ws(s,o),l=n(`${mn}Delay`),a=n(`${mn}Duration`),p=Ws(l,a);let d=null,c=0,f=0;t===Nt?i>0&&(d=Nt,c=i,f=o.length):t===mn?p>0&&(d=mn,c=p,f=a.length):(c=Math.max(i,p),d=c>0?i>p?Nt:mn:null,f=d?d===Nt?o.length:a.length:0);const y=d===Nt&&/\b(?:transform|all)(?:,|$)/.test(n(`${Nt}Property`).toString());return{type:d,timeout:c,propCount:f,hasTransform:y}}function Ws(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((r,n)=>Js(r)+Js(e[n])))}function Js(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function Ks(e){return(e?e.ownerDocument:document).body.offsetHeight}function lc(e,t,r){const n=e[Nn];n&&(t=(t?[t,...n]:[...n]).join(" ")),t==null?e.removeAttribute("class"):r?e.setAttribute("class",t):e.className=t}const Ys=Symbol("_vod"),ac=Symbol("_vsh"),cc=Symbol(""),dc=/(?:^|;)\s*display\s*:/;function pc(e,t,r){const n=e.style,s=Ae(r);let o=!1;if(r&&!s){if(t)if(Ae(t))for(const i of t.split(";")){const l=i.slice(0,i.indexOf(":")).trim();r[l]==null&&Kn(n,l,"")}else for(const i in t)r[i]==null&&Kn(n,i,"");for(const i in r)i==="display"&&(o=!0),Kn(n,i,r[i])}else if(s){if(t!==r){const i=n[cc];i&&(r+=";"+i),n.cssText=r,o=dc.test(r)}}else t&&e.removeAttribute("style");Ys in e&&(e[Ys]=o?n.display:"",e[ac]&&(n.display="none"))}const qs=/\s*!important$/;function Kn(e,t,r){if(z(r))r.forEach(n=>Kn(e,t,n));else if(r==null&&(r=""),t.startsWith("--"))e.setProperty(t,r);else{const n=uc(e,t);qs.test(r)?e.setProperty(Zt(n),r.replace(qs,""),"important"):e[n]=r}}const zs=["Webkit","Moz","ms"],Ir={};function uc(e,t){const r=Ir[t];if(r)return r;let n=Ge(t);if(n!=="filter"&&n in e)return Ir[t]=n;n=ir(n);for(let s=0;s<zs.length;s++){const o=zs[s]+n;if(o in e)return Ir[t]=o}return t}const Xs="http://www.w3.org/1999/xlink";function Qs(e,t,r,n,s,o=dl(t)){n&&t.startsWith("xlink:")?r==null?e.removeAttributeNS(Xs,t.slice(6,t.length)):e.setAttributeNS(Xs,t,r):r==null||o&&!Oo(r)?e.removeAttribute(t):e.setAttribute(t,o?"":it(r)?String(r):r)}function Zs(e,t,r,n,s){if(t==="innerHTML"||t==="textContent"){r!=null&&(e[t]=t==="innerHTML"?Hi(r):r);return}const o=e.tagName;if(t==="value"&&o!=="PROGRESS"&&!o.includes("-")){const l=o==="OPTION"?e.getAttribute("value")||"":e.value,a=r==null?e.type==="checkbox"?"on":"":String(r);(l!==a||!("_value"in e))&&(e.value=a),r==null&&e.removeAttribute(t),e._value=r;return}let i=!1;if(r===""||r==null){const l=typeof e[t];l==="boolean"?r=Oo(r):r==null&&l==="string"?(r="",i=!0):l==="number"&&(r=0,i=!0)}try{e[t]=r}catch{}i&&e.removeAttribute(s||t)}function Yt(e,t,r,n){e.addEventListener(t,r,n)}function fc(e,t,r,n){e.removeEventListener(t,r,n)}const eo=Symbol("_vei");function gc(e,t,r,n,s=null){const o=e[eo]||(e[eo]={}),i=o[t];if(n&&i)i.value=n;else{const[l,a]=hc(t);if(n){const p=o[t]=bc(n,s);Yt(e,l,p,a)}else i&&(fc(e,l,i,a),o[t]=void 0)}}const to=/(?:Once|Passive|Capture)$/;function hc(e){let t;if(to.test(e)){t={};let n;for(;n=e.match(to);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Zt(e.slice(2)),t]}let Or=0;const xc=Promise.resolve(),mc=()=>Or||(xc.then(()=>Or=0),Or=Date.now());function bc(e,t){const r=n=>{if(!n._vts)n._vts=Date.now();else if(n._vts<=r.attached)return;at(yc(n,r.value),t,5,[n])};return r.value=e,r.attached=mc(),r}function yc(e,t){if(z(t)){const r=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{r.call(e),e._stopped=!0},t.map(n=>s=>!s._stopped&&n&&n(s))}else return t}const no=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,vc=(e,t,r,n,s,o)=>{const i=s==="svg";t==="class"?lc(e,n,i):t==="style"?pc(e,r,n):rr(t)?Zr(t)||gc(e,t,r,n,o):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Sc(e,t,n,i))?(Zs(e,t,n),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Qs(e,t,n,i,o,t!=="value")):e._isVueCE&&(Ec(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!Ae(n)))?Zs(e,Ge(t),n,o,t):(t==="true-value"?e._trueValue=n:t==="false-value"&&(e._falseValue=n),Qs(e,t,n,i))};function Sc(e,t,r,n){if(n)return!!(t==="innerHTML"||t==="textContent"||t in e&&no(t)&&X(r));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const s=e.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return no(t)&&Ae(r)?!1:t in e}function Ec(e,t){const r=e._def.props;if(!r)return!1;const n=Ge(t);return Array.isArray(r)?r.some(s=>Ge(s)===n):Object.keys(r).some(s=>Ge(s)===n)}const tr=e=>{const t=e.props["onUpdate:modelValue"]||!1;return z(t)?r=>Vn(t,r):t};function _c(e){e.target.composing=!0}function ro(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const dn=Symbol("_assign");function so(e,t,r){return t&&(e=e.trim()),r&&(e=lr(e)),e}const Ac={created(e,{modifiers:{lazy:t,trim:r,number:n}},s){e[dn]=tr(s);const o=n||s.props&&s.props.type==="number";Yt(e,t?"change":"input",i=>{i.target.composing||e[dn](so(e.value,r,o))}),(r||o)&&Yt(e,"change",()=>{e.value=so(e.value,r,o)}),t||(Yt(e,"compositionstart",_c),Yt(e,"compositionend",ro),Yt(e,"change",ro))},mounted(e,{value:t}){e.value=t??""},beforeUpdate(e,{value:t,oldValue:r,modifiers:{lazy:n,trim:s,number:o}},i){if(e[dn]=tr(i),e.composing)return;const l=(o||e.type==="number")&&!/^0\d/.test(e.value)?lr(e.value):e.value,a=t??"";l!==a&&(document.activeElement===e&&e.type!=="range"&&(n&&t===r||s&&e.value.trim()===a)||(e.value=a))}},wc={deep:!0,created(e,{value:t,modifiers:{number:r}},n){const s=sr(t);Yt(e,"change",()=>{const o=Array.prototype.filter.call(e.options,i=>i.selected).map(i=>r?lr(nr(i)):nr(i));e[dn](e.multiple?s?new Set(o):o:o[0]),e._assigning=!0,ur(()=>{e._assigning=!1})}),e[dn]=tr(n)},mounted(e,{value:t}){oo(e,t)},beforeUpdate(e,t,r){e[dn]=tr(r)},updated(e,{value:t}){e._assigning||oo(e,t)}};function oo(e,t){const r=e.multiple,n=z(t);if(!(r&&!n&&!sr(t))){for(let s=0,o=e.options.length;s<o;s++){const i=e.options[s],l=nr(i);if(r)if(n){const a=typeof l;a==="string"||a==="number"?i.selected=t.some(p=>String(p)===String(l)):i.selected=ul(t,l)>-1}else i.selected=t.has(l);else if(Hn(nr(i),t)){e.selectedIndex!==s&&(e.selectedIndex=s);return}}!r&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function nr(e){return"_value"in e?e._value:e.value}const Tc=["ctrl","shift","alt","meta"],Cc={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>Tc.some(r=>e[`${r}Key`]&&!t.includes(r))},Lt=(e,t)=>{if(!e)return e;const r=e._withMods||(e._withMods={}),n=t.join(".");return r[n]||(r[n]=(s,...o)=>{for(let i=0;i<t.length;i++){const l=Cc[t[i]];if(l&&l(s,t))return}return e(s,...o)})},Rc=ke({patchProp:vc},Za);let io;function Ic(){return io||(io=Ma(Rc))}const Oc=(...e)=>{const t=Ic().createApp(...e),{mount:r}=t;return t.mount=n=>{const s=kc(n);if(!s)return;const o=t._component;!X(o)&&!o.render&&!o.template&&(o.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const i=r(s,!1,Mc(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),i},t};function Mc(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function kc(e){return Ae(e)?document.querySelector(e):e}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const rn=typeof document<"u";function Ui(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function Pc(e){return e.__esModule||e[Symbol.toStringTag]==="Module"||e.default&&Ui(e.default)}const de=Object.assign;function Mr(e,t){const r={};for(const n in t){const s=t[n];r[n]=ct(s)?s.map(e):e(s)}return r}const Cn=()=>{},ct=Array.isArray;function lo(e,t){const r={};for(const n in e)r[n]=n in t?t[n]:e[n];return r}const ji=/#/g,Dc=/&/g,Nc=/\//g,Lc=/=/g,Fc=/\?/g,$i=/\+/g,Hc=/%5B/g,Bc=/%5D/g,Gi=/%5E/g,Uc=/%60/g,Vi=/%7B/g,jc=/%7C/g,Wi=/%7D/g,$c=/%20/g;function gs(e){return e==null?"":encodeURI(""+e).replace(jc,"|").replace(Hc,"[").replace(Bc,"]")}function Gc(e){return gs(e).replace(Vi,"{").replace(Wi,"}").replace(Gi,"^")}function Kr(e){return gs(e).replace($i,"%2B").replace($c,"+").replace(ji,"%23").replace(Dc,"%26").replace(Uc,"`").replace(Vi,"{").replace(Wi,"}").replace(Gi,"^")}function Vc(e){return Kr(e).replace(Lc,"%3D")}function Wc(e){return gs(e).replace(ji,"%23").replace(Fc,"%3F")}function Jc(e){return Wc(e).replace(Nc,"%2F")}function Ln(e){if(e==null)return null;try{return decodeURIComponent(""+e)}catch{}return""+e}const Kc=/\/$/,Yc=e=>e.replace(Kc,"");function kr(e,t,r="/"){let n,s={},o="",i="";const l=t.indexOf("#");let a=t.indexOf("?");return a=l>=0&&a>l?-1:a,a>=0&&(n=t.slice(0,a),o=t.slice(a,l>0?l:t.length),s=e(o.slice(1))),l>=0&&(n=n||t.slice(0,l),i=t.slice(l,t.length)),n=Qc(n??t,r),{fullPath:n+o+i,path:n,query:s,hash:Ln(i)}}function qc(e,t){const r=t.query?e(t.query):"";return t.path+(r&&"?")+r+(t.hash||"")}function ao(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function zc(e,t,r){const n=t.matched.length-1,s=r.matched.length-1;return n>-1&&n===s&&un(t.matched[n],r.matched[s])&&Ji(t.params,r.params)&&e(t.query)===e(r.query)&&t.hash===r.hash}function un(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function Ji(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var r in e)if(!Xc(e[r],t[r]))return!1;return!0}function Xc(e,t){return ct(e)?co(e,t):ct(t)?co(t,e):(e==null?void 0:e.valueOf())===(t==null?void 0:t.valueOf())}function co(e,t){return ct(t)?e.length===t.length&&e.every((r,n)=>r===t[n]):e.length===1&&e[0]===t}function Qc(e,t){if(e.startsWith("/"))return e;if(!e)return t;const r=t.split("/"),n=e.split("/"),s=n[n.length-1];(s===".."||s===".")&&n.push("");let o=r.length-1,i,l;for(i=0;i<n.length;i++)if(l=n[i],l!==".")if(l==="..")o>1&&o--;else break;return r.slice(0,o).join("/")+"/"+n.slice(i).join("/")}const Ft={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let Yr=function(e){return e.pop="pop",e.push="push",e}({}),Pr=function(e){return e.back="back",e.forward="forward",e.unknown="",e}({});function Zc(e){if(!e)if(rn){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),Yc(e)}const ed=/^[^#]+#/;function td(e,t){return e.replace(ed,"#")+t}function nd(e,t){const r=document.documentElement.getBoundingClientRect(),n=e.getBoundingClientRect();return{behavior:t.behavior,left:n.left-r.left-(t.left||0),top:n.top-r.top-(t.top||0)}}const br=()=>({left:window.scrollX,top:window.scrollY});function rd(e){let t;if("el"in e){const r=e.el,n=typeof r=="string"&&r.startsWith("#"),s=typeof r=="string"?n?document.getElementById(r.slice(1)):document.querySelector(r):r;if(!s)return;t=nd(s,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function po(e,t){return(history.state?history.state.position-t:-1)+e}const qr=new Map;function sd(e,t){qr.set(e,t)}function od(e){const t=qr.get(e);return qr.delete(e),t}function id(e){return typeof e=="string"||e&&typeof e=="object"}function Ki(e){return typeof e=="string"||typeof e=="symbol"}let Ee=function(e){return e[e.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",e[e.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",e[e.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",e[e.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",e[e.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",e}({});const Yi=Symbol("");Ee.MATCHER_NOT_FOUND+"",Ee.NAVIGATION_GUARD_REDIRECT+"",Ee.NAVIGATION_ABORTED+"",Ee.NAVIGATION_CANCELLED+"",Ee.NAVIGATION_DUPLICATED+"";function fn(e,t){return de(new Error,{type:e,[Yi]:!0},t)}function _t(e,t){return e instanceof Error&&Yi in e&&(t==null||!!(e.type&t))}const ld=["params","query","hash"];function ad(e){if(typeof e=="string")return e;if(e.path!=null)return e.path;const t={};for(const r of ld)r in e&&(t[r]=e[r]);return JSON.stringify(t,null,2)}function cd(e){const t={};if(e===""||e==="?")return t;const r=(e[0]==="?"?e.slice(1):e).split("&");for(let n=0;n<r.length;++n){const s=r[n].replace($i," "),o=s.indexOf("="),i=Ln(o<0?s:s.slice(0,o)),l=o<0?null:Ln(s.slice(o+1));if(i in t){let a=t[i];ct(a)||(a=t[i]=[a]),a.push(l)}else t[i]=l}return t}function uo(e){let t="";for(let r in e){const n=e[r];if(r=Vc(r),n==null){n!==void 0&&(t+=(t.length?"&":"")+r);continue}(ct(n)?n.map(s=>s&&Kr(s)):[n&&Kr(n)]).forEach(s=>{s!==void 0&&(t+=(t.length?"&":"")+r,s!=null&&(t+="="+s))})}return t}function dd(e){const t={};for(const r in e){const n=e[r];n!==void 0&&(t[r]=ct(n)?n.map(s=>s==null?null:""+s):n==null?n:""+n)}return t}const pd=Symbol(""),fo=Symbol(""),yr=Symbol(""),hs=Symbol(""),zr=Symbol("");function bn(){let e=[];function t(n){return e.push(n),()=>{const s=e.indexOf(n);s>-1&&e.splice(s,1)}}function r(){e=[]}return{add:t,list:()=>e.slice(),reset:r}}function Bt(e,t,r,n,s,o=i=>i()){const i=n&&(n.enterCallbacks[s]=n.enterCallbacks[s]||[]);return()=>new Promise((l,a)=>{const p=f=>{f===!1?a(fn(Ee.NAVIGATION_ABORTED,{from:r,to:t})):f instanceof Error?a(f):id(f)?a(fn(Ee.NAVIGATION_GUARD_REDIRECT,{from:t,to:f})):(i&&n.enterCallbacks[s]===i&&typeof f=="function"&&i.push(f),l())},d=o(()=>e.call(n&&n.instances[s],t,r,p));let c=Promise.resolve(d);e.length<3&&(c=c.then(p)),c.catch(f=>a(f))})}function Dr(e,t,r,n,s=o=>o()){const o=[];for(const i of e)for(const l in i.components){let a=i.components[l];if(!(t!=="beforeRouteEnter"&&!i.instances[l]))if(Ui(a)){const p=(a.__vccOpts||a)[t];p&&o.push(Bt(p,r,n,i,l,s))}else{let p=a();o.push(()=>p.then(d=>{if(!d)throw new Error(`Couldn't resolve component "${l}" at "${i.path}"`);const c=Pc(d)?d.default:d;i.mods[l]=d,i.components[l]=c;const f=(c.__vccOpts||c)[t];return f&&Bt(f,r,n,i,l,s)()}))}}return o}function ud(e,t){const r=[],n=[],s=[],o=Math.max(t.matched.length,e.matched.length);for(let i=0;i<o;i++){const l=t.matched[i];l&&(e.matched.find(p=>un(p,l))?n.push(l):r.push(l));const a=e.matched[i];a&&(t.matched.find(p=>un(p,a))||s.push(a))}return[r,n,s]}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let fd=()=>location.protocol+"//"+location.host;function qi(e,t){const{pathname:r,search:n,hash:s}=t,o=e.indexOf("#");if(o>-1){let i=s.includes(e.slice(o))?e.slice(o).length:1,l=s.slice(i);return l[0]!=="/"&&(l="/"+l),ao(l,"")}return ao(r,e)+n+s}function gd(e,t,r,n){let s=[],o=[],i=null;const l=({state:f})=>{const y=qi(e,location),L=r.value,P=t.value;let H=0;if(f){if(r.value=y,t.value=f,i&&i===L){i=null;return}H=P?f.position-P.position:0}else n(y);s.forEach(j=>{j(r.value,L,{delta:H,type:Yr.pop,direction:H?H>0?Pr.forward:Pr.back:Pr.unknown})})};function a(){i=r.value}function p(f){s.push(f);const y=()=>{const L=s.indexOf(f);L>-1&&s.splice(L,1)};return o.push(y),y}function d(){if(document.visibilityState==="hidden"){const{history:f}=window;if(!f.state)return;f.replaceState(de({},f.state,{scroll:br()}),"")}}function c(){for(const f of o)f();o=[],window.removeEventListener("popstate",l),window.removeEventListener("pagehide",d),document.removeEventListener("visibilitychange",d)}return window.addEventListener("popstate",l),window.addEventListener("pagehide",d),document.addEventListener("visibilitychange",d),{pauseListeners:a,listen:p,destroy:c}}function go(e,t,r,n=!1,s=!1){return{back:e,current:t,forward:r,replaced:n,position:window.history.length,scroll:s?br():null}}function hd(e){const{history:t,location:r}=window,n={value:qi(e,r)},s={value:t.state};s.value||o(n.value,{back:null,current:n.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function o(a,p,d){const c=e.indexOf("#"),f=c>-1?(r.host&&document.querySelector("base")?e:e.slice(c))+a:fd()+e+a;try{t[d?"replaceState":"pushState"](p,"",f),s.value=p}catch(y){console.error(y),r[d?"replace":"assign"](f)}}function i(a,p){o(a,de({},t.state,go(s.value.back,a,s.value.forward,!0),p,{position:s.value.position}),!0),n.value=a}function l(a,p){const d=de({},s.value,t.state,{forward:a,scroll:br()});o(d.current,d,!0),o(a,de({},go(n.value,a,null),{position:d.position+1},p),!1),n.value=a}return{location:n,state:s,push:l,replace:i}}function xd(e){e=Zc(e);const t=hd(e),r=gd(e,t.state,t.location,t.replace);function n(o,i=!0){i||r.pauseListeners(),history.go(o)}const s=de({location:"",base:e,go:n,createHref:td.bind(null,e)},t,r);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>t.state.value}),s}function md(e){return e=location.host?e||location.pathname+location.search:"",e.includes("#")||(e+="#"),xd(e)}let qt=function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.Group=2]="Group",e}({});var Me=function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.ParamRegExp=2]="ParamRegExp",e[e.ParamRegExpEnd=3]="ParamRegExpEnd",e[e.EscapeNext=4]="EscapeNext",e}(Me||{});const bd={type:qt.Static,value:""},yd=/[a-zA-Z0-9_]/;function vd(e){if(!e)return[[]];if(e==="/")return[[bd]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(y){throw new Error(`ERR (${r})/"${p}": ${y}`)}let r=Me.Static,n=r;const s=[];let o;function i(){o&&s.push(o),o=[]}let l=0,a,p="",d="";function c(){p&&(r===Me.Static?o.push({type:qt.Static,value:p}):r===Me.Param||r===Me.ParamRegExp||r===Me.ParamRegExpEnd?(o.length>1&&(a==="*"||a==="+")&&t(`A repeatable param (${p}) must be alone in its segment. eg: '/:ids+.`),o.push({type:qt.Param,value:p,regexp:d,repeatable:a==="*"||a==="+",optional:a==="*"||a==="?"})):t("Invalid state to consume buffer"),p="")}function f(){p+=a}for(;l<e.length;){if(a=e[l++],a==="\\"&&r!==Me.ParamRegExp){n=r,r=Me.EscapeNext;continue}switch(r){case Me.Static:a==="/"?(p&&c(),i()):a===":"?(c(),r=Me.Param):f();break;case Me.EscapeNext:f(),r=n;break;case Me.Param:a==="("?r=Me.ParamRegExp:yd.test(a)?f():(c(),r=Me.Static,a!=="*"&&a!=="?"&&a!=="+"&&l--);break;case Me.ParamRegExp:a===")"?d[d.length-1]=="\\"?d=d.slice(0,-1)+a:r=Me.ParamRegExpEnd:d+=a;break;case Me.ParamRegExpEnd:c(),r=Me.Static,a!=="*"&&a!=="?"&&a!=="+"&&l--,d="";break;default:t("Unknown state");break}}return r===Me.ParamRegExp&&t(`Unfinished custom RegExp for param "${p}"`),c(),i(),s}const ho="[^/]+?",Sd={sensitive:!1,strict:!1,start:!0,end:!0};var je=function(e){return e[e._multiplier=10]="_multiplier",e[e.Root=90]="Root",e[e.Segment=40]="Segment",e[e.SubSegment=30]="SubSegment",e[e.Static=40]="Static",e[e.Dynamic=20]="Dynamic",e[e.BonusCustomRegExp=10]="BonusCustomRegExp",e[e.BonusWildcard=-50]="BonusWildcard",e[e.BonusRepeatable=-20]="BonusRepeatable",e[e.BonusOptional=-8]="BonusOptional",e[e.BonusStrict=.7000000000000001]="BonusStrict",e[e.BonusCaseSensitive=.25]="BonusCaseSensitive",e}(je||{});const Ed=/[.+*?^${}()[\]/\\]/g;function _d(e,t){const r=de({},Sd,t),n=[];let s=r.start?"^":"";const o=[];for(const p of e){const d=p.length?[]:[je.Root];r.strict&&!p.length&&(s+="/");for(let c=0;c<p.length;c++){const f=p[c];let y=je.Segment+(r.sensitive?je.BonusCaseSensitive:0);if(f.type===qt.Static)c||(s+="/"),s+=f.value.replace(Ed,"\\$&"),y+=je.Static;else if(f.type===qt.Param){const{value:L,repeatable:P,optional:H,regexp:j}=f;o.push({name:L,repeatable:P,optional:H});const b=j||ho;if(b!==ho){y+=je.BonusCustomRegExp;try{`${b}`}catch(T){throw new Error(`Invalid custom RegExp for param "${L}" (${b}): `+T.message)}}let v=P?`((?:${b})(?:/(?:${b}))*)`:`(${b})`;c||(v=H&&p.length<2?`(?:/${v})`:"/"+v),H&&(v+="?"),s+=v,y+=je.Dynamic,H&&(y+=je.BonusOptional),P&&(y+=je.BonusRepeatable),b===".*"&&(y+=je.BonusWildcard)}d.push(y)}n.push(d)}if(r.strict&&r.end){const p=n.length-1;n[p][n[p].length-1]+=je.BonusStrict}r.strict||(s+="/?"),r.end?s+="$":r.strict&&!s.endsWith("/")&&(s+="(?:/|$)");const i=new RegExp(s,r.sensitive?"":"i");function l(p){const d=p.match(i),c={};if(!d)return null;for(let f=1;f<d.length;f++){const y=d[f]||"",L=o[f-1];c[L.name]=y&&L.repeatable?y.split("/"):y}return c}function a(p){let d="",c=!1;for(const f of e){(!c||!d.endsWith("/"))&&(d+="/"),c=!1;for(const y of f)if(y.type===qt.Static)d+=y.value;else if(y.type===qt.Param){const{value:L,repeatable:P,optional:H}=y,j=L in p?p[L]:"";if(ct(j)&&!P)throw new Error(`Provided param "${L}" is an array but it is not repeatable (* or + modifiers)`);const b=ct(j)?j.join("/"):j;if(!b)if(H)f.length<2&&(d.endsWith("/")?d=d.slice(0,-1):c=!0);else throw new Error(`Missing required param "${L}"`);d+=b}}return d||"/"}return{re:i,score:n,keys:o,parse:l,stringify:a}}function Ad(e,t){let r=0;for(;r<e.length&&r<t.length;){const n=t[r]-e[r];if(n)return n;r++}return e.length<t.length?e.length===1&&e[0]===je.Static+je.Segment?-1:1:e.length>t.length?t.length===1&&t[0]===je.Static+je.Segment?1:-1:0}function zi(e,t){let r=0;const n=e.score,s=t.score;for(;r<n.length&&r<s.length;){const o=Ad(n[r],s[r]);if(o)return o;r++}if(Math.abs(s.length-n.length)===1){if(xo(n))return 1;if(xo(s))return-1}return s.length-n.length}function xo(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const wd={strict:!1,end:!0,sensitive:!1};function Td(e,t,r){const n=_d(vd(e.path),r),s=de(n,{record:e,parent:t,children:[],alias:[]});return t&&!s.record.aliasOf==!t.record.aliasOf&&t.children.push(s),s}function Cd(e,t){const r=[],n=new Map;t=lo(wd,t);function s(c){return n.get(c)}function o(c,f,y){const L=!y,P=bo(c);P.aliasOf=y&&y.record;const H=lo(t,c),j=[P];if("alias"in c){const T=typeof c.alias=="string"?[c.alias]:c.alias;for(const C of T)j.push(bo(de({},P,{components:y?y.record.components:P.components,path:C,aliasOf:y?y.record:P})))}let b,v;for(const T of j){const{path:C}=T;if(f&&C[0]!=="/"){const R=f.record.path,S=R[R.length-1]==="/"?"":"/";T.path=f.record.path+(C&&S+C)}if(b=Td(T,f,H),y?y.alias.push(b):(v=v||b,v!==b&&v.alias.push(b),L&&c.name&&!yo(b)&&i(c.name)),Xi(b)&&a(b),P.children){const R=P.children;for(let S=0;S<R.length;S++)o(R[S],b,y&&y.children[S])}y=y||b}return v?()=>{i(v)}:Cn}function i(c){if(Ki(c)){const f=n.get(c);f&&(n.delete(c),r.splice(r.indexOf(f),1),f.children.forEach(i),f.alias.forEach(i))}else{const f=r.indexOf(c);f>-1&&(r.splice(f,1),c.record.name&&n.delete(c.record.name),c.children.forEach(i),c.alias.forEach(i))}}function l(){return r}function a(c){const f=Od(c,r);r.splice(f,0,c),c.record.name&&!yo(c)&&n.set(c.record.name,c)}function p(c,f){let y,L={},P,H;if("name"in c&&c.name){if(y=n.get(c.name),!y)throw fn(Ee.MATCHER_NOT_FOUND,{location:c});H=y.record.name,L=de(mo(f.params,y.keys.filter(v=>!v.optional).concat(y.parent?y.parent.keys.filter(v=>v.optional):[]).map(v=>v.name)),c.params&&mo(c.params,y.keys.map(v=>v.name))),P=y.stringify(L)}else if(c.path!=null)P=c.path,y=r.find(v=>v.re.test(P)),y&&(L=y.parse(P),H=y.record.name);else{if(y=f.name?n.get(f.name):r.find(v=>v.re.test(f.path)),!y)throw fn(Ee.MATCHER_NOT_FOUND,{location:c,currentLocation:f});H=y.record.name,L=de({},f.params,c.params),P=y.stringify(L)}const j=[];let b=y;for(;b;)j.unshift(b.record),b=b.parent;return{name:H,path:P,params:L,matched:j,meta:Id(j)}}e.forEach(c=>o(c));function d(){r.length=0,n.clear()}return{addRoute:o,resolve:p,removeRoute:i,clearRoutes:d,getRoutes:l,getRecordMatcher:s}}function mo(e,t){const r={};for(const n of t)n in e&&(r[n]=e[n]);return r}function bo(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:Rd(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function Rd(e){const t={},r=e.props||!1;if("component"in e)t.default=r;else for(const n in e.components)t[n]=typeof r=="object"?r[n]:r;return t}function yo(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function Id(e){return e.reduce((t,r)=>de(t,r.meta),{})}function Od(e,t){let r=0,n=t.length;for(;r!==n;){const o=r+n>>1;zi(e,t[o])<0?n=o:r=o+1}const s=Md(e);return s&&(n=t.lastIndexOf(s,n-1)),n}function Md(e){let t=e;for(;t=t.parent;)if(Xi(t)&&zi(e,t)===0)return t}function Xi({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function vo(e){const t=nt(yr),r=nt(hs),n=Te(()=>{const a=Ye(e.to);return t.resolve(a)}),s=Te(()=>{const{matched:a}=n.value,{length:p}=a,d=a[p-1],c=r.matched;if(!d||!c.length)return-1;const f=c.findIndex(un.bind(null,d));if(f>-1)return f;const y=So(a[p-2]);return p>1&&So(d)===y&&c[c.length-1].path!==y?c.findIndex(un.bind(null,a[p-2])):f}),o=Te(()=>s.value>-1&&Ld(r.params,n.value.params)),i=Te(()=>s.value>-1&&s.value===r.matched.length-1&&Ji(r.params,n.value.params));function l(a={}){if(Nd(a)){const p=t[Ye(e.replace)?"replace":"push"](Ye(e.to)).catch(Cn);return e.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>p),p}return Promise.resolve()}return{route:n,href:Te(()=>n.value.href),isActive:o,isExactActive:i,navigate:l}}function kd(e){return e.length===1?e[0]:e}const Pd=Ve({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:vo,setup(e,{slots:t}){const r=dr(vo(e)),{options:n}=nt(yr),s=Te(()=>({[Eo(e.activeClass,n.linkActiveClass,"router-link-active")]:r.isActive,[Eo(e.exactActiveClass,n.linkExactActiveClass,"router-link-exact-active")]:r.isExactActive}));return()=>{const o=t.default&&kd(t.default(r));return e.custom?o:fs("a",{"aria-current":r.isExactActive?e.ariaCurrentValue:null,href:r.href,onClick:r.navigate,class:s.value},o)}}}),Dd=Pd;function Nd(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Ld(e,t){for(const r in t){const n=t[r],s=e[r];if(typeof n=="string"){if(n!==s)return!1}else if(!ct(s)||s.length!==n.length||n.some((o,i)=>o.valueOf()!==s[i].valueOf()))return!1}return!0}function So(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Eo=(e,t,r)=>e??t??r,Fd=Ve({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:r}){const n=nt(zr),s=Te(()=>e.route||n.value),o=nt(fo,0),i=Te(()=>{let p=Ye(o);const{matched:d}=s.value;let c;for(;(c=d[p])&&!c.components;)p++;return p}),l=Te(()=>s.value.matched[i.value]);_n(fo,Te(()=>i.value+1)),_n(pd,l),_n(zr,s);const a=ge();return Qt(()=>[a.value,l.value,e.name],([p,d,c],[f,y,L])=>{d&&(d.instances[c]=p,y&&y!==d&&p&&p===f&&(d.leaveGuards.size||(d.leaveGuards=y.leaveGuards),d.updateGuards.size||(d.updateGuards=y.updateGuards))),p&&d&&(!y||!un(d,y)||!f)&&(d.enterCallbacks[c]||[]).forEach(P=>P(p))},{flush:"post"}),()=>{const p=s.value,d=e.name,c=l.value,f=c&&c.components[d];if(!f)return _o(r.default,{Component:f,route:p});const y=c.props[d],L=y?y===!0?p.params:typeof y=="function"?y(p):y:null,H=fs(f,de({},L,t,{onVnodeUnmounted:j=>{j.component.isUnmounted&&(c.instances[d]=null)},ref:a}));return _o(r.default,{Component:H,route:p})||H}}});function _o(e,t){if(!e)return null;const r=e(t);return r.length===1?r[0]:r}const Hd=Fd;function Bd(e){const t=Cd(e.routes,e),r=e.parseQuery||cd,n=e.stringifyQuery||uo,s=e.history,o=bn(),i=bn(),l=bn(),a=Dl(Ft);let p=Ft;rn&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const d=Mr.bind(null,I=>""+I),c=Mr.bind(null,Jc),f=Mr.bind(null,Ln);function y(I,V){let $,J;return Ki(I)?($=t.getRecordMatcher(I),J=V):J=I,t.addRoute(J,$)}function L(I){const V=t.getRecordMatcher(I);V&&t.removeRoute(V)}function P(){return t.getRoutes().map(I=>I.record)}function H(I){return!!t.getRecordMatcher(I)}function j(I,V){if(V=de({},V||a.value),typeof I=="string"){const A=kr(r,I,V.path),D=t.resolve({path:A.path},V),m=s.createHref(A.fullPath);return de(A,D,{params:f(D.params),hash:Ln(A.hash),redirectedFrom:void 0,href:m})}let $;if(I.path!=null)$=de({},I,{path:kr(r,I.path,V.path).path});else{const A=de({},I.params);for(const D in A)A[D]==null&&delete A[D];$=de({},I,{params:c(A)}),V.params=c(V.params)}const J=t.resolve($,V),Z=I.hash||"";J.params=d(f(J.params));const g=qc(n,de({},I,{hash:Gc(Z),path:J.path})),h=s.createHref(g);return de({fullPath:g,hash:Z,query:n===uo?dd(I.query):I.query||{}},J,{redirectedFrom:void 0,href:h})}function b(I){return typeof I=="string"?kr(r,I,a.value.path):de({},I)}function v(I,V){if(p!==I)return fn(Ee.NAVIGATION_CANCELLED,{from:V,to:I})}function T(I){return S(I)}function C(I){return T(de(b(I),{replace:!0}))}function R(I,V){const $=I.matched[I.matched.length-1];if($&&$.redirect){const{redirect:J}=$;let Z=typeof J=="function"?J(I,V):J;return typeof Z=="string"&&(Z=Z.includes("?")||Z.includes("#")?Z=b(Z):{path:Z},Z.params={}),de({query:I.query,hash:I.hash,params:Z.path!=null?{}:I.params},Z)}}function S(I,V){const $=p=j(I),J=a.value,Z=I.state,g=I.force,h=I.replace===!0,A=R($,J);if(A)return S(de(b(A),{state:typeof A=="object"?de({},Z,A.state):Z,force:g,replace:h}),V||$);const D=$;D.redirectedFrom=V;let m;return!g&&zc(n,J,$)&&(m=fn(Ee.NAVIGATION_DUPLICATED,{to:D,from:J}),Ie(J,J,!0,!1)),(m?Promise.resolve(m):U(D,J)).catch(x=>_t(x)?_t(x,Ee.NAVIGATION_GUARD_REDIRECT)?x:Re(x):K(x,D,J)).then(x=>{if(x){if(_t(x,Ee.NAVIGATION_GUARD_REDIRECT))return S(de({replace:h},b(x.to),{state:typeof x.to=="object"?de({},Z,x.to.state):Z,force:g}),V||D)}else x=B(D,J,!0,h,Z);return W(D,J,x),x})}function M(I,V){const $=v(I,V);return $?Promise.reject($):Promise.resolve()}function w(I){const V=ye.values().next().value;return V&&typeof V.runWithContext=="function"?V.runWithContext(I):I()}function U(I,V){let $;const[J,Z,g]=ud(I,V);$=Dr(J.reverse(),"beforeRouteLeave",I,V);for(const A of J)A.leaveGuards.forEach(D=>{$.push(Bt(D,I,V))});const h=M.bind(null,I,V);return $.push(h),Se($).then(()=>{$=[];for(const A of o.list())$.push(Bt(A,I,V));return $.push(h),Se($)}).then(()=>{$=Dr(Z,"beforeRouteUpdate",I,V);for(const A of Z)A.updateGuards.forEach(D=>{$.push(Bt(D,I,V))});return $.push(h),Se($)}).then(()=>{$=[];for(const A of g)if(A.beforeEnter)if(ct(A.beforeEnter))for(const D of A.beforeEnter)$.push(Bt(D,I,V));else $.push(Bt(A.beforeEnter,I,V));return $.push(h),Se($)}).then(()=>(I.matched.forEach(A=>A.enterCallbacks={}),$=Dr(g,"beforeRouteEnter",I,V,w),$.push(h),Se($))).then(()=>{$=[];for(const A of i.list())$.push(Bt(A,I,V));return $.push(h),Se($)}).catch(A=>_t(A,Ee.NAVIGATION_CANCELLED)?A:Promise.reject(A))}function W(I,V,$){l.list().forEach(J=>w(()=>J(I,V,$)))}function B(I,V,$,J,Z){const g=v(I,V);if(g)return g;const h=V===Ft,A=rn?history.state:{};$&&(J||h?s.replace(I.fullPath,de({scroll:h&&A&&A.scroll},Z)):s.push(I.fullPath,Z)),a.value=I,Ie(I,V,$,h),Re()}let Q;function se(){Q||(Q=s.listen((I,V,$)=>{if(!ve.listening)return;const J=j(I),Z=R(J,ve.currentRoute.value);if(Z){S(de(Z,{replace:!0,force:!0}),J).catch(Cn);return}p=J;const g=a.value;rn&&sd(po(g.fullPath,$.delta),br()),U(J,g).catch(h=>_t(h,Ee.NAVIGATION_ABORTED|Ee.NAVIGATION_CANCELLED)?h:_t(h,Ee.NAVIGATION_GUARD_REDIRECT)?(S(de(b(h.to),{force:!0}),J).then(A=>{_t(A,Ee.NAVIGATION_ABORTED|Ee.NAVIGATION_DUPLICATED)&&!$.delta&&$.type===Yr.pop&&s.go(-1,!1)}).catch(Cn),Promise.reject()):($.delta&&s.go(-$.delta,!1),K(h,J,g))).then(h=>{h=h||B(J,g,!1),h&&($.delta&&!_t(h,Ee.NAVIGATION_CANCELLED)?s.go(-$.delta,!1):$.type===Yr.pop&&_t(h,Ee.NAVIGATION_ABORTED|Ee.NAVIGATION_DUPLICATED)&&s.go(-1,!1)),W(J,g,h)}).catch(Cn)}))}let we=bn(),oe=bn(),re;function K(I,V,$){Re(I);const J=oe.list();return J.length?J.forEach(Z=>Z(I,V,$)):console.error(I),Promise.reject(I)}function fe(){return re&&a.value!==Ft?Promise.resolve():new Promise((I,V)=>{we.add([I,V])})}function Re(I){return re||(re=!I,se(),we.list().forEach(([V,$])=>I?$(I):V()),we.reset()),I}function Ie(I,V,$,J){const{scrollBehavior:Z}=e;if(!rn||!Z)return Promise.resolve();const g=!$&&od(po(I.fullPath,0))||(J||!$)&&history.state&&history.state.scroll||null;return ur().then(()=>Z(I,V,g)).then(h=>h&&rd(h)).catch(h=>K(h,I,V))}const ae=I=>s.go(I);let qe;const ye=new Set,ve={currentRoute:a,listening:!0,addRoute:y,removeRoute:L,clearRoutes:t.clearRoutes,hasRoute:H,getRoutes:P,resolve:j,options:e,push:T,replace:C,go:ae,back:()=>ae(-1),forward:()=>ae(1),beforeEach:o.add,beforeResolve:i.add,afterEach:l.add,onError:oe.add,isReady:fe,install(I){I.component("RouterLink",Dd),I.component("RouterView",Hd),I.config.globalProperties.$router=ve,Object.defineProperty(I.config.globalProperties,"$route",{enumerable:!0,get:()=>Ye(a)}),rn&&!qe&&a.value===Ft&&(qe=!0,T(s.location).catch(J=>{}));const V={};for(const J in Ft)Object.defineProperty(V,J,{get:()=>a.value[J],enumerable:!0});I.provide(yr,ve),I.provide(hs,Ko(V)),I.provide(zr,a);const $=I.unmount;ye.add(I),I.unmount=function(){ye.delete(I),ye.size<1&&(p=Ft,Q&&Q(),Q=null,a.value=Ft,qe=!1,re=!1),$()}}};function Se(I){return I.reduce((V,$)=>V.then(()=>w($)),Promise.resolve())}return ve}function Pt(){return nt(yr)}function xs(e){return nt(hs)}const Ud=["src"],At=Ve({__name:"DesktopIcon",props:{label:{},iconClass:{},iconSrc:{},color:{},onClick:{type:Function}},setup(e){const t=ge(!1);return(r,n)=>(q(),ee("div",{class:"group flex flex-col items-center gap-1 w-[88px] cursor-pointer select-none",onClick:n[0]||(n[0]=(...s)=>e.onClick&&e.onClick(...s)),onMousedown:n[1]||(n[1]=s=>t.value=!0),onMouseup:n[2]||(n[2]=s=>t.value=!1),onMouseleave:n[3]||(n[3]=s=>t.value=!1)},[_("div",{class:_e(["w-12 h-12 text-[40px] flex justify-center items-center transition-transform duration-75",[e.color||"text-white",t.value?"scale-90":"group-hover:scale-110"]]),style:{filter:"drop-shadow(2px 2px 1px rgba(0,0,0,0.6))"}},[e.iconClass?(q(),ee("i",{key:0,class:_e(e.iconClass)},null,2)):Xe("",!0),e.iconSrc?(q(),ee("img",{key:1,src:e.iconSrc,class:"w-full h-full object-contain"},null,8,Ud)):Xe("",!0)],2),_("span",{class:_e(["text-white text-xs px-1 py-0.5 max-w-full break-words text-center leading-tight rounded-sm",t.value?"bg-navy border border-dotted border-white":"bg-transparent group-hover:bg-navy group-hover:border group-hover:border-dotted group-hover:border-white"])},Ce(e.label),3)],32))}}),jd={key:0,id:"start-menu",class:"absolute bottom-10 left-1 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] w-52 flex flex-col z-[60] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"},$d={class:"flex"},Gd={class:"flex-1 py-1 text-sm text-black"},Vd={class:"h-10 bg-[#c0c0c0] shadow-[inset_0_1px_0_#ffffff,inset_0_2px_0_#dfdfdf] flex items-center px-0.5 py-0.5 gap-1 z-50 fixed bottom-0 w-full select-none border-t-2 border-t-[#ffffff]"},Wd={class:"flex-1 flex justify-start gap-1 overflow-hidden px-0.5 min-w-0"},Jd=["onClick"],Kd={class:"truncate"},Yd={class:"px-2.5 py-0.5 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] flex items-center gap-2 text-xs h-[26px] shrink-0 bg-[#c0c0c0]"},qd={class:"flex flex-col items-end leading-none"},zd={class:"text-[11px]"},Xd={class:"text-[9px] text-gray-600"},Qd=Ve({__name:"Taskbar",props:{openWindows:{}},emits:["activate-window","navigate","shutdown"],setup(e,{emit:t}){const r=ge(!1),n=ge(""),s=ge(""),o=()=>{const d=new Date,c=d.getHours().toString().padStart(2,"0"),f=d.getMinutes().toString().padStart(2,"0");n.value=`${c}:${f}`;const y=d.getFullYear(),L=(d.getMonth()+1).toString().padStart(2,"0"),P=d.getDate().toString().padStart(2,"0");s.value=`${y}-${L}-${P}`};let i;vt(()=>{o(),i=setInterval(o,3e4),document.addEventListener("click",a)}),en(()=>{clearInterval(i),document.removeEventListener("click",a)});const l=d=>{d.stopPropagation(),r.value=!r.value},a=d=>{const c=document.getElementById("start-menu"),f=document.getElementById("start-btn");c&&!c.contains(d.target)&&f&&!f.contains(d.target)&&(r.value=!1)},p=t;return(d,c)=>(q(),ee(me,null,[he(nc,{name:"start-menu"},{default:rt(()=>[r.value?(q(),ee("div",jd,[_("div",$d,[c[11]||(c[11]=_("div",{class:"w-8 bg-[#000080] text-[#c0c0c0] flex items-end justify-center pb-2 shrink-0"},[_("span",{class:"transform -rotate-90 text-lg font-bold whitespace-nowrap tracking-[4px] mb-6 origin-center",style:{"font-family":"'Georgia', serif"}}," YF-Blog ")],-1)),_("div",Gd,[_("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:c[0]||(c[0]=f=>p("navigate","/"))},[...c[4]||(c[4]=[_("i",{class:"fa fa-desktop w-4 text-center"},null,-1),_("span",null,"桌面",-1)])]),_("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:c[1]||(c[1]=f=>p("navigate","/all-notes"))},[...c[5]||(c[5]=[_("i",{class:"fa fa-folder-open w-4 text-center"},null,-1),_("span",null,"我的文档",-1)])]),_("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:c[2]||(c[2]=f=>p("navigate","/categories"))},[...c[6]||(c[6]=[_("i",{class:"fa fa-cog w-4 text-center"},null,-1),_("span",null,"控制面板",-1)])]),c[8]||(c[8]=_("hr",{class:"border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1"},null,-1)),c[9]||(c[9]=_("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onclick:"window.open('https://github.com', '_blank')"},[_("i",{class:"fa fa-globe w-4 text-center"}),_("span",null,"Internet 浏览器")],-1)),c[10]||(c[10]=_("hr",{class:"border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1"},null,-1)),_("div",{class:"px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors",onClick:c[3]||(c[3]=f=>p("shutdown"))},[...c[7]||(c[7]=[_("i",{class:"fa fa-power-off w-4 text-center"},null,-1),_("span",null,"关闭系统...",-1)])])])])])):Xe("",!0)]),_:1}),_("footer",Vd,[_("button",{id:"start-btn",onClick:l,class:_e(["flex items-center gap-1.5 px-2 py-1 font-bold text-sm win-btn text-black h-[28px] shrink-0",r.value?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]"])},[...c[12]||(c[12]=[_("img",{src:"https://win98icons.alexmeub.com/icons/png/windows-0.png",class:"w-5 h-5",alt:"win"},null,-1),Ne(" 开始 ",-1)])],2),c[14]||(c[14]=_("div",{class:"w-[3px] h-[22px] bg-[#808080] border-r border-[#ffffff] shrink-0"},null,-1)),_("div",Wd,[(q(!0),ee(me,null,ot(e.openWindows,f=>(q(),ee("div",{key:f.id,class:_e(["px-2 py-1 font-bold text-xs flex items-center gap-1.5 w-[140px] md:w-[170px] shrink min-w-0 cursor-pointer text-black h-[26px]",f.isActive?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] bg-[#c0c0c0]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]"]),onClick:y=>p("activate-window",f.id)},[_("i",{class:_e([f.icon,"shrink-0 text-xs"])},null,2),_("span",Kd,Ce(f.title),1)],10,Jd))),128))]),_("div",Yd,[c[13]||(c[13]=_("i",{class:"fa fa-volume-up text-[11px]"},null,-1)),_("div",qd,[_("span",zd,Ce(n.value),1),_("span",Xd,Ce(s.value),1)])])])],64))}}),Qi=(e,t)=>{const r=e.__vccOpts||e;for(const[n,s]of t)r[n]=s;return r},Zd=Qi(Qd,[["__scopeId","data-v-12ad2e01"]]),Xr=[{id:"hello-world",title:"Hello World",date:"2023-10-01",icon:"fa fa-file-text-o",path:"/notes/hello-world",category:"java"},{id:"idea-shortcuts",title:"IDEA Shortcuts",date:"2023-11-01",icon:"fa fa-file-text-o",path:"/notes/idea-shortcuts",category:"java"},{id:"java-collections-framework",title:"Java Collections",date:"2023-11-15",icon:"fa fa-file-text-o",path:"/notes/java-collections-framework",category:"java"},{id:"vue-migration",title:"Vue Migration",date:"2024-03-15",icon:"fa fa-file-code-o",path:"/notes/vue-migration",category:"frontend"},{id:"spring-boot-guide",title:"Spring Boot Guide",date:"2024-03-20",icon:"fa fa-leaf",path:"/notes/spring-boot-guide",category:"spring"},{id:"mysql-basics",title:"MySQL Basics",date:"2024-03-22",icon:"fa fa-database",path:"/notes/mysql-basics",category:"database"},{id:"git-basics",title:"Git 常用命令",date:"2024-04-05",icon:"fa fa-code-fork",path:"/notes/git-basics",category:"devops"},{id:"docker-intro",title:"Docker 入门指南",date:"2024-04-12",icon:"fa fa-ship",path:"/notes/docker-intro",category:"devops"},{id:"linux-commands",title:"Linux 基础命令",date:"2024-04-20",icon:"fa fa-terminal",path:"/notes/linux-commands",category:"devops"},{id:"javascript-es6",title:"JavaScript ES6+ 新特性",date:"2024-05-01",icon:"fa fa-file-code-o",path:"/notes/javascript-es6",category:"frontend"},{id:"design-patterns",title:"设计模式入门",date:"2024-05-15",icon:"fa fa-puzzle-piece",path:"/notes/design-patterns",category:"java"},{id:"redis-basics",title:"Redis 基础入门",date:"2024-05-28",icon:"fa fa-database",path:"/notes/redis-basics",category:"database"}],ep={class:"h-screen w-screen overflow-hidden flex flex-col relative bg-[url('/wallpaper.jpg')] bg-cover bg-center"},tp={class:"absolute top-0 left-0 bottom-10 w-full p-4 flex flex-col gap-4 flex-wrap content-start z-0"},np={class:"z-10 w-full h-full pointer-events-none"},rp={key:0,class:"fixed inset-0 bg-[#008080] z-[100] flex flex-col items-center justify-center gap-6 font-bold font-mono"},sp=Ve({__name:"App",setup(e){const t=Pt(),r=xs(),n=ge([{id:"welcome",title:"欢迎来到 YF 的 Blog.exe",icon:"fa fa-info-circle",isActive:!0}]),s=Te(()=>{const c=n.value.find(f=>f.isActive);return(c==null?void 0:c.id)||null});_n("activeWindowId",s),Qt(()=>r.path,c=>{const f=[],y=n.value.find(L=>L.id==="welcome");if(y&&f.push({...y,isActive:!1}),c==="/computer")f.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!0});else if(c==="/all-notes")f.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!1}),f.push({id:"docs",title:"我的文档",icon:"fa fa-folder-open",isActive:!0});else if(c==="/categories")f.push({id:"computer",title:"我的电脑",icon:"fa fa-desktop",isActive:!1}),f.push({id:"categories",title:"分类",icon:"fa fa-cog",isActive:!0});else if(c.startsWith("/notes/")){const L=r.params.id,P=Xr.find(j=>j.id===L),H=P?P.title:"Note";f.push({id:"docs",title:"我的文档",icon:"fa fa-folder-open",isActive:!1}),f.push({id:"note",title:H,icon:"fa fa-file-text-o",isActive:!0})}else c==="/airplane"?f.push({id:"airplane",title:"飞机大战",icon:"fa fa-fighter-jet",isActive:!0}):c==="/notepad"?f.push({id:"notepad",title:"记事本 - 未命名",icon:"fa fa-pencil-square-o",isActive:!0}):c==="/paint"?f.push({id:"paint",title:"画图 - 未命名",icon:"fa fa-paint-brush",isActive:!0}):c==="/calculator"&&f.push({id:"calculator",title:"计算器",icon:"fa fa-calculator",isActive:!0});n.value=f},{immediate:!0});const o=c=>{c.startsWith("http")?window.open(c,"_blank"):t.push(c)},i=c=>{c==="computer"?t.push("/computer"):c==="docs"?t.push("/all-notes"):c==="welcome"?t.push("/"):c==="airplane"?t.push("/airplane"):c==="notepad"?t.push("/notepad"):c==="paint"?t.push("/paint"):c==="calculator"&&t.push("/calculator"),n.value.forEach(f=>f.isActive=f.id===c)},l=ge(!1),a=()=>{l.value=!0},p=()=>{window.close(),window.location.href="about:blank"},d=c=>{alert(c)};return(c,f)=>{const y=la("router-view");return q(),ee("div",ep,[_("main",tp,[he(At,{label:"我的电脑",iconClass:"fa fa-desktop",color:"text-white",onClick:f[0]||(f[0]=L=>o("/computer"))}),he(At,{label:"我的文档",iconClass:"fa fa-folder-open",color:"text-yellow-400",onClick:f[1]||(f[1]=L=>o("/all-notes"))}),he(At,{label:"控制面板",iconClass:"fa fa-cog",color:"text-pink-300",onClick:f[2]||(f[2]=L=>o("/categories"))}),he(At,{label:"Internet 浏览器",iconClass:"fa fa-globe",color:"text-blue-300",onClick:f[3]||(f[3]=L=>o("https://github.com"))}),he(At,{label:"记事本",iconClass:"fa fa-pencil-square-o",color:"text-white",onClick:f[4]||(f[4]=L=>o("/notepad"))}),he(At,{label:"飞机大战",iconClass:"fa fa-fighter-jet",color:"text-yellow-300",onClick:f[5]||(f[5]=L=>o("/airplane"))}),he(At,{label:"画图",iconClass:"fa fa-paint-brush",color:"text-orange-300",onClick:f[6]||(f[6]=L=>o("/paint"))}),he(At,{label:"计算器",iconClass:"fa fa-calculator",color:"text-white",onClick:f[7]||(f[7]=L=>o("/calculator"))}),he(At,{label:"回收站",iconClass:"fa fa-trash-o",color:"text-gray-400",onClick:f[8]||(f[8]=L=>d("回收站是空的。"))})]),_("div",np,[he(y,null,{default:rt(({Component:L})=>[(q(),Ze(aa(L),{class:"pointer-events-auto"}))]),_:1})]),he(Zd,{openWindows:n.value,onActivateWindow:i,onNavigate:o,onShutdown:a},null,8,["openWindows"]),l.value?(q(),ee("div",rp,[f[9]||(f[9]=Ba('<div class="bg-[#c0c0c0] p-8 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] text-center border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"><div class="flex items-center gap-4 mb-4"><img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" class="w-12 h-12" alt="windows"><div><div class="text-xl text-black">Windows 98</div><div class="text-sm text-gray-600">正在关机...</div></div></div><hr class="border-t-[#808080] border-b-[#ffffff] mb-4"><div class="text-lg text-black">It is now safe to turn off your computer.</div><div class="text-xs text-gray-600 mt-1">(现在可以安全地关闭浏览器了)</div></div>',1)),_("button",{onClick:p,class:"px-6 py-2 bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-bold font-sans border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"}," 关闭页面 ")])):Xe("",!0)])}}}),op={class:"flex gap-[2px] shrink-0"},ip=["title"],lp={key:0,class:"relative w-[10px] h-[9px]"},ap={key:1,class:"w-[8px] h-[8px] bg-[#c0c0c0] border-[1.5px] border-t-[#ffffff] border-l-[#ffffff] border-b-[#0a0a0a] border-r-[#0a0a0a] shadow-[inset_0_0_0_0.5px_#808080]"},cp={key:0,class:"win-dropdown absolute top-[26px] left-[2px] z-50 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[inset_-1px_-1px_#808080,inset_1px_1px_#dfdfdf] py-[2px] min-w-[180px] text-[11px] text-black"},dp={key:0,class:"border-t-[#808080] border-b-[#ffffff] mx-[2px] my-[3px]"},pp=["onClick"],up=["innerHTML"],fp={key:0,class:"ml-[24px] text-[11px]"},gp={class:"win-menu-bar flex px-[2px] py-[2px] text-[11px] select-none bg-[#c0c0c0] gap-0 shrink-0"},hp=["onClick","onMouseenter"],xp=["innerHTML"],mp={key:0,class:"win-dropdown absolute top-full left-0 z-50 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[inset_-1px_-1px_#808080,inset_1px_1px_#dfdfdf] py-[2px] min-w-[200px]"},bp={key:0,class:"border-t-[#808080] border-b-[#ffffff] mx-[2px] my-[3px]"},yp=["onClick"],vp={class:"w-[16px] shrink-0 text-[11px]"},Sp={key:0},Ep=["innerHTML"],_p={key:0,class:"ml-[24px] text-[11px]"},Ap={class:"flex-1 bg-white shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] m-[4px] p-[4px] overflow-y-auto text-black min-h-0"},wp=Ve({__name:"Window",props:{title:{},icon:{},isOpen:{type:Boolean},isActive:{type:Boolean}},emits:["close","minimize","maximize","focus"],setup(e,{emit:t}){const r=e,n=t,s=ge(null),o=ge(!1),i=ge(!1),l=ge(!1);Qt(()=>r.isActive,C=>{C&&i.value&&(i.value=!1)});const a=[{id:"file",label:"文件(<u>F</u>)",items:[{label:"新建(<u>N</u>)",shortcut:"Ctrl+N",disabled:!0},{label:"打开(<u>O</u>)...",shortcut:"Ctrl+O",disabled:!0},{type:"separator"},{label:"保存(<u>S</u>)",shortcut:"Ctrl+S",disabled:!0},{label:"另存为(<u>A</u>)...",disabled:!0},{type:"separator"},{label:"页面设置(<u>U</u>)...",disabled:!0},{label:"打印(<u>P</u>)...",shortcut:"Ctrl+P",disabled:!0},{type:"separator"},{label:"关闭(<u>C</u>)",shortcut:"Alt+F4",action:()=>{f(),n("close")}}]},{id:"edit",label:"编辑(<u>E</u>)",items:[{label:"撤销(<u>U</u>)",shortcut:"Ctrl+Z",disabled:!0},{type:"separator"},{label:"剪切(<u>T</u>)",shortcut:"Ctrl+X",disabled:!0},{label:"复制(<u>C</u>)",shortcut:"Ctrl+C",disabled:!0},{label:"粘贴(<u>P</u>)",shortcut:"Ctrl+V",disabled:!0},{type:"separator"},{label:"全选(<u>A</u>)",shortcut:"Ctrl+A",disabled:!0}]},{id:"view",label:"查看(<u>V</u>)",items:[{label:"工具栏(<u>T</u>)",disabled:!0,checked:!0},{label:"状态栏(<u>S</u>)",checked:!0,action:()=>{f()}},{type:"separator"},{label:"大图标(<u>G</u>)",disabled:!0},{label:"小图标(<u>M</u>)",disabled:!0},{label:"列表(<u>L</u>)",disabled:!0},{label:"详细资料(<u>D</u>)",disabled:!0},{type:"separator"},{label:"刷新(<u>R</u>)",shortcut:"F5",action:()=>{f(),window.location.reload()}}]},{id:"help",label:"帮助(<u>H</u>)",items:[{label:"帮助主题(<u>H</u>)",disabled:!0},{type:"separator"},{label:"关于本程序(<u>A</u>)...",action:()=>{f(),alert(`YF Blog v2.0
Windows 98 Edition
基于 Vue 3 + TypeScript + Vite

© 2024 YF. All rights reserved.`)}}]}],p=Te(()=>[{label:"还原(<u>R</u>)",disabled:!o.value,action:()=>{y(),o.value=!1}},{label:"移动(<u>M</u>)",disabled:!0},{label:"大小(<u>S</u>)",disabled:!0},{label:"最小化(<u>N</u>)",action:()=>{y(),n("minimize")}},{label:"最大化(<u>X</u>)",disabled:o.value,action:()=>{y(),o.value=!0}},{type:"separator"},{label:"关闭(<u>C</u>)",shortcut:"Alt+F4",action:()=>{y(),n("close")}}]),d=C=>{s.value===C?s.value=null:s.value=C},c=C=>{s.value!==null&&(s.value=C)},f=()=>{s.value=null},y=()=>{l.value=!1},L=()=>{l.value=!l.value},P=()=>{o.value=!o.value},H=()=>{i.value=!0,n("minimize")},j=()=>{n("close")},b=C=>{const R=C.target;!R.closest(".win-menu-bar")&&!R.closest(".win-dropdown")&&!R.closest(".win-system-menu-trigger")&&(f(),y())},v=C=>{if(C.key==="Escape"&&(s.value?f():l.value&&y()),C.altKey&&C.key==="F4"&&(C.preventDefault(),j()),C.altKey){const S={f:"file",e:"edit",v:"view",h:"help"}[C.key.toLowerCase()];S&&(C.preventDefault(),d(S))}},T=Te(()=>o.value?{top:"0",left:"0",transform:"none",width:"100%",maxWidth:"100%",height:"calc(100% - 40px)",maxHeight:"calc(100vh - 40px)"}:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"95%",maxWidth:"42rem",height:"auto",maxHeight:"80vh"});return vt(()=>{document.addEventListener("click",b,!0),document.addEventListener("keydown",v)}),en(()=>{document.removeEventListener("click",b,!0),document.removeEventListener("keydown",v)}),(C,R)=>e.isOpen&&!i.value?(q(),ee("div",{key:0,class:_e(["win-window fixed bg-[#c0c0c0] flex flex-col z-20 border-2 shadow-win95-outset",e.isActive?"border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]":""]),style:Ut(T.value),onMousedown:R[1]||(R[1]=S=>n("focus"))},[_("div",{class:_e(["win-titlebar flex items-center select-none shrink-0 h-[26px] px-[2px] gap-[2px]",e.isActive?"bg-[linear-gradient(90deg,#000080,#1084d0)]":"bg-[linear-gradient(90deg,#808080,#b5b5b5)]"])},[_("button",{class:"win-system-menu-trigger w-[18px] h-[18px] flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0",onClick:Lt(L,["stop"]),onMousedown:R[0]||(R[0]=Lt(()=>{},["stop"]))},[e.icon?(q(),ee("i",{key:0,class:_e([e.icon,e.isActive?"text-white text-[11px]":"text-[#c0c0c0] text-[11px]"])},null,2)):Xe("",!0)],32),_("span",{class:_e(["flex-1 text-[11px] font-bold truncate leading-none select-none",e.isActive?"text-white":"text-[#c0c0c0]"])},Ce(e.title),3),_("div",op,[_("button",{onClick:Lt(H,["stop"]),class:"win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-end justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0",title:"最小化"},[...R[2]||(R[2]=[_("div",{class:"w-[8px] h-[2px] bg-black mb-[2px]"},null,-1)])]),_("button",{onClick:Lt(P,["stop"]),class:"win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0 relative",title:o.value?"还原":"最大化"},[o.value?(q(),ee("div",lp,[...R[3]||(R[3]=[_("div",{class:"absolute top-0 right-0 w-[7px] h-[6px] bg-[#c0c0c0] border-[1.5px] border-t-[#0a0a0a] border-l-[#0a0a0a] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_0_0_0_0.5px_#808080]"},null,-1),_("div",{class:"absolute bottom-0 left-0 w-[7px] h-[6px] bg-[#c0c0c0] border-[1.5px] border-t-[#ffffff] border-l-[#ffffff] border-b-[#0a0a0a] border-r-[#0a0a0a] shadow-[inset_0_0_0_0.5px_#808080]"},null,-1)])])):(q(),ee("div",ap))],8,ip),_("button",{onClick:Lt(j,["stop"]),class:"win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0",title:"关闭"},[...R[4]||(R[4]=[_("svg",{viewBox:"0 0 6 6",class:"w-[6px] h-[6px]"},[_("line",{x1:"0.5",y1:"0.5",x2:"5.5",y2:"5.5",stroke:"black","stroke-width":"1.2"}),_("line",{x1:"5.5",y1:"0.5",x2:"0.5",y2:"5.5",stroke:"black","stroke-width":"1.2"})],-1)])])])],2),l.value?(q(),ee("div",cp,[(q(!0),ee(me,null,ot(p.value,(S,M)=>(q(),ee(me,{key:M},[S.type==="separator"?(q(),ee("hr",dp)):(q(),ee("div",{key:1,class:_e(["win-menu-item px-[18px] py-[4px] flex items-center justify-between cursor-pointer whitespace-nowrap",S.disabled?"text-[#808080] cursor-default":"hover:bg-[#000080] hover:text-white"]),onClick:Lt(w=>{var U;return S.disabled?null:(U=S.action)==null?void 0:U.call(S)},["stop"])},[_("span",{class:"text-[11px]",innerHTML:S.label},null,8,up),S.shortcut?(q(),ee("span",fp,Ce(S.shortcut),1)):Xe("",!0)],10,pp))],64))),128))])):Xe("",!0),_("div",gp,[(q(),ee(me,null,ot(a,S=>_("div",{key:S.id,class:_e(["win-menu-header px-[6px] py-[3px] cursor-pointer relative whitespace-nowrap text-black",s.value===S.id?"bg-[#000080] text-white":"hover:bg-[#000080] hover:text-white"]),onClick:Lt(M=>d(S.id),["stop"]),onMouseenter:M=>c(S.id)},[_("span",{innerHTML:S.label},null,8,xp),s.value===S.id?(q(),ee("div",mp,[(q(!0),ee(me,null,ot(S.items,(M,w)=>(q(),ee(me,{key:w},[M.type==="separator"?(q(),ee("hr",bp)):(q(),ee("div",{key:1,class:_e(["win-menu-item px-[18px] py-[4px] flex items-center cursor-pointer whitespace-nowrap",M.disabled?"text-[#808080] cursor-default":"hover:bg-[#000080] hover:text-white"]),onClick:Lt(U=>{var W;return M.disabled?null:(W=M.action)==null?void 0:W.call(M)},["stop"])},[_("span",vp,[M.checked?(q(),ee("span",Sp,"✓")):Xe("",!0)]),_("span",{class:"flex-1 text-[11px]",innerHTML:M.label},null,8,Ep),M.shortcut?(q(),ee("span",_p,Ce(M.shortcut),1)):Xe("",!0)],10,yp))],64))),128))])):Xe("",!0)],42,hp)),64))]),_("div",Ap,[ca(C.$slots,"default",{},void 0)]),R[5]||(R[5]=_("div",{class:"flex px-[4px] py-[2px] text-[11px] text-black border-t-2 border-t-[#808080] border-b border-b-[#ffffff] bg-[#c0c0c0] shrink-0 select-none gap-[8px]"},[_("span",{class:"flex-1"},"就绪"),_("span",{class:"text-[11px]"},"| 100%")],-1))],38)):Xe("",!0)}}),Dt=Qi(wp,[["__scopeId","data-v-d88eef26"]]),Tp=Ve({__name:"Desktop",setup(e){const t=localStorage.getItem("has-visited"),r=ge(!t),n=ge(!1),s=ge(!t);vt(()=>{localStorage.setItem("has-visited","1")});const o=nt("activeWindowId",Te(()=>null));Qt(o,p=>{p==="welcome"&&a()});const i=()=>{r.value=!1},l=()=>{n.value=!0,s.value=!1},a=()=>{n.value&&(n.value=!1),s.value=!0};return(p,d)=>r.value?(q(),Ze(Dt,{key:0,title:"欢迎来到 YF 的 Blog.exe",icon:"fa fa-info-circle",isOpen:r.value,isActive:s.value,onClose:i,onMinimize:l,onFocus:a},{default:rt(()=>[...d[0]||(d[0]=[_("div",{class:"flex flex-col items-center text-center gap-3"},[_("div",{class:"flex items-center gap-4"},[_("img",{src:"https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png",class:"w-16 h-16",alt:"computer"}),_("div",{class:"text-left"},[_("h1",{class:"text-xl font-bold text-[#000080]"},"YF's Blog"),_("p",{class:"text-xs text-gray-600"},"Version 2.0 · Windows 98 Edition")])]),_("hr",{class:"w-full border-t-[#808080] border-b-[#ffffff]"}),_("div",{class:"text-left w-full text-sm space-y-2"},[_("p",null,"👋 欢迎来到我的个人博客！"),_("p",null,[Ne("这是一个复刻 "),_("strong",null,"Windows 98"),Ne(" 风格的技术博客，记录了我的编程学习笔记和开发经验。")]),_("p",null,"你可以："),_("ul",{class:"list-disc ml-6 space-y-1"},[_("li",null,[Ne("点击桌面上的 "),_("strong",null,'"我的文档"'),Ne(" 图标查看所有文章")]),_("li",null,[Ne("通过 "),_("strong",null,'"控制面板"'),Ne(" 按分类浏览文章")]),_("li",null,[Ne("点击 "),_("strong",null,'"Internet 浏览器"'),Ne(" 访问 GitHub")]),_("li",null,[Ne("随时点击左下角 "),_("strong",null,'"开始"'),Ne(" 按钮打开菜单")])])]),_("hr",{class:"w-full border-t-[#808080] border-b-[#ffffff]"}),_("div",{class:"grid grid-cols-3 gap-4 w-full text-xs"},[_("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[_("div",{class:"font-bold text-lg text-[#000080]"},"12+"),_("div",{class:"text-gray-600"},"技术文章")]),_("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[_("div",{class:"font-bold text-lg text-[#000080]"},"6"),_("div",{class:"text-gray-600"},"分类方向")]),_("div",{class:"text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]"},[_("div",{class:"font-bold text-lg text-[#000080]"},"∞"),_("div",{class:"text-gray-600"},"持续更新")])]),_("p",{class:"text-[10px] text-gray-500 mt-2"},"© 2024 YF. All rights reserved. · Powered by Vue 3 + Vite")],-1)])]),_:1},8,["isOpen","isActive"])):Xe("",!0)}}),Cp={class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3"},Rp={class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},Ip={class:"grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 content-start"},Op=["onClick"],Mp={class:"w-12 h-12 flex justify-center items-center text-[36px] text-gray-600 group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.15))"}},kp={class:"text-[11px] text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white break-words w-full leading-tight rounded-sm"},Pp={key:0,class:"text-center text-gray-500 py-8"},Dp={class:"mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300"},Np=Ve({__name:"AllNotes",setup(e){const t=Pt(),r=xs(),n=Te(()=>r.query.category),s=Te(()=>n.value?Xr.filter(a=>a.category===n.value):Xr),o=Te(()=>n.value?`C:\\我的文档\\${n.value}\\`:"C:\\我的文档\\文章"),i=a=>{a.startsWith("http")?window.open(a,"_blank"):t.push(a)},l=()=>{n.value?t.push("/categories"):t.push("/computer")};return(a,p)=>(q(),Ze(Dt,{title:"我的文档",icon:"fa fa-folder-open",isOpen:!0,isActive:!0,onClose:p[0]||(p[0]=d=>Ye(t).push("/"))},{default:rt(()=>[_("div",Cp,[p[3]||(p[3]=_("span",{class:"text-xs"},"地址(D)",-1)),_("div",Rp,[p[1]||(p[1]=_("i",{class:"fa fa-folder text-yellow-400"},null,-1)),Ne(" "+Ce(o.value),1)]),_("button",{onClick:l,class:"px-2 py-0.5 bg-silver shadow-win95-outset active:shadow-win95-inset text-xs flex items-center gap-1 win-btn",title:"向上"},[...p[2]||(p[2]=[_("i",{class:"fa fa-arrow-up"},null,-1),Ne(" 向上 ",-1)])])]),_("div",Ip,[(q(!0),ee(me,null,ot(s.value,d=>(q(),ee("div",{key:d.id,class:"flex flex-col items-center gap-1 cursor-pointer group w-[80px]",onClick:c=>i(d.path)},[_("div",Mp,[_("i",{class:_e(d.icon)},null,2)]),_("span",kp,Ce(d.title),1)],8,Op))),128))]),s.value.length===0?(q(),ee("div",Pp,[...p[4]||(p[4]=[_("i",{class:"fa fa-folder-open-o text-4xl mb-2 block"},null,-1),_("p",null,"此分类下暂无文章。",-1)])])):Xe("",!0),_("div",Dp,Ce(s.value.length)+" 个对象 ",1)]),_:1}))}}),Lp={class:"grid grid-cols-4 md:grid-cols-6 gap-4"},Fp=["onClick"],Hp={class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm"},Bp={class:"mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300"},Up=Ve({__name:"Categories",setup(e){const t=Pt(),r=ge([{id:"java",title:"Java",icon:"fa fa-coffee",color:"text-orange-500"},{id:"spring",title:"Spring",icon:"fa fa-leaf",color:"text-green-500"},{id:"database",title:"Database",icon:"fa fa-database",color:"text-blue-500"},{id:"frontend",title:"Frontend",icon:"fa fa-code",color:"text-pink-500"},{id:"devops",title:"DevOps",icon:"fa fa-server",color:"text-purple-500"}]),n=s=>{s.startsWith("http")?window.open(s,"_blank"):t.push(s)};return(s,o)=>(q(),Ze(Dt,{title:"控制面板",icon:"fa fa-cog",isOpen:!0,isActive:!0,onClose:o[0]||(o[0]=i=>Ye(t).push("/"))},{default:rt(()=>[o[1]||(o[1]=_("div",{class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-2"},[_("span",{class:"text-xs"},"地址(D)"),_("div",{class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},[_("i",{class:"fa fa-folder-open text-yellow-400"}),Ne(" C:\\控制面板\\分类 ")])],-1)),_("div",Lp,[(q(!0),ee(me,null,ot(r.value,i=>(q(),ee("div",{key:i.id,class:"flex flex-col items-center gap-1 cursor-pointer group w-20",onClick:l=>n("/all-notes?category="+i.id)},[_("div",{class:_e(["w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",i.color]),style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[_("i",{class:_e(i.icon)},null,2)],2),_("span",Hp,Ce(i.title),1)],8,Fp))),128))]),_("div",Bp,Ce(r.value.length)+" 个分类 ",1)]),_:1}))}});var Ao=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function jp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Zi={exports:{}};(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var r=function(n){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,o=0,i={},l={manual:n.Prism&&n.Prism.manual,disableWorkerMessageHandler:n.Prism&&n.Prism.disableWorkerMessageHandler,util:{encode:function b(v){return v instanceof a?new a(v.type,b(v.content),v.alias):Array.isArray(v)?v.map(b):v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(b){return Object.prototype.toString.call(b).slice(8,-1)},objId:function(b){return b.__id||Object.defineProperty(b,"__id",{value:++o}),b.__id},clone:function b(v,T){T=T||{};var C,R;switch(l.util.type(v)){case"Object":if(R=l.util.objId(v),T[R])return T[R];C={},T[R]=C;for(var S in v)v.hasOwnProperty(S)&&(C[S]=b(v[S],T));return C;case"Array":return R=l.util.objId(v),T[R]?T[R]:(C=[],T[R]=C,v.forEach(function(M,w){C[w]=b(M,T)}),C);default:return v}},getLanguage:function(b){for(;b;){var v=s.exec(b.className);if(v)return v[1].toLowerCase();b=b.parentElement}return"none"},setLanguage:function(b,v){b.className=b.className.replace(RegExp(s,"gi"),""),b.classList.add("language-"+v)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(C){var b=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(C.stack)||[])[1];if(b){var v=document.getElementsByTagName("script");for(var T in v)if(v[T].src==b)return v[T]}return null}},isActive:function(b,v,T){for(var C="no-"+v;b;){var R=b.classList;if(R.contains(v))return!0;if(R.contains(C))return!1;b=b.parentElement}return!!T}},languages:{plain:i,plaintext:i,text:i,txt:i,extend:function(b,v){var T=l.util.clone(l.languages[b]);for(var C in v)T[C]=v[C];return T},insertBefore:function(b,v,T,C){C=C||l.languages;var R=C[b],S={};for(var M in R)if(R.hasOwnProperty(M)){if(M==v)for(var w in T)T.hasOwnProperty(w)&&(S[w]=T[w]);T.hasOwnProperty(M)||(S[M]=R[M])}var U=C[b];return C[b]=S,l.languages.DFS(l.languages,function(W,B){B===U&&W!=b&&(this[W]=S)}),S},DFS:function b(v,T,C,R){R=R||{};var S=l.util.objId;for(var M in v)if(v.hasOwnProperty(M)){T.call(v,M,v[M],C||M);var w=v[M],U=l.util.type(w);U==="Object"&&!R[S(w)]?(R[S(w)]=!0,b(w,T,null,R)):U==="Array"&&!R[S(w)]&&(R[S(w)]=!0,b(w,T,M,R))}}},plugins:{},highlightAll:function(b,v){l.highlightAllUnder(document,b,v)},highlightAllUnder:function(b,v,T){var C={callback:T,container:b,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};l.hooks.run("before-highlightall",C),C.elements=Array.prototype.slice.apply(C.container.querySelectorAll(C.selector)),l.hooks.run("before-all-elements-highlight",C);for(var R=0,S;S=C.elements[R++];)l.highlightElement(S,v===!0,C.callback)},highlightElement:function(b,v,T){var C=l.util.getLanguage(b),R=l.languages[C];l.util.setLanguage(b,C);var S=b.parentElement;S&&S.nodeName.toLowerCase()==="pre"&&l.util.setLanguage(S,C);var M=b.textContent,w={element:b,language:C,grammar:R,code:M};function U(B){w.highlightedCode=B,l.hooks.run("before-insert",w),w.element.innerHTML=w.highlightedCode,l.hooks.run("after-highlight",w),l.hooks.run("complete",w),T&&T.call(w.element)}if(l.hooks.run("before-sanity-check",w),S=w.element.parentElement,S&&S.nodeName.toLowerCase()==="pre"&&!S.hasAttribute("tabindex")&&S.setAttribute("tabindex","0"),!w.code){l.hooks.run("complete",w),T&&T.call(w.element);return}if(l.hooks.run("before-highlight",w),!w.grammar){U(l.util.encode(w.code));return}if(v&&n.Worker){var W=new Worker(l.filename);W.onmessage=function(B){U(B.data)},W.postMessage(JSON.stringify({language:w.language,code:w.code,immediateClose:!0}))}else U(l.highlight(w.code,w.grammar,w.language))},highlight:function(b,v,T){var C={code:b,grammar:v,language:T};if(l.hooks.run("before-tokenize",C),!C.grammar)throw new Error('The language "'+C.language+'" has no grammar.');return C.tokens=l.tokenize(C.code,C.grammar),l.hooks.run("after-tokenize",C),a.stringify(l.util.encode(C.tokens),C.language)},tokenize:function(b,v){var T=v.rest;if(T){for(var C in T)v[C]=T[C];delete v.rest}var R=new c;return f(R,R.head,b),d(b,R,v,R.head,0),L(R)},hooks:{all:{},add:function(b,v){var T=l.hooks.all;T[b]=T[b]||[],T[b].push(v)},run:function(b,v){var T=l.hooks.all[b];if(!(!T||!T.length))for(var C=0,R;R=T[C++];)R(v)}},Token:a};n.Prism=l;function a(b,v,T,C){this.type=b,this.content=v,this.alias=T,this.length=(C||"").length|0}a.stringify=function b(v,T){if(typeof v=="string")return v;if(Array.isArray(v)){var C="";return v.forEach(function(U){C+=b(U,T)}),C}var R={type:v.type,content:b(v.content,T),tag:"span",classes:["token",v.type],attributes:{},language:T},S=v.alias;S&&(Array.isArray(S)?Array.prototype.push.apply(R.classes,S):R.classes.push(S)),l.hooks.run("wrap",R);var M="";for(var w in R.attributes)M+=" "+w+'="'+(R.attributes[w]||"").replace(/"/g,"&quot;")+'"';return"<"+R.tag+' class="'+R.classes.join(" ")+'"'+M+">"+R.content+"</"+R.tag+">"};function p(b,v,T,C){b.lastIndex=v;var R=b.exec(T);if(R&&C&&R[1]){var S=R[1].length;R.index+=S,R[0]=R[0].slice(S)}return R}function d(b,v,T,C,R,S){for(var M in T)if(!(!T.hasOwnProperty(M)||!T[M])){var w=T[M];w=Array.isArray(w)?w:[w];for(var U=0;U<w.length;++U){if(S&&S.cause==M+","+U)return;var W=w[U],B=W.inside,Q=!!W.lookbehind,se=!!W.greedy,we=W.alias;if(se&&!W.pattern.global){var oe=W.pattern.toString().match(/[imsuy]*$/)[0];W.pattern=RegExp(W.pattern.source,oe+"g")}for(var re=W.pattern||W,K=C.next,fe=R;K!==v.tail&&!(S&&fe>=S.reach);fe+=K.value.length,K=K.next){var Re=K.value;if(v.length>b.length)return;if(!(Re instanceof a)){var Ie=1,ae;if(se){if(ae=p(re,fe,b,Q),!ae||ae.index>=b.length)break;var Se=ae.index,qe=ae.index+ae[0].length,ye=fe;for(ye+=K.value.length;Se>=ye;)K=K.next,ye+=K.value.length;if(ye-=K.value.length,fe=ye,K.value instanceof a)continue;for(var ve=K;ve!==v.tail&&(ye<qe||typeof ve.value=="string");ve=ve.next)Ie++,ye+=ve.value.length;Ie--,Re=b.slice(fe,ye),ae.index-=fe}else if(ae=p(re,0,Re,Q),!ae)continue;var Se=ae.index,I=ae[0],V=Re.slice(0,Se),$=Re.slice(Se+I.length),J=fe+Re.length;S&&J>S.reach&&(S.reach=J);var Z=K.prev;V&&(Z=f(v,Z,V),fe+=V.length),y(v,Z,Ie);var g=new a(M,B?l.tokenize(I,B):I,we,I);if(K=f(v,Z,g),$&&f(v,K,$),Ie>1){var h={cause:M+","+U,reach:J};d(b,v,T,K.prev,fe,h),S&&h.reach>S.reach&&(S.reach=h.reach)}}}}}}function c(){var b={value:null,prev:null,next:null},v={value:null,prev:b,next:null};b.next=v,this.head=b,this.tail=v,this.length=0}function f(b,v,T){var C=v.next,R={value:T,prev:v,next:C};return v.next=R,C.prev=R,b.length++,R}function y(b,v,T){for(var C=v.next,R=0;R<T&&C!==b.tail;R++)C=C.next;v.next=C,C.prev=v,b.length-=R}function L(b){for(var v=[],T=b.head.next;T!==b.tail;)v.push(T.value),T=T.next;return v}if(!n.document)return n.addEventListener&&(l.disableWorkerMessageHandler||n.addEventListener("message",function(b){var v=JSON.parse(b.data),T=v.language,C=v.code,R=v.immediateClose;n.postMessage(l.highlight(C,l.languages[T],T)),R&&n.close()},!1)),l;var P=l.util.currentScript();P&&(l.filename=P.src,P.hasAttribute("data-manual")&&(l.manual=!0));function H(){l.manual||l.highlightAll()}if(!l.manual){var j=document.readyState;j==="loading"||j==="interactive"&&P&&P.defer?document.addEventListener("DOMContentLoaded",H):window.requestAnimationFrame?window.requestAnimationFrame(H):window.setTimeout(H,16)}return l}(t);e.exports&&(e.exports=r),typeof Ao<"u"&&(Ao.Prism=r),r.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},r.languages.markup.tag.inside["attr-value"].inside.entity=r.languages.markup.entity,r.languages.markup.doctype.inside["internal-subset"].inside=r.languages.markup,r.hooks.add("wrap",function(n){n.type==="entity"&&(n.attributes.title=n.content.replace(/&amp;/,"&"))}),Object.defineProperty(r.languages.markup.tag,"addInlined",{value:function(s,o){var i={};i["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:r.languages[o]},i.cdata=/^<!\[CDATA\[|\]\]>$/i;var l={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:i}};l["language-"+o]={pattern:/[\s\S]+/,inside:r.languages[o]};var a={};a[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:l},r.languages.insertBefore("markup","cdata",a)}}),Object.defineProperty(r.languages.markup.tag,"addAttribute",{value:function(n,s){r.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+n+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:r.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),r.languages.html=r.languages.markup,r.languages.mathml=r.languages.markup,r.languages.svg=r.languages.markup,r.languages.xml=r.languages.extend("markup",{}),r.languages.ssml=r.languages.xml,r.languages.atom=r.languages.xml,r.languages.rss=r.languages.xml,function(n){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;n.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},n.languages.css.atrule.inside.rest=n.languages.css;var o=n.languages.markup;o&&(o.tag.addInlined("style","css"),o.tag.addAttribute("style","css"))}(r),r.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},r.languages.javascript=r.languages.extend("clike",{"class-name":[r.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),r.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,r.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:r.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:r.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:r.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:r.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:r.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),r.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:r.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),r.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),r.languages.markup&&(r.languages.markup.tag.addInlined("script","javascript"),r.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),r.languages.js=r.languages.javascript,function(){if(typeof r>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var n="Loading…",s=function(P,H){return"✖ Error "+P+" while fetching file: "+H},o="✖ Error: File does not exist or is empty",i={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},l="data-src-status",a="loading",p="loaded",d="failed",c="pre[data-src]:not(["+l+'="'+p+'"]):not(['+l+'="'+a+'"])';function f(P,H,j){var b=new XMLHttpRequest;b.open("GET",P,!0),b.onreadystatechange=function(){b.readyState==4&&(b.status<400&&b.responseText?H(b.responseText):b.status>=400?j(s(b.status,b.statusText)):j(o))},b.send(null)}function y(P){var H=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(P||"");if(H){var j=Number(H[1]),b=H[2],v=H[3];return b?v?[j,Number(v)]:[j,void 0]:[j,j]}}r.hooks.add("before-highlightall",function(P){P.selector+=", "+c}),r.hooks.add("before-sanity-check",function(P){var H=P.element;if(H.matches(c)){P.code="",H.setAttribute(l,a);var j=H.appendChild(document.createElement("CODE"));j.textContent=n;var b=H.getAttribute("data-src"),v=P.language;if(v==="none"){var T=(/\.(\w+)$/.exec(b)||[,"none"])[1];v=i[T]||T}r.util.setLanguage(j,v),r.util.setLanguage(H,v);var C=r.plugins.autoloader;C&&C.loadLanguages(v),f(b,function(R){H.setAttribute(l,p);var S=y(H.getAttribute("data-range"));if(S){var M=R.split(/\r\n?|\n/g),w=S[0],U=S[1]==null?M.length:S[1];w<0&&(w+=M.length),w=Math.max(0,Math.min(w-1,M.length)),U<0&&(U+=M.length),U=Math.max(0,Math.min(U,M.length)),R=M.slice(w,U).join(`
`),H.hasAttribute("data-start")||H.setAttribute("data-start",String(w+1))}j.textContent=R,r.highlightElement(j)},function(R){H.setAttribute(l,d),j.textContent=R})}}),r.plugins.fileHighlight={highlight:function(H){for(var j=(H||document).querySelectorAll(c),b=0,v;v=j[b++];)r.highlightElement(v)}};var L=!1;r.fileHighlight=function(){L||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),L=!0),r.plugins.fileHighlight.highlight.apply(this,arguments)}}()})(Zi);var $p=Zi.exports;const Gp=jp($p);(function(e){var t=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,r=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,n={pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};e.languages.java=e.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[n,{pattern:RegExp(/(^|[^\w.])/.source+r+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:n.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+r+/[A-Z]\w*\b/.source),lookbehind:!0,inside:n.inside}],keyword:t,function:[e.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),e.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),e.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":n,keyword:t,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+r+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:n.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+r+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:n.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,function(){return t.source})),lookbehind:!0,inside:{punctuation:/\./}}})})(Prism);(function(e){var t="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",r={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},n={bash:r,environment:{pattern:RegExp("\\$"+t),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+t),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};e.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+t),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:n},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:r}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:n},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:n.entity}}],environment:{pattern:RegExp("\\$?"+t),alias:"constant"},variable:n.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},r.inside=e.languages.bash;for(var s=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],o=n.variable[1].inside,i=0;i<s.length;i++)o[s[i]]=e.languages.bash[s[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash})(Prism);Prism.languages.sql={comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,lookbehind:!0},variable:[{pattern:/@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,greedy:!0},/@[\w.$]+/],string:{pattern:/(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,greedy:!0,lookbehind:!0},identifier:{pattern:/(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,greedy:!0,lookbehind:!0,inside:{punctuation:/^`|`$/}},function:/\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,keyword:/\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,boolean:/\b(?:FALSE|NULL|TRUE)\b/i,number:/\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,operator:/[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,punctuation:/[;[\]()`,.]/};const Vp=["innerHTML"],Wp=Ve({__name:"NoteDetail",setup(e){const t=xs(),r=Pt(),n=t.params.id,s=ge("Note Detail"),o=ge("<p>Loading...</p>"),i=()=>{n==="hello-world"?(s.value="Hello World",o.value=`	      <h1>Java 入门：从 Hello World 到理解 JVM 运行原理</h1>

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
	      <p>编程学习就像拼拼图——每一块看似零散的知识，最终都会连成一片完整的版图。<strong>不急不躁，把基础打牢，我们下一篇文章见。</strong></p>`):n==="idea-shortcuts"?(s.value="IDEA Shortcuts",o.value=`	      <h1>IntelliJ IDEA 高效开发：从快捷键到生产力飞跃</h1>

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
	      <p>最后推荐一个 IDEA 插件：<strong>Key Promoter X</strong>，它会在你用鼠标操作时弹出提示"这个操作用快捷键 X 也能完成"。用上一个月，你会感谢它的。</p>`):n==="java-collections-framework"?(s.value="Java Collections",o.value=`	      <h1>Java 集合框架深度解析：从 ArrayList 到 HashMap 底层原理</h1>

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
	      <p>集合框架是 Java 最常用的 API，掌握好它有三个层次：第一层是会 CRUD 操作；第二层是理解底层数据结构，能根据场景正确选型；第三层是理解扩容机制、线程安全问题，能写出高性能代码。<strong>大部分开发者停留在第一层，你至少要到第二层——选对集合，很多性能问题根本不会出现。</strong></p>`):n==="vue-migration"?(s.value="Vue Migration",o.value=`	      <h1>网站重构实战：从静态 HTML 到 Vue 3 + TypeScript 的现代化改造</h1>

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
npm run dev    # 启动开发服务器，浏览器自动打开 http://localhost:5173</code></pre>`):n==="spring-boot-guide"?(s.value="Spring Boot Guide",o.value=`	      <h1>Spring Boot 快速入门：从零搭建你的第一个 RESTful API</h1>

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
	      <p>接下来值得深入的方向：Spring Security（认证授权）、Spring Data JPA（持久层）、Spring Cloud（微服务）、以及自动化测试（单元测试 + 集成测试）。</p>`):n==="mysql-basics"?(s.value="MySQL Basics",o.value=`	      <h1>MySQL 从入门到高效使用：SQL 语法、设计规范与性能优化</h1>

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
	      <p>下一步推荐学习的方向：慢查询日志分析（<code>slow_query_log</code>）、EXPLAIN 执行计划详解、分库分表方案（ShardingSphere）、以及 MySQL 8.0 的新特性（窗口函数、CTE 递归查询等）。</p>`):n==="git-basics"?(s.value="Git 常用命令",o.value=`	      <h1>Git 从入门到团队协作：常用命令、工作流与踩坑指南</h1>

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
	      <p>Git 的命令很多，但 80% 的时间你只需要：<strong>status、add、commit、push、pull、branch、checkout、merge</strong> 这 8 个命令。其余命令是"救火"用的——遇到问题时知道有对应解决方案就行，不必死记硬背。<strong>最好的学习方式是在真实项目中使用 Git</strong>，遇到冲突不要怕，这正是理解 Git 原理的好机会。</p>`):n==="docker-intro"?(s.value="Docker 入门指南",o.value=`	      <h1>Docker 容器化实战：从镜像构建到多容器编排</h1>

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
	      <p>下一步推荐学习：Docker 镜像优化和安全性（镜像扫描、签名）、Kubernetes 基础（Pod、Service、Deployment）、CI/CD 中的 Docker 集成（GitHub Actions + Docker Build）。</p>`):n==="linux-commands"?(s.value="Linux 基础命令",o.value=`	      <h1>Linux 基础命令速查：从文件操作到进程管理</h1>

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
	      <p>Linux 命令不需要死记硬背——<strong>记住最常用的 20 个</strong>（ls、cd、cat、less、tail、grep、find、chmod、ps、top、kill、df、du、free、ping、curl、ssh、scp、tar、vim），其余的遇到时查 <code>man</code>（manual）或 <code>--help</code> 就行。最重要的是<strong>理解管道的理念</strong>——通过组合简单命令来完成复杂任务，这是 Linux 命令行真正的威力所在。</p>`):n==="javascript-es6"?(s.value="JavaScript ES6+ 新特性",o.value=`	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

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
	      <p>ES6+ 的新特性远不止这些，但以上 6 类是最常用、最能提升开发效率的。<strong>如果你只能记住三点：永远用 const/let 而非 var、用箭头函数处理回调（注意 this）、用 async/await 写异步代码。</strong>掌握这些，你的 JavaScript 代码会从一个时代跨入另一个时代。</p>`):n==="design-patterns"?(s.value="设计模式入门",o.value=`	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

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
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂、建造者、策略、观察者这 5 种最常用的</strong>，其余的随着实践慢慢补充。</p>`):n==="redis-basics"?(s.value="Redis 基础入门",o.value=`	      <h1>Redis 缓存实战：从数据结构到缓存击穿解决方案</h1>

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
	      <p>Redis 入门容易精通难。<strong>会用五种数据类型只是第一层；理解缓存穿透/击穿/雪崩是第二层；深入持久化机制（RDB/AOF）、集群方案（Sentinel/Cluster）、内存淘汰策略、以及分布式锁的正确实现才是真正的进阶之路。</strong>本文覆盖了日常开发中 90% 的 Redis 使用场景，足以应对大多数业务需求。但记住：<strong>缓存不是万能的，加缓存之前先优化 SQL，很多场景下慢查询不是缓存能解决的。</strong></p>`):(s.value=n,o.value=`<p>Content for ${n} not migrated yet.</p>`)};return vt(()=>{i(),setTimeout(()=>Gp.highlightAll(),100)}),(l,a)=>(q(),Ze(Dt,{title:s.value,icon:"fa fa-file-text-o",isOpen:"",isActive:"",onClose:a[0]||(a[0]=p=>Ye(r).push("/all-notes"))},{default:rt(()=>[_("div",{class:"notepad-content font-sans",innerHTML:o.value},null,8,Vp)]),_:1},8,["title"]))}}),Jp={class:"flex gap-6 flex-wrap"},Kp=Ve({__name:"Computer",setup(e){const t=Pt(),r=n=>{n.startsWith("http")?window.open(n,"_blank"):t.push(n)};return(n,s)=>(q(),Ze(Dt,{title:"我的电脑",icon:"fa fa-desktop",isOpen:!0,isActive:!0,onClose:s[3]||(s[3]=o=>Ye(t).push("/"))},{default:rt(()=>[s[7]||(s[7]=_("div",{class:"flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3"},[_("span",{class:"text-xs"},"地址(D)"),_("div",{class:"flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2"},[_("i",{class:"fa fa-desktop text-blue-500"}),Ne(" 我的电脑 ")])],-1)),_("div",Jp,[_("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[0]||(s[0]=o=>r("/all-notes"))},[...s[4]||(s[4]=[_("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform text-gray-500",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[_("i",{class:"fa fa-hdd-o"})],-1),_("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 本地磁盘 (C:) ",-1),_("span",{class:"text-[10px] text-gray-500"},"12 篇文档",-1)])]),_("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[1]||(s[1]=o=>r("/categories"))},[...s[5]||(s[5]=[_("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[_("i",{class:"fa fa-cog text-pink-500"})],-1),_("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 控制面板 ",-1),_("span",{class:"text-[10px] text-gray-500"},"5 个分类",-1)])]),_("div",{class:"flex flex-col items-center gap-1 cursor-pointer group w-[88px]",onClick:s[2]||(s[2]=o=>r("https://github.com"))},[...s[6]||(s[6]=[_("div",{class:"w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform",style:{filter:"drop-shadow(1px 1px 0 rgba(0,0,0,0.2))"}},[_("i",{class:"fa fa-globe text-blue-400"})],-1),_("span",{class:"text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight"}," 网上邻居 ",-1),_("span",{class:"text-[10px] text-gray-500"},"GitHub",-1)])])]),s[8]||(s[8]=_("div",{class:"mt-auto pt-4 text-xs text-gray-500 border-t border-gray-300 mt-6"}," 3 个对象 ",-1))]),_:1}))}}),Yp={class:"flex flex-col items-center gap-[4px]"},ie=400,Pe=600,qp=Ve({__name:"AirplaneApp",setup(e){const t=Pt(),r=ge(null);let n=null,s=0,o,i=[],l=[],a=[],p=[],d=[],c="menu",f=0,y=parseInt(localStorage.getItem("airplane-highscore")||"0",10),L=1e3,P=!1,H=0,j=0,b=0,v=0,T=0,C=0,R=0,S=0;const M=ge(!1),w=new Set;let U=0,W=1e3,B=1;function Q(){o={x:ie/2-15,y:Pe-80,w:30,h:36,speed:3,lives:2,invincible:0},i=[],l=[],a=[],p=[],f=0,L=1e3,P=!1,H=0,j=0,b=0,v=0,T=0,C=0,R=0,U=0,W=1e3,B=1}function se(){return Math.min(2,.6+f/800)}function we(){d=[];for(let m=0;m<100;m++){const x=Math.random();d.push({x:Math.random()*ie,y:Math.random()*Pe,speed:.2+x*1.5,radius:x<.7?.5+Math.random():1+Math.random()*1.5,alpha:.3+x*.7})}}function oe(m){const x=se();let E,k,O,u,N;const F=m==="medium"?Math.max(90,160-x*20):m==="large"?Math.max(70,120-x*15):0;switch(m){case"small":E=26,k=26,O=1,u=(1.2+Math.random()*1.2)*x,N=100;break;case"medium":E=36,k=36,O=3,u=(.6+Math.random()*.8)*x,N=300;break;case"large":E=50,k=50,O=5,u=(.3+Math.random()*.4)*x,N=500;break;case"boss":E=80,k=56,O=25,u=.6*x,N=2e3;break;default:E=26,k=26,O=1,u=1.2*x,N=100}let G;if(m==="boss")G="sway";else if(m==="small"){const Oe=Math.random();Oe<.5?G="fall":Oe<.85?G="horizontal":G="circle"}else{const Oe=Math.random();Oe<.4?G="sway":Oe<.75?G="horizontal":G="circle"}const Y=Math.random()*(ie-E),te=Y,le=G==="circle"?100+Math.random()*250:-k,ne={x:Y,y:le,w:E,h:k,cx:Y+E/2,cy:le+k/2,hp:O,maxHp:O,type:m,score:N,speed:u,shootTimer:m==="large"||m==="medium"?Math.random()*F:0,shootInterval:F,movePattern:G,movePhase:Math.random()*Math.PI*2,moveAmp:G==="circle"?40+Math.random()*40:m==="large"?60:m==="medium"?30:0,startX:te,startY:le,dirX:Math.random()>.5?1:-1};m==="boss"&&(ne.x=20+Math.random()*(ie-E-40),ne.y=10,ne.startX=ne.x,P=!0),l.push(ne)}function re(m,x){if(Math.random()>.08)return;const E=["doubleFire","shield","speed","heal"],k=E[Math.floor(Math.random()*E.length)];a.push({x:m-10,y:x,w:20,h:20,cx:m,cy:x+10,type:k,vy:1.5})}function K(m,x,E,k){for(let O=0;O<E;O++){const u=Math.PI*2/E*O+Math.random()*.5,N=1+Math.random()*3;p.push({x:m,y:x,vx:Math.cos(u)*N,vy:Math.sin(u)*N,life:20+Math.random()*15,maxLife:35,color:k,radius:1.5+Math.random()*2.5})}}function fe(m,x){return m.x<x.x+x.w&&m.x+m.w>x.x&&m.y<x.y+x.h&&m.y+m.h>x.y}function Re(){if(!n||o.invincible>0&&Math.floor(o.invincible/4)%2===0)return;const m=o.x+o.w/2,x=o.y+o.h/2;n.save(),n.translate(m,x),n.fillStyle="#4488ff",n.beginPath(),n.moveTo(0,-18),n.lineTo(-10,14),n.lineTo(-6,10),n.lineTo(6,10),n.lineTo(10,14),n.closePath(),n.fill(),n.fillStyle="#7799bb",n.beginPath(),n.moveTo(-7,0),n.lineTo(-15,8),n.lineTo(-7,8),n.closePath(),n.fill(),n.beginPath(),n.moveTo(7,0),n.lineTo(15,8),n.lineTo(7,8),n.closePath(),n.fill(),n.fillStyle="#aaddff",n.beginPath(),n.arc(0,-4,5,0,Math.PI*2),n.fill();const E=Math.random()*4;n.fillStyle="#ff6633",n.beginPath(),n.moveTo(-4,14),n.lineTo(0,14+E),n.lineTo(4,14),n.closePath(),n.fill(),n.fillStyle="#ffaa44",n.beginPath(),n.moveTo(-2,14),n.lineTo(0,14+E*.6),n.lineTo(2,14),n.closePath(),n.fill(),n.restore(),v>0&&(n.strokeStyle=`rgba(255, 215, 0, ${.5+Math.sin(C*.2)*.3})`,n.lineWidth=3,n.beginPath(),n.arc(m,x,22,0,Math.PI*2),n.stroke()),M.value&&(n.strokeStyle=`rgba(255, 0, 255, ${.6+Math.sin(C*.15)*.4})`,n.lineWidth=3,n.beginPath(),n.arc(m,x,24,0,Math.PI*2),n.stroke())}function Ie(m){if(!n)return;const x=m.cx,E=m.cy;n.fillStyle="#ff3344",n.beginPath(),n.moveTo(x,E+12),n.lineTo(x-12,E-10),n.lineTo(x+12,E-10),n.closePath(),n.fill(),n.fillStyle="#ff8899",n.beginPath(),n.arc(x,E-3,4,0,Math.PI*2),n.fill(),n.fillStyle="#cc1122",n.beginPath(),n.moveTo(x-10,E-4),n.lineTo(x-14,E+3),n.lineTo(x-6,E+1),n.closePath(),n.fill(),n.beginPath(),n.moveTo(x+10,E-4),n.lineTo(x+14,E+3),n.lineTo(x+6,E+1),n.closePath(),n.fill(),n.strokeStyle="#881122",n.lineWidth=1,n.stroke(),m.hp<m.maxHp&&(n.fillStyle="#ff0000",n.font="bold 8px monospace",n.textAlign="center",n.fillText("×"+m.hp,x,E+14))}function ae(m){if(!n)return;const x=m.cx,E=m.cy,k=16;if(n.fillStyle="#ff7722",n.beginPath(),n.moveTo(x,E-k),n.lineTo(x+k,E),n.lineTo(x,E+k),n.lineTo(x-k,E),n.closePath(),n.fill(),n.fillStyle="#cc5500",n.beginPath(),n.moveTo(x-8,E-8),n.lineTo(x-17,E+2),n.lineTo(x-8,E+2),n.closePath(),n.fill(),n.beginPath(),n.moveTo(x+8,E-8),n.lineTo(x+17,E+2),n.lineTo(x+8,E+2),n.closePath(),n.fill(),n.fillStyle="#ffffff",n.beginPath(),n.arc(x,E,6,0,Math.PI*2),n.fill(),n.fillStyle="#ff0000",n.beginPath(),n.arc(x,E,3,0,Math.PI*2),n.fill(),n.strokeStyle="#993300",n.lineWidth=1.5,n.stroke(),m.hp<m.maxHp){const O=m.w-4,u=3,N=m.x+2,F=m.y-6;n.fillStyle="#333",n.fillRect(N,F,O,u),n.fillStyle="#ffaa00",n.fillRect(N,F,O*(m.hp/m.maxHp),u)}}function qe(m){if(!n)return;const x=m.cx,E=m.cy,k=22;n.fillStyle="#8844cc",n.beginPath();for(let O=0;O<6;O++){const u=Math.PI/6+Math.PI/3*O,N=x+k*Math.cos(u),F=E+k*Math.sin(u);O===0?n.moveTo(N,F):n.lineTo(N,F)}if(n.closePath(),n.fill(),n.fillStyle="#6622aa",n.beginPath(),n.moveTo(x-14,E-6),n.lineTo(x+14,E-6),n.lineTo(x+6,E+6),n.lineTo(x-6,E+6),n.closePath(),n.fill(),n.fillStyle="#ff66ff",n.beginPath(),n.arc(x,E,7,0,Math.PI*2),n.fill(),n.fillStyle="#ffffff",n.beginPath(),n.arc(x,E,3,0,Math.PI*2),n.fill(),n.fillStyle="#440088",n.fillRect(x-18,E-2,6,4),n.fillRect(x+12,E-2,6,4),n.strokeStyle="#330066",n.lineWidth=2,n.stroke(),m.hp<m.maxHp){const O=m.w-4,u=4,N=m.x+2,F=m.y-8;n.fillStyle="#333",n.fillRect(N,F,O,u),n.fillStyle="#cc44ff",n.fillRect(N,F,O*(m.hp/m.maxHp),u)}}function ye(m){if(!n)return;const x=m.cx,E=m.cy;n.fillStyle="#cc2233",n.beginPath(),n.moveTo(x-35,E+24),n.lineTo(x-14,E-24),n.lineTo(x+14,E-24),n.lineTo(x+35,E+24),n.closePath(),n.fill(),n.fillStyle="#881122",n.beginPath(),n.moveTo(x-18,E+4),n.lineTo(x-38,E+14),n.lineTo(x-18,E+20),n.closePath(),n.fill(),n.beginPath(),n.moveTo(x+18,E+4),n.lineTo(x+38,E+14),n.lineTo(x+18,E+20),n.closePath(),n.fill(),n.fillStyle="#ff4444",n.beginPath(),n.arc(x,E-4,8,0,Math.PI*2),n.fill(),n.fillStyle="#ffff00",n.beginPath(),n.arc(x,E-4,3,0,Math.PI*2),n.fill(),n.strokeStyle="#660000",n.lineWidth=2;const k=m.w,O=6,u=m.x,N=m.y-12;n.fillStyle="#333",n.fillRect(u,N,k,O);const F=m.hp/m.maxHp,G=F>.5?"#44cc44":F>.25?"#cccc44":"#cc4444";n.fillStyle=G,n.fillRect(u,N,k*F,O),n.strokeStyle="#888",n.lineWidth=1,n.strokeRect(u,N,k,O)}function ve(m){switch(m.type){case"small":Ie(m);break;case"medium":ae(m);break;case"large":qe(m);break;case"boss":ye(m);break}}function Se(m){if(!n)return;const x=m.cx,E=m.cy,k=m.w/2;let O,u;switch(m.type){case"doubleFire":O="#4488ff",u="火";break;case"shield":O="#ffaa00",u="盾";break;case"speed":O="#44cc44",u="速";break;case"heal":O="#ff4444",u="心";break}n.fillStyle=O,n.beginPath(),n.arc(x,E,k,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(x,E,k*.55,0,Math.PI*2),n.fill(),n.fillStyle=O,n.font='bold 9px "Microsoft YaHei", sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillText(u,x,E+1)}function I(){if(!n)return;n.fillStyle="#ffffff",n.font='bold 20px "MS Sans Serif", monospace',n.textAlign="left",n.fillText(`${f}`,10,28),n.fillStyle="#aaaacc",n.font='bold 11px "MS Sans Serif", sans-serif',n.fillText(`最高: ${y}`,10,44),n.fillStyle="#44ccff",n.font='bold 12px "Microsoft YaHei", sans-serif',n.fillText(`伤害${B} 火速${Math.floor(U/3)} 加速${Math.floor(U/5)}`,10,60),n.textAlign="right",n.fillStyle="#ff4466",n.font="bold 16px sans-serif";let m="";for(let x=0;x<o.lives;x++)m+="♥ ";n.fillText(m.trim(),ie-10,28),b>0&&(n.fillStyle="#4488ff",n.font='bold 11px "Microsoft YaHei", sans-serif',n.textAlign="left",n.fillText(`🔥双倍 ${Math.ceil(b/60)}s`,8,Pe-6)),v>0&&(n.fillStyle="#ffaa00",n.textAlign="center",n.fillText(`🛡无敌 ${Math.ceil(v/60)}s`,ie/2,Pe-6)),T>0&&(n.fillStyle="#44cc44",n.textAlign="right",n.fillText(`⚡加速 ${Math.ceil(T/60)}s`,ie-8,Pe-6)),M.value&&(n.fillStyle="#ff00ff",n.font='bold 12px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText("★ 无敌模式 ★",ie/2,22))}function V(){if(!n)return;n.fillStyle="rgba(0,0,0,0.75)",n.fillRect(0,0,ie,Pe),S+=.05,n.fillStyle="#ffdd44",n.font='bold 30px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText("飞 机 大 战",ie/2,55),n.fillStyle="#4488ff",n.font='bold 14px "Microsoft YaHei", sans-serif',n.fillText("—— 你的战机 ——",ie/2,90),n.save(),n.translate(ie/2,115),n.fillStyle="#4488ff",n.beginPath(),n.moveTo(0,-16),n.lineTo(-9,11),n.lineTo(-5,9),n.lineTo(5,9),n.lineTo(9,11),n.closePath(),n.fill(),n.fillStyle="#7799bb",n.beginPath(),n.moveTo(-7,0),n.lineTo(-13,6),n.lineTo(-7,6),n.closePath(),n.fill(),n.beginPath(),n.moveTo(7,0),n.lineTo(13,6),n.lineTo(7,6),n.closePath(),n.fill(),n.fillStyle="#aaddff",n.beginPath(),n.arc(0,-3,4,0,Math.PI*2),n.fill(),n.fillStyle="#ff6633",n.beginPath(),n.moveTo(-3,11),n.lineTo(0,14),n.lineTo(3,11),n.closePath(),n.fill(),n.restore(),n.fillStyle="#cccccc",n.font='13px "Microsoft YaHei", sans-serif',n.fillText("↑↓←→ 或 WASD 移动 · 空格 射击",ie/2,148),n.fillText("P 暂停 · 难度随分数逐渐提升",ie/2,168),n.strokeStyle="#666",n.lineWidth=1,n.beginPath(),n.moveTo(20,188),n.lineTo(ie-20,188),n.stroke(),n.fillStyle="#ff8844",n.font='bold 14px "Microsoft YaHei", sans-serif',n.fillText("—— 敌机图鉴 ——",ie/2,210);function m(k,O,u,N,F){if(n.save(),n.translate(k,O),u==="small")n.fillStyle="#ff3344",n.beginPath(),n.moveTo(0,10),n.lineTo(-9,-7),n.lineTo(9,-7),n.closePath(),n.fill(),n.fillStyle="#ff8899",n.beginPath(),n.arc(0,-2,3,0,Math.PI*2),n.fill(),n.strokeStyle="#881122",n.lineWidth=1,n.stroke();else if(u==="medium")n.fillStyle="#ff7722",n.beginPath(),n.moveTo(0,-12),n.lineTo(12,0),n.lineTo(0,12),n.lineTo(-12,0),n.closePath(),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(0,0,4,0,Math.PI*2),n.fill(),n.fillStyle="#f00",n.beginPath(),n.arc(0,0,2,0,Math.PI*2),n.fill(),n.strokeStyle="#993300",n.lineWidth=1,n.stroke();else if(u==="large"){n.fillStyle="#8844cc",n.beginPath();for(let Y=0;Y<6;Y++){const te=Math.PI/6+Math.PI/3*Y,le=14*Math.cos(te),ne=14*Math.sin(te);Y===0?n.moveTo(le,ne):n.lineTo(le,ne)}n.closePath(),n.fill(),n.fillStyle="#ff66ff",n.beginPath(),n.arc(0,0,5,0,Math.PI*2),n.fill(),n.strokeStyle="#330066",n.lineWidth=1.5,n.stroke()}else u==="boss"&&(n.fillStyle="#cc2233",n.beginPath(),n.moveTo(-18,12),n.lineTo(-8,-10),n.lineTo(8,-10),n.lineTo(18,12),n.closePath(),n.fill(),n.fillStyle="#881122",n.beginPath(),n.moveTo(-10,2),n.lineTo(-20,8),n.lineTo(-10,10),n.closePath(),n.fill(),n.beginPath(),n.moveTo(10,2),n.lineTo(20,8),n.lineTo(10,10),n.closePath(),n.fill(),n.fillStyle="#f44",n.beginPath(),n.arc(0,-2,5,0,Math.PI*2),n.fill(),n.fillStyle="#ff0",n.beginPath(),n.arc(0,-2,2,0,Math.PI*2),n.fill(),n.strokeStyle="#600",n.lineWidth=1.5,n.stroke());n.restore(),n.fillStyle="#ffffff",n.font='bold 12px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText(N,k,O+24),n.fillStyle="#999999",n.font='11px "Microsoft YaHei", sans-serif',n.fillText(F,k,O+39)}const x=220;m(55,x,"small","侦察机","1HP·100分"),m(145,x,"medium","战斗机","3HP·会追踪弹"),m(245,x,"large","重装机","5HP·扇形弹"),m(345,x,"boss","BOSS","25HP·每1000分"),n.strokeStyle="#555555",n.lineWidth=1,n.beginPath(),n.moveTo(20,285),n.lineTo(ie-20,285),n.stroke(),n.fillStyle="#44cc44",n.font='bold 14px "Microsoft YaHei", sans-serif',n.fillText("—— 道具说明 ——",ie/2,308);function E(k,O,u,N,F){n.fillStyle=u,n.beginPath(),n.arc(k,O-8,8,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(k,O-8,4,0,Math.PI*2),n.fill(),n.fillStyle=u,n.font='bold 10px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText(N,k,O-5),n.fillStyle="#ccc",n.font='11px "Microsoft YaHei", sans-serif',n.fillText(F,k,O+8)}E(60,338,"#4488ff","火","双倍火力"),E(160,338,"#ffaa00","盾","无敌护盾"),E(260,338,"#44cc44","速","速度提升"),E(350,338,"#ff4444","心","回复1命"),n.fillStyle="#aaaacc",n.font='13px "Microsoft YaHei", sans-serif',n.fillText(`最高分: ${y}`,ie/2,385),Math.sin(S)>0&&(n.fillStyle="#ffff00",n.font='bold 18px "Microsoft YaHei", sans-serif',n.fillText("按 Enter 开始游戏",ie/2,420))}function $(){n&&(n.fillStyle="rgba(0,0,0,0.55)",n.fillRect(0,0,ie,Pe),n.fillStyle="#ffffff",n.font='bold 24px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText("已 暂 停",ie/2,Pe/2-10),n.font='14px "Microsoft YaHei", sans-serif',n.fillText("按 P 继续",ie/2,Pe/2+30))}function J(){n&&(n.fillStyle="rgba(0,0,0,0.75)",n.fillRect(0,0,ie,Pe),n.fillStyle="#ff4444",n.font='bold 28px "Microsoft YaHei", sans-serif',n.textAlign="center",n.fillText("游 戏 结 束",ie/2,220),n.fillStyle="#ffffff",n.font="20px monospace",n.fillText(`得分: ${f}`,ie/2,280),f>y&&(n.fillStyle="#ffdd44",n.font='bold 14px "Microsoft YaHei", sans-serif',n.fillText("🏆 新最高分！",ie/2,310)),S+=.05,Math.sin(S)>0&&(n.fillStyle="#ffff00",n.font='bold 16px "Microsoft YaHei", sans-serif',n.fillText("按 Enter 重新开始",ie/2,370)))}function Z(){if(!n)return;for(const u of d)u.y+=u.speed,u.y>Pe&&(u.y=0,u.x=Math.random()*ie);if(c!=="playing")return;C++,R>0&&R--;const m=Math.min(2.5,Math.floor(U/5)*.4),x=(o.speed+m)*(T>0?1.6:1);(w.has("ArrowLeft")||w.has("a")||w.has("A"))&&(o.x-=x),(w.has("ArrowRight")||w.has("d")||w.has("D"))&&(o.x+=x),(w.has("ArrowUp")||w.has("w")||w.has("W"))&&(o.y-=x),(w.has("ArrowDown")||w.has("s")||w.has("S"))&&(o.y+=x),o.x=Math.max(0,Math.min(ie-o.w,o.x)),o.y=Math.max(0,Math.min(Pe-o.h,o.y)),o.invincible>0&&o.invincible--,b>0&&b--,v>0&&v--,T>0&&T--,j++;const E=Math.max(10,18-Math.floor(U/3)),k=b>0?Math.max(6,E-3):E;if(j>=k){j=0;const u=o.x+o.w/2,N=o.y;i.push({x:u-2,y:N,w:4,h:8,cx:u,cy:N+4,vx:0,vy:-8,isPlayer:!0}),b>0&&(i.push({x:u-12,y:N+4,w:4,h:8,cx:u-10,cy:N+8,vx:-.6,vy:-7.5,isPlayer:!0}),i.push({x:u+8,y:N+4,w:4,h:8,cx:u+10,cy:N+8,vx:.6,vy:-7.5,isPlayer:!0}))}if(H++,!P){const N=180-se()*60,F=Math.max(50,Math.floor(N));if(H>=F){H=0;const G=Math.random();f>=600&&G<.12?oe("large"):f>=250&&G<.3?oe("medium"):oe("small")}f>=L&&!P&&(oe("boss"),L=Math.max(L+1500,f+800))}for(const u of i)u.x+=u.vx,u.y+=u.vy,u.cx=u.x+u.w/2,u.cy=u.y+u.h/2;i=i.filter(u=>u.y>-20&&u.y<Pe+20&&u.x>-20&&u.x<ie+20);for(const u of l){switch(u.movePattern){case"fall":u.y+=u.speed;break;case"sway":u.x=u.startX+Math.sin(u.movePhase+C*.03)*u.moveAmp,u.y+=u.speed;break;case"horizontal":u.x+=u.speed*u.dirX*.8,u.y+=u.speed*.15,(u.x<-u.w||u.x>ie+u.w)&&(u.dirX*=-1);break;case"circle":u.x=u.startX+Math.cos(u.movePhase+C*.02)*u.moveAmp,u.y=u.startY+Math.sin(u.movePhase+C*.025)*u.moveAmp*.6;break;default:u.y+=u.speed}if(u.cx=u.x+u.w/2,u.cy=u.y+u.h/2,u.shootInterval>0&&(u.shootTimer++,u.shootTimer>=u.shootInterval)){if(u.shootTimer=0,u.type==="large")for(let N=-.25;N<=.25;N+=.25)i.push({x:u.cx-3,y:u.cy,w:6,h:6,cx:u.cx,cy:u.cy,vx:N*2,vy:2.5,isPlayer:!1});else if(u.type==="medium"){const N=o.x+o.w/2-u.cx,F=o.y+o.h/2-u.cy,G=Math.sqrt(N*N+F*F)||1;i.push({x:u.cx-2,y:u.cy,w:4,h:4,cx:u.cx,cy:u.cy,vx:N/G*2,vy:F/G*2,isPlayer:!1})}else if(u.type==="boss")for(let N=-.4;N<=.4;N+=.4)i.push({x:u.cx-4,y:u.cy,w:8,h:8,cx:u.cx,cy:u.cy,vx:Math.sin(N)*2.5,vy:2.2,isPlayer:!1})}}l=l.filter(u=>u.type==="boss"&&u.hp>0?!0:!(u.hp<=0||u.y>Pe+80||u.movePattern==="horizontal"&&(u.x<-80||u.x>ie+80)));for(const u of a)u.y+=u.vy,u.cy=u.y+u.h/2;a=a.filter(u=>u.y<Pe+30);for(const u of p)u.x+=u.vx,u.y+=u.vy,u.life--;p=p.filter(u=>u.life>0);for(const u of i)if(u.isPlayer){for(const N of l)if(fe(u,N)){u.y=-999,N.hp-=B,K(u.cx,u.cy,4,"#ffcc44"),N.hp<=0&&(f+=N.score,U++,B=Math.min(5,1+Math.floor(U/10)),f>=W&&(o.lives=Math.min(o.lives+1,4),W+=1e3),K(N.cx,N.cy,15,N.type==="boss"?"#ff6644":"#ffaa22"),re(N.cx,N.cy),N.type==="boss"&&(P=!1,R=20));break}}if(i=i.filter(u=>u.y!==-999),!M.value&&o.invincible<=0&&v<=0){for(const u of i){if(u.isPlayer)continue;const N={x:o.x+6,y:o.y+4,w:o.w-12,h:o.h-10};if(fe(u,N)){u.y=-999,o.lives--,o.invincible=90,v=0,b=0,T=0,K(o.x+o.w/2,o.y+o.h/2,10,"#ff6644"),R=10,o.lives<=0&&(c="gameover",f>y&&(y=f,localStorage.setItem("airplane-highscore",String(y))));break}}if(i=i.filter(u=>u.y!==-999),!M.value&&o.invincible<=0&&v<=0){const u={x:o.x+6,y:o.y+4,w:o.w-12,h:o.h-10};for(const N of l)if(fe(u,N)){o.lives--,o.invincible=90,v=0,b=0,T=0,K(o.x+o.w/2,o.y+o.h/2,10,"#ff6644"),R=10,o.lives<=0&&(c="gameover",f>y&&(y=f,localStorage.setItem("airplane-highscore",String(y))));break}}}const O={x:o.x,y:o.y,w:o.w,h:o.h};for(const u of a)if(fe(O,u))switch(u.y=-999,u.type){case"doubleFire":b=600;break;case"shield":v=480;break;case"speed":T=600;break;case"heal":o.lives=Math.min(o.lives+1,3);break}a=a.filter(u=>u.y!==-999);for(const u of l)u.type==="boss"&&u.y>Pe+100&&(P=!1)}function g(){if(!n)return;let m=0,x=0;R>0&&(m=(Math.random()-.5)*6*(R/20),x=(Math.random()-.5)*6*(R/20)),n.save(),n.translate(m,x),n.fillStyle="#0a0a1a",n.fillRect(0,0,ie,Pe);for(const E of d)n.fillStyle=`rgba(255,255,255,${E.alpha})`,n.beginPath(),n.arc(E.x,E.y,E.radius,0,Math.PI*2),n.fill();if(c==="menu"){V(),n.restore();return}for(const E of a)Se(E);for(const E of i)n.fillStyle=E.isPlayer?"#ffdd44":"#ff4444",n.beginPath(),n.arc(E.cx,E.cy,E.isPlayer?3:E.w>5?4:2.5,0,Math.PI*2),n.fill();for(const E of l)ve(E);(c==="playing"||c==="paused")&&Re();for(const E of p){const k=E.life/E.maxLife;n.fillStyle=E.color.replace(")",`, ${k})`).replace("rgb","rgba"),E.color.startsWith("#")&&(n.globalAlpha=k,n.fillStyle=E.color),n.beginPath(),n.arc(E.x,E.y,E.radius*k,0,Math.PI*2),n.fill(),n.globalAlpha=1}(c==="playing"||c==="paused")&&I(),n.restore(),c==="paused"&&$(),c==="gameover"&&J()}function h(){Z(),g(),s=requestAnimationFrame(h)}function A(m){w.add(m.key),m.key==="Enter"&&(c==="menu"?(Q(),c="playing",oe("small"),oe("small"),oe("small")):c==="gameover"&&(Q(),c="playing")),(m.key==="p"||m.key==="P")&&(c==="playing"?c="paused":c==="paused"&&(c="playing")),(m.key==="I"||m.key==="i")&&(M.value=!M.value),m.key===" "&&m.preventDefault(),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(m.key)&&m.preventDefault()}function D(m){w.delete(m.key)}return vt(()=>{const m=r.value;m&&(n=m.getContext("2d"),n&&(we(),Q(),window.addEventListener("keydown",A),window.addEventListener("keyup",D),h()))}),en(()=>{cancelAnimationFrame(s),window.removeEventListener("keydown",A),window.removeEventListener("keyup",D)}),(m,x)=>(q(),Ze(Dt,{title:"飞机大战",icon:"fa fa-fighter-jet",isOpen:!0,isActive:!0,onClose:x[1]||(x[1]=E=>Ye(t).push("/"))},{default:rt(()=>[_("div",Yp,[_("canvas",{ref_key:"canvasRef",ref:r,width:400,height:600,class:"shadow-win95-inset outline-none block",tabindex:"0",style:{"image-rendering":"auto"}},null,512),_("button",{onClick:x[0]||(x[0]=E=>M.value=!M.value),class:"text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans",style:Ut({backgroundColor:M.value?"#ff88ff":"#c0c0c0"})},Ce(M.value?"★ 无敌中 (按 I 关闭)":"无敌模式 (I)"),5)])]),_:1}))}}),zp={class:"flex flex-col h-full min-h-0 gap-0"},Xp={class:"flex items-center gap-[6px] px-[4px] py-[3px] bg-[#c0c0c0] border-b-2 border-[#808080] shrink-0 flex-wrap"},Qp=["value"],Zp={key:0,class:"text-[10px] text-red-600"},eu={key:1,class:"text-[10px] text-gray-500"},tu={class:"flex px-[4px] py-[1px] text-[10px] text-black border-t-2 border-t-[#808080] border-b border-b-[#ffffff] bg-[#c0c0c0] shrink-0 select-none gap-[12px]"},nu=Ve({__name:"NotepadApp",setup(e){const t=Pt(),r=ge(""),n=ge(14),s=ge(!0),o=Te(()=>({fontSize:n.value+"px",fontFamily:"'Courier New', 'Consolas', 'SimHei', monospace",lineHeight:"1.5"})),i=Te(()=>r.value.length),l=Te(()=>r.value?r.value.split(`
`).length:0);vt(()=>{const c=localStorage.getItem("notepad-content");c&&(r.value=c,s.value=!0)});function a(){localStorage.setItem("notepad-content",r.value),s.value=!0}function p(){r.value&&!s.value&&!confirm("内容尚未保存，确定要新建吗？")||(r.value="",localStorage.removeItem("notepad-content"),s.value=!0)}function d(){s.value=!1}return(c,f)=>(q(),Ze(Dt,{title:"记事本 - 未命名",icon:"fa fa-pencil-square-o",isOpen:!0,isActive:!0,onClose:f[2]||(f[2]=y=>Ye(t).push("/"))},{default:rt(()=>[_("div",zp,[_("div",Xp,[f[3]||(f[3]=_("span",{class:"text-[11px] font-bold text-black shrink-0"},"字号:",-1)),ws(_("select",{"onUpdate:modelValue":f[0]||(f[0]=y=>n.value=y),class:"text-[11px] px-[4px] py-[1px] bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] outline-none text-black",style:{"font-family":"'MS Sans Serif', 'Microsoft YaHei', sans-serif"}},[(q(),ee(me,null,ot([10,12,14,16,18,20,24],y=>_("option",{key:y,value:y},Ce(y)+"px",9,Qp)),64))],512),[[wc,n.value,void 0,{number:!0}]]),_("button",{onClick:p,class:"text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer",style:{"font-family":"'MS Sans Serif', 'Microsoft YaHei', sans-serif"}}," 新建 "),_("button",{onClick:a,class:"text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer",style:{"font-family":"'MS Sans Serif', 'Microsoft YaHei', sans-serif"}}," 保存 "),s.value?(q(),ee("span",eu,"已保存")):(q(),ee("span",Zp,"● 未保存"))]),ws(_("textarea",{"onUpdate:modelValue":f[1]||(f[1]=y=>r.value=y),onInput:d,class:"flex-1 w-full resize-none outline-none p-[6px] bg-white text-black min-h-0 border-0",style:Ut(o.value),placeholder:"在此输入...",spellcheck:"false"},null,36),[[Ac,r.value]]),_("div",tu,[_("span",null,"字符: "+Ce(i.value),1),_("span",null,"行数: "+Ce(l.value),1)])])]),_:1}))}}),ru={class:"flex flex-col h-full min-h-0 gap-0"},su={class:"flex items-center gap-[4px] px-[4px] py-[3px] bg-[#c0c0c0] border-b-2 border-[#808080] shrink-0 flex-wrap"},ou=["onClick","title"],iu={class:"flex items-center gap-[4px] px-[4px] py-[3px] bg-[#c0c0c0] border-t-2 border-t-[#ffffff] shrink-0 flex-wrap"},lu={class:"flex gap-[2px] flex-wrap"},au=["onClick"],cu=Ve({__name:"PaintApp",setup(e){const t=Pt(),r=ge(null),n=ge(null);let s=null;const o=ge("pencil"),i=ge("#000000");let l=!1,a=0,p=0,d=null;const c=["#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080","#804000","#004040","#C0C0C0","#FFFFFF","#FF0000","#FFFF00","#00FF00","#00FFFF","#0000FF","#FF00FF","#FF8040","#00FF80"],f=[{id:"pencil",label:"铅笔",icon:"✏"},{id:"eraser",label:"橡皮",icon:"◻"},{id:"line",label:"直线",icon:"╲"},{id:"rect",label:"矩形",icon:"▭"},{id:"fill",label:"填充",icon:"🪣"}];function y(){const S=r.value,M=n.value;if(!S||!M)return;const w=M.getBoundingClientRect(),U=w.width,W=w.height;if(U<=0||W<=0)return;const B=document.createElement("canvas");B.width=S.width,B.height=S.height;const Q=B.getContext("2d");Q&&Q.drawImage(S,0,0),S.width=U,S.height=W,s&&(s.fillStyle="#ffffff",s.fillRect(0,0,U,W),s.drawImage(B,0,0))}function L(){const S=r.value;S&&(s=S.getContext("2d"),s&&(y(),s.fillStyle="#ffffff",s.fillRect(0,0,S.width,S.height),s.lineCap="round",s.lineJoin="round"))}let P=null;vt(()=>{ur(()=>{L(),P=new ResizeObserver(()=>{y()});const S=n.value;S&&P.observe(S)})}),en(()=>{P&&P.disconnect()});function H(S){const w=r.value.getBoundingClientRect();return{x:S.clientX-w.left,y:S.clientY-w.top}}function j(S){if(!s)return;const{x:M,y:w}=H(S),U=r.value;if(U.setPointerCapture(S.pointerId),o.value==="fill"){C(Math.floor(M),Math.floor(w),i.value);return}l=!0,a=M,p=w,o.value==="pencil"||o.value==="eraser"?(s.beginPath(),s.moveTo(M,w),s.strokeStyle=o.value==="eraser"?"#ffffff":i.value,s.lineWidth=o.value==="eraser"?16:2):d=s.getImageData(0,0,U.width,U.height)}function b(S){if(!s||!l)return;const{x:M,y:w}=H(S);o.value==="pencil"||o.value==="eraser"?(s.lineTo(M,w),s.stroke()):(o.value==="line"||o.value==="rect")&&(d&&s.putImageData(d,0,0),s.strokeStyle=i.value,s.lineWidth=2,s.beginPath(),o.value==="line"?(s.moveTo(a,p),s.lineTo(M,w)):s.rect(a,p,M-a,w-p),s.stroke())}function v(S){if(!(!s||!l)&&(l=!1,o.value==="line"||o.value==="rect")){d&&s.putImageData(d,0,0);const{x:M,y:w}=H(S);s.strokeStyle=i.value,s.lineWidth=2,s.beginPath(),o.value==="line"?(s.moveTo(a,p),s.lineTo(M,w)):s.rect(a,p,M-a,w-p),s.stroke(),d=null}}function T(S){const M=parseInt(S.slice(1,3),16),w=parseInt(S.slice(3,5),16),U=parseInt(S.slice(5,7),16);return[M,w,U]}function C(S,M,w){if(!s)return;const U=r.value,W=U.width,B=U.height,Q=s.getImageData(0,0,W,B),se=Q.data,we=(M*W+S)*4,oe=se[we],re=se[we+1],K=se[we+2],[fe,Re,Ie]=T(w);if(oe===fe&&re===Re&&K===Ie)return;const ae=[[S,M]],qe=new Uint8Array(W*B);for(;ae.length>0;){const[ye,ve]=ae.pop();if(ye<0||ye>=W||ve<0||ve>=B)continue;const Se=ve*W+ye;if(qe[Se])continue;const I=Se*4;se[I]!==oe||se[I+1]!==re||se[I+2]!==K||(qe[Se]=1,se[I]=fe,se[I+1]=Re,se[I+2]=Ie,se[I+3]=255,ae.push([ye+1,ve],[ye-1,ve],[ye,ve+1],[ye,ve-1]))}s.putImageData(Q,0,0)}function R(){if(!s)return;const S=r.value;s.fillStyle="#ffffff",s.fillRect(0,0,S.width,S.height)}return(S,M)=>(q(),Ze(Dt,{title:"画图 - 未命名",icon:"fa fa-paint-brush",isOpen:!0,isActive:!0,onClose:M[0]||(M[0]=w=>Ye(t).push("/"))},{default:rt(()=>[_("div",ru,[_("div",su,[M[1]||(M[1]=_("span",{class:"text-[11px] font-bold text-black mr-[4px] shrink-0"},"工具:",-1)),(q(),ee(me,null,ot(f,w=>_("button",{key:w.id,onClick:U=>o.value=w.id,class:_e(["w-[30px] h-[28px] flex items-center justify-center text-[14px] border-none cursor-pointer shrink-0 bg-[#c0c0c0]",o.value===w.id?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]"]),title:w.label},Ce(w.icon),11,ou)),64)),M[2]||(M[2]=_("div",{class:"w-[3px] h-[22px] bg-[#808080] border-r border-[#ffffff] shrink-0 mx-[4px]"},null,-1)),_("button",{onClick:R,class:"text-[11px] font-bold px-[8px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer shrink-0",style:{"font-family":"'MS Sans Serif', 'Microsoft YaHei', sans-serif"}}," 清空 ")]),_("div",{ref_key:"containerRef",ref:n,class:"flex-1 min-h-0 overflow-hidden",style:{"touch-action":"none"}},[_("canvas",{ref_key:"canvasRef",ref:r,class:"block cursor-crosshair",onPointerdown:j,onPointermove:b,onPointerup:v,onPointerleave:v,style:{"touch-action":"none"}},null,544)],512),_("div",iu,[M[3]||(M[3]=_("span",{class:"text-[10px] font-bold text-black mr-[2px] shrink-0"},"颜色:",-1)),_("div",{class:"w-[24px] h-[24px] shrink-0 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]",style:Ut({backgroundColor:i.value})},null,4),M[4]||(M[4]=_("div",{class:"w-[2px] h-[20px] bg-[#808080] shrink-0 mx-[2px]"},null,-1)),_("div",lu,[(q(),ee(me,null,ot(c,w=>_("button",{key:w,onClick:U=>i.value=w,class:_e(["w-[18px] h-[18px] border-none cursor-pointer shrink-0",i.value===w?"shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] outline outline-1 outline-black outline-offset-[-1px]":"shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff]"]),style:Ut({backgroundColor:w})},null,14,au)),64))])])])]),_:1}))}}),du={class:"flex flex-col gap-[4px] h-full max-w-[300px] mx-auto select-none outline-none",tabindex:"0"},pu={class:"bg-white shadow-win95-inset px-[8px] py-[4px] flex flex-col items-end justify-end min-h-[56px] border-2 border-[#808080]"},uu={class:"text-[10px] text-gray-500 h-[14px] font-mono"},fu={class:"text-[26px] font-bold font-mono tracking-tight leading-none truncate w-full text-right text-black"},gu={class:"flex flex-col gap-[3px]"},hu=["onClick"],xu=Ve({__name:"CalculatorApp",setup(e){const t=Pt(),r=ge("0"),n=ge("");let s="",o="",i=null,l=!1,a=!1;function p(){r.value=s||"0",i?n.value=`${o} ${i}`:n.value=""}function d(S){if(a){s=S,o="",i=null,a=!1,l=!1,p();return}l?(s=S,l=!1):s=s==="0"?S:s+S,p()}function c(){if(a){s="0.",o="",i=null,a=!1,l=!1,p();return}if(l){s="0.",l=!1,p();return}s.includes(".")||(s+="."),p()}function f(){const S=parseFloat(o),M=parseFloat(s);if(isNaN(S)||isNaN(M))return s;let w;switch(i){case"+":w=S+M;break;case"-":w=S-M;break;case"*":w=S*M;break;case"/":w=M!==0?S/M:NaN;break;default:return s}if(isNaN(w)||!isFinite(w))return"Error";const U=parseFloat(w.toPrecision(12)).toString();return U.length>14?w.toExponential(8):U}function y(S){if(a=!1,i&&!l){const M=f();s=M,o=M}else o=s;i=S,l=!0,p()}function L(){if(!i)return;const S=f();n.value=`${o} ${i} ${s} =`,s=S,o="",i=null,l=!0,a=!0,r.value=s}function P(){s="0",o="",i=null,l=!1,a=!1,p()}function H(){s="0",l=!1,a=!1,p()}function j(){const S=parseFloat(s);if(S<0){r.value="Error",s="0";return}s=parseFloat(Math.sqrt(S).toPrecision(12)).toString(),p()}function b(){const S=parseFloat(s);s=parseFloat((S/100).toPrecision(12)).toString(),p()}function v(){a||l||(s=s.length>1?s.slice(0,-1):"0",p())}function T(){s!=="0"&&(s=s.startsWith("-")?s.slice(1):"-"+s,p())}function C(S){S.key>="0"&&S.key<="9"?d(S.key):S.key==="."?c():S.key==="+"?y("+"):S.key==="-"?y("-"):S.key==="*"?y("*"):S.key==="/"?(S.preventDefault(),y("/")):S.key==="Enter"||S.key==="="?(S.preventDefault(),L()):S.key==="Escape"||S.key==="c"||S.key==="C"?P():S.key==="Backspace"?v():S.key==="%"&&b()}vt(()=>{window.addEventListener("keydown",C)}),en(()=>{window.removeEventListener("keydown",C)});const R=[[{label:"C",action:P,accent:!0},{label:"CE",action:H,accent:!0},{label:"√",action:j,accent:!0},{label:"÷",action:()=>y("/"),accent:!0}],[{label:"7",action:()=>d("7")},{label:"8",action:()=>d("8")},{label:"9",action:()=>d("9")},{label:"×",action:()=>y("*"),accent:!0}],[{label:"4",action:()=>d("4")},{label:"5",action:()=>d("5")},{label:"6",action:()=>d("6")},{label:"−",action:()=>y("-"),accent:!0}],[{label:"1",action:()=>d("1")},{label:"2",action:()=>d("2")},{label:"3",action:()=>d("3")},{label:"+",action:()=>y("+"),accent:!0}],[{label:"±",action:T},{label:"0",action:()=>d("0")},{label:".",action:c},{label:"=",action:L,accent:!0}]];return(S,M)=>(q(),Ze(Dt,{title:"计算器",icon:"fa fa-calculator",isOpen:!0,isActive:!0,onClose:M[0]||(M[0]=w=>Ye(t).push("/"))},{default:rt(()=>[_("div",du,[_("div",pu,[_("div",uu,Ce(n.value),1),_("div",fu,Ce(r.value),1)]),_("div",gu,[(q(),ee(me,null,ot(R,(w,U)=>_("div",{key:U,class:"flex gap-[3px]"},[(q(!0),ee(me,null,ot(w,W=>(q(),ee("button",{key:W.label,onClick:W.action,class:_e(["flex-1 h-[42px] flex items-center justify-center text-[14px] font-bold border-none cursor-pointer select-none",(W.accent,"bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]")]),style:{"font-family":"'MS Sans Serif', 'Microsoft YaHei', sans-serif"}},Ce(W.label),11,hu))),128))])),64))]),M[1]||(M[1]=_("div",{class:"text-[9px] text-gray-500 text-center mt-auto pt-2"}," 支持键盘输入 · Esc=清除 · Enter=等于 ",-1))])]),_:1}))}}),mu=[{path:"/",component:Tp},{path:"/computer",component:Kp},{path:"/all-notes",component:Np},{path:"/categories",component:Up},{path:"/notes/:id",component:Wp},{path:"/airplane",component:qp},{path:"/notepad",component:nu},{path:"/paint",component:cu},{path:"/calculator",component:xu}],bu=Bd({history:md(),routes:mu});Oc(sp).use(bu).mount("#app");
