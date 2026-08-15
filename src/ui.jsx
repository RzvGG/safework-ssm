import { useState, useEffect } from 'react'
import { C } from './data.js'

/* ═══════════════════════════════════════
   ICONS — set unic, geometric, stroke (înlocuiește emoji-urile de sistem)
═══════════════════════════════════════ */
const P = {
  panel:'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  file:'M6 2h8l5 5v15H6zM14 2v5h5M9 13h6M9 17h6',
  book:'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z',
  med:'M12 21s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9zM12 8v6M9 11h6',
  layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  scale:'M12 3v18M4 7l8-2 8 2M4 7l-2 7h6zM20 7l-2 7h6zM8 21h8',
  chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  archive:'M3 4h18v5H3zM5 9v11h14V9M10 13h4',
  building:'M4 21V3h10v18M14 9h6v12M7 7h1M7 11h1M7 15h1M17 13h1M17 17h1',
  shield:'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5zM8 12l3 3 5-6',
  gear:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  alert:'M12 3l10 18H2zM12 10v4M12 17v1',
  check:'M5 12l5 5L20 7',
  x:'M6 6l12 12M18 6L6 18',
  chevR:'M9 6l6 6-6 6',
  chevD:'M6 9l6 6 6-6',
  arrowL:'M19 12H5M11 18l-6-6 6-6',
  arrowR:'M5 12h14M13 6l6 6-6 6',
  search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  download:'M12 3v12M6 11l6 6 6-6M4 21h16',
  mail:'M3 5h18v14H3zM3 6l9 7 9-7',
  phone:'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  chat:'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z',
  help:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01',
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  plus:'M12 5v14M5 12h14',
  calendar:'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3 2',
  camera:'M3 8h4l2-3h6l2 3h4v12H3zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  pen:'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
  offline:'M2 2l20 20M9 9a12 12 0 0 1 3-.4 12 12 0 0 1 8.5 3.4M5 12.5a9 9 0 0 1 3.4-2M12 20h.01',
  menu:'M4 7h16M4 12h16M4 17h16',
  upload:'M12 17V5M6 11l6-6 6 6M4 21h16',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  ext:'M14 4h6v6M20 4l-9 9M19 14v6H5V6h6',
  lock:'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  home:'M3 11l9-8 9 8v10h-6v-6H9v6H3z',
  filetext:'M6 2h8l5 5v15H6zM14 2v5h5M9 13h6M9 17h4',
  wifi:'M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 20h.01',
  refresh:'M20 11a8 8 0 0 0-14.5-4M4 13a8 8 0 0 0 14.5 4M4 5v4h4M20 19v-4h-4',
  send:'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v5M12 8h.01',
  globe:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20',
  edit:'M11 4H4v16h16v-7M18 2l4 4-10 10H8v-4z',
  play:'M6 4l14 8-14 8z',
  copy:'M9 9h11v11H9zM5 15H4V4h11v1',
}
export function Icon({ name, size=18, stroke=1.8, style={}, color }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color||'currentColor'} strokeWidth={stroke} strokeLinecap='round' strokeLinejoin='round' style={{flexShrink:0,display:'block',...style}} aria-hidden='true'>
      <path d={P[name]||P.info} />
    </svg>
  )
}

/* ═══════════════════════════════════════
   HOOKS
═══════════════════════════════════════ */
export function useWidth() {
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
export function Logo({ size='md', dark=false, onClick }) {
  const s=size==='lg'?34:size==='sm'?22:26, ts=size==='lg'?20:size==='sm'?14:15
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:9,cursor:onClick?'pointer':'default'}}>
      <span style={{width:s,height:s,borderRadius:s*0.3,background:dark?'#FFFFFF':'#16191C',flexShrink:0}} />
      <strong style={{fontSize:ts,fontWeight:800,color:dark?'#FFFFFF':C.t0,letterSpacing:'-0.02em',lineHeight:1,whiteSpace:'nowrap'}}>SafeWork <span style={{color:dark?'#8A8F95':C.t3}}>SSM</span></strong>
    </div>
  )
}

export function Card({ children, style={}, onClick }) {
  const [h,setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={()=>onClick&&setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:C.white,border:`1px solid ${h?C.lineHi:C.line}`,borderRadius:C.r,overflow:'hidden',boxShadow:C.shadow,cursor:onClick?'pointer':'default',transition:'border-color .15s',...style}}>
      {children}
    </div>
  )
}

