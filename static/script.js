// Shopping Cart with BST Category Browser

// Node class for linked list
class Node {
    constructor(product) {
        this.product = product;
        this.next = null;
    }
}

// Singly Linked List class
class ShoppingCart {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    addItem(product) {
        const newNode = new Node(product);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
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

// BST Node class
class BSTNode {
    constructor(product) {
        this.product = product;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
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

// Initialize cart
const cart = new ShoppingCart();
let productIdCounter = 1;
let selectedProductIndex = -1;

// Page Navigation
function showPage(pageName) {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';
    document.getElementById(pageName + 'Page').style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

function navigateToCart() {
    showPage('cart');
}

// Get unique categories from database
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

// Get category emoji
function getCategoryEmoji(category) {
    const emojiMap = {
        'Fruits': '🍎',
        'Vegetables': '🥕',
        'Dairy': '🥛',
        'Dals': '🌾',
        'Chips': '🥔',
        'Cookies': '🍪',
        'Chocolates': '🍫',
        'Cereals': '🥣'
    };
    return emojiMap[category] || '🛒';
}

// Open category selection modal
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

// Build BST and visualize
function openBSTModal(categoryName, products) {
    const modal = document.getElementById('bstModal');
    const container = document.getElementById('bstVisualization');
    document.getElementById('bstCategoryName').textContent = categoryName;
    
    // Build BST
    const bst = new ProductBST();
    products.forEach(product => bst.insert(product));
    
    // Visualize BST
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
        renderBSTNode(bst.root, treeDiv, 0, null);
        container.appendChild(treeDiv);
    }
    
    modal.classList.add('show');
}

function closeBSTModal() {
    document.getElementById('bstModal').classList.remove('show');
}

// Render BST using level-order traversal
function renderBSTNode(root, container, level, position) {
    if (!root) return;

    const levels = [];
    const queue = [{node: root, level: 0, position: 'root'}];
    
    while (queue.length > 0) {
        const {node, level, position} = queue.shift();
        
        if (!levels[level]) {
            levels[level] = [];
        }
        
        levels[level].push({node, position});
        
        if (node.left) {
            queue.push({node: node.left, level: level + 1, position: 'left'});
        }
        if (node.right) {
            queue.push({node: node.right, level: level + 1, position: 'right'});
        }
    }
    
    // Render each level
    levels.forEach((levelNodes, levelIndex) => {
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
            
            nodeDiv.addEventListener('click', () => {
                addProductFromBST(node.product);
            });
            
            levelDiv.appendChild(nodeDiv);
        });
        
        container.appendChild(levelDiv);
    });
}

// Add product from BST
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
    showToast(`✅ ${dbProduct.name} added to cart!`);
    closeBSTModal();
    showPage('cart');
}

// Auto-complete functionality
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
            matches.forEach((item, index) => {
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
                
                suggestionDiv.addEventListener('click', function() {
                    selectProduct(item);
                });

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

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

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
        return;
    }

    cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="product-info col-product">
                <div class="product-image">${item.emoji || '🛒'}</div>
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
                    <div class="node-emoji">${item.emoji || '🛒'}</div>
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

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.getSize() === 0) {
        showToast('⚠️ Your cart is empty!');
        return;
    }

    const totals = cart.calculateTotals();
    const items = cart.getAllItems();
    
    let message = `🎉 Order Summary:\n\n`;
    items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nTotal: ₹${totals.total}\n\nProceed to payment?`;

    if (confirm(message)) {
        showToast('🎊 Order placed successfully! Redirecting to payment...', 4000);
        setTimeout(() => {
            cart.clear();
            renderCart();
        }, 2000);
    }
});

function openVisualizationModal() {
    const modal = document.getElementById('visualizationModal');
    modal.classList.add('show');
    visualizeLinkedList();
}

function closeVisualizationModal() {
    const modal = document.getElementById('visualizationModal');
    modal.classList.remove('show');
}

// Initialize on page load
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

    // Setup autocomplete
    setupAutoComplete();
    
    // Browse by Category button
    document.getElementById('browseCategoryBtn').addEventListener('click', openCategoryModal);
    
    // Close category modal
    document.getElementById('closeCategoryModal').addEventListener('click', closeCategoryModal);
    
    // Close BST modal
    document.getElementById('closeBstModal').addEventListener('click', closeBSTModal);
    
    // Visualization button
    document.getElementById('visualizeBtn').addEventListener('click', openVisualizationModal);
    
    // Close visualization modal
    document.getElementById('closeModal').addEventListener('click', closeVisualizationModal);
    
    // Close modals when clicking outside
    document.getElementById('categoryModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCategoryModal();
        }
    });
    
    document.getElementById('bstModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBSTModal();
        }
    });
    
    document.getElementById('visualizationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVisualizationModal();
        }
    });

    // Initial render
    renderCart();
});
