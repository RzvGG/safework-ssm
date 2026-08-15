import { useState, useMemo } from 'react'
import { C, TOATE_INSTRUIRILE, getAngajati, LEGISLATIE_DB, MATERIALE_DB, TESTE_DB, getStats } from './data.js'
import { Icon, Logo, Card, Btn, TLink, Inp, Sel, Toggle, Pill, Ava, PBar, trafficColor, Note, Alert, Tabs, FChip, Table, TR, TD, Modal, Drawer, Toast, PageHead, Empty, SigPad } from './ui.jsx'

const AZI = new Date()
const fmtZi = d => d.toLocaleDateString('ro-RO',{day:'numeric',month:'short'}).replace('.','')
const LUNA = AZI.toLocaleDateString('ro-RO',{month:'long',year:'numeric'})

/* ─── date demo partajate în shell ─── */
export const DOCS_INIT = [
  {id:1,nr:'DOC-2026-087',tip:'Fișă instruire periodică',angajat:'Popescu Dan',data:'13 aug',status:'Nesemnat',zile:2},
  {id:2,nr:'DOC-2026-086',tip:'Fișă medicină muncii',angajat:'Constantin Alina',data:'12 aug',status:'Nesemnat',zile:3},
  {id:3,nr:'DOC-2026-088',tip:'Fișă instruire periodică',angajat:'Ionescu Maria',data:'14 aug',status:'Semnat'},
  {id:4,nr:'DOC-2026-085',tip:'Fișă instruire introductivă',angajat:'Gheorghe Victor',data:'10 aug',status:'Semnat'},
  {id:5,nr:'DOC-2026-084',tip:'Fișă instruire loc muncă',angajat:'Dumitrescu Ion',data:'09 aug',status:'Semnat'},
]

