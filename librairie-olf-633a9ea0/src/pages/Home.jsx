import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, Sparkles, TrendingUp, Award } from "lucide-react";
import BookCard from "../components/books/BookCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: recentBooks, isLoading } = useQuery({
    queryKey: ['recent-books'],
    queryFn: () => base44.entities.Book.list("-created_date", 8),
    initialData: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl("Search") + `?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: "Fiction", icon: BookOpen, color: "from-amber-500 to-amber-600", count: "45K+" },
    { name: "Sciences", icon: Sparkles, color: "from-blue-500 to-blue-600", count: "32K+" },
    { name: "Histoire", icon: TrendingUp, color: "from-green-500 to-green-600", count: "28K+" },
    { name: "Art", icon: Award, color: "from-purple-500 to-purple-600", count: "18K+" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-stone-800 mb-6">
              Découvrez votre prochaine lecture
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-8">
              Plus de 200'000 livres disponibles en français, allemand, anglais et italien
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Titre, auteur, ISBN, thème..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 text-lg border-stone-300 focus:border-amber-800 focus:ring-amber-800"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              </div>
              <Button type="submit" size="lg" className="bg-amber-800 hover:bg-amber-900 px-8">
                Chercher
              </Button>
            </form>
            <Link to={createPageUrl("AdvancedSearch")} className="inline-block mt-4 text-sm text-amber-800 hover:underline">
              Recherche avancée →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-stone-800 mb-8 text-center">
            Explorer par catégorie
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={createPageUrl("Books")} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-stone-200 hover:border-amber-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-stone-800 mb-2">{category.name}</h3>
                    <p className="text-sm text-stone-500">{category.count} titres</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-stone-800">
              Nouveautés
            </h2>
            <Link to={createPageUrl("Books")}>
              <Button variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white">
                Voir tout le catalogue
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentBooks.map((book) => (
                <BookCard key={book.id} book={book} viewMode="grid" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
            Utilisez notre recherche avancée pour affiner vos critères et trouver exactement ce que vous cherchez
          </p>
          <Link to={createPageUrl("AdvancedSearch")}>
            <Button size="lg" variant="secondary" className="bg-white text-amber-900 hover:bg-amber-50">
              Essayer la recherche avancée
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}