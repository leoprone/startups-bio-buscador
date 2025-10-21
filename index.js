

//  BIBLIOTECA---------------------------------------------------------------------


((e,t)=>{"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()})(this,function r(){var n="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==n?n:{};var d,s=!n.document&&!!n.postMessage,a=n.IS_PAPA_WORKER||!1,o={},h=0,v={};function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(t,e){var i=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<i){let e=this._config.newline;e||(r=this._config.quoteChar||'"',e=this._handle.guessLineEndings(t,r)),t=[...t.split(e).slice(i)].join(e)}this.isFirstChunk&&U(this._config.beforeFirstChunk)&&void 0!==(r=this._config.beforeFirstChunk(t))&&(t=r),this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+t,r=(this._partialLine="",this._handle.parse(i,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){t=r.meta.cursor,i=(this._finished||(this._partialLine=i.substring(t-this._baseIndex),this._baseIndex=t),r&&r.data&&(this._rowCount+=r.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview);if(a)n.postMessage({results:r,workerId:v.WORKER_ID,finished:i});else if(U(this._config.chunk)&&!e){if(this._config.chunk(r,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=r=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),this._completed||!i||!U(this._config.complete)||r&&r.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),i||r&&r.meta.paused||this._nextChunk(),r}this._halted=!0},this._sendError=function(e){U(this._config.error)?this._config.error(e):a&&this._config.error&&n.postMessage({workerId:v.WORKER_ID,error:e,finished:!1})}}function f(e){var r;(e=e||{}).chunkSize||(e.chunkSize=v.RemoteChunkSize),u.call(this,e),this._nextChunk=s?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),s||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!s),this._config.downloadRequestHeaders){var e,t=this._config.downloadRequestHeaders;for(e in t)r.setRequestHeader(e,t[e])}var i;this._config.chunkSize&&(i=this._start+this._config.chunkSize-1,r.setRequestHeader("Range","bytes="+this._start+"-"+i));try{r.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}s&&0===r.status&&this._chunkError()}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize||r.responseText.length,this._finished=!this._config.chunkSize||this._start>=(e=>null!==(e=e.getResponseHeader("Content-Range"))?parseInt(e.substring(e.lastIndexOf("/")+1)):-1)(r),this.parseChunk(r.responseText)))},this._chunkError=function(e){e=r.statusText||e;this._sendError(new Error(e))}}function l(e){(e=e||{}).chunkSize||(e.chunkSize=v.LocalChunkSize),u.call(this,e);var i,r,n="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,n?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input,t=(this._config.chunkSize&&(t=Math.min(this._start+this._config.chunkSize,this._input.size),e=r.call(e,this._start,t)),i.readAsText(e,this._config.encoding));n||this._chunkLoaded({target:{result:t}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function c(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){var e,t;if(!this._finished)return e=this._config.chunkSize,i=e?(t=i.substring(0,e),i.substring(e)):(t=i,""),this._finished=!i,this.parseChunk(t)}}function p(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("")},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function i(m){var n,s,a,t,o=Math.pow(2,53),h=-o,u=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,d=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,i=this,r=0,f=0,l=!1,e=!1,c=[],p={data:[],errors:[],meta:{}};function y(e){return"greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(p&&a&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+v.DefaultDelimiter+"'"),a=!1),m.skipEmptyLines&&(p.data=p.data.filter(function(e){return!y(e)})),_()){if(p)if(Array.isArray(p.data[0])){for(var e=0;_()&&e<p.data.length;e++)p.data[e].forEach(t);p.data.splice(0,1)}else p.data.forEach(t);function t(e,t){U(m.transformHeader)&&(e=m.transformHeader(e,t)),c.push(e)}}function i(e,t){for(var i=m.header?{}:[],r=0;r<e.length;r++){var n=r,s=e[r],s=((e,t)=>(e=>(m.dynamicTypingFunction&&void 0===m.dynamicTyping[e]&&(m.dynamicTyping[e]=m.dynamicTypingFunction(e)),!0===(m.dynamicTyping[e]||m.dynamicTyping)))(e)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&((e=>{if(u.test(e)){e=parseFloat(e);if(h<e&&e<o)return 1}})(t)?parseFloat(t):d.test(t)?new Date(t):""===t?null:t):t)(n=m.header?r>=c.length?"__parsed_extra":c[r]:n,s=m.transform?m.transform(s,n):s);"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s}return m.header&&(r>c.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+c.length+" fields but parsed "+r,f+t):r<c.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+c.length+" fields but parsed "+r,f+t)),i}var r;p&&(m.header||m.dynamicTyping||m.transform)&&(r=1,!p.data.length||Array.isArray(p.data[0])?(p.data=p.data.map(i),r=p.data.length):p.data=i(p.data,0),m.header&&p.meta&&(p.meta.fields=c),f+=r)}function _(){return m.header&&0===c.length}function k(e,t,i,r){e={type:e,code:t,message:i};void 0!==r&&(e.row=r),p.errors.push(e)}U(m.step)&&(t=m.step,m.step=function(e){p=e,_()?g():(g(),0!==p.data.length&&(r+=e.data.length,m.preview&&r>m.preview?s.abort():(p.data=p.data[0],t(p,i))))}),this.parse=function(e,t,i){var r=m.quoteChar||'"',r=(m.newline||(m.newline=this.guessLineEndings(e,r)),a=!1,m.delimiter?U(m.delimiter)&&(m.delimiter=m.delimiter(e),p.meta.delimiter=m.delimiter):((r=((e,t,i,r,n)=>{var s,a,o,h;n=n||[",","\t","|",";",v.RECORD_SEP,v.UNIT_SEP];for(var u=0;u<n.length;u++){for(var d,f=n[u],l=0,c=0,p=0,g=(o=void 0,new E({comments:r,delimiter:f,newline:t,preview:10}).parse(e)),_=0;_<g.data.length;_++)i&&y(g.data[_])?p++:(d=g.data[_].length,c+=d,void 0===o?o=d:0<d&&(l+=Math.abs(d-o),o=d));0<g.data.length&&(c/=g.data.length-p),(void 0===a||l<=a)&&(void 0===h||h<c)&&1.99<c&&(a=l,s=f,h=c)}return{successful:!!(m.delimiter=s),bestDelimiter:s}})(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess)).successful?m.delimiter=r.bestDelimiter:(a=!0,m.delimiter=v.DefaultDelimiter),p.meta.delimiter=m.delimiter),w(m));return m.preview&&m.header&&r.preview++,n=e,s=new E(r),p=s.parse(n,t,i),g(),l?{meta:{paused:!0}}:p||{meta:{paused:!1}}},this.paused=function(){return l},this.pause=function(){l=!0,s.abort(),n=U(m.chunk)?"":n.substring(s.getCharIndex())},this.resume=function(){i.streamer._halted?(l=!1,i.streamer.parseChunk(n,!0)):setTimeout(i.resume,3)},this.aborted=function(){return e},this.abort=function(){e=!0,s.abort(),p.meta.aborted=!0,U(m.complete)&&m.complete(p),n=""},this.guessLineEndings=function(e,t){e=e.substring(0,1048576);var t=new RegExp(P(t)+"([^]*?)"+P(t),"gm"),i=(e=e.replace(t,"")).split("\r"),t=e.split("\n"),e=1<t.length&&t[0].length<i[0].length;if(1===i.length||e)return"\n";for(var r=0,n=0;n<i.length;n++)"\n"===i[n][0]&&r++;return r>=i.length/2?"\r\n":"\r"}}function P(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(C){var S=(C=C||{}).delimiter,O=C.newline,x=C.comments,I=C.step,A=C.preview,T=C.fastMode,D=null,L=!1,F=null==C.quoteChar?'"':C.quoteChar,j=F;if(void 0!==C.escapeChar&&(j=C.escapeChar),("string"!=typeof S||-1<v.BAD_DELIMITERS.indexOf(S))&&(S=","),x===S)throw new Error("Comment character same as delimiter");!0===x?x="#":("string"!=typeof x||-1<v.BAD_DELIMITERS.indexOf(x))&&(x=!1),"\n"!==O&&"\r"!==O&&"\r\n"!==O&&(O="\n");var z=0,M=!1;this.parse=function(i,t,r){if("string"!=typeof i)throw new Error("Input must be a string");var n=i.length,e=S.length,s=O.length,a=x.length,o=U(I),h=[],u=[],d=[],f=z=0;if(!i)return b();if(T||!1!==T&&-1===i.indexOf(F)){for(var l=i.split(O),c=0;c<l.length;c++){if(d=l[c],z+=d.length,c!==l.length-1)z+=O.length;else if(r)return b();if(!x||d.substring(0,a)!==x){if(o){if(h=[],k(d.split(S)),R(),M)return b()}else k(d.split(S));if(A&&A<=c)return h=h.slice(0,A),b(!0)}}return b()}for(var p=i.indexOf(S,z),g=i.indexOf(O,z),_=new RegExp(P(j)+P(F),"g"),m=i.indexOf(F,z);;)if(i[z]===F)for(m=z,z++;;){if(-1===(m=i.indexOf(F,m+1)))return r||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:z}),E();if(m===n-1)return E(i.substring(z,m).replace(_,F));if(F===j&&i[m+1]===j)m++;else if(F===j||0===m||i[m-1]!==j){-1!==p&&p<m+1&&(p=i.indexOf(S,m+1));var y=v(-1===(g=-1!==g&&g<m+1?i.indexOf(O,m+1):g)?p:Math.min(p,g));if(i.substr(m+1+y,e)===S){d.push(i.substring(z,m).replace(_,F)),i[z=m+1+y+e]!==F&&(m=i.indexOf(F,z)),p=i.indexOf(S,z),g=i.indexOf(O,z);break}y=v(g);if(i.substring(m+1+y,m+1+y+s)===O){if(d.push(i.substring(z,m).replace(_,F)),w(m+1+y+s),p=i.indexOf(S,z),m=i.indexOf(F,z),o&&(R(),M))return b();if(A&&h.length>=A)return b(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:z}),m++}}else if(x&&0===d.length&&i.substring(z,z+a)===x){if(-1===g)return b();z=g+s,g=i.indexOf(O,z),p=i.indexOf(S,z)}else if(-1!==p&&(p<g||-1===g))d.push(i.substring(z,p)),z=p+e,p=i.indexOf(S,z);else{if(-1===g)break;if(d.push(i.substring(z,g)),w(g+s),o&&(R(),M))return b();if(A&&h.length>=A)return b(!0)}return E();function k(e){h.push(e),f=z}function v(e){var t=0;return t=-1!==e&&(e=i.substring(m+1,e))&&""===e.trim()?e.length:t}function E(e){return r||(void 0===e&&(e=i.substring(z)),d.push(e),z=n,k(d),o&&R()),b()}function w(e){z=e,k(d),d=[],g=i.indexOf(O,z)}function b(e){if(C.header&&!t&&h.length&&!L){var s=h[0],a={},o=new Set(s);let n=!1;for(let r=0;r<s.length;r++){let i=s[r];if(a[i=U(C.transformHeader)?C.transformHeader(i,r):i]){let e,t=a[i];for(;e=i+"_"+t,t++,o.has(e););o.add(e),s[r]=e,a[i]++,n=!0,(D=null===D?{}:D)[e]=i}else a[i]=1,s[r]=i;o.add(i)}n&&console.warn("Duplicate headers found and renamed."),L=!0}return{data:h,errors:u,meta:{delimiter:S,linebreak:O,aborted:M,truncated:!!e,cursor:f+(t||0),renamedHeaders:D}}}function R(){I(b()),h=[],u=[]}},this.abort=function(){M=!0},this.getCharIndex=function(){return z}}function g(e){var t=e.data,i=o[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:m,resume:m};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!r&&_(t.workerId,t.results)}function _(e,t){var i=o[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete o[e]}function m(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t,i=Array.isArray(e)?[]:{};for(t in e)i[t]=w(e[t]);return i}function y(e,t){return function(){e.apply(t,arguments)}}function U(e){return"function"==typeof e}return v.parse=function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,!t.worker||!v.WORKERS_SUPPORTED)return i=null,v.NODE_STREAM_INPUT,"string"==typeof e?(e=(e=>65279!==e.charCodeAt(0)?e:e.slice(1))(e),i=new(t.download?f:c)(t)):!0===e.readable&&U(e.read)&&U(e.on)?i=new p(t):(n.File&&e instanceof File||e instanceof Object)&&(i=new l(t)),i.stream(e);(i=(()=>{var e;return!!v.WORKERS_SUPPORTED&&(e=(()=>{var e=n.URL||n.webkitURL||null,t=r.toString();return v.BLOB_URL||(v.BLOB_URL=e.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",t,")();"],{type:"text/javascript"})))})(),(e=new n.Worker(e)).onmessage=g,e.id=h++,o[e.id]=e)})()).userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,i.postMessage({input:e,config:t,workerId:i.id})},v.unparse=function(e,t){var n=!1,_=!0,m=",",y="\r\n",s='"',a=s+s,i=!1,r=null,o=!1,h=((()=>{if("object"==typeof t){if("string"!=typeof t.delimiter||v.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter),"boolean"!=typeof t.quotes&&"function"!=typeof t.quotes&&!Array.isArray(t.quotes)||(n=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines),"string"==typeof t.newline&&(y=t.newline),"string"==typeof t.quoteChar&&(s=t.quoteChar),"boolean"==typeof t.header&&(_=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns}void 0!==t.escapeChar&&(a=t.escapeChar+s),t.escapeFormulae instanceof RegExp?o=t.escapeFormulae:"boolean"==typeof t.escapeFormulae&&t.escapeFormulae&&(o=/^[=+\-@\t\r].*$/)}})(),new RegExp(P(s),"g"));"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||Object.keys(e[0]),e,i)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||r),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e,t,i){var r="",n=("string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t)),Array.isArray(e)&&0<e.length),s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=k(e[a],a);0<t.length&&(r+=y)}for(var o=0;o<t.length;o++){var h=(n?e:t[o]).length,u=!1,d=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var f=[],l=0;l<h;l++){var c=s?e[l]:l;f.push(t[o][c])}u=""===f.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!d&&(r+=m);var g=n&&s?e[p]:p;r+=k(t[o][g],p)}o<t.length-1&&(!i||0<h&&!d)&&(r+=y)}}return r}function k(e,t){var i,r;return null==e?"":e.constructor===Date?JSON.stringify(e).slice(1,25):(r=!1,o&&"string"==typeof e&&o.test(e)&&(e="'"+e,r=!0),i=e.toString().replace(h,a),(r=r||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||((e,t)=>{for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return!0;return!1})(i,v.BAD_DELIMITERS)||-1<i.indexOf(m)||" "===i.charAt(0)||" "===i.charAt(i.length-1))?s+i+s:i)}},v.RECORD_SEP=String.fromCharCode(30),v.UNIT_SEP=String.fromCharCode(31),v.BYTE_ORDER_MARK="\ufeff",v.BAD_DELIMITERS=["\r","\n",'"',v.BYTE_ORDER_MARK],v.WORKERS_SUPPORTED=!s&&!!n.Worker,v.NODE_STREAM_INPUT=1,v.LocalChunkSize=10485760,v.RemoteChunkSize=5242880,v.DefaultDelimiter=",",v.Parser=E,v.ParserHandle=i,v.NetworkStreamer=f,v.FileStreamer=l,v.StringStreamer=c,v.ReadableStreamStreamer=p,n.jQuery&&((d=n.jQuery).fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&n.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)})}),e(),this;function e(){if(0===h.length)U(o.complete)&&o.complete();else{var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u()},v.parse(n.file,n.instanceConfig)}}function u(){h.splice(0,1),e()}}),a&&(n.onmessage=function(e){e=e.data;void 0===v.WORKER_ID&&e&&(v.WORKER_ID=e.workerId);"string"==typeof e.input?n.postMessage({workerId:v.WORKER_ID,results:v.parse(e.input,e.config),finished:!0}):(n.File&&e.input instanceof File||e.input instanceof Object)&&(e=v.parse(e.input,e.config))&&n.postMessage({workerId:v.WORKER_ID,results:e,finished:!0})}),(f.prototype=Object.create(u.prototype)).constructor=f,(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(c.prototype)).constructor=c,(p.prototype=Object.create(u.prototype)).constructor=p,v});







//  FIN BIBLIOTECA----------------------------------------------------------------------




/* 



setTimeout(() => {
    document.getElementById("video1").play();
  }, 8000);

 */



const contenedorResultados = document.querySelector("#resultados");

      const toggleDarkMode = () => {
          document.body.classList.toggle('dark-mode');
          /* contenedorResultados.classList.toggle('dark-mode'); */
          const isDarkMode = document.body.classList.contains('dark-mode');
         /*  const isContenedorResultadosdorDarkMode = contenedorResultados.classList.contains('dark-mode'); */
          localStorage.setItem('dark-mode', isDarkMode);
         /*  localStorage.setItem('dark-mode', isContenedorResultadosdorDarkMode); */
        };
        
        // Aplicar el modo oscuro si estaba habilitado anteriormente
        if (localStorage.getItem('dark-mode') === 'true') {
          document.body.classList.add('dark-mode');
          /* contenedorResultados.classList.add('dark-mode'); */
        }
        
      
       /*  const buttonMode = document.getElementById('dark-mode-button'); */
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        darkModeToggle.addEventListener('click', toggleDarkMode);
      
      
      
      
      
      
      
      
     /*  const fileInput = document.getElementById("csvFile");
      const fileNameElement = document.getElementById("fileName"), */
      const mapSection = document.getElementById("map-section");
      
      
      const contenedorTabla = document.getElementById("contenedor-tabla");
      const saveAsCsv = document.getElementById("guardar-como-csv"),
      saveAsJson = document.getElementById("guardar-como-json"),
      /* reloadBtn = document.getElementById("reload-btn"), */
      cargarCSVButton = document.getElementById("cargar-CSV-Button");
      
      
      /* reloadBtn.addEventListener("click", function(){
          location.reload();  // recarga la página
      }); */
      
      
      function generarIds(json){
          return json.map((row, index)=>{
              if(!row.id){
                  row.id = `row-${index}`; // genera un id único si no existe
              }
              return row;
          });
      }
      
    
      
const conteoResultadosTabla = document.getElementById("conteo-resultados");
      
   
      function mostrarTablaEditable(json) {
        /*   
          console.trace("mostrarTablaEditable llamada. JSON actual:", json); */
          actualizarBuscadorBtn.classList.add("visibility-hidden");
          contenedorTabla.classList.remove("display-none"); 

          const irBuscador= document.getElementById("ir-buscador");
     
     
         
         
          conteoResultadosTabla.textContent= jsonGlobal.length + " resultados";
          
      
          
          irBuscador.classList.remove("display-none");
      
          const previewDiv = document.getElementById("preview");
        
      
          previewDiv.innerHTML = ""; // Limpiar el contenido anterior
          let tableHTML = "<table>";
        //para que no se muestre la columna con el id (row-numero) agregado por la app hay 2 maneras:
          // Encabezados de la tabla
          /* const headers = Object.keys(json[0]).slice(0, -1);
                OTRA FORMA:                                 */
           const headers = Object.keys(json[0]).filter(key => key !== "id"); 
    
           
                 
          tableHTML += "<thead><tr><th class='th-accion'></th>";
          headers.forEach(header => {
             tableHTML += `<th contenteditable="true" data-texto-anterior="${header}">${header}</th>`; 
              /*  tableHTML += `<th>${header}</th>`;*/
          });
          tableHTML += "</tr></thead>";
      
          // Filas de datos
          tableHTML += "<tbody>";
          json.forEach(row => {
             
               /* tableHTML += "<tr>"; */
               tableHTML += `<tr id="${row.id}">
                  <td><button class="accion-eliminar" onclick="deleteRow('${row.id}')">Eliminar</button></td>`;   
              headers.forEach(header => {
                  tableHTML += `<td contenteditable="true"  data-texto-anterior="${row[header]}"><div>${row[header]}</div></td>`; 
                  /* tableHTML += `<td>${row[header]}</td>`;*/
              });
              tableHTML += "</tr>";
          });

         
          tableHTML += "</tbody></table>";
      
          previewDiv.innerHTML = tableHTML;
      
          
          // llamamos a la función para agregar confirmación
          agregarConfirmacionEncabezados(); 
          agregarConfirmacionCeldas(); 
      
          
          const celdasEditables = document.querySelectorAll("td[contenteditable='true'], th[contenteditable='true']");
          
           
          
          celdasEditables.forEach(celda => {
              
              celda.addEventListener("blur", (event) => {
                   
                  const celdaActual = event.target;
                  const textoAnterior = celdaActual.getAttribute("data-texto-anterior"); 
                  const textoActual = celdaActual.textContent;
      
             
                   // habilitamos botones de Guardar 
                  saveAsCsv.classList.remove("display-none");
                  saveAsJson.classList.remove("display-none"); 
                  
                  celdaActual.setAttribute("data-texto-anterior", textoActual);
                  
                  
                  


                  //   EDICIÓN -------------
                  actualizarBuscadorBtn.classList.remove("visibility-hidden"); 
                  /* actualizarBuscadorBtn.style.zIndex= "50";
                  actualizarBuscadorBtn.style.fontSize="30px";
                  actualizarBuscadorBtn.style.color= "red"; */
                
                  actualizarBuscadorBtn.addEventListener("click", () =>{
                      const json = capturarDatosEditados(); 
                      // pasamos el JSON al BUSCADOR
                      
                      inicioBuscador(json); 
      
                      actualizarBuscadorBtn.classList.add("visibility-hidden");
                  }); 
                              
                 //------------------------------------------------


              });
      
            
          });
      
      
      }
      





      function mostrarNombreArchivo(input, nameElement) {
        
          if (input.files.length > 0) { // si hay al menos 1 archivo CSV seleccionado
               // mostramos el nombre del archivo .csv
              nameElement.textContent = "archivo: " + input.files[0].name;
         
          } else {
              nameElement.textContent = "No se ha seleccionado ningún archivo"; // Texto predeterminado
          }
       }
      
      
      
      
      
      
      
       function cargarCSV(fileInput, fileNameElement) {
          
            saveAsCsv.classList.add("display-none");
            saveAsJson.classList.add("display-none");
            // csv es el archivo CSV cargado
            const archivo = fileInput.files[0];
            
            
            if (archivo) { 
                /*   contenedorTabla.classList.remove("display-none");
                
                saveAsCsv.classList.remove("display-none");
                saveAsJson.classList.remove("display-none");
                // hacemos que se vea el nombre del archivo cargado
                fileNameElement.classList.remove("display-none"); */
                /* cargarCSVButton.classList.add("display-none"); */
                mostrarNombreArchivo(fileInput, fileNameElement);
                fileNameElement.classList.remove("display-none");
                
                /*   reloadBtn.classList.add("btn-verde");
                reloadBtn.classList.remove("display-none"); */
                saveAsCsv.classList.remove("display-none");
                saveAsJson.classList.remove("display-none");
                
                return archivo;
        
            } else {
                alert("Por favor, selecciona un archivo CSV.");
            } 
      
      }
      
      
      const fastaInput = document.getElementById("fasta-file");

      document.getElementById("fasta-btn").addEventListener("click", () => {
        // Abre la ventana para seleccionar el archivo
       
        fastaInput.click(); 
       /*  mostrarBuscadorBtn.classList.remove("display-none"); */
    });
    



fastaInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length === 0) {
        alert("Por favor selecciona uno o más archivos FASTA.");
        return;
    }

    const rows = [["ID", "Secuencia"]]; // Encabezado del CSV

    Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const fastaText = event.target.result;
            const lines = fastaText.split(/\r?\n/);

            let id = null;
            let sequence = "";

            lines.forEach(line => {
                line = line.trim();
                if (line === "") return; // Saltar líneas vacías

                if (line.startsWith(">")) {
                    if (id !== null) {
                        rows.push([`"${id}"`, sequence]); // Guardar el registro con el ID entre comillas
                    }
                    id = `"${line.substring(1).trim()}"`; // Guardar toda la línea del encabezado sin dividir
                    sequence = ""; // Reiniciar secuencia
                } else {
                    sequence += line.replace(/\s/g, "").toUpperCase();
                }
            });

            // Guardar el último registro del archivo procesado
            if (id !== null) {
                rows.push([id, sequence]);
            }

            // Convertir a CSV al finalizar la lectura de todos los archivos
            if (rows.length === files.length + 1) {
                arregloTotal = [];
                let csv = convertirACsv(rows);
                inicioFasta(csv); // Aquí enviarás el contenido al buscador o flujo necesario
            
            }
        };

        reader.readAsText(file, "utf-8");
    });
});




    function convertirACsv(rows) {
                const csvContenido = rows.map(e => e.join(",")).join("\n");
           
               
                return csvContenido;
              }
      
      function convertidorCsvAJson(csv) {
          return new Promise((resolve, reject) => {
              Papa.parse(csv, {
                  header: true, // Usar encabezados en el CSV
                  skipEmptyLines: true, // Ignorar líneas vacías
                  complete: function (results) {
                      const jsonData = results.data; // guardamos los datos en formato JSON
                      resolve(jsonData); // Resolvemos la promesa con jsonData
                  },
                  error: function (err) {
                      reject(new Error("Error al cargar el archivo: " + err.message)); // Rechazamos la promesa si ocurre un error
                  },
              });
          });
      }
      
      
      
      
      
      function agregarConfirmacionEncabezados() {
          const encabezados = document.querySelectorAll("th[contenteditable='true']");
          encabezados.forEach(th => {
              // Captura el texto original antes de editar
              th.addEventListener("focus", function() {
                  const textoActual = th.textContent.trim();
                  th.setAttribute("data-texto-anterior", textoActual);
              });
      
              // Mostrar confirmación al perder el foco
              th.addEventListener("blur", function() {
                  const nuevoNombre = th.textContent.trim(); // Capturar el nuevo texto
                  const textoAnterior = th.getAttribute("data-texto-anterior");
      
                  if (nuevoNombre !== textoAnterior) { // Solo confirmar si el texto cambió
                      const confirmacion = confirm(`¿Realmente quiere cambiar el nombre del campo "${textoAnterior}" a "${nuevoNombre}"?`);
                      if (!confirmacion) {
                          th.textContent = textoAnterior; // Restaurar si cancela el cambio
                      } else {
                          th.setAttribute("data-texto-anterior", nuevoNombre); // Actualizar el texto anterior
                       
                      }
                  }
              });
          });
      } 
      
      
      
      
       function agregarConfirmacionCeldas() {
          const celdas = document.querySelectorAll("td[contenteditable='true']");
          celdas.forEach(td => {
              // Captura el texto original antes de editar
              td.addEventListener("focus", function() {
                  const textoActual = td.textContent.trim();
                  td.setAttribute("data-texto-anterior", textoActual);
              });
      
              // Mostrar confirmación al perder el foco
              td.addEventListener("blur", function() {
                  const nuevoNombre = td.textContent.trim(); // Capturar el nuevo texto
                  const textoAnterior = td.getAttribute("data-texto-anterior");
      
                  if (nuevoNombre !== textoAnterior) { // Solo confirmar si el texto cambió
                      const confirmacion = confirm(`¿Realmente quiere cambiar el nombre del campo "${textoAnterior}" a "${nuevoNombre}"?`);
                      if (!confirmacion) {
                          td.textContent = textoAnterior; // Restaurar si cancela el cambio
                      } else {
                          td.setAttribute("data-texto-anterior", nuevoNombre); // Actualizar el texto anterior
                        
                      }
                  }
              });
          });
      }
        
      


            
