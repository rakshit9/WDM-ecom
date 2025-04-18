// const products = Array.from({ length: 70 }, (_, index) => ({
//     id: index + 1,
//     name: `Product ${index + 1}`,
//     brand: `Brand ${String.fromCharCode(65 + (index % 3))}`, // Alternates between Brand A, B, C
//     price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
//     description: "High-quality product with great performance.",
//     availability: index % 5 === 0 ? "Out of Stock" : index % 3 === 0 ? "Limited Stock" : "In Stock",
//     specialOffer: index % 4 === 0 ? "10% Off" : index % 6 === 0 ? "Buy 1 Get 1 Free" : null,
//     image: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    // placeholderImages :[
    //   "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    //   "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    //   "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    //   "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",

    // ]
//   }));


// export default products

const productNames = [
  "Fresh Bananas", "Organic Apples", "Strawberries", "Blueberries", "Ripe Mangoes", 
  "Seedless Grapes", "Avocados", "Watermelon", "Oranges", "Lemons",
  "Broccoli", "Carrots", "Spinach", "Lettuce", "Tomatoes",
  "Onions", "Bell Peppers", "Potatoes", "Sweet Corn", "Cucumbers",
  "Whole Milk", "Cheddar Cheese", "Greek Yogurt", "Almond Milk", "Butter",
  "Eggs (Dozen)", "Chicken Breast", "Ground Beef", "Salmon Fillet", "Shrimp",
  "Rice (5 lbs)", "Pasta (Spaghetti)", "Whole Wheat Bread", "Tortilla Wraps", "Peanut Butter",
  "Nutella", "Honey", "Maple Syrup", "Oats", "Corn Flakes",
  "Coca Cola (2L)", "Pepsi (2L)", "Tropicana Orange Juice", "Nestlé Pure Life Water", "Red Bull Energy Drink",
  "Potato Chips (Lay’s)", "Doritos Nacho Cheese", "Pringles (Sour Cream)", "Popcorn (Microwave)", "Chocolate Cookies",
  "Heinz Tomato Ketchup", "Mayonnaise", "Mustard", "Soy Sauce", "Hot Sauce",
  "Olive Oil", "Sunflower Oil", "Vegetable Oil", "Balsamic Vinegar", "Apple Cider Vinegar",
  "Canned Tuna", "Black Beans", "Lentils", "Chickpeas", "Green Peas",
  "Dark Chocolate Bar", "Ice Cream (Vanilla)", "Cup Noodles", "Trail Mix", "Protein Bar"
];

const brandNames = [
  "Dole", "Tropicana", "Nestlé", "Lay’s", "Heinz", "Kellogg’s", "Coca-Cola", "Pepsi", "Red Bull",
  "Hellmann’s", "Barilla", "McCormick", "Hershey's", "Quaker", "Blue Diamond", "Planters", "Jif",
  "Chobani", "Organic Valley", "Silk", "Almond Breeze", "Sargento", "Land O’Lakes", "Perdue", "Tyson",
  "Ghirardelli", "Häagen-Dazs", "Ben & Jerry's", "Campbell's", "Hunt’s", "Bush’s Beans", "Nature Valley",
  "Kirkland", "Trader Joe’s", "365 Whole Foods", "Great Value", "Sam’s Choice", "Sprouts", "Simply Organic"
];

// Generate 70 Products
const products = Array.from({ length: 70 }, (_, index) => ({
  id: index + 1,
  name: productNames[index % productNames.length], // Cycle through product names
  brand: brandNames[index % brandNames.length], // Cycle through brand names
  price: (Math.random() * 19 + 1).toFixed(2), // Random price between $1 - $20
  description: "Fresh, high-quality grocery product sourced from trusted farms and brands.",
  availability: index % 5 === 0 ? "Out of Stock" : index % 3 === 0 ? "Limited Stock" : "In Stock",
  specialOffer: index % 4 === 0 ? "10% Off" : index % 6 === 0 ? "Buy 1 Get 1 Free" : null,
  image: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
  placeholderImages :[
    "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
    "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",

  ]
}));

export default products;
