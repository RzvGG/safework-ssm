import { useState } from 'react'
import { C, MATERIALE_DB, TESTE_DB, getAngajati, getStats } from './data.js'
import { Icon, Logo, Btn, TLink, Pill, Ava, PBar, Note, Toast, SigPad, Toggle, Sel } from './ui.jsx'
import { DOCS_INIT } from './Desktop.jsx'

const Shell = ({ children, bottom, status }) => (
  <div style={{fontFamily:'Manrope, sans-serif',minHeight:'100vh',background:C.bg,display:'flex',flexDirection:'column',maxWidth:430,margin:'0 auto',position:'relative'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 22px 4px',fontSize:12,fontWeight:600,color:C.t0}}>
      <span>{new Date().toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}</span>
      <span style={{fontFamily:C.mono,fontSize:10,color:C.teal,display:'flex',gap:5,alignItems:'center'}}><span style={{width:6,height:6,borderRadius:99,background:C.green}}/>{status||'offline ok'}</span>
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'8px 16px 110px'}}>{children}</div>
    {bottom}
  </div>
)
const CTA = ({ label, onClick, outline, disabled, icon }) => (
  <button onClick={onClick} disabled={disabled} style={{border:outline?`1.5px solid ${C.lineHi}`:'none',background:disabled?'#D5D2CA':outline?C.white:C.primary,color:outline?C.t0:'#fff',fontFamily:'inherit',fontSize:15,fontWeight:700,padding:14,borderRadius:14,cursor:disabled?'not-allowed':'pointer',minHeight:52,width:'100%',display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}>{icon&&<Icon name={icon} size={16}/>}{label}</button>
)
const MCard = ({ children, style={}, onClick }) => <div onClick={onClick} style={{background:C.white,borderRadius:18,padding:16,display:'flex',flexDirection:'column',gap:12,boxShadow:C.shadow,cursor:onClick?'pointer':'default',...style}}>{children}</div>
const Row = ({ title, sub, right, onClick }) => (
  <MCard onClick={onClick} style={{flexDirection:'row',alignItems:'center',gap:12,minHeight:56}}>
    <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:C.t0}}>{title}</div>{sub&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>{sub}</div>}</div>
    {right}<Icon name='chevR' size={16} color={C.t3}/>
  </MCard>
)
const TabBar = ({ tabs, value, onChange }) => (
  <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:C.white,borderTop:`1px solid ${C.line}`,display:'flex',padding:'6px 8px calc(10px + env(safe-area-inset-bottom))',zIndex:50}}>
    {tabs.map(([id,ic,l,badge]) => (
      <button key={id} onClick={()=>onChange(id)} style={{flex:1,minHeight:48,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,fontFamily:'inherit',color:value===id?C.t0:C.t2,fontWeight:value===id?800:500,fontSize:11,position:'relative'}}>
        <Icon name={ic} size={20} stroke={value===id?2.2:1.7}/>{l}
        {badge>0 && <span style={{position:'absolute',top:4,right:'calc(50% - 18px)',fontFamily:C.mono,fontSize:9,fontWeight:700,background:C.red,color:'#fff',padding:'1px 5px',borderRadius:999}}>{badge}</span>}
      </button>
    ))}
  </div>
)
const Header = ({ label, title, onBack, right }) => (
  <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 6px 12px'}}>
    {onBack && <button onClick={onBack} style={{background:'none',border:'none',color:C.t0,cursor:'pointer',padding:4,minWidth:44,minHeight:44,display:'flex',alignItems:'center'}}><Icon name='arrowL' size={20}/></button>}
    <div style={{flex:1,minWidth:0}}>{label&&<div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,fontWeight:600}}>{label}</div>}<div style={{fontSize:20,fontWeight:800,letterSpacing:'-0.01em',color:C.t0}}>{title}</div></div>
    {right}
  </div>
)

