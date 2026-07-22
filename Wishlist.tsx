import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { products } from '../data/products';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { ProductCard } from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useCartAndAuth();

  // Find products matching IDs in wishlist
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF9F6] py-12 min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="Danh Sách Yêu Thích"
          subtitle={`Những tuyệt phẩm thời trang nàng đang mê đắm (${wishlistProducts.length})`}
        />

        {wishlistProducts.length > 0 ? (
          <div className="mt-10 space-y-8">
            <div className="flex justify-end">
              <span className="text-xs text-neutral-500">
                Hiển thị {wishlistProducts.length} sản phẩm đã lưu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="relative group/wish">
                  <ProductCard product={product} />
                  
                  {/* Remove button overlaid on card */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 z-20 h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 text-neutral-500 rounded-full flex items-center justify-center shadow-md border border-neutral-200 transition-colors"
                    title="Bỏ khỏi danh sách yêu thích"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-100 p-12 text-center max-w-md mx-auto my-12 shadow-sm rounded-sm space-y-6"
          >
            <div className="h-16 w-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto border border-neutral-150">
              <Heart size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wider font-sans">
                Danh sách yêu thích trống
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Nàng chưa lưu sản phẩm nào vào bộ sưu tập cá nhân. Hãy khám phá và thả tim cho những trang phục thời thượng nhé!
              </p>
            </div>
            <Link
              to="/shop"
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-none inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span>Khám Phá Cửa Hàng</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
};
