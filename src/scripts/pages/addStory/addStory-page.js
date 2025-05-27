import L from "leaflet";
import "leaflet/dist/leaflet.css";
import addStoryPresenter from "./addStory-presenter";
import AddNewStory from "../../model/addStory-model.js";

export default class AddStoryPage {
  #stream;

  async render() {
    return `
            <main id="content" tabindex="-1" class="addstory-container">
            <a href="#/story"><button> Back To Story Page </button></a>
            <h2>Tambah Cerita Baru</h2>
            <form id="addStoryForm">
                <div class="radio">
                    <h3> Pilih photo source</h3>
                    <label><input type="radio" name="photoSource" value="file" checked /> Upload File</label>
                    <label><input type="radio" name="photoSource" value="camera" /> Gunakan Kamera</label>
                </div>

                <div id="fileInputContainer">
                    <input type="file" id="photoInput" name="photo" accept="image/*" required />
                </div>

                <div id="cameraInputContainer" style="display: none;">
                    <div class = "grid-container2">
                        <div class="col1">
                            <button type="button" id="takePhoto">Ambil Foto</button>
                            <video id="video" autoplay playsinline></video>
                        </div>
                        <div class="col2">
                            <h2> Hasil Foto : </h2>
                            <canvas id="canvas" style="display: none;"></canvas>
                        </div>
                    </div>
                </div>
                <h3> Tulis Deskripsi : </h3>
                <textarea name="description" placeholder="Tulis deskripsi cerita..." required></textarea>

                <div id="map"></div>
                <input type="hidden" id="latInput" name="lat" />
                <input type="hidden" id="lonInput" name="lon" />

                <a><button type="submit" >Kirim</button> </a>
                <p id="formMessage" style="color: red;"></p>
            </form>
            </main>
      `;
  }

  async afterRender() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const photoInput = document.getElementById("photoInput");

    const fileInputContainer = document.getElementById("fileInputContainer");
    const cameraInputContainer = document.getElementById(
      "cameraInputContainer"
    );

    document.querySelectorAll('input[name="photoSource"]').forEach((radio) => {
      radio.addEventListener("change", async (e) => {
        const selected = e.target.value;

        if (selected === "camera") {
          fileInputContainer.style.display = "none";
          cameraInputContainer.style.display = "block";
          photoInput.removeAttribute("required");

          try {
            this.#stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            video.srcObject = this.#stream;
          } catch (err) {
            console.error("Gagal membuka kamera", err);
          }
        } else {
          fileInputContainer.style.display = "block";
          cameraInputContainer.style.display = "none";
          photoInput.setAttribute("required", "");

          if (this.#stream) {
            this.#stream.getTracks().forEach((track) => track.stop());
            this.#stream = null;
          }
        }
      });
    });

    document.getElementById("takePhoto").addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.style.display = "block";
    });
    window.addEventListener("beforeunload", () => {
      if (this.#stream) {
        this.#stream.getTracks().forEach((track) => track.stop());
        this.#stream = null;
      }
    });
    const backButton = document.querySelector("a button");
    backButton.addEventListener("click", () => {
      if (this.#stream) {
        this.#stream.getTracks().forEach((track) => track.stop());
        this.#stream = null;
      }
    });

    const map = L.map("map");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 18);
      },
      (error) => {
        console.warn("Gagal mendapatkan lokasi pengguna:", error);
        map.setView([-6.2, 106.8], 13);
      }
    );

    let currentMarker = null;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById("latInput").value = lat;
      document.getElementById("lonInput").value = lng;

      if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
      } else {
        currentMarker = L.marker([lat, lng]).addTo(map);
      }
    });
    const model = new AddNewStory();
    const token = localStorage.getItem("token");
    const presenter = new addStoryPresenter({
      model,
    });

    const form = document.getElementById("addStoryForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const lat = document.getElementById("latInput").value;
      const lon = document.getElementById("lonInput").value;
      const formData = new FormData(form);
      if (!lat || !lon) {
        formData.delete("lat");
        formData.delete("lon");
      }
      let photoFile;
      const source = document.querySelector(
        'input[name="photoSource"]:checked'
      ).value;

      if (source === "file") {
        photoFile = photoInput.files?.[0];
      } else {
        photoFile = await new Promise((resolve) =>
          canvas.toBlob((blob) =>
            resolve(new File([blob], "photo.jpg", { type: "image/jpeg" }))
          )
        );
      }

      formData.set("photo", photoFile);
      await presenter.addNewStory(token, formData);
      if (this.#stream) {
        this.#stream.getTracks().forEach((track) => track.stop());
      }
      form.reset();
    });

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
