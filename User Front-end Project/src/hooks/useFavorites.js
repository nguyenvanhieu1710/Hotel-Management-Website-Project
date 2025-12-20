import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setFavoriteCount(favorites.length);
  }, [favorites]);

  const addToFavorites = useCallback(
    (item) => {
      const isAlreadyFavorite = favorites.some(
        (fav) => fav.id === item.id && fav.type === item.type
      );

      if (!isAlreadyFavorite) {
        const newFavorites = [
          ...favorites,
          { ...item, addedAt: new Date().toISOString() },
        ];
        setFavorites(newFavorites);

        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));

        return true; // Added successfully
      }

      return false; // Already exists
    },
    [favorites, setFavorites]
  );

  const removeFromFavorites = useCallback(
    (itemId, itemType) => {
      const newFavorites = favorites.filter(
        (fav) => !(fav.id === itemId && fav.type === itemType)
      );
      setFavorites(newFavorites);

      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));

      return true;
    },
    [favorites, setFavorites]
  );

  const isFavorite = useCallback(
    (itemId, itemType) => {
      return favorites.some(
        (fav) => fav.id === itemId && fav.type === itemType
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item) => {
      if (isFavorite(item.id, item.type)) {
        return removeFromFavorites(item.id, item.type);
      } else {
        return addToFavorites(item);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  }, [setFavorites]);

  const getFavoritesByType = useCallback(
    (type) => {
      return favorites.filter((fav) => fav.type === type);
    },
    [favorites]
  );

  return {
    favorites,
    favoriteCount,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByType,
  };
};

export default useFavorites;
