import { openDB } from "idb";

const DATABASE_NAME = "Bookmark";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "My-Bookmark";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: "id",
      });
    }
  },
});

export async function saveStory(story) {
  const db = await dbPromise;
  if (!story.id) {
    story.id = `story-${Date.now()}`;
  }
  await db.put(OBJECT_STORE_NAME, story);
}

export async function getAllStories() {
  const db = await dbPromise;
  return db.getAll(OBJECT_STORE_NAME);
}

export async function deleteStory(id) {
  const db = await dbPromise;
  await db.delete(OBJECT_STORE_NAME, id);
}

export async function getStoryById(id) {
  const db = await dbPromise;
  return db.get(OBJECT_STORE_NAME, id);
}

export async function deleteStoryById(id) {
  const db = await dbPromise;
  return db.delete(OBJECT_STORE_NAME, id);
}