/* Btn — o singură acțiune primară per ecran (variant='primary'); restul outline/ghost */
export function Btn({ label, onClick, variant='primary', full, disabled, loading, size='md', icon, iconRight, style={}, title }) {
  const [h,setH] = useState(false)
  const pad = {xs:'5px 10px',sm:'7px 14px',md:'11px 20px',lg:'14px 26px'}[size]
  const fs  = {xs:11,sm:12,md:13,lg:15}[size]
  const off = disabled||loading
  const base = {
    primary:{bg:h?C.primaryDk:C.primary, bd:h?C.primaryDk:C.primary, fg:'#fff'},
    outline:{bg:h?C.bg:C.white, bd:C.lineHi, fg:C.t0},
    ghost:  {bg:h?C.primaryBg:'transparent', bd:'transparent', fg:C.t1},
    danger: {bg:h?'oklch(0.5 0.15 25)':C.red, bd:C.red, fg:'#fff'},
    dangerOutline:{bg:h?C.redBg:C.white, bd:C.red, fg:C.red},
  }[variant]
  return (
    <button disabled={off} onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:pad,background:off?C.primaryBg:base.bg,border:`1.5px solid ${off?C.line:base.bd}`,borderRadius:size==='xs'?8:size==='sm'?10:12,color:off?C.t3:base.fg,fontSize:fs,fontWeight:700,cursor:off?'not-allowed':'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .15s',width:full?'100%':'auto',fontFamily:'inherit',minHeight:size==='xs'?28:size==='sm'?34:44,whiteSpace:'nowrap',...style}}>
      {loading ? <Icon name='refresh' size={16} style={{animation:'spin .8s linear infinite'}} /> : <>{icon&&<Icon name={icon} size={size==='xs'?13:15} />}{label}{iconRight&&<Icon name={iconRight} size={size==='xs'?13:15} />}</>}
    </button>
  )
}

/* Link text — pentru acțiuni discrete în rânduri (Vezi, PDF, Text oficial) */
export function TLink({ label, onClick, icon, color=C.t0, size=12, style={}, href }) {
  const s = {background:'none',border:'none',padding:0,color,fontSize:size,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:5,textDecoration:'underline',textUnderlineOffset:3,textDecorationColor:C.lineHi,...style}
  if (href) return <a href={href} target='_blank' rel='noreferrer' style={s}>{icon&&<Icon name={icon} size={13}/>}{label}</a>
  return <button onClick={onClick} style={s}>{icon&&<Icon name={icon} size={13}/>}{label}</button>
}

export function Inp({ label, type='text', placeholder, value, onChange, error, hint, right, onKeyDown, autoFocus, mono, style={} }) {
  const [show,setShow] = useState(false)
  const [foc,setFoc]   = useState(false)
  const isP = type === 'password'
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5,...style}}>
      {label && <label style={{fontSize:12,fontWeight:700,color:C.t1}}>{label}</label>}
      <div style={{position:'relative'}}>
        <input type={isP?(show?'text':'password'):type} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} autoFocus={autoFocus}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{width:'100%',padding:`12px ${isP||right?60:14}px 12px 14px`,background:error?C.redBg:C.white,border:`1.5px solid ${error?C.red:foc?C.primary:C.line}`,borderRadius:12,fontSize:14,color:C.t0,outline:'none',transition:'border-color .15s',boxSizing:'border-box',fontFamily:mono?C.mono:'inherit',minHeight:44}} />
        {isP && <button type='button' onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:11,fontWeight:700,color:C.t2,padding:4,fontFamily:'inherit'}}>{show?'ascunde':'arată'}</button>}
        {right && !isP && <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',fontSize:11,color:C.t3,fontFamily:C.mono}}>{right}</span>}
      </div>
      {error && <span style={{fontSize:11,color:C.red,fontWeight:600}}>{error}</span>}
      {hint && !error && <span style={{fontSize:11,color:C.t3}}>{hint}</span>}
    </div>
  )
}

export function Sel({ label, value, onChange, options, style={}, sm }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5,...style}}>
      {label && <label style={{fontSize:12,fontWeight:700,color:C.t1}}>{label}</label>}
      <div style={{position:'relative'}}>
        <select value={value} onChange={onChange}
          style={{width:'100%',padding:sm?'7px 30px 7px 12px':'11px 34px 11px 14px',background:C.white,border:`1.5px solid ${C.line}`,borderRadius:sm?10:12,fontSize:sm?12:13,color:C.t0,outline:'none',fontFamily:'inherit',appearance:'none',fontWeight:600,cursor:'pointer',minHeight:sm?34:44}}>
          {options.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:C.t2}}><Icon name='chevD' size={14}/></span>
      </div>
    </div>
  )
}

