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
      nav_learn: "Learn",
      nav_join: "Join",
      share_page: "Share",
      share_shared: "Shared",
      share_copied: "Copied",
      share_failed: "Copy failed",
      accessibility_title: "Accessibility",
      accessibility_text: "Choose a language, enlarge text, increase contrast, or reduce motion."
    },
    es: {
      tagline: "La integridad construye mañana.",
      skip_to_content: "Saltar al contenido principal",
      language_label: "Elegir idioma",
      larger_text: "Texto más grande",
      high_contrast: "Alto contraste",
      reduced_motion: "Menos movimiento",
      nav_about: "Acerca de",
      nav_why: "Por qué",
      nav_plan: "Plan",
      nav_learn: "Aprender",
      nav_join: "Unirse",
      accessibility_title: "Accesibilidad",
      accessibility_text: "Elige idioma, aumenta el texto, sube el contraste o reduce el movimiento."
    },
    fr: {
      tagline: "L'intégrité construit demain.",
      skip_to_content: "Aller au contenu principal",
      language_label: "Choisir la langue",
      larger_text: "Texte plus grand",
      high_contrast: "Contraste élevé",
      reduced_motion: "Moins de mouvement",
      nav_about: "À propos",
      nav_why: "Pourquoi",
      nav_plan: "Plan",
      nav_learn: "Apprendre",
      nav_join: "Rejoindre",
      accessibility_title: "Accessibilité",
      accessibility_text: "Choisissez une langue, agrandissez le texte, augmentez le contraste ou réduisez le mouvement."
    },
    pt: {
      tagline: "A integridade constrói o amanhã.",
      skip_to_content: "Ir para o conteudo principal",
      language_label: "Escolher idioma",
      larger_text: "Texto maior",
      high_contrast: "Alto contraste",
      reduced_motion: "Menos movimento",
      nav_about: "Sobre",
      nav_why: "Por quê",
      nav_plan: "Plano",
      nav_learn: "Aprender",
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
      nav_learn: "تعلّم",
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
      nav_learn: "सीखें",
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
      nav_learn: "Jifunze",
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
      nav_learn: "学习",
      nav_join: "加入",
      accessibility_title: "无障碍",
      accessibility_text: "选择语言、放大文字、提高对比度或减少动态。"
    },
    de: {
      tagline: "Integrität baut morgen.",
      skip_to_content: "Zum Hauptinhalt springen",
      language_label: "Sprache wählen",
      larger_text: "Größerer Text",
      high_contrast: "Hoher Kontrast",
      reduced_motion: "Weniger Bewegung",
      nav_about: "Über uns",
      nav_why: "Warum",
      nav_plan: "Plan",
      nav_learn: "Lernen",
      nav_join: "Mitmachen",
      accessibility_title: "Barrierefreiheit",
      accessibility_text: "Sprache wählen, Text vergrößern, Kontrast erhöhen oder Bewegung reduzieren."
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

  // The translations cover navigation and the accessibility controls only --
  // page content stays in English. So lang/dir are tagged on the translated
  // elements themselves; tagging <html> would tell a screen reader to read
  // English prose with, say, an Arabic voice, and would flip the whole layout
  // to RTL around left-to-right content.
  function tagElement(element, lang, dir){
    element.setAttribute("lang", lang);
    if(dir === "rtl") {
      element.setAttribute("dir", "rtl");
    } else {
      element.removeAttribute("dir");
    }
  }

  function applyTranslations(lang){
    const chosen = normalizeLang(lang);
    const dict = getDict(chosen);
    const dir = rtlLangs.includes(chosen.split("-")[0]) ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if(Object.prototype.hasOwnProperty.call(dict, key)) {
        element.textContent = dict[key];
        tagElement(element, chosen, dir);
      }
    });
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

  function sharePage(){
    const title = document.title.replace(/\s+\|\s+/g, " - ");
    const url = getShareUrl();
    const text = "OneTomorrow: public integrity for freedom, transparency, equality, and innovation.";
    if(navigator.share) {
      return navigator.share({ title, text, url }).then(() => "share_shared").catch(error => {
        if(error && error.name === "AbortError") return Promise.resolve();
        return writeClipboard(title + "\n" + url).then(() => "share_copied");
      });
    }
    return writeClipboard(title + "\n" + url).then(() => "share_copied");
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
      sharePage()
        .then(key => showShareResult(button, status, key || "share_page"))
        .catch(() => showShareResult(button, status, "share_failed"));
    });
  }

  function cleanFormValue(form, name){
    const field = form.elements[name];
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function buildJoinMessage(form){
    const name = cleanFormValue(form, "name");
    const email = cleanFormValue(form, "email");
    const region = cleanFormValue(form, "region");
    const role = cleanFormValue(form, "role");
    return [
      "OneTomorrow join request",
      "",
      "Name: " + name,
      "Email: " + email,
      "Country, region, or community: " + region,
      "",
      "What I will help build:",
      role,
      "",
      "Submitted from: " + getShareUrl()
    ].join("\n");
  }

  function setStatus(status, message){
    if(status) status.textContent = message;
  }

  // Only used when the request could not be delivered, so the visitor still
  // has their text. Writing it on every submit put their name, email and
  // message on the system clipboard even when nothing had gone wrong.
  function offerMailtoFallback(form, status){
    const message = buildJoinMessage(form);
    const subject = "OneTomorrow join request" + (cleanFormValue(form, "name") ? " - " + cleanFormValue(form, "name") : "");
    writeClipboard(message).then(() => {
      setStatus(status, "We could not send that automatically. Your message was copied \u2014 please paste it into an email to join@onetomorrow.today.");
    }).catch(() => {
      setStatus(status, "We could not send that automatically. Please email join@onetomorrow.today.");
    });
    window.setTimeout(() => {
      window.location.href = "mailto:join@onetomorrow.today?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
    }, 120);
  }

  function initJoinForm(){
    const form = document.querySelector("[data-join-form]");
    if(!form) return;
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');

    // Without JS the form posts natively to the same endpoint, which replies
    // with a 303 back to this page.
    form.addEventListener("submit", event => {
      event.preventDefault();
      if(!form.reportValidity()) return;

      const payload = {
        name: cleanFormValue(form, "name"),
        email: cleanFormValue(form, "email"),
        region: cleanFormValue(form, "region"),
        role: cleanFormValue(form, "role"),
        website: cleanFormValue(form, "website")
      };

      if(submit) submit.disabled = true;
      setStatus(status, "Sending\u2026");

      fetch(form.action, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(response => {
        return response.json().catch(() => ({})).then(body => ({ ok: response.ok, body }));
      }).then(result => {
        if(result.ok && result.body.ok) {
          form.reset();
          setStatus(status, "Thank you. Your message is on its way and we will reply by email.");
          window.location.hash = "commitment-sent";
        } else if(result.body && result.body.error) {
          setStatus(status, result.body.error);
        } else {
          offerMailtoFallback(form, status);
        }
      }).catch(() => {
        offerMailtoFallback(form, status);
      }).then(() => {
        if(submit) submit.disabled = false;
      });
    });

    // Surface the no-JS redirect result.
    const params = new URLSearchParams(window.location.search);
    if(params.get("sent") === "1") {
      setStatus(status, "Thank you. Your message is on its way and we will reply by email.");
    } else if(params.get("error")) {
      setStatus(status, "We could not send that. Please try again, or email join@onetomorrow.today.");
    }
  }

  ["large-text", "high-contrast", "reduced-motion"].forEach(name => {
    if(getStored(name) === "1") document.body.classList.add(name);
    syncToggle(name);
  });

  initShareButton();
  initJoinForm();

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

  // Only a language the visitor actually chose is restored. Guessing from
  // navigator.language mixed translated chrome into untranslated content for
  // people who never asked for it.
  applyTranslations(getStored("siteLanguage") || "en");
})();
