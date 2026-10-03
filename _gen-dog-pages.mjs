/* One-shot generator: writes dogs/{id}.html for every dog in dogs-data.js.
   Run: node _gen-dog-pages.mjs
   Safe to re-run: overwrites each file with the current data.
*/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;

// Load dogs-data.js as text and run it in a sandbox that provides a fake `window`.
const dataSrc = readFileSync(resolve(root, 'js/dogs-data.js'), 'utf8');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
const DOGS = sandbox.window.SIMPOR_DOGS || [];

const outDir = resolve(root, 'dogs');
mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

// "In action" caption pool, cycled per dog for gallery labels.
const actionLabels = [
  'Portrait',
  'Off-leash heel',
  'Bite work',
  'Restaurant down-stay',
  'Public greeting',
  'Retrieve',
  'Handler focus',
  'Property patrol'
];

function detailPage(d, others){
  const gallery = (d.gallery && d.gallery.length) ? d.gallery : [d.cover];
  const specsHTML = Object.entries(d.specs || {}).map(([k,v]) =>
    `        <li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`
  ).join('\n');

  // Reuse the gallery images for the "In Action" grid, tiling to 4-6 slots.
  const actionItems = [];
  for(let i=0; i<Math.max(4, gallery.length); i++){
    const src = gallery[i % gallery.length];
    const label = actionLabels[i % actionLabels.length];
    actionItems.push(
`      <figure class="dog-action-item">
        <img src="../${src}" alt="${esc(d.name)}, ${esc(label)}" loading="lazy"/>
        <figcaption class="label">${esc(label)}</figcaption>
      </figure>`
    );
  }

  const related = others
    .filter(o => o.id !== d.id)
    .sort((a,b) => (a.breed === d.breed ? -1 : 1) - (b.breed === d.breed ? -1 : 1))
    .slice(0, 3);
  const relatedHTML = related.map(o =>
`      <a href="${esc(o.id)}.html" class="related-card">
        <div class="related-media"><img src="../${esc(o.cover)}" alt="${esc(o.name)}" loading="lazy"/></div>
        <div class="related-info">
          <div class="related-breed">${esc(o.breedLabel)}</div>
          <h3 class="related-name">${esc(o.name)}</h3>
          <div class="related-meta">${esc(o.sex)} · ${esc(o.age)} · ${esc(o.purpose)}</div>
        </div>
      </a>`
  ).join('\n');

  const thumbsHTML = gallery.map((src, i) =>
`          <button class="dog-detail-thumb${i===0?' active':''}" data-idx="${i}" type="button" aria-label="View image ${i+1}">
            <img src="../${esc(src)}" alt=""/>
          </button>`
  ).join('\n');

  const firstName = d.name.split(/[·-]/)[0].trim().split(/\s+/)[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)}, Available ${esc(d.breedLabel)} · Simpor</title>
<meta name="description" content="${esc(d.name)}, ${esc(d.breedLabel)}, ${esc(d.sex)}, ${esc(d.age)}, trained for ${esc(d.purpose)}. Available for placement from Simpor Working Kennel. FCI 3428."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../css/style.css"/>
<script src="../js/lang.js" defer></script>
</head>
<body>

<div id="loader"><div class="loader-mark">SIM<em>POR</em></div></div>

