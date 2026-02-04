// Shopping Cart with Queue, Graph, BST, and Linked List

// ============================================
// DATA STRUCTURES
// ============================================

// Node class for Singly Linked List
class Node {
    constructor(product) {
        this.product = product;
        this.next = null;
    }
}

// Singly Linked List for Shopping Cart
class ShoppingCart {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    addItem(product) {
        const newNode = new Node(product);
        // STACK (LIFO): push new items to the TOP of the cart (head of linked list)
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return true;
    }

    deleteItem(productId) {
        if (!this.head) return false;
        if (this.head.product.id === productId) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        let current = this.head;
        while (current.next) {
            if (current.next.product.id === productId) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    updateQuantity(productId, newQuantity) {
        let current = this.head;
        while (current) {
            if (current.product.id === productId) {
                if (newQuantity > 0) {
                    current.product.quantity = newQuantity;
                    return true;
                }
            }
            current = current.next;
        }
        return false;
    }

    getAllItems() {
        const items = [];
        let current = this.head;
        while (current) {
            items.push(current.product);
            current = current.next;
        }
        return items;
    }

    clear() {
        this.head = null;
        this.size = 0;
    }

    getSize() {
        return this.size;
    }

    calculateTotals() {
        let subtotal = 0;
        let current = this.head;
        while (current) {
            subtotal += current.product.price * current.product.quantity;
            current = current.next;
        }
        const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 100) : 0;
        const tax = subtotal * 0.05;
        const discount = subtotal * 0.10;
        const total = subtotal + shipping + tax - discount;
        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2)
        };
    }
}

