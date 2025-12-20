import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PageLayout from "../../layout/PageLayout";
import { eventService } from "../../services/eventService";
import { usePagination } from "../../hooks/usePagination";
import { useFavorites } from "../../hooks/useFavorites";
import { useDebounce } from "../../hooks/useDebounce";
import { LoadingSpinner } from "../../components/Loading";
import EventCard from "./components/EventCard";
import EventFilters from "./components/EventFilters";

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "Active",
    eventTypeId: "",
    minPrice: "",
    maxPrice: "",
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
  } = usePagination(1, 9);

  const debouncedSearch = useDebounce(filters.search, 500);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchEvents();
  }, [
    currentPage,
    debouncedSearch,
    filters.status,
    filters.eventTypeId,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit,
        ...filters,
        search: debouncedSearch,
      };

      const result = await eventService.getEvents(params);
      setEvents(result.events);
      updatePagination(result.pagination);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleFavoriteToggle = (event) => {
    const favoriteItem = {
      id: event.EventId,
      type: "event",
      name: event.EventName,
      image: event.EventImage,
      price: event.Price,
    };

    const added = toggleFavorite(favoriteItem);
    toast.success(added ? "Added to favorites!" : "Removed from favorites!");
  };

  if (loading && events.length === 0) {
    return (
      <PageLayout title="Events">
        <LoadingSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Events">
      <div className="container-fluid py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="section-title text-center text-primary text-uppercase">
              Our Events
            </h6>
            <h1 className="mb-5">
              Discover Amazing{" "}
              <span className="text-primary text-uppercase">Events</span>
            </h1>
          </div>

          {/* Filters */}
          <EventFilters
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
                  Showing {events.length} of {total} events
                  {filters.search && ` for "${filters.search}"`}
                </p>
              </div>
            </div>
          )}

          {/* Events Grid */}
          <div className="row g-4">
            {events.map((event) => (
              <div key={event.EventId} className="col-lg-4 col-md-6">
                <EventCard
                  event={event}
                  isFavorite={isFavorite(event.EventId, "event")}
                  onFavoriteToggle={() => handleFavoriteToggle(event)}
                />
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && events.length === 0 && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <h4>No events found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setFilters({
                      status: "Active",
                      eventTypeId: "",
                      minPrice: "",
                      maxPrice: "",
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
                <nav aria-label="Event pagination">
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
