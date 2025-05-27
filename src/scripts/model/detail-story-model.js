import { getDetailStory } from "../data/api";

export default class getDetail {
  async getDetailStory(id, token) {
    return await getDetailStory(id, token);
  }
}