// BST Node
class BSTNode {
    constructor(product) {
        this.product = product;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree for Product Catalog
class ProductBST {
    constructor() {
        this.root = null;
    }

    insert(product) {
        const newNode = new BSTNode(product);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        this._insertNode(this.root, newNode);
    }

    _insertNode(node, newNode) {
        if (newNode.product.price < node.product.price) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }
}

// Queue for Order Processing
class OrderQueue {
    constructor() {
        this.items = [];
        this.front = 0;
        this.rear = 0;
    }
    
    enqueue(order) {
        this.items[this.rear] = order;
        this.rear++;
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        const order = this.items[this.front];
        delete this.items[this.front];
        this.front++;
        return order;
    }
    
    isEmpty() {
        return this.front === this.rear;
    }
    
    size() {
        return this.rear - this.front;
    }
    
    getPosition(orderId) {
        for (let i = this.front; i < this.rear; i++) {
            if (this.items[i].orderId === orderId) {
                return i - this.front + 1;
            }
        }
        return -1;
    }
    
    peek() {
        return this.isEmpty() ? null : this.items[this.front];
    }
    
    getAllOrders() {
        const orders = [];
        for (let i = this.front; i < this.rear; i++) {
            orders.push(this.items[i]);
        }
        return orders;
    }
}

// Graph for Product Recommendations
class ProductGraph {
    constructor() {
        this.adjacencyList = new Map();
    }
    
    addNode(productName) {
        if (!this.adjacencyList.has(productName)) {
            this.adjacencyList.set(productName, []);
        }
    }
    
    addEdge(product1, product2, weight) {
        if (!this.adjacencyList.has(product1)) {
            this.addNode(product1);
        }
        this.adjacencyList.get(product1).push({
            product: product2,
            weight: weight
        });
        
        if (!this.adjacencyList.has(product2)) {
            this.addNode(product2);
        }
        this.adjacencyList.get(product2).push({
            product: product1,
            weight: weight
        });
    }
    
    getRecommendations(productName, limit = 5) {
        if (!this.adjacencyList.has(productName)) {
            return [];
        }
        
        const neighbors = this.adjacencyList.get(productName);
        neighbors.sort((a, b) => b.weight - a.weight);
        return neighbors.slice(0, limit);
    }
    
    getMultiProductRecommendations(productNames, limit = 5) {
        const recommendationMap = new Map();
        
        productNames.forEach(productName => {
            if (this.adjacencyList.has(productName)) {
                const neighbors = this.adjacencyList.get(productName);
                
                neighbors.forEach(neighbor => {
                    if (!productNames.includes(neighbor.product)) {
                        const currentWeight = recommendationMap.get(neighbor.product) || 0;
                        recommendationMap.set(neighbor.product, currentWeight + neighbor.weight);
                    }
                });
            }
        });
        
        const recommendations = Array.from(recommendationMap.entries())
            .map(([product, weight]) => ({ product, weight }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, limit);
        
        return recommendations;
    }

    getEdgeWeight(product1, product2) {
        const neighbors = this.adjacencyList.get(product1);
        if (!neighbors) return 0;
        const edge = neighbors.find(n => n.product === product2);
        return edge ? edge.weight : 0;
    }
}

// ============================================
// INITIALIZE DATA STRUCTURES
// ============================================

const cart = new ShoppingCart();
const orderQueue = new OrderQueue();
const productGraph = new ProductGraph();
let productIdCounter = 1;
let orderIdCounter = 1;
let selectedProductIndex = -1;
let currentOrderId = null;
let orderHistory = [];
let processingInterval = null;

// Build product graph from relationships
const productRelationships = [
    { product1: "Milk - Full Cream", product2: "Kelloggs Corn Flakes", weight: 10 },
    { product1: "Milk - Full Cream", product2: "Kelloggs Chocos", weight: 8 },
    { product1: "Butter - Salted", product2: "Parle-G Biscuits", weight: 7 },
    { product1: "Onion - Red", product2: "Tomato", weight: 15 },
    { product1: "Onion - Red", product2: "Ginger", weight: 12 },
    { product1: "Onion - Red", product2: "Garlic", weight: 11 },
    { product1: "Tomato", product2: "Green Chili", weight: 10 },
    { product1: "Ginger", product2: "Garlic", weight: 13 },
    { product1: "Potato", product2: "Onion - Red", weight: 9 },
    { product1: "Moong Dal", product2: "Toor Dal", weight: 7 },
    { product1: "Oreo - Original", product2: "Milk - Full Cream", weight: 11 },
    { product1: "Parle-G Biscuits", product2: "Milk - Toned", weight: 9 },
    { product1: "Apple - Red", product2: "Banana", weight: 8 },
    { product1: "Orange", product2: "Apple - Red", weight: 7 },
    { product1: "Paneer", product2: "Tomato", weight: 10 },
    { product1: "Paneer", product2: "Onion - Red", weight: 9 },
    { product1: "Yogurt - Plain", product2: "Banana", weight: 7 },
    { product1: "Dairy Milk", product2: "Dairy Milk Silk", weight: 9 },
    { product1: "Oats - Quaker", product2: "Banana", weight: 9 },
    { product1: "Bell Pepper - Red", product2: "Onion - Red", weight: 8 },
    { product1: "Mushroom", product2: "Bell Pepper - Red", weight: 7 },
    { product1: "Spinach", product2: "Paneer", weight: 9 },
    { product1: "Cucumber", product2: "Tomato", weight: 7 },
    { product1: "Lemon", product2: "Green Chili", weight: 6 },
    { product1: "Cauliflower", product2: "Potato", weight: 8 },
];

// Initialize graph
productRelationships.forEach(rel => {
    productGraph.addEdge(rel.product1, rel.product2, rel.weight);
});

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('ordersPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';
    document.getElementById(pageName + 'Page').style.display = 'block';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
    
    if (pageName === 'orders') {
        updateOrderTrackingPage();
    }
}

function navigateToCart() {
    showPage('cart');
}

// ============================================
// CATEGORY & BST FUNCTIONS
// ============================================

function getCategories() {
    const categoryMap = new Map();
    foodDatabase.forEach(item => {
        if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, []);
        }
        categoryMap.get(item.category).push(item);
    });
    return categoryMap;
}

function getCategoryEmoji(category) {
    const emojiMap = {
        'Fruits': '🍎', 'Vegetables': '🥕', 'Dairy': '🥛', 'Dals': '🌾',
        'Chips': '🥔', 'Cookies': '🍪', 'Chocolates': '🍫', 'Cereals': '🥣'
    };
    return emojiMap[category] || '🛒';
}

function openCategoryModal() {
    const modal = document.getElementById('categoryModal');
    const categoryGrid = document.getElementById('categoryGrid');
    const categories = getCategories();
    
    categoryGrid.innerHTML = '';
    categories.forEach((products, categoryName) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">${getCategoryEmoji(categoryName)}</div>
            <div class="category-name">${categoryName}</div>
            <div class="category-count">${products.length} items</div>
        `;
        card.addEventListener('click', () => {
            openBSTModal(categoryName, products);
            closeCategoryModal();
        });
        categoryGrid.appendChild(card);
    });
    
    modal.classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

function openBSTModal(categoryName, products) {
    const modal = document.getElementById('bstModal');
    const container = document.getElementById('bstVisualization');
    document.getElementById('bstCategoryName').textContent = categoryName;
    
    const bst = new ProductBST();
    products.forEach(product => bst.insert(product));
    
    if (!bst.root) {
        container.innerHTML = `
            <div class="bst-empty">
                <i class="fas fa-box-open"></i>
                <p>No products in this category</p>
            </div>
        `;
    } else {
        container.innerHTML = '';
        const treeDiv = document.createElement('div');
        treeDiv.className = 'bst-tree';
        renderBSTNode(bst.root, treeDiv);
        container.appendChild(treeDiv);
    }
    
    modal.classList.add('show');
}

function closeBSTModal() {
    document.getElementById('bstModal').classList.remove('show');
}

function renderBSTNode(root, container) {
    if (!root) return;

    const levels = [];
    const queue = [{node: root, level: 0, position: 'root'}];
    
    while (queue.length > 0) {
        const {node, level, position} = queue.shift();
        if (!levels[level]) levels[level] = [];
        levels[level].push({node, position});
        
        if (node.left) queue.push({node: node.left, level: level + 1, position: 'left'});
        if (node.right) queue.push({node: node.right, level: level + 1, position: 'right'});
    }
    
    levels.forEach((levelNodes) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'bst-level';
        levelDiv.style.marginBottom = '4rem';
        
        levelNodes.forEach(({node, position}) => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = `bst-node ${position}`;
            nodeDiv.style.margin = '0 1.5rem';
            nodeDiv.innerHTML = `
                <div class="bst-node-emoji">${node.product.emoji}</div>
                <div class="bst-node-name">${node.product.name}</div>
                <div class="bst-node-price">₹${node.product.price}</div>
            `;
            nodeDiv.addEventListener('click', () => addProductFromBST(node.product));
            levelDiv.appendChild(nodeDiv);
        });
        
        container.appendChild(levelDiv);
    });
}

function addProductFromBST(dbProduct) {
    const product = {
        id: productIdCounter++,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: 1,
        emoji: dbProduct.emoji,
        category: dbProduct.category
    };
    
    cart.addItem(product);
    renderCart();
    updateRecommendations();
    showToast(`✅ ${dbProduct.name} added to cart!`);
    closeBSTModal();
    showPage('cart');
}

// ============================================
// AUTO-COMPLETE SEARCH
// ============================================

function setupAutoComplete() {
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    autocompleteContainer.id = 'autocompleteContainer';
    productNameInput.parentNode.appendChild(autocompleteContainer);

    productNameInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        autocompleteContainer.innerHTML = '';
        selectedProductIndex = -1;

        if (searchTerm.length === 0) {
            autocompleteContainer.style.display = 'none';
            productPriceInput.value = '';
            return;
        }

        const matches = foodDatabase.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        ).slice(0, 8);

        if (matches.length > 0) {
            autocompleteContainer.style.display = 'block';
            matches.forEach((item) => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.className = 'autocomplete-item';
                suggestionDiv.innerHTML = `
                    <span class="item-emoji">${item.emoji}</span>
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-category">${item.category}</span>
                    </div>
                    <span class="item-price">₹${item.price}</span>
                `;
                suggestionDiv.addEventListener('click', () => selectProduct(item));
                autocompleteContainer.appendChild(suggestionDiv);
            });
        } else {
            autocompleteContainer.style.display = 'none';
        }
    });

    productNameInput.addEventListener('keydown', function(e) {
        const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedProductIndex = Math.min(selectedProductIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedProductIndex = Math.max(selectedProductIndex - 1, -1);
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedProductIndex >= 0 && items[selectedProductIndex]) {
                items[selectedProductIndex].click();
            }
        } else if (e.key === 'Escape') {
            autocompleteContainer.style.display = 'none';
            selectedProductIndex = -1;
        }
    });

    document.addEventListener('click', function(e) {
        if (!productNameInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
            autocompleteContainer.style.display = 'none';
            selectedProductIndex = -1;
        }
    });
}

function updateSelection(items) {
    items.forEach((item, index) => {
        if (index === selectedProductIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

function selectProduct(item) {
    document.getElementById('productName').value = item.name;
    document.getElementById('productPrice').value = item.price;
    document.getElementById('autocompleteContainer').style.display = 'none';
    selectedProductIndex = -1;
    document.getElementById('productQuantity').focus();
}

function isProductInDatabase(productName) {
    return foodDatabase.some(item => 
        item.name.toLowerCase() === productName.toLowerCase()
    );
}

// ============================================
// CART FUNCTIONS
// ============================================

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const items = cart.getAllItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p class="empty-subtitle">Add items to get started!</p>
            </div>
        `;
        updateSummary();
        updateRecommendations();
        return;
    }

    cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="product-info col-product">
                <div class="product-image">${item.emoji}</div>
                <div class="product-details">
                    <h4>${item.name}</h4>
                    <p>${item.category} • ID: #${item.id}</p>
                </div>
            </div>
            <div class="product-price col-price">₹${item.price.toFixed(2)}</div>
            <div class="col-quantity">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})" ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="item-subtotal col-subtotal">₹${(item.price * item.quantity).toFixed(2)}</div>
            <div class="col-action">
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateSummary();
    updateRecommendations();
}

