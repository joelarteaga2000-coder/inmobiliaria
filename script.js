// ── CURSOR ──────────────────────────────────────────────────────
const cursorEl = document.getElementById('cursor');
const followerEl = document.getElementById('cursorFollower');
let fx = 0, fy = 0, cx = 0, cy = 0;

if (cursorEl && followerEl) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursorEl.style.left = cx + 'px';
    cursorEl.style.top  = cy + 'px';
  });
  (function animFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    followerEl.style.left = fx + 'px';
    followerEl.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();
  document.querySelectorAll('a, button, .project-card, .feature-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorEl.classList.add('hovered'); followerEl.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursorEl.classList.remove('hovered'); followerEl.classList.remove('hovered'); });
  });
}

// ── NAVBAR SCROLL ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── REVEAL ON SCROLL ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────────────
document.querySelectorAll('.stat-num').forEach(el => {
  const text = el.innerHTML;
  const num  = parseInt(text.replace(/\D/g, ''));
  const suf  = text.replace(/[\d]/g, '').trim();
  const obs  = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    let s = 0, step = num / 60;
    const t = setInterval(() => {
      s = Math.min(s + step, num);
      el.innerHTML = Math.floor(s) + suf;
      if (s >= num) clearInterval(t);
    }, 16);
    obs.unobserve(el);
  });
  obs.observe(el);
});

// ── PROJECT FILTERS ───────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-cat]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden-filter', !show);
      if (show) card.style.animation = 'none', requestAnimationFrame(() => card.style.animation = '');
    });
  });
});

// ── PROJECT MODAL ─────────────────────────────────────────────────
const projectData = {
  pedregal: {
    img: 'image1.jpg', tag: 'Residencial', year: '2024',
    title: 'Casa Pedregal', location: 'Pedregal de San Ángel, CDMX',
    specs: [{ val: '850', label: 'm² de construcción' }, { val: '4', label: 'Recámaras' }, { val: '$12M', label: 'Valor estimado' }, { val: '2024', label: 'Año de entrega' }],
    desc: 'Residencia de autor en una de las zonas más exclusivas de la Ciudad de México. Diseño orgánico que dialoga con el entorno volcánico de Pedregal, con materiales nobles como piedra basáltica, madera y cristal templado.'
  },
  corporativo: {
    img: 'image2.jpg', tag: 'Comercial', year: '2024',
    title: 'Corporativo Norte', location: 'Santa Fe, CDMX',
    specs: [{ val: '4,200', label: 'm² de oficinas' }, { val: '8', label: 'Niveles' }, { val: 'LEED', label: 'Certificación' }, { val: '22%', label: 'ROI proyectado' }],
    desc: 'Edificio corporativo de uso mixto en el corredor financiero de Santa Fe. Fachada de doble piel ventilada, sistema BMS integrado y espacios flex adaptados a la dinámica de trabajo post-pandemia.'
  },
  narvarte: {
    img: 'image3.jpg', tag: 'Mixto', year: '2023',
    title: 'Narvarte Lofts', location: 'Narvarte, CDMX',
    specs: [{ val: '24', label: 'Unidades' }, { val: '65–90', label: 'm² por loft' }, { val: '100%', label: 'Vendido' }, { val: '20%', label: 'ROI realizado' }],
    desc: 'Desarrollo de usos mixtos en la colonia Narvarte con planta baja comercial y 24 lofts de alto diseño. Primer proyecto en su zona en integrar terraza verde y sistema de captación pluvial.'
  }
};

const modal     = document.getElementById('projectModal');
const mBackdrop = document.getElementById('modalBackdrop');
const mClose    = document.getElementById('modalClose');

function openModal(key) {
  const d = projectData[key];
  if (!d) return;
  document.getElementById('modalImg').src           = d.img;
  document.getElementById('modalTag').textContent   = d.tag;
  document.getElementById('modalYear').textContent  = d.year;
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalLocation').textContent = d.location;
  document.getElementById('modalDesc').textContent  = d.desc;
  document.getElementById('modalSpecs').innerHTML   = d.specs.map(s =>
    `<div class="modal-spec"><div class="modal-spec-val">${s.val}</div><div class="modal-spec-label">${s.label}</div></div>`
  ).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-detail-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    openModal(btn.closest('.project-card').dataset.project);
  });
});
document.querySelectorAll('.project-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
});
mBackdrop.addEventListener('click', closeModal);
mClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── ROI CALCULATOR ────────────────────────────────────────────────
const roiAmount = document.getElementById('roiAmount');
const roiSlider = document.getElementById('roiSlider');
let roiRate  = 0.18;
let roiYears = 1;

function fmt(n) { return '$' + Math.round(n).toLocaleString('es-MX'); }

function calcROI() {
  const inv  = parseFloat(roiAmount.value) || 500000;
  const gain = inv * roiRate * roiYears;
  const total = inv + gain;
  document.getElementById('roiInitial').textContent = fmt(inv);
  document.getElementById('roiGain').textContent    = '+' + fmt(gain);
  document.getElementById('roiTotal').textContent   = fmt(total);
}

roiAmount && roiAmount.addEventListener('input', () => { roiSlider.value = roiAmount.value; calcROI(); });
roiSlider && roiSlider.addEventListener('input', () => { roiAmount.value = roiSlider.value; calcROI(); });

document.querySelectorAll('.roi-type').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.roi-type').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    roiRate = parseFloat(btn.dataset.rate);
    calcROI();
  });
});

document.querySelectorAll('.roi-year').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.roi-year').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    roiYears = parseInt(btn.dataset.years);
    calcROI();
  });
});

calcROI();

// ── PRE-REGISTRO WHATSAPP ─────────────────────────────────────────
function submitPreReg() {
  const name   = document.getElementById('preName').value.trim();
  const phone  = document.getElementById('prePhone').value.trim();
  const budget = document.getElementById('preBudget').value;
  const type   = document.getElementById('preType').value;

  if (!name || !phone) {
    alert('Por favor ingresa tu nombre y WhatsApp para continuar.');
    return;
  }

  const msg = encodeURIComponent(
    `Hola FORMA Studio, me interesa registrarme para acceso prioritario.\n\n` +
    `Nombre: ${name}\n` +
    `Presupuesto: ${budget || 'Por definir'}\n` +
    `Interés: ${type || 'Por definir'}\n\n` +
    `¿Cuándo podemos hablar?`
  );
  window.open(`https://wa.me/5215525051050?text=${msg}`, '_blank');
}
