# SafeWork SSM — patch v3.0 (Flux SSM v2 + audit UX/UI/SEO)

Fișiere modificate / noi față de v2.2 (se copiază peste repo, apoi `git add . && git commit && git push`):

- index.html            — SEO (W0): title/meta description/canonical/OG + JSON-LD SoftwareApplication + FAQPage
- src/App.jsx           — root: landing → auth → onboarding → app (desktop / manager mobil / angajat)
- src/data.js           — NOU: date + tokens (mutate din App.jsx), fără emoji
- src/ui.jsx            — NOU: set de pictograme SVG (înlocuiește emoji-urile), atomi UI, Toast, Drawer, SigPad
- src/Landing.jsx       — NOU: W1 landing SEO desktop + W2 landing mobil
- src/Auth.jsx          — S1 login (fără social login, intrare angajat prin link), S2 înregistrare (fără confirmare parolă), M1 cod SMS
- src/Wizard.jsx        — S3–S6 onboarding în 4 pași (Consiliere → panou „Analiza SSM"; Module + Instruiri pe un ecran)
- src/Desktop.jsx       — S7–S20 (Panou, Documente cu Emitere unificată + panou de semnare, Instruiri, Med. muncii, Materiale & Teste, Legislație, Rapoarte cu Dosar ITM, Arhivă, Structură, Audit ITM real, Setări fără tab Cont, Suport) + navigare grupată
- src/Mobile.jsx        — angajat M2–M8 (limbaj nou) + manager mobil M6–M10 (Panou / Documente / Echipă / Meniu)

Fără dependențe noi (package.json neschimbat).
