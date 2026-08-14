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
  '44556677':{ nume:'Banca Demo România SA', caen:'6419', desc:'Alte activități de intermedieri monetare', județ:'București', oras:'București', angajati:312, forma:'SA' },
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
  const map = { '41':'constructii','42':'constructii','43':'constructii','49':'transport','50':'transport','51':'transport','52':'transport','53':'transport','55':'horeca','56':'horeca','62':'it','63':'it','64':'financiar','65':'financiar','66':'financiar','86':'sanatate','87':'sanatate','88':'sanatate' }
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

const ANGAJATI_FINANCIAR = [
  { id:1, name:'Andreea Marinescu', dept:'Front Office',    post:'Consilier clienți',     email:'andreea.marinescu@banca.ro', tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Radu Stancu',       dept:'Credite',         post:'Analist credite',       email:'radu.stancu@banca.ro',       tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Cristina Dobre',    dept:'Operațiuni',      post:'Casier',                email:'cristina.dobre@banca.ro',    tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Bogdan Ilie',       dept:'IT & Securitate', post:'Administrator sisteme', email:'bogdan.ilie@banca.ro',       tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Ioana Petrescu',    dept:'Resurse Umane',   post:'Referent RU',           email:'ioana.petrescu@banca.ro',    tel:'0755999000', trainOk:true,  medOk:true },
]

const ANGAJATI_HORECA = [
  { id:1, name:'Vasile Antonescu',  dept:'Bucătărie',  post:'Bucătar șef',      email:'',                    tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Georgiana Radu',    dept:'Bucătărie',  post:'Ajutor bucătar',   email:'',                    tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Alin Moraru',       dept:'Sală',       post:'Ospătar',          email:'alin@restaurant.ro',  tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Diana Enache',      dept:'Sală',       post:'Ospătar',          email:'',                    tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Marius Tudose',     dept:'Bar',        post:'Barman',           email:'marius@restaurant.ro',tel:'0755999000', trainOk:true,  medOk:true },
]

const getAngajati = (ind) => {
  if (ind === 'financiar' || ind === 'it') return ANGAJATI_FINANCIAR
  if (ind === 'horeca') return ANGAJATI_HORECA
  return ANGAJATI_DEMO
}

/* ═══════════════════════════════════════
   BAZA LEGISLATIVĂ MONITORIZATĂ
═══════════════════════════════════════ */
const LEGISLATIE_DB = [
  { act:'Legea 319/2006',   domeniu:'SSM — legea cadru',                    publicat:'MO 646/2006',  modif:'Text consolidat cu modificările ulterioare', status:'la_zi' },
  { act:'HG 1425/2006',     domeniu:'Norme metodologice L.319/2006',        publicat:'MO 882/2006',  modif:'HG 955/2010 · HG 259/2022',                  status:'la_zi' },
  { act:'HG 259/2022',      domeniu:'Digitalizarea fișei de instruire',     publicat:'MO 189/2022',  modif:'—',                                           status:'la_zi' },
  { act:'Legea 307/2006',   domeniu:'Apărarea împotriva incendiilor (SU)',  publicat:'MO 633/2006',  modif:'Republicată MO 297/2019',                     status:'la_zi' },
  { act:'OMAI 712/2005',    domeniu:'Instruirea în situații de urgență',    publicat:'MO 599/2005',  modif:'OMAI 786/2005',                               status:'la_zi' },
  { act:'Legea 481/2004',   domeniu:'Protecția civilă',                     publicat:'MO 1094/2004', modif:'Republicată MO 554/2008',                     status:'la_zi' },
  { act:'HG 971/2006',      domeniu:'Semnalizare de securitate',            publicat:'MO 683/2006',  modif:'Text consolidat',                             status:'la_zi' },
  { act:'HG 1048/2006',     domeniu:'Echipament individual de protecție',   publicat:'MO 722/2006',  modif:'—',                                           status:'la_zi' },
  { act:'HG 1146/2006',     domeniu:'Echipamente de muncă',                 publicat:'MO 815/2006',  modif:'—',                                           status:'la_zi' },
  { act:'HG 1091/2006',     domeniu:'Cerințe minime locuri de muncă',       publicat:'MO 739/2006',  modif:'—',                                           status:'la_zi' },
  { act:'HG 355/2007',      domeniu:'Supravegherea sănătății lucrătorilor', publicat:'MO 332/2007',  modif:'HG 1169/2011',                                status:'la_zi' },
  { act:'HG 493/2006',      domeniu:'Expunerea la zgomot',                  publicat:'MO 380/2006',  modif:'—',                                           status:'la_zi' },
  { act:'HG 1218/2006',     domeniu:'Agenți chimici la locul de muncă',     publicat:'MO 845/2006',  modif:'HG 584/2018',                                 status:'la_zi' },
  { act:'OUG 96/2003',      domeniu:'Protecția maternității la muncă',      publicat:'MO 750/2003',  modif:'Legea 25/2004',                               status:'la_zi' },
  { act:'HG 600/2007',      domeniu:'Protecția tinerilor la muncă',         publicat:'MO 473/2007',  modif:'—',                                           status:'la_zi' },
  { act:'Legea 346/2002',   domeniu:'Asigurare accidente de muncă',         publicat:'MO 454/2002',  modif:'Republicată MO 251/2014',                     status:'la_zi' },
  { act:'Legea 53/2003',    domeniu:'Codul muncii (cap. SSM)',              publicat:'MO 72/2003',   modif:'Republicată, actualizată permanent',          status:'la_zi' },
]

