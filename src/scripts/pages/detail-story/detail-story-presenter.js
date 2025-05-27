import { showFormattedDate } from "../../utils";
export default class DetailStoryPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    if (!model) {
      throw new Error("Model tidak ada");
    }
    this.#model = model;
    this.#view = view;
  }
  async getDetail(id, { token }) {
    try {
      const response = await this.#model.getDetailStory(id, token);
      const story = response.story;

      const formattedStory = {
        ...story,
        createdAt: showFormattedDate(story.createdAt),
      };

      await this.#view.showDetail(formattedStory);
    } catch (error) {
      throw new Error(error);
    }
  }
}
