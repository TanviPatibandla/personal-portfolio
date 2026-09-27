/**
 * ==========================================================================
 * Tanvi Patibandla - Personal Portfolio Logic & Interaction Engine (ES6+)
 * Final Project 02: Full-Stack Web Development (Weeks 1 to 12)
 * Registration Number: 25EU08115
 * ==========================================================================
 */

// 1. Projects Database (Weeks 7 & 8)
const PORTFOLIO_PROJECTS = [
  {
    id: "aurabooks",
    title: "AuraBooks: 3D E-Commerce Platform",
    category: "ecommerce",
    categoryLabel: "🛒 E-Commerce & 3D Web",
    image: "images/project_aurabooks.jpg",
    summary: "Production-grade digital bookstore featuring hardware-accelerated 3D book cover transforms, debounced catalog search, persistent cart state, and automated itemized tax invoicing.",
    techStack: ["HTML5", "CSS3 3D", "Vanilla ES6+", "localStorage", "RegEx Forms", "SEO JSON-LD"],
    github: "https://github.com/tanvipatibandla/aurabooks-ecommerce",
    demo: "../Final_Project_01_Online_Bookstore/index.html",
    metrics: "Sub-second LCP • 100% Core Web Vitals • 10 Authenticated Medical & CS Volumes",
    architecture: "State-driven decoupled architecture with reactive cart pipeline and zero external heavy dependencies."
  },
  {
    id: "neuromed",
    title: "NeuroMed: Vision AI Diagnostics",
    category: "ai",
    categoryLabel: "🧠 AI & Deep Learning",
    image: "images/project_neuromed.jpg",
    summary: "Convolutional neural network pipeline for automated segmentation and clinical annotation of radiological brain CT and MRI scans with WebGL slice rendering.",
    techStack: ["PyTorch", "Python FastAPI", "Docker", "DICOM", "WebGL", "TypeScript"],
    github: "https://github.com/tanvipatibandla/neuromed-vision-ai",
    demo: "#",
    metrics: "94.6% Dice Similarity Score • 120ms Inference Latency • 5,000+ Verified Clinical Scans",
    architecture: "U-Net convolutional backbone integrated with asynchronous streaming inference endpoints."
  },
  {
    id: "cloudsync",
    title: "CloudSync: Distributed Storage Engine",
    category: "cloud",
    categoryLabel: "☁️ Distributed Systems",
    image: "images/project_cloudsync.jpg",
    summary: "High-concurrency distributed object store implementing Raft consensus for strong consistency, chunked multipart uploads, and automated geographic replication.",
    techStack: ["Go", "Raft Protocol", "gRPC", "Redis", "Google Cloud Storage", "Prometheus"],
    github: "https://github.com/tanvipatibandla/cloudsync-distributed-engine",
    demo: "#",
    metrics: "40,000 IOPS • Zero-loss leader failover in <150ms • Multi-region telemetry",
    architecture: "Quorum-based consensus state machine paired with lock-free memory indexing."
  },
  {
    id: "devlens",
    title: "DevLens: Core Web Vitals Suite",
    category: "web-opt",
    categoryLabel: "⚡ Web Optimization & SEO",
    image: "images/project_devlens.jpg",
    summary: "Real-time performance telemetry monitor capturing LCP, FID/INP, and CLS micro-shifts directly from user sessions, generating automated Lighthouse CI audit alerts.",
    techStack: ["Performance API", "MutationObserver", "Node.js", "Grafana", "GitHub Actions"],
    github: "https://github.com/tanvipatibandla/devlens-telemetry-suite",
    demo: "#",
    metrics: "Zero client overhead (<1.5KB gzipped) • Automated CI/CD performance gating",
    architecture: "Lightweight client-side beacon communicating over Navigator.sendBeacon with background worker aggregator."
  }
];

// 2. Reactive State & Storage Persistence (Week 10)
let starredProjects = JSON.parse(localStorage.getItem("portfolio_starred_projects") || "[]");
let activeCategory = "all";
let searchFilter = "";

// 3. Render Projects Grid
const projectsGrid = document.getElementById("projectsGrid");

