import { useState, useEffect } from 'react'
import { C } from './data.js'
import { Icon, Logo, Btn, Inp, Alert, TLink, useWidth } from './ui.jsx'

function Branding() {
  return (
    <div style={{background:C.primary,padding:'44px 44px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'100vh',boxSizing:'border-box'}}>
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:56}}>
          <Logo dark />
          <span style={{fontFamily:C.mono,fontSize:10,color:'#8A8F95',letterSpacing:'0.06em'}}>RO · EN</span>
        </div>
        <span style={{fontFamily:C.mono,fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:C.green,fontWeight:600}}>Platformă SSM · România</span>
        <h1 style={{margin:'10px 0 14px',fontSize:34,fontWeight:800,letterSpacing:'-0.02em',lineHeight:1.15,color:'#FFFFFF'}}>SSM-ul firmei tale,<br/>în regulă. Fără dosare.</h1>
        <p style={{margin:0,fontSize:15,lineHeight:1.6,color:'#8A8F95',maxWidth:380}}>Instruiri semnate pe telefon, fișe generate automat conform HG 1425/2006, termene urmărite pentru tine.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:22}}>
        <div style={{display:'flex',flexDirection:'column',gap:13}}>
          {['Fișe de instruire generate și arhivate automat','Semnătură pe ecran — valabilă, cu trasabilitate','Dosar complet, pregătit pentru controlul ITM'].map(t => (
            <div key={t} style={{display:'flex',gap:11,alignItems:'center'}}>
              <span style={{width:22,height:22,borderRadius:999,background:C.green,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon name='check' size={12} stroke={2.6}/></span>
              <span style={{fontSize:14,color:'#D5D2CA'}}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid #2A2E33',paddingTop:18,display:'flex',gap:28}}>
          {[['HG 259/2022','fișă electronică legală'],['5 min','configurare'],['0 lei','fără card bancar']].map(([v,l]) => (
            <div key={l}><div style={{fontSize:19,fontWeight:800,color:'#FFFFFF'}}>{v}</div><div style={{fontFamily:C.mono,fontSize:10,color:'#8A8F95',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:3}}>{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* S1 · Login — fără social login; angajații intră prin link, nu prin cont */
function Login({ onLogin, goReg, goForgot, goEmployee }) {
  const [email,setEmail] = useState('')
  const [pass,setPass]   = useState('')
  const [err,setErr]     = useState({})
  const [loading,setLoading] = useState(false)
  const handle = async () => {
    const e = {}
    if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Introduceți un email valid'
    if (pass.length < 6) e.pass = 'Minim 6 caractere'
    if (Object.keys(e).length) { setErr(e); return }
    setLoading(true); await new Promise(r=>setTimeout(r,900))
    onLogin({ email, name: email.split('@')[0] })
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div><div style={{fontSize:26,fontWeight:800,color:C.t0,letterSpacing:'-0.02em'}}>Bun venit înapoi</div><div style={{fontSize:13,color:C.t2,marginTop:4}}>Introduceți datele de autentificare</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <Inp label='Email' type='email' placeholder='email@firma.ro' value={email} onChange={e=>{setEmail(e.target.value);setErr({...err,email:''})}} error={err.email} onKeyDown={e=>e.key==='Enter'&&handle()} />
        <Inp label='Parolă' type='password' placeholder='••••••••' value={pass} onChange={e=>{setPass(e.target.value);setErr({...err,pass:''})}} error={err.pass} onKeyDown={e=>e.key==='Enter'&&handle()} />
        <div style={{display:'flex',justifyContent:'flex-end'}}><TLink label='Am uitat parola →' onClick={goForgot} /></div>
      </div>
      <Btn label='Autentificare' onClick={handle} loading={loading} full size='lg' />
      <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{flex:1,height:1,background:C.line}}/><span style={{fontSize:12,color:C.t3}}>sau</span><div style={{flex:1,height:1,background:C.line}}/></div>
      <button onClick={goEmployee} style={{width:'100%',padding:'13px 16px',background:C.white,border:`1.5px solid ${C.lineHi}`,borderRadius:12,fontSize:13,fontWeight:700,color:C.t0,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:46}}>
        <Icon name='mail' size={15}/> Angajat? Primește link de semnare pe email
      </button>
      <div style={{textAlign:'center',fontSize:13,color:C.t2}}>Nu aveți cont? <TLink label='Înregistrați firma →' onClick={goReg} size={13} /></div>
      <div style={{padding:'10px 14px',background:C.bg,borderRadius:10,border:`1px solid ${C.line}`,fontSize:11,color:C.t2,fontFamily:C.mono}}>Demo: orice email + parolă cu min. 6 caractere</div>
    </div>
  )
}

/* S2 · Înregistrare — fără „confirmare parolă"; indicator de putere */
function Register({ onReg, goLogin }) {
  const [f,setF] = useState({name:'',email:'',pass:'',terms:false})
  const [err,setErr] = useState({})
  const [loading,setLoading] = useState(false)
  const set = (k,v) => { setF(x=>({...x,[k]:v})); setErr(e=>({...e,[k]:''})) }
  const strength = f.pass.length>=12&&/[0-9]/.test(f.pass)&&/[^a-zA-Z0-9]/.test(f.pass)?3:f.pass.length>=8&&/[0-9]/.test(f.pass)?2:f.pass.length>=8?1:0
  const handle = async () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Numele este obligatoriu'
    if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Introduceți un email valid'
    if (f.pass.length < 8) e.pass = 'Minim 8 caractere'
    if (!f.terms) e.terms = 'Acceptați termenii pentru a continua'
    if (Object.keys(e).length) { setErr(e); return }
    setLoading(true); await new Promise(r=>setTimeout(r,900))
    onReg({ email:f.email, name:f.name, isNew:true })
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div><div style={{fontSize:26,fontWeight:800,color:C.t0,letterSpacing:'-0.02em'}}>Creați un cont</div><div style={{fontSize:13,color:C.t2,marginTop:4}}>Înregistrați firma și configurați SSM-ul în 5 minute</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:13}}>
        <Inp label='Nume complet' placeholder='Ion Popescu' value={f.name} onChange={e=>set('name',e.target.value)} error={err.name} />
        <Inp label='Email de serviciu' type='email' placeholder='ion@firma.ro' value={f.email} onChange={e=>set('email',e.target.value)} error={err.email} />
        <div>
          <Inp label='Parolă' type='password' placeholder='Minim 8 caractere' value={f.pass} onChange={e=>set('pass',e.target.value)} error={err.pass} />
          {f.pass && <div style={{display:'flex',gap:4,marginTop:6,alignItems:'center'}}>
            {[1,2,3].map(i => <div key={i} style={{flex:1,height:4,borderRadius:4,background:strength>=i?(strength===3?C.green:strength===2?'oklch(0.75 0.12 75)':C.red):C.line}}/>)}
            <span style={{fontSize:11,color:C.t2,marginLeft:6,fontFamily:C.mono}}>{['slabă','slabă','bună','puternică'][strength]}</span>
          </div>}
        </div>
      </div>
      <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer'}}>
        <input type='checkbox' checked={f.terms} onChange={e=>set('terms',e.target.checked)} style={{accentColor:C.primary,width:16,height:16,marginTop:2,flexShrink:0}} />
        <span style={{fontSize:12,color:C.t1,lineHeight:1.6}}>Accept <span style={{fontWeight:700,textDecoration:'underline'}}>Termenii și condițiile</span> și <span style={{fontWeight:700,textDecoration:'underline'}}>Politica de confidențialitate</span></span>
      </label>
      {err.terms && <div style={{fontSize:11,color:C.red,fontWeight:600}}>{err.terms}</div>}
      <Btn label='Creați contul' onClick={handle} loading={loading} full size='lg' />
      <div style={{textAlign:'center',fontSize:13,color:C.t2}}>Aveți deja cont? <TLink label='Autentificați-vă →' onClick={goLogin} size={13} /></div>
    </div>
  )
}

function Forgot({ goLogin }) {
  const [email,setEmail] = useState('')
  const [sent,setSent] = useState(false)
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const handle = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) { setErr('Introduceți un email valid'); return }
    setLoading(true); await new Promise(r=>setTimeout(r,800)); setSent(true); setLoading(false)
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <TLink label='← Înapoi la autentificare' onClick={goLogin} color={C.t2} style={{marginBottom:14}} />
        <div style={{fontSize:26,fontWeight:800,color:C.t0,letterSpacing:'-0.02em'}}>Recuperare parolă</div>
        <div style={{fontSize:13,color:C.t2,marginTop:4}}>Vă trimitem un link de resetare valabil 30 de minute.</div>
      </div>
      {!sent ? <>
        <Inp label='Email' type='email' placeholder='email@firma.ro' value={email} onChange={e=>{setEmail(e.target.value);setErr('')}} error={err} onKeyDown={e=>e.key==='Enter'&&handle()} />
        <Btn label='Trimite link de resetare' onClick={handle} loading={loading} full size='lg' />
      </> : <Alert tone='green'>Email trimis la <strong>{email}</strong>. Verificați și folderul spam.</Alert>}
    </div>
  )
}

/* M1 · Intrare angajat — link + cod SMS, fără cont și parolă */
export function EmployeeEntry({ onEnter, onBack }) {
  const [code,setCode] = useState('')
  const [left,setLeft] = useState(42)
  const [loading,setLoading] = useState(false)
  useEffect(() => { if (left<=0) return; const t=setTimeout(()=>setLeft(left-1),1000); return ()=>clearTimeout(t) }, [left])
  const digits = code.padEnd(4,' ').split('')
  const go = async () => { setLoading(true); await new Promise(r=>setTimeout(r,700)); onEnter({ name:'Dan Popescu', role:'angajat', firma:'Banca Demo România' }) }
  return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'Manrope, sans-serif',display:'flex',flexDirection:'column',maxWidth:430,margin:'0 auto',padding:'22px 22px 28px',boxSizing:'border-box'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Logo size='sm' />
        <button onClick={onBack} style={{background:'none',border:'none',color:C.t2,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Ieși</button>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:18}}>
        <div>
          <div style={{fontSize:15,color:C.t2}}>Salut, Dan.</div>
          <div style={{fontSize:26,fontWeight:800,letterSpacing:'-0.02em',color:C.t0,marginTop:2}}>Confirmă că ești tu.</div>
          <p style={{margin:'12px 0 0',fontSize:14,lineHeight:1.6,color:C.t1}}><strong>Banca Demo România</strong> te-a invitat la instruirea periodică de siguranță. Ți-am trimis un cod pe telefonul care se termină în <span style={{fontFamily:C.mono,fontWeight:600,color:C.t0}}>···· 482</span>.</p>
        </div>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',gap:10}}>
            {digits.map((d,i) => (
              <div key={i} style={{flex:1,height:60,borderRadius:14,background:C.white,border:`2px solid ${code.length===i?C.primary:d.trim()?C.lineHi:C.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:800,fontFamily:C.mono,color:C.t0}}>{d.trim()}</div>
            ))}
          </div>
          <input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,4))} inputMode='numeric' autoFocus style={{position:'absolute',inset:0,opacity:0,width:'100%',height:'100%',fontSize:16}} />
        </div>
        <div style={{fontSize:13,color:C.t2}}>Nu ai primit codul? {left>0 ? <span style={{fontFamily:C.mono}}>Retrimite în 0:{String(left).padStart(2,'0')}</span> : <TLink label='Retrimite codul' onClick={()=>setLeft(42)} size={13} />}</div>
      </div>
      <Btn label='Confirmă și începe' full size='lg' disabled={code.length<4} loading={loading} onClick={go} />
      <div style={{fontSize:11,color:C.t3,textAlign:'center',marginTop:10,fontFamily:C.mono}}>Demo: orice cod de 4 cifre</div>
    </div>
  )
}

export function AuthPage({ screen, setScreen, onLogin, onRegister, onEmployee, onHome }) {
  const w = useWidth()
  const isMobile = w < 900
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'stretch',background:C.bg}}>
      {!isMobile && <div style={{width:'44%',flexShrink:0}}><Branding /></div>}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:isMobile?'28px 20px':'48px 40px',overflowY:'auto'}}>
        <div style={{width:'100%',maxWidth:420}} className='fade-in'>
          <div style={{marginBottom:28,display:'flex',justifyContent:isMobile?'center':'flex-start'}}><Logo onClick={onHome} /></div>
          {screen==='login'    && <Login onLogin={onLogin} goReg={()=>setScreen('register')} goForgot={()=>setScreen('forgot')} goEmployee={onEmployee} />}
          {screen==='register' && <Register onReg={onRegister} goLogin={()=>setScreen('login')} />}
          {screen==='forgot'   && <Forgot goLogin={()=>setScreen('login')} />}
        </div>
      </div>
    </div>
  )
}
