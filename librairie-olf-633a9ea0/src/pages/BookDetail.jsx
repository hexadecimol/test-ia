import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, Globe, Package, FileText, User, Building } from "lucide-react";
import Breadcrumbs from "../components/books/Breadcrumbs";
import BookCard from "../components/books/BookCard";

export default function BookDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const books = await base44.entities.Book.list();
      return books.find(b => b.id === bookId);
    },
    enabled: !!bookId
  });

  const { data: relatedBooks } = useQuery({
    queryKey: ['related-books', book?.categories?.[0], book?.authors?.[0]],
    queryFn: async () => {
      if (!book) return [];
      const allBooks = await base44.entities.Book.list();
      return allBooks
        .filter(b => 
          b.id !== book.id && 
          (b.categories?.some(c => book.categories?.includes(c)) || 
           b.authors?.some(a => book.authors?.includes(a)))
        )
        .slice(0, 4);
    },
    enabled: !!book,
    initialData: []
  });

  if (isLoading) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-6 w-64 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Livre non trouvé</h1>
          <Button onClick={() => window.history.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const getAvailabilityBadge = () => {
    const config = {
      in_stock: { label: "En stock", className: "bg-green-100 text-green-800 border-green-200" },
      preorder: { label: "Précommande", className: "bg-blue-100 text-blue-800 border-blue-200" },
      out_of_stock: { label: "Épuisé", className: "bg-gray-100 text-gray-600 border-gray-200" }
    };
    return config[book.availability] || config.in_stock;
  };

  const availabilityBadge = getAvailabilityBadge();

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Catalogue", href: "/books" },
    { label: book.title }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Book Cover */}
          <div>
            <Card className="overflow-hidden sticky top-24">
              <div className="aspect-[3/4] bg-stone-100">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-stone-400" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Title & Author */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-xl text-stone-600 mb-4">{book.subtitle}</p>
                )}
                <p className="text-lg text-stone-700 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {book.authors?.join(", ")}
                </p>
              </div>

              {/* Price & Availability */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-200">
                <div>
                  <p className="text-sm text-stone-500 mb-1">Prix</p>
                  <p className="text-3xl font-bold text-amber-900">
                    CHF {book.price_chf?.toFixed(2)}
                  </p>
                </div>
                <Badge className={`${availabilityBadge.className} text-base px-4 py-2`}>
                  {availabilityBadge.label}
                </Badge>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-stone-200">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">ISBN-13</p>
                    <p className="font-medium text-stone-800">{book.isbn13}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">Langue</p>
                    <p className="font-medium text-stone-800 capitalize">{book.language}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">Format</p>
                    <p className="font-medium text-stone-800 capitalize">{book.format}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">Pages</p>
                    <p className="font-medium text-stone-800">{book.pages || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">Éditeur</p>
                    <p className="font-medium text-stone-800">{book.publisher || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-stone-500">Année</p>
                    <p className="font-medium text-stone-800">{book.publication_year || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {book.categories && book.categories.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-stone-500 mb-2">Catégories</p>
                  <div className="flex flex-wrap gap-2">
                    {book.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div>
                  <h2 className="text-xl font-semibold text-stone-800 mb-3">Description</h2>
                  <div className="text-stone-700 leading-relaxed">
                    <p className={showFullDescription ? "" : "line-clamp-6"}>
                      {book.description}
                    </p>
                    {book.description.length > 300 && (
                      <Button
                        variant="link"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-amber-800 px-0 mt-2"
                      >
                        {showFullDescription ? "Voir moins" : "Voir plus"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
              Livres similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.id} book={relatedBook} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}