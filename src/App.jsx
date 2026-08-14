import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════ */
const C = {
  bg:'#F0F4F9', white:'#FFFFFF',
  line:'#E2E8F0', lineHi:'#CBD5E1',
  primary:'#1D4ED8', primaryDk:'#1E40AF', primaryBg:'rgba(29,78,216,0.08)',
  teal:'#059669', tealBg:'rgba(5,150,105,0.08)',
  amber:'#D97706', amberBg:'rgba(217,119,6,0.08)',
  red:'#DC2626', redBg:'rgba(220,38,38,0.08)',
  green:'#16A34A', greenBg:'rgba(22,163,74,0.08)',
  purple:'#7C3AED', purpleBg:'rgba(124,58,237,0.08)',
  gray:'#64748B',
  t0:'#0F172A', t1:'#1E293B', t2:'#64748B', t3:'#94A3B8',
  r:14, rs:9, rx:6,
  shadow:'0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)',
}

/* ═══════════════════════════════════════
   DATE LEGISLATIVE
═══════════════════════════════════════ */
const CUI_DB = {
  '12345678':{ nume:'Metalogic SRL', caen:'2562', desc:'Operațiuni de mecanică generală', județ:'Cluj', oras:'Cluj-Napoca', angajati:28, forma:'SRL' },
  '87654321':{ nume:'Green Office SRL', caen:'6201', desc:'Activități de realizare a soft-ului', județ:'București', oras:'București', angajati:12, forma:'SRL' },
  '11223344':{ nume:'Construct Plus SA', caen:'4120', desc:'Lucrări de construcție clădiri', județ:'Iași', oras:'Iași', angajati:87, forma:'SA' },
  '55667788':{ nume:'La Bunica Restaurant SRL', caen:'5610', desc:'Restaurante', județ:'Brașov', oras:'Brașov', angajati:8, forma:'SRL' },
  '99887766':{ nume:'Trans Express SRL', caen:'4941', desc:'Transporturi rutiere de mărfuri', județ:'Timiș', oras:'Timișoara', angajati:35, forma:'SRL' },
  '33445566':{ nume:'Clinica Sănătate SRL', caen:'8621', desc:'Activități asistență medicală generală', județ:'Constanța', oras:'Constanța', angajati:19, forma:'SRL' },
}

const getRiscCAEN = (caen) => {
  const cod = String(caen).slice(0,2)
  const ridicat = ['05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','38','41','42','43']
  const mediu   = ['45','46','47','49','50','51','52','53','55','56','68','71','72','73','74','75','77','78','79','80','81','82','84','85','86','87','88']
  if (ridicat.includes(cod)) return 'ridicat'
  if (mediu.includes(cod))   return 'mediu'
  return 'scazut'
}

const getIndustrieCAEN = (caen) => {
  const cod = String(caen).slice(0,2)
  const productie = ['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33']
  if (productie.includes(cod)) return 'productie'
  const map = { '41':'constructii','42':'constructii','43':'constructii','49':'transport','50':'transport','51':'transport','52':'transport','53':'transport','55':'horeca','56':'horeca','62':'it','63':'it','86':'sanatate','87':'sanatate','88':'sanatate' }
  return map[cod] || 'servicii'
}

const getConsiliere = (angajati, risc) => {
  const n = parseInt(angajati) || 0
  if (n <= 9 && risc === 'scazut') return {
    culoare:C.green, bgC:C.greenBg, icon:'✅',
    titlu:'Administratorul poate gestiona SSM',
    rezumat:'Conform HG 1425/2006 art.12, pentru firme cu sub 10 angajați și activități fără riscuri deosebite, administratorul poate îndeplini atribuțiile SSM personal.',
    conditii:['Activitatea nu figurează în Anexa 5 HG 1425/2006 ✓','Urmați un curs SSM de minimum 40 de ore','Fără riscuri de accidente grave sau boli profesionale'],
    actiuni:[{icon:'📚',text:'Curs SSM 40h pentru angajatori',p:'obligatoriu'},{icon:'📋',text:'Evaluarea Riscurilor pentru toate posturile',p:'obligatoriu'},{icon:'📄',text:'Plan de Prevenire și Protecție',p:'obligatoriu'}],
    economie:'Economie estimată: 3.000–6.000 lei/an față de serviciu extern',
  }
  if (n <= 9) return {
    culoare:C.amber, bgC:C.amberBg, icon:'⚠️',
    titlu:'Serviciu extern recomandat (risc mediu/ridicat)',
    rezumat:'Firma are sub 10 angajați, dar activitatea prezintă riscuri. Administratorul POATE gestiona SSM, dar serviciul extern oferă protecție juridică mai bună.',
    conditii:['Activitatea prezintă riscuri specifice industriei','Documentația elaborată de nespecialist poate fi contestată la ITM','Risc de accidente — recomandăm serviciu extern autorizat'],
    actiuni:[{icon:'🏢',text:'Contractați un SEPP (Serviciu Extern de Prevenire și Protecție)',p:'recomandat'},{icon:'📋',text:'Evaluarea Riscurilor elaborată de SEPP',p:'obligatoriu'},{icon:'📄',text:'Plan de Prevenire și Protecție',p:'obligatoriu'}],
    economie:'Cost estimat serviciu extern: 200–500 lei/lună',
  }
  if (n <= 49 && risc === 'scazut') return {
    culoare:C.green, bgC:C.greenBg, icon:'👥',
    titlu:'Administrator sau lucrător desemnat',
    rezumat:'Angajatorul poate gestiona SSM pentru 10–49 angajați cu risc scăzut, sau poate desemna un lucrător cu curs SSM.',
    conditii:['Activitatea nu figurează în Anexa 5 HG 1425/2006 ✓','Lucrătorul desemnat urmează curs SSM minim 40h','Fără riscuri de accidente grave'],
    actiuni:[{icon:'👤',text:'Desemnați lucrător responsabil SSM prin decizie scrisă',p:'obligatoriu'},{icon:'📚',text:'Curs SSM acreditat (40h minim)',p:'obligatoriu'},{icon:'📋',text:'Evaluarea Riscurilor pentru toate posturile',p:'obligatoriu'}],
    economie:'Soluție optimă: lucrător desemnat + SafeWork ≈ 1.500–3.000 lei/an',
  }
  if (n <= 49) return {
    culoare:C.amber, bgC:C.amberBg, icon:'⚡',
    titlu:'Specialist SSM sau serviciu extern necesar',
    rezumat:'Pentru 10–49 angajați cu risc mediu/ridicat este necesară implicarea unui specialist SSM.',
    conditii:['Activitatea prezintă riscuri specifice','Lucrătorul desemnat trebuie calificare SSM specifică industriei','Evaluarea Riscurilor trebuie elaborată de specialist calificat'],
    actiuni:[{icon:'🏢',text:'Contractați Serviciu Extern de Prevenire și Protecție autorizat',p:'obligatoriu'},{icon:'📋',text:'SEPP elaborează Evaluarea Riscurilor',p:'obligatoriu'},{icon:'👤',text:'Lucrător intern pentru coordonare cu SEPP',p:'recomandat'}],
    economie:'Cost estimat SEPP: 400–900 lei/lună',
  }
  if (n <= 249) return {
    culoare:C.red, bgC:C.redBg, icon:'🔴',
    titlu:'Specialist SSM desemnat — obligatoriu prin lege',
    rezumat:'Conform L.319/2006, pentru 50–249 angajați administratorul NU mai poate prelua SSM. Este obligatorie desemnarea unui responsabil SSM.',
    conditii:['⛔ Administratorul NU poate gestiona SSM personal la această dimensiune','Obligatoriu: lucrător desemnat cu calificare SSM sau SEPP autorizat','Amendă ITM 5.000–10.000 lei fără organizare formală'],
    actiuni:[{icon:'👨‍💼',text:'Angajați Responsabil SSM calificat',p:'urgent'},{icon:'🏢',text:'Alternativ: contractați SEPP autorizat ANPM',p:'urgent'},{icon:'👥',text:'Comitet SSM (obligatoriu la 50+ angajați)',p:'obligatoriu'}],
    economie:'SEPP: 800–2.000 lei/lună. Responsabil intern: 4.000–7.000 lei/lună.',
  }
  return {
    culoare:C.purple, bgC:C.purpleBg, icon:'🏛',
    titlu:'Serviciu intern de prevenire și protecție — obligatoriu',
    rezumat:'La 250+ angajați este obligatorie organizarea unui Serviciu Intern de Prevenire și Protecție cu personal specializat.',
    conditii:['Serviciu Intern cu minimum 1 specialist SSM cu studii superioare','Structură organizatorică dedicată SSM cu buget propriu','Comitet SSM obligatoriu cu reprezentanți ai angajaților'],
    actiuni:[{icon:'🏛',text:'Constituiți Serviciul Intern de Prevenire și Protecție',p:'urgent'},{icon:'👨‍💼',text:'Angajați Șef Serviciu SSM (studii superioare + atestat)',p:'urgent'}],
    economie:'SafeWork reduce costurile administrative cu ~40% față de procese manuale.',
  }
}

const TOATE_INSTRUIRILE = [
  { id:'introductiv', label:'Instructaj introductiv-general (IIG)', baza:'L.319/2006 art.83 · HG 1425/2006 art.94',  oblig:true,  excl:[] },
  { id:'loc_munca',   label:'Instructaj la locul de muncă (ILM)',   baza:'HG 1425/2006 art.98-104',                   oblig:true,  excl:[] },
  { id:'periodica',   label:'Instructaj periodic (IP)',             baza:'HG 1425/2006 art.107 · Interval: 1-6 luni', oblig:true,  excl:[] },
  { id:'suplimentar', label:'Instructaj suplimentar (IS)',          baza:'HG 1425/2006 art.108',                      oblig:false, excl:[] },
  { id:'psi',         label:'Instruire PSI (prevenire incendii)',   baza:'Legea 307/2006 · Ord. 712/2005',            oblig:true,  excl:[] },
  { id:'specifica',   label:'Instruire specifică pe post',          baza:'HG 1425/2006 art.105',                      oblig:false, excl:[] },
  { id:'prim_ajutor', label:'Prim ajutor la locul de muncă',       baza:'L.319/2006 art.11 · Ord. 427/2002',         oblig:false, excl:['birou','comert','it','financiar'] },
  { id:'iscir',       label:'Instruire ISCIR (macaragii, lifturi)', baza:'PT R1-2010 · PT R2-2010',                   oblig:false, excl:['birou','horeca','comert','sanatate','transport','it','financiar'] },
  { id:'inaltime',    label:'Lucru la înălțime',                   baza:'HG 1048/2006 · EN 363',                     oblig:false, excl:['birou','horeca','comert','sanatate','transport','it','financiar'] },
  { id:'chimic',      label:'Substanțe periculoase / chimice',      baza:'HG 1218/2006 · HG 1091/2006',               oblig:false, excl:['birou','horeca','sanatate','it','financiar'] },
  { id:'zgomot',      label:'Protecție împotriva zgomotului',       baza:'HG 493/2006',                               oblig:false, excl:['birou','horeca','comert','sanatate','it','financiar'] },
  { id:'electrica',   label:'Securitate electrică (NSSM 111)',      baza:'NSSM 111 · HG 1146/2006',                   oblig:false, excl:['horeca','comert','sanatate','it','financiar'] },
]

const ANGAJATI_DEMO = [
  { id:1, name:'Ion Popescu',      dept:'Producție',  post:'Operator CNC',  email:'ion@firma.ro',   tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Maria Ionescu',    dept:'Producție',  post:'Sudor',         email:'',               tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Dan Constantin',   dept:'Depozit',    post:'Stivuitorist',  email:'dan@firma.ro',   tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Elena Gheorghe',   dept:'Birou',      post:'Contabil',      email:'elena@firma.ro', tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Petre Dumitrescu', dept:'Mentenanță', post:'Electrician',   email:'',               tel:'0755999000', trainOk:true,  medOk:true },
]