function deleteRow(id) {
    // Verificar que jsonGlobal es un array válido
    if (!Array.isArray(jsonGlobal)) {
        console.error("jsonGlobal no es un array. Asegúrate de inicializarlo correctamente.");
        return;
    }

    // Buscar el índice del registro en el array JSON
    const index = jsonGlobal.findIndex(row => row.id === id);
    if (index === -1) {
        console.error(`No se encontró ningún registro con el id: ${id}`);
        return;
    }

    // Eliminar el registro del JSON
    jsonGlobal.splice(index, 1);
    console.log(`Registro con id ${id} eliminado del JSON. Estado actual del JSON:`, jsonGlobal);
    // actualizamos el contador de resultados
    conteoResultadosTabla.textContent= jsonGlobal.length + " resultados";
    

    // Eliminar visualmente la fila del DOM
    const rowElement = document.getElementById(id);
    if (rowElement) {
        rowElement.remove(); // Eliminar del DOM directamente
       
    }
 
 
}



      
          function capturarDatosEditados() {
              const table = document.querySelector("table");
          
          
      
                  // Filtrar los encabezados y excluir el "id"
                  const headers = Array.from(table.querySelectorAll("th"))
                      .map(th => th.textContent)
                      /* .filter(header => header.toLowerCase() !== "id") */; // Excluir el encabezado "id"
              
                  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Omitir fila de encabezados
              
                  const updatedData = rows.map(row => {
                      const cells = Array.from(row.querySelectorAll("td"));
                      const rowObject = {};
                      cells.forEach((cell, index) => {
                        
                          if (headers[index] /* && headers[index].toLowerCase() !== "id" */) {
                              rowObject[headers[index]] = cell.textContent.trim();
                          }
              
                          // Permitir edición táctil en celdas (opcional)
                          cell.addEventListener("touchstart", (event) => {
                              event.target.contentEditable = true; // Hacer la celda editable al tocar
                          }, { passive: true });
              
                          cell.addEventListener("touchend", (event) => {
                              event.target.contentEditable = false; // Detener edición al soltar
                          }, { passive: true });
                      });
                      return rowObject;
                  });
              
                  
                  return updatedData;
                 
          }



      const descargarTablaComoCsv=document.getElementById("descargarTablaComoCsv");  
  
      
      descargarTablaComoCsv.addEventListener("click", ()=> {
      
        const datosEditadosEnTabla = capturarDatosEditados();
        guardarComoCSV(datosEditadosEnTabla);
  
      });
          
      const descargarTablaComoJson=document.getElementById("descargarTablaComoJson");
  
      descargarTablaComoJson.addEventListener("click", ()=> {
      
      const datosEditadosEnTabla = capturarDatosEditados();
      guardarComoJSON(datosEditadosEnTabla);

    });
      
      
      
      
      


      function guardarComoCSV(datos) {
          
          const csv = Papa.unparse(datos); // Convertir JSON a CSV
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "filtrado.csv"; // Nombre del archivo
          link.style.display = "none";
        /*   descargarCsv.classList.remove('animacion'); */
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      
        /*   descargarCsv.classList.add("display-none");
        claveOpciones.classList.add("display-none"); */
        saveAsCsv.classList.remove("display-none");
       /*  switchBtn.classList.add("display-none"); */
        
        saveAsCsv.addEventListener("click", ()=>{
                
              /*   descargarCsv.classList.remove("display-none");
                claveOpciones.classList.remove("display-none"); */
                saveAsCsv.classList.add("display-none");
        });
         
         
      }
      
      
    /* 
      const descargarCsv = document.getElementById('descargar-csv');
    
      descargarCsv.addEventListener("click", ()=>{
                   
           descargarJSONFiltrado('csv');
      });

 
  
      
 
      function elegirClaves(){
        const claves = obtenerClavesUnicas(resultadoFiltrado);
        claves.pop();
       
        generarCheckboxes(claves);
        claveOpciones.classList.remove("display-none");
        switchBtn.classList.remove("display-none");
      }


      saveAsCsv.addEventListener("click", ()=> {
        
        saveAsJson.classList.add("display-none");
        elegirClaves();
        saveAsCsv.classList.add("display-none");
        
        descargarCsv.classList.remove("display-none");
        descargarCsv.textContent="Seleccionar Campos";
      });
      

      saveAsJson.addEventListener("click", ()=> {
        saveAsCsv.classList.add("display-none");
        elegirClaves();
        saveAsJson.classList.add("display-none");
        
        descargarJson.classList.remove("display-none");
        descargarJson.textContent="Seleccionar Campos";
        
      });
       



      const descargarJson = document.getElementById("descargar-json"),
      claveOpciones=document.getElementById("claveOpciones");
     

      descargarJson.addEventListener("click", ()=>{
                   
           descargarJSONFiltrado('json');
      });

      */


    const switchBtn=document.getElementById("switch-btn");

    switchBtn.addEventListener("click", ()=>{
        /* claveOpciones.classList.add("display-none"); */
        switchBtn.classList.add("display-none");
       /*  descargarCsv.classList.add("display-none"); 
        saveAsCsv.classList.remove("display-none");
       descargarJson.classList.add("display-none"); 
        saveAsJson.classList.remove("display-none");*/
    });


 // 🔍 Extrae todas las claves únicas del JSON
    function obtenerClavesUnicas(datos) {
      const conjunto = new Set();
      datos.forEach(obj => {
        Object.keys(obj).forEach(clave => conjunto.add(clave));
      });
      return Array.from(conjunto);
    }

    // 🎨 Genera dinámicamente los checkboxes
    function generarCheckboxes(claves) {
      const contenedor = document.getElementById("claveOpciones");
      contenedor.innerHTML = "";
      claves.forEach(clave => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.value = clave;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + clave));
        contenedor.appendChild(label);
      });
    }

    // 🧹 Filtra el objeto original por claves seleccionadas
    function filtrarClaves(objeto, clavesPermitidas) {
      if (Array.isArray(objeto)) {
        return objeto.map(item => filtrarClaves(item, clavesPermitidas));
      } else if (typeof objeto === 'object' && objeto !== null) {
        const nuevoObjeto = {};
        for (const clave of clavesPermitidas) {
          if (clave in objeto) {
            nuevoObjeto[clave] = objeto[clave];
          }
        }
        return nuevoObjeto;
      }
      return objeto;
    }

    // 💾 Convierte a Blob y genera el archivo descargable
    function guardarComoJSON(datosFiltrados) {

      const blob = new Blob([JSON.stringify(datosFiltrados, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "filtrado.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      descargarJson.classList.add("display-none");
      claveOpciones.classList.add("display-none");
      saveAsJson.classList.remove("display-none");
      switchBtn.classList.add("display-none");
      
      saveAsJson.addEventListener("click", ()=>{
       
            descargarJson.classList.remove("display-none");
            claveOpciones.classList.remove("display-none");
            saveAsJson.classList.add("display-none");
      });

      /* alert("Archivo JSON guardado exitosamente."); */
    }


    function clavesJsonElegidas(){
       
         const checkboxes = document.querySelectorAll('#claveOpciones input[type="checkbox"]');
    
        
         const clavesSeleccionadas = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
        
        
        
         return clavesSeleccionadas;
    }


 let datosFiltrados = [];


function descargarJSONFiltrado(formato) {
    const clavesSeleccionadas = clavesJsonElegidas();

    if (clavesSeleccionadas.length === 0) {
        if(formato==='csv'){
             descargarCsv.textContent = "Seleccionar Campos";
             
        }else if(formato==='json'){
             descargarJson.textContent = "Seleccionar Campos";
        }
        
        switchBtn.classList.remove("display-none");
        claveOpciones.classList.remove("display-none");
        return;
    }

   

    datosFiltrados = filtrarClaves(resultadoFiltrado, clavesSeleccionadas);
  
    if(formato==='csv'){
        descargarCsv.textContent = "Descargar CSV";
        guardarComoCSV(datosFiltrados);
        
    }else if(formato==='json'){
        descargarJson.textContent = "Descargar JSON";
        guardarComoJSON(datosFiltrados); 
        
    }
    
    saveAsCsv.classList.remove("display-none");
    saveAsJson.classList.remove("display-none");
    
}











// ANIMACIÓN TÍTULO ("BUSCADOR")
       
const contenedorLupa = document.getElementById("contenedor-lupa");

       
function animacionTitulo(){
 contenedorLupa.style.display = "block";
    

    const b = document.querySelector(".b"),
    u = document.querySelector(".u"),
    s = document.querySelector(".s"),
    c = document.querySelector(".c"),
    a = document.querySelector(".a"),
    d = document.querySelector(".d"),
    o = document.querySelector(".o"),
    r = document.querySelector(".r");

    setTimeout(()=>{
      contenedorLupa.style.display = "none";
        b.classList.remove("display-none");
       b.classList.add("aparicion");
    },5000);

     setTimeout(()=>{
       u.classList.remove("display-none");
       u.classList.add("aparicion");
       b.classList.remove("aparicion");
    },5500);

     setTimeout(()=>{
       s.classList.remove("display-none");
       s.classList.add("aparicion");
       u.classList.remove("aparicion");
    },5800);

     setTimeout(()=>{
       c.classList.remove("display-none");
       c.classList.add("aparicion");
       s.classList.remove("aparicion");
    },7000);

     setTimeout(()=>{
       a.classList.remove("display-none");
       a.classList.add("aparicion");
       c.classList.remove("aparicion");
    },7800);

     setTimeout(()=>{
       d.classList.remove("display-none");
       d.classList.add("aparicion");
       a.classList.remove("aparicion");
    },8500);

     setTimeout(()=>{
       o.classList.remove("display-none");
       o.classList.add("aparicion");
       d.classList.remove("aparicion");
    },9000);

     setTimeout(()=>{
       r.classList.remove("display-none");
       r.classList.add("aparicion");
       o.classList.remove("aparicion");
    },9200);

     setTimeout(()=>{
        b.classList.add("display-none");
        u.classList.add("display-none");
        s.classList.add("display-none");
        c.classList.add("display-none");
        a.classList.add("display-none");
        d.classList.add("display-none");
        o.classList.add("display-none");
        r.classList.add("display-none");
        
       animacionTitulo();
    },15000);
}   
let jsonGlobal; // Variable global para almacenar el JSON

/* const fileId = '1mhLUAF-lti-SOKG9VPDgJM_ZgW0xRP-s'; */
const fileId = '1CTgKQkU1aJdE5siJUAyIz6nxlswJbYWW';
const url = `https://corsproxy.io/?https://drive.google.com/uc?export=download&id=${fileId}`;
//  1z1JkR3N5oMUET-6X5HCUmj8txy3aavDAebrvpeQg5nk
document.addEventListener("DOMContentLoaded", cargaDirectamenteCSV);



      
 function cargaDirectamenteCSV() {
  
          animacionTitulo();
            

           cargarCSVButton.style.display="none"; 
           mapSection.classList.remove("display-none");
          
           /*  mapSection.scrollIntoView({ behavior: "smooth" }); */
           fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('No se pudo cargar el CSV');
                    return response.text();
                })
                .then(csv => inicio(csv))
                .catch(error => console.error(error));

            }

        


      
cargarCSVButton.addEventListener("click", function () {
          /* const fileInput = document.getElementById("csvFile");
          fileInput.click();  */// Abre el selector de archivos
         
          // Uso:
           /*  cargaDirectamenteCSV().then(csv => {
            console.log(csv);
                inicio(csv);
            }); */
            /* cargarCSVButton.style.display="none"; 
            cargaDirectamenteCSV(); */
            
           /*  mostrarBuscadorBtn.classList.remove("display-none"); */
        
      });
      
     
      
      
      function conectorEditorBuscador(csv) {
          convertidorCsvAJson(csv)
              .then(jsonData => {
                  jsonGlobal = generarIds(jsonData); // Guardar en jsonGlobal
                  //document.getElementById("regenerarTablaButton").style.display = "block"; // Mostrar el botón de regeneración
                  inicioBuscador(jsonGlobal);
              })
              .catch(err => {
                  console.error("Error al procesar el archivo:", err.message);
              });
      }
      
      // Botón para mostar tabla
      const mostrarTablaBtn = document.getElementById("regenerarTablaButton");
      
      mostrarTablaBtn.addEventListener("click", function () {
          mostrarTablaBtn.classList.add("visibility-hidden");
        /*   console.log(jsonGlobal); */
          mostrarTablaEditable(jsonGlobal);
          document.getElementById("contenedor-tabla").scrollIntoView({ behavior: "smooth" });
      });
      


      const btnMostrarEditorSinonimos=document.getElementById("btn-mostrar-editor-sinonimos");
      const formularioSinonimos = document.getElementById("formulario-sinonimos"),
      crearListaSinonimos = document.getElementById("crear-lista-sinonimos"),
      descargarSinonimosJson= document.getElementById("descargar-sinonimos-json");

      function funcionesDelEditorSinonimos(){
      /*   btnMostrarEditorSinonimos.addEventListener("click", ()=>{
            mostrarEditorSinonimos();
            document.getElementById("titulo-sinonimos").scrollIntoView({ behavior: "smooth" });
        }); */
      }

      descargarSinonimosJson.addEventListener("click", ()=>{
        funcionesDelDescagadorSinonimos();
      });

     function funcionesDelDescagadorSinonimos(){
        document.getElementById("nombreArchivoSinonimos").style.borderColor ="red";
     }


      function mostrarEditorSinonimos(){
        document.getElementById("tabla-sinonimos").classList.remove("display-none");
        formularioSinonimos.style.display = "none";
       /*  document.getElementById("tabla-sinonimos").style.height ="auto"; */
        crearListaSinonimos.addEventListener("click", ()=> {
            
            listaSinonimos.innerHTML=""; 


            arregloTotal = [];

            mostrarEditorSinonimos(arregloTotal); 
           
            formularioSinonimos.style.display ="flex";
            crearListaSinonimos.textContent = "Nueva Lista";
            sinonimos.focus();

            
            
           
        });
      /*   btnMostrarEditorSinonimos.style.display = "none"; */
      }
      
    
      function funcionesDelBuscador(){
        mapSection.classList.remove("display-none");
   
      }
      




       




     


      // la función "inicio" es disparada desde input de "Cargar archivo CSV"
      
      function inicio(csv){

        
        // Oculto la TABLA y el BUSCADOR
            contenedorTabla.classList.add("display-none");
            mapSection.classList.add("display-none");


         /*  mostrarNombreArchivo(fileInput, fileNameElement); 
          const csv = cargarCSV(fileInput, fileNameElement); */
         /*  mostrarBuscadorBtn.style.display = "inline-block"; */
          funcionesDelBuscador();

          mostrarTablaBtn.classList.remove("visibility-hidden");
         
          /* btnMostrarEditorSinonimos.classList.remove("display-none"); */
          conectorEditorBuscador(csv);
        
          
      }
      
      const fileNameFasta=document.getElementById("fileNameFasta");


      function inicioFasta(csvFasta){
        // Oculto la TABLA y el BUSCADOR
          contenedorTabla.classList.add("display-none");
          mapSection.classList.add("display-none");
            
          

          mostrarNombreArchivo(fastaInput, fileNameFasta);
          
         /*  mostrarBuscadorBtn.style.display = "inline-block"; */
          funcionesDelBuscador();

          mostrarTablaBtn.classList.remove("visibility-hidden");
         
         /*  btnMostrarEditorSinonimos.classList.remove("display-none"); */
         
          conectorEditorBuscador(csvFasta);
        
          
      }
      
      
      
      
      //  PARA ACTUALIZAR EL BUSCADOR CON LOS DATOS EDITADOS DE LA TABLA 
      
      const actualizarBuscadorBtn = document.getElementById("actualizar-buscador-btn");
      
    
      
      // -----------------------   BUSCADOR   --------------------------------
      
      
      
      
      const inputBuscador = document.getElementById("buscador");
     /*  const fileNameDisplay = document.getElementById('file-name'); */
      
      
      inputBuscador.addEventListener("pointerdown", function(event) {
          const input = event.target;
          if (input.disabled) {
              input.style.opacity="0.4";
              input.value = "";
              input.placeholder = "No hay Campos fijados";
            
              
            event.preventDefault(); // Previene el comportamiento predeterminado.
            event.stopPropagation(); // Evita que el evento se propague.
          }else{
              input.style.opacity="1";
              input.placeholder ="Buscar por términos clave...";
          }
        });
      
      
      
      

// Función para eliminar tildes (normalizar texto). Sirve para normalizar texto ingresado por inputs

function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza y elimina diacríticos
}


     