export function Toggle({ checked, onChange, label, sub, disabled }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16}}>
      {(label||sub) && <div>
        <div style={{fontSize:13,fontWeight:600,color:C.t0}}>{label}</div>
        {sub && <div style={{fontSize:11,color:C.t2,marginTop:2}}>{sub}</div>}
      </div>}
      <div onClick={()=>!disabled&&onChange(!checked)} style={{width:44,height:26,borderRadius:13,background:checked?C.primary:C.line,cursor:disabled?'not-allowed':'pointer',position:'relative',transition:'background .2s',flexShrink:0,opacity:disabled?.55:1}}>
        <div style={{position:'absolute',top:3,left:checked?21:3,width:20,height:20,borderRadius:'50%',background:C.white,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}} />
      </div>
    </div>
  )
}

/* Pill de status — statusul poartă contextul („Nesemnat · 2 zile") */
export function Pill({ label, tone='gray', sm, style={} }) {
  const m = {
    green:[C.teal,C.greenBg], amber:['oklch(0.45 0.12 75)','oklch(0.94 0.05 85)'], red:['oklch(0.5 0.15 25)','oklch(0.95 0.03 25)'],
    gray:[C.t2,'#EEEDE9'], dark:['#fff',C.primary], blue:[C.t1,C.primaryBg],
  }
  const [fg,bg] = m[tone] || m.gray
  return <span style={{fontSize:sm?10:11,fontWeight:700,color:fg,background:bg,padding:sm?'3px 8px':'4px 10px',borderRadius:999,whiteSpace:'nowrap',display:'inline-flex',alignItems:'center',gap:5,lineHeight:1.2,...style}}>{label}</span>
}

