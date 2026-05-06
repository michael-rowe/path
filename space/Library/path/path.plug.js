var J=Object.defineProperty;var k=(e,t)=>{for(var n in t)J(e,n,{get:t[n],enumerable:!0})};function Z(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function N(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var lr=new Uint8Array(16),X=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(s=>({...s,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(i){console.warn("Could not post logs to server",i.message),this.logBuffer.unshift(...o)}}}},D;function ee(e=""){return D=new X(e),D}var v=e=>{throw new Error("Not initialized yet")},F=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",E=new Map,L=0;F&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{L++,E.set(L,{resolve:n,reject:o}),v({type:"sys",id:L,name:e,args:t})}));function R(e,t,n){F&&(v=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let s=e[i.name];if(!s)throw new Error(`Function not loaded: ${i.name}`);try{let a=await Promise.resolve(s(...i.args||[]));v({type:"invr",id:i.id,result:a})}catch(a){console.error("An exception was thrown as a result of invoking function",i.name,"error:",a.message),v({type:"invr",id:i.id,error:a.message})}}break;case"sysr":{let s=i.id,a=E.get(s);if(!a)throw Error("Invalid request id");E.delete(s),i.error?a.reject(new Error(i.error)):a.resolve(i.result)}break}})().catch(console.error)}),v({type:"manifest",manifest:t}),ee(`[${t.name} plug]`))}async function te(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?N(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function re(){globalThis.fetch=async(e,t)=>{let n=t?.body?N(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await te(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?Z(o.base64Body):null,{status:o.status,headers:o.headers})}}F&&re();var d={};k(d,{alert:()=>Oe,configureVimMode:()=>nt,confirm:()=>Ke,copyToClipboard:()=>Je,deleteLine:()=>Ze,dispatch:()=>Re,downloadFile:()=>Se,filterBox:()=>Te,flashNotification:()=>Ce,fold:()=>ze,foldAll:()=>qe,getCurrentEditor:()=>se,getCurrentPage:()=>ne,getCurrentPageMeta:()=>oe,getCurrentPath:()=>ie,getCursor:()=>de,getRecentlyOpenedPages:()=>ae,getSelection:()=>ue,getText:()=>le,getUiOption:()=>je,goHistory:()=>Me,hidePanel:()=>Ee,insertAtCursor:()=>Ne,insertAtPos:()=>$e,invokeCommand:()=>pe,isMobile:()=>it,moveCursor:()=>Be,moveCursorToLine:()=>De,moveLineDown:()=>tt,moveLineUp:()=>et,navigate:()=>ge,newWindow:()=>ke,openCommandPalette:()=>ye,openPageNavigator:()=>he,openSearchPanel:()=>Ye,openUrl:()=>we,prompt:()=>_e,rebuildEditorState:()=>xe,redo:()=>Ge,reloadConfigAndCommands:()=>Pe,reloadPage:()=>be,reloadUI:()=>ve,replaceRange:()=>Ue,save:()=>fe,sendMessage:()=>ot,setSelection:()=>me,setText:()=>ce,setUiOption:()=>He,showPanel:()=>Le,showProgress:()=>Fe,toggleComment:()=>Xe,toggleFold:()=>Ve,undo:()=>Qe,unfold:()=>Ie,unfoldAll:()=>We,uploadFile:()=>Ae,vimEx:()=>rt});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function ne(){return r("editor.getCurrentPage")}function oe(){return r("editor.getCurrentPageMeta")}function ie(){return r("editor.getCurrentPath")}function ae(){return r("editor.getRecentlyOpenedPages")}function se(){return r("editor.getCurrentEditor")}function le(){return r("editor.getText")}function ce(e,t=!1){return r("editor.setText",e,t)}function de(){return r("editor.getCursor")}function ue(){return r("editor.getSelection")}function me(e,t){return r("editor.setSelection",e,t)}function pe(e,t){return r("editor.invokeCommand",e,t)}function fe(){return r("editor.save")}function ge(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function he(e="page"){return r("editor.openPageNavigator",e)}function ye(){return r("editor.openCommandPalette")}function be(){return r("editor.reloadPage")}function ve(){return r("editor.reloadUI")}function xe(){return r("editor.rebuildEditorState")}function Pe(){return r("editor.reloadConfigAndCommands")}function we(e,t=!1){return r("editor.openUrl",e,t)}function ke(){return r("editor.newWindow")}function Me(e){return r("editor.goHistory",e)}function Se(e,t){return r("editor.downloadFile",e,t)}function Ae(e,t){return r("editor.uploadFile",e,t)}function Ce(e,t="info"){return r("editor.flashNotification",e,t)}function Te(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Le(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function Ee(e){return r("editor.hidePanel",e)}function Fe(e,t){return r("editor.showProgress",e,t)}function $e(e,t){return r("editor.insertAtPos",e,t)}function Ue(e,t,n){return r("editor.replaceRange",e,t,n)}function Be(e,t=!1){return r("editor.moveCursor",e,t)}function De(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function Ne(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function Re(e){return r("editor.dispatch",e)}function _e(e,t=""){return r("editor.prompt",e,t)}function Ke(e){return r("editor.confirm",e)}function Oe(e){return r("editor.alert",e)}function je(e){return r("editor.getUiOption",e)}function He(e,t){return r("editor.setUiOption",e,t)}function ze(){return r("editor.fold")}function Ie(){return r("editor.unfold")}function Ve(){return r("editor.toggleFold")}function qe(){return r("editor.foldAll")}function We(){return r("editor.unfoldAll")}function Qe(){return r("editor.undo")}function Ge(){return r("editor.redo")}function Ye(){return r("editor.openSearchPanel")}function Je(e){return r("editor.copyToClipboard",e)}function Ze(){return r("editor.deleteLine")}function Xe(){return r("editor.toggleComment")}function et(){return r("editor.moveLineUp")}function tt(){return r("editor.moveLineDown")}function rt(e){return r("editor.vimEx",e)}function nt(){return r("editor.configureVimMode")}function ot(e,t){return r("editor.sendMessage",e,t)}function it(){return r("editor.isMobile")}var h={};k(h,{deleteDocument:()=>vt,deleteFile:()=>At,deletePage:()=>pt,fileExists:()=>Ct,getDocumentMeta:()=>ht,getFileMeta:()=>Mt,getPageMeta:()=>lt,listDocuments:()=>gt,listFiles:()=>xt,listPages:()=>st,listPlugs:()=>ft,pageExists:()=>ct,readDocument:()=>yt,readFile:()=>Pt,readFileWithMeta:()=>kt,readPage:()=>dt,readPageWithMeta:()=>ut,readRef:()=>wt,writeDocument:()=>bt,writeFile:()=>St,writePage:()=>mt});function st(){return r("space.listPages")}function lt(e){return r("space.getPageMeta",e)}function ct(e){return r("space.pageExists",e)}function dt(e){return r("space.readPage",e)}function ut(e){return r("space.readPageWithMeta",e)}function mt(e,t){return r("space.writePage",e,t)}function pt(e){return r("space.deletePage",e)}function ft(){return r("space.listPlugs")}function gt(){return r("space.listDocuments")}function ht(e){return r("space.getDocumentMeta",e)}function yt(e){return r("space.readDocument",e)}function bt(e,t){return r("space.writeDocument",e,t)}function vt(e){return r("space.deleteDocument",e)}function xt(){return r("space.listFiles")}function Pt(e){return r("space.readFile",e)}function wt(e){return r("space.readRef",e)}function kt(e){return r("space.readFileWithMeta",e)}function Mt(e){return r("space.getFileMeta",e)}function St(e,t){return r("space.writeFile",e,t)}function At(e){return r("space.deleteFile",e)}function Ct(e){return r("space.fileExists",e)}var xr=new Uint8Array(16);var x={};k(x,{evalExpression:()=>jt,parse:()=>Kt,parseExpression:()=>Ot});function Kt(e){return r("lua.parse",e)}function Ot(e){return r("lua.parseExpression",e)}function jt(e){return r("lua.evalExpression",e)}var M={};k(M,{deleteObject:()=>Gt,ensureFullIndex:()=>Wt,getObjectByRef:()=>qt,indexObjects:()=>zt,queryLuaObjects:()=>Vt,reindexSpace:()=>Qt,validateObjects:()=>It});function zt(e,t){return r("index.indexObjects",e,t)}function It(e,t){return r("index.validateObjects",e,t)}function Vt(e,t,n){return r("index.queryLuaObjects",e,t,n)}function qt(e,t,n){return r("index.getObjectByRef",e,t,n)}function Wt(){return r("index.ensureFullIndex")}function Qt(){return r("index.reindexSpace")}function Gt(e,t,n){return r("index.deleteObject",e,t,n)}var A=!1,j=new Set(["tags","itags","asTag","lastModified","pageDecoration","title"]),_={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date"},Yt={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"list of standard codes (e.g. 1.1, 2.3)",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},Jt={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"]},Zt={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"]};function Xt(e,t){return e==="status"?Jt[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:Zt[e]??null}function K(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function H(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),i=n+4;e[i]===`
`&&i++;let s=[],a=null;for(let u of o.split(`
`)){let p=u.trim();if(p===""||p.startsWith("#")){a&&a.cont.push(u);continue}if(!u.startsWith(" ")&&!u.startsWith("	")){let f=u.match(/^([\w-]+):\s*(.*)$/);if(f){a&&s.push(a),a={key:f[1],headerValue:f[2],cont:[]};continue}}a&&a.cont.push(u)}a&&s.push(a);let c=[];for(let u of s){if(u.headerValue.trim()!==""){c.push({key:u.key,value:K(u.headerValue),isList:!1});continue}let p=u.cont.filter(g=>g.trim()!==""&&!g.trim().startsWith("#"));if(p.length===0){c.push({key:u.key,value:[],isList:!0});continue}let f=/^(\s+)-\s+(.*)$/;if(p.every(g=>{let y=g.match(f);return y?!/:\s/.test(y[2]):!1})){let g=p.map(y=>K(y.match(f)[2]));c.push({key:u.key,value:g,isList:!0})}else c.push({key:u.key,value:[],isList:!0,complex:!0,raw:u.cont.join(`
`)})}return{fields:c,rest:e.substring(i),fmStart:t,fmEnd:n}}function O(e){if(_[e])return _[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function er(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!j.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let a of o.value)n.push(`  - ${S(a)}`)}else n.push(`${o.key}: ${S(o.value)}`);continue}let s=t[o.key]??"";if(o.isList){let a=s.split(",").map(c=>c.trim()).filter(c=>c.length>0);n.push(`${o.key}:`);for(let c of a)n.push(`  - ${S(c)}`)}else n.push(`${o.key}: ${S(s.trim())}`)}return n.join(`
`)}async function tr(e){try{let t=await x.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await x.parseExpression("l.pageLastModified"),o=await M.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],i=new Set,s=[];for(let a of o){let c=a?.page??"";!c||i.has(c)||(i.add(c),s.push({ref:a?.ref??c,pageName:c,snippet:typeof a?.snippet=="string"?a.snippet:""}))}return s}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}function rr(e,t,n=[],o=[]){let i=[],s=[],a=t.find(l=>l.key==="type")?.value??"";for(let l of t){if(j.has(l.key)||l.complex)continue;if(l.key==="type"){i.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${m(l.value)}</span></div></div>`);continue}let P=l.isList?l.value.join(", "):l.value,B=Xt(l.key,a);if(B){let T=m(O(l.key)),w=['<option value="">\u2014</option>',...B.map(b=>`<option value="${m(b)}"${P===b?" selected":""}>${m(b)}</option>`)].join("");i.push(`<div class="row"><label class="k" for="f-${l.key}">${T}</label><select class="field" id="f-${l.key}" data-key="${l.key}">${w}</select></div>`)}else{let T=m(O(l.key))+(l.isList?' <span class="hint">(comma-separated)</span>':""),w=Yt[l.key],b=w?`<div class="field-hint">${m(w)}</div>`:"";i.push(`<div class="row"><label class="k" for="f-${l.key}">${T}</label><input class="field" id="f-${l.key}" data-key="${l.key}" value="${m(P)}">${b}</div>`)}s.push({key:l.key,list:l.isList})}let c=t.length===0||i.length===0?"":`
    <details class="section" data-section="attrs">
      <summary class="section-summary">
        <h2>Page attributes</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <div class="section-actions"><button class="btn" id="btn-save">Save</button></div>
        <div class="attrs">${i.join("")}</div>
      </div>
    </details>`,u=or(n),p=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(l=>{let P=l.snippet?`<div class="mention-snip">${m(l.snippet)}</div>`:"";return`<li class="mention" data-page="${m(l.pageName)}"><div class="mention-ref">${m(l.pageName)}</div>${P}</li>`}).join("")}</ul>
      </div>
    </details>`,f=`
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
</style>
<div id="panel" class="panel">
  ${u}
  ${c}
  ${p}
</div>
`,U=JSON.stringify(s),g=JSON.stringify(e),y=`
(function() {
  var FIELDS = ${U};
  var PAGE = ${g};

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
`;return{html:f,script:y}}function nr(e){let t=[],n=e,o=0;if(n.startsWith("---")){let a=n.indexOf(`
---`,4);if(a>=0){let c=a+4;o=n.substring(0,c).split(`
`).length,n=n.substring(c).replace(/^\n/,"")}}let i=n.split(`
`),s=!1;for(let a=0;a<i.length;a++){let c=i[a];if(c.startsWith("```")){s=!s;continue}if(s)continue;let u=c.match(/^(#{1,6})\s+(.+?)\s*$/);u&&t.push({level:u[1].length,text:u[2].replace(/[*_`]/g,""),line:o+a})}return t}function or(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,i)=>{let s=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${i}" style="padding-left:${s}px;">${m(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function C(){let e=await d.getCurrentPage();if(!e){await d.hidePanel("rhs");return}let t="";try{t=await d.getText()}catch{t=""}if(!t)try{t=await h.readPage(e)}catch{await d.hidePanel("rhs");return}let n=H(t),o=nr(t),i=await tr(e);if((!n||n.fields.length===0)&&o.length===0&&i.length===0){await d.hidePanel("rhs");return}let{html:s,script:a}=rr(e,n?.fields??[],o,i);await d.showPanel("rhs",.7,s,a)}async function $(e,t){let n=await h.readPage(e),o=H(n);if(!o){await d.flashNotification("No frontmatter to save");return}let s=`---
${er(o.fields,t)}
---
${o.rest}`;if(s===n){await d.flashNotification("No changes");return}await h.writePage(e,s),await d.flashNotification("Saved"),await d.reloadPage()}var z={"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'};function ir(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${z[e]??""}</svg>`}function ar(){let t=[{title:"Create",items:[{label:"New CPD activity",icon:"plus-circle",command:"Path: New CPD activity"},{label:"New claim",icon:"edit-3",command:"Path: New claim"},{label:"New future-claim",icon:"trending-up",command:"Path: New future-contributions claim"},{label:"New reflection",icon:"pen-tool",command:"Path: New reflection"},{label:"New contact",icon:"users",command:"Path: New contact"},{label:"New credential",icon:"award",command:"Path: New credential"},{label:"Quick capture",icon:"zap",command:"Path: New capture"}]},{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[{label:"Getting started",icon:"check-square",navigate:"Getting started"},{label:"History",icon:"clock",navigate:"History"},{label:"Manual",icon:"book-open",navigate:"manual/cheatsheet"},{label:"Add framework",icon:"download",command:"Path: Add framework"},{label:"Check updates",icon:"refresh-cw",command:"Path: Check framework updates"},{label:"Export to PDF",icon:"file-down",command:"Path: Export to PDF"},{label:"Export to Word",icon:"file-text",command:"Path: Export to Word"}]}].map(i=>{let s=i.items.map(a=>`<li class="nav-item" ${a.navigate?`data-navigate="${m(a.navigate)}"`:`data-command="${m(a.command??"")}"`}>${ir(a.icon)}<span>${m(a.label)}</span></li>`).join("");return`<div class="section"><h2>${m(i.title)}</h2><ul class="nav">${s}</ul></div>`}).join("");return{html:`
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
  .icon { flex-shrink: 0; opacity: 0.75; }
  .nav-item:hover .icon { opacity: 1; }
  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .brand { color: #f8fafc; }
  html[data-theme="dark"] .logo { color: #818cf8; }
  html[data-theme="dark"] .tagline { color: #94a3b8; }
  html[data-theme="dark"] .section h2 { color: #94a3b8; }
  html[data-theme="dark"] .nav-item { color: #e2e8f0; }
  html[data-theme="dark"] .nav-item:hover { background: #1e293b; color: #c7d2fe; }
</style>
<div id="panel" class="panel">
  <div class="brand-row">
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${z.route}</svg>
    <h1 class="brand">Path</h1>
  </div>
  <p class="tagline">Career development for professionals</p>
  ${t}
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
`}}async function I(){let{html:e,script:t}=ar();await d.showPanel("lhs",.5,e,t)}async function V(){A?(A=!1,await Promise.all([I().catch(e=>console.error("showLeftPanel",e)),C().catch(e=>console.error("showAttributesPanel",e))])):(A=!0,await Promise.all([d.hidePanel("lhs"),d.hidePanel("rhs")]))}async function q(){if(A)return;let e=await d.getCurrentPage();if(e&&e!=="Getting started")try{let t=await h.readPage("profile");if(!t||/full_name:\s*["']?Your Name["']?/.test(t)||!/full_name:\s*\S/.test(t)){await d.navigate("Getting started");return}}catch{await d.navigate("Getting started");return}await Promise.all([I().catch(t=>console.error("showLeftPanel failed",t)),C().catch(t=>console.error("showAttributesPanel failed",t))])}async function W(){await d.flashNotification("Hello from the Path plug!")}async function Q(){let e=await d.getCurrentPage();if(!e){await d.flashNotification("No current page");return}await d.flashNotification(`debugSave: targeting ${e}`);try{await $(e,{title:"DEBUG_TEST"})}catch(t){let n=t instanceof Error?t.message:String(t);await d.flashNotification(`debugSave threw: ${n}`)}}var G={hello:W,showAttributesPanel:C,saveAttributes:$,debugSave:Q,onPageLoaded:q,toggleZenMode:V},Y={name:"path",functions:{hello:{path:"path.ts:hello",command:{name:"Path: Hello from plug"}},showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},saveAttributes:{path:"path.ts:saveAttributes"},debugSave:{path:"path.ts:debugSave",command:{name:"Path: Debug save (writes title=DEBUG_TEST)"}},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}}},assets:{}},Ir={manifest:Y,functionMapping:G};R(G,Y,self.postMessage);export{Ir as plug};
//# sourceMappingURL=path.plug.js.map
