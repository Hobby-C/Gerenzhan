const header = document.querySelector('#siteHeader');
const menuToggle = document.querySelector('#menuToggle');
const siteNav = document.querySelector('#siteNav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? '打开导航' : '关闭导航');
  siteNav.classList.toggle('open', !open);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
  siteNav.classList.remove('open');
}));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-38% 0px -55%', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const reveals = document.querySelectorAll('.reveal:not(.is-visible)');
if (prefersReducedMotion) {
  reveals.forEach((node) => node.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -7%' });
  reveals.forEach((node) => revealObserver.observe(node));
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card[data-category]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !visible);
    });
  });
});

const dialog = document.querySelector('#projectDialog');
const dialogClose = document.querySelector('#dialogClose');
const dialogMedia = document.querySelector('#dialogMedia');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogIndex = document.querySelector('#dialogIndex');
const dialogCategory = document.querySelector('#dialogCategory');
const dialogType = document.querySelector('#dialogType');

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    const isVideo = card.dataset.type === 'video';
    dialogTitle.textContent = card.dataset.title;
    dialogIndex.textContent = card.dataset.index;
    dialogCategory.textContent = card.dataset.category;
    dialogType.textContent = isVideo ? '完整作品 · 有声播放' : '图像作品 · 高清预览';
    dialogMedia.innerHTML = '';
    const media = document.createElement(isVideo ? 'video' : 'img');
    media.src = card.dataset.src;
    if (isVideo) {
      media.poster = card.dataset.poster || '';
      media.controls = true;
      media.autoplay = true;
      media.muted = false;
      media.loop = false;
      media.playsInline = true;
      media.preload = 'metadata';
    } else {
      media.alt = card.dataset.title;
    }
    dialogMedia.appendChild(media);
    document.body.classList.add('dialog-open');
    dialog.showModal();
  });
});

const closeDialog = () => {
  const video = dialogMedia.querySelector('video');
  if (video) video.pause();
  dialog.close();
  document.body.classList.remove('dialog-open');
  dialogMedia.innerHTML = '';
};
dialogClose.addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });

const copyContact = document.querySelector('#copyContact');
const toast = document.querySelector('#toast');
let toastTimer;
copyContact.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyContact.dataset.contact);
    toast.textContent = '微信昵称已复制';
  } catch {
    toast.textContent = `微信昵称：${copyContact.dataset.contact}`;
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
});

document.querySelector('#year').textContent = new Date().getFullYear();

const toolBubbles = document.querySelector('.tool-bubbles');
if (toolBubbles && !prefersReducedMotion) {
  const bubbles = [...toolBubbles.querySelectorAll('.tool-bubble')];
  toolBubbles.addEventListener('pointermove', (event) => {
    const rect = toolBubbles.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    toolBubbles.style.setProperty('--pointer-x', `${(x + .5) * 100}%`);
    toolBubbles.style.setProperty('--pointer-y', `${(y + .5) * 100}%`);
    bubbles.forEach((bubble) => {
      const depth = Number(bubble.dataset.depth || 1);
      bubble.style.setProperty('--bubble-x', `${x * 13 * depth}px`);
      bubble.style.setProperty('--bubble-y', `${y * 10 * depth}px`);
    });
  });
  toolBubbles.addEventListener('pointerleave', () => {
    bubbles.forEach((bubble) => {
      bubble.style.setProperty('--bubble-x', '0px');
      bubble.style.setProperty('--bubble-y', '0px');
    });
  });
}
