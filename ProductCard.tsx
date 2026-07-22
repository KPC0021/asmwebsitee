import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product, formatPrice } from '../data/products';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { ShoppingBag, Eye, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartAndAuth();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-neutral-100 flex flex-col h-full rounded-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Badge items */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-semibold py-1 px-2.5 rounded-none">
            New
          </span>
        )}
        {product.isFeatured && !product.isNew && (
          <span className="bg-[#ede7e3] text-neutral-800 text-[10px] uppercase tracking-wider font-semibold py-1 px-2.5 rounded-none">
            Featured
          </span>
        )}
      </div>

      {/* Image container */}
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden">
        {/* Wishlist toggle button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-sm border border-neutral-100 transition-all active:scale-90"
          title={isLiked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={15} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Hover action bar - Clean minimalist slide-up design */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-3 right-3 hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-sm p-2 shadow-lg"
        >
          <div className="flex-1 flex flex-col">
            {/* Quick Size selection inside card */}
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium mb-1 pl-1">
              Quick Size
            </span>
            <div className="flex gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[10px] w-6 h-6 rounded-none flex items-center justify-center border transition-all ${
                    selectedSize === sz
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, selectedSize, 1)}
            aria-label="Add to cart"
            className="bg-neutral-950 hover:bg-neutral-800 text-white p-2.5 flex items-center justify-center transition-colors shadow-sm"
          >
            <ShoppingBag size={15} />
          </button>
        </motion.div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
            {product.category}
          </span>
          <div className="flex items-center text-amber-400 gap-0.5">
            <Star size={10} className="fill-current" />
            <span className="text-[10px] font-semibold text-neutral-600">{product.rating}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-normal text-neutral-900 tracking-tight group-hover:text-neutral-600 transition-colors mb-2 line-clamp-1">
          <Link to={`/product/${product.id}`} className="focus:outline-none">
            {product.name}
          </Link>
        </h3>

        {/* Sizes inline for mobile */}
        <div className="md:hidden flex gap-1 mb-2">
          {product.sizes.slice(0, 4).map((sz) => (
            <span key={sz} className="text-[9px] text-neutral-400 border border-neutral-105 px-1 font-mono">
              {sz}
            </span>
          ))}
          {product.sizes.length > 4 && <span className="text-[9px] text-neutral-450 font-mono">+</span>}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-neutral-50">
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => addToCart(product, selectedSize, 1)}
              className="bg-neutral-950 text-white p-1.5 rounded-sm hover:bg-neutral-800"
              title="Thêm vào giỏ"
            >
              <ShoppingBag size={12} />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="border border-neutral-200 text-neutral-700 p-1.5 rounded-sm hover:border-neutral-900 hover:text-neutral-900"
              title="Xem chi tiết"
            >
              <Eye size={12} />
            </Link>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="hidden md:flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            Details <Eye size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
