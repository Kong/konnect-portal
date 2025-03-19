import{X as kt,j as P}from"./flowDb-c1833063-B_wsPsXX-cRfTMe7q.js";import{Y as St,E as S,v as K}from"./graph-X3AqOr2l-NeCW1YM8.js";import{h as v,o as O,p as J,c as R,r as tt,j as et,l as U,q,t as W,u as _t}from"./ApiDocumentationPage-dvGShYxF.js";import{e as Lt,N as At,V as It,O as Tt,k as C}from"./layout-rkXrpYy--m6MbrU8x.js";import{w as Mt,h as Nt,t as rt,Z as Bt,e as T,p as at,u as A,b as nt,f as it}from"./styles-483fbfea-CO8nL_N7-57qL_v4v.js";import{P as $t}from"./line-CN4DfsoG-Y6e3CpMh.js";import"./vue-TG75IjQI.js";import"./index-te0q8N80.js";import"./kongponents-dL1jkn5d.js";import"./specRenderer-lDMrRPGC.js";import"./getMessageFromError-KCSW6jpt.js";import"./document-l6RdaXdg.js";import"./feature-flags-1pLpI5V6.js";import"./index-01f381cb-D6ERtkQO-XR5pqbwp.js";import"./clone-Cei040DH-3M7FJ4n5.js";import"./edges-066a5561-BVE6Q1zS-5otNg5qm.js";import"./createText-ca0c5216-DrKH6pb2-9sRQAJZh.js";import"./channel-CDDE-1Nq-joleVmlq.js";import"./array-CqVTtuYm-kXEfrAop.js";import"./path-DLwuMfdd-LN2vUMWq.js";function Et(r){if(!r.ok)throw new Error(r.status+" "+r.statusText);return r.text()}function Ct(r,e){return fetch(r,e).then(Et)}function Dt(r){return(e,t)=>Ct(e,t).then(a=>new DOMParser().parseFromString(a,r))}var Ut=Dt("image/svg+xml"),z={normal:Wt,vee:Pt,undirected:qt};function Rt(r){z=r}function Wt(r,e,t,a){var n=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),i=n.append("path").attr("d","M 0 0 L 10 5 L 0 10 z").style("stroke-width",1).style("stroke-dasharray","1,0");T(i,t[a+"Style"]),t[a+"Class"]&&i.attr("class",t[a+"Class"])}function Pt(r,e,t,a){var n=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),i=n.append("path").attr("d","M 0 0 L 10 5 L 0 10 L 4 5 z").style("stroke-width",1).style("stroke-dasharray","1,0");T(i,t[a+"Style"]),t[a+"Class"]&&i.attr("class",t[a+"Class"])}function qt(r,e,t,a){var n=r.append("marker").attr("id",e).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto"),i=n.append("path").attr("d","M 0 5 L 10 5").style("stroke-width",1).style("stroke-dasharray","1,0");T(i,t[a+"Style"]),t[a+"Class"]&&i.attr("class",t[a+"Class"])}function Ot(r,e){var t=r;return t.node().appendChild(e.label),T(t,e.labelStyle),t}function zt(r,e){for(var t=r.append("text"),a=Vt(e.label).split(`
`),n=0;n<a.length;n++)t.append("tspan").attr("xml:space","preserve").attr("dy","1em").attr("x","1").text(a[n]);return T(t,e.labelStyle),t}function Vt(r){for(var e="",t=!1,a,n=0;n<r.length;++n)if(a=r[n],t){switch(a){case"n":e+=`
`;break;default:e+=a}t=!1}else a==="\\"?t=!0:e+=a;return e}function G(r,e,t){var a=e.label,n=r.append("g");e.labelType==="svg"?Ot(n,e):typeof a!="string"||e.labelType==="html"?rt(n,e):zt(n,e);var i=n.node().getBBox(),s;switch(t){case"top":s=-e.height/2;break;case"bottom":s=e.height/2-i.height;break;default:s=-i.height/2}return n.attr("transform","translate("+-i.width/2+","+s+")"),n}var V=function(r,e){var t=e.nodes().filter(function(i){return at(e,i)}),a=r.selectAll("g.cluster").data(t,function(i){return i});A(a.exit(),e).style("opacity",0).remove();var n=a.enter().append("g").attr("class","cluster").attr("id",function(i){var s=e.node(i);return s.id}).style("opacity",0).each(function(i){var s=e.node(i),o=v(this);v(this).append("rect");var d=o.append("g").attr("class","label");G(d,s,s.clusterLabelPos)});return a=a.merge(n),a=A(a,e).style("opacity",1),a.selectAll("rect").each(function(i){var s=e.node(i),o=v(this);T(o,s.style)}),a};function Xt(r){V=r}let X=function(r,e){var t=r.selectAll("g.edgeLabel").data(e.edges(),function(n){return nt(n)}).classed("update",!0);t.exit().remove(),t.enter().append("g").classed("edgeLabel",!0).style("opacity",0),t=r.selectAll("g.edgeLabel"),t.each(function(n){var i=v(this);i.select(".label").remove();var s=e.edge(n),o=G(i,e.edge(n),0).classed("label",!0),d=o.node().getBBox();s.labelId&&o.attr("id",s.labelId),S(s,"width")||(s.width=d.width),S(s,"height")||(s.height=d.height)});var a;return t.exit?a=t.exit():a=t.selectAll(null),A(a,e).style("opacity",0).remove(),t};function Yt(r){X=r}function Q(r,e){return r.intersect(e)}var Y=function(r,e,t){var a=r.selectAll("g.edgePath").data(e.edges(),function(s){return nt(s)}).classed("update",!0),n=Qt(a,e);Zt(a,e);var i=a.merge!==void 0?a.merge(n):a;return A(i,e).style("opacity",1),i.each(function(s){var o=v(this),d=e.edge(s);d.elem=this,d.id&&o.attr("id",d.id),it(o,d.class,(o.classed("update")?"update ":"")+"edgePath")}),i.selectAll("path.path").each(function(s){var o=e.edge(s);o.arrowheadId=Lt("arrowhead");var d=v(this).attr("marker-end",function(){return"url("+Ht(location.href,o.arrowheadId)+")"}).style("fill","none");A(d,e).attr("d",function(u){return Gt(e,u)}),T(d,o.style)}),i.selectAll("defs *").remove(),i.selectAll("defs").each(function(s){var o=e.edge(s),d=t[o.arrowhead];d(v(this),o.arrowheadId,o,"arrowhead")}),i};function jt(r){Y=r}function Ht(r,e){var t=r.split("#")[0];return t+"#"+e}function Gt(r,e){var t=r.edge(e),a=r.node(e.v),n=r.node(e.w),i=t.points.slice(1,t.points.length-1);return i.unshift(Q(a,i[0])),i.push(Q(n,i[i.length-1])),st(t,i)}function st(r,e){var t=($t||Ut.line)().x(function(a){return a.x}).y(function(a){return a.y});return(t.curve||t.interpolate)(r.curve),t(e)}function Ft(r){var e=r.getBBox(),t=r.ownerSVGElement.getScreenCTM().inverse().multiply(r.getScreenCTM()).translate(e.width/2,e.height/2);return{x:t.e,y:t.f}}function Qt(r,e){var t=r.enter().append("g").attr("class","edgePath").style("opacity",0);return t.append("path").attr("class","path").attr("d",function(a){var n=e.edge(a),i=e.node(a.v).elem,s=At(n.points.length).map(function(){return Ft(i)});return st(n,s)}),t.append("defs"),t}function Zt(r,e){var t=r.exit();A(t,e).style("opacity",0).remove()}var j=function(r,e,t){var a=e.nodes().filter(function(s){return!at(e,s)}),n=r.selectAll("g.node").data(a,function(s){return s}).classed("update",!0);n.exit().remove(),n.enter().append("g").attr("class","node").style("opacity",0),n=r.selectAll("g.node"),n.each(function(s){var o=e.node(s),d=v(this);it(d,o.class,(d.classed("update")?"update ":"")+"node"),d.select("g.label").remove();var u=d.append("g").attr("class","label"),l=G(u,o),g=t[o.shape],c=It(l.node().getBBox(),"width","height");o.elem=this,o.id&&d.attr("id",o.id),o.labelId&&u.attr("id",o.labelId),S(o,"width")&&(c.width=o.width),S(o,"height")&&(c.height=o.height),c.width+=o.paddingLeft+o.paddingRight,c.height+=o.paddingTop+o.paddingBottom,u.attr("transform","translate("+(o.paddingLeft-o.paddingRight)/2+","+(o.paddingTop-o.paddingBottom)/2+")");var h=v(this);h.select(".label-container").remove();var f=g(h,c,o).classed("label-container",!0);T(f,o.style);var w=f.node().getBBox();o.width=w.width,o.height=w.height});var i;return n.exit?i=n.exit():i=n.selectAll(null),A(i,e).style("opacity",0).remove(),n};function Kt(r){j=r}function Jt(r,e){var t=r.filter(function(){return!v(this).classed("update")});function a(n){var i=e.node(n);return"translate("+i.x+","+i.y+")"}t.attr("transform",a),A(r,e).style("opacity",1).attr("transform",a),A(t.selectAll("rect"),e).attr("width",function(n){return e.node(n).width}).attr("height",function(n){return e.node(n).height}).attr("x",function(n){var i=e.node(n);return-i.width/2}).attr("y",function(n){var i=e.node(n);return-i.height/2})}function te(r,e){var t=r.filter(function(){return!v(this).classed("update")});function a(n){var i=e.edge(n);return S(i,"x")?"translate("+i.x+","+i.y+")":""}t.attr("transform",a),A(r,e).style("opacity",1).attr("transform",a)}function ee(r,e){var t=r.filter(function(){return!v(this).classed("update")});function a(n){var i=e.node(n);return"translate("+i.x+","+i.y+")"}t.attr("transform",a),A(r,e).style("opacity",1).attr("transform",a)}function ot(r,e,t,a){var n=r.x,i=r.y,s=n-a.x,o=i-a.y,d=Math.sqrt(e*e*o*o+t*t*s*s),u=Math.abs(e*t*s/d);a.x<n&&(u=-u);var l=Math.abs(e*t*o/d);return a.y<i&&(l=-l),{x:n+u,y:i+l}}function re(r,e,t){return ot(r,e,e,t)}function ae(r,e,t,a){var n,i,s,o,d,u,l,g,c,h,f,w,p,x,k;if(n=e.y-r.y,s=r.x-e.x,d=e.x*r.y-r.x*e.y,c=n*t.x+s*t.y+d,h=n*a.x+s*a.y+d,!(c!==0&&h!==0&&Z(c,h))&&(i=a.y-t.y,o=t.x-a.x,u=a.x*t.y-t.x*a.y,l=i*r.x+o*r.y+u,g=i*e.x+o*e.y+u,!(l!==0&&g!==0&&Z(l,g))&&(f=n*o-i*s,f!==0)))return w=Math.abs(f/2),p=s*u-o*d,x=p<0?(p-w)/f:(p+w)/f,p=i*d-n*u,k=p<0?(p-w)/f:(p+w)/f,{x,y:k}}function Z(r,e){return r*e>0}function I(r,e,t){var a=r.x,n=r.y,i=[],s=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY;e.forEach(function(f){s=Math.min(s,f.x),o=Math.min(o,f.y)});for(var d=a-r.width/2-s,u=n-r.height/2-o,l=0;l<e.length;l++){var g=e[l],c=e[l<e.length-1?l+1:0],h=ae(r,t,{x:d+g.x,y:u+g.y},{x:d+c.x,y:u+c.y});h&&i.push(h)}return i.length?(i.length>1&&i.sort(function(f,w){var p=f.x-t.x,x=f.y-t.y,k=Math.sqrt(p*p+x*x),N=w.x-t.x,_=w.y-t.y,y=Math.sqrt(N*N+_*_);return k<y?-1:k===y?0:1}),i[0]):(console.log("NO INTERSECTION FOUND, RETURN NODE CENTER",r),r)}function F(r,e){var t=r.x,a=r.y,n=e.x-t,i=e.y-a,s=r.width/2,o=r.height/2,d,u;return Math.abs(i)*s>Math.abs(n)*o?(i<0&&(o=-o),d=i===0?0:o*n/i,u=o):(n<0&&(s=-s),d=s,u=n===0?0:s*i/n),{x:t+d,y:a+u}}var H={rect:ie,ellipse:se,circle:oe,diamond:le};function ne(r){H=r}function ie(r,e,t){var a=r.insert("rect",":first-child").attr("rx",t.rx).attr("ry",t.ry).attr("x",-e.width/2).attr("y",-e.height/2).attr("width",e.width).attr("height",e.height);return t.intersect=function(n){return F(t,n)},a}function se(r,e,t){var a=e.width/2,n=e.height/2,i=r.insert("ellipse",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("rx",a).attr("ry",n);return t.intersect=function(s){return ot(t,a,n,s)},i}function oe(r,e,t){var a=Math.max(e.width,e.height)/2,n=r.insert("circle",":first-child").attr("x",-e.width/2).attr("y",-e.height/2).attr("r",a);return t.intersect=function(i){return re(t,a,i)},n}function le(r,e,t){var a=e.width*Math.SQRT2/2,n=e.height*Math.SQRT2/2,i=[{x:0,y:-n},{x:-a,y:0},{x:0,y:n},{x:a,y:0}],s=r.insert("polygon",":first-child").attr("points",i.map(function(o){return o.x+","+o.y}).join(" "));return t.intersect=function(o){return I(t,i,o)},s}function de(){var r=function(e,t){ue(t);var a=D(e,"output"),n=D(a,"clusters"),i=D(a,"edgePaths"),s=X(D(a,"edgeLabels"),t),o=j(D(a,"nodes"),t,H);Tt(t),ee(o,t),te(s,t),Y(i,t,z);var d=V(n,t);Jt(d,t),pe(t)};return r.createNodes=function(e){return arguments.length?(Kt(e),r):j},r.createClusters=function(e){return arguments.length?(Xt(e),r):V},r.createEdgeLabels=function(e){return arguments.length?(Yt(e),r):X},r.createEdgePaths=function(e){return arguments.length?(jt(e),r):Y},r.shapes=function(e){return arguments.length?(ne(e),r):H},r.arrows=function(e){return arguments.length?(Rt(e),r):z},r}var ce={paddingLeft:10,paddingRight:10,paddingTop:10,paddingBottom:10,rx:0,ry:0,shape:"rect"},he={arrowhead:"normal",curve:W};function ue(r){r.nodes().forEach(function(e){var t=r.node(e);!S(t,"label")&&!r.children(e).length&&(t.label=e),S(t,"paddingX")&&C(t,{paddingLeft:t.paddingX,paddingRight:t.paddingX}),S(t,"paddingY")&&C(t,{paddingTop:t.paddingY,paddingBottom:t.paddingY}),S(t,"padding")&&C(t,{paddingLeft:t.padding,paddingRight:t.padding,paddingTop:t.padding,paddingBottom:t.padding}),C(t,ce),K(["paddingLeft","paddingRight","paddingTop","paddingBottom"],function(a){t[a]=Number(t[a])}),S(t,"width")&&(t._prevWidth=t.width),S(t,"height")&&(t._prevHeight=t.height)}),r.edges().forEach(function(e){var t=r.edge(e);S(t,"label")||(t.label=""),C(t,he)})}function pe(r){K(r.nodes(),function(e){var t=r.node(e);S(t,"_prevWidth")?t.width=t._prevWidth:delete t.width,S(t,"_prevHeight")?t.height=t._prevHeight:delete t.height,delete t._prevWidth,delete t._prevHeight})}function D(r,e){var t=r.select("g."+e);return t.empty()&&(t=r.append("g").attr("class",e)),t}function lt(r,e,t){const a=e.width,n=e.height,i=(a+n)*.9,s=[{x:i/2,y:0},{x:i,y:-i/2},{x:i/2,y:-i},{x:0,y:-i/2}],o=M(r,i,i,s);return t.intersect=function(d){return I(t,s,d)},o}function dt(r,e,t){const a=e.height,n=a/4,i=e.width+2*n,s=[{x:n,y:0},{x:i-n,y:0},{x:i,y:-a/2},{x:i-n,y:-a},{x:n,y:-a},{x:0,y:-a/2}],o=M(r,i,a,s);return t.intersect=function(d){return I(t,s,d)},o}function ct(r,e,t){const a=e.width,n=e.height,i=[{x:-n/2,y:0},{x:a,y:0},{x:a,y:-n},{x:-n/2,y:-n},{x:0,y:-n/2}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function ht(r,e,t){const a=e.width,n=e.height,i=[{x:-2*n/6,y:0},{x:a-n/6,y:0},{x:a+2*n/6,y:-n},{x:n/6,y:-n}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function ut(r,e,t){const a=e.width,n=e.height,i=[{x:2*n/6,y:0},{x:a+n/6,y:0},{x:a-2*n/6,y:-n},{x:-n/6,y:-n}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function pt(r,e,t){const a=e.width,n=e.height,i=[{x:-2*n/6,y:0},{x:a+2*n/6,y:0},{x:a-n/6,y:-n},{x:n/6,y:-n}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function ft(r,e,t){const a=e.width,n=e.height,i=[{x:n/6,y:0},{x:a-n/6,y:0},{x:a+2*n/6,y:-n},{x:-2*n/6,y:-n}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function gt(r,e,t){const a=e.width,n=e.height,i=[{x:0,y:0},{x:a+n/2,y:0},{x:a,y:-n/2},{x:a+n/2,y:-n},{x:0,y:-n}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function yt(r,e,t){const a=e.height,n=e.width+a/4,i=r.insert("rect",":first-child").attr("rx",a/2).attr("ry",a/2).attr("x",-n/2).attr("y",-a/2).attr("width",n).attr("height",a);return t.intersect=function(s){return F(t,s)},i}function xt(r,e,t){const a=e.width,n=e.height,i=[{x:0,y:0},{x:a,y:0},{x:a,y:-n},{x:0,y:-n},{x:0,y:0},{x:-8,y:0},{x:a+8,y:0},{x:a+8,y:-n},{x:-8,y:-n},{x:-8,y:0}],s=M(r,a,n,i);return t.intersect=function(o){return I(t,i,o)},s}function wt(r,e,t){const a=e.width,n=a/2,i=n/(2.5+a/50),s=e.height+i,o="M 0,"+i+" a "+n+","+i+" 0,0,0 "+a+" 0 a "+n+","+i+" 0,0,0 "+-a+" 0 l 0,"+s+" a "+n+","+i+" 0,0,0 "+a+" 0 l 0,"+-s,d=r.attr("label-offset-y",i).insert("path",":first-child").attr("d",o).attr("transform","translate("+-a/2+","+-(s/2+i)+")");return t.intersect=function(u){const l=F(t,u),g=l.x-t.x;if(n!=0&&(Math.abs(g)<t.width/2||Math.abs(g)==t.width/2&&Math.abs(l.y-t.y)>t.height/2-i)){let c=i*i*(1-g*g/(n*n));c!=0&&(c=Math.sqrt(c)),c=i-c,u.y-t.y>0&&(c=-c),l.y+=c}return l},d}function fe(r){r.shapes().question=lt,r.shapes().hexagon=dt,r.shapes().stadium=yt,r.shapes().subroutine=xt,r.shapes().cylinder=wt,r.shapes().rect_left_inv_arrow=ct,r.shapes().lean_right=ht,r.shapes().lean_left=ut,r.shapes().trapezoid=pt,r.shapes().inv_trapezoid=ft,r.shapes().rect_right_inv_arrow=gt}function ge(r){r({question:lt}),r({hexagon:dt}),r({stadium:yt}),r({subroutine:xt}),r({cylinder:wt}),r({rect_left_inv_arrow:ct}),r({lean_right:ht}),r({lean_left:ut}),r({trapezoid:pt}),r({inv_trapezoid:ft}),r({rect_right_inv_arrow:gt})}function M(r,e,t,a){return r.insert("polygon",":first-child").attr("points",a.map(function(n){return n.x+","+n.y}).join(" ")).attr("transform","translate("+-e/2+","+t/2+")")}const ye={addToRender:fe,addToRenderV2:ge},vt={},xe=function(r){const e=Object.keys(r);for(const t of e)vt[t]=r[t]},mt=async function(r,e,t,a,n,i){const s=a?a.select(`[id="${t}"]`):v(`[id="${t}"]`),o=n||document,d=Object.keys(r);for(const u of d){const l=r[u];let g="default";l.classes.length>0&&(g=l.classes.join(" "));const c=O(l.styles);let h=l.text!==void 0?l.text:l.id,f;if(J(R().flowchart.htmlLabels)){const x={label:await tt(h.replace(/fa[blrs]?:fa-[\w-]+/g,k=>`<i class='${k.replace(":"," ")}'></i>`),R())};f=rt(s,x).node(),f.parentNode.removeChild(f)}else{const x=o.createElementNS("http://www.w3.org/2000/svg","text");x.setAttribute("style",c.labelStyle.replace("color:","fill:"));const k=h.split(et.lineBreakRegex);for(const N of k){const _=o.createElementNS("http://www.w3.org/2000/svg","tspan");_.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),_.setAttribute("dy","1em"),_.setAttribute("x","1"),_.textContent=N,x.appendChild(_)}f=x}let w=0,p="";switch(l.type){case"round":w=5,p="rect";break;case"square":p="rect";break;case"diamond":p="question";break;case"hexagon":p="hexagon";break;case"odd":p="rect_left_inv_arrow";break;case"lean_right":p="lean_right";break;case"lean_left":p="lean_left";break;case"trapezoid":p="trapezoid";break;case"inv_trapezoid":p="inv_trapezoid";break;case"odd_right":p="rect_left_inv_arrow";break;case"circle":p="circle";break;case"ellipse":p="ellipse";break;case"stadium":p="stadium";break;case"subroutine":p="subroutine";break;case"cylinder":p="cylinder";break;case"group":p="rect";break;default:p="rect"}U.warn("Adding node",l.id,l.domId),e.setNode(i.db.lookUpDomId(l.id),{labelType:"svg",labelStyle:c.labelStyle,shape:p,label:f,rx:w,ry:w,class:g,style:c.style,id:i.db.lookUpDomId(l.id)})}},bt=async function(r,e,t){let a=0,n,i;if(r.defaultStyle!==void 0){const s=O(r.defaultStyle);n=s.style,i=s.labelStyle}for(const s of r){a++;const o="L-"+s.start+"-"+s.end,d="LS-"+s.start,u="LE-"+s.end,l={};s.type==="arrow_open"?l.arrowhead="none":l.arrowhead="normal";let g="",c="";if(s.style!==void 0){const h=O(s.style);g=h.style,c=h.labelStyle}else switch(s.stroke){case"normal":g="fill:none",n!==void 0&&(g=n),i!==void 0&&(c=i);break;case"dotted":g="fill:none;stroke-width:2px;stroke-dasharray:3;";break;case"thick":g=" stroke-width: 3.5px;fill:none";break}l.style=g,l.labelStyle=c,s.interpolate!==void 0?l.curve=q(s.interpolate,W):r.defaultInterpolate!==void 0?l.curve=q(r.defaultInterpolate,W):l.curve=q(vt.curve,W),s.text===void 0?s.style!==void 0&&(l.arrowheadStyle="fill: #333"):(l.arrowheadStyle="fill: #333",l.labelpos="c",J(R().flowchart.htmlLabels)?(l.labelType="html",l.label=`<span id="L-${o}" class="edgeLabel L-${d}' L-${u}" style="${l.labelStyle}">${await tt(s.text.replace(/fa[blrs]?:fa-[\w-]+/g,h=>`<i class='${h.replace(":"," ")}'></i>`),R())}</span>`):(l.labelType="text",l.label=s.text.replace(et.lineBreakRegex,`
`),s.style===void 0&&(l.style=l.style||"stroke: #333; stroke-width: 1.5px;fill:none"),l.labelStyle=l.labelStyle.replace("color:","fill:"))),l.id=o,l.class=d+" "+u,l.minlen=s.length||1,e.setEdge(t.db.lookUpDomId(s.start),t.db.lookUpDomId(s.end),l,a)}},we=function(r,e){return U.info("Extracting classes"),e.db.getClasses()},ve=async function(r,e,t,a){U.info("Drawing flowchart");const{securityLevel:n,flowchart:i}=R();let s;n==="sandbox"&&(s=v("#i"+e));const o=n==="sandbox"?v(s.nodes()[0].contentDocument.body):v("body"),d=n==="sandbox"?s.nodes()[0].contentDocument:document;let u=a.db.getDirection();u===void 0&&(u="TD");const l=i.nodeSpacing||50,g=i.rankSpacing||50,c=new St({multigraph:!0,compound:!0}).setGraph({rankdir:u,nodesep:l,ranksep:g,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});let h;const f=a.db.getSubGraphs();for(let y=f.length-1;y>=0;y--)h=f[y],a.db.addVertex(h.id,h.title,"group",void 0,h.classes);const w=a.db.getVertices();U.warn("Get vertices",w);const p=a.db.getEdges();let x=0;for(x=f.length-1;x>=0;x--){h=f[x],Bt("cluster").append("text");for(let y=0;y<h.nodes.length;y++)U.warn("Setting subgraph",h.nodes[y],a.db.lookUpDomId(h.nodes[y]),a.db.lookUpDomId(h.id)),c.setParent(a.db.lookUpDomId(h.nodes[y]),a.db.lookUpDomId(h.id))}await mt(w,c,e,o,d,a),await bt(p,c,a);const k=new de;ye.addToRender(k),k.arrows().none=function(y,m,L,b){const B=y.append("marker").attr("id",m).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto").append("path").attr("d","M 0 0 L 0 0 L 0 0 z");T(B,L[b+"Style"])},k.arrows().normal=function(y,m){y.append("marker").attr("id",m).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerUnits","strokeWidth").attr("markerWidth",8).attr("markerHeight",6).attr("orient","auto").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","arrowheadPath").style("stroke-width",1).style("stroke-dasharray","1,0")};const N=o.select(`[id="${e}"]`),_=o.select("#"+e+" g");for(k(_,c),_.selectAll("g.node").attr("title",function(){return a.db.getTooltip(this.id)}),a.db.indexNodes("subGraph"+x),x=0;x<f.length;x++)if(h=f[x],h.title!=="undefined"){const y=d.querySelectorAll("#"+e+' [id="'+a.db.lookUpDomId(h.id)+'"] rect'),m=d.querySelectorAll("#"+e+' [id="'+a.db.lookUpDomId(h.id)+'"]'),L=y[0].x.baseVal.value,b=y[0].y.baseVal.value,B=y[0].width.baseVal.value,E=v(m[0]).select(".label");E.attr("transform",`translate(${L+B/2}, ${b+14})`),E.attr("id",e+"Text");for(let $=0;$<h.classes.length;$++)m[0].classList.add(h.classes[$])}if(!i.htmlLabels){const y=d.querySelectorAll('[id="'+e+'"] .edgeLabel .label');for(const m of y){const L=m.getBBox(),b=d.createElementNS("http://www.w3.org/2000/svg","rect");b.setAttribute("rx",0),b.setAttribute("ry",0),b.setAttribute("width",L.width),b.setAttribute("height",L.height),m.insertBefore(b,m.firstChild)}}_t(c,N,i.diagramPadding,i.useMaxWidth),Object.keys(w).forEach(function(y){const m=w[y];if(m.link){const L=o.select("#"+e+' [id="'+a.db.lookUpDomId(y)+'"]');if(L){const b=d.createElementNS("http://www.w3.org/2000/svg","a");b.setAttributeNS("http://www.w3.org/2000/svg","class",m.classes.join(" ")),b.setAttributeNS("http://www.w3.org/2000/svg","href",m.link),b.setAttributeNS("http://www.w3.org/2000/svg","rel","noopener"),n==="sandbox"?b.setAttributeNS("http://www.w3.org/2000/svg","target","_top"):m.linkTarget&&b.setAttributeNS("http://www.w3.org/2000/svg","target",m.linkTarget);const B=L.insert(function(){return b},":first-child"),E=L.select(".label-container");E&&B.append(function(){return E.node()});const $=L.select(".label");$&&B.append(function(){return $.node()})}}})},me={setConf:xe,addVertices:mt,addEdges:bt,getClasses:we,draw:ve},Oe={parser:kt,db:P,renderer:Mt,styles:Nt,init:r=>{r.flowchart||(r.flowchart={}),r.flowchart.arrowMarkerAbsolute=r.arrowMarkerAbsolute,me.setConf(r.flowchart),P.clear(),P.setGen("gen-1")}};export{Oe as diagram};