export function Ava({ name='', size=34, mono }) {
  const ini = String(name).split(/[\s.@]+/).filter(Boolean).map(p=>p[0]).join('').slice(0,2).toUpperCase() || '?'
  return <div style={{width:size,height:size,borderRadius:'50%',background:mono?C.primary:C.primaryBg,border:mono?'none':`1px solid ${C.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.34,fontWeight:800,color:mono?'#fff':C.t0,flexShrink:0,fontFamily:C.mono}}>{ini}</div>
}

export function PBar({ val, color=C.primary, h=6, bg='#EEEDE9', style={} }) {
  return (
    <div style={{height:h,background:bg,borderRadius:999,overflow:'hidden',...style}}>
      <div style={{height:'100%',width:`${Math.min(Math.max(val,0),100)}%`,background:color,borderRadius:999,transition:'width .4s'}} />
    </div>
  )
}
export const trafficColor = p => p>=80?C.green:p>=60?'oklch(0.75 0.12 75)':C.red

/* Notă — casetă gri/amber cu label mono uppercase (AUTOMAT · TERMEN · DE CE E OBLIGATORIU) */
export function Note({ label, children, tone='gray', style={} }) {
  const bg = tone==='amber'?'oklch(0.96 0.03 75)':tone==='red'?C.redBg:tone==='green'?C.greenBg:C.bg
  const lc = tone==='amber'?'oklch(0.45 0.12 75)':tone==='red'?C.red:tone==='green'?C.teal:C.t3
  return (
    <div style={{background:bg,border:`1px solid ${tone==='gray'?C.line:'transparent'}`,borderRadius:12,padding:'10px 13px',...style}}>
      {label && <span style={{fontFamily:C.mono,fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:lc,display:'block',marginBottom:4,fontWeight:600}}>{label}</span>}
      <span style={{fontSize:12.5,color:C.t1,lineHeight:1.55,display:'block'}}>{children}</span>
    </div>
  )
}

/* Alertă acționabilă — mesaj + butonul care o rezolvă */
export function Alert({ tone='amber', children, action, onAction, style={} }) {
  const m = { amber:['oklch(0.96 0.03 75)','oklch(0.45 0.12 75)'], red:[C.redBg,C.red], green:[C.greenBg,C.teal], gray:[C.bg,C.t1] }
  const [bg,fg] = m[tone]
  return (
    <div style={{padding:'12px 14px',background:bg,borderRadius:12,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',...style}}>
      <span style={{color:fg,display:'flex'}}><Icon name={tone==='green'?'check':tone==='gray'?'info':'alert'} size={16}/></span>
      <span style={{fontSize:13,color:C.t0,lineHeight:1.5,flex:1,minWidth:200}}>{children}</span>
      {action && <Btn label={action} size='sm' onClick={onAction} />}
    </div>
  )
}

/* Tabs segmentate cu contor */
export function Tabs({ tabs, value, onChange, style={} }) {
  return (
    <div style={{display:'flex',gap:2,background:'#EEEDE9',borderRadius:12,padding:3,width:'fit-content',maxWidth:'100%',overflowX:'auto',...style}}>
      {tabs.map(t => {
        const [id,l,n] = t
        const on = value===id
        return (
          <button key={id} onClick={()=>onChange(id)} style={{padding:'7px 14px',borderRadius:9,border:'none',background:on?C.white:'transparent',color:on?C.t0:C.t2,fontSize:12,fontWeight:on?700:500,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',boxShadow:on?C.shadow:'none',display:'flex',gap:6,alignItems:'center',minHeight:34}}>
            {l}{n!==undefined && <span style={{fontFamily:C.mono,fontSize:10,color:on?C.t1:C.t3}}>· {n}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* Chip de filtru (rotund) */
export function FChip({ label, on, onClick, n }) {
  return (
    <button onClick={onClick} style={{padding:'8px 13px',minHeight:38,border:`1.5px solid ${on?C.primary:C.line}`,background:on?C.white:'transparent',borderRadius:999,fontSize:13,fontWeight:on?800:500,color:on?C.t0:C.t2,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',gap:6,alignItems:'center',whiteSpace:'nowrap'}}>
      {label}{n!==undefined&&<span style={{fontFamily:C.mono,fontSize:11,color:C.t3}}>· {n}</span>}
    </button>
  )
}

/* Tabel */
export function Table({ cols, children, minWidth }) {
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',minWidth}}>
        <thead>
          <tr style={{background:'#FAFAF8',borderBottom:`1px solid ${C.line}`}}>
            {cols.map((c,i) => <th key={i} style={{padding:'10px 16px',textAlign:'left',fontFamily:C.mono,fontSize:10,color:C.t2,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{c}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
export function TR({ children, onClick, hi }) {
  const [h,setH] = useState(false)
  return (
    <tr onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{borderBottom:`1px solid ${C.line}`,background:hi?'oklch(0.98 0.01 25)':h?'#FAFAF8':C.white,cursor:onClick?'pointer':'default',transition:'background .1s'}}>
      {children}
    </tr>
  )
}
export function TD({ children, style={}, mono }) {
  return <td style={{padding:'11px 16px',fontSize:13,color:C.t1,fontFamily:mono?C.mono:'inherit',...style}}>{children}</td>
}

/* Modal centrat */
export function Modal({ title, sub, onClose, children, footer, width=520 }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(22,25,28,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:width,maxHeight:'88vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 18px 40px rgba(22,25,28,0.18)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexShrink:0}}>
          <div><div style={{fontSize:15,fontWeight:800,color:C.t0}}>{title}</div>{sub&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>{sub}</div>}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.t2,cursor:'pointer',padding:4}}><Icon name='x' size={18}/></button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:20}}>{children}</div>
        {footer && <div style={{padding:'13px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'flex-end',gap:10,flexShrink:0}}>{footer}</div>}
      </div>
    </div>
  )
}

/* Panou lateral (drawer) — pentru semnare, suport */
export function Drawer({ title, sub, onClose, children, footer, width=440 }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(22,25,28,0.35)'}} />
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'100%',maxWidth:width,background:C.white,boxShadow:'-18px 0 40px rgba(22,25,28,0.14)',display:'flex',flexDirection:'column'}} className='fade-in'>
        <div style={{padding:'18px 22px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div><div style={{fontSize:16,fontWeight:800,color:C.t0}}>{title}</div>{sub&&<div style={{fontSize:12,color:C.t2,marginTop:3}}>{sub}</div>}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.t2,cursor:'pointer',padding:4}}><Icon name='x' size={18}/></button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:22}}>{children}</div>
        {footer && <div style={{padding:'14px 22px',borderTop:`1px solid ${C.line}`}}>{footer}</div>}
      </div>
    </div>
  )
}

/* Toast — confirmare nemodală (nu banner injectat în card) */
export function Toast({ msg, action, onAction, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [msg])
  return (
    <div style={{position:'fixed',left:'50%',bottom:24,transform:'translateX(-50%)',background:C.primary,color:'#fff',padding:'12px 16px',borderRadius:12,fontSize:13,fontWeight:600,display:'flex',gap:12,alignItems:'center',zIndex:1100,boxShadow:'0 10px 30px rgba(22,25,28,0.25)',maxWidth:'calc(100vw - 32px)'}} className='fade-in'>
      <Icon name='check' size={16} />
      <span>{msg}</span>
      {action && <button onClick={()=>{onAction&&onAction();onClose()}} style={{background:'none',border:'none',color:'#fff',fontWeight:800,cursor:'pointer',fontFamily:'inherit',fontSize:13,textDecoration:'underline',padding:0}}>{action}</button>}
    </div>
  )
}

/* Antet de pagină desktop: titlu 24/800 + subtitlu + o singură acțiune primară în dreapta */
export function PageHead({ title, sub, action, chips, children }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12,marginBottom:4}}>
      <div style={{minWidth:0}}>
        <h1 style={{margin:0,fontSize:24,fontWeight:800,letterSpacing:'-0.02em',color:C.t0,lineHeight:1.15}}>{title}</h1>
        {sub && <div style={{fontSize:13,color:C.t2,marginTop:4,lineHeight:1.5}}>{sub}</div>}
        {chips && <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>{chips}</div>}
      </div>
      {(action||children) && <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>{children}{action}</div>}
    </div>
  )
}

/* Empty state */
export function Empty({ text }) {
  return <div style={{padding:'34px 20px',textAlign:'center',color:C.t2,fontSize:13,background:C.bg,borderRadius:12}}>{text}</div>
}

/* Semnătură canvas — refolosit desktop + mobil */
import { useRef } from 'react'
export function SigPad({ height=180, onChange, name }) {
  const ref = useRef(null)
  const [drawing,setDrawing] = useState(false)
  const [has,setHas] = useState(false)
  const pos = (e,cv) => { const r=cv.getBoundingClientRect(); const src=e.touches?e.touches[0]:e; return {x:(src.clientX-r.left)*(cv.width/r.width), y:(src.clientY-r.top)*(cv.height/r.height)} }
  const start = e => { const cv=ref.current; if(!cv)return; const ctx=cv.getContext('2d'); const p=pos(e,cv); ctx.beginPath(); ctx.moveTo(p.x,p.y); setDrawing(true); if(!has){setHas(true);onChange&&onChange(true)} e.preventDefault() }
  const move  = e => { if(!drawing)return; const cv=ref.current; const ctx=cv.getContext('2d'); const p=pos(e,cv); ctx.lineTo(p.x,p.y); ctx.strokeStyle='#16191C'; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); e.preventDefault() }
  const clear = () => { const cv=ref.current; if(!cv)return; cv.getContext('2d').clearRect(0,0,cv.width,cv.height); setHas(false); onChange&&onChange(false) }
  return (
    <div>
      <div style={{position:'relative'}}>
        <canvas ref={ref} width={600} height={Math.round(height*600/380)}
          onMouseDown={start} onMouseMove={move} onMouseUp={()=>setDrawing(false)} onMouseLeave={()=>setDrawing(false)}
          onTouchStart={start} onTouchMove={move} onTouchEnd={()=>setDrawing(false)}
          style={{width:'100%',height,border:`1.5px dashed ${C.lineHi}`,borderRadius:14,background:'#FAFAF8',touchAction:'none',display:'block',cursor:'crosshair'}} />
        {!has && <span style={{position:'absolute',left:0,right:0,top:'50%',transform:'translateY(-50%)',textAlign:'center',fontSize:13,color:C.t3,pointerEvents:'none'}}>Semnează cu degetul sau mouse-ul, oriunde în chenar</span>}
        {name && <span style={{position:'absolute',left:12,bottom:8,fontFamily:C.mono,fontSize:10,color:C.t3,pointerEvents:'none'}}>{name}</span>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
        <TLink label='Șterge și reia' onClick={clear} color={C.t2} />
        <span style={{fontFamily:C.mono,fontSize:10,color:C.t3}}>{new Date().toLocaleString('ro-RO')}</span>
      </div>
    </div>
  )
}