function updateSummary() {
    const totals = cart.calculateTotals();
    const size = cart.getSize();

    document.getElementById('cartCount').textContent = size;
    document.getElementById('summaryItems').textContent = size;
    document.getElementById('summarySubtotal').textContent = `₹${totals.subtotal}`;
    document.getElementById('summaryShipping').textContent = `₹${totals.shipping}`;
    document.getElementById('summaryTax').textContent = `₹${totals.tax}`;
    document.getElementById('summaryDiscount').textContent = `-₹${totals.discount}`;
    document.getElementById('summaryTotal').textContent = `₹${totals.total}`;

    const shippingElement = document.getElementById('summaryShipping');
    if (parseFloat(totals.shipping) === 0 && parseFloat(totals.subtotal) > 0) {
        shippingElement.innerHTML = `<span style="color: var(--primary-color); font-weight: 600;">FREE</span>`;
    }
}

function increaseQuantity(productId) {
    const items = cart.getAllItems();
    const item = items.find(i => i.id === productId);
    if (item) {
        cart.updateQuantity(productId, item.quantity + 1);
        renderCart();
        showToast(`📈 Quantity increased!`);
    }
}

function decreaseQuantity(productId) {
    const items = cart.getAllItems();
    const item = items.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        cart.updateQuantity(productId, item.quantity - 1);
        renderCart();
        showToast(`📉 Quantity decreased!`);
    }
}