/* ═══════════════════════════════════════
   APLICAȚIA ANGAJAT — M2 acasă · M8 material · M3 test · M4 semnare · M5 confirmare
═══════════════════════════════════════ */
export function EmployeeApp({ user, onLogout }) {
  const first = (user?.name||'Dan').split(' ')[0]
  const [tab,setTab] = useState('acasa')
  const [flow,setFlow] = useState(null)
  const [tr,setTr] = useState([
    {id:'per',label:'Instruirea periodică de siguranță',legal:'IP — Instructaj periodic',mat:2,test:1,cap:0,signed:false,termen:'20 august'},
    {id:'iig',label:'Instruirea introductiv-generală',legal:'IIG',mat:0,test:0,cap:0,signed:true,data:'04.03.2026'},
    {id:'ilm',label:'Instruirea la locul de muncă',legal:'ILM',mat:1,test:1,cap:0,signed:true,data:'04.03.2026'},
  ])
  const [tst,setTst] = useState(null)
  const toast = m => setTst({m,k:Date.now()})
  const upd = (id,p) => setTr(ts=>ts.map(t=>t.id===id?{...t,...p}:t))
  const T = id => tr.find(t=>t.id===id)
  const cur = T('per')
  const mat = MATERIALE_DB[cur.mat], test = TESTE_DB[cur.test]
  const nCap = mat.capitole.length

  if (flow?.type==='modul') {
    const i = Math.min(cur.cap, nCap-1); const [titlu,cont] = mat.capitole[i]; const last = i>=nCap-1
    return (
      <Shell>
        <Header onBack={()=>setFlow(null)} label={`Capitolul ${i+1} din ${nCap}`} title={cur.label} right={<span style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>~2 min</span>} />
        <PBar val={i/nCap*100} color={C.green} style={{marginBottom:14}} />
        <MCard>
          <strong style={{fontSize:18,fontWeight:800,letterSpacing:'-0.01em',lineHeight:1.3}}>{titlu}</strong>
          <div style={{height:120,borderRadius:12,background:'repeating-linear-gradient(135deg,#EEEDE9 0 8px,#F7F6F3 8px 16px)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:C.mono,fontSize:10,color:C.t3}}>Ilustrație / video · 0:48</div>
          <span style={{fontSize:14.5,lineHeight:1.7,color:C.t1}}>{cont}</span>
        </MCard>
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,padding:'12px 16px calc(16px + env(safe-area-inset-bottom))',background:'linear-gradient(transparent, #F7F6F3 30%)'}}>
          {!last ? <CTA label='Am înțeles — capitolul următor' onClick={()=>upd('per',{cap:cur.cap+1})}/> : <CTA label='Am înțeles — începe testul' onClick={()=>setFlow({type:'test',qi:0,ans:{}})}/>}
          <div style={{textAlign:'center',fontSize:11,color:C.t3,marginTop:8}}>Progresul se salvează automat — poți relua oricând</div>
        </div>
      </Shell>
    )
  }
  if (flow?.type==='test') {
    const qi = flow.qi, ans = flow.ans, N = test.intrebari.length
    const wrongAllowed = N - Math.ceil(N*test.prag/100)
    if (qi>=N) {
      const c = test.intrebari.filter((q,i)=>ans[i]===q.c).length; const ok = c>=N-wrongAllowed
      return (
        <Shell>
          <div style={{display:'flex',flexDirection:'column',gap:14,justifyContent:'center',minHeight:'70vh'}}>
            <MCard style={{alignItems:'center',textAlign:'center',padding:28}}>
              <span style={{width:52,height:52,borderRadius:999,background:ok?C.green:C.red,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={ok?'check':'x'} size={24} stroke={2.6}/></span>
              <strong style={{fontSize:32,fontWeight:800,color:ok?C.teal:C.red}}>{c} din {N}</strong>
              <span style={{fontSize:15,fontWeight:800}}>{ok?'Test trecut':'Nu ai trecut testul'}</span>
              <span style={{fontSize:13,color:C.t2,lineHeight:1.5}}>{ok?'Mai rămâne un pas: semnezi fișa de instruire.':`Puteai greși ${wrongAllowed}. Poți relua capitolele și testul oricând.`}</span>
            </MCard>
            {ok ? <CTA label='Semnez fișa de instruire' onClick={()=>setFlow({type:'sign',score:c})}/> : <><CTA label='Reiau testul' onClick={()=>setFlow({type:'test',qi:0,ans:{}})}/><CTA label='Recitesc capitolele' outline onClick={()=>{upd('per',{cap:0});setFlow({type:'modul'})}}/></>}
          </div>
        </Shell>
      )
    }
    const q = test.intrebari[qi], sel = ans[qi]
    return (
      <Shell status='se sincronizează la semnal'>
        <Header onBack={()=>setFlow(null)} label={`Întrebarea ${qi+1} din ${N}`} title={`Poți greși ${wrongAllowed}`} />
        <PBar val={qi/N*100} color={C.green} style={{marginBottom:14}} />
        <MCard><strong style={{fontSize:18,fontWeight:800,lineHeight:1.35}}>{q.q}</strong></MCard>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:12}}>
          {q.a.map((o,oi) => (
            <div key={oi} onClick={()=>setFlow({...flow,ans:{...ans,[qi]:oi}})} style={{background:C.white,border:`2px solid ${sel===oi?C.primary:'transparent'}`,borderRadius:14,padding:'16px',fontSize:14.5,fontWeight:sel===oi?700:500,cursor:'pointer',minHeight:56,display:'flex',alignItems:'center',gap:12,boxShadow:C.shadow}}>
              <span style={{width:18,height:18,borderRadius:999,border:`2px solid ${sel===oi?C.primary:C.lineHi}`,background:sel===oi?C.primary:'transparent',flexShrink:0}}/>{o}
            </div>
          ))}
        </div>
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,padding:'12px 16px calc(16px + env(safe-area-inset-bottom))',background:'linear-gradient(transparent, #F7F6F3 30%)'}}><CTA label='Răspunde' disabled={sel===undefined} onClick={()=>setFlow({...flow,qi:qi+1})}/></div>
      </Shell>
    )
  }
  if (flow?.type==='sign') {
    const [has,setHas] = [flow.has,v=>setFlow({...flow,has:v})]
    return (
      <Shell status='offline ok'>
        <Header onBack={()=>setFlow(null)} title='Semnează fișa de instruire' />
        <p style={{margin:'0 6px 14px',fontSize:14,lineHeight:1.6,color:C.t1}}>Ai parcurs materialul și ai trecut testul cu <strong style={{color:C.t0}}>{flow.score} din {test.intrebari.length}</strong>. Semnătura confirmă instruirea din {new Date().toLocaleDateString('ro-RO',{day:'numeric',month:'long',year:'numeric'})}.</p>
        <MCard>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:14,fontWeight:800}}>Fișă de instruire periodică</div><div style={{fontFamily:C.mono,fontSize:10,color:C.t3,marginTop:2}}>Model Anexa 11 · HG 1425/2006 · DOC-2026-087</div></div><Icon name='filetext' size={20} color={C.t2}/></div>
          <SigPad height={200} onChange={setHas} name={first+' '+(user?.name?.split(' ')[1]?.[0]||'P')+'.'} />
          <div style={{fontSize:12,color:C.t2,textAlign:'center'}}>Se atașează data, ora și dispozitivul</div>
        </MCard>
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,padding:'12px 16px calc(16px + env(safe-area-inset-bottom))',background:'linear-gradient(transparent, #F7F6F3 30%)'}}><CTA label='Semnez fișa' disabled={!has} onClick={()=>{upd('per',{signed:true,data:new Date().toLocaleDateString('ro-RO')});setFlow({type:'done'})}}/></div>
      </Shell>
    )
  }
  if (flow?.type==='done') return (
    <Shell status={'sincronizat la '+new Date().toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}>
      <div style={{display:'flex',flexDirection:'column',gap:14,justifyContent:'center',minHeight:'70vh'}}>
        <MCard style={{alignItems:'center',textAlign:'center',padding:28}}>
          <span style={{width:56,height:56,borderRadius:999,background:C.green,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name='check' size={26} stroke={2.6}/></span>
          <strong style={{fontSize:24,fontWeight:800,letterSpacing:'-0.02em'}}>Gata, {first}!</strong>
          <span style={{fontSize:14,color:C.t1,lineHeight:1.6}}>Fișa ta e semnată și arhivată. Adeverința de instruire ți-a fost trimisă pe email.</span>
        </MCard>
        <MCard style={{flexDirection:'row',alignItems:'center'}}><Icon name='filetext' size={22} color={C.t2}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>Adeverință instruire IP</div><div style={{fontSize:12,color:C.t2}}>PDF · 180 KB</div></div><Btn label='Descarcă' size='sm' variant='outline' onClick={()=>toast('Adeverința se descarcă')}/></MCard>
        <Note>Următoarea instruire: <strong>februarie 2027</strong>. Îți trimitem noi aminte — nu ai nimic de ținut minte.</Note>
        <CTA label='Închide' outline onClick={()=>{setFlow(null);setTab('acasa')}}/>
      </div>
      {tst && <Toast key={tst.k} msg={tst.m} onClose={()=>setTst(null)}/>}
    </Shell>
  )
  if (flow?.type==='medicina') return <EmpMedicina onBook={s=>{setFlow(null);toast(`Programat: ${s} · confirmarea vine pe email`)}} onBack={()=>setFlow(null)} />

  const screens = {
    acasa: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{padding:'0 6px'}}><span style={{fontSize:13,color:C.t2}}>Bună, {first} · {user?.firma||'Banca Demo România'}</span><strong style={{display:'block',fontSize:24,fontWeight:800,letterSpacing:'-0.02em',marginTop:2}}>{cur.signed?'Ești la zi':'Instruirea ta de azi'}</strong></div>
        {!cur.signed ? (
          <MCard style={{border:`2px solid ${C.primary}`}}>
            <div><strong style={{fontSize:17,fontWeight:800}}>{cur.label}</strong><div style={{fontSize:13,color:C.t2,marginTop:3}}>{nCap} capitole scurte · circa 25 de minute · test de {test.intrebari.length} întrebări la final</div></div>
            <div style={{display:'flex',alignItems:'center',gap:10}}><PBar val={cur.cap/nCap*100} color={C.green} style={{flex:1}}/><span style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>{cur.cap}/{nCap}</span></div>
            <CTA label={cur.cap>0?'Continuă de unde ai rămas':'Începe instruirea'} onClick={()=>setFlow({type:'modul'})}/>
          </MCard>
        ) : <MCard><strong style={{fontSize:16,fontWeight:800}}>{cur.label}</strong><Pill label={`Semnată · ${cur.data}`} tone='green' style={{alignSelf:'flex-start'}}/></MCard>}
        <Row title='Controlul medical' sub='Ești la zi · valabil până în feb 2027' onClick={()=>setFlow({type:'medicina'})} />
        <Row title='Fișele tale semnate' sub={`${tr.filter(t=>t.signed).length} documente · descarcă oricând`} onClick={()=>setTab('documente')} />
        {!cur.signed && <div style={{textAlign:'center',fontSize:12,color:C.t3,padding:'4px 0'}}>Termenul legal al instruirii: {cur.termen} · îți amintim noi</div>}
      </div>
    ),
    instruiri: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <Header title='Instruirile tale' />
        {tr.map(t => (
          <MCard key={t.id}>
            <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'flex-start'}}><div><strong style={{fontSize:15,fontWeight:700}}>{t.label}</strong><div style={{fontSize:12,color:C.t2,marginTop:2}}>{t.signed?`semnată · ${t.data}`:`termen ${t.termen}`}</div></div>{t.signed?<Pill label='semnată' tone='green'/>:<Pill label={t.cap>0?'în curs':'de făcut'} tone='amber'/>}</div>
            {!t.signed && <><PBar val={t.cap/MATERIALE_DB[t.mat].capitole.length*100} color={C.green}/><CTA label={t.cap>0?'Continuă':'Începe'} onClick={()=>setFlow({type:'modul'})}/></>}
          </MCard>
        ))}
        <Note>Referință legală pentru manager: {cur.legal} · HG 1425/2006 art.107.</Note>
      </div>
    ),
    raporteaza: <EmpRaporteaza onSend={()=>{toast('Raport trimis · responsabilul SSM e notificat');setTab('acasa')}} />,
    documente: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <Header title='Documentele tale' />
        {[...tr.filter(t=>t.signed).map(t=>[`Fișă de instruire — ${t.legal}`,`semnată · ${t.data}`,'la zi']),['Aviz medicina muncii','valabil până în feb 2027','la zi'],['Fișă aptitudine — angajare','emisă · 14.03.2025','la zi']].map(([t,s,st],i) => (
          <MCard key={i} style={{flexDirection:'row',alignItems:'center'}}><Icon name='filetext' size={20} color={C.t2}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700}}>{t}</div><div style={{fontSize:12,color:C.t2}}>{s}</div></div><Pill label={st} tone='green' sm/></MCard>
        ))}
        <div style={{textAlign:'center',fontFamily:C.mono,fontSize:10,color:C.t3,padding:'6px 0'}}>salvate local · disponibile fără semnal</div>
        <TLink label='Ieși din cont' onClick={onLogout} color={C.t2} style={{alignSelf:'center'}}/>
      </div>
    ),
  }
  return (
    <Shell bottom={<TabBar tabs={[['acasa','home','Acasă'],['instruiri','book','Instruiri'],['raporteaza','alert','Raportează'],['documente','filetext','Documente']]} value={tab} onChange={setTab}/>}>
      {screens[tab]}
      {tst && <Toast key={tst.k} msg={tst.m} onClose={()=>setTst(null)}/>}
    </Shell>
  )
}

