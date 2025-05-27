export default class AboutPage {
  async render() {
    return `
      <main id="content" tabindex="0" class="about-section fade-up">
        <h1>About Page</h1>
        <p>Story Sharing App adalah aplikasi untuk berbagi cerita dari seluruh dunia.</p>
        <a class="button" href="#/"><button>Back to Home</button></a>
      </main>
    `;
  }

  async afterRender() {
    const animatedElements = document.querySelectorAll(".fade-up");
    animatedElements.forEach((el, index) => {
      el.animate(
        [
          { transform: "translateY(50px) scale(0.9)", opacity: 0 },
          { transform: "translateY(0) scale(1)", opacity: 1 },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          delay: index * 200,
          fill: "forwards",
        }
      );
    });

    const skipLink = document.getElementById("skip-link");
    const content = document.getElementById("content");

    if (skipLink && content) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        content.focus();
        content.scrollIntoView({ behavior: "smooth" });
      });
    }
  }
}
