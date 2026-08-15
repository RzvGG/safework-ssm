import { useState } from 'react'
import { useWidth } from './ui.jsx'
import { Landing } from './Landing.jsx'
import { AuthPage, EmployeeEntry } from './Auth.jsx'
import { Wizard } from './Wizard.jsx'
import { AppShell } from './Desktop.jsx'
import { EmployeeApp, ManagerMobile } from './Mobile.jsx'

/* ═══════════════════════════════════════
   ROOT — landing → auth (S1/S2) → onboarding (S3–S6) → aplicație
   Desktop: AppShell (S7–S20) · Mobil manager: M6–M10 · Angajat: link + cod (M1) → M2–M8
═══════════════════════════════════════ */
export default function App() {
  const [screen,setScreen] = useState('landing') // landing | login | register | forgot | employee-entry | employee | wizard | app
  const [user,setUser] = useState(null)
  const [appCfg,setAppCfg] = useState(null)
  const width = useWidth()

  const goHome = () => setScreen('landing')
  const onLogin = u => { setUser(u); setScreen(appCfg ? 'app' : 'wizard') }
  const onRegister = u => { setUser(u); setScreen('wizard') }
  const onWizard = cfg => { setAppCfg(cfg); setScreen('app') }
  const onEmployee = u => { setUser(u); setScreen('employee') }
  const onLogout = () => { setUser(null); setAppCfg(null); setScreen('landing') }

  if (screen==='landing') return <Landing onLogin={()=>setScreen('login')} onStart={()=>setScreen('register')} />
  if (screen==='employee-entry') return <EmployeeEntry onEnter={onEmployee} onBack={()=>setScreen('login')} />
  if (screen==='employee') return <EmployeeApp user={user} onLogout={onLogout} />
  if (screen==='wizard') return <Wizard user={user} onFinish={onWizard} onBack={()=>setScreen('login')} />
  if (screen==='app') return width < 768
    ? <ManagerMobile user={user} appCfg={appCfg} onLogout={onLogout} />
    : <AppShell user={user} appCfg={appCfg} onLogout={onLogout} />
  return <AuthPage screen={screen} setScreen={setScreen} onLogin={onLogin} onRegister={onRegister} onEmployee={()=>setScreen('employee-entry')} onHome={goHome} />
}
