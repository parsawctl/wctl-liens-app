"use client";
import { useState, useMemo, useRef, useEffect } from "react";

const SUBRO_DATA = [
  { id:"dhcs", company:"DHCS / Medi-Cal (CA)", plans:["Medi-Cal","DHCS","Medi-Cal HMO"], portal:"dhcs.ca.gov/services/Pages/TPLRD_PI_OnlineForms.aspx", notes:"Lookup: dhcs.ca.gov/services/Pages/TPLRD_onlineinquiries.aspx", type:"Government" },
  { id:"dhcs-nv", company:"DHCS Nevada", plans:["Medicaid NV","Nevada Medicaid"], email:"NVCasualty@gainwelltechnologies.com", type:"Government" },
  { id:"dhcs-az", company:"DHCS Arizona", plans:["Medicaid AZ","AHCCCS"], email:"AZSubro@gainwelltechnologies.com", type:"Government" },
  { id:"cms", company:"Medicare / CMS", plans:["Medicare","CMS","Medicare Advantage"], phone:"(855) 798-2627", fax:"(833) 844-1540", type:"Government" },
  { id:"va", company:"VA (Veterans Affairs)", plans:["VA","Veterans Affairs","CHAMPVA"], phone:"(844) 698-2311", fax:"(202) 495-5862", email:"Garrett.Schafer@va.gov", notes:"Form: va.gov/ogc/collections.asp", type:"Government" },
  { id:"jag", company:"JAG Office (Army/Marines)", plans:["JAG","Army","Marines","Military","Tricare"], phone:"(323) 315-7425", altPhone:"Monterey: (831) 242-6386", type:"Government" },
  { id:"rawlings", company:"The Rawlings Company", plans:["Kaiser Southern CA","Kaiser Northern CA","Kaiser","United Healthcare","UHC","Health Net","BCBS CA","Blue Shield CA","Aetna","Silversummit NV","Ambetter NC"], phone:"(502) 587-1279", fax:"(502) 587-5558", altFax:"(502) 753-7064", notes:"Kaiser specialist: Nichole King — pushes toward 1/3 but factors other liens", type:"Third-Party Admin" },
  { id:"optum-eq", company:"Equian / Conduent / Optum", plans:["HealthNet","Health Net","Cigna","UnitedHealthcare","Molina","Torrance IPA"], phone:"(888) 870-8842", fax:"(877) 200-0207", email:"submitreferrals@optum.com", portal:"subroreferrals.optum.com", notes:"⚠️ HMO / Capitated Optum plans do NOT seek subrogation. Conduent Fax: (847) 890-6203 | Equian Fax: (502) 214-1291", type:"Third-Party Admin" },
  { id:"optum-d", company:"Optum (Direct)", plans:["Blue Shield of CA","L.A. Care","LA Care","Covered California"], phone:"(888) 870-8842", fax:"(877) 200-0207", email:"submitreferrals@optum.com", type:"Third-Party Admin" },
  { id:"carelon", company:"Meridian / Carelon", plans:["Anthem Blue Cross","Anthem"], phone:"(800) 645-9785", email:"subrointake@carelon.com", fax:"(844) 634-2520", type:"Third-Party Admin" },
  { id:"phia", company:"The Phia Group", plans:["HMA","PHCS"], phone:"(888) 986-0080", fax:"(781) 848-1154", email:"accidentletter@phiagroup.com", type:"Third-Party Admin" },
  { id:"intellivo", company:"Intellivo", plans:["Kaiser EPO"], phone:"(901) 380-4949", fax:"(901) 380-0692", email:"intake@intellivo.com", type:"Third-Party Admin" },
  { id:"yaspan", company:"Law Offices of Robert M. Yaspan", plans:["Health Care Partners","St. Vincent IPA","Regal"], phone:"(818) 774-9721", type:"Third-Party Admin" },
  { id:"compass", company:"Compass Lien Solution (ERISA)", plans:["ERISA","ERISA plans","self-funded","self-insured"], contact:"Amanda Greenburg", email:"agreenburg@compassllc.com", phone:"(949) 939-3564", altPhone:"Office: (512) 590-8124", notes:"Escalate complex ERISA cases here", type:"ERISA Specialist" },
  { id:"bcbs-il", company:"BCBS Illinois", plans:["BCBS IL","Blue Cross Illinois"], phone:"(800) 541-4634", fax:"(217) 698-0154", email:"subrogationclerks@bcbsil.com", notes:"Subro direct: (800) 582-6418", type:"Insurer" },
  { id:"humana", company:"Humana", plans:["Humana"], email:"subrogationreferrals@humana.com", type:"Insurer" },
  { id:"umr", company:"UMR (UHC Subsidiary)", plans:["UMR"], phone:"(888) 264-8721", fax:"(877) 291-3251", email:"UMRprepayment@umr.com", notes:"Mail: Subrogation Unit UMR, PO Box 30541, Salt Lake City, UT 84130", type:"Insurer" },
  { id:"uhc-nv", company:"United Healthcare NV", plans:["UHC Nevada"], phone:"(702) 242-7433", fax:"(702) 804-3489", type:"Insurer" },
  { id:"bcbs-az", company:"BCBS Arizona", plans:["BCBS AZ","UPS Union"], phone:"(844) 899-4074", fax:"(602) 864-3136", email:"subrogations@azblue.com", notes:"UPS Union Fax: (602) 324-0555", type:"Insurer" },
  { id:"aetna-e", company:"Aetna (Employment-Based)", plans:["Aetna Costco","Aetna employer"], email:"TallentK@aetna.com", altEmail:"jessopf@aetna.com", fax:"(860) 754-1477", phone:"(817) 417-2142", type:"Insurer" },
  { id:"scan", company:"SCAN Health Plan", plans:["SCAN"], phone:"(562) 989-5100", fax:"(562) 989-5200", email:"claimsrecoveryunit@scanhealthplan.com", type:"Specialty" },
  { id:"quantum", company:"Quantum Health", plans:["Quantum"], phone:"(323) 360-8366", fax:"(866) 910-6989", type:"Specialty" },
  { id:"mpi", company:"Motion Picture Industries (MPI)", plans:["MPI","Motion Picture Industries"], phone:"(855) 275-4674", fax:"(818) 766-1229", email:"service@mpiphp.org", type:"Specialty" },
];

