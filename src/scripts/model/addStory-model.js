import { addStory } from "../data/api.js";

export default class AddNewStory {
  async addStory(token, formData) {
    return await addStory(token, formData);
  }
}
