import { useState, useMemo, useCallback } from "react";
import type { Product } from "../services/types/product";

// Fungsi bantuan ini diperlukan untuk pengurutan.
const getPriceValue = (price: string) => {
  if (price.toLowerCase().includes("gratis")) return 0;
  const regex = /(\d+)K/;
  const match = regex.exec(price);
  return match ? parseInt(match[1]) * 1000 : 0;
};

const getRatingValue = (ratingDesc: string): number => {
  const regex = /(\d\.\d) dari/;
  const match = regex.exec(ratingDesc);
  return match ? parseFloat(match[1]) : 0;
};

export const useSearchAndSort = (data: Product[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const processedData = useMemo(() => {
    let localData = [...data];

    // 1. Terapkan filter pencarian
    if (searchTerm) {
      localData = localData.filter((item) =>
        item.texttitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Terapkan pengurutan
    const sortedData = [...localData];
    switch (sortOption) {
      case "harga_terendah":
        sortedData.sort(
          (a, b) =>
            getPriceValue(a.price.toString()) -
            getPriceValue(b.price.toString())
        );
        break;
      case "harga_tertinggi":
        sortedData.sort(
          (a, b) =>
            getPriceValue(b.price.toString()) -
            getPriceValue(a.price.toString())
        );
        break;
      case "A to Z":
        sortedData.sort((a, b) => a.texttitle.localeCompare(b.texttitle));
        break;
      case "Z to A":
        sortedData.sort((a, b) => b.texttitle.localeCompare(a.texttitle));
        break;
      case "rating_tertinggi":
        sortedData.sort(
          (a, b) =>
            getRatingValue(b.ratingImages?.toString() ?? "") -
            getRatingValue(a.ratingImages?.toString() ?? "")
        );
        break;
      case "rating_terendah":
        sortedData.sort(
          (a, b) =>
            getRatingValue(a.ratingImages?.toString() ?? "") -
            getRatingValue(b.ratingImages?.toString() ?? "")
        );
        break;
      default:
        // Tidak ada pengurutan
        break;
    }

    return sortedData;
  }, [data, searchTerm, sortOption]);

  const resetSearchAndSort = useCallback(() => {
    setSearchTerm("");
    setSortOption("default");
  }, []);

  return {
    processedData,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    resetSearchAndSort,
  };
};
