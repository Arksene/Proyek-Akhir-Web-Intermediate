export default class RegisterPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async regist({ name, email, password }) {
    try {
      this.#view.showLoading();

      await this.#model.register(name, email, password);
      this.#view.hideLoading();
      window.location.hash = "#/login";
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