/* ═══════════════════════════════════════
   S7 · PANOU — salut compact, KPI clicabile, alerte cu acțiunea lor
═══════════════════════════════════════ */
function ModPanou({ user, firma, ind, docs, go, toast, med }) {
  const ANG = getAngajati(ind)
  const S = getStats(firma)
  const nesemnate = docs.filter(d=>d.status==='Nesemnat').length
  const expirat = med.filter(m=>!m.apt).length
  const [showAng,setShowAng] = useState(false)
  const alerts = [
    { n:ANG[0].name, t:`Instruire periodică scadentă · 16 aug`, a:'Trimite reminder', on:()=>toast(`Reminder trimis către ${ANG[0].name} (email + notificare în aplicație)`) },
    ...(expirat? [{ n:med.find(m=>!m.apt).name, t:`Control medical expirat · ${med.find(m=>!m.apt).exp}`, a:'Programează control', on:()=>go('medicina') }] : []),
    ...(nesemnate? [{ n:docs.find(d=>d.status==='Nesemnat').angajat, t:`Fișă nesemnată · ${docs.find(d=>d.status==='Nesemnat').nr}`, a:'Solicită semnătura', on:()=>go('documente',{sign:docs.find(d=>d.status==='Nesemnat').id}) }] : []),
  ]
  const kpi = [
    { v:String(S.N), l:'Angajați activi', a:'Vezi lista', on:()=>setShowAng(true) },
    { v:String(S.scadente), l:'Instruiri scadente', a:'Planifică', on:()=>go('instruiri'), tone:C.amber },
    { v:String(expirat), l:'Aviz medical expirat', a:'Rezolvă', on:()=>go('medicina'), tone:expirat?C.red:C.t0 },
    { v:S.conf+'%', l:'Conformitate generală', a:'Raport', on:()=>go('rapoarte'), tone:C.teal },
  ]
  const status = [['Introductiv-general (IIG)',S.N-S.rest.introductiv],['La locul de muncă (ILM)',S.N-S.rest.loc_munca],['Periodic (IP)',S.N-S.rest.periodica],['PSI (prevenire incendii)',S.N]]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {showAng && (
        <Modal title='Angajați activi' sub={`${S.N} în evidență · ${ANG.length} afișați în demo`} onClose={()=>setShowAng(false)} width={560}>
          <Table cols={['Angajat','Post · Dept.','Instruire','Medical']}>
            {ANG.map(a => (
              <TR key={a.id}>
                <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={a.name} size={26}/><span style={{fontWeight:700,color:C.t0}}>{a.name}</span></div></TD>
                <TD>{a.post} · {a.dept}</TD>
                <TD><Pill label={a.trainOk?'La zi':'Restant'} tone={a.trainOk?'green':'red'} sm/></TD>
                <TD><Pill label={a.medOk?'Apt':'Expirat'} tone={a.medOk?'green':'red'} sm/></TD>
              </TR>
            ))}
          </Table>
        </Modal>
      )}
      {/* bară de salut compactă (64px) */}
      <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',padding:'12px 18px',background:C.white,border:`1px solid ${C.line}`,borderRadius:14,minHeight:64}}>
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontSize:16,fontWeight:800,color:C.t0}}>Bună ziua, {user?.name?.split(/[\s.]/)[0]||'Manager'}</div>
          <div style={{fontSize:12,color:C.t2}}>{firma?.nume} · {AZI.toLocaleDateString('ro-RO',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <Pill label={`${S.scadente} scadențe apropiate`} tone='amber' />
        <Pill label={`${S.conf}% conformitate`} tone={S.conf>=90?'green':'amber'} />
        <Sel sm value={LUNA} onChange={()=>{}} options={[LUNA,'Trimestrul III 2026','An 2026']} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {kpi.map(k => (
          <Card key={k.l} onClick={k.on} style={{padding:'16px 18px'}}>
            <div style={{fontSize:28,fontWeight:800,color:k.tone||C.t0,lineHeight:1,letterSpacing:'-0.02em'}}>{k.v}</div>
            <div style={{fontSize:12,color:C.t2,marginTop:6}}>{k.l}</div>
            <div style={{fontSize:12,fontWeight:700,color:C.t0,marginTop:10,display:'flex',alignItems:'center',gap:4}}>{k.a} <Icon name='arrowR' size={13}/></div>
          </Card>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,fontSize:14,fontWeight:800,color:C.t0}}>Status instruiri</div>
          <div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>
            {status.map(([l,d]) => { const t=S.N, p=Math.round(d/t*100), rest=t-d; return (
              <div key={l}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,alignItems:'baseline'}}>
                  <span style={{fontSize:13,color:C.t0,fontWeight:600}}>{l}</span>
                  <span style={{fontSize:12,color:C.t2,fontFamily:C.mono}}>{d}/{t} · {rest>0 ? <TLink label={`vezi ${rest} →`} onClick={()=>go('instruiri')} size={12} /> : <span style={{color:C.teal,fontWeight:700}}>✓</span>}</span>
                </div>
                <PBar val={p} color={trafficColor(p)} />
              </div>
            )})}
          </div>
        </Card>
        <Card>
          <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}><span style={{fontSize:14,fontWeight:800,color:C.t0}}>Necesită atenție</span><span style={{fontSize:11,color:C.t3}}>fiecare alertă are acțiunea ei</span></div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {alerts.length===0 && <Empty text='Nimic de rezolvat azi.' />}
            {alerts.map((a,i) => (
              <div key={i} style={{padding:'12px 18px',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',alignItems:'center',gap:12}}>
                <Ava name={a.n} size={30} />
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:C.t0}}>{a.n}</div><div style={{fontSize:12,color:C.t2}}>{a.t}</div></div>
                <Btn label={a.a} size='sm' variant={i===0?'primary':'outline'} onClick={a.on} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   S8 · S9 · S10 · DOCUMENTE — fișe emise / emitere / arhivă + panou semnare
═══════════════════════════════════════ */
function SignDrawer({ doc, onClose, onSigned, toast }) {
  const [mode,setMode] = useState('ecran')
  const [has,setHas] = useState(false)
  const [sent,setSent] = useState(false)
  const confirm = () => { onSigned(doc.id); toast(`${doc.nr} semnat · arhivat cu hash de integritate`); onClose() }
  const send = () => { setSent(true); toast(`Link de semnare trimis către ${doc.angajat} (${mode==='sms'?'SMS':'email'}) · valabil 7 zile`) }
  return (
    <Drawer title='Semnare document' sub={`${doc.nr} · ${doc.tip} · ${doc.angajat}`} onClose={onClose}
      footer={mode==='ecran'
        ? <><Btn label='Confirmă semnătura' full disabled={!has} onClick={confirm} /><div style={{fontSize:11,color:C.t3,marginTop:8,textAlign:'center'}}>Semnătura electronică avansată e conformă HG 259/2022; documentul se arhivează cu hash de integritate</div></>
        : <Btn label={sent?'Retrimite linkul':`Trimite link ${mode==='sms'?'SMS':'email'}`} full onClick={send} icon='send' />}>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Note label='Conținut instruire confirmat' tone='green'>IP — Instructaj periodic v3.0 · 2 ore · test promovat 9/10</Note>
        <Tabs tabs={[['ecran','Pe acest ecran'],['sms','Link SMS'],['email','Link email']]} value={mode} onChange={setMode} />
        {mode==='ecran' ? <>
          <SigPad height={190} onChange={setHas} name={doc.angajat.split(' ')[0]+' '+doc.angajat.split(' ')[1]?.[0]+'.'} />
          <div style={{fontSize:12,color:C.t2,lineHeight:1.5}}>Angajatul semnează aici, pe ecranul dvs. sau pe telefonul lui. Marcaj temporal + IP se atașează automat.</div>
        </> : <>
          <div style={{padding:16,background:C.bg,borderRadius:12,display:'flex',gap:12,alignItems:'center'}}>
            <Ava name={doc.angajat} size={38} />
            <div><div style={{fontSize:14,fontWeight:700}}>{doc.angajat}</div><div style={{fontSize:12,color:C.t2,fontFamily:C.mono}}>{mode==='sms'?'07xx xxx 482':doc.angajat.toLowerCase().replace(' ','.')+'@firma.ro'}</div></div>
          </div>
          <div style={{fontSize:12,color:C.t2,lineHeight:1.5}}>Angajatul primește un link securizat, parcurge documentul și semnează pe telefonul lui. Statusul se actualizează automat aici.</div>
          {sent && <Alert tone='green'>Link trimis. Documentul rămâne „Nesemnat" până semnează angajatul.</Alert>}
        </>}
      </div>
    </Drawer>
  )
}

function ModDocumente({ ind, docs, setDocs, params, toast, go }) {
  const [tab,setTab] = useState(params?.tab||'fise')
  const [filter,setFilter] = useState('toate')
  const [q,setQ] = useState('')
  const [sign,setSign] = useState(params?.sign ? docs.find(d=>d.id===params.sign) : null)
  const nes = docs.filter(d=>d.status==='Nesemnat')
  const list = docs.filter(d => (filter==='toate'||d.status.toLowerCase()===filter) && (!q||`${d.angajat} ${d.nr}`.toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>(a.status==='Nesemnat'?0:1)-(b.status==='Nesemnat'?0:1))
  const signed = id => setDocs(ds=>ds.map(d=>d.id===id?{...d,status:'Semnat',zile:undefined}:d))
  const subs = { fise:`${nes.length} documente în așteptarea semnăturii`, emitere:'Emitere nouă · model legal aplicat automat (Anexa 11, HG 1425/2006)', arhiva:'Documente arhivate cu hash de integritate' }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {sign && <SignDrawer doc={sign} onClose={()=>setSign(null)} onSigned={signed} toast={toast} />}
      <PageHead title='Documente' sub={subs[tab]} action={tab==='fise'&&<Btn label='Emitere nouă' icon='plus' onClick={()=>setTab('emitere')} />} />
      <Tabs tabs={[['fise','Fișe emise',docs.length],['emitere','Emitere nouă'],['arhiva','Arhivă']]} value={tab} onChange={setTab} />
      {tab==='fise' && <>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <FChip label='Toate' n={docs.length} on={filter==='toate'} onClick={()=>setFilter('toate')} />
          <FChip label='Nesemnate' n={nes.length} on={filter==='nesemnat'} onClick={()=>setFilter('nesemnat')} />
          <FChip label='Semnate' n={docs.length-nes.length} on={filter==='semnat'} onClick={()=>setFilter('semnat')} />
          <div style={{marginLeft:'auto',position:'relative',minWidth:240}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.t3}}><Icon name='search' size={14}/></span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Caută după angajat sau număr…' style={{width:'100%',padding:'9px 12px 9px 34px',border:`1.5px solid ${C.line}`,borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',background:C.white,boxSizing:'border-box'}} />
          </div>
        </div>
        <Card>
          <Table cols={['Număr','Tip document','Angajat','Data','Status','Acțiuni']}>
            {list.map(d => (
              <TR key={d.id} hi={d.status==='Nesemnat'}>
                <TD mono style={{fontSize:11,color:C.t2}}>{d.nr}</TD>
                <TD style={{fontWeight:700,color:C.t0}}>{d.tip}</TD>
                <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={d.angajat} size={26}/><span>{d.angajat}</span></div></TD>
                <TD style={{color:C.t2,fontSize:12}}>{d.data}</TD>
                <TD>{d.status==='Semnat' ? <Pill label='Semnat' tone='green' sm/> : <Pill label={`Nesemnat · ${d.zile} zile`} tone='amber' sm/>}</TD>
                <TD><div style={{display:'flex',gap:12,alignItems:'center'}}>
                  {d.status==='Nesemnat' && <Btn label='Solicită semnătura' size='xs' onClick={()=>setSign(d)} />}
                  <TLink label='PDF' onClick={()=>toast(`${d.nr}.pdf — descărcarea a început`)} />
                </div></TD>
              </TR>
            ))}
          </Table>
          {list.length===0 && <Empty text='Niciun document pentru filtrul ales.' />}
        </Card>
        <div style={{fontSize:12,color:C.t3}}>Nesemnatele stau primele și arată vechimea; statusul include contextul, nu doar eticheta.</div>
      </>}
      {tab==='emitere' && <Emitere ind={ind} onDone={(names,tip)=>{ const base=docs.length; setDocs(ds=>[...names.map((nm,i)=>({id:Date.now()+i,nr:`DOC-2026-0${89+base+i}`,tip,angajat:nm,data:fmtZi(AZI),status:'Nesemnat',zile:0})),...ds]); toast(`${names.length} documente emise · au intrat în fluxul de semnare`); setTab('fise') }} />}
      {tab==='arhiva' && <ArhivaTab toast={toast} embedded />}
    </div>
  )
}

/* S9 · Emitere — wizard 3 pași, lista arată cine e scadent */
function Emitere({ ind, onDone }) {
  const ANG = getAngajati(ind)
  const TIP = ['Fișă instruire periodică','Fișă instruire introductiv-generală','Fișă instruire la locul de muncă','Fișă medicină muncii','Adeverință SSM','Proces verbal instruire']
  const [step,setStep] = useState(1)
  const [tip,setTip] = useState(TIP[0])
  const [dept,setDept] = useState('Toate')
  const [q,setQ] = useState('')
  const [sel,setSel] = useState(()=>new Set(ANG.filter(a=>!a.trainOk).map(a=>a.id)))
  const depts = ['Toate',...Array.from(new Set(ANG.map(a=>a.dept)))]
  const list = ANG.filter(a=>(dept==='Toate'||a.dept===dept)&&(!q||a.name.toLowerCase().includes(q.toLowerCase())))
  const toggle = id => setSel(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n })
  const StepDot = ({n,label,done,on}) => <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:24,height:24,borderRadius:999,background:done||on?C.primary:C.white,border:`1.5px solid ${done||on?C.primary:C.lineHi}`,color:done||on?'#fff':C.t2,fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{done?<Icon name='check' size={12} stroke={3}/>:n}</span><span style={{fontSize:13,fontWeight:on?800:600,color:on?C.t0:C.t2}}>{label}</span></div>
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16,alignItems:'start'}}>
      <Card style={{padding:20}}>
        <div style={{display:'flex',gap:22,alignItems:'center',flexWrap:'wrap',marginBottom:18}}>
          <StepDot n={1} label='Tip document' done={step>1} on={step===1} /><span style={{color:C.lineHi}}>—</span>
          <StepDot n={2} label='Angajați' done={step>2} on={step===2} /><span style={{color:C.lineHi}}>—</span>
          <StepDot n={3} label='Verificare & emitere' on={step===3} />
        </div>
        {step===1 && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {TIP.map(t => <div key={t} onClick={()=>setTip(t)} style={{padding:'13px 14px',borderRadius:12,cursor:'pointer',border:`2px solid ${tip===t?C.primary:C.line}`,background:tip===t?C.bg:C.white,fontSize:13,fontWeight:700,color:C.t0,display:'flex',justifyContent:'space-between',alignItems:'center',minHeight:48}}>{t}{tip===t&&<Icon name='check' size={16} color={C.green} stroke={2.6}/>}</div>)}
        </div>}
        {step>=2 && <>
          <div style={{fontSize:13,color:C.t1,marginBottom:12}}>{tip} · <TLink label='schimbă tipul' onClick={()=>setStep(1)} /></div>
          <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
            <div style={{position:'relative',flex:1}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.t3}}><Icon name='search' size={14}/></span><input value={q} onChange={e=>setQ(e.target.value)} placeholder='Caută angajat…' style={{width:'100%',padding:'9px 12px 9px 34px',border:`1.5px solid ${C.line}`,borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}} /></div>
            <Sel sm value={dept} onChange={e=>setDept(e.target.value)} options={depts} />
            <TLink label={`Selectează toți (${list.length})`} onClick={()=>setSel(new Set(list.map(a=>a.id)))} />
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {list.map((a,i) => { const on=sel.has(a.id); return (
              <div key={a.id} onClick={()=>step===2&&toggle(a.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderTop:i>0?`1px solid ${C.line}`:'none',cursor:step===2?'pointer':'default',opacity:step===3&&!on?.45:1}}>
                <span style={{width:20,height:20,borderRadius:6,border:`2px solid ${on?C.primary:C.lineHi}`,background:on?C.primary:C.white,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',flexShrink:0}}>{on&&<Icon name='check' size={12} stroke={3}/>}</span>
                <Ava name={a.name} size={30} />
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{a.name}</div><div style={{fontSize:11,color:C.t2}}>{a.dept} · {a.post}</div></div>
                {a.trainOk ? <Pill label='La zi până în oct' tone='green' sm/> : <Pill label={`IP scadent ${20+i} aug`} tone='amber' sm/>}
              </div>
            )})}
          </div>
        </>}
      </Card>
      <Card style={{padding:18,position:'sticky',top:0}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>Rezumat emitere</div>
        {[['Document',tip],['Model legal','Anexa 11 · HG 1425/2006'],['Angajați selectați',String(sel.size)],['Semnare','Link pe email + telefon']].map(([k,v]) => (
          <div key={k} style={{display:'flex',justifyContent:'space-between',gap:10,padding:'8px 0',borderTop:`1px solid ${C.line}`}}><span style={{fontFamily:C.mono,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',color:C.t3,paddingTop:2}}>{k}</span><span style={{fontSize:12,fontWeight:700,textAlign:'right'}}>{v}</span></div>
        ))}
        <div style={{marginTop:14}}>
          {step===1 && <Btn label='Continuă la angajați' full iconRight='arrowR' onClick={()=>setStep(2)} />}
          {step===2 && <Btn label='Continuă la verificare' full iconRight='arrowR' disabled={!sel.size} onClick={()=>setStep(3)} />}
          {step===3 && <Btn label={`Emite ${sel.size} documente`} full icon='send' onClick={()=>onDone(ANG.filter(a=>sel.has(a.id)).map(a=>a.name),tip)} />}
        </div>
        <div style={{fontSize:11,color:C.t3,marginTop:8,textAlign:'center'}}>Documentele intră automat în fluxul de semnare</div>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════
   S11 · INSTRUIRI — cifre diferite per tip, context + link
═══════════════════════════════════════ */
function ModInstruiri({ instrCfg, ind, firma, toast, go }) {
  const ANG = getAngajati(ind)
  const S = getStats(firma)
  const [sel,setSel] = useState(null)
  const [plan,setPlan] = useState(false)
  const active = TOATE_INSTRUIRILE.filter(i=>(instrCfg[i.id]||{}).active)
  const pl = n => n===1?'1 angajat':`${n} angajați`
  const DEMO = { introductiv:[S.N-S.rest.introductiv,`${pl(S.rest.introductiv)} neinstruiți — angajați în august`], loc_munca:[S.N-S.rest.loc_munca,`${pl(S.rest.loc_munca)} neinstruiți`], periodica:[S.N-S.rest.periodica,S.rest.periodica===1?`1 angajat scadent — ${ANG[0].name}, 16 aug`:`${S.rest.periodica} angajați scadenți — primul: ${ANG[0].name}, 16 aug`], psi:[S.N,'Complet — următoarea scadență colectivă în octombrie'] }
  const stat = (i,idx) => DEMO[i.id] || [Math.max(1,S.N-idx),`${idx} angajați neinstruiți`]
  if (sel) {
    const [d,ctx] = stat(sel, active.indexOf(sel))
    const restanti = ANG.slice(0, Math.min(ANG.length, Math.max(1,S.N-d))).map((a,i)=>({...a,de:i===0?'16 aug':`${20+i} aug`}))
    return (
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <TLink label='← Înapoi la instruiri' onClick={()=>setSel(null)} color={C.t2} />
        <PageHead title={sel.label} sub={`${sel.baza} · ${S.N-d} restanți din ${S.N} (${restanti.length} afișați în demo)`} action={<Btn label='Trimite reminder tuturor' icon='send' onClick={()=>toast(`Reminder trimis către ${restanti.length} angajați`)} />} />
        <Card>
          <Table cols={['Angajat','Post · Dept.','Scadență','Acțiune']}>
            {restanti.map(a => (
              <TR key={a.id}>
                <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={a.name} size={26}/><span style={{fontWeight:700,color:C.t0}}>{a.name}</span></div></TD>
                <TD>{a.post} · {a.dept}</TD>
                <TD><Pill label={`Scadent ${a.de}`} tone='amber' sm/></TD>
                <TD><div style={{display:'flex',gap:12}}><Btn label='Trimite link de instruire' size='xs' variant='outline' onClick={()=>toast(`Link de instruire trimis către ${a.name}`)} /><TLink label='Emite fișa' onClick={()=>go('documente',{tab:'emitere'})} /></div></TD>
              </TR>
            ))}
          </Table>
        </Card>
      </div>
    )
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {plan && (
        <Modal title='Planifică instruire' sub='Se generează sesiunea și linkurile de instruire pentru angajații selectați' onClose={()=>setPlan(false)}
          footer={<><Btn label='Renunță' variant='outline' onClick={()=>setPlan(false)} /><Btn label='Planifică și trimite linkurile' onClick={()=>{setPlan(false);toast('Instruire planificată · linkurile pleacă automat cu 30 de zile înainte')}} /></>}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <Sel label='Tip de instruire' value={active[0]?.label} onChange={()=>{}} options={active.map(i=>i.label)} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}><Inp label='Data' type='date' value='2026-08-25' onChange={()=>{}} /><Sel label='Angajați' value='Toți restanții (9)' onChange={()=>{}} options={[`Toți restanții (${S.rest.introductiv+S.rest.loc_munca+S.rest.periodica})`,`Toți angajații (${S.N})`,'Selecție manuală']} /></div>
            <Note label='Automat'>Instruirea periodică T4 se generează automat pe 01.10 — planificarea manuală e necesară doar pentru sesiuni suplimentare.</Note>
          </div>
        </Modal>
      )}
      <PageHead title='Instruiri SSM' sub={`${active.length} tipuri active · obligatorii conform legislației`} action={<Btn label='Planifică instruire' icon='calendar' onClick={()=>setPlan(true)} />} />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {active.map((i,idx) => { const [d,ctx]=stat(i,idx); const p=Math.round(d/S.N*100); const col=trafficColor(p); return (
          <Card key={i.id} style={{padding:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:12}}>
              <div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:800,color:C.t0}}>{i.label}</div><div style={{fontSize:10,color:C.t2,fontFamily:C.mono,marginTop:3}}>{i.baza}</div></div>
              <div style={{textAlign:'right',flexShrink:0}}><div style={{fontSize:24,fontWeight:800,color:col,lineHeight:1,letterSpacing:'-0.02em'}}>{p}%</div><div style={{fontSize:11,color:C.t2,fontFamily:C.mono}}>{d}/{S.N}</div></div>
            </div>
            <PBar val={p} color={col} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10,gap:8}}>
              <span style={{fontSize:12,color:p===100?C.teal:'oklch(0.45 0.12 75)',fontWeight:600}}>{ctx}</span>
              {p<100 && <TLink label='Vezi lista →' onClick={()=>setSel(i)} />}
            </div>
          </Card>
        )})}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   S12 · MEDICINĂ MUNCII — chip-uri în header, alerta cu acțiune
═══════════════════════════════════════ */
function ModMedicina({ med, setMed, toast }) {
  const [filter,setFilter] = useState('toti')
  const [edit,setEdit] = useState(null)
  const [add,setAdd] = useState(false)
  const [prog,setProg] = useState(null)
  const apti = med.filter(m=>m.apt), exp = med.filter(m=>!m.apt)
  const list = filter==='toti'?med:filter==='apt'?apti:exp
  const save = () => { setMed(med.map(r=>r.id===edit.id?edit:r)); setEdit(null); toast('Aviz actualizat') }
  const programeaza = () => { setMed(med.map(r=>r.id===prog.id?{...r,programat:'24 aug · 09:15'}:r)); toast(`Control programat pentru ${prog.name} · invitația a plecat pe email`); setProg(null) }
  const Form = ({d,setD}) => (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <Sel label='Tip examen' value={d.tip} onChange={e=>setD({...d,tip:e.target.value})} options={['Angajare','Periodică','Reluare activitate','Supraveghere specială']} />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}><Inp label='Data efectuării' value={d.ef} onChange={e=>setD({...d,ef:e.target.value})} /><Inp label='Valabil până' value={d.exp} onChange={e=>setD({...d,exp:e.target.value})} /></div>
      <div><div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:6}}>Rezultat aviz</div><div style={{display:'flex',gap:8}}>{[[true,'Apt'],[false,'Inapt / Expirat']].map(([v,l]) => <div key={l} onClick={()=>setD({...d,apt:v})} style={{flex:1,padding:10,borderRadius:12,border:`2px solid ${d.apt===v?C.primary:C.line}`,background:d.apt===v?C.bg:C.white,cursor:'pointer',textAlign:'center',fontSize:13,fontWeight:700}}>{l}</div>)}</div></div>
    </div>
  )
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {edit && <Modal title='Editare aviz medical' sub={`${edit.name} · ${edit.dept}`} onClose={()=>setEdit(null)} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setEdit(null)}/><Btn label='Salvează' onClick={save}/></>} width={440}><Form d={edit} setD={setEdit} /></Modal>}
      {add && <Modal title='Înregistrare aviz' onClose={()=>setAdd(false)} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setAdd(false)}/><Btn label='Înregistrează' onClick={()=>{setAdd(false);toast('Aviz înregistrat')}}/></>} width={440}><div style={{marginBottom:12}}><Inp label='Angajat' placeholder='Nume angajat' value='' onChange={()=>{}} /></div><Form d={{tip:'Periodică',ef:fmtZi(AZI)+' 2026',exp:fmtZi(AZI)+' 2027',apt:true}} setD={()=>{}} /></Modal>}
      {prog && <Modal title='Programează control medical' sub={prog.name} onClose={()=>setProg(null)} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setProg(null)}/><Btn label='Trimite invitația' icon='send' onClick={programeaza}/></>} width={440}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Sel label='Clinică' value='MedLife Titan · et. 2, cab. 14' onChange={()=>{}} options={['MedLife Titan · et. 2, cab. 14','Regina Maria Băneasa']} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}><Inp label='Data' type='date' value='2026-08-24' onChange={()=>{}}/><Sel label='Ora' value='09:15' onChange={()=>{}} options={['08:30','09:15','10:00','11:30']}/></div>
          <Note label='Automat'>Angajatul primește invitația pe email + notificare în aplicație și poate alege alt slot.</Note>
        </div>
      </Modal>}
      <PageHead title='Medicină muncii' sub='Evidența avizelor medicale' chips={<><Pill label={`${apti.length} apți`} tone='green'/><Pill label={`${exp.length} expirat`} tone={exp.length?'red':'gray'}/></>} action={<Btn label='Înregistrare aviz' icon='plus' onClick={()=>setAdd(true)} />} />
      {exp.length>0 && !exp[0].programat && <Alert tone='red' action='Programează control' onAction={()=>setProg(exp[0])}><strong>{exp[0].name}</strong> are avizul medical expirat din {exp[0].exp} — acces restricționat recomandat conform HG 355/2007</Alert>}
      <div style={{display:'flex',gap:8}}><FChip label='Toți' n={med.length} on={filter==='toti'} onClick={()=>setFilter('toti')}/><FChip label='Apți' n={apti.length} on={filter==='apt'} onClick={()=>setFilter('apt')}/><FChip label='Expirați' n={exp.length} on={filter==='inapt'} onClick={()=>setFilter('inapt')}/></div>
      <Card>
        <Table cols={['Angajat','Dept.','Tip','Data ef.','Valabil până','Aviz','Acțiune']}>
          {list.map(m => (
            <TR key={m.id} hi={!m.apt}>
              <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={m.name} size={26}/><span style={{fontWeight:700,color:C.t0}}>{m.name}</span></div></TD>
              <TD style={{color:C.t2}}>{m.dept}</TD><TD>{m.tip}</TD>
              <TD style={{color:C.t2,fontSize:12}}>{m.ef}</TD>
              <TD style={{color:m.apt?C.t2:C.red,fontWeight:m.apt?400:700,fontSize:12}}>{m.exp}</TD>
              <TD>{m.apt ? <Pill label='Apt' tone='green' sm/> : <Pill label={m.programat?`Expirat · programat ${m.programat}`:'Expirat'} tone='red' sm/>}</TD>
              <TD>{m.apt ? <TLink label='Editează' onClick={()=>setEdit({...m})}/> : <Btn label={m.programat?'Reprogramează':'Programează'} size='xs' onClick={()=>setProg(m)}/>}</TD>
            </TR>
          ))}
        </Table>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════
   S13 · MATERIALE & TESTE — rând clicabil, previzualizare cu istoric + editare
