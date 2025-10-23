import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Package } from "lucide-react";

export default function BookCard({ book, viewMode = "grid" }) {
  const getAvailabilityBadge = () => {
    const config = {
      in_stock: { label: "En stock", className: "bg-green-100 text-green-800 border-green-200" },
      preorder: { label: "Précommande", className: "bg-blue-100 text-blue-800 border-blue-200" },
      out_of_stock: { label: "Épuisé", className: "bg-gray-100 text-gray-600 border-gray-200" }
    };
    return config[book.availability] || config.in_stock;
  };

  const availabilityBadge = getAvailabilityBadge();

  if (viewMode === "list") {
    return (
      <Link to={createPageUrl("BookDetail") + `?id=${book.id}`}>
        <Card className="p-4 hover:shadow-lg transition-all duration-300 bg-white border-stone-200 hover:border-amber-300">
          <div className="flex gap-4">
            <div className="w-24 h-32 flex-shrink-0 bg-stone-100 rounded overflow-hidden">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-stone-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold text-lg text-stone-800 mb-1 line-clamp-2">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-sm text-stone-500 mb-2 line-clamp-1">{book.subtitle}</p>
              )}
              <p className="text-sm text-stone-600 mb-2">
                {book.authors?.join(", ")}
              </p>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{book.language?.toUpperCase()}</Badge>
                <Badge variant="outline" className="text-xs">{book.format}</Badge>
                {book.publication_year && (
                  <span className="text-xs text-stone-500">{book.publication_year}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-xl font-bold text-amber-900">
                    CHF {book.price_chf?.toFixed(2)}
                  </span>
                </div>
                <Badge className={availabilityBadge.className}>
                  {availabilityBadge.label}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={createPageUrl("BookDetail") + `?id=${book.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-stone-200 hover:border-amber-300 h-full flex flex-col">
        <div className="aspect-[3/4] bg-stone-100 overflow-hidden relative">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-stone-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={availabilityBadge.className}>
              {availabilityBadge.label}
            </Badge>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif font-semibold text-base text-stone-800 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-stone-600 mb-2 line-clamp-1">
            {book.authors?.join(", ")}
          </p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="text-xs">{book.language?.toUpperCase()}</Badge>
            <Badge variant="outline" className="text-xs">{book.format}</Badge>
          </div>
          <div className="mt-auto">
            <span className="text-xl font-bold text-amber-900">
              CHF {book.price_chf?.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}