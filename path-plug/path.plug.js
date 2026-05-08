var se=Object.defineProperty;var T=(e,t)=>{for(var n in t)se(e,n,{get:t[n],enumerable:!0})};function le(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function z(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var _r=new Uint8Array(16),ce=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(a=>({...a,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(i){console.warn("Could not post logs to server",i.message),this.logBuffer.unshift(...o)}}}},H;function de(e=""){return H=new ce(e),H}var L=e=>{throw new Error("Not initialized yet")},R=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",U=new Map,B=0;R&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{B++,U.set(B,{resolve:n,reject:o}),L({type:"sys",id:B,name:e,args:t})}));function V(e,t,n){R&&(L=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let a=e[i.name];if(!a)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(a(...i.args||[]));L({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),L({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let a=i.id,s=U.get(a);if(!s)throw Error("Invalid request id");U.delete(a),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),L({type:"manifest",manifest:t}),de(`[${t.name} plug]`))}async function ue(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?z(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function me(){globalThis.fetch=async(e,t)=>{let n=t?.body?z(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await ue(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?le(o.base64Body):null,{status:o.status,headers:o.headers})}}R&&me();var u={};T(u,{alert:()=>Ye,configureVimMode:()=>pt,confirm:()=>Ge,copyToClipboard:()=>st,deleteLine:()=>lt,dispatch:()=>We,downloadFile:()=>Be,filterBox:()=>je,flashNotification:()=>Re,fold:()=>Xe,foldAll:()=>rt,getCurrentEditor:()=>ye,getCurrentPage:()=>pe,getCurrentPageMeta:()=>fe,getCurrentPath:()=>ge,getCursor:()=>xe,getRecentlyOpenedPages:()=>he,getSelection:()=>Pe,getText:()=>be,getUiOption:()=>Je,goHistory:()=>De,hidePanel:()=>Ne,insertAtCursor:()=>qe,insertAtPos:()=>He,invokeCommand:()=>ke,isMobile:()=>gt,moveCursor:()=>Ve,moveCursorToLine:()=>Ie,moveLineDown:()=>ut,moveLineUp:()=>dt,navigate:()=>Ce,newWindow:()=>_e,openCommandPalette:()=>Me,openPageNavigator:()=>Ae,openSearchPanel:()=>at,openUrl:()=>Fe,prompt:()=>Qe,rebuildEditorState:()=>Ee,redo:()=>it,reloadConfigAndCommands:()=>$e,reloadPage:()=>Te,reloadUI:()=>Le,replaceRange:()=>ze,save:()=>Se,sendMessage:()=>ft,setSelection:()=>we,setText:()=>ve,setUiOption:()=>Ze,showPanel:()=>Ke,showProgress:()=>Oe,toggleComment:()=>ct,toggleFold:()=>tt,undo:()=>ot,unfold:()=>et,unfoldAll:()=>nt,uploadFile:()=>Ue,vimEx:()=>mt});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function pe(){return r("editor.getCurrentPage")}function fe(){return r("editor.getCurrentPageMeta")}function ge(){return r("editor.getCurrentPath")}function he(){return r("editor.getRecentlyOpenedPages")}function ye(){return r("editor.getCurrentEditor")}function be(){return r("editor.getText")}function ve(e,t=!1){return r("editor.setText",e,t)}function xe(){return r("editor.getCursor")}function Pe(){return r("editor.getSelection")}function we(e,t){return r("editor.setSelection",e,t)}function ke(e,t){return r("editor.invokeCommand",e,t)}function Se(){return r("editor.save")}function Ce(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function Ae(e="page"){return r("editor.openPageNavigator",e)}function Me(){return r("editor.openCommandPalette")}function Te(){return r("editor.reloadPage")}function Le(){return r("editor.reloadUI")}function Ee(){return r("editor.rebuildEditorState")}function $e(){return r("editor.reloadConfigAndCommands")}function Fe(e,t=!1){return r("editor.openUrl",e,t)}function _e(){return r("editor.newWindow")}function De(e){return r("editor.goHistory",e)}function Be(e,t){return r("editor.downloadFile",e,t)}function Ue(e,t){return r("editor.uploadFile",e,t)}function Re(e,t="info"){return r("editor.flashNotification",e,t)}function je(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Ke(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function Ne(e){return r("editor.hidePanel",e)}function Oe(e,t){return r("editor.showProgress",e,t)}function He(e,t){return r("editor.insertAtPos",e,t)}function ze(e,t,n){return r("editor.replaceRange",e,t,n)}function Ve(e,t=!1){return r("editor.moveCursor",e,t)}function Ie(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function qe(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function We(e){return r("editor.dispatch",e)}function Qe(e,t=""){return r("editor.prompt",e,t)}function Ge(e){return r("editor.confirm",e)}function Ye(e){return r("editor.alert",e)}function Je(e){return r("editor.getUiOption",e)}function Ze(e,t){return r("editor.setUiOption",e,t)}function Xe(){return r("editor.fold")}function et(){return r("editor.unfold")}function tt(){return r("editor.toggleFold")}function rt(){return r("editor.foldAll")}function nt(){return r("editor.unfoldAll")}function ot(){return r("editor.undo")}function it(){return r("editor.redo")}function at(){return r("editor.openSearchPanel")}function st(e){return r("editor.copyToClipboard",e)}function lt(){return r("editor.deleteLine")}function ct(){return r("editor.toggleComment")}function dt(){return r("editor.moveLineUp")}function ut(){return r("editor.moveLineDown")}function mt(e){return r("editor.vimEx",e)}function pt(){return r("editor.configureVimMode")}function ft(e,t){return r("editor.sendMessage",e,t)}function gt(){return r("editor.isMobile")}var v={};T(v,{deleteDocument:()=>Lt,deleteFile:()=>Ut,deletePage:()=>kt,fileExists:()=>Rt,getDocumentMeta:()=>At,getFileMeta:()=>Dt,getPageMeta:()=>bt,listDocuments:()=>Ct,listFiles:()=>Et,listPages:()=>yt,listPlugs:()=>St,pageExists:()=>vt,readDocument:()=>Mt,readFile:()=>$t,readFileWithMeta:()=>_t,readPage:()=>xt,readPageWithMeta:()=>Pt,readRef:()=>Ft,writeDocument:()=>Tt,writeFile:()=>Bt,writePage:()=>wt});function yt(){return r("space.listPages")}function bt(e){return r("space.getPageMeta",e)}function vt(e){return r("space.pageExists",e)}function xt(e){return r("space.readPage",e)}function Pt(e){return r("space.readPageWithMeta",e)}function wt(e,t){return r("space.writePage",e,t)}function kt(e){return r("space.deletePage",e)}function St(){return r("space.listPlugs")}function Ct(){return r("space.listDocuments")}function At(e){return r("space.getDocumentMeta",e)}function Mt(e){return r("space.readDocument",e)}function Tt(e,t){return r("space.writeDocument",e,t)}function Lt(e){return r("space.deleteDocument",e)}function Et(){return r("space.listFiles")}function $t(e){return r("space.readFile",e)}function Ft(e){return r("space.readRef",e)}function _t(e){return r("space.readFileWithMeta",e)}function Dt(e){return r("space.getFileMeta",e)}function Bt(e,t){return r("space.writeFile",e,t)}function Ut(e){return r("space.deleteFile",e)}function Rt(e){return r("space.fileExists",e)}var E={};T(E,{cleanDatabases:()=>Gt,getBaseURI:()=>It,getConfig:()=>Wt,getMode:()=>zt,getURLPrefix:()=>Vt,getVersion:()=>qt,invokeCommand:()=>Kt,invokeFunction:()=>jt,listCommands:()=>Nt,listSyscalls:()=>Ot,reloadPlugs:()=>Ht,wipeClient:()=>Qt});function jt(e,...t){return r("system.invokeFunction",e,...t)}function Kt(e,t){return r("system.invokeCommand",e,t)}function Nt(){return r("system.listCommands")}function Ot(){return r("system.listSyscalls")}function Ht(){return r("system.reloadPlugs")}function zt(){return r("system.getMode")}function Vt(){return r("system.getURLPrefix")}function It(){return r("system.getBaseURI")}function qt(){return r("system.getVersion")}function Wt(e,t=void 0){return r("system.getConfig",e,t)}function Qt(e=!1){return r("system.wipeClient",e)}function Gt(){return r("system.cleanDatabases")}var Ir=new Uint8Array(16);var w={};T(w,{evalExpression:()=>lr,parse:()=>ar,parseExpression:()=>sr});function ar(e){return r("lua.parse",e)}function sr(e){return r("lua.parseExpression",e)}function lr(e){return r("lua.evalExpression",e)}var A={};T(A,{deleteObject:()=>hr,ensureFullIndex:()=>fr,getObjectByRef:()=>pr,indexObjects:()=>dr,queryLuaObjects:()=>mr,reindexSpace:()=>gr,validateObjects:()=>ur});function dr(e,t){return r("index.indexObjects",e,t)}function ur(e,t){return r("index.validateObjects",e,t)}function mr(e,t,n){return r("index.queryLuaObjects",e,t,n)}function pr(e,t,n){return r("index.getObjectByRef",e,t,n)}function fr(){return r("index.ensureFullIndex")}function gr(){return r("index.reindexSpace")}function hr(e,t,n){return r("index.deleteObject",e,t,n)}var D=!1,I=!1,q=!1,G=new Set(["tags","itags","asTag","lastModified","pageDecoration","title"]),W={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date",file_type:"File type",related_cpd:"Related CPD",related_claims:"Related claims"},yr={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",paths:"Path slugs this contributes to (e.g. uol-professor, advance-he-d4)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"criterion codes from the Path's framework that this addresses (e.g. 1.1, 2.3)",related_cpd:"[[wikilinks]] to CPD entries this evidence supports",related_claims:"[[wikilinks]] to claims this evidence supports",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},br={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed","abandoned"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"]},vr={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"],file_type:["pdf","image","email","video","web","other"]};function xr(e,t){return e==="status"?br[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:vr[e]??null}function Q(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function Y(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),i=n+4;e[i]===`
`&&i++;let a=[],s=null;for(let d of o.split(`
`)){let y=d.trim();if(y===""||y.startsWith("#")){s&&s.cont.push(d);continue}if(!d.startsWith(" ")&&!d.startsWith("	")){let m=d.match(/^([\w-]+):\s*(.*)$/);if(m){s&&a.push(s),s={key:m[1],headerValue:m[2],cont:[]};continue}}s&&s.cont.push(d)}s&&a.push(s);let c=[];for(let d of a){if(d.headerValue.trim()!==""){c.push({key:d.key,value:Q(d.headerValue),isList:!1});continue}let y=d.cont.filter(b=>b.trim()!==""&&!b.trim().startsWith("#"));if(y.length===0){c.push({key:d.key,value:[],isList:!0});continue}let m=/^(\s+)-\s+(.*)$/;if(y.every(b=>{let h=b.match(m);return h?!/:\s/.test(h[2]):!1})){let b=y.map(h=>Q(h.match(m)[2]));c.push({key:d.key,value:b,isList:!0})}else c.push({key:d.key,value:[],isList:!0,complex:!0,raw:d.cont.join(`
`)})}return{fields:c,rest:e.substring(i),fmStart:t,fmEnd:n}}function j(e){if(W[e])return W[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function Pr(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!G.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let s of o.value)n.push(`  - ${_(s)}`)}else n.push(`${o.key}: ${_(o.value)}`);continue}let a=t[o.key]??"";if(o.isList){let s=a.split(",").map(c=>c.trim()).filter(c=>c.length>0);n.push(`${o.key}:`);for(let c of s)n.push(`  - ${_(c)}`)}else n.push(`${o.key}: ${_(a.trim())}`)}return n.join(`
`)}function wr(e){let t=e.split("/").pop()||e;return(t.replace(/^\d{4}-\d{2}-\d{2}-?/,"")||t).replace(/[-_]/g," ").replace(/\b(\p{L})/gu,o=>o.toUpperCase())}async function kr(){try{let e=await w.parseExpression('p.type == "path"'),t=await A.queryLuaObjects("page",{objectVariable:"p",where:e})??[],n=[];for(let o of t){let a=(o?.name??"").replace(/^paths\//,"");!a||a.endsWith("-coverage")||n.push({slug:a,title:o?.title||a,framework:o?.framework||""})}return n.sort((o,i)=>o.title.localeCompare(i.title)),n}catch(e){return console.error("fetchAllPaths failed",e),[]}}async function Sr(e){if(!e)return[];try{let t=await w.parseExpression('c.type == "criterion" and c.framework == framework'),n=await A.queryLuaObjects("page",{objectVariable:"c",where:t},{framework:e})??[],o=[];for(let i of n){let a=i?.code||"";a&&o.push({code:a,title:i?.title||""})}return o.sort((i,a)=>i.code.localeCompare(a.code)),o}catch(t){return console.error("fetchCriteriaForFramework failed",t),[]}}async function Cr(e){try{let t=await w.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await w.parseExpression("l.pageLastModified"),o=await A.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],i=new Set,a=[];for(let s of o){let c=s?.page??"";!c||i.has(c)||(i.add(c),a.push({ref:s?.ref??c,pageName:c}))}return a}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}function Ar(e,t,n=[],o=[],i=!1,a={allPaths:[],criteria:[]}){let s=[],c=[],d=t.find(l=>l.key==="type")?.value??"";for(let l of t){if(G.has(l.key)||l.complex)continue;if(l.key==="type"){s.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${p(l.value)}</span></div></div>`);continue}let N=l.isList?l.value.join(", "):l.value;if(l.isList&&(l.key==="paths"||l.key==="standards")){let S=l.key==="paths"?a.allPaths.map(g=>({value:g.slug,label:g.title})):a.criteria.map(g=>({value:g.code,label:g.title?`${g.code} \u2014 ${g.title}`:g.code}));if(S.length>0){let g=p(j(l.key)),P=l.value.filter(C=>C&&C.trim()),oe=new Set(P),ie=P.join(","),ae=S.map(C=>`<label class="multi-opt">
            <input type="checkbox" data-multi-key="${p(l.key)}" value="${p(C.value)}"${oe.has(C.value)?" checked":""}>
            <span class="multi-opt-label">${p(C.label)}</span>
          </label>`).join("");s.push(`<div class="row"><div class="k">${g}</div><input type="hidden" id="f-${l.key}" data-key="${l.key}" value="${p(ie)}"><div class="multi-list">${ae}</div></div>`),c.push({key:l.key,list:l.isList});continue}}let O=xr(l.key,d);if(O){let S=p(j(l.key)),g=['<option value="">\u2014</option>',...O.map(P=>`<option value="${p(P)}"${N===P?" selected":""}>${p(P)}</option>`)].join("");s.push(`<div class="row"><label class="k" for="f-${l.key}">${S}</label><select class="field" id="f-${l.key}" data-key="${l.key}">${g}</select></div>`)}else{let S=p(j(l.key))+(l.isList?' <span class="hint">(comma-separated)</span>':""),g=yr[l.key],P=g?`<div class="field-hint">${p(g)}</div>`:"";s.push(`<div class="row"><label class="k" for="f-${l.key}">${S}</label><input class="field" id="f-${l.key}" data-key="${l.key}" value="${p(N)}">${P}</div>`)}c.push({key:l.key,list:l.isList})}let y=t.length===0||s.length===0?"":`
    <details class="section" data-section="attrs">
      <summary class="section-summary">
        <h2>Page attributes</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <div class="section-actions"><button class="btn" id="btn-save">Save</button></div>
        <div class="attrs">${s.join("")}</div>
      </div>
    </details>`,m=Tr(n),f=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(l=>`<li class="mention" data-page="${p(l.pageName)}"><div class="mention-ref">${p(wr(l.pageName))}</div></li>`).join("")}</ul>
      </div>
    </details>`,h=`
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; background: #f8fafc; margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  .panel { padding: 1.3em 1.1em; color: #1f2937; }
  .section { margin-bottom: 1.4em; }
  .section:last-child { margin-bottom: 0; }
  .section > summary { list-style: none; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; gap: 0.6em; padding: 0.25em 0; }
  .section > summary::-webkit-details-marker { display: none; }
  .section h2 { font-size: 0.74em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 0.5em; }
  .section .count { background: #eef2ff; color: #4338ca; border-radius: 999px; padding: 0.05em 0.55em; font-size: 0.85em; font-weight: 500; letter-spacing: 0; text-transform: none; }
  .chev { color: #9ca3af; font-size: 0.9em; transition: transform 0.15s ease; }
  .section[open] > summary .chev { transform: rotate(180deg); }
  .section-body { padding-top: 0.85em; }
  .section-actions { display: flex; justify-content: flex-end; margin-bottom: 0.7em; }
  .mentions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5em; }
  .mention { padding: 0.45em 0.55em; border-radius: 4px; cursor: pointer; line-height: 1.4; }
  .mention:hover { background: #eef2ff; }
  .mention-ref { font-size: 0.92em; color: #2563eb; font-weight: 500; word-break: break-word; }
  .mention:hover .mention-ref { color: #1d4ed8; }
  .mention-snip { font-size: 0.82em; color: #6b7280; margin-top: 0.2em; line-height: 1.45; }
  .btn { background: #4f46e5; color: white; border: none; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn:hover { background: #4338ca; }
  .btn:disabled { opacity: 0.5; cursor: wait; }
  .attrs { display: flex; flex-direction: column; gap: 0.95em; }
  .row { display: flex; flex-direction: column; gap: 0.3em; }
  .k { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 500; }
  .hint { text-transform: none; letter-spacing: 0; font-style: italic; opacity: 0.7; font-weight: 400; }
  .v { font-size: 0.95em; color: #111827; word-break: break-word; line-height: 1.45; }
  .field { width: 100%; padding: 0.45em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.92em; font-family: inherit; color: #111827; background: white; }
  .field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.15); }
  select.field { cursor: pointer; }
  .field-hint { font-size: 0.74em; color: #6b7280; margin-top: 0.22em; font-style: italic; }
  .multi-list { display: flex; flex-direction: column; gap: 0.32em; padding: 0.5em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; max-height: 220px; overflow-y: auto; background: white; }
  .multi-opt { display: flex; align-items: center; gap: 0.5em; cursor: pointer; line-height: 1.3; padding: 0.15em 0.1em; border-radius: 3px; }
  .multi-opt:hover { background: #eef2ff; }
  .multi-opt input[type="checkbox"] { cursor: pointer; flex-shrink: 0; accent-color: #4f46e5; }
  .multi-opt-label { font-size: 0.9em; color: #1f2937; word-break: break-word; }
  html[data-theme="dark"] .multi-list { background: #1e293b; border-color: #475569; }
  html[data-theme="dark"] .multi-opt:hover { background: rgba(79, 70, 229, 0.18); }
  html[data-theme="dark"] .multi-opt-label { color: #f1f5f9; }
  .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 0.2em 0.65em; border-radius: 5px; font-size: 0.82em; font-weight: 500; text-transform: capitalize; letter-spacing: 0.02em; }
  .empty { color: #6b7280; font-size: 0.9em; font-style: italic; }
  .toc { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3em; }
  .toc-item { font-size: 0.9em; color: #1f2937; cursor: pointer; padding: 0.25em 0.4em; border-radius: 3px; line-height: 1.4; }
  .toc-item:hover { background: #eef2ff; color: #3730a3; }
  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .section h2, html[data-theme="dark"] .k { color: #94a3b8; }
  html[data-theme="dark"] .v { color: #f1f5f9; }
  html[data-theme="dark"] .badge { background: #312e81; color: #c7d2fe; }
  html[data-theme="dark"] .empty { color: #94a3b8; }
  html[data-theme="dark"] .field { background: #1e293b; border-color: #475569; color: #f1f5f9; }
  html[data-theme="dark"] select.field { background: #1e293b; color-scheme: dark; }
  html[data-theme="dark"] .field-hint { color: #94a3b8; }
  html[data-theme="dark"] .toc-item { color: #e2e8f0; }
  html[data-theme="dark"] .toc-item:hover { background: #1e293b; color: #c7d2fe; }
  html[data-theme="dark"] .chev { color: #64748b; }
  html[data-theme="dark"] .count { background: #312e81; color: #c7d2fe; }
  html[data-theme="dark"] .mention:hover { background: #1e293b; }
  html[data-theme="dark"] .mention-ref { color: #60a5fa; }
  html[data-theme="dark"] .mention:hover .mention-ref { color: #93c5fd; }
  html[data-theme="dark"] .mention-snip { color: #94a3b8; }
  .section-danger { margin-top: 2.5em; padding-top: 1.2em; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; }
  .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.45em 1em; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; font-family: inherit; transition: background 0.12s, color 0.12s; }
  .btn-danger:hover { background: #fee2e2; color: #991b1b; }
  html[data-theme="dark"] .section-danger { border-top-color: #1e293b; }
  html[data-theme="dark"] .btn-danger { color: #fca5a5; border-color: #7f1d1d; }
  html[data-theme="dark"] .btn-danger:hover { background: #450a0a; color: #fecaca; }
</style>
<div id="panel" class="panel">
  ${m}
  ${y}
  ${f}
  ${i?"":`
    <div class="section section-danger">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
</div>
`,M=JSON.stringify(c),k=JSON.stringify(e),x=`
(function() {
  var FIELDS = ${M};
  var PAGE = ${k};

  // Sync data-theme with the parent (theme toggle changes propagate live).
  try {
    var parentHtml = window.parent.document.documentElement;
    var sync = function() {
      var theme = parentHtml.getAttribute('data-theme') || '';
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      else document.documentElement.removeAttribute('data-theme');
    };
    sync();
    new MutationObserver(sync).observe(parentHtml, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  // Multi-select checkboxes: keep the hidden input's comma-joined
  // value in sync with which boxes are ticked. The save handler reads
  // f-<key> the same way for plain inputs, dropdowns, and these.
  document.querySelectorAll('input[type="checkbox"][data-multi-key]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var key = cb.getAttribute('data-multi-key');
      var hidden = document.getElementById('f-' + key);
      if (!hidden) return;
      var checked = Array.prototype.slice.call(
        document.querySelectorAll('input[type="checkbox"][data-multi-key="' + key + '"]:checked')
      ).map(function(c) { return c.value; });
      hidden.value = checked.join(',');
    });
  });

  var saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      saveBtn.disabled = true;
      try {
        var values = {};
        FIELDS.forEach(function(f) {
          var inp = document.getElementById('f-' + f.key);
          if (inp) values[f.key] = inp.value;
        });
        await syscall('system.invokeFunction', 'path.saveAttributes', PAGE, values);
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Save failed: ' + msg); } catch (_) {}
      } finally {
        saveBtn.disabled = false;
      }
    });
  }

  // ToC clicks: scroll the editor to the heading's line.
  document.querySelectorAll('.toc-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var line = parseInt(el.getAttribute('data-line'), 10);
      if (!isNaN(line)) {
        try {
          await syscall('editor.moveCursorToLine', line + 1, 0, true);
        } catch (e) {
          try { await syscall('editor.moveCursorToLine', line + 1); } catch (_) {}
        }
      }
    });
  });

  // Delete button: confirm by typing DELETE (case-insensitive), then
  // delete via syscall and navigate home. SB's space.deletePage removes
  // the file from disk; there's no trash bin, so the confirmation has
  // to be deliberate but doesn't need to be onerous.
  var deleteBtn = document.getElementById('btn-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async function() {
      var typed = window.prompt(
        'Delete "' + PAGE + '"?\\n\\nType DELETE to confirm.'
      );
      if (typed === null) return;
      if (typed.trim().toUpperCase() !== 'DELETE') {
        try { await syscall('editor.flashNotification', 'Confirmation did not match \u2014 page not deleted.', 'error'); } catch (_) {}
        return;
      }
      try {
        await syscall('space.deletePage', PAGE);
        try { await syscall('editor.flashNotification', 'Page deleted.'); } catch (_) {}
        try { await syscall('editor.navigate', 'index'); } catch (_) {}
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Delete failed: ' + msg, 'error'); } catch (_) {}
      }
    });
  }

  // Linked-mention clicks: navigate to the mentioning page.
  document.querySelectorAll('.mention').forEach(function(el) {
    el.addEventListener('click', async function() {
      var page = el.getAttribute('data-page');
      if (page) {
        try { await syscall('editor.navigate', page); } catch (_) {}
      }
    });
  });

  // Collapsible sections: restore + persist open/closed state.
  // Default is open; an explicit "0" in storage means user collapsed it.
  function ls() { try { return window.parent.localStorage; } catch (_) { return null; } }
  document.querySelectorAll('details.section').forEach(function(d) {
    var key = 'path-section-' + d.getAttribute('data-section');
    var store = ls();
    if (store) {
      var v = store.getItem(key);
      if (v === '0') d.removeAttribute('open');
      else d.setAttribute('open', '');
    } else {
      d.setAttribute('open', '');
    }
    d.addEventListener('toggle', function() {
      var s = ls();
      if (s) s.setItem(key, d.open ? '1' : '0');
    });
  });
})();
`;return{html:h,script:x}}function Mr(e){let t=[],n=e,o=0;if(n.startsWith("---")){let s=n.indexOf(`
---`,4);if(s>=0){let c=s+4;o=n.substring(0,c).split(`
`).length,n=n.substring(c).replace(/^\n/,"")}}let i=n.split(`
`),a=!1;for(let s=0;s<i.length;s++){let c=i[s];if(c.startsWith("```")){a=!a;continue}if(a)continue;let d=c.match(/^(#{1,6})\s+(.+?)\s*$/);d&&t.push({level:d[1].length,text:d[2].replace(/[*_`]/g,""),line:o+s})}return t}function Tr(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,i)=>{let a=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${i}" style="padding-left:${a}px;">${p(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function F(){let e=await u.getCurrentPage();if(!e){await u.hidePanel("rhs");return}let t="";try{t=await u.getText()}catch{t=""}if(!t)try{t=await v.readPage(e)}catch{t=""}if(!t){globalThis.setTimeout?.(()=>{F().catch(m=>console.error("showAttributesPanel retry",m))},250),await u.hidePanel("rhs");return}let n=Y(t),o=Mr(t),i=await Cr(e),a=/^readonly:\s*true\s*$/m.test(t),s={allPaths:[],criteria:[]};if((n?.fields??[]).some(m=>m.isList&&(m.key==="paths"||m.key==="standards"))){let m=await kr(),f=n?.fields.find(h=>h.key==="framework")?.value||"";if(!f){let h=n?.fields.find(x=>x.key==="path"),M=n?.fields.find(x=>x.key==="paths"),k="";if(h&&!h.isList?k=h.value:M&&M.isList&&(k=M.value.find(l=>l&&l.trim())??""),k){let x=m.find(l=>l.slug===k);x&&(f=x.framework)}}let b=f?await Sr(f):[];s={allPaths:m,criteria:b}}if(a&&(!n||n.fields.length===0)&&o.length===0&&i.length===0){await u.hidePanel("rhs");return}let{html:d,script:y}=Ar(e,n?.fields??[],o,i,a,s);await u.showPanel("rhs",.7,d,y)}async function K(e,t){let n=await v.readPage(e),o=Y(n);if(!o){await u.flashNotification("No frontmatter to save");return}let a=`---
${Pr(o.fields,t)}
---
${o.rest}`;if(a===n){await u.flashNotification("No changes");return}await v.writePage(e,a),await u.flashNotification("Saved"),await u.reloadPage()}var J={plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'};function Lr(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${J[e]??""}</svg>`}async function Er(){try{let e=await v.readPage("_system/announcements-cache").catch(()=>"");if(!e)return 0;let t=e.match(/```json\s*([\s\S]*?)\s*```/);if(!t)return 0;let n=JSON.parse(t[1]).announcements??[],o=new Set;try{let i=await v.readPage("_system/announcements-read");o=new Set(Array.from(i.matchAll(/^- ([\w\-_.]+)$/gm)).map(a=>a[1]))}catch{}return n.filter(i=>i.id&&!o.has(i.id)).length}catch{return 0}}async function $r(){let e=await Er(),n=[{title:"",items:[{label:"Capture",icon:"plus",command:"Path: Capture"}]},{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Evidence",icon:"paperclip",navigate:"Evidence"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[{label:"Setup",icon:"check-square",navigate:"Setup"},{label:"Announcements",icon:"bell",navigate:"Announcements",badge:e},{label:"History",icon:"clock",navigate:"History"},{label:"Manual",icon:"book-open",navigate:"manual/cheatsheet"},{label:"Add framework",icon:"download",command:"Path: Add framework"},{label:"About",icon:"info",navigate:"About"}]}].map(a=>{let s=a.title===""&&a.items.length===1&&a.items[0].command==="Path: Capture",c=s?"nav-item nav-capture":"nav-item",d=s?"section section-capture":"section",y=a.items.map(f=>{let b=f.navigate?`data-navigate="${p(f.navigate)}"`:`data-command="${p(f.command??"")}"`,h=f.badge&&f.badge>0?`<span class="nav-badge">${f.badge}</span>`:"";return`<li class="${c}" ${b}>${Lr(f.icon)}<span class="nav-label">${p(f.label)}</span>${h}</li>`}).join(""),m=a.title?`<h2>${p(a.title)}</h2>`:"";return`<div class="${d}">${m}<ul class="nav">${y}</ul></div>`}).join("");return{html:`
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 14px; background: #f8fafc; width: 220px; max-width: 220px; overflow-x: hidden; }
  * { box-sizing: border-box; }
  .panel { padding: 1.4em 1em 1.4em 1.1em; color: #1f2937; }
  .brand-row { display: flex; align-items: center; gap: 0.55em; margin: 0 0 0.15em 0; }
  .logo { width: 24px; height: 24px; color: #4f46e5; flex-shrink: 0; }
  .brand { font-size: 1.3em; font-weight: 600; letter-spacing: 0.01em; margin: 0; color: #111827; flex: 1; }
  .tagline { font-size: 0.78em; color: #6b7280; margin: 0 0 1.7em 0; font-style: italic; }
  .section { margin-bottom: 1.5em; }
  .section h2 { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 0.55em 0; font-weight: 600; }
  .nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.1em; }
  .nav-item { display: flex; align-items: center; gap: 0.6em; font-size: 0.92em; color: #1f2937; cursor: pointer; padding: 0.45em 0.55em; border-radius: 4px; line-height: 1.3; white-space: nowrap; }
  .nav-item:hover { background: #eef2ff; color: #3730a3; }
  .nav-label { flex: 1; }
  .nav-badge { flex-shrink: 0; min-width: 1.4em; padding: 0 0.45em; height: 1.4em; line-height: 1.4em; text-align: center; font-size: 0.72em; font-weight: 600; color: white; background: #4f46e5; border-radius: 999px; }
  html[data-theme="dark"] .nav-badge { background: #818cf8; color: #0f172a; }
  .icon { flex-shrink: 0; opacity: 0.75; }
  .nav-item:hover .icon { opacity: 1; }
  /* Capture CTA \u2014 primary action, distinct from regular nav. Sits at
     ~50% panel width, left-aligned with the rest of the navigator. */
  .section-capture { margin-bottom: 1.6em; }
  .section-capture .nav { width: 50%; min-width: 90px; }
  .nav-capture { background: #4f46e5; color: white; justify-content: center; padding: 0.55em 0.9em; font-weight: 500; gap: 0.45em; border-radius: 6px; box-shadow: 0 1px 2px rgba(79, 70, 229, 0.2); transition: background 0.12s, box-shadow 0.12s; }
  .nav-capture:hover { background: #4338ca; color: white; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3); }
  .nav-capture .icon { opacity: 1; color: white; }
  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .brand { color: #f8fafc; }
  html[data-theme="dark"] .logo { color: #818cf8; }
  html[data-theme="dark"] .tagline { color: #94a3b8; }
  html[data-theme="dark"] .section h2 { color: #94a3b8; }
  html[data-theme="dark"] .nav-item { color: #e2e8f0; }
  html[data-theme="dark"] .nav-item:hover { background: #1e293b; color: #c7d2fe; }
  html[data-theme="dark"] .nav-capture { background: #4f46e5; color: white; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); }
  html[data-theme="dark"] .nav-capture:hover { background: #6366f1; color: white; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); }
</style>
<div id="panel" class="panel">
  <div class="brand-row">
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${J.route}</svg>
    <h1 class="brand">Path</h1>
  </div>
  <p class="tagline">Career development for professionals</p>
  ${n}
</div>
`,script:`
(function() {
  // Sync data-theme with the parent (theme toggle changes propagate live).
  try {
    var parentHtml = window.parent.document.documentElement;
    var sync = function() {
      var theme = parentHtml.getAttribute('data-theme') || '';
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      else document.documentElement.removeAttribute('data-theme');
    };
    sync();
    new MutationObserver(sync).observe(parentHtml, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var nav = el.getAttribute('data-navigate');
      var cmd = el.getAttribute('data-command');
      try {
        if (nav) {
          await syscall('editor.navigate', nav);
        } else if (cmd) {
          await syscall('system.invokeCommand', cmd);
        }
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Nav failed: ' + msg); } catch (_) {}
      }
    });
  });

})();
`}}async function $(){let{html:e,script:t}=await $r();await u.showPanel("lhs",.5,e,t)}async function Z(){D?(D=!1,await Promise.all([$().catch(e=>console.error("showLeftPanel",e)),F().catch(e=>console.error("showAttributesPanel",e))])):(D=!0,await Promise.all([u.hidePanel("lhs"),u.hidePanel("rhs")]))}async function X(){if(!D){if(!I){I=!0;let e=await u.getCurrentPage();if(e&&e!=="Setup"){let t=!1;try{t=(await v.readPage("_system/onboarding")).includes("redirect: true")}catch{t=!0}if(t){try{await v.writePage("_system/onboarding",`redirect: false
`)}catch{}await u.navigate("Setup");return}}}q||(q=!0,(async()=>{try{await E.invokeCommand("Path: Refresh announcements (silent)"),await $().catch(()=>{})}catch{}})());try{await u.getCurrentPage()==="Announcements"&&globalThis.setTimeout?.(()=>{E.invokeCommand("Path: Mark all announcements as read").catch(()=>{})},600)}catch{}await Promise.all([$().catch(e=>console.error("showLeftPanel failed",e)),F().catch(e=>console.error("showAttributesPanel failed",e))])}}async function ee(){await u.flashNotification("Hello from the Path plug!")}async function te(){let e=await u.getCurrentPage();if(!e){await u.flashNotification("No current page");return}await u.flashNotification(`debugSave: targeting ${e}`);try{await K(e,{title:"DEBUG_TEST"})}catch(t){let n=t instanceof Error?t.message:String(t);await u.flashNotification(`debugSave threw: ${n}`)}}var re={hello:ee,showAttributesPanel:F,showLeftPanel:$,saveAttributes:K,debugSave:te,onPageLoaded:X,toggleZenMode:Z},ne={name:"path",functions:{hello:{path:"path.ts:hello",command:{name:"Path: Hello from plug"}},showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},showLeftPanel:{path:"path.ts:showLeftPanel",command:{name:"Path: Refresh navigator"}},saveAttributes:{path:"path.ts:saveAttributes"},debugSave:{path:"path.ts:debugSave",command:{name:"Path: Debug save (writes title=DEBUG_TEST)"}},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}}},assets:{}},yn={manifest:ne,functionMapping:re};V(re,ne,self.postMessage);export{yn as plug};
//# sourceMappingURL=path.plug.js.map