const WORKFLOW_STEPS = [
  { id:1, task:"Submit DHCS claim + identify other health insurances; activate action buttons if applicable", owner:"LN / B-Team" },
  { id:2, task:"Confirm PHI has been billed + open subro claim", owner:"LN" },
  { id:3, task:"Obtain final DHCS / Medi-Cal lien", owner:"LN" },
  { id:4, task:"Obtain final PHI lien", owner:"LN" },
  { id:5, task:"Review and update Advances", owner:"LN" },
  { id:6, task:"Draft Lien Allocation + confirm fees", owner:"LN → HA" },
  { id:7, task:"Finalize Lien Allocation", owner:"LN → HA" },
  { id:8, task:"Resolve Liens", owner:"LN" },
  { id:9, task:"Finalize Settlement Distribution", owner:"LN → HA" },
  { id:10, task:"Resolve Trust Hold Lien(s) + Finalize Trust SD", owner:"LN" },
];

const QUICK_PROMPTS = [
  { icon:"🔍", label:"Subro Lookup",     prompt:"Who handles subrogation for [health plan]? Give me their phone, fax, and email." },
  { icon:"📧", label:"PHI Subro Letter", prompt:"Draft a PHI Subrogation Letter.\nClient: [Name], DOB: [Date]\nDate of Loss: [Date]\nAccident type: [Type]\nInjuries: [List]\nHealth plan + policy #: [Plan – #]\nWhich attorney should sign?" },
  { icon:"✅", label:"Draft ROL",        prompt:"Draft a Release of Medical Lien.\nClient: [Name]\nDate of Loss: [Date]\nOffer Amount: $[Amount]\nLien Holder: [Provider Name]\nWhich attorney should sign?" },
  { icon:"🧮", label:"DHCS Calc",        prompt:"Calculate the DHCS/Medi-Cal offer.\nLien: $[amount]\nSettlement: $[amount]\nAtty Fees: [%]%\nCosts: $[amount]\nMedPay: $[amount or 0]" },
  { icon:"💰", label:"Offer Strategy",   prompt:"What should I offer on a [provider type] with a $[bill] bill?\nSettlement: $[amount]\nAtty fees: [%]%\nTotal costs: $[amount]" },
  { icon:"🏥", label:"CMS Letter",       prompt:"Draft a CMS Final Settlement Detail Letter.\nClient: [Name], Medicare #: [ID]\nDate of Loss: [Date]\nCMS Case ID: [ID]\nSettlement: $[Amount]\nAtty fees: $[Amount]\nCosts: $[Amount]\nSettlement date: [Date]" },
  { icon:"🔄", label:"MPRW Request",     prompt:"Draft an MPRW Request.\nInsurer: [Name + address]\nClient: [Name]\nDOI: [Date]\nLocation: [Location]\n3rd party settlement: $[amount]\n3rd party insurer: [Name]\nTotal bills: $[amount]\nMedPay: $[amount]\nFuture procedures: [list]" },
  { icon:"📋", label:"LA Checklist",     prompt:"Walk me through the Finalize LA checklist step by step. Settlement is $[amount], [pre-lit or lit] case." },
];

