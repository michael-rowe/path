var ve=Object.defineProperty;var B=(e,t)=>{for(var n in t)ve(e,n,{get:t[n],enumerable:!0})};function we(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function Y(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var qr=new Uint8Array(16),xe=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(s=>({...s,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(i){console.warn("Could not post logs to server",i.message),this.logBuffer.unshift(...o)}}}},J;function Pe(e=""){return J=new xe(e),J}var I=e=>{throw new Error("Not initialized yet")},z=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",K=new Map,N=0;z&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{N++,K.set(N,{resolve:n,reject:o}),I({type:"sys",id:N,name:e,args:t})}));function Z(e,t,n){z&&(I=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let s=e[i.name];if(!s)throw new Error(`Function not loaded: ${i.name}`);try{let a=await Promise.resolve(s(...i.args||[]));I({type:"invr",id:i.id,result:a})}catch(a){console.error("An exception was thrown as a result of invoking function",i.name,"error:",a.message),I({type:"invr",id:i.id,error:a.message})}}break;case"sysr":{let s=i.id,a=K.get(s);if(!a)throw Error("Invalid request id");K.delete(s),i.error?a.reject(new Error(i.error)):a.resolve(i.result)}break}})().catch(console.error)}),I({type:"manifest",manifest:t}),Pe(`[${t.name} plug]`))}async function ke(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?Y(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function Se(){globalThis.fetch=async(e,t)=>{let n=t?.body?Y(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await ke(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?we(o.base64Body):null,{status:o.status,headers:o.headers})}}z&&Se();var u={};B(u,{alert:()=>lt,configureVimMode:()=>Et,confirm:()=>st,copyToClipboard:()=>vt,deleteLine:()=>wt,dispatch:()=>it,downloadFile:()=>qe,filterBox:()=>Je,flashNotification:()=>Qe,fold:()=>ut,foldAll:()=>ht,getCurrentEditor:()=>Ae,getCurrentPage:()=>Ee,getCurrentPageMeta:()=>Ce,getCurrentPath:()=>Te,getCursor:()=>$e,getRecentlyOpenedPages:()=>Me,getSelection:()=>Re,getText:()=>Le,getUiOption:()=>ct,goHistory:()=>Ve,hidePanel:()=>Ze,insertAtCursor:()=>ot,insertAtPos:()=>et,invokeCommand:()=>Fe,isMobile:()=>Tt,moveCursor:()=>rt,moveCursorToLine:()=>nt,moveLineDown:()=>kt,moveLineUp:()=>Pt,navigate:()=>Ie,newWindow:()=>We,openCommandPalette:()=>je,openPageNavigator:()=>Oe,openSearchPanel:()=>bt,openUrl:()=>ze,prompt:()=>at,rebuildEditorState:()=>Ne,redo:()=>yt,reloadConfigAndCommands:()=>Ke,reloadPage:()=>He,reloadUI:()=>De,replaceRange:()=>tt,save:()=>Be,sendMessage:()=>Ct,setSelection:()=>Ue,setText:()=>_e,setUiOption:()=>dt,showPanel:()=>Ye,showProgress:()=>Xe,toggleComment:()=>xt,toggleFold:()=>mt,undo:()=>gt,unfold:()=>pt,unfoldAll:()=>ft,uploadFile:()=>Ge,vimEx:()=>St});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function Ee(){return r("editor.getCurrentPage")}function Ce(){return r("editor.getCurrentPageMeta")}function Te(){return r("editor.getCurrentPath")}function Me(){return r("editor.getRecentlyOpenedPages")}function Ae(){return r("editor.getCurrentEditor")}function Le(){return r("editor.getText")}function _e(e,t=!1){return r("editor.setText",e,t)}function $e(){return r("editor.getCursor")}function Re(){return r("editor.getSelection")}function Ue(e,t){return r("editor.setSelection",e,t)}function Fe(e,t){return r("editor.invokeCommand",e,t)}function Be(){return r("editor.save")}function Ie(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function Oe(e="page"){return r("editor.openPageNavigator",e)}function je(){return r("editor.openCommandPalette")}function He(){return r("editor.reloadPage")}function De(){return r("editor.reloadUI")}function Ne(){return r("editor.rebuildEditorState")}function Ke(){return r("editor.reloadConfigAndCommands")}function ze(e,t=!1){return r("editor.openUrl",e,t)}function We(){return r("editor.newWindow")}function Ve(e){return r("editor.goHistory",e)}function qe(e,t){return r("editor.downloadFile",e,t)}function Ge(e,t){return r("editor.uploadFile",e,t)}function Qe(e,t="info"){return r("editor.flashNotification",e,t)}function Je(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Ye(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function Ze(e){return r("editor.hidePanel",e)}function Xe(e,t){return r("editor.showProgress",e,t)}function et(e,t){return r("editor.insertAtPos",e,t)}function tt(e,t,n){return r("editor.replaceRange",e,t,n)}function rt(e,t=!1){return r("editor.moveCursor",e,t)}function nt(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function ot(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function it(e){return r("editor.dispatch",e)}function at(e,t=""){return r("editor.prompt",e,t)}function st(e){return r("editor.confirm",e)}function lt(e){return r("editor.alert",e)}function ct(e){return r("editor.getUiOption",e)}function dt(e,t){return r("editor.setUiOption",e,t)}function ut(){return r("editor.fold")}function pt(){return r("editor.unfold")}function mt(){return r("editor.toggleFold")}function ht(){return r("editor.foldAll")}function ft(){return r("editor.unfoldAll")}function gt(){return r("editor.undo")}function yt(){return r("editor.redo")}function bt(){return r("editor.openSearchPanel")}function vt(e){return r("editor.copyToClipboard",e)}function wt(){return r("editor.deleteLine")}function xt(){return r("editor.toggleComment")}function Pt(){return r("editor.moveLineUp")}function kt(){return r("editor.moveLineDown")}function St(e){return r("editor.vimEx",e)}function Et(){return r("editor.configureVimMode")}function Ct(e,t){return r("editor.sendMessage",e,t)}function Tt(){return r("editor.isMobile")}var b={};B(b,{deleteDocument:()=>Dt,deleteFile:()=>Gt,deletePage:()=>Ft,fileExists:()=>Qt,getDocumentMeta:()=>Ot,getFileMeta:()=>Vt,getPageMeta:()=>Lt,listDocuments:()=>It,listFiles:()=>Nt,listPages:()=>At,listPlugs:()=>Bt,pageExists:()=>_t,readDocument:()=>jt,readFile:()=>Kt,readFileWithMeta:()=>Wt,readPage:()=>$t,readPageWithMeta:()=>Rt,readRef:()=>zt,writeDocument:()=>Ht,writeFile:()=>qt,writePage:()=>Ut});function At(){return r("space.listPages")}function Lt(e){return r("space.getPageMeta",e)}function _t(e){return r("space.pageExists",e)}function $t(e){return r("space.readPage",e)}function Rt(e){return r("space.readPageWithMeta",e)}function Ut(e,t){return r("space.writePage",e,t)}function Ft(e){return r("space.deletePage",e)}function Bt(){return r("space.listPlugs")}function It(){return r("space.listDocuments")}function Ot(e){return r("space.getDocumentMeta",e)}function jt(e){return r("space.readDocument",e)}function Ht(e,t){return r("space.writeDocument",e,t)}function Dt(e){return r("space.deleteDocument",e)}function Nt(){return r("space.listFiles")}function Kt(e){return r("space.readFile",e)}function zt(e){return r("space.readRef",e)}function Wt(e){return r("space.readFileWithMeta",e)}function Vt(e){return r("space.getFileMeta",e)}function qt(e,t){return r("space.writeFile",e,t)}function Gt(e){return r("space.deleteFile",e)}function Qt(e){return r("space.fileExists",e)}var O={};B(O,{cleanDatabases:()=>sr,getBaseURI:()=>nr,getConfig:()=>ir,getMode:()=>tr,getURLPrefix:()=>rr,getVersion:()=>or,invokeCommand:()=>Yt,invokeFunction:()=>Jt,listCommands:()=>Zt,listSyscalls:()=>Xt,reloadPlugs:()=>er,wipeClient:()=>ar});function Jt(e,...t){return r("system.invokeFunction",e,...t)}function Yt(e,t){return r("system.invokeCommand",e,t)}function Zt(){return r("system.listCommands")}function Xt(){return r("system.listSyscalls")}function er(){return r("system.reloadPlugs")}function tr(){return r("system.getMode")}function rr(){return r("system.getURLPrefix")}function nr(){return r("system.getBaseURI")}function or(){return r("system.getVersion")}function ir(e,t=void 0){return r("system.getConfig",e,t)}function ar(e=!1){return r("system.wipeClient",e)}function sr(){return r("system.cleanDatabases")}var an=new Uint8Array(16);var P={};B(P,{evalExpression:()=>wr,parse:()=>br,parseExpression:()=>vr});function br(e){return r("lua.parse",e)}function vr(e){return r("lua.parseExpression",e)}function wr(e){return r("lua.evalExpression",e)}var E={};B(E,{deleteObject:()=>Mr,ensureFullIndex:()=>Cr,getObjectByRef:()=>Er,indexObjects:()=>Pr,queryLuaObjects:()=>Sr,reindexSpace:()=>Tr,validateObjects:()=>kr});function Pr(e,t){return r("index.indexObjects",e,t)}function kr(e,t){return r("index.validateObjects",e,t)}function Sr(e,t,n){return r("index.queryLuaObjects",e,t,n)}function Er(e,t,n){return r("index.getObjectByRef",e,t,n)}function Cr(){return r("index.ensureFullIndex")}function Tr(){return r("index.reindexSpace")}function Mr(e,t,n){return r("index.deleteObject",e,t,n)}var L=!1,X=!1,ee=!1,ne=new Set(["tags","itags","asTag","lastModified","pageDecoration","title","path_preview_of","path_preview_hash"]),te={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date",file_type:"File type",related_cpd:"Related CPD",related_claims:"Related claims"},Ar={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",paths:"Path slugs this contributes to (e.g. uol-professor, advance-he-d4)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"criterion codes from the Path's framework that this addresses (e.g. 1.1, 2.3)",related_cpd:"[[wikilinks]] to CPD entries this evidence supports",related_claims:"[[wikilinks]] to claims this evidence supports",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},Lr={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed","abandoned"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"],milestone:["planned","reached","missed"]},_r={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"],file_type:["pdf","image","email","video","web","other"]};function $r(e,t){return e==="status"?Lr[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:_r[e]??null}function re(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function D(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),i=n+4;e[i]===`
`&&i++;let s=[],a=null;for(let l of o.split(`
`)){let m=l.trim();if(m===""||m.startsWith("#")){a&&a.cont.push(l);continue}if(!l.startsWith(" ")&&!l.startsWith("	")){let f=l.match(/^([\w-]+):\s*(.*)$/);if(f){a&&s.push(a),a={key:f[1],headerValue:f[2],cont:[]};continue}}a&&a.cont.push(l)}a&&s.push(a);let c=[];for(let l of s){if(l.headerValue.trim()!==""){c.push({key:l.key,value:re(l.headerValue),isList:!1});continue}let m=l.cont.filter(h=>h.trim()!==""&&!h.trim().startsWith("#"));if(m.length===0){c.push({key:l.key,value:[],isList:!0});continue}let f=/^(\s+)-\s+(.*)$/;if(m.every(h=>{let v=h.match(f);return v?!/:\s/.test(v[2]):!1})){let h=m.map(v=>re(v.match(f)[2]));c.push({key:l.key,value:h,isList:!0})}else c.push({key:l.key,value:[],isList:!0,complex:!0,raw:l.cont.join(`
`)})}return{fields:c,rest:e.substring(i),fmStart:t,fmEnd:n}}function W(e){if(te[e])return te[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function Rr(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!ne.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let a of o.value)n.push(`  - ${j(a)}`)}else n.push(`${o.key}: ${j(o.value)}`);continue}let s=t[o.key]??"";if(o.isList){let a=s.split(",").map(c=>c.trim()).filter(c=>c.length>0);n.push(`${o.key}:`);for(let c of a)n.push(`  - ${j(c)}`)}else n.push(`${o.key}: ${j(s.trim())}`)}return n.join(`
`)}function Ur(e){let t=e.split("/").pop()||e;return(t.replace(/^\d{4}-\d{2}-\d{2}-?/,"")||t).replace(/[-_]/g," ").replace(/\b(\p{L})/gu,o=>o.toUpperCase())}async function Fr(){try{let e=await P.parseExpression('p.type == "path"'),t=await E.queryLuaObjects("page",{objectVariable:"p",where:e})??[],n=[];for(let o of t){let s=(o?.name??"").replace(/^paths\//,"");!s||s.endsWith("-coverage")||n.push({slug:s,title:o?.title||s,framework:o?.framework||""})}return n.sort((o,i)=>o.title.localeCompare(i.title)),n}catch(e){return console.error("fetchAllPaths failed",e),[]}}var V=null;async function Br(){if(V)return V;let e={meiliUrl:"http://localhost:7700",meiliKey:"masterKey",gitWatcherUrl:"http://localhost:8020",lycheeUrl:"http://localhost:8030",rcloneUrl:"http://localhost:8040",languageToolUrl:"http://localhost:8010"},t=e;try{let n=await b.readPage("_system/path-config"),o=D(n);if(o){let i=s=>{let a=o.fields.find(c=>c.key===s)?.value;return typeof a=="string"&&a?a:void 0};t={meiliUrl:i("meili_url")??e.meiliUrl,meiliKey:i("meili_key")??e.meiliKey,gitWatcherUrl:i("git_watcher_url")??e.gitWatcherUrl,lycheeUrl:i("lychee_url")??e.lycheeUrl,rcloneUrl:i("rclone_url")??e.rcloneUrl,languageToolUrl:i("languagetool_url")??e.languageToolUrl}}}catch{t=e}return V=t,t}async function Ir(e){if(!e)return[];try{let t=await P.parseExpression('c.type == "criterion" and c.framework == framework'),n=await E.queryLuaObjects("page",{objectVariable:"c",where:t},{framework:e})??[],o=[];for(let i of n){let s=i?.code||"";s&&o.push({code:s,title:i?.title||""})}return o.sort((i,s)=>i.code.localeCompare(s.code)),o}catch(t){return console.error("fetchCriteriaForFramework failed",t),[]}}async function Or(e){try{let t=await P.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await P.parseExpression("l.pageLastModified"),o=await E.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],i=new Set,s=[];for(let a of o){let c=a?.page??"";!c||i.has(c)||(i.add(c),s.push({ref:a?.ref??c,pageName:c}))}return s}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}var oe=`
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
`;function jr(e,t,n=[],o=[],i=!1,s={allPaths:[],criteria:[]},a=!1,c={meiliUrl:"http://localhost:7700",meiliKey:"masterKey",gitWatcherUrl:"http://localhost:8020",lycheeUrl:"http://localhost:8030",rcloneUrl:"http://localhost:8040",languageToolUrl:"http://localhost:8010"},l=null){let m=[],f=[],k=t.find(d=>d.key==="type")?.value??"";for(let d of t){if(ne.has(d.key)||d.complex)continue;if(d.key==="type"){m.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${p(d.value)}</span></div></div>`);continue}let G=d.isList?d.value.join(", "):d.value;if(d.isList&&(d.key==="paths"||d.key==="standards")){let M=d.key==="paths"?s.allPaths.map(g=>({value:g.slug,label:g.title})):s.criteria.map(g=>({value:g.code,label:g.title?`${g.code} \u2014 ${g.title}`:g.code}));if(M.length>0){let g=p(W(d.key)),x=d.value.filter(A=>A&&A.trim()),ge=new Set(x),ye=x.join(","),be=M.map(A=>`<label class="multi-opt">
            <input type="checkbox" data-multi-key="${p(d.key)}" value="${p(A.value)}"${ge.has(A.value)?" checked":""}>
            <span class="multi-opt-label">${p(A.label)}</span>
          </label>`).join("");m.push(`<div class="row"><div class="k">${g}</div><input type="hidden" id="f-${d.key}" data-key="${d.key}" value="${p(ye)}"><div class="multi-list">${be}</div></div>`),f.push({key:d.key,list:d.isList});continue}}let Q=$r(d.key,k);if(Q){let M=p(W(d.key)),g=['<option value="">\u2014</option>',...Q.map(x=>`<option value="${p(x)}"${G===x?" selected":""}>${p(x)}</option>`)].join("");m.push(`<div class="row"><label class="k" for="f-${d.key}">${M}</label><select class="field" id="f-${d.key}" data-key="${d.key}">${g}</select></div>`)}else{let M=p(W(d.key))+(d.isList?' <span class="hint">(comma-separated)</span>':""),g=Ar[d.key],x=g?`<div class="field-hint">${p(g)}</div>`:"";m.push(`<div class="row"><label class="k" for="f-${d.key}">${M}</label><input class="field" id="f-${d.key}" data-key="${d.key}" value="${p(G)}">${x}</div>`)}f.push({key:d.key,list:d.isList})}let h=`
    <div class="search-container">
      <input type="text" id="search-input" class="field" placeholder="Search portfolio..." autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>`,v=t.length===0||m.length===0?"":`
    <div class="section" data-section="attrs">
      <div class="section-actions"><button class="btn" id="btn-save">Save changes</button></div>
      <div class="attrs">${m.join("")}</div>
    </div>`,R=Dr(n),y=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(d=>`<li class="mention" data-page="${p(d.pageName)}"><div class="mention-ref">${p(Ur(d.pageName))}</div></li>`).join("")}</ul>
      </div>
    </details>`,S=`
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; background: #f8fafc; margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  .panel { padding: 0 1.1em 1.3em 1.1em; color: #1f2937; }
  
  /* Pinned search bar \u2014 clears the SB toolbar (position:fixed, ~44px)
     with a small breathing-space gap. 4.5em was overcompensating; 2.5em
     reads as deliberate spacing rather than glued-to-chrome. */
  .search-container { margin-top: 2.5em; margin-bottom: 1.2em; }
  
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
  /* Tool buttons: icon + label, left-accented in a per-button tint.
     Background stays light so they don't compete with the indigo Save
     CTA; hover deepens the accent. */
  .btn-tool { display: inline-flex; align-items: center; gap: 0.5em; background: white; border: 1px solid #d1d5db; border-left-width: 3px; color: #111827; padding: 0.5em 0.85em; border-radius: 4px; cursor: pointer; font-size: 0.88em; font-family: inherit; transition: all 0.12s; text-align: left; }
  .btn-tool:hover { box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
  .btn-tool .btn-tool-icon { flex-shrink: 0; }
  .btn-tool-grammar { border-left-color: #4f46e5; color: #1f2937; }
  .btn-tool-grammar .btn-tool-icon { color: #4f46e5; }
  .btn-tool-grammar:hover { background: #eef2ff; border-color: #c7d2fe; border-left-color: #4f46e5; }
  .btn-tool-links { border-left-color: #0d9488; color: #1f2937; }
  .btn-tool-links .btn-tool-icon { color: #0d9488; }
  .btn-tool-links:hover { background: #f0fdfa; border-color: #99f6e4; border-left-color: #0d9488; }
  .btn-tool:disabled { opacity: 0.55; cursor: progress; }
  
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

  /* Sticky inside the History tab so it stays visible as users scroll a long snapshot list.
     Top offset matches .tabs sticky bar height (~2.6em including padding). */
  .preview-banner { position: sticky; top: 3em; z-index: 9; margin-bottom: 1em; padding: 0.9em 1em; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; }
  .preview-banner-title { font-size: 0.92em; font-weight: 600; color: #3730a3; margin-bottom: 0.15em; }
  .preview-banner-title code, .preview-banner-sub code { background: rgba(79, 70, 229, 0.12); padding: 0.05em 0.4em; border-radius: 3px; font-size: 0.92em; }
  .preview-banner-sub { font-size: 0.82em; color: #4338ca; margin-bottom: 0.85em; word-break: break-word; }
  .preview-banner-actions { display: flex; gap: 0.5em; flex-wrap: wrap; }
  .btn-restore { background: #4f46e5; }
  .btn-restore:hover { background: #4338ca; }
  .btn-secondary { background: white; color: #4338ca; border: 1px solid #c7d2fe; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn-secondary:hover { background: #f5f3ff; }

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
  html[data-theme="dark"] .btn-tool:hover { background: #334155; }
  html[data-theme="dark"] .btn-tool-grammar { border-left-color: #818cf8; }
  html[data-theme="dark"] .btn-tool-grammar .btn-tool-icon { color: #a5b4fc; }
  html[data-theme="dark"] .btn-tool-grammar:hover { background: #1e1b4b; border-color: #312e81; border-left-color: #818cf8; }
  html[data-theme="dark"] .btn-tool-links { border-left-color: #2dd4bf; }
  html[data-theme="dark"] .btn-tool-links .btn-tool-icon { color: #5eead4; }
  html[data-theme="dark"] .btn-tool-links:hover { background: #042f2e; border-color: #134e4a; border-left-color: #2dd4bf; }
  html[data-theme="dark"] .status-area { background: #1e293b; color: #94a3b8; }
  html[data-theme="dark"] .status-area span { color: #f1f5f9; }
  html[data-theme="dark"] .history-item { border-bottom-color: #1e293b; }
  html[data-theme="dark"] .history-item:hover { background: #1e293b; }
  html[data-theme="dark"] .history-date { color: #f1f5f9; }
  html[data-theme="dark"] .toc-item { color: #cbd5e1; }
  html[data-theme="dark"] .toc-item:hover { background: #1e1b4b; color: #c7d2fe; }
  html[data-theme="dark"] .preview-banner { background: #1e1b4b; border-color: #312e81; }
  html[data-theme="dark"] .preview-banner-title { color: #c7d2fe; }
  html[data-theme="dark"] .preview-banner-sub { color: #a5b4fc; }
  html[data-theme="dark"] .btn-secondary { background: #1e293b; color: #c7d2fe; border-color: #312e81; }
  html[data-theme="dark"] .btn-secondary:hover { background: #312e81; }
  html[data-theme="dark"] .field { background: #1e293b; border-color: #475569; color: #f1f5f9; }
  html[data-theme="dark"] .multi-list { background: #1e293b; border-color: #475569; }
  html[data-theme="dark"] .search-title { color: #818cf8; }
  html[data-theme="dark"] .search-result:hover { background: #1e293b; }
  html[data-theme="dark"] .badge { background: #312e81; color: #c7d2fe; }
</style>
<div id="panel" class="panel">
  ${h}
  <div class="tabs">
    <button class="tab-btn ${l?"":"active"}" data-tab="page">Page</button>
    ${i&&!l?"":`
    <button class="tab-btn" data-tab="tools">Tools</button>
    <button class="tab-btn ${l?"active":""}" data-tab="history">History</button>`}
  </div>
  <div id="tab-page" class="tab-content ${l?"":"active"}">
    ${R}
    ${v}
    ${y}
  </div>
  ${i&&!l?"":`
  <div id="tab-tools" class="tab-content">
    ${`
    <div class="tool-section">
      <h3>Writing Quality</h3>
      <button class="btn-tool btn-tool-grammar" id="btn-grammar">
        <svg class="btn-tool-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
        <span>Check grammar &amp; style</span>
      </button>
    </div>
    <div class="tool-section">
      <h3>Link Checker</h3>
      <button class="btn-tool btn-tool-links" id="btn-links">
        <svg class="btn-tool-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span>Check broken links</span>
      </button>
    </div>
    ${i?"":`
    <div class="section-danger" style="margin-top: 3em;">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
  `}
  </div>
  <div id="tab-history" class="tab-content ${l?"active":""}">
    ${l?`
    <div class="preview-banner">
      <div class="preview-banner-title">Previewing snapshot <code>${p(l.hash.slice(0,7))}</code></div>
      <div class="preview-banner-sub">of <code>${p(l.originalPage)}</code></div>
      <div class="preview-banner-actions">
        <button class="btn btn-restore" id="btn-preview-restore">Restore this version</button>
        <button class="btn-secondary" id="btn-preview-back">Back to current</button>
      </div>
    </div>`:""}
    
    <div class="tool-section">
      <h3>Time Machine</h3>
      <div id="history-list" class="history-list">
        <div class="empty">Loading snapshots...</div>
      </div>
    </div>
  
  </div>`}
</div>
`,F=JSON.stringify(f),C=JSON.stringify(e),w=JSON.stringify(a),T=JSON.stringify(c),me=JSON.stringify(l?.originalPage??""),he=JSON.stringify(l?.hash??""),fe=`
(function() {
  var FIELDS = ${F};
  var PAGE = ${C};
  var FOCUS_SEARCH = ${w};
  var CFG = ${T};
  var MEILI_URL = CFG.meiliUrl;
  var MEILI_KEY = CFG.meiliKey;
  // Stored on window so previewSnapshot/restoreSnapshot can read them
  // without re-threading every call signature.
  window.PREVIEW_OF = ${me};
  window.PREVIEW_HASH = ${he};

  function ls() { try { return window.parent.localStorage; } catch (_) { return null; } }

  // Mirror the parent's theme into this iframe (shared helper).
  ${oe}

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

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleString();
    } catch (_) { return iso; }
  }

  async function updateHistory() {
    var list = document.getElementById('history-list');
    // In preview mode the iframe's PAGE is "_system/history-preview"; the
    // snapshot list users actually want is for the original page.
    var anchor = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
    try {
      var resp = await fetch(CFG.gitWatcherUrl + '/history?path=' + encodeURIComponent(anchor));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var history = data.history || [];
      if (history.length === 0) {
        list.innerHTML = '<div class="empty">No snapshots found.</div>';
        return;
      }
      list.innerHTML = history.map(function(item) {
        return \`
          <div class="history-item">
            <div class="history-info">
              <div class="history-date">\${fmtDate(item.timestamp)}</div>
              <div class="history-msg">\${item.message}</div>
            </div>
            <div class="history-actions">
              <button class="btn-icon btn-history-preview" data-hash="\${item.hash}" title="Preview snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </button>
              <button class="btn-icon btn-history-restore" data-hash="\${item.hash}" title="Restore snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            </div>
          </div>\`;
      }).join('');

      list.querySelectorAll('.btn-history-preview').forEach(function(btn) {
        btn.addEventListener('click', function() { previewSnapshot(btn.getAttribute('data-hash')); });
      });
      list.querySelectorAll('.btn-history-restore').forEach(function(btn) {
        btn.addEventListener('click', function() { restoreSnapshot(btn.getAttribute('data-hash')); });
      });
    } catch (e) {
      list.innerHTML = '<div class="empty">History unavailable \u2014 is the git-watcher sidecar running?</div>';
    }
  }

  async function fetchSnapshot(hash, page) {
    var p = page || PAGE;
    var url = CFG.gitWatcherUrl + '/version?path=' + encodeURIComponent(p) + '&hash=' + encodeURIComponent(hash);
    var resp = await fetch(url);
    if (!resp.ok) throw new Error('Snapshot not found');
    return await resp.json();
  }

  async function previewSnapshot(hash) {
    try {
      // ANCHOR is the page the snapshot belongs to: while *on* a preview
      // page, we're already showing snapshots for the original page (via
      // PREVIEW_OF rewiring of updateHistory), so a click on another
      // snapshot here previews from that same original \u2014 not from the
      // preview-of-the-preview.
      var anchor = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
      var data = await fetchSnapshot(hash, anchor);
      var previewPage = '_system/history-preview';
      // YAML carries the original page + hash so showAttributesPanel can
      // detect preview mode on next pageLoaded and inject the banner +
      // rewire the History tab.
      var yaml = '---\\nreadonly: true\\npath_preview_of: ' + anchor + '\\npath_preview_hash: ' + hash + '\\n---\\n\\n';
      await syscall('space.writePage', previewPage, yaml + data.content);
      await syscall('editor.navigate', previewPage);
    } catch (e) {
      await syscall('editor.flashNotification', 'Preview failed: ' + String(e));
    }
  }

  async function restoreSnapshot(hash) {
    // When called from inside a preview, target the original page (not
    // the preview file itself, which has no history of its own).
    var target = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
    if (!window.confirm('Restore "' + target + '" to snapshot ' + hash.slice(0, 7) + '? Unsaved changes will be lost.')) return;
    try {
      var data = await fetchSnapshot(hash, target);
      await syscall('space.writePage', target, data.content);
      await syscall('editor.flashNotification', 'Restored snapshot ' + hash.slice(0, 7));
      await syscall('editor.navigate', target);
    } catch (e) {
      await syscall('editor.flashNotification', 'Restore failed: ' + String(e));
    }
  }

  // Tool buttons \u2014 fetch directly from sidecars. Results for grammar/links
  // are written to a transient _system page and opened.
  document.getElementById('btn-grammar')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var text = await syscall('editor.getText');
      var body = 'text=' + encodeURIComponent(text) + '&language=en-GB';
      var resp = await fetch(CFG.languageToolUrl + '/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var matches = data.matches || [];
      var lines = ['---', 'readonly: true', '---', '', '# Grammar & style check', '', '*Source:* \`' + PAGE + '\`  ', '*Issues found:* ' + matches.length, ''];
      matches.forEach(function(m) {
        var ctx = (m.context && m.context.text) || '';
        lines.push('## ' + (m.shortMessage || m.message));
        lines.push('');
        lines.push('> ' + ctx);
        lines.push('');
        lines.push('*Rule:* ' + (m.rule && m.rule.id ? m.rule.id : '\u2014'));
        lines.push('');
      });
      await syscall('space.writePage', '_system/last-grammar-check', lines.join('\\n'));
      await syscall('editor.flashNotification', matches.length + ' issue(s) found.');
      await syscall('editor.navigate', '_system/last-grammar-check');
    } catch (e) {
      await syscall('editor.flashNotification', 'Grammar check failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  document.getElementById('btn-links')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var resp = await fetch(CFG.lycheeUrl + '/check?path=' + encodeURIComponent(PAGE));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var issues = data.issues || [];
      var lines = ['---', 'readonly: true', '---', '', '# Broken link check', '', '*Source:* \`' + PAGE + '\`  ', '*Broken / unreachable:* ' + issues.length, ''];
      issues.forEach(function(i) {
        lines.push('- **' + i.status + '** \u2014 ' + i.uri + (i.message ? ' (' + i.message + ')' : ''));
      });
      await syscall('space.writePage', '_system/last-link-check', lines.join('\\n'));
      await syscall('editor.flashNotification', issues.length + ' broken link(s).');
      await syscall('editor.navigate', '_system/last-link-check');
    } catch (e) {
      await syscall('editor.flashNotification', 'Link check failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  // Preview banner buttons (only present when in preview mode).
  document.getElementById('btn-preview-restore')?.addEventListener('click', function() {
    if (window.PREVIEW_HASH) restoreSnapshot(window.PREVIEW_HASH);
  });
  document.getElementById('btn-preview-back')?.addEventListener('click', function() {
    if (window.PREVIEW_OF) syscall('editor.navigate', window.PREVIEW_OF);
  });

  // Search logic
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

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
        if (!response.ok) {
          var errBody = '';
          try { errBody = await response.text(); } catch (_) {}
          searchResults.innerHTML = '<div class="empty">Meilisearch HTTP ' + response.status + ': ' + errBody.replace(/[<>]/g, '').slice(0, 200) + '</div>';
          return;
        }
        var data = await response.json();
        if (!data.hits || data.hits.length === 0) {
          searchResults.innerHTML = '<div class="empty">No results for "' + query.replace(/[<>]/g, '') + '". (Index has ' + (data.estimatedTotalHits || 0) + ' total hits for blank query \u2014 check meili-indexer is running.)</div>';
          return;
        }
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
      } catch (err) {
        searchResults.innerHTML = '<div class="empty">Search unavailable: ' + String(err).replace(/[<>]/g, '').slice(0, 200) + '</div>';
      }
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
`;return{html:S,script:fe}}function Hr(e){let t=[],n=e,o=0;if(n.startsWith("---")){let a=n.indexOf(`
---`,4);if(a>=0){let c=a+4;o=n.substring(0,c).split(`
`).length,n=n.substring(c).replace(/^\n/,"")}}let i=n.split(`
`),s=!1;for(let a=0;a<i.length;a++){let c=i[a];if(c.startsWith("```")){s=!s;continue}if(s)continue;let l=c.match(/^(#{1,6})\s+(.+?)\s*$/);l&&t.push({level:l[1].length,text:l[2].replace(/[*_`]/g,""),line:o+a})}return t}function Dr(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,i)=>{let s=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${i}" style="padding-left:${s}px;">${p(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function $(e=!1){let t=await u.getCurrentPage();if(!t){await u.hidePanel("rhs");return}let n="";try{n=await u.getText()}catch{n=""}if(!n)try{n=await b.readPage(t)}catch{n=""}if(!n){globalThis.setTimeout?.(()=>{$().catch(y=>console.error("showAttributesPanel retry",y))},250),await u.hidePanel("rhs");return}let o=D(n),i=Hr(n),s=await Or(t),a=/^readonly:\s*true\s*$/m.test(n),c={allPaths:[],criteria:[]};if((o?.fields??[]).some(y=>y.isList&&(y.key==="paths"||y.key==="standards"))){let y=await Fr(),U=o?.fields.find(S=>S.key==="framework")?.value||"";if(!U){let S=o?.fields.find(w=>w.key==="path"),F=o?.fields.find(w=>w.key==="paths"),C="";if(S&&!S.isList?C=S.value:F&&F.isList&&(C=F.value.find(T=>T&&T.trim())??""),C){let w=y.find(T=>T.slug===C);w&&(U=w.framework)}}let q=U?await Ir(U):[];c={allPaths:y,criteria:q}}if(a&&(!o||o.fields.length===0)&&i.length===0&&s.length===0){await u.hidePanel("rhs");return}let m=await Br(),f=o?.fields.find(y=>y.key==="path_preview_of")?.value,k=o?.fields.find(y=>y.key==="path_preview_hash")?.value,h=f&&k?{originalPage:f,hash:k}:null,{html:v,script:R}=jr(t,o?.fields??[],i,s,a,c,e,m,h);await u.showPanel("rhs",.7,v,R)}async function ie(){L&&(L=!1,await _(!0)),await $(!0)}async function ae(e,t){let n=await b.readPage(e),o=D(n);if(!o){await u.flashNotification("No frontmatter to save");return}let s=`---
${Rr(o.fields,t)}
---
${o.rest}`;if(s===n){await u.flashNotification("No changes");return}await b.writePage(e,s),await u.flashNotification("Saved"),await u.reloadPage()}var se={plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',cpu:'<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'};function Nr(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${se[e]??""}</svg>`}async function Kr(){try{let e=await b.readPage("_system/announcements-cache").catch(()=>"");if(!e)return 0;let t=e.match(/```json\s*([\s\S]*?)\s*```/);if(!t)return 0;let n=JSON.parse(t[1]).announcements??[],o=new Set;try{let i=await b.readPage("_system/announcements-read");o=new Set(Array.from(i.matchAll(/^- ([\w\-_.]+)$/gm)).map(s=>s[1]))}catch{}return n.filter(i=>i.id&&!o.has(i.id)).length}catch{return 0}}async function zr(){try{let e=await b.readPage("profile").catch(()=>""),n=D(e)?.fields.find(c=>c.key==="full_name")?.value;if(!n||!n.trim())return!1;let o=await b.readPage("_system/installed-frameworks").catch(()=>"");if(!/^\s*-?\s*slug:/m.test(o))return!1;let i=await P.parseExpression('p.type == "path" and p.status == "active"');return!!(await E.queryLuaObjects("page",{objectVariable:"p",where:i})??[]).some(c=>{let l=c?.name??"";if(!l.startsWith("paths/"))return!1;let m=l.replace(/^paths\//,"");return!!m&&!m.endsWith("-coverage")&&l!=="paths/index"})}catch{return!1}}function Wr(e,t){let o=[{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Evidence",icon:"paperclip",navigate:"Evidence"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Inbox",icon:"inbox",navigate:"Inbox"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[...t?[]:[{label:"Setup",icon:"check-square",navigate:"Setup"}],{label:"Announcements",icon:"bell",navigate:"Announcements",badge:e},{label:"Recent",icon:"clock",navigate:"Recent"}]}].map(a=>{let c=a.title===""&&a.items.length===1&&a.items[0].command==="Path: Capture",l=c?"nav-item nav-capture":"nav-item",m=c?"section section-capture":"section",f=a.items.map(h=>{let v=h.navigate?`data-navigate="${p(h.navigate)}"`:`data-command="${p(h.command??"")}"`,R=h.badge&&h.badge>0?`<span class="nav-badge">${h.badge}</span>`:"";return`<li class="${l}" ${v}>${Nr(h.icon)}<span class="nav-label">${p(h.label)}</span>${R}</li>`}).join(""),k=a.title?`<h2>${p(a.title)}</h2>`:"";return`<div class="${m}">${k}<ul class="nav">${f}</ul></div>`}).join(""),i=`
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 14px; background: #f8fafc; width: 220px; max-width: 220px; overflow-x: hidden; }
  * { box-sizing: border-box; }
  .panel { padding: 1.4em 1em 1.4em 1.1em; color: #1f2937; }
  .brand-row { display: flex; align-items: center; gap: 0.55em; margin: 0 0 0.15em 0; }
  .logo { width: 24px; height: 24px; color: #4f46e5; flex-shrink: 0; }
  .brand { font-size: 1.3em; font-weight: 600; letter-spacing: 0.01em; margin: 0; color: #111827; flex: 1; }
  .tagline { font-size: 0.78em; color: #6b7280; margin: 0 0 1em 0; font-style: italic; }
  .nav-divider { border: 0; border-top: 1px solid #e5e7eb; margin: 0 0 1.4em 0; }
  html[data-theme="dark"] .nav-divider { border-top-color: #1e293b; }
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
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${se.route}</svg>
    <h1 class="brand">Path</h1>
  </div>
  <p class="tagline">Career development for professionals</p>
  <hr class="nav-divider">
  ${o}
</div>
`,s=`
(function() {
  // Mirror the parent's theme into this iframe (shared helper).
  ${oe}

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
`;return{html:i,script:s}}var H=null;async function _(e=!1){let t=await Kr(),n=await zr();if(!e&&H&&H.unread===t&&H.onboarding===n)return;let{html:o,script:i}=Wr(t,n);await u.showPanel("lhs",.5,o,i),H={unread:t,onboarding:n}}async function le(){L?(L=!1,await Promise.all([_(!0).catch(e=>console.error("showLeftPanel",e)),$().catch(e=>console.error("showAttributesPanel",e))])):(L=!0,await Promise.all([u.hidePanel("lhs"),u.hidePanel("rhs")]))}async function ce(){if(!L){if(!X){X=!0;let e=await u.getCurrentPage();if(e&&e!=="Setup"){let t=!1;try{t=(await b.readPage("_system/onboarding")).includes("redirect: true")}catch{t=!0}if(t){try{await b.writePage("_system/onboarding",`redirect: false
`)}catch{}await u.navigate("Setup");return}}}ee||(ee=!0,(async()=>{try{await O.invokeCommand("Path: Refresh announcements (silent)"),await _().catch(()=>{})}catch{}})());try{await u.getCurrentPage()==="Announcements"&&globalThis.setTimeout?.(()=>{O.invokeCommand("Path: Mark all announcements as read").catch(()=>{})},600)}catch{}await Promise.all([_().catch(e=>console.error("showLeftPanel failed",e)),$().catch(e=>console.error("showAttributesPanel failed",e))])}}async function de(){await u.flashNotification("Starting sync...");try{let e=await fetch("http://172.28.0.11:8040/sync",{method:"POST"}),t=await e.json().catch(()=>({}));if(!e.ok){let n=t?.detail||`HTTP ${e.status}`;throw new Error(n)}await u.flashNotification("Sync started in background. Run again later to check status.")}catch(e){let t=e instanceof Error?e.message:String(e);await u.flashNotification(`Sync failed: ${t}`)}}var ue={showAttributesPanel:$,showLeftPanel:_,saveAttributes:ae,onPageLoaded:ce,toggleZenMode:le,search:ie,syncToCloud:de},pe={name:"path",requiredPermissions:["fetch"],functions:{showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},showLeftPanel:{path:"path.ts:showLeftPanel",command:{name:"Path: Refresh navigator"}},saveAttributes:{path:"path.ts:saveAttributes"},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}},search:{path:"path.ts:search",command:{name:"Path: Search",key:"Ctrl-Shift-f"}},syncToCloud:{path:"path.ts:syncToCloud",command:{name:"Path: Sync to cloud"}}},assets:{}},_n={manifest:pe,functionMapping:ue};Z(ue,pe,self.postMessage);export{_n as plug};
//# sourceMappingURL=path.plug.js.map
