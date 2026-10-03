/* Lightbox for dog detail pages.
   Collects every image inside .dog-detail-main, .dog-detail-thumbs
   and .dog-action-grid, and shows them in a full-screen viewer
   with prev/next navigation and keyboard controls. */
(function(){
  'use strict';

  function collectImages(){
    var urls = [];
    var seen = {};
    function push(src){
      if(!src) return;
      if(seen[src]) return;
      seen[src] = true;
      urls.push(src);
    }
    document.querySelectorAll('.dog-detail-main img').forEach(function(img){ push(img.getAttribute('src')); });
    document.querySelectorAll('.dog-detail-thumb img').forEach(function(img){ push(img.getAttribute('src')); });
    document.querySelectorAll('.dog-action-item img').forEach(function(img){ push(img.getAttribute('src')); });
    return urls;
  }

  function buildLightbox(){
    var wrap = document.createElement('div');
    wrap.className = 'lightbox';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">&#215;</button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous">&#8592;</button>' +
      '<img class="lightbox-img" src="" alt=""/>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next">&#8594;</button>' +
      '<div class="lightbox-counter"></div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  document.addEventListener('DOMContentLoaded', function(){
    var images = collectImages();
    if(!images.length) return;

    var lb = buildLightbox();
    var lbImg = lb.querySelector('.lightbox-img');
    var lbCounter = lb.querySelector('.lightbox-counter');
    var idx = 0;

    function render(){
      lbImg.src = images[idx];
      lbCounter.textContent = (idx + 1) + ' / ' + images.length;
    }
    function open(src){
      var i = images.indexOf(src);
      idx = i >= 0 ? i : 0;
      render();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    function next(){ idx = (idx + 1) % images.length; render(); }
    function prev(){ idx = (idx - 1 + images.length) % images.length; render(); }

    function bind(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.addEventListener('click', function(e){
          var img = el.tagName === 'IMG' ? el : el.querySelector('img');
          if(!img) return;
          e.preventDefault();
          open(img.getAttribute('src'));
        });
      });
    }
    bind('.dog-detail-main img');
    bind('.dog-action-item');

    // Thumbs already swap the main image via existing script;
    // clicking a thumb should also open the lightbox on that image.
    document.querySelectorAll('.dog-detail-thumb').forEach(function(btn){
      btn.addEventListener('dblclick', function(){
        var img = btn.querySelector('img');
        if(img) open(img.getAttribute('src'));
      });
    });

    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev').addEventListener('click', prev);
    lb.querySelector('.lightbox-next').addEventListener('click', next);
    lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      else if(e.key === 'ArrowRight') next();
      else if(e.key === 'ArrowLeft') prev();
    });
  });
})();