const T = { bg:"#0c0e14", panel:"#131620", border:"#1c1f30", gold:"#c9a843", goldLight:"#e8c860", text:"#dde0ee", muted:"#5c5f72", dim:"#3a3d50", green:"#6fcc90" };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#252840;border-radius:3px;}
  input,select,textarea{outline:none;-webkit-appearance:none;appearance:none;} select option{background:#141720;color:#dde0ee;}
  .mc p{margin-bottom:8px;line-height:1.65;} .mc p:last-child{margin-bottom:0;}
  .mc ul,.mc ol{padding-left:18px;margin-bottom:8px;} .mc li{margin-bottom:3px;line-height:1.6;}
  .mc strong{color:#e8c060;} .mc em{color:#c0c8e0;font-style:italic;}
  .mc code{font-family:'DM Mono',monospace;background:#1c1f30;padding:1px 5px;border-radius:3px;font-size:11.5px;}
  .mc pre{background:#141720;border:1px solid #1c1f30;border-radius:6px;padding:12px;margin-bottom:8px;font-family:'DM Mono',monospace;font-size:12px;white-space:pre-wrap;word-break:break-word;}
  .mc h3{color:#c9a843;font-size:13px;font-weight:600;margin:12px 0 5px;} .mc h4{color:#a88030;font-size:12px;font-weight:600;margin:10px 0 4px;}
  .mc hr{border:none;border-top:1px solid #1c1f30;margin:10px 0;}
  .mc table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:12px;}
  .mc th{background:#1c1f30;color:#9a9dc0;padding:6px 10px;text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:0.3px;}
  .mc td{padding:6px 10px;border-bottom:1px solid #1a1d2a;color:#c8cbe0;}
  .mc blockquote{border-left:3px solid #c9a843;padding-left:12px;margin:8px 0;color:#9a9dc0;font-style:italic;font-size:12.5px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  .qbtn:hover{background:#1c1f30 !important;}
`;

function Markdown({ text }) {
  const html = useMemo(() => {
    if (!text) return "";
    let t = text
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/```([\s\S]*?)```/g,(_,c)=>`<pre>${c.trim()}</pre>`)
      .replace(/`([^`]+)`/g,"<code>$1</code>")
      .replace(/^#### (.+)$/gm,"<h4>$1</h4>").replace(/^### (.+)$/gm,"<h3>$1</h3>")
      .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")
      .replace(/^---+$/gm,"<hr>");
    const rows=[];
    t=t.replace(/^\|(.+)\|$/gm,row=>{
      const cells=row.split("|").slice(1,-1).map(c=>c.trim());
      if(cells.every(c=>/^[-:]+$/.test(c))) return "SKIP_ROW";
      rows.push(cells); return "ROW_PLACEHOLDER";
    });
    if(rows.length){
      t=t.replace(/(ROW_PLACEHOLDER\n?)+/g,block=>{
        const count=(block.match(/ROW_PLACEHOLDER/g)||[]).length;
        const slice=rows.splice(0,count);
        if(!slice.length) return "";
        const [head,...body]=slice;
        const th=head.map(c=>`<th>${c}</th>`).join("");
        const trs=body.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");
        return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
      }).replace(/SKIP_ROW\n?/g,"");
    }
    const lines=t.split("\n");
    const out=[]; let list=null,ltype=null;
    for(const ln of lines){
      const ul=ln.match(/^[*-] (.+)$/),ol=ln.match(/^\d+\. (.+)$/);
      if(ul||ol){
        const tp=ul?"ul":"ol",ct=ul?ul[1]:ol[1];
        if(list&&ltype!==tp){out.push(`</${ltype}>`);list=null;}
        if(!list){out.push(`<${tp}>`);list=true;ltype=tp;}
        out.push(`<li>${ct}</li>`);
      } else {
        if(list){out.push(`</${ltype}>`);list=null;ltype=null;}
        const skip=ln.match(/^<(h[34]|table|thead|tbody|tr|pre|hr|ul|ol|li)/)||ln.trim()==="";
        if(skip||ln.includes("&lt;")||ln.includes("&gt;")) out.push(ln);
        else if(ln.trim()) out.push(`<p>${ln}</p>`);
      }
    }
    if(list) out.push(`</${ltype}>`);
    return out.join("\n");
  },[text]);
  return <div className="mc" dangerouslySetInnerHTML={{__html:html}} />;
}

function Inp({value,onChange,placeholder,mono}){
  const [f,setF]=useState(false);
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    onFocus={()=>setF(true)} onBlur={()=>setF(false)}
    style={{width:"100%",background:"#141720",border:`1px solid ${f?T.gold:T.border}`,borderRadius:6,padding:"9px 12px",color:T.text,fontFamily:mono?"'DM Mono',monospace":"'DM Sans',sans-serif",fontSize:13,transition:"border-color 0.15s"}}/>;
}
function Sel({value,onChange,children}){
  const [f,setF]=useState(false);
  return <select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
    style={{width:"100%",background:"#141720",border:`1px solid ${f?T.gold:T.border}`,borderRadius:6,padding:"9px 12px",color:value?T.text:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"}}>{children}</select>;
}
function Field({label,children}){return <div style={{marginBottom:12}}><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:5,letterSpacing:"0.3px"}}>{label}</div>{children}</div>;}
function Head({title,sub}){return <div style={{marginBottom:22}}><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:600,color:"#eae6d8",lineHeight:1.1}}>{title}</h2>{sub&&<p style={{fontSize:12,color:T.muted,marginTop:5}}>{sub}</p>}</div>;}

export default function LiensApp() {
  const [tab,setTab]=useState("ai");
  const TABS=[{id:"ai",label:"AI Assistant",icon:"✦"},{id:"subro",label:"Subro Lookup",icon:"🔍"},{id:"offer",label:"Offer Calc",icon:"💰"},{id:"flow",label:"Workflow",icon:"📋"}];
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,color:T.text,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{background:T.panel,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:8,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 0"}}>
          <div style={{width:30,height:30,background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚖</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14.5,fontWeight:600,color:"#ece8d8",lineHeight:1.1}}>WCTL Liens AI</div>
            <div style={{fontSize:9.5,color:T.dim,letterSpacing:"0.3px"}}>West Coast Trial Lawyers, APLC</div>
          </div>
        </div>
        <div style={{display:"flex",marginLeft:10}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{background:"none",border:"none",cursor:"pointer",padding:"13px 13px",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,color:tab===t.id?T.gold:T.muted,borderBottom:tab===t.id?`2px solid ${T.gold}`:"2px solid transparent",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 6px ${T.green}`}}/>
          <span style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono',monospace"}}>AI Online</span>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="ai"    && <AiPanel />}
        {tab==="subro" && <div style={{flex:1,overflow:"auto",padding:"20px"}}><SubroPanel /></div>}
        {tab==="offer" && <div style={{flex:1,overflow:"auto",padding:"20px"}}><OfferPanel /></div>}
        {tab==="flow"  && <div style={{flex:1,overflow:"auto",padding:"20px"}}><WorkflowPanel /></div>}
      </div>
    </div>
  );
}

function AiPanel() {
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hi! I'm your WCTL Liens AI — trained on the firm's full lien workflow, offer formulas, subro contacts, and all 12 document templates.\n\nTell me what you need or pick a quick-start on the left."}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const taRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const autosize=()=>{
    const ta=taRef.current; if(!ta) return;
    ta.style.height="auto"; ta.style.height=Math.min(ta.scrollHeight,160)+"px";
  };

  const send=async(override)=>{
    const content=(override||input).trim(); if(!content||loading) return;
    setInput(""); if(taRef.current) taRef.current.style.height="auto";
    const updated=[...msgs,{role:"user",content}];
    setMsgs(updated); setLoading(true);
    try {
      // Calls YOUR backend — API key never touches the browser
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages: updated.map(m=>({role:m.role,content:m.content})) })
      });
      const data=await res.json();
      const reply=data.content||data.error||"Sorry, something went wrong.";
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
    } catch(e){
      setMsgs(p=>[...p,{role:"assistant",content:"⚠️ Connection error. Please try again."}]);
    }
    setLoading(false);
  };

  return (
    <div style={{flex:1,display:"flex",height:"100%",overflow:"hidden"}}>
      <div style={{width:165,borderRight:`1px solid ${T.border}`,background:"#0f1118",flexShrink:0,overflowY:"auto",padding:"12px 8px"}}>
        <div style={{fontSize:9.5,textTransform:"uppercase",letterSpacing:"1px",color:T.dim,fontWeight:700,padding:"0 6px",marginBottom:8}}>Quick Start</div>
        {QUICK_PROMPTS.map(q=>(
          <button key={q.label} className="qbtn" onClick={()=>send(q.prompt)} disabled={loading}
            style={{width:"100%",background:"none",border:"none",cursor:loading?"not-allowed":"pointer",padding:"7px 8px",borderRadius:6,marginBottom:3,textAlign:"left",display:"flex",alignItems:"center",gap:7,opacity:loading?0.5:1}}>
            <span style={{fontSize:13,flexShrink:0}}>{q.icon}</span>
            <span style={{fontSize:11.5,lineHeight:1.4,color:"#9a9dc0"}}>{q.label}</span>
          </button>
        ))}
        <div style={{marginTop:16,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
          <button className="qbtn" onClick={()=>setMsgs([{role:"assistant",content:"Hi! I'm your WCTL Liens AI — trained on the firm's full lien workflow, offer formulas, subro contacts, and all 12 document templates.\n\nTell me what you need or pick a quick-start on the left."}])}
            style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"7px 8px",borderRadius:6,textAlign:"left",display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:13}}>🗑</span>
            <span style={{fontSize:11.5,color:"#9a9dc0"}}>Clear chat</span>
          </button>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:16,justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.2s ease"}}>
              {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginTop:1}}>⚖</div>}
              <div style={{maxWidth:"78%",borderRadius:m.role==="user"?"12px 12px 2px 12px":"2px 12px 12px 12px",padding:"10px 14px",fontSize:13,lineHeight:1.65,background:m.role==="user"?"#1a2040":T.panel,border:`1px solid ${m.role==="user"?"#2a3060":T.border}`,color:m.role==="user"?"#c8d0f0":T.text}}>
                {m.role==="assistant"?<Markdown text={m.content}/>:<span style={{whiteSpace:"pre-wrap"}}>{m.content}</span>}
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⚖</div>
              <div style={{background:T.panel,border:`1px solid ${T.border}`,borderRadius:"2px 12px 12px 12px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:T.gold,animation:`blink 1.2s ease ${d*0.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,background:"#0f1118"}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{flex:1,background:"#141720",border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px",transition:"border-color 0.15s"}}
              onFocusCapture={e=>e.currentTarget.style.borderColor=T.gold}
              onBlurCapture={e=>e.currentTarget.style.borderColor=T.border}>
              <textarea ref={taRef} rows={1} value={input}
                onChange={e=>{setInput(e.target.value);autosize();}}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                placeholder="Ask anything — subro contacts, offer calcs, document drafts, workflow guidance..."
                style={{width:"100%",background:"none",border:"none",color:T.text,resize:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.5,maxHeight:160,overflow:"auto"}}/>
            </div>
            <button onClick={()=>send()} disabled={loading||!input.trim()}
              style={{width:42,height:42,borderRadius:9,flexShrink:0,cursor:"pointer",border:"none",
                background:input.trim()&&!loading?`linear-gradient(135deg,${T.gold},${T.goldLight})`:"#1c1f30",
                color:input.trim()&&!loading?"#0c0e14":T.dim,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
              {loading?<div style={{width:16,height:16,border:`2px solid ${T.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>:"↑"}
            </button>
          </div>
          <div style={{marginTop:7,fontSize:10,color:T.dim,textAlign:"center"}}>Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  );
}

function SubroPanel() {
  const [q,setQ]=useState("");
  const [copied,setCopied]=useState(null);
  const results=useMemo(()=>{if(!q.trim())return SUBRO_DATA;const lq=q.toLowerCase();return SUBRO_DATA.filter(s=>s.company.toLowerCase().includes(lq)||s.plans.some(p=>p.toLowerCase().includes(lq))||(s.notes||"").toLowerCase().includes(lq)||s.type.toLowerCase().includes(lq));},[q]);
  const copy=(v,id)=>{navigator.clipboard.writeText(v).catch(()=>{});setCopied(id);setTimeout(()=>setCopied(null),1600);};
  const TS={"Government":{bg:"#0d1525",bd:"#1a2f50",badge:"#4a7ab8",tc:"#7aaee0"},"Third-Party Admin":{bg:"#0d1a12",bd:"#1a3825",badge:"#3a7850",tc:"#7abf94"},"Insurer":{bg:"#1a0d12",bd:"#381823",badge:"#883050",tc:"#d08090"},"ERISA Specialist":{bg:"#1a130d",bd:"#382e18",badge:"#886030",tc:"#d0a870"},"Specialty":{bg:"#130d1a",bd:"#281638",badge:"#603880",tc:"#a870d0"}};
  const CR=({icon,label,value})=>{const id=label+value;return<div onClick={()=>copy(value,id)} title="Click to copy" style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"3px 0"}}><span style={{fontSize:11,width:16,textAlign:"center"}}>{icon}</span><span style={{color:T.dim,fontSize:10,width:32,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",flexShrink:0}}>{label}</span><span style={{color:copied===id?"#6fd4b0":"#a8abc0",fontSize:12,fontFamily:"'DM Mono',monospace",flex:1}}>{copied===id?"✓ Copied":value}</span></div>;};
  return (
    <div>
      <Head title="Subrogation Contact Lookup" sub="Search by health plan or company. Click any field to copy." />
      <div style={{position:"relative",marginBottom:18}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.dim}}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Kaiser, Anthem, ERISA, Government..."
          style={{width:"100%",background:"#141720",border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px 10px 36px",color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:13}}
          onFocus={e=>e.target.style.borderColor=T.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
      </div>
      {results.length===0&&<div style={{textAlign:"center",color:"#c97a43",padding:"40px",fontSize:13}}>No results for "{q}"</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(305px,1fr))",gap:10}}>
        {results.map(s=>{const st=TS[s.type]||TS["Specialty"];return(
          <div key={s.id} style={{background:st.bg,border:`1px solid ${st.bd}`,borderRadius:8,padding:14}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:10}}>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"#e8eaf5"}}>{s.company}</div><div style={{fontSize:10.5,color:T.dim,marginTop:3,lineHeight:1.6}}>{s.plans.join(" · ")}</div></div>
              <span style={{fontSize:9.5,background:st.badge+"22",color:st.tc,border:`1px solid ${st.badge}44`,borderRadius:3,padding:"2px 7px",whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace",flexShrink:0}}>{s.type}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {s.phone&&<CR icon="📞" label="Phone" value={s.phone}/>}
              {s.altPhone&&<CR icon="📞" label="Alt" value={s.altPhone}/>}
              {s.fax&&<CR icon="📠" label="Fax" value={s.fax}/>}
              {s.altFax&&<CR icon="📠" label="Alt Fax" value={s.altFax}/>}
              {s.email&&<CR icon="✉️" label="Email" value={s.email}/>}
              {s.altEmail&&<CR icon="✉️" label="Email2" value={s.altEmail}/>}
              {s.portal&&<CR icon="🌐" label="Portal" value={s.portal}/>}
              {s.contact&&<CR icon="👤" label="Contact" value={s.contact}/>}
            </div>
            {s.notes&&<div style={{marginTop:10,fontSize:11,color:T.gold,background:"#1c1a0d",borderRadius:4,padding:"6px 9px",border:"1px solid #3a3015",lineHeight:1.5}}>{s.notes}</div>}
          </div>);})}
      </div>
    </div>
  );
}

function OfferPanel() {
  const [type,setType]=useState("");const [inp,setInp]=useState({});const [result,setResult]=useState(null);
  const set=(k,v)=>setInp(p=>({...p,[k]:v}));const g=k=>inp[k]||"";
  const TYPES=[{id:"chiro",l:"Chiropractic"},{id:"xray",l:"X-Ray Imaging"},{id:"mri",l:"MRI Imaging"},{id:"spec",l:"PM / Ortho / Neuro / Specialist"},{id:"inj-tpi",l:"Injections — TPI / Cortisone"},{id:"inj-o",l:"Injections — Other"},{id:"surg",l:"Surgery"},{id:"sc",l:"Surgery Center (Injection Facility)"},{id:"dhcs",l:"Medi-Cal / DHCS"},{id:"cms",l:"Medicare / CMS"},{id:"h3045",l:"Hospital Lien (CCP §3045)"},{id:"phi3040",l:"Private HI Lien (CCP §3040)"}];
  const FLDS={chiro:[{k:"bill",l:"Total Bill ($)"},{k:"visits",l:"Number of Visits"}],xray:[{k:"n",l:"Number of X-Rays"}],mri:[{k:"n",l:"Number of MRIs"}],spec:[{k:"c",l:"Initial Consults"},{k:"f",l:"Follow-Ups"}],"inj-tpi":[{k:"n",l:"Number of Injections"}],"inj-o":[{k:"n",l:"Number of Injections"}],surg:[{k:"cx",l:"Complex Surgery?",sel:["No","Yes"]}],sc:[],dhcs:[{k:"lien",l:"DHCS Lien ($)"},{k:"settle",l:"Total Settlement ($)"},{k:"fp",l:"Attorney Fees %"},{k:"costs",l:"Total Costs ($)"},{k:"mp",l:"MedPay (0 if none) ($)"}],cms:[{k:"lien",l:"CMS Lien ($)"},{k:"settle",l:"Total Settlement ($)"},{k:"fp",l:"Attorney Fees %"},{k:"costs",l:"Total Costs ($)"}],h3045:[{k:"lien",l:"Hospital Lien ($)"},{k:"settle",l:"Total Settlement ($)"},{k:"fp",l:"Attorney Fees %"},{k:"costs",l:"Total Costs ($)"},{k:"total",l:"Total All Medical Liens ($)"}],phi3040:[{k:"lien",l:"HI Lien ($)"},{k:"settle",l:"Total Settlement ($)"},{k:"fp",l:"Attorney Fees %"},{k:"costs",l:"Total Costs ($)"},{k:"total",l:"Total All Liens ($)"}]};
  const nv=k=>{const v=parseFloat(String(inp[k]||0).replace(/[$,\s]/g,""));return isNaN(v)?0:v;};
  const fmt=v=>v==null?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v);
  const calc=()=>{
    let r=null;
    if(type==="chiro"){const b=nv("bill"),v=nv("visits"),h=b/2,vv=v*100,o=Math.max(h,vv);r={lines:[{l:"Half of bill",v:fmt(h)},{l:`$100 × ${v} visits`,v:fmt(vv)},{l:"Offer (higher of two)",v:fmt(o),hi:true}],note:"Al's list / Allen's referrals → pay as much as possible."};}
    else if(type==="xray"){const x=nv("n");r={lines:[{l:"Per x-ray",v:"$50–$100"},{l:`Total (${x} x-rays)`,v:`${fmt(x*50)} – ${fmt(x*100)}`,hi:true}]};}
    else if(type==="mri"){const m=nv("n");r={lines:[{l:"Per MRI",v:"$400–$500"},{l:`Total (${m} MRIs)`,v:`${fmt(m*400)} – ${fmt(m*500)}`,hi:true}],note:"11 Med Funding MRIs → more if affordable"};}
    else if(type==="spec"){const c=nv("c"),f=nv("f");r={lines:[{l:`${c} consults`,v:`${fmt(c*500)} – ${fmt(c*1000)}`},{l:`${f} follow-ups`,v:`${fmt(f*300)} – ${fmt(f*600)}`},{l:"Total",v:`${fmt(c*500+f*300)} – ${fmt(c*1000+f*600)}`,hi:true}]};}
    else if(type==="inj-tpi"){const x=nv("n");r={lines:[{l:`${x} × ~$500`,v:fmt(x*500),hi:true}]};}
    else if(type==="inj-o"){const x=nv("n");r={lines:[{l:`${x} × $1,000–$2,000`,v:`${fmt(x*1000)} – ${fmt(x*2000)}`,hi:true}]};}
    else if(type==="surg"){const cx=g("cx")==="Yes";r={lines:[{l:"Standard",v:"$10K–$25K"},{l:"Applicable range",v:cx?"$10,000–$50,000":"$10,000–$25,000",hi:true}],note:"Leave room for pushback with unfamiliar providers"};}
    else if(type==="sc"){r={lines:[{l:"Per DOS",v:"$2,500–$3,000",hi:true}],note:"Do NOT work with pro-rata centers"};}
    else if(type==="dhcs"){const lien=nv("lien"),s=nv("settle"),fp=nv("fp"),c=nv("costs"),mp=nv("mp");const fees=s*(fp/100);const f1=lien*0.75,f2=lien*0.75-(c*lien/s),f3=(s-fees-c)/2,o=Math.min(f1,f2,f3);const lines=[{l:"Formula 1 — Lien × 75%",v:fmt(f1)},{l:"Formula 2 — Lien×75% − (Costs×Lien÷Settlement)",v:fmt(f2),note:"WCTL requests"},{l:"Formula 3 — (Settlement−Fees−Costs) ÷ 2",v:fmt(f3),note:"Medi-Cal cap"},{l:"Offer (lowest)",v:fmt(o),hi:true}];if(mp>0)lines.push({l:"MedPay-adjusted offer",v:fmt((lien-mp)*0.75-(c*lien/s)+mp),note:"when MedPay applies"});r={lines,note:"Always use lowest formula. Confirm Ahlborn if client not made whole."};}
    else if(type==="cms"){const lien=nv("lien"),s=nv("settle"),fp=nv("fp"),c=nv("costs");const proc=s*(fp/100)+c,pct=proc/s,red=lien*(1-pct),cap=s-proc,o=Math.min(red,cap);r={lines:[{l:"Procurement costs (fees+costs)",v:fmt(proc)},{l:"As % of settlement",v:(pct*100).toFixed(1)+"%"},{l:"Reduced lien",v:fmt(red)},{l:"Cap (settlement − procurement)",v:fmt(cap)},{l:"Offer (lower)",v:fmt(o),hi:true}],note:"Must get final demand letter, not just payment summary."};}
    else if(type==="h3045"){const lien=nv("lien"),s=nv("settle"),fp=nv("fp"),c=nv("costs"),tot=nv("total");const fees=s*(fp/100),hn=(s-fees-c)/2,pr=hn*(lien/tot),o=Math.min(lien,pr);r={lines:[{l:"Net after fees & costs",v:fmt(s-fees-c)},{l:"Max entitled (half of net)",v:fmt(hn)},{l:"Pro-rata share",v:((lien/tot)*100).toFixed(1)+"%"},{l:"Offer",v:fmt(o),hi:true}],note:"Only covers ER/hospital bills within first 100 days"};}
    else if(type==="phi3040"){const lien=nv("lien"),s=nv("settle"),fp=nv("fp"),c=nv("costs"),tot=nv("total");const fees=s*(fp/100),pr=(lien/tot)*(s/3),fr=lien*(1-(fees+c)/s),o=Math.min(pr,fr);r={lines:[{l:"Pro-rata 3040 — lien share × 1/3 settlement",v:fmt(pr)},{l:"3040(f) — lien × (1 − fees% − costs%)",v:fmt(fr)},{l:"Offer (lesser)",v:fmt(o),hi:true}],note:"Start with waiver if catastrophic or client not made whole."};}
    setResult(r);
  };
  const flds=FLDS[type]||[];
  return (
    <div style={{maxWidth:500}}>
      <Head title="Offer Range Calculator" sub="WCTL formulas for all lien and provider types" />
      <Field label="Provider / Lien Type"><Sel value={type} onChange={v=>{setType(v);setInp({});setResult(null);}}><option value="">Select type...</option>{TYPES.map(t=><option key={t.id} value={t.id}>{t.l}</option>)}</Sel></Field>
      {flds.map(f=><Field key={f.k} label={f.l}>{f.sel?<Sel value={g(f.k)||f.sel[0]} onChange={v=>set(f.k,v)}>{f.sel.map(o=><option key={o}>{o}</option>)}</Sel>:<Inp value={g(f.k)} onChange={v=>set(f.k,v)} placeholder="Enter amount..." mono/>}</Field>)}
      {type&&<button onClick={calc} style={{width:"100%",marginTop:6,background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:"#0c0e14",border:"none",borderRadius:7,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Calculate →</button>}
      {result&&(
        <div style={{marginTop:16,background:"#0d1a10",border:"1px solid #1a3820",borderRadius:8,padding:16}}>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:"#4a7a50",marginBottom:12,fontWeight:700}}>Breakdown</div>
          {result.lines.map((ln,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<result.lines.length-1?"1px solid #152218":"none"}}>
            <div><span style={{fontSize:12.5,color:ln.hi?"#e8e4d0":"#5a6e5c"}}>{ln.l}</span>{ln.note&&<span style={{fontSize:10,color:T.gold,marginLeft:8}}>({ln.note})</span>}</div>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:ln.hi?15:12,fontWeight:ln.hi?600:400,color:ln.hi?T.green:"#5a6e5c"}}>{ln.v}</span>
          </div>)}
          {result.note&&<div style={{marginTop:10,fontSize:11.5,color:T.gold,background:"#1a180a",borderRadius:4,padding:"7px 10px",border:"1px solid #3a3015",lineHeight:1.6}}>⚠️ {result.note}</div>}
          <div style={{marginTop:8,fontSize:10,color:T.dim,textAlign:"center"}}>Confirm final amount with LN — never auto-select</div>
        </div>
      )}
    </div>
  );
}

function WorkflowPanel() {
  const [done,setDone]=useState(new Set());const [cn,setCn]=useState("");
  const toggle=id=>setDone(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const pct=Math.round((done.size/WORKFLOW_STEPS.length)*100);
  return (
    <div style={{maxWidth:620}}>
      <Head title="10-Step Lien Workflow" sub="Click any step to mark complete." />
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        <div style={{flex:1}}><Inp value={cn} onChange={setCn} placeholder="Case name or Filevine # (optional)..."/></div>
        <button onClick={()=>setDone(new Set())} style={{background:"#1c1f30",border:`1px solid ${T.border}`,borderRadius:6,padding:"9px 14px",color:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer"}}>Reset</button>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:11.5}}>
          <span style={{color:T.muted}}>{done.size} of {WORKFLOW_STEPS.length} complete</span>
          <span style={{color:pct===100?T.green:T.gold,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{pct}%</span>
        </div>
        <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?T.green:`linear-gradient(90deg,${T.gold},${T.goldLight})`,borderRadius:2,transition:"width 0.3s ease"}}/></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {WORKFLOW_STEPS.map(s=>{const d=done.has(s.id);return(
          <div key={s.id} onClick={()=>toggle(s.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:d?"#0d1a10":T.panel,border:`1px solid ${d?"#1a3820":T.border}`,borderRadius:7,cursor:"pointer",transition:"all 0.15s",opacity:d?0.6:1}}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:d?"#254530":"#181b28",border:`2px solid ${d?"#4a9a50":"#252840"}`,fontSize:d?13:11.5,color:d?T.green:T.dim,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{d?"✓":s.id}</div>
            <div style={{flex:1,fontSize:13,color:d?"#507a58":T.text,textDecoration:d?"line-through":"none",lineHeight:1.4}}>{s.task}</div>
            <span style={{fontSize:9.5,fontFamily:"'DM Mono',monospace",padding:"2px 7px",background:"#181b28",border:`1px solid ${T.border}`,borderRadius:3,color:T.dim,whiteSpace:"nowrap",flexShrink:0}}>{s.owner}</span>
          </div>);})}
      </div>
      {pct===100&&<div style={{marginTop:14,textAlign:"center",padding:12,background:"#0d1a10",border:"1px solid #2a5a30",borderRadius:8,color:T.green,fontSize:14,fontWeight:600}}>✅ All steps complete{cn?` — ${cn}`:""}!</div>}
    </div>
  );
}
