// Custom cursor
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let fx = 0, fy = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX;
  cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});

function animFollower() {
  fx += (cx - fx) * 0.12;
  fy += (cy - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animFollower);
}
animFollower();

document.querySelectorAll('a, button, .project-card, .feature-card, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    follower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    follower.classList.remove('hovered');
  });
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => observer.observe(el));

// Counter animation
document.querySelectorAll('.stat-num').forEach(el => {
  const text = el.innerHTML;
  const num = parseInt(text.replace(/\D/g, ''));
  const suffix = text.replace(/[\d]/g, '').trim();

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let start = 0;
      const step = num / 60;

      const timer = setInterval(() => {
        start = Math.min(start + step, num);
        el.innerHTML = Math.floor(start) + suffix;

        if (start >= num) clearInterval(timer);
      }, 16);

      obs.unobserve(el);
    }
  });

  obs.observe(el);
});