let textoAcumulado = ""; 
let gruposDePalabras = [];  // se usan para filtrar cada obj JSON por la coincidencia 
// con todos los terminos (o sus sinónimos) 

/* let arregloSinonimos = [["polimeros", "biopolimeros", "secuencia de aminoacidos"], ["materiales", "biomateriales", "biomat"], ["materiales", "mat"]]; */
let resultadoFiltrado = [];   

      


function buscar(inputBuscador, dondeBuscar, opciones) {
/* 
        inputBuscador.addEventListener("input", ()=>{
            if(inputBuscador.value ===""){
                palabrasBusqueda= [];
            }
        })
 */



        inputBuscador.addEventListener("input", ()=>{
            if(inputBuscador.value ===""){
                gruposDePalabras = [];
            }
        });




        /*   
         inputBuscador.addEventListener("change", ()=>{
                document.getElementById("contenedor-guardar-btns").classList.remove("display-none");
            });
       */



        let timeout;

            inputBuscador.addEventListener("input", function(){
                // Estilo del input según su contenido
                if (inputBuscador.value.trim() !== "") {
                    document.getElementById("contenedor-guardar-btns").classList.remove("display-none");
                    inputBuscador.classList.add("buscador-lleno");
                    inputBuscador.classList.remove("buscador-vacio");
                } else {
                    inputBuscador.classList.add("buscador-vacio");
                    inputBuscador.classList.remove("buscador-lleno");
                }
                 if (timeout) {
                    clearTimeout(timeout); // Limpiar el timeout anterior solo si existe
                }

                if(inputBuscador.value.trim().length >= 2){
                   /*   console.log("longitud: ", inputBuscador.value.trim().length); */
                    timeout = setTimeout(() => {
                        
                            /* realizarBusqueda(this.value); */
                    
                        // Limpiar y procesar texto ingresado
                        textoAcumulado = quitarTildes(inputBuscador.value.trim().toLowerCase());
                
                        // Reiniciar gruposDePalabras
                        gruposDePalabras = []; // Vaciar gruposDePalabras al actualizar el texto
                    
                        // Dividir texto en palabras y procesar cada una
                        const palabras = textoAcumulado.split(/\s+/).filter(palabra => palabra.length > 0); // Filtrar palabras vacías
                    
                        palabras.forEach(palabra => {
                            if (palabra) {
                                let grupoCoincide = false;
                    
                                // Buscar sinónimos en el arreglo de sinónimos
                            /* console.log("sinónimos desde funcion buscar: ", arregloTotal); */
                            let gruposFiltrados = arregloTotal.filter(grupo => {
                                if (grupo.includes(palabra)) {
                                    grupoCoincide = true;
                                    return true;
                                }
                            });
                
                            // Acumular grupos filtrados en gruposDePalabras
                            gruposFiltrados.forEach(grupo => gruposDePalabras.push(grupo));
                
                            // Si no se encontró coincidencia, agregar la palabra como un nuevo grupo
                            if (!grupoCoincide) {
                                gruposDePalabras.push([palabra]);
                            }
                        }
                    });
                
                
                
                        // Filtrar el JSON basándote en gruposDePalabras
                        resultadoFiltrado = dondeBuscar.filter(item => {
                            return gruposDePalabras.every(grupo => {
                                return opciones.some(opcion => {
                                    let propiedad = item[opcion];
                                    if (!propiedad) return false; // Validar que la propiedad exista
                    
                                    const opcionLower = quitarTildes(propiedad.toLowerCase());
                                    return grupo.some(palabra => opcionLower.includes(palabra));
                                });
                            });
                        });
                    
                        if(resultadoFiltrado.length == 1){
                            document.getElementById("cantidad-resultados").textContent= resultadoFiltrado.length + " resultado";
                        }else{
                            document.getElementById("cantidad-resultados").textContent= resultadoFiltrado.length + " resultados";
                        }
                        
                        // Mostrar resultados filtrados
                        imprimirResultados(resultadoFiltrado, opciones);
                    }, 800);
                }
            });
            

/* 
        inputBuscador.addEventListener("keyup", (event) => {
             if (inputBuscador.value.trim() !== "") {
              inputBuscador.classList.add("buscador-lleno");
              
              } else {
              inputBuscador.classList.remove("buscador-lleno");
              
              inputBuscador.classList.add("buscador-vacio");
              }

      



             /* (arreglo)   textoAcumulado = quitarTildes(inputBuscador.value.trim().toLowerCase());
                                      /* .split(/\s+/)
                                      .filter(palabra => palabra.length > 0);  // Filtrar palabras vacías
                                
           
         
                
            if (event.key === " ") { // Detectar si se ingresó un espacio
                const textoSinEspacios = textoAcumulado.trim(); // Eliminar espacios extras
                const palabras = textoSinEspacios.split(" "); // Dividir por palabras
                const ultimaPalabra = palabras[palabras.length - 1]; // Última palabra ingresada antes del espacio
            


                if (ultimaPalabra) {
                    // Variable auxiliar para verificar coincidencia
                    let grupoCoincide = false;
                
                    // Realizar el filtro y guardar los resultados temporalmente
                    let gruposFiltrados = arregloSinonimos.filter(grupo => {
                        if (grupo.includes(ultimaPalabra)) {
                            grupoCoincide = true;
                            console.log("se encontró un grupo coincidente");
                            return true;
                        }
                    });
                
                    // Acumular los grupos filtrados en gruposDePalabras sin sobrescribir
                    gruposFiltrados.forEach(grupo => gruposDePalabras.push(grupo));
                
                     // Si no se encontró ningún grupo coincidente, agregar un nuevo grupo
                    if (!grupoCoincide) {
                        gruposDePalabras.push([ultimaPalabra]);
                    }
                    console.log("arreglo de grupos luego de nueva palabra: ", gruposDePalabras)
                }
                



            }    
     



                resultadoFiltrado = dondeBuscar.filter(item => {
                     
                   
                    // Verificar si cada grupo de términos tiene al menos una coincidencia
                    const todasCoinciden = gruposDePalabras.every(grupo => {
                        // Revisar si algún término o sinónimo del grupo está presente en los campos seleccionados
                        return opciones.some(opcion => {
                            let propiedad = item[opcion];
                            if (!propiedad) return false; // Validar que la propiedad exista
                
                            const opcionLower = quitarTildes(propiedad.toLowerCase());
                            return grupo.some(palabra => opcionLower.includes(palabra));
                        });
                    });
                
                    // Retornamos true solo si todos los grupos tienen al menos una coincidencia
                    return todasCoinciden;
                });
                


                
                     
              imprimirResultados(resultadoFiltrado, opciones);


          }); */
      }
     
      
      
        
      /* 
       
      function extractContext(texto, busqueda, originalTexto) {
          // Encontrar la posición del término en el texto y extraer el contexto
          const index = texto.indexOf(busqueda);
          if (index === -1) return ""; // Retornar vacío si no hay coincidencia
          const contextLength = 20; // Cantidad de caracteres alrededor del término
          const start = Math.max(0, index - contextLength);
          const end = Math.min(texto.length, index + busqueda.length + contextLength);
          return originalTexto.substring(start, end); // Extraer texto original alrededor de la coincidencia
      }
      
      
   
      function resaltarTexto(texto, busqueda) {
          if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
      
          // Dividir el término de búsqueda en palabras separadas
          const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
      
          // Escapar caracteres especiales en las palabras
          const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      
          // Crear una expresión regular incluyendo todas las palabras
          const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
      
          // Reemplazar todas las coincidencias en el texto con la etiqueta <mark>
          return texto.replace(regex, "<mark>$1</mark>");
      } */
                
