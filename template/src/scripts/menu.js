document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".movil-links");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("🍔 Menu hamburguesa clickeado");

      // Toggle del menú móvil
      mobileMenu.classList.toggle("hidden");
    });
  } else {
    console.error("❌ Elementos del menú no encontrados:", {
      hamburger: !!hamburger,
      mobileMenu: !!mobileMenu,
    });
  }
});
