/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'veterinaria-pisani-santa-teresa',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 846 7102)
      message: '',
      ids: [],
    },
    /* Google (29/9/2026): lunedì–venerdì 10–19 con orario continuato, sabato 10–15, domenica chiuso */
    hours: {
      0: [],
      1: [['10:00', '19:00']],
      2: [['10:00', '19:00']],
      3: [['10:00', '19:00']],
      4: [['10:00', '19:00']],
      5: [['10:00', '19:00']],
      6: [['10:00', '15:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Dr Paola Pisani, vet: back to the top",
      "m.sotto": "Veterinary surgeon · Via Santa Teresa 10/C",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.studio": "The practice",
      "n.sala": "The waiting room",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.orariDove": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "h.sopra": "Veterinary practice · Via Santa Teresa 10/C, Milan",
      "h.titolo": "Your life companions are in excellent hands.",
      "h.chi": "Roberto, in a review on Google («I vostri compagni di vita sono in ottime mani.»)",
      "h.testo": "Dr Paola Pisani’s practice, between Piazza Abbiategrasso and Via Boifava: dogs and cats, open all day with no lunch break. On the waiting-room board are the patients, at home.",
      "h.voto": "100 reviews on Google",
      "h.chiama": "Call for a visit",
      "h.indicazioni": "Directions",
      "lv.titolo": "Our patients, at home",
      "lv.grazie": "«THANK YOU doctor for realising straight away that Ozzy was seriously ill.»",
      "lv.chi": "Paola Rinaldi, on Google (translated)",
      "lv.nota": "The photos are the clients’, from the Google listing.",
      "lv.trascina": "You can move them.",
      "lv.ordina": "Put them back in order",
      "s.etichetta": "The practice",
      "s.titolo": "A small practice, for many years",
      "s.testo": "The practice belongs to Dr Paola Pisani, veterinary surgeon. Dogs and cats: from puppies to animals adopted from the shelter, and for their whole lives.",
      "s.testo2": "Some people have been coming for thirty years, first with their parents’ cats and then with their own: the reviews below tell the story.",
      "s.intro": "In the hundred reviews, these four things keep coming back:",
      "s.m1": "Understanding straight away",
      "s.m1t": "what’s wrong, even when it’s serious.",
      "s.m2": "No unnecessary tests",
      "s.m2t": "only the ones that are needed.",
      "s.m3": "Telling it like it is",
      "s.m3t": "to the owners too, when needed.",
      "s.m4": "Even when it’s urgent",
      "s.m4t": "during opening hours: call straight away.",
      "a.etichetta": "The waiting room",
      "a.titolo": "Two green chairs, the plants, the board",
      "a.sedie": "The waiting room: the blue and white wall, two green metal chairs, plants in terracotta pots, a lectern with an open book, an antique poster with cats and dogs.",
      "c.sedie": "The green chairs and the lectern with the book of breeds.",
      "a.testo": "This is where you wait: the blue and white wall, two green metal chairs, the plants, a lectern with the book of breeds open, an old French poster full of cats and dogs. And the board, with the photos of the patients.",
      "a.lavagna": "The magnetic board in the waiting room, with photos of the animals and a note; in front of it, a fan.",
      "c.lavagna": "The real board, with the photos of the patients.",
      "a.continuato": "Open all day:",
      "a.continuatoT": "Monday to Friday from 10 am to 7 pm, Saturday from 10 am to 3 pm.",
      "d.etichetta": "Reviews",
      "d.titolo": "The clients’ notes",
      "d.voto": "on Google, 100 reviews",
      "d.m11": "Google, 11 months ago",
      "d.a5": "Google, 5 years ago",
      "d.a8": "Google, 8 years ago",
      "d.a3": "Google, 3 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The note on the board, at the top of the page, is from another client.",
      "d.tutte": "All the reviews on Google",
      "d.altre": "The others are on Google: a hundred reviews, averaging 4.9.",
      "o.etichetta": "Hours and where",
      "o.titolo": "Open all day, from 10 am",
      "o.cap": "Opening hours",
      "o.visita": "For a visit, and when it’s urgent during opening hours: <a href=\"tel:+39028467102\" class=\"intero\">+39 02 846 7102</a>.",
      "o.dove": "Via Santa Teresa 10/C, 20142 Milan, between Piazza Abbiategrasso and Via Boifava. <b>M2 Abbiategrasso</b> is 200 metres away; the tram and bus stops in <b>Piazza Abbiategrasso</b> are less than 250 metres away.",
      "o.civico": "The street number is <b>10/C</b> (some online directories say 20/42 or 42: that’s the postcode).",
      "o.mappa": "Map: Dr Paola Pisani’s veterinary practice, Via Santa Teresa 10/C, Milan",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.1": "How do I book a visit?",
      "q.1r": "By calling +39 02 846 7102.",
      "q.2": "When are you open?",
      "q.2r": "Monday to Friday from 10 am to 7 pm, all day; Saturday from 10 am to 3 pm. We are closed on Sundays.",
      "q.3": "What if it’s urgent?",
      "q.3r": "During opening hours, call +39 02 846 7102 straight away.",
      "q.4": "Which animals do you see?",
      "q.4r": "Dogs and cats: from puppies to adopted animals, for their whole lives.",
      "q.5": "Where are you?",
      "q.5r": "At Via Santa Teresa 10/C, between Piazza Abbiategrasso and Via Boifava: M2 Abbiategrasso is 200 metres away. The right street number is 10/C.",
      "z.sotto": "Veterinary surgeon · Via Santa Teresa 10/C, Milan",
      "z.orario": "Monday–Friday 10 am–7 pm, Saturday 10 am–3 pm",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are the clients’, from the Google listing (the brands in the waiting-room photos are blurred); hours and reviews from Google (September 2026). We rebuilt the board at the top ourselves, with their photos.",
      "z.su": "Back to the top ↑",
      "lv.a1": "A dog wearing a cone and a bandage on its head, on the floor at home.",
      "lv.c1": "With the cone and the bandage",
      "lv.a2": "A wire-haired dog photographed up close at home.",
      "lv.c2": "Up close",
      "lv.a3": "A tabby cat standing in the bathroom.",
      "lv.c3": "In the bathroom",
      "lv.a4": "A dog curled up on a white sofa.",
      "lv.c4": "On the sofa",
      "lv.a5": "A dog sitting on a blanket in front of the window.",
      "lv.c5": "At the window",
      "lv.a6": "A tabby cat and a small dog in the hallway at home.",
      "lv.c6": "Two of them, in the hallway",
      "lv.a7": "A grey cat crouching on someone’s legs.",
      "lv.c7": "On a lap",
      "lv.a8": "A reddish dog lying on the bed.",
      "lv.c8": "On the bed"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PISANI DR. PAOLA — «I vostri compagni di vita sono in ottime mani.» ══════════
     La pagina è la loro sala d'attesa: la parete bianca e azzurra, il battiscopa di legno, le sedie verdi.
     la FIRMA — la lavagna dei pazienti: le otto foto che i clienti hanno lasciato su Google arrivano una alla volta dal
     mucchietto in basso a destra (girano, si posano, e su ognuna cade una calamita); per ultimo il biglietto di una cliente,
     con due calamite. Poi le foto si spostano col mouse (col dito no: il dito scorre la pagina) e «Rimetti in ordine» le
     riporta al loro posto; se sono già in ordine, le toglie e le riattacca. Un clic senza trascinare ingrandisce la foto.
     Stato finale = l'HTML (le stampe alle loro posizioni in %). Senza JS: lo stato finale, niente bottone. Con reduced-motion:
     lo stato finale subito, e il riordino senza animazione. L'attesa è la classe firma-attesa dell'head (la lavagna vuota,
     via CSS, solo dentro .lavagna), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a tempo: la firma non dipende
     da GSAP. I dati vengono da _pvt_lavagna.mjs. */
  var DATI = {"stampe":[{"x":3,"y":11,"r":-4},{"x":23,"y":10,"r":3},{"x":50,"y":12,"r":-2},{"x":70,"y":8,"r":4},{"x":3,"y":55,"r":3},{"x":21,"y":51,"r":-3},{"x":38.5,"y":53,"r":5},{"x":54.5,"y":58,"r":-2}],"biglietto":{"r":-3},"mucchio":{"x":92,"y":96,"r":18,"s":0.86},"tempi":{"inizio":250,"passo":260,"volo":560,"calamita":260,"biglietto":2750,"volobiglietto":520,"rimbalzo":1.7,"fine":3650}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraL = prendi('lavagna'), pianoL = prendi('lavagnaPiano'), bigliettoL = prendi('lavagnaBiglietto');
  var ordinaB = prendi('lavagnaOrdina'), leggiL = prendi('lavagnaLeggi');
  var PAZ = pianoL ? [].slice.call(pianoL.querySelectorAll('.paz')) : [];
  var TL = DATI.tempi, MU = DATI.mucchio, ST = DATI.stampe;
  var RIENTRO = { passo: 70, volo: 300, pausa: 150 };
  RIENTRO.durata = ST.length * RIENTRO.passo + RIENTRO.volo + RIENTRO.pausa;
  var faseL = 'fatta', modoL = '', rafL = 0, guardiaL = 0, larghezzaAvvioL = 0, corseL = 0, voci = [], zCima = 3, tornaT = 0;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var entra = function (t) { return t * t * t; };
  var rimbalza = function (t) { var k = TL.rimbalzo; return 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PAROLE = {
    it: { tornate: 'Le foto sono tornate al loro posto.', rientrano: 'Le foto tornano sulla lavagna, una alla volta.', gia: 'Le foto sono già al loro posto.' },
    en: { tornate: 'The photos are back in their places.', rientrano: 'The photos go back on the board, one at a time.', gia: 'The photos are already in their places.' },
  };
  function linguaL() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  function annuncia(chiave) { if (leggiL) leggiL.textContent = PAROLE[linguaL()][chiave]; }

  /* le misure della lavagna e di ogni pezzo (le stampe e il biglietto), prese una volta all'avvio di una corsa */
  function misura() {
    var W = pianoL.clientWidth, H = pianoL.clientHeight;
    return PAZ.concat([bigliettoL]).map(function (el, k) {
      var l = el.offsetLeft, t = el.offsetTop, w = el.offsetWidth, h = el.offsetHeight;
      return {
        el: el, cal: [].slice.call(el.querySelectorAll('.calamita')),
        r: k < ST.length ? ST[k].r : DATI.biglietto.r,
        dx: MU.x / 100 * W - (l + w / 2), dy: MU.y / 100 * H - (t + h / 2),
      };
    });
  }
  /* un pezzo fra il mucchietto (p = 0) e il suo posto (p = 1): fuori dal mucchietto gira e si posa; dopo = ms dall'arrivo,
     per le calamite (cadono, si schiacciano un poco e si fermano) */
  function posa(v, p, dopo) {
    var e = esce(p);
    v.el.style.opacity = r3(c01(p / 0.15));
    v.el.style.transform = 'translate(' + r3(v.dx * (1 - e)) + 'px, ' + r3(v.dy * (1 - e)) + 'px) rotate(' + r3(MU.r + (v.r - MU.r) * rimbalza(p)) + 'deg) scale(' + r3(MU.s + (1 - MU.s) * e) + ')';
    v.cal.forEach(function (c, j) {
      var q = c01((dopo - j * 90) / TL.calamita);
      c.style.opacity = r3(c01(q / 0.35));
      c.style.transform = 'translate(0px, ' + r3(-10 * (1 - esce(q))) + 'px) scale(' + r3(1 + 0.8 * (1 - rimbalza(q))) + ')';
    });
  }
  /* il ritorno nel mucchietto (solo per il riordino di una lavagna già in ordine): prima si stacca la calamita */
  function togli(v, p) {
    var e = entra(p);
    v.el.style.opacity = r3(1 - c01((p - 0.85) / 0.15));
    v.el.style.transform = 'translate(' + r3(v.dx * e) + 'px, ' + r3(v.dy * e) + 'px) rotate(' + r3(v.r + (MU.r - v.r) * e) + 'deg) scale(' + r3(1 + (MU.s - 1) * e) + ')';
    v.cal.forEach(function (c) { c.style.opacity = r3(1 - c01(p / 0.3)); c.style.removeProperty('transform'); });
  }
  function fotogrammaIntro(t) {
    for (var k = 0; k < voci.length; k++) {
      var inizio = k < ST.length ? TL.inizio + k * TL.passo : TL.biglietto;
      var volo = k < ST.length ? TL.volo : TL.volobiglietto;
      posa(voci[k], c01((t - inizio) / volo), t - inizio - volo);
    }
  }
  function fotogrammaRientro(t) {
    if (t >= RIENTRO.durata) { fotogrammaIntro(t - RIENTRO.durata); return; }
    /* per primo il biglietto, poi le stampe dall'ultima alla prima */
    for (var b = 0; b < voci.length; b++) togli(voci[voci.length - 1 - b], c01((t - b * RIENTRO.passo) / RIENTRO.volo));
  }
  function pulisciL(el) { if (!el) return; ['transform', 'opacity'].forEach(function (p) { el.style.removeProperty(p); }); }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la lavagna va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorvegliaL() { clearTimeout(guardiaL); guardiaL = setTimeout(chiudiL, 1500); }
  function chiudiL() {
    cancelAnimationFrame(rafL); rafL = 0;
    clearTimeout(guardiaL);
    PAZ.concat([bigliettoL]).forEach(function (el) {
      pulisciL(el);
      [].forEach.call(el.querySelectorAll('.calamita'), pulisciL);
    });
    figuraL.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseL = 'fatta';
  }
  function avviaL(modo) {
    cancelAnimationFrame(rafL); rafL = 0;
    modoL = modo;
    voci = misura();
    if (modo === 'intro') {
      /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: la lavagna vuota */
      voci.forEach(function (v) { v.el.style.opacity = '0'; v.cal.forEach(function (c) { c.style.opacity = '0'; }); });
    }
    root.classList.remove('firma-attesa');
    faseL = 'corre'; figuraL.setAttribute('data-firma', 'corre');
    larghezzaAvvioL = window.innerWidth;
    var fine = (modo === 'rientro' ? RIENTRO.durata : 0) + TL.fine;
    var t0 = null, corsa = ++corseL;
    function fotogramma(ts) {
      rafL = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseL !== 'corre' || corsa !== corseL) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      if (modo === 'rientro') fotogrammaRientro(t); else fotogrammaIntro(t);
      if (t >= fine) { chiudiL(); return; }
      sorvegliaL();
      rafL = requestAnimationFrame(fotogramma);
    }
    sorvegliaL();
    rafL = requestAnimationFrame(fotogramma);
  }

  /* le stampe spostate (le posizioni sono in % della lavagna: restano giuste se la finestra cambia) */
  function spostate() {
    return PAZ.filter(function (el, i) {
      return el.style.getPropertyValue('--x').trim() !== ST[i].x + '%' || el.style.getPropertyValue('--y').trim() !== ST[i].y + '%';
    });
  }
  /* «Rimetti in ordine»: le stampe spostate tornano al loro posto; se sono già tutte a posto, si staccano e si riattaccano */
  function ordina() {
    if (faseL === 'corre' || root.classList.contains('firma-attesa')) chiudiL();
    var m = spostate();
    if (m.length) {
      m.forEach(function (el) {
        var i = +el.getAttribute('data-i');
        if (!reducedMotion) el.classList.add('torna');
        el.style.setProperty('--x', ST[i].x + '%');
        el.style.setProperty('--y', ST[i].y + '%');
      });
      clearTimeout(tornaT);
      tornaT = setTimeout(function () {
        PAZ.forEach(function (el) { el.classList.remove('torna'); el.style.removeProperty('z-index'); });
        zCima = 3;
      }, reducedMotion ? 0 : 520);
      annuncia('tornate');
    } else if (!reducedMotion) {
      avviaL('rientro');
      annuncia('rientrano');
    } else annuncia('gia');
  }

  /* il trascinamento: col mouse o la penna; parte dopo 5 px (sotto, è un clic e la foto si ingrandisce) */
  var presa = null, ingoia = false, ingoiaT = 0;
  function prendiStampa(e) {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    var el = e.target && e.target.closest ? e.target.closest('.paz') : null;
    if (!el || !pianoL.contains(el)) return;
    if (faseL === 'corre' || root.classList.contains('firma-attesa')) chiudiL();
    /* sy: sui telefoni la y di una stampa vale meno (--scala-y del CSS); la posizione nuova si riscrive nella stessa scala */
    var sy = parseFloat(getComputedStyle(pianoL).getPropertyValue('--scala-y')) || 1;
    presa = { el: el, id: e.pointerId, x0: e.clientX, y0: e.clientY, l0: el.offsetLeft, t0: el.offsetTop, W: pianoL.clientWidth, H: pianoL.clientHeight, sy: sy, mosso: false };
  }
  function muoviStampa(e) {
    if (!presa || e.pointerId !== presa.id) return;
    var dx = e.clientX - presa.x0, dy = e.clientY - presa.y0;
    if (!presa.mosso) {
      if (Math.sqrt(dx * dx + dy * dy) < 5) return;
      presa.mosso = true;
      clearTimeout(tornaT);
      presa.el.classList.remove('torna');
      presa.el.classList.add('presa');
      presa.el.style.zIndex = ++zCima;
      try { presa.el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    e.preventDefault();
    var w = presa.el.offsetWidth, h = presa.el.offsetHeight;
    var l = Math.max(-0.3 * w, Math.min(presa.W - 0.7 * w, presa.l0 + dx));
    var t = Math.max(-0.2 * h, Math.min(presa.H - 0.5 * h, presa.t0 + dy));
    presa.el.style.setProperty('--x', r3(l / presa.W * 100) + '%');
    presa.el.style.setProperty('--y', r3(t / (presa.H * presa.sy) * 100) + '%');
  }
  function lasciaStampa(e) {
    if (!presa || (e && e.pointerId !== presa.id)) return;
    var p = presa; presa = null;
    if (!p.mosso) return;
    p.el.classList.remove('presa');
    /* la calamita «scatta» quando la foto si riattacca */
    p.el.classList.remove('scatta'); void p.el.offsetWidth; p.el.classList.add('scatta');
    setTimeout(function () { p.el.classList.remove('scatta'); }, 320);
    /* il clic che segue il rilascio non ingrandisce la foto appena spostata */
    ingoia = true; clearTimeout(ingoiaT); ingoiaT = setTimeout(function () { ingoia = false; }, 400);
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sul foglio degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);

  /* la lavagna è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra);
     l'altezza è quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaL() {
    var r = pianoL.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  if (figuraL && pianoL && bigliettoL && ordinaB && PAZ.length === ST.length) {
    try { clearTimeout(window.__attesaLavagna); } catch (e) {}
    window.__lavagna = {
      stato: function () {
        return { fase: faseL, modo: modoL, corse: corseL, spostate: spostate().length, torna: PAZ.some(function (el) { return el.classList.contains('torna'); }), presa: !!presa };
      },
      tempi: TL, rientro: RIENTRO,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaL();
    /* perché la firma è partita o no (lo legge il check) */
    window.__lavagna.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: pianoL.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiL();
    else if (inVista) avviaL('intro');
    else if ('IntersectionObserver' in window) {
      /* la lavagna sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioL = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioL.disconnect();
        if (faseL === 'fatta' && root.classList.contains('firma-attesa')) avviaL('intro');
      }, { threshold: soglie });
      ioL.observe(pianoL);
      window.__lavagna.avvio.aspetta = true;
    } else chiudiL();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseL !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioL) <= 1) return;
      chiudiL();
    });
    ordinaB.addEventListener('click', ordina);
    pianoL.addEventListener('pointerdown', prendiStampa);
    window.addEventListener('pointermove', muoviStampa);
    window.addEventListener('pointerup', lasciaStampa);
    window.addEventListener('pointercancel', lasciaStampa);
    /* in cattura: il clic dopo un trascinamento non arriva al bottone della foto (la lightbox) */
    pianoL.addEventListener('click', function (e) {
      if (!ingoia) return;
      ingoia = false;
      e.stopPropagation(); e.preventDefault();
    }, true);
    new MutationObserver(function () { copiaStato(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }
})();
