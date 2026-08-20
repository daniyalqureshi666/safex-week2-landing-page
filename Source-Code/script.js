document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initSmoothScrolling();
  initActiveNavigation();
  initRevealAnimation();
  initFaqAccordion();
  initHeroVariant();
  initContactFormValidation();
});

// Hero A/B Variant
// Append ?v=b to the URL to preview the alternate hero copy, e.g.
// https://yoursite.com/?v=b
// Swap the DEFAULT_VARIANT constant (or wire this into your A/B testing
// tool of choice, e.g. Google Optimize alternative / GrowthBook / a simple
// 50/50 split) once you're ready to run the test live.
function initHeroVariant() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("v");
  const variant = requested === "b" ? "b" : "a";

  if (variant === "a") return; // "a" is already the markup default

  document.querySelectorAll("[data-variant-b]").forEach((el) => {
    const text = el.getAttribute("data-variant-b");
    if (text) el.textContent = text;
  });

  if (window.gtag) {
    gtag("event", "ab_variant_view", { variant: "b" });
  }
}

// Mobile Navigation
function initMobileNavigation() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close the menu once a link is chosen
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close when clicking outside the menu
  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Close on Escape for keyboard users
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Reset to desktop state on resize past the mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Move focus for keyboard/screen-reader users after the scroll
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

// Active Navigation
function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Reveal Animation
function initRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  // If IntersectionObserver isn't supported, just show everything
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// FAQ Accordion
function initFaqAccordion() {
  const faqList = document.getElementById("faq-list");
  if (!faqList) return;

  const items = faqList.querySelectorAll("details");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}

// Contact Form Validation
function initContactFormValidation() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-form-status");
  if (!form || !status) return;

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      error: document.getElementById("contact-name-error"),
      label: "Full Name",
    },
    email: {
      input: document.getElementById("contact-email"),
      error: document.getElementById("contact-email-error"),
      label: "Email",
    },
    company: {
      input: document.getElementById("contact-company"),
      error: document.getElementById("contact-company-error"),
      label: "Company",
    },
    service: {
      input: document.getElementById("contact-service"),
      error: document.getElementById("contact-service-error"),
      label: "Service",
    },
    message: {
      input: document.getElementById("contact-message"),
      error: document.getElementById("contact-message-error"),
      label: "Message",
    },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (field, message) => {
    field.error.textContent = message;
    field.input.closest(".form-group").classList.toggle("has-error", Boolean(message));
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validateField = (key) => {
    const field = fields[key];
    const value = field.input.value.trim();

    if (!value) {
      setFieldError(field, `${field.label} is required.`);
      return false;
    }

    if (key === "email" && !emailPattern.test(value)) {
      setFieldError(field, "Please enter a valid email address.");
      return false;
    }

    setFieldError(field, "");
    return true;
  };

  // Validate a field as the user leaves it, for early feedback
  Object.keys(fields).forEach((key) => {
    const { input } = fields[key];
    input.addEventListener("blur", () => validateField(key));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const isValid = results.every(Boolean);

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields and try again.";
      status.className = "form-status error";
      const firstInvalid = Object.keys(fields).find(
        (key) => fields[key].error.textContent
      );
      if (firstInvalid) fields[firstInvalid].input.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    status.textContent = "Sending your inquiry...";
    status.className = "form-status";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);

      status.textContent =
        "Thanks! Your inquiry has been received — we'll be in touch shortly.";
      status.className = "form-status success";

      // Track successful lead capture in GA4
      if (window.gtag) {
        gtag("event", "generate_lead", {
          form_id: "contact-form",
          service_requested: fields.service.input.value,
        });
      }

      form.reset();
      Object.keys(fields).forEach((key) => setFieldError(fields[key], ""));
    } catch (error) {
      console.error("SafeX contact form submission error:", error);
      status.textContent =
        "Something went wrong sending your message. Please email us directly at contact@safexsolutions.com.";
      status.className = "form-status error";

      if (window.gtag) {
        gtag("event", "form_submit_error", { form_id: "contact-form" });
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}