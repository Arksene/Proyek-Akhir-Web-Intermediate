export default class LoginPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    if (!model || typeof model.login !== "function") {
      throw new Error("Model tidak valid atau metode login tidak ada");
    }
    this.#model = model;
    this.#view = view;
  }

  async handleLogin({ email, password }) {
    try {
      this.#view.showLoading();
      const result = await this.#model.login(email, password);
      localStorage.setItem("token", result.loginResult.token);
      window.location.hash = "#/story";
      this.#view.hideLoading();
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
