import getStory from "../../model/stories-model";
import StoryPresenter from "./story-presenter";
import {
  subscribe,
  isCurrentPushSubscriptionAvailable,
  unsubscribe,
} from "../../utils/notificationHelper";
import {
  saveStory,
  getAllStories,
  getStoryById,
  deleteStoryById,
} from "../../data/database.js";

export default class StoryPage {
  constructor() {
    this.isBookmarkView = false;
  }

  async render() {
    return `
      <section class="story-section fade-up">
        <h1>Story Page</h1>
        <h3>Selamat datang di halaman cerita! Di sini Anda bisa menjelajahi berbagai cerita menarik.</h3>
      </section>
      <div class="buttons">
        <button id="bookmark-view-btn" class="button">My Bookmark</button>
        <button id="subscribe-btn" class="button">Subscribe</button>
        <a href="#/addStory"><button class="button">Buat Storymu</button></a>
      </div>
      <main class="story-card" id="content" tabindex="-1" style="view-transition-name: page-content;"></main>
      <div id="loading-container"></div>
    `;
  }

  async afterRender() {
    const animatedElements = document.querySelectorAll(".fade-up");
    animatedElements.forEach((el, index) => {
      el.animate(
        [
          { transform: "translateY(50px) scale(0.9)", opacity: 0 },
          { transform: "translateY(0) scale(1)", opacity: 1 },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          delay: index * 200,
          fill: "forwards",
        }
      );
    });

    const token = localStorage.getItem("token");
    const subscribeBtn = document.querySelector("#subscribe-btn");
    const bookmarkBtn = document.querySelector("#bookmark-view-btn");

    async function updateButton() {
      const isSubscribed = await isCurrentPushSubscriptionAvailable();
      subscribeBtn.textContent = isSubscribed ? "Unsubscribe" : "Subscribe";
      subscribeBtn.dataset.subscribed = isSubscribed ? "true" : "false";
    }

    await updateButton();

    subscribeBtn.addEventListener("click", async () => {
      const isSubscribed = subscribeBtn.dataset.subscribed === "true";
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
      await updateButton();
    });

    bookmarkBtn.addEventListener("click", async () => {
      const content = document.getElementById("content");
      content.innerHTML = "";

      if (!this.isBookmarkView) {
        const bookmarks = await getAllStories();
        await this.showBookmark(bookmarks);
        bookmarkBtn.textContent = "Kembali ke Story";
        this.isBookmarkView = true;
      } else {
        const model = new getStory();
        const presenter = new StoryPresenter({
          model,
          view: this,
        });
        const token = localStorage.getItem("token");
        await presenter.getStory({ token });
        bookmarkBtn.textContent = "My Bookmark";
        this.isBookmarkView = false;
      }
    });

    if (!token) {
      const section = document.querySelector("section.story-section");
      const main = document.querySelector("main.story-card");
      const addButton = document.querySelector('a[href="#/addStory"]');
      if (main) main.innerHTML = "";
      if (addButton) addButton.remove();
      if (section) {
        section.innerHTML = `
          <h1>Tolong login terlebih dahulu.</h1>
          <a href="#/login"><button class="login-button">Login Sekarang</button></a>
        `;
      }
      return;
    }

    const model = new getStory();
    const presenter = new StoryPresenter({
      model,
      view: this,
    });
    await presenter.getStory({ token });
  }

  async showStory(storyList) {
    const container = document.querySelector(".story-card");
    container.innerHTML = "";
    const colors = ["#7ABA78", "#0A6847", "#F3CA52"];

    const storycard = storyList
      .map((story) => {
        const id = story.id;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `
          <div class="card fade-up" style="background-color: ${randomColor};">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" alt="${story.name}" />
            <h4>Description:</h4>
            <p>${story.description}</p>
            <p>Dibuat Tanggal: ${story.createdAt}</p>
            <div>
              <button class="bookmark" data-id="${id}" data-name="${story.name}" data-photo="${story.photoUrl}" data-description="${story.description}" data-date="${story.createdAt}">Bookmark</button>
              <a href="#/story/${id}"><button>More Detail</button></a>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="story-list">
        ${storycard}
      </div>
    `;

    document.querySelectorAll(".bookmark").forEach(async (btn) => {
      const id = btn.dataset.id;
      const story = {
        id,
        name: btn.dataset.name,
        photoUrl: btn.dataset.photo,
        description: btn.dataset.description,
        createdAt: btn.dataset.date,
      };

      const existing = await getStoryById(id);
      btn.textContent = existing
        ? "Hapus dari Bookmark"
        : "Tambahkan ke Bookmark";

      btn.addEventListener("click", async () => {
        const isBookmarked = await getStoryById(id);
        if (isBookmarked) {
          await deleteStoryById(id);
          btn.textContent = "Tambahkan ke Bookmark";
        } else {
          await saveStory(story);
          btn.textContent = "Hapus dari Bookmark";
        }
      });
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

  async showBookmark(bookmarks) {
    const container = document.querySelector(".story-card");
    container.innerHTML = "";
    const colors = ["#7ABA78", "#0A6847", "#F3CA52"];

    if (bookmarks.length === 0) {
      container.innerHTML =
        '<p style="text-align: center ">Belum ada bookmark.</p>';
      return;
    }

    const html = bookmarks
      .map((story) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `
          <div class="card fade-up" style="background-color: ${color};">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" alt="${story.name}" />
            <p>${story.description}</p>
            <p>Dibuat Tanggal: ${story.createdAt}</p>
            <div>
              <button class="remove-bookmark remove" data-id="${story.id}">Hapus dari Bookmark</button>
              <a href="#/story/${story.id}"><button>More Detail</button></a>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `<div class="story-list">${html}</div>`;

    document.querySelectorAll(".remove-bookmark").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await deleteStoryById(id);
        btn.closest(".card").remove();
      });
    });
  }

  showLoading() {
    document.getElementById("loading-container").innerHTML = `
      <div class="loader"></div>
    `;
  }

  hideLoading() {
    document.getElementById("loading-container").innerHTML = "";
  }
}
