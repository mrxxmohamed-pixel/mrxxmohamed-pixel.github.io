const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const cloneDefault = () => JSON.parse(JSON.stringify(defaultData));

const hasArabic = (value) => /[\u0600-\u06ff]/.test(value || "");
const looksCorrupted = (value) => /[ÃÂâêîôûŸœ]/.test(value || "");
const isLikelyCorrupted = (data) => {
  const fields = [
    data && data.brand ? data.brand.name : "",
    data && data.hero ? data.hero.title : "",
    data && data.about ? data.about.title : ""
  ];
  const hasAnyArabic = fields.some(hasArabic);
  const hasMojibake = fields.some(looksCorrupted);
  return !hasAnyArabic && hasMojibake;
};

const getData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return cloneDefault();
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") {
      return cloneDefault();
    }
    if (isLikelyCorrupted(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return cloneDefault();
    }
    return parsed;
  } catch (error) {
    return cloneDefault();
  }
};

const saveMessage = (payload) => {
  const existing = localStorage.getItem(MESSAGES_KEY);
  const list = existing ? JSON.parse(existing) : [];
  list.unshift(payload);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
};

const cleanPhone = (value) => value.replace(/[^0-9]/g, "");

const iconSet = {
  services: [
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 11l6-6 6 6-6 6-6-6Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 5v14" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h8M8 13h8M8 17h4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h7l3 3v7H7V7Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M14 7v3h3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l3 2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`
  ],
  process: [
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M14 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12l4 4 8-8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`
  ],
  pricing: [
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h12M6 15h12" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8v8H8z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 12h4M16 12h4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l6 4v8l-6 4-6-4V8l6-4Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`
  ],
  stats: [
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V8M12 16V5M18 16v-6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 19h16" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 8 8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l3 2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`
  ]
};

const iconFor = (list, index) => list[index % list.length];

const renderList = (container, items, renderer) => {
  container.innerHTML = "";
  items.forEach((item, index) => {
    container.appendChild(renderer(item, index));
  });
};

