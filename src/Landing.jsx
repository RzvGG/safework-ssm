import { useState } from 'react'
import { C } from './data.js'
import { Icon, Logo, Btn, Pill, PBar, useWidth } from './ui.jsx'

const FAQ = [
  ['Este legală fișa de instruire electronică?','Da. HG 259/2022 permite explicit întocmirea și semnarea electronică a fișelor de instruire SSM, cu semnătură electronică avansată și arhivare care garantează integritatea documentului.'],
  ['Ce amenzi riscă o firmă fără instruiri SSM la zi?','Neinstruirea personalului se sancționează cu 3.000–6.000 lei, lipsa evaluării de riscuri cu 4.000–8.000 lei, iar lipsa organizării SSM cu 5.000–10.000 lei, conform L.319/2006.'],
  ['Am sub 10 angajați — am nevoie de SSM?','Da, obligațiile SSM se aplică de la primul angajat. Sub 10 angajați, angajatorul poate prelua el însuși atribuțiile — SafeWork îl ghidează pas cu pas, fără specialist dedicat.'],
  ['SafeWork înlocuiește serviciul extern de prevenire și protecție?','Nu. SafeWork este un instrument de suport și evidență; responsabilitatea legală rămâne la angajator, iar pentru situațiile care cer un SEPP autorizat vă recomandăm colaborarea cu unul.'],
]

const gl = act => 'https://www.google.com/search?q='+encodeURIComponent('"'+act+'" site:legislatie.just.ro')
const LEGI = [
  ['Legea 319/2006 — text oficial',gl('Legea 319/2006')],
  ['HG 1425/2006 — text oficial',gl('HG 1425/2006')],
  ['HG 259/2022 — fișa digitală',gl('HG 259/2022')],
]

function Sec({ id, children, style={}, bg }) {
  return <section id={id} style={{padding:'64px 24px',background:bg||'transparent',...style}}><div style={{maxWidth:1080,margin:'0 auto'}}>{children}</div></section>
}
function H2({ children, sub }) {
  return <div style={{marginBottom:28}}><h2 style={{margin:0,fontSize:28,fontWeight:800,letterSpacing:'-0.02em',color:C.t0,lineHeight:1.2}}>{children}</h2>{sub&&<p style={{margin:'8px 0 0',fontSize:15,color:C.t2,lineHeight:1.6,maxWidth:640}}>{sub}</p>}</div>
}

