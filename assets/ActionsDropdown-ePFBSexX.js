import{u as K,_ as f}from"./index-te0q8N80.js";import{C as y}from"./CopyButton-jchkEi-j.js";import{d as C,f as n,i as $,j as v,k as t,l as p,t as s,n as k,x as a,a as u,m,s as g}from"./vue-TG75IjQI.js";const _=C({name:"RefreshTokenModal",components:{CopyButton:y},props:{isVisible:{type:Boolean,required:!0},token:{type:String,default:""}},emits:["closed"],setup(){return{helpText:K().state.helpText.refreshTokenModal}}});function w(e,o,T,b,B,h){const r=n("CopyButton"),l=n("KButton"),i=n("KModal");return $(),v(i,{title:e.helpText.title,"is-visible":e.isVisible,"data-testid":"application-secret-token-modal",class:"refresh-secret-modal",onCanceled:o[1]||(o[1]=d=>e.$emit("closed"))},{"header-content":t(()=>[p(s(e.helpText.title),1)]),"body-content":t(()=>[p(s(e.helpText.description1),1),k("strong",null,s(e.helpText.description2),1),p(s(e.helpText.description3)+" ",1),a(r,{label:e.helpText.secret,"text-to-copy":e.token},null,8,["label","text-to-copy"])]),"footer-content":t(()=>[a(l,{"is-rounded":!1,"data-testid":"close-btn",appearance:"primary",onClick:o[0]||(o[0]=d=>e.$emit("closed"))},{default:t(()=>[p(s(e.helpText.proceed),1)]),_:1})]),_:1},8,["title","is-visible"])}const S=f(_,[["render",w]]),M=C({name:"ActionsDropdown",setup(){const e=u(!1),o=u();return{isOpened:e,popRef:o,async onClickContent(){e.value=!1,setTimeout(o.value.hidePopper,0)}}}});function O(e,o,T,b,B,h){const r=n("KIcon"),l=n("KBadge"),i=n("KButton"),d=n("KPop");return $(),v(d,{ref:"popRef","popover-timeout":0,"popover-classes":"mt-1 action-dropdown",class:"float-right",placement:"bottomEnd",width:"150","hide-caret":"",onOpened:o[1]||(o[1]=c=>e.isOpened=!0),onClosed:o[2]||(o[2]=c=>e.isOpened=!1)},{content:t(()=>[k("div",{onClick:o[0]||(o[0]=(...c)=>e.onClickContent&&e.onClickContent(...c))},[m(e.$slots,"content",{},void 0,!0)])]),default:t(()=>[m(e.$slots,"default",{},()=>[a(i,{appearance:"btn-link",class:"action-dropdown-button"},{default:t(()=>[a(l,{"data-testid":"action-badge",class:g(["cursor-pointer actions-badge",{opened:e.isOpened}])},{default:t(()=>[a(r,{icon:"gearFilled",color:"var(--steel-300)",size:"16","view-box":"0 0 16 16"})]),_:1},8,["class"])]),_:1})],!0)]),_:3},512)}const A=f(M,[["render",O],["__scopeId","data-v-d6248a8a"]]);export{A,S as R};
