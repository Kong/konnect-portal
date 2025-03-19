import{z as _,K as L,Y as j}from"./styles-b83b31c9-CIlRY7YA-iNPeGevD.js";import{l as c,c as d,h as w,z,u as B,o as E,q as D,t as $,j as A}from"./ApiDocumentationPage-dvGShYxF.js";import{Y as R}from"./graph-X3AqOr2l-NeCW1YM8.js";import{b as Y}from"./index-01f381cb-D6ERtkQO-XR5pqbwp.js";import"./layout-rkXrpYy--m6MbrU8x.js";import"./vue-TG75IjQI.js";import"./index-te0q8N80.js";import"./kongponents-dL1jkn5d.js";import"./specRenderer-lDMrRPGC.js";import"./getMessageFromError-KCSW6jpt.js";import"./document-l6RdaXdg.js";import"./feature-flags-1pLpI5V6.js";import"./clone-Cei040DH-3M7FJ4n5.js";import"./edges-066a5561-BVE6Q1zS-5otNg5qm.js";import"./createText-ca0c5216-DrKH6pb2-9sRQAJZh.js";import"./line-CN4DfsoG-Y6e3CpMh.js";import"./array-CqVTtuYm-kXEfrAop.js";import"./path-DLwuMfdd-LN2vUMWq.js";const k=a=>A.sanitizeText(a,d());let x={dividerMargin:10,padding:5,textHeight:10,curve:void 0};const P=function(a,t,b,n){const e=Object.keys(a);c.info("keys:",e),c.info(a),e.forEach(function(s){var l,r;const o=a[s],i={shape:"rect",id:o.id,domId:o.domId,labelText:k(o.id),labelStyle:"",style:"fill: none; stroke: black",padding:((l=d().flowchart)==null?void 0:l.padding)??((r=d().class)==null?void 0:r.padding)};t.setNode(o.id,i),C(o.classes,t,b,n,o.id),c.info("setNode",i)})},C=function(a,t,b,n,e){const s=Object.keys(a);c.info("keys:",s),c.info(a),s.filter(l=>a[l].parent==e).forEach(function(l){var r,o;const i=a[l],g=i.cssClasses.join(" "),y=E(i.styles),u=i.label??i.id,p=0,f={labelStyle:y.labelStyle,shape:"class_box",labelText:k(u),classData:i,rx:p,ry:p,class:g,style:y.style,id:i.id,domId:i.domId,tooltip:n.db.getTooltip(i.id,e)||"",haveCallback:i.haveCallback,link:i.link,width:i.type==="group"?500:void 0,type:i.type,padding:((r=d().flowchart)==null?void 0:r.padding)??((o=d().class)==null?void 0:o.padding)};t.setNode(i.id,f),e&&t.setParent(i.id,e),c.info("setNode",f)})},q=function(a,t,b,n){c.info(a),a.forEach(function(e,s){var l,r;const o=e,i="",g={labelStyle:"",style:""},y=o.text,u=0,p={labelStyle:g.labelStyle,shape:"note",labelText:k(y),noteData:o,rx:u,ry:u,class:i,style:g.style,id:o.id,domId:o.id,tooltip:"",type:"note",padding:((l=d().flowchart)==null?void 0:l.padding)??((r=d().class)==null?void 0:r.padding)};if(t.setNode(o.id,p),c.info("setNode",p),!o.class||!(o.class in n))return;const f=b+s,h={id:`edgeNote${f}`,classes:"relation",pattern:"dotted",arrowhead:"none",startLabelRight:"",endLabelLeft:"",arrowTypeStart:"none",arrowTypeEnd:"none",style:"fill:none",labelStyle:"",curve:D(x.curve,$)};t.setEdge(o.id,o.class,h,f)})},F=function(a,t){const b=d().flowchart;let n=0;a.forEach(function(e){var s;n++;const l={classes:"relation",pattern:e.relation.lineType==1?"dashed":"solid",id:`id_${e.id1}_${e.id2}_${n}`,arrowhead:e.type==="arrow_open"?"none":"normal",startLabelRight:e.relationTitle1==="none"?"":e.relationTitle1,endLabelLeft:e.relationTitle2==="none"?"":e.relationTitle2,arrowTypeStart:N(e.relation.type1),arrowTypeEnd:N(e.relation.type2),style:"fill:none",labelStyle:"",curve:D(b==null?void 0:b.curve,$)};if(c.info(l,e),e.style!==void 0){const r=E(e.style);l.style=r.style,l.labelStyle=r.labelStyle}e.text=e.title,e.text===void 0?e.style!==void 0&&(l.arrowheadStyle="fill: #333"):(l.arrowheadStyle="fill: #333",l.labelpos="c",((s=d().flowchart)==null?void 0:s.htmlLabels)??d().htmlLabels?(l.labelType="html",l.label='<span class="edgeLabel">'+e.text+"</span>"):(l.labelType="text",l.label=e.text.replace(A.lineBreakRegex,`
`),e.style===void 0&&(l.style=l.style||"stroke: #333; stroke-width: 1.5px;fill:none"),l.labelStyle=l.labelStyle.replace("color:","fill:"))),t.setEdge(e.id1,e.id2,l,n)})},G=function(a){x={...x,...a}},H=async function(a,t,b,n){c.info("Drawing class - ",t);const e=d().flowchart??d().class,s=d().securityLevel;c.info("config:",e);const l=(e==null?void 0:e.nodeSpacing)??50,r=(e==null?void 0:e.rankSpacing)??50,o=new R({multigraph:!0,compound:!0}).setGraph({rankdir:n.db.getDirection(),nodesep:l,ranksep:r,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}}),i=n.db.getNamespaces(),g=n.db.getClasses(),y=n.db.getRelations(),u=n.db.getNotes();c.info(y),P(i,o,t,n),C(g,o,t,n),F(y,o),q(u,o,y.length+1,g);let p;s==="sandbox"&&(p=w("#i"+t));const f=s==="sandbox"?w(p.nodes()[0].contentDocument.body):w("body"),h=f.select(`[id="${t}"]`),I=f.select("#"+t+" g");if(await Y(I,o,["aggregation","extension","composition","dependency","lollipop"],"classDiagram",t),z.insertTitle(h,"classTitleText",(e==null?void 0:e.titleTopMargin)??5,n.db.getDiagramTitle()),B(o,h,e==null?void 0:e.diagramPadding,e==null?void 0:e.useMaxWidth),!(e!=null&&e.htmlLabels)){const T=s==="sandbox"?p.nodes()[0].contentDocument:document,M=T.querySelectorAll('[id="'+t+'"] .edgeLabel .label');for(const v of M){const S=v.getBBox(),m=T.createElementNS("http://www.w3.org/2000/svg","rect");m.setAttribute("rx",0),m.setAttribute("ry",0),m.setAttribute("width",S.width),m.setAttribute("height",S.height),v.insertBefore(m,v.firstChild)}}};function N(a){let t;switch(a){case 0:t="aggregation";break;case 1:t="extension";break;case 2:t="composition";break;case 3:t="dependency";break;case 4:t="lollipop";break;default:t="none"}return t}const K={setConf:G,draw:H},ce={parser:_,db:L,renderer:K,styles:j,init:a=>{a.class||(a.class={}),a.class.arrowMarkerAbsolute=a.arrowMarkerAbsolute,L.clear()}};export{ce as diagram};
