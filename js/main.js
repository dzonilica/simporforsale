/* Simpor Premium - main.js */

(function(){
  // Loader
  window.addEventListener('load', function(){
    const l = document.getElementById('loader');
    if(l){ setTimeout(()=>l.classList.add('done'), 350); }
  });

  // Nav scroll state
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if(!nav) return;
    if(window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Mobile menu
  const burger = document.getElementById('hamburger');
  const mobile = document.getElementById('mobileMenu');
  if(burger && mobile){
    burger.addEventListener('click', function(){
      burger.classList.toggle('active');
      mobile.classList.toggle('open');
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
      burger.classList.remove('active');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    }));
    mobile.querySelectorAll('.mobile-submenu-toggle').forEach(btn => {
      btn.addEventListener('click', function(){
        const parent = this.closest('.mobile-submenu');
        parent.classList.toggle('open');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if(q){ q.addEventListener('click', () => item.classList.toggle('open')); }
  });

  // Inline story-card video player
  document.querySelectorAll('.story-card[data-video]').forEach(card => {
    const video = card.querySelector('video');
    if(!video) return;
    card.addEventListener('click', () => {
      if(card.classList.contains('playing')) return;
      card.classList.add('playing');
      video.controls = true;
      video.muted = false;
      const p = video.play();
      if(p && typeof p.catch === 'function') p.catch(()=>{});
    });
    video.addEventListener('ended', () => {
      card.classList.remove('playing');
      video.controls = false;
      video.currentTime = 0;
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ══════ Lightbox (used by intro-mosaic / champions if present) ══════ */
  const lb     = document.getElementById('lb');
  const lbImg  = document.getElementById('lbImg');
  const lbClose= document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let gallery = [];
  let current = 0;

  function lbOpen(imgs, idx){
    if(!lb) return;
    gallery = imgs;
    current = idx;
    lbShow();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lbShow(){
    if(!lb) return;
    lbImg.src = gallery[current];
    lbPrev.classList.toggle('hidden', current === 0);
    lbNext.classList.toggle('hidden', current === gallery.length - 1);
  }
  function lbExit(){
    if(!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  if(lb){
    lbClose.addEventListener('click', lbExit);
    lb.addEventListener('click', function(e){ if(e.target === lb) lbExit(); });
    lbPrev.addEventListener('click', function(){ if(current > 0){ current--; lbShow(); } });
    lbNext.addEventListener('click', function(){ if(current < gallery.length - 1){ current++; lbShow(); } });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') lbExit();
      if(e.key === 'ArrowLeft'  && current > 0){ current--; lbShow(); }
      if(e.key === 'ArrowRight' && current < gallery.length - 1){ current++; lbShow(); }
    });
  }

  function attachGallery(selector){
    const links = Array.from(document.querySelectorAll(selector));
    if(!links.length) return;
    const srcs = links.map(a => a.getAttribute('href'));
    links.forEach(function(a, i){
      a.addEventListener('click', function(e){
        e.preventDefault();
        lbOpen(srcs, i);
      });
    });
  }
  attachGallery('.intro-mosaic-strip a');
  attachGallery('.champ-item');
  attachGallery('.collage a');

  /* ══════ DOG SHOWCASE - breed tabs + card render ══════ */
  const showcase = document.getElementById('dogShowcase');
  const tabs     = document.querySelectorAll('#breedTabs .breed-tab');
  const soldGrid = document.getElementById('soldGrid');
  const dogs     = window.SIMPOR_DOGS || [];
  const sold     = window.SIMPOR_SOLD || [];
  const countries= window.SIMPOR_COUNTRIES || [];

  function galleryBadge(count){
    if(!count || count < 2) return '';
    return (
      '<span class="dog-gallery-count">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 21h10M8 17l3-4 3 3 2-2 3 4"/></svg>'+
        count+'</span>'
    );
  }

  function displayName(d){
    return (d.breedLabel || 'Working Dog') + ' Example';
  }

  function specChips(d){
    // Pull the 3 most-signal chips out of specs (Titles, Health, Pedigree)
    const chips = [];
    if(d.specs){
      if(d.specs.Titles)  chips.push(d.specs.Titles);
      if(d.specs.Health)  chips.push(d.specs.Health);
      if(d.specs.Pedigree)chips.push(d.specs.Pedigree.replace(' registered',''));
    }
    if(!chips.length) return '';
    return '<div class="dog-chips">'+chips.map(c => '<span class="dog-chip">'+c+'</span>').join('')+'</div>';
  }

  function dogCardHTML(d, opts){
    opts = opts || {};
    const gCount = (d.gallery && d.gallery.length) || 0;
    const classes = ['dog-card','dog-card-clickable','dog-card-featured','dog-card-available'];
    const topTag = opts.featured
      ? '<span class="dog-featured-tag">Featured</span>'
      : '<span class="dog-available-tag">Available</span>';

    const label = displayName(d);
    return (
      '<article class="'+classes.join(' ')+'" data-dog-id="'+d.id+'">'+
        '<div class="dog-media">'+
          galleryBadge(gCount)+
          topTag+
          '<img src="'+d.cover+'" alt="'+label+'" loading="lazy"/>'+
        '</div>'+
        '<div class="dog-info">'+
          '<span class="dog-featured-eyebrow">'+d.breedLabel+'</span>'+
          '<div class="dog-name">'+label+'</div>'+
          '<div class="dog-meta">'+d.sex+' · '+d.age+' · '+d.purpose+'</div>'+
          '<p class="dog-featured-desc">'+(d.desc || '')+'</p>'+
          specChips(d)+
          '<div class="dog-price">'+d.price+'</div>'+
          '<span class="btn btn-primary btn-arrow dog-card-cta">View Full Profile</span>'+
        '</div>'+
      '</article>'
    );
  }

  function soldCardHTML(d, opts){
    opts = opts || {};
    const classes = ['dog-card','dog-card-clickable','dog-card-featured','sold'];
    const label = displayName(d);

    return (
      '<article class="'+classes.join(' ')+'" data-dog-id="'+d.id+'" data-sold="1">'+
        '<div class="dog-media">'+
          '<span class="sold-stamp" aria-label="Sold">'+
            '<span class="sold-stamp-frame">'+
              '<span class="sold-stamp-word">Sold</span>'+
            '</span>'+
          '</span>'+
          '<img src="'+d.cover+'" alt="'+label+'" loading="lazy"/>'+
        '</div>'+
        '<div class="dog-info">'+
          '<span class="dog-featured-eyebrow">'+d.breedLabel+'</span>'+
          '<div class="dog-name">'+label+'</div>'+
          '<div class="dog-meta">'+d.sex+' · '+d.age+' · '+d.purpose+'</div>'+
          '<p class="dog-featured-desc">'+(d.desc || '')+'</p>'+
          specChips(d)+
          '<div class="dog-placed">'+d.placed+'</div>'+
          '<span class="btn btn-outline btn-arrow dog-card-cta">Read Placement Story</span>'+
        '</div>'+
      '</article>'
    );
  }

  function renderDogs(filter){
    if(!showcase) return;
    const list = filter === 'all' ? dogs : dogs.filter(d => d.breed === filter);
    if(!list.length){
      showcase.innerHTML = '<div class="dogs-empty">No dogs currently listed under this breed. Contact us for upcoming availability.</div>';
      return;
    }
    showcase.innerHTML = list.map((d, i) => dogCardHTML(d, { featured: i === 0 })).join('');
    bindDogCards(showcase, dogs);
  }

  function renderSold(){
    if(!soldGrid) return;
    const INITIAL = 3;
    const isIndex = !!soldGrid.closest('#sold-dogs');
    const shouldLimit = isIndex && sold.length > INITIAL;

    function paint(showAll){
      const list = shouldLimit && !showAll ? sold.slice(0, INITIAL) : sold;
      soldGrid.innerHTML = list.map((d, i) => soldCardHTML(d, { featured: i === 0 })).join('');
      bindDogCards(soldGrid, sold);
    }

    paint(false);

    if(!shouldLimit) return;

    // Avoid stacking toggles on repeated calls
    const existing = document.getElementById('soldToggleWrap');
    if(existing) existing.remove();

    const wrap = document.createElement('div');
    wrap.id = 'soldToggleWrap';
    wrap.className = 'center mt-lg';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline btn-arrow sold-toggle';
    btn.setAttribute('data-i18n', 'home.sold.more');
    btn.textContent = 'Show More';

    wrap.appendChild(btn);
    soldGrid.after(wrap);

    let showingAll = false;
    btn.addEventListener('click', function(){
      showingAll = !showingAll;
      paint(showingAll);
      btn.setAttribute('data-i18n', showingAll ? 'home.sold.less' : 'home.sold.more');
      btn.textContent = showingAll ? 'Show Less' : 'Show More';
      if(typeof window.setLang === 'function'){
        const cur = document.documentElement.getAttribute('lang') || 'en';
        window.setLang(cur);
      }
      if(!showingAll){
        // Scroll back up to the sold section header for a natural collapse
        const head = document.querySelector('#sold-dogs .section-head');
        if(head) head.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  }

  function bindDogCards(root, dataset){
    root.querySelectorAll('.dog-card-clickable').forEach(card => {
      card.addEventListener('click', function(){
        const id = this.getAttribute('data-dog-id');
        const dog = dataset.find(d => d.id === id);
        if(!dog) return;
        // Sold dogs open the legacy modal; available dogs navigate to their own page
        if(this.getAttribute('data-sold')){
          openDogModal(dog, true);
        } else {
          window.location.href = 'dogs/' + dog.id + '.html';
        }
      });
    });
  }

  if(tabs.length){
    tabs.forEach(t => t.addEventListener('click', function(){
      tabs.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      renderDogs(this.getAttribute('data-breed'));
    }));
  }
  renderDogs('all');
  renderSold();

  /* ══════ Country tiles (map summary) ══════ */
  const tiles = document.getElementById('countryTiles');
  if(tiles && countries.length){
    tiles.innerHTML = countries.map(c =>
      '<div class="country-tile" data-country="'+c.name+'">'+
        '<span class="country-flag">'+c.flag+'</span>'+
        '<span class="country-name">'+c.name+'</span>'+
        '<span class="country-count">'+c.dogs+' dogs</span>'+
      '</div>'
    ).join('');
  }

  /* ══════ World map tooltip ══════ */
  const wmap = document.getElementById('worldMap');
  const wtip = document.getElementById('worldMapTooltip');
  if(wmap && wtip){
    const dots = wmap.querySelectorAll('.dot-group');
    dots.forEach(dot => {
      dot.addEventListener('mouseenter', function(e){
        const country = this.getAttribute('data-country');
        const d = this.getAttribute('data-dogs');
        const y = this.getAttribute('data-year');
        wtip.querySelector('.tt-country').textContent = country;
        wtip.querySelector('.tt-dogs').textContent = (isNaN(parseInt(d,10)) ? d : d+' dogs')+' · '+y;
        wtip.classList.add('show');
      });
      dot.addEventListener('mousemove', function(e){
        const rect = wmap.getBoundingClientRect();
        wtip.style.left = (e.clientX - rect.left) + 'px';
        wtip.style.top  = (e.clientY - rect.top - 12) + 'px';
      });
      dot.addEventListener('mouseleave', function(){ wtip.classList.remove('show'); });
      // click on dot → highlight corresponding country tile if present
      dot.addEventListener('click', function(){
        const name = this.getAttribute('data-country');
        const tile = document.querySelector('.country-tile[data-country="'+name+'"]');
        if(tile){
          tile.scrollIntoView({behavior:'smooth', block:'center'});
          tile.classList.add('flash');
          setTimeout(()=>tile.classList.remove('flash'), 1400);
        }
      });
    });
  }

  /* ══════ Dog Detail Modal ══════ */
  const modal        = document.getElementById('dogModal');
  const modalClose   = document.getElementById('dogModalClose');
  const modalMain    = document.getElementById('dogModalMainImg');
  const modalThumbs  = document.getElementById('dogModalThumbs');
  const modalPrev    = document.getElementById('dogModalPrev');
  const modalNext    = document.getElementById('dogModalNext');
  const mBreed       = document.getElementById('dogModalBreed');
  const mName        = document.getElementById('dogModalName');
  const mMeta        = document.getElementById('dogModalMeta');
  const mDesc        = document.getElementById('dogModalDesc');
  const mSpecs       = document.getElementById('dogModalSpecs');
  const mPrice       = document.getElementById('dogModalPrice');
  const mInquire     = document.getElementById('dogModalInquire');

  let modalGallery = [];
  let modalIdx = 0;

  function openDogModal(dog, isSold){
    if(!modal) return;
    modalGallery = dog.gallery && dog.gallery.length ? dog.gallery : [dog.cover];
    modalIdx = 0;

    mBreed.textContent = dog.breedLabel;
    mName.textContent  = isSold ? displayName(dog) : dog.name;
    mMeta.textContent  = dog.sex+' · '+dog.age+' · '+dog.purpose;
    mDesc.textContent  = dog.desc;
    mPrice.textContent = isSold ? dog.placed : dog.price;
    mInquire.href      = 'contact.html?dog='+encodeURIComponent(dog.id);
    mInquire.textContent = isSold ? 'Ask About A Similar Dog' : 'Inquire About This Dog';

    // specs
    mSpecs.innerHTML = '';
    if(dog.specs){
      Object.keys(dog.specs).forEach(k => {
        const li = document.createElement('li');
        li.innerHTML = '<span class="spec-k">'+k+'</span><span class="spec-v">'+dog.specs[k]+'</span>';
        mSpecs.appendChild(li);
      });
    }

    // thumbs
    modalThumbs.innerHTML = modalGallery.map((src,i) =>
      '<button class="dog-modal-thumb'+(i===0?' active':'')+'" data-idx="'+i+'"><img src="'+src+'" alt=""/></button>'
    ).join('');
    modalThumbs.querySelectorAll('.dog-modal-thumb').forEach(t => {
      t.addEventListener('click', function(){
        modalIdx = parseInt(this.getAttribute('data-idx'),10);
        showModalImg();
      });
    });

    showModalImg();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showModalImg(){
    modalMain.src = modalGallery[modalIdx];
    modalThumbs.querySelectorAll('.dog-modal-thumb').forEach((t,i) => t.classList.toggle('active', i===modalIdx));
    if(modalPrev) modalPrev.classList.toggle('hidden', modalIdx===0);
    if(modalNext) modalNext.classList.toggle('hidden', modalIdx===modalGallery.length-1);
  }

  function closeDogModal(){
    if(!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalMain.src = '';
  }

  if(modal){
    modalClose.addEventListener('click', closeDogModal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeDogModal(); });
    if(modalPrev) modalPrev.addEventListener('click', ()=>{ if(modalIdx>0){ modalIdx--; showModalImg(); } });
    if(modalNext) modalNext.addEventListener('click', ()=>{ if(modalIdx<modalGallery.length-1){ modalIdx++; showModalImg(); } });
    document.addEventListener('keydown', function(e){
      if(!modal.classList.contains('open')) return;
      if(e.key === 'Escape') closeDogModal();
      if(e.key === 'ArrowLeft'  && modalIdx>0){ modalIdx--; showModalImg(); }
      if(e.key === 'ArrowRight' && modalIdx<modalGallery.length-1){ modalIdx++; showModalImg(); }
    });
  }

  // Expose for external callers (e.g. inline "Inquire" buttons)
  window.openDogModal = openDogModal;

  /* ══════ Lightbox for sold-dog modal images ══════ */
  if(modal){
    let lb = null;
    let lbImg = null;
    let lbCounter = null;
    let lbIdx = 0;

    function buildLightbox(){
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close">&#215;</button>' +
        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous">&#8592;</button>' +
        '<img class="lightbox-img" src="" alt=""/>' +
        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next">&#8594;</button>' +
        '<div class="lightbox-counter"></div>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('.lightbox-img');
      lbCounter = lb.querySelector('.lightbox-counter');

      lb.querySelector('.lightbox-close').addEventListener('click', closeLB);
      lb.querySelector('.lightbox-prev').addEventListener('click', function(e){ e.stopPropagation(); prevLB(); });
      lb.querySelector('.lightbox-next').addEventListener('click', function(e){ e.stopPropagation(); nextLB(); });
      lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
    }
    function renderLB(){
      if(!modalGallery.length) return;
      lbImg.src = modalGallery[lbIdx];
      lbCounter.textContent = (lbIdx + 1) + ' / ' + modalGallery.length;
      // Keep the underlying modal in sync so closing lands on the same image.
      modalIdx = lbIdx;
      showModalImg();
    }
    function openLB(startIdx){
      if(!modalGallery.length) return;
      if(!lb) buildLightbox();
      lbIdx = Math.max(0, Math.min(startIdx || 0, modalGallery.length - 1));
      renderLB();
      lb.classList.add('open');
    }
    function closeLB(){ if(lb) lb.classList.remove('open'); }
    function nextLB(){ lbIdx = (lbIdx + 1) % modalGallery.length; renderLB(); }
    function prevLB(){ lbIdx = (lbIdx - 1 + modalGallery.length) % modalGallery.length; renderLB(); }

    modalMain.style.cursor = 'zoom-in';
    modalMain.addEventListener('click', function(){ openLB(modalIdx); });

    // Thumbs already swap the main image via existing handler; double-click to zoom.
    modalThumbs.addEventListener('dblclick', function(e){
      const btn = e.target.closest('.dog-modal-thumb');
      if(!btn) return;
      openLB(parseInt(btn.getAttribute('data-idx'), 10) || 0);
    });

    document.addEventListener('keydown', function(e){
      if(!lb || !lb.classList.contains('open')) return;
      if(e.key === 'Escape'){ closeLB(); e.stopPropagation(); }
      else if(e.key === 'ArrowRight'){ nextLB(); e.stopPropagation(); }
      else if(e.key === 'ArrowLeft') { prevLB(); e.stopPropagation(); }
    }, true);
  }
})();

/* ══════ Premium layer: parallax, reveals, quote carousel, FAQ a11y ══════ */
(function(){
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Parallax ----
     Every photograph that is not part of a gallery or a dog card.
     The image is 12% oversized in its frame (see CSS) and drifts
     against the scroll; the home hero image sinks gently as it leaves. */
  var PX_SELECTOR = '.split-media > img, .cta-strip .cta-bg, .band-media img, .page-hero-bg img, .why-media img';
  var PX_SPEED = 0.12;
  var pxItems = [];
  document.querySelectorAll(PX_SELECTOR).forEach(function(img){
    var box = img.parentElement;
    pxItems.push({
      img: img,
      box: box,
      track: img.closest('[data-parallax-track]') || box,
      h: 0,
      on: true
    });
  });
  var heroImg = document.querySelector('.hero-bg img');
  var hero = heroImg ? heroImg.closest('.hero') : null;

  if(!reduceMotion && (pxItems.length || hero)){
    var ticking = false;
    var measure = function(){ pxItems.forEach(function(it){ it.h = it.box.offsetHeight; }); };
    var render = function(){
      ticking = false;
      var vh = window.innerHeight;
      for(var i = 0; i < pxItems.length; i++){
        var it = pxItems[i];
        if(!it.on) continue;
        var r = it.track.getBoundingClientRect();
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        if(p > 1) p = 1; else if(p < -1) p = -1;
        it.img.style.transform = 'translate3d(0,' + (-p * PX_SPEED * it.h).toFixed(1) + 'px,0)';
      }
      if(hero){
        var y = window.scrollY || window.pageYOffset;
        if(y <= hero.offsetHeight){
          heroImg.style.transform = 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)';
        }
      }
    };
    var request = function(){
      if(!ticking){ ticking = true; window.requestAnimationFrame(render); }
    };

    if('IntersectionObserver' in window){
      var byTrack = new Map();
      pxItems.forEach(function(it){
        it.on = false;
        if(!byTrack.has(it.track)) byTrack.set(it.track, []);
        byTrack.get(it.track).push(it);
      });
      var pio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          (byTrack.get(e.target) || []).forEach(function(it){ it.on = e.isIntersecting; });
        });
        request();
      }, { rootMargin: '20% 0px 20% 0px' });
      byTrack.forEach(function(_, track){ pio.observe(track); });
    }

    measure();
    render();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', function(){ measure(); request(); });
    window.addEventListener('load', function(){ measure(); request(); });
  }

  /* ---- Reveals ----
     Headings and copy rise in; framed photographs open like a curtain.
     Assigned here, so the page reads fine if this script never runs. */
  if(!reduceMotion && 'IntersectionObserver' in window){
    var rio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          rio.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    var tag = function(selector, cls, stagger){
      document.querySelectorAll(selector).forEach(function(el){
        if(el.closest('.hero') || el.closest('.dog-modal')) return;
        el.classList.add(cls);
        if(stagger && el.parentElement){
          var i = Array.prototype.indexOf.call(el.parentElement.children, el);
          el.style.setProperty('--d', (Math.min(i, 6) * 0.09).toFixed(2) + 's');
        }
        rio.observe(el);
      });
    };
    tag('.section-head, .page-hero > .wrap, .intro-copy, .section-split > div:not(.split-media), .band-inner, .quote-carousel, .cta-strip-inner, .dog-detail-hero > .wrap, .mission-body, .worldmap-wrap', 'reveal');
    tag('.feature, .why-item, .step, .facts li, .spotlight, .testimonial, .related-card, .dog-action-item, .faq-item, .contact-block', 'reveal', true);
    tag('.split-media, .why-media, .collage-item, .collage-stat, .dog-detail-main, .story-card', 'reveal-curtain', true);
  }

  /* ---- Quote carousel ---- */
  document.querySelectorAll('[data-carousel]').forEach(function(root){
    var slides = Array.prototype.slice.call(root.querySelectorAll('.qc-slide'));
    var dotsWrap = root.querySelector('.qc-dots');
    var prev = root.querySelector('.qc-prev');
    var next = root.querySelector('.qc-next');
    if(slides.length < 2 || !dotsWrap) return;

    var idx = 0;
    var timer = null;
    var DELAY = 7000;

    var dots = slides.map(function(_, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qc-dot';
      b.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
      b.addEventListener('click', function(){ go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function(d, i){
        d.classList.toggle('is-active', i === idx);
        d.setAttribute('aria-current', i === idx ? 'true' : 'false');
      });
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function restart(){
      stop();
      if(!reduceMotion) timer = setInterval(function(){ go(idx + 1); }, DELAY);
    }

    if(prev) prev.addEventListener('click', function(){ go(idx - 1); restart(); });
    if(next) next.addEventListener('click', function(){ go(idx + 1); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', restart);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', restart);

    var startX = null;
    root.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function(e){
      if(startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 44){ go(idx + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    restart();
  });

  /* ---- FAQ: keyboard + screen reader support ---- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    var sync = function(){ q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false'); };
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    sync();
    q.addEventListener('click', sync);
    q.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); q.click(); }
    });
  });
})();