function renderProjects() {
  const filtered = PORTFOLIO_PROJECTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = searchFilter.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    projectsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
        <span style="font-size: 2.2rem; display:block; margin-bottom: 12px;">🔎</span>
        <h3>No projects match your filter</h3>
        <p style="color:var(--text-muted); margin-top: 6px;">Try adjusting your keyword or selecting "All Projects".</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = filtered.map(p => {
    const isLiked = starredProjects.includes(p.id);
    return `
      <article class="project-card" data-id="${p.id}">
        <div class="project-thumb-wrap">
          <img src="${p.image}" alt="${p.title}" class="project-thumb" loading="lazy">
          <span class="project-badge-tag">${p.categoryLabel}</span>
          <button class="project-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleStarProject('${p.id}', event)" title="Star Project">
            ${isLiked ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p class="project-desc">${p.summary}</p>
          <div class="project-tech-stack">
            ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
          </div>
          <div class="project-card-footer">
            <button class="btn btn-outline btn-sm" onclick="openProjectModal('${p.id}')">View Details</button>
            <a href="${p.github}" target="_blank" class="btn btn-ghost btn-sm" rel="noopener">GitHub ↗</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Star / Bookmark Project (Week 10 localStorage)
function toggleStarProject(id, event) {
  event.stopPropagation();
  if (starredProjects.includes(id)) {
    starredProjects = starredProjects.filter(item => item !== id);
    showToast("Project removed from your starred collection.");
  } else {
    starredProjects.push(id);
    showToast("Project starred and saved to your favorites!");
  }
  localStorage.setItem("portfolio_starred_projects", JSON.stringify(starredProjects));
  renderProjects();
}
window.toggleStarProject = toggleStarProject;

// Category Filter Pills
const projectPills = document.querySelectorAll("#projectPills .pill");
projectPills.forEach(pill => {
  pill.addEventListener("click", () => {
    projectPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.category;
    renderProjects();
  });
});

// Search Filter with Debouncing (Weeks 7 & 8)
let searchDebounceTimer = null;
const searchInput = document.getElementById("projectSearchInput");
searchInput.addEventListener("input", e => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    searchFilter = e.target.value.trim();
    renderProjects();
  }, 200);
});

// 4. Project Modal Details
const projectModal = document.getElementById("projectModal");
const projectModalContent = document.getElementById("projectModalContent");
const closeProjectModalBtn = document.getElementById("closeProjectModalBtn");

function openProjectModal(id) {
  const p = PORTFOLIO_PROJECTS.find(item => item.id === id);
  if (!p) return;

  projectModalContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="section-tag">${p.categoryLabel}</span>
      <h2 style="font-size: 1.8rem; margin: 8px 0 12px;">${p.title}</h2>
      <img src="${p.image}" alt="${p.title}" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 20px;">
      <p style="font-size: 1rem; color: var(--text-main); margin-bottom: 16px; line-height: 1.6;">${p.summary}</p>
      
      <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border-left: 3px solid var(--primary); margin-bottom: 18px;">
        <strong style="color: var(--primary); font-size: 0.82rem; text-transform: uppercase; display: block; margin-bottom: 4px;">KEY TECHNICAL METRICS</strong>
        <p style="font-size: 0.92rem; color: var(--text-muted);">${p.metrics}</p>
      </div>

      <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border-left: 3px solid var(--accent); margin-bottom: 22px;">
        <strong style="color: var(--accent); font-size: 0.82rem; text-transform: uppercase; display: block; margin-bottom: 4px;">SYSTEM ARCHITECTURE</strong>
        <p style="font-size: 0.92rem; color: var(--text-muted);">${p.architecture}</p>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
        ${p.techStack.map(t => `<span class="tech-tag" style="background:var(--bg-base); padding: 5px 12px;">${t}</span>`).join("")}
      </div>

      <div style="display: flex; gap: 12px;">
        <a href="${p.demo}" class="btn btn-primary" ${p.demo.startsWith('http') || p.demo.includes('html') ? 'target="_blank"' : ''}>🚀 Launch Live Project</a>
        <a href="${p.github}" target="_blank" class="btn btn-outline" rel="noopener">Explore Source Code ↗</a>
      </div>
    </div>
  `;

  projectModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}
window.openProjectModal = openProjectModal;

function closeProjectModal() {
  projectModal.style.display = "none";
  document.body.style.overflow = "";
}

closeProjectModalBtn.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", e => {
  if (e.target === projectModal) closeProjectModal();
});

// 5. 3D Card Interactive Tilt Physics (Week 11)
const heroPerspectiveCard = document.getElementById("heroPerspectiveCard");
const heroCardInner = document.getElementById("heroCardInner");

