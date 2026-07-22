export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'women' | 'men' | 'shoes' | 'accessories';
  price: number; // in VND
  image: string;
  description: string;
  sizes: string[];
  rating: number;
  isFeatured: boolean;
  isNew: boolean;
}

export const initialReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Minh Anh',
    userEmail: 'minhanh@gmail.com',
    rating: 5,
    comment: 'Chất lụa siêu mềm mịn, mặc lên tôn dáng lịch sự vô cùng. Sẽ ủng hộ shop nhiều hơn!',
    date: '2026-05-10T14:20:00Z',
  },
  {
    id: 'r2',
    productId: 'p1',
    userName: 'Trần Hoàng',
    userEmail: 'hoangtran@gmail.com',
    rating: 4,
    comment: 'Áo đẹp chuẩn form, đóng gói sang trọng như quà tặng.',
    date: '2026-05-12T09:15:00Z',
  },
  {
    id: 'r3',
    productId: 'p2',
    userName: 'Thùy Dung',
    userEmail: 'thuydung@gmail.com',
    rating: 5,
    comment: 'Váy linen mặc hè siêu thoáng mát, đường may vô cùng chỉn chu!',
    date: '2026-06-01T16:45:00Z',
  }
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Classic Silk Shirt",
    category: "men",
    price: 890000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    description: "Được dệt từ lụa tơ tằm thượng hạng, mang lại cảm giác mềm mại tuyệt đối và vẻ ngoài lịch lãm, sang bừng mọi góc nhìn. Thiết kế cổ điển tôn dáng, thích hợp cho các buổi tiệc tối hoặc họp hành quan trọng.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    isFeatured: true,
    isNew: true
  },
  {
    id: "p2",
    name: "Linen Summer Dress",
    category: "women",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    description: "Váy linen mùa hè phóng khoáng với những đường dập ly tinh tế. Chất liệu linen tự nhiên thoáng mát, giúp nàng luôn tự tin tinh khôi dưới nắng hè rực rỡ.",
    sizes: ["S", "M", "L"],
    rating: 4.6,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p3",
    name: "Minimalist Essential Tee",
    category: "men",
    price: 350000,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "Chiếc áo phông trắng cơ bản được tinh chỉnh từ chất liệu cotton hữu cơ 100%. Phom dáng thoải mái bền bỉ sau nhiều lần giặt, là mảnh ghép không thể thiếu của tủ đồ tối giản.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    isFeatured: false,
    isNew: true
  },
  {
    id: "p4",
    name: "Classic Trench Coat",
    category: "women",
    price: 2450000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    description: "Áo măng tô dáng dài mang đậm hơi thở cổ điển quý tộc Anh. Khả năng chống thấm nhẹ, giữ ấm lý tưởng cùng đai thắt eo quyến rũ định hình tôn dáng hoàn hảo.",
    sizes: ["S", "M", "L"],
    rating: 5.0,
    isFeatured: true,
    isNew: true
  },
  {
    id: "p5",
    name: "Modern Slim-Fit Jeans",
    category: "men",
    price: 750000,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    description: "Quần jeans phom ôm thời thượng chế tác từ sợi denim co giãn nhẹ. Gam màu xanh chàm vintage nguyên bản dễ phối đồ và bền bỉ tối đa.",
    sizes: ["M", "L", "XL"],
    rating: 4.5,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p6",
    name: "Sleek Canvas Sneakers",
    category: "shoes",
    price: 1100000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    description: "Đôi sneakers đơn giản với đế cao su lưu hóa siêu êm chân. Phong cách năng động, thời thượng phù hợp cùng bạn đi khắp muôn nơi.",
    sizes: ["38", "39", "40", "41", "42"],
    rating: 4.7,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p7",
    name: "Leather Shoulder Handbag",
    category: "accessories",
    price: 1950000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    description: "Túi xách tay nữ chế tác thủ công từ da bê thật cao cấp. Thiết kế tối giản tinh tế đến từng đường vắt kim, khóa mạ vàng 18k mang lại vẻ quý phái sang trọng.",
    sizes: ["One Size"],
    rating: 4.9,
    isFeatured: true,
    isNew: true
  },
  {
    id: "p8",
    name: "Sleek Tortoise Sunglasses",
    category: "accessories",
    price: 450000,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    description: "Kính râm gọng đồi mồi sang trọng, tròng kính chống tia UV400 bảo vệ đôi mắt tuyệt đối. Thiết kế unisex thời thượng phù hợp mọi khuôn mặt.",
    sizes: ["One Size"],
    rating: 4.4,
    isFeatured: false,
    isNew: true
  },
  {
    id: "p9",
    name: "Oversized Wool Blazer",
    category: "women",
    price: 1650000,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
    description: "Áo Blazer dạ phom rộng chuẩn Hàn Quốc. Đường may sắc nét tỉ mỉ mang lại sự thanh lịch cho những buổi dạo phố, làm việc công sở thời thượng.",
    sizes: ["S", "M", "L"],
    rating: 4.7,
    isFeatured: false,
    isNew: true
  },
  {
    id: "p10",
    name: "Pleated Knit Skirt",
    category: "women",
    price: 680000,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    description: "Chân váy xếp ly len dệt kim mềm mại. Độ rủ tự nhiên thướt tha uyển chuyển theo từng bước chân của nàng.",
    sizes: ["S", "M"],
    rating: 4.5,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p11",
    name: "Urban Leather Jacket",
    category: "men",
    price: 2800000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    description: "Áo khoác da biker cá tính, thời thượng. Da PU cao cấp dày dặn chống xước nước, mang lại vẻ ngoài bụi bặm và chất lừ.",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p12",
    name: "Suede Chelsea Boots",
    category: "shoes",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
    description: "Giày Chelsea Boots da lộn cao cấp nhập khẩu. Phom dáng ôm cổ chân tuyệt đối giúp chân thon dài lịch lãm, phối jeans hay kaki cực đỉnh.",
    sizes: ["39", "40", "41", "42", "43"],
    rating: 4.9,
    isFeatured: false,
    isNew: true
  },
  {
    id: "p13",
    name: "Aura Chrono Gold Watch",
    category: "accessories",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    description: "Chiếc đồng hồ kim loại mạ vàng sang quý, mặt kính khoáng chống xước. Điểm nhấn hoàn hảo tôn vinh khí chất đỉnh cao của chủ nhân sở hữu.",
    sizes: ["One Size"],
    rating: 4.9,
    isFeatured: true,
    isNew: true
  },
  {
    id: "p14",
    name: "Minimalist Pearl Earrings",
    category: "accessories",
    price: 480000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    description: "Khuyên tai ngọc trai tự nhiên kết hợp bạc Ý 925 tinh xảo. Vẻ đẹp tối giản, trường tồn đem lại cho phái đẹp sự dịu dàng kiêu sa.",
    sizes: ["One Size"],
    rating: 4.6,
    isFeatured: false,
    isNew: false
  }
];

export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
