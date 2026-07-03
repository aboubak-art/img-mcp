document.addEventListener("DOMContentLoaded", () => {
  // Header scroll state
  const header = document.getElementById("header");
  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu when clicking a link
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Copy buttons
  for (const button of document.querySelectorAll(".terminal-copy, .copy-button")) {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const text = target.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      } catch {
        const original = button.textContent;
        button.textContent = "Failed";
        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      }
    });
  }
});