/*       
      
      function resaltarTexto(texto, busqueda, contexto = 100) {
        if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
    
        // Dividir el término de búsqueda en palabras separadas
        const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
    
        // Escapar caracteres especiales en las palabras
        const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
        // Crear una expresión regular incluyendo todas las palabras
        const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
    
        // Buscar las coincidencias y crear fragmentos con contexto
        let resultado = "";
        let match;
        while ((match = regex.exec(texto)) !== null) {
            const inicio = Math.max(0, match.index - contexto); // Índice inicial con contexto previo
            const fin = Math.min(texto.length, match.index + match[0].length + contexto); // Índice final con contexto posterior
    
            // Agregar el fragmento con contexto resaltado
            resultado += texto.slice(inicio, match.index); // Texto previo
            resultado += `<mark>${match[0]}</mark>`; // Coincidencia resaltada
            resultado += texto.slice(match.index + match[0].length, fin); // Texto posterior
            resultado += "..."; // Separador para fragmentos (opcional)
        }
    
        return resultado || texto; // Retornar el resultado, o el texto original si no hubo coincidencias
    }
     */
      
    

/* 
    function resaltarTexto(texto, busqueda, contexto = 100) {
        if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
    
        // Dividir el término de búsqueda en palabras separadas
        const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
    
        // Escapar caracteres especiales en las palabras
        const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
        // Crear una expresión regular incluyendo todas las palabras
        const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
    
        // Buscar las coincidencias y crear fragmentos con contexto
        let fragmentos = [];
        let match;
        while ((match = regex.exec(texto)) !== null) {
            const inicio = Math.max(0, match.index - contexto); // Índice inicial con contexto previo
            const fin = Math.min(texto.length, match.index + match[0].length + contexto); // Índice final con contexto posterior
    
            // Crear el fragmento con texto resaltado y su contexto
            const fragmento = texto.slice(inicio, match.index) + // Texto previo
                              `<mark>${match[0]}</mark>` +        // Coincidencia resaltada
                              texto.slice(match.index + match[0].length, fin); // Texto posterior
            
            fragmentos.push(fragmento); // Agregar el fragmento al arreglo
        }
    
        return fragmentos; // Retornar los fragmentos como un arreglo
    }
     */
  



    function imprimirTodo(){
         document.getElementById("cantidad-resultados").textContent= jsonGlobal.length + " resultados";
        contenedorResultados.innerHTML = ""; // Limpiar el contenedor
    
        contenedorResultados.classList.add("bg-display");

        const camposTotales = extractFields(jsonGlobal);
        


        jsonGlobal.forEach(item => {
            const h3 = document.createElement("h3");
            //muestra nombre del ente
           /*  h3.textContent = item['Label']; */
            /* h3.textContent = item['Nombre']+' '+ item['Apellido']; */
            h3.textContent = item[fields[0]];
            h3.style.color = "#91ffef";
            h3.style.fontSize = "18px";
            h3.style.marginLeft = "10px";
            h3.style.padding ="4px";
            h3.style.display ="block";
            h3.style.textAlign ="center";
            
            
            contenedorResultados.appendChild(h3);


            camposTotales.forEach((opcion) => { 
              
                if(opcion === camposTotales[0] || opcion === camposTotales[camposTotales.length-1]){
                     return;
                }     

             
                // para cada CAMPO
                 const h3 = document.createElement("h3");
                

               if(opcion === 'Web' && item[opcion]){
                    const a = document.createElement("a");
                    a.textContent = "ver sitio";
                    a.href = item[opcion].startsWith("http") ? item[opcion] : "https://" + item[opcion];
                    a.target = "_blank";
                    a.classList.add("link");
                    
                    h3.textContent = opcion + ": ";
                    
                    h3.appendChild(a);   
                    
                   
                }else{
                    
                    const textoCampo = opcion + ": "+ item[opcion];
                    h3.textContent = textoCampo;
                }
                                             
                  h3.classList.add("vistaResultado");
                  contenedorResultados.appendChild(h3);
                /* const fragmentos = resaltarTexto( item[opcion].Highlighted || item[opcion], inputBuscador.value, 400);
    
                fragmentos.forEach(fragmento => {
                    const h3 = document.createElement("h3");
                    h3.innerHTML = fragmento;
                    h3.classList.add("vistaResultado");
    
                    contenedorResultados.appendChild(h3);
 */
                   
                         
                });
            
               const hr = document.createElement("hr");
            hr.style.border = "15px solid gray";
            contenedorResultados.appendChild(hr);
                
            }); 
            
            /*  } */
            const hr = document.createElement("hr");
        
            contenedorResultados.appendChild(hr);
           
     /*    }); */
    }


    const verTodoBtn= document.querySelector("#ver-todo");

    verTodoBtn.addEventListener('click', ()=>{
         
         imprimirTodo();
        /*  saveAsCsv.classList.add("display-none");
         saveAsJson.classList.add("display-none"); */
    });




