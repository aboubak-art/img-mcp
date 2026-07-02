document.addEventListener("DOMContentLoaded", () => {
  for (const button of document.querySelectorAll(".copy-button")) {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      try {
        await navigator.clipboard.writeText(target.textContent ?? "");
        const original = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      } catch {
        button.textContent = "Failed";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1500);
      }
    });
  }
});
