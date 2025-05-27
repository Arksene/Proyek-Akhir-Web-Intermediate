import { showFormattedDate, sleep } from "../../utils";

export default class StoryPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    if (!model) {
      throw new Error("Model tidak valid atau metode getStory tidak ada");
    }
    this.#model = model;
    this.#view = view;
  }

  async getStory({ token }) {
    try {
      this.#view.showLoading();
      await sleep(1500);
      const result = await this.#model.getAllStory(token);

      const formattedStories = result.listStory.map((story) => ({
        ...story,
        createdAt: showFormattedDate(story.createdAt),
      }));
      this.#view.hideLoading();
      await this.#view.showStory(formattedStories);
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}
