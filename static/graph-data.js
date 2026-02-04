// Product Relationship Data for Graph
const productRelationships = [
    // Breakfast Combos
    { product1: "Milk - Full Cream", product2: "Kelloggs Corn Flakes", weight: 10 },
    { product1: "Milk - Full Cream", product2: "Kelloggs Chocos", weight: 8 },
    { product1: "Milk - Toned", product2: "Oats - Quaker", weight: 9 },
    { product1: "Butter - Salted", product2: "Parle-G Biscuits", weight: 7 },
    
    // Cooking Combos
    { product1: "Onion - Red", product2: "Tomato", weight: 15 },
    { product1: "Onion - Red", product2: "Ginger", weight: 12 },
    { product1: "Onion - Red", product2: "Garlic", weight: 11 },
    { product1: "Tomato", product2: "Green Chili", weight: 10 },
    { product1: "Ginger", product2: "Garlic", weight: 13 },
    { product1: "Potato", product2: "Onion - Red", weight: 9 },
    { product1: "Carrot", product2: "Potato", weight: 8 },
    
    // Dal Combos
    { product1: "Moong Dal", product2: "Toor Dal", weight: 7 },
    { product1: "Toor Dal", product2: "Onion - Red", weight: 8 },
    { product1: "Moong Dal", product2: "Ginger", weight: 6 },
    { product1: "Chana Dal", product2: "Onion - Red", weight: 7 },
    
    // Snack Combos
    { product1: "Lays - Classic Salted", product2: "Lays - Magic Masala", weight: 6 },
    { product1: "Oreo - Original", product2: "Milk - Full Cream", weight: 11 },
    { product1: "Parle-G Biscuits", product2: "Milk - Toned", weight: 9 },
    { product1: "Dark Fantasy", product2: "Milk - Full Cream", weight: 8 },
    
    // Fruit Combos
    { product1: "Apple - Red", product2: "Banana", weight: 8 },
    { product1: "Orange", product2: "Apple - Red", weight: 7 },
    { product1: "Mango - Alphonso", product2: "Banana", weight: 6 },
    
    // Dairy Combos
    { product1: "Paneer", product2: "Tomato", weight: 10 },
    { product1: "Paneer", product2: "Onion - Red", weight: 9 },
    { product1: "Yogurt - Plain", product2: "Banana", weight: 7 },
    { product1: "Butter - Salted", product2: "Parle-G Biscuits", weight: 8 },
    
    // Chocolate Combos
    { product1: "Dairy Milk", product2: "Dairy Milk Silk", weight: 9 },
    { product1: "KitKat", product2: "Dairy Milk", weight: 7 },
    { product1: "Ferrero Rocher", product2: "Dairy Milk Silk", weight: 6 },
    
    // Cereal Combos
    { product1: "Kelloggs Corn Flakes", product2: "Kelloggs Chocos", weight: 8 },
    { product1: "Oats - Quaker", product2: "Banana", weight: 9 },
    { product1: "Granola - Mixed Nuts", product2: "Yogurt - Plain", weight: 10 },
    
    // Vegetable Combos
    { product1: "Bell Pepper - Red", product2: "Onion - Red", weight: 8 },
    { product1: "Mushroom", product2: "Bell Pepper - Red", weight: 7 },
    { product1: "Broccoli", product2: "Carrot", weight: 6 },
    { product1: "Spinach", product2: "Paneer", weight: 9 },
    
    // Additional relationships
    { product1: "Cucumber", product2: "Tomato", weight: 7 },
    { product1: "Lemon", product2: "Green Chili", weight: 6 },
    { product1: "Coconut", product2: "Ginger", weight: 5 },
    { product1: "Pumpkin", product2: "Onion - Red", weight: 6 },
    { product1: "Cauliflower", product2: "Potato", weight: 8 },
    { product1: "Eggplant", product2: "Tomato", weight: 7 },
    { product1: "Sweet Potato", product2: "Ginger", weight: 5 },
    { product1: "Cabbage", product2: "Carrot", weight: 6 },
    { product1: "Lettuce", product2: "Tomato", weight: 7 },
    { product1: "Zucchini", product2: "Tomato", weight: 6 },
];