/* ═══════════════════════════════════════
   CONȚINUT MATERIALE DE INSTRUIRE
═══════════════════════════════════════ */
const MATERIALE_DB = [
  { id:1, titlu:'IIG — Instructaj introductiv-general', tip:'Prezentare', durata:'8 ore (min. legal)', sursa:'Furnizor', ver:'v2.1', capitole:[
    ['1. Cadrul legislativ SSM','Legea 319/2006 — legea securității și sănătății în muncă: obligațiile angajatorului (art. 6–13) și ale lucrătorilor (art. 22–23). HG 1425/2006 — normele metodologice de aplicare. Consecințele nerespectării: sancțiuni contravenționale ITM 3.000–10.000 lei, răspundere penală în caz de accidente grave.'],
    ['2. Drepturile și obligațiile lucrătorilor','Drepturi: echipament de protecție gratuit, instruire pe timpul programului, oprirea lucrului în caz de pericol grav și iminent (art. 20-21). Obligații: utilizarea corectă a mașinilor și EIP, comunicarea imediată a oricărei situații periculoase, cooperarea cu angajatorul (art. 22–23).'],
    ['3. Riscuri generale în unitate','Riscuri mecanice (tăiere, strivire, lovire), electrice (electrocutare), chimice (intoxicare, arsuri), ergonomice (manipulare manuală, poziții vicioase), psihosociale (stres, oboseală). Zonele cu risc ridicat și specific din unitate.'],
    ['4. Echipamentul individual de protecție','HG 1048/2006: EIP se acordă gratuit de angajator, utilizarea este obligatorie, întreținerea și verificarea periodică. Refuzul utilizării EIP = abatere disciplinară.'],
    ['5. Semnalizarea de securitate','HG 971/2006: panouri de interdicție (rotund, roșu), avertizare (triunghi, galben), obligare (rotund, albastru), salvare/prim ajutor (dreptunghi, verde), stingere incendiu (roșu). Semnale acustice și luminoase.'],
    ['6. Noțiuni de prim ajutor','Alertarea 112, evaluarea stării victimei, poziția laterală de siguranță, oprirea hemoragiilor, primul ajutor la arsuri. Amplasarea truselor de prim ajutor (Ord. MS 427/2002).'],
    ['7. Situații de urgență','Legea 307/2006 (incendii) și Legea 481/2004 (protecție civilă): comportamentul la incendiu, cutremur, alarmă. Căile de evacuare, punctul de adunare, interzicerea folosirii liftului la incendiu.'],
  ]},
  { id:2, titlu:'ILM — Instructaj la locul de muncă', tip:'Prezentare', durata:'min. 8 ore', sursa:'Furnizor', ver:'v1.4', capitole:[
    ['1. Riscurile specifice postului','Prezentarea riscurilor identificate în Evaluarea de Riscuri pentru postul respectiv: echipamente utilizate, substanțe, mediu de lucru, factori de risc individuali.'],
    ['2. Instrucțiuni proprii de securitate','Instrucțiunile proprii SSM elaborate pentru activitățile desfășurate la locul de muncă respectiv (art. 98–104 HG 1425/2006). Prevederile aplicabile din fișa postului.'],
    ['3. Utilizarea echipamentelor de muncă','HG 1146/2006: pornire/oprire în siguranță, dispozitive de protecție (interzis a fi îndepărtate), verificări înainte de utilizare, raportarea defecțiunilor.'],
    ['4. Manipularea manuală a maselor','HG 1051/2006: limite de greutate, tehnica corectă de ridicare (spatele drept, genunchii îndoiți), utilizarea mijloacelor ajutătoare.'],
    ['5. Demonstrații practice','Demonstrarea practică a operațiunilor de lucru în siguranță — obligatorie conform art. 93 HG 1425/2006. Verificarea însușirii cunoștințelor înainte de începerea efectivă a lucrului.'],
  ]},
  { id:3, titlu:'IP — Instructaj periodic', tip:'Document', durata:'min. 2 ore', sursa:'Beneficiar', ver:'v3.0', capitole:[
    ['1. Reîmprospătarea cunoștințelor','Recapitularea instrucțiunilor proprii, a riscurilor specifice și a măsurilor de prevenire. Interval: 1–6 luni conform funcției (max. 6 luni personal TESA, max. 3 luni lucrători direct productivi — stabilit prin programul de instruire).'],
    ['2. Modificări legislative și organizatorice','Prezentarea modificărilor legislative apărute de la ultimul instructaj, modificări de tehnologie sau organizare care afectează securitatea.'],
    ['3. Analiza evenimentelor','Lecții învățate din accidente, incidente și near miss-uri din unitate sau din industrie. Măsuri corective adoptate.'],
    ['4. Verificarea cunoștințelor','Test de evaluare periodică — consemnat în fișa de instruire conform Anexa 11 HG 1425/2006.'],
  ]},
  { id:4, titlu:'IS — Instructaj suplimentar', tip:'Prezentare', durata:'min. 8 ore', sursa:'Furnizor', ver:'v1.0', capitole:[
    ['1. Cazurile în care se efectuează','Art. 108 HG 1425/2006: la reluarea activității după accident de muncă, la absență peste 30 zile lucrătoare, la modificarea tehnologiei/echipamentelor, la introducerea unui echipament nou, la modificarea instrucțiunilor proprii, la executarea unor lucrări speciale.'],
    ['2. Conținutul instructajului','Riscurile noi introduse de schimbare, instrucțiunile actualizate, demonstrații practice cu noile echipamente/tehnologii.'],
    ['3. Consemnarea','Se consemnează în fișa de instruire individuală cu semnătura celui instruit și a celui care a efectuat instruirea.'],
  ]},
  { id:5, titlu:'SU — Prevenirea și stingerea incendiilor', tip:'Video', durata:'2 ore', sursa:'Furnizor', ver:'v2.0', capitole:[
    ['1. Cadrul legal','Legea 307/2006 privind apărarea împotriva incendiilor și OMAI 712/2005 privind instruirea în domeniul situațiilor de urgență. Obligațiile salariaților la locul de muncă.'],
    ['2. Clasele de incendiu și stingătoarele','Clasa A (solide), B (lichide), C (gaze), D (metale), F (uleiuri de gătit). Alegerea stingătorului corect: pulbere (ABC), CO2 (echipamente electrice), spumă (AB). Utilizare: la baza flăcării, în direcția vântului.'],
    ['3. Comportamentul în caz de incendiu','Alarmare (112 + alarmă internă), evacuare imediată pe traseele marcate, interzicerea liftului, deplasarea aplecată în fum, punctul de adunare, apelul nominal.'],
    ['4. Prevenirea incendiilor','Fumatul doar în locuri amenajate, verificarea instalațiilor electrice, depozitarea corectă a materialelor inflamabile, menținerea liberă a căilor de evacuare și a accesului la hidranți/stingătoare.'],
    ['5. Exercițiile de evacuare','Obligatorii periodic conform planului de intervenție. Rolurile echipei de primă intervenție.'],
  ]},
]

