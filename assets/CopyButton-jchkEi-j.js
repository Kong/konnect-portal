import{u as T,e as C,_}from"./index-te0q8N80.js";import{d as b,f as t,i as f,q as m,x as a,k as s,n as h,t as c}from"./vue-TG75IjQI.js";const k=b({name:"CopyButton",props:{textToCopy:{type:String,required:!0},label:{type:String,default:""}},setup(e){const{notify:n}=C(),o=T().state.helpText.copyButton;return{copyTokenToClipboard:p=>{p(e.textToCopy)||n({appearance:"danger",message:o.copyFailed.start+e.textToCopy+o.copyFailed.end}),n({message:o.copySucceeded.start+e.textToCopy+o.copySucceeded.end})},helpText:o}}}),x={class:"my-4"},B={class:"truncate"};function K(e,n,o,l,p,g){const r=t("KIcon"),i=t("KButton"),d=t("KClipboardProvider"),u=t("KTooltip");return f(),m("div",x,[a(u,{label:e.helpText.clickToCopy},{default:s(()=>[a(d,null,{default:s(({copyToClipboard:y})=>[a(i,{"is-rounded":!1,"aria-label":e.helpText.ariaLabel,class:"clipboard-button w-100 justify-content-between","data-testid":"copy-button",appearance:"secondary",onClick:v=>e.copyTokenToClipboard(y)},{default:s(()=>[h("span",B,c(e.label)+" "+c(e.textToCopy),1),a(r,{title:e.helpText.copyToClipboard,icon:"copy",color:"var(--steel-300)"},null,8,["title"])]),_:2},1032,["aria-label","onClick"])]),_:1})]),_:1},8,["label"])])}const w=_(k,[["render",K]]);export{w as C};