function EmpRaporteaza({ onSend }) {
  const [f,setF] = useState({ce:'',unde:'',sev:'Mediu'})
  const tone = s => ({Scăzut:C.teal,Mediu:'oklch(0.45 0.12 75)',Ridicat:C.red}[s])
  const inp = {width:'100%',padding:'12px 13px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:12,fontSize:15,color:C.t0,outline:'none',boxSizing:'border-box',fontFamily:'inherit',lineHeight:1.5}
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <Header title='Raportează un incident' />
      <div style={{fontSize:13,color:C.t2,margin:'-8px 6px 0'}}>Rapid, chiar și fără semnal. Responsabilul SSM e notificat automat.</div>
      <MCard>
        <div><div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,marginBottom:6}}>Ce s-a întâmplat?</div><textarea value={f.ce} onChange={e=>setF({...f,ce:e.target.value})} rows={3} placeholder='Descrie pe scurt…' style={{...inp,resize:'none'}}/></div>
        <div><div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,marginBottom:6}}>Unde?</div><input value={f.unde} onChange={e=>setF({...f,unde:e.target.value})} placeholder='ex: Hala 2, lângă poarta B' style={inp}/></div>
        <div><div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,marginBottom:6}}>Cât de grav?</div><div style={{display:'flex',gap:8}}>{['Scăzut','Mediu','Ridicat'].map(s => <button key={s} onClick={()=>setF({...f,sev:s})} style={{flex:1,minHeight:44,border:`2px solid ${f.sev===s?tone(s):C.line}`,background:f.sev===s?C.white:'#FAFAF8',borderRadius:12,fontSize:13,fontWeight:f.sev===s?800:500,color:f.sev===s?tone(s):C.t2,cursor:'pointer',fontFamily:'inherit'}}>{s}</button>)}</div></div>
        <div style={{border:`1.5px dashed ${C.lineHi}`,borderRadius:12,padding:'16px 14px',textAlign:'center',background:'#FAFAF8',cursor:'pointer'}}><Icon name='camera' size={20} color={C.t2} style={{margin:'0 auto 4px'}}/><div style={{fontSize:13,fontWeight:600}}>Adaugă foto din teren</div><div style={{fontSize:11,color:C.t3}}>opțional · se atașează raportului</div></div>
      </MCard>
      <CTA label='Trimit raportul' disabled={!f.ce.trim()||!f.unde.trim()} onClick={onSend}/>
    </div>
  )
}

