export const C = {
  bg:'#F7F6F3', white:'#FFFFFF',
  line:'#E7E5DF', lineHi:'#D5D2CA',
  primary:'#16191C', primaryDk:'#2A2E33', primaryBg:'#F1F0EC',
  teal:'oklch(0.45 0.1 162)', tealBg:'oklch(0.95 0.03 162)',
  amber:'oklch(0.5 0.12 75)', amberBg:'oklch(0.96 0.03 75)',
  red:'oklch(0.55 0.15 25)', redBg:'oklch(0.98 0.01 25)',
  green:'oklch(0.62 0.12 162)', greenBg:'oklch(0.95 0.03 162)',
  purple:'#40454A', purpleBg:'#F1F0EC',
  gray:'#6B7076',
  t0:'#16191C', t1:'#40454A', t2:'#6B7076', t3:'#8A8F95',
  r:18, rs:14, rx:9,
  mono:"'IBM Plex Mono', monospace",
  shadow:'0 1px 2px rgba(22,25,28,0.06)',
}

/* ═══════════════════════════════════════
   DATE LEGISLATIVE
═══════════════════════════════════════ */
export const CUI_DB = {
  '12345678':{ nume:'Metalogic SRL', caen:'2562', desc:'Operațiuni de mecanică generală', județ:'Cluj', oras:'Cluj-Napoca', angajati:28, forma:'SRL' },
  '87654321':{ nume:'Green Office SRL', caen:'6201', desc:'Activități de realizare a soft-ului', județ:'București', oras:'București', angajati:12, forma:'SRL' },
  '11223344':{ nume:'Construct Plus SA', caen:'4120', desc:'Lucrări de construcție clădiri', județ:'Iași', oras:'Iași', angajati:87, forma:'SA' },
  '55667788':{ nume:'La Bunica Restaurant SRL', caen:'5610', desc:'Restaurante', județ:'Brașov', oras:'Brașov', angajati:8, forma:'SRL' },
  '99887766':{ nume:'Trans Express SRL', caen:'4941', desc:'Transporturi rutiere de mărfuri', județ:'Timiș', oras:'Timișoara', angajati:35, forma:'SRL' },
  '33445566':{ nume:'Clinica Sănătate SRL', caen:'8621', desc:'Activități asistență medicală generală', județ:'Constanța', oras:'Constanța', angajati:19, forma:'SRL' },
  '44556677':{ nume:'Banca Demo România SA', caen:'6419', desc:'Alte activități de intermedieri monetare', județ:'București', oras:'București', angajati:312, forma:'SA' },
}

export const getRiscCAEN = (caen) => {
  const cod = String(caen).slice(0,2)
  const ridicat = ['05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','38','41','42','43']
  const mediu   = ['45','46','47','49','50','51','52','53','55','56','68','71','72','73','74','75','77','78','79','80','81','82','84','85','86','87','88']
  if (ridicat.includes(cod)) return 'ridicat'
  if (mediu.includes(cod))   return 'mediu'
  return 'scazut'
}

export const getIndustrieCAEN = (caen) => {
  const cod = String(caen).slice(0,2)
  const productie = ['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33']
  if (productie.includes(cod)) return 'productie'
  const map = { '41':'constructii','42':'constructii','43':'constructii','49':'transport','50':'transport','51':'transport','52':'transport','53':'transport','55':'horeca','56':'horeca','62':'it','63':'it','64':'financiar','65':'financiar','66':'financiar','86':'sanatate','87':'sanatate','88':'sanatate' }
  return map[cod] || 'servicii'
}