function deleteItem(productId) {
    if (confirm('Are you sure you want to remove this item?')) {
        cart.deleteItem(productId);
        renderCart();
        showToast(`🗑️ Item removed from cart!`);
    }
}

// ============================================
// RECOMMENDATIONS (GRAPH)
// ============================================

function updateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    const cartItems = cart.getAllItems();
    
    if (cartItems.length === 0) {
        recommendationsList.innerHTML = '<p class="no-recommendations">Add items to see recommendations!</p>';
        return;
    }
    
    const cartProductNames = cartItems.map(item => item.name);
    const recommendations = productGraph.getMultiProductRecommendations(cartProductNames, 3);
    
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<p class="no-recommendations">No recommendations available</p>';
        return;
    }
    
    recommendationsList.innerHTML = recommendations.map(rec => {
        const productData = foodDatabase.find(p => p.name === rec.product);
        if (!productData) return '';
        
        return `
            <div class="recommendation-card" onclick="addRecommendedProduct('${rec.product}')">
                <div class="rec-emoji">${productData.emoji}</div>
                <div class="rec-details">
                    <div class="rec-name">${rec.product}</div>
                    <div class="rec-reason">Often bought together</div>
                    <div class="rec-strength">Strength: ${rec.weight}</div>
                </div>
                <div class="rec-price">₹${productData.price}</div>
                <button class="rec-add-btn" onclick="event.stopPropagation(); addRecommendedProduct('${rec.product}')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }).join('');
}

function addRecommendedProduct(productName) {
    const productData = foodDatabase.find(p => p.name === productName);
    if (!productData) return;
    
    const product = {
        id: productIdCounter++,
        name: productData.name,
        price: productData.price,
        quantity: 1,
        emoji: productData.emoji,
        category: productData.category
    };
    
    cart.addItem(product);
    renderCart();
    showToast(`✅ ${productData.name} added from recommendations!`);
}

function openGraphModal() {
    const modal = document.getElementById('graphModal');
    const container = document.getElementById('graphVisualization');
    const cartItems = cart.getAllItems();
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="bst-empty">
                <i class="fas fa-network-wired"></i>
                <p>Add items to cart to see product relationships</p>
            </div>
        `;
        modal.classList.add('show');
        return;
    }
    
    container.innerHTML = '';
    renderGraph(container, cartItems);
    modal.classList.add('show');
}

