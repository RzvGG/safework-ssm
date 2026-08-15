import { useState } from 'react'
import { C, CUI_DB, getRiscCAEN, getIndustrieCAEN, getConsiliere, TOATE_INSTRUIRILE } from './data.js'
import { Icon, Logo, Card, Btn, Inp, Sel, Toggle, Pill, Note, TLink } from './ui.jsx'

const STEPS = ['CUI','Firmă','Configurare','Gata']

export function Wizard({ user, onFinish, onBack }) {
  const [step,setStep] = useState(1)
  const [cui,setCui] = useState('')
  const [manual,setManual] = useState(false)
  const [mf,setMf] = useState({nume:'',caen:'',angajati:'',oras:''})
  const [loading,setLoading] = useState(false)
  const [cuiErr,setCuiErr] = useState('')
  const [firma,setFirma] = useState(null)
  const [cons,setCons] = useState(null)
  const [contact,setContact] = useState({name:user?.name||'',tel:''})
  const [modules,setModules] = useState({nearMiss:false,audit:false,semnatura:true})
  const [instruiri,setInstruiri] = useState({})
  const [accepted,setAccepted] = useState(false)

  const applyFirma = (d, c) => {
    setFirma({ ...d, cui:c })
    const risc = getRiscCAEN(d.caen), ind = getIndustrieCAEN(d.caen)
    setCons({ ...getConsiliere(d.angajati, risc), risc, ind })
    setModules({ nearMiss: risc==='ridicat'||['productie','constructii','transport'].includes(ind), audit: d.angajati>=20, semnatura: !['constructii','transport'].includes(ind) })
    const ii = {}
    TOATE_INSTRUIRILE.forEach(i => { const excl=i.excl.includes(ind); ii[i.id]={active:!excl&&i.oblig, locked:i.oblig&&!excl} })
    setInstruiri(ii)
    setStep(2)
  }
  const lookupCUI = async () => {
    const c = cui.replace(/\s|RO/gi,'')
    if (c.length < 6) { setCuiErr('CUI invalid — minim 6 cifre'); return }
    setLoading(true); setCuiErr('')
    await new Promise(r=>setTimeout(r,900))
    const d = CUI_DB[c]
    if (d) applyFirma(d, c); else setCuiErr('CUI negăsit în ONRC. Verificați sau completați manual.')
    setLoading(false)
  }
  const manualOk = mf.nume.trim() && /^\d{4}$/.test(mf.caen) && parseInt(mf.angajati)>0
  const applyManual = () => applyFirma({ nume:mf.nume, caen:mf.caen, desc:'Completat manual', oras:mf.oras||'—', județ:'', angajati:parseInt(mf.angajati), forma:'SRL' }, cui.replace(/\s|RO/gi,'')||'—')

  const riscLabel = {ridicat:'Ridicat',mediu:'Mediu',scazut:'Scăzut'}[cons?.risc]||'—'
  const canNext = step===1 ? (manual ? manualOk : cui.replace(/\s|RO/gi,'').length>=6) : step===2 ? !!firma : true

  return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 16px'}}>
      <div style={{width:'100%',maxWidth:620}}>
        <div style={{textAlign:'center',marginBottom:22,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <Logo size='lg' onClick={onBack} />
          <div style={{fontFamily:C.mono,fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,marginTop:10,fontWeight:600}}>Pasul {step} din {STEPS.length} · {STEPS[step-1]}</div>
        </div>
        <div style={{display:'flex',gap:4,marginBottom:22}}>{STEPS.map((_,i) => <div key={i} style={{flex:1,height:4,borderRadius:4,background:i<step?C.primary:C.line,transition:'background .3s'}} />)}</div>

        <Card style={{padding:28}}>
          {/* S3 · CUI */}
          {step===1 && (
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:C.t0,letterSpacing:'-0.02em',marginBottom:6}}>Introduceți CUI-ul firmei</div>
                <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Preluăm automat datele din ONRC și configurăm aplicația conform specificului firmei.</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <input value={cui} onChange={e=>{setCui(e.target.value);setCuiErr('')}} onKeyDown={e=>e.key==='Enter'&&!loading&&lookupCUI()} placeholder='ex: RO12345678' maxLength={12}
                  style={{flex:1,padding:'12px 16px',background:C.white,border:`1.5px solid ${cuiErr?C.red:C.line}`,borderRadius:12,fontSize:15,fontWeight:600,color:C.t0,outline:'none',fontFamily:C.mono,letterSpacing:'0.04em',minHeight:44}} />
                <Btn label='Caută' icon='search' onClick={lookupCUI} disabled={cui.replace(/\s|RO/gi,'').length<6} loading={loading} />
              </div>
              {cuiErr && <div style={{fontSize:12,color:C.red,fontWeight:600,marginTop:-8}}>{cuiErr}</div>}
              <Note label='CUI-uri demo pentru testare'>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
                  {Object.entries(CUI_DB).map(([c,d]) => (
                    <button key={c} onClick={()=>{setCui(c);setCuiErr('');setManual(false)}} style={{padding:'5px 10px',background:cui===c?C.primary:C.white,border:`1px solid ${cui===c?C.primary:C.lineHi}`,borderRadius:999,fontSize:11,color:cui===c?'#fff':C.t0,cursor:'pointer',fontWeight:600,fontFamily:C.mono}}>{c} · {d.angajati} ang.</button>
                  ))}
                </div>
              </Note>
              {!manual
                ? <div style={{fontSize:13,color:C.t2}}>Nu aveți CUI la îndemână? <TLink label='Completați manual →' onClick={()=>setManual(true)} size={13} /></div>
                : <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:12,borderTop:`1px solid ${C.line}`}}>
                    <div style={{fontSize:13,fontWeight:700}}>Completare manuală</div>
                    <Inp label='Denumirea firmei' placeholder='Firma Mea SRL' value={mf.nume} onChange={e=>setMf({...mf,nume:e.target.value})} />
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                      <Inp label='Cod CAEN' placeholder='4120' value={mf.caen} onChange={e=>setMf({...mf,caen:e.target.value.replace(/\D/g,'').slice(0,4)})} mono />
                      <Inp label='Nr. angajați' placeholder='12' value={mf.angajati} onChange={e=>setMf({...mf,angajati:e.target.value.replace(/\D/g,'')})} mono />
                      <Inp label='Localitate' placeholder='București' value={mf.oras} onChange={e=>setMf({...mf,oras:e.target.value})} />
                    </div>
                    <TLink label='Renunț — caut după CUI' onClick={()=>setManual(false)} color={C.t2} />
                  </div>}
            </div>
          )}

          {/* S4 · Firmă + Analiza SSM */}
          {step===2 && firma && cons && (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{fontSize:22,fontWeight:800,color:C.t0,letterSpacing:'-0.02em'}}>Confirmați datele firmei</div>
              <div style={{padding:18,background:C.bg,border:`1px solid ${C.line}`,borderRadius:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:14,flexWrap:'wrap'}}>
                  <div><div style={{fontSize:18,fontWeight:800,color:C.t0}}>{firma.nume}</div><div style={{fontSize:12,color:C.t2,marginTop:2,fontFamily:C.mono}}>CUI: RO{firma.cui} · {firma.forma} · {firma.oras}</div></div>
                  <Pill label='Verificat ONRC' tone='green' />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                  {[['CAEN',`${firma.caen} — ${firma.desc}`],['Angajați',`${firma.angajati} salariați`],['Risc',riscLabel]].map(([l,v]) => (
                    <div key={l} style={{padding:'10px 12px',background:C.white,borderRadius:10,border:`1px solid ${C.line}`}}>
                      <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,marginBottom:3}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.t0,lineHeight:1.4}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:16,borderRadius:14,background:cons.bgC,border:`1px solid ${cons.culoare}44`}}>
                <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:cons.culoare,marginBottom:6,fontWeight:600}}>Analiza SSM — ce rezultă din datele firmei</div>
                <div style={{fontSize:14,fontWeight:800,color:C.t0,marginBottom:4}}>{cons.titlu}</div>
                <div style={{fontSize:13,color:C.t1,lineHeight:1.6}}>{cons.rezumat} SafeWork configurează modulele corespunzător și marchează acțiunile urgente în Panou.</div>
                <div style={{fontSize:11,color:C.t2,marginTop:10,lineHeight:1.5,fontFamily:C.mono}}>Sancțiuni ITM: neinstruire 3.000–6.000 lei · lipsă evaluare riscuri 4.000–8.000 lei · fără organizare SSM 5.000–10.000 lei</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <Inp label='Persoana de contact / Manager SSM' placeholder='Ion Popescu' value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} />
                <Inp label='Telefon' placeholder='07xx xxx xxx' value={contact.tel} onChange={e=>setContact({...contact,tel:e.target.value})} />
              </div>
            </div>
          )}

          {/* S5 · Module + Instruiri, două coloane */}
          {step===3 && (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><div style={{fontSize:22,fontWeight:800,color:C.t0,letterSpacing:'-0.02em'}}>Module și instruiri</div><div style={{fontSize:13,color:C.t2,marginTop:4}}>Obligatoriile sunt activate automat conform legislației. Puteți ajusta oricând din Setări.</div></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
                <div>
                  <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,marginBottom:8,fontWeight:600}}>Module</div>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    {[
                      {key:null,l:'Instruiri SSM',s:'Obligatoriu · L.319/2006'},
                      {key:null,l:'Medicină muncii',s:'Obligatoriu · evidența avizelor'},
                      {key:'semnatura',l:'Semnătură digitală',s:'Canvas, SMS sau upload foto'},
                      {key:'nearMiss',l:'Near Miss / Incidente',s:cons?.risc==='scazut'?'Dezactivat pentru risc scăzut':'Recomandat pentru riscul activității'},
                      {key:'audit',l:'Audit intern SSM',s:(firma?.angajati||0)<20?'Dezactivat pentru firme mici':'Recomandat pentru dimensiunea firmei'},
                    ].map((m,i) => (
                      <div key={i} style={{padding:'11px 0',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                        <div><div style={{fontSize:13,fontWeight:700,color:C.t0}}>{m.l}</div><div style={{fontSize:11,color:C.t2,marginTop:2}}>{m.s}</div></div>
                        {m.key ? <Toggle checked={!!modules[m.key]} onChange={v=>setModules({...modules,[m.key]:v})} /> : <Pill label='Activ' tone='green' sm />}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,marginBottom:8,fontWeight:600}}>Tipuri de instruire</div>
                  <div style={{display:'flex',flexDirection:'column',maxHeight:340,overflowY:'auto'}}>
                    {TOATE_INSTRUIRILE.filter(i=>!i.excl.includes(cons?.ind||'')).map((i,idx) => {
                      const st = instruiri[i.id]||{active:false,locked:false}
                      return (
                        <div key={i.id} style={{padding:'11px 0',borderTop:idx>0?`1px solid ${C.line}`:'none',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                          <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:C.t0}}>{i.label}</div><div style={{fontSize:10,color:C.t2,marginTop:2,fontFamily:C.mono}}>{i.baza}</div></div>
                          {st.locked ? <Pill label='Obligatoriu' tone='dark' sm /> : <Toggle checked={!!st.active} onChange={v=>setInstruiri({...instruiri,[i.id]:{...st,active:v}})} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* S6 · Gata */}
          {step===4 && (
            <div style={{textAlign:'center',padding:'6px 0'}}>
              <span style={{width:56,height:56,borderRadius:999,background:C.green,color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:14}}><Icon name='check' size={26} stroke={2.6}/></span>
              <div style={{fontSize:22,fontWeight:800,color:C.t0,letterSpacing:'-0.02em',marginBottom:6}}>Totul este configurat</div>
              <div style={{fontSize:13,color:C.t2,marginBottom:18,lineHeight:1.7}}><strong style={{color:C.t0}}>{firma?.nume}</strong> este înregistrată. Primele acțiuni recomandate vă așteaptă în Panou.</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:20}}>
                {['Instruiri SSM obligatorii','Medicină muncii','Documente & Emitere',...(modules.semnatura?['Semnătură digitală']:[]),...(modules.nearMiss?['Near Miss']:[]),...(modules.audit?['Audit intern']:[])].map(t => <Pill key={t} label={t} tone='green' />)}
              </div>
              <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',textAlign:'left',marginBottom:16,padding:'12px 14px',background:C.bg,borderRadius:12,border:`1px solid ${accepted?C.primary:C.line}`}}>
                <input type='checkbox' checked={accepted} onChange={e=>setAccepted(e.target.checked)} style={{accentColor:C.primary,width:16,height:16,marginTop:2,flexShrink:0}} />
                <span style={{fontSize:12,color:C.t1,lineHeight:1.6}}>Am înțeles că SafeWork SSM este un instrument de suport și nu înlocuiește un consultant SSM autorizat. Responsabilitatea legală rămâne la angajator conform L.319/2006.</span>
              </label>
              <Btn label='Deschide aplicația' full size='lg' disabled={!accepted} onClick={()=>onFinish({firma,modules,instruiri,cons,contact})} iconRight='arrowR' />
              <div style={{fontSize:12,color:C.t2,marginTop:12}}>Primul pas sugerat: importați lista de angajați (CSV sau manual)</div>
            </div>
          )}

          {step<4 && (
            <div style={{display:'flex',justifyContent:'space-between',marginTop:24,gap:10}}>
              <Btn label='Înapoi' icon='arrowL' variant='outline' onClick={()=>step===1?onBack():setStep(step-1)} />
              <Btn label={step===3?'Finalizare':'Continuă'} iconRight='arrowR' disabled={!canNext} loading={loading&&step===1}
                onClick={()=>step===1?(manual?applyManual():lookupCUI()):setStep(step+1)} />
            </div>
          )}
        </Card>
        <div style={{marginTop:14,textAlign:'center',fontSize:10,color:C.t3,fontFamily:C.mono}}>Bazat pe L.319/2006 · HG 1425/2006 · Legea 307/2006 · SafeWork nu înlocuiește un SEPP autorizat</div>
      </div>
    </div>
  )
}
