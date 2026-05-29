import './style.css';

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initThemeToggler();
  initCustomCursor();
  initHeroTilt();
  initParticleCanvas();
  initMobileMenu();
  initScrollEffects();
  initStatsCounter();
  initProjectFilters();
  initProjectModals();
  initSkillModals();
  initTestimonialsCarousel();
  initContactForm();
  initAICopilot();
  initToolModals();
});

/* ==========================================================================
   THEME TOGGLER SYSTEM (UI/UX)
   ========================================================================== */
function initThemeToggler() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const body = document.body;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initialize theme based on preference (default to light as requested, but support dark)
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.add('dark-mode');
    updateThemeIcon(true);
  } else {
    body.classList.remove('dark-mode');
    updateThemeIcon(false);
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });

  function updateThemeIcon(isDark) {
    toggleBtn.innerHTML = isDark 
      ? `<i data-lucide="sun" class="theme-icon"></i>` 
      : `<i data-lucide="moon" class="theme-icon"></i>`;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

/* ==========================================================================
   CUSTOM CURSOR SYSTEM
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0; // Target coordinates
  let cursorX = 0, cursorY = 0; // Lerped coordinates for outer cursor
  let dotX = 0, dotY = 0; // Lerped coordinates for inner dot

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
}

/* ==========================================================================
   HERO 3D PARALLAX TILT SYSTEM
   ========================================================================== */
function initHeroTilt() {
  const wrapper = document.querySelector('.avatar-glow-wrapper');
  if (!wrapper) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let isHovered = false;

  const handleMouseMove = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const wrapperCenterX = rect.left + rect.width / 2;
    const wrapperCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - wrapperCenterX;
    const dy = e.clientY - wrapperCenterY;

    // Radius of influence (px)
    const maxDistance = 600;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < maxDistance) {
      isHovered = true;
      const maxTilt = 12; // Maximum tilt angle in degrees
      
      // Calculate target tilt values
      // Normalize values by bounds
      mouseX = (dx / (window.innerWidth / 2)) * maxTilt;
      mouseY = -(dy / (window.innerHeight / 2)) * maxTilt;
    } else {
      isHovered = false;
      mouseX = 0;
      mouseY = 0;
    }
  };

  const handleMouseLeave = () => {
    isHovered = false;
    mouseX = 0;
    mouseY = 0;
  };

  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);

  function animateTilt() {
    // Premium fluid dampening (lerp)
    const lerpFactor = 0.08;
    currentRotateX += (mouseY - currentRotateX) * lerpFactor;
    currentRotateY += (mouseX - currentRotateY) * lerpFactor;

    // Reset style when close to zero and not hovered
    if (!isHovered && Math.abs(currentRotateX) < 0.01 && Math.abs(currentRotateY) < 0.01) {
      currentRotateX = 0;
      currentRotateY = 0;
      wrapper.style.transform = '';
    } else {
      wrapper.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    }

    requestAnimationFrame(animateTilt);
  }

  animateTilt();
}

/* ==========================================================================
   CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 18000));
  const connectionDistance = 110;
  const repelRadius = 130;

  const mouse = { x: null, y: null, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      
      const colors = [
        'rgba(6, 182, 212, 0.4)', // cyan
        'rgba(109, 40, 217, 0.4)', // purple
        'rgba(29, 78, 216, 0.3)', // blue
        'rgba(219, 39, 119, 0.3)' // pink
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.active && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          // Subtle lines depending on dark or light mode
          const isDark = document.body.classList.contains('dark-mode');
          const lineAlpha = isDark ? 0.12 : 0.08;
          const opacity = (1 - (dist / connectionDistance)) * lineAlpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(8, 145, 178, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      }
    });
  });
}

/* ==========================================================================
   SCROLL EFFECTS & BACK TO TOP (UI/UX)
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    // Header sticky styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to top button visibility (UI/UX)
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  // Smooth scroll back to top on click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Intersection Observer for scroll animation reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.05 // Lower threshold for better mobile and tall element behavior
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Intersection Observer for active link state
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-50% 0px -50% 0px'
  });

  sections.forEach(section => {
    activeObserver.observe(section);
  });
}

/* ==========================================================================
   ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statsContainer = document.getElementById('stats-container');
  const numbers = document.querySelectorAll('.stat-number');
  
  if (!statsContainer || numbers.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      
      numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let start = 0;

        const timer = setInterval(() => {
          start += 1;
          num.textContent = start;
          
          if (start >= target) {
            num.textContent = target;
            clearInterval(timer);
          }
        }, stepTime);
      });
      
      observer.unobserve(statsContainer);
    }
  }, {
    threshold: 0.3
  });

  observer.observe(statsContainer);
}

/* ==========================================================================
   PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering card click
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT DETAILED MODAL DATA & CONTROLLER (UI/UX)
   ========================================================================== */
const projectsDetails = {
  "e-learning": {
    title: "Plateforme E-Learning",
    category: "Applications Web & SaaS",
    desc: "Une plateforme d'apprentissage en ligne moderne et complète, dotée d'une architecture résiliente, conçue pour gérer efficacement le suivi académique et l'administration.",
    challenge: "Créer un système d'apprentissage synchrone et asynchrone performant, capable de gérer des dizaines de cours interactifs et de centraliser les tableaux de bord d'administration sans baisse de vitesse.",
    solution: "Déploiement d'une architecture NextJS optimisée pour le Server Side Rendering (SSR), structurée avec Prisma ORM pour dialoguer de manière sécurisée avec PostgreSQL. Intégration de workflows d'analyse pour le suivi administratif des étudiants.",
    features: [
      "Authentification sécurisée des profils étudiants, enseignants et administrateurs.",
      "Tableau de bord administrateur exhaustif pour le suivi des inscriptions et progrès.",
      "Calendrier interactif synchronisé en temps réel.",
      "Système de leçons modulaires avec indicateurs de complétion."
    ],
    tech: ["NextJS", "PostgreSQL", "Tailwind", "Prisma", "Vercel"],
    codeLink: "https://github.com/christian-loulouamb",
    liveLink: "https://christian-loulouamb.vercel.app",
    color: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    icon: "book-open"
  },
  "saas-gestion": {
    title: "SaaS de Gestion d'Entreprise",
    category: "Applications Web & SaaS",
    desc: "Une solution logicielle SaaS professionnelle pour planifier, coordonner et optimiser les flux de production, le travail d'équipe et la gestion interne des entreprises.",
    challenge: "Établir une base logicielle modulaire capable de gérer de multiples organisations (multi-tenant) tout en assurant des performances élevées et une séparation étanche des flux de données.",
    solution: "Développement d'une API backend robuste avec NestJS (Node.js) structurée pour le passage à l'échelle. Modélisation de base de données relationnelle PostgreSQL et intégration d'un front-end réactif configuré en Tailwind CSS.",
    features: [
      "Architecture logicielle multi-locataire (multi-tenant) hautement sécurisée.",
      "Gestion de projets agile avec assignation de tâches et statuts dynamiques.",
      "Outils de planification partagés et attribution fine des rôles et droits.",
      "Suivi analytique des flux d'affaires et indicateurs de performance."
    ],
    tech: ["NestJS", "Node.js", "PostgreSQL", "Tailwind", "Vercel"],
    codeLink: "https://github.com/christian-loulouamb",
    liveLink: "https://christian-loulouamb.vercel.app",
    color: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    icon: "database"
  },
  "iot-domotique": {
    title: "Système IoT Domotique",
    category: "IoT & Domotique",
    desc: "Une plateforme intégrée associant électronique embarquée et protocoles de réseau légers pour surveiller et piloter à distance les équipements d'un habitat intelligent.",
    challenge: "Assurer une transmission bidirectionnelle ultra-rapide et de faible consommation électrique entre les capteurs physiques et l'IHM de contrôle, malgré les coupures réseau potentielles.",
    solution: "Conception de firmwares C++ optimisés sur puces ESP32. Utilisation du protocole de messagerie léger MQTT pour la transmission vers une base temporelle InfluxDB et orchestration des alertes via Node-RED.",
    features: [
      "Lecture en temps réel des données thermiques, d'humidité et de présence.",
      "Transmission asynchrone hautement optimisée via protocole MQTT.",
      "Tableau de bord de supervision graphique réactif aux événements.",
      "Alertes de sécurité intelligentes en cas de franchissement de seuils critiques."
    ],
    tech: ["ESP32", "MQTT", "InfluxDB", "Node-RED", "C++"],
    codeLink: "https://github.com/christian-loulouamb",
    liveLink: "#",
    color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    icon: "home"
  },
  "detect-intrusion": {
    title: "Système de Détection d'Intrusion Réseau",
    category: "Cybersécurité & Réseau",
    desc: "Un outil de surveillance des flux réseau analysant les paquets de données en temps réel pour contrer les menaces et identifier les signatures d'attaques suspectes.",
    challenge: "Éviter le ralentissement du trafic tout en analysant chaque en-tête de paquet réseau et en gérant des volumes de logs massifs sans perte d'information.",
    solution: "Script d'écoute réseau asynchrone écrit en Python avec la bibliothèque Scapy. Indexation et visualisation en temps réel des alertes de sécurité dans une suite analytique ELK (Elasticsearch/Logstash/Kibana).",
    features: [
      "Analyse de paquets à la volée et détection des scans de ports et attaques SYN Flood.",
      "Génération automatique d'alertes instantanées par email et journalisation sécurisée.",
      "Tableaux de bord Kibana de repérage géographique des anomalies réseau.",
      "Base de données locale SQLite optimisée pour l'historisation des menaces."
    ],
    tech: ["Python", "Scapy", "ELK Stack", "SQLite"],
    codeLink: "https://github.com/christian-loulouamb",
    liveLink: "#",
    color: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    icon: "shield-alert"
  },
  "portfolio": {
    title: "Portfolio Personnel Interactif",
    category: "Applications Web & SaaS",
    desc: "Site vitrine personnel immersif conçu pour valoriser une expertise d'ingénieur via des visuels fluides, un parcours détaillé et un blog technique intégré.",
    challenge: "Concevoir un site web d'une fluidité irréprochable (60fps) combinant de multiples animations (Canvas, transitions, lévitation) sans nuire à l'optimisation SEO ni au temps de chargement.",
    solution: "Développement en NextJS/HTML5 sémantique. Intégration de styles Vanilla CSS légers et utilisation de l'API Intersection Observer pour ne déclencher les ressources qu'au scroll.",
    features: [
      "Conception responsive fluide s'adaptant des smartphones aux écrans 4K.",
      "Animations de particules interactives sur Canvas réagissant au pointeur.",
      "Chiffres clés animés et timeline dynamique interactive.",
      "Optimisation SEO complète pour un positionnement optimal sur les moteurs."
    ],
    tech: ["NextJS", "Tailwind", "Framer Motion", "Vercel", "Intersection API"],
    codeLink: "https://github.com/christian-loulouamb",
    liveLink: "https://christian-loulouamb.vercel.app",
    color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    icon: "user"
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal || !backdrop || !closeBtn || projectCards.length === 0) return;

  // Elements to populate inside modal
  const mTitle = document.getElementById('modal-title');
  const mCategory = document.getElementById('modal-category');
  const mDesc = document.getElementById('modal-desc');
  const mChallenge = document.getElementById('modal-challenge');
  const mSolution = document.getElementById('modal-solution');
  const mFeatures = document.getElementById('modal-features');
  const mTech = document.getElementById('modal-tech');
  const mLinkCode = document.getElementById('modal-link-code');
  const mLinkLive = document.getElementById('modal-link-live');
  const mVisual = document.getElementById('modal-visual');
  const mIcon = document.getElementById('modal-icon');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const details = projectsDetails[projectId];

      if (!details) return;

      // Populate Modal Content
      mTitle.textContent = details.title;
      mCategory.textContent = details.category;
      mDesc.textContent = details.desc;
      mChallenge.textContent = details.challenge;
      mSolution.textContent = details.solution;

      // Set Header Gradient and Icon
      mVisual.style.background = details.color;
      if (mIcon) {
        mIcon.setAttribute('data-lucide', details.icon);
      }

      // Populate Features list
      mFeatures.innerHTML = '';
      details.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        mFeatures.appendChild(li);
      });

      // Populate Tech badges
      mTech.innerHTML = '';
      details.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-badge';
        span.textContent = t;
        mTech.appendChild(span);
      });

      // Update Links
      mLinkCode.href = details.codeLink;
      if (details.liveLink && details.liveLink !== '#') {
        mLinkLive.href = details.liveLink;
        mLinkLive.style.display = 'inline-flex';
      } else {
        mLinkLive.style.display = 'none';
      }

      // Refresh Lucide Icons inside modal
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Open Modal with lock scroll
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handler functions
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   SKILL DETAILED MODAL DATA & CONTROLLER (UI/UX)
   ========================================================================== */
