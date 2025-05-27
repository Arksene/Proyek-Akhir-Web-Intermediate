import AuthModel from "../../model/login-model";
import LoginPresenter from "./login-presenter";

export default class LoginPage {
  async render() {
    return `
        <main class="center">
            <a href="#/story"><button> Skip To Main Content </button>
            </a>
            <div class="login-container fade-up">
                <h1>Login</h1>
                <section id="content" tabindex = "0" class="login-section">
                    <h2>Login to Your Account</h2>
                    <form id="login-form" method="post">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required aria-required="true" class="login-input"/>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required aria-required="true" minlength="8" class="login-input" />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div id="error-message" style="color: red; display: none;"></div>
                    <h4>Need an account? <a class="register" href="#/register"> Register </a></h4>
                </section>
                <div id="loading-container"></div>
            </div>
        </main>
      `;
  }

  async afterRender() {
    const skipLink = document.getElementById("skip-link");
    const content = document.getElementById("content");

    if (skipLink && content) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        content.focus();
        content.scrollIntoView({ behavior: "smooth" });
      });
    }
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
    const form = document.getElementById("login-form");
    if (!form) {
      console.error('Form with id "login-form" not found');
      return;
    }

    const model = new AuthModel();
    const presenter = new LoginPresenter({
      model,
      view: this,
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      await presenter.handleLogin({ email, password });
    });
  }

  showError(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.textContent = message;
    } else {
      console.error("Elemen error-message tidak ditemukan");
    }
  }
  showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  showLoading() {
    document.getElementById("loading-container").innerHTML = `
      <div class="loader"></div>
    `;
  }
  hideLoading() {
    document.getElementById("loading-container").innerHTML = "";
  }
}
