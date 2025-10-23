import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FilterSidebar({ filters, onFilterChange, onReset, availableFilters }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Filtres</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="w-4 h-4 mr-1" />
          Réinitialiser
        </Button>
      </div>

      {/* Language Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Langue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["fr", "de", "en", "it"].map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={filters.languages?.includes(lang)}
                onCheckedChange={(checked) => {
                  const newLanguages = checked
                    ? [...(filters.languages || []), lang]
                    : filters.languages?.filter((l) => l !== lang) || [];
                  onFilterChange({ ...filters, languages: newLanguages });
                }}
              />
              <Label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                {lang === "fr" ? "Français" : lang === "de" ? "Allemand" : lang === "en" ? "Anglais" : "Italien"}
                {availableFilters?.languages?.[lang] && (
                  <span className="text-stone-400 ml-1">({availableFilters.languages[lang]})</span>
                )}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Format Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["paperback", "hardcover", "ebook", "audiobook"].map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={`format-${format}`}
                checked={filters.formats?.includes(format)}
                onCheckedChange={(checked) => {
                  const newFormats = checked
                    ? [...(filters.formats || []), format]
                    : filters.formats?.filter((f) => f !== format) || [];
                  onFilterChange({ ...filters, formats: newFormats });
                }}
              />
              <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer capitalize">
                {format === "paperback" ? "Broché" : format === "hardcover" ? "Relié" : format === "ebook" ? "E-book" : "Livre audio"}
                {availableFilters?.formats?.[format] && (
                  <span className="text-stone-400 ml-1">({availableFilters.formats[format]})</span>
                )}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avail-stock"
              checked={filters.availabilities?.includes("in_stock")}
              onCheckedChange={(checked) => {
                const newAvail = checked
                  ? [...(filters.availabilities || []), "in_stock"]
                  : filters.availabilities?.filter((a) => a !== "in_stock") || [];
                onFilterChange({ ...filters, availabilities: newAvail });
              }}
            />
            <Label htmlFor="avail-stock" className="text-sm cursor-pointer">
              En stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avail-preorder"
              checked={filters.availabilities?.includes("preorder")}
              onCheckedChange={(checked) => {
                const newAvail = checked
                  ? [...(filters.availabilities || []), "preorder"]
                  : filters.availabilities?.filter((a) => a !== "preorder") || [];
                onFilterChange({ ...filters, availabilities: newAvail });
              }}
            />
            <Label htmlFor="avail-preorder" className="text-sm cursor-pointer">
              Précommande
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prix (CHF)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={0}
              max={200}
              step={5}
              value={[filters.priceMin || 0, filters.priceMax || 200]}
              onValueChange={([min, max]) => {
                onFilterChange({ ...filters, priceMin: min, priceMax: max });
              }}
              className="mb-2"
            />
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>CHF {filters.priceMin || 0}</span>
              <span>CHF {filters.priceMax || 200}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publication Year Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Année de publication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={1900}
              max={2024}
              step={1}
              value={[filters.yearMin || 1900, filters.yearMax || 2024]}
              onValueChange={([min, max]) => {
                onFilterChange({ ...filters, yearMin: min, yearMax: max });
              }}
              className="mb-2"
            />
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>{filters.yearMin || 1900}</span>
              <span>{filters.yearMax || 2024}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}