const renderData = (data) => {
  const brandName = $("#brandName");
  const brandTagline = $("#brandTagline");
  if (brandName) {
    brandName.textContent = data.brand.name;
  }
  if (brandTagline) {
    brandTagline.textContent = data.brand.tagline;
  }
  const footerName = $("#brandNameFooter");
  if (footerName) {
    footerName.textContent = data.brand.name;
  }

  const responseTime = $("#responseTime");
  if (responseTime) {
    responseTime.textContent = data.brand.responseTime;
  }

  const heroTitle = $("#heroTitle");
  const heroSubtitle = $("#heroSubtitle");
  const heroBadge = $("#heroBadge");
  const heroHighlight = $("#heroHighlight");
  if (heroTitle) {
    heroTitle.textContent = data.hero.title;
  }
  if (heroSubtitle) {
    heroSubtitle.textContent = data.hero.subtitle;
  }
  if (heroBadge) {
    heroBadge.textContent = data.hero.badge;
  }
  if (heroHighlight) {
    heroHighlight.textContent = data.hero.highlight;
  }

  const ctaPrimary = $("#ctaPrimary");
  const ctaSecondary = $("#ctaSecondary");
  if (ctaPrimary) {
    ctaPrimary.textContent = data.brand.ctaPrimary;
    ctaPrimary.href = "#services";
  }
  if (ctaSecondary) {
    ctaSecondary.textContent = data.brand.ctaSecondary;
    ctaSecondary.href = "#pricing";
  }

  const aboutTitle = $("#aboutTitle");
  const aboutBody = $("#aboutBody");
  if (aboutTitle) {
    aboutTitle.textContent = data.about.title;
  }
  if (aboutBody) {
    aboutBody.textContent = data.about.body;
  }

  renderList($("#aboutValues"), data.about.values, (value) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = value;
    return span;
  });

  renderList($("#serviceList"), data.services, (service, index) => {
    const icon = iconFor(iconSet.services, index);
    const card = document.createElement("div");
    card.className = "card reveal";
    card.innerHTML = `
      <div class="card-icon">${icon}</div>
      <h4>${service.title}</h4>
      <p>${service.description}</p>
      <small>${service.priceNote}</small>
    `;
    return card;
  });

  renderList($("#processList"), data.process, (step, index) => {
    const icon = iconFor(iconSet.process, index);
    const card = document.createElement("div");
    card.className = "process-step reveal";
    card.innerHTML = `
      <div class="icon-pill">${icon}</div>
      <strong>الخطوة ${index + 1}</strong>
      <div>${step.title}</div>
      <small>${step.description}</small>
    `;
    return card;
  });

  renderList($("#pricingList"), data.pricing, (plan, index) => {
    const icon = iconFor(iconSet.pricing, index);
    const card = document.createElement("div");
    card.className = "card pricing-card reveal";
    const features = plan.features
      .map((feature) => `<li><span class="feature-dot"></span>${feature}</li>`)
      .join("");
    card.innerHTML = `
      <div class="card-icon">${icon}</div>
      <h4>${plan.name}</h4>
      <div class="price">${plan.price}</div>
      <p>${plan.description}</p>
      <ul class="feature-list">${features}</ul>
    `;
    return card;
  });

  renderList($("#faqList"), data.faq, (item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "faq-item";
    wrapper.innerHTML = `
      <button type="button">
        <span>${item.question}</span>
        <span>+</span>
      </button>
      <p>${item.answer}</p>
    `;
    return wrapper;
  });

  renderList($("#statsList"), data.stats, (item, index) => {
    const icon = iconFor(iconSet.stats, index);
    const card = document.createElement("div");
    card.className = "stat reveal";
    card.innerHTML = `
      <div class="stat-icon">${icon}</div>
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    `;
    return card;
  });

  const phoneDigits = cleanPhone(data.contact.phone);
  const whatsappDigits = cleanPhone(data.contact.whatsapp);
  const directPhone = $("#directPhone");
  const whatsappNumber = $("#whatsappNumber");
  if (directPhone) {
    directPhone.textContent = data.contact.phone;
  }
  if (whatsappNumber) {
    whatsappNumber.textContent = data.contact.whatsapp;
  }

  const phoneLink = $("#phoneLink");
  if (phoneLink) {
    phoneLink.href = `tel:${phoneDigits}`;
  }
  const whatsappLink = $("#whatsappLink");
  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${whatsappDigits}`;
  }
  const emailLink = $("#emailLink");
  if (emailLink) {
    emailLink.href = `mailto:${data.contact.email}`;
  }
  const socialInstagram = $("#socialInstagram");
  if (socialInstagram) {
    socialInstagram.href = data.social.instagram;
  }
  const socialTiktok = $("#socialTiktok");
  if (socialTiktok) {
    socialTiktok.href = data.social.tiktok;
  }
  const socialSnapchat = $("#socialSnapchat");
  if (socialSnapchat) {
    socialSnapchat.href = data.social.snapchat;
  }

  const floatingCall = $("#floatingCall");
  if (floatingCall) {
    floatingCall.href = `tel:${phoneDigits}`;
  }
};

const setupFaq = () => {
  $$(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      item.classList.toggle("open");
      button.lastElementChild.textContent = item.classList.contains("open") ? "−" : "+";
    });
  });
};

const setupReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  $$(".reveal").forEach((el) => observer.observe(el));
};

const setupContactForm = () => {
  const form = $("#contactForm");
  const status = $("#contactStatus");
  if (!form || !status) {
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#contactName").value.trim();
    const phone = $("#contactPhoneInput").value.trim();
    const message = $("#contactMessage").value.trim();

    if (!name || !phone || !message) {
      status.textContent = "يرجى تعبئة جميع الحقول.";
      return;
    }

    const payload = {
      name,
      phone,
      message,
      createdAt: new Date().toLocaleString("ar-SA")
    };

    saveMessage(payload);
    status.textContent = "تم استلام رسالتك، سنعود إليك قريبًا.";
    form.reset();
  });
};

const init = () => {
  const data = getData();
  renderData(data);
  setupFaq();
  setupReveal();
  setupContactForm();
};

init();
