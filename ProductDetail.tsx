import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, formatPrice, initialReviews, Review } from '../data/products';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { ProductCard } from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';
import { Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus, ShoppingBag, Share2, Heart, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast, user, toggleWishlist, isInWishlist } = useCartAndAuth();

  // Find current product
  const product = products.find((p) => p.id === id);

  // States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Reviews state
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [commentError, setCommentError] = useState<string>('');

  const isLiked = product ? isInWishlist(product.id) : false;

  // Load reviews on product mount
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'instant' as any });

      // Load reviews from localStorage
      try {
        const stored = localStorage.getItem('fashion_aura_reviews');
        const allLocalReviews: Review[] = stored ? JSON.parse(stored) : [];
        const combined = [
          ...initialReviews.filter((r) => r.productId === product.id),
          ...allLocalReviews.filter((r) => r.productId === product.id),
        ];
        setProductReviews(combined);
      } catch (e) {
        console.error(e);
        setProductReviews(initialReviews.filter((r) => r.productId === product.id));
      }
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-sans text-neutral-800">Sản phẩm không tồn tại</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Mặt hàng thời trang bạn tìm kiếm có thể đã tạm thời hết hàng hoặc gỡ bỏ khỏi tủ đồ sưu tập.
        </p>
        <Link
          to="/shop"
          className="bg-neutral-950 text-white uppercase tracking-widest text-xs font-bold py-3 px-6 rounded-sm inline-block"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  // Get 4 related products (excluding current, prefer same category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showToast('Đã sao chép liên kết sản phẩm vào khay nhớ tạm!', 'success');
  };

  // Calculate dynamic average rating and reviews count
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating.toString();

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Vui lòng đăng nhập để viết đánh giá sản phẩm!', 'info');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('Vui lòng nhập cảm nhận của nàng về sản phẩm');
      return;
    }

    setCommentError('');

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      userName: user.fullName,
      userEmail: user.email,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('fashion_aura_reviews');
      const allLocalReviews: Review[] = stored ? JSON.parse(stored) : [];
      const updatedLocal = [newRev, ...allLocalReviews];
      localStorage.setItem('fashion_aura_reviews', JSON.stringify(updatedLocal));

      setProductReviews((prev) => [newRev, ...prev]);
      setNewComment('');
      setNewRating(5);
      showToast('Cảm ơn nàng đã chia sẻ đánh giá quý báu!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#FAF9F6] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors mb-8 focus:outline-none"
        >
          <ArrowLeft size={14} />
          <span>Quay lại Bộ Sưu Tập</span>
        </Link>

        {/* Product presentation board layout */}
        <div className="bg-white border border-neutral-100 p-6 md:p-12 shadow-sm rounded-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left side: Premium Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[3/4] bg-neutral-50 overflow-hidden rounded-sm w-full shadow-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-none z-10">
                  New Arrival
                </span>
              )}
            </motion.div>

            {/* Right side: Detailed Information */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Category & Stars */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                    Category / {product.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(Number(averageRating)) ? 'fill-current' : 'text-neutral-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-neutral-600">({averageRating})</span>
                    <span className="text-xs text-neutral-400">• {productReviews.length} đánh giá</span>
                  </div>
                </div>

                {/* Name */}
                <h1 className="text-2.5xl md:text-3.5xl font-sans font-light text-neutral-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="text-2xl font-bold text-neutral-950 font-sans tracking-tight">
                  {formatPrice(product.price)}
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed pt-2">
                  {product.description}
                </p>

                {/* Size Selection pills */}
                <div className="space-y-2.5 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="uppercase tracking-wider font-semibold text-neutral-500">Lựa chọn Kích Thước (Size)</span>
                    <span className="text-neutral-400 underline cursor-pointer hover:text-neutral-900">Bảng quy đổi size</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => {
                      const isActive = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-[48px] h-11 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-all ${
                            isActive
                              ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm font-bold'
                              : 'border-neutral-200 bg-white hover:border-neutral-450 text-neutral-600 hover:text-neutral-950'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="space-y-2.5 pt-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 block">Số lượng mua</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-neutral-200 bg-neutral-50 h-11">
                      <button
                        onClick={handleDecrement}
                        className="w-11 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors focus:outline-none"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-12 text-center text-xs font-bold text-neutral-800 select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="w-11 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors focus:outline-none"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons (Add to cart, Wishlist, Share) */}
              <div className="pt-8 border-t border-neutral-100 mt-8 space-y-4">
                <div className="flex gap-4">
                  {/* MAIN Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow bg-neutral-950 hover:bg-neutral-800 text-white font-sans text-xs uppercase tracking-widest font-bold py-4.5 px-6 rounded-none flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                  >
                    <ShoppingBag size={16} />
                    <span>Thêm vào giỏ hàng ngay</span>
                  </button>

                  {/* Like button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`aspect-square w-14 border flex items-center justify-center transition-colors ${
                      isLiked
                        ? 'bg-red-50 text-red-500 border-red-200'
                        : 'border-neutral-250 text-neutral-600 hover:border-neutral-950'
                    }`}
                    title={isLiked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="aspect-square w-14 border border-neutral-250 text-neutral-600 hover:text-neutral-950 flex items-center justify-center hover:border-neutral-950"
                    title="Chia sẻ sản phẩm"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Sincere badges */}
                <div className="grid grid-cols-2 gap-4 text-[10px] text-neutral-500 font-sans pt-4">
                  <div className="flex items-center space-x-2">
                    <Truck size={14} className="text-neutral-400 shrink-0" />
                    <span>Giao hàng miễn phí đơn {formatPrice(1000000)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={14} className="text-neutral-400 shrink-0" />
                    <span>Cam kết 100% chính hãng Aura</span>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-neutral-100 p-6 md:p-12 shadow-sm rounded-sm mb-16 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-100">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                CUSTOMER FEEDBACK
              </span>
              <h2 className="text-xl md:text-2xl font-sans font-medium text-neutral-900 tracking-tight">
                Đánh Giá Từ Khách Hàng ({productReviews.length})
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-neutral-50 px-5 py-3 rounded-sm border border-neutral-100">
              <span className="text-2xl font-bold text-neutral-900">{averageRating}</span>
              <div className="space-y-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(Number(averageRating)) ? 'fill-current' : 'text-neutral-200'}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-500 font-medium block">
                  Dựa trên {productReviews.length} lượt đánh giá
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-6">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-neutral-50/70 border border-neutral-100 rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{rev.userName}</h4>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(rev.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.rating ? 'fill-current' : 'text-neutral-200'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 text-xs italic">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ nhé!
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-neutral-50 border border-neutral-100 p-6 rounded-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Viết Đánh Giá Của Bạn
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Chia sẻ nhận xét chân thực để giúp cộng đồng tín đồ thời trang Fashion Aura.
                </p>
              </div>

              {user ? (
                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 block">
                      Mức độ hài lòng
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={20}
                            className={star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-neutral-500 font-bold ml-2">
                        {newRating === 5 ? 'Tuyệt vời (5/5)' : `${newRating}/5 sao`}
                      </span>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 block">
                      Nội dung đánh giá
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Cảm nhận về chất liệu, kiểu dáng, size áo, trải nghiệm mặc..."
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                        setCommentError('');
                      }}
                      className="w-full p-3 text-xs bg-white border border-neutral-200 focus:border-neutral-900 focus:outline-none rounded-none"
                    />
                    {commentError && (
                      <p className="text-[10px] text-red-500 font-medium">{commentError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-none flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Send size={13} />
                    <span>Gửi Đánh Giá</span>
                  </button>
                </form>
              ) : (
                <div className="bg-white p-5 border border-neutral-200 text-center space-y-3">
                  <p className="text-xs text-neutral-600">
                    Bạn cần đăng nhập tài khoản để có thể thực hiện gửi đánh giá sản phẩm.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-none hover:bg-neutral-800 transition-colors"
                  >
                    <UserIcon size={13} />
                    <span>Đăng Nhập Ngay</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="pt-8 bg-transparent">
          <SectionTitle
            title="Sản Phẩm Tương Tự"
            subtitle="Có thể nàng cũng say đắm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
