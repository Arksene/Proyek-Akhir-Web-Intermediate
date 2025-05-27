import { register } from "../data/api.js";

export default class REGISTER {
  async register(nama, email, password) {
    return await register(nama, email, password);
  }
}
