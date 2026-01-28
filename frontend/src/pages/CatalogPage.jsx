import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, X, ChevronRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CatalogPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [parts, setParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [partsRes, catRes] = await Promise.all([
          axios.get(`${API}/parts`, {
            params: {
              category: selectedCategory || undefined,
              condition: selectedCondition || undefined
            }
          }),
          axios.get(`${API}/categories`)
        ]);
        
        let filteredParts = partsRes.data;
        
        // Client-side search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredParts = filteredParts.filter(part => 
            part.name.toLowerCase().includes(query) ||
            part.description.toLowerCase().includes(query) ||
            part.compatibility.toLowerCase().includes(query)
          );
        }
        
        // Sort
        if (sortBy === "price-asc") {
          filteredParts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "price-desc") {
          filteredParts.sort((a, b) => (b.price || 0) - (a.price || 0));
        }
        
        setParts(filteredParts);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, selectedCondition, searchQuery, sortBy]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCondition("");
    setSearchQuery("");
    setSortBy("recent");
  };

  const activeFiltersCount = [selectedCategory, selectedCondition, searchQuery].filter(Boolean).length;

  const currentCategoryName = categories.find(c => c.slug === selectedCategory)?.name || "Todas as Peças";

  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0A]" data-testid="catalog-page">
      {/* Header */}
      <div className="bg-[#171717] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/loja" className="hover:text-white transition-colors">
              Loja
            </Link>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{currentCategoryName}</span>
              </>
            )}
          </nav>

          <h1 
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: 'Chivo, sans-serif' }}
          >
            {currentCategoryName}
          </h1>
          <p className="text-neutral-400 mt-2">
            {parts.length} {parts.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Pesquisar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <Input
                    placeholder="Nome, modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#171717] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 rounded-sm"
                    data-testid="search-input"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-3 block">
                  Categorias
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                      !selectedCategory 
                        ? "bg-red-600/20 text-red-500 border border-red-600/30" 
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                    data-testid="category-all-btn"
                  >
                    Todas as Peças
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        selectedCategory === cat.slug 
                          ? "bg-red-600/20 text-red-500 border border-red-600/30" 
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                      data-testid={`category-${cat.slug}-btn`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-3 block">
                  Estado
                </label>
                <div className="space-y-2">
                  {["", "Nova", "Usada", "Recondicionada"].map((condition) => (
                    <button
                      key={condition || "all"}
                      onClick={() => setSelectedCondition(condition)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        selectedCondition === condition 
                          ? "bg-red-600/20 text-red-500 border border-red-600/30" 
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                      data-testid={`condition-${condition || 'all'}-btn`}
                    >
                      {condition || "Todos os Estados"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full border-neutral-700 text-neutral-400 hover:text-white hover:border-white rounded-sm"
                  data-testid="clear-filters-btn"
                >
                  Limpar Filtros ({activeFiltersCount})
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex-1 border-neutral-700 text-white rounded-sm"
              data-testid="mobile-filter-btn"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                className="flex-1 bg-[#171717] border-neutral-800 text-white rounded-sm"
                data-testid="sort-select"
              >
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent className="bg-[#171717] border-neutral-800">
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="price-asc">Preço: Menor</SelectItem>
                <SelectItem value="price-desc">Preço: Maior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/80" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#171717] p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Filtros</h3>
                  <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-neutral-300 mb-2 block">Pesquisar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                      placeholder="Nome, modelo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#0A0A0A] border-neutral-800 text-white rounded-sm"
                    />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-neutral-300 mb-3 block">Categorias</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                        !selectedCategory ? "bg-red-600/20 text-red-500" : "text-neutral-400"
                      }`}
                    >
                      Todas as Peças
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                          selectedCategory === cat.slug ? "bg-red-600/20 text-red-500" : "text-neutral-400"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Condition */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-neutral-300 mb-3 block">Estado</label>
                  <div className="space-y-2">
                    {["", "Nova", "Usada", "Recondicionada"].map((condition) => (
                      <button
                        key={condition || "all"}
                        onClick={() => setSelectedCondition(condition)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                          selectedCondition === condition ? "bg-red-600/20 text-red-500" : "text-neutral-400"
                        }`}
                      >
                        {condition || "Todos os Estados"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 border-neutral-700 text-neutral-400 rounded-sm"
                    >
                      Limpar
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-sm"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center justify-end mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger 
                  className="w-48 bg-[#171717] border-neutral-800 text-white rounded-sm"
                  data-testid="desktop-sort-select"
                >
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-[#171717] border-neutral-800">
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="price-asc">Preço: Menor primeiro</SelectItem>
                  <SelectItem value="price-desc">Preço: Maior primeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-neutral-800 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : parts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-400 text-lg mb-4">
                  Nenhuma peça encontrada com os filtros selecionados.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-sm"
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {parts.map((part) => (
                  <ProductCard key={part.id} product={part} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
