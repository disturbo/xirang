/**
 * shared.js — Interactive behaviors for the Xirang multi-page static site.
 * Vanilla JS, no dependencies.
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Navigation Active State
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if ((page === 'home' && (href === '/' || href === './' || href === '../')) ||
        (page !== 'home' && href.includes(page))) {
      a.classList.add('active');
    }
  });

  // 2. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.nav-mobile-panel a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // 3. Accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      // Single-open mode: close siblings if .accordion has data-single
      if (item.closest('.accordion').dataset.single !== undefined) {
        item.closest('.accordion').querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      }
      item.classList.toggle('open', !wasOpen);
    });
  });

  // 4. Flow Tabs (reusable tab pattern)
  document.querySelectorAll('.flow-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.flow-tab');
    const container = tabGroup.closest('section') || tabGroup.parentElement;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.target;
        container.querySelectorAll('.flow-pane').forEach(p => p.classList.remove('active'));
        const pane = container.querySelector(`#${target}`);
        if (pane) pane.classList.add('active');
      });
    });
  });

  // 5. Split View
  document.querySelectorAll('.splitview').forEach(sv => {
    const items = sv.querySelectorAll('.sv-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const target = item.dataset.target;
        sv.querySelectorAll('.sv-pane').forEach(p => p.classList.remove('active'));
        const pane = sv.querySelector(`#${target}`);
        if (pane) pane.classList.add('active');
      });
    });
  });

  // 6. Level Cards (Deploy page)
  document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
      const level = card.dataset.level;
      document.querySelectorAll('.level-card').forEach(c => c.classList.toggle('active', c === card));
      document.querySelectorAll('.level-detail').forEach(d => {
        d.classList.toggle('active', d.dataset.level === level);
      });
      const detail = document.querySelector('.level-detail.active');
      if (detail) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 7. Platform Toggle (Deploy page)
  document.querySelectorAll('.platform-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const group = toggle.closest('.platform-toggle-group');
      group.querySelectorAll('.platform-toggle').forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      document.body.dataset.platform = toggle.dataset.platform;
      localStorage.setItem('xirang-platform', toggle.dataset.platform);
    });
  });

  // Restore saved platform preference
  const savedPlatform = localStorage.getItem('xirang-platform') ||
    (navigator.platform.includes('Mac') ? 'mac' : 'windows');
  document.body.dataset.platform = savedPlatform;
  const activeToggle = document.querySelector(`.platform-toggle[data-platform="${savedPlatform}"]`);
  if (activeToggle) {
    activeToggle.closest('.platform-toggle-group')?.querySelectorAll('.platform-toggle').forEach(t => t.classList.remove('active'));
    activeToggle.classList.add('active');
  }

  // 8. Interactive Checklist with Progress (Deploy page)
  function updateProgress(container) {
    const checks = container.querySelectorAll('.checklist-item input[type="checkbox"]');
    const done = [...checks].filter(c => c.checked).length;
    const total = checks.length;
    const fill = container.querySelector('.progress-fill');
    const info = container.querySelector('.progress-info span:last-child');
    if (fill) fill.style.width = `${total ? (done / total) * 100 : 0}%`;
    if (info) info.textContent = `${done}/${total}`;
  }

  function initChecklist() {
    const activeDetail = document.querySelector('.level-detail.active');
    if (!activeDetail) return;

    const level = activeDetail.dataset.level;
    const key = `xirang-deploy-${level}`;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');

    const checkboxes = activeDetail.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (saved[cb.id]) {
        cb.checked = true;
        cb.closest('.checklist-item').classList.add('done');
      }
      cb.addEventListener('change', () => {
        saved[cb.id] = cb.checked;
        localStorage.setItem(key, JSON.stringify(saved));
        cb.closest('.checklist-item').classList.toggle('done', cb.checked);
        updateProgress(activeDetail);
      });
    });

    updateProgress(activeDetail);
  }

  // Re-init checklist when the active level changes
  const levelObserver = new MutationObserver(() => initChecklist());
  document.querySelectorAll('.level-detail').forEach(d => {
    levelObserver.observe(d, { attributes: true, attributeFilter: ['class'] });
  });
  initChecklist();

  // 9. Scroll-based Section Highlight (in-page anchors)
  if (document.querySelectorAll('section[id]').length > 3) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // 10. Priority Filter (Rules page)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const table = document.querySelector('.filterable-table');
      if (!table) return;

      table.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.priority === filter) ? '' : 'none';
      });
    });
  });

});
