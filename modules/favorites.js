import { readStorage, writeStorage } from "./storage.js?v=26";

const FAVORITES_KEY = "favorites";

export function createFavoritesStore(onChange = () => {}) {
  let ids = new Set(readStorage(FAVORITES_KEY, []));

  function persist() {
    writeStorage(FAVORITES_KEY, [...ids]);
    onChange([...ids]);
  }

  return {
    all() {
      return [...ids];
    },
    count() {
      return ids.size;
    },
    has(id) {
      return ids.has(id);
    },
    toggle(id) {
      if (ids.has(id)) {
        ids.delete(id);
      } else {
        ids.add(id);
      }
      persist();
      return ids.has(id);
    },
    clear() {
      ids = new Set();
      persist();
    },
  };
}