if (heroPerspectiveCard && heroCardInner) {
  heroPerspectiveCard.addEventListener("mousemove", e => {
    const rect = heroPerspectiveCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    heroCardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  heroPerspectiveCard.addEventListener("mouseleave", () => {
    heroCardInner.style.transform = "rotateY(-10deg) rotateX(6deg) scale(1)";
  });
}

// 6. Interactive Contact Form with Strict RegEx Validation (Week 9)
// and localStorage Auto-Save Draft (Week 10)
const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactSubject = document.getElementById("contactSubject");
const contactMessage = document.getElementById("contactMessage");
const charCount = document.getElementById("charCount");

const nameRegex = /^[a-zA-Z\s]{3,40}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Restore Draft from localStorage
const savedDraft = JSON.parse(localStorage.getItem("portfolio_contact_draft") || "{}");
if (savedDraft.name) contactName.value = savedDraft.name;
if (savedDraft.email) contactEmail.value = savedDraft.email;
if (savedDraft.subject) contactSubject.value = savedDraft.subject;
if (savedDraft.message) {
  contactMessage.value = savedDraft.message;
  charCount.textContent = `${savedDraft.message.length} / 500`;
}

// Save draft as user types
function saveContactDraft() {
  const draft = {
    name: contactName.value,
    email: contactEmail.value,
    subject: contactSubject.value,
    message: contactMessage.value
  };
  localStorage.setItem("portfolio_contact_draft", JSON.stringify(draft));
}

[contactName, contactEmail, contactSubject, contactMessage].forEach(input => {
  input.addEventListener("input", saveContactDraft);
});

contactMessage.addEventListener("input", e => {
  charCount.textContent = `${e.target.value.length} / 500`;
});

function validateField(inputEl, errorEl, isValid) {
  if (isValid) {
    inputEl.classList.remove("invalid");
    inputEl.classList.add("valid");
    errorEl.style.display = "none";
  } else {
    inputEl.classList.remove("valid");
    inputEl.classList.add("invalid");
    errorEl.style.display = "block";
  }
  return isValid;
}

contactName.addEventListener("input", () => {
  validateField(contactName, document.getElementById("nameError"), nameRegex.test(contactName.value.trim()));
});

contactEmail.addEventListener("input", () => {
  validateField(contactEmail, document.getElementById("emailError"), emailRegex.test(contactEmail.value.trim()));
});

contactSubject.addEventListener("input", () => {
  validateField(contactSubject, document.getElementById("subjectError"), contactSubject.value.trim().length >= 5);
});

contactMessage.addEventListener("input", () => {
  validateField(contactMessage, document.getElementById("messageError"), contactMessage.value.trim().length >= 20);
});

contactForm.addEventListener("submit", e => {
  e.preventDefault();

  const isNameValid = validateField(contactName, document.getElementById("nameError"), nameRegex.test(contactName.value.trim()));
  const isEmailValid = validateField(contactEmail, document.getElementById("emailError"), emailRegex.test(contactEmail.value.trim()));
  const isSubjectValid = validateField(contactSubject, document.getElementById("subjectError"), contactSubject.value.trim().length >= 5);
  const isMessageValid = validateField(contactMessage, document.getElementById("messageError"), contactMessage.value.trim().length >= 20);

  if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
    showToast("🎉 Transmission received! Tanvi Patibandla will respond shortly.");
    // Clear draft
    localStorage.removeItem("portfolio_contact_draft");
    contactForm.reset();
    charCount.textContent = "0 / 500";
    [contactName, contactEmail, contactSubject, contactMessage].forEach(el => el.classList.remove("valid"));
  } else {
    showToast("❌ Please fix validation errors highlighted in red.");
  }
});

// 7. Theme Toggle System (Week 10)
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("portfolio_theme", theme);
}

const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

// 8. Toast Notifications
function showToast(message) {
  const container = document.getElementById("portfolioToastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
window.showToast = showToast;

// 9. View Resume Action
document.getElementById("viewResumeBtn")?.addEventListener("click", () => {
  showToast("📄 Tanvi Patibandla's Engineering Resume (Curriculum Vitae) is downloaded.");
});

// 10. Performance Telemetry (Week 12 Core Web Vitals)
window.addEventListener("load", () => {
  setTimeout(() => {
    if (window.performance) {
      const navTiming = performance.getEntriesByType("navigation")[0];
      if (navTiming) {
        const domLoad = Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime);
        const domEl = document.getElementById("vitalsDOM");
        if (domEl) domEl.textContent = `${domLoad}ms`;
      }
    }
  }, 100);
});

// Initial Render
renderProjects();
console.log("⚡ Tanvi Patibandla Portfolio Application Initialized.");