<nav class="nav" id="nav">
  <a href="../index.html" class="nav-brand">SIM<em>POR</em></a>
  <ul class="nav-links">
    <li><a href="https://simpork9.com/training" target="_blank" rel="noopener" data-i18n="nav.training">Training Services</a></li>
    <li><a href="../available-dogs.html" data-i18n="nav.available">Available Dogs</a></li>
    <li><a href="../about.html" class="has-caret" data-i18n="nav.about">About Us</a>
      <ul class="submenu">
        <li><a href="../why-simpor.html" data-i18n="nav.about.why">Why Simpor</a></li>
        <li><a href="../about.html" data-i18n="nav.about.approach">Our Approach</a></li>
        <li><a href="../testimonials.html" data-i18n="nav.about.testimonials">Testimonials</a></li>
      </ul>
    </li>
    <li><a href="../how-it-works.html" data-i18n="nav.process">Process</a></li>
    <li><a href="../faq.html" data-i18n="nav.faq">FAQ</a></li>
  </ul>
  <div class="nav-right">
    <a href="tel:+381644919030" class="nav-login">+381 64 4919030</a>
    <div class="lang-switcher">
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
      <span class="lang-sep">/</span>
      <button class="lang-btn" data-lang="sr" onclick="setLang('sr')">SR</button>
    </div>
    <a href="../contact.html" class="nav-cta" data-i18n="nav.book">Book a Call</a>
    <button class="hamburger" id="hamburger" data-i18n-aria="nav.hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="../index.html" data-i18n="mobile.home">Home</a>
  <a href="https://simpork9.com/training" target="_blank" rel="noopener" data-i18n="mobile.training">Training Services</a>
  <a href="../available-dogs.html" data-i18n="mobile.available">Available Dogs</a>
  <div class="mobile-submenu">
    <button class="mobile-submenu-toggle" data-i18n="mobile.about">About Us</button>
    <div class="mobile-submenu-items">
      <a href="../why-simpor.html" data-i18n="nav.about.why">Why Simpor</a>
      <a href="../about.html" data-i18n="nav.about.approach">Our Approach</a>
      <a href="../testimonials.html" data-i18n="nav.about.testimonials">Testimonials</a>
    </div>
  </div>
  <a href="../how-it-works.html" data-i18n="mobile.process">Process</a>
  <a href="../faq.html" data-i18n="mobile.faq">FAQ</a>
  <a href="../contact.html" data-i18n="mobile.contact">Contact</a>
  <div class="lang-switcher">
    <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
    <span class="lang-sep">/</span>
    <button class="lang-btn" data-lang="sr" onclick="setLang('sr')">SR</button>
  </div>
</div>

<!-- HERO -->
<section class="dog-detail-hero">
  <div class="wrap">
    <span class="eyebrow">Available Dog · ${esc(d.breedLabel)}</span>
    <h1>Meet <em>${esc(firstName)}</em>.</h1>
    <p class="lead">${esc(d.desc)}</p>
    <div class="hero-cta-row">
      <a href="../contact.html?dog=${esc(d.id)}" class="btn btn-primary btn-arrow">Inquire About ${esc(firstName)}</a>
      <a href="tel:+381644919030" class="btn btn-outline">Call +381 64 4919030</a>
    </div>
  </div>
</section>

<!-- GALLERY + SIDEBAR -->
<section class="dog-detail-split">
  <div class="wrap" style="display:contents;">
    <div class="dog-detail-gallery">
      <div class="dog-detail-main">
        <img id="ddMain" src="../${esc(gallery[0])}" alt="${esc(d.name)}"/>
      </div>
      <div class="dog-detail-thumbs" id="ddThumbs">
${thumbsHTML}
      </div>
    </div>

    <aside class="dog-detail-sidebar">
      <span class="dd-breed">${esc(d.breedLabel)}</span>
      <h2 class="dd-name">${esc(d.name)}</h2>
      <div class="dd-meta">${esc(d.sex)} · ${esc(d.age)} · ${esc(d.purpose)}</div>

      <div class="dd-price">
        <small>Price</small>
        ${esc(d.price)}
      </div>

      <ul class="dd-specs">
${specsHTML}
      </ul>

      <div class="dd-cta">
        <a href="../contact.html?dog=${esc(d.id)}" class="btn btn-primary btn-arrow">Inquire About ${esc(firstName)}</a>
        <a href="../available-dogs.html" class="btn btn-outline-dark">View All Available Dogs</a>
      </div>
    </aside>
  </div>
</section>

<!-- DESCRIPTION -->
<section class="dog-detail-desc">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">About ${esc(firstName)}</span>
      <h2>Confident, well-rounded, ready for placement.</h2>
    </div>
    <p class="lead-p">${esc(d.desc)}</p>
    <p>${esc(firstName)} is raised in-home at Simpor, evaluated for temperament and drive on a weekly basis, and prepared for the environment in which he will actually live. He is a ${esc(d.breedLabel.toLowerCase())} bred for ${esc(d.purpose.toLowerCase())}, with the neutrality expected of a Simpor dog around family, guests, and everyday public settings.</p>
    <p>Every dog we place leaves with a verifiable FCI export pedigree, a signed veterinary certificate, hip &amp; elbow evaluations, current vaccinations, an ISO microchip registered in the new owner's name, and an in-person handover session that transfers commands and daily routine directly to you.</p>
  </div>
</section>

<!-- IN ACTION GALLERY -->
<section class="dog-detail-action">
  <div class="wrap">
    <div class="section-head center-head">
      <span class="eyebrow">Gallery</span>
      <h2>${esc(firstName)} in action.</h2>
      <p>A selection of moments, training sessions, portraits and real-world work. Full HD reel is available on request.</p>
    </div>
    <div class="dog-action-grid">
