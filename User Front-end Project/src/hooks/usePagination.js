import { useState, useCallback } from "react";

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const updatePagination = useCallback(
    (paginationData) => {
      if (paginationData) {
        setCurrentPage(paginationData.page || currentPage);
        setLimit(paginationData.limit || limit);
        setTotalPages(paginationData.totalPages || 0);
        setTotal(paginationData.total || 0);
      }
    },
    [currentPage, limit]
  );

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setLimit(initialLimit);
    setTotalPages(0);
    setTotal(0);
  }, [initialPage, initialLimit]);

  return {
    currentPage,
    limit,
    totalPages,
    total,
    updatePagination,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changeLimit,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};

export default usePagination;
