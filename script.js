/* ========================================
   CUSTOM CURSOR
======================================== */
const cursorDot = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-follower');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function followRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  })();

  document.querySelectorAll('a,button,.glass-card,.skill-tag,.flip-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });
}

/* ========================================
   PARTICLE CANVAS BACKGROUND
======================================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#a78bfa'];
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : -5;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.op = Math.random() * 0.5 + 0.1;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
      this.reset(false);
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    const alpha = Math.round(this.op * 255).toString(16).padStart(2,'0');
    ctx.fillStyle = this.col + alpha;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(130, Math.floor((canvas.width * canvas.height) / 12000));
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 110) * 0.10})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

(function animCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animCanvas);
})();

/* ========================================
   PAGE LOADER
======================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('hide');
    // Trigger hero reveal after loader hides
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
        el.classList.add('visible');
      });
    }, 200);
  }, 1300);
});

/* ========================================
   HEADER SCROLL
======================================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ========================================
   SCROLL PROGRESS BAR
======================================== */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

/* ========================================
   THEME TOGGLE
======================================== */
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
html.setAttribute('data-theme', 'dark');

themeBtn.addEventListener('click', () => {
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  canvas.style.opacity = dark ? '0.28' : '0.55';
});

/* ========================================
   MOBILE NAV
======================================== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ========================================
   TYPING ANIMATION
======================================== */
const roles = ['AEM Developer', 'DevOps Engineer', 'Adobe AEM Consultant', 'Cloud Architect'];
let ri = 0, ci = 0;
const typingEl = document.getElementById('typing');

function type() {
  if (ci < roles[ri].length) {
    typingEl.textContent += roles[ri][ci++];
    setTimeout(type, 70);
  } else {
    setTimeout(erase, 2000);
  }
}
function erase() {
  if (ci > 0) {
    typingEl.textContent = roles[ri].substring(0, --ci);
    setTimeout(erase, 38);
  } else {
    ri = (ri + 1) % roles.length;
    setTimeout(type, 350);
  }
}
type();

/* ========================================
   SCROLL REVEAL (Intersection Observer)
======================================== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Only observe non-hero elements with the observer (hero is handled after loader)
document.querySelectorAll('.reveal-up, .reveal-right, .reveal-section').forEach(el => {
  if (!el.closest('.hero')) revealObs.observe(el);
});

/* ========================================
   ACTIVE NAV HIGHLIGHT
======================================== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-35% 0px -35% 0px' });

sections.forEach(s => navObs.observe(s));

/* ========================================
   COUNTER ANIMATION
======================================== */
function countUp(el, target, dur = 1400) {
  let start = 0;
  const step = target / (dur / 16);
  const t = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(t);
  }, 16);
}

const statsObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.stat-num').forEach(el => {
      countUp(el, parseInt(el.dataset.target));
    });
    statsObs.disconnect();
  }
}, { threshold: 0.6 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObs.observe(statsRow);

/* ========================================
   PROFILE 3D TILT
======================================== */
const profileWrapper = document.getElementById('profile-wrapper');
if (profileWrapper) {
  profileWrapper.addEventListener('mousemove', e => {
    const r = profileWrapper.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width;
    const y = (e.clientY - r.top  - r.height / 2) / r.height;
    profileWrapper.style.transform = `perspective(600px) rotateX(${-y*14}deg) rotateY(${x*14}deg)`;
  });
  profileWrapper.addEventListener('mouseleave', () => {
    profileWrapper.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
    profileWrapper.style.transition = 'transform 0.5s ease';
  });
  profileWrapper.addEventListener('mouseenter', () => {
    profileWrapper.style.transition = 'transform 0.1s ease';
  });
}

/* ========================================
   GLASS CARD 3D TILT
======================================== */
document.querySelectorAll('.glass-card').forEach(card => {
  if (card.closest('.flip-card')) return;
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.08s ease, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width;
    const y = (e.clientY - r.top  - r.height / 2) / r.height;
    card.style.transform = `perspective(900px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ========================================
   SCROLL TO TOP
======================================== */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
   CHATBOT — ENHANCED
======================================== */
const chatToggle  = document.getElementById('chatbot-toggle');
const chatBox     = document.getElementById('chatbot-box');
const chatClose   = document.getElementById('chatbot-close');
const chatInput   = document.getElementById('chatbot-input');
const chatSend    = document.getElementById('chatbot-send');
const chatMsgs    = document.getElementById('chatbot-messages');
const quickReplies = document.getElementById('quick-replies');

// ── Open / Close ──────────────────────────────────────────
chatToggle.addEventListener('click', () => {
  const opening = !chatBox.classList.contains('active');
  chatBox.classList.toggle('active');
  if (opening && chatMsgs.children.length === 0) initChat();
});
chatClose.addEventListener('click', () => chatBox.classList.remove('active'));

// ── Knowledge Base ────────────────────────────────────────
const KB = {
  greeting: {
    text: "Hey! 👋 I'm Aditya's portfolio assistant.\n\nI can tell you about his skills, work experience, projects, certifications, or how to get in touch. What would you like to explore?",
    chips: ['Skills & tech', 'Work experience', 'Projects built', 'Contact Aditya']
  },
  skills: {
    text: "Aditya's tech stack spans the full AEM delivery pipeline:\n\n🔷 AEM — Sites, Assets, AEMaaCS, Sling, OSGi, HTL\n⚙️ Dev — Java, REST APIs, JavaScript, React\n☁️ DevOps — Cloud Manager, Dispatcher, Jenkins, Docker, Kubernetes\n🤖 AI — Generative AI, Prompt Engineering, GenStudio",
    chips: ['AEM deep-dive', 'DevOps & Cloud', 'AI capabilities', 'Certifications']
  },
  aem: {
    text: "AEM is Aditya's core specialty. He works across the full stack:\n\n• AEM Sites & Assets (6.5 on-prem and Cloud Service)\n• Component dev in Java, HTL, OSGi, and Sling Models\n• Multi-Site Manager (MSM) and content architecture\n• AEMaaCS migration and Cloud Readiness\n• Dispatcher caching and Apache configuration\n\nHe holds 3 Adobe AEM certifications to back it up.",
    chips: ['DevOps & Cloud', 'Certifications', 'Work experience']
  },
  devops: {
    text: "Aditya is an Adobe Certified AEM DevOps Engineer (June 2025):\n\n• Designs and owns CI/CD pipelines in Cloud Manager\n• Manages zero-downtime releases across Dev, Stage & Prod\n• Engineers Dispatcher caching and Apache rewrite rules\n• Works with Jenkins, Docker, Kubernetes, and Git\n• Maintains 99.9% platform availability for enterprise clients",
    chips: ['Cloud Manager details', 'AEM skills', 'Certifications']
  },
  genai: {
    text: "Aditya is working at the AI frontier:\n\n• Contributes to Adobe GenStudio — integrating GenAI into enterprise content workflows\n• Holds a Generative AI & Prompt Engineering certification (Sep 2024)\n• Automates content production so teams scale without adding headcount\n\nThis is his fastest-growing skill area.",
    chips: ['Certifications', 'Work experience', 'All projects']
  },
  cloudmanager: {
    text: "Cloud Manager is Aditya's deployment home:\n\n• Authors multi-stage CI/CD pipelines with quality and security gates\n• Coordinates zero-downtime releases across Dev → Stage → Production\n• Manages environment variables, IP allowlisting, and SSL certificates\n• Certified AEM DevOps Engineer (June 2025) — Cloud Manager is a core exam domain",
    chips: ['DevOps & Cloud', 'AEM DevOps cert', 'Work experience']
  },
  experience: {
    text: "Aditya has been at Adobe Systems since July 2022, currently as Technical Product Consultant II.\n\n⭐ Career highlights:\n• Fortune 500 clients — finance, retail, media verticals\n• 99.9% platform availability sustained\n• ~15% team throughput improvement\n• Multiple quarterly performance awards\n• 3+ junior consultants mentored",
    chips: ['Current role (2024–now)', 'Previous role (2022–24)', 'Key achievements']
  },
  role1: {
    text: "Technical Product Consultant II — July 2024 to Present:\n\n• Architects full-stack AEMaaCS solutions for Fortune 500 clients\n• Owns CI/CD pipelines and zero-downtime releases in Cloud Manager\n• Serves as Deployment Manager across multi-environment rollouts\n• Integrates Generative AI into Adobe GenStudio workflows\n• Earned multiple quarterly performance awards",
    chips: ['Previous role', 'Key achievements', 'Skills used']
  },
  role2: {
    text: "Technical Product Consultant — July 2022 to July 2024:\n\n• Built reusable AEM component libraries in Java, HTL, and JavaScript\n• Delivered AEM 6.5 on-prem and Cloud Service implementations\n• Implemented MSM, Sling Models, OSGi configs, and SEO optimizations\n• Shipped internal developer tools saving hours of effort per sprint\n• Resolved critical escalations with permanent architectural fixes",
    chips: ['Current role', 'Projects built', 'AEM skills']
  },
  achievements: {
    text: "Key wins at Adobe:\n\n🏆 Multiple quarterly performance awards\n📈 ~15% improvement in team operational throughput\n⏱️ 99.9% platform availability for enterprise deployments\n🤖 80% reduction in manual on-call scheduling effort\n⚡ 60% reduction in environment lookup time\n👥 Mentored 3+ junior AEM engineers",
    chips: ['Work experience', 'Projects built', 'Contact Aditya']
  },
  projects: {
    text: "Aditya has shipped 4 notable projects:\n\n🧩 AEM Instance Hub — single source of truth for all environments\n🚀 AEM On-call Scheduler — eliminated 80% manual scheduling effort\n🧭 Genie Navigator — 60% faster environment lookups\n⚛ React Medical Portal — dual-role patient-doctor web app",
    chips: ['AEM Scheduler', 'Genie Navigator', 'AEM Instance Hub', 'Medical Portal']
  },
  scheduler: {
    text: "🚀 AEM On-call Scheduler\n\nTurned a weekly scheduling headache into a zero-touch system:\n\n• Eliminated ~80% of manual scheduling effort\n• Smart escalation alerts fire on missed acknowledgements\n• Role-based access for managers vs. engineers\n\nStack: AEM · Java · OSGi · REST APIs",
    chips: ['Genie Navigator', 'AEM Instance Hub', 'All projects']
  },
  navigator: {
    text: "🧭 Genie Navigator\n\nOne bookmark to rule every AEM environment:\n\n• Instant access to Author, Publish, Dispatcher & Cloud Manager\n• Reduced environment lookup time by 60%+ for consultants\n• Live health indicators surface issues before they escalate\n\nStack: HTML · CSS · JavaScript · AEM",
    chips: ['AEM Scheduler', 'AEM Instance Hub', 'All projects']
  },
  hub: {
    text: "🧩 AEM Instance Hub\n\nSingle source of truth for every AEM environment:\n\n• Centralized version, service pack & deployment metadata\n• Cuts new-hire onboarding time significantly\n• Eliminates misconfigs from environment drift\n\nStack: AEM · Java · Sling · OSGi",
    chips: ['Genie Navigator', 'AEM Scheduler', 'All projects']
  },
  medical: {
    text: "⚛ React Medical Portal\n\nA secure, accessible patient-doctor portal:\n\n• Dual-role auth — patients and doctors get permission-scoped UIs\n• Responsive dashboards for appointments and medical history\n• WCAG accessibility compliant, strong Lighthouse scores\n\nStack: React · JavaScript · REST APIs · CSS",
    chips: ['All projects', 'Skills & tech', 'Contact Aditya']
  },
  certifications: {
    text: "Aditya holds 4 professional certifications — all earned while working full-time at Adobe:\n\n🎓 AEM DevOps Engineer — Adobe Certified Expert (June 2025)\n🎓 AEM Sites Developer — Adobe Certified Expert (Aug 2024)\n🎓 AEM Assets Developer — Adobe Certified Expert (Apr 2024)\n🤖 Generative AI & Prompt Engineering (Sep 2024)",
    chips: ['AEM DevOps cert', 'Sites & Assets certs', 'AI certification']
  },
  certdevops: {
    text: "🎓 AEM DevOps Engineer — Adobe Certified Expert (June 2025)\n\nThis is Aditya's most recent certification. It validates expertise in:\n• Cloud Manager pipeline authoring and environment management\n• Dispatcher performance engineering and caching strategies\n• End-to-end AEMaaCS release automation\n• CI/CD best practices for Adobe's cloud platform",
    chips: ['Sites & Assets certs', 'AI certification', 'DevOps & Cloud']
  },
  certsites: {
    text: "🎓 AEM Sites Developer + AEM Assets Developer\n\nTwo Adobe Certified Expert credentials:\n\n• Sites Developer (Aug 2024) — component dev, Sling Models, content architecture, workflows\n• Assets Developer (Apr 2024) — DAM workflows, metadata schemas, rendition pipelines, integrations\n\nBoth demonstrate production-level AEM expertise.",
    chips: ['AEM DevOps cert', 'AI certification', 'AEM deep-dive']
  },
  certai: {
    text: "🤖 Generative AI & Prompt Engineering (Sep 2024)\n\nThis professional certification covers:\n• Prompt engineering principles and optimization techniques\n• LLM integration patterns for production workflows\n• AI-driven content automation use cases\n• Responsible AI development practices\n\nDirectly applicable to Aditya's work on Adobe GenStudio.",
    chips: ['AI capabilities', 'Work experience', 'All projects']
  },
  contact: {
    text: "Best ways to reach Aditya:\n\n📧 Email — adiusingh127@gmail.com\n💼 LinkedIn — linkedin.com/in/aditya-s-b29ab0120/\n🐙 GitHub — github.com/AdiSR127/\n📄 Resume — downloadable from the top of this page",
    chips: ['Send an email', 'LinkedIn', 'GitHub']
  },
  email: {
    text: "📧 adiusingh127@gmail.com\n\nBest for detailed introductions, project inquiries, or job opportunities. Aditya typically replies within 24 hours.",
    chips: ['LinkedIn', 'GitHub', 'Download resume']
  },
  linkedin: {
    text: "💼 linkedin.com/in/aditya-s-b29ab0120/\n\nGreat for professional introductions, networking, or exploring collaboration. Feel free to connect with a note!",
    chips: ['Send an email', 'GitHub']
  },
  github: {
    text: "🐙 github.com/AdiSR127/\n\nYou'll find Aditya's open-source tools and personal projects here — including some of the internal tools mentioned in this portfolio.",
    chips: ['Send an email', 'All projects']
  },
  resume: {
    text: "📄 Aditya's resume is available to download directly from this page.\n\nJust click the 'Download Resume' button in the hero section at the very top — it covers his full experience, skills, and certifications.",
    chips: ['Work experience', 'Skills & tech', 'Contact Aditya']
  },
  fallback: {
    text: "I didn't quite catch that — here's what I can help you explore:\n\n• Skills and tech stack\n• Work experience at Adobe\n• Projects Aditya has built\n• Certifications earned\n• Contact details",
    chips: ['Skills & tech', 'Work experience', 'Projects built', 'Contact Aditya']
  }
};

// Chip label → KB key map
const CHIP_MAP = {
  'skills & tech': 'skills', 'skills & tech stack': 'skills',
  'aem deep-dive': 'aem', 'aem skills': 'aem',
  'devops & cloud': 'devops',
  'cloud manager details': 'cloudmanager',
  'ai capabilities': 'genai',
  'work experience': 'experience',
  'current role (2024–now)': 'role1', 'current role': 'role1',
  'previous role (2022–24)': 'role2', 'previous role': 'role2',
  'key achievements': 'achievements',
  'projects built': 'projects', 'all projects': 'projects',
  'aem scheduler': 'scheduler',
  'genie navigator': 'navigator',
  'aem instance hub': 'hub',
  'medical portal': 'medical',
  'certifications': 'certifications',
  'aem devops cert': 'certdevops',
  'sites & assets certs': 'certsites',
  'ai certification': 'certai',
  'contact aditya': 'contact',
  'send an email': 'email',
  'linkedin': 'linkedin', 'linkedin profile': 'linkedin',
  'github': 'github', 'github profile': 'github',
  'download resume': 'resume',
  'skills used': 'skills',
};

// ── Intent matcher ────────────────────────────────────────
function getResponse(raw) {
  const t = raw.toLowerCase().trim();

  // Chip shortcuts
  if (CHIP_MAP[t]) return KB[CHIP_MAP[t]];

  // Greetings
  if (/^(hi|hello|hey|howdy|yo|hiya|sup|greetings|what's up)[!?.]*$/.test(t)) return KB.greeting;

  // Skills
  if (/skill|tech stack|language|framework|what.*(know|do|use|work with)/.test(t)) return KB.skills;

  // AEM-specific
  if (/\baem\b|sling|osgi|htl|sightly|jcr|content fragment|experience fragment|dam|dispatcher|wcm/.test(t)) return KB.aem;

  // DevOps
  if (/devops|ci[\s/-]?cd|pipeline|jenkins|docker|kubernetes|k8s|cloud manager|deploy/.test(t)) return KB.devops;
  if (/cloud manager/.test(t)) return KB.cloudmanager;

  // AI
  if (/gen(erative)?\s?ai|llm|prompt|genstudio|machine learn|artificial intel/.test(t)) return KB.genai;

  // Experience
  if (/experience|work history|career|professional|background|where.*work|employ/.test(t)) return KB.experience;
  if (/current role|consultant ii|present|right now|latest role/.test(t)) return KB.role1;
  if (/previous role|first job|2022|earlier role|before/.test(t)) return KB.role2;
  if (/achiev|award|impact|result|kpi|uptime|improv|metric|win/.test(t)) return KB.achievements;

  // Projects
  if (/project|built|build|made|created|portfolio|side project/.test(t)) return KB.projects;
  if (/scheduler|on.?call|rotation|oncall/.test(t)) return KB.scheduler;
  if (/navigator|genie|environment.*dash|lookup/.test(t)) return KB.navigator;
  if (/hub|instance.*hub|inventory/.test(t)) return KB.hub;
  if (/medical|portal|patient|doctor|react.*portal/.test(t)) return KB.medical;

  // Certifications
  if (/cert|certificat|qualif|credential|badge|adobe exam/.test(t)) return KB.certifications;
  if (/devops.*cert|cert.*devops/.test(t)) return KB.certdevops;
  if (/sites.*cert|assets.*cert|cert.*sites|cert.*assets/.test(t)) return KB.certsites;
  if (/ai.*cert|cert.*ai|prompt.*cert/.test(t)) return KB.certai;

  // Contact
  if (/contact|reach|hire|available|opportunit|get in touch/.test(t)) return KB.contact;
  if (/email|mail|gmail/.test(t)) return KB.email;
  if (/linkedin/.test(t)) return KB.linkedin;
  if (/github|git\b|repo|open.?source/.test(t)) return KB.github;
  if (/resume|cv|download/.test(t)) return KB.resume;

  return KB.fallback;
}

// ── Helpers ───────────────────────────────────────────────
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  const content = who === 'user'
    ? escHtml(text)
    : text.replace(/\n/g, '<br>');
  div.innerHTML = `<div class="msg-text">${content}</div><span class="msg-time">${getTime()}</span>`;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'msg bot typing-indicator';
  el.id = 'chat-typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  chatMsgs.appendChild(el);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function hideTyping() {
  document.getElementById('chat-typing')?.remove();
}

function showChips(chips) {
  quickReplies.innerHTML = '';
  if (!chips?.length) { quickReplies.classList.remove('visible'); return; }
  chips.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'quick-chip';
    btn.textContent = label;
    btn.addEventListener('click', () => dispatch(label));
    quickReplies.appendChild(btn);
  });
  quickReplies.classList.add('visible');
}

function dispatch(text) {
  if (!text.trim()) return;
  addMsg(text, 'user');
  chatInput.value = '';
  showChips([]);
  showTyping();
  const delay = 650 + Math.random() * 550;
  setTimeout(() => {
    hideTyping();
    const res = getResponse(text);
    addMsg(res.text, 'bot');
    showChips(res.chips);
  }, delay);
}

function initChat() {
  // Welcome card (not a chat bubble — a soft intro)
  const welcome = document.createElement('div');
  welcome.className = 'chat-welcome';
  welcome.innerHTML = `
    <div class="chat-welcome-avatar">AS</div>
    <strong>Hi, I'm Aditya's assistant!</strong>
    Ask me anything about his work, skills, or how to get in touch.
  `;
  chatMsgs.appendChild(welcome);
  showChips(['Skills & tech', 'Work experience', 'Projects built', 'Contact Aditya']);
}

// ── Send ──────────────────────────────────────────────────
function sendMsg() { dispatch(chatInput.value.trim()); }

chatSend.addEventListener('click', sendMsg);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });
