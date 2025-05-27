import REGISTER from "../../model/register-model";
import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
  async render() {
    return `
        <main class="center">
            <a href="#/story"><button> Skip To Main Content </button></a>
            <div id="content" tabindex="-1" class="register-container fade-up">
                <h1>Register</h1>
                <section class="login-section">
                    <h2> Register Your Account</h2>
                    <form id="register-form" method="post">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input id="name" required aria-required="true" class="login-input"/>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required aria-required="true" class="login-input"/>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required aria-required="true" minlength="8" class="login-input" />
                        </div>
                        <button type="submit">Buat Akun</button>
                    </form>
                    <div id="error-message" style="color: red; display: none;"></div>
                    <h4>Already Have an account? <a class="register" href="#/login"> Login </a></h4>
                </section>
                <div id="loading-container"></div>
            </div>
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

    const form = document.getElementById("register-form");
    const model = new REGISTER();
    const presenter = new RegisterPresenter({
      model,
      view: this,
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errorElement = document.getElementById("error-message");
      errorElement.style.display = "none";
      errorElement.textContent = "";

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      await presenter.regist({ name, email, password });
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

  showError(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    } else {
      console.error("Elemen error-message tidak ditemukan");
    }
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
