var be=Object.defineProperty;var F=(e,t)=>{for(var n in t)be(e,n,{get:t[n],enumerable:!0})};function ve(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function J(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}var Wr=new Uint8Array(16),we=class{constructor(e="",t=1e3){this.prefix=e,this.maxCaptureSize=t,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=t=>(...n)=>{let o=this.prefix?[this.prefix,...n]:n;this.originalConsole[t](...o),this.captureLog(t,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,t){let n={level:e,timestamp:Date.now(),message:t.map(o=>{if(typeof o=="string")return o;try{return JSON.stringify(o)}catch{return String(o)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,t){if(this.logBuffer.length>0){let o=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o.map(a=>({...a,source:t})))})).ok)throw new Error("Failed to post logs to server")}catch(i){console.warn("Could not post logs to server",i.message),this.logBuffer.unshift(...o)}}}},Q;function xe(e=""){return Q=new we(e),Q}var B=e=>{throw new Error("Not initialized yet")},N=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",D=new Map,j=0;N&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{j++,D.set(j,{resolve:n,reject:o}),B({type:"sys",id:j,name:e,args:t})}));function Y(e,t,n){N&&(B=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let a=e[i.name];if(!a)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(a(...i.args||[]));B({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),B({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let a=i.id,s=D.get(a);if(!s)throw Error("Invalid request id");D.delete(a),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),B({type:"manifest",manifest:t}),xe(`[${t.name} plug]`))}async function Pe(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?J(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function ke(){globalThis.fetch=async(e,t)=>{let n=t?.body?J(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await Pe(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?ve(o.base64Body):null,{status:o.status,headers:o.headers})}}N&&ke();var u={};F(u,{alert:()=>st,configureVimMode:()=>St,confirm:()=>at,copyToClipboard:()=>bt,deleteLine:()=>vt,dispatch:()=>ot,downloadFile:()=>Ve,filterBox:()=>Qe,flashNotification:()=>Ge,fold:()=>dt,foldAll:()=>pt,getCurrentEditor:()=>Ae,getCurrentPage:()=>Se,getCurrentPageMeta:()=>Ee,getCurrentPath:()=>Ce,getCursor:()=>_e,getRecentlyOpenedPages:()=>Te,getSelection:()=>$e,getText:()=>Me,getUiOption:()=>lt,goHistory:()=>We,hidePanel:()=>Ye,insertAtCursor:()=>nt,insertAtPos:()=>Xe,invokeCommand:()=>Ue,isMobile:()=>Ct,moveCursor:()=>tt,moveCursorToLine:()=>rt,moveLineDown:()=>Pt,moveLineUp:()=>xt,navigate:()=>Be,newWindow:()=>ze,openCommandPalette:()=>He,openPageNavigator:()=>Ie,openSearchPanel:()=>yt,openUrl:()=>Ke,prompt:()=>it,rebuildEditorState:()=>De,redo:()=>gt,reloadConfigAndCommands:()=>Ne,reloadPage:()=>Oe,reloadUI:()=>je,replaceRange:()=>et,save:()=>Fe,sendMessage:()=>Et,setSelection:()=>Re,setText:()=>Le,setUiOption:()=>ct,showPanel:()=>Je,showProgress:()=>Ze,toggleComment:()=>wt,toggleFold:()=>mt,undo:()=>ft,unfold:()=>ut,unfoldAll:()=>ht,uploadFile:()=>qe,vimEx:()=>kt});typeof globalThis.syscall>"u"&&(globalThis.syscall=()=>{throw new Error("Not implemented here")});function r(e,...t){return globalThis.syscall(e,...t)}function Se(){return r("editor.getCurrentPage")}function Ee(){return r("editor.getCurrentPageMeta")}function Ce(){return r("editor.getCurrentPath")}function Te(){return r("editor.getRecentlyOpenedPages")}function Ae(){return r("editor.getCurrentEditor")}function Me(){return r("editor.getText")}function Le(e,t=!1){return r("editor.setText",e,t)}function _e(){return r("editor.getCursor")}function $e(){return r("editor.getSelection")}function Re(e,t){return r("editor.setSelection",e,t)}function Ue(e,t){return r("editor.invokeCommand",e,t)}function Fe(){return r("editor.save")}function Be(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function Ie(e="page"){return r("editor.openPageNavigator",e)}function He(){return r("editor.openCommandPalette")}function Oe(){return r("editor.reloadPage")}function je(){return r("editor.reloadUI")}function De(){return r("editor.rebuildEditorState")}function Ne(){return r("editor.reloadConfigAndCommands")}function Ke(e,t=!1){return r("editor.openUrl",e,t)}function ze(){return r("editor.newWindow")}function We(e){return r("editor.goHistory",e)}function Ve(e,t){return r("editor.downloadFile",e,t)}function qe(e,t){return r("editor.uploadFile",e,t)}function Ge(e,t="info"){return r("editor.flashNotification",e,t)}function Qe(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function Je(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function Ye(e){return r("editor.hidePanel",e)}function Ze(e,t){return r("editor.showProgress",e,t)}function Xe(e,t){return r("editor.insertAtPos",e,t)}function et(e,t,n){return r("editor.replaceRange",e,t,n)}function tt(e,t=!1){return r("editor.moveCursor",e,t)}function rt(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function nt(e,t=!1,n=!1){return r("editor.insertAtCursor",e,t,n)}function ot(e){return r("editor.dispatch",e)}function it(e,t=""){return r("editor.prompt",e,t)}function at(e){return r("editor.confirm",e)}function st(e){return r("editor.alert",e)}function lt(e){return r("editor.getUiOption",e)}function ct(e,t){return r("editor.setUiOption",e,t)}function dt(){return r("editor.fold")}function ut(){return r("editor.unfold")}function mt(){return r("editor.toggleFold")}function pt(){return r("editor.foldAll")}function ht(){return r("editor.unfoldAll")}function ft(){return r("editor.undo")}function gt(){return r("editor.redo")}function yt(){return r("editor.openSearchPanel")}function bt(e){return r("editor.copyToClipboard",e)}function vt(){return r("editor.deleteLine")}function wt(){return r("editor.toggleComment")}function xt(){return r("editor.moveLineUp")}function Pt(){return r("editor.moveLineDown")}function kt(e){return r("editor.vimEx",e)}function St(){return r("editor.configureVimMode")}function Et(e,t){return r("editor.sendMessage",e,t)}function Ct(){return r("editor.isMobile")}var v={};F(v,{deleteDocument:()=>jt,deleteFile:()=>qt,deletePage:()=>Ut,fileExists:()=>Gt,getDocumentMeta:()=>It,getFileMeta:()=>Wt,getPageMeta:()=>Mt,listDocuments:()=>Bt,listFiles:()=>Dt,listPages:()=>At,listPlugs:()=>Ft,pageExists:()=>Lt,readDocument:()=>Ht,readFile:()=>Nt,readFileWithMeta:()=>zt,readPage:()=>_t,readPageWithMeta:()=>$t,readRef:()=>Kt,writeDocument:()=>Ot,writeFile:()=>Vt,writePage:()=>Rt});function At(){return r("space.listPages")}function Mt(e){return r("space.getPageMeta",e)}function Lt(e){return r("space.pageExists",e)}function _t(e){return r("space.readPage",e)}function $t(e){return r("space.readPageWithMeta",e)}function Rt(e,t){return r("space.writePage",e,t)}function Ut(e){return r("space.deletePage",e)}function Ft(){return r("space.listPlugs")}function Bt(){return r("space.listDocuments")}function It(e){return r("space.getDocumentMeta",e)}function Ht(e){return r("space.readDocument",e)}function Ot(e,t){return r("space.writeDocument",e,t)}function jt(e){return r("space.deleteDocument",e)}function Dt(){return r("space.listFiles")}function Nt(e){return r("space.readFile",e)}function Kt(e){return r("space.readRef",e)}function zt(e){return r("space.readFileWithMeta",e)}function Wt(e){return r("space.getFileMeta",e)}function Vt(e,t){return r("space.writeFile",e,t)}function qt(e){return r("space.deleteFile",e)}function Gt(e){return r("space.fileExists",e)}var I={};F(I,{cleanDatabases:()=>ar,getBaseURI:()=>rr,getConfig:()=>or,getMode:()=>er,getURLPrefix:()=>tr,getVersion:()=>nr,invokeCommand:()=>Jt,invokeFunction:()=>Qt,listCommands:()=>Yt,listSyscalls:()=>Zt,reloadPlugs:()=>Xt,wipeClient:()=>ir});function Qt(e,...t){return r("system.invokeFunction",e,...t)}function Jt(e,t){return r("system.invokeCommand",e,t)}function Yt(){return r("system.listCommands")}function Zt(){return r("system.listSyscalls")}function Xt(){return r("system.reloadPlugs")}function er(){return r("system.getMode")}function tr(){return r("system.getURLPrefix")}function rr(){return r("system.getBaseURI")}function nr(){return r("system.getVersion")}function or(e,t=void 0){return r("system.getConfig",e,t)}function ir(e=!1){return r("system.wipeClient",e)}function ar(){return r("system.cleanDatabases")}var nn=new Uint8Array(16);var S={};F(S,{evalExpression:()=>vr,parse:()=>yr,parseExpression:()=>br});function yr(e){return r("lua.parse",e)}function br(e){return r("lua.parseExpression",e)}function vr(e){return r("lua.evalExpression",e)}var M={};F(M,{deleteObject:()=>Tr,ensureFullIndex:()=>Er,getObjectByRef:()=>Sr,indexObjects:()=>xr,queryLuaObjects:()=>kr,reindexSpace:()=>Cr,validateObjects:()=>Pr});function xr(e,t){return r("index.indexObjects",e,t)}function Pr(e,t){return r("index.validateObjects",e,t)}function kr(e,t,n){return r("index.queryLuaObjects",e,t,n)}function Sr(e,t,n){return r("index.getObjectByRef",e,t,n)}function Er(){return r("index.ensureFullIndex")}function Cr(){return r("index.reindexSpace")}function Tr(e,t,n){return r("index.deleteObject",e,t,n)}var L=!1,Z=!1,X=!1,re=new Set(["tags","itags","asTag","lastModified","pageDecoration","title","path_preview_of","path_preview_hash"]),ee={full_name:"Full name",job_title:"Job title",activity_type:"Activity type",claim_type:"Claim type",last_updated:"Last updated",reflection_brief:"Reflection brief",post_nominals:"Post-nominals",preferred_name:"Preferred name",relationship_type:"Relationship",shared_interests:"Shared interests",met_via:"Met via",introduction_from:"Introduction from",last_contact:"Last contact",next_contact:"Next contact",credential_type:"Credential type",badge_url:"Badge URL",badge_image:"Badge image",verification_url:"Verification URL",award_date:"Award date",file_type:"File type",related_cpd:"Related CPD",related_claims:"Related claims"},Ar={framework:"e.g. UoL-TSPP-Professor",hours:"decimal number",date:"YYYY-MM-DD",last_updated:"YYYY-MM-DD",path:"slug of a Path page (e.g. uol-professor)",paths:"Path slugs this contributes to (e.g. uol-professor, advance-he-d4)",standard:"code from the framework (e.g. 1.1)",evidence:"[[wikilinks]] to evidence pages",standards:"criterion codes from the Path's framework that this addresses (e.g. 1.1, 2.3)",related_cpd:"[[wikilinks]] to CPD entries this evidence supports",related_claims:"[[wikilinks]] to claims this evidence supports",orcid:"URL or 0000-0000-0000-0000",scholar:"Google Scholar profile URL",linkedin:"LinkedIn profile URL",github:"GitHub username or URL",mastodon:"@user@instance",pronouns:"e.g. she/her, they/them",expertise:"comma-separated tags, e.g. AI-education, qualitative-research",shared_interests:"comma-separated topics you both care about",met_via:"e.g. AMEE-2024, introduction-from-X, professional-body"},Mr={"cpd-claim":["draft","ready","published"],cpd:["draft","complete"],capture:["unprocessed","processed"],path:["active","planned","paused","completed","abandoned"],"personal-statement":["draft","ready"],contact:["active","occasional","dormant","former"],milestone:["planned","reached","missed"]},Lr={claim_type:["evidence","forward-looking"],activity_type:["conference","course","workshop","project","teaching","supervision","reading","writing","other"],relationship_type:["collaborator","mentor","mentee","peer","senior-colleague","conference-contact","professional-body","student","other"],credential_type:["open-badge","certification","degree","fellowship","membership","other"],file_type:["pdf","image","email","video","web","other"]};function _r(e,t){return e==="status"?Mr[t]??null:e==="framework"&&t==="reflection"?["gibbs","era","driscoll","rolfe"]:Lr[e]??null}function te(e){let t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1):t}function z(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return null;let t=e.indexOf(`
`)+1,n=e.indexOf(`
---`,t);if(n<0)return null;let o=e.substring(t,n),i=n+4;e[i]===`
`&&i++;let a=[],s=null;for(let c of o.split(`
`)){let p=c.trim();if(p===""||p.startsWith("#")){s&&s.cont.push(c);continue}if(!c.startsWith(" ")&&!c.startsWith("	")){let h=c.match(/^([\w-]+):\s*(.*)$/);if(h){s&&a.push(s),s={key:h[1],headerValue:h[2],cont:[]};continue}}s&&s.cont.push(c)}s&&a.push(s);let d=[];for(let c of a){if(c.headerValue.trim()!==""){d.push({key:c.key,value:te(c.headerValue),isList:!1});continue}let p=c.cont.filter(b=>b.trim()!==""&&!b.trim().startsWith("#"));if(p.length===0){d.push({key:c.key,value:[],isList:!0});continue}let h=/^(\s+)-\s+(.*)$/;if(p.every(b=>{let w=b.match(h);return w?!/:\s/.test(w[2]):!1})){let b=p.map(w=>te(w.match(h)[2]));d.push({key:c.key,value:b,isList:!0})}else d.push({key:c.key,value:[],isList:!0,complex:!0,raw:c.cont.join(`
`)})}return{fields:d,rest:e.substring(i),fmStart:t,fmEnd:n}}function K(e){if(ee[e])return ee[e];let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(e){return e===""||/[:#"'\n]/.test(e)||/^\s|\s$/.test(e)?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:e}function $r(e,t){let n=[];for(let o of e){if(o.complex){n.push(`${o.key}:`),o.raw&&n.push(o.raw);continue}if(!(!re.has(o.key)&&o.key!=="type")){if(o.isList){n.push(`${o.key}:`);for(let s of o.value)n.push(`  - ${H(s)}`)}else n.push(`${o.key}: ${H(o.value)}`);continue}let a=t[o.key]??"";if(o.isList){let s=a.split(",").map(d=>d.trim()).filter(d=>d.length>0);n.push(`${o.key}:`);for(let d of s)n.push(`  - ${H(d)}`)}else n.push(`${o.key}: ${H(a.trim())}`)}return n.join(`
`)}function Rr(e){let t=e.split("/").pop()||e;return(t.replace(/^\d{4}-\d{2}-\d{2}-?/,"")||t).replace(/[-_]/g," ").replace(/\b(\p{L})/gu,o=>o.toUpperCase())}async function Ur(){try{let e=await S.parseExpression('p.type == "path"'),t=await M.queryLuaObjects("page",{objectVariable:"p",where:e})??[],n=[];for(let o of t){let a=(o?.name??"").replace(/^paths\//,"");!a||a.endsWith("-coverage")||n.push({slug:a,title:o?.title||a,framework:o?.framework||""})}return n.sort((o,i)=>o.title.localeCompare(i.title)),n}catch(e){return console.error("fetchAllPaths failed",e),[]}}async function Fr(){let e={meiliUrl:"http://localhost:7700",meiliKey:"masterKey",gitWatcherUrl:"http://localhost:8020",lycheeUrl:"http://localhost:8030",rcloneUrl:"http://localhost:8040",languageToolUrl:"http://localhost:8010"};try{let t=await v.readPage("_system/path-config"),n=z(t);if(!n)return e;let o=i=>{let a=n.fields.find(s=>s.key===i)?.value;return typeof a=="string"&&a?a:void 0};return{meiliUrl:o("meili_url")??e.meiliUrl,meiliKey:o("meili_key")??e.meiliKey,gitWatcherUrl:o("git_watcher_url")??e.gitWatcherUrl,lycheeUrl:o("lychee_url")??e.lycheeUrl,rcloneUrl:o("rclone_url")??e.rcloneUrl,languageToolUrl:o("languagetool_url")??e.languageToolUrl}}catch{return e}}async function Br(e){if(!e)return[];try{let t=await S.parseExpression('c.type == "criterion" and c.framework == framework'),n=await M.queryLuaObjects("page",{objectVariable:"c",where:t},{framework:e})??[],o=[];for(let i of n){let a=i?.code||"";a&&o.push({code:a,title:i?.title||""})}return o.sort((i,a)=>i.code.localeCompare(a.code)),o}catch(t){return console.error("fetchCriteriaForFramework failed",t),[]}}async function Ir(e){try{let t=await S.parseExpression("l.page ~= pageName and l.toPage == pageName"),n=await S.parseExpression("l.pageLastModified"),o=await M.queryLuaObjects("link",{objectVariable:"l",where:t,orderBy:[{expr:n,desc:!0}],limit:50},{pageName:e})??[],i=new Set,a=[];for(let s of o){let d=s?.page??"";!d||i.has(d)||(i.add(d),a.push({ref:s?.ref??d,pageName:d}))}return a}catch(t){return console.error("fetchLinkedMentions failed",t),[]}}function Hr(e,t,n=[],o=[],i=!1,a={allPaths:[],criteria:[]},s=!1,d={meiliUrl:"http://localhost:7700",meiliKey:"masterKey",gitWatcherUrl:"http://localhost:8020",lycheeUrl:"http://localhost:8030",rcloneUrl:"http://localhost:8040",languageToolUrl:"http://localhost:8010"},c=null){let p=[],h=[],g=t.find(l=>l.key==="type")?.value??"";for(let l of t){if(re.has(l.key)||l.complex)continue;if(l.key==="type"){p.push(`<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${m(l.value)}</span></div></div>`);continue}let q=l.isList?l.value.join(", "):l.value;if(l.isList&&(l.key==="paths"||l.key==="standards")){let T=l.key==="paths"?a.allPaths.map(f=>({value:f.slug,label:f.title})):a.criteria.map(f=>({value:f.code,label:f.title?`${f.code} \u2014 ${f.title}`:f.code}));if(T.length>0){let f=m(K(l.key)),P=l.value.filter(A=>A&&A.trim()),fe=new Set(P),ge=P.join(","),ye=T.map(A=>`<label class="multi-opt">
            <input type="checkbox" data-multi-key="${m(l.key)}" value="${m(A.value)}"${fe.has(A.value)?" checked":""}>
            <span class="multi-opt-label">${m(A.label)}</span>
          </label>`).join("");p.push(`<div class="row"><div class="k">${f}</div><input type="hidden" id="f-${l.key}" data-key="${l.key}" value="${m(ge)}"><div class="multi-list">${ye}</div></div>`),h.push({key:l.key,list:l.isList});continue}}let G=_r(l.key,g);if(G){let T=m(K(l.key)),f=['<option value="">\u2014</option>',...G.map(P=>`<option value="${m(P)}"${q===P?" selected":""}>${m(P)}</option>`)].join("");p.push(`<div class="row"><label class="k" for="f-${l.key}">${T}</label><select class="field" id="f-${l.key}" data-key="${l.key}">${f}</select></div>`)}else{let T=m(K(l.key))+(l.isList?' <span class="hint">(comma-separated)</span>':""),f=Ar[l.key],P=f?`<div class="field-hint">${m(f)}</div>`:"";p.push(`<div class="row"><label class="k" for="f-${l.key}">${T}</label><input class="field" id="f-${l.key}" data-key="${l.key}" value="${m(q)}">${P}</div>`)}h.push({key:l.key,list:l.isList})}let b=`
    <div class="search-container">
      <input type="text" id="search-input" class="field" placeholder="Search portfolio..." autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>`,w=t.length===0||p.length===0?"":`
    <div class="section" data-section="attrs">
      <div class="section-actions"><button class="btn" id="btn-save">Save changes</button></div>
      <div class="attrs">${p.join("")}</div>
    </div>`,O=jr(n),y=o.length===0?"":`
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${o.length}</span></h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${o.map(l=>`<li class="mention" data-page="${m(l.pageName)}"><div class="mention-ref">${m(Rr(l.pageName))}</div></li>`).join("")}</ul>
      </div>
    </details>`,k=`
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
  html[data-theme="dark"] .btn-tool:hover { background: #334155; border-color: #475569; }
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
  ${b}
  <div class="tabs">
    <button class="tab-btn ${c?"":"active"}" data-tab="page">Page</button>
    <button class="tab-btn" data-tab="tools">Tools</button>
    <button class="tab-btn ${c?"active":""}" data-tab="history">History</button>
  </div>
  <div id="tab-page" class="tab-content ${c?"":"active"}">
    ${O}
    ${w}
    ${y}
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
    ${i?"":`
    <div class="section-danger" style="margin-top: 3em;">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
  `}
  </div>
  <div id="tab-history" class="tab-content ${c?"active":""}">
    ${c?`
    <div class="preview-banner">
      <div class="preview-banner-title">Previewing snapshot <code>${m(c.hash.slice(0,7))}</code></div>
      <div class="preview-banner-sub">of <code>${m(c.originalPage)}</code></div>
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
  
  </div>
</div>
`,U=JSON.stringify(h),E=JSON.stringify(e),x=JSON.stringify(s),C=JSON.stringify(d),me=JSON.stringify(c?.originalPage??""),pe=JSON.stringify(c?.hash??""),he=`
(function() {
  var FIELDS = ${U};
  var PAGE = ${E};
  var FOCUS_SEARCH = ${x};
  var CFG = ${C};
  var MEILI_URL = CFG.meiliUrl;
  var MEILI_KEY = CFG.meiliKey;
  // Stored on window so previewSnapshot/restoreSnapshot can read them
  // without re-threading every call signature.
  window.PREVIEW_OF = ${me};
  window.PREVIEW_HASH = ${pe};

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
`;return{html:k,script:he}}function Or(e){let t=[],n=e,o=0;if(n.startsWith("---")){let s=n.indexOf(`
---`,4);if(s>=0){let d=s+4;o=n.substring(0,d).split(`
`).length,n=n.substring(d).replace(/^\n/,"")}}let i=n.split(`
`),a=!1;for(let s=0;s<i.length;s++){let d=i[s];if(d.startsWith("```")){a=!a;continue}if(a)continue;let c=d.match(/^(#{1,6})\s+(.+?)\s*$/);c&&t.push({level:c[1].length,text:c[2].replace(/[*_`]/g,""),line:o+s})}return t}function jr(e){if(e.length===0)return"";let t=Math.min(...e.map(o=>o.level));return`
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">\u25BE</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${e.map((o,i)=>{let a=(o.level-t)*12;return`<li class="toc-item" data-line="${o.line}" data-idx="${i}" style="padding-left:${a}px;">${m(o.text)}</li>`}).join("")}</ul>
      </div>
    </details>
  `}async function $(e=!1){let t=await u.getCurrentPage();if(!t){await u.hidePanel("rhs");return}let n="";try{n=await u.getText()}catch{n=""}if(!n)try{n=await v.readPage(t)}catch{n=""}if(!n){globalThis.setTimeout?.(()=>{$().catch(y=>console.error("showAttributesPanel retry",y))},250),await u.hidePanel("rhs");return}let o=z(n),i=Or(n),a=await Ir(t),s=/^readonly:\s*true\s*$/m.test(n),d={allPaths:[],criteria:[]};if((o?.fields??[]).some(y=>y.isList&&(y.key==="paths"||y.key==="standards"))){let y=await Ur(),R=o?.fields.find(k=>k.key==="framework")?.value||"";if(!R){let k=o?.fields.find(x=>x.key==="path"),U=o?.fields.find(x=>x.key==="paths"),E="";if(k&&!k.isList?E=k.value:U&&U.isList&&(E=U.value.find(C=>C&&C.trim())??""),E){let x=y.find(C=>C.slug===E);x&&(R=x.framework)}}let V=R?await Br(R):[];d={allPaths:y,criteria:V}}if(s&&(!o||o.fields.length===0)&&i.length===0&&a.length===0){await u.hidePanel("rhs");return}let p=await Fr(),h=o?.fields.find(y=>y.key==="path_preview_of")?.value,g=o?.fields.find(y=>y.key==="path_preview_hash")?.value,b=h&&g?{originalPage:h,hash:g}:null,{html:w,script:O}=Hr(t,o?.fields??[],i,a,s,d,e,p,b);await u.showPanel("rhs",.7,w,O)}async function ne(){L&&(L=!1,await _()),await $(!0)}async function W(e,t){let n=await v.readPage(e),o=z(n);if(!o){await u.flashNotification("No frontmatter to save");return}let a=`---
${$r(o.fields,t)}
---
${o.rest}`;if(a===n){await u.flashNotification("No changes");return}await v.writePage(e,a),await u.flashNotification("Saved"),await u.reloadPage()}var oe={plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',"plus-circle":'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',"edit-3":'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',"pen-tool":'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',repeat:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',"file-down":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',"check-square":'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',"refresh-cw":'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',focus:'<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',"sidebar-collapse":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',"sidebar-expand":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',cpu:'<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'};function Dr(e){return`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${oe[e]??""}</svg>`}async function Nr(){try{let e=await v.readPage("_system/announcements-cache").catch(()=>"");if(!e)return 0;let t=e.match(/```json\s*([\s\S]*?)\s*```/);if(!t)return 0;let n=JSON.parse(t[1]).announcements??[],o=new Set;try{let i=await v.readPage("_system/announcements-read");o=new Set(Array.from(i.matchAll(/^- ([\w\-_.]+)$/gm)).map(a=>a[1]))}catch{}return n.filter(i=>i.id&&!o.has(i.id)).length}catch{return 0}}async function Kr(){let e=await Nr(),n=[{title:"",items:[{label:"Capture",icon:"plus",command:"Path: Capture"}]},{title:"Browse",items:[{label:"All Paths",icon:"compass",navigate:"paths/index"},{label:"Claims",icon:"feather",navigate:"Claims"},{label:"CPD activities",icon:"calendar",navigate:"CPD"},{label:"Reflections",icon:"repeat",navigate:"Reflections"},{label:"Evidence",icon:"paperclip",navigate:"Evidence"},{label:"Network",icon:"users",navigate:"Network"},{label:"Credentials",icon:"award",navigate:"Credentials"},{label:"Captures",icon:"bookmark",navigate:"Captures"},{label:"Inbox",icon:"inbox",navigate:"Inbox"},{label:"Tasks",icon:"check-square",navigate:"Tasks"},{label:"All pages",icon:"layers",navigate:"Browse"}]},{title:"Workspace",items:[{label:"Setup",icon:"check-square",navigate:"Setup"},{label:"Announcements",icon:"bell",navigate:"Announcements",badge:e},{label:"Recent",icon:"clock",navigate:"Recent"},{label:"Export to Word",icon:"file-text",command:"Path: Export to Word"},{label:"AI context",icon:"cpu",navigate:"_system/mcp-context"},{label:"Manual",icon:"book-open",navigate:"manual/cheatsheet"},{label:"Add framework",icon:"download",command:"Path: Add framework"},{label:"About",icon:"info",navigate:"About"}]}].map(a=>{let s=a.title===""&&a.items.length===1&&a.items[0].command==="Path: Capture",d=s?"nav-item nav-capture":"nav-item",c=s?"section section-capture":"section",p=a.items.map(g=>{let b=g.navigate?`data-navigate="${m(g.navigate)}"`:`data-command="${m(g.command??"")}"`,w=g.badge&&g.badge>0?`<span class="nav-badge">${g.badge}</span>`:"";return`<li class="${d}" ${b}>${Dr(g.icon)}<span class="nav-label">${m(g.label)}</span>${w}</li>`}).join(""),h=a.title?`<h2>${m(a.title)}</h2>`:"";return`<div class="${c}">${h}<ul class="nav">${p}</ul></div>`}).join("");return{html:`
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
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${oe.route}</svg>
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
`}}async function _(){let{html:e,script:t}=await Kr();await u.showPanel("lhs",.5,e,t)}async function ie(){L?(L=!1,await Promise.all([_().catch(e=>console.error("showLeftPanel",e)),$().catch(e=>console.error("showAttributesPanel",e))])):(L=!0,await Promise.all([u.hidePanel("lhs"),u.hidePanel("rhs")]))}async function ae(){if(!L){if(!Z){Z=!0;let e=await u.getCurrentPage();if(e&&e!=="Setup"){let t=!1;try{t=(await v.readPage("_system/onboarding")).includes("redirect: true")}catch{t=!0}if(t){try{await v.writePage("_system/onboarding",`redirect: false
`)}catch{}await u.navigate("Setup");return}}}X||(X=!0,(async()=>{try{await I.invokeCommand("Path: Refresh announcements (silent)"),await _().catch(()=>{})}catch{}})());try{await u.getCurrentPage()==="Announcements"&&globalThis.setTimeout?.(()=>{I.invokeCommand("Path: Mark all announcements as read").catch(()=>{})},600)}catch{}await Promise.all([_().catch(e=>console.error("showLeftPanel failed",e)),$().catch(e=>console.error("showAttributesPanel failed",e))])}}async function se(){await u.flashNotification("Hello from the Path plug!")}async function le(){await u.flashNotification("Starting sync...");try{let e=await fetch("http://172.28.0.11:8040/sync",{method:"POST"}),t=await e.json().catch(()=>({}));if(!e.ok){let n=t?.detail||`HTTP ${e.status}`;throw new Error(n)}await u.flashNotification("Sync started in background. Run again later to check status.")}catch(e){let t=e instanceof Error?e.message:String(e);await u.flashNotification(`Sync failed: ${t}`)}}async function ce(){let e=await u.getCurrentPage();if(!e){await u.flashNotification("No current page");return}await u.flashNotification(`debugSave: targeting ${e}`);try{await W(e,{title:"DEBUG_TEST"})}catch(t){let n=t instanceof Error?t.message:String(t);await u.flashNotification(`debugSave threw: ${n}`)}}var de={hello:se,showAttributesPanel:$,showLeftPanel:_,saveAttributes:W,debugSave:ce,onPageLoaded:ae,toggleZenMode:ie,search:ne,syncToCloud:le},ue={name:"path",requiredPermissions:["fetch"],functions:{hello:{path:"path.ts:hello",command:{name:"Path: Hello from plug"}},showAttributesPanel:{path:"path.ts:showAttributesPanel",command:{name:"Path: Show attributes panel"}},showLeftPanel:{path:"path.ts:showLeftPanel",command:{name:"Path: Refresh navigator"}},saveAttributes:{path:"path.ts:saveAttributes"},debugSave:{path:"path.ts:debugSave",command:{name:"Path: Debug save (writes title=DEBUG_TEST)"}},onPageLoaded:{path:"path.ts:onPageLoaded",events:["editor:pageLoaded"]},toggleZenMode:{path:"path.ts:toggleZenMode",command:{name:"Path: Toggle focus mode",key:"Ctrl-Alt-z"}},search:{path:"path.ts:search",command:{name:"Path: Search",key:"Ctrl-Shift-f"}},syncToCloud:{path:"path.ts:syncToCloud",command:{name:"Path: Sync to cloud"}}},assets:{}},_n={manifest:ue,functionMapping:de};Y(de,ue,self.postMessage);export{_n as plug};
//# sourceMappingURL=path.plug.js.map