export const getConsiliere = (angajati, risc) => {
  const n = parseInt(angajati) || 0
  if (n <= 9 && risc === 'scazut') return {
    culoare:C.green, bgC:C.greenBg, titlu:'Administratorul poate gestiona SSM',
    rezumat:'Conform HG 1425/2006 art.12, pentru firme cu sub 10 angajați și activități fără riscuri deosebite, administratorul poate îndeplini atribuțiile SSM personal.',
    conditii:['Activitatea nu figurează în Anexa 5 HG 1425/2006 ','Urmați un curs SSM de minimum 40 de ore','Fără riscuri de accidente grave sau boli profesionale'],
    actiuni:[{text:'Curs SSM 40h pentru angajatori',p:'obligatoriu'},{text:'Evaluarea Riscurilor pentru toate posturile',p:'obligatoriu'},{text:'Plan de Prevenire și Protecție',p:'obligatoriu'}],
    economie:'Economie estimată: 3.000–6.000 lei/an față de serviciu extern',
  }
  if (n <= 9) return {
    culoare:C.amber, bgC:C.amberBg, titlu:'Serviciu extern recomandat (risc mediu/ridicat)',
    rezumat:'Firma are sub 10 angajați, dar activitatea prezintă riscuri. Administratorul POATE gestiona SSM, dar serviciul extern oferă protecție juridică mai bună.',
    conditii:['Activitatea prezintă riscuri specifice industriei','Documentația elaborată de nespecialist poate fi contestată la ITM','Risc de accidente — recomandăm serviciu extern autorizat'],
    actiuni:[{text:'Contractați un SEPP (Serviciu Extern de Prevenire și Protecție)',p:'recomandat'},{text:'Evaluarea Riscurilor elaborată de SEPP',p:'obligatoriu'},{text:'Plan de Prevenire și Protecție',p:'obligatoriu'}],
    economie:'Cost estimat serviciu extern: 200–500 lei/lună',
  }
  if (n <= 49 && risc === 'scazut') return {
    culoare:C.green, bgC:C.greenBg, titlu:'Administrator sau lucrător desemnat',
    rezumat:'Angajatorul poate gestiona SSM pentru 10–49 angajați cu risc scăzut, sau poate desemna un lucrător cu curs SSM.',
    conditii:['Activitatea nu figurează în Anexa 5 HG 1425/2006 ','Lucrătorul desemnat urmează curs SSM minim 40h','Fără riscuri de accidente grave'],
    actiuni:[{text:'Desemnați lucrător responsabil SSM prin decizie scrisă',p:'obligatoriu'},{text:'Curs SSM acreditat (40h minim)',p:'obligatoriu'},{text:'Evaluarea Riscurilor pentru toate posturile',p:'obligatoriu'}],
    economie:'Soluție optimă: lucrător desemnat + SafeWork ≈ 1.500–3.000 lei/an',
  }
  if (n <= 49) return {
    culoare:C.amber, bgC:C.amberBg, titlu:'Specialist SSM sau serviciu extern necesar',
    rezumat:'Pentru 10–49 angajați cu risc mediu/ridicat este necesară implicarea unui specialist SSM.',
    conditii:['Activitatea prezintă riscuri specifice','Lucrătorul desemnat trebuie calificare SSM specifică industriei','Evaluarea Riscurilor trebuie elaborată de specialist calificat'],
    actiuni:[{text:'Contractați Serviciu Extern de Prevenire și Protecție autorizat',p:'obligatoriu'},{text:'SEPP elaborează Evaluarea Riscurilor',p:'obligatoriu'},{text:'Lucrător intern pentru coordonare cu SEPP',p:'recomandat'}],
    economie:'Cost estimat SEPP: 400–900 lei/lună',
  }
  if (n <= 249) return {
    culoare:C.red, bgC:C.redBg, titlu:'Specialist SSM desemnat — obligatoriu prin lege',
    rezumat:'Conform L.319/2006, pentru 50–249 angajați administratorul NU mai poate prelua SSM. Este obligatorie desemnarea unui responsabil SSM.',
    conditii:[' Administratorul NU poate gestiona SSM personal la această dimensiune','Obligatoriu: lucrător desemnat cu calificare SSM sau SEPP autorizat','Amendă ITM 5.000–10.000 lei fără organizare formală'],
    actiuni:[{text:'Angajați Responsabil SSM calificat',p:'urgent'},{text:'Alternativ: contractați SEPP autorizat ANPM',p:'urgent'},{text:'Comitet SSM (obligatoriu la 50+ angajați)',p:'obligatoriu'}],
    economie:'SEPP: 800–2.000 lei/lună. Responsabil intern: 4.000–7.000 lei/lună.',
  }
  return {
    culoare:C.purple, bgC:C.purpleBg, titlu:'Serviciu intern de prevenire și protecție — obligatoriu',
    rezumat:'La 250+ angajați este obligatorie organizarea unui Serviciu Intern de Prevenire și Protecție cu personal specializat.',
    conditii:['Serviciu Intern cu minimum 1 specialist SSM cu studii superioare','Structură organizatorică dedicată SSM cu buget propriu','Comitet SSM obligatoriu cu reprezentanți ai angajaților'],
    actiuni:[{text:'Constituiți Serviciul Intern de Prevenire și Protecție',p:'urgent'},{text:'Angajați Șef Serviciu SSM (studii superioare + atestat)',p:'urgent'}],
    economie:'SafeWork reduce costurile administrative cu ~40% față de procese manuale.',
  }
}

