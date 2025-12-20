import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PageLayout from "../../layout/PageLayout";
import { roomService } from "../../services/roomService";
import { usePagination } from "../../hooks/usePagination";
import { useFavorites } from "../../hooks/useFavorites";
import { useDebounce } from "../../hooks/useDebounce";
import { LoadingSpinner } from "../../components/Loading";
import RoomCard from "./components/RoomCard";
import RoomFilters from "./components/RoomFilters";

export default function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "Available",
    minPrice: "",
    maxPrice: "",
    roomTypeId: "",
    search: "",
  });

  const {
    currentPage,
    limit,
    totalPages,
    total,
    updatePagination,
    goToPage,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(1, 12);

  const debouncedSearch = useDebounce(filters.search, 500);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchRooms();
  }, [
    currentPage,
    debouncedSearch,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.roomTypeId,
  ]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit,
        ...filters,
        search: debouncedSearch,
      };

      const result = await roomService.getRooms(params);
      setRooms(result.rooms);
      updatePagination(result.pagination);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleFavoriteToggle = (room) => {
    const favoriteItem = {
      id: room.RoomId,
      type: "room",
      name: room.RoomName,
      image: room.RoomImage,
      price: room.Price,
    };

    const added = toggleFavorite(favoriteItem);
    toast.success(added ? "Added to favorites!" : "Removed from favorites!");
  };

  if (loading && rooms.length === 0) {
    return (
      <PageLayout title="Our Rooms">
        <LoadingSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Our Rooms">
      <div className="container-fluid py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="section-title text-center text-primary text-uppercase">
              Our Rooms
            </h6>
            <h1 className="mb-5">
              Explore Our{" "}
              <span className="text-primary text-uppercase">Rooms</span>
            </h1>
          </div>

          {/* Filters */}
          <RoomFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
          />

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Results Info */}
          {total > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <p className="text-muted">
                  Showing {rooms.length} of {total} rooms
                  {filters.search && ` for "${filters.search}"`}
                </p>
              </div>
            </div>
          )}

          {/* Rooms Grid */}
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room.RoomId} className="col-lg-4 col-md-6">
                <RoomCard
                  room={room}
                  isFavorite={isFavorite(room.RoomId, "room")}
                  onFavoriteToggle={() => handleFavoriteToggle(room)}
                />
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && rooms.length === 0 && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <h4>No rooms found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setFilters({
                      status: "Available",
                      minPrice: "",
                      maxPrice: "",
                      roomTypeId: "",
                      search: "",
                    })
                  }
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-5">
              <div className="col-12">
                <nav aria-label="Room pagination">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${!hasPrevPage ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={goToPrevPage}
                        disabled={!hasPrevPage}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${!hasNextPage ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={goToNextPage}
                        disabled={!hasNextPage}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
