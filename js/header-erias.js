/**
 * EN-TÊTE ERIAS 2 ÉTAGES — comportement partagé par toutes les pages
 * - Burger mobile (< 900px) : ouvre/ferme le menu vertical
 * - Sous-menu « IC Lycée » : survol sur PC, clic au clavier / tactile / mobile
 */
(function () {
  function init() {
    const toggle = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mainNavMenu');
    if (!toggle || !menu || menu.dataset.ehReady) return;
    menu.dataset.ehReady = '1';

    const mobileQuery = window.matchMedia('(max-width: 899.98px)');
    const subs = [...menu.querySelectorAll('.eh-has-sub')];

    const setSub = (li, open) => {
      li.classList.toggle('open', open);
      const btn = li.querySelector('.eh-sub-toggle');
      if (btn) btn.setAttribute('aria-expanded', String(open));
    };
    const closeSubs = (except) => subs.forEach((li) => { if (li !== except) setSub(li, false); });

    const setOpen = (open) => {
      menu.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      if (toggle.firstElementChild) toggle.firstElementChild.textContent = open ? '✕' : '☰';
      if (!open) closeSubs();
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('active')));

    subs.forEach((li) => {
      const btn = li.querySelector('.eh-sub-toggle');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = !li.classList.contains('open');
        closeSubs(li);
        setSub(li, open);
      });
      // Sortie du survol sur PC : le sous-menu ouvert au clic se referme
      li.addEventListener('mouseleave', () => { if (!mobileQuery.matches) setSub(li, false); });
      li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) setSub(li, false); });
    });

    // Fermeture après clic sur un lien (mobile)
    menu.addEventListener('click', (e) => {
      if (e.target.closest('.eh-sub-toggle')) return;
      if (e.target.closest('a, button') && mobileQuery.matches) setOpen(false);
    });

    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) closeSubs(); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      closeSubs();
      if (menu.classList.contains('active')) setOpen(false);
    });

    const onChange = (e) => { if (!e.matches) setOpen(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onChange);
    else if (mobileQuery.addListener) mobileQuery.addListener(onChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