const skillsDetails = {
  "iot": {
    title: "IoT & Systèmes Embarqués",
    category: "Internet of Things",
    desc: "Conception et déploiement de solutions d'objets connectés et de systèmes embarqués intelligents pour l'acquisition et le contrôle de données physiques en temps réel.",
    advantages: [
      "Optimisation de la consommation énergétique des capteurs industriels.",
      "Transmission de données résiliente même sous bande passante restreinte.",
      "Traitement local des données (Edge Computing) pour des décisions instantanées."
    ],
    usecase: "Création de systèmes de suivi environnemental en usine et automatisation d'IHM de contrôle avec alertes SMS/Email instantanées.",
    tech: ["ESP32", "Arduino", "Raspberry Pi", "C/C++", "MQTT", "CoAP"],
    image: "/iot_electronics.png",
    color: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
    icon: "cpu"
  },
  "ia": {
    title: "Intelligence Artificielle",
    category: "Machine Learning & AI",
    desc: "Intégration de modèles de Machine Learning et d'outils de Deep Learning/LLM pour analyser, prédire et automatiser les flux d'informations métiers.",
    advantages: [
      "Automatisation intelligente des processus administratifs et techniques complexes.",
      "Analyse prédictive des pannes sur les machines industrielles (Predictive Maintenance).",
      "Génération et traitement automatisés de rapports et de données d'affaires."
    ],
    usecase: "Mise en place d'assistants IA conversationnels et de modèles de vision par ordinateur pour le contrôle qualité automatique de pièces en ligne.",
    tech: ["Python", "TensorFlow", "Scikit-Learn", "OpenCV", "Prompt Engineering"],
    image: "/ai_automation.png",
    color: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    icon: "brain-circuit"
  },
  "cyber": {
    title: "Cybersécurité & Réseaux",
    category: "Sécurité & Infrastructure",
    desc: "Audits de sécurité, sécurisation des protocoles IoT/industriels et implémentation de systèmes de détection d'intrusions (IDS) performants.",
    advantages: [
      "Protection contre les intrusions externes et les fuites de données d'entreprise.",
      "Sécurisation des communications sensibles par chiffrement de bout en bout.",
      "Surveillance continue et identification rapide des comportements suspects sur le réseau."
    ],
    usecase: "Configuration de réseaux industriels segmentés et déploiement d'IDS légers pour surveiller en temps réel l'intégrité de parcs d'équipements IoT.",
    tech: ["TCP/IP", "VPN", "Kali Linux", "Nmap", "Wireshark", "Metasploit", "OWASP"],
    image: "/cybersecurity.png",
    color: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
    icon: "shield-check"
  },
  "workflows": {
    title: "Automatisation & Workflows",
    category: "No-Code & Orchestration",
    desc: "Création de pipelines de données et d'automatisation de tâches entre applications cloud pour éliminer les processus manuels et améliorer la productivité.",
    advantages: [
      "Gain de temps massif sur la synchronisation des données inter-services.",
      "Élimination complète des risques d'erreurs liés à la saisie manuelle.",
      "Flexibilité totale pour connecter des outils Web modernes et des bases de données."
    ],
    usecase: "Interconnexion automatique de formulaires clients avec des CRM d'entreprise et des systèmes de messagerie industrielle via des APIs.",
    tech: ["n8n", "Make (Integromat)", "Zapier", "Webhooks", "APIs REST"],
    image: "/ai_automation.png",
    color: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)",
    icon: "git-branch"
  },
  "fullstack": {
    title: "Développement Full-Stack",
    category: "Applications Web",
    desc: "Conception d'applications Web interactives, performantes et scalables, du front-end responsive aux bases de données et APIs sécurisées.",
    advantages: [
      "Interface utilisateur réactive et ultra-fluide (Single Page Application).",
      "Back-ends sécurisés capables de traiter de lourdes requêtes de données en parallèle.",
      "Modélisation de bases de données relationnelles et non relationnelles optimisée."
    ],
    usecase: "Création de tableaux de bord industriels en temps réel affichant les données d'acquisition en provenance d'usines.",
    tech: ["React", "Next.js", "Node.js", "Express", "TypeScript", "PostgreSQL", "MongoDB"],
    image: "/fullstack_cloud.png",
    color: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    icon: "code-2"
  },
  "electricite": {
    title: "Électricité Industrielle",
    category: "Énergie & Câblage",
    desc: "Lecture de schémas électriques complexes, câblage d'armoires et maintenance préventive/corrective des installations électriques BT/HT.",
    advantages: [
      "Respect rigoureux des normes de sécurité électrique industrielles.",
      "Conception d'armoires électriques robustes et bien ventilées.",
      "Diagnostic et dépannage rapide des pannes électriques d'équipements."
    ],
    usecase: "Câblage complet d'armoires d'automatisation avec disjoncteurs, relais thermiques et variateurs de vitesse.",
    tech: ["Schémas BT/HT", "Câblage", "Protection", "Distribution", "Mise à la terre"],
    image: "/electricity_plc.png",
    color: "linear-gradient(135deg, #7c3aed 0%, #1d4ed8 100%)",
    icon: "zap"
  },
  "api": {
    title: "API & Automates (Zelio, etc.)",
    category: "Automatique Industrielle",
    desc: "Programmation d'automates programmables industriels (API) pour piloter des processus physiques d'usine de manière logique et séquentielle.",
    advantages: [
      "Haute fiabilité de fonctionnement 24h/24 en environnement industriel sévère.",
      "Flexibilité de modification logique sans modification du câblage physique.",
      "Supervision simplifiée avec des IHM tactiles intuitives et réactives."
    ],
    usecase: "Automatisation d'une station de pompage d'eau avec automate Zelio Logic et gestion des alarmes de niveau.",
    tech: ["Zelio Soft", "SoMachine", "Ladder (LD)", "FBD", "Grafcet (SFC)", "IHM"],
    image: "/electricity_plc.png",
    color: "linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)",
    icon: "layers"
  },
  "electronique": {
    title: "Électronique",
    category: "Circuits & Hardware",
    desc: "Conception de circuits électroniques analogiques et numériques, routage de PCB et dépannage de cartes mères défectueuses.",
    advantages: [
      "Création de prototypes électroniques sur-mesure pour des applications IoT.",
      "Dépannage au composant près (soudures CMS, remplacement de condensateurs).",
      "Mesures précises des signaux physiques avec oscilloscope et multimètre."
    ],
    usecase: "Conception d'une carte d'acquisition de température sur-mesure basée sur un microcontrôleur AVR.",
    tech: ["PCB Design", "Circuits Analogiques/Numériques", "Soudure CMS", "Oscilloscope", "Multimètre"],
    image: "/iot_electronics.png",
    color: "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)",
    icon: "radio"
  },
  "cloud": {
    title: "Cloud & DevOps (Vercel)",
    category: "Déploiement & CI/CD",
    desc: "Hébergement, intégration continue (CI/CD) et automatisation du déploiement d'applications cloud résilientes et disponibles.",
    advantages: [
      "Déploiements instantanés et sécurisés à chaque push Git.",
      "Scalabilité automatique de l'hébergement pour absorber la charge de trafic.",
      "Pipelines d'intégration continue automatisés (GitHub Actions)."
    ],
    usecase: "Configuration d'un pipeline CI/CD automatisé pour le déploiement d'un tableau de bord de supervision sur Vercel.",
    tech: ["Vercel", "GitHub Actions", "Docker", "Netlify", "Postman", "VS Code"],
    image: "/fullstack_cloud.png",
    color: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
    icon: "cloud-lightning"
  },
  "uiux": {
    title: "UI/UX & Design",
    category: "Design Graphique & Web",
    desc: "Création de maquettes interactives et d'interfaces utilisateur modernes mettant l'accent sur l'accessibilité et la fluidité de navigation.",
    advantages: [
      "Interfaces engageantes favorisant une prise en main immédiate par l'utilisateur.",
      "Respect rigoureux des chartes graphiques et de l'ergonomie moderne.",
      "Maquettes haute fidélité interactives facilitant l'intégration par le développeur."
    ],
    usecase: "Maquettage complet de l'interface mobile d'une application domotique sous Figma.",
    tech: ["Figma", "Photoshop", "Glassmorphism", "Responsive Design", "Wireframing"],
    image: "/design_management.png",
    color: "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
    icon: "palette"
  },
  "agile": {
    title: "Gestion de projet Agile",
    category: "Méthodologie & Cadrage",
    desc: "Cadrage de projets complexes, gestion des livrables par itérations (Sprints) et coordination d'équipes techniques pluridisciplinaires.",
    advantages: [
      "Livraisons régulières et visibilité totale sur l'avancement du projet.",
      "Adaptabilité rapide face aux changements de besoins du client.",
      "Cadrage clair des spécifications fonctionnelles et techniques en amont."
    ],
    usecase: "Gestion d'un projet de migration logicielle sur 3 mois en utilisant le framework Scrum.",
    tech: ["Scrum", "Kanban", "Trello", "Agile Roadmap", "Cadrage technique"],
    image: "/design_management.png",
    color: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    icon: "briefcase"
  },
  "communication": {
    title: "Communication & Closing",
    category: "Relations Client & Vente",
    desc: "Présentation d'offres techniques complexes de manière accessible et négociation commerciale (closing) de contrats.",
    advantages: [
      "Traduction claire de concepts d'ingénierie complexes pour les décideurs non techniques.",
      "Écoute active pour cerner précisément les besoins métiers du client.",
      "Négociation commerciale et closing de contrats à forte valeur ajoutée."
    ],
    usecase: "Présentation d'un plan d'automatisation d'usine devant un comité de direction et obtention de l'accord commercial.",
    tech: ["Closing", "Pitch commercial", "Négociation B2B", "Vulgarisation technique"],
    image: "/design_management.png",
    color: "linear-gradient(135deg, #0891b2 0%, #db2777 100%)",
    icon: "message-square-text"
  }
};