═══════════════════════════════════════ */
function TestRunner({ test, onClose }) {
  const [ans,setAns] = useState({}); const [res,setRes] = useState(null)
  const submit = () => { const c=test.intrebari.filter((q,i)=>ans[i]===q.c).length; const s=Math.round(c/test.intrebari.length*100); setRes({c,s,ok:s>=test.prag}) }
  return (
    <Modal title={test.titlu} sub={`${test.intrebari.length} întrebări · prag de promovare ${test.prag}%`} onClose={onClose} width={620}
      footer={<><span style={{fontSize:12,color:C.t2,alignSelf:'center',marginRight:'auto'}}>{Object.keys(ans).length}/{test.intrebari.length} răspunse</span>{!res ? <Btn label='Finalizează testul' disabled={Object.keys(ans).length<test.intrebari.length} onClick={submit}/> : <Btn label='Închide' onClick={onClose}/>}</>}>
      {res && <div style={{marginBottom:16,padding:18,borderRadius:14,background:res.ok?C.greenBg:C.redBg,textAlign:'center'}}><div style={{fontSize:30,fontWeight:800,color:res.ok?C.teal:C.red}}>{res.s}%</div><div style={{fontSize:13,color:C.t1,marginTop:4}}>{res.c} din {test.intrebari.length} corecte · prag {test.prag}%</div><div style={{fontSize:13,fontWeight:800,color:res.ok?C.teal:C.red,marginTop:6}}>{res.ok?'PROMOVAT — rezultatul se consemnează în fișa de instruire':'NEPROMOVAT — instructajul se repetă conform procedurii'}</div></div>}
      {test.intrebari.map((q,i) => (
        <div key={i} style={{marginBottom:12,padding:'14px 16px',background:C.bg,borderRadius:12}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>{i+1}. {q.q}</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {q.a.map((o,oi) => { let b=ans[i]===oi?C.primary:C.line, bg=ans[i]===oi?C.white:C.white; if(res){ if(oi===q.c){b=C.green;bg=C.greenBg} else if(ans[i]===oi){b=C.red;bg=C.redBg} } return (
              <div key={oi} onClick={()=>!res&&setAns({...ans,[i]:oi})} style={{padding:'9px 12px',borderRadius:10,border:`2px solid ${b}`,background:bg,cursor:res?'default':'pointer',fontSize:12.5,display:'flex',gap:8,alignItems:'center'}}><span style={{width:14,height:14,borderRadius:99,border:`2px solid ${b}`,background:ans[i]===oi?b:'transparent',flexShrink:0}}/>{o}</div>
            )})}
          </div>
        </div>
      ))}
    </Modal>
  )
}
function MatPreview({ mat, onClose, onSave }) {
  const [edit,setEdit] = useState(false)
  const [d,setD] = useState({...mat,capitole:mat.capitole.map(c=>[...c])})
  return (
    <Modal title={d.titlu} sub={`${d.tip} · ${d.durata} · versiunea ${d.ver} · sursă: ${d.sursa}`} onClose={onClose} width={680}
      footer={edit ? <><Btn label='Renunță' variant='outline' onClick={()=>setEdit(false)}/><Btn label='Salvează ca versiune nouă' onClick={()=>onSave({...d,ver:'v'+(parseFloat(d.ver.slice(1))+0.1).toFixed(1)})}/></> : <><Btn label='Editează' variant='outline' icon='pen' onClick={()=>setEdit(true)}/><Btn label='Descarcă' variant='outline' icon='download' onClick={onClose}/></>}>
      {edit && <div style={{marginBottom:12}}><Inp label='Titlu' value={d.titlu} onChange={e=>setD({...d,titlu:e.target.value})}/></div>}
      {d.capitole.map(([t,c],i) => (
        <div key={i} style={{marginBottom:12,padding:'14px 16px',background:C.bg,borderRadius:12}}>
          {edit ? <><input value={t} onChange={e=>{const cp=d.capitole.map(x=>[...x]);cp[i][0]=e.target.value;setD({...d,capitole:cp})}} style={{width:'100%',fontWeight:700,fontSize:13,border:`1px solid ${C.line}`,borderRadius:8,padding:'6px 8px',marginBottom:6,fontFamily:'inherit',boxSizing:'border-box'}}/><textarea value={c} rows={3} onChange={e=>{const cp=d.capitole.map(x=>[...x]);cp[i][1]=e.target.value;setD({...d,capitole:cp})}} style={{width:'100%',fontSize:12,border:`1px solid ${C.line}`,borderRadius:8,padding:'6px 8px',fontFamily:'inherit',boxSizing:'border-box',lineHeight:1.6}}/></>
                : <><div style={{fontSize:13,fontWeight:800,marginBottom:6}}>{t}</div><div style={{fontSize:12.5,color:C.t1,lineHeight:1.7}}>{c}</div></>}
        </div>
      ))}
      <Note label='Istoric versiuni'>{d.ver} — curentă · {(parseFloat(d.ver.slice(1))-0.1).toFixed(1)>0?`v${(parseFloat(d.ver.slice(1))-0.1).toFixed(1)} — arhivată`:'prima versiune'} · conținut orientativ conform legislației, se completează cu instrucțiunile proprii ale unității</Note>
    </Modal>
  )
}
function TestPreview({ test, onClose, onSave, onRun }) {
  const [edit,setEdit] = useState(false)
  const [d,setD] = useState({...test,intrebari:test.intrebari.map(q=>({...q,a:[...q.a]}))})
  return (
    <Modal title={d.titlu} sub={`${d.intrebari.length} întrebări · prag ${d.prag}% · ${d.tip}`} onClose={onClose} width={680}
      footer={edit ? <><Btn label='Renunță' variant='outline' onClick={()=>setEdit(false)}/><Btn label='Salvează' onClick={()=>onSave(d)}/></> : <><Btn label='Editează' variant='outline' icon='pen' onClick={()=>setEdit(true)}/><Btn label='Rulează testul' icon='play' onClick={onRun}/></>}>
      {edit && <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:10,marginBottom:12}}><Inp label='Titlu' value={d.titlu} onChange={e=>setD({...d,titlu:e.target.value})}/><Inp label='Prag %' value={String(d.prag)} onChange={e=>setD({...d,prag:parseInt(e.target.value)||0})} mono/></div>}
      {d.intrebari.map((q,i) => (
        <div key={i} style={{marginBottom:12,padding:'14px 16px',background:C.bg,borderRadius:12}}>
          {edit ? <input value={q.q} onChange={e=>{const qs=[...d.intrebari];qs[i]={...q,q:e.target.value};setD({...d,intrebari:qs})}} style={{width:'100%',fontWeight:700,fontSize:13,border:`1px solid ${C.line}`,borderRadius:8,padding:'6px 8px',marginBottom:8,fontFamily:'inherit',boxSizing:'border-box'}}/> : <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{i+1}. {q.q}</div>}
          {q.a.map((o,oi) => (
            <div key={oi} style={{display:'flex',gap:8,alignItems:'center',marginBottom:5}}>
              <span onClick={()=>edit&&(()=>{const qs=[...d.intrebari];qs[i]={...q,c:oi};setD({...d,intrebari:qs})})()} style={{width:16,height:16,borderRadius:99,border:`2px solid ${q.c===oi?C.green:C.lineHi}`,background:q.c===oi?C.green:'transparent',cursor:edit?'pointer':'default',flexShrink:0}}/>
              {edit ? <input value={o} onChange={e=>{const qs=[...d.intrebari];const a=[...q.a];a[oi]=e.target.value;qs[i]={...q,a};setD({...d,intrebari:qs})}} style={{flex:1,fontSize:12,border:`1px solid ${C.line}`,borderRadius:8,padding:'5px 8px',fontFamily:'inherit'}}/> : <span style={{fontSize:12.5,color:q.c===oi?C.teal:C.t1,fontWeight:q.c===oi?700:400}}>{o}</span>}
            </div>
          ))}
        </div>
      ))}
    </Modal>
  )
}
function ModMateriale({ toast }) {
  const [tab,setTab] = useState('materiale')
  const [mats,setMats] = useState(MATERIALE_DB); const [tests,setTests] = useState(TESTE_DB)
  const [pm,setPm] = useState(null); const [pt,setPt] = useState(null); const [run,setRun] = useState(null); const [up,setUp] = useState(false)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {pm && <MatPreview mat={pm} onClose={()=>setPm(null)} onSave={m=>{setMats(ms=>ms.map(x=>x.id===m.id?m:x));setPm(null);toast(`${m.titlu.split(' — ')[0]} salvat ca ${m.ver}`)}} />}
      {pt && <TestPreview test={pt} onClose={()=>setPt(null)} onSave={t=>{setTests(ts=>ts.map(x=>x.id===t.id?t:x));setPt(null);toast('Test salvat')}} onRun={()=>{setRun(pt);setPt(null)}} />}
      {run && <TestRunner test={run} onClose={()=>setRun(null)} />}
      {up && <Modal title='Încarcă material' onClose={()=>setUp(false)} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setUp(false)}/><Btn label='Încarcă' icon='upload' onClick={()=>{setUp(false);toast('Material încărcat · marcat ca versiune v1.0 (Beneficiar)')}}/></>} width={460}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}><Inp label='Titlu' placeholder='ex: Instrucțiuni proprii — hală producție' value='' onChange={()=>{}}/><Sel label='Tip' value='Document' onChange={()=>{}} options={['Document','Prezentare','Video']}/><div style={{border:`1.5px dashed ${C.lineHi}`,borderRadius:12,padding:'22px 14px',textAlign:'center',background:C.bg}}><Icon name='upload' size={20} style={{margin:'0 auto 6px'}} color={C.t2}/><div style={{fontSize:13,fontWeight:600}}>Trage fișierul aici sau apasă</div><div style={{fontSize:11,color:C.t3}}>PDF, PPTX, MP4 · max 200 MB</div></div></div>
      </Modal>}
      <PageHead title='Materiale & Teste' sub='Conținut de instruire SSM-SU · încărcat de furnizor, actualizabil de beneficiar' action={<Btn label='Încarcă material' icon='upload' onClick={()=>setUp(true)}/>} />
      <Tabs tabs={[['materiale','Materiale',mats.length],['teste','Teste evaluare',tests.length]]} value={tab} onChange={setTab} />
      {tab==='materiale' && <Card><Table cols={['Material','Tip','Durată','Sursă','Versiune','']}>
        {mats.map(m => <TR key={m.id} onClick={()=>setPm(m)}><TD style={{fontWeight:700,color:C.t0}}>{m.titlu}</TD><TD>{m.tip}</TD><TD style={{color:C.t2}}>{m.durata}</TD><TD><Pill label={m.sursa} tone={m.sursa==='Furnizor'?'blue':'green'} sm/></TD><TD mono style={{fontSize:11,color:C.t2}}>{m.ver}</TD><TD style={{color:C.t3,textAlign:'right'}}><Icon name='chevR' size={16}/></TD></TR>)}
      </Table></Card>}
      {tab==='teste' && <Card><Table cols={['Test','Întrebări','Prag','Tip','Status','']}>
        {tests.map(t => <TR key={t.id} onClick={()=>setPt(t)}><TD style={{fontWeight:700,color:C.t0}}>{t.titlu}</TD><TD style={{color:C.t2}}>{t.intrebari.length} întrebări</TD><TD mono>{t.prag}%</TD><TD>{t.tip}</TD><TD><Pill label={t.activ?'Activ':'Inactiv'} tone={t.activ?'green':'gray'} sm/></TD><TD style={{color:C.t3,textAlign:'right'}}><Icon name='chevR' size={16}/></TD></TR>)}
      </Table></Card>}
      <div style={{fontSize:12,color:C.t3}}>Rândul întreg e clicabil și deschide previzualizarea cu istoric de versiuni și editare.</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   S14 · LEGISLAȚIE — chip status, email ca notă, „Text oficial" ca link
═══════════════════════════════════════ */
function ModLegislatie({ user, toast }) {
  const [email,setEmail] = useState(user?.email||'manager@firma.ro'); const [editE,setEditE] = useState(false)
  const [all,setAll] = useState(false); const [hist,setHist] = useState(false)
  const rows = all?LEGISLATIE_DB:LEGISLATIE_DB.slice(0,5)
  const url = act => 'https://www.google.com/search?q='+encodeURIComponent('"'+act+'" site:legislatie.just.ro')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <PageHead title='Legislație SSM-SU' sub={`${LEGISLATIE_DB.length} acte normative monitorizate · verificare automată zilnică la 07:00`} action={<Pill label='Ultima verificare: azi 07:00 — nicio modificare' tone='green'/>} />
      <Note label='Notificare zilnică pe email'>
        {editE ? <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}><input value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,padding:'7px 10px',border:`1.5px solid ${C.line}`,borderRadius:8,fontSize:13,fontFamily:'inherit'}}/><Btn label='Salvează' size='sm' onClick={()=>{setEditE(false);toast(`Notificările zilnice pleacă către ${email}`)}}/></div>
               : <><strong>{email}</strong> primește rezultatul verificării: modificări detectate sau confirmare „la zi". <TLink label='Schimbă adresa' onClick={()=>setEditE(true)} /></>}
      </Note>
      <Card>
        <Table cols={['Act normativ','Domeniu','Publicare','Modificări','Status','']} minWidth={640}>
          {rows.map(l => (
            <TR key={l.act}>
              <TD style={{fontWeight:800,color:C.t0,whiteSpace:'nowrap'}}>{l.act}</TD><TD style={{fontSize:12}}>{l.domeniu}</TD>
              <TD mono style={{fontSize:11,color:C.t2,whiteSpace:'nowrap'}}>{l.publicat}</TD><TD style={{fontSize:11,color:C.t2}}>{l.modif}</TD>
              <TD><Pill label='La zi' tone='green' sm/></TD>
              <TD><TLink label='Text oficial' href={url(l.act)} icon='ext' /></TD>
            </TR>
          ))}
        </Table>
        <div style={{padding:'12px 16px',borderTop:`1px solid ${C.line}`,display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
          {!all && <TLink label={`Toate cele ${LEGISLATIE_DB.length} acte →`} onClick={()=>setAll(true)} />}
          <TLink label={hist?'Ascunde istoricul':'Vezi istoricul →'} onClick={()=>setHist(!hist)} />
          <span style={{fontSize:11,color:C.t3,marginLeft:'auto'}}>Sursă: legislatie.just.ro · monitoruloficial.ro</span>
        </div>
      </Card>
      {hist && <Card>
        {[['Azi · 07:00','Nicio modificare — verificate 17 acte'],['Ieri · 07:00','Nicio modificare — verificate 17 acte'],['Acum 2 zile · 07:00','Nicio modificare — verificate 17 acte']].map(([d,t],i) => <div key={i} style={{padding:'11px 16px',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',gap:14,fontSize:12}}><span style={{fontFamily:C.mono,color:C.t2,minWidth:140}}>{d}</span><span style={{color:C.t1}}>{t}</span></div>)}
        <div style={{padding:'11px 16px',borderTop:`1px solid ${C.line}`,background:'oklch(0.96 0.03 75)',fontSize:12}}><span style={{fontFamily:C.mono,fontSize:10,textTransform:'uppercase',letterSpacing:'0.08em',color:'oklch(0.45 0.12 75)',display:'block',marginBottom:3}}>Exemplu notificare</span><strong>HG 1425/2006 s-a modificat</strong> — 3 materiale de instruire de revizuit. Vezi ce s-a schimbat →</div>
      </Card>}
    </div>
  )
}

/* ═══════════════════════════════════════
   S15 · RAPOARTE — Dosar ITM eroul paginii, export discret
═══════════════════════════════════════ */
function ModRapoarte({ toast }) {
  const [per,setPer] = useState('T3 2026'); const [pl,setPl] = useState('Toate'); const [gen,setGen] = useState(false)
  const R = [['Status instruiri angajați','Instruiți / neinstruiți per tip de instructaj (IIG, ILM, IP, IS)'],['Termene scadente','Instruiri și examene medicale scadente în 30/60/90 zile'],['Rezultate testare','Scoruri teste de evaluare per angajat, promovați / nepromovați'],['Raport conformitate ISU','Sinteză SU: instruiri PSI, exerciții evacuare, procese verbale']]
  const dosar = async () => { setGen(true); await new Promise(r=>setTimeout(r,1200)); setGen(false); toast('Dosar ITM generat — descărcarea a început','Deschide') }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <PageHead title='Rapoarte' sub='Exportabile Excel / PDF · utilizabile la controalele ITM / ISU'>
        <Sel sm value={per} onChange={e=>setPer(e.target.value)} options={['T3 2026','T2 2026','An 2026'].map(o=>[o,'Perioadă: '+o])} />
        <Sel sm value={pl} onChange={e=>setPl(e.target.value)} options={['Toate','Sediu central','Hală producție','Depozit'].map(o=>[o,'Punct de lucru: '+o])} />
      </PageHead>
      <div style={{background:C.primary,borderRadius:16,padding:'22px 24px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',gap:20,flexWrap:'wrap'}}>
        <div style={{maxWidth:620}}><div style={{fontSize:18,fontWeight:800}}>Dosar control ITM — un singur click</div><div style={{fontSize:13,color:'#D5D2CA',marginTop:6,lineHeight:1.55}}>Fișe semnate, valabilitate, trasabilitate și avize medicale într-un singur PDF cu antet, dată de generare și semnătură electronică de validare.</div></div>
        <button onClick={dosar} disabled={gen} style={{background:'#fff',color:C.t0,border:'none',padding:'12px 20px',borderRadius:12,fontSize:14,fontWeight:800,cursor:gen?'wait':'pointer',fontFamily:'inherit',display:'flex',gap:8,alignItems:'center',minHeight:44}}><Icon name={gen?'refresh':'download'} size={16} style={gen?{animation:'spin .8s linear infinite'}:{}}/>{gen?'Se generează…':'Generează dosarul'}</button>
      </div>
      <Card>
        {R.map(([t,d],i) => (
          <div key={t} style={{padding:'14px 18px',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:220}}><div style={{fontSize:14,fontWeight:700}}>{t}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{d}</div></div>
            <div style={{display:'flex',gap:8}}><Btn label='Excel' size='xs' variant='outline' onClick={()=>toast(`${t} (Excel) — descărcarea a început`)}/><Btn label='PDF' size='xs' variant='outline' onClick={()=>toast(`${t} (PDF) — descărcarea a început`)}/></div>
          </div>
        ))}
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════
   S16 · ARHIVĂ & TRASABILITATE
═══════════════════════════════════════ */
function ArhivaTab({ toast, embedded }) {
  const [tab,setTab] = useState('arhiva')
  const A = [['ARH-2026-0341','Fișă IIG — Popescu Ion','14 aug 2026','a3f8…e921','184 KB'],['ARH-2026-0340','Fișă IP — Ionescu Maria','13 aug 2026','bb12…7c44','176 KB'],['ARH-2026-0339','PV instruire colectivă PSI','11 aug 2026','09ce…f130','312 KB'],['ARH-2026-0338','Fișă medicină muncii — Constantin D.','10 aug 2026','77aa…3d02','158 KB']]
  const J = [['14 aug 2026 · 14:32','Manager SSM','A generat fișa IIG pentru Popescu Ion','89.33.12.44'],['14 aug 2026 · 14:35','Popescu Ion (angajat)','A semnat electronic fișa IIG (canvas)','89.33.12.44'],['14 aug 2026 · 14:35','Sistem','Fișă arhivată automat · hash SHA-256 generat','—'],['13 aug 2026 · 09:12','Manager SSM','A actualizat materialul „IP" la v3.0','89.33.12.44'],['12 aug 2026 · 16:44','Sistem','Notificare automată: 3 instruiri scadente în 14 zile','—']]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {!embedded && <Tabs tabs={[['arhiva','Documente arhivate',A.length],['jurnal','Jurnal trasabilitate']]} value={tab} onChange={setTab} />}
      {tab==='arhiva' && <Card><Table cols={['Nr. arhivă','Document','Data arhivării','Hash integritate','Mărime','']}>
        {A.map(([nr,doc,d,h,s]) => <TR key={nr}><TD mono style={{fontSize:11,color:C.t2}}>{nr}</TD><TD style={{fontWeight:700,color:C.t0}}>{doc}</TD><TD style={{color:C.t2,fontSize:12}}>{d}</TD><TD mono style={{fontSize:11}}>{h} <span style={{color:C.teal,fontWeight:700}}>✓</span></TD><TD style={{color:C.t2,fontSize:12}}>{s}</TD><TD><div style={{display:'flex',gap:12}}><TLink label='Vezi' onClick={()=>toast(`${doc} — previzualizare`)}/><TLink label='Export' onClick={()=>toast(`${nr} exportat`)}/></div></TD></TR>)}
      </Table></Card>}
      {tab==='jurnal' && <Card>{J.map(([t,c,ce,ip],i) => <div key={i} style={{padding:'12px 18px',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',gap:14,alignItems:'flex-start'}}><span style={{width:8,height:8,borderRadius:99,background:c==='Sistem'?C.t3:C.primary,marginTop:6,flexShrink:0}}/><div><div style={{fontSize:13}}><strong>{c}</strong> — {ce}</div><div style={{fontSize:10,color:C.t3,fontFamily:C.mono,marginTop:2}}>{t} · IP {ip}</div></div></div>)}</Card>}
    </div>
  )
}
function ModArhiva({ toast }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <PageHead title='Arhivă & Trasabilitate' sub='Arhivare electronică securizată · acces și export oricând' action={<Btn label='Exportă toată arhiva' icon='download' onClick={()=>toast('Arhiva completă (ZIP) — descărcarea a început')}/>} />
      <ArhivaTab toast={toast} />
    </div>
  )
}

/* ═══════════════════════════════════════
   S17 · STRUCTURĂ — inițiale, conformitate colorată
═══════════════════════════════════════ */
function ModStructura({ toast }) {
  const [pl,setPl] = useState([{id:1,nume:'Sediu central',oras:'Cluj-Napoca',ang:16,resp:'Mihai Gheorghescu',conf:96},{id:2,nume:'Punct de lucru — Hală producție',oras:'Cluj-Napoca',ang:9,resp:'Andrei Pop',conf:91},{id:3,nume:'Punct de lucru — Depozit',oras:'Turda',ang:3,resp:'Vasile Mureșan',conf:88}])
  const [edit,setEdit] = useState(null); const [add,setAdd] = useState(false)
  const ini = n => n.replace('Punct de lucru — ','').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const Form = ({d,setD}) => <div style={{display:'flex',flexDirection:'column',gap:12}}><Inp label='Denumire' value={d.nume} onChange={e=>setD({...d,nume:e.target.value})}/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}><Inp label='Localitate' value={d.oras} onChange={e=>setD({...d,oras:e.target.value})}/><Inp label='Nr. angajați' value={String(d.ang)} onChange={e=>setD({...d,ang:parseInt(e.target.value)||0})} mono/></div><Inp label='Responsabil SSM' value={d.resp} onChange={e=>setD({...d,resp:e.target.value})}/></div>
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {edit && <Modal title='Gestionează punctul de lucru' sub={edit.nume} onClose={()=>setEdit(null)} width={440} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setEdit(null)}/><Btn label='Salvează' onClick={()=>{setPl(pl.map(p=>p.id===edit.id?edit:p));setEdit(null);toast('Punct de lucru actualizat')}}/></>}><Form d={edit} setD={setEdit}/></Modal>}
      {add && <Modal title='Punct de lucru nou' onClose={()=>setAdd(false)} width={440} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setAdd(false)}/><Btn label='Adaugă' onClick={()=>{setAdd(false);toast('Punct de lucru adăugat')}}/></>}><Form d={{nume:'',oras:'',ang:0,resp:''}} setD={()=>{}}/></Modal>}
      <PageHead title='Structură organizatorică' sub='Evidențe separate per punct de lucru, agregate la nivel de firmă' action={<Btn label='Punct de lucru' icon='plus' onClick={()=>setAdd(true)}/>} />
      {pl.map(p => (
        <Card key={p.id} style={{padding:'16px 20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <span style={{width:42,height:42,borderRadius:12,background:C.primaryBg,border:`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:C.mono,fontWeight:700,fontSize:13,flexShrink:0}}>{ini(p.nume)}</span>
            <div style={{flex:1,minWidth:220}}><div style={{fontSize:14,fontWeight:800}}>{p.nume}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{p.oras} · {p.ang} angajați · Responsabil: {p.resp}</div></div>
            <div style={{textAlign:'right'}}><div style={{fontSize:20,fontWeight:800,color:p.conf>=90?C.teal:'oklch(0.45 0.12 75)',letterSpacing:'-0.02em'}}>{p.conf}%</div><div style={{fontSize:10,color:C.t3,fontFamily:C.mono}}>conformitate</div></div>
            <Btn label='Gestionează' size='sm' variant='outline' onClick={()=>setEdit({...p})}/>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════
   S18 · AUDIT ITM — simulare de control, scor + lista de remediat
═══════════════════════════════════════ */
function ModAudit({ docs, med, firma, go, toast }) {
  const S = getStats(firma)
  const [run,setRun] = useState(false); const [ts,setTs] = useState('azi, 07:00')
  const nes = docs.filter(d=>d.status==='Nesemnat').length, exp = med.filter(m=>!m.apt).length
  const items = [
    {ok:true,t:'Fișe de instruire semnate și arhivate',s:`${S.N-nes}/${S.N} complete`},
    {ok:true,t:'Procese verbale instruire colectivă PSI',s:'La zi'},
    ...(nes?[{ok:false,t:`${nes} fișe nesemnate mai vechi de 48h`,a:'Rezolvă',on:()=>go('documente')}]:[]),
    ...(exp?[{ok:false,t:`${exp} aviz medical expirat — ${med.find(m=>!m.apt)?.name}`,a:'Rezolvă',on:()=>go('medicina')}]:[]),
    {ok:false,t:'Evaluarea de riscuri nu a fost revizuită în ultimele 12 luni',a:'Planifică',on:()=>toast('Revizuirea evaluării de riscuri a fost planificată · SEPP notificat')},
  ]
  const bad = items.filter(i=>!i.ok).length, score = Math.max(0, S.conf - bad*2 - nes - exp)
  const rerun = async () => { setRun(true); await new Promise(r=>setTimeout(r,1300)); setRun(false); setTs('acum, '+AZI.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})); toast('Verificare finalizată') }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <PageHead title='Audit ITM — simulare de control' sub='Verificare automată a dosarului, ca și cum inspectorul ar veni mâine' action={<Btn label='Rulează verificarea' icon='refresh' variant='outline' loading={run} onClick={rerun}/>} />
      <Card style={{padding:22,display:'flex',gap:22,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{width:96,height:96,borderRadius:999,border:`6px solid ${trafficColor(score)}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:800,letterSpacing:'-0.02em',flexShrink:0}}>{score}</div>
        <div style={{flex:1,minWidth:240}}><div style={{fontSize:18,fontWeight:800}}>Pregătit de control în proporție de {score}%</div><div style={{fontSize:13,color:C.t2,marginTop:4}}>Ultima verificare: {ts} · {bad} elemente necesită atenție înainte de un control real</div></div>
        <Btn label='Generează dosar ITM' icon='download' onClick={()=>go('rapoarte')} />
      </Card>
      <Card>
        {items.map((it,i) => (
          <div key={i} style={{padding:'13px 18px',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',alignItems:'center',gap:14}}>
            <span style={{width:26,height:26,borderRadius:999,background:it.ok?C.greenBg:'oklch(0.94 0.05 85)',color:it.ok?C.teal:'oklch(0.45 0.12 75)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{it.ok?<Icon name='check' size={14} stroke={2.6}/>:'!'}</span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{it.t}</div>{it.s&&<div style={{fontSize:12,color:C.t2}}>{it.s}</div>}</div>
            {it.a && <TLink label={it.a+' →'} onClick={it.on} />}
          </div>
        ))}
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════
   S19 · SETĂRI — fără tab „Cont"; praguri ca linie compactă
═══════════════════════════════════════ */
function ModSetari({ modules, setModules, instrCfg, setInstrCfg, ind, firma, toast, params }) {
  const [tab,setTab] = useState(params?.tab||'module')
  const [ch,setCh] = useState({email:true,app:true,sms:false})
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:680}}>
      <PageHead title='Setări' />
      <Tabs tabs={[['module','Module'],['instruiri','Instruiri'],['notificari','Notificări'],['utilizatori','Utilizatori'],['firma','Firma']]} value={tab} onChange={setTab} />
      {tab==='module' && <Card style={{padding:20}}><div style={{display:'flex',flexDirection:'column',gap:16}}>
        {[{k:'semnatura',l:'Semnătură digitală',s:'Canvas, SMS sau upload foto'},{k:'nearMiss',l:'Near Miss / Incidente',s:'Raportare evenimente periculoase'},{k:'audit',l:'Audit intern SSM',s:'Simulare de control și listă de remediat'}].map((m,i) => <div key={m.k}>{i>0&&<div style={{height:1,background:C.line,marginBottom:16}}/>}<Toggle checked={!!modules[m.k]} onChange={v=>setModules({...modules,[m.k]:v})} label={m.l} sub={m.s}/></div>)}
        <Note>Modulele dezactivate dispar din navigare. Instruirile obligatorii și medicina muncii nu pot fi dezactivate.</Note>
      </div></Card>}
      {tab==='instruiri' && <Card style={{padding:20}}><div style={{display:'flex',flexDirection:'column'}}>
        {TOATE_INSTRUIRILE.filter(i=>!i.excl.includes(ind||'')).map((i,idx) => { const st=instrCfg[i.id]||{active:false,locked:false}; return (
          <div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderTop:idx>0?`1px solid ${C.line}`:'none',gap:10}}>
            <div><div style={{fontSize:13,fontWeight:700}}>{i.label}</div><div style={{fontSize:10,color:C.t2,fontFamily:C.mono,marginTop:2}}>{i.baza}</div></div>
            {st.locked ? <Pill label='Obligatoriu' tone='dark' sm/> : <Toggle checked={!!st.active} onChange={v=>setInstrCfg({...instrCfg,[i.id]:{...st,active:v}})}/>}
          </div>
        )})}
      </div></Card>}
      {tab==='notificari' && <Card style={{padding:20}}>
        <div style={{fontSize:14,fontWeight:800}}>Notificări automate pentru termene legale</div>
        <div style={{fontSize:12,color:C.t2,marginTop:2,marginBottom:14}}>3-4 notificări per scadență, pe canalele active</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:18}}>
          {[['30','zile înainte','planificare'],['14','zile înainte','reamintire'],['7','zile înainte','urgentare'],['1','zi / scadență','alertă finală']].map(([n,l,d]) => <div key={n} style={{padding:'10px 12px',background:C.bg,borderRadius:12,textAlign:'center'}}><div style={{fontSize:20,fontWeight:800,letterSpacing:'-0.02em'}}>{n}</div><div style={{fontSize:11,color:C.t2}}>{l}</div><div style={{fontFamily:C.mono,fontSize:9,textTransform:'uppercase',letterSpacing:'0.06em',color:C.t3,marginTop:3}}>{d}</div></div>)}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Toggle checked={ch.email} onChange={v=>setCh({...ch,email:v})} label='Email' sub='Către angajat + manager SSM'/><div style={{height:1,background:C.line}}/>
          <Toggle checked={ch.app} onChange={v=>setCh({...ch,app:v})} label='Notificare în aplicație' sub='Vizibilă în Panou'/><div style={{height:1,background:C.line}}/>
          <Toggle checked={ch.sms} onChange={v=>setCh({...ch,sms:v})} label='SMS' sub='Pentru angajați fără email · cost suplimentar'/>
        </div>
        <Note label='Copy notificări' style={{marginTop:16}}>Consecința întâi, titlu ≤ 40 caractere, o singură acțiune. Ex.: „Instruirea ta expiră mâine — durează ~25 min și semnezi direct pe telefon". Escaladare: ziua 30 și 14 doar email · ziua 7 email + push · ziua 1 email + push + „De rezolvat azi".</Note>
      </Card>}
      {tab==='utilizatori' && <Card style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><div><div style={{fontSize:14,fontWeight:800}}>Utilizatori & roluri</div><div style={{fontSize:11,color:C.t2}}>Administrator · Manager SSM · Angajat</div></div><Btn label='Utilizator' icon='plus' size='sm' onClick={()=>toast('Invitație trimisă pe email')}/></div>
        {[['Mihai Gheorghescu','manager@firma.ro','Administrator'],['Andrei Pop','andrei@firma.ro','Manager SSM'],['Vasile Mureșan','vasile@firma.ro','Manager SSM'],['Ion Popescu','ion@firma.ro','Angajat']].map(([n,e,r]) => <div key={e} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderTop:`1px solid ${C.line}`}}><div style={{display:'flex',gap:10,alignItems:'center'}}><Ava name={n} size={30}/><div><div style={{fontSize:13,fontWeight:700}}>{n}</div><div style={{fontSize:11,color:C.t2}}>{e}</div></div></div><div style={{display:'flex',gap:12,alignItems:'center'}}><Pill label={r} tone={r==='Administrator'?'dark':r==='Angajat'?'gray':'blue'} sm/><TLink label='Editează' onClick={()=>toast(`Editare rol pentru ${n}`)}/></div></div>)}
      </Card>}
      {tab==='firma' && <Card style={{padding:20}}><div style={{display:'flex',flexDirection:'column',gap:12}}>
        {[['Numele firmei',firma?.nume||''],['CUI','RO'+(firma?.cui||'')],['Localitate',firma?.oras||''],['Număr angajați',String(firma?.angajati||'')]].map(([l,v]) => <Inp key={l} label={l} value={v} onChange={()=>{}}/>)}
        <div><Btn label='Salvează' onClick={()=>toast('Datele firmei au fost salvate')}/></div>
      </div></Card>}
    </div>
  )
}

/* ═══════════════════════════════════════
   S20 · SUPORT — 4 canale egale + tichet secundar
═══════════════════════════════════════ */
function SupportDrawer({ onClose, toast }) {
  const [tip,setTip] = useState('Incident tehnic'); const [txt,setTxt] = useState('')
  const CH = [['chat','Chat live','Timp mediu de răspuns: 2 min','Deschide chat →'],['phone','Telefon','021 XXX XXXX · L-V 8-20','Sună acum →'],['mail','Email','support@safework.ro · răspuns < 4h','Scrie-ne →'],['book','Bază de cunoștințe','help.safework.ro · ghiduri și tutoriale','Deschide →']]
  return (
    <Drawer title='Suport tehnic' sub='Ajutor — răspuns în 2 minute' onClose={onClose}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {CH.map(([ic,t,s,a]) => <div key={t} onClick={()=>toast(`${t}: se deschide…`)} style={{padding:14,background:C.bg,borderRadius:12,cursor:'pointer',border:`1px solid ${C.line}`}}><Icon name={ic} size={18} color={C.t1}/><div style={{fontSize:13,fontWeight:800,marginTop:8}}>{t}</div><div style={{fontSize:11,color:C.t2,marginTop:2,lineHeight:1.4}}>{s}</div><div style={{fontSize:12,fontWeight:700,marginTop:8}}>{a}</div></div>)}
      </div>
      <div style={{fontSize:13,fontWeight:700,margin:'20px 0 10px'}}>Sau deschideți un tichet</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <Sel value={tip} onChange={e=>setTip(e.target.value)} options={['Incident tehnic','Eroare de sistem','Dificultate de utilizare','Solicitare funcționalitate']}/>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder='Descrieți problema…' rows={4} style={{padding:'10px 12px',border:`1.5px solid ${C.line}`,borderRadius:12,fontSize:13,fontFamily:'inherit',resize:'vertical',outline:'none'}}/>
        <Btn label='Trimite tichetul' full disabled={!txt.trim()} onClick={()=>{toast('Tichet #SW-2026-0817 înregistrat · răspuns în max. 4 ore lucrătoare');onClose()}}/>
      </div>
    </Drawer>
  )
}

/* ═══════════════════════════════════════
   NEAR MISS (modul opțional) — păstrat, restilizat fără emoji
═══════════════════════════════════════ */
function ModNearMiss({ toast }) {
  const [list,setList] = useState([{id:'NM-031',date:'12 aug',loc:'Hală 2',desc:'Lichid vărsat pe culoarul de evacuare',sev:'Mediu',status:'Investigare'},{id:'NM-030',date:'09 aug',loc:'Depozit',desc:'Raft instabil — risc de cădere materiale',sev:'Ridicat',status:'Acțiune'},{id:'NM-029',date:'03 aug',loc:'Birou tehnic',desc:'Cablu electric neprotejat',sev:'Scăzut',status:'Rezolvat'}])
  const [show,setShow] = useState(false); const [f,setF] = useState({loc:'',desc:'',sev:'Mediu'})
  const tone = s => ({Ridicat:'red',Mediu:'amber',Scăzut:'green',Investigare:'amber',Acțiune:'red',Rezolvat:'green'}[s]||'gray')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {show && <Modal title='Raportare Near Miss' onClose={()=>setShow(false)} width={440} footer={<><Btn label='Renunță' variant='outline' onClick={()=>setShow(false)}/><Btn label='Trimite' disabled={!f.loc||!f.desc} onClick={()=>{setList([{id:'NM-032',date:fmtZi(AZI),...f,status:'Investigare'},...list]);setShow(false);toast('Near miss înregistrat · responsabilul notificat')}}/></>}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}><Inp label='Locație' placeholder='ex: Hală 2' value={f.loc} onChange={e=>setF({...f,loc:e.target.value})}/><Inp label='Ce s-a întâmplat' value={f.desc} onChange={e=>setF({...f,desc:e.target.value})}/><Sel label='Severitate' value={f.sev} onChange={e=>setF({...f,sev:e.target.value})} options={['Scăzut','Mediu','Ridicat']}/></div>
      </Modal>}
      <PageHead title='Near Miss & Incidente' sub='Raportare și investigare' action={<Btn label='Raportează' icon='alert' onClick={()=>setShow(true)}/>} />
      <Card>{list.map((n,i) => <div key={n.id} style={{padding:'14px 18px',borderTop:i>0?`1px solid ${C.line}`:'none'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:5,alignItems:'center'}}><div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>{n.id}</span><Pill label={n.sev} tone={tone(n.sev)} sm/></div><span style={{fontSize:11,color:C.t2}}>{n.date}</span></div><div style={{fontSize:13,fontWeight:600}}>{n.desc}</div><div style={{display:'flex',justifyContent:'space-between',marginTop:6}}><span style={{fontSize:11,color:C.t2}}>{n.loc}</span><Pill label={n.status} tone={tone(n.status)} sm/></div></div>)}</Card>
    </div>
  )
}

/* ═══════════════════════════════════════
   C2 · PLANUL TĂU SSM (mod consultant, sub 10 angajați)
═══════════════════════════════════════ */
function ModPlanSSM({ firma, go, toast }) {
  const [done,setDone] = useState({1:true,2:true})
  const O = [
    [1,'Cursul de 40h SSM pentru administrator','Te înscrii la un curs acreditat — după el poți face SSM-ul singur, legal.','cât mai curând','Vezi cursuri',()=>toast('Lista cursurilor acreditate se deschide')],
    [2,'Evaluarea riscurilor pentru fiecare post','Documentul de bază: ce riscuri există și cum le previi. Se face o dată, se revizuiește anual.','30 zile','Începe evaluarea',()=>toast('Asistentul de evaluare a riscurilor pornește')],
    [3,'Planul de prevenire și protecție','Rezultă direct din evaluarea riscurilor. SafeWork îl generează pe baza răspunsurilor tale.','30 zile','Generează',()=>toast('Planul de prevenire și protecție a fost generat (draft)')],
    [4,'Instruirea introductiv-generală (IIG)','Fiecare angajat, în prima zi, înainte să înceapă lucrul. Cu test și semnătură.','la fiecare angajare','Configurează',()=>go('instruiri')],
    [5,'Instruirea la locul de muncă (ILM)','A doua instruire obligatorie din prima zi — specifică postului.','la fiecare angajare','Configurează',()=>go('instruiri')],
    [6,'Instruirea periodică (IP)','Se repetă la 1–6 luni. SafeWork te anunță automat înainte de termen.','recurent','Programează',()=>go('instruiri')],
    [7,'Fișele de instruire semnate','Fiecare instruire se consemnează în fișa individuală (Anexa 11 HG 1425/2006).','după fiecare instruire','Vezi fișele',()=>go('documente')],
    [8,'Medicina muncii pentru toți angajații','Aviz la angajare + control periodic. Fără aviz apt, angajatul nu poate lucra.','la angajare + anual','Programează',()=>go('medicina')],
    [9,'Instruirea PSI / situații de urgență','Prevenirea incendiilor — obligatorie separat de SSM (Legea 307/2006).','periodic','Configurează',()=>go('instruiri')],
  ]
  const n = Object.values(done).filter(Boolean).length
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,maxWidth:680}}>
      <div><span style={{fontFamily:C.mono,fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,fontWeight:600}}>Modul consultant · firmă sub 10 angajați</span><PageHead title='Planul tău SSM' sub={`${firma?.nume?firma.nume+' · ':''}Tot ce îți cere legea, pas cu pas, fără termeni juridici.`}/></div>
      <Card style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}><div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,marginBottom:6}}>{n} din {O.length} obligații rezolvate</div><PBar val={n/O.length*100} color={C.green} h={7}/></div><span style={{fontFamily:C.mono,fontSize:18,fontWeight:700,color:C.teal}}>{Math.round(n/O.length*100)}%</span></Card>
      {O.map(([k,t,d,term,act,on]) => { const ok=!!done[k]; return (
        <Card key={k} style={{padding:'16px 18px',opacity:ok?.6:1}}>
          <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
            <span onClick={()=>setDone({...done,[k]:!ok})} style={{width:32,height:32,borderRadius:999,flexShrink:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,background:ok?C.green:C.primary,color:'#fff'}}>{ok?<Icon name='check' size={15} stroke={2.6}/>:k}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap',alignItems:'flex-start'}}><strong style={{fontSize:15,fontWeight:700}}>{t}</strong><Pill label={term} tone='amber' sm/></div>
              <div style={{fontSize:13,color:C.t2,lineHeight:1.55,marginTop:4}}>{d}</div>
              {!ok && <div style={{marginTop:10}}><Btn label={act} size='sm' iconRight='arrowR' onClick={on}/></div>}
            </div>
          </div>
        </Card>
      )})}
      <Note label='De ce e posibil'>Sub 10 angajați și activitate fără riscuri deosebite, administratorul poate îndeplini singur atribuțiile SSM (HG 1425/2006 art. 12) — cu cursul de 40h. SafeWork ține locul serviciului extern pentru documente, termene și instruiri.</Note>
    </div>
  )
}

/* ═══════════════════════════════════════
   APP SHELL — sidebar grupat (Operațional / Conținut / Organizație), profil cu meniu
═══════════════════════════════════════ */
export function AppShell({ user, appCfg, onLogout }) {
  const [tab,setTab] = useState('panou')
  const [params,setParams] = useState(null)
  const [modules,setModules] = useState(appCfg?.modules||{nearMiss:false,audit:true,semnatura:true})
  const [instrCfg,setInstrCfg] = useState(appCfg?.instruiri||{})
  const [docs,setDocs] = useState(DOCS_INIT)
  const firma = appCfg?.firma||null
  const ind = appCfg?.cons?.ind||'productie'
  const ANG = getAngajati(ind)
  const [med,setMed] = useState(()=>ANG.map((a,i)=>({id:a.id,name:a.name,dept:a.dept,tip:i===2?'Angajare':'Periodică',ef:['10 ian 2026','15 feb 2026','01 mar 2025','20 mar 2026','05 apr 2026'][i],exp:['10 ian 2027','15 feb 2027','01 mar 2026','20 mar 2027','05 apr 2027'][i],apt:i!==2})))
  const [support,setSupport] = useState(false)
  const [menu,setMenu] = useState(false)
  const [tst,setTst] = useState(null)
  const toast = (msg,action,onAction) => setTst({msg,action,onAction,k:Date.now()})
  const go = (t,p) => { setTab(t); setParams(p||null); window.scrollTo(0,0) }
  const nes = docs.filter(d=>d.status==='Nesemnat').length, exp = med.filter(m=>!m.apt).length

  const GROUPS = [
    {h:'Operațional', items:[
      {id:'panou',label:'Panou',icon:'panel'},
      ...((firma?.angajati||10)<10?[{id:'plan',label:'Planul tău SSM',icon:'shield'}]:[]),
      {id:'documente',label:'Documente',icon:'file',badge:nes},
      {id:'instruiri',label:'Instruiri',icon:'book',badge:getStats(firma).scadente},
      {id:'medicina',label:'Med. muncii',icon:'med',badge:exp},
      ...(modules.nearMiss?[{id:'nearmiss',label:'Incidente',icon:'alert'}]:[]),
    ]},
    {h:'Conținut', items:[{id:'materiale',label:'Materiale & Teste',icon:'layers'},{id:'legislatie',label:'Legislație',icon:'scale'}]},
    {h:'Organizație', items:[{id:'rapoarte',label:'Rapoarte',icon:'chart'},{id:'arhiva',label:'Arhivă',icon:'archive'},{id:'structura',label:'Structură',icon:'building'},...(modules.audit?[{id:'audit',label:'Audit ITM',icon:'shield'}]:[])]},
  ]
  const render = () => {
    switch(tab) {
      case 'panou': return <ModPanou user={user} firma={firma} ind={ind} docs={docs} med={med} go={go} toast={toast}/>
      case 'plan': return <ModPlanSSM firma={firma} go={go} toast={toast}/>
      case 'documente': return <ModDocumente key={JSON.stringify(params)} ind={ind} docs={docs} setDocs={setDocs} params={params} toast={toast} go={go}/>
      case 'instruiri': return <ModInstruiri instrCfg={instrCfg} ind={ind} firma={firma} toast={toast} go={go}/>
      case 'medicina': return <ModMedicina med={med} setMed={setMed} toast={toast}/>
      case 'materiale': return <ModMateriale toast={toast}/>
      case 'legislatie': return <ModLegislatie user={user} toast={toast}/>
      case 'rapoarte': return <ModRapoarte toast={toast}/>
      case 'arhiva': return <ModArhiva toast={toast}/>
      case 'structura': return <ModStructura toast={toast}/>
      case 'audit': return <ModAudit docs={docs} med={med} firma={firma} go={go} toast={toast}/>
      case 'nearmiss': return <ModNearMiss toast={toast}/>
      case 'setari': return <ModSetari key={JSON.stringify(params)} modules={modules} setModules={setModules} instrCfg={instrCfg} setInstrCfg={setInstrCfg} ind={ind} firma={firma} toast={toast} params={params}/>
      default: return null
    }
  }
  const NavItem = ({it}) => { const on=tab===it.id; return (
    <div onClick={()=>go(it.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:9,cursor:'pointer',fontSize:13,background:on?C.white:'transparent',fontWeight:on?700:500,color:on?C.t0:C.t1,boxShadow:on?C.shadow:'none',minHeight:36}}>
      <Icon name={it.icon} size={16} color={on?C.t0:C.t2}/><span style={{flex:1}}>{it.label}</span>
      {it.badge>0 && <span style={{fontFamily:C.mono,fontSize:10,fontWeight:700,background:it.id==='medicina'?C.redBg:'oklch(0.94 0.05 85)',color:it.id==='medicina'?C.red:'oklch(0.45 0.12 75)',padding:'2px 7px',borderRadius:999}}>{it.badge}</span>}
    </div>
  )}
  return (
    <div style={{fontFamily:'Manrope, sans-serif',height:'100vh',display:'flex',background:C.bg,color:C.t0,overflow:'hidden'}}>
      {support && <SupportDrawer onClose={()=>setSupport(false)} toast={toast}/>}
      {tst && <Toast key={tst.k} msg={tst.msg} action={tst.action} onAction={tst.onAction} onClose={()=>setTst(null)}/>}
      <aside style={{width:220,background:C.bg,borderRight:`1px solid #EEEDE9`,padding:'18px 12px 14px',display:'flex',flexDirection:'column',gap:14,flexShrink:0,boxSizing:'border-box'}}>
        <div style={{padding:'0 6px'}}><Logo /></div>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:14}}>
          {GROUPS.map(g => (
            <div key={g.h}>
              <div style={{fontFamily:C.mono,fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:C.t3,padding:'0 10px',marginBottom:5,fontWeight:600}}>{g.h}</div>
              <div style={{display:'flex',flexDirection:'column',gap:1}}>{g.items.map(it => <NavItem key={it.id} it={it}/>)}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:1,borderTop:`1px solid ${C.line}`,paddingTop:10}}>
          <NavItem it={{id:'setari',label:'Setări',icon:'gear'}}/>
          <div onClick={()=>setSupport(true)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:9,cursor:'pointer',fontSize:13,color:C.t1,minHeight:36}}><Icon name='help' size={16} color={C.t2}/>Ajutor <span style={{fontSize:10,color:C.t3,fontFamily:C.mono}}>· 2 min</span></div>
        </div>
        <div style={{position:'relative'}}>
          <div onClick={()=>setMenu(!menu)} style={{display:'flex',gap:9,alignItems:'center',padding:'8px 8px',borderRadius:11,cursor:'pointer',background:menu?C.white:'transparent',boxShadow:menu?C.shadow:'none'}}>
            <Ava name={user?.name||'M'} size={30}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.name||'Manager SSM'}</div><div style={{fontFamily:C.mono,fontSize:9,color:C.t3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{firma?.nume||'Firma dvs.'}</div></div>
            <span style={{fontFamily:C.mono,fontSize:9,border:`1px solid ${C.lineHi}`,borderRadius:5,padding:'2px 5px',color:C.t2}} title='Limbă interfață — EN în curând'>RO</span>
          </div>
          {menu && <>
            <div onClick={()=>setMenu(false)} style={{position:'fixed',inset:0,zIndex:998}}/>
            <div style={{position:'absolute',bottom:52,left:0,right:0,background:C.white,border:`1px solid ${C.line}`,borderRadius:12,boxShadow:'0 8px 30px rgba(22,25,28,0.12)',zIndex:999,overflow:'hidden'}}>
              <div style={{padding:'10px 14px',borderBottom:`1px solid ${C.line}`}}><div style={{fontSize:12,fontWeight:700}}>{user?.email||'manager@firma.ro'}</div><div style={{fontSize:11,color:C.t2}}>Manager SSM · plan Professional</div></div>
              {[['gear','Setări',()=>go('setari')],['help','Ajutor',()=>setSupport(true)]].map(([ic,l,fn]) => <button key={l} onClick={()=>{fn();setMenu(false)}} style={{width:'100%',padding:'10px 14px',background:'none',border:'none',textAlign:'left',fontSize:13,color:C.t1,cursor:'pointer',fontFamily:'inherit',display:'flex',gap:9,alignItems:'center'}}><Icon name={ic} size={15}/>{l}</button>)}
              <button onClick={onLogout} style={{width:'100%',padding:'10px 14px',background:'none',border:'none',borderTop:`1px solid ${C.line}`,textAlign:'left',fontSize:13,color:C.red,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',gap:9,alignItems:'center'}}><Icon name='logout' size={15}/>Deconectare</button>
            </div>
          </>}
        </div>
      </aside>
      <main style={{flex:1,overflowY:'auto',padding:'26px 30px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}} className='fade-in' key={tab}>{render()}</div>
      </main>
    </div>
  )
}
