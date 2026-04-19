(function(){
  const translations = {
    en: {
      site_name: "OneTomorrow",
      tagline: "Integrity builds tomorrow.",
      skip_to_content: "Skip to main content",
      language_label: "Choose language",
      larger_text: "Larger text",
      high_contrast: "High contrast",
      reduced_motion: "Less motion",
      nav_about: "About",
      nav_why: "Why",
      nav_plan: "Plan",
      nav_join: "Join",
      share_page: "Share",
      share_copied: "Copied",
      share_failed: "Copy failed",
      accessibility_title: "Accessibility",
      accessibility_text: "Choose a language, enlarge text, increase contrast, or reduce motion."
    },
    es: {
      tagline: "La integridad construye manana.",
      skip_to_content: "Saltar al contenido principal",
      language_label: "Elegir idioma",
      larger_text: "Texto mas grande",
      high_contrast: "Alto contraste",
      reduced_motion: "Menos movimiento",
      nav_about: "Acerca",
      nav_why: "Por que",
      nav_plan: "Plan",
      nav_join: "Unirse",
      accessibility_title: "Accesibilidad",
      accessibility_text: "Elige idioma, aumenta texto, sube contraste o reduce movimiento."
    },
    fr: {
      tagline: "L'integrite construit demain.",
      skip_to_content: "Aller au contenu principal",
      language_label: "Choisir la langue",
      larger_text: "Texte plus grand",
      high_contrast: "Contraste eleve",
      reduced_motion: "Moins de mouvement",
      nav_about: "A propos",
      nav_why: "Pourquoi",
      nav_plan: "Plan",
      nav_join: "Rejoindre",
      accessibility_title: "Accessibilite",
      accessibility_text: "Choisissez une langue, agrandissez le texte, augmentez le contraste ou reduisez le mouvement."
    },
    pt: {
      tagline: "A integridade constroi o amanha.",
      skip_to_content: "Ir para o conteudo principal",
      language_label: "Escolher idioma",
      larger_text: "Texto maior",
      high_contrast: "Alto contraste",
      reduced_motion: "Menos movimento",
      nav_about: "Sobre",
      nav_why: "Por que",
      nav_plan: "Plano",
      nav_join: "Participar",
      accessibility_title: "Acessibilidade",
      accessibility_text: "Escolha idioma, aumente texto, eleve contraste ou reduza movimento."
    },
    ar: {
      tagline: "النزاهة تبني الغد.",
      skip_to_content: "انتقل إلى المحتوى الرئيسي",
      language_label: "اختر اللغة",
      larger_text: "نص أكبر",
      high_contrast: "تباين عال",
      reduced_motion: "حركة أقل",
      nav_about: "حول",
      nav_why: "لماذا",
      nav_plan: "الخطة",
      nav_join: "انضم",
      accessibility_title: "إتاحة الوصول",
      accessibility_text: "اختر اللغة، كبّر النص، ارفع التباين، أو قلل الحركة."
    },
    hi: {
      tagline: "ईमानदारी कल बनाती है.",
      skip_to_content: "मुख्य सामग्री पर जाएं",
      language_label: "भाषा चुनें",
      larger_text: "बड़ा पाठ",
      high_contrast: "उच्च कंट्रास्ट",
      reduced_motion: "कम गति",
      nav_about: "परिचय",
      nav_why: "क्यों",
      nav_plan: "योजना",
      nav_join: "जुड़ें",
      accessibility_title: "पहुंच",
      accessibility_text: "भाषा चुनें, पाठ बढ़ाएं, कंट्रास्ट बढ़ाएं, या गति घटाएं."
    },
    sw: {
      tagline: "Uadilifu hujenga kesho.",
      skip_to_content: "Ruka hadi maudhui makuu",
      language_label: "Chagua lugha",
      larger_text: "Maandishi makubwa",
      high_contrast: "Utofautishaji mkubwa",
      reduced_motion: "Mwendo mdogo",
      nav_about: "Kuhusu",
      nav_why: "Kwa nini",
      nav_plan: "Mpango",
      nav_join: "Jiunge",
      accessibility_title: "Ufikiaji",
      accessibility_text: "Chagua lugha, ongeza maandishi, ongeza utofautishaji, au punguza mwendo."
    },
    "zh-CN": {
      tagline: "廉洁建设明天。",
      skip_to_content: "跳到主要内容",
      language_label: "选择语言",
      larger_text: "放大文字",
      high_contrast: "高对比度",
      reduced_motion: "减少动态",
      nav_about: "关于",
      nav_why: "原因",
      nav_plan: "计划",
      nav_join: "加入",
      accessibility_title: "无障碍",
      accessibility_text: "选择语言、放大文字、提高对比度或减少动态。"
    },
    de: {
      tagline: "Integritat baut morgen.",
      skip_to_content: "Zum Hauptinhalt springen",
      language_label: "Sprache wahlen",
      larger_text: "Grosserer Text",
      high_contrast: "Hoher Kontrast",
      reduced_motion: "Weniger Bewegung",
      nav_about: "Uber",
      nav_why: "Warum",
      nav_plan: "Plan",
      nav_join: "Mitmachen",
      accessibility_title: "Barrierefreiheit",
      accessibility_text: "Sprache wahlen, Text vergrossern, Kontrast erhohen oder Bewegung reduzieren."
    }
  };

  const fallback = translations.en;
  const rtlLangs = ["ar", "fa", "he", "ur", "ps", "sd", "ug", "yi"];
  const langSelect = document.getElementById("languageSelect");

  function getStored(key){
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStored(key, value){
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function normalizeLang(lang){
    if(!lang) return "en";
    if(translations[lang]) return lang;
    const short = lang.split("-")[0];
    if(translations[short]) return short;
    if(short === "zh") return "zh-CN";
    return "en";
  }

  function getDict(lang){
    const chosen = normalizeLang(lang);
    return Object.assign({}, fallback, translations[chosen] || {});
  }

  function setDir(lang){
    const short = lang.split("-")[0];
    const dir = rtlLangs.includes(short) ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("dir", dir);
    document.body.setAttribute("dir", dir);
  }

  function applyTranslations(lang){
    const chosen = normalizeLang(lang);
    const dict = getDict(chosen);
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if(Object.prototype.hasOwnProperty.call(dict, key)) {
        element.textContent = dict[key];
      }
    });
    setDir(chosen);
    setStored("siteLanguage", chosen);
    if(langSelect) langSelect.value = chosen;
  }

  function syncToggle(name){
    const active = document.body.classList.contains(name);
    document.querySelectorAll('[data-toggle="' + name + '"]').forEach(button => {
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function toggleClass(name){
    document.body.classList.toggle(name);
    setStored(name, document.body.classList.contains(name) ? "1" : "0");
    syncToggle(name);
  }

  function getShareUrl(){
    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical && canonical.href) return canonical.href;
    return window.location.href.split("#")[0];
  }

  function getShareText(){
    const title = document.title.replace(/\s+\|\s+/g, " - ");
    return title + "\n" + getShareUrl();
  }

  function writeClipboard(text){
    if(navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-9999px";
      document.body.appendChild(field);
      field.select();
      try {
        if(document.execCommand("copy")) {
          resolve();
        } else {
          reject(new Error("Copy command failed."));
        }
      } catch (error) {
        reject(error);
      } finally {
        field.remove();
      }
    });
  }

  function showShareResult(button, status, key){
    const dict = getDict(document.documentElement.lang || getStored("siteLanguage") || "en");
    const defaultText = dict.share_page || fallback.share_page;
    const resultText = dict[key] || fallback[key] || defaultText;
    status.textContent = resultText;
    button.textContent = resultText;
    window.setTimeout(() => {
      button.textContent = defaultText;
      status.textContent = "";
    }, 1800);
  }

  function initShareButton(){
    const header = document.querySelector(".site-header");
    if(!header || header.querySelector("[data-share-page]")) return;
    const button = document.createElement("button");
    const status = document.createElement("span");
    button.type = "button";
    button.className = "share-button";
    button.setAttribute("data-share-page", "");
    button.setAttribute("data-i18n", "share_page");
    button.setAttribute("aria-label", fallback.share_page);
    button.textContent = fallback.share_page;
    status.className = "share-status sr-only";
    status.setAttribute("aria-live", "polite");
    header.appendChild(button);
    header.appendChild(status);
    button.addEventListener("click", () => {
      writeClipboard(getShareText())
        .then(() => showShareResult(button, status, "share_copied"))
        .catch(() => showShareResult(button, status, "share_failed"));
    });
  }

  ["large-text", "high-contrast", "reduced-motion"].forEach(name => {
    if(getStored(name) === "1") document.body.classList.add(name);
    syncToggle(name);
  });

  initShareButton();

  document.querySelectorAll(".toggle").forEach(button => {
    const toggleName = button.dataset.toggle;
    button.setAttribute("aria-pressed", document.body.classList.contains(toggleName) ? "true" : "false");
    button.addEventListener("click", () => toggleClass(toggleName));
  });

  document.querySelectorAll(".site-nav a, .button, .toggle, .share-button").forEach(control => {
    control.addEventListener("pointerenter", () => control.classList.add("is-hovered"));
    control.addEventListener("pointerleave", () => {
      control.classList.remove("is-hovered");
      control.classList.remove("is-clicked");
    });
    control.addEventListener("pointerdown", () => control.classList.add("is-clicked"));
    control.addEventListener("click", () => {
      control.classList.add("is-clicked");
      window.setTimeout(() => control.classList.remove("is-clicked"), 240);
    });
    control.addEventListener("blur", () => {
      control.classList.remove("is-hovered");
      control.classList.remove("is-clicked");
    });
  });

  if(langSelect) {
    langSelect.addEventListener("change", event => applyTranslations(event.target.value));
  }

  applyTranslations(getStored("siteLanguage") || navigator.language || "en");
})();