function closeGraphModal() {
    document.getElementById('graphModal').classList.remove('show');
}

function renderGraph(container, cartItems) {
    const canvas = document.createElement('div');
    canvas.style.position = 'relative';
    canvas.style.width = '100%';
    canvas.style.minHeight = '500px';
    
    const nodes = [];
    const edges = [];

    // Layout: one vertical column per cart item.
    // This keeps each item's recommendations directly below it, avoiding cross-over edge clutter.
    const COLUMN_GAP = 220;
    const TOP_Y = 80;
    const REC_START_Y = 240;
    const REC_GAP_Y = 160;
    const LEFT_PADDING = 140;
    const RECS_PER_ITEM = 4;

    cartItems.forEach((item, colIndex) => {
        const x = LEFT_PADDING + (colIndex * COLUMN_GAP);

        // Cart node (top of column)
        nodes.push({
            key: `cart:${item.name}`,
            name: item.name,
            emoji: item.emoji,
            price: item.price,
            type: 'in-cart',
            x,
            y: TOP_Y
        });

        // Recommendations for THIS cart item
        const perItemRecs = productGraph.getRecommendations(item.name, RECS_PER_ITEM);
        const seen = new Set(); // dedupe within the column

        perItemRecs.forEach((rec, recIndex) => {
            if (seen.has(rec.product)) return;
            seen.add(rec.product);

            const productData = foodDatabase.find(p => p.name === rec.product);
            if (!productData) return;

            nodes.push({
                key: `rec:${item.name}->${rec.product}`,
                name: rec.product,
                emoji: productData.emoji,
                price: productData.price,
                type: 'recommended',
                x,
                y: REC_START_Y + (recIndex * REC_GAP_Y),
                parentCart: item.name
            });

            edges.push({
                from: item.name,
                to: rec.product,
                weight: rec.weight,
                colX: x
            });
        });
    });

    // Make sure the canvas is wide enough for all nodes (so edges + nodes don't overlap weirdly)
    const maxX = nodes.reduce((m, n) => Math.max(m, n.x), 0);
    const maxY = nodes.reduce((m, n) => Math.max(m, n.y), 0);
    canvas.style.minWidth = `${maxX + 250}px`;
    canvas.style.minHeight = `${maxY + 250}px`;

    // Build quick lookup for node positions
    // Note: node names can repeat across columns, so we use (cartName -> recName) matching
    const cartNodeByName = new Map(
        nodes.filter(n => n.type === 'in-cart').map(n => [n.name, n])
    );
    const recNodeByParentAndName = new Map(
        nodes
            .filter(n => n.type === 'recommended')
            .map(n => [`${n.parentCart}||${n.name}`, n])
    );

    // Draw edges (behind nodes) using existing CSS: .graph-edge + .graph-edge-label
    const NODE_RADIUS = 60; // graph nodes are 120x120
    const createEdge = (fromNode, toNode, weight) => {
        const x1 = fromNode.x + NODE_RADIUS;
        const y1 = fromNode.y + NODE_RADIUS;
        const x2 = toNode.x + NODE_RADIUS;
        const y2 = toNode.y + NODE_RADIUS;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const edgeDiv = document.createElement('div');
        edgeDiv.className = 'graph-edge';
        edgeDiv.style.left = `${x1}px`;
        edgeDiv.style.top = `${y1}px`;
        edgeDiv.style.width = `${length}px`;
        edgeDiv.style.transform = `rotate(${angle}deg)`;
        edgeDiv.style.zIndex = '1';
        edgeDiv.style.opacity = '0.55';
        edgeDiv.style.height = `${Math.min(7, 2 + Math.floor(weight / 5))}px`;

        const labelDiv = document.createElement('div');
        labelDiv.className = 'graph-edge-label';
        labelDiv.style.left = `${(x1 + x2) / 2}px`;
        labelDiv.style.top = `${(y1 + y2) / 2}px`;
        labelDiv.style.transform = 'translate(-50%, -50%)';
        labelDiv.style.zIndex = '2';
        labelDiv.textContent = `${weight}`;

        canvas.appendChild(edgeDiv);
        canvas.appendChild(labelDiv);
    };

    edges.forEach(e => {
        const fromNode = cartNodeByName.get(e.from);
        const toNode = recNodeByParentAndName.get(`${e.from}||${e.to}`);
        if (fromNode && toNode) createEdge(fromNode, toNode, e.weight);
    });

    // Draw nodes on top of edges
    nodes.forEach(node => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = `graph-node ${node.type}`;
        nodeDiv.style.left = node.x + 'px';
        nodeDiv.style.top = node.y + 'px';
        nodeDiv.style.zIndex = '10';
        nodeDiv.innerHTML = `
            <div class="graph-node-emoji">${node.emoji}</div>
            <div class="graph-node-name">${node.name.split(' ').slice(0, 2).join(' ')}</div>
            <div class="graph-node-price">₹${node.price}</div>
        `;
        nodeDiv.addEventListener('click', () => {
            if (node.type === 'recommended') {
                addRecommendedProduct(node.name);
                closeGraphModal();
            }
        });
        canvas.appendChild(nodeDiv);
    });
    
    container.appendChild(canvas);
}

