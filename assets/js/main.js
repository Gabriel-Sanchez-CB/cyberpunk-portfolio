(() => {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  // Typewriter role
  const roles = ['Cybersecurity Specialist', 'Pentester', 'Red Team Mindset', 'SOC / Incident Response'];
  const target = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeRole(){
    const current = roles[roleIndex];
    target.textContent = deleting ? current.slice(0, --charIndex) : current.slice(0, ++charIndex);
    let delay = deleting ? 45 : 70;
    if(!deleting && charIndex === current.length){ deleting = true; delay = 1300; }
    if(deleting && charIndex === 0){ deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
    setTimeout(typeRole, delay);
  }
  typeRole();

  // Matrix-like background
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let drops = [];
  const chars = '01<>/{}[]#$_+=*CYBERSEC';
  const fontSize = 14;
  function resizeCanvas(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const columns = Math.ceil(window.innerWidth / fontSize);
    drops = Array.from({length: columns}, () => Math.random() * -60);
  }
  function drawMatrix(){
    ctx.fillStyle = 'rgba(5,7,11,.09)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#36f5ff';
    drops.forEach((y,i) => {
      const c = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(c, i*fontSize, y*fontSize);
      if(y*fontSize > window.innerHeight && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
    requestAnimationFrame(drawMatrix);
  }
  resizeCanvas(); drawMatrix();
  window.addEventListener('resize', resizeCanvas);

  // Project filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-item');
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projects.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !match);
      if(match){ card.classList.add('show'); setTimeout(() => card.classList.remove('show'), 400); }
    });
  }));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Nav active state + back to top
  const sections = [...document.querySelectorAll('header[id], section[id]')];
  const links = [...document.querySelectorAll('.nav-link')];
  const backToTop = document.getElementById('backToTop');
  function onScroll(){
    const y = window.scrollY + 160;
    let active = sections[0]?.id;
    sections.forEach(sec => { if(sec.offsetTop <= y) active = sec.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Collapse mobile nav after selecting a link
  links.forEach(link => link.addEventListener('click', () => {
    const menu = document.getElementById('navbarContent');
    if(menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  // Static contact form: prepares mail client without collecting data.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      status.textContent = 'Completa los campos requeridos.';
      return;
    }
    const subject = encodeURIComponent(document.getElementById('subject').value);
    const body = encodeURIComponent(`Nombre: ${document.getElementById('name').value}\nCorreo: ${document.getElementById('email').value}\n\n${document.getElementById('message').value}`);
    status.textContent = 'Añade tu correo real en main.js para activar mailto.';
    // Replace YOUR_EMAIL@example.com with your real email before publishing.
    window.location.href = `mailto:YOUR_EMAIL@example.com?subject=${subject}&body=${body}`;
  });
})();
