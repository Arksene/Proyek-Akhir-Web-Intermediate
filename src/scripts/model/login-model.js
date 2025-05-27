import { login } from "../data/api";

export default class AuthModel {
  async login(email, password) {
    return await login(email, password);
  }
}
