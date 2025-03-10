const products = Array.from({ length: 70 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    brand: `Brand ${String.fromCharCode(65 + (index % 3))}`, // Alternates between Brand A, B, C
    price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
    description: "High-quality product with great performance.",
    availability: index % 5 === 0 ? "Out of Stock" : index % 3 === 0 ? "Limited Stock" : "In Stock",
    specialOffer: index % 4 === 0 ? "10% Off" : index % 6 === 0 ? "Buy 1 Get 1 Free" : null,
    image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    placeholderImages :[
      "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=3087&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536632856133-3a3441454dd5?q=80&w=3087&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586861642026-74a6da22a3cd?q=80&w=3088&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=3085&auto=format&fit=crop",
    ]
  }));


export default products