function initSkillModals() {
  const modal = document.getElementById('skill-modal');
  const backdrop = document.getElementById('skill-modal-backdrop');
  const closeBtn = document.getElementById('skill-modal-close');
  const skillCards = document.querySelectorAll('.key-skill-card.clickable-card');

  if (!modal || !backdrop || !closeBtn || skillCards.length === 0) return;

  // Elements to populate inside modal
  const mTitle = document.getElementById('skill-modal-title');
  const mCategory = document.getElementById('skill-modal-category');
  const mDesc = document.getElementById('skill-modal-desc');
  const mAdvantages = document.getElementById('skill-modal-advantages');
  const mUseCase = document.getElementById('skill-modal-usecase');
  const mTech = document.getElementById('skill-modal-tech');
  const mImage = document.getElementById('skill-modal-image');
  const mVisual = document.getElementById('skill-modal-visual');
  const mIcon = document.getElementById('skill-modal-icon');

  skillCards.forEach(card => {
    card.addEventListener('click', () => {
      const skillId = card.getAttribute('data-skill-id');
      const details = skillsDetails[skillId];

      if (!details) return;

      // Populate Modal Content
      mTitle.textContent = details.title;
      mCategory.textContent = details.category;
      mDesc.textContent = details.desc;
      mUseCase.textContent = details.usecase;

      // Set Header Gradient and Icon
      mVisual.style.background = details.color;
      if (mIcon) {
        mIcon.className = 'modal-visual-icon'; // reset styles
        mIcon.setAttribute('data-lucide', details.icon);
      }

      // Populate Advantages list
      mAdvantages.innerHTML = '';
      details.advantages.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        mAdvantages.appendChild(li);
      });

      // Populate Tech badges
      mTech.innerHTML = '';
      details.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-badge';
        span.textContent = t;
        mTech.appendChild(span);
      });

      // Set Illustration Image
      if (mImage) {
        mImage.src = details.image;
        mImage.alt = details.title;
      }

      // Refresh Lucide Icons inside modal
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Open Modal with lock scroll
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handler functions
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   TESTIMONIALS CAROUSEL SLIDER
   ========================================================================== */
function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonials-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoplayInterval;

  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === currentSlide) {
        slide.classList.add('active');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i === currentSlide) {
        dot.classList.add('active');
      }
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAutoplay();
    showSlide(currentSlide + 1);
    startAutoplay();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAutoplay();
    showSlide(currentSlide - 1);
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const slideIndex = parseInt(dot.getAttribute('data-slide'));
      stopAutoplay();
      showSlide(slideIndex);
      startAutoplay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', stopAutoplay);
  carousel.addEventListener('touchend', startAutoplay);

  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   CONTACT FORM HANDLER & VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetBtn = document.getElementById('btn-reset-form');

  if (!form || !successOverlay || !resetBtn) return;

  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent) {
        parent.classList.remove('invalid');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      const val = input.value.trim();
      const parent = input.closest('.form-group');
      
      if (input.hasAttribute('required') && val === '') {
        isValid = false;
        if (parent) parent.classList.add('invalid');
      }

      if (input.type === 'email' && val !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isValid = false;
          if (parent) parent.classList.add('invalid');
        }
      }
    });

    if (isValid) {
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Envoi en cours...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        successOverlay.classList.add('active');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    }
  });

  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    successOverlay.classList.remove('active');
  });
}

/* ==========================================================================
   AI AGENT PORTFOLIO COPILOT (CL_COPILOT)
   ========================================================================== */
