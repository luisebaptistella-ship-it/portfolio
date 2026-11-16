(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------------------------------------------------------
     Phone menu
     --------------------------------------------------------- */
  const nav = $('.nav');
  const menuBtn = $('.nav__menu');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Header is see-through only at the very top, on the opening's dark strip: its links can't
  // read on the light further down. Its name stays hidden until the opening has scrolled away.
  // Sub-pages have no opening, so their bar is solid from the start.
  const hero = $('.opening');
  const updateNav = () => {
    nav.classList.toggle('is-solid', !hero || scrollY > 8);
    nav.classList.toggle('is-past-opening', !hero || hero.getBoundingClientRect().bottom <= nav.offsetHeight);
    document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
  };
  addEventListener('resize', updateNav);

  /* ---------------------------------------------------------
     Language: English / French / Brazilian Portuguese (copy lives in i18n.js)
     --------------------------------------------------------- */
  const langButtons = $$('[data-lang]');
  const setLang = (lang) => {
    const t = window.I18N[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
    $$('[data-i18n]').forEach((el) => { if (t[el.dataset.i18n] != null) el.textContent = t[el.dataset.i18n]; });
    $$('[data-i18n-html]').forEach((el) => { if (t[el.dataset.i18nHtml] != null) el.innerHTML = t[el.dataset.i18nHtml]; });
    $$('[data-i18n-aria]').forEach((el) => { if (t[el.dataset.i18nAria] != null) el.setAttribute('aria-label', t[el.dataset.i18nAria]); });
    document.title = t[document.body.dataset.titleKey || 'meta.title'];
    $('meta[name="description"]').setAttribute('content', t['meta.description']);
    langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage blocked: keep going */ }
    document.dispatchEvent(new CustomEvent('langchange'));
  };
  const savedLang = (() => { try { return localStorage.getItem('lang'); } catch (e) { return null; } })();
  const browserLang = (navigator.languages || [navigator.language]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => l === 'fr' || l === 'pt') || 'en';
  const startLang = savedLang in window.I18N ? savedLang : browserLang;
  if (startLang !== 'en') setLang(startLang);
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------------------------------------------------------
     Showreel: "Play reel" restarts it with sound, then becomes "Sound off"
     --------------------------------------------------------- */
  const reelVideo = $('.reel__video');
  const soundBtn = $('.reel__sound');
  if (soundBtn && reelVideo) soundBtn.addEventListener('click', () => {
    const turnOn = reelVideo.muted;
    reelVideo.muted = !turnOn;
    if (turnOn) { reelVideo.currentTime = 0; reelVideo.play(); }
    soundBtn.dataset.i18n = turnOn ? 'reel.mute' : 'reel.play';
    soundBtn.setAttribute('aria-pressed', String(turnOn));
    soundBtn.textContent = window.I18N[curLang()][soundBtn.dataset.i18n];
  });
  if (reduceMotion) $$('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  /* ---------------------------------------------------------
     Projects (projects.js): work grid + full-screen project view.
     Anything with data-project="<id>" opens that project.
     --------------------------------------------------------- */
  const PROJECTS = window.PROJECTS || [];
  const curLang = () => { const l = document.documentElement.lang.slice(0, 2); return l in window.I18N ? l : 'en'; };
  const tr = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[curLang()] : v);
  const esc = (str) => String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const imgSrc = (p, name) => `assets/projects/${p.id}/${name}.jpg`;
  // The picture shown before a project is opened (home tile, skill card): p.thumb if set, else the cover
  const thumbSrc = (p) => (p.thumb ? `assets/projects/${p.id}/${p.thumb}` : imgSrc(p, 'cover'));

  const pad = (n) => String(n).padStart(2, '0');
  // "Category · Client · Year" under a project's title; a project may have no client
  const metaLine = (p) => [tr(p.category), tr(p.client), p.year].filter(Boolean).map(esc).join(' · ');

  const grid = $('[data-work-grid]');
  const renderGrid = () => {
    if (!grid) return;
    grid.innerHTML = PROJECTS.filter((p) => p.featured).map((p) => `
      <a class="tile" href="#p-${p.id}" data-project="${p.id}">
        <span class="tile__head"><span>${esc(p.title)}</span><svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3l9 9-9 9"/></svg></span>
        <span class="tile__img"><img src="${thumbSrc(p)}" alt="" loading="lazy"></span>
        <span class="tile__meta">${metaLine(p)}</span>
      </a>`).join('');
  };
  renderGrid();

  /* Skill page (skill.html?s=<id>): title, intro and that skill's projects */
  const SKILLS = window.SKILLS || [];
  // Skill page card: the project's loop (card = a short clip made for the card, video = the project's own loop), else its cover
  const projectMedia = (p) => (p.card || p.video
    ? `<video src="assets/projects/${p.id}/${p.card || p.video}" poster="${imgSrc(p, 'cover')}" ${reduceMotion ? '' : 'autoplay'} muted loop playsinline></video>`
    : `<img src="${thumbSrc(p)}" alt="" loading="lazy">`);
  const skillPage = $('[data-skill-page]');
  const pageSkill = skillPage
    ? SKILLS.find((k) => k.id === new URLSearchParams(location.search).get('s')) || SKILLS[0]
    : null;

  const renderSkillPage = () => {
    if (!pageSkill) return;
    const t = window.I18N[curLang()];
    const name = t[pageSkill.name];
    const items = pageSkill.projects.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
    document.title = `${name} — Luise Baptistella`;
    $('.skillpage__num', skillPage).textContent = `(${pad(SKILLS.indexOf(pageSkill) + 1)})`;
    $('.skillpage__title', skillPage).textContent = name;
    $('.skillpage__intro', skillPage).textContent = pageSkill.intro[curLang()];
    $('.skillpage__count', skillPage).textContent = `${items.length} ${t['page.projects']}`;
    $('.skillpage__list', skillPage).innerHTML = items.map((p, k) => `
      <article class="sproject">
        <a class="sproject__media" href="#p-${p.id}" data-project="${p.id}" aria-label="${esc(p.title)}">${projectMedia(p)}</a>
        <div class="sproject__body">
          <span class="sproject__num">${pad(k + 1)}</span>
          <h2 class="sproject__title">${esc(p.title)}</h2>
          <p class="sproject__meta">${metaLine(p)}</p>
          <p class="sproject__text">${esc((p.text[curLang()] || p.text.en)[0])}</p>
          <a class="pill" href="#p-${p.id}" data-project="${p.id}">${esc(t['project.open'])} →</a>
        </div>
      </article>`).join('');
    $('.skillpage__others ul', skillPage).innerHTML = SKILLS.filter((k) => k !== pageSkill).map((k) => `
      <li><a href="skill.html?s=${k.id}"><span>${esc(t[k.name])}</span><svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3l9 9-9 9"/></svg></a></li>`).join('');
  };
  renderSkillPage();

  // Project view. On a skill page, "Next project" stays within that skill's projects.
  const scope = pageSkill ? pageSkill.projects : PROJECTS.map((p) => p.id);
  const dialog = $('#project');
  let current = -1;                       // position in scope

  // A project's posts and reels: one row each, moved with the arrows, a swipe or the keyboard (the row is focusable).
  // p.posts = how many pictures, files posts/01.jpg, 02.jpg…; p.reels = how many videos, files reels/01.mp4 + 01.jpg (cover).
  // Reels play with their sound when the visitor presses play, one at a time.
  const postsHTML = (p, kind) => {
    const t = window.I18N[curLang()];
    const dir = `assets/projects/${p.id}/${kind}`;
    const items = Array.from({ length: p[kind] }, (_, n) => {
      const name = esc(`${p.title}, ${t[`${kind}.item`]} ${n + 1}`);
      return kind === 'reels'
        ? `
          <li class="posts__item"><video src="${dir}/${pad(n + 1)}.mp4" poster="${dir}/${pad(n + 1)}.jpg" aria-label="${name}" width="720" height="1280" controls playsinline preload="none"></video></li>`
        : `
          <li class="posts__item"><img src="${dir}/${pad(n + 1)}.jpg" alt="${name}" width="1080" height="1350" decoding="async"></li>`;
    }).join('');
    return `
      <section class="posts posts--${kind}" aria-label="${esc(t[`${kind}.title`])}">
        <div class="posts__head">
          <h3 class="posts__title">${esc(t[`${kind}.title`])} <span>(${pad(p[kind])})</span></h3>
          <div class="posts__nav">
            <button class="posts__btn" type="button" data-step="-1" aria-label="${esc(t[`${kind}.prev`])}"><svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3l-9 9 9 9"/></svg></button>
            <button class="posts__btn" type="button" data-step="1" aria-label="${esc(t[`${kind}.next`])}"><svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3l9 9-9 9"/></svg></button>
          </div>
        </div>
        <ul class="posts__track" tabindex="0" aria-label="${esc(t[`${kind}.title`])}">${items}
        </ul>
      </section>`;
  };
  const initPosts = (root) => {
    const track = $('.posts__track', root);
    const [prev, next] = $$('.posts__btn', root);
    const nav = $('.posts__nav', root);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      nav.hidden = max <= 2;                  // everything fits: no arrows
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    new ResizeObserver(update).observe(track);
    root.update = update;                     // openProject runs it again once the dialog is open and measurable
    // one post per click: the next post whose left edge is past the row's left edge, or the one before it
    const go = (step) => {
      const items = $$('.posts__item', track);
      const x = track.scrollLeft;
      const target = step > 0
        ? items.find((it) => it.offsetLeft > x + 2)
        : items.reverse().find((it) => it.offsetLeft < x - 2);
      track.scrollTo({ left: target ? target.offsetLeft : (step > 0 ? track.scrollWidth : 0), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    $$('img', track).forEach((img) => img.addEventListener('load', update));
    // one reel at a time: starting one pauses the others (play doesn't bubble, so listen while capturing)
    track.addEventListener('play', (e) => $$('video', track).forEach((v) => { if (v !== e.target) v.pause(); }), true);
    update();
  };

  const fill = (k) => {
    const p = PROJECTS.find((x) => x.id === scope[k]);
    current = k;
    const hero = $('.project__hero', dialog);
    hero.hidden = !p.hero;
    hero.innerHTML = p.hero
      ? `<video src="assets/projects/${p.id}/${p.hero}" poster="assets/projects/${p.id}/${p.hero.replace('.mp4', '.jpg')}" ${reduceMotion ? '' : 'autoplay'} muted loop playsinline controls></video>`
      : '';
    $('.project__count', dialog).textContent = `${pad(k + 1)} / ${pad(scope.length)}`;
    $('.project__title', dialog).textContent = p.title;
    const client = $('[data-field="client"]', dialog);
    client.textContent = tr(p.client) || '';
    client.parentElement.hidden = !p.client;            // no client: no Client row
    $('[data-field="year"]', dialog).textContent = p.year;
    $('[data-field="category"]', dialog).textContent = tr(p.category);
    $('.project__text', dialog).innerHTML = (p.text[curLang()] || p.text.en).map((para) => `<p>${esc(para)}</p>`).join('');
    const deliv = p.deliverables && p.deliverables[curLang()];
    $('.project__deliv', dialog).hidden = !deliv;
    $('.project__deliv ul', dialog).innerHTML = deliv ? deliv.map((d) => `<li>${esc(d)}</li>`).join('') : '';
    const media = [];
    if (p.video) media.push(`<video src="assets/projects/${p.id}/${p.video}" poster="${imgSrc(p, 'cover')}" autoplay muted loop playsinline controls></video>`);
    const film = p.film && `<video src="assets/projects/${p.id}/${p.film}" poster="assets/projects/${p.id}/${p.film.replace('.mp4', '.jpg')}" ${reduceMotion ? '' : 'autoplay'} muted loop playsinline controls></video>`;
    if (film && !p.images.includes('cover')) media.push(film);   // cover kept for the card only: the film comes first
    p.images.forEach((name, n) => {
      if (p.video && name === 'cover') return;
      media.push(`<img src="${imgSrc(p, name)}" alt="${esc(p.title)}, ${n + 1}" loading="lazy">`);
      if (name === 'cover' && film) media.push(film);
    });
    const mediaBox = $('.project__media', dialog);
    const rows = ['posts', 'reels'].filter((kind) => p[kind]);
    mediaBox.innerHTML = media.join('') + rows.map((kind) => postsHTML(p, kind)).join('');
    mediaBox.classList.toggle('project__media--wide', rows.length > 0);
    $$('.posts', mediaBox).forEach(initPosts);
    $('.project__next strong', dialog).textContent = PROJECTS.find((x) => x.id === scope[(k + 1) % scope.length]).title;
    dialog.scrollTop = 0;
  };

  const openProject = (id) => {
    const k = scope.indexOf(id);
    if (!dialog || k < 0) return;
    fill(k);
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('has-dialog');
    }
    $$('.posts', dialog).forEach((s) => s.update());
    history.replaceState(null, '', `${location.pathname}${location.search}#p-${id}`);
  };
  if (dialog) {
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('has-dialog');
      $('.project__media', dialog).innerHTML = '';          // stops any video
      $('.project__hero', dialog).innerHTML = '';
      history.replaceState(null, '', location.pathname + location.search);
    });
    $('.project__close', dialog).addEventListener('click', () => dialog.close());
    $('.project__next', dialog).addEventListener('click', () => openProject(scope[(current + 1) % scope.length]));
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-project]');
    if (!link || !dialog) return;
    e.preventDefault();
    openProject(link.dataset.project);
  });
  document.addEventListener('langchange', () => {
    renderGrid();
    renderSkillPage();
    if (dialog && dialog.open) fill(current);
  });
  const openFromHash = () => { if (location.hash.startsWith('#p-')) openProject(location.hash.slice(3)); };
  openFromHash();
  addEventListener('hashchange', openFromHash);

  /* ---------------------------------------------------------
     Skills: hover (or scroll on touch) reveals a project card
     --------------------------------------------------------- */
  const list = $('.skills__list');
  const narrow = matchMedia('(max-width: 760px)');
  const docked = () => !finePointer.matches || narrow.matches;
  let hitTest = () => {};
  let centerTest = () => {};
  if (list) {
    const skills = $$('.skill', list);
    const preview = $('.preview');
    const cards = $$('.preview__card', preview);

    let active = -1;
    let z = 1;
    let mx = -1, my = -1;            // pointer
    let px = 0, py = 0, tilt = 0;    // card position (eased)
    let following = false;

    const place = () => {
      preview.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
    };

    const follow = () => {
      const dx = mx - px;
      const dy = my - py;
      px += dx * 0.16;
      py += dy * 0.16;
      tilt += (clamp(dx * 0.06, -10, 10) - tilt) * 0.12;
      place();
      if (active > -1 || Math.abs(dx) + Math.abs(dy) > 0.5) requestAnimationFrame(follow);
      else following = false;
    };

    const startFollow = () => {
      if (docked()) return;
      if (reduceMotion) { px = mx; py = my; tilt = 0; place(); return; }
      if (!following) { following = true; requestAnimationFrame(follow); }
    };

    const setActive = (i) => {
      if (i === active) return;
      if (active === -1 && i > -1 && !docked()) { px = mx; py = my; tilt = 0; place(); }
      active = i;
      list.classList.toggle('has-active', i > -1);
      skills.forEach((s, k) => s.classList.toggle('is-active', k === i));
      preview.classList.toggle('is-on', i > -1);
      cards.forEach((c, k) => {
        clearTimeout(c._t);
        const v = $('video', c);
        if (v) { if (k === i && !reduceMotion) v.play().catch(() => {}); else v.pause(); }
        if (k === i) {
          c.style.zIndex = ++z;           // new card wipes in on top
          c.classList.add('is-active');
        } else if (i > -1) {
          c._t = setTimeout(() => c.classList.remove('is-active'), 600);
        } else {
          c.classList.remove('is-active');
        }
      });
      if (i > -1) startFollow();
    };

    // Desktop: whatever skill is under the pointer
    hitTest = () => {
      if (mx < 0) return;
      const el = document.elementFromPoint(mx, my);
      const s = el && el.closest('.skill');
      setActive(s ? skills.indexOf(s) : -1);
    };

    // Touch: the skill closest to the middle of the screen
    centerTest = () => {
      const r = list.getBoundingClientRect();
      const mid = innerHeight * 0.45;
      if (r.top > mid || r.bottom < mid) return setActive(-1);
      let best = -1;
      let bestD = Infinity;
      skills.forEach((s, k) => {
        const b = s.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < bestD) { bestD = d; best = k; }
      });
      setActive(best);
    };

    const applyMode = () => {
      preview.classList.toggle('is-docked', docked());
      setActive(-1);
      if (docked()) centerTest();
    };
    finePointer.addEventListener('change', applyMode);
    narrow.addEventListener('change', applyMode);
    applyMode();

    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || docked()) return;
      mx = e.clientX;
      my = e.clientY;
      hitTest();
      if (active > -1) startFollow();
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => { if (!docked()) setActive(-1); });

    // Keyboard: tabbing through the skills shows their projects too
    list.addEventListener('focusin', (e) => {
      const s = e.target.closest('.skill');
      if (!s || !s.matches(':focus-visible') || docked()) return;
      const b = s.getBoundingClientRect();
      mx = b.left + b.width * 0.66;
      my = b.top + b.height / 2;
      setActive(skills.indexOf(s));
    });
    list.addEventListener('focusout', (e) => {
      if (!list.contains(e.relatedTarget)) setActive(-1);
    });
  }

  /* ---------------------------------------------------------
     Marquees: logo band and the two tool rows.
     data-marquee="follow": drifts with the scroll direction (logos)
     data-marquee="left" / "right": always that way (tool rows)
     All speed up while scrolling and pause on hover.
     --------------------------------------------------------- */
  const makeMarquee = (root) => {
    const mode = root.dataset.marquee || 'follow';
    const track = $('.marquee__track', root);
    const originals = [...track.children];
    let unit = 0, offset = 0, speed = 0, boost = 0;
    let dir = mode === 'right' ? 1 : -1;
    let hovering = false, visible = false, last = 0;

    const build = () => {
      $$('[data-clone]', track).forEach((n) => n.remove());
      unit = track.getBoundingClientRect().width;
      if (!unit) return;
      const copies = Math.ceil(root.clientWidth / unit) + 1;
      for (let c = 0; c < copies; c++) {
        originals.forEach((o) => {
          const n = o.cloneNode(true);
          n.setAttribute('aria-hidden', 'true');
          n.dataset.clone = '';
          track.appendChild(n);
        });
      }
    };

    const tick = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      speed += ((hovering ? 0 : 70 + boost) - speed) * 0.08;
      boost *= 0.93;
      offset += dir * speed * dt;
      if (unit) {
        if (offset <= -unit) offset += unit;
        if (offset > 0) offset -= unit;
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      if (visible) requestAnimationFrame(tick);
      else last = 0;
    };

    if (reduceMotion) {
      root.classList.add('is-static');
      return { kick() {} };
    }
    document.fonts.ready.then(build);
    addEventListener('load', build);     // images measured
    addEventListener('resize', build);
    root.addEventListener('pointerenter', () => { hovering = true; });
    root.addEventListener('pointerleave', () => { hovering = false; });
    new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) requestAnimationFrame(tick);
    }).observe(root);

    return {
      kick(dy) {
        if (mode === 'follow') dir = dy > 0 ? -1 : 1;
        boost = Math.min(900, boost + Math.abs(dy) * 4);
      },
    };
  };
  const marquees = $$('[data-marquee]').map(makeMarquee);

  /* ---------------------------------------------------------
     No brief: posters pop up along the cursor's path.
     Touch screens: a tap drops one, and they appear on their own while visible.
     --------------------------------------------------------- */
  const trail = $('[data-trail]');
  if (trail) {
    const stage = $('.nobrief__stage', trail);
    const srcs = $$('.nobrief__list img', trail).map((i) => i.getAttribute('src'));
    let n = 0, zTop = 1, lastX = null, lastY = null, inView = false, auto = 0;

    const spawn = (x, y) => {
      const img = document.createElement('img');
      img.className = 'nobrief__poster';
      img.src = srcs[n++ % srcs.length];
      img.alt = '';
      const base = `translate(-50%, -50%) rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.zIndex = ++zTop;
      img.style.transform = base;
      stage.appendChild(img);
      while (stage.children.length > 14) stage.firstElementChild.remove();
      if (reduceMotion) { setTimeout(() => img.remove(), 1600); return; }
      img.animate(
        [{ transform: `${base} scale(.2)` }, { transform: `${base} scale(1.05)`, offset: .7 }, { transform: `${base} scale(1)` }],
        { duration: 380, easing: 'cubic-bezier(.2, .8, .2, 1)' },
      );
      setTimeout(() => {
        img.animate([{ transform: `${base} scale(1)` }, { transform: `${base} scale(0)` }],
          { duration: 420, easing: 'cubic-bezier(.7, 0, .8, .4)', fill: 'forwards' }).onfinish = () => img.remove();
      }, 1100);
    };

    const local = (e) => {
      const r = trail.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    trail.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const [x, y] = local(e);
      const gap = Math.max(90, innerWidth * 0.08);
      if (lastX === null || Math.hypot(x - lastX, y - lastY) > gap) {
        spawn(x, y);
        lastX = x;
        lastY = y;
      }
    });
    trail.addEventListener('pointerleave', () => { lastX = null; });
    trail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') spawn(...local(e));
    });

    // Load the posters just before the section arrives; on touch, drop them on a timer while visible
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) srcs.forEach((src) => { new Image().src = src; });
      clearInterval(auto);
      if (inView && !finePointer.matches && !reduceMotion) {
        auto = setInterval(() => {
          spawn(trail.clientWidth * (0.15 + Math.random() * 0.7), trail.clientHeight * (0.15 + Math.random() * 0.7));
        }, 900);
      }
    }, { rootMargin: '300px 0px' }).observe(trail);
  }

  /* ---------------------------------------------------------
     Contact form (contact.html): sends through FormSubmit, which emails the message on.
     If it can't send, the visitor gets an email link with their message already in it.
     --------------------------------------------------------- */
  const contactForm = $('[data-contact-form]');
  if (contactForm) {
    contactForm.noValidate = true;   // our messages follow the site's language; without JS the browser's still apply
    const sendBtn = $('.form__send', contactForm);
    const failed = $('[data-form-failed]');
    const done = $('[data-form-done]');
    const required = $$('[required]', contactForm);
    const say = (el, key) => {
      el.dataset.i18n = key;
      el.textContent = window.I18N[curLang()][key];
    };
    const check = (field) => {
      const error = $(`#${field.id}-error`);
      const key = !field.value.trim() ? 'form.errRequired' : field.validity.typeMismatch ? 'form.errEmail' : '';
      error.hidden = !key;
      if (key) { say(error, key); field.setAttribute('aria-invalid', 'true'); } else field.removeAttribute('aria-invalid');
      return !key;
    };
    required.forEach((field) => field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) check(field);
    }));
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalid = required.filter((field) => !check(field));
      if (invalid.length) { invalid[0].focus(); return; }
      failed.hidden = true;
      sendBtn.disabled = true;
      say(sendBtn, 'form.sending');
      const data = Object.fromEntries(new FormData(contactForm));
      try {
        const res = await fetch(contactForm.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _replyto: data.email }),
        });
        const out = await res.json();
        if (String(out.success) !== 'true') throw new Error(out.message);   // it can answer with the text "false"
        contactForm.hidden = true;
        done.hidden = false;
        done.focus();
      } catch (err) {
        console.error('Contact form:', err.message);
        const link = $('a', failed);
        const body = ['name', 'email', 'phone', 'company', 'message'].map((k) => data[k]).filter(Boolean).join('\n\n');
        link.href = `${link.href.split('?')[0]}?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(body)}`;
        failed.hidden = false;
      }
      sendBtn.disabled = false;
      say(sendBtn, 'form.send');
    });
  }

  /* ---------------------------------------------------------
     One scroll handler for everything
     --------------------------------------------------------- */
  let lastY = scrollY;
  let queued = false;
  const onScroll = () => {
    queued = false;
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (dy) marquees.forEach((m) => m.kick(dy));
    updateNav();
    if (docked()) centerTest();
    else hitTest();
  };
  addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  updateNav();
})();