function resaltarTextoSeguro(texto, busqueda) {
    if (!busqueda || busqueda.trim().length === 0) return [document.createTextNode(texto)];

    const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(p => p.length > 0);
    const partes = [];
    let cursor = 0;

    const regex = new RegExp(`(${palabras.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

    texto.replace(regex, (match, _, index) => {
        if (cursor < index) {
            partes.push(document.createTextNode(texto.slice(cursor, index)));
        }
        const mark = document.createElement("mark");
        mark.textContent = texto.slice(index, index + match.length);
        partes.push(mark);
        cursor = index + match.length;
    });

    if (cursor < texto.length) {
        partes.push(document.createTextNode(texto.slice(cursor)));
    }

    return partes;
}


 
      
      const div = document.getElementById("contenido-completo");
    
      const volverBtn = document.getElementById("volver-btn");

     

      function mostrarContenidoCompleto(objeto, contenedor){
           
            let html = "";
            for(const[clave, valor] of Object.entries(objeto)){
                if(clave === 'id') continue;
                html += `<p class="p-contenido-completo">${clave}: ${JSON.stringify(valor, null, 2)}</p>
                        `;
                
            }
           
            contenedor.innerHTML=html;
           /*  claveOpciones.classList.add("display-none"); */
            switchBtn.classList.add("display-none");
          /*   saveAsCsv.classList.remove("display-none");
            saveAsJson.classList.remove("display-none"); */
           /*  descargarCsv.classList.add("display-none");
            descargarJson.classList.add("display-none"); */
            volverBtn.classList.remove("invisible");
            volverBtn.addEventListener("click", ()=>{
                contenedor.style.display = 'none';
                volverBtn.classList.add("invisible");
            })
        
            

            
      }
 /* */



function mostrarContenidoCompleto(objeto, contenedor) {
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar contenido

    for (const [clave, valor] of Object.entries(objeto)) {
        if (clave === 'id') continue;

        const p = document.createElement("p");
        p.classList.add("p-contenido-completo");
        p.textContent = `${clave}: ${JSON.stringify(valor, null, 2)}`;
        contenedor.appendChild(p);
    }

   /*  claveOpciones.classList.add("display-none"); */
    switchBtn.classList.add("display-none");
    /*   saveAsCsv.classList.remove("display-none");
    saveAsJson.classList.remove("display-none");
  descargarCsv.classList.add("display-none");
    descargarJson.classList.add("display-none"); */
    volverBtn.classList.remove("invisible");

    volverBtn.addEventListener("click", () => {
        contenedor.style.display = 'none';
        volverBtn.classList.add("invisible");
    });
}





function imprimirResultados(resultadoFiltrado, opciones) {
    contenedorResultados.replaceChildren(); // Limpieza segura y moderna
    contenedorResultados.classList.add("bg-display");

    resultadoFiltrado.forEach(item => {
        const h3 = document.createElement("h3");
        h3.textContent = item[fields[0]];
        h3.style.color = "#91ffef";
        h3.style.fontSize = "18px";
        h3.style.margin = "4px 0 8px 0"; 
        h3.style.textAlign = "center";
        contenedorResultados.appendChild(h3);

        const verMasBtn = document.createElement("button");
        verMasBtn.textContent = "Ver más"; 
        verMasBtn.classList.add("ver-mas"); 
        contenedorResultados.appendChild(verMasBtn); 

        verMasBtn.addEventListener("click", function () {
            div.style.display = "block";
            mostrarContenidoCompleto(item, div); 
        });

        opciones.forEach(opcion => {
            const textoOriginal = item[opcion].Highlighted || item[opcion];
            const nodos = resaltarTextoSeguro(textoOriginal, inputBuscador.value);

            const h3 = document.createElement("h3");
            h3.classList.add("vistaResultado");

            nodos.forEach(nodo => h3.appendChild(nodo));
            contenedorResultados.appendChild(h3);
        });

        const hr = document.createElement("hr"); 
        hr.style.border = "15px solid gray";
        contenedorResultados.appendChild(hr);
    });
}




let fields = [];
      
      
      function extractFields(data) {
          /* let fields = []; */
          if (Array.isArray(data)) {
            // Si es un array, obtiene los campos del primer objeto
            fields = Object.keys(data[0] || {});
          } else if (typeof data === "object") {
            // Si es un objeto, obtiene las claves directamente
            fields = Object.keys(data);
          }
          return fields;
        }
      
        
        const fieldsContainer = document.getElementById("fieldsContainer");
        const button = document.getElementById("fijarCampos"); // Crear botón
      
        function displayFields(fields, userJSON) {
          
           fields.pop();
          
           fieldsContainer.innerHTML = ""; 
         
      
          fields.forEach(field => {
              const label = document.createElement("label");
              const checkbox = document.createElement("input");
              const span = document.createElement("span");

              checkbox.type = "checkbox";
              
              checkbox.value = field;
              span.textContent = field;
              label.appendChild(checkbox);
              label.appendChild(span);

             /*  label.appendChild(document.createTextNode(field)); */
              fieldsContainer.appendChild(label);
              fieldsContainer.appendChild(document.createElement("br"));
              label.classList.add("opciones-check");
      
         
              // Escuchar cambios en los checkboxes
              checkbox.addEventListener("change", () => {
                  
                  // Verificar si al menos un checkbox está marcado
                  const anyChecked = Array.from(fieldsContainer.querySelectorAll("input[type='checkbox']"))
                                          .some(input => input.checked);
                  button.style.animationPlayState = anyChecked ? "running" : "paused"; 
                  button.disabled = !anyChecked;
                  inputBuscador.disabled = anyChecked;
      
                      // Acción específica para cuando un checkbox se desmarca
                  if (!checkbox.checked) {
                     inputBuscador.disabled = true;
                     button.innerHTML=`Fijar Campos`;
                     button.classList.add("animationBtn"); 

                  }
              });
          });
      
          fieldsContainer.appendChild(button);
          button.style.visibility = "visible";
          button.style.animationPlayState = "paused";
          
      
          // Asociar el evento click al botón
          button.addEventListener("click", () => {
             button.classList.remove("animationBtn"); 
             fijarCampos(userJSON);
             document.getElementById("cantidad-resultados").textContent =" ";
          /*    saveAsCsv.classList.remove("display-none");
             saveAsJson.classList.remove("display-none"); */
          });
      }
      
      
      
      
      
      
      function fijarCampos(userJSON){
      
        /*   inputBuscador.scrollIntoView({ behavior: 'smooth' }); */
      
          button.innerHTML =`Campos fijados`;
          let opciones = capturarSeleccionados();
          
          if(opciones.length > 0){
               inputBuscador.style.opacity="1";
              inputBuscador.disabled = false; 
              inputBuscador.placeholder ="Buscar por términos clave..."; 
      
              buscar(inputBuscador, userJSON, opciones);
          }/* else{
          alert("no se fijó ningún campo");
          }
           */
      
          fieldsContainer.addEventListener("change", (e)=>{
              if(e.target.checked){
                  button.classList.add("animationBtn");
                  button.innerHTML =`Fijar campos`;
          }else{
              inputBuscador.style.opacity="1";
              inputBuscador.disabled = true; 
              inputBuscador.placeholder ="Seleccionar Campos";
          }
      });
      }
      
      
      
      
        function inicioBuscador(userJSON){
  
           //  EXTRAEMOS LOS CAMPOS DEL JSON
           const fields = extractFields(userJSON);
           //  MOSTRAMOS LA LISTA DE CAMPOS DISPONIBLES PARA BÚSQUEDAS FUTURAS
           displayFields(fields, userJSON);
      
          
        }
      
      
      
      
      
      
      function capturarSeleccionados() {
        const seleccionados = document.querySelectorAll("#fieldsContainer input[type='checkbox']:checked");
        const valoresSeleccionados = Array.from(seleccionados).map(checkbox => checkbox.value);
      
      
        return valoresSeleccionados;
        
      }
      
      
      
      // Añadir el manejador de eventos `wheel` con la opción pasiva para evitar el error de rendimiento
      document.addEventListener("wheel", function(e) {
      // Tu código aquí, si es necesario
      }, { passive: true });

      

      //----------------------  INTEGRACIÓN DE LISTAS DE SINÓNIMOS  -------------------------------------------


     /*  let diccionarioSinonimos = {}; // Diccionario */
      const btnAgregar = document.getElementById("btn-agregar");
    /*   let arreglo = [];   */    
      let arregloTotal = [];
      const listaSinonimos = document.getElementById("listaSinonimos");
    

      // Función para mostrar sinónimos y permitir edición
      function mostrarSinónimos(arregloTotal) {
          listaSinonimos.innerHTML = ""; // Reseteamos la lista
      
          arregloTotal.forEach((grupo, index) => {
              const li = document.createElement("li");
      
              // Crear un campo de entrada editable
              const inputEditor = document.createElement("input");
              inputEditor.type = "text";
              inputEditor.value = grupo.join(", "); // Mostrar los valores como texto
              inputEditor.size = 40;
              inputEditor.disabled = true;
      
              // Botón para habilitar la edición y eliminación
              const btnEditar = document.createElement("button");
                
               // Botón para eliminaar grupo de términos
               const botonEliminar = document.createElement("button");
             /*   botonEliminar.style.backgroundColor="transparent";
               botonEliminar.style.color="white";
               botonEliminar.style.margin="0 10px"; */
               
               botonEliminar.style.display="inline-block";
               botonEliminar.textContent = "Eliminar";
              

              btnEditar.textContent = "Editar";
              btnEditar.onclick = function () {
                inputEditor.dataset.originalValue = inputEditor.value; // Guarda el valor original
                inputEditor.disabled = false;  // Habilita la edición
                inputEditor.focus();  // Enfoca el inputEditor
                btnEditar.style.display = "none";  // Oculta el botón de edición
                botonGuardar.style.display = "inline-block";  // Muestra el botón de guardar
                botonGuardar.classList.add("animationBtn");
                
              /*   botonGuardar.style.backgroundColor="var(--morado-color)"; */
            };
            

                // Detectar la tecla "Esc" mientras el inputEditor está activo
                inputEditor.addEventListener("keydown", function (event) {
                    if (event.key === "Escape") { // Si el usuario presiona "Esc"
                        inputEditor.value = inputEditor.dataset.originalValue; // Restaura el valor original
                        inputEditor.disabled = true;  // Deshabilita el inputEditor
                        btnEditar.style.display = "inline-block";  // Vuelve a mostrar el botón de edición
                        botonGuardar.style.display = "none";  // Oculta el botón de guardar
                    }
                });

               // Botón para guardar cambios
              const botonGuardar = document.createElement("button");

              botonGuardar.textContent = "Guardar";
             
              botonGuardar.style.display = "none";
              botonGuardar.onclick = function () {
                  arregloTotal[index] = inputEditor.value.split(",").map(s => s.trim()); // Actualiza el arreglo
                  botonGuardar.style.display="none";
                  btnEditar.style.display="inline-block";
                  inputEditor.disabled = true;  // Deshabilita la edición
                  mostrarSinónimos(arregloTotal);

              };
      

            

             
               botonEliminar.onclick = function () {
                   arregloTotal.splice(index, 1);
                
                   botonEliminar.style.display="none";
                 
                   inputEditor.disabled = true;  // Deshabilita la eliminación
                  mostrarSinónimos(arregloTotal);
 
               };

              const modal = document.createElement("div");
              modal.classList.add("modal");
              modal.textContent = inputEditor.value;
             /*  modal.textContent= inputEditor.value;
              modal.classList.add("modal");
              modal.style.display = "none"; */
/* 
              inputEditor.addEventListener("mouseover", ()=>{

                modal.style.display = "block";
              });
 */
        
              inputEditor.addEventListener("mouseenter", ()=>{
               /*  if (document.activeElement === inputEditor) return; // Si ya está en foco, no mostrar el modal */
                if (!inputEditor | document.activeElement === inputEditor) return;
                
               
                modal.style.display = "block";
               /*  modal.style.left = `${event.clientX}px`;
                modal.style.top = `${event.clientY + 10}px`; */
              });



              inputEditor.addEventListener("mouseleave", ()=>{
                modal.style.display = "none";
              });

              li.appendChild(modal);
              li.appendChild(inputEditor);
              li.appendChild(botonEliminar);
              li.appendChild(btnEditar);
              li.appendChild(botonGuardar);
              
              listaSinonimos.appendChild(li);
          });
      }





const sinonimos = document.getElementById("sinonimos");

sinonimos.addEventListener("keyup", function(){
    
    if(sinonimos.value.trim() ===""){ // si se borra TODO el texto ingresado
        this.style.background="transparent";
    }else{
     /*    this.style.fontSize="28px";
        this.style.color="black";
        this.style.background="white";
        this.style.paddingLeft="20px"; */
        this.classList.add("sinonimos-input");
    }
 
});

     

// Detectar la tecla "Esc" mientras el input está activo
sinonimos.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { // Si el usuario presiona "Esc"
        sinonimos.value = "";
      
       
    }
});




btnAgregar.addEventListener("click", (e)=>{
        let sinonimosInput = sinonimos.value.trim();
        let arreglo=[];
        

        if (sinonimosInput.length > 0) {
            arreglo= sinonimosInput.toLowerCase().split(",").map(s => s.trim());
           
            arregloTotal.push(arreglo);

            mostrarSinónimos(arregloTotal);

            sinonimos.value = ""; 
            /* console.log(arregloTotal); */
   
           
        }

        
      });





//-----------  CARGA DE JSON DE SINÓNIMOS ---------------------

const agregarTerminos=document.getElementById("agregar-terminos");

agregarTerminos.addEventListener("click", ()=>{
    formularioSinonimos.style.display ="block"; 
    sinonimos.focus();
    agregarTerminos.classList.add("display-none");
  });


  document.getElementById("inputJson").addEventListener("change", function(event) {
   
    const archivo = event.target.files[0]; // .json

    document.getElementById("file-label").textContent= archivo.name;
   
    
    if (this.files.length > 0) {
        arregloTotal = [];
        this.disabled = true; // Deshabilita el input después de seleccionar un archivo
        document.getElementById("file-label").style.pointerEvents ="none";
        document.getElementById("reset-btn").classList.remove("display-none");
        document.getElementById("reset-btn").style.borderColor ="#91ffef";
        agregarTerminos.classList.remove("display-none");
     /*    if(agregarTerminos.classList.contains("display-none")){
            agregarTerminos.classList.remove("display-none");
          }else{
              agregarTerminos.classList.add("display-none");
          } */
    /*     document.getElementById("agregar-terminos").classList.remove("display-none"); */
    }
   

    document.getElementById("reset-btn").addEventListener("click", function() {
        document.getElementById("file-label").style.pointerEvents ="auto";
        document.getElementById("inputJson").disabled = false; // Habilita de nuevo el input
        document.getElementById("inputJson").value ="";  // LIMPIAMOS el input file para que acepte el mismo archivo anterior
        document.getElementById("file-label").textContent = "Cargar otro archivo (.json)"; // Borra el valor del input
        
        document.getElementById("reset-btn").classList.add("display-none");
    });

   


    if (archivo) {
      const lector = new FileReader();
      
      lector.onload = function(e) {
        
        try {
            // "arregloTotal" ya es un arreglo de arreglos
           arregloTotal = JSON.parse(e.target.result); 
           mostrarSinónimos(arregloTotal); // mostramos el contenido del archivo importado
           console.log("JSON cargado:", arregloTotal); // Aquí podrías usar los datos en tu app

        } catch (error) {
          console.error("Error: No es un JSON válido", error);
        }
      };

      lector.readAsText(archivo);
    }
  });



  function descargarComoJSON() {
    const nombreArchivo = document.getElementById("nombreArchivoSinonimos");
    
  if (!nombreArchivo.value.trim()) {
        
        alert("Debe ingresar un nombre para el archivo.");
        return;
    } 

    const dataStr = JSON.stringify(arregloTotal, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo.value.trim() + ".json"; // Se usa el nombre ingresado por el usuario
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    nombreArchivo.style.backgroundColor="initial";
}



    
        function descargarComoCSV() {
            let csv = "término,sinónimos\n";
            for (const termino in sinonimos) {
                csv += `${termino},${sinonimos[termino].join(",")}\n`;
            }
            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "sinonimos.csv";
            link.click();
        }



        // ------------------------ DESCARGAR PDF -------------------------------------------------------

 /*  const { jsPDF } = window.jspdf;

  document.getElementById("btnGuardar").addEventListener("click", () => {
     const datos = [
      { nombre: "Juan", edad: 32, ciudad: "Mendoza" },
      { nombre: "Laura", edad: 28, ciudad: "Córdoba" }
    ]; 

    const camposSeleccionados = ["nombre", "edad", "ciudad"];

    const doc = new jsPDF();
    let y = 10;
  const claves = clavesJsonElegidas();
    datosFiltrados.forEach(registro => { 
      claves.forEach(campo => {
        const valor = registro[campo] ?? "—";
        console.log("campo: "+ campo + "valor: " + valor);
        doc.text(`${campo}: ${valor}`, 10, y);
        y += 7;
      });

      // Línea de separación
      doc.line(10, y, 200, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
     }); 

    doc.save("resultados.pdf");
  }); */