function initAICopilot() {
  const wrapper = document.getElementById('ai-copilot-wrapper');
  const trigger = document.getElementById('ai-copilot-trigger');
  const panel = document.getElementById('ai-chat-panel');
  const closeBtn = document.getElementById('ai-chat-close');
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const chatBody = document.getElementById('ai-chat-body');
  const suggestions = document.getElementById('ai-chat-suggestions');

  if (!wrapper || !trigger || !panel || !closeBtn || !form || !input || !chatBody) return;

  // Rich conversational state memory
  const sessionContext = {
    history: [], // { role: 'user'|'bot', text: string }
    lastIntent: null
  };

  // Toggle Chat Panel
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = panel.classList.toggle('active');
    trigger.classList.toggle('active');
    if (isActive) {
      setTimeout(() => input.focus(), 300);
      scrollToBottom();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.remove('active');
    trigger.classList.remove('active');
  });

  // Close when clicking outside the chat panel
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('active') && !wrapper.contains(e.target)) {
      panel.classList.remove('active');
      trigger.classList.remove('active');
    }
  });

  // Event Delegation for reasoning toggling (collapsible)
  chatBody.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.reasoning-toggle');
    if (!toggleBtn) return;
    const block = toggleBtn.closest('.reasoning-block');
    if (block) {
      block.classList.toggle('collapsed');
    }
  });

  // Handle Suggestion Chips click
  suggestions.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip) return;
    const question = chip.getAttribute('data-question');
    handleUserMessage(question);
  });

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    handleUserMessage(message);
  });

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender} animate-bubble`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = text;
    
    messageDiv.appendChild(bubble);
    chatBody.appendChild(messageDiv);
    
    // Refresh Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    scrollToBottom();
  }

  function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'chat-message bot typing-msg animate-bubble';
    indicatorDiv.id = 'typing-indicator-msg';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble typing-indicator';
    bubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    
    indicatorDiv.appendChild(bubble);
    chatBody.appendChild(indicatorDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator-msg');
    if (indicator) {
      indicator.remove();
    }
  }

  // Markdown → HTML renderer (bold, italic, links)
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\((.+?)\)\[(.+?)\]/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // Build reasoning block HTML
  function buildReasoningBlock(steps) {
    if (!steps || steps.length === 0) return '';
    return `
      <div class="reasoning-block collapsed">
        <button class="reasoning-toggle" aria-label="Afficher/masquer le raisonnement" type="button">
          <span class="reasoning-toggle-title">
            <i data-lucide="brain" class="reasoning-brain-icon"></i>
            <span>Processus de réflexion...</span>
          </span>
          <i data-lucide="chevron-down" class="reasoning-chevron"></i>
        </button>
        <div class="reasoning-content">
          ${steps.map(step => `<div class="reasoning-step">${step}</div>`).join('')}
        </div>
      </div>
    `;
  }

  // Render bot message (reasoning + reply)
  function renderBotMessage(reply, reasoning, callback) {
    removeTypingIndicator();
    let html = buildReasoningBlock(reasoning);
    html += `<div class="bot-reply-text">${renderMarkdown(reply)}</div>`;
    appendMessage(html, 'bot');
    sessionContext.history.push({ role: 'bot', text: reply });
    if (callback) setTimeout(callback, 400);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Trigger UI callbacks based on message query or reply
  function triggerCallbacksBasedOnContent(userQuery, botReply) {
    const combined = (userQuery + ' ' + botReply).toLowerCase();
    
    if (combined.includes("formulaire de contact") || combined.includes("me contacter") || combined.includes("contactez") || combined.includes("formulaire")) {
      setTimeout(() => scrollToSection('contact'), 400);
    } else if (combined.includes("projet domotique") || combined.includes("domotique connectee") || combined.includes("domotique")) {
      setTimeout(() => triggerProjectModal('iot-domotique'), 400);
    } else if (combined.includes("e-learning") || combined.includes("plateforme e-learning") || combined.includes("cours en ligne")) {
      setTimeout(() => triggerProjectModal('e-learning'), 400);
    } else if (combined.includes("saas de gestion") || combined.includes("saas de gestion d'entreprise") || combined.includes("gestion d'entreprise")) {
      setTimeout(() => triggerProjectModal('saas-gestion'), 400);
    } else if (combined.includes("detection d'intrusion") || combined.includes("intrusion reseau") || combined.includes("ids reseau")) {
      setTimeout(() => triggerProjectModal('detect-intrusion'), 400);
    } else if (combined.includes("portfolio personnel") || combined.includes("portfolio interactif")) {
      setTimeout(() => triggerProjectModal('portfolio'), 400);
    } else if (combined.includes("expertise en ia") || combined.includes("intelligence artificielle") || combined.includes("machine learning")) {
      setTimeout(() => triggerSkillModal('ia'), 400);
    } else if (combined.includes("expertise en iot") || combined.includes("systemes embarques") || combined.includes("embarque")) {
      setTimeout(() => triggerSkillModal('iot'), 400);
    } else if (combined.includes("automates") || combined.includes("automate programm") || combined.includes("zelio")) {
      setTimeout(() => triggerSkillModal('api'), 400);
    } else if (combined.includes("electricite industrielle") || combined.includes("electricite")) {
      setTimeout(() => triggerSkillModal('electricite'), 400);
    } else if (combined.includes("electronique") || combined.includes("pcb")) {
      setTimeout(() => triggerSkillModal('electronique'), 400);
    } else if (combined.includes("workflow") || combined.includes("automatisation") || combined.includes("n8n") || combined.includes("make")) {
      setTimeout(() => triggerSkillModal('workflows'), 400);
    } else if (combined.includes("developpement full-stack") || combined.includes("genie logiciel") || combined.includes("fullstack")) {
      setTimeout(() => triggerSkillModal('fullstack'), 400);
    } else if (combined.includes("projets realises") || combined.includes("ses projets") || combined.includes("realisation")) {
      setTimeout(() => scrollToSection('projets'), 400);
    } else if (combined.includes("competences") || combined.includes("expertises") || combined.includes("technologies")) {
      setTimeout(() => scrollToSection('competences'), 400);
    } else if (combined.includes("parcours") || combined.includes("experience") || combined.includes("etudes") || combined.includes("timeline")) {
      setTimeout(() => scrollToSection('experience'), 400);
    }
  }

  // ── Main message handler (async — tries backend API first) ─────────────────
  async function handleUserMessage(message) {
    appendMessage(message, 'user');
    showTypingIndicator();
    sessionContext.history.push({ role: 'user', text: message });

    // Build history for API (last 10 messages for context window)
    const apiHistory = sessionContext.history.slice(-10).map(h => ({
      role: h.role,
      text: h.text
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          history: apiHistory
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      if (data.fallback) {
        throw new Error('API requested fallback to local dictionary');
      }

      renderBotMessage(data.reply, data.reasoning);
      triggerCallbacksBasedOnContent(message, data.reply);

    } catch (error) {
      console.warn('AI Chatbot falling back to local dictionaries:', error);
      
      // Run local dictionary matching
      const localResponse = getAgentResponse(message);
      
      sessionContext.lastIntent = localResponse.intent;
      updateSuggestionChips(localResponse.intent);

      const delay = 600 + Math.random() * 400;
      setTimeout(() => {
        renderBotMessage(localResponse.reply, localResponse.reasoning, localResponse.callback);
      }, delay);
    }
  }

  // Dynamic Suggestion Chips based on intent state
  function updateSuggestionChips(intent) {
    suggestions.innerHTML = '';
    let chips = [];

    if (intent === 'api-response' || intent === 'tech-ml' || intent === 'tech-tcpip' || intent === 'tech-docker') {
      chips = [
        { label: '🛡️ Défends son profil', query: 'Pourquoi Christian est-il un bon candidat pour un poste senior ?' },
        { label: '📂 Ses projets', query: 'Présente-moi ses projets réalisés.' },
        { label: '✉️ Le contacter', query: 'Comment puis-je contacter Christian ?' }
      ];
    } else if (['skill-iot', 'skill-api', 'skill-electronique', 'skill-electricite', 'project-domotique'].includes(intent)) {
      chips = [
        { label: '🏠 Projet Domotique', query: 'Montre-moi son projet de domotique' },
        { label: '🧠 Ses expertises en IA', query: 'Quelles sont ses compétences en Intelligence Artificielle ?' },
        { label: '✉️ Le contacter', query: 'Prendre contact avec Christian' }
      ];
    } else if (['skill-ia', 'skill-fullstack', 'skill-workflows', 'project-saas', 'project-e-learning'].includes(intent)) {
      chips = [
        { label: '💼 SaaS de Gestion', query: 'Présente-moi son SaaS de Gestion' },
        { label: '📚 Plateforme E-Learning', query: 'Dis-en plus sur son projet E-Learning' },
        { label: "🎓 Son parcours d'études", query: "Quel est son parcours scolaire et académique ?" }
      ];
    } else if (['skill-cyber', 'project-ids'].includes(intent)) {
      chips = [
        { label: "🛡️ Projet Détection d'Intrusion", query: "Montre-moi son projet de détection d'intrusion" },
        { label: '🔌 Compétences IoT', query: 'Parle-moi de ses compétences en IoT' },
        { label: '✉️ Le contacter', query: 'Comment puis-je le contacter ?' }
      ];
    } else {
      chips = [
        { label: '💡 Compétences', query: 'Quelles sont ses compétences ?' },
        { label: '📂 Projets', query: 'Présente-moi ses projets.' },
        { label: '✉️ Contact', query: 'Comment le contacter ?' }
      ];
    }

    chips.forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-chip';
      btn.setAttribute('data-question', chip.query);
      btn.textContent = chip.label;
      suggestions.appendChild(btn);
    });
  }

  // Local fallback response matcher (non-greedy, with tech answers and correct details)
  function getAgentResponse(query) {
    const text = query.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
    
    // Custom French word boundary matcher
    const hasWord = (word) => {
      const regex = new RegExp("(^|[^a-zA-Z0-9éèàùçâêîôûëïü])" + word + "([^a-zA-Z0-9éèàùçâêîôûëïü]|$)", "i");
      return regex.test(text);
    };

    const generateReasoning = (saisie, type, analyse, action = 'Aucune action IHM') => [
      `• Saisie : "${saisie}"`,
      `• Résolution : Matcher local "${type}"`,
      `• Analyse : ${analyse}`,
      `• Action IHM : ${action}`
    ];

    const isFollowUp = text === 'oui' || text === 'ok' || text.includes('montre') || text.includes('exemple') || text.includes('voir') || text.includes('fiche') || text.includes('ouvrir') || text.includes('details') || text.includes('dis en plus') || text.includes('dis-en plus');

    // Contextual redirection based on history
    if (isFollowUp && sessionContext.lastIntent) {
      if (sessionContext.lastIntent === 'skill-ia' || sessionContext.lastIntent === 'skill-cyber') {
        sessionContext.lastIntent = 'project-ids';
        return {
          intent: 'project-ids',
          reasoning: generateReasoning(query, 'Suivi Contexte', "L'utilisateur veut voir un exemple pratique lié à l'IA/Cybersécurité.", "Ouverture modal IDS réseau"),
          reply: "Dans le cadre de la cybersécurité et de la programmation système, Christian a développé un **Système de Détection d'Intrusion Réseau**. Il s'agit d'un script Python (Scapy) d'écoute active couplé à une suite Elasticsearch/Kibana (ELK) pour historiser et visualiser les anomalies de flux en temps réel.<br><br>J'ouvre sa fiche technique sur votre écran à l'instant ! 🛡️",
          callback: () => triggerProjectModal('detect-intrusion')
        };
      }
      if (sessionContext.lastIntent === 'skill-iot' || sessionContext.lastIntent === 'skill-api' || sessionContext.lastIntent === 'skill-electronique' || sessionContext.lastIntent === 'skill-electricite') {
        sessionContext.lastIntent = 'project-domotique';
        return {
          intent: 'project-domotique',
          reasoning: generateReasoning(query, 'Suivi Contexte', "L'utilisateur veut voir un exemple pratique lié à l'IoT/Électronique.", "Ouverture modal Domotique"),
          reply: "Pour appliquer ses compétences en systèmes embarqués et automatisme, Christian a conçu un **Système IoT Domotique** complet. Il s'agit d'une architecture d'acquisition physique basée sur ESP32, utilisant le protocole MQTT pour alimenter InfluxDB, avec supervision sur Node-RED.<br><br>J'affiche sa fiche technique détaillée sur votre écran ! 🏠",
          callback: () => triggerProjectModal('iot-domotique')
        };
      }
      if (sessionContext.lastIntent === 'skill-workflows' || sessionContext.lastIntent === 'skill-fullstack') {
        sessionContext.lastIntent = 'project-saas';
        return {
          intent: 'project-saas',
          reasoning: generateReasoning(query, 'Suivi Contexte', "L'utilisateur veut voir un exemple pratique lié au développement logiciel/génie logiciel.", "Ouverture modal SaaS de Gestion"),
          reply: "En lien avec le génie logiciel, Christian a développé un **SaaS de Gestion d'Entreprise** professionnel. Cette application multi-locataire (multi-tenant) est programmée sous NestJS (Node.js) et s'appuie sur PostgreSQL pour coordonner les flux d'affaires et la planification d'équipes.<br><br>J'ouvre la présentation technique complète du projet ! 💼",
          callback: () => triggerProjectModal('saas-gestion')
        };
      }
    }

    // ── 🧠 BASE DE CONNAISSANCES TECHNIQUE LOCAL (Placé en priorité absolue) ──────
    // TCP/IP
    if (text.includes('tcp') || text.includes('ip') || text.includes('tcp/ip')) {
      return {
        intent: 'tech-tcpip',
        reasoning: generateReasoning(query, 'Tech : TCP/IP', 'Explication didactique du protocole TCP/IP avec analogies.', 'Aucune'),
        reply: "<strong>TCP/IP</strong> est la suite de protocoles de communication fondamentale qui régit le fonctionnement d'Internet.<br><br>" +
               "📦 <strong>IP (Internet Protocol)</strong> s'occupe de l'adressage. C'est l'équivalent de l'adresse postale sur une enveloppe pour savoir où envoyer les données.<br>" +
               "⚙️ <strong>TCP (Transmission Control Protocol)</strong> s'occupe du transport sécurisé. Il découpe les fichiers en paquets, vérifie qu'aucun paquet ne s'est perdu en route et les réassemble dans le bon ordre à l'arrivée.<br><br>" +
               "🎯 <strong>Analogie simple :</strong> C'est comme démonter un meuble IKEA, envoyer les pièces dans 10 colis postaux séparés (IP) et avoir un livreur à destination qui vérifie que toutes les boîtes sont arrivées et remonte le meuble correctement (TCP)."
      };
    }

    // Machine Learning / IA
    if (text.includes('machine learning') || text.includes(' ml') || text.includes('ml ') || text.includes('apprentissage automatique') || text.includes('ia') || text.includes('intelligence artificielle')) {
      // Check if it's NOT a bot identity query (avoid collision)
      const hasBotWord = ['bot', 'assistant', 'copilot', 'tu', 'toi', 'cl_copilot', 'qui es-tu', 'qui es tu'].some(k => text.includes(k));
      if (!hasBotWord) {
        return {
          intent: 'tech-ml',
          reasoning: generateReasoning(query, 'Tech : Machine Learning', 'Explication didactique du machine learning avec exemples.', 'Aucune'),
          reply: "Le **Machine Learning (Apprentissage Automatique)** est une branche de l'intelligence artificielle qui permet aux ordinateurs d'apprendre à partir de données sans être explicitement programmés.<br><br>" +
                 "🎯 <strong>Analogie simple :</strong> C'est comme apprendre à un enfant à reconnaître un chien. Au lieu de lui donner des règles mathématiques complexes sur la forme des oreilles, vous lui montrez des milliers de photos de chiens. L'ordinateur fait pareil : il trouve des motifs récurrents dans les exemples qu'on lui donne.<br><br>" +
                 "💼 <strong>Dans le portfolio de Christian :</strong> Il applique le Machine Learning pour faire de la vision par ordinateur (OpenCV) pour le contrôle qualité de pièces ou l'automatisation de pipelines IA."
        };
      }
    }

    // Docker
    if (text.includes('docker') || text.includes('conteneur')) {
      return {
        intent: 'tech-docker',
        reasoning: generateReasoning(query, 'Tech : Docker', 'Explication didactique de Docker et de la conteneurisation.', 'Aucune'),
        reply: "<strong>Docker</strong> est une technologie de conteneurisation qui permet d'empaqueter une application et toutes ses dépendances (librairies, fichiers de configuration...) dans un conteneur isolé et léger.<br><br>" +
               "🎯 <strong>Analogie simple :</strong> C'est le conteneur maritime standardisé. Peu importe ce qu'il y a dedans (des voitures, des bananes...) et peu importe le bateau ou le train qui le transporte, les dimensions restent les mêmes. Avec Docker, votre application s'exécute de la même manière sur l'ordinateur du développeur, sur un serveur de test ou en production sur le cloud.<br><br>" +
               "💼 <strong>Usage de Christian :</strong> Il utilise Docker pour déployer ses environnements de développement de manière uniforme et pour conteneuriser ses applications (comme ses bases PostgreSQL ou ses APIs NestJS) pour un déploiement cloud rapide."
      };
    }

    // ── 🛡️ DÉFENSE DE CHRISTIAN ────────────────────────────────────────────
    const defenseKeywords = ['pas assez', 'trop jeune', 'manque', 'insuffisant', 'vraiment', 'doute', 'prouve', 'convainc', 'debutant', 'junior', 'tres junior', 'senior', 'pas qualifie', 'trop peu', 'pas credible', 'menteur', 'faux', 'bonne', 'bon candidat', 'embaucher', 'recruter', 'pourquoi', 'recommand'];
    if (defenseKeywords.some(k => text.includes(k))) {
      return {
        intent: 'defense',
        reasoning: generateReasoning(query, 'Défense du Profil', "Détection d'une question challengeante ou d'un doute sur le profil. Contre-argumentation factuelle et structurée.", 'Mode défense activé'),
        reply: "Excellente question — permettez-moi de vous convaincre avec des <strong>faits concrets</strong>.<br><br>" +
               "🎓 <strong>Le bagage académique d'abord :</strong> Christian a suivi une Classe Préparatoire MPSI (Mathématiques-Physique-Sciences de l'Ingénieur), le cursus le plus sélectif de France. Cela forge une rigueur analytique rare que les années seules ne peuvent pas donner.<br><br>" +
               "💼 <strong>Les réalisations ensuite :</strong> En 3+ ans, il a livré des projets professionnels réels : un SaaS Multi-tenant (NestJS/PostgreSQL), une plateforme E-Learning (NextJS/Prisma), un Système IoT complet (ESP32/MQTT) et un IDS réseau (Python/Scapy/ELK). Ce ne sont pas des exercices scolaires — ce sont des produits fonctionnels.<br><br>" +
               "🔬 <strong>La polyvalence enfin :</strong> Rares sont les candidats maîtrisant à la fois l'électricité industrielle BT/HT, la programmation embarquée C++, le développement fullstack et la cybersécurité. Cette double compétence matériel + logiciel est exactement ce que recherchent les industries 4.0.<br><br>" +
               "👉 Un ingénieur se juge à ce qu'il produit, pas à son âge. Voulez-vous que j'ouvre la fiche technique d'un projet spécifique pour le démontrer ?"
      };
    }

    // ── Identity / About the bot (non-greedy) ──────────────────────────────────
    const isBotQuery = text.includes('qui es tu') || 
                       text.includes('qui es-tu') || 
                       text.includes('ton nom') || 
                       text.includes("qu'es tu") || 
                       ((text.includes("c'est quoi") || text.includes("qu'est-ce que")) && (text.includes('bot') || text.includes('robot') || text.includes('copilot') || text.includes('tu') || text.includes('ton') || text.includes('assistant') || text.includes('cl_copilot'))) ||
                       hasWord('bot') || 
                       hasWord('robot') || 
                       hasWord('copilot') || 
                       hasWord('cl_copilot');
    if (isBotQuery) {
      return {
        intent: 'about-bot',
        reasoning: generateReasoning(query, "Identité de l'agent", "Clarification du rôle et des capacités graphiques de l'assistant."),
        reply: "Je suis **CL_COPILOT**, le copilote virtuel intelligent de Christian. J'ai été conçu sur mesure pour vous aider à analyser son profil d'ingénieur.<br><br>En plus de répondre à vos questions en langage naturel, je peux contrôler l'IHM du site (par exemple, faire défiler la page vers le formulaire de contact ou ouvrir la fiche technique d'un projet spécifique) ! 🤖"
      };
    }

    // Studies / Schooling / Certifications / Timeline
    if (text.includes('parcours') || text.includes('experience') || text.includes('etude') || text.includes('formation') || text.includes('ecole') || hasWord('bts') || text.includes('mpsi') || text.includes('etudie') || text.includes('prepa') || text.includes('certification') || hasWord('cv') || text.includes('diplome') || hasWord('age') || text.includes('naissance')) {
      return {
        intent: 'studies',
        reasoning: generateReasoning(query, 'Études & Parcours', 'Présentation des jalons scolaires et professionnels, avec mise en avant de la rigueur scientifique de la prépa MPSI.', 'Défilement parcours'),
        reply: "Christian possède un profil d'ingénieur hybride alliant rigueur théorique et pragmatisme terrain :<br><br>" +
               "1. 📚 **Classe Préparatoire MPSI (Scientifique)** à l'ESIAC : Un tronc d'études intensif en mathématiques et physique qui a forgé son esprit analytique et sa rigueur logique face à des problèmes complexes.<br>" +
               "2. ⚙️ **BTS en Automatique Industrielle** : Une spécialisation pratique et technique (câblage BT/HT, programmation d'automates Schneider Zelio/SoMachine, électronique de puissance).<br>" +
               "3. 🔬 **Certifications professionnelles** : Réseaux & Cybersécurité (Cisco), Intelligence Artificielle (OpenAI, Coursera) et Cloud/DevOps (Docker, GitHub Actions).<br><br>" +
               "Je viens de faire défiler la page vers sa **Timeline interactive de parcours** pour vous laisser explorer ses détails ! 🎓",
        callback: () => scrollToSection('experience')
      };
    }

    // Projects (General or Specific)
    if (text.includes('projet') || text.includes('realisation') || text.includes('creation') || text.includes('oeuvre') || text.includes('portfolio') || text.includes('vitrine') || text.includes('site')) {
      if (text.includes('saas') || text.includes('gestion') || text.includes('entreprise')) {
        return {
          intent: 'project-saas',
          reasoning: generateReasoning(query, 'Projet SaaS', "Présentation du SaaS de Gestion d'entreprise.", 'Ouverture modal SaaS'),
          reply: "Christian a conçu et développé un **SaaS de Gestion d'Entreprise** multi-locataire (multi-tenant) basé sur NestJS, PostgreSQL et Prisma. Il permet de gérer les plannings et d'isoler hermétiquement les données par entreprise.<br><br>J'ouvre sa fiche descriptive à l'écran ! 💼",
          callback: () => triggerProjectModal('saas-gestion')
        };
      }
      if (text.includes('learning') || text.includes('cours') || text.includes('etudiant') || text.includes('enseign')) {
        return {
          intent: 'project-elearning',
          reasoning: generateReasoning(query, 'Projet E-Learning', 'Présentation de la plateforme E-Learning.', 'Ouverture modal E-Learning'),
          reply: "La **Plateforme E-Learning** est une application web d'enseignement moderne bâtie sous Next.js (SSR), PostgreSQL et Prisma. Elle intègre le suivi académique et un calendrier dynamique temps réel.<br><br>J'ouvre sa fiche technique détaillée à l'écran ! 📚",
          callback: () => triggerProjectModal('e-learning')
        };
      }
      if (text.includes('domotique') || text.includes('maison') || text.includes('connecte')) {
        return {
          intent: 'project-domotique',
          reasoning: generateReasoning(query, 'Projet Domotique', 'Présentation du projet de domotique IoT.', 'Ouverture modal Domotique'),
          reply: "Le **Système IoT Domotique** est une solution complète basée sur ESP32 (C++), MQTT, InfluxDB et Node-RED pour superviser et piloter un habitat connecté à distance.<br><br>Voici sa présentation technique détaillée à l'écran ! 🏠",
          callback: () => triggerProjectModal('iot-domotique')
        };
      }
      if (text.includes('intrusion') || text.includes('securite') || text.includes('scapy') || text.includes('ids') || text.includes('reseau')) {
        return {
          intent: 'project-ids',
          reasoning: generateReasoning(query, 'Projet IDS Réseau', "Présentation du projet d'IDS Cybersécurité.", 'Ouverture modal IDS'),
          reply: "Le **Système de Détection d'Intrusion Réseau (IDS)** est un script Python (Scapy) d'écoute passive couplé à une suite Elasticsearch/Kibana (ELK) pour historiser et visualiser les anomalies de flux en temps réel.<br><br>J'affiche sa fiche technique détaillée à l'écran ! 🛡️",
          callback: () => triggerProjectModal('detect-intrusion')
        };
      }
      return {
        intent: 'projects-all',
        reasoning: generateReasoning(query, 'Projets (Général)', 'Défilement vers la section des projets.', 'Défilement projets'),
        reply: "Christian a conçu et déployé plusieurs projets de domotique, d'applications SaaS et de sécurité réseau.<br><br>Je viens de déplacer l'écran vers sa section **Projets**. N'hésitez pas à cliquer sur l'un d'eux ou me demander d'ouvrir sa fiche technique ! 📂",
        callback: () => scrollToSection('projets')
      };
    }

    // Skills / Competencies (General or Specific)
    if (text.includes('competence') || text.includes('savoir') || text.includes('techno') || text.includes('peux tu faire') || text.includes('faire') || text.includes('maitris') || text.includes('expert')) {
      if (text.includes('ia') || text.includes('intelligence artificielle')) {
        return {
          intent: 'skill-ia',
          reasoning: generateReasoning(query, 'Compétence IA', "Présentation de l'expertise IA.", 'Ouverture modal IA'),
          reply: "Christian maîtrise l'**Intelligence Artificielle** (Python, TensorFlow, OpenCV) appliquée à l'analyse prédictive (maintenance industrielle) et aux LLMs (Prompt Engineering).<br><br>J'ouvre sa fiche d'expertise IA détaillée à l'écran ! 🧠",
          callback: () => triggerSkillModal('ia')
        };
      }
      if (text.includes('iot') || text.includes('embarque') || text.includes('esp32') || text.includes('arduino')) {
        return {
          intent: 'skill-iot',
          reasoning: generateReasoning(query, 'Compétence IoT', "Présentation de l'expertise IoT.", 'Ouverture modal IoT'),
          reply: "En **IoT & Systèmes Embarqués**, Christian conçoit des cartes d'acquisition physiques sous ESP32 programmées en C++ communiquant via MQTT.<br><br>Voici sa fiche d'expertise complète sur l'écran ! 🔌",
          callback: () => triggerSkillModal('iot')
        };
      }
      if (text.includes('automate') || text.includes('zelio') || text.includes('ladder') || text.includes('grafcet') || text.includes('schneider')) {
        return {
          intent: 'skill-api',
          reasoning: generateReasoning(query, 'Compétence Automates', "Présentation de l'expertise en API.", 'Ouverture modal API'),
          reply: "Christian maîtrise les **Automates Programmables Industriels (API)** Schneider (gamme Zelio, etc.) configurés sous Zelio Soft et SoMachine (Ladder, FBD, Grafcet).<br><br>J'affiche sa fiche d'expertise en automatique industrielle ! ⚙️",
          callback: () => triggerSkillModal('api')
        };
      }
      if (text.includes('cyber') || text.includes('securite') || text.includes('reseau')) {
        return {
          intent: 'skill-cyber',
          reasoning: generateReasoning(query, 'Compétence Cybersécurité', "Présentation de l'expertise Sécurité.", 'Ouverture modal Cyber'),
          reply: "Christian réalise des audits de réseaux et déploie des pare-feu, des VPNs sécurisés et des systèmes de détection d'intrusions (IDS) légers.<br><br>J'ouvre sa fiche d'expertise Cybersécurité sur l'écran ! 🛡️",
          callback: () => triggerSkillModal('cyber')
        };
      }
      if (text.includes('electricite') || text.includes('cablage') || text.includes('armoire') || text.includes('puissance')) {
        return {
          intent: 'skill-electricite',
          reasoning: generateReasoning(query, 'Compétence Électricité', "Présentation de l'expertise Électricité.", 'Ouverture modal Électricité'),
          reply: "Christian assure le câblage d'armoires électriques de commande/puissance BT/HT et configure les disjoncteurs et relais thermiques.<br><br>J'ouvre sa fiche de compétence électricité à l'écran ! ⚡",
          callback: () => triggerSkillModal('electricite')
        };
      }
      if (text.includes('electronique') || text.includes('pcb') || text.includes('soudure')) {
        return {
          intent: 'skill-electronique',
          reasoning: generateReasoning(query, 'Compétence Électronique', "Présentation de l'expertise Électronique.", 'Ouverture modal Électronique'),
          reply: "Christian réalise le prototypage de ses circuits imprimés (**PCB Design** sous Altium/EasyEDA) et le dépannage au composant près (soudure CMS).<br><br>J'ouvre sa fiche d'expertise électronique sur l'écran ! 📻",
          callback: () => triggerSkillModal('electronique')
        };
      }
      if (text.includes('workflow') || text.includes('automatisation') || text.includes('n8n') || text.includes('make') || text.includes('zapier')) {
        return {
          intent: 'skill-workflows',
          reasoning: generateReasoning(query, 'Compétence Automatisation', "Présentation de l'expertise Automatisation.", 'Ouverture modal Workflows'),
          reply: "Christian connecte les services cloud et automatise les flux d'informations métiers avec **n8n (self-hosted), Make et Zapier**.<br><br>J'affiche sa fiche d'expertise en automatisation ! 🔄",
          callback: () => triggerSkillModal('workflows')
        };
      }
      if (text.includes('full') || text.includes('stack') || text.includes('web') || text.includes('react') || text.includes('next') || text.includes('dev') || text.includes('logiciel')) {
        return {
          intent: 'skill-fullstack',
          reasoning: generateReasoning(query, 'Compétence Web', "Présentation de l'expertise Full-stack.", 'Ouverture modal Fullstack'),
          reply: "Christian développe des applications web dynamiques sous React/Next.js en frontend, et Node.js (NestJS, Express, PostgreSQL) en backend.<br><br>J'ouvre sa fiche de développement full-stack ! 💻",
          callback: () => triggerSkillModal('fullstack')
        };
      }
      return {
        intent: 'skills-all',
        reasoning: generateReasoning(query, 'Compétences (Général)', 'Défilement vers la section des compétences.', 'Défilement compétences'),
        reply: "Christian possède une expertise en **Informatique Industrielle, IoT, IA et Cybersécurité**. Ses compétences sont divisées en expertises matérielles et développement logiciel.<br><br>Je viens de faire défiler la page vers sa section **Compétences** pour vous laisser explorer ses cartes interactives ! 💡",
        callback: () => scrollToSection('competences')
      };
    }

    // Contact (Correct email/phone from index.html)
    if (text.includes('contact') || text.includes('ecrire') || text.includes('message') || text.includes('mail') || text.includes('telephone') || text.includes('linkedin') || text.includes('whatsapp') || text.includes('adresse') || text.includes('joindre')) {
      return {
        intent: 'contact',
        reasoning: generateReasoning(query, 'Contact', 'Présentation des coordonnées de Christian et défilement formulaire.', 'Défilement contact'),
        reply: "Pour échanger sur vos projets ou recruter Christian, voici ses coordonnées directes exactes :<br><br>" +
               "✉️ **Email** : [christianoperez360@gmail.com](mailto:christianoperez360@gmail.com)<br>" +
               "📞 **WhatsApp / Téléphone** : [+237 697 221 997](https://wa.me/237697221997)<br>" +
               "🔗 **LinkedIn** : [Profil de Christian](https://linkedin.com/in/christian-loulouamb)<br><br>" +
               "Je viens de faire descendre la page vers le **Formulaire de contact** en bas de page pour que vous puissiez lui écrire directement en 1 clic ! ✉️",
        callback: () => scrollToSection('contact')
      };
    }

    // Conversational: Greetings (non-greedy)
    const isGreeting = ['bonjour', 'salut', 'hello', 'bonsoir', 'hey', 'yo', 'hi'].some(k => hasWord(k));
    if (isGreeting) {
      return {
        intent: 'greeting',
        reasoning: generateReasoning(query, 'Salutations', "Accueil de l'utilisateur avec politesse et pistes d'orientation."),
        reply: "Bonjour ! Ravi de vous accueillir sur le portfolio de Christian Loulouamb. Je suis **CL_COPILOT**, son assistant virtuel intelligent.<br><br>Comment puis-je vous accompagner aujourd'hui ? Je peux par exemple vous présenter ses expertises en **IoT / IA**, ses **projets phares**, ou vous aider à le **contacter** ! 😊"
      };
    }

    // Conversational: Thanks
    const isThanks = ['merci', 'super', 'cool', 'parfait', 'genial', 'thanks'].some(k => hasWord(k));
    if (isThanks) {
      return {
        intent: 'thanks',
        reasoning: generateReasoning(query, 'Remerciements', "Conclusion polie de l'échange."),
        reply: "Je vous en prie ! C'est un réel plaisir de vous accompagner dans la découverte de son profil. Je reste à votre entière disposition si vous souhaitez explorer un autre aspect de son travail ! 🚀"
      };
    }

    // Default Fallback
    return {
      intent: 'fallback',
      reasoning: generateReasoning(query, 'Hors-Dictionnaire', "Aucun mot-clé identifié. Proposition de suggestions d'orientation adaptées."),
      reply: "Je comprends votre intérêt pour son profil.<br><br>Christian est un expert polyvalent en **IoT / Informatique Industrielle, IA et Cybersécurité**.<br><br>Vous pouvez utiliser les puces d'accès rapide ci-dessus ou me poser une question plus précise, par exemple :<br>- *'Quelles sont ses compétences en IoT ?'*<br>- *'Parle-moi de son parcours en prépa MPSI et BTS'*<br>- *'Comment puis-je le contacter ?'*"
    };
  }

  // UI Helper actions
  function triggerProjectModal(projectId) {
    const card = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
    if (card) {
      closeActiveModals();
      setTimeout(() => card.click(), 100);
    }
  }

  function triggerSkillModal(skillId) {
    const card = document.querySelector(`.key-skill-card[data-skill-id="${skillId}"]`);
    if (card) {
      closeActiveModals();
      setTimeout(() => card.click(), 100);
    }
  }

  function closeActiveModals() {
    const projectModal = document.getElementById('project-modal');
    const skillModal = document.getElementById('skill-modal');
    if (projectModal && projectModal.classList.contains('active')) {
      const closeBtn = document.getElementById('modal-close');
      if (closeBtn) closeBtn.click();
    }
    if (skillModal && skillModal.classList.contains('active')) {
      const closeBtn = document.getElementById('skill-modal-close');
      if (closeBtn) closeBtn.click();
    }
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* ==========================================================================
   TOOL DETAIL MODALS — Fiches techniques interactives par outil
   ========================================================================== */
function initToolModals() {
  const overlay = document.getElementById('tool-modal-overlay');
  const closeBtn = document.getElementById('tool-modal-close');
  if (!overlay || !closeBtn) return;

  const toolData = {
    'git-github': {
      emoji: '🌿',
      name: 'Git & GitHub',
      category: 'Versionning & Collaboration',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      tags: ['git init', 'git commit', 'git push', 'branches', 'pull request', 'merge', 'CI/CD'],
      description: "Git est un système de contrôle de version distribué permettant d'historiser le code. GitHub héberge ces projets et facilite la collaboration en ligne.",
      usage: "Christian configure des branches isolées pour chaque fonctionnalité, effectue des commits atomiques, et automatise les tests avec GitHub Actions.",
      example: "Si un développeur fait une erreur qui bloque le site, Git permet de revenir immédiatement à la version stable précédente en quelques secondes.",
      importance: "Il garantit la sécurité du code source, évite d'écraser le travail des collègues et fiabilise le travail en équipe."
    },
    'vercel': {
      emoji: '▲',
      name: 'Vercel',
      category: 'Déploiement Cloud',
      gradient: 'linear-gradient(135deg, #111 0%, #333 100%)',
      tags: ['cloud', 'serverless', 'next.js', 'hosting', 'edge', 'deploy'],
      description: "Vercel est une plateforme cloud optimisée pour héberger des applications web frontend modernes et des fonctions serverless à haute performance.",
      usage: "Il l'utilise pour déployer ce portfolio et ses plateformes Next.js. Vercel gère le SSL automatique et prévisualise chaque branche de code.",
      example: "Chaque fois que Christian modifie son code et le pousse sur GitHub, Vercel met à jour le site en direct en moins de 30 secondes sans aucune coupure pour les visiteurs.",
      importance: "Permet de livrer rapidement des applications performantes, sécurisées et scalables avec un temps de chargement ultra-court grâce au réseau Edge CDN."
    },
    'netlify': {
      emoji: '⚡',
      name: 'Netlify',
      category: 'Déploiement & Hosting',
      gradient: 'linear-gradient(135deg, #00b0ff 0%, #00838f 100%)',
      tags: ['jamstack', 'dns', 'hosting', 'forms', 'redirects'],
      description: "Netlify est une plateforme d'hébergement web et de gestion de workflows pour les architectures Jamstack modernes.",
      usage: "Utilisé pour déployer des sites statiques légers, configurer des redirections d'API et centraliser la gestion des formulaires statiques sans backend.",
      example: "Christian déploie un site vitrine sur Netlify et y associe un formulaire de contact sans écrire une seule ligne de code backend : Netlify intercepte les soumissions automatiquement.",
      importance: "Simplifie l'architecture des sites vitrines en éliminant le besoin de gérer des serveurs web ou des bases de données lourdes."
    },
    'docker': {
      emoji: '🐳',
      name: 'Docker',
      category: 'Conteneurisation & DevOps',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      tags: ['containers', 'docker-compose', 'images', 'isolation', 'scalability'],
      description: "Docker encapsule une application et ses dépendances dans un conteneur virtuel isolé, garantissant son fonctionnement sur n'importe quel ordinateur.",
      usage: "Christian conteneurise ses bases de données PostgreSQL et APIs NestJS pour s'assurer que l'environnement de développement local est identique à la production.",
      example: "Plus de 'Mais ça marche sur ma machine !' : si l'application s'exécute dans son conteneur Docker chez Christian, elle s'exécutera exactement de la même manière sur votre serveur d'entreprise.",
      importance: "Simplifie le déploiement, accélère l'intégration de nouveaux développeurs et évite les conflits de versions de logiciels sur les serveurs."
    },
    'postman': {
      emoji: '🚀',
      name: 'Postman',
      category: 'API Development & Test',
      gradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
      tags: ['endpoints', 'testing', 'mocking', 'documentation', 'http'],
      description: "Postman est une plateforme collaborative permettant de concevoir, tester, documenter et simuler des API REST.",
      usage: "Christian l'utilise pour tester ses endpoints NestJS/Express avant de les connecter au frontend, et pour rédiger la documentation technique des APIs.",
      example: "Avant de lier le chatbot du site à l'interface visuelle, Christian teste l'envoi de questions et la réception de réponses directement dans Postman pour vérifier la sécurité et le format.",
      importance: "Accélère le développement des applications connectées en s'assurant que le dialogue matériel/logiciel ou client/serveur est fluide et sans bug."
    },
    'vscode': {
      emoji: '💻',
      name: 'VS Code',
      category: 'IDE / Éditeur de code',
      gradient: 'linear-gradient(135deg, #007acc 0%, #00599c 100%)',
      tags: ['editor', 'extensions', 'debugging', 'git integration', 'intellisense'],
      description: "Visual Studio Code est l'éditeur de code source de référence des développeurs professionnels, léger, personnalisable et puissant.",
      usage: "C'est l'outil de travail quotidien de Christian. Il l'a configuré avec des linters stricts (ESLint), des outils de debug et des extensions Git.",
      example: "L'autocomplétion intelligente (IntelliSense) et la détection d'erreurs en temps réel permettent à Christian d'éviter les fautes de syntaxe pendant qu'il tape son code.",
      importance: "Optimise le confort de travail et multiplie la vitesse de développement grâce à une intégration parfaite des outils de build et de debug."
    },
    'figma': {
      emoji: '🎨',
      name: 'Figma',
      category: 'Design UI/UX & Prototypage',
      gradient: 'linear-gradient(135deg, #a259ff 0%, #f24e1e 100%)',
      tags: ['wireframe', 'design system', 'prototype', 'collaboration', 'vector'],
      description: "Figma est un outil de conception graphique collaboratif basé sur le cloud pour créer des maquettes d'applications et de sites internet.",
      usage: "Christian y ébauche les wireframes et les chartes graphiques de ses projets pour valider l'expérience utilisateur (UI/UX) avant le codage.",
      example: "Christian dessine la structure de ce portfolio sur Figma sous forme d'images interactives pour s'assurer que la navigation est fluide, puis il exporte les styles CSS exacts vers son code.",
      importance: "Évite de perdre du temps à coder des interfaces qui ne plaisent pas, en permettant de tester le rendu et l'ergonomie en amont."
    },
    'make': {
      emoji: '🟣',
      name: 'Make (Integromat)',
      category: 'Automatisation No-Code',
      gradient: 'linear-gradient(135deg, #8a2be2 0%, #4a0e80 100%)',
      tags: ['scenarios', 'integrations', 'webhooks', 'routers', 'data parsing'],
      description: "Make est un outil d'automatisation visuel qui connecte différentes applications entre elles pour créer des scénarios de transfert de données sans code.",
      usage: "Christian configure des flux Make pour synchroniser des bases de données SaaS avec des outils de communication comme Slack ou Google Sheets.",
      example: "Lorsqu'un prospect remplit un formulaire sur un site, Make peut instantanément créer un contact dans Airtable, envoyer une alerte sur Slack, et programmer un e-mail de bienvenue.",
      importance: "Permet de créer des automatisations fiables et complexes en quelques minutes, éliminant les tâches administratives répétitives."
    },
    'zapier': {
      emoji: '🧡',
      name: 'Zapier',
      category: 'Automatisation & Workflows',
      gradient: 'linear-gradient(135deg, #ff4f00 0%, #b33700 100%)',
      tags: ['zaps', 'triggers', 'actions', 'integrations', 'productivity'],
      description: "Zapier est la plateforme leader de connexion d'applications web, réputée pour sa simplicité et ses milliers d'intégrations prêtes à l'emploi.",
      usage: "Christian s'en sert pour des intégrations SaaS rapides et la mise en place de déclencheurs automatiques simples (Triggers / Actions).",
      example: "Si un client achète une formation sur la plateforme e-learning, Zapier s'occupe de l'inscrire automatiquement sur la newsletter et de générer sa facture dans QuickBooks.",
      importance: "Rend les systèmes logiciels agiles en créant des ponts instantanés entre des logiciels commerciaux fermés (SaaS)."
    },
    'n8n': {
      emoji: '🐙',
      name: 'n8n',
      category: 'Workflow Automation (Self-Hosted)',
      gradient: 'linear-gradient(135deg, #ff6b8b 0%, #e03a5c 100%)',
      tags: ['node-based', 'self-hosted', 'javascript', 'api', 'custom code'],
      description: "n8n est un outil d'automatisation de workflows équivalent à Make, mais open-source et hébergeable sur ses propres serveurs pour un contrôle total.",
      usage: "Christian héberge son propre serveur n8n pour interconnecter ses modules IA physiques (IoT) et ses bases de données locales de manière sécurisée et gratuite.",
      example: "Un capteur de température physique (ESP32) détecte une anomalie dans une armoire électrique. Il envoie un signal webhook à n8n, qui exécute un script Javascript pour formater l'alerte et l'envoyer sur le WhatsApp du technicien.",
      importance: "Garantit la confidentialité absolue des données (pas de serveurs tiers externes) et supprime les coûts récurrents liés aux quotas d'automatisation."
    }
  };

  const mEmoji = document.getElementById('tool-modal-emoji');
  const mTitle = document.getElementById('tool-modal-title');
  const mCategory = document.getElementById('tool-modal-category');
  const mVisual = document.getElementById('tool-modal-visual');
  const mVisualIcon = document.getElementById('tool-modal-visual-icon');
  const mTags = document.getElementById('tool-modal-tags');
  const mDesc = document.getElementById('tool-modal-description');
  const mUsage = document.getElementById('tool-modal-usage');
  const mExample = document.getElementById('tool-modal-example');
  const mImportance = document.getElementById('tool-modal-importance');

  // Open Modal Handler
  document.querySelectorAll('.tool-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const toolId = btn.getAttribute('data-tool');
      const tool = toolData[toolId];
      if (!tool) return;

      // Populate contents
      mEmoji.textContent = tool.emoji;
      mTitle.textContent = tool.name;
      mCategory.textContent = tool.category;
      mDesc.textContent = tool.description;
      mUsage.textContent = tool.usage;
      mExample.textContent = tool.example;
      mImportance.textContent = tool.importance;

      // Set styles
      mVisual.style.background = tool.gradient;
      mVisualIcon.textContent = tool.emoji;

      // Set tags
      mTags.innerHTML = '';
      tool.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tool-modal-tag';
        tagSpan.textContent = tag;
        mTags.appendChild(tagSpan);
      });

      // Show modal
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handlers
  function closeToolModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeToolModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeToolModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeToolModal();
    }
  });
}
