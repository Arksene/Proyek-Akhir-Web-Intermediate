import getDetail from "../../model/detail-story-model.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import DetailStoryPresenter from "./detail-story-presenter.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class DetailStory {
  async render() {
    return `
            <div class="detail-container"></div>
        `;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    const token = localStorage.getItem("token");

    const model = new getDetail();
    const presenter = new DetailStoryPresenter({
      model,
      view: this,
    });

    await presenter.getDetail(id, { token });
  }

  async showDetail(DetailStory) {
    const container = document.querySelector(".detail-container");

    const detailHTML = `
      <div class="detail-card">
        <h1 id="content" tabindex="-1">${DetailStory.name}</h1>
        <img tabindex="-1" src="${DetailStory.photoUrl}" alt="${DetailStory.name}" />
        <h3 tabindex="-1"> Created at : ${DetailStory.createdAt}</h3>
        <h2 tabindex="-1">Description:</h2>
        <p tabindex="-1">${DetailStory.description}</p>
        <h3 tabindex="-1"> Map : </h3>
        <div id="map" tabindex="-1"></div>
        <a href="#/story"><button>Back</button></a>

      </div>    
    `;

    container.innerHTML = detailHTML;
    const map = L.map("map").setView([DetailStory.lat, DetailStory.lon], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([DetailStory.lat, DetailStory.lon])
      .addTo(map)
      .bindPopup(`<b>${DetailStory.name}</b><br>${DetailStory.description}`);
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
}
