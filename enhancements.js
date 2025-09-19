/* enhancements.js
   Non-intrusive UI improvements:
   - Ripple effect for elements with .ripple-container
   - Back-to-top button behavior
   - Scroll progress bar update
   - Safe AOS init if available
   - Small typing effect for elements with [data-typing]
*/
(function(){
  'use strict';

  function createRipple(e){
    var target = e.currentTarget;
    var rect = target.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    var size = Math.max(rect.width, rect.height) * 0.9;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    target.appendChild(ripple);
    setTimeout(function(){ ripple.remove(); }, 700);
  }

  document.addEventListener('DOMContentLoaded', function(){
    Array.prototype.slice.call(document.querySelectorAll('.ripple-container')).forEach(function(el){
      el.addEventListener('click', createRipple);
    });

    var backBtn = document.getElementById('back-to-top');
    if (backBtn) {
      backBtn.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
      window.addEventListener('scroll', function(){
        if (window.scrollY > 400) backBtn.style.opacity = 1;
        else backBtn.style.opacity = 0;
      });
      backBtn.style.transition = 'opacity 220ms';
      backBtn.style.opacity = 0;
    }

    var progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
      var ticking = false;
      function updateProgress(){
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docH > 0 ? Math.min(100, Math.round((window.scrollY / docH) * 100)) : 0;
        progressBar.style.width = pct + '%';
        ticking = false;
      }
      window.addEventListener('scroll', function(){
        if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
      }, { passive:true });
    }

    try { if (window.AOS && typeof window.AOS.init === 'function') window.AOS.init(); } catch(e){}

    Array.prototype.slice.call(document.querySelectorAll('[data-typing]')).forEach(function(el){
      try {
        var text = el.textContent.trim();
        var speed = parseInt(el.getAttribute('data-typing-speed') || 60, 10);
        el.textContent = '';
        var i = 0;
        var timer = setInterval(function(){
          el.textContent += text.charAt(i);
          i++;
          if (i >= text.length) clearInterval(timer);
        }, speed);
      } catch(e){}
    });

  });
})();