function EmpMedicina({ onBook, onBack }) {
  const zile = ['Lu 17','Ma 18','Mi 19','Jo 20','Vi 21'], ore = ['08:30','09:15','10:00','11:30','13:00','14:15']
  const [zi,setZi] = useState(null); const [ora,setOra] = useState(null)
  return (
    <Shell status='medicina muncii'>
      <Header onBack={onBack} title='Programează controlul medical' />
      <Note style={{marginBottom:12}}>Avizul tău e valabil până în <strong>feb 2027</strong>. Poți programa oricând un control înainte de termen.</Note>
      <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,margin:'8px 6px'}}>Alege ziua</div>
      <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4}}>{zile.map(z => <button key={z} onClick={()=>setZi(z)} style={{minWidth:62,minHeight:56,border:`2px solid ${zi===z?C.primary:C.line}`,background:zi===z?C.bg:C.white,borderRadius:14,fontSize:13,fontWeight:zi===z?800:500,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>{z}</button>)}</div>
      <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,margin:'14px 6px 8px'}}>Alege ora</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>{ore.map(o => <button key={o} onClick={()=>setOra(o)} style={{minHeight:44,border:`2px solid ${ora===o?C.primary:C.line}`,background:ora===o?C.bg:C.white,borderRadius:12,fontSize:14,fontWeight:ora===o?800:500,cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div>
      {zi&&ora && <MCard style={{marginTop:14}}><strong style={{fontSize:15,fontWeight:800}}>Confirmare programare</strong>{[['Clinica','MedLife Titan · et. 2, cab. 14'],['Data',`${zi} august · ora ${ora}`],['Adu cu tine','CI + fișa de post (o trimitem noi clinicii)']].map(([k,v]) => <div key={k} style={{display:'flex',justifyContent:'space-between',gap:12}}><span style={{fontFamily:C.mono,fontSize:10,textTransform:'uppercase',letterSpacing:'0.05em',color:C.t3,paddingTop:2,flexShrink:0}}>{k}</span><span style={{fontSize:13,fontWeight:600,textAlign:'right'}}>{v}</span></div>)}</MCard>}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,padding:'12px 16px calc(16px + env(safe-area-inset-bottom))',background:'linear-gradient(transparent, #F7F6F3 30%)'}}><CTA label='Confirm programarea' disabled={!zi||!ora} onClick={()=>onBook(`${zi} · ${ora}`)}/></div>
    </Shell>
  )
}