/* ═══════════════════════════════════════
   TESTE DE EVALUARE (întrebări reale)
═══════════════════════════════════════ */
const TESTE_DB = [
  { id:1, titlu:'Test evaluare la angajare (IIG)', prag:80, tip:'La angajare', activ:true, intrebari:[
    { q:'Care este scopul Legii 319/2006?', a:['Reglementarea salarizării','Instituirea de măsuri pentru promovarea îmbunătățirii securității și sănătății în muncă','Organizarea timpului de lucru'], c:1 },
    { q:'Echipamentul individual de protecție (EIP) se acordă:', a:['Contra cost, prin reținere pe salariu','Gratuit, de către angajator','Doar personalului de conducere'], c:1 },
    { q:'În caz de pericol grav și iminent, lucrătorul:', a:['Își continuă activitatea până la noi dispoziții','Poate opri lucrul și părăsi imediat zona periculoasă','Așteaptă dispoziții scrise de la ITM'], c:1 },
    { q:'Accidentul de muncă trebuie comunicat angajatorului:', a:['Imediat','În termen de 30 de zile','Doar dacă victima este spitalizată'], c:0 },
    { q:'Cine răspunde de asigurarea securității și sănătății lucrătorilor?', a:['Fiecare lucrător, individual','Angajatorul','Inspectoratul Teritorial de Muncă'], c:1 },
    { q:'Instruirea periodică SSM se efectuează la interval de:', a:['Cel mult 6 luni, conform programului de instruire','O dată la 5 ani','Doar la cererea lucrătorului'], c:0 },
    { q:'Un panou de semnalizare rotund, de culoare roșie, semnifică:', a:['Obligație','Interdicție','Informare'], c:1 },
    { q:'Lucrătorul are obligația:', a:['Să utilizeze corect echipamentele de muncă și EIP','Să modifice dispozitivele de protecție dacă îl încurcă','Să ignore instrucțiunile dacă are experiență'], c:0 },
    { q:'Refuzul nejustificat de utilizare a EIP constituie:', a:['Un drept al lucrătorului','Abatere disciplinară','O situație fără consecințe'], c:1 },
    { q:'Numărul unic pentru apeluri de urgență este:', a:['112','961','021 9999'], c:0 },
  ]},
  { id:2, titlu:'Test periodic SSM — general', prag:70, tip:'Periodic', activ:true, intrebari:[
    { q:'Fișa de instruire individuală se completează:', a:['Anual, centralizat','La fiecare instructaj, cu semnătura celui instruit','Doar la angajare'], c:1 },
    { q:'Manipularea manuală corectă a unei greutăți se face cu:', a:['Spatele îndoit și genunchii drepți','Spatele drept și genunchii îndoiți','Mișcare bruscă de smucire'], c:1 },
    { q:'Dispozitivele de protecție ale echipamentelor de muncă:', a:['Pot fi îndepărtate pentru productivitate','Nu pot fi îndepărtate sau modificate','Se folosesc doar la controale'], c:1 },
    { q:'O defecțiune la un echipament de muncă se raportează:', a:['La sfârșitul schimbului','Imediat, conducătorului locului de muncă','Doar dacă echipamentul se oprește complet'], c:1 },
    { q:'Instructajul suplimentar (IS) se efectuează:', a:['La revenirea după o absență de peste 30 zile lucrătoare','Doar la angajare','Numai pentru personalul TESA'], c:0 },
    { q:'Trusa de prim ajutor trebuie să fie:', a:['Încuiată la administrator','Accesibilă și semnalizată corespunzător','Păstrată la vestiar'], c:1 },
    { q:'Poziția laterală de siguranță se aplică unei victime:', a:['Conștiente, cu fractură','Inconștiente, care respiră','Aflate în stop cardio-respirator'], c:1 },
    { q:'Semnalizarea de salvare/prim ajutor are culoarea:', a:['Verde','Galben','Albastru'], c:0 },
  ]},
  { id:3, titlu:'Test periodic SU — incendiu', prag:70, tip:'Periodic', activ:true, intrebari:[
    { q:'La declanșarea alarmei de incendiu:', a:['Îmi strâng lucrurile personale întâi','Evacuez imediat, calm, pe traseul stabilit','Aștept confirmarea că nu e exercițiu'], c:1 },
    { q:'În caz de incendiu, liftul:', a:['Se folosește pentru evacuare rapidă','Nu se folosește niciodată','Se folosește doar de persoane cu mobilitate redusă'], c:1 },
    { q:'Stingătorul se orientează:', a:['Spre vârful flăcării','Spre baza flăcării','Spre fumul degajat'], c:1 },
    { q:'Pentru un incendiu la un echipament electric sub tensiune se folosește:', a:['Apă','Stingător CO2','Spumă'], c:1 },
    { q:'Clasa de incendiu A cuprinde:', a:['Materiale solide (lemn, hârtie, textile)','Gaze inflamabile','Uleiuri de gătit'], c:0 },
    { q:'Căile de evacuare trebuie:', a:['Menținute libere permanent','Folosite pentru depozitare temporară','Încuiate în afara programului'], c:0 },
    { q:'În deplasarea printr-un spațiu cu fum:', a:['Merg în picioare, repede','Mă deplasez aplecat, cât mai jos','Aștept pe loc salvatorii'], c:1 },
    { q:'După evacuare, prezența se verifică:', a:['La punctul de adunare, prin apel nominal','Telefonic, a doua zi','Nu se verifică'], c:0 },
  ]},
  { id:4, titlu:'Test post-instructaj suplimentar (IS)', prag:75, tip:'Suplimentar', activ:false, intrebari:[
    { q:'Instructajul suplimentar este obligatoriu la:', a:['Modificarea tehnologiei sau a echipamentelor','Schimbarea programului de lucru','Concediul de odihnă'], c:0 },
    { q:'Durata minimă a instructajului suplimentar este:', a:['8 ore','30 de minute','Nu este reglementată'], c:0 },
    { q:'Instructajul suplimentar se consemnează în:', a:['Fișa de instruire individuală','Registrul de intrare-ieșire','Nu se consemnează'], c:0 },
    { q:'După un accident de muncă, lucrătorul reia activitatea:', a:['Direct, fără formalități','După instructaj suplimentar','După o simplă informare verbală'], c:1 },
    { q:'Cine efectuează instructajul suplimentar?', a:['Conducătorul locului de muncă / lucrătorul desemnat','Orice coleg cu vechime','Contabilul unității'], c:0 },
    { q:'Verificarea însușirii cunoștințelor după IS este:', a:['Opțională','Obligatorie','Necesară doar la cerere'], c:1 },
  ]},
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
function ModDashboard({ firma, modules, instruiriCfg, ind }) {
  const actives = TOATE_INSTRUIRILE.filter(i => (instruiriCfg[i.id]||{}).active)
  const ANG = getAngajati(ind)
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
            {[`${ANG[0].name} — instruire periodică scadentă (16 Apr)`,`${ANG[2].name} — control medical expirat`,`${ANG[3].name} — instruire IIG nesemnată`].map((m,i) => (
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

function ModInstruiri({ instruiriCfg, modules, ind }) {
  const ANG = getAngajati(ind)
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
        {ANG.map((a,i) => {
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
              const pending = ANG.filter((_,ai) => !semnate[`${active.indexOf(i)}_${ANG[ai].name}`]).length
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

function ModMedicina({ ind }) {
  const ANG = getAngajati(ind)
  const [rows,setRows] = useState(() => ANG.map((a,i) => ({
    id:a.id, name:a.name, dept:a.dept,
    tip: i===2 ? 'Angajare' : 'Periodică',
    ef:  ['10 Ian 2024','15 Feb 2024','01 Mar 2023','20 Mar 2024','05 Apr 2024'][i],
    exp: ['10 Ian 2025','15 Feb 2025','01 Mar 2024','20 Mar 2025','05 Apr 2025'][i],
    apt: i!==2,
  })))
  const [filter,setFilter] = useState('toti')
  const [edit,setEdit]     = useState(null)
  const filtered = filter==='toti'?rows:filter==='apt'?rows.filter(m=>m.apt):rows.filter(m=>!m.apt)
  const saveEdit = () => { setRows(rows.map(r => r.id===edit.id ? edit : r)); setEdit(null) }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {edit && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:420,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontSize:15,fontWeight:700,color:C.t0}}>🩺 Editare aviz medical</div><div style={{fontSize:11,color:C.t2,marginTop:2}}>{edit.name} · {edit.dept}</div></div>
              <button onClick={()=>setEdit(null)} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:20,display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>TIP EXAMEN</div>
                <select value={edit.tip} onChange={e=>setEdit({...edit,tip:e.target.value})}
                  style={{width:'100%',padding:'10px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none'}}>
                  {['Angajare','Periodică','Reluare activitate','Supraveghere specială'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div>
                  <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>DATA EFECTUĂRII</div>
                  <input value={edit.ef} onChange={e=>setEdit({...edit,ef:e.target.value})}
                    style={{width:'100%',padding:'10px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
                </div>
                <div>
                  <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>VALABIL PÂNĂ</div>
                  <input value={edit.exp} onChange={e=>setEdit({...edit,exp:e.target.value})}
                    style={{width:'100%',padding:'10px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
                </div>
              </div>
              <div>
                <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>REZULTAT AVIZ</div>
                <div style={{display:'flex',gap:8}}>
                  {[[true,'✓ Apt',C.teal],[false,'✗ Inapt / Expirat',C.red]].map(([val,l,cul]) => (
                    <div key={l} onClick={()=>setEdit({...edit,apt:val})}
                      style={{flex:1,padding:'10px',borderRadius:C.rs,border:`2px solid ${edit.apt===val?cul:C.line}`,background:edit.apt===val?cul+'0D':C.white,cursor:'pointer',textAlign:'center',fontSize:12,fontWeight:700,color:edit.apt===val?cul:C.t2}}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{padding:'13px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',gap:10}}>
              <Btn label='Anulează' color={C.gray} outline onClick={()=>setEdit(null)} />
              <Btn label='💾 Salvează' color={C.primary} onClick={saveEdit} />
            </div>
          </div>
        </div>
      )}
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>Medicină muncii</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>Evidența avizelor medicale</div></div>
        <Btn label='+ Înregistrare' color={C.primary} />
      </div>
      {rows.filter(m=>!m.apt).length>0 && <Alert type='error'>{rows.filter(m=>!m.apt).length} angajat(ți) cu aviz medical expirat — acces restricționat recomandat</Alert>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[['Total',rows.length,C.t0],['Apți',rows.filter(m=>m.apt).length,C.teal],['Expirați',rows.filter(m=>!m.apt).length,C.red]].map(([l,v,c]) => (
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
                <TD><Btn label='Editează' color={C.primary} outline sm onClick={()=>setEdit({...m})} /></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function ModEmitere({ ind }) {
  const ANG = getAngajati(ind)
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
                {ANG.map(a => <option key={a.id}>{a.name}</option>)}
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
function MaterialViewer({ mat, onClose }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:640,maxHeight:'85vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.t0}}>{mat.titlu}</div>
            <div style={{fontSize:11,color:C.t2,marginTop:2}}>{mat.tip} · {mat.durata} · versiunea {mat.ver}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:20}}>
          {mat.capitole.map(([titlu,continut],i) => (
            <div key={i} style={{marginBottom:16,padding:'14px 16px',background:C.bg,borderRadius:C.rs,border:`1px solid ${C.line}`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.primary,marginBottom:6}}>{titlu}</div>
              <div style={{fontSize:12,color:C.t1,lineHeight:1.7}}>{continut}</div>
            </div>
          ))}
          <div style={{padding:'10px 14px',background:C.amberBg,borderRadius:C.rx,fontSize:11,color:C.amber,lineHeight:1.5}}>
            📋 Conținut orientativ conform legislației. Se adaptează domeniului de activitate al beneficiarului și se completează cu instrucțiunile proprii ale unității.
          </div>
        </div>
        <div style={{padding:'13px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'flex-end',gap:10,flexShrink:0}}>
          <Btn label='⬇ Descarcă' color={C.gray} outline />
          <Btn label='✓ Am parcurs materialul' color={C.teal} onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

function TestRunner({ test, onClose }) {
  const [answers,setAnswers] = useState({})
  const [result,setResult]   = useState(null)
  const submit = () => {
    const corecte = test.intrebari.filter((q,i) => answers[i] === q.c).length
    const scor = Math.round(corecte / test.intrebari.length * 100)
    setResult({ corecte, scor, promovat: scor >= test.prag })
  }
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.white,borderRadius:C.r,width:'100%',maxWidth:640,maxHeight:'85vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.t0}}>✅ {test.titlu}</div>
            <div style={{fontSize:11,color:C.t2,marginTop:2}}>{test.intrebari.length} întrebări · prag de promovare {test.prag}%</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,color:C.t2,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:20}}>
          {result && (
            <div style={{marginBottom:16,padding:18,borderRadius:C.rs,background:result.promovat?C.greenBg:C.redBg,border:`2px solid ${result.promovat?C.green:C.red}44`,textAlign:'center'}}>
              <div style={{fontSize:40,marginBottom:6}}>{result.promovat?'🎉':'❌'}</div>
              <div style={{fontSize:22,fontWeight:900,color:result.promovat?C.teal:C.red}}>{result.scor}%</div>
              <div style={{fontSize:13,color:C.t1,marginTop:4}}>{result.corecte} din {test.intrebari.length} răspunsuri corecte · prag {test.prag}%</div>
              <div style={{fontSize:14,fontWeight:800,color:result.promovat?C.teal:C.red,marginTop:8}}>
                {result.promovat ? 'PROMOVAT — rezultatul se consemnează în fișa de instruire' : 'NEPROMOVAT — instructajul se repetă conform procedurii'}
              </div>
            </div>
          )}
          {test.intrebari.map((q,i) => {
            const chosen = answers[i]
            return (
              <div key={i} style={{marginBottom:14,padding:'14px 16px',background:C.bg,borderRadius:C.rs,border:`1px solid ${C.line}`}}>
                <div style={{fontSize:13,fontWeight:700,color:C.t0,marginBottom:10}}>{i+1}. {q.q}</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {q.a.map((opt,oi) => {
                    let border = chosen===oi ? C.primary : C.line
                    let bg = chosen===oi ? C.primaryBg : C.white
                    if (result) {
                      if (oi === q.c) { border = C.green; bg = C.greenBg }
                      else if (chosen === oi && oi !== q.c) { border = C.red; bg = C.redBg }
                    }
                    return (
                      <div key={oi} onClick={()=>!result&&setAnswers({...answers,[i]:oi})}
                        style={{padding:'9px 12px',borderRadius:C.rx,border:`2px solid ${border}`,background:bg,cursor:result?'default':'pointer',fontSize:12,color:C.t1,display:'flex',gap:8,alignItems:'center'}}>
                        <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${border}`,background:chosen===oi?(result?(oi===q.c?C.green:C.red):C.primary):'transparent',flexShrink:0}} />
                        {opt}
                        {result && oi===q.c && <span style={{marginLeft:'auto',fontSize:11,color:C.green,fontWeight:700}}>✓ corect</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{padding:'13px 20px',borderTop:`1px solid ${C.line}`,display:'flex',justifyContent:'space-between',gap:10,flexShrink:0}}>
          <div style={{fontSize:12,color:C.t2,alignSelf:'center'}}>{Object.keys(answers).length}/{test.intrebari.length} răspunse</div>
          {!result
            ? <Btn label='📊 Finalizează testul' color={C.primary} disabled={Object.keys(answers).length<test.intrebari.length} onClick={submit} />
            : <Btn label='Închide' color={C.teal} onClick={onClose} />}
        </div>
      </div>
    </div>
  )
}

function ModMateriale() {
  const [tab,setTab]       = useState('materiale')
  const [viewer,setViewer] = useState(null)
  const [runner,setRunner] = useState(null)
  const tipIcon = t => ({Video:'🎬',Prezentare:'📊',Document:'📄'}[t]||'📁')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {viewer && <MaterialViewer mat={viewer} onClose={()=>setViewer(null)} />}
      {runner && <TestRunner test={runner} onClose={()=>setRunner(null)} />}
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
            <thead><THead cols={['Material','Tip','Durată','Sursă','Versiune','']} /></thead>
            <tbody>
              {MATERIALE_DB.map(m => (
                <TRow key={m.id}>
                  <TD style={{fontWeight:600,color:C.t0}}>{tipIcon(m.tip)} {m.titlu}</TD>
                  <TD>{m.tip}</TD>
                  <TD style={{color:C.t2}}>{m.durata}</TD>
                  <TD><Chip label={m.sursa} color={m.sursa==='Furnizor'?C.purple:C.teal} sm /></TD>
                  <TD style={{fontFamily:'monospace',fontSize:11,color:C.t2}}>{m.ver}</TD>
                  <TD><div style={{display:'flex',gap:6}}><Btn label='▶ Vizualizează' color={C.primary} sm onClick={()=>setViewer(m)} /><Btn label='✏️' color={C.gray} outline sm /></div></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab==='teste' && (
        <Card>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><THead cols={['Test','Întrebări','Prag','Tip','Status','']} /></thead>
            <tbody>
              {TESTE_DB.map(t => (
                <TRow key={t.id}>
                  <TD style={{fontWeight:600,color:C.t0}}>{t.titlu}</TD>
                  <TD style={{color:C.t2}}>{t.intrebari.length} întrebări</TD>
                  <TD><Chip label={t.prag+'%'} color={C.amber} sm /></TD>
                  <TD>{t.tip}</TD>
                  <TD><Chip label={t.activ?'Activ':'Inactiv'} color={t.activ?C.teal:C.gray} sm /></TD>
                  <TD><div style={{display:'flex',gap:6}}><Btn label='▶ Rulează testul' color={C.primary} sm onClick={()=>setRunner(t)} /><Btn label='✏️' color={C.gray} outline sm /></div></TD>
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
   MODUL: LEGISLAȚIE (monitorizare + email zilnic)
═══════════════════════════════════════ */
function ModLegislatie() {
  const [emailActiv,setEmailActiv] = useState(true)
  const [email,setEmail] = useState('manager@firma.ro')
  const azi = new Date().toLocaleDateString('ro-RO',{day:'numeric',month:'long',year:'numeric'})
  const istoricVerificari = [
    { data:'Azi · 07:00',        rezultat:'ok',   text:'Nicio modificare legislativă detectată. Verificate 17 acte normative.' },
    { data:'Ieri · 07:00',       rezultat:'ok',   text:'Nicio modificare legislativă detectată. Verificate 17 acte normative.' },
    { data:'Acum 2 zile · 07:00',rezultat:'ok',   text:'Nicio modificare legislativă detectată. Verificate 17 acte normative.' },
    { data:'Exemplu notificare', rezultat:'modif',text:'MODIFICARE DETECTATĂ: HG 1425/2006 — a fost publicată o modificare în Monitorul Oficial. Materialele de instruire afectate au fost marcate pentru revizuire. Detalii complete în email.' },
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div><h2 style={{fontSize:18,fontWeight:900,color:C.t0}}>⚖️ Legislație SSM-SU</h2><div style={{fontSize:12,color:C.t2,marginTop:2}}>17 acte normative monitorizate · actualizare automată permanentă</div></div>
        <div style={{padding:'8px 14px',background:C.greenBg,border:`1px solid ${C.green}44`,borderRadius:C.rs,fontSize:12,fontWeight:700,color:C.green,display:'flex',alignItems:'center',gap:6}}>
          ✓ Ultima verificare: azi, 07:00 — toate la zi
        </div>
      </div>

      {/* Monitorizare & email zilnic */}
      <Card style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:240}}>
            <div style={{fontSize:14,fontWeight:800,color:C.t0,marginBottom:4}}>📧 Notificare zilnică pe email</div>
            <div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>
              În fiecare zi la ora 07:00, managerul SSM primește un email cu rezultatul verificării legislative: fie lista modificărilor detectate, fie confirmarea că nu au existat modificări.
            </div>
          </div>
          <Toggle checked={emailActiv} onChange={setEmailActiv} label='' sub='' />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,marginTop:14,alignItems:'end'}}>
          <div>
            <div style={{fontSize:11,color:C.t2,fontWeight:700,marginBottom:5}}>EMAIL MANAGER SSM</div>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',padding:'10px 12px',background:C.bg,border:`1px solid ${C.line}`,borderRadius:C.rs,fontSize:13,color:C.t0,outline:'none',boxSizing:'border-box'}} />
          </div>
          <Btn label='💾 Salvează' color={C.primary} />
        </div>
      </Card>

      {/* Istoricul verificărilor */}
      <Card>
        <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,fontSize:13,fontWeight:700,color:C.t0}}>🔍 Istoricul verificărilor zilnice</div>
        {istoricVerificari.map((v,i) => (
          <div key={i} style={{padding:'12px 18px',borderBottom:i<istoricVerificari.length-1?`1px solid ${C.line}`:'none',display:'flex',gap:12,alignItems:'flex-start',background:v.rezultat==='modif'?C.amberBg:'transparent'}}>
            <span style={{fontSize:16,flexShrink:0}}>{v.rezultat==='ok'?'✅':'⚠️'}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:v.rezultat==='modif'?C.amber:C.t2,marginBottom:2}}>{v.data}</div>
              <div style={{fontSize:12,color:C.t1,lineHeight:1.5}}>{v.text}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Lista actelor normative */}
      <Card>
        <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.line}`,fontSize:13,fontWeight:700,color:C.t0}}>📜 Acte normative monitorizate</div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:640}}>
            <thead><THead cols={['Act normativ','Domeniu','Publicare','Modificări','Status','']} /></thead>
            <tbody>
              {LEGISLATIE_DB.map(l => (
                <TRow key={l.act}>
                  <TD style={{fontWeight:700,color:C.t0,whiteSpace:'nowrap'}}>{l.act}</TD>
                  <TD style={{fontSize:12}}>{l.domeniu}</TD>
                  <TD style={{color:C.t2,fontSize:11,whiteSpace:'nowrap'}}>{l.publicat}</TD>
                  <TD style={{color:C.t2,fontSize:11}}>{l.modif}</TD>
                  <TD><Chip label='✓ La zi' color={C.teal} sm /></TD>
                  <TD><Btn label='📖 Text oficial' color={C.primary} outline sm onClick={()=>window.open('https://www.google.com/search?q='+encodeURIComponent('"'+l.act+'" site:legislatie.just.ro'),'_blank')} /></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:'12px 18px',borderTop:`1px solid ${C.line}`,fontSize:11,color:C.t2}}>
          Sursa textelor oficiale: <strong>legislatie.just.ro</strong> (portalul legislativ al Ministerului Justiției) și <strong>monitoruloficial.ro</strong>. La detectarea unei modificări, materialele de instruire afectate sunt marcate automat pentru revizuire.
        </div>
      </Card>
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
    {id:'legislatie',label:'Legislație',icon:'⚖️'},
    ...(modules.nearMiss?[{id:'nearmiss',label:'Near Miss',icon:'⚠️'}]:[]),
    ...(modules.audit?[{id:'audit',label:'Audit',icon:'🔍'}]:[]),
    {id:'setari',label:'Setări',icon:'⚙️'},
  ]
  const [helpdesk,setHelpdesk] = useState(false)
  const [userMenu,setUserMenu] = useState(false)

  const renderTab = () => {
    switch(tab) {
      case 'dashboard': return <ModDashboard firma={firma} modules={modules} instruiriCfg={instrCfg} ind={ind} />
      case 'documente': return <ModDocumente modules={modules} />
      case 'instruiri': return <ModInstruiri instruiriCfg={instrCfg} modules={modules} ind={ind} />
      case 'materiale': return <ModMateriale />
      case 'medicina':  return <ModMedicina ind={ind} />
      case 'emitere':   return <ModEmitere ind={ind} />
      case 'rapoarte':  return <ModRapoarte />
      case 'arhiva':    return <ModArhiva />
      case 'structura': return <ModStructura />
      case 'legislatie': return <ModLegislatie />
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
          <div style={{position:'relative'}}>
            <div onClick={()=>setUserMenu(!userMenu)} style={{cursor:'pointer',borderRadius:'50%',border:`2px solid ${userMenu?C.primary:'transparent'}`,transition:'border-color .15s'}}>
              <Ava name={user?.name || 'Manager SSM'} size={32} />
            </div>
            {userMenu && (
              <>
                <div onClick={()=>setUserMenu(false)} style={{position:'fixed',inset:0,zIndex:998}} />
                <div style={{position:'absolute',top:42,right:0,background:C.white,border:`1px solid ${C.line}`,borderRadius:C.rs,boxShadow:'0 8px 30px rgba(0,0,0,0.15)',minWidth:200,zIndex:999,overflow:'hidden'}}>
                  <div style={{padding:'12px 16px',borderBottom:`1px solid ${C.line}`,background:'#F8FAFC'}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.t0}}>{user?.name || 'Manager SSM'}</div>
                    <div style={{fontSize:11,color:C.t2,marginTop:2}}>{user?.email || ''}</div>
                  </div>
                  <button onClick={()=>{setTab('setari');setUserMenu(false)}} style={{width:'100%',padding:'11px 16px',background:'none',border:'none',textAlign:'left',fontSize:13,color:C.t1,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                    ⚙️ Setări
                  </button>
                  <button onClick={onLogout} style={{width:'100%',padding:'11px 16px',background:'none',border:'none',borderTop:`1px solid ${C.line}`,textAlign:'left',fontSize:13,color:C.red,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.redBg} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                    🔴 Deconectare
                  </button>
                </div>
              </>
            )}
          </div>
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
