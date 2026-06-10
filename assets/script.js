/* =========================================================
   WYSOCKI — interakcje
   ========================================================= */
(function () {
  "use strict";

  /* ---- Header: stan „przyklejony” ---- */
  const header = document.querySelector(".header");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-stuck", y > 40);
    backTop.classList.toggle("show", y > 700);
  };

  /* ---- Powrót na górę ---- */
  const backTop = document.querySelector(".btn-top");
  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobilne ---- */
  const burger = document.querySelector(".burger");
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav__links a, .nav .btn").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );
  const scrim = document.querySelector(".nav-scrim");
  if (scrim) scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Reveal przy przewijaniu ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
    .forEach((el) => io.observe(el));

  /* ---- Hero: odpal animację wejścia ---- */
  const hero = document.querySelector(".hero");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => hero.classList.add("in"))
  );

  /* ---- Aktywny link w nawigacji (scroll-spy) ---- */
  const links = [...document.querySelectorAll(".nav__links a")];
  const map = new Map();
  links.forEach((l) => {
    const id = l.getAttribute("href");
    if (id && id.startsWith("#")) {
      const sec = document.querySelector(id);
      if (sec) map.set(sec, l);
    }
  });
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const link = map.get(en.target);
          if (link) link.classList.add("is-active");
        }
      });
    },
    { threshold: 0.5 }
  );
  map.forEach((_, sec) => spy.observe(sec));

  /* ---- Formularz kontaktowy ---- */
  const form = document.querySelector("#formKontakt");
  if (form) {
    const success = document.querySelector(".form__success");
    const fields = form.querySelectorAll("[required]");

    const validate = (f) => {
      const wrap = f.closest(".field");
      let ok = f.value.trim().length > 0;
      if (ok && f.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      if (ok && f.dataset.tel != null)
        ok = f.value.replace(/[\s\-()]/g, "").length >= 9;
      wrap.classList.toggle("err", !ok);
      return ok;
    };

    fields.forEach((f) =>
      f.addEventListener("input", () => {
        if (f.closest(".field").classList.contains("err")) validate(f);
      })
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((f) => {
        if (!validate(f)) valid = false;
      });
      if (!valid) {
        form.querySelector(".field.err input, .field.err select, .field.err textarea")?.focus();
        return;
      }

      const data = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then(() => {
          form.querySelectorAll(".form__body").forEach((n) => n.classList.add("is-hidden"));
          success.classList.add("show");
        })
        .catch(() => {
          alert("Błąd wysyłania. Spróbuj ponownie lub zadzwoń bezpośrednio.");
        });
    });
  }

  /* ---- Rok w stopce ---- */
  const yr = document.querySelector("#rok");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Ripple na przyciskach ---- */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
      const rect = btn.getBoundingClientRect();
      const r = document.createElement("span");
      r.className = "btn__ripple";
      r.style.left = e.clientX - rect.left + "px";
      r.style.top  = e.clientY - rect.top  + "px";
      btn.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    });
  });
})();