/* ═══════════════════════════════════════
   MANAGER MOBIL — M6 panou · M7 documente · M9 echipă · M10 meniu
═══════════════════════════════════════ */
export function ManagerMobile({ user, appCfg, onLogout }) {
  const [tab,setTab] = useState('panou')
  const [sub,setSub] = useState(null)
  const [docs,setDocs] = useState(DOCS_INIT)
  const firma = appCfg?.firma
  const ANG = getAngajati(appCfg?.cons?.ind||'productie')
  const S = getStats(firma)
  const [tst,setTst] = useState(null)
  const toast = m => setTst({m,k:Date.now()})
  const [dfilter,setDfilter] = useState('nes')
  const [efilter,setEfilter] = useState('probleme')
  const nes = docs.filter(d=>d.status==='Nesemnat')
  const probleme = [[ANG[2].name,'Control medical expirat'],[ANG[0].name,'Instruire scadentă mâine'],...nes.map(d=>[d.angajat,`Fișă nesemnată · de ${d.zile} zile`])]
  const resend = d => toast(`Link de semnare retrimis către ${d.angajat}`)

  const screens = {
    panou: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{padding:'0 6px'}}><strong style={{fontSize:24,fontWeight:800,letterSpacing:'-0.02em'}}>Panou</strong><div style={{fontSize:13,color:C.t2}}>{firma?.nume||'Firma dvs.'} · {new Date().toLocaleDateString('ro-RO',{day:'numeric',month:'short'}).replace('.','')}</div></div>
        <MCard style={{flexDirection:'row',alignItems:'center',gap:14}}>
          <div style={{fontSize:34,fontWeight:800,color:S.conf>=90?C.teal:'oklch(0.45 0.12 75)',letterSpacing:'-0.02em'}}>{S.conf}%</div>
          <div style={{flex:1,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>{[[String(S.N),'Angajați'],[String(S.scadente),'Scadențe'],['1','Expirat']].map(([v,l]) => <div key={l} style={{textAlign:'center',background:C.bg,borderRadius:10,padding:'8px 4px'}}><div style={{fontSize:18,fontWeight:800}}>{v}</div><div style={{fontSize:10,color:C.t2}}>{l}</div></div>)}</div>
        </MCard>
        <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,padding:'6px 6px 0',fontWeight:600}}>De rezolvat azi</div>
        <MCard><div style={{display:'flex',gap:12,alignItems:'center'}}><Ava name={ANG[0].name} size={36}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{ANG[0].name}</div><div style={{fontSize:12,color:C.t2}}>Instruirea periodică expiră mâine</div></div></div><CTA label='Trimite link de instruire' onClick={()=>toast(`Link de instruire trimis către ${ANG[0].name}`)}/></MCard>
        <MCard><div style={{display:'flex',gap:12,alignItems:'center'}}><Ava name={ANG[2].name} size={36}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{ANG[2].name}</div><div style={{fontSize:12,color:C.t2}}>Control medical expirat din 1 martie</div></div></div><CTA label='Programează control' outline onClick={()=>toast(`Invitație la control trimisă către ${ANG[2].name}`)}/></MCard>
        {nes.length>0 && <Row title={`${nes.length} fișe nesemnate`} sub='de peste 48h' onClick={()=>setTab('documente')} />}
      </div>
    ),
    documente: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <Header title='Documente' />
        <div style={{display:'flex',gap:8}}>{[['nes','Nesemnate',nes.length],['sem','Semnate',docs.length-nes.length]].map(([id,l,n]) => <button key={id} onClick={()=>setDfilter(id)} style={{padding:'9px 14px',minHeight:40,border:`2px solid ${dfilter===id?C.primary:C.line}`,background:dfilter===id?C.white:'transparent',borderRadius:999,fontSize:13,fontWeight:dfilter===id?800:500,cursor:'pointer',fontFamily:'inherit'}}>{l} <span style={{fontFamily:C.mono,fontSize:11,color:C.t3}}>· {n}</span></button>)}</div>
        {docs.filter(d=>dfilter==='nes'?d.status==='Nesemnat':d.status==='Semnat').map(d => (
          <MCard key={d.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div><div style={{fontSize:15,fontWeight:700}}>{d.angajat}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{d.tip} · <span style={{fontFamily:C.mono}}>{d.nr}</span></div></div>{d.status==='Nesemnat'?<Pill label={`de ${d.zile} zile`} tone='amber'/>:<Pill label='semnat' tone='green'/>}</div>
            {d.status==='Nesemnat' && <CTA label='Retrimite linkul de semnare' onClick={()=>resend(d)}/>}
          </MCard>
        ))}
        {dfilter==='nes' && <div style={{textAlign:'center',fontSize:11,color:C.t3}}>Linkurile expiră în 7 zile · angajatul semnează de pe telefonul lui</div>}
      </div>
    ),
    echipa: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <Header title='Echipă' />
        <div style={{position:'relative'}}><span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:C.t3}}><Icon name='search' size={16}/></span><input placeholder='Caută angajat…' style={{width:'100%',padding:'12px 14px 12px 40px',border:`1px solid ${C.line}`,borderRadius:12,fontSize:15,fontFamily:'inherit',background:C.white,boxSizing:'border-box',outline:'none'}}/></div>
        <div style={{display:'flex',gap:8}}>{[['probleme','Cu probleme',probleme.length],['toti','Toți',S.N]].map(([id,l,n]) => <button key={id} onClick={()=>setEfilter(id)} style={{padding:'9px 14px',minHeight:40,border:`2px solid ${efilter===id?C.primary:C.line}`,background:efilter===id?C.white:'transparent',borderRadius:999,fontSize:13,fontWeight:efilter===id?800:500,cursor:'pointer',fontFamily:'inherit'}}>{l} <span style={{fontFamily:C.mono,fontSize:11,color:C.t3}}>· {n}</span></button>)}</div>
        {(efilter==='probleme'?probleme:[...probleme,...ANG.filter(a=>!probleme.find(p=>p[0]===a.name)).map(a=>[a.name,'La zi'])]).map(([n,s],i) => (
          <Row key={i} title={n} sub={s} onClick={()=>toast(`Profil ${n} — dosarul complet e disponibil pe desktop`)} right={<Ava name={n} size={30}/>} />
        ))}
        {efilter==='probleme' && <div style={{textAlign:'center',fontSize:12,color:C.t3,padding:'4px 0'}}>Restul de {S.N-probleme.length} angajați sunt la zi</div>}
      </div>
    ),
    meniu: (
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <MCard style={{flexDirection:'row',alignItems:'center',gap:12}}><Ava name={user?.name||'M'} size={42} mono/><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div><div style={{fontSize:12,color:C.t2}}>Manager SSM · {firma?.nume}</div></div><span style={{fontFamily:C.mono,fontSize:10,border:`1px solid ${C.lineHi}`,borderRadius:5,padding:'2px 6px'}}>RO</span></MCard>
        <MCard style={{background:C.primary,color:'#fff'}}><div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8A8F95'}}>Dosar control ITM</div><div style={{fontSize:14,fontWeight:700}}>{S.semnate} fișe semnate · {ANG.length} avize · 2 PV-uri PSI</div><button onClick={()=>toast('Dosar ITM generat — descărcarea a început')} style={{background:'#fff',color:C.t0,border:'none',padding:'12px',borderRadius:12,fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'inherit',display:'flex',gap:8,alignItems:'center',justifyContent:'center',minHeight:48}}><Icon name='download' size={16}/>Generează dosarul (PDF)</button></MCard>
        <Row title='Instruiri' right={<Pill label={`${S.scadente} scadente`} tone='amber' sm/>} onClick={()=>{setEfilter('probleme');setTab('echipa')}} />
        <Row title='Medicină muncii' right={<Pill label='1 expirat' tone='red' sm/>} onClick={()=>{setEfilter('probleme');setTab('echipa')}} />
        <Row title='Rapoarte' onClick={()=>setSub('rapoarte')} />
        <Row title='Setări' onClick={()=>setSub('setari')} />
        <Row title='Ajutor' sub='Chat live — răspuns în ~2 minute' onClick={()=>setSub('ajutor')} />
        <button onClick={onLogout} style={{background:'none',border:'none',color:C.red,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',padding:'12px',display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}><Icon name='logout' size={16}/>Deconectare</button>
      </div>
    ),
  }
  if (sub==='rapoarte') return (
    <Shell><Header onBack={()=>setSub(null)} title='Rapoarte' />
      {['Status instruiri angajați','Termene scadente','Rezultate testare','Raport conformitate ISU'].map(t => <MCard key={t} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}><div style={{flex:1,fontSize:14,fontWeight:700}}>{t}</div><Btn label='Excel' size='xs' variant='outline' onClick={()=>toast(`${t} (Excel) — descărcare`)}/><Btn label='PDF' size='xs' variant='outline' onClick={()=>toast(`${t} (PDF) — descărcare`)}/></MCard>)}
      {tst && <Toast key={tst.k} msg={tst.m} onClose={()=>setTst(null)}/>}
    </Shell>
  )
  if (sub==='setari') return (
    <Shell><Header onBack={()=>setSub(null)} title='Setări' />
      <MCard><Toggle checked label='Email' sub='Către angajat + manager SSM' onChange={()=>{}}/><Toggle checked label='Notificare în aplicație' sub='Vizibilă în Panou' onChange={()=>{}}/><Toggle checked={false} label='SMS' sub='Pentru angajați fără email · cost suplimentar' onChange={()=>{}}/></MCard>
      <Note style={{marginTop:12}}>Modulele, instruirile și utilizatorii se configurează din aplicația desktop.</Note>
    </Shell>
  )
  if (sub==='ajutor') return (
    <Shell><Header onBack={()=>setSub(null)} title='Ajutor' />
      {[['chat','Chat live','răspuns în ~2 minute'],['phone','Telefon','021 XXX XXXX · L-V 8-20'],['mail','Email','support@safework.ro · răspuns < 4h'],['book','Bază de cunoștințe','help.safework.ro']].map(([ic,t,s]) => <MCard key={t} style={{flexDirection:'row',alignItems:'center',marginBottom:10}} onClick={()=>toast(`${t}: se deschide…`)}><Icon name={ic} size={20} color={C.t1}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{t}</div><div style={{fontSize:12,color:C.t2}}>{s}</div></div><Icon name='chevR' size={16} color={C.t3}/></MCard>)}
      {tst && <Toast key={tst.k} msg={tst.m} onClose={()=>setTst(null)}/>}
    </Shell>
  )
  return (
    <Shell status='sincronizat' bottom={<TabBar tabs={[['panou','panel','Panou'],['documente','file','Documente',nes.length],['echipa','users','Echipă'],['meniu','menu','Meniu']]} value={tab} onChange={setTab}/>}>
      {screens[tab]}
      {tst && <Toast key={tst.k} msg={tst.m} onClose={()=>setTst(null)}/>}
    </Shell>
  )
}
