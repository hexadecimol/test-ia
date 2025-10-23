import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, List, SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BookCard from "../components/books/BookCard";
import FilterSidebar from "../components/books/FilterSidebar";
import Pagination from "../components/books/Pagination";
import Breadcrumbs from "../components/books/Breadcrumbs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Books() {
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [sortBy, setSortBy] = useState("-created_date");
  const [filters, setFilters] = useState({
    languages: [],
    formats: [],
    availabilities: [],
    priceMin: 0,
    priceMax: 200,
    yearMin: 1900,
    yearMax: 2024
  });

  const { data: allBooks, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.list(sortBy),
    initialData: [],
  });

  const filteredBooks = React.useMemo(() => {
    return allBooks.filter(book => {
      if (filters.languages?.length > 0 && !filters.languages.includes(book.language)) return false;
      if (filters.formats?.length > 0 && !filters.formats.includes(book.format)) return false;
      if (filters.availabilities?.length > 0 && !filters.availabilities.includes(book.availability)) return false;
      if (book.price_chf < filters.priceMin || book.price_chf > filters.priceMax) return false;
      if (book.publication_year < filters.yearMin || book.publication_year > filters.yearMax) return false;
      return true;
    });
  }, [allBooks, filters]);

  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, pageSize]);

  const handleResetFilters = () => {
    setFilters({
      languages: [],
      formats: [],
      availabilities: [],
      priceMin: 0,
      priceMax: 200,
      yearMin: 1900,
      yearMax: 2024
    });
  };

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Catalogue" }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-stone-800">Catalogue</h1>
                  <p className="text-sm text-stone-600 mt-1">
                    {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''} trouvé{filteredBooks.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden flex-1 sm:flex-none">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filtres
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <FilterSidebar
                        filters={filters}
                        onFilterChange={setFilters}
                        onReset={handleResetFilters}
                      />
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-created_date">Plus récents</SelectItem>
                      <SelectItem value="created_date">Plus anciens</SelectItem>
                      <SelectItem value="title">Titre A-Z</SelectItem>
                      <SelectItem value="-title">Titre Z-A</SelectItem>
                      <SelectItem value="price_chf">Prix croissant</SelectItem>
                      <SelectItem value="-price_chf">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-amber-800 hover:bg-amber-900" : ""}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-amber-800 hover:bg-amber-900" : ""}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Grid/List */}
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {Array(pageSize).fill(0).map((_, i) => (
                  <Skeleton key={i} className={viewMode === "grid" ? "h-96" : "h-48"} />
                ))}
              </div>
            ) : paginatedBooks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-stone-600 mb-4">Aucun livre trouvé avec ces critères</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} viewMode={viewMode} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredBooks.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}