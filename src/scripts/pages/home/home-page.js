export default class HomePage {
  async render() {
    return `
      <section class="welcome-section fade-up">
        <h1>Home Page</h1>

        <h2>Welcome to Story Sharing App! Discover Amazing story from people arround the world! </h2>
      </section>
      <main id="content" tabindex = "0" class="grid-container fade-up"> 
        <img src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Rvcnl8ZW58MHx8MHx8fDA%3D" alt="story-books"/>
        <div class="flex-container"> 
          <p> Mau tau apa aja cerita apa aja yang ada di story sharing app? Langsung aja Kunjungi</p>
          <a href="#/login">
            <button> Go to Story Page </button>
          </a>
        </div>
      </main>
      <section class="about-section fade-up">
        <h2>Tentang Aplikasi</h2>
        <p>Story Sharing App adalah aplikasi berbasis web yang memungkinkan pengguna untuk melihat, membagikan, dan menambahkan cerita menarik dari berbagai tempat.
        Dengan tampilan interaktif dan peta digital, kamu bisa tahu di mana cerita itu terjadi!
        </p>
        <a href="#/about"> 
        <button>
          More About App
        </button> 
        </a>
      </section>
    `;
  }

  async afterRender() {
    const animatedElements = document.querySelectorAll(".fade-up");
    animatedElements.forEach((el, index) => {
      el.animate(
        [
          {
            transform: "translateY(50px) scale(0.9)",
            opacity: 1,
          },
          {
            transform: "translateY(0) scale(1)",
            opacity: 1,
          },
        ],
        {
          duration: 1000,
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
