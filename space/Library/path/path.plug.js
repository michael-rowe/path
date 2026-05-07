var ee=Object.defineProperty;var k=(e,t)=>{for(var n in t)ee(e,n,{get:t[n],enumerable:!0})};function te(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let a=0;a<n;a++)o[a]=t.charCodeAt(a);return o}function U(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var ur=new Uint8Array(16),re=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(s=>({...s,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(a){console.warn("Could not post logs to server",a.message),this.logBuffer.unshift(...o)}}}},D;function ne(e=""){return D=new re(e),D}var v=e=>{throw new Error("Not initialized yet")},$=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",E=new Map,L=0;$&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{L++,E.set(L,{resolve:n,reject:o}),v({type:"sys",id:L,name:e,args:t})}));function N(e,t,n){$&&(v=n,self.addEventListener("message",o=>{(async()=>{let a=o.data;switch(a.type){case"inv":{let s=e[a.name];if(!s)throw new Error(`Function not loaded: ${a.name}`);try{let i=await Promise.resolve(s(...a.args||[]));v({type:"invr",id:a.id,result:i})}catch(i){console.error("An exception was thrown as a result of invoking function",a.name,"error:",i.message),v({type:"invr",id:a.id,error:i.message})}}break;case"sysr":{let s=a.id,i=E.get(s);if(!i)throw Error("Invalid request id");E.delete(s),a.error?i.reject(new Error(a.error)):i.resolve(a.result)}break}})().catch(console.error)}),v({type:"manifest",manifest:t}),ne(`[${t.name} plug]`))}async function oe(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?U(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function ie(){globalThis.fetch=async(e,t)=>{let n=t?.body?U(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await oe(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?te(o.base64Body):null,{status:o.status,headers:o.headers})}}$&&ie();var d={};k(d,{alert:()=>He,configureVimMode:()=>at,confirm:()=>ze,copyToClipboard:()=>et,deleteLine:()=>tt,dispatch:()=>je,downloadFile:()=>Te,filterBox:()=>$e,flashNotification:()=>Ee,fold:()=>qe,foldAll:()=>Qe,getCurrentEditor:()=>de,getCurrentPage:()=>ae,getCurrentPageMeta:()=>se,getCurrentPath:()=>le,getCursor:()=>pe,getRecentlyOpenedPages:()=>ce,getSelection:()=>fe,getText:()=>ue,getUiOption:()=>Ie,goHistory:()=>Ce,hidePanel:()=>Be,insertAtCursor:()=>Ke,insertAtPos:()=>Ue,invokeCommand:()=>he,isMobile:()=>lt,moveCursor:()=>_e,moveCursorToLine:()=>Re,moveLineDown:()=>ot,moveLineUp:()=>nt,navigate:()=>be,newWindow:()=>Se,openCommandPalette:()=>xe,openPageNavigator:()=>ve,openSearchPanel:()=>Xe,openUrl:()=>Me,prompt:()=>Oe,rebuildEditorState:()=>ke,redo:()=>Ze,reloadConfigAndCommands:()=>Ae,reloadPage:()=>Pe,reloadUI:()=>we,replaceRange:()=>Ne,save:()=>ye,sendMessage:()=>st,setSelection:()=>ge,setText:()=>me,setUiOption:()=>Ve,showPanel:()=>Fe,showProgress:()=>De,toggleComment:()=>rt,toggleFold:()=>Ge,undo:()=>Je,unfold:()=>We,unfoldAll:()=>Ye,uploadFile:()=>Le,vimEx:()=>it});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function ae(){return r("editor.getCurrentPage")}function se(){return r("editor.getCurrentPageMeta")}function le(){return r("editor.getCurrentPath")}function ce(){return r("editor.getRecentlyOpenedPages")}function de(){return r("editor.getCurrentEditor")}function ue(){return r("editor.getText")}function me(e,t=!1){return r("editor.setText",e,t)}function pe(){return r("editor.getCursor")}function fe(){return r("editor.getSelection")}function ge(e,t){return r("editor.setSelection",e,t)}function he(e,t){return r("editor.invokeCommand",e,t)}function ye(){return r("editor.save")}function be(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function ve(e="page"){return r("editor.openPageNavigator",e)}function xe(){return r("editor.openCommandPalette")}function Pe(){return r("editor.reloadPage")}function we(){return r("editor.reloadUI")}function ke(){return r("editor.rebuildEditorState")}function Ae(){return r("editor.reloadConfigAndCommands")}function Me(e,t=!1){return r("editor.openUrl",e,t)}function Se(){return r("editor.newWindow")}function Ce(e){return r("editor.goHistory",e)}function Te(e,t){return r("editor.downloadFile",e,t)}function Le(e,t){return r("editor.uploadFile",e,t)}function Ee(e,t="info"){return r("editor.flashNotification",e,t)}function $e(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Fe(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function Be(e){return r("editor.hidePanel",e)}function De(e,t){return r("editor.showProgress",e,t)}function Ue(e,t){return r("editor.insertAtPos",e,t)}function Ne(e,t,n){return r("editor.replaceRange",e,t,n)}function _e(e,t=!1){return r("editor.moveCursor",e,t)}function Re(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function Ke(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function je(e){return r("editor.dispatch",e)}function Oe(e,t=""){return r("editor.prompt",e,t)}function ze(e){return r("editor.confirm",e)}function He(e){return r("editor.alert",e)}function Ie(e){return r("editor.getUiOption",e)}function Ve(e,t){return r("editor.setUiOption",e,t)}function qe(){return r("editor.fold")}function We(){return r("editor.unfold")}function Ge(){return r("editor.toggleFold")}function Qe(){return r("editor.foldAll")}function Ye(){return r("editor.unfoldAll")}function Je(){return r("editor.undo")}function Ze(){return r("editor.redo")}function Xe(){return r("editor.openSearchPanel")}function et(e){return r("editor.copyToClipboard",e)}function tt(){return r("editor.deleteLine")}function rt(){return r("editor.toggleComment")}function nt(){return r("editor.moveLineUp")}function ot(){return r("editor.moveLineDown")}function it(e){return r("editor.vimEx",e)}function at(){return r("editor.configureVimMode")}function st(e,t){return r("editor.sendMessage",e,t)}function lt(){return r("editor.isMobile")}var h={};k(h,{deleteDocument:()=>wt,deleteFile:()=>Lt,deletePage:()=>ht,fileExists:()=>Et,getDocumentMeta:()=>vt,getFileMeta:()=>Ct,getPageMeta:()=>ut,listDocuments:()=>bt,listFiles:()=>kt,listPages:()=>dt,listPlugs:()=>yt,pageExists:()=>mt,readDocument:()=>xt,readFile:()=>At,readFileWithMeta:()=>St,readPage:()=>pt,readPageWithMeta:()=>ft,readRef:()=>Mt,writeDocument:()=>Pt,writeFile:()=>Tt,writePage:()=>gt});function dt(){return r("space.listPages")}function ut(e){return r("space.getPageMeta",e)}function mt(e){return r("space.pageExists",e)}function pt(e){return r("space.readPage",e)}function ft(e){return r("space.readPageWithMeta",e)}function gt(e,t){return r("space.writePage",e,t)}function ht(e){return r("space.deletePage",e)}function yt(){return r("space.listPlugs")}function bt(){return r("space.listDocuments")}function vt(e){return r("space.getDocumentMeta",e)}function xt(e){return r("space.readDocument",e)}function Pt(e,t){return r("space.writeDocument",e,t)}function wt(e){return r("space.deleteDocument",e)}function kt(){return r("space.listFiles")}function At(e){return r("space.readFile",e)}function Mt(e){return r("space.readRef",e)}function St(e){return r("space.readFileWithMeta",e)}function Ct(e){return r("space.getFileMeta",e)}function Tt(e,t){return r("space.writeFile",e,t)}function Lt(e){return r("space.deleteFile",e)}function Et(e){return r("space.fileExists",e)}var kr=new Uint8Array(16);var x={};k(x,{evalExpression:()=>It,parse:()=>zt,parseExpression:()=>Ht});function zt(e){return r("lua.parse",e)}function Ht(e){return r("lua.parseExpression",e)}function It(e){return r("lua.evalExpression",e)}var A={};k(A,{deleteObject:()=>Zt,ensureFullIndex:()=>Yt,getObjectByRef:()=>Qt,indexObjects:()=>qt,queryLuaObjects:()=>Gt,reindexSpace:()=>Jt,validateObjects:()=>Wt});function qt(e,t){return r("index.indexObjects",e,t)}function Wt(e,t){return r("index.validateObjects",e,t)}function Gt(e,t,n){return r("index.queryLuaObjects",e,t,n)}function Qt(e,t,n){return r("index.getObjectByRef",e,t,n)}function Yt(){return r("index.ensureFullIndex")}function Jt(){return r("index.reindexSpace")}function Zt(e,t,n){return r("index.deleteObject",e,t,n)}var S=!1,_=!1,O=new Set(["tags","itags","asTag","lastModified","pageDecoration","title"]),R={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date"},Xt={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"list of standard codes (e.g. 1.1, 2.3)",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},er={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"]},tr={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"]};function rr(e,t){return e==="status"?er[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:tr[e]??null}function K(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function z(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),a=n+4;e[a]===`
`&&a++;let s=[],i=null;for(let u of o.split(`
`)){let p=u.trim();if(p===""||p.startsWith("#")){i&&i.cont.push(u);continue}if(!u.startsWith(" ")&&!u.startsWith("	")){let f=u.match(/^([\w-]+):\s*(.*)$/);if(f){i&&s.push(i),i={key:f[1],headerValue:f[2],cont:[]};continue}}i&&i.cont.push(u)}i&&s.push(i);let l=[];for(let u of s){if(u.headerValue.trim()!==""){l.push({key:u.key,value:K(u.headerValue),isList:!1});continue}let p=u.cont.filter(g=>g.trim()!==""&&!g.trim().startsWith("#"));if(p.length===0){l.push({key:u.key,value:[],isList:!0});continue}let f=/^(\s+)-\s+(.*)$/;if(p.every(g=>{let y=g.match(f);return y?!/:\s/.test(y[2]):!1})){let g=p.map(y=>K(y.match(f)[2]));l.push({key:u.key,value:g,isList:!0})}else l.push({key:u.key,value:[],isList:!0,complex:!0,raw:u.cont.join(`
`)})}return{fields:l,rest:e.substring(a),fmStart:t,fmEnd:n}}function j(e){if(R[e])return R[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function M(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function nr(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!O.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let i of o.value)n.push(`  - ${M(i)}`)}else n.push(`${o.key}: ${M(o.value)}`);continue}let s=t[o.key]??"";if(o.isList){let i=s.split(",").map(l=>l.trim()).filter(l=>l.length>0);n.push(`${o.key}:`);for(let l of i)n.push(`  - ${M(l)}`)}else n.push(`${o.key}: ${M(s.trim())}`)}return n.join(`
`)}async function or(e){try{let t=await x.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await x.parseExpression("l.pageLastModified"),o=await A.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],a=new Set,s=[];for(let i of o){let l=i?.page??"";!l||a.has(l)||(a.add(l),s.push({ref:i?.ref??l,pageName:l,snippet:typeof i?.snippet=="string"?i.snippet:""}))}return s}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}function ir(e,t,n=[],o=[],a=!1){let s=[],i=[],l=t.find(c=>c.key==="type")?.value??"";for(let c of t){if(O.has(c.key)||c.complex)continue;if(c.key==="type"){s.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${m(c.value)}</span></div></div>`);continue}let P=c.isList?c.value.join(", "):c.value,B=rr(c.key,l);if(B){let T=m(j(c.key)),w=['<option value="">\u2014</option>',...B.map(b=>`<option value="${m(b)}"${P===b?" selected":""}>${m(b)}</option>`)].join("");s.push(`<div class="row"><label class="k" for="f-${c.key}">${T}</label><select class="field" id="f-${c.key}" data-key="${c.key}">${w}</select></div>`)}else{let T=m(j(c.key))+(c.isList?' <span class="hint">(comma-separated)</span>':""),w=Xt[c.key],b=w?`<div class="field-hint">${m(w)}</div>`:"";s.push(`<div class="row"><label class="k" for="f-${c.key}">${T}</label><input class="field" id="f-${c.key}" data-key="${c.key}" value="${m(P)}">${b}</div>`)}i.push({key:c.key,list:c.isList})}let u=t.length===0||s.length===0?"":`
    <details class="section" data-section="attrs">
      <summary class="section-summary">
        <h2>Page attributes</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <div class="section-actions"><button class="btn" id="btn-save">Save</button></div>
        <div class="attrs">${s.join("")}</div>
      </div>
    </details>`,p=sr(n),f=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(c=>{let P=c.snippet?`<div class="mention-snip">${m(c.snippet)}</div>`:"";return`<li class="mention" data-page="${m(c.pageName)}"><div class="mention-ref">${m(c.pageName)}</div>${P}</li>`}).join("")}</ul>
      </div>
    </details>`,g=`
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
  .section-danger { margin-top: 2.5em; padding-top: 1.2em; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; }
  .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.45em 1em; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; font-family: inherit; transition: background 0.12s, color 0.12s; }
  .btn-danger:hover { background: #fee2e2; color: #991b1b; }
  html[data-theme="dark"] .section-danger { border-top-color: #1e293b; }
  html[data-theme="dark"] .btn-danger { color: #fca5a5; border-color: #7f1d1d; }
  html[data-theme="dark"] .btn-danger:hover { background: #450a0a; color: #fecaca; }
</style>
<div id="panel" class="panel">
  ${p}
  ${u}
  ${f}
  ${a?"":`
    <div class="section section-danger">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
</div>
`,y=JSON.stringify(i),Z=JSON.stringify(e),X=`
(function() {
  var FIELDS = ${y};
  var PAGE = ${Z};

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

  // Delete button: confirm by typing the page name, then delete via syscall
  // and navigate home. SB's space.deletePage removes the file from disk;
  // there's no trash bin, so the confirmation has to be deliberate.
  var deleteBtn = document.getElementById('btn-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async function() {
      var typed = window.prompt(
        "Delete this page?\\n\\nType the page name to confirm:\\n  " + PAGE
      );
      if (typed === null) return;
      if (typed.trim() !== PAGE) {
        try { await syscall('editor.flashNotification', 'Name did not match \u2014 page not deleted.', 'error'); } catch (_) {}
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
`;return{html:g,script:X}}function ar(e){let t=[],n=e,o=0;if(n.startsWith("---")){let i=n.indexOf(`
---`,4);if(i>=0){let l=i+4;o=n.substring(0,l).split(`
`).length,n=n.substring(l).replace(/^\n/,"")}}let a=n.split(`
`),s=!1;for(let i=0;i<a.length;i++){let l=a[i];if(l.startsWith("```")){s=!s;continue}if(s)continue;let u=l.match(/^(#{1,6})\s+(.+?)\s*$/);u&&t.push({level:u[1].length,text:u[2].replace(/[*_`]/g,""),line:o+i})}return t}function sr(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,a)=>{let s=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${a}" style="padding-left:${s}px;">${m(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function C(){let e=await d.getCurrentPage();if(!e){await d.hidePanel("rhs");return}let t="";try{t=await d.getText()}catch{t=""}if(!t)try{t=await h.readPage(e)}catch{await d.hidePanel("rhs");return}let n=z(t),o=ar(t),a=await or(e),s=/^readonly:\s*true\s*$/m.test(t);if(s&&(!n||n.fields.length===0)&&o.length===0&&a.length===0){await d.hidePanel("rhs");return}let{html:i,script:l}=ir(e,n?.fields??[],o,a,s);await d.showPanel("rhs",.7,i,l)}async function F(e,t){let n=await h.readPage(e),o=z(n);if(!o){await d.flashNotification("No frontmatter to save");return}let s=`---
${nr(o.fields,t)}
---
${o.rest}`;if(s===n){await d.flashNotification("No changes");return}await h.writePage(e,s),await d.flashNotification("Saved"),await d.reloadPage()}var H={"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'};function lr(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${H[e]??""}</svg>`}function cr(){let t=[{title:"Create",items:[{label:"New CPD activity",icon:"plus-circle",command:"Path: New CPD activity"},{label:"New claim",icon:"edit-3",command:"Path: New claim"},{label:"New future-claim",icon:"trending-up",command:"Path: New future-contributions claim"},{label:"New reflection",icon:"pen-tool",command:"Path: New reflection"},{label:"New contact",icon:"users",command:"Path: New contact"},{label:"New credential",icon:"award",command:"Path: New credential"},{label:"Quick capture",icon:"zap",command:"Path: New capture"}]},{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[{label:"Getting started",icon:"check-square",navigate:"Getting started"},{label:"History",icon:"clock",navigate:"History"},{label:"Manual",icon:"book-open",navigate:"manual/cheatsheet"},{label:"Add framework",icon:"download",command:"Path: Add framework"},{label:"Check updates",icon:"refresh-cw",command:"Path: Check framework updates"}]}].map(a=>{let s=a.items.map(i=>`<li class="nav-item" ${i.navigate?`data-navigate="${m(i.navigate)}"`:`data-command="${m(i.command??"")}"`}>${lr(i.icon)}<span>${m(i.label)}</span></li>`).join("");return`<div class="section"><h2>${m(a.title)}</h2><ul class="nav">${s}</ul></div>`}).join("");return{html:`
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
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${H.route}</svg>
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
`}}async function I(){let{html:e,script:t}=cr();await d.showPanel("lhs",.5,e,t)}async function V(){S?(S=!1,await Promise.all([I().catch(e=>console.error("showLeftPanel",e)),C().catch(e=>console.error("showAttributesPanel",e))])):(S=!0,await Promise.all([d.hidePanel("lhs"),d.hidePanel("rhs")]))}async function q(){if(!S){if(!_){_=!0;let e=await d.getCurrentPage();if(e&&e!=="Getting started"){let t=!1;try{t=(await h.readPage("_system/onboarding")).includes("redirect: true")}catch{t=!0}if(t){try{await h.writePage("_system/onboarding",`redirect: false
`)}catch{}await d.navigate("Getting started");return}}}await Promise.all([I().catch(e=>console.error("showLeftPanel failed",e)),C().catch(e=>console.error("showAttributesPanel failed",e))])}}async function W(){await d.flashNotification("Hello from the Path plug!")}async function G(){let e=await d.getCurrentPage();if(!e){await d.flashNotification("No current page");return}await d.flashNotification(`debugSave: targeting ${e}`);try{await F(e,{title:"DEBUG_TEST"})}catch(t){let n=t instanceof Error?t.message:String(t);await d.flashNotification(`debugSave threw: ${n}`)}}var Q={hello:W,showAttributesPanel:C,saveAttributes:F,debugSave:G,onPageLoaded:q,toggleZenMode:V},Y={name:"path",functions:{hello:{path:"path.ts:hello",command:{name:"Path: Hello from plug"}},showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},saveAttributes:{path:"path.ts:saveAttributes"},debugSave:{path:"path.ts:debugSave",command:{name:"Path: Debug save (writes title=DEBUG_TEST)"}},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}}},assets:{}},Wr={manifest:Y,functionMapping:Q};N(Q,Y,self.postMessage);export{Wr as plug};
//# sourceMappingURL=path.plug.js.map
