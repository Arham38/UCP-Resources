const API = 'http://localhost:3000/api';

// --- GLOBAL STATE ---
let cart = [];
let allStoreProducts = []; // Stores real DB + Generated products
let targetPortal = ''; // For Login redirect

/* =========================================
   1. LANDING PAGE & LOGIN LOGIC
   ========================================= */

function openLogin(portalName) {
    targetPortal = portalName;
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    
    const titleMap = {
        'admin': 'HQ Admin Login',
        'operations': 'Operations Login',
        'customer': 'Customer Login'
    };
    
    document.getElementById('modal-title').innerText = titleMap[portalName] || 'Secure Login';
    modal.style.display = "flex";
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = "none";
        document.getElementById('login-error').style.display = "none";
        document.getElementById('login-form').reset();
    }
}

function showSignup() {
    closeLogin();
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = "flex";
    }
}

function closeSignup() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = "none";
        document.getElementById('signup-error').style.display = "none";
        document.getElementById('signup-form').reset();
    }
}

function showLogin() {
    closeSignup();
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = "flex";
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    const errorText = document.getElementById('error-message');

    errorMsg.style.display = 'none';

    try {
        const roleMap = {
            'admin': 'admin',
            'operations': 'operations',
            'customer': 'customer'
        };
        const requiredRole = roleMap[targetPortal];

        const response = await fetch(API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role: requiredRole })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (data.user.role === 'operations') {
            window.location.href = 'operations.html';
        } else if (data.user.role === 'customer') {
            window.location.href = 'customer.html';
        }
    } catch (error) {
        errorText.innerText = error.message || 'Login failed. Please check your credentials.';
        errorMsg.style.display = 'block';
        const content = document.querySelector('#login-modal .modal-content');
        if (content) {
            content.style.animation = 'shake 0.5s';
            setTimeout(() => content.style.animation = '', 500);
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const role = document.getElementById('signup-role').value;
    
    const errorMsg = document.getElementById('signup-error');
    const errorText = document.getElementById('signup-error-message');

    errorMsg.style.display = 'none';

    try {
        if (!role) {
            throw new Error('Please select a role');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const response = await fetch(API + '/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, name, phone, role })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showToast('Account created successfully!');

        // Redirect based on role
        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else if (data.user.role === 'operations') {
                window.location.href = 'operations.html';
            } else if (data.user.role === 'customer') {
                window.location.href = 'customer.html';
            }
        }, 1000);

    } catch (error) {
        errorText.innerText = error.message || 'Signup failed. Please try again.';
        errorMsg.style.display = 'block';
        const content = document.querySelector('#signup-modal .modal-content');
        if (content) {
            content.style.animation = 'shake 0.5s';
            setTimeout(() => content.style.animation = '', 500);
        }
    }
}

/* =========================================
   2. CUSTOMER PORTAL LOGIC
   ========================================= */

// --- SMART PRODUCT GENERATOR (120+ Items) ---
function generateInventory() {
    const generated = [];
    const categories = [
        { 
            name: 'Electronics', icon: 'fa-plug', 
            items: ['Laptop', 'Smartphone', 'Headphones', 'Monitor', 'Smart Watch', 'Tablet', 'Camera', 'Speaker', 'Drone', 'Keyboard', 'Mouse', 'Router', 'Console', 'Charger', 'Power Bank', 'Hard Drive', 'Webcam', 'Microphone', 'Projector', 'Printer'] 
        },
        { 
            name: 'Fashion', icon: 'fa-shirt', 
            items: ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Dress', 'Suit', 'Hat', 'Scarf', 'Socks', 'Boots', 'Watch', 'Belt', 'Sunglasses', 'Gloves', 'Coat', 'Skirt', 'Blazer', 'Sandals', 'Hoodie', 'Backpack'] 
        },
        { 
            name: 'Home', icon: 'fa-couch', 
            items: ['Sofa', 'Chair', 'Table', 'Lamp', 'Rug', 'Curtains', 'Vase', 'Mirror', 'BedSheet', 'Pillow', 'Clock', 'Desk', 'Bookshelf', 'Planter', 'Towel', 'Organiser', 'Candle', 'Frame', 'Mug', 'Blender'] 
        },
        { 
            name: 'Groceries', icon: 'fa-carrot', 
            items: ['Coffee', 'Tea', 'Rice', 'Pasta', 'Olive Oil', 'Cereal', 'Milk', 'Cheese', 'Bread', 'Eggs', 'Chicken', 'Beef', 'Apples', 'Bananas', 'Carrots', 'Tomatoes', 'Potatoes', 'Onions', 'Garlic', 'Spices'] 
        },
        { 
            name: 'Sports', icon: 'fa-basketball', 
            items: ['Yoga Mat', 'Dumbbells', 'Treadmill', 'Football', 'Basketball', 'Tennis Racket', 'Jersey', 'Water Bottle', 'Running Shoes', 'Bike', 'Helmet', 'Gloves', 'Punching Bag', 'Resistance Bands', 'Swim Goggles', 'Golf Clubs', 'Baseball Bat', 'Hiking Boots', 'Tent', 'Sleeping Bag'] 
        },
        { 
            name: 'Beauty', icon: 'fa-spray-can', 
            items: ['Lipstick', 'Perfume', 'Mascara', 'Foundation', 'Eyeliner', 'Face Cream', 'Shampoo', 'Conditioner', 'Body Wash', 'Soap', 'Lotion', 'Sunscreen', 'Nail Polish', 'Hair Dryer', 'Brush', 'Serum', 'Toner', 'Scrub', 'Mask', 'Oil'] 
        }
    ];

    const adjectives = ['Premium', 'Deluxe', 'Organic', 'Pro', 'Slim', 'Classic', 'Modern', 'Ultra', 'Essential', 'Smart', 'Elite', 'Durable'];

    categories.forEach(cat => {
        cat.items.forEach(item => {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const price = Math.floor(Math.random() * 490) + 10;
            const stock = Math.floor(Math.random() * 100);
            
            generated.push({
                name: `${adj} ${item}`,
                price: price,
                stock: stock,
                category: cat.name,
                icon: cat.icon
            });
        });
    });
    return generated;
}

// Generate once
const DEMO_PRODUCTS = generateInventory();

// Navigation Tab Switcher
function switchTab(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-links-desktop a').forEach(el => el.classList.remove('active-link'));
    
    const target = document.getElementById(viewId + '-view');
    if(target) target.classList.remove('hidden');
    
    if(viewId === 'orders') loadMyOrders();
}

// Load Products
async function loadProducts() {
    try {
        const res = await fetch(API + '/products');
        const dbProducts = await res.json();
        
        const formattedDB = dbProducts.map(p => ({
            ...p, 
            category: "Electronics", 
            icon: "fa-box-open"
        }));

        // Merge DB data with our massive generated list
        allStoreProducts = [...formattedDB, ...DEMO_PRODUCTS];
        renderStore(allStoreProducts);

    } catch (err) {
        console.error("API Error, using demo data only");
        renderStore(DEMO_PRODUCTS);
    }
}

function renderStore(products) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;

    if(products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="fa-solid fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p style="font-size: 1.1rem; font-weight: 600; color: #64748b;">No products found</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(p => {
        const isInCart = cart.some(item => item.name === p.name);
        const cartItem = cart.find(item => item.name === p.name);
        return `
            <div class="store-card product-card">
                <div class="product-badge">
                    ${p.stock > 0 ? `<span class="stock-badge">In Stock</span>` : `<span class="stock-badge out-of-stock">Out of Stock</span>`}
                </div>
                <div class="card-img product-image">
                    <i class="fa-solid ${p.icon || 'fa-box'}"></i>
                    <div class="product-overlay">
                        <button class="quick-view-btn" onclick="quickView('${p.name}')" title="Quick View">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <h4 class="product-name">${p.name}</h4>
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                        <span class="rating-text">(4.5)</span>
                    </div>
                    <div class="product-footer">
                        <div class="price">$${p.price}</div>
                        ${isInCart ? `
                            <button class="btn-add in-cart" onclick="addToCart('${p.name}', ${p.price})" disabled>
                                <i class="fa-solid fa-check"></i> In Cart (${cartItem.quantity})
                            </button>
                        ` : `
                            <button class="btn-add" onclick="addToCart('${p.name}', ${p.price})">
                                <i class="fa-solid fa-cart-plus"></i> Add to Cart
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function quickView(productName) {
    // Find product details
    const product = allStoreProducts.find(p => p.name === productName);
    if (!product) return;
    
    // Show product details in a modal or alert (can be enhanced)
    showToast(`${productName} - $${product.price} | ${product.category}`);
}

// Filtering & Search
function filterProducts(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(event.target.classList.contains('cat-btn')) event.target.classList.add('active');

    if(cat === 'All') {
        renderStore(allStoreProducts);
    } else {
        const filtered = allStoreProducts.filter(p => p.category === cat);
        renderStore(filtered);
    }
}

function searchProducts(term) {
    if(typeof term !== 'string') term = document.querySelector('.search-bar input').value;
    const lower = term.toLowerCase();
    const filtered = allStoreProducts.filter(p => p.name.toLowerCase().includes(lower));
    renderStore(filtered);
}

// Cart Logic
let cartItemId = 0;

function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Increase quantity if item already exists
        existingItem.quantity++;
        showToast(`Updated ${name} quantity (${existingItem.quantity})`);
    } else {
        // Add new item to cart
        cart.push({ 
            id: ++cartItemId,
            name, 
            price,
            quantity: 1
        });
        showToast(`Added ${name} to cart`);
    }
    
    updateCartUI();
    // Refresh product display to show updated "In Cart" status
    renderStore(allStoreProducts.filter(p => {
        if (typeof document.querySelector('.search-bar input') !== 'undefined') {
            const searchTerm = document.querySelector('.search-bar input')?.value.toLowerCase() || '';
            return !searchTerm || p.name.toLowerCase().includes(searchTerm);
        }
        return true;
    }));
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    showToast('Item removed from cart');
    // Refresh product display to update "In Cart" status
    const activeCategory = document.querySelector('.cat-btn.active')?.textContent.trim() || 'All';
    if(activeCategory === 'All') {
        renderStore(allStoreProducts);
    } else {
        const filtered = allStoreProducts.filter(p => p.category === activeCategory);
        renderStore(filtered);
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity < 1) {
        removeFromCart(itemId);
        return;
    }
    updateCartUI();
    // Refresh product display to show updated quantity
    const activeCategory = document.querySelector('.cat-btn.active')?.textContent.trim() || 'All';
    if(activeCategory === 'All') {
        renderStore(allStoreProducts);
    } else {
        const filtered = allStoreProducts.filter(p => p.category === activeCategory);
        renderStore(filtered);
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    
    if(cart.length === 0) {
        container.innerHTML = `
            <div style="padding:40px; text-align:center; color:#94a3b8;">
                <i class="fa-solid fa-cart-shopping" style="font-size:3rem; margin-bottom:15px; opacity:0.3;"></i>
                <p style="font-size:1rem;">Your cart is empty</p>
                <p style="font-size:0.85rem; margin-top:5px;">Add items to get started!</p>
            </div>
        `;
        totalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" title="Decrease">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" title="Increase">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    totalEl.innerText = '$' + total.toFixed(2);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    if(sidebar) {
        if(sidebar.style.right === '0px') sidebar.style.right = '-400px';
        else sidebar.style.right = '0px';
    }
    if(overlay) overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function checkout() {
    if(cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    
    // Show checkout modal
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    
    // Update checkout summary
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = total;
    const shipping = subtotal >= 50 ? 0 : 10;
    const finalTotal = subtotal + shipping;
    
    document.getElementById('checkout-items-count').innerText = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
    document.getElementById('checkout-subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('checkout-shipping').innerText = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    document.getElementById('checkout-total-amount').innerText = '$' + finalTotal.toFixed(2);
    
    // Reset payment method to card
    document.querySelector('input[name="payment-method"][value="card"]').checked = true;
    selectPaymentMethod('card');
    
    // Show modal
    modal.style.display = "flex";
    
    // Close cart sidebar
    toggleCart();
}

function selectPaymentMethod(method) {
    // Update radio button
    document.querySelector(`input[name="payment-method"][value="${method}"]`).checked = true;
    
    // Show/hide payment details
    document.getElementById('card-details').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('paypal-details').style.display = method === 'paypal' ? 'block' : 'none';
    document.getElementById('cod-details').style.display = method === 'cod' ? 'block' : 'none';
    
    // Update submit button text
    const submitBtn = document.getElementById('submit-payment-btn');
    if (method === 'cod') {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Confirm Order';
    } else if (method === 'paypal') {
        submitBtn.innerHTML = '<i class="fa-brands fa-paypal"></i> Pay with PayPal';
    } else {
        submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Complete Payment';
    }
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
        input.value = formattedValue;
    }
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = "none";
        document.getElementById('checkout-form').reset();
    }
}

async function processCheckout(e) {
    e.preventDefault();
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Validate card details if card is selected
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVV = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        if (!cardNumber || cardNumber.length < 16) {
            showToast('Please enter a valid card number');
            return;
        }
        if (!cardExpiry || cardExpiry.length !== 5) {
            showToast('Please enter a valid expiry date (MM/YY)');
            return;
        }
        if (!cardCVV || cardCVV.length < 3) {
            showToast('Please enter a valid CVV');
            return;
        }
        if (!cardName) {
            showToast('Please enter cardholder name');
            return;
        }
    }
    
    // Get customer details from form
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    
    if(cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 10;
    const total = subtotal + shipping;
    const items = cart.map(i => ({ name: i.name, qty: i.quantity })); 
    
    // Show loading
    const submitBtn = document.getElementById('submit-payment-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Simulate payment processing delay
        if (paymentMethod === 'paypal') {
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        const response = await fetch(API + '/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: customerAddress,
                total: total,
                items: items,
                status: paymentMethod === 'cod' ? 'Pending' : 'Paid',
                type: 'Online',
                paymentMethod: paymentMethod
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        
        const data = await response.json();
        const orderId = data.orderId || data.order?._id || 'N/A';
        
        // Clear cart
        cart = [];
        cartItemId = 0;
        updateCartUI();
        closeCheckoutModal();
        
        // Show payment success modal
        showPaymentSuccess(orderId, total, paymentMethod);
        
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error placing order. Please try again.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function showPaymentSuccess(orderId, total, paymentMethod) {
    const modal = document.getElementById('payment-success-modal');
    if (!modal) return;
    
    // Format order ID
    const formattedOrderId = orderId.toString().substr(-8).toUpperCase();
    
    // Format payment method
    const paymentMethodNames = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'cod': 'Cash on Delivery'
    };
    
    document.getElementById('success-order-id').textContent = `#${formattedOrderId}`;
    document.getElementById('success-total').textContent = '$' + total.toFixed(2);
    document.getElementById('success-payment-method').textContent = paymentMethodNames[paymentMethod] || paymentMethod;
    
    modal.style.display = 'flex';
}

function closePaymentSuccess() {
    const modal = document.getElementById('payment-success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    switchTab('shop');
}

function viewOrderHistory() {
    closePaymentSuccess();
    setTimeout(() => switchTab('orders'), 100);
}

// Authentication helpers
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = getAuthToken();
    const user = getUser();
    if (!token || !user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const checkoutModal = document.getElementById('checkout-modal');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    if (event.target == checkoutModal) {
        closeCheckoutModal();
    }
    if (event.target == loginModal) {
        closeLogin();
    }
    if (event.target == signupModal) {
        closeSignup();
    }
}

// Order History
async function loadMyOrders() {
    const res = await fetch(API + '/orders');
    const allOrders = await res.json();
    const myOrders = allOrders.filter(o => o.type === 'Online').reverse();
    
    const container = document.getElementById('my-order-list');
    container.innerHTML = myOrders.map(o => `
        <div class="order-card">
            <div>
                <strong>Order #${o._id.substr(-6)}</strong><br>
                <small style="color:#666">$${o.total} • ${o.items ? o.items.length : 1} Items</small>
            </div>
            <div>
                <span class="status-badge status-${o.status}" style="padding:5px 10px; border-radius:15px; background:#e0f2fe; color:#0369a1; font-size:0.8rem; font-weight:bold;">${o.status}</span>
                ${o.status === 'Delivered' ? `<button onclick="initiateReturn('${o._id}')" style="margin-left:10px; padding:5px 10px; cursor:pointer;">Return</button>` : ''}
            </div>
        </div>
    `).join('');
}

function initiateReturn(orderId) {
    alert(`Return initiated for Order #${orderId}`);
    switchTab('services');
}

// Services Form Handling
async function handleSupport(e) {
    e.preventDefault();
    const type = document.getElementById('support-type').value;
    const desc = document.getElementById('support-desc').value;
    await fetch(API + '/tickets', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: 'Support', desc: `[${type}] ${desc}`, status: 'Open' })
    });
    showToast('Ticket Submitted');
    e.target.reset();
}


/* =========================================
   3. OPERATIONS PORTAL LOGIC
   ========================================= */

function switchOpsTab(tabId) {
    document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active-menu'));
    if(event) event.currentTarget.classList.add('active-menu');
    
    document.querySelectorAll('.ops-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId + '-view').classList.remove('hidden');

    if (tabId === 'dashboard') loadOpsStats();
    if (tabId === 'fulfillment') loadOpsOrders();
    if (tabId === 'pos') loadPosProducts();
    if (tabId === 'inventory') loadInventory();
    if (tabId === 'incidents') loadOpsTickets();
}

async function loadOpsStats() {
    const ordersRes = await fetch(API + '/orders');
    const orders = await ordersRes.json();
    const productsRes = await fetch(API + '/products');
    const products = await productsRes.json();
    const ticketsRes = await fetch(API + '/tickets');
    const tickets = await ticketsRes.json();

    const pending = orders.filter(o => o.status === 'Paid').length;
    const stock = products.length + DEMO_PRODUCTS.length; // Approximate for demo
    const incidents = tickets.filter(t => t.status === 'Open').length;

    document.getElementById('stat-pending').innerText = pending;
    document.getElementById('stat-stock').innerText = stock; 
    document.getElementById('stat-incidents').innerText = incidents;
}

async function loadOpsOrders() {
    const res = await fetch(API + '/orders');
    const data = await res.json();
    const onlineOrders = data.filter(o => o.type === 'Online');
    
    const tbody = document.getElementById('ops-order-table');
    tbody.innerHTML = onlineOrders.map(o => `
        <tr>
            <td>#${o._id.substr(-6)}</td>
            <td>${o.customer}</td>
            <td>$${o.total}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>
                ${o.status === 'Paid' ? `<button class="btn-sm bg-blue" onclick="processFulfillment('${o._id}', 'Shipped')">Ship</button>` : ''}
                ${o.status === 'Shipped' ? `<button class="btn-sm bg-green" onclick="processFulfillment('${o._id}', 'Delivered')">Deliver</button>` : ''}
            </td>
        </tr>
    `).join('');
}

async function processFulfillment(id, status) {
    await fetch(API + `/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadOpsOrders();
    showToast(`Order Updated to ${status}`);
}

// POS Logic
let posCart = [];
async function loadPosProducts() {
    // POS uses the same massive inventory list
    const grid = document.getElementById('pos-grid');
    grid.innerHTML = allStoreProducts.map(p => `
        <div class="pos-card" onclick="addToPosCart('${p.name}', ${p.price})">
            <h4>${p.name}</h4>
            <div style="font-weight:bold; color:#3b82f6;">$${p.price}</div>
        </div>
    `).join('');
}

function addToPosCart(name, price) {
    posCart.push({ name, price });
    renderPosCart();
}

function renderPosCart() {
    const list = document.getElementById('pos-cart-list');
    let total = 0;
    list.innerHTML = posCart.map(item => {
        total += item.price;
        return `<div class="pos-item-row"><span>${item.name}</span><span>$${item.price}</span></div>`;
    }).join('');
    document.getElementById('pos-total-amount').innerText = '$' + total.toFixed(2);
}

async function processPOSPayment() {
    if(posCart.length === 0) return alert("Cart Empty");
    const total = posCart.reduce((sum, i) => sum + i.price, 0);
    const items = posCart.map(i => ({ name: i.name, qty: 1 }));

    await fetch(API + '/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customer: 'Walk-in Customer',
            total: total,
            items: items,
            status: 'Delivered',
            type: 'Instore'
        })
    });

    posCart = [];
    renderPosCart();
    showToast("POS Transaction Complete");
}

async function loadInventory() {
    // Use all products (DB + Demo)
    document.getElementById('inventory-table').innerHTML = allStoreProducts.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.stock}</td>
            <td>$${p.price}</td>
            <td><button class="btn-sm bg-blue" onclick="restockItem()">Receive Stock</button></td>
        </tr>
    `).join('');
}

async function restockItem() {
    showToast("Stock Updated (+10 Units)");
}

async function submitInternalTicket() {
    const type = document.getElementById('inc-type').value;
    const desc = document.getElementById('inc-desc').value;
    if(!desc) return;
    await fetch(API + '/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, desc: `[INTERNAL] ${desc}`, status: 'Open' })
    });
    showToast("Incident Reported");
    loadOpsTickets();
}

let allTickets = [];

async function loadOpsTickets() {
    try {
        const res = await fetch(API + '/tickets');
        allTickets = await res.json();
        renderTicketsTable(allTickets);
    } catch (error) {
        console.error('Error loading tickets:', error);
        document.getElementById('ops-ticket-list').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fa-solid fa-circle-exclamation"></i> Error loading tickets
                </td>
            </tr>
        `;
    }
}

function renderTicketsTable(tickets) {
    const tbody = document.getElementById('ops-ticket-list');
    if (!tbody) return;

    if (tickets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fa-solid fa-inbox"></i><br><br>No tickets found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = tickets.map(ticket => {
        const ticketId = ticket._id ? ticket._id.substr(-8) : 'N/A';
        const date = ticket.date ? new Date(ticket.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A';
        
        const statusBadgeClass = {
            'Open': 'status-Open',
            'In Progress': 'status-InProgress',
            'Resolved': 'status-Resolved',
            'Closed': 'status-Closed'
        }[ticket.status] || 'status-Open';

        const typeIcon = {
            'IT': 'fa-computer',
            'Facilities': 'fa-building',
            'Loss': 'fa-shield-halved',
            'Support': 'fa-headset',
            'Return': 'fa-rotate-left'
        }[ticket.type] || 'fa-ticket';

        return `
            <tr>
                <td style="font-family: monospace; font-weight: 600; color: #64748b;">#${ticketId}</td>
                <td>
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid ${typeIcon}" style="color: #3b82f6;"></i>
                        <strong>${ticket.type || 'N/A'}</strong>
                    </span>
                </td>
                <td style="max-width: 300px;">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ticket.desc || ''}">
                        ${ticket.desc || 'No description'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusBadgeClass}">${ticket.status || 'Open'}</span>
                </td>
                <td style="color: #64748b; font-size: 0.9rem;">${date}</td>
                <td>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${ticket.status === 'Open' ? `
                            <button class="btn-sm bg-blue" onclick="updateTicketStatus('${ticket._id}', 'In Progress')" title="Mark as In Progress">
                                <i class="fa-solid fa-play"></i>
                            </button>
                        ` : ''}
                        ${ticket.status === 'In Progress' ? `
                            <button class="btn-sm bg-green" onclick="updateTicketStatus('${ticket._id}', 'Resolved')" title="Mark as Resolved">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : ''}
                        ${ticket.status !== 'Closed' ? `
                            <button class="btn-sm" style="background: #64748b; color: white;" onclick="updateTicketStatus('${ticket._id}', 'Closed')" title="Close Ticket">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        ` : ''}
                        ${ticket.status === 'Closed' || ticket.status === 'Resolved' ? `
                            <button class="btn-sm bg-red" onclick="deleteTicket('${ticket._id}')" title="Delete Ticket" style="background: #ef4444;">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function updateTicketStatus(ticketId, newStatus) {
    if (!confirm(`Are you sure you want to update ticket status to "${newStatus}"?`)) {
        return;
    }

    try {
        const response = await fetch(API + `/tickets/${ticketId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update ticket');
        }

        showToast(`Ticket status updated to ${newStatus}`);
        loadOpsTickets();
    } catch (error) {
        console.error('Error updating ticket:', error);
        showToast('Error updating ticket: ' + error.message);
    }
}

async function deleteTicket(ticketId) {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(API + `/tickets/${ticketId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete ticket');
        }

        showToast('Ticket deleted successfully');
        loadOpsTickets();
    } catch (error) {
        console.error('Error deleting ticket:', error);
        showToast('Error deleting ticket: ' + error.message);
    }
}

function filterTickets() {
    const searchTerm = document.getElementById('ticket-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('ticket-status-filter')?.value || '';
    const typeFilter = document.getElementById('ticket-type-filter')?.value || '';

    let filtered = allTickets.filter(ticket => {
        const matchesSearch = !searchTerm || 
            (ticket.desc && ticket.desc.toLowerCase().includes(searchTerm)) ||
            (ticket.type && ticket.type.toLowerCase().includes(searchTerm)) ||
            (ticket._id && ticket._id.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || ticket.status === statusFilter;
        const matchesType = !typeFilter || ticket.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    renderTicketsTable(filtered);
}


/* =========================================
   4. ADMIN PORTAL LOGIC
   ========================================= */

function switchAdminTab(tabId) {
    document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active-menu'));
    if(event) event.currentTarget.classList.add('active-menu');
    document.querySelectorAll('.ops-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId + '-view').classList.remove('hidden');
    
    if(tabId === 'analytics') loadAnalytics();
}

async function hireEmployee() {
    const name = document.getElementById('emp-name').value;
    const role = document.getElementById('emp-role').value;
    const salary = document.getElementById('emp-sal').value;
    await fetch(API + '/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, salary })
    });
    showToast("Hired Successfully");
    loadEmployees();
}

async function loadEmployees() {
    const res = await fetch(API + '/employees');
    const data = await res.json();
    document.getElementById('emp-list').innerHTML = data.map(e => `<tr><td>${e.name}</td><td>${e.role}</td><td>$${e.salary}</td><td>Active</td></tr>`).join('');
}

async function runPayroll() {
    await fetch(API + '/payroll', { method: 'POST' });
    showToast("Payroll Processed");
}

async function simulateVendorInvoice() {
    await fetch(API + '/invoices', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({vendor: 'TechSupplier Inc', amount: Math.floor(Math.random()*5000), status: 'Pending'})
    });
    loadInvoices();
    showToast("Invoice Received");
}

async function loadInvoices() {
    const res = await fetch(API + '/invoices');
    const data = await res.json();
    document.getElementById('invoice-list').innerHTML = data.map(i => `
        <tr>
            <td>${i.vendor}</td>
            <td>$${i.amount}</td>
            <td><span class="status-badge status-${i.status}">${i.status}</span></td>
            <td>${i.status === 'Pending' ? `<button class="btn-sm bg-green" onclick="payInvoice('${i._id}')">Approve</button>` : 'Paid'}</td>
        </tr>
    `).join('');
}

async function payInvoice(id) {
    await fetch(API + `/invoices/${id}`, { method: 'PUT' });
    loadInvoices();
}

async function launchCampaign() {
    const name = document.getElementById('camp-name').value;
    const budget = document.getElementById('camp-budget').value;
    await fetch(API + '/campaigns', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, budget, status: 'Live' })
    });
    document.getElementById('active-campaigns').innerHTML += `<div style="padding:10px; border:1px solid #ddd; margin-top:10px; border-left: 5px solid #10b981;"><strong>${name}</strong> (Budget: $${budget}) - LIVE</div>`;
    showToast("Campaign Launched");
}

async function loadAnalytics() {
    const res = await fetch(API + '/orders');
    const orders = await res.json();
    const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('kpi-revenue').innerText = '$' + totalRev.toLocaleString();
}


/* =========================================
   5. UTILITIES
   ========================================= */

function showToast(msg) {
    const t = document.getElementById('toast');
    if(t) {
        t.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${msg}`;
        t.className = "toast show";
        setTimeout(() => t.className = "toast", 3000);
    } else {
        alert(msg);
    }
}