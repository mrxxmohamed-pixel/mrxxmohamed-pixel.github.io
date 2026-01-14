const $ = (selector) => document.querySelector(selector);

const getData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return JSON.parse(JSON.stringify(defaultData));
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    return JSON.parse(JSON.stringify(defaultData));
  }
};

const setData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getMessages = () => {
  const stored = localStorage.getItem(MESSAGES_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
};

const renderMessages = () => {
  const list = getMessages();
  const tableBody = $("#messagesBody");
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = "";

  if (!list.length) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan=\"4\">لا توجد رسائل بعد.</td>";
    tableBody.appendChild(row);
    return;
  }

  list.forEach((msg) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${msg.name}</td>
      <td>${msg.phone}</td>
      <td>${msg.message}</td>
      <td>${msg.createdAt}</td>
    `;
    tableBody.appendChild(row);
  });
};

const splitFeatures = (value) =>
  value
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean);

const createPricingItem = (plan = {}) => {
  const item = document.createElement("div");
  item.className = "pricing-item";
  item.innerHTML = `
    <div class="admin-grid">
      <div>
        <label>اسم الباقة</label>
        <input class="input pricing-name" type="text" />
      </div>
      <div>
        <label>السعر</label>
        <input class="input pricing-price" type="text" />
      </div>
    </div>
    <div>
      <label>الوصف</label>
      <textarea class="input pricing-description"></textarea>
    </div>
    <div>
      <label>المميزات (افصل بينها بفاصلة)</label>
      <input class="input pricing-features" type="text" />
    </div>
    <div class="pricing-actions">
      <button class="btn btn-secondary pricing-remove" type="button">حذف</button>
    </div>
  `;

  item.querySelector(".pricing-name").value = plan.name || "";
  item.querySelector(".pricing-price").value = plan.price || "";
  item.querySelector(".pricing-description").value = plan.description || "";
  item.querySelector(".pricing-features").value = (plan.features || []).join(", ");

  item.querySelector(".pricing-remove").addEventListener("click", () => {
    item.remove();
  });

  return item;
};

const renderPricingEditor = (pricing) => {
  const container = $("#pricingEditor");
  if (!container) {
    return;
  }
  container.innerHTML = "";
  pricing.forEach((plan) => {
    container.appendChild(createPricingItem(plan));
  });
};

const collectPricing = () => {
  const container = $("#pricingEditor");
  if (!container) {
    return [];
  }
  return Array.from(container.querySelectorAll(".pricing-item"))
    .map((item) => {
      const name = item.querySelector(".pricing-name").value.trim();
      const price = item.querySelector(".pricing-price").value.trim();
      const description = item.querySelector(".pricing-description").value.trim();
      const featuresRaw = item.querySelector(".pricing-features").value.trim();
      const features = featuresRaw ? splitFeatures(featuresRaw) : [];
      return { name, price, description, features };
    })
    .filter((plan) => plan.name || plan.price || plan.description || plan.features.length);
};

const fillForm = (data) => {
  $("#brandName").value = data.brand.name;
  $("#brandTagline").value = data.brand.tagline;
  $("#brandResponse").value = data.brand.responseTime;
  $("#ctaPrimary").value = data.brand.ctaPrimary;
  $("#ctaSecondary").value = data.brand.ctaSecondary;

  $("#heroTitle").value = data.hero.title;
  $("#heroSubtitle").value = data.hero.subtitle;
  $("#heroBadge").value = data.hero.badge;
  $("#heroHighlight").value = data.hero.highlight;

  $("#aboutTitle").value = data.about.title;
  $("#aboutBody").value = data.about.body;

  $("#contactPhone").value = data.contact.phone;
  $("#contactWhatsapp").value = data.contact.whatsapp;
  $("#contactEmail").value = data.contact.email;
  $("#contactAddress").value = data.contact.address;
  $("#contactHours").value = data.contact.hours;

  $("#instagramLink").value = data.social.instagram;
  $("#tiktokLink").value = data.social.tiktok;
  $("#snapchatLink").value = data.social.snapchat;

  $("#adminPin").value = data.security.adminPin;

  renderPricingEditor(data.pricing || []);

  const jsonEditor = $("#jsonEditor");
  if (jsonEditor) {
    jsonEditor.value = JSON.stringify(data, null, 2);
  }
};

const collectFormData = (data) => {
  return {
    ...data,
    brand: {
      ...data.brand,
      name: $("#brandName").value.trim(),
      tagline: $("#brandTagline").value.trim(),
      responseTime: $("#brandResponse").value.trim(),
      ctaPrimary: $("#ctaPrimary").value.trim(),
      ctaSecondary: $("#ctaSecondary").value.trim()
    },
    hero: {
      ...data.hero,
      title: $("#heroTitle").value.trim(),
      subtitle: $("#heroSubtitle").value.trim(),
      badge: $("#heroBadge").value.trim(),
      highlight: $("#heroHighlight").value.trim()
    },
    about: {
      ...data.about,
      title: $("#aboutTitle").value.trim(),
      body: $("#aboutBody").value.trim()
    },
    contact: {
      ...data.contact,
      phone: $("#contactPhone").value.trim(),
      whatsapp: $("#contactWhatsapp").value.trim(),
      email: $("#contactEmail").value.trim(),
      address: $("#contactAddress").value.trim(),
      hours: $("#contactHours").value.trim()
    },
    social: {
      ...data.social,
      instagram: $("#instagramLink").value.trim(),
      tiktok: $("#tiktokLink").value.trim(),
      snapchat: $("#snapchatLink").value.trim()
    },
    security: {
      ...data.security,
      adminPin: $("#adminPin").value.trim()
    },
    pricing: collectPricing()
  };
};

const showStatus = (text) => {
  const status = $("#status");
  status.textContent = text;
  status.classList.add("status");
  setTimeout(() => {
    status.textContent = "";
    status.classList.remove("status");
  }, 2800);
};

const downloadJson = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "site-data.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const setupAuth = () => {
  const overlay = $("#authOverlay");
  const pinInput = $("#pinInput");
  const pinButton = $("#pinButton");
  const errorText = $("#pinError");
  const logout = $("#logout");

  if (!overlay || !pinInput || !pinButton || !errorText || !logout) {
    return;
  }

  const isAuthed = sessionStorage.getItem("mftah_admin_auth") === "true";
  if (!isAuthed) {
    overlay.style.display = "grid";
  }

  pinButton.addEventListener("click", () => {
    const pin = pinInput.value.trim();
    const currentPin = getData().security.adminPin;
    if (pin === currentPin) {
      sessionStorage.setItem("mftah_admin_auth", "true");
      overlay.style.display = "none";
      errorText.textContent = "";
    } else {
      errorText.textContent = "الرمز غير صحيح.";
    }
  });

  logout.addEventListener("click", () => {
    sessionStorage.removeItem("mftah_admin_auth");
    overlay.style.display = "grid";
  });
};

const init = () => {
  let data = getData();
  fillForm(data);
  renderMessages();
  setupAuth();

  const addPricing = $("#addPricing");
  if (addPricing) {
    addPricing.addEventListener("click", () => {
      const container = $("#pricingEditor");
      if (container) {
        container.appendChild(
          createPricingItem({ name: "", price: "", description: "", features: [] })
        );
      }
    });
  }

  $("#saveQuick").addEventListener("click", () => {
    data = collectFormData(data);
    setData(data);
    fillForm(data);
    showStatus("تم حفظ التحديثات السريعة.");
  });

  const saveJson = $("#saveJson");
  if (saveJson) {
    saveJson.addEventListener("click", () => {
      try {
        const parsed = JSON.parse($("#jsonEditor").value);
        data = parsed;
        setData(data);
        fillForm(data);
        showStatus("تم حفظ البيانات من المحرر.");
      } catch (error) {
        showStatus("ملف JSON غير صالح.");
      }
    });
  }

  $("#resetData").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    data = getData();
    fillForm(data);
    showStatus("تمت إعادة الضبط للإعدادات الافتراضية.");
  });

  $("#exportData").addEventListener("click", () => {
    downloadJson(data);
  });
};

init();