export const TOATE_INSTRUIRILE = [
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

export const ANGAJATI_DEMO = [
  { id:1, name:'Ion Popescu',      dept:'Producție',  post:'Operator CNC',  email:'ion@firma.ro',   tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Maria Ionescu',    dept:'Producție',  post:'Sudor',         email:'',               tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Dan Constantin',   dept:'Depozit',    post:'Stivuitorist',  email:'dan@firma.ro',   tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Elena Gheorghe',   dept:'Birou',      post:'Contabil',      email:'elena@firma.ro', tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Petre Dumitrescu', dept:'Mentenanță', post:'Electrician',   email:'',               tel:'0755999000', trainOk:true,  medOk:true },
]

export const ANGAJATI_FINANCIAR = [
  { id:1, name:'Andreea Marinescu', dept:'Front Office',    post:'Consilier clienți',     email:'andreea.marinescu@banca.ro', tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Radu Stancu',       dept:'Credite',         post:'Analist credite',       email:'radu.stancu@banca.ro',       tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Cristina Dobre',    dept:'Operațiuni',      post:'Casier',                email:'cristina.dobre@banca.ro',    tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Bogdan Ilie',       dept:'IT & Securitate', post:'Administrator sisteme', email:'bogdan.ilie@banca.ro',       tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Ioana Petrescu',    dept:'Resurse Umane',   post:'Referent RU',           email:'ioana.petrescu@banca.ro',    tel:'0755999000', trainOk:true,  medOk:true },
]

export const ANGAJATI_HORECA = [
  { id:1, name:'Vasile Antonescu',  dept:'Bucătărie',  post:'Bucătar șef',      email:'',                    tel:'0721111222', trainOk:false, medOk:true },
  { id:2, name:'Georgiana Radu',    dept:'Bucătărie',  post:'Ajutor bucătar',   email:'',                    tel:'0722333444', trainOk:true,  medOk:true },
  { id:3, name:'Alin Moraru',       dept:'Sală',       post:'Ospătar',          email:'alin@restaurant.ro',  tel:'0733555666', trainOk:true,  medOk:false },
  { id:4, name:'Diana Enache',      dept:'Sală',       post:'Ospătar',          email:'',                    tel:'0744777888', trainOk:false, medOk:true },
  { id:5, name:'Marius Tudose',     dept:'Bar',        post:'Barman',           email:'marius@restaurant.ro',tel:'0755999000', trainOk:true,  medOk:true },
]

export const getAngajati = (ind) => {
  if (ind === 'financiar' || ind === 'it') return ANGAJATI_FINANCIAR
  if (ind === 'horeca') return ANGAJATI_HORECA
  return ANGAJATI_DEMO
}

/* ═══════════════════════════════════════
   BAZA LEGISLATIVĂ MONITORIZATĂ
═══════════════════════════════════════ */
export const LEGISLATIE_DB = [
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
export const MATERIALE_DB = [
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
export const TESTE_DB = [
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
   STATISTICI DEMO DERIVATE DIN FIRMĂ — cifrele urmăresc numărul real de angajați
═══════════════════════════════════════ */
export const getStats = (firma) => {
  const N = Math.max(1, parseInt(firma?.angajati) || 28)
  const r = { introductiv: Math.min(N, Math.ceil(N*0.18)), loc_munca: Math.min(N, Math.ceil(N*0.11)), periodica: Math.max(1, Math.round(N*0.036)), psi: 0 }
  const totalRest = r.introductiv + r.loc_munca + r.periodica
  const conf = Math.max(0, Math.round(100 - totalRest / (4*N) * 100))
  const scadente = Math.max(1, Math.round(N*0.11))
  const semnate = N - r.periodica
  return { N, rest:r, conf, scadente, semnate }
}
