import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { products, Product } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';
import { Search, SlidersHorizontal, Grid3X3, Grid2X2, RotateCcw } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grid layout format: 4 columns (default) or 3 columns
  const [gridCols, setGridCols] = useState(4);

  // States initialized from search query parameters if available
  const categoryFilter = searchParams.get('category') || 'all';
  const showNewOnly = searchParams.get('filter') === 'new';
  const sortOption = searchParams.get('sort') || 'default';

  // Set local state matching queries
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Handle category active updates
  const handleCategoryChange = (category: string) => {
    const currentParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      currentParams.delete('category');
    } else {
      currentParams.set('category', category);
    }
    setSearchParams(currentParams);
  };

  // Handle sort active updates
  const handleSortChange = (sort: string) => {
    const currentParams = new URLSearchParams(searchParams);
    if (sort === 'default') {
      currentParams.delete('sort');
    } else {
      currentParams.set('sort', sort);
    }
    setSearchParams(currentParams);
  };

  // Handle New arrivals toggle
  const handleNewArrivalsToggle = (checked: boolean) => {
    const currentParams = new URLSearchParams(searchParams);
    if (checked) {
      currentParams.set('filter', 'new');
    } else {
      currentParams.delete('filter');
    }
    setSearchParams(currentParams);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Sync searchQuery input keyups to queries (debounced or on submit or live)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      currentParams.set('q', searchQuery.trim());
    } else {
      currentParams.delete('q');
    }
    setSearchParams(currentParams);
  };

  // Live search for optimal user feedback but synchronized with UI
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const currentParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      currentParams.set('q', val.trim());
    } else {
      currentParams.delete('q');
    }
    setSearchParams(currentParams);
  };

  // Core filter + sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // New only filter
    if (showNewOnly) {
      result = result.filter((p) => p.isNew);
    }

    // Sort options
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default ranking sorting
        break;
    }

    return result;
  }, [searchQuery, categoryFilter, showNewOnly, sortOption]);

  const categories = [
    { value: 'all', label: 'TẤT CẢ SẢN PHẨM' },
    { value: 'women', label: 'THỜI TRANG NỮ' },
    { value: 'men', label: 'THỜI TRANG NAM' },
    { value: 'shoes', label: 'GIÀY SNEAKERS' },
    { value: 'accessories', label: 'PHỤ KIỆN CAO CẤP' },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner header title */}
        <SectionTitle
          title="The Aura Catalog"
          subtitle="Tủ đồ Thượng Hạng thời thượng"
        />

        {/* Filters and Controls header card */}
        <div className="bg-white border border-neutral-100 p-6 shadow-sm mb-8 space-y-6 rounded-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Live Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
              <input
                type="text"
                placeholder="Tìm sản phẩm (Áo phông, Váy, Giày bốt...)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/80 border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:outline-none rounded-none transition-all"
              />
              <Search className="absolute left-3 top-3 text-neutral-400" size={15} />
            </form>

            {/* Quick selectors bar: Grid Columns, Sort, Arrivals Checkbox */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
              
              {/* Checkbox New Arrivals */}
              <label className="flex items-center space-x-2 cursor-pointer select-none py-2 px-3 border border-neutral-150 rounded-sm hover:border-neutral-900 transition-colors">
                <input
                  type="checkbox"
                  checked={showNewOnly}
                  onChange={(e) => handleNewArrivalsToggle(e.target.checked)}
                  className="rounded-none border-neutral-300 text-neutral-950 focus:ring-0 cursor-pointer h-3.5 w-3.5 focus:outline-none"
                />
                <span className="font-medium text-neutral-700">Chỉ mẫu mới nhất (New)</span>
              </label>

              {/* Sorting Select dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-neutral-450 font-medium whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-neutral-55 border border-neutral-200 text-neutral-800 text-xs py-2 px-3 focus:outline-none focus:border-neutral-950 rounded-md cursor-pointer"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Được ưa chuộng (Rating)</option>
                </select>
              </div>

              {/* Grid Column Selector on Desktop */}
              <div className="hidden lg:flex items-center gap-1.5 border-l border-neutral-200 pl-4 py-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 rounded-sm transition-colors ${
                    gridCols === 3 ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'
                  }`}
                  title="3 Cột"
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 rounded-sm transition-colors ${
                    gridCols === 4 ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'
                  }`}
                  title="4 Cột"
                >
                  <Grid3X3 size={16} />
                </button>
              </div>

            </div>

          </div>

          {/* Category Tabs inside panel */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {categories.map((cat) => {
                const isActive = categoryFilter === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`px-4 py-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-sm ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Dynamic products total label & Reset link */}
        <div className="flex items-center justify-between mb-6 text-xs text-neutral-500">
          <span>Tìm thấy <strong>{filteredAndSortedProducts.length}</strong> sản phẩm hoàn mỹ</span>
          {(searchQuery || categoryFilter !== 'all' || showNewOnly || sortOption !== 'default') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1.5 font-semibold text-neutral-900 hover:underline transition"
            >
              <RotateCcw size={12} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Grid display products container */}
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              layout
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
              } gap-8`}
            >
              {filteredAndSortedProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-neutral-100 text-center py-20 px-4 min-h-[350px] flex flex-col items-center justify-center rounded-sm"
            >
              <SlidersHorizontal className="text-neutral-300 mb-4" size={40} />
              <h3 className="text-lg font-sans font-medium text-neutral-800 mb-2">Xin lỗi, không có kết quả phù hợp</h3>
              <p className="text-xs text-neutral-450 max-w-sm mb-6 leading-relaxed">
                Chúng tôi không tìm thấy mặt hàng thời trang nào trùng khớp với lựa chọn lọc hiện tại của bạn. Vui lòng giảm nhẹ tiêu chí tìm kiếm.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-neutral-950 text-white py-3 px-6 text-xs uppercase tracking-widest font-bold hover:bg-neutral-850 transition rounded-sm shadow-sm"
              >
                Đặt lại bộ lọc
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
