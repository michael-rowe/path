var me=Object.defineProperty;var F=(e,t)=>{for(var n in t)me(e,n,{get:t[n],enumerable:!0})};function pe(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function q(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var jr=new Uint8Array(16),fe=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(a=>({...a,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(i){console.warn("Could not post logs to server",i.message),this.logBuffer.unshift(...o)}}}},N;function ge(e=""){return N=new fe(e),N}var B=e=>{throw new Error("Not initialized yet")},H=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",j=new Map,D=0;H&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{D++,j.set(D,{resolve:n,reject:o}),B({type:"sys",id:D,name:e,args:t})}));function V(e,t,n){H&&(B=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let a=e[i.name];if(!a)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(a(...i.args||[]));B({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),B({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let a=i.id,s=j.get(a);if(!s)throw Error("Invalid request id");j.delete(a),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),B({type:"manifest",manifest:t}),ge(`[${t.name} plug]`))}async function he(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?q(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function ye(){globalThis.fetch=async(e,t)=>{let n=t?.body?q(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await he(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?pe(o.base64Body):null,{status:o.status,headers:o.headers})}}H&&ye();var u={};F(u,{alert:()=>tt,configureVimMode:()=>bt,confirm:()=>et,copyToClipboard:()=>mt,deleteLine:()=>pt,dispatch:()=>Ze,downloadFile:()=>Ie,filterBox:()=>ze,flashNotification:()=>Ke,fold:()=>ot,foldAll:()=>st,getCurrentEditor:()=>Pe,getCurrentPage:()=>be,getCurrentPageMeta:()=>ve,getCurrentPath:()=>xe,getCursor:()=>Ce,getRecentlyOpenedPages:()=>we,getSelection:()=>Ae,getText:()=>ke,getUiOption:()=>rt,goHistory:()=>He,hidePanel:()=>qe,insertAtCursor:()=>Je,insertAtPos:()=>We,invokeCommand:()=>Le,isMobile:()=>xt,moveCursor:()=>Ge,moveCursorToLine:()=>Ye,moveLineDown:()=>ht,moveLineUp:()=>gt,navigate:()=>Ee,newWindow:()=>je,openCommandPalette:()=>Fe,openPageNavigator:()=>$e,openSearchPanel:()=>ut,openUrl:()=>De,prompt:()=>Xe,rebuildEditorState:()=>_e,redo:()=>dt,reloadConfigAndCommands:()=>Ue,reloadPage:()=>Be,reloadUI:()=>Re,replaceRange:()=>Qe,save:()=>Te,sendMessage:()=>vt,setSelection:()=>Me,setText:()=>Se,setUiOption:()=>nt,showPanel:()=>Ne,showProgress:()=>Ve,toggleComment:()=>ft,toggleFold:()=>at,undo:()=>ct,unfold:()=>it,unfoldAll:()=>lt,uploadFile:()=>Oe,vimEx:()=>yt});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function be(){return r("editor.getCurrentPage")}function ve(){return r("editor.getCurrentPageMeta")}function xe(){return r("editor.getCurrentPath")}function we(){return r("editor.getRecentlyOpenedPages")}function Pe(){return r("editor.getCurrentEditor")}function ke(){return r("editor.getText")}function Se(e,t=!1){return r("editor.setText",e,t)}function Ce(){return r("editor.getCursor")}function Ae(){return r("editor.getSelection")}function Me(e,t){return r("editor.setSelection",e,t)}function Le(e,t){return r("editor.invokeCommand",e,t)}function Te(){return r("editor.save")}function Ee(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function $e(e="page"){return r("editor.openPageNavigator",e)}function Fe(){return r("editor.openCommandPalette")}function Be(){return r("editor.reloadPage")}function Re(){return r("editor.reloadUI")}function _e(){return r("editor.rebuildEditorState")}function Ue(){return r("editor.reloadConfigAndCommands")}function De(e,t=!1){return r("editor.openUrl",e,t)}function je(){return r("editor.newWindow")}function He(e){return r("editor.goHistory",e)}function Ie(e,t){return r("editor.downloadFile",e,t)}function Oe(e,t){return r("editor.uploadFile",e,t)}function Ke(e,t="info"){return r("editor.flashNotification",e,t)}function ze(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Ne(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function qe(e){return r("editor.hidePanel",e)}function Ve(e,t){return r("editor.showProgress",e,t)}function We(e,t){return r("editor.insertAtPos",e,t)}function Qe(e,t,n){return r("editor.replaceRange",e,t,n)}function Ge(e,t=!1){return r("editor.moveCursor",e,t)}function Ye(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function Je(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function Ze(e){return r("editor.dispatch",e)}function Xe(e,t=""){return r("editor.prompt",e,t)}function et(e){return r("editor.confirm",e)}function tt(e){return r("editor.alert",e)}function rt(e){return r("editor.getUiOption",e)}function nt(e,t){return r("editor.setUiOption",e,t)}function ot(){return r("editor.fold")}function it(){return r("editor.unfold")}function at(){return r("editor.toggleFold")}function st(){return r("editor.foldAll")}function lt(){return r("editor.unfoldAll")}function ct(){return r("editor.undo")}function dt(){return r("editor.redo")}function ut(){return r("editor.openSearchPanel")}function mt(e){return r("editor.copyToClipboard",e)}function pt(){return r("editor.deleteLine")}function ft(){return r("editor.toggleComment")}function gt(){return r("editor.moveLineUp")}function ht(){return r("editor.moveLineDown")}function yt(e){return r("editor.vimEx",e)}function bt(){return r("editor.configureVimMode")}function vt(e,t){return r("editor.sendMessage",e,t)}function xt(){return r("editor.isMobile")}var v={};F(v,{deleteDocument:()=>Rt,deleteFile:()=>Ot,deletePage:()=>Lt,fileExists:()=>Kt,getDocumentMeta:()=>$t,getFileMeta:()=>Ht,getPageMeta:()=>kt,listDocuments:()=>Et,listFiles:()=>_t,listPages:()=>Pt,listPlugs:()=>Tt,pageExists:()=>St,readDocument:()=>Ft,readFile:()=>Ut,readFileWithMeta:()=>jt,readPage:()=>Ct,readPageWithMeta:()=>At,readRef:()=>Dt,writeDocument:()=>Bt,writeFile:()=>It,writePage:()=>Mt});function Pt(){return r("space.listPages")}function kt(e){return r("space.getPageMeta",e)}function St(e){return r("space.pageExists",e)}function Ct(e){return r("space.readPage",e)}function At(e){return r("space.readPageWithMeta",e)}function Mt(e,t){return r("space.writePage",e,t)}function Lt(e){return r("space.deletePage",e)}function Tt(){return r("space.listPlugs")}function Et(){return r("space.listDocuments")}function $t(e){return r("space.getDocumentMeta",e)}function Ft(e){return r("space.readDocument",e)}function Bt(e,t){return r("space.writeDocument",e,t)}function Rt(e){return r("space.deleteDocument",e)}function _t(){return r("space.listFiles")}function Ut(e){return r("space.readFile",e)}function Dt(e){return r("space.readRef",e)}function jt(e){return r("space.readFileWithMeta",e)}function Ht(e){return r("space.getFileMeta",e)}function It(e,t){return r("space.writeFile",e,t)}function Ot(e){return r("space.deleteFile",e)}function Kt(e){return r("space.fileExists",e)}var R={};F(R,{cleanDatabases:()=>er,getBaseURI:()=>Yt,getConfig:()=>Zt,getMode:()=>Qt,getURLPrefix:()=>Gt,getVersion:()=>Jt,invokeCommand:()=>Nt,invokeFunction:()=>zt,listCommands:()=>qt,listSyscalls:()=>Vt,reloadPlugs:()=>Wt,wipeClient:()=>Xt});function zt(e,...t){return r("system.invokeFunction",e,...t)}function Nt(e,t){return r("system.invokeCommand",e,t)}function qt(){return r("system.listCommands")}function Vt(){return r("system.listSyscalls")}function Wt(){return r("system.reloadPlugs")}function Qt(){return r("system.getMode")}function Gt(){return r("system.getURLPrefix")}function Yt(){return r("system.getBaseURI")}function Jt(){return r("system.getVersion")}function Zt(e,t=void 0){return r("system.getConfig",e,t)}function Xt(e=!1){return r("system.wipeClient",e)}function er(){return r("system.cleanDatabases")}var Yr=new Uint8Array(16);var P={};F(P,{evalExpression:()=>pr,parse:()=>ur,parseExpression:()=>mr});function ur(e){return r("lua.parse",e)}function mr(e){return r("lua.parseExpression",e)}function pr(e){return r("lua.evalExpression",e)}var L={};F(L,{deleteObject:()=>wr,ensureFullIndex:()=>vr,getObjectByRef:()=>br,indexObjects:()=>gr,queryLuaObjects:()=>yr,reindexSpace:()=>xr,validateObjects:()=>hr});function gr(e,t){return r("index.indexObjects",e,t)}function hr(e,t){return r("index.validateObjects",e,t)}function yr(e,t,n){return r("index.queryLuaObjects",e,t,n)}function br(e,t,n){return r("index.getObjectByRef",e,t,n)}function vr(){return r("index.ensureFullIndex")}function xr(){return r("index.reindexSpace")}function wr(e,t,n){return r("index.deleteObject",e,t,n)}var T=!1,W=!1,Q=!1,J=new Set(["tags","itags","asTag","lastModified","pageDecoration","title"]),G={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date",file_type:"File type",related_cpd:"Related CPD",related_claims:"Related claims"},Pr={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",paths:"Path slugs this contributes to (e.g. uol-professor, advance-he-d4)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"criterion codes from the Path's framework that this addresses (e.g. 1.1, 2.3)",related_cpd:"[[wikilinks]] to CPD entries this evidence supports",related_claims:"[[wikilinks]] to claims this evidence supports",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},kr={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed","abandoned"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"],milestone:["planned","reached","missed"]},Sr={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"],file_type:["pdf","image","email","video","web","other"]};function Cr(e,t){return e==="status"?kr[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:Sr[e]??null}function Y(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function Z(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),i=n+4;e[i]===`
`&&i++;let a=[],s=null;for(let d of o.split(`
`)){let h=d.trim();if(h===""||h.startsWith("#")){s&&s.cont.push(d);continue}if(!d.startsWith(" ")&&!d.startsWith("	")){let y=d.match(/^([\w-]+):\s*(.*)$/);if(y){s&&a.push(s),s={key:y[1],headerValue:y[2],cont:[]};continue}}s&&s.cont.push(d)}s&&a.push(s);let c=[];for(let d of a){if(d.headerValue.trim()!==""){c.push({key:d.key,value:Y(d.headerValue),isList:!1});continue}let h=d.cont.filter(f=>f.trim()!==""&&!f.trim().startsWith("#"));if(h.length===0){c.push({key:d.key,value:[],isList:!0});continue}let y=/^(\s+)-\s+(.*)$/;if(h.every(f=>{let b=f.match(y);return b?!/:\s/.test(b[2]):!1})){let f=h.map(b=>Y(b.match(y)[2]));c.push({key:d.key,value:f,isList:!0})}else c.push({key:d.key,value:[],isList:!0,complex:!0,raw:d.cont.join(`
`)})}return{fields:c,rest:e.substring(i),fmStart:t,fmEnd:n}}function I(e){if(G[e])return G[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function Ar(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!J.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let s of o.value)n.push(`  - ${U(s)}`)}else n.push(`${o.key}: ${U(o.value)}`);continue}let a=t[o.key]??"";if(o.isList){let s=a.split(",").map(c=>c.trim()).filter(c=>c.length>0);n.push(`${o.key}:`);for(let c of s)n.push(`  - ${U(c)}`)}else n.push(`${o.key}: ${U(a.trim())}`)}return n.join(`
`)}function Mr(e){let t=e.split("/").pop()||e;return(t.replace(/^\d{4}-\d{2}-\d{2}-?/,"")||t).replace(/[-_]/g," ").replace(/\b(\p{L})/gu,o=>o.toUpperCase())}async function Lr(){try{let e=await P.parseExpression('p.type == "path"'),t=await L.queryLuaObjects("page",{objectVariable:"p",where:e})??[],n=[];for(let o of t){let a=(o?.name??"").replace(/^paths\//,"");!a||a.endsWith("-coverage")||n.push({slug:a,title:o?.title||a,framework:o?.framework||""})}return n.sort((o,i)=>o.title.localeCompare(i.title)),n}catch(e){return console.error("fetchAllPaths failed",e),[]}}async function Tr(e){if(!e)return[];try{let t=await P.parseExpression('c.type == "criterion" and c.framework == framework'),n=await L.queryLuaObjects("page",{objectVariable:"c",where:t},{framework:e})??[],o=[];for(let i of n){let a=i?.code||"";a&&o.push({code:a,title:i?.title||""})}return o.sort((i,a)=>i.code.localeCompare(a.code)),o}catch(t){return console.error("fetchCriteriaForFramework failed",t),[]}}async function Er(e){try{let t=await P.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await P.parseExpression("l.pageLastModified"),o=await L.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],i=new Set,a=[];for(let s of o){let c=s?.page??"";!c||i.has(c)||(i.add(c),a.push({ref:s?.ref??c,pageName:c}))}return a}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}function $r(e,t,n=[],o=[],i=!1,a={allPaths:[],criteria:[]},s=!1){let c=[],d=[],h=t.find(l=>l.key==="type")?.value??"";for(let l of t){if(J.has(l.key)||l.complex)continue;if(l.key==="type"){c.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${p(l.value)}</span></div></div>`);continue}let K=l.isList?l.value.join(", "):l.value;if(l.isList&&(l.key==="paths"||l.key==="standards")){let A=l.key==="paths"?a.allPaths.map(g=>({value:g.slug,label:g.title})):a.criteria.map(g=>({value:g.code,label:g.title?`${g.code} \u2014 ${g.title}`:g.code}));if(A.length>0){let g=p(I(l.key)),w=l.value.filter(M=>M&&M.trim()),ce=new Set(w),de=w.join(","),ue=A.map(M=>`<label class="multi-opt">
            <input type="checkbox" data-multi-key="${p(l.key)}" value="${p(M.value)}"${ce.has(M.value)?" checked":""}>
            <span class="multi-opt-label">${p(M.label)}</span>
          </label>`).join("");c.push(`<div class="row"><div class="k">${g}</div><input type="hidden" id="f-${l.key}" data-key="${l.key}" value="${p(de)}"><div class="multi-list">${ue}</div></div>`),d.push({key:l.key,list:l.isList});continue}}let z=Cr(l.key,h);if(z){let A=p(I(l.key)),g=['<option value="">\u2014</option>',...z.map(w=>`<option value="${p(w)}"${K===w?" selected":""}>${p(w)}</option>`)].join("");c.push(`<div class="row"><label class="k" for="f-${l.key}">${A}</label><select class="field" id="f-${l.key}" data-key="${l.key}">${g}</select></div>`)}else{let A=p(I(l.key))+(l.isList?' <span class="hint">(comma-separated)</span>':""),g=Pr[l.key],w=g?`<div class="field-hint">${p(g)}</div>`:"";c.push(`<div class="row"><label class="k" for="f-${l.key}">${A}</label><input class="field" id="f-${l.key}" data-key="${l.key}" value="${p(K)}">${w}</div>`)}d.push({key:l.key,list:l.isList})}let y=`
    <div class="search-container">
      <input type="text" id="search-input" class="field" placeholder="Search portfolio..." autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>`,m=t.length===0||c.length===0?"":`
    <div class="section" data-section="attrs">
      <div class="section-actions"><button class="btn" id="btn-save">Save changes</button></div>
      <div class="attrs">${c.join("")}</div>
    </div>`,f=Br(n),b=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(l=>`<li class="mention" data-page="${p(l.pageName)}"><div class="mention-ref">${p(Mr(l.pageName))}</div></li>`).join("")}</ul>
      </div>
    </details>`,S=`
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; background: #f8fafc; margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  .panel { padding: 0 1.1em 1.3em 1.1em; color: #1f2937; }
  
  /* Pinned search with 4.5em top spacing */
  .search-container { margin-top: 4.5em; margin-bottom: 1.5em; }
  
  .tabs { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.4em; gap: 0.5em; position: sticky; top: 0; background: #f8fafc; z-index: 10; padding-top: 1em; }
  .tab-btn { background: none; border: none; padding: 0.6em 0.8em; cursor: pointer; font-size: 0.85em; font-weight: 500; color: #6b7280; border-bottom: 2px solid transparent; transition: all 0.15s; }
  .tab-btn:hover { color: #4f46e5; }
  .tab-btn.active { color: #4f46e5; border-bottom-color: #4f46e5; }
  .tab-content { display: none; }
  .tab-content.active { display: block; }

  .section { margin-bottom: 1.4em; }
  .section > summary { list-style: none; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; gap: 0.6em; padding: 0.25em 0; }
  .section h2 { font-size: 0.74em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 0.5em; }
  .section .count { background: #eef2ff; color: #4338ca; border-radius: 999px; padding: 0.05em 0.55em; font-size: 0.85em; font-weight: 500; }
  .chev { color: #9ca3af; font-size: 0.9em; transition: transform 0.15s ease; }
  .section[open] > summary .chev { transform: rotate(180deg); }
  .section-body { padding-top: 0.85em; }
  .section-actions { display: flex; justify-content: flex-end; margin-bottom: 0.7em; }
  
  .tool-section { margin-bottom: 1.8em; }
  .tool-section h3 { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 0.7em 0; font-weight: 600; }
  .btn-tool { background: white; border: 1px solid #d1d5db; color: #111827; padding: 0.55em 0.9em; border-radius: 4px; cursor: pointer; font-size: 0.88em; font-family: inherit; transition: all 0.12s; width: fit-content; text-align: left; }
  .btn-tool:hover { background: #f9fafb; border-color: #9ca3af; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  
  .status-area { margin-top: 0.8em; font-size: 0.82em; color: #6b7280; line-height: 1.5; padding: 0.6em 0.8em; background: #f1f5f9; border-radius: 4px; }
  .status-area span { color: #1f2937; font-weight: 500; }

  .history-list { display: flex; flex-direction: column; gap: 0.2em; }
  .history-item { display: flex; align-items: center; justify-content: space-between; padding: 0.6em 0.7em; border-radius: 4px; border-bottom: 1px solid #f1f5f9; }
  .history-item:hover { background: #f8fafc; }
  .history-info { flex: 1; min-width: 0; }
  .history-date { font-size: 0.85em; font-weight: 600; color: #111827; margin-bottom: 0.1em; }
  .history-msg { font-size: 0.78em; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-actions { display: flex; gap: 0.2em; }
  .btn-icon { background: none; border: none; padding: 0.4em; cursor: pointer; color: #9ca3af; border-radius: 4px; transition: all 0.12s; display: flex; align-items: center; justify-content: center; }
  .btn-icon:hover { color: #4f46e5; background: #eef2ff; }

  .btn { background: #4f46e5; color: white; border: none; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn:hover { background: #4338ca; }
  .attrs { display: flex; flex-direction: column; gap: 0.95em; }
  .row { display: flex; flex-direction: column; gap: 0.3em; }
  .k { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 500; }
  .field { width: 100%; padding: 0.45em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.92em; font-family: inherit; color: #111827; background: white; }
  .field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.15); }
  .multi-list { display: flex; flex-direction: column; gap: 0.32em; padding: 0.5em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; max-height: 220px; overflow-y: auto; background: white; }
  .multi-opt { display: flex; align-items: center; gap: 0.5em; cursor: pointer; line-height: 1.3; padding: 0.15em 0.1em; border-radius: 3px; }
  .multi-opt:hover { background: #eef2ff; }
  .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 0.2em 0.65em; border-radius: 5px; font-size: 0.82em; font-weight: 500; }
  .empty { color: #6b7280; font-size: 0.85em; font-style: italic; padding: 1em 0; }
  .toc { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3em; }
  .toc-item { font-size: 0.9em; color: #1f2937; cursor: pointer; padding: 0.25em 0.4em; border-radius: 3px; line-height: 1.4; }
  .toc-item:hover { background: #eef2ff; color: #3730a3; }
  
  .search-results { display: flex; flex-direction: column; gap: 0.4em; margin-top: 0.8em; }
  .search-result { padding: 0.5em 0.6em; border-radius: 4px; cursor: pointer; line-height: 1.4; border-bottom: 1px solid rgba(128,128,128,0.1); }
  .search-result:hover { background: #eef2ff; }
  .search-title { font-size: 0.9em; font-weight: 600; color: #4f46e5; }
  .search-path { font-size: 0.72em; color: #6b7280; font-weight: 500; margin-bottom: 0.15em; }
  .search-snip { font-size: 0.82em; color: #4b5563; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .search-snip em { font-style: normal; background: rgba(79, 70, 229, 0.15); border-radius: 2px; }

  .section-danger { margin-top: 2em; padding-top: 1.2em; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; }
  .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.45em 1em; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; font-family: inherit; transition: all 0.12s; }
  .btn-danger:hover { background: #fee2e2; color: #991b1b; }

  .mentions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5em; }
  .mention { padding: 0.45em 0.55em; border-radius: 4px; cursor: pointer; line-height: 1.4; }
  .mention:hover { background: #eef2ff; }
  .mention-ref { font-size: 0.92em; color: #2563eb; font-weight: 500; word-break: break-word; }

  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .tabs { background: #0f172a; border-bottom-color: #1e293b; }
  html[data-theme="dark"] .tab-btn { color: #94a3b8; }
  html[data-theme="dark"] .tab-btn:hover { color: #818cf8; }
  html[data-theme="dark"] .tab-btn.active { color: #818cf8; border-bottom-color: #818cf8; }
  html[data-theme="dark"] .section h2, html[data-theme="dark"] .k, html[data-theme="dark"] .tool-section h3 { color: #94a3b8; }
  html[data-theme="dark"] .btn-tool { background: #1e293b; border-color: #334155; color: #f1f5f9; }
  html[data-theme="dark"] .btn-tool:hover { background: #334155; border-color: #475569; }
  html[data-theme="dark"] .status-area { background: #1e293b; color: #94a3b8; }
  html[data-theme="dark"] .status-area span { color: #f1f5f9; }
  html[data-theme="dark"] .history-item { border-bottom-color: #1e293b; }
  html[data-theme="dark"] .history-item:hover { background: #1e293b; }
  html[data-theme="dark"] .history-date { color: #f1f5f9; }
  html[data-theme="dark"] .field { background: #1e293b; border-color: #475569; color: #f1f5f9; }
  html[data-theme="dark"] .multi-list { background: #1e293b; border-color: #475569; }
  html[data-theme="dark"] .search-title { color: #818cf8; }
  html[data-theme="dark"] .search-result:hover { background: #1e293b; }
  html[data-theme="dark"] .badge { background: #312e81; color: #c7d2fe; }
</style>
<div id="panel" class="panel">
  ${y}
  <div class="tabs">
    <button class="tab-btn active" data-tab="page">Page</button>
    <button class="tab-btn" data-tab="tools">Tools</button>
    <button class="tab-btn" data-tab="history">History</button>
  </div>
  <div id="tab-page" class="tab-content active">
    ${f}
    ${m}
    ${b}
  </div>
  <div id="tab-tools" class="tab-content">
    ${`
    <div class="tool-section">
      <h3>Writing Quality</h3>
      <button class="btn-tool" id="btn-grammar">Check grammar & style</button>
    </div>
    <div class="tool-section">
      <h3>Link Checker</h3>
      <button class="btn-tool" id="btn-links">Check broken links</button>
    </div>
    <div class="tool-section">
      <h3>Cloud Backup</h3>
      <button class="btn-tool" id="btn-sync">Sync to cloud</button>
      <div id="backup-status" class="status-area">
        <div>Last run: <span id="last-run">...</span></div>
        <div>Status: <span id="status-text">...</span></div>
      </div>
    </div>
    ${i?"":`
    <div class="section-danger" style="margin-top: 3em;">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
  `}
  </div>
  <div id="tab-history" class="tab-content">
    
    <div class="tool-section">
      <h3>Time Machine</h3>
      <div id="history-list" class="history-list">
        <div class="empty">Loading snapshots...</div>
      </div>
    </div>
  
  </div>
</div>
`,x=JSON.stringify(d),C=JSON.stringify(e),se=JSON.stringify(s),le=`
(function() {
  var FIELDS = ${x};
  var PAGE = ${C};
  var FOCUS_SEARCH = ${se};

  function ls() { try { return window.parent.localStorage; } catch (_) { return null; } }

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

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      
      var store = ls();
      if (store) store.setItem('path-active-tab', tab);

      if (tab === 'tools') updateBackupStatus();
      if (tab === 'history') updateHistory();
    });
  });

  // Restore active tab
  var store = ls();
  if (store) {
    var activeTab = store.getItem('path-active-tab');
    if (activeTab && activeTab !== 'page') {
      var btn = document.querySelector('.tab-btn[data-tab="' + activeTab + '"]');
      if (btn) btn.click();
    }
  }

  async function updateBackupStatus() {
    try {
      var status = await syscall('system.invokeFunction', 'path.getBackupStatus');
      document.getElementById('last-run').textContent = status.lastRun || 'Never';
      document.getElementById('status-text').textContent = status.status || 'Unknown';
    } catch (e) {
      console.error('Backup status fetch failed', e);
    }
  }

  async function updateHistory() {
    var list = document.getElementById('history-list');
    try {
      var history = await syscall('system.invokeFunction', 'path.getHistory', PAGE);
      if (!history || history.length === 0) {
        list.innerHTML = '<div class="empty">No snapshots found.</div>';
        return;
      }
      list.innerHTML = history.map(function(item) {
        return \`
          <div class="history-item">
            <div class="history-info">
              <div class="history-date">\${item.date}</div>
              <div class="history-msg">\${item.message}</div>
            </div>
            <div class="history-actions">
              <button class="btn-icon btn-history-preview" data-id="\${item.id}" title="Preview snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </button>
              <button class="btn-icon btn-history-restore" data-id="\${item.id}" title="Restore snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            </div>
          </div>\`;
      }).join('');

      list.querySelectorAll('.btn-history-preview').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          await syscall('system.invokeCommand', 'Path: Preview History', btn.getAttribute('data-id'));
        });
      });
      list.querySelectorAll('.btn-history-restore').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          await syscall('system.invokeCommand', 'Path: Restore History', btn.getAttribute('data-id'));
        });
      });
    } catch (e) {
      list.innerHTML = '<div class="empty">History unavailable.</div>';
    }
  }

  // Tool buttons
  document.getElementById('btn-grammar')?.addEventListener('click', async function() {
    await syscall('system.invokeCommand', 'Path: LanguageTool');
  });
  document.getElementById('btn-links')?.addEventListener('click', async function() {
    await syscall('system.invokeCommand', 'Path: Lychee');
  });
  document.getElementById('btn-sync')?.addEventListener('click', async function() {
    await syscall('system.invokeCommand', 'Path: Rclone');
  });

  // Search logic
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var MEILI_URL = 'http://localhost:7700';
  var MEILI_KEY = 'masterKey123';

  if (searchInput) {
    if (FOCUS_SEARCH) setTimeout(function() { searchInput.focus(); }, 100);

    searchInput.addEventListener('input', async function(e) {
      var query = e.target.value;
      if (!query) { searchResults.innerHTML = ''; return; }
      try {
        var response = await fetch(MEILI_URL + '/indexes/pages/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + MEILI_KEY },
          body: JSON.stringify({ q: query, attributesToHighlight: ['content', 'title'], limit: 8 })
        });
        var data = await response.json();
        searchResults.innerHTML = (data.hits || []).map(function(hit) {
          var title = (hit._highlightResult && hit._highlightResult.title && hit._highlightResult.title.value) || hit.title;
          var snip = (hit._highlightResult && hit._highlightResult.content && hit._highlightResult.content.value) || '';
          return \`
            <div class="search-result" data-path="\${hit.path}">
              <div class="search-path">\${hit.path}</div>
              <div class="search-title">\${title}</div>
              <div class="search-snip">\${snip}</div>
            </div>\`;
        }).join('');

        document.querySelectorAll('.search-result').forEach(function(el) {
          el.addEventListener('click', async function() {
            await syscall('editor.navigate', el.getAttribute('data-path'));
          });
        });
      } catch (err) { searchResults.innerHTML = '<div class="empty">Search unavailable.</div>'; }
    });
  }

  // Attrs save
  document.getElementById('btn-save')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var values = {};
      FIELDS.forEach(function(f) {
        var inp = document.getElementById('f-' + f.key);
        if (inp) values[f.key] = inp.value;
      });
      await syscall('system.invokeFunction', 'path.saveAttributes', PAGE, values);
    } catch (e) {
      await syscall('editor.flashNotification', 'Save failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  // ToC clicks
  document.querySelectorAll('.toc-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var line = parseInt(el.getAttribute('data-line'), 10);
      if (!isNaN(line)) await syscall('editor.moveCursorToLine', line + 1, 0, true);
    });
  });

  // Delete button
  document.getElementById('btn-delete')?.addEventListener('click', async function() {
    if (window.confirm('Delete "' + PAGE + '"?')) {
      try {
        await syscall('space.deletePage', PAGE);
        await syscall('editor.navigate', 'index');
      } catch (e) {
        await syscall('editor.flashNotification', 'Delete failed: ' + String(e), 'error');
      }
    }
  });

  // Linked-mention clicks
  document.querySelectorAll('.mention').forEach(function(el) {
    el.addEventListener('click', async function() {
      await syscall('editor.navigate', el.getAttribute('data-page'));
    });
  });

  // Collapsible sections
  document.querySelectorAll('details.section').forEach(function(d) {
    var key = 'path-section-' + d.getAttribute('data-section');
    var v = store ? store.getItem(key) : null;
    if (v === '0') d.removeAttribute('open');
    else d.setAttribute('open', '');
    d.addEventListener('toggle', function() {
      if (store) store.setItem(key, d.open ? '1' : '0');
    });
  });
})();
`;return{html:S,script:le}}function Fr(e){let t=[],n=e,o=0;if(n.startsWith("---")){let s=n.indexOf(`
---`,4);if(s>=0){let c=s+4;o=n.substring(0,c).split(`
`).length,n=n.substring(c).replace(/^\n/,"")}}let i=n.split(`
`),a=!1;for(let s=0;s<i.length;s++){let c=i[s];if(c.startsWith("```")){a=!a;continue}if(a)continue;let d=c.match(/^(#{1,6})\s+(.+?)\s*$/);d&&t.push({level:d[1].length,text:d[2].replace(/[*_`]/g,""),line:o+s})}return t}function Br(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,i)=>{let a=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${i}" style="padding-left:${a}px;">${p(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function $(e=!1){let t=await u.getCurrentPage();if(!t){await u.hidePanel("rhs");return}let n="";try{n=await u.getText()}catch{n=""}if(!n)try{n=await v.readPage(t)}catch{n=""}if(!n){globalThis.setTimeout?.(()=>{$().catch(m=>console.error("showAttributesPanel retry",m))},250),await u.hidePanel("rhs");return}let o=Z(n),i=Fr(n),a=await Er(t),s=/^readonly:\s*true\s*$/m.test(n),c={allPaths:[],criteria:[]};if((o?.fields??[]).some(m=>m.isList&&(m.key==="paths"||m.key==="standards"))){let m=await Lr(),f=o?.fields.find(k=>k.key==="framework")?.value||"";if(!f){let k=o?.fields.find(x=>x.key==="path"),_=o?.fields.find(x=>x.key==="paths"),S="";if(k&&!k.isList?S=k.value:_&&_.isList&&(S=_.value.find(C=>C&&C.trim())??""),S){let x=m.find(C=>C.slug===S);x&&(f=x.framework)}}let b=f?await Tr(f):[];c={allPaths:m,criteria:b}}if(s&&(!o||o.fields.length===0)&&i.length===0&&a.length===0){await u.hidePanel("rhs");return}let{html:h,script:y}=$r(t,o?.fields??[],i,a,s,c,e);await u.showPanel("rhs",.7,h,y)}async function X(){T&&(T=!1,await E()),await $(!0)}async function O(e,t){let n=await v.readPage(e),o=Z(n);if(!o){await u.flashNotification("No frontmatter to save");return}let a=`---
${Ar(o.fields,t)}
---
${o.rest}`;if(a===n){await u.flashNotification("No changes");return}await v.writePage(e,a),await u.flashNotification("Saved"),await u.reloadPage()}var ee={plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',cpu:'<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'};function Rr(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ee[e]??""}</svg>`}async function _r(){try{let e=await v.readPage("_system/announcements-cache").catch(()=>"");if(!e)return 0;let t=e.match(/```json\s*([\s\S]*?)\s*```/);if(!t)return 0;let n=JSON.parse(t[1]).announcements??[],o=new Set;try{let i=await v.readPage("_system/announcements-read");o=new Set(Array.from(i.matchAll(/^- ([\w\-_.]+)$/gm)).map(a=>a[1]))}catch{}return n.filter(i=>i.id&&!o.has(i.id)).length}catch{return 0}}async function Ur(){let e=await _r(),n=[{title:"",items:[{label:"Capture",icon:"plus",command:"Path: Capture"}]},{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Evidence",icon:"paperclip",navigate:"Evidence"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Inbox",icon:"inbox",navigate:"Inbox"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[{label:"Setup",icon:"check-square",navigate:"Setup"},{label:"Announcements",icon:"bell",navigate:"Announcements",badge:e},{label:"History",icon:"clock",navigate:"History"},{label:"Export to Word",icon:"file-text",command:"Path: Export to Word"},{label:"AI context",icon:"cpu",navigate:"_system/mcp-context"},{label:"Manual",icon:"book-open",navigate:"manual/cheatsheet"},{label:"Add framework",icon:"download",command:"Path: Add framework"},{label:"About",icon:"info",navigate:"About"}]}].map(a=>{let s=a.title===""&&a.items.length===1&&a.items[0].command==="Path: Capture",c=s?"nav-item nav-capture":"nav-item",d=s?"section section-capture":"section",h=a.items.map(m=>{let f=m.navigate?`data-navigate="${p(m.navigate)}"`:`data-command="${p(m.command??"")}"`,b=m.badge&&m.badge>0?`<span class="nav-badge">${m.badge}</span>`:"";return`<li class="${c}" ${f}>${Rr(m.icon)}<span class="nav-label">${p(m.label)}</span>${b}</li>`}).join(""),y=a.title?`<h2>${p(a.title)}</h2>`:"";return`<div class="${d}">${y}<ul class="nav">${h}</ul></div>`}).join("");return{html:`
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
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ee.route}</svg>
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
`}}async function E(){let{html:e,script:t}=await Ur();await u.showPanel("lhs",.5,e,t)}async function te(){T?(T=!1,await Promise.all([E().catch(e=>console.error("showLeftPanel",e)),$().catch(e=>console.error("showAttributesPanel",e))])):(T=!0,await Promise.all([u.hidePanel("lhs"),u.hidePanel("rhs")]))}async function re(){if(!T){if(!W){W=!0;let e=await u.getCurrentPage();if(e&&e!=="Setup"){let t=!1;try{t=(await v.readPage("_system/onboarding")).includes("redirect: true")}catch{t=!0}if(t){try{await v.writePage("_system/onboarding",`redirect: false
`)}catch{}await u.navigate("Setup");return}}}Q||(Q=!0,(async()=>{try{await R.invokeCommand("Path: Refresh announcements (silent)"),await E().catch(()=>{})}catch{}})());try{await u.getCurrentPage()==="Announcements"&&globalThis.setTimeout?.(()=>{R.invokeCommand("Path: Mark all announcements as read").catch(()=>{})},600)}catch{}await Promise.all([E().catch(e=>console.error("showLeftPanel failed",e)),$().catch(e=>console.error("showAttributesPanel failed",e))])}}async function ne(){await u.flashNotification("Hello from the Path plug!")}async function oe(){let e=await u.getCurrentPage();if(!e){await u.flashNotification("No current page");return}await u.flashNotification(`debugSave: targeting ${e}`);try{await O(e,{title:"DEBUG_TEST"})}catch(t){let n=t instanceof Error?t.message:String(t);await u.flashNotification(`debugSave threw: ${n}`)}}var ie={hello:ne,showAttributesPanel:$,showLeftPanel:E,saveAttributes:O,debugSave:oe,onPageLoaded:re,toggleZenMode:te,search:X},ae={name:"path",functions:{hello:{path:"path.ts:hello",command:{name:"Path: Hello from plug"}},showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},showLeftPanel:{path:"path.ts:showLeftPanel",command:{name:"Path: Refresh navigator"}},saveAttributes:{path:"path.ts:saveAttributes"},debugSave:{path:"path.ts:debugSave",command:{name:"Path: Debug save (writes title=DEBUG_TEST)"}},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}},search:{path:"path.ts:search",command:{name:"Path: Search",key:"Ctrl-Shift-f"}}},assets:{}},kn={manifest:ae,functionMapping:ie};V(ie,ae,self.postMessage);export{kn as plug};
//# sourceMappingURL=path.plug.js.map
