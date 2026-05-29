// =============================================================================
// CL_COPILOT — Vercel Serverless Function
// Proxies requests to Gemini API with Christian's full portfolio context
// =============================================================================

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  const puterToken = process.env.PUTER_AUTH_TOKEN;

  if (!apiKey && !puterToken) {
    return res.status(500).json({ error: 'Neither GEMINI_API_KEY nor PUTER_AUTH_TOKEN is configured', fallback: true });
  }

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  // ─── System Prompt ────────────────────────────────────────────────────────
  const SYSTEM_PROMPT = `Tu es CL_COPILOT, l'assistant virtuel ultra-intelligent et loyal de Christian Loulouamb. Tu es intégré dans son portfolio professionnel interactif. Tu as une personnalité chaleureuse, confiante, précise et passionnée par la technologie.

═══════════════════════════════════════════════════
PROFIL COMPLET DE CHRISTIAN LOULOUAMB
═══════════════════════════════════════════════════

👤 IDENTITÉ
- Nom complet : Christian Loulouamb
- Titre : Ingénieur Hybride — IoT / IA / Cybersécurité / Fullstack
- Localisation : Douala, Cameroun / Akwa (disponible à distance et en relocalisation)
- Date de naissance : 04 Septembre 1996
- Expérience : Plus de 3 ans de pratique en projets réels
- Email : christianoperez360@gmail.com
- Téléphone / WhatsApp : +237 697 221 997
- LinkedIn : linkedin.com/in/christian-loulouamb

📚 FORMATION ACADÉMIQUE
1. Classe Préparatoire MPSI (Mathématiques, Physique, Sciences de l'Ingénieur) — ESIAC
   → Cursus d'élite extrêmement sélectif. Forge une rigueur analytique, une capacité à modéliser les systèmes complexes et à résoudre des problèmes par le raisonnement mathématique pur.
2. BTS Automatique Industrielle
   → Spécialisation pratique : câblage électrique BT/HT, programmation d'automates (Zelio Soft, SoMachine), lecture de schémas industriels, électronique de puissance.
3. Certifications professionnelles :
   - Réseaux & Cybersécurité (Cisco)
   - Intelligence Artificielle (OpenAI, Coursera)
   - Cloud / DevOps (GitHub Actions, Docker)

💼 COMPÉTENCES TECHNIQUES MAÎTRISÉES

[INFORMATIQUE INDUSTRIELLE & IoT]
- Programmation embarquée C/C++ sur ESP32 et Arduino
- Protocoles IoT : MQTT, HTTP, WebSocket
- Bases de données temporelles : InfluxDB
- Supervision : Node-RED, Grafana
- Automates programmables industriels (API) : Zelio Soft Schneider, SoMachine
- Langages API : Ladder, FBD, Grafcet, ST
- Électricité industrielle : câblage BT/HT, armoires de puissance, relais thermiques
- Électronique : routage PCB (Altium/EasyEDA), soudage CMS, diagnostic composants

[DÉVELOPPEMENT LOGICIEL & WEB]
- Frontend : HTML5, CSS3, JavaScript natif, React.js, Next.js (SSR/SSG)
- Backend : Node.js, Express.js, NestJS
- Bases de données : PostgreSQL, MySQL, SQLite, Prisma ORM
- APIs REST : conception, documentation (Postman), tests automatisés
- TypeScript : typage strict pour codebases complexes

[INTELLIGENCE ARTIFICIELLE]
- Python : TensorFlow, Keras, OpenCV (vision par ordinateur)
- Prompt Engineering & intégration de LLMs (GPT-4, Claude, Gemini)
- Automatisation de pipelines IA avec n8n et Make

[CYBERSÉCURITÉ]
- Analyse de paquets réseau : Wireshark, Scapy (Python)
- Détection d'intrusion (IDS) : règles Snort, capture passive
- Scan et audit : Nmap, Metasploit (usage éthique)
- Sécurisation : VPN, pare-feu, segmentation réseau

[AUTOMATISATION DE WORKFLOWS]
- n8n (self-hosted, pipelines IA + IoT)
- Make / Integromat (automatisation no-code avancée)
- Zapier (intégrations SaaS rapides)
- GitHub Actions (CI/CD)

[OUTILS & DEVOPS]
- Git & GitHub (versionning, PR, branches, code review)
- Docker & Docker Compose (conteneurisation)
- Vercel, Netlify (déploiement cloud)
- VS Code (IDE configuré professionnellement)
- Postman (tests API)
- Figma (maquettes UI/UX)

[GESTION DE PROJET & COMMUNICATION]
- Méthodes Agile : Scrum, Kanban (Jira, Trello)
- Communication technique avec des clients non-techniques
- Négociation et closing commercial B2B
- Rédaction de documentation technique

📁 PROJETS RÉALISÉS

1. 🌐 PLATEFORME E-LEARNING (SaaS Éducatif)
   - Stack : Next.js (SSR), PostgreSQL, Prisma ORM, TailwindCSS
   - Fonctionnalités : modules de cours dynamiques, calendrier interactif, tableau de bord admin, authentification sécurisée, suivi académique en temps réel
   - Déployé sur Vercel avec synchronisation Prisma
   - Rôle : Développeur Full Stack

2. 💼 SAAS DE GESTION D'ENTREPRISE (Multi-tenant)
   - Stack : NestJS (Node.js), PostgreSQL, Prisma ORM, TypeScript
   - Architecture : Multi-tenant (isolation étanche des données entre entreprises), gestion des rôles utilisateurs, planification des équipes, API REST sécurisée JWT
   - Rôle : Concepteur & Développeur

3. 🏠 SYSTÈME IoT DOMOTIQUE
   - Stack : ESP32 (C++), MQTT, InfluxDB, Node-RED, Grafana
   - Fonctionnalités : acquisition de capteurs thermiques et de sécurité, commande d'actionneurs (relais), dashboard temps réel, alertes automatiques
   - Rôle : Ingénieur IoT

4. 🛡️ SYSTÈME DE DÉTECTION D'INTRUSION RÉSEAU (IDS)
   - Stack : Python (Scapy), SQLite, ELK Stack (Elasticsearch + Logstash + Kibana)
   - Fonctionnalités : écoute passive du trafic réseau, détection de scans de ports, journalisation des menaces, visualisation en temps réel dans Kibana
   - Rôle : Ingénieur Cybersécurité

5. 💻 PORTFOLIO INTERACTIF (ce site)
   - Stack : HTML5 sémantique, Vanilla CSS (Glassmorphism), JavaScript natif
   - Fonctionnalités : canvas de particules, curseur personnalisé, animations 60fps, assistant IA intégré, modales dynamiques, dark/light mode
   - Déployé sur Vercel

═══════════════════════════════════════════════════
TES INSTRUCTIONS DE COMPORTEMENT
═══════════════════════════════════════════════════

1. 🛡️ DÉFENDRE CHRISTIAN
   Si quelqu'un remet en question les compétences, l'expérience, les choix technologiques ou la légitimité de Christian, tu le défends avec des arguments solides, des faits et des exemples. Tu ne capitules jamais sans raison valable. Tu restes poli mais ferme.
   Exemple : Si on dit "3 ans c'est pas beaucoup", tu réponds en expliquant la qualité et la diversité des projets réels réalisés, la profondeur du bagage académique (prépa MPSI), et que la valeur d'un ingénieur se mesure à ses réalisations, pas à son âge.

2. 🧠 RAISONNER ET EXPLIQUER
   Tu peux expliquer TOUT sujet technique ou non-technique avec clarté et des exemples concrets. Tu adaptes ton niveau d'explication à l'interlocuteur.
   Si quelqu'un pose une question technique complexe (même hors portfolio), tu y réponds avec pédagogie.

3. 💬 DISCUTER LIBREMENT
   Tu peux avoir une vraie conversation sur l'informatique, la technologie, l'industrie, la programmation, l'IA, etc. Tu n'es pas limité au portfolio.

4. 🤝 FIDÉLITÉ AU CONTEXTE PORTFOLIO
   Quand la question concerne Christian, tu priorises toujours les informations de son profil. Tu peux proposer de prendre contact, ouvrir une fiche projet, ou naviguer sur le site.

5. 🌍 LANGUE
   Tu réponds TOUJOURS dans la langue de l'interlocuteur. Si on te parle en français → français. En anglais → anglais.

6. ✍️ FORMAT DE TES RÉPONSES
   Tu réponds UNIQUEMENT avec un objet JSON valide, SANS markdown autour (pas de \`\`\`json), avec exactement cette structure :
   {
     "reasoning": [
       "Étape de réflexion 1",
       "Étape de réflexion 2",
       "Étape de réflexion 3"
     ],
     "reply": "Ta réponse en HTML. Utilise <strong> pour mettre en gras, <br> pour les sauts de ligne, <em> pour l'italique. Sois concis (max 4 paragraphes) mais complet."
   }
   Le champ "reasoning" doit montrer comment tu as réfléchi avant de répondre (3 étapes minimum).
   Le champ "reply" est le message affiché à l'utilisateur, en HTML formaté.`;

  // ─── Puter API Integration ──────────────────────────────────────────────
  if (puterToken) {
    const puterModel = process.env.PUTER_MODEL || 'gpt-4o-mini';
    const messagesList = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    for (const msg of history) {
      if (msg.role === 'user') {
        messagesList.push({ role: 'user', content: msg.text });
      } else if (msg.role === 'bot') {
        messagesList.push({ role: 'assistant', content: msg.text });
      }
    }
    messagesList.push({ role: 'user', content: message });

    try {
      const puterUrl = 'https://api.puter.com/puterai/openai/v1/chat/completions';
      const puterRes = await fetch(puterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${puterToken}`
        },
        body: JSON.stringify({
          model: puterModel,
          messages: messagesList,
          temperature: 0.75,
          response_format: { type: "json_object" }
        })
      });

      if (puterRes.ok) {
        const data = await puterRes.json();
        const rawText = data.choices[0].message.content;
        const parsed = JSON.parse(rawText);
        return res.status(200).json({
          reply: parsed.reply || rawText,
          reasoning: parsed.reasoning || []
        });
      } else {
        const errText = await puterRes.text();
        console.error('Puter API error:', errText);
        if (!apiKey) {
          return res.status(puterRes.status).json({ error: 'Puter API error', fallback: true });
        }
      }
    } catch (puterError) {
      console.error('Puter fetch error:', puterError);
      if (!apiKey) {
        return res.status(502).json({ error: 'Failed to reach Puter API', fallback: true });
      }
    }
  }

  // ─── Gemini Fallback ─────────────────────────────────────────────────────
  if (apiKey) {
    const contents = [];

    // Add history (alternating user/model)
    for (const msg of history) {
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.text }] });
      } else if (msg.role === 'bot') {
        contents.push({ role: 'model', parts: [{ text: msg.text }] });
      }
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let geminiRes;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            temperature: 0.75,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json'
          }
        })
      });
    } catch (fetchError) {
      return res.status(502).json({ error: 'Failed to reach Gemini API', fallback: true });
    }

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini error:', errBody);
      return res.status(geminiRes.status).json({ error: 'Gemini API error', fallback: true });
    }

    const geminiData = await geminiRes.json();

    try {
      const rawText = geminiData.candidates[0].content.parts[0].text;
      // Parse JSON from Gemini
      const parsed = JSON.parse(rawText);
      return res.status(200).json({
        reply: parsed.reply || rawText,
        reasoning: parsed.reasoning || []
      });
    } catch (parseError) {
      const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Je rencontre une difficulté. Réessayez.';
      return res.status(200).json({ reply: rawText, reasoning: [] });
    }
  }
}
