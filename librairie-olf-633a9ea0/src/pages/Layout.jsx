
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, BookOpen, Grid3x3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl("Search") + `?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <style>{`
        :root {
          --brand-primary: #7C2D12;
          --brand-secondary: #44403C;
          --brand-accent: #92400E;
          --brand-light: #FAF5F0;
          --brand-cream: #FEF3E8;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-stone-800">Librairie OLF</h1>
                <p className="text-xs text-stone-500 hidden sm:block">Votre librairie de référence</p>
              </div>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Rechercher un livre, auteur, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-stone-300 focus:border-amber-800 focus:ring-amber-800"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
              <Button type="submit" className="ml-2 bg-amber-800 hover:bg-amber-900">
                Chercher
              </Button>
            </form>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 pb-4 text-sm">
            <Link
              to={createPageUrl("Home")}
              className={`font-medium transition-colors ${
                currentPageName === "Home" ? "text-amber-800" : "text-stone-600 hover:text-amber-800"
              }`}
            >
              Accueil
            </Link>
            <Link
              to={createPageUrl("Books")}
              className={`font-medium transition-colors ${
                currentPageName === "Books" ? "text-amber-800" : "text-stone-600 hover:text-amber-800"
              }`}
            >
              Catalogue
            </Link>
            <Link
              to={createPageUrl("AdvancedSearch")}
              className={`font-medium transition-colors ${
                currentPageName === "AdvancedSearch" ? "text-amber-800" : "text-stone-600 hover:text-amber-800"
              }`}
            >
              Recherche avancée
            </Link>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-4 border-t border-stone-200 mt-2 pt-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="bg-amber-800 hover:bg-amber-900">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
              <div className="flex flex-col gap-2">
                <Link to={createPageUrl("Home")} className="py-2 font-medium text-stone-700" onClick={() => setIsMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to={createPageUrl("Books")} className="py-2 font-medium text-stone-700" onClick={() => setIsMenuOpen(false)}>
                  Catalogue
                </Link>
                <Link to={createPageUrl("AdvancedSearch")} className="py-2 font-medium text-stone-700" onClick={() => setIsMenuOpen(false)}>
                  Recherche avancée
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif font-bold text-white mb-4">Librairie OLF</h3>
              <p className="text-sm text-stone-400">
                Votre librairie de référence depuis 1985. Plus de 200'000 titres disponibles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl("Home")} className="hover:text-amber-400 transition-colors">Accueil</Link></li>
                <li><Link to={createPageUrl("Books")} className="hover:text-amber-400 transition-colors">Catalogue</Link></li>
                <li><Link to={createPageUrl("AdvancedSearch")} className="hover:text-amber-400 transition-colors">Recherche avancée</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Catégories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Fiction</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Non-fiction</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Sciences</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Jeunesse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-stone-400">info@olf.ch</li>
                <li className="text-stone-400">+41 21 123 45 67</li>
                <li className="text-stone-400">Lun-Sam: 9h-19h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-8 pt-8 text-sm text-center text-stone-400">
            © 2024 Librairie OLF. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