// ============================================
// CHECKOUT & QUEUE
// ============================================

function openCheckoutModal() {
    if (cart.getSize() === 0) {
        showToast('⚠️ Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('checkoutSummary');
    const items = cart.getAllItems();
    const totals = cart.calculateTotals();
    
    summary.innerHTML = items.map(item => `
        <div class="checkout-item">
            <span>${item.emoji} ${item.name} x${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    document.getElementById('checkoutTotal').textContent = `₹${totals.total}`;
    modal.classList.add('show');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('show');
    document.getElementById('checkoutForm').reset();
}

function processCheckout(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const deliveryType = document.getElementById('deliveryType').value;
    
    const items = cart.getAllItems();
    const totals = cart.calculateTotals();
    
    const order = {
        orderId: `ORD${orderIdCounter.toString().padStart(3, '0')}`,
        items: items.map(item => ({...item})),
        total: parseFloat(totals.total),
        customerName: name,
        phone: phone,
        address: address,
        deliveryType: deliveryType,
        timestamp: new Date().toLocaleString(),
        status: 'In Queue'
    };
    
    orderIdCounter++;
    orderQueue.enqueue(order);
    currentOrderId = order.orderId;
    
    cart.clear();
    renderCart();
    closeCheckoutModal();
    showToast('🎊 Order placed successfully!', 3000);
    
    setTimeout(() => {
        showPage('orders');
        startOrderProcessing();
    }, 1000);
}

function startOrderProcessing() {
    if (processingInterval) {
        clearInterval(processingInterval);
    }
    
    processingInterval = setInterval(() => {
        if (!orderQueue.isEmpty()) {
            const processedOrder = orderQueue.dequeue();
            processedOrder.status = 'Completed';
            orderHistory.push(processedOrder);
            
            if (processedOrder.orderId === currentOrderId) {
                currentOrderId = null;
                showToast('✅ Your order has been processed!');
            }
            
            updateOrderTrackingPage();
        } else {
            clearInterval(processingInterval);
            processingInterval = null;
        }
    }, 15000);
}

function updateOrderTrackingPage() {
    const currentOrderSection = document.getElementById('currentOrderSection');
    const noOrdersSection = document.getElementById('noOrdersSection');
    const queueContainer = document.getElementById('queueContainer');
    const orderHistoryList = document.getElementById('orderHistory');
    
    if (currentOrderId) {
        const position = orderQueue.getPosition(currentOrderId);
        const allOrders = orderQueue.getAllOrders();
        const currentOrder = allOrders.find(o => o.orderId === currentOrderId);
        
        currentOrderSection.style.display = 'block';
        noOrdersSection.style.display = 'none';
        
        if (currentOrder) {
            document.getElementById('currentOrderInfo').innerHTML = `
                <div class="order-detail">
                    <span class="order-detail-label">Order ID:</span>
                    <span class="order-detail-value">${currentOrder.orderId}</span>
                </div>
                <div class="order-detail">
                    <span class="order-detail-label">Items:</span>
                    <span class="order-detail-value">${currentOrder.items.length} items</span>
                </div>
                <div class="order-detail">
                    <span class="order-detail-label">Total Amount:</span>
                    <span class="order-detail-value">₹${currentOrder.total.toFixed(2)}</span>
                </div>
                <div class="order-detail">
                    <span class="order-detail-label">Delivery Type:</span>
                    <span class="order-detail-value">${currentOrder.deliveryType}</span>
                </div>
                <div class="order-detail">
                    <span class="order-detail-label">Your Position:</span>
                    <span class="order-detail-value">${position}${getOrdinalSuffix(position)} in queue</span>
                </div>
                <div class="order-detail">
                    <span class="order-detail-label">Estimated Wait:</span>
                    <span class="order-detail-value">${(position * 15)} seconds</span>
                </div>
            `;
        }
        
        renderQueue(queueContainer, allOrders);
    } else if (orderQueue.size() > 0) {
        currentOrderSection.style.display = 'block';
        noOrdersSection.style.display = 'none';
        document.getElementById('currentOrderInfo').innerHTML = `
            <p style="text-align: center; color: var(--text-light);">
                No active orders. Other orders are being processed.
            </p>
        `;
        renderQueue(queueContainer, orderQueue.getAllOrders());
    } else {
        currentOrderSection.style.display = 'none';
        noOrdersSection.style.display = 'block';
    }
    
    if (orderHistory.length > 0) {
        orderHistoryList.innerHTML = orderHistory.slice().reverse().map(order => `
            <div class="history-card completed">
                <div class="history-header">
                    <span class="history-id">${order.orderId}</span>
                    <span class="history-status">✓ Completed</span>
                </div>
                <div class="history-details">
                    <div>
                        <strong>Items:</strong> ${order.items.length}
                    </div>
                    <div>
                        <strong>Total:</strong> ₹${order.total.toFixed(2)}
                    </div>
                    <div>
                        <strong>Date:</strong> ${order.timestamp}
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        orderHistoryList.innerHTML = '<p class="no-history">No completed orders yet.</p>';
    }
}

function renderQueue(container, orders) {
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="bst-empty">
                <i class="fas fa-list-ol"></i>
                <p>Queue is empty</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="queue-visual">
            <div class="queue-label">FRONT</div>
            ${orders.map((order, index) => {
                const isYours = order.orderId === currentOrderId;
                const isProcessing = index === 0;
                return `
                    <div class="queue-order ${isProcessing ? 'processing' : ''} ${isYours ? 'your-order' : ''}">
                        <div class="order-id">
                            ${order.orderId}
                            ${isYours ? '<span class="order-badge">YOU</span>' : ''}
                            ${isProcessing ? '<span class="order-badge" style="background: var(--danger-color);">PROCESSING</span>' : ''}
                        </div>
                        <div class="order-items-count">${order.items.length} items</div>
                        <div class="order-total">₹${order.total.toFixed(2)}</div>
                        <div class="order-time">${order.timestamp}</div>
                        ${isYours ? `<div class="order-position">Position: ${index + 1}${getOrdinalSuffix(index + 1)}</div>` : ''}
                    </div>
                    ${index < orders.length - 1 ? '<div class="queue-arrow">→</div>' : ''}
                `;
            }).join('')}
            <div class="queue-label">REAR</div>
        </div>
    `;
}

function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

function openQueueModal() {
    const modal = document.getElementById('queueModal');
    const container = document.getElementById('queueDetailedView');
    const statsContainer = document.getElementById('queueStats');
    const orders = orderQueue.getAllOrders();
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="bst-empty">
                <i class="fas fa-list-ol"></i>
                <p>No orders in queue</p>
            </div>
        `;
        statsContainer.innerHTML = '';
    } else {
        container.innerHTML = orders.map((order, index) => {
            const isYours = order.orderId === currentOrderId;
            const isProcessing = index === 0;
            return `
                <div class="detailed-order ${isProcessing ? 'processing' : ''} ${isYours ? 'your-order' : ''}">
                    <div class="order-detail">
                        <span class="order-detail-label">Order ID:</span>
                        <span class="order-detail-value">
                            ${order.orderId}
                            ${isYours ? '<span class="order-badge">YOU</span>' : ''}
                        </span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Position:</span>
                        <span class="order-detail-value">${index + 1}${getOrdinalSuffix(index + 1)} in queue</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Items:</span>
                        <span class="order-detail-value">${order.items.map(i => i.emoji + ' ' + i.name).join(', ')}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Total:</span>
                        <span class="order-detail-value">₹${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Status:</span>
                        <span class="order-detail-value">${isProcessing ? '🔴 Processing' : '🟡 Waiting'}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        statsContainer.innerHTML = `
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-value">${orders.length}</div>
                    <div class="stat-label">Orders in Queue</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">15s</div>
                    <div class="stat-label">Processing Time</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${orderHistory.length}</div>
                    <div class="stat-label">Completed</div>
                </div>
            </div>
        `;
    }
    
    modal.classList.add('show');
}

function closeQueueModal() {
    document.getElementById('queueModal').classList.remove('show');
}

// ============================================
// LINKED LIST VISUALIZATION
// ============================================

function visualizeLinkedList() {
    const container = document.getElementById('linkedListVisualization');
    const items = cart.getAllItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-visualization">
                <i class="fas fa-link"></i>
                <p>Your cart is empty</p>
                <p class="empty-subtitle">Add items to see the linked list structure!</p>
            </div>
        `;
        return;
    }

    let html = '<div class="head-label">HEAD</div>';

    items.forEach((item, index) => {
        html += `
            <div class="ll-node">
                <div class="node-box">
                    <div class="node-emoji">${item.emoji}</div>
                    <div class="node-data">
                        <div class="node-name">${item.name}</div>
                        <div class="node-info">
                            <span class="node-price">₹${item.price}</span>
                            <span class="node-qty">Qty: ${item.quantity}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (index < items.length - 1) {
            html += `
                <div class="node-arrow">
                    <div class="arrow-line"></div>
                    <span class="arrow-label">next</span>
                </div>
            `;
        }
    });

    html += `
        <div class="node-arrow">
            <div class="arrow-line"></div>
            <span class="arrow-label">next</span>
        </div>
        <div class="null-node">NULL</div>
    `;

    container.innerHTML = html;
}

function openVisualizationModal() {
    const modal = document.getElementById('visualizationModal');
    modal.classList.add('show');
    visualizeLinkedList();
}

function closeVisualizationModal() {
    document.getElementById('visualizationModal').classList.remove('show');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ============================================
// FORM SUBMISSION
// ============================================

document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!name || !price || price <= 0 || !quantity || quantity <= 0) {
        showToast('⚠️ Please fill all fields correctly!');
        return;
    }

    if (!isProductInDatabase(name)) {
        showToast('❌ This item is not available in our store!');
        document.getElementById('productName').focus();
        return;
    }

    const dbItem = foodDatabase.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    const product = {
        id: productIdCounter++,
        name: dbItem.name,
        price: price,
        quantity: quantity,
        emoji: dbItem.emoji,
        category: dbItem.category
    };

    cart.addItem(product);
    renderCart();
    showToast(`✅ ${dbItem.name} added to cart!`);

    document.getElementById('addItemForm').reset();
    document.getElementById('productQuantity').value = 1;
    document.getElementById('productName').focus();
});

document.getElementById('clearCart').addEventListener('click', () => {
    if (cart.getSize() === 0) {
        showToast('⚠️ Cart is already empty!');
        return;
    }

    if (confirm('Are you sure you want to clear the entire cart?')) {
        cart.clear();
        renderCart();
        showToast('🗑️ Cart cleared!');
    }
});

document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);
document.getElementById('checkoutForm').addEventListener('submit', processCheckout);

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    document.querySelectorAll('.breadcrumb a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    document.querySelector('.cart-icon').addEventListener('click', function() {
        showPage('cart');
    });

    setupAutoComplete();
    
    document.getElementById('browseCategoryBtn').addEventListener('click', openCategoryModal);
    document.getElementById('closeCategoryModal').addEventListener('click', closeCategoryModal);
    document.getElementById('closeBstModal').addEventListener('click', closeBSTModal);
    document.getElementById('visualizeBtn').addEventListener('click', openVisualizationModal);
    document.getElementById('closeModal').addEventListener('click', closeVisualizationModal);
    document.getElementById('viewGraphBtn').addEventListener('click', openGraphModal);
    document.getElementById('closeGraphModal').addEventListener('click', closeGraphModal);
    document.getElementById('closeCheckoutModal').addEventListener('click', closeCheckoutModal);
    document.getElementById('viewQueueBtn').addEventListener('click', openQueueModal);
    document.getElementById('closeQueueModal').addEventListener('click', closeQueueModal);
    
    document.getElementById('categoryModal').addEventListener('click', function(e) {
        if (e.target === this) closeCategoryModal();
    });
    
    document.getElementById('bstModal').addEventListener('click', function(e) {
        if (e.target === this) closeBSTModal();
    });
    
    document.getElementById('visualizationModal').addEventListener('click', function(e) {
        if (e.target === this) closeVisualizationModal();
    });
    
    document.getElementById('graphModal').addEventListener('click', function(e) {
        if (e.target === this) closeGraphModal();
    });
    
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) closeCheckoutModal();
    });
    
    document.getElementById('queueModal').addEventListener('click', function(e) {
        if (e.target === this) closeQueueModal();
    });

    renderCart();
});
