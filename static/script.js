// Shopping Cart using Singly Linked List with Auto-Complete and Visualization

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

        // Filter items from database
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

    // Keyboard navigation
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

    // Close autocomplete when clicking outside
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

// Check if product exists in database
function isProductInDatabase(productName) {
    return foodDatabase.some(item => 
        item.name.toLowerCase() === productName.toLowerCase()
    );
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Render cart items
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
                <div class="product-image">
                    ${item.emoji}
                </div>
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

// Update order summary
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

// Visualize Linked List
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

// Add item to cart with validation
document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!name || !price || price <= 0 || !quantity || quantity <= 0) {
        showToast('⚠️ Please fill all fields correctly!');
        return;
    }

    // Validate if product exists in database
    if (!isProductInDatabase(name)) {
        showToast('❌ This item is not available in our store!');
        document.getElementById('productName').focus();
        return;
    }

    // Find product details from database
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

    // Reset form
    document.getElementById('addItemForm').reset();
    document.getElementById('productQuantity').value = 1;
    document.getElementById('productName').focus();
});

// Increase quantity
function increaseQuantity(productId) {
    const items = cart.getAllItems();
    const item = items.find(i => i.id === productId);
    if (item) {
        cart.updateQuantity(productId, item.quantity + 1);
        renderCart();
        showToast(`📈 Quantity increased!`);
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const items = cart.getAllItems();
    const item = items.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        cart.updateQuantity(productId, item.quantity - 1);
        renderCart();
        showToast(`📉 Quantity decreased!`);
    }
}

// Delete item
function deleteItem(productId) {
    if (confirm('Are you sure you want to remove this item?')) {
        cart.deleteItem(productId);
        renderCart();
        showToast(`🗑️ Item removed from cart!`);
    }
}

// Clear cart
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

// Checkout
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

// Modal functionality
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
    
    // Visualization button
    document.getElementById('visualizeBtn').addEventListener('click', openVisualizationModal);
    
    // Close modal button
    document.getElementById('closeModal').addEventListener('click', closeVisualizationModal);
    
    // Close modal when clicking outside
    document.getElementById('visualizationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVisualizationModal();
        }
    });

    // Initial render
    renderCart();
});