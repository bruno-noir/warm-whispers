/* ==========================================================
   WARM WHISPERS
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. STICKY NAVBAR ---------- */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. MOBILE MENU ---------- */
  var burger   = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- 3. SCROLL REVEAL ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var delay = Math.min(i * 70, 350);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback for very old browsers
    revealItems.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 4. TOAST ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  /* ---------- 5. CART ---------- */
  var cartCount = document.getElementById('cartCount');
  var count = 0;

  try {
    var saved = parseInt(localStorage.getItem('ww_cart'), 10);
    if (!isNaN(saved) && saved > 0) { count = saved; }
  } catch (e) { /* storage blocked, start from zero */ }

  function renderCart() {
    cartCount.textContent = count;
    cartCount.classList.remove('pop');
    void cartCount.offsetWidth;   // restart the animation
    cartCount.classList.add('pop');
    try { localStorage.setItem('ww_cart', String(count)); } catch (e) {}
  }
  cartCount.textContent = count;

  document.querySelectorAll('.add-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.product');
      var name = card ? card.getAttribute('data-name') : 'Candle';
      count++;
      renderCart();
      showToast(name + ' added to your cart');
    });
  });

  document.getElementById('cartBtn').addEventListener('click', function () {
    if (count === 0) {
      showToast('Your cart is empty. Pick a candle you love!');
    } else {
      showToast(count + (count === 1 ? ' candle' : ' candles') + ' in your cart');
    }
  });

  /* ---------- 6. SHOP BY MOOD ---------- */
  function goToProduct(id) {
    var target = document.getElementById(id);
    if (!target) { return; }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('flash');
    void target.offsetWidth;
    target.classList.add('flash');
    setTimeout(function () { target.classList.remove('flash'); }, 2000);
  }

  var moodButtons = document.querySelectorAll('.mood');
  moodButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      goToProduct(btn.getAttribute('data-target'));
    });
  });

  document.getElementById('findCandle').addEventListener('click', function () {
    var ids = [];
    moodButtons.forEach(function (b) { ids.push(b.getAttribute('data-target')); });
    var pick = ids[Math.floor(Math.random() * ids.length)];
    var card = document.getElementById(pick);
    showToast('We think you will love ' + (card ? card.getAttribute('data-name') : 'this one'));
    goToProduct(pick);
  });

  /* ---------- 7. FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-q');
    var answer   = item.querySelector('.faq-a');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // close every panel first, so only one stays open
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 8. GALLERY LIGHTBOX ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lbImg');
  var lbClose  = document.getElementById('lbClose');

  document.querySelectorAll('#galleryGrid img').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) { closeLightbox(); }
      closeMenu();
    }
  });

  /* ---------- 9. ORDER FORM ---------- */
  var form    = document.getElementById('orderForm');
  var success = document.getElementById('formSuccess');

  function setError(input, message) {
    var field = input.closest('.field');
    var slot  = field.querySelector('.err');
    if (message) {
      field.classList.add('invalid');
      slot.textContent = message;
      return false;
    }
    field.classList.remove('invalid');
    slot.textContent = '';
    return true;
  }

  function validate() {
    var ok = true;

    var name   = document.getElementById('name');
    var email  = document.getElementById('email');
    var phone  = document.getElementById('phone');
    var candle = document.getElementById('candle');
    var qty    = document.getElementById('qty');

    if (name.value.trim().length < 2) {
      ok = setError(name, 'Please enter your name') && ok;
    } else { setError(name, ''); }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      ok = setError(email, 'Please enter a valid email address') && ok;
    } else { setError(email, ''); }

    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) {
      ok = setError(phone, 'Please enter a 10 digit phone number') && ok;
    } else { setError(phone, ''); }

    if (candle.value === '') {
      ok = setError(candle, 'Please choose a candle') && ok;
    } else { setError(candle, ''); }

    var n = parseInt(qty.value, 10);
    if (isNaN(n) || n < 1 || n > 50) {
      ok = setError(qty, 'Choose between 1 and 50') && ok;
    } else { setError(qty, ''); }

    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true;

    if (!validate()) {
      showToast('Please check the highlighted fields');
      return;
    }

    var firstName = document.getElementById('name').value.trim().split(' ')[0];
    var qty       = document.getElementById('qty').value;
    var candle    = document.getElementById('candle').value;

    success.textContent = 'Thank you ' + firstName + '! Your request for ' + qty + ' x ' +
                          candle + ' has been noted. We will be in touch soon.';
    success.hidden = false;
    showToast('Order placed successfully');
    form.reset();
    document.getElementById('qty').value = 1;
  });

  // clear an error as soon as the visitor fixes it
  form.querySelectorAll('input, select').forEach(function (input) {
    input.addEventListener('input', function () {
      var field = input.closest('.field');
      if (field.classList.contains('invalid')) {
        field.classList.remove('invalid');
        field.querySelector('.err').textContent = '';
      }
    });
  });

  /* ---------- 10. FOOTER YEAR ---------- */
  var yearSlot = document.querySelector('.footer-bottom p');
  if (yearSlot) {
    yearSlot.textContent = '© ' + new Date().getFullYear() +
                           ' Warm Whispers. All rights reserved.';
  }

});
