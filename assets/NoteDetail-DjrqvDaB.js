import{d as Z,e as ee,m as te,w as re,B as oe,j as se,u as ae,r as $,o as ie,a as de}from"./vendor-D3iukU5p.js";import{W as ne}from"./Window-DIWf6eGL.js";import"./index-DMBvxuWJ.js";var K=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function le(h){return h&&h.__esModule&&Object.prototype.hasOwnProperty.call(h,"default")?h.default:h}var q={exports:{}};(function(h){var v=typeof window!="undefined"?window:typeof WorkerGlobalScope!="undefined"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var a=function(d){var c=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,g=0,E={},i={manual:d.Prism&&d.Prism.manual,disableWorkerMessageHandler:d.Prism&&d.Prism.disableWorkerMessageHandler,util:{encode:function t(e){return e instanceof y?new y(e.type,t(e.content),e.alias):Array.isArray(e)?e.map(t):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(t){return Object.prototype.toString.call(t).slice(8,-1)},objId:function(t){return t.__id||Object.defineProperty(t,"__id",{value:++g}),t.__id},clone:function t(e,r){r=r||{};var o,s;switch(i.util.type(e)){case"Object":if(s=i.util.objId(e),r[s])return r[s];o={},r[s]=o;for(var l in e)e.hasOwnProperty(l)&&(o[l]=t(e[l],r));return o;case"Array":return s=i.util.objId(e),r[s]?r[s]:(o=[],r[s]=o,e.forEach(function(p,n){o[n]=t(p,r)}),o);default:return e}},getLanguage:function(t){for(;t;){var e=c.exec(t.className);if(e)return e[1].toLowerCase();t=t.parentElement}return"none"},setLanguage:function(t,e){t.className=t.className.replace(RegExp(c,"gi"),""),t.classList.add("language-"+e)},currentScript:function(){if(typeof document=="undefined")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(o){var t=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(o.stack)||[])[1];if(t){var e=document.getElementsByTagName("script");for(var r in e)if(e[r].src==t)return e[r]}return null}},isActive:function(t,e,r){for(var o="no-"+e;t;){var s=t.classList;if(s.contains(e))return!0;if(s.contains(o))return!1;t=t.parentElement}return!!r}},languages:{plain:E,plaintext:E,text:E,txt:E,extend:function(t,e){var r=i.util.clone(i.languages[t]);for(var o in e)r[o]=e[o];return r},insertBefore:function(t,e,r,o){o=o||i.languages;var s=o[t],l={};for(var p in s)if(s.hasOwnProperty(p)){if(p==e)for(var n in r)r.hasOwnProperty(n)&&(l[n]=r[n]);r.hasOwnProperty(p)||(l[p]=s[p])}var x=o[t];return o[t]=l,i.languages.DFS(i.languages,function(S,R){R===x&&S!=t&&(this[S]=l)}),l},DFS:function t(e,r,o,s){s=s||{};var l=i.util.objId;for(var p in e)if(e.hasOwnProperty(p)){r.call(e,p,e[p],o||p);var n=e[p],x=i.util.type(n);x==="Object"&&!s[l(n)]?(s[l(n)]=!0,t(n,r,null,s)):x==="Array"&&!s[l(n)]&&(s[l(n)]=!0,t(n,r,p,s))}}},plugins:{},highlightAll:function(t,e){i.highlightAllUnder(document,t,e)},highlightAllUnder:function(t,e,r){var o={callback:r,container:t,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};i.hooks.run("before-highlightall",o),o.elements=Array.prototype.slice.apply(o.container.querySelectorAll(o.selector)),i.hooks.run("before-all-elements-highlight",o);for(var s=0,l;l=o.elements[s++];)i.highlightElement(l,e===!0,o.callback)},highlightElement:function(t,e,r){var o=i.util.getLanguage(t),s=i.languages[o];i.util.setLanguage(t,o);var l=t.parentElement;l&&l.nodeName.toLowerCase()==="pre"&&i.util.setLanguage(l,o);var p=t.textContent,n={element:t,language:o,grammar:s,code:p};function x(R){n.highlightedCode=R,i.hooks.run("before-insert",n),n.element.innerHTML=n.highlightedCode,i.hooks.run("after-highlight",n),i.hooks.run("complete",n),r&&r.call(n.element)}if(i.hooks.run("before-sanity-check",n),l=n.element.parentElement,l&&l.nodeName.toLowerCase()==="pre"&&!l.hasAttribute("tabindex")&&l.setAttribute("tabindex","0"),!n.code){i.hooks.run("complete",n),r&&r.call(n.element);return}if(i.hooks.run("before-highlight",n),!n.grammar){x(i.util.encode(n.code));return}if(e&&d.Worker){var S=new Worker(i.filename);S.onmessage=function(R){x(R.data)},S.postMessage(JSON.stringify({language:n.language,code:n.code,immediateClose:!0}))}else x(i.highlight(n.code,n.grammar,n.language))},highlight:function(t,e,r){var o={code:t,grammar:e,language:r};if(i.hooks.run("before-tokenize",o),!o.grammar)throw new Error('The language "'+o.language+'" has no grammar.');return o.tokens=i.tokenize(o.code,o.grammar),i.hooks.run("after-tokenize",o),y.stringify(i.util.encode(o.tokens),o.language)},tokenize:function(t,e){var r=e.rest;if(r){for(var o in r)e[o]=r[o];delete e.rest}var s=new L;return D(s,s.head,t),M(t,s,e,s.head,0),k(s)},hooks:{all:{},add:function(t,e){var r=i.hooks.all;r[t]=r[t]||[],r[t].push(e)},run:function(t,e){var r=i.hooks.all[t];if(!(!r||!r.length))for(var o=0,s;s=r[o++];)s(e)}},Token:y};d.Prism=i;function y(t,e,r,o){this.type=t,this.content=e,this.alias=r,this.length=(o||"").length|0}y.stringify=function t(e,r){if(typeof e=="string")return e;if(Array.isArray(e)){var o="";return e.forEach(function(x){o+=t(x,r)}),o}var s={type:e.type,content:t(e.content,r),tag:"span",classes:["token",e.type],attributes:{},language:r},l=e.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(s.classes,l):s.classes.push(l)),i.hooks.run("wrap",s);var p="";for(var n in s.attributes)p+=" "+n+'="'+(s.attributes[n]||"").replace(/"/g,"&quot;")+'"';return"<"+s.tag+' class="'+s.classes.join(" ")+'"'+p+">"+s.content+"</"+s.tag+">"};function C(t,e,r,o){t.lastIndex=e;var s=t.exec(r);if(s&&o&&s[1]){var l=s[1].length;s.index+=l,s[0]=s[0].slice(l)}return s}function M(t,e,r,o,s,l){for(var p in r)if(!(!r.hasOwnProperty(p)||!r[p])){var n=r[p];n=Array.isArray(n)?n:[n];for(var x=0;x<n.length;++x){if(l&&l.cause==p+","+x)return;var S=n[x],R=S.inside,J=!!S.lookbehind,G=!!S.greedy,Y=S.alias;if(G&&!S.pattern.global){var X=S.pattern.toString().match(/[imsuy]*$/)[0];S.pattern=RegExp(S.pattern.source,X+"g")}for(var W=S.pattern||S,f=o.next,T=s;f!==e.tail&&!(l&&T>=l.reach);T+=f.value.length,f=f.next){var O=f.value;if(e.length>t.length)return;if(!(O instanceof y)){var w=1,A;if(G){if(A=C(W,T,t,J),!A||A.index>=t.length)break;var P=A.index,z=A.index+A[0].length,I=T;for(I+=f.value.length;P>=I;)f=f.next,I+=f.value.length;if(I-=f.value.length,T=I,f.value instanceof y)continue;for(var N=f;N!==e.tail&&(I<z||typeof N.value=="string");N=N.next)w++,I+=N.value.length;w--,O=t.slice(T,I),A.index-=T}else if(A=C(W,0,O,J),!A)continue;var P=A.index,H=A[0],_=O.slice(0,P),V=O.slice(P+H.length),B=T+O.length;l&&B>l.reach&&(l.reach=B);var F=f.prev;_&&(F=D(e,F,_),T+=_.length),U(e,F,w);var Q=new y(p,R?i.tokenize(H,R):H,Y,H);if(f=D(e,F,Q),V&&D(e,f,V),w>1){var j={cause:p+","+x,reach:B};M(t,e,r,f.prev,T,j),l&&j.reach>l.reach&&(l.reach=j.reach)}}}}}}function L(){var t={value:null,prev:null,next:null},e={value:null,prev:t,next:null};t.next=e,this.head=t,this.tail=e,this.length=0}function D(t,e,r){var o=e.next,s={value:r,prev:e,next:o};return e.next=s,o.prev=s,t.length++,s}function U(t,e,r){for(var o=e.next,s=0;s<r&&o!==t.tail;s++)o=o.next;e.next=o,o.prev=e,t.length-=s}function k(t){for(var e=[],r=t.head.next;r!==t.tail;)e.push(r.value),r=r.next;return e}if(!d.document)return d.addEventListener&&(i.disableWorkerMessageHandler||d.addEventListener("message",function(t){var e=JSON.parse(t.data),r=e.language,o=e.code,s=e.immediateClose;d.postMessage(i.highlight(o,i.languages[r],r)),s&&d.close()},!1)),i;var b=i.util.currentScript();b&&(i.filename=b.src,b.hasAttribute("data-manual")&&(i.manual=!0));function u(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m==="loading"||m==="interactive"&&b&&b.defer?document.addEventListener("DOMContentLoaded",u):window.requestAnimationFrame?window.requestAnimationFrame(u):window.setTimeout(u,16)}return i}(v);h.exports&&(h.exports=a),typeof K!="undefined"&&(K.Prism=a),a.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},a.languages.markup.tag.inside["attr-value"].inside.entity=a.languages.markup.entity,a.languages.markup.doctype.inside["internal-subset"].inside=a.languages.markup,a.hooks.add("wrap",function(d){d.type==="entity"&&(d.attributes.title=d.content.replace(/&amp;/,"&"))}),Object.defineProperty(a.languages.markup.tag,"addInlined",{value:function(c,g){var E={};E["language-"+g]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:a.languages[g]},E.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:E}};i["language-"+g]={pattern:/[\s\S]+/,inside:a.languages[g]};var y={};y[c]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return c}),"i"),lookbehind:!0,greedy:!0,inside:i},a.languages.insertBefore("markup","cdata",y)}}),Object.defineProperty(a.languages.markup.tag,"addAttribute",{value:function(d,c){a.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+d+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[c,"language-"+c],inside:a.languages[c]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),a.languages.html=a.languages.markup,a.languages.mathml=a.languages.markup,a.languages.svg=a.languages.markup,a.languages.xml=a.languages.extend("markup",{}),a.languages.ssml=a.languages.xml,a.languages.atom=a.languages.xml,a.languages.rss=a.languages.xml,function(d){var c=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;d.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+c.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+c.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+c.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+c.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:c,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},d.languages.css.atrule.inside.rest=d.languages.css;var g=d.languages.markup;g&&(g.tag.addInlined("style","css"),g.tag.addAttribute("style","css"))}(a),a.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},a.languages.javascript=a.languages.extend("clike",{"class-name":[a.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),a.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,a.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:a.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:a.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:a.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:a.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:a.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),a.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:a.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),a.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),a.languages.markup&&(a.languages.markup.tag.addInlined("script","javascript"),a.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),a.languages.js=a.languages.javascript,function(){if(typeof a=="undefined"||typeof document=="undefined")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var d="Loading…",c=function(b,u){return"✖ Error "+b+" while fetching file: "+u},g="✖ Error: File does not exist or is empty",E={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},i="data-src-status",y="loading",C="loaded",M="failed",L="pre[data-src]:not(["+i+'="'+C+'"]):not(['+i+'="'+y+'"])';function D(b,u,m){var t=new XMLHttpRequest;t.open("GET",b,!0),t.onreadystatechange=function(){t.readyState==4&&(t.status<400&&t.responseText?u(t.responseText):t.status>=400?m(c(t.status,t.statusText)):m(g))},t.send(null)}function U(b){var u=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(b||"");if(u){var m=Number(u[1]),t=u[2],e=u[3];return t?e?[m,Number(e)]:[m,void 0]:[m,m]}}a.hooks.add("before-highlightall",function(b){b.selector+=", "+L}),a.hooks.add("before-sanity-check",function(b){var u=b.element;if(u.matches(L)){b.code="",u.setAttribute(i,y);var m=u.appendChild(document.createElement("CODE"));m.textContent=d;var t=u.getAttribute("data-src"),e=b.language;if(e==="none"){var r=(/\.(\w+)$/.exec(t)||[,"none"])[1];e=E[r]||r}a.util.setLanguage(m,e),a.util.setLanguage(u,e);var o=a.plugins.autoloader;o&&o.loadLanguages(e),D(t,function(s){u.setAttribute(i,C);var l=U(u.getAttribute("data-range"));if(l){var p=s.split(/\r\n?|\n/g),n=l[0],x=l[1]==null?p.length:l[1];n<0&&(n+=p.length),n=Math.max(0,Math.min(n-1,p.length)),x<0&&(x+=p.length),x=Math.max(0,Math.min(x,p.length)),s=p.slice(n,x).join(`
`),u.hasAttribute("data-start")||u.setAttribute("data-start",String(n+1))}m.textContent=s,a.highlightElement(m)},function(s){u.setAttribute(i,M),m.textContent=s})}}),a.plugins.fileHighlight={highlight:function(u){for(var m=(u||document).querySelectorAll(L),t=0,e;e=m[t++];)a.highlightElement(e)}};var k=!1;a.fileHighlight=function(){k||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),k=!0),a.plugins.fileHighlight.highlight.apply(this,arguments)}}()})(q);var ce=q.exports;const pe=le(ce);(function(h){var v=/\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,a=/(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source,d={pattern:RegExp(/(^|[^\w.])/.source+a+/[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),lookbehind:!0,inside:{namespace:{pattern:/^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,inside:{punctuation:/\./}},punctuation:/\./}};h.languages.java=h.languages.extend("clike",{string:{pattern:/(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,lookbehind:!0,greedy:!0},"class-name":[d,{pattern:RegExp(/(^|[^\w.])/.source+a+/[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),lookbehind:!0,inside:d.inside},{pattern:RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source+a+/[A-Z]\w*\b/.source),lookbehind:!0,inside:d.inside}],keyword:v,function:[h.languages.clike.function,{pattern:/(::\s*)[a-z_]\w*/,lookbehind:!0}],number:/\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,operator:{pattern:/(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,lookbehind:!0},constant:/\b[A-Z][A-Z_\d]+\b/}),h.languages.insertBefore("java","string",{"triple-quoted-string":{pattern:/"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,greedy:!0,alias:"string"},char:{pattern:/'(?:\\.|[^'\\\r\n]){1,6}'/,greedy:!0}}),h.languages.insertBefore("java","class-name",{annotation:{pattern:/(^|[^.])@\w+(?:\s*\.\s*\w+)*/,lookbehind:!0,alias:"punctuation"},generics:{pattern:/<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,inside:{"class-name":d,keyword:v,punctuation:/[<>(),.:]/,operator:/[?&|]/}},import:[{pattern:RegExp(/(\bimport\s+)/.source+a+/(?:[A-Z]\w*|\*)(?=\s*;)/.source),lookbehind:!0,inside:{namespace:d.inside.namespace,punctuation:/\./,operator:/\*/,"class-name":/\w+/}},{pattern:RegExp(/(\bimport\s+static\s+)/.source+a+/(?:\w+|\*)(?=\s*;)/.source),lookbehind:!0,alias:"static",inside:{namespace:d.inside.namespace,static:/\b\w+$/,punctuation:/\./,operator:/\*/,"class-name":/\w+/}}],namespace:{pattern:RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g,function(){return v.source})),lookbehind:!0,inside:{punctuation:/\./}}})})(Prism);(function(h){var v="\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",a={pattern:/(^(["']?)\w+\2)[ \t]+\S.*/,lookbehind:!0,alias:"punctuation",inside:null},d={bash:a,environment:{pattern:RegExp("\\$"+v),alias:"constant"},variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,greedy:!0,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},{pattern:/\$\{[^}]+\}/,greedy:!0,inside:{operator:/:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,punctuation:/[\[\]]/,environment:{pattern:RegExp("(\\{)"+v),lookbehind:!0,alias:"constant"}}},/\$(?:\w+|[#?*!@$])/],entity:/\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/};h.languages.bash={shebang:{pattern:/^#!\s*\/.*/,alias:"important"},comment:{pattern:/(^|[^"{\\$])#.*/,lookbehind:!0},"function-name":[{pattern:/(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,lookbehind:!0,alias:"function"},{pattern:/\b[\w-]+(?=\s*\(\s*\)\s*\{)/,alias:"function"}],"for-or-select":{pattern:/(\b(?:for|select)\s+)\w+(?=\s+in\s)/,alias:"variable",lookbehind:!0},"assign-left":{pattern:/(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,inside:{environment:{pattern:RegExp("(^|[\\s;|&]|[<>]\\()"+v),lookbehind:!0,alias:"constant"}},alias:"variable",lookbehind:!0},parameter:{pattern:/(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,alias:"variable",lookbehind:!0},string:[{pattern:/((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,lookbehind:!0,greedy:!0,inside:d},{pattern:/((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,lookbehind:!0,greedy:!0,inside:{bash:a}},{pattern:/(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,lookbehind:!0,greedy:!0,inside:d},{pattern:/(^|[^$\\])'[^']*'/,lookbehind:!0,greedy:!0},{pattern:/\$'(?:[^'\\]|\\[\s\S])*'/,greedy:!0,inside:{entity:d.entity}}],environment:{pattern:RegExp("\\$?"+v),alias:"constant"},variable:d.variable,function:{pattern:/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,lookbehind:!0},builtin:{pattern:/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,lookbehind:!0,alias:"class-name"},boolean:{pattern:/(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,lookbehind:!0},"file-descriptor":{pattern:/\B&\d\b/,alias:"important"},operator:{pattern:/\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,inside:{"file-descriptor":{pattern:/^\d/,alias:"important"}}},punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,number:{pattern:/(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,lookbehind:!0}},a.inside=h.languages.bash;for(var c=["comment","function-name","for-or-select","assign-left","parameter","string","environment","function","keyword","builtin","boolean","file-descriptor","operator","punctuation","number"],g=d.variable[1].inside,E=0;E<c.length;E++)g[c[E]]=h.languages.bash[c[E]];h.languages.sh=h.languages.bash,h.languages.shell=h.languages.bash})(Prism);Prism.languages.sql={comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,lookbehind:!0},variable:[{pattern:/@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,greedy:!0},/@[\w.$]+/],string:{pattern:/(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,greedy:!0,lookbehind:!0},identifier:{pattern:/(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,greedy:!0,lookbehind:!0,inside:{punctuation:/^`|`$/}},function:/\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,keyword:/\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,boolean:/\b(?:FALSE|NULL|TRUE)\b/i,number:/\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,operator:/[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,punctuation:/[;[\]()`,.]/};const ge=["innerHTML"],be=Z({__name:"NoteDetail",setup(h){const v=se(),a=ae(),d=v.params.id,c=$("Note Detail"),g=$("<p>Loading...</p>"),E=()=>{d==="hello-world"?(c.value="Hello World",g.value=`	      <h1>Java 入门：从 Hello World 到理解 JVM 运行原理</h1>

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
	      <p>编程学习就像拼拼图——每一块看似零散的知识，最终都会连成一片完整的版图。<strong>不急不躁，把基础打牢，我们下一篇文章见。</strong></p>`):d==="idea-shortcuts"?(c.value="IDEA Shortcuts",g.value=`	      <h1>IntelliJ IDEA 高效开发：从快捷键到生产力飞跃</h1>

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
	      <p>最后推荐一个 IDEA 插件：<strong>Key Promoter X</strong>，它会在你用鼠标操作时弹出提示"这个操作用快捷键 X 也能完成"。用上一个月，你会感谢它的。</p>`):d==="java-collections-framework"?(c.value="Java Collections",g.value=`	      <h1>Java 集合框架深度解析：从 ArrayList 到 HashMap 底层原理</h1>

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
	      <p>集合框架是 Java 最常用的 API，掌握好它有三个层次：第一层是会 CRUD 操作；第二层是理解底层数据结构，能根据场景正确选型；第三层是理解扩容机制、线程安全问题，能写出高性能代码。<strong>大部分开发者停留在第一层，你至少要到第二层——选对集合，很多性能问题根本不会出现。</strong></p>`):d==="vue-migration"?(c.value="Vue Migration",g.value=`	      <h1>网站重构实战：从静态 HTML 到 Vue 3 + TypeScript 的现代化改造</h1>

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
npm run dev    # 启动开发服务器，浏览器自动打开 http://localhost:5173</code></pre>`):d==="spring-boot-guide"?(c.value="Spring Boot Guide",g.value=`	      <h1>Spring Boot 快速入门：从零搭建你的第一个 RESTful API</h1>

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
	      <p>接下来值得深入的方向：Spring Security（认证授权）、Spring Data JPA（持久层）、Spring Cloud（微服务）、以及自动化测试（单元测试 + 集成测试）。</p>`):d==="mysql-basics"?(c.value="MySQL Basics",g.value=`	      <h1>MySQL 从入门到高效使用：SQL 语法、设计规范与性能优化</h1>

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
	      <p>下一步推荐学习的方向：慢查询日志分析（<code>slow_query_log</code>）、EXPLAIN 执行计划详解、分库分表方案（ShardingSphere）、以及 MySQL 8.0 的新特性（窗口函数、CTE 递归查询等）。</p>`):d==="git-basics"?(c.value="Git 常用命令",g.value=`	      <h1>Git 从入门到团队协作：常用命令、工作流与踩坑指南</h1>

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
	      <p>Git 的命令很多，但 80% 的时间你只需要：<strong>status、add、commit、push、pull、branch、checkout、merge</strong> 这 8 个命令。其余命令是"救火"用的——遇到问题时知道有对应解决方案就行，不必死记硬背。<strong>最好的学习方式是在真实项目中使用 Git</strong>，遇到冲突不要怕，这正是理解 Git 原理的好机会。</p>`):d==="docker-intro"?(c.value="Docker 入门指南",g.value=`	      <h1>Docker 容器化实战：从镜像构建到多容器编排</h1>

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
	      <p>下一步推荐学习：Docker 镜像优化和安全性（镜像扫描、签名）、Kubernetes 基础（Pod、Service、Deployment）、CI/CD 中的 Docker 集成（GitHub Actions + Docker Build）。</p>`):d==="linux-commands"?(c.value="Linux 基础命令",g.value=`	      <h1>Linux 基础命令速查：从文件操作到进程管理</h1>

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
	      <p>Linux 命令不需要死记硬背——<strong>记住最常用的 20 个</strong>（ls、cd、cat、less、tail、grep、find、chmod、ps、top、kill、df、du、free、ping、curl、ssh、scp、tar、vim），其余的遇到时查 <code>man</code>（manual）或 <code>--help</code> 就行。最重要的是<strong>理解管道的理念</strong>——通过组合简单命令来完成复杂任务，这是 Linux 命令行真正的威力所在。</p>`):d==="javascript-es6"?(c.value="JavaScript ES6+ 新特性",g.value=`	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

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
	      <p>ES6+ 的新特性远不止这些，但以上 6 类是最常用、最能提升开发效率的。<strong>如果你只能记住三点：永远用 const/let 而非 var、用箭头函数处理回调（注意 this）、用 async/await 写异步代码。</strong>掌握这些，你的 JavaScript 代码会从一个时代跨入另一个时代。</p>`):d==="design-patterns"?(c.value="设计模式入门",g.value=`	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

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
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂、建造者、策略、观察者这 5 种最常用的</strong>，其余的随着实践慢慢补充。</p>`):d==="redis-basics"?(c.value="Redis 基础入门",g.value=`	      <h1>Redis 缓存实战：从数据结构到缓存击穿解决方案</h1>

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
	      <p>Redis 入门容易精通难。<strong>会用五种数据类型只是第一层；理解缓存穿透/击穿/雪崩是第二层；深入持久化机制（RDB/AOF）、集群方案（Sentinel/Cluster）、内存淘汰策略、以及分布式锁的正确实现才是真正的进阶之路。</strong>本文覆盖了日常开发中 90% 的 Redis 使用场景，足以应对大多数业务需求。但记住：<strong>缓存不是万能的，加缓存之前先优化 SQL，很多场景下慢查询不是缓存能解决的。</strong></p>`):(c.value=d,g.value=`<p>Content for ${d} not migrated yet.</p>`)};return ee(()=>{E(),setTimeout(()=>pe.highlightAll(),100)}),(i,y)=>(ie(),te(ne,{title:c.value,icon:"fa fa-file-text-o",isOpen:"",isActive:"",onClose:y[0]||(y[0]=C=>oe(a).push("/all-notes"))},{default:re(()=>[de("div",{class:"notepad-content font-sans",innerHTML:g.value},null,8,ge)]),_:1},8,["title"]))}});export{be as default};
