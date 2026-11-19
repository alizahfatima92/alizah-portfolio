const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelectorAll(".mobile-menu a");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

if (window.lucide) {
  window.lucide.createIcons();
}

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.hidden = !isOpen;
  const menuIcon = document.querySelector("#menu-icon");
  menuIcon.innerHTML = isOpen
    ? '<path stroke-linecap="round" stroke-linejoin="round" d="m6 6 12 12M18 6 6 18"/>'
    : '<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/>';
};

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => activeSectionObserver.observe(section));

const roleElement = document.querySelector("#typed-role");
const roles = ["SEO Executive", "Full-Stack Web Developer", "Digital Marketer"];
let roleIndex = 0;
let characterIndex = roles[0].length;
let deleting = true;

const animateRole = () => {
  const currentRole = roles[roleIndex];
  if (deleting) {
    characterIndex -= 1;
    roleElement.textContent = currentRole.slice(0, characterIndex);
    if (characterIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(animateRole, 350);
      return;
    }
  } else {
    characterIndex += 1;
    roleElement.textContent = roles[roleIndex].slice(0, characterIndex);
    if (characterIndex >= roles[roleIndex].length) {
      deleting = true;
      window.setTimeout(animateRole, 1800);
      return;
    }
  }
  window.setTimeout(animateRole, deleting ? 45 : 75);
};

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setTimeout(animateRole, 1800);
}

document.querySelectorAll(".skill-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    document.querySelectorAll(".skill-tab").forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });
    document.querySelectorAll(".skill-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
    document.querySelector("#skill-count").textContent = filter === "all" ? "4" : "1";
  });
});

document.querySelectorAll(".spotlight").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  });
});

const certificateModal = document.querySelector("#certificate-modal");
const certificateModalImage = document.querySelector("#certificate-modal-image");
const modalCloseButton = document.querySelector("#modal-close");
let lastCertificateTrigger = null;

document.querySelectorAll(".cert-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lastCertificateTrigger = trigger;
    certificateModal.querySelector("#certificate-modal-title").textContent = trigger.dataset.certTitle;
    certificateModal.querySelector("#certificate-modal-issuer").textContent = trigger.dataset.certIssuer;
    certificateModal.querySelector("#certificate-modal-date").textContent = trigger.dataset.certDate;
    certificateModal.querySelector("#certificate-modal-reference").textContent = trigger.dataset.certReference;
    certificateModalImage.src = trigger.dataset.certImage;
    certificateModalImage.alt = trigger.dataset.certTitle;
    document.body.classList.add("modal-open");
    certificateModal.showModal();
  });
});

modalCloseButton.addEventListener("click", () => certificateModal.close());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && certificateModal.open) {
    event.preventDefault();
    certificateModal.close();
  }
});
certificateModal.addEventListener("click", (event) => {
  if (event.target === certificateModal) certificateModal.close();
});
certificateModal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (lastCertificateTrigger && lastCertificateTrigger.isConnected) {
    lastCertificateTrigger.focus();
  }
});

const toast = document.querySelector("#toast");
let toastTimeout;

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(button.dataset.copy);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = button.dataset.copy;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Clipboard copy command was rejected.");
      }
      toast.querySelector("span").textContent = "Copied to clipboard";
      toast.classList.add("visible");
    } catch (error) {
      toast.querySelector("span").textContent = "Copy unavailable — select the contact text";
      toast.classList.add("visible");
    }
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
