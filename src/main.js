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
  initParticleCanvas();
  initMobileMenu();
  initScrollEffects();
  initStatsCounter();
  initProjectFilters();
  initProjectModals();
  initSkillModals();
  initTestimonialsCarousel();
  initContactForm();
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
      }
    });
  }, {
    threshold: 0.15
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
    image: "/src/assets/iot_electronics.png",
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
    image: "/src/assets/ai_automation.png",
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
    image: "/src/assets/cybersecurity.png",
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
    image: "/src/assets/ai_automation.png",
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
    image: "/src/assets/fullstack_cloud.png",
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
    image: "/src/assets/electricity_plc.png",
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
    image: "/src/assets/electricity_plc.png",
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
    image: "/src/assets/iot_electronics.png",
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
    image: "/src/assets/fullstack_cloud.png",
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
    image: "/src/assets/design_management.png",
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
    image: "/src/assets/design_management.png",
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
    image: "/src/assets/design_management.png",
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