/* ═══════════════════════════════════════
   HOOKS
═══════════════════════════════════════ */
function useWidth() {
  const [w,setW] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

/* ═══════════════════════════════════════
   ATOMS
═══════════════════════════════════════ */
function Logo({ size='md' }) {
  const s=size==='lg'?52:36, fs=size==='lg'?26:18, ts=size==='lg'?22:15
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:s,height:s,borderRadius:s*0.26,background:`linear-gradient(135deg,${C.primary},#3B82F6)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:fs,boxShadow:`0 4px 16px ${C.primary}44`,flexShrink:0}}>🛡</div>
      <div>
        <div style={{fontSize:ts,fontWeight:900,color:C.t0,letterSpacing:'-0.02em',lineHeight:1}}>Safe<span style={{color:C.primary}}>Work</span></div>
        <div style={{fontSize:ts*0.6,color:C.t2,letterSpacing:'0.08em',textTransform:'uppercase',marginTop:1}}>SSM Platform</div>
      </div>
    </div>
  )
}

function Card({ children, style={}, onClick }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>onClick&&setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:C.white,border:`1px solid ${h?C.lineHi:C.line}`,borderRadius:C.r,overflow:'hidden',boxShadow:C.shadow,cursor:onClick?'pointer':'default',transition:'border-color .15s',...style}}>
      {children}
    </div>
  )
}

function Btn({ label, onClick, color=C.primary, outline, full, disabled, loading, size='md', icon }) {
  const [h,setH] = useState(false)
  const pad = {sm:'7px 16px',md:'11px 22px',lg:'14px 30px'}[size]
  const fs  = {sm:12,md:13,lg:15}[size]
  return (
    <button disabled={disabled||loading} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:pad,background:disabled||loading?'#E2E8F0':outline?(h?color+'14':C.white):(h?C.primaryDk:color),border:`2px solid ${disabled||loading?C.line:color}`,borderRadius:C.rs,color:disabled||loading?C.t3:outline?color:'#fff',fontSize:fs,fontWeight:700,cursor:disabled||loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .15s',width:full?'100%':'auto',boxShadow:!outline&&!disabled&&!loading?`0 2px 8px ${color}44`:'none'}}>
      {loading ? <span style={{animation:'spin .7s linear infinite',display:'inline-block',fontSize:16}}>⟳</span> : <>{icon&&<span>{icon}</span>}{label}</>}
    </button>
  )
}

function Inp({ label, type='text', placeholder, value, onChange, error, icon, hint }) {
  const [show,setShow] = useState(false)
  const [foc,setFoc]   = useState(false)
  const isP = type === 'password'
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      {label && <label style={{fontSize:12,fontWeight:700,color:C.t2,letterSpacing:'0.03em'}}>{label}</label>}
      <div style={{position:'relative'}}>
        {icon && <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none',opacity:.5}}>{icon}</span>}
        <input type={isP?(show?'text':'password'):type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{width:'100%',padding:`12px ${isP?44:14}px 12px ${icon?42:14}px`,background:error?'#FEF2F2':C.white,border:`2px solid ${error?C.red:foc?C.primary:C.line}`,borderRadius:C.rs,fontSize:14,color:C.t0,outline:'none',transition:'border-color .15s',boxSizing:'border-box'}} />
        {isP && <button type='button' onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:C.t2,padding:4}}>{show?'🙈':'👁'}</button>}
      </div>
      {error && <span style={{fontSize:11,color:C.red,fontWeight:600}}>⚠ {error}</span>}
      {hint && !error && <span style={{fontSize:11,color:C.t3}}>{hint}</span>}
    </div>
  )
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16}}>
      <div>
        <div style={{fontSize:13,fontWeight:600,color:C.t0}}>{label}</div>
        {sub && <div style={{fontSize:11,color:C.t2,marginTop:2}}>{sub}</div>}
      </div>
      <div onClick={()=>onChange(!checked)} style={{width:46,height:26,borderRadius:13,background:checked?C.primary:C.line,cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
        <div style={{position:'absolute',top:3,left:checked?22:3,width:20,height:20,borderRadius:'50%',background:C.white,transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}} />
      </div>
    </div>
  )
}

function Chip({ label, color, sm }) {
  return <span style={{padding:sm?'2px 8px':'3px 10px',borderRadius:20,fontSize:sm?10:11,fontWeight:700,background:color+'18',color,whiteSpace:'nowrap'}}>{label}</span>
}

function Ava({ name, size=34 }) {
  const ini = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()
  const p = ['#1D4ED8','#7C3AED','#DC2626','#D97706','#059669','#0891B2']
  return <div style={{width:size,height:size,borderRadius:'50%',background:p[name.charCodeAt(0)%p.length],display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.34,fontWeight:800,color:'#fff',flexShrink:0}}>{ini}</div>
}

function PBar({ val, color=C.primary, h=7 }) {
  return (
    <div style={{height:h,background:C.line,borderRadius:10,overflow:'hidden'}}>
      <div style={{height:'100%',width:`${Math.min(val,100)}%`,background:color,borderRadius:10,transition:'width .4s'}} />
    </div>
  )
}

function Alert({ type='info', children }) {
  const m = {
    info:    {bg:C.primaryBg, b:C.primary+'44', c:C.primary, i:'ℹ️'},
    success: {bg:C.greenBg,   b:C.green+'44',   c:C.green,   i:'✅'},
    warning: {bg:C.amberBg,   b:C.amber+'44',   c:C.amber,   i:'⚠️'},
    error:   {bg:C.redBg,     b:C.red+'44',     c:C.red,     i:'❌'},
  }
  const s = m[type]
  return (
    <div style={{padding:'12px 14px',background:s.bg,border:`1px solid ${s.b}`,borderRadius:C.rs,display:'flex',gap:10,alignItems:'flex-start'}}>
      <span style={{fontSize:14,flexShrink:0}}>{s.i}</span>
      <span style={{fontSize:13,color:s.c,lineHeight:1.5}}>{children}</span>
    </div>
  )
}

function THead({ cols }) {
  return (
    <tr style={{background:'#F8FAFC',borderBottom:`1px solid ${C.line}`}}>
      {cols.map(c => <th key={c} style={{padding:'10px 16px',textAlign:'left',fontSize:10,color:C.t2,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{c}</th>)}
    </tr>
  )
}

function TRow({ children, onClick }) {
  const [h,setH] = useState(false)
  return (
    <tr onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{borderBottom:`1px solid ${C.line}`,background:h?'#F8FAFC':C.white,cursor:onClick?'pointer':'default',transition:'background .1s'}}>
      {children}
    </tr>
  )
}

function TD({ children, style={} }) {
  return <td style={{padding:'11px 16px',fontSize:13,color:C.t1,...style}}>{children}</td>
}

/* ═══════════════════════════════════════
   AUTH — BRANDING PANEL
═══════════════════════════════════════ */
function AuthBranding() {
  return (
    <div style={{background:`linear-gradient(160deg,#0F2D6B 0%,#1D4ED8 55%,#1E40AF 100%)`,padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden',minHeight:'100vh'}}>
      <div style={{position:'absolute',top:'-80px',left:'-80px',width:'320px',height:'320px',borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}} />
      <div style={{position:'absolute',top:'auto',right:'0',bottom:'20%',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:40}}>
          <div style={{width:52,height:52,borderRadius:14,background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>🛡</div>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.02em'}}>Safe<span style={{color:'#93C5FD'}}>Work</span></div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase'}}>SSM Platform</div>
          </div>
        </div>
        <div style={{fontSize:30,fontWeight:900,color:'#fff',lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:12}}>
          Gestionați SSM-ul<br/><span style={{color:'#93C5FD'}}>simplu și conform legii</span>
        </div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.7}}>
          Platforma care înlocuiește dosarele de hârtie și vă ține mereu în regulă cu ITM.
        </div>
      </div>

      <div style={{position:'relative',zIndex:1}}>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
          {[['📋','Instruiri SSM automate și monitorizate'],['🔔','Alerte scadențe înainte să fie problemă'],['✍️','Semnătură digitală fără hârtii'],['⚖️','Consultant SSM virtual 24/7'],['📊','Rapoarte conforme ITM la un click']].map(([icon,text]) => (
            <div key={text} style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:36,height:36,borderRadius:C.rx,background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{icon}</div>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.85)',fontWeight:500}}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{padding:16,background:'rgba(255,255,255,0.1)',borderRadius:C.rs,border:'1px solid rgba(255,255,255,0.15)'}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Folosit de firme din toată România</div>
          <div style={{display:'flex',gap:20}}>
            {[['2.400+','Firme active'],['98%','Conformitate ITM'],['0 lei','Amenzi la clienți']].map(([v,l]) => (
              <div key={l}><div style={{fontSize:20,fontWeight:900,color:'#fff'}}>{v}</div><div style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   AUTH PAGES
═══════════════════════════════════════ */
function PageLogin({ onLogin, goReg, goForgot }) {
  const [email,setEmail] = useState('')
  const [pass,setPass]   = useState('')
  const [err,setErr]     = useState({})
  const [loading,setLoading] = useState(false)
  const [apiErr,setApiErr]   = useState('')

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email obligatoriu'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalid'
    if (!pass) e.pass = 'Parolă obligatorie'
    else if (pass.length < 6) e.pass = 'Minim 6 caractere'
    return e
  }

  const handle = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErr(e); return }
    setLoading(true); setApiErr('')
    await new Promise(r => setTimeout(r, 1100))
    if (pass.length >= 6) onLogin({ email, name: email.split('@')[0], isNew: false })
    else setApiErr('Email sau parolă incorecte.')
    setLoading(false)
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:C.t0,letterSpacing:'-0.02em'}}>Bun venit înapoi</div>
        <div style={{fontSize:13,color:C.t2,marginTop:4}}>Introduceți datele de autentificare</div>
      </div>
      {apiErr && <Alert type='error'>{apiErr}</Alert>}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <Inp label='Email' type='email' placeholder='email@firma.ro' value={email} onChange={e=>{setEmail(e.target.value);setErr({...err,email:''})}} error={err.email} icon='✉️' />
        <Inp label='Parolă' type='password' placeholder='Parola dvs.' value={pass} onChange={e=>{setPass(e.target.value);setErr({...err,pass:''})}} error={err.pass} icon='🔒' />
        <div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={goForgot} style={{background:'none',border:'none',color:C.primary,fontSize:12,fontWeight:600,cursor:'pointer'}}>Am uitat parola →</button></div>
      </div>
      <Btn label='Autentificare' onClick={handle} loading={loading} full size='lg' />
      <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0'}}><div style={{flex:1,height:1,background:C.line}} /><span style={{fontSize:12,color:C.t3}}>sau</span><div style={{flex:1,height:1,background:C.line}} /></div>
      {[{icon:'🔵',l:'Continuă cu Google'},{icon:'⬛',l:'Continuă cu Microsoft'}].map(b => (
        <button key={b.l} style={{width:'100%',padding:'11px 16px',background:C.white,border:`2px solid ${C.line}`,borderRadius:C.rs,fontSize:13,fontWeight:600,color:C.t1,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <span style={{fontSize:18}}>{b.icon}</span>{b.l}
        </button>
      ))}
      <div style={{textAlign:'center',fontSize:13,color:C.t2}}>Nu aveți cont?{' '}<button onClick={goReg} style={{background:'none',border:'none',color:C.primary,fontWeight:700,cursor:'pointer',fontSize:13}}>Înregistrați firma →</button></div>
      <div style={{padding:'10px 14px',background:C.primaryBg,borderRadius:C.rx,border:`1px solid ${C.primary}33`,fontSize:11,color:C.primary}}>
        💡 <strong>Demo:</strong> orice email + parolă cu min. 6 caractere
      </div>
    </div>
  )
}

function PageRegister({ onReg, goLogin }) {
  const [f,setF]     = useState({name:'',email:'',pass:'',pass2:'',terms:false})
  const [err,setErr] = useState({})
  const [loading,setLoading] = useState(false)

  const set = (k,v) => { setF(x=>({...x,[k]:v})); setErr(e=>({...e,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!f.name.trim())  e.name  = 'Numele este obligatoriu'
    if (!f.email.trim()) e.email = 'Email obligatoriu'
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Email invalid'
    if (!f.pass)         e.pass  = 'Parolă obligatorie'
    else if (f.pass.length < 8)  e.pass  = 'Minim 8 caractere'
    if (f.pass !== f.pass2)      e.pass2 = 'Parolele nu coincid'
    if (!f.terms) e.terms = 'Acceptați termenii'
    return e
  }

  const handle = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErr(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    onReg({ email: f.email, name: f.name, isNew: true })
    setLoading(false)
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:C.t0,letterSpacing:'-0.02em'}}>Creați un cont</div>
        <div style={{fontSize:13,color:C.t2,marginTop:4}}>Înregistrați firma și configurați SSM-ul în 5 minute</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:13}}>
        <Inp label='Nume complet' placeholder='Ion Popescu' value={f.name} onChange={e=>set('name',e.target.value)} error={err.name} icon='👤' />
        <Inp label='Email de serviciu' type='email' placeholder='ion@firma.ro' value={f.email} onChange={e=>set('email',e.target.value)} error={err.email} icon='✉️' />
        <Inp label='Parolă' type='password' placeholder='Minim 8 caractere' value={f.pass} onChange={e=>set('pass',e.target.value)} error={err.pass} icon='🔒' hint='Litere, cifre și simboluri pentru o parolă sigură' />
        <Inp label='Confirmare parolă' type='password' placeholder='Repetați parola' value={f.pass2} onChange={e=>set('pass2',e.target.value)} error={err.pass2} icon='🔒' />
      </div>
      <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer'}}>
        <input type='checkbox' checked={f.terms} onChange={e=>set('terms',e.target.checked)} style={{accentColor:C.primary,width:16,height:16,marginTop:2,flexShrink:0}} />
        <span style={{fontSize:12,color:C.t1,lineHeight:1.6}}>Accept <span style={{color:C.primary,fontWeight:600}}>Termenii și condițiile</span> și <span style={{color:C.primary,fontWeight:600}}>Politica de confidențialitate</span></span>
      </label>
      {err.terms && <div style={{fontSize:11,color:C.red,fontWeight:600}}>⚠ {err.terms}</div>}
      <Btn label='Creați contul' onClick={handle} loading={loading} full size='lg' />
      <div style={{textAlign:'center',fontSize:13,color:C.t2}}>Aveți deja cont?{' '}<button onClick={goLogin} style={{background:'none',border:'none',color:C.primary,fontWeight:700,cursor:'pointer',fontSize:13}}>Autentificați-vă →</button></div>
    </div>
  )
}

function PageForgot({ goLogin }) {
  const [email,setEmail] = useState('')
  const [sent,setSent]   = useState(false)
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')

  const handle = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setErr('Introduceți un email valid'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setSent(true); setLoading(false)
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <button onClick={goLogin} style={{background:'none',border:'none',color:C.t2,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:6,marginBottom:16,padding:0,fontWeight:600}}>← Înapoi la autentificare</button>
        <div style={{fontSize:26,fontWeight:900,color:C.t0,letterSpacing:'-0.02em'}}>Recuperare parolă</div>
        <div style={{fontSize:13,color:C.t2,marginTop:4}}>Introduceți email-ul contului pentru resetare.</div>
      </div>
      {!sent ? (
        <>
          <Inp label='Email' type='email' placeholder='email@firma.ro' value={email} onChange={e=>{setEmail(e.target.value);setErr('')}} error={err} icon='✉️' />
          <Btn label='Trimite link de resetare' onClick={handle} loading={loading} full size='lg' />
        </>
      ) : (
        <Alert type='success'><strong>Email trimis!</strong> Verificați căsuța la <em>{email}</em>. Link valabil 30 minute.</Alert>
      )}
      <div style={{textAlign:'center'}}><button onClick={goLogin} style={{background:'none',border:'none',color:C.primary,fontWeight:600,cursor:'pointer',fontSize:13}}>{sent ? '← Înapoi la autentificare' : 'Mi-am amintit parola →'}</button></div>
    </div>
  )
}

/* ═══════════════════════════════════════
   WIZARD CUI
═══════════════════════════════════════ */
function WizardCUI({ onFinish }) {
  const [step,setStep]   = useState(1)
  const [cui,setCui]     = useState('')
  const [loading,setLoading] = useState(false)
  const [cuiErr,setCuiErr]   = useState('')
  const [firma,setFirma]     = useState(null)
  const [cons,setCons]       = useState(null)
  const [contact,setContact] = useState({name:'',email:'',tel:''})
  const [modules,setModules] = useState({nearMiss:false,audit:false,semnatura:true})
  const [instruiri,setInstruiri] = useState({})
  const [accepted,setAccepted]   = useState(false)

  const lookupCUI = async () => {
    const c = cui.replace(/\s|RO/gi,'')
    if (c.length < 6) { setCuiErr('CUI invalid — minim 6 cifre'); return }
    setLoading(true); setCuiErr('')
    await new Promise(r => setTimeout(r, 1100))
    const d = CUI_DB[c]
    if (d) {
      setFirma({ ...d, cui: c })
      const risc = getRiscCAEN(d.caen)
      const ind  = getIndustrieCAEN(d.caen)
      const c2   = getConsiliere(d.angajati, risc)
      setCons({ ...c2, risc, ind })
      setModules({
        nearMiss: risc === 'ridicat' || ['productie','constructii','transport'].includes(ind),
        audit:    d.angajati >= 20,
        semnatura:!['constructii','transport'].includes(ind),
      })
      const ii = {}
      TOATE_INSTRUIRILE.forEach(i => {
        const excl = i.excl.includes(ind)
        ii[i.id] = { active: !excl && (i.oblig || false), locked: i.oblig && !excl }
      })
      setInstruiri(ii)
      setStep(2)
    } else {
      setCuiErr('CUI negăsit. Verificați sau completați manual datele.')
    }
    setLoading(false)
  }

  const steps = ['CUI','Firmă','Consiliere','Module','Instruiri','Gata']

  return (
    <div style={{minHeight:'100vh',background:`linear-gradient(135deg,#EFF6FF 0%,#F0F4F9 100%)`,display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 16px'}}>
      <div style={{width:'100%',maxWidth:580}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <Logo size='lg' />
          <div style={{fontSize:12,color:C.t2,marginTop:8}}>Configurare inițială · Pasul {step} din {steps.length}</div>
        </div>
        <div style={{display:'flex',gap:4,marginBottom:24}}>
          {steps.map((_,i) => <div key={i} style={{flex:1,height:4,borderRadius:4,background:i<step?C.primary:C.line,transition:'background .3s'}} />)}
        </div>

        <Card style={{padding:28}}>
          {/* STEP 1 — CUI */}
          {step === 1 && (
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:36,marginBottom:8}}>🔍</div>
                <div style={{fontSize:20,fontWeight:900,color:C.t0,marginBottom:6}}>Introduceți CUI-ul firmei</div>
                <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Preluăm automat datele din ONRC și configurăm aplicația conform specificului firmei.</div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:C.t2,marginBottom:6,letterSpacing:'0.04em'}}>COD UNIC DE ÎNREGISTRARE</div>
                <div style={{display:'flex',gap:8}}>
                  <input value={cui} onChange={e=>{setCui(e.target.value);setCuiErr('')}} onKeyDown={e=>e.key==='Enter'&&!loading&&lookupCUI()} placeholder='ex: RO12345678' maxLength={12}
                    style={{flex:1,padding:'13px 16px',background:C.bg,border:`2px solid ${cuiErr?C.red:cui.length>5?C.primary:C.line}`,borderRadius:C.rs,fontSize:15,fontWeight:600,color:C.t0,outline:'none',transition:'border-color .2s',letterSpacing:'0.04em'}} />
                  <Btn label={loading?'':'Caută'} icon={loading?undefined:'🔎'} onClick={lookupCUI} disabled={loading||cui.length<6} loading={loading} />
                </div>
                {cuiErr && <div style={{marginTop:8,fontSize:12,color:C.red,fontWeight:600}}>⚠ {cuiErr}</div>}
              </div>
              <div style={{padding:'10px 14px',background:C.primaryBg,borderRadius:C.rx,border:`1px solid ${C.primary}33`}}>
                <div style={{fontSize:11,color:C.primary,fontWeight:700,marginBottom:6}}>💡 CUI-uri demo pentru testare</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {Object.entries(CUI_DB).map(([c,d]) => (
                    <button key={c} onClick={()=>{setCui(c);setCuiErr('')}}
                      style={{padding:'3px 10px',background:cui===c?C.primary:C.white,border:`1px solid ${C.primary}55`,borderRadius:20,fontSize:11,color:cui===c?'#fff':C.primary,cursor:'pointer',fontWeight:600}}>
                      {c} ({d.angajati})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Confirmare firmă */}
          {step === 2 && firma && (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><div style={{fontSize:20,fontWeight:900,color:C.t0,marginBottom:4}}>Confirmați datele firmei</div><div style={{fontSize:12,color:C.t2}}>Date preluate automat din ONRC</div></div>
              <div style={{padding:18,background:C.greenBg,border:`1px solid ${C.green}44`,borderRadius:C.rs}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                  <div><div style={{fontSize:18,fontWeight:900,color:C.t0}}>{firma.nume}</div><div style={{fontSize:11,color:C.t2,marginTop:2}}>CUI: RO{firma.cui} · {firma.forma}</div></div>
                  <Chip label='✓ Verificat' color={C.green} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[['🏭 CAEN',`${firma.caen} — ${firma.desc}`],['📍 Localitate',`${firma.oras}, ${firma.județ}`],['👥 Angajați',`${firma.angajati} salariați`],['⚠️ Risc',cons?.risc==='ridicat'?'Ridicat':cons?.risc==='mediu'?'Mediu':'Scăzut']].map(([l,v]) => (
                    <div key={l} style={{padding:'10px 12px',background:C.white,borderRadius:C.rx,border:`1px solid ${C.line}`}}>
                      <div style={{fontSize:10,color:C.t2,fontWeight:600,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.t0,lineHeight:1.4}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[['Persoana de contact / Manager SSM','name','Ion Popescu','👤'],['Email contact','email','ion@firma.ro','✉️'],['Telefon','tel','07xx xxx xxx','📞']].map(([l,k,ph,icon]) => (
                  <div key={k}>
                    <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>{l}</div>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none',opacity:.5}}>{icon}</span>
                      <input value={contact[k]} onChange={e=>setContact({...contact,[k]:e.target.value})} placeholder={ph}
                        style={{width:'100%',padding:'10px 14px 10px 42px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Consiliere SSM */}
          {step === 3 && cons && (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><div style={{fontSize:20,fontWeight:900,color:C.t0,marginBottom:4}}>Analiza SSM pentru firma dvs.</div><div style={{fontSize:12,color:C.t2}}>Pe baza numărului de angajați și a activității CAEN</div></div>
              <div style={{padding:20,background:cons.bgC,border:`2px solid ${cons.culoare}44`,borderRadius:C.rs}}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:14}}>
                  <div style={{width:48,height:48,borderRadius:12,background:cons.culoare+'22',border:`2px solid ${cons.culoare}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{cons.icon}</div>
                  <div><div style={{fontSize:15,fontWeight:800,color:C.t0,marginBottom:4}}>{cons.titlu}</div><div style={{fontSize:13,color:C.t1,lineHeight:1.6}}>{cons.rezumat}</div></div>
                </div>
                {cons.economie && <div style={{padding:'8px 12px',background:'rgba(255,255,255,0.7)',borderRadius:C.rx,fontSize:12,color:C.teal,fontWeight:700}}>💰 {cons.economie}</div>}
              </div>
              <Card style={{padding:18}}>
                <div style={{fontSize:11,fontWeight:700,color:C.t2,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:10}}>Plan de acțiune</div>
                {cons.actiuni.map((a,i) => {
                  const pc = a.p==='urgent'?C.red:a.p==='obligatoriu'?C.amber:C.teal
                  return (
                    <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'9px 0',borderTop:i>0?`1px solid ${C.line}`:'none'}}>
                      <div style={{width:30,height:30,borderRadius:C.rx,background:pc+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{a.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:C.t0,marginBottom:2}}>{a.text}</div>
                        <Chip label={a.p==='urgent'?'🔴 Urgent':a.p==='obligatoriu'?'🟡 Obligatoriu':'🟢 Recomandat'} color={pc} sm />
                      </div>
                    </div>
                  )
                })}
              </Card>
              <div style={{padding:'12px 14px',background:C.redBg,borderRadius:C.rs,border:`1px solid ${C.red}33`,fontSize:12,color:C.t1,lineHeight:1.6}}>
                ⚖️ <strong style={{color:C.red}}>Sancțiuni ITM:</strong> Neinstruire: 3.000–6.000 lei · Lipsă Evaluare Riscuri: 4.000–8.000 lei · Fără organizare SSM: 5.000–10.000 lei
              </div>
            </div>
          )}

          {/* STEP 4 — Module */}
          {step === 4 && (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><div style={{fontSize:20,fontWeight:900,color:C.t0,marginBottom:4}}>Module active</div><div style={{fontSize:12,color:C.t2}}>Configurate automat. Puteți ajusta oricând din Setări.</div></div>
              <Alert type='info'>Modulele dezactivate nu apar în navigare și nu ocupă spațiu.</Alert>
              <Card style={{padding:20}}>
                {[
                  {key:null,label:'📋 Instruiri SSM',sub:'Obligatoriu — toate tipurile conform L.319/2006',on:true,locked:true},
                  {key:null,label:'🩺 Medicină muncii',sub:'Obligatoriu — evidența avizelor și scadențe',on:true,locked:true},
                  {key:null,label:'📁 Documente & Emitere',sub:'Obligatoriu — fișe, procese verbale, adeverințe',on:true,locked:true},
                  {key:'semnatura',label:'✍️ Semnătură digitală',sub:cons?.ind==='constructii'||cons?.ind==='transport'?'⚠ Dezactivat — mulți angajați fără email. Activați dacă posibil.':'Canvas, SMS sau upload foto'},
                  {key:'nearMiss',label:'⚠️ Near Miss / Incidente',sub:cons?.risc==='scazut'?'Dezactivat pentru risc scăzut — activați dacă doriți.':'Recomandat pentru industria/riscul dvs.'},
                  {key:'audit',label:'🔍 Audit intern SSM',sub:(firma?.angajati||0)<20?'Dezactivat pentru firme mici — activați dacă aveți inspector dedicat.':'Recomandat pentru dimensiunea firmei'},
                ].map((m,i) => (
                  <div key={i} style={{padding:'13px 0',borderTop:i>0?`1px solid ${C.line}`:'none',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:m.locked?C.t2:C.t0}}>{m.label}</div>
                      <div style={{fontSize:11,color:C.t2,marginTop:2,lineHeight:1.4}}>{m.sub}</div>
                    </div>
                    {m.locked
                      ? <Chip label='Activ' color={C.green} />
                      : <div onClick={()=>setModules({...modules,[m.key]:!modules[m.key]})}
                          style={{width:46,height:26,borderRadius:13,background:modules[m.key]?C.primary:C.line,cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
                          <div style={{position:'absolute',top:3,left:modules[m.key]?22:3,width:20,height:20,borderRadius:'50%',background:C.white,transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}} />
                        </div>
                    }
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* STEP 5 — Instruiri */}
          {step === 5 && (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><div style={{fontSize:20,fontWeight:900,color:C.t0,marginBottom:4}}>Tipuri de instruire</div><div style={{fontSize:12,color:C.t2}}>Obligatoriile sunt activate automat.</div></div>
              <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:380,overflowY:'auto',paddingRight:4}}>
                {TOATE_INSTRUIRILE.map(i => {
                  const excl = i.excl.includes(cons?.ind || '')
                  const st   = instruiri[i.id] || {active:false,locked:false}
                  if (excl) return null
                  return (
                    <div key={i.id} style={{padding:'12px 14px',background:st.active?C.primaryBg:C.bg,borderRadius:C.rs,border:`1px solid ${st.active?C.primary+'44':C.line}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:2,flexWrap:'wrap'}}>
                            <span style={{fontSize:13,fontWeight:600,color:C.t0}}>{i.label}</span>
                            {i.oblig && <Chip label='Obligatoriu' color={C.red} sm />}
                          </div>
                          <div style={{fontSize:10,color:C.t2}}>📋 {i.baza}</div>
                        </div>
                        <div onClick={()=>{if(!st.locked)setInstruiri({...instruiri,[i.id]:{...st,active:!st.active}})}}
                          style={{width:40,height:22,borderRadius:11,background:st.active?C.primary:C.line,cursor:st.locked?'not-allowed':'pointer',position:'relative',transition:'background .2s',flexShrink:0,marginTop:2,opacity:st.locked?.6:1}}>
                          <div style={{position:'absolute',top:2,left:st.active?20:2,width:18,height:18,borderRadius:'50%',background:C.white,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 6 — Done */}
          {step === 6 && (
            <div style={{textAlign:'center',padding:'10px 0'}}>
              <div style={{fontSize:52,marginBottom:12}}>🎉</div>
              <div style={{fontSize:22,fontWeight:900,color:C.t0,marginBottom:6}}>Totul este configurat!</div>
              <div style={{fontSize:13,color:C.t2,marginBottom:20,lineHeight:1.7}}><strong>{firma?.nume}</strong> este înregistrată în SafeWork SSM.<br />Consultantul SSM virtual este activ.</div>
              <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:20,maxWidth:320,margin:'0 auto 20px'}}>
                {[['✅','Instruiri SSM obligatorii'],['🩺','Medicină muncii'],['📁','Documente & Emitere'],...(modules.semnatura?[['✍️','Semnătură digitală']]:[]),(modules.nearMiss?[['⚠️','Near Miss']]:[]),(modules.audit?[['🔍','Audit intern']]:[]),((['📊','Consilier SSM virtual']))].flat(1).reduce((acc,item,idx,arr)=>{if(idx%2===0)acc.push([item,arr[idx+1]]);return acc;},[]).map(([icon,text]) => (
                  <div key={text} style={{display:'flex',gap:10,alignItems:'center',padding:'8px 14px',background:C.greenBg,borderRadius:C.rs,border:`1px solid ${C.green}33`}}>
                    <span>{icon}</span><span style={{fontSize:12,color:C.teal,fontWeight:700}}>{text}</span>
                  </div>
                ))}
              </div>
              <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',textAlign:'left',marginBottom:16}}>
                <input type='checkbox' checked={accepted} onChange={e=>setAccepted(e.target.checked)} style={{accentColor:C.primary,width:16,height:16,marginTop:2,flexShrink:0}} />
                <span style={{fontSize:12,color:C.t1,lineHeight:1.6}}>Am înțeles că SafeWork SSM este un instrument de suport și nu înlocuiește un consultant SSM autorizat. Responsabilitatea legală rămâne la angajator conform L.319/2006.</span>
              </label>
              <Btn label='🚀 Deschide aplicația' color={C.primary} full size='lg' disabled={!accepted} onClick={()=>onFinish({firma,modules,instruiri,cons})} />
            </div>
          )}

          {/* Nav buttons */}
          {step < 6 && (
            <div style={{display:'flex',justifyContent:'space-between',marginTop:24,gap:10}}>
              <Btn label='← Înapoi' color={C.gray} outline onClick={()=>setStep(step-1)} disabled={step===1} />
              <Btn label={step===5?'Finalizare →':'Continuă →'} color={C.primary}
                disabled={(step===1&&cui.length<6)||(step===2&&!firma)}
                onClick={()=>step===1?lookupCUI():setStep(step+1)} />
            </div>
          )}
        </Card>

        <div style={{marginTop:16,textAlign:'center',fontSize:10,color:C.t3}}>
          Bazat pe L.319/2006 · HG 1425/2006 · Legea 307/2006 · SafeWork nu înlocuiește un SEPP autorizat
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   SEMNĂTURĂ MODAL
═══════════════════════════════════════ */
function ModalSemnatura({ angajat, onSave, onClose }) {
  const [method,setMethod] = useState('canvas')
  const canvasRef = useRef(null)
  const [drawing,setDrawing] = useState(false)
  const [hasSig,setHasSig]   = useState(false)

  const getPos = (e, cv) => {
    const r = cv.getBoundingClientRect()
    if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const startDraw = (e) => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const p = getPos(e, cv)
    ctx.beginPath(); ctx.moveTo(p.x, p.y)
    setDrawing(true); setHasSig(true); e.preventDefault()
  }

  const draw = (e) => {
    if (!drawing) return
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const p = getPos(e, cv)
    ctx.lineTo(p.x, p.y); ctx.strokeStyle = C.t0; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke()
    e.preventDefault()
  }

  const clear = () => {
    const cv = canvasRef.current; if (!cv) return
    cv.getContext('2d').clearRect(0, 0, cv.width, cv.height)
    setHasSig(false)
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:500,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:15,fontWeight:700,color:C.t0}}>✍️ Semnătură digitală</div><div style={{fontSize:11,color:C.t2,marginTop:2}}>{angajat}</div></div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{display:'flex',background:'#F8FAFC',borderBottom:`1px solid ${C.line}`}}>
          {[['canvas','✏️ Desenează'],['sms','📱 SMS/Cod'],['upload','📷 Upload'],['calificata','🔐 Calificată']].map(([id,l]) => (
            <button key={id} onClick={()=>setMethod(id)} style={{flex:1,padding:'10px 0',background:'none',border:'none',borderBottom:`2px solid ${method===id?C.primary:'transparent'}`,color:method===id?C.primary:C.t2,fontSize:12,fontWeight:method===id?700:400,cursor:'pointer'}}>{l}</button>
          ))}
        </div>
        <div style={{padding:20}}>
          {method === 'canvas' && (
            <>
              <div style={{fontSize:11,color:C.t2,marginBottom:8}}>Semnați în câmpul de mai jos:</div>
              <canvas ref={canvasRef} width={460} height={150}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={()=>setDrawing(false)} onMouseLeave={()=>setDrawing(false)}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={()=>setDrawing(false)}
                style={{width:'100%',height:150,border:`2px dashed ${C.line}`,borderRadius:C.rs,background:'#FAFBFC',cursor:'crosshair',touchAction:'none',display:'block'}} />
              <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                <button onClick={clear} style={{background:'none',border:'none',color:C.t2,fontSize:12,cursor:'pointer',textDecoration:'underline'}}>🗑 Șterge</button>
                <div style={{fontSize:10,color:C.t3}}>IP: 89.33.12.44 · {new Date().toLocaleString('ro')}</div>
              </div>
            </>
          )}
          {method === 'sms' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <Alert type='info'>Un cod de 6 cifre va fi trimis pe telefonul angajatului pentru confirmare.</Alert>
              <Inp label='Telefon angajat' placeholder='07xx xxx xxx' icon='📱' value='' onChange={()=>{}} />
              <Btn label='📤 Trimite cod SMS' color={C.primary} full />
              <Inp label='Cod primit' placeholder='_ _ _ _ _ _' hint='Introduceți codul primit pe telefon' value='' onChange={()=>{}} />
            </div>
          )}
          {method === 'upload' && (
            <div style={{border:`2px dashed ${C.line}`,borderRadius:C.rs,padding:'32px 20px',textAlign:'center',background:'#FAFBFC'}}>
              <div style={{fontSize:28,marginBottom:8}}>📷</div>
              <div style={{fontSize:13,color:C.t1,marginBottom:4}}>Fotografiați sau încărcați semnătura</div>
              <div style={{fontSize:11,color:C.t2,marginBottom:12}}>JPG, PNG · max 2MB</div>
              <input type='file' accept='image/*' onChange={()=>setHasSig(true)} />
            </div>
          )}
          {method === 'calificata' && (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <Alert type='info'>Semnătură electronică <strong>avansată/calificată</strong> conform legislației aplicabile — prin integrarea cu serviciul de semnătură al beneficiarului.</Alert>
              <div style={{padding:'14px 16px',background:C.bg,borderRadius:C.rs,border:`1px solid ${C.line}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.t0,marginBottom:8}}>🔐 Furnizor semnătură calificată</div>
                <select style={{width:'100%',padding:'9px 12px',background:C.white,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t1,outline:'none'}}>
                  <option>Namirial (integrare beneficiar)</option>
                  <option>certSIGN</option>
                  <option>DigiSign</option>
                  <option>Trans Sped</option>
                </select>
                <div style={{fontSize:11,color:C.t2,marginTop:8,lineHeight:1.5}}>
                  Documentul va fi trimis în fluxul de semnare al furnizorului selectat. Semnatarul primește email cu link securizat de semnare.
                </div>
              </div>
              <Btn label='📤 Trimite în fluxul Namirial' color={C.purple} full onClick={()=>setHasSig(true)} />
              <div style={{padding:'10px 12px',background:C.amberBg,borderRadius:C.rx,fontSize:11,color:C.amber,lineHeight:1.5}}>
                💰 <strong>Costuri:</strong> semnătura calificată se tarifează per document / per utilizator / per semnătură sau per volum, conform contractului cu furnizorul. Costurile sunt evidențiate separat în ofertă. Semnarea automatizată disponibilă — costuri asociate menționate separat.
              </div>
            </div>
          )}
        </div>
        <div style={{padding:'14px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',gap:10}}>
          <Btn label='Anulează' color={C.gray} outline onClick={onClose} />
          <Btn label='✓ Confirmă semnătura' color={C.primary} disabled={method==='canvas'&&!hasSig} onClick={()=>{onSave();onClose()}} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   APP MODULES
═══════════════════════════════════════ */
function ModDashboard({ firma, modules, instruiriCfg }) {
  const actives = TOATE_INSTRUIRILE.filter(i => (instruiriCfg[i.id]||{}).active)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{padding:'18px 22px',background:`linear-gradient(135deg,${C.primaryBg},${C.tealBg})`,border:`1px solid ${C.primary}33`,borderRadius:C.r}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:10}}>
          <div>
            <div style={{fontSize:17,fontWeight:900,color:C.t0,marginBottom:3}}>Bună ziua, Manager SSM 👋</div>
            <div style={{fontSize:12,color:C.t1}}>{firma?.nume} · {new Date().toLocaleDateString('ro-RO',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
            <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
              <Chip label='⚠ 3 scadențe apropiate' color={C.amber} />
              <Chip label='✓ 94% conformitate' color={C.teal} />
            </div>
          </div>
          <select style={{padding:'7px 14px',background:C.white,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:12,color:C.t1,outline:'none'}}>
            {['Aprilie 2024','Martie 2024','Q1 2024','An 2024'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {[{icon:'👥',v:'28',l:'Angajați activi',c:C.primary},{icon:'📋',v:'3',l:'Instruiri scadente',c:C.amber},{icon:'🩺',v:'1',l:'Med. expirată',c:C.red},{icon:'✅',v:'94%',l:'Conformitate',c:C.teal}].map((k,i) => (
          <Card key={i} style={{padding:18,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:k.c}} />
            <div style={{fontSize:20,marginBottom:8}}>{k.icon}</div>
            <div style={{fontSize:24,fontWeight:900,color:k.c,lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:11,color:C.t2,marginTop:4}}>{k.l}</div>
          </Card>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,fontSize:13,fontWeight:700,color:C.t0}}>📚 Status instruiri</div>
          <div style={{padding:16,display:'flex',flexDirection:'column',gap:11}}>
            {actives.slice(0,5).map((i,idx) => {
              const d = 23 + idx * 2; const t = 28
              const p = Math.round(d/t*100)
              const col = p===100?C.teal:p>=80?C.primary:C.amber
              return (
                <div key={idx}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:12,color:C.t1}}>{i.label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:col}}>{d}/{t}</span>
                  </div>
                  <PBar val={p} color={col} />
                </div>
              )
            })}
          </div>
        </Card>
        <Card>
          <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,fontSize:13,fontWeight:700,color:C.t0}}>⚠ Necesită atenție</div>
          <div style={{padding:16,display:'flex',flexDirection:'column',gap:8}}>
            {['Ion Popescu — instruire periodică scadentă (16 Apr)','Elena Gheorghe — control medical expirat','Dan Constantin — EIP expirat'].map((m,i) => (
              <div key={i} style={{padding:'10px 12px',background:C.amberBg,borderRadius:C.rx,fontSize:12,color:C.t1,borderLeft:`3px solid ${C.amber}`}}>• {m}</div>
            ))}
          </div>
        </Card>
      </div>

      {modules.nearMiss && (
        <Card style={{padding:'14px 18px',background:C.redBg,border:`1px solid ${C.red}33`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:6}}>⚑ Near Miss recente</div>
          {['Lichid vărsat — Hală 2 (12 Apr) · Investigare','Raft instabil — Depozit (09 Apr) · Acțiune corectivă'].map((m,i) => (
            <div key={i} style={{fontSize:12,color:C.t1,padding:'4px 0',borderTop:i>0?`1px solid ${C.red}22`:'none'}}>• {m}</div>
          ))}
        </Card>
      )}
    </div>
  )
}

function ModDocumente({ modules }) {
  const [docs,setDocs] = useState([
    {id:1,nr:'DOC-2024-088',tip:'Fișă instruire periodică',angajat:'Ionescu Maria',data:'14 Apr 2024',status:'Semnat'},
    {id:2,nr:'DOC-2024-087',tip:'Fișă instruire periodică',angajat:'Popescu Dan',data:'13 Apr 2024',status:'Nesemnat'},
    {id:3,nr:'DOC-2024-086',tip:'Fișă medicină muncii',angajat:'Constantin Alina',data:'12 Apr 2024',status:'Nesemnat'},
    {id:4,nr:'DOC-2024-085',tip:'Fișă instruire introductivă',angajat:'Gheorghe Victor',data:'10 Apr 2024',status:'Semnat'},
    {id:5,nr:'DOC-2024-084',tip:'Fișă instruire loc muncă',angajat:'Dumitrescu Ion',data:'09 Apr 2024',status:'Semnat'},
  ])
  const [sigModal,setSigModal] = useState(null)
  const [filter,setFilter]     = useState('toate')
  const filtered = docs.filter(d => filter==='toate' || d.status.toLowerCase()===filter)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Documente</h2>
          <div style={{fontSize:12,color:C.t2,marginTop:2}}>{docs.filter(d=>d.status==='Nesemnat').length} documente în așteptare</div>
        </div>
        <Btn label='+ Document nou' color={C.primary} />
      </div>
      <div style={{display:'flex',gap:4,background:C.line,borderRadius:C.rs,padding:3,width:'fit-content'}}>
        {[['toate','Toate'],['nesemnat','Nesemnate'],['semnat','Semnate']].map(([id,l]) => (
          <button key={id} onClick={()=>setFilter(id)} style={{padding:'6px 16px',borderRadius:C.rx,border:'none',background:filter===id?C.white:'transparent',color:filter===id?C.t0:C.t2,fontSize:12,fontWeight:filter===id?700:400,cursor:'pointer'}}>
            {l}
          </button>
        ))}
      </div>
      <Card>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><THead cols={['Număr','Tip document','Angajat','Data','Status','']} /></thead>
          <tbody>
            {filtered.map(d => (
              <TRow key={d.id}>
                <TD style={{fontFamily:'monospace',fontSize:11,color:C.t2}}>{d.nr}</TD>
                <TD style={{fontWeight:600,color:C.t0}}>{d.tip}</TD>
                <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={d.angajat} size={26}/><span>{d.angajat}</span></div></TD>
                <TD style={{color:C.t2,fontSize:12}}>{d.data}</TD>
                <TD><Chip label={d.status} color={d.status==='Semnat'?C.teal:C.amber} /></TD>
                <TD>
                  <div style={{display:'flex',gap:8}}>
                    {d.status==='Nesemnat' && modules.semnatura && <Btn label='✍️ Semnează' color={C.primary} sm onClick={()=>setSigModal(d.angajat)} />}
                    {d.status==='Nesemnat' && !modules.semnatura && <Btn label='✓ Marchează' color={C.teal} sm onClick={()=>setDocs(docs.map(x=>x.id===d.id?{...x,status:'Semnat'}:x))} />}
                    <Btn label='PDF' color={C.gray} outline sm />
                  </div>
                </TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Card>
      {sigModal && <ModalSemnatura angajat={sigModal} onSave={()=>setDocs(docs.map(d=>d.angajat===sigModal&&d.status==='Nesemnat'?{...d,status:'Semnat'}:d))} onClose={()=>setSigModal(null)} />}
    </div>
  )
}

function ModInstruiri({ instruiriCfg, modules }) {
  const [sel,setSel]       = useState(null)
  const [sigModal,setSigModal] = useState(null)
  const [semnate,setSemnate]   = useState({})
  const active = TOATE_INSTRUIRILE.filter(i => (instruiriCfg[i.id]||{}).active)

  if (sel !== null) {
    const instr = active[sel]
    return (
      <div>
        {sigModal && <ModalSemnatura angajat={sigModal} onSave={()=>setSemnate({...semnate,[`${sel}_${sigModal}`]:true})} onClose={()=>setSigModal(null)} />}
        <button onClick={()=>setSel(null)} style={{background:'none',border:'none',color:C.primary,fontSize:13,cursor:'pointer',marginBottom:16,display:'flex',alignItems:'center',gap:6,fontWeight:600}}>← Înapoi</button>
        <div style={{marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>{instr.label}</h2>
          <div style={{fontSize:12,color:C.t2,marginTop:3}}>📋 {instr.baza}</div>
        </div>
        {ANGAJATI_DEMO.map((a,i) => {
          const key = `${sel}_${a.name}`; const ok = semnate[key]
          return (
            <Card key={i} style={{marginBottom:8}}>
              <div style={{padding:'13px 18px',display:'flex',alignItems:'center',gap:12}}>
                <Ava name={a.name} size={36} />
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.t0}}>{a.name}</div>
                  <div style={{fontSize:11,color:C.t2}}>{a.post} · {a.dept}</div>
                  {!a.email && <div style={{fontSize:10,color:C.amber,marginTop:2}}>⚠ Fără email — recomandăm SMS sau canvas</div>}
                </div>
                {ok
                  ? <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      <Chip label='✓ Semnat' color={C.teal} />
                      <button style={{background:'none',border:'none',color:C.primary,fontSize:11,cursor:'pointer',textDecoration:'underline'}}>PDF</button>
                    </div>
                  : modules.semnatura
                    ? <Btn label='✍️ Semnează' color={C.primary} sm onClick={()=>setSigModal(a.name)} />
                    : <Btn label='✓ Marchează' color={C.teal} sm onClick={()=>setSemnate({...semnate,[key]:true})} />
                }
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Instruiri SSM</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>{active.length} tipuri active</div></div>
      </div>
      {['Obligatorii','Specifice'].map(group => {
        const list = active.filter(i => group==='Obligatorii'?i.oblig:!i.oblig)
        if (!list.length) return null
        return (
          <div key={group}>
            <div style={{fontSize:11,fontWeight:700,color:C.t2,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:10}}>{group} conform legislației</div>
            {list.map((i,idx) => {
              const d = 23+idx; const t = 28; const p = Math.round(d/t*100)
              const col = p===100?C.teal:p>=80?C.primary:p>=60?C.amber:C.red
              const pending = ANGAJATI_DEMO.filter((_,ai) => !semnate[`${active.indexOf(i)}_${ANGAJATI_DEMO[ai].name}`]).length
              return (
                <Card key={idx} onClick={()=>setSel(active.indexOf(i))} style={{padding:18,cursor:'pointer',marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{flex:1,paddingRight:12}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.t0,marginBottom:4}}>{i.label}</div>
                      <div style={{fontSize:10,color:C.t2}}>📋 {i.baza}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:22,fontWeight:900,color:col,lineHeight:1}}>{p}%</div>
                      <div style={{fontSize:10,color:C.t2}}>{d}/{t}</div>
                    </div>
                  </div>
                  <PBar val={p} color={col} h={7} />
                  {pending > 0 && <div style={{marginTop:8,fontSize:11,color:C.amber,fontWeight:600}}>⚠ {pending} angajați nesemnați →</div>}
                </Card>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function ModMedicina() {
  const data = [
    {id:1,name:'Ion Popescu',dept:'Producție',tip:'Periodică',ef:'10 Ian 2024',exp:'10 Ian 2025',apt:true},
    {id:2,name:'Maria Ionescu',dept:'Producție',tip:'Periodică',ef:'15 Feb 2024',exp:'15 Feb 2025',apt:true},
    {id:3,name:'Dan Constantin',dept:'Depozit',tip:'Angajare',ef:'01 Mar 2023',exp:'01 Mar 2024',apt:false},
    {id:4,name:'Elena Gheorghe',dept:'Birou',tip:'Periodică',ef:'20 Mar 2024',exp:'20 Mar 2025',apt:true},
    {id:5,name:'Petre Dumitrescu',dept:'Mentenanță',tip:'Periodică',ef:'05 Apr 2024',exp:'05 Apr 2025',apt:true},
  ]
  const [filter,setFilter] = useState('toti')
  const filtered = filter==='toti'?data:filter==='apt'?data.filter(m=>m.apt):data.filter(m=>!m.apt)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Medicină muncii</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Evidența avizelor medicale</div></div>
        <Btn label='+ Înregistrare' color={C.primary} />
      </div>
      {data.filter(m=>!m.apt).length>0 && <Alert type='error'>{data.filter(m=>!m.apt).length} angajat(ți) cu aviz medical expirat — acces restricționat recomandat</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[['Total',data.length,C.t0],['Apți',data.filter(m=>m.apt).length,C.teal],['Expirați',data.filter(m=>!m.apt).length,C.red]].map(([l,v,c]) => (
          <Card key={l} style={{padding:'14px 16px',textAlign:'center'}}><div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:11,color:C.t2,marginTop:3}}>{l}</div></Card>
        ))}
      </div>
      <div style={{display:'flex',gap:4,background:C.line,borderRadius:C.rs,padding:3,width:'fit-content'}}>
        {[['toti','Toți'],['apt','Apți'],['inapt','Expirați']].map(([id,l]) => (
          <button key={id} onClick={()=>setFilter(id)} style={{padding:'6px 16px',borderRadius:C.rx,border:'none',background:filter===id?C.white:'transparent',color:filter===id?C.t0:C.t2,fontSize:12,fontWeight:filter===id?700:400,cursor:'pointer'}}>{l}</button>
        ))}
      </div>
      <Card>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><THead cols={['Angajat','Dept.','Tip','Data ef.','Valabil până','Aviz','']} /></thead>
          <tbody>
            {filtered.map(m => (
              <TRow key={m.id}>
                <TD><div style={{display:'flex',gap:8,alignItems:'center'}}><Ava name={m.name} size={26}/><span style={{fontWeight:600,color:C.t0}}>{m.name}</span></div></TD>
                <TD style={{color:C.t2}}>{m.dept}</TD>
                <TD>{m.tip}</TD>
                <TD style={{color:C.t2,fontSize:12}}>{m.ef}</TD>
                <TD style={{color:m.apt?C.t2:C.red,fontWeight:m.apt?400:700}}>{m.exp}</TD>
                <TD><Chip label={m.apt?'✓ Apt':'✗ Expirat'} color={m.apt?C.teal:C.red} /></TD>
                <TD><Btn label='Editează' color={C.primary} outline sm /></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function ModEmitere() {
  const [tip,setTip]         = useState(null)
  const [angajat,setAngajat] = useState('')
  const [done,setDone]       = useState(false)
  const tipuri = [
    {id:'fisa-intro',label:'Fișă instruire introductiv-generală',icon:'📘',color:C.primary},
    {id:'fisa-loc',label:'Fișă instruire la locul de muncă',icon:'🏭',color:C.teal},
    {id:'fisa-per',label:'Fișă instruire periodică',icon:'🔄',color:C.amber},
    {id:'fisa-med',label:'Fișă medicină muncii',icon:'🩺',color:C.red},
    {id:'adeverinta',label:'Adeverință SSM',icon:'📄',color:C.primary},
    {id:'pv',label:'Proces verbal instruire',icon:'📝',color:C.teal},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Emitere documente</h2>
        <div style={{fontSize:12,color:C.t2,marginTop:2}}>Fișele de instruire sunt generate automat conform modelului din <strong>Anexa nr. 11 din HG nr. 1425/2006</strong> și modelelor aplicabile domeniului SSM-SU</div>
      </div>
      <Card style={{padding:20}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:14}}>1. Selectați tipul documentului</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {tipuri.map(t => (
            <div key={t.id} onClick={()=>{setTip(t.id);setDone(false)}}
              style={{padding:'13px 14px',borderRadius:C.rs,cursor:'pointer',border:`2px solid ${tip===t.id?t.color:C.line}`,background:tip===t.id?t.color+'0D':C.white,display:'flex',gap:8,alignItems:'flex-start',transition:'all .15s'}}>
              <span style={{fontSize:20}}>{t.icon}</span>
              <span style={{fontSize:12,fontWeight:600,color:tip===t.id?t.color:C.t1,lineHeight:1.4}}>{t.label}</span>
            </div>
          ))}
        </div>
      </Card>
      {tip && (
        <Card style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:14}}>2. Selectați angajatul și data</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:5,fontWeight:600}}>Angajat</div>
              <select value={angajat} onChange={e=>setAngajat(e.target.value)} style={{width:'100%',padding:'9px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t1,outline:'none'}}>
                <option value=''>Selectează...</option>
                {ANGAJATI_DEMO.map(a => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:5,fontWeight:600}}>Instructor SSM</div>
              <input defaultValue='Mihai Gheorghescu' style={{width:'100%',padding:'9px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
            </div>
            <div>
              <div style={{fontSize:11,color:C.t2,marginBottom:5,fontWeight:600}}>Data emiterii</div>
              <input type='date' defaultValue='2024-04-14' style={{width:'100%',padding:'9px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
            </div>
          </div>
        </Card>
      )}
      {tip && angajat && (
        <Card style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:14}}>3. Generați documentul</div>
          {done ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <Alert type='success'>Document generat cu succes pentru <strong>{angajat}</strong>!</Alert>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <Btn label='📄 Descarcă PDF' color={C.primary} />
                <Btn label='✍️ Trimite spre semnare' color={C.teal} />
                <Btn label='🔄 Document nou' color={C.gray} outline onClick={()=>{setTip(null);setAngajat('');setDone(false)}} />
              </div>
            </div>
          ) : (
            <div style={{display:'flex',gap:10}}>
              <Btn label='⚡ Generează' color={C.primary} onClick={()=>setDone(true)} />
              <Btn label='👁 Previzualizare' color={C.gray} outline />
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function ModNearMiss() {
  const [show,setShow] = useState(false)
  const [step,setStep] = useState(1)
  const [form,setForm] = useState({loc:'',desc:'',sev:'Mediu',anon:false})
  const nm = [
    {id:'NM-031',date:'12 Apr',loc:'Hală 2',desc:'Lichid vărsat pe culoarul de evacuare',sev:'Mediu',status:'Investigare'},
    {id:'NM-030',date:'09 Apr',loc:'Depozit',desc:'Raft instabil — risc de cădere materiale',sev:'Ridicat',status:'Acțiune'},
    {id:'NM-029',date:'03 Apr',loc:'Birou tehnic',desc:'Cablu electric neprotejat',sev:'Scăzut',status:'Rezolvat'},
  ]
  const sc = s => ({Ridicat:C.red,Mediu:C.amber,Scăzut:C.teal,Critic:C.purple}[s]||C.gray)
  const ss = s => ({Investigare:C.amber,Acțiune:C.red,Rezolvat:C.teal}[s]||C.gray)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Near Miss & Incidente</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Raportare și investigare</div></div>
        <Btn label='⚠ Raportează' color={C.red} onClick={()=>{setShow(true);setStep(1)}} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[['3','Luna aceasta',C.t0],['1','Investigare',C.amber],['1','Rezolvate',C.teal]].map(([v,l,c]) => (
          <Card key={l} style={{padding:'14px',textAlign:'center'}}><div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:11,color:C.t2,marginTop:3}}>{l}</div></Card>
        ))}
      </div>
      <Card>
        {nm.map((n,i) => (
          <div key={i} style={{padding:'14px 18px',borderBottom:i<nm.length-1?`1px solid ${C.line}`:'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:10,fontFamily:'monospace',color:C.t2}}>{n.id}</span>
                <Chip label={n.sev} color={sc(n.sev)} />
              </div>
              <span style={{fontSize:11,color:C.t2}}>{n.date}</span>
            </div>
            <div style={{fontSize:13,color:C.t0,marginBottom:5}}>{n.desc}</div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:11,color:C.t2}}>📍 {n.loc}</span>
              <Chip label={n.status} color={ss(n.status)} />
            </div>
          </div>
        ))}
      </Card>
      {show && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:440,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div style={{padding:'15px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between'}}>
              <div style={{fontSize:14,fontWeight:700,color:C.t0}}>⚠️ Raportare Near Miss · {step}/3</div>
              <button onClick={()=>setShow(false)} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'flex',gap:3,padding:'10px 20px 0'}}>
              {[1,2,3].map(s => <div key={s} style={{flex:1,height:3,borderRadius:4,background:s<=step?C.primary:C.line}} />)}
            </div>
            <div style={{padding:20}}>
              {step===1 && (
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <Inp label='Locație *' placeholder='ex: Hală 2, Depozit...' value={form.loc} onChange={e=>setForm({...form,loc:e.target.value})} icon='📍' />
                  <Inp label='Descriere *' placeholder='Ce s-a întâmplat?' value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} icon='📝' />
                  <label style={{display:'flex',gap:10,alignItems:'center',cursor:'pointer'}}>
                    <input type='checkbox' checked={form.anon} onChange={e=>setForm({...form,anon:e.target.checked})} style={{accentColor:C.primary,width:16,height:16}} />
                    <span style={{fontSize:13,color:C.t1}}>Raportare anonimă</span>
                  </label>
                </div>
              )}
              {step===2 && (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {['Scăzut','Mediu','Ridicat','Critic'].map(s => (
                    <div key={s} onClick={()=>setForm({...form,sev:s})}
                      style={{padding:'12px 14px',borderRadius:C.rs,cursor:'pointer',border:`2px solid ${form.sev===s?sc(s):C.line}`,background:form.sev===s?sc(s)+'0D':C.bg,display:'flex',gap:10,alignItems:'center'}}>
                      <div style={{width:10,height:10,borderRadius:'50%',background:sc(s),flexShrink:0}} />
                      <span style={{fontSize:13,fontWeight:600,color:C.t0}}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {step===3 && (
                <div style={{padding:14,background:C.greenBg,borderRadius:C.rs,border:`1px solid ${C.green}44`}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.teal,marginBottom:8}}>✓ Confirmare</div>
                  {[['Locație',form.loc||'—'],['Severitate',form.sev],['Raportare',form.anon?'Anonimă':'Cu identitate']].map(([k,v]) => (
                    <div key={k} style={{display:'flex',gap:12,marginBottom:6}}><span style={{fontSize:12,color:C.t2,minWidth:80}}>{k}</span><span style={{fontSize:12,color:C.t0,fontWeight:600}}>{v}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div style={{padding:'13px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',gap:10}}>
              <Btn label={step>1?'← Înapoi':'Anulează'} color={C.gray} outline onClick={()=>step>1?setStep(step-1):setShow(false)} />
              <Btn label={step===3?'✓ Trimite':'Continuă →'} color={C.primary} onClick={()=>step<3?setStep(step+1):setShow(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModSetari({ modules, setModules, instrCfg, setInstrCfg, ind, firma, onLogout }) {
  const [tab,setTab] = useState('module')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,maxWidth:600}}>
      <h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>⚙️ Setări</h2>
      <div style={{display:'flex',gap:4,background:C.line,borderRadius:C.rs,padding:3,width:'fit-content'}}>
        {[['module','Module'],['instruiri','Instruiri'],['notificari','Notificări'],['utilizatori','Utilizatori'],['firma','Firma'],['cont','Cont']].map(([id,l]) => (
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 18px',borderRadius:C.rx,border:'none',background:tab===id?C.white:'transparent',color:tab===id?C.t0:C.t2,fontSize:12,fontWeight:tab===id?700:400,cursor:'pointer'}}>{l}</button>
        ))}
      </div>
      {tab==='module' && (
        <Card style={{padding:20}}>
          <Alert type='info'>Modulele dezactivate dispar complet din navigare.</Alert>
          <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:16}}>
            {[{key:'semnatura',label:'✍️ Semnătură digitală',sub:'Canvas, SMS sau upload foto'},{key:'nearMiss',label:'⚠️ Near Miss / Incidente',sub:'Raportare evenimente periculoase'},{key:'audit',label:'🔍 Audit intern SSM',sub:'Chestionare conformitate și rapoarte'}].map((m,i) => (
              <div key={m.key}>{i>0&&<div style={{height:1,background:C.line,marginBottom:16}} />}<Toggle checked={modules[m.key]} onChange={v=>setModules({...modules,[m.key]:v})} label={m.label} sub={m.sub} /></div>
            ))}
          </div>
        </Card>
      )}
      {tab==='instruiri' && (
        <Card style={{padding:20}}>
          <div style={{fontSize:12,color:C.t2,marginBottom:12}}>Instruirile obligatorii nu pot fi dezactivate.</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {TOATE_INSTRUIRILE.map(i => {
              const excl = i.excl.includes(ind||''); if (excl) return null
              const st = instrCfg[i.id]||{active:false,locked:false}
              return (
                <div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:C.bg,borderRadius:C.rx}}>
                  <div style={{flex:1,paddingRight:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.t0}}>{i.label}</div>
                    {i.oblig && <Chip label='Obligatoriu' color={C.red} sm />}
                  </div>
                  <div onClick={()=>{if(!st.locked)setInstrCfg({...instrCfg,[i.id]:{...st,active:!st.active}})}}
                    style={{width:40,height:22,borderRadius:11,background:st.active?C.primary:C.line,cursor:st.locked?'not-allowed':'pointer',position:'relative',transition:'background .2s',flexShrink:0,opacity:st.locked?.6:1}}>
                    <div style={{position:'absolute',top:2,left:st.active?20:2,width:18,height:18,borderRadius:'50%',background:C.white,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
      {tab==='notificari' && (
        <Card style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:4}}>🔔 Sistem automat de notificări</div>
          <div style={{fontSize:12,color:C.t2,marginBottom:16}}>Notificări automate pentru termenele legale de instruire — 3-4 notificări per scadență</div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
            {[['30 zile înainte','Prima notificare — planificare',true],['14 zile înainte','A doua notificare — reamintire',true],['7 zile înainte','A treia notificare — urgentare',true],['1 zi înainte / la scadență','A patra notificare — alertă finală',true]].map(([prag,desc,on],i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:C.bg,borderRadius:C.rs,border:`1px solid ${C.line}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.t0}}>⏰ {prag}</div>
                  <div style={{fontSize:11,color:C.t2,marginTop:2}}>{desc}</div>
                </div>
                <Chip label='Activ' color={C.teal} />
              </div>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:700,color:C.t0,marginBottom:10}}>Canale de notificare</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <Toggle checked={true} onChange={()=>{}} label='✉️ Email' sub='Către angajat + manager SSM' />
            <div style={{height:1,background:C.line}} />
            <Toggle checked={true} onChange={()=>{}} label='🔔 Notificare în aplicație' sub='Vizibilă în dashboard' />
            <div style={{height:1,background:C.line}} />
            <Toggle checked={false} onChange={()=>{}} label='📱 SMS' sub='Pentru angajați fără email (cost suplimentar)' />
          </div>
        </Card>
      )}
      {tab==='utilizatori' && (
        <Card style={{padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.t0}}>👥 Utilizatori & Roluri</div>
              <div style={{fontSize:11,color:C.t2,marginTop:2}}>Acces complet administrator: configurare utilizatori, definire roluri, modificare conținut</div>
            </div>
            <Btn label='+ Utilizator' color={C.primary} sm />
          </div>
          {[['Mihai Gheorghescu','manager@firma.ro','Administrator',C.red],['Andrei Pop','andrei@firma.ro','Manager SSM',C.primary],['Vasile Mureșan','vasile@firma.ro','Manager SSM',C.primary],['Ion Popescu','ion@firma.ro','Angajat',C.gray]].map(([nume,email,rol,cul]) => (
            <div key={email} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:`1px solid ${C.line}`}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <Ava name={nume} size={30} />
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:C.t0}}>{nume}</div>
                  <div style={{fontSize:11,color:C.t2}}>{email}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <Chip label={rol} color={cul} sm />
                <Btn label='✏️' color={C.gray} outline sm />
              </div>
            </div>
          ))}
          <div style={{marginTop:14,padding:'10px 12px',background:C.primaryBg,borderRadius:C.rx,fontSize:11,color:C.primary,lineHeight:1.5}}>
            <strong>Roluri disponibile:</strong> Administrator (acces complet — utilizatori, roluri, conținut, rapoarte, structură organizatorică) · Manager SSM (instruiri, documente, rapoarte) · Angajat (vizualizare și semnare documente proprii)
          </div>
        </Card>
      )}
      {tab==='firma' && (
        <Card style={{padding:20}}>
          {[['Numele firmei',firma?.nume||''],['CUI','RO'+(firma?.cui||'')],['Localitate',firma?.oras||''],['Număr angajați',String(firma?.angajati||'')],['Manager SSM','Mihai Gheorghescu']].map(([l,v]) => (
            <div key={l} style={{marginBottom:14}}>
              <div style={{fontSize:11,color:C.t2,marginBottom:5,fontWeight:600}}>{l}</div>
              <input defaultValue={v} style={{width:'100%',padding:'9px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
            </div>
          ))}
          <Btn label='💾 Salvează' color={C.primary} />
        </Card>
      )}
      {tab==='cont' && (
        <Card style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:16}}>Contul dvs.</div>
          {[['Email','manager@firma.ro'],['Rol','Manager SSM'],['Plan','Professional']].map(([l,v]) => (
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${C.line}`}}>
              <span style={{fontSize:13,color:C.t2}}>{l}</span>
              <span style={{fontSize:13,fontWeight:600,color:C.t0}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:16}}><Btn label='🔴 Deconectare' color={C.red} outline onClick={onLogout} /></div>
        </Card>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   MODUL: MATERIALE & TESTE (cerința 5)
═══════════════════════════════════════ */
function ModMateriale() {
  const [tab,setTab] = useState('materiale')
  const materiale = [
    {id:1,titlu:'IIG — Prezentare generală SSM',tip:'Prezentare',format:'PPTX',durata:'45 min',sursa:'Furnizor',ver:'v2.1'},
    {id:2,titlu:'ILM — Riscuri specifice producție',tip:'Video',format:'MP4',durata:'22 min',sursa:'Furnizor',ver:'v1.4'},
    {id:3,titlu:'IP — Recapitulare semestrială',tip:'Document',format:'PDF',durata:'30 min',sursa:'Beneficiar',ver:'v3.0'},
    {id:4,titlu:'IS — Instructaj după incident',tip:'Prezentare',format:'PPTX',durata:'20 min',sursa:'Furnizor',ver:'v1.0'},
    {id:5,titlu:'SU — Evacuare și stingătoare',tip:'Video',format:'MP4',durata:'18 min',sursa:'Furnizor',ver:'v2.0'},
  ]
  const teste = [
    {id:1,titlu:'Test evaluare la angajare (IIG)',intrebari:20,prag:'80%',tip:'La angajare',activ:true},
    {id:2,titlu:'Test periodic SSM — general',intrebari:15,prag:'70%',tip:'Periodic',activ:true},
    {id:3,titlu:'Test periodic SU — incendiu',intrebari:10,prag:'70%',tip:'Periodic',activ:true},
    {id:4,titlu:'Test post-incident (IS)',intrebari:12,prag:'75%',tip:'Suplimentar',activ:false},
  ]
  const tipIcon = t => ({Video:'🎬',Prezentare:'📊',Document:'📄'}[t]||'📁')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Materiale & Teste</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Conținut de instruire SSM-SU · încărcat de furnizor, actualizabil de beneficiar</div></div>
        <Btn label='+ Încarcă material' color={C.primary} />
      </div>
      <div style={{display:'flex',gap:4,background:C.line,borderRadius:C.rs,padding:3,width:'fit-content'}}>
        {[['materiale','📚 Materiale'],['teste','✅ Teste evaluare']].map(([id,l]) => (
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 18px',borderRadius:C.rx,border:'none',background:tab===id?C.white:'transparent',color:tab===id?C.t0:C.t2,fontSize:12,fontWeight:tab===id?700:400,cursor:'pointer'}}>{l}</button>
        ))}
      </div>
      {tab==='materiale' && (
        <Card>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><THead cols={['Material','Tip','Format','Durată','Sursă','Versiune','']} /></thead>
            <tbody>
              {materiale.map(m => (
                <TRow key={m.id}>
                  <TD style={{fontWeight:600,color:C.t0}}>{tipIcon(m.tip)} {m.titlu}</TD>
                  <TD>{m.tip}</TD>
                  <TD><Chip label={m.format} color={C.primary} sm /></TD>
                  <TD style={{color:C.t2}}>{m.durata}</TD>
                  <TD><Chip label={m.sursa} color={m.sursa==='Furnizor'?C.purple:C.teal} sm /></TD>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.t2}}>{m.ver}</TD>
                  <TD><div style={{display:'flex',gap:6}}><Btn label='▶ Vizualizează' color={C.primary} outline sm /><Btn label='✏️ Actualizează' color={C.gray} outline sm /></div></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab==='teste' && (
        <Card>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><THead cols={['Test','Întrebări','Prag promovare','Tip','Status','']} /></thead>
            <tbody>
              {teste.map(t => (
                <TRow key={t.id}>
                  <TD style={{fontWeight:600,color:C.t0}}>{t.titlu}</TD>
                  <TD style={{color:C.t2}}>{t.intrebari} întrebări</TD>
                  <TD><Chip label={t.prag} color={C.amber} sm /></TD>
                  <TD>{t.tip}</TD>
                  <TD><Chip label={t.activ?'Activ':'Inactiv'} color={t.activ?C.teal:C.gray} sm /></TD>
                  <TD><div style={{display:'flex',gap:6}}><Btn label='✏️ Editează' color={C.primary} outline sm /><Btn label='📊 Rezultate' color={C.teal} sm /></div></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   MODUL: RAPOARTE (cerința 3)
═══════════════════════════════════════ */
function ModRapoarte() {
  const [generat,setGenerat] = useState(null)
  const rapoarte = [
    {id:1,icon:'👥',titlu:'Status instruiri angajați',desc:'Angajați instruiți / neinstruiți per tip de instructaj (IIG, ILM, IP, IS)'},
    {id:2,icon:'⏰',titlu:'Termene scadente',desc:'Instruiri și examene medicale scadente în următoarele 30/60/90 zile'},
    {id:3,icon:'✅',titlu:'Rezultate testare',desc:'Scoruri teste de evaluare per angajat, promovați / nepromovați'},
    {id:4,icon:'📋',titlu:'Raport conformitate ITM',desc:'Sinteză completă pentru control ITM: fișe semnate, valabilitate, trasabilitate'},
    {id:5,icon:'🔥',titlu:'Raport conformitate ISU',desc:'Sinteză SU: instruiri PSI, exerciții evacuare, procese verbale'},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Rapoarte personalizate</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Exportabile Excel / PDF · utilizabile în cadrul controalelor ITM / ISU</div></div>
      {rapoarte.map(r => (
        <Card key={r.id} style={{padding:'16px 20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div style={{width:44,height:44,borderRadius:C.rs,background:C.primaryBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontSize:14,fontWeight:700,color:C.t0}}>{r.titlu}</div>
              <div style={{fontSize:12,color:C.t2,marginTop:2}}>{r.desc}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn label='📗 Excel' color={C.teal} sm onClick={()=>setGenerat(r.id+'-xlsx')} />
              <Btn label='📕 PDF' color={C.red} sm onClick={()=>setGenerat(r.id+'-pdf')} />
            </div>
          </div>
          {generat && generat.startsWith(String(r.id)+'-') && (
            <div style={{marginTop:12}}><Alert type='success'>Raport generat ({generat.endsWith('xlsx')?'Excel':'PDF'}) — descărcarea începe automat. Documentul include antet firmă, dată generare și semnătură electronică de validare.</Alert></div>
          )}
        </Card>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════
   MODUL: ARHIVĂ & TRASABILITATE (cerințele 9, 10)
═══════════════════════════════════════ */
function ModArhiva() {
  const [tab,setTab] = useState('arhiva')
  const arhiva = [
    {id:1,nr:'ARH-2024-0341',doc:'Fișă IIG — Popescu Ion',data:'14 Apr 2024',hash:'a3f8…e921',dim:'184 KB'},
    {id:2,nr:'ARH-2024-0340',doc:'Fișă IP — Ionescu Maria',data:'13 Apr 2024',hash:'bb12…7c44',dim:'176 KB'},
    {id:3,nr:'ARH-2024-0339',doc:'PV instruire colectivă PSI',data:'11 Apr 2024',hash:'09ce…f130',dim:'312 KB'},
    {id:4,nr:'ARH-2024-0338',doc:'Fișă medicină muncii — Constantin D.',data:'10 Apr 2024',hash:'77aa…3d02',dim:'158 KB'},
  ]
  const jurnal = [
    {t:'14 Apr 2024 · 14:32',cine:'Manager SSM (manager@firma.ro)',ce:'A generat fișa IIG pentru Popescu Ion',ip:'89.33.12.44'},
    {t:'14 Apr 2024 · 14:35',cine:'Popescu Ion (angajat)',ce:'A semnat electronic fișa IIG (canvas)',ip:'89.33.12.44'},
    {t:'14 Apr 2024 · 14:35',cine:'Sistem',ce:'Fișă arhivată automat · hash SHA-256 generat',ip:'—'},
    {t:'13 Apr 2024 · 09:12',cine:'Manager SSM',ce:'A actualizat materialul "IP — Recapitulare" la v3.0',ip:'89.33.12.44'},
    {t:'12 Apr 2024 · 16:44',cine:'Sistem',ce:'Notificare automată trimisă: 3 instruiri scadente în 14 zile',ip:'—'},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Arhivă & Trasabilitate</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Arhivare electronică securizată · acces și export în orice moment</div></div>
        <Btn label='📦 Exportă toată arhiva' color={C.primary} />
      </div>
      <div style={{display:'flex',gap:4,background:C.line,borderRadius:C.rs,padding:3,width:'fit-content'}}>
        {[['arhiva','🗄 Documente arhivate'],['jurnal','🔍 Jurnal trasabilitate']].map(([id,l]) => (
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 18px',borderRadius:C.rx,border:'none',background:tab===id?C.white:'transparent',color:tab===id?C.t0:C.t2,fontSize:12,fontWeight:tab===id?700:400,cursor:'pointer'}}>{l}</button>
        ))}
      </div>
      {tab==='arhiva' && (
        <Card>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><THead cols={['Nr. arhivă','Document','Data arhivării','Hash integritate','Dimensiune','']} /></thead>
            <tbody>
              {arhiva.map(a => (
                <TRow key={a.id}>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.t2}}>{a.nr}</TD>
                  <TD style={{fontWeight:600,color:C.t0}}>{a.doc}</TD>
                  <TD style={{color:C.t2,fontSize:12}}>{a.data}</TD>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.purple}}>🔒 {a.hash}</TD>
                  <TD style={{color:C.t2,fontSize:12}}>{a.dim}</TD>
                  <TD><div style={{display:'flex',gap:6}}><Btn label='👁' color={C.primary} outline sm /><Btn label='⬇ Export' color={C.teal} sm /></div></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab==='jurnal' && (
        <Card style={{padding:'6px 0'}}>
          {jurnal.map((j,i) => (
            <div key={i} style={{padding:'12px 20px',borderBottom:i<jurnal.length-1?`1px solid ${C.line}`:'none',display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:j.cine==='Sistem'?C.gray:C.primary,marginTop:5,flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.t0}}><strong>{j.cine}</strong> — {j.ce}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>{j.t} · IP: {j.ip}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   MODUL: STRUCTURĂ ORGANIZATORICĂ (cerința 11)
═══════════════════════════════════════ */
function ModStructura() {
  const [sucursale,setSucursale] = useState([
    {id:1,nume:'Sediu central',oras:'Cluj-Napoca',angajati:16,resp:'Mihai Gheorghescu',conf:96},
    {id:2,nume:'Punct de lucru — Hală producție',oras:'Cluj-Napoca',angajati:9,resp:'Andrei Pop',conf:91},
    {id:3,nume:'Punct de lucru — Depozit',oras:'Turda',angajati:3,resp:'Vasile Mureșan',conf:88},
  ])
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Structură organizatorică</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Gestionare pe sucursale și puncte de lucru</div></div>
        <Btn label='+ Punct de lucru' color={C.primary} />
      </div>
      {sucursale.map(s => (
        <Card key={s.id} style={{padding:'16px 20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
            <div style={{display:'flex',gap:12,alignItems:'center',flex:1,minWidth:220}}>
              <div style={{width:42,height:42,borderRadius:C.rs,background:C.primaryBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{s.id===1?'🏢':'📍'}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.t0}}>{s.nume}</div>
                <div style={{fontSize:11,color:C.t2,marginTop:2}}>📍 {s.oras} · 👥 {s.angajati} angajați · Responsabil: {s.resp}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:16,fontWeight:900,color:s.conf>=95?C.teal:s.conf>=90?C.primary:C.amber}}>{s.conf}%</div>
                <div style={{fontSize:9,color:C.t2}}>conformitate</div>
              </div>
              <Btn label='Gestionează' color={C.primary} outline sm />
            </div>
          </div>
        </Card>
      ))}
      <Alert type='info'>Fiecare punct de lucru are propriile evidențe de instruire, medicină muncii și rapoarte, agregate la nivel de firmă.</Alert>
    </div>
  )
}

/* ═══════════════════════════════════════
   HELPDESK MODAL (cerința 2)
═══════════════════════════════════════ */
function HelpdeskModal({ onClose }) {
  const [sent,setSent] = useState(false)
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:420,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:15,fontWeight:700,color:C.t0}}>🎧 Suport tehnic (Helpdesk)</div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{padding:20,display:'flex',flexDirection:'column',gap:12}}>
          {!sent ? (
            <>
              <Alert type='info'>Suport <strong>permanent</strong> pentru incidente tehnice, erori de sistem sau dificultăți de utilizare.</Alert>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[['📞','Telefon','021 XXX XXXX','Program: L-V 8-20'],['✉️','Email','suport@safework.ro','Răspuns < 4h'],['💬','Chat live','Deschide chat','Timp mediu: 2 min'],['📖','Bază de cunoștințe','help.safework.ro','Ghiduri și tutoriale']].map(([icon,titlu,val,sub]) => (
                  <div key={titlu} style={{padding:'12px',background:C.bg,borderRadius:C.rs,border:`1px solid ${C.line}`,textAlign:'center'}}>
                    <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                    <div style={{fontSize:11,fontWeight:700,color:C.t0}}>{titlu}</div>
                    <div style={{fontSize:11,color:C.primary,fontWeight:600,marginTop:2}}>{val}</div>
                    <div style={{fontSize:9,color:C.t3,marginTop:2}}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:12,fontWeight:700,color:C.t0,marginTop:4}}>Sau deschideți un tichet:</div>
              <select style={{padding:'9px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t1,outline:'none'}}>
                <option>Incident tehnic</option><option>Eroare de sistem</option><option>Dificultate de utilizare</option><option>Solicitare funcționalitate</option>
              </select>
              <textarea placeholder='Descrieți problema...' rows={3} style={{padding:'10px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',resize:'vertical'}} />
              <Btn label='📤 Trimite tichetul' color={C.primary} full onClick={()=>setSent(true)} />
            </>
          ) : (
            <Alert type='success'><strong>Tichet înregistrat!</strong> Nr. #SW-2024-0817. Veți primi răspuns pe email în maximum 4 ore lucrătoare.</Alert>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   APP SHELL (post-login)
═══════════════════════════════════════ */
function AppShell({ user, appCfg, onLogout }) {
  const [tab,setTab]         = useState('dashboard')
  const [modules,setModules] = useState(appCfg?.modules || {nearMiss:false,audit:false,semnatura:true})
  const [instrCfg,setInstrCfg] = useState(appCfg?.instruiri || {})
  const firma = appCfg?.firma || null
  const ind   = appCfg?.cons?.ind || 'productie'
  const width = useWidth()
  const isMobile = width < 768

  const TABS = [
    {id:'dashboard',label:'Dashboard',icon:'📊'},
    {id:'documente',label:'Documente',icon:'📁'},
    {id:'instruiri',label:'Instruiri',icon:'📚'},
    {id:'materiale',label:'Materiale & Teste',icon:'🎬'},
    {id:'medicina',label:'Med. muncii',icon:'🩺'},
    {id:'emitere',label:'Emitere',icon:'📄'},
    {id:'rapoarte',label:'Rapoarte',icon:'📈'},
    {id:'arhiva',label:'Arhivă',icon:'🗄'},
    {id:'structura',label:'Structură',icon:'🏢'},
    ...(modules.nearMiss?[{id:'nearmiss',label:'Near Miss',icon:'⚠️'}]:[]),
    ...(modules.audit?[{id:'audit',label:'Audit',icon:'🔍'}]:[]),
    {id:'setari',label:'Setări',icon:'⚙️'},
  ]
  const [helpdesk,setHelpdesk] = useState(false)

  const renderTab = () => {
    switch(tab) {
      case 'dashboard': return <ModDashboard firma={firma} modules={modules} instruiriCfg={instrCfg} />
      case 'documente': return <ModDocumente modules={modules} />
      case 'instruiri': return <ModInstruiri instruiriCfg={instrCfg} modules={modules} />
      case 'materiale': return <ModMateriale />
      case 'medicina':  return <ModMedicina />
      case 'emitere':   return <ModEmitere />
      case 'rapoarte':  return <ModRapoarte />
      case 'arhiva':    return <ModArhiva />
      case 'structura': return <ModStructura />
      case 'nearmiss':  return <ModNearMiss />
      case 'setari':    return <ModSetari modules={modules} setModules={setModules} instrCfg={instrCfg} setInstrCfg={setInstrCfg} ind={ind} firma={firma} onLogout={onLogout} />
      default: return (
        <div style={{padding:'60px 20px',textAlign:'center',color:C.t2}}>
          <div style={{fontSize:36,marginBottom:12}}>{TABS.find(t=>t.id===tab)?.icon}</div>
          <div style={{fontSize:15,fontWeight:700,color:C.t0,marginBottom:6}}>{TABS.find(t=>t.id===tab)?.label}</div>
          <div style={{fontSize:13}}>Modul în construcție</div>
        </div>
      )
    }
  }

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:C.bg,overflow:'hidden'}}>
      {/* Top bar */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.line}`,height:54,padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:C.shadow}}>
        <Logo />
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={()=>setHelpdesk(true)} title='Suport tehnic permanent'
            style={{padding:'7px 14px',background:C.tealBg,border:`1.5px solid ${C.teal}44`,borderRadius:C.rs,color:C.teal,fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            🎧 {!isMobile && 'Suport'}
          </button>
          {!isMobile && (
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:12,fontWeight:700,color:C.t0}}>{user?.name || 'Manager SSM'}</div>
              <div style={{fontSize:10,color:C.primary}}>{firma?.nume || 'Firma dvs.'}</div>
            </div>
          )}
          <Ava name={user?.name || 'Manager SSM'} size={32} />
        </div>
      </div>
      {helpdesk && <HelpdeskModal onClose={()=>setHelpdesk(false)} />}

      {/* Tab bar */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.line}`,display:'flex',overflowX:'auto',flexShrink:0}}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:isMobile?'10px 12px':'12px 20px',display:'flex',alignItems:'center',gap:6,background:'none',border:'none',borderBottom:`3px solid ${tab===t.id?C.primary:'transparent'}`,color:tab===t.id?C.primary:C.t2,fontSize:isMobile?11:12,fontWeight:tab===t.id?700:500,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'color .15s'}}>
            <span>{t.icon}</span>{!isMobile && t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:'auto',padding:isMobile?'14px 12px':'22px 28px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>{renderTab()}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function App() {
  const [screen,setScreen] = useState('login') // login | register | forgot | wizard | app
  const [user,setUser]     = useState(null)
  const [appCfg,setAppCfg] = useState(null)
  const width = useWidth()
  const isMobile = width < 900

  const handleLogin    = (u) => { setUser(u); setScreen(appCfg ? 'app' : 'wizard') }
  const handleRegister = (u) => { setUser(u); setScreen('wizard') }
  const handleWizard   = (cfg) => { setAppCfg(cfg); setScreen('app') }
  const handleLogout   = ()  => { setUser(null); setAppCfg(null); setScreen('login') }

  if (screen === 'wizard') return <WizardCUI onFinish={handleWizard} />
  if (screen === 'app')    return <AppShell user={user} appCfg={appCfg} onLogout={handleLogout} />

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'stretch',background:C.bg}}>
      {!isMobile && (
        <div style={{width:'44%',flexShrink:0}}>
          <AuthBranding />
        </div>
      )}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:isMobile?'28px 20px':'48px 40px',overflowY:'auto'}}>
        <div style={{width:'100%',maxWidth:420}} className='fade-in'>
          {isMobile && <div style={{marginBottom:28,display:'flex',justifyContent:'center'}}><Logo /></div>}
          {screen === 'login'    && <PageLogin    onLogin={handleLogin}    goReg={()=>setScreen('register')} goForgot={()=>setScreen('forgot')} />}
          {screen === 'register' && <PageRegister onReg={handleRegister}  goLogin={()=>setScreen('login')} />}
          {screen === 'forgot'   && <PageForgot   goLogin={()=>setScreen('login')} />}
        </div>
      </div>
    </div>
  )
}
