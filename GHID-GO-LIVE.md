# SafeWork SSM — Ghid Go Live (pas cu pas)

## Ce vei obține la final
O aplicație web live, accesibilă de pe orice dispozitiv, la o adresă de tipul:
`https://safework-ssm.vercel.app`

Timp estimat: **30–45 minute**

---

## PASUL 1 — Instalează Node.js (dacă nu îl ai)

1. Du-te la **https://nodejs.org**
2. Descarcă versiunea **LTS** (butonul verde din stânga)
3. Instalează cu opțiunile implicite (Next → Next → Install)
4. **Închide și redeschide terminalul** după instalare

Verificare:
```bash
node --version
# trebuie să apară ceva de genul: v20.x.x

npm --version
# trebuie să apară ceva de genul: 10.x.x
```

---

## PASUL 2 — Pregătește proiectul local

### 2a. Copiază fișierele primite

Creează un folder nou pe desktop cu numele `safework-ssm` și pune în el
**exact aceste fișiere** (le-ai primit ca arhivă ZIP):

```
safework-ssm/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

### 2b. Deschide terminalul în folderul proiectului

**Pe Windows:**
- Deschide folderul `safework-ssm` în Explorer
- Click dreapta → „Deschidere în Terminal" (sau „Open in Terminal")
- Alternativ: apasă bara de adrese, scrie `cmd` și Enter

**Pe Mac:**
- Deschide Terminal (Cmd+Space → Terminal)
- Scrie `cd ~/Desktop/safework-ssm` și Enter

### 2c. Instalează dependențele

```bash
npm install
```

Aștepți ~1 minut. Va apărea un folder `node_modules/` — normal.

### 2d. Pornește aplicația local

```bash
npm run dev
```

Vei vedea ceva de genul:
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

Deschide **http://localhost:5173** în browser.

✅ Dacă vezi pagina de login SafeWork SSM — totul funcționează local!

Testare rapidă:
- Introdu orice email + parolă cu minim 6 caractere → intri în wizard
- Folosește CUI demo `12345678` → apare Metalogic SRL
- Parcurge wizard-ul → ajungi în dashboard

---

## PASUL 3 — Creează cont GitHub și urcă proiectul

**De ce GitHub?** Vercel (hosting-ul) se conectează direct la GitHub și publică automat orice modificare.

1. Du-te la **https://github.com** → Sign up (dacă nu ai cont)
2. După autentificare, apasă **+** din dreapta sus → **New repository**
3. Completează:
   - Repository name: `safework-ssm`
   - Visibility: **Public** (pentru plan gratuit Vercel) sau Private dacă ai Vercel Pro
   - **NU** bifa nimic altceva (fără README, fără .gitignore)
4. Apasă **Create repository**
5. GitHub îți arată un ecran cu instrucțiuni — ai nevoie de URL-ul repo-ului (ex: `https://github.com/NUMELE-TAU/safework-ssm.git`)

Acum în terminal (în folderul proiectului):

```bash
git init
git add .
git commit -m "SafeWork SSM v1.0"
git branch -M main
git remote add origin https://github.com/NUMELE-TAU/safework-ssm.git
git push -u origin main
```

> La `git push`, GitHub poate cere autentificarea în browser — confirmă și gata.
> Dacă `git` nu e recunoscut: descarcă de pe **git-scm.com**, instalează, redeschide terminalul.

---

## PASUL 4 — Publică pe Vercel (aici devine LIVE)

1. Du-te la **https://vercel.com**
2. Apasă **Sign Up** → alege **Continue with GitHub** (se leagă automat)
3. Apasă **Add New... → Project**
4. În lista de repository-uri apare `safework-ssm` → apasă **Import**
5. Vercel detectează automat că e proiect Vite:
   - Framework Preset: **Vite** ✓
   - Build Command: `npm run build` ✓
   - Output Directory: `dist` ✓
   - **Nu modifica nimic**
6. Apasă **Deploy**

⏳ Aștepți ~1 minut...

🎉 **Felicitări! Aplicația este LIVE!**

Vei primi o adresă de tipul: `https://safework-ssm-abc123.vercel.app`

---

## PASUL 5 — Testează versiunea live

Deschide adresa primită și verifică:

**Login:**
- ✅ Pagina de login apare corect cu branding-ul stânga (desktop)
- ✅ Pe mobil dispare branding-ul și rămâne doar formularul
- ✅ Orice email + parolă cu min. 6 caractere → intri în wizard

