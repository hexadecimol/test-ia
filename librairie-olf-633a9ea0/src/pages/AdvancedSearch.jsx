import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import Breadcrumbs from "../components/books/Breadcrumbs";
import { createPageUrl } from "@/utils";

export default function AdvancedSearch() {
  const [formData, setFormData] = useState({
    keywords: "",
    author: "",
    languages: [],
    publishers: "",
    categories: "",
    formats: [],
    priceMin: 0,
    priceMax: 200,
    yearMin: 1900,
    yearMax: 2024,
    availabilities: []
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (formData.keywords) params.set('q', formData.keywords);
    
    // Build URL with all filter params
    const filterParams = [];
    if (formData.languages.length > 0) filterParams.push(`lang=${formData.languages.join(',')}`);
    if (formData.formats.length > 0) filterParams.push(`format=${formData.formats.join(',')}`);
    if (formData.availabilities.length > 0) filterParams.push(`avail=${formData.availabilities.join(',')}`);
    if (formData.priceMin > 0) filterParams.push(`pmin=${formData.priceMin}`);
    if (formData.priceMax < 200) filterParams.push(`pmax=${formData.priceMax}`);
    if (formData.yearMin > 1900) filterParams.push(`ymin=${formData.yearMin}`);
    if (formData.yearMax < 2024) filterParams.push(`ymax=${formData.yearMax}`);
    
    const url = createPageUrl("Search") + `?${params.toString()}${filterParams.length > 0 ? '&' + filterParams.join('&') : ''}`;
    window.location.href = url;
  };

  const handleReset = () => {
    setFormData({
      keywords: "",
      author: "",
      languages: [],
      publishers: "",
      categories: "",
      formats: [],
      priceMin: 0,
      priceMax: 200,
      yearMin: 1900,
      yearMax: 2024,
      availabilities: []
    });
  };

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Recherche avancée" }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Recherche avancée</h1>
            <p className="text-stone-600">Affinez vos critères pour trouver exactement ce que vous cherchez</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Critères de recherche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  placeholder="Titre, description, thème..."
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  placeholder="Nom de l'auteur"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Langue</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "fr", label: "Français" },
                    { value: "de", label: "Allemand" },
                    { value: "en", label: "Anglais" },
                    { value: "it", label: "Italien" }
                  ].map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang.value}`}
                        checked={formData.languages.includes(lang.value)}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            languages: checked
                              ? [...formData.languages, lang.value]
                              : formData.languages.filter((l) => l !== lang.value)
                          });
                        }}
                      />
                      <Label htmlFor={`lang-${lang.value}`} className="cursor-pointer">
                        {lang.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formats */}
              <div className="space-y-2">
                <Label>Format</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "paperback", label: "Broché" },
                    { value: "hardcover", label: "Relié" },
                    { value: "ebook", label: "E-book" },
                    { value: "audiobook", label: "Livre audio" }
                  ].map((format) => (
                    <div key={format.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`format-${format.value}`}
                        checked={formData.formats.includes(format.value)}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            formats: checked
                              ? [...formData.formats, format.value]
                              : formData.formats.filter((f) => f !== format.value)
                          });
                        }}
                      />
                      <Label htmlFor={`format-${format.value}`} className="cursor-pointer">
                        {format.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Disponibilité</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { value: "in_stock", label: "En stock" },
                    { value: "preorder", label: "Précommande" }
                  ].map((avail) => (
                    <div key={avail.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`avail-${avail.value}`}
                        checked={formData.availabilities.includes(avail.value)}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            availabilities: checked
                              ? [...formData.availabilities, avail.value]
                              : formData.availabilities.filter((a) => a !== avail.value)
                          });
                        }}
                      />
                      <Label htmlFor={`avail-${avail.value}`} className="cursor-pointer">
                        {avail.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Fourchette de prix (CHF)</Label>
                <Slider
                  min={0}
                  max={200}
                  step={5}
                  value={[formData.priceMin, formData.priceMax]}
                  onValueChange={([min, max]) => {
                    setFormData({ ...formData, priceMin: min, priceMax: max });
                  }}
                />
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>CHF {formData.priceMin}</span>
                  <span>CHF {formData.priceMax}</span>
                </div>
              </div>

              {/* Publication Year Range */}
              <div className="space-y-4">
                <Label>Année de publication</Label>
                <Slider
                  min={1900}
                  max={2024}
                  step={1}
                  value={[formData.yearMin, formData.yearMax]}
                  onValueChange={([min, max]) => {
                    setFormData({ ...formData, yearMin: min, yearMax: max });
                  }}
                />
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>{formData.yearMin}</span>
                  <span>{formData.yearMax}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-amber-800 hover:bg-amber-900"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}