/* mock-up produs pentru hero (dovada că e o aplicație, nu un slogan) */
function HeroMock({ compact }) {
  return (
    <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.line}`,boxShadow:'0 18px 40px rgba(22,25,28,0.12)',overflow:'hidden'}}>
      <div style={{padding:'12px 16px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3}}>Panou · Banca Demo România</span>
        <Pill label='94% conformitate' tone='green' sm />
      </div>
      <div style={{padding:16,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[['28','Angajați'],['3','Scadențe'],['26','Fișe semnate']].map(([v,l]) => (
          <div key={l} style={{background:C.bg,borderRadius:12,padding:'12px 12px'}}><div style={{fontSize:22,fontWeight:800,color:C.t0,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:C.t2,marginTop:4}}>{l}</div></div>
        ))}
      </div>
      <div style={{padding:'0 16px 16px',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,padding:'10px 12px',background:'oklch(0.98 0.01 25)',borderRadius:12}}>
          <span style={{fontSize:12,color:C.t0}}><strong>Andreea M.</strong> — instruire scadentă 16 aug</span>
          <span style={{fontSize:11,fontWeight:700,color:'#fff',background:C.primary,padding:'6px 10px',borderRadius:8,whiteSpace:'nowrap'}}>Trimite reminder</span>
        </div>
        {!compact && <div style={{display:'flex',gap:8,alignItems:'center',fontSize:12,color:C.t2,padding:'0 4px'}}><span style={{width:8,height:8,borderRadius:99,background:C.green}}/>Fișă IP semnată de Ionescu Maria · acum 4 min</div>}
      </div>
    </div>
  )
}

export function Landing({ onLogin, onStart }) {
  const w = useWidth()
  const mobile = w < 760
  const [open,setOpen] = useState(0)

  /* ── W2 · Landing mobil — H1 identic, CTA lipicios jos, FAQ pe primul ecran derulat ── */
  if (mobile) return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'Manrope, sans-serif',paddingBottom:90}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',background:C.bg,position:'sticky',top:0,zIndex:10,borderBottom:`1px solid ${C.line}`}}>
        <Logo size='sm' />
        <button onClick={onLogin} style={{background:'none',border:'none',fontSize:13,fontWeight:700,color:C.t0,cursor:'pointer',fontFamily:'inherit'}}>Autentificare</button>
      </header>
      <main style={{padding:'26px 18px 0'}}>
        <span style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,fontWeight:600}}>Conform HG 259/2022</span>
        <h1 style={{margin:'8px 0 10px',fontSize:30,fontWeight:800,letterSpacing:'-0.02em',lineHeight:1.12,color:C.t0}}>Aplicație SSM pentru firme din România</h1>
        <p style={{margin:0,fontSize:15,lineHeight:1.6,color:C.t1}}>Instruiri semnate pe telefon, fișe generate automat, dosar pregătit pentru controlul ITM.</p>
        <div style={{marginTop:18}}><Btn label='Începe gratuit — 5 minute' full size='lg' onClick={onStart} /></div>
        <div style={{fontSize:12,color:C.t3,marginTop:8,textAlign:'center'}}>Fără card bancar · date preluate din ONRC</div>
        <div style={{display:'flex',gap:22,marginTop:24,padding:'16px 0',borderTop:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}`}}>
          {[['2.400+','firme active'],['98%','controale fără sancțiuni']].map(([v,l]) => <div key={l}><div style={{fontSize:22,fontWeight:800,color:C.t0}}>{v}</div><div style={{fontSize:12,color:C.t2}}>{l}</div></div>)}
        </div>
        <div style={{marginTop:22}}><HeroMock compact /></div>
        <div style={{marginTop:28}}>
          {FAQ.map(([q,a],i) => (
            <div key={q} style={{borderTop:`1px solid ${C.line}`}}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'15px 0',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:700,color:C.t0,cursor:'pointer',fontFamily:'inherit',minHeight:48}}>
                {q}<span style={{color:C.t2,fontSize:20,lineHeight:1,flexShrink:0}}>{open===i?'–':'+'}</span>
              </button>
              {open===i && <p style={{margin:'0 0 16px',fontSize:14,lineHeight:1.6,color:C.t1}}>{a}</p>}
            </div>
          ))}
        </div>
        <footer style={{marginTop:32,padding:'20px 0 8px',borderTop:`1px solid ${C.line}`,fontSize:11,color:C.t3,lineHeight:1.6}}>SafeWork SSM este un instrument de suport și nu înlocuiește un SEPP autorizat. Responsabilitatea legală rămâne la angajator conform L.319/2006.</footer>
      </main>
      <div style={{position:'fixed',left:0,right:0,bottom:0,background:C.white,borderTop:`1px solid ${C.line}`,padding:'10px 16px calc(12px + env(safe-area-inset-bottom))',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,zIndex:20}}>
        <div><div style={{fontSize:13,fontWeight:800,color:C.t0}}>Gratuit</div><div style={{fontSize:11,color:C.t2}}>configurare 5 min</div></div>
        <Btn label='Începe' size='md' onClick={onStart} iconRight='arrowR' />
      </div>
    </div>
  )

  /* ── W1 · Landing desktop — H1 = termenul căutat, H2 = intenții de căutare ── */
  const nav = [['#functionalitati','Funcționalități'],['#cum-functioneaza','Cum funcționează'],['#legislatie','Legislație SSM'],['#faq','Întrebări frecvente']]
  return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'Manrope, sans-serif',color:C.t0}}>
      <header style={{position:'sticky',top:0,zIndex:20,background:'rgba(247,246,243,0.92)',backdropFilter:'blur(8px)',borderBottom:`1px solid ${C.line}`}}>
        <div style={{maxWidth:1080,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',gap:28}}>
          <Logo />
          <nav style={{display:'flex',gap:22,marginLeft:12}}>
            {nav.map(([h,l]) => <a key={h} href={h} style={{fontSize:13,fontWeight:600,color:C.t1,textDecoration:'none'}}>{l}</a>)}
          </nav>
          <div style={{marginLeft:'auto',display:'flex',gap:10,alignItems:'center'}}>
            <button onClick={onLogin} style={{background:'none',border:'none',fontSize:13,fontWeight:700,color:C.t0,cursor:'pointer',fontFamily:'inherit',padding:'8px 10px'}}>Autentificare</button>
            <Btn label='Începe gratuit' size='sm' onClick={onStart} />
          </div>
        </div>
      </header>

      <Sec style={{padding:'72px 24px 56px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.05fr 1fr',gap:48,alignItems:'center'}}>
          <div>
            <span style={{fontFamily:C.mono,fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,fontWeight:600}}>Conform HG 1425/2006 · HG 259/2022</span>
            <h1 style={{margin:'12px 0 14px',fontSize:44,fontWeight:800,letterSpacing:'-0.025em',lineHeight:1.08}}>Aplicație SSM pentru firme din România</h1>
            <p style={{margin:0,fontSize:17,lineHeight:1.6,color:C.t1,maxWidth:520}}>Instruiri SSM online semnate pe telefon, fișe de instruire electronice generate automat și dosar pregătit oricând pentru controlul ITM. Fără dosare, fără Excel.</p>
            <div style={{display:'flex',gap:12,marginTop:24,alignItems:'center',flexWrap:'wrap'}}>
              <Btn label='Începe gratuit — 5 minute' size='lg' onClick={onStart} />
              <a href='#cum-functioneaza' style={{fontSize:14,fontWeight:700,color:C.t0,textDecoration:'none',display:'inline-flex',gap:6,alignItems:'center'}}>Vezi cum funcționează <Icon name='arrowR' size={15}/></a>
            </div>
            <div style={{fontSize:12,color:C.t3,marginTop:12}}>Fără card bancar · datele firmei se preiau automat din ONRC</div>
          </div>
          <HeroMock />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:56,paddingTop:28,borderTop:`1px solid ${C.line}`}}>
          {[['2.400+','Firme active'],['98%','Controale ITM fără sancțiuni'],['45.000+','Fișe semnate electronic'],['5 min','Configurare completă']].map(([v,l]) => (
            <div key={l}><div style={{fontSize:28,fontWeight:800,letterSpacing:'-0.02em'}}>{v}</div><div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:C.t3,marginTop:4}}>{l}</div></div>
          ))}
        </div>
      </Sec>

      <Sec id='functionalitati' bg={C.white}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
          <div>
            <H2>Instruire SSM online, semnată pe telefonul angajatului</H2>
            <p style={{fontSize:15,lineHeight:1.65,color:C.t1,margin:'-12px 0 16px'}}>Angajatul primește un link, parcurge materialul, dă testul de evaluare și semnează pe ecran. Fișa de instruire electronică se generează automat după modelul din Anexa 11 și se arhivează cu marcaj temporal — valabilă legal conform HG 259/2022.</p>
            <div style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>Semnătură electronică avansată · test inclus · adeverință automată</div>
          </div>
          <div style={{background:C.bg,borderRadius:16,padding:18,border:`1px solid ${C.line}`}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Fișă IP — Popescu Dan</div>
            <div style={{height:110,background:C.white,borderRadius:12,border:`1.5px dashed ${C.lineHi}`,display:'flex',alignItems:'flex-end',padding:'0 0 10px 14px',fontFamily:"'Brush Script MT', cursive",fontSize:26,color:C.t0}}>Popescu D.</div>
            <div style={{fontFamily:C.mono,fontSize:10,color:C.t3,marginTop:8}}>Semnat 15 aug 2026, 09:41 · IP 86.120.x.x · hash a3f8…e921</div>
          </div>
        </div>
      </Sec>

      <Sec>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
          <div style={{background:C.white,borderRadius:16,padding:18,border:`1px solid ${C.line}`,display:'flex',flexDirection:'column',gap:8}}>
            {[['Cristina Dobre','Expirat','red'],['Radu Stancu','Apt · până în feb 2027','green'],['Bogdan Ilie','Apt · până în mar 2027','green']].map(([n,s,t]) => (
              <div key={n} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:t==='red'?'oklch(0.98 0.01 25)':C.bg,borderRadius:10}}><span style={{fontSize:13,fontWeight:600}}>{n}</span><Pill label={s} tone={t} sm/></div>
            ))}
            <div style={{fontFamily:C.mono,fontSize:10,color:C.t3,marginTop:4}}>Alerte automate cu 30 · 14 · 7 · 1 zile înainte</div>
          </div>
          <div>
            <H2>Evidența medicinei muncii, fără Excel</H2>
            <p style={{fontSize:15,lineHeight:1.65,color:C.t1,margin:'-12px 0 0'}}>Scadențele avizelor medicale se calculează singure din data examenului. Managerul și angajatul primesc alerte înainte de fiecare termen, iar avizele expirate apar primele, cu acțiunea de programare direct pe rând.</p>
          </div>
        </div>
      </Sec>

      <Sec bg={C.white}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
          <div>
            <H2>Dosarul pentru controlul ITM, generat la un click</H2>
            <p style={{fontSize:15,lineHeight:1.65,color:C.t1,margin:'-12px 0 16px'}}>Toate fișele semnate, valabilitatea instruirilor și trasabilitatea semnăturilor, într-un singur PDF cu antetul firmei și dată de generare. Când sună inspectorul, dosarul e gata înainte să ajungă.</p>
            <div style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>Arhivă electronică cu hash de integritate · export oricând</div>
          </div>
          <div style={{background:C.primary,color:'#fff',borderRadius:16,padding:22}}>
            <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'#8A8F95'}}>Dosar control ITM</div>
            <div style={{fontSize:20,fontWeight:800,margin:'8px 0 4px'}}>26 fișe semnate · 5 avize medicale · 2 PV-uri PSI</div>
            <div style={{marginTop:14,display:'inline-flex',gap:8,alignItems:'center',background:'#fff',color:C.t0,padding:'10px 14px',borderRadius:10,fontSize:13,fontWeight:700}}><Icon name='download' size={15}/>Generează dosarul (PDF)</div>
          </div>
        </div>
      </Sec>

      <Sec id='cum-functioneaza'>
        <H2>Cum funcționează</H2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {[['Introduci CUI-ul firmei','Preluăm datele din ONRC și configurăm automat modulele și instruirile obligatorii pentru activitatea ta.'],['Adaugi angajații','Import CSV sau manual. Termenele de instruire și medicina muncii se calculează automat pentru fiecare.'],['Angajații semnează pe telefon','Primesc link de instruire și semnare. Tu vezi în timp real cine a semnat și cine mai are de făcut.']].map(([t,d],i) => (
            <div key={t} style={{background:C.white,border:`1px solid ${C.line}`,borderRadius:16,padding:22}}>
              <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.teal,fontWeight:600}}>Pasul {i+1}</div>
              <div style={{fontSize:16,fontWeight:800,margin:'8px 0 6px'}}>{t}</div>
              <div style={{fontSize:13.5,lineHeight:1.6,color:C.t1}}>{d}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id='faq' bg={C.white}>
        <H2>Întrebări frecvente despre SSM digital</H2>
        <div style={{maxWidth:760}}>
          {FAQ.map(([q,a],i) => (
            <div key={q} style={{borderTop:`1px solid ${C.line}`}}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'16px 0',background:'none',border:'none',textAlign:'left',fontSize:16,fontWeight:700,color:C.t0,cursor:'pointer',fontFamily:'inherit'}}>
                {q}<span style={{color:C.t2,fontSize:22,lineHeight:1,flexShrink:0}}>{open===i?'–':'+'}</span>
              </button>
              {open===i && <p style={{margin:'0 0 18px',fontSize:14.5,lineHeight:1.65,color:C.t1}}>{a}</p>}
            </div>
          ))}
        </div>
      </Sec>

      <Sec id='legislatie'>
        <div style={{background:C.primary,borderRadius:20,padding:'44px 40px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',gap:24,flexWrap:'wrap'}}>
          <div><div style={{fontSize:26,fontWeight:800,letterSpacing:'-0.02em'}}>Pune SSM-ul firmei în regulă azi</div><div style={{fontSize:14,color:'#D5D2CA',marginTop:6}}>Configurare în 5 minute, gratuit. Fără card bancar.</div></div>
          <button onClick={onStart} style={{background:'#fff',color:C.t0,border:'none',padding:'14px 26px',borderRadius:12,fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>Începe gratuit</button>
        </div>
      </Sec>

      <footer style={{borderTop:`1px solid ${C.line}`,padding:'36px 24px 28px'}}>
        <div style={{maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:32}}>
          <div><Logo size='sm' /><p style={{fontSize:12,color:C.t3,lineHeight:1.6,marginTop:12,maxWidth:420}}>SafeWork SSM este un instrument de suport și nu înlocuiește un SEPP autorizat. Responsabilitatea legală rămâne la angajator conform L.319/2006.</p></div>
          <div>
            <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,marginBottom:10}}>Produs</div>
            {[['#functionalitati','Instruire SSM online'],['#functionalitati','Fișă de instruire electronică'],['#functionalitati','Medicina muncii'],['#cum-functioneaza','Cum funcționează']].map(([h,l],i) => <a key={i} href={h} style={{display:'block',fontSize:13,color:C.t1,textDecoration:'none',marginBottom:8}}>{l}</a>)}
          </div>
          <div>
            <div style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:C.t3,marginBottom:10}}>Legislație (text oficial)</div>
            {LEGI.map(([l,h]) => <a key={l} href={h} target='_blank' rel='noreferrer' style={{display:'flex',gap:5,alignItems:'center',fontSize:13,color:C.t1,textDecoration:'none',marginBottom:8}}>{l}<Icon name='ext' size={12}/></a>)}
          </div>
        </div>
        <div style={{maxWidth:1080,margin:'22px auto 0',fontFamily:C.mono,fontSize:10,color:C.t3}}>© 2026 SafeWork SSM · Legea 319/2006 · HG 1425/2006 · HG 259/2022</div>
      </footer>
    </div>
  )
}
