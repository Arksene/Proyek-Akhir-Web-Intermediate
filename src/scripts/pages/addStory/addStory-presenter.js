export default class addStoryPresenter {
  #model;
  #dbModel;

  constructor({ model }) {
    this.#model = model;
  }
  async addNewStory(token, formData) {
    try {
      await this.#model.addStory(token, formData);
      window.location.hash = "#/story";
    } catch (error) {
      throw new Error(error);
    }
  }
}