${actionItems.join('\n')}
    </div>
  </div>
</section>

<!-- RELATED DOGS -->
<section class="related-dogs">
  <div class="wrap">
    <div class="section-head center-head">
      <span class="eyebrow">Also Available</span>
      <h2>Other Simpor dogs ready for placement.</h2>
    </div>
    <div class="related-grid">
${relatedHTML}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-strip">
  <img class="cta-bg" src="../images/pocetna1.jpg" alt=""/>
  <div class="cta-strip-inner">
    <span class="eyebrow">Inquire Today</span>
    <h2>Interested in ${esc(firstName)}?</h2>
    <p>A short conversation is the fastest way to understand whether ${esc(firstName)} is the right dog for your household, travel patterns, and security needs. We prefer honest guidance over a fast sale.</p>
    <a href="../contact.html?dog=${esc(d.id)}" class="btn btn-primary btn-arrow">Inquire About ${esc(firstName)}</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a href="../index.html" class="footer-brand">SIM<em>POR</em></a>
        <p class="footer-about" data-i18n="footer.about">Simpor is a working dog kennel and breeding facility based in Serbia. FCI 3428. Est. 1994.</p>
        <div class="footer-social" style="margin-top:24px;">
          <a href="https://www.instagram.com/simpor_dogcentar/" target="_blank" rel="noopener" aria-label="Instagram Dog Center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.facebook.com/simpork9/?locale=sr_RS" target="_blank" rel="noopener" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.youtube.com/@simpordogcenter" target="_blank" rel="noopener" aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.97C23 15.87 23 12 23 12s0-3.87-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col"><h3 data-i18n="footer.h.dogs">Our Dogs</h3><ul>
        <li><a href="../index.html#dogs-for-sale" data-i18n="footer.dogs.all">All Available Dogs</a></li>
        <li><a href="../index.html#dogs-for-sale" data-i18n="footer.dogs.gsd">German Shepherd</a></li>
        <li><a href="../index.html#dogs-for-sale">Malinois</a></li>
        <li><a href="../index.html#dogs-for-sale">Doberman</a></li>
        <li><a href="../index.html#dogs-for-sale" data-i18n="footer.dogs.rottweiler">Rottweiler</a></li>
        <li><a href="../index.html#dogs-for-sale">K9</a></li>
      </ul></div>
      <div class="footer-col"><h3 data-i18n="footer.h.company">Company</h3><ul>
        <li><a href="../why-simpor.html" data-i18n="nav.about.why">Why Simpor</a></li>
        <li><a href="../about.html" data-i18n="footer.about.link">About Simpor</a></li>
        <li><a href="../how-it-works.html" data-i18n="footer.how">How It Works</a></li>
        <li><a href="../testimonials.html" data-i18n="footer.testimonials">Testimonials</a></li>
        <li><a href="../faq.html" data-i18n="footer.faq">FAQ</a></li>
      </ul></div>
      <div class="footer-col"><h3 data-i18n="footer.h.contact">Contact</h3><ul>
        <li><a href="tel:+381644919030">+381 64 4919030</a></li>
        <li><a href="mailto:Simpordogcentar1@gmail.com">Simpordogcentar1@gmail.com</a></li>
        <li data-i18n="footer.location">Serbia · Europe</li>
        <li><a href="../contact.html" data-i18n="footer.book">Book a Call</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <div data-i18n="footer.copy">© 2026 Simpor Working Kennel. All rights reserved.</div>
      <div data-i18n="footer.reg">FCI Registration 3428 · Est. 1994</div>
    </div>
  </div>
</footer>

<!-- Simple thumbnail-swap for the gallery -->
<script>
(function(){
  var main = document.getElementById('ddMain');
  var thumbs = document.getElementById('ddThumbs');
  if(!main || !thumbs) return;
  thumbs.querySelectorAll('.dog-detail-thumb').forEach(function(btn){
    btn.addEventListener('click', function(){
      var img = btn.querySelector('img');
      if(!img) return;
      main.src = img.getAttribute('src');
      thumbs.querySelectorAll('.dog-detail-thumb').forEach(function(x){ x.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
})();
</script>
<script src="../js/main.js"></script>
</body>
</html>
`;
}

let count = 0;
for(const d of DOGS){
  const html = detailPage(d, DOGS);
  const outPath = resolve(outDir, `${d.id}.html`);
  writeFileSync(outPath, html, 'utf8');
  count++;
  console.log('wrote', outPath);
}
console.log(`\ngenerated ${count} dog pages in ${outDir}`);
