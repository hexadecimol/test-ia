import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, List, Search as SearchIcon, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BookCard from "../components/books/BookCard";
import FilterSidebar from "../components/books/FilterSidebar";
import Pagination from "../components/books/Pagination";
import Breadcrumbs from "../components/books/Breadcrumbs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Search() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [sortBy, setSortBy] = useState("-created_date");
  const [useAI, setUseAI] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
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

  const performSearch = (query) => {
    if (!query.trim()) return allBooks;
    
    const searchTerms = query.toLowerCase().split(' ');
    return allBooks.filter(book => {
      const searchableText = [
        book.title,
        book.subtitle,
        ...(book.authors || []),
        book.description,
        book.isbn13,
        book.publisher,
        ...(book.categories || [])
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  const searchResults = React.useMemo(() => {
    if (aiResults) {
      return aiResults;
    }
    return performSearch(activeQuery);
  }, [allBooks, activeQuery, aiResults, sortBy]);

  const filteredBooks = React.useMemo(() => {
    return searchResults.filter(book => {
      if (filters.languages?.length > 0 && !filters.languages.includes(book.language)) return false;
      if (filters.formats?.length > 0 && !filters.formats.includes(book.format)) return false;
      if (filters.availabilities?.length > 0 && !filters.availabilities.includes(book.availability)) return false;
      if (book.price_chf < filters.priceMin || book.price_chf > filters.priceMax) return false;
      if (book.publication_year < filters.yearMin || book.publication_year > filters.yearMax) return false;
      return true;
    });
  }, [searchResults, filters]);

  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, pageSize, activeQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    setAiResults(null);
    window.history.pushState({}, '', `?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setUseAI(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Given this search query: "${searchQuery}", analyze all these books and return the IDs of the most relevant ones (up to 50), ordered by relevance. Consider title, author, description, categories, and semantic meaning.
        
Books data: ${JSON.stringify(allBooks.map(b => ({
  id: b.id,
  title: b.title,
  authors: b.authors,
  description: b.description?.substring(0, 200),
  categories: b.categories
})))}`,
        response_json_schema: {
          type: "object",
          properties: {
            relevant_book_ids: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      if (response.relevant_book_ids) {
        const orderedBooks = response.relevant_book_ids
          .map(id => allBooks.find(b => b.id === id))
          .filter(Boolean);
        setAiResults(orderedBooks);
      }
    } catch (error) {
      console.error("AI search failed:", error);
    }
    setIsSearching(false);
  };

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
    { label: "Recherche" }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Rechercher un livre, auteur, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
            <Button type="submit" className="bg-amber-800 hover:bg-amber-900">
              Chercher
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAISearch}
              disabled={isSearching || !searchQuery.trim()}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isSearching ? "Recherche..." : "Recherche IA"}
            </Button>
          </form>
          {activeQuery && (
            <p className="text-sm text-stone-600">
              Résultats pour <span className="font-semibold">"{activeQuery}"</span>
              {useAI && <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">Recherche IA</Badge>}
            </p>
          )}
        </div>

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
                  <h1 className="text-2xl font-serif font-bold text-stone-800">Résultats de recherche</h1>
                  <p className="text-sm text-stone-600 mt-1">
                    {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''} trouvé{filteredBooks.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden flex-1 sm:flex-none">
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
            {isLoading || isSearching ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {Array(pageSize).fill(0).map((_, i) => (
                  <Skeleton key={i} className={viewMode === "grid" ? "h-96" : "h-48"} />
                ))}
              </div>
            ) : paginatedBooks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-stone-600 mb-4">Aucun livre trouvé</p>
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