**Wizard CUI:**
- ✅ CUI `12345678` → apare Metalogic SRL (28 angajați, Cluj)
- ✅ CUI `55667788` → Restaurant, 8 angajați → verdict "Admin poate face SSM"
- ✅ CUI `11223344` → Construct Plus, 87 angajați → verdict "Specialist obligatoriu"
- ✅ Modulele se presetează automat pe industrie
- ✅ Instruirile se filtrează pe industrie (ISCIR nu apare la restaurante)

**Dashboard:**
- ✅ KPI-urile apar (28 angajați, 3 scadențe, etc.)
- ✅ Status instruiri cu progress bars
- ✅ Alerte de atenție

**Documente:**
- ✅ Lista documentelor cu filtre
- ✅ Buton semnează → deschide modal semnătură
- ✅ Canvas funcționează (poți desena semnătura)

**Instruiri:**
- ✅ Lista instruirilor active pe industria aleasă
- ✅ Click pe instruire → lista angajaților + status

**Medicină muncii:**
- ✅ Tabel cu avize, filtru Apți/Expirați
- ✅ Alertă roșie pentru expirat

**Emitere documente:**
- ✅ Selectare tip document → angajat → generează
- ✅ Mesaj succes cu butoane PDF/Semnează

**Setări:**
- ✅ Toggle module (nearMiss, audit, semnatura) → tabs dispar/apar imediat
- ✅ Toggle instruiri → se actualizează lista
- ✅ Deconectare → revine la login

---

## Cum faci modificări după lansare

Orice schimbare în cod ajunge automat live în ~1 minut:

```bash
# Modifici ceva în src/App.jsx
git add .
git commit -m "descrierea modificarii"
git push
```

Vercel detectează push-ul și republică singur.

---

## Domeniu personalizat (opțional)

1. Cumpără un domeniu (ex: `safeworkssm.ro`) de la orice registrar (GoDaddy, NameCheap, RoLink etc.)
2. În Vercel → proiectul tău → **Settings → Domains**
3. Adaugă domeniul și urmează instrucțiunile de configurare DNS
4. Procesul durează 5–30 minute să se propaghe

---

## Probleme frecvente

| Simptom | Cauză și rezolvare |
|---|---|
| `npm nu este recunoscut` | Node.js nu e instalat sau terminalul era deschis la instalare → reinstalează / redeschide terminalul |
| Pagina locală e albă | Rulezi `npm run dev` din alt folder → verifică cu `cd` că ești în folderul proiectului |
| `git: command not found` | Git nu e instalat → descarcă de pe git-scm.com |
| La push cere user/parolă | GitHub a dezactivat autentificarea cu parolă → folosește GitHub Desktop sau token personal (Settings → Developer settings → Personal access tokens) |
| Build eșuat pe Vercel | Verifică log-urile → cel mai frecvent: eroare de sintaxă în cod |
| Aplicația merge local dar nu pe Vercel | Verifică că toate fișierele sunt în `src/` și că `vite.config.js` există |
| Pagina albă pe Vercel după deploy | Deschide Console în browser (F12) → verifică eroarea → cel mai des: import greșit |

---

## Bug-uri cunoscute în versiunea curentă (v1.0)

Acestea sunt limitele versiunii demo — date mock, fără backend real:

1. **PDF-ul nu se descarcă** — butonul există dar nu generează fișier real (necesită backend)
2. **SMS semnătură nu funcționează** — interfața există dar nu trimite SMS real (necesită Twilio/SMS API)
3. **CUI lookup** — funcționează doar cu cele 6 CUI-uri demo; în producție se conectează la ANAF API
4. **Datele nu se salvează** — la refresh se resetează (necesită bază de date)
5. **Filtrul perioadă dashboard** — dropdown există dar nu filtrează datele (necesită backend)
6. **Butonul Google/Microsoft** — butoane vizuale, fără OAuth real configurat

Toate sunt bug-uri așteptate pentru versiunea demo. Raportează orice altceva neașteptat!

---

## Pasul următor — Backend real

Când ești mulțumit de UX și vrei să adaugi date reale, persistență și autentificare reală,
citiți fișierul `CLAUDE_CODE_INSTRUCTIONS.md` pentru arhitectura completă de backend.

Tehnologii necesare pentru producție:
- **Supabase** (PostgreSQL + Auth gratuit până la 500MB) — cel mai simplu de integrat
- **Vercel** (hosting frontend — gratuit)
- **ANAF API** (CUI lookup real — gratuit)
- **SendGrid** (email-uri — 100/zi gratuit)
