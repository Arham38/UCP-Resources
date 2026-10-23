const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'global-mart-secret-key-2024'; // In production, use environment variable

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves your HTML/CSS/JS

// --- MONGODB CONNECTION ---
// Make sure MongoDB is running in the background!
mongoose.connect('mongodb://127.0.0.1:27017/globalMartERP', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- DATABASE SCHEMAS (Data Models) ---

// 0. Users (Authentication)
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'operations'], required: true, default: 'customer' },
    name: String,
    phone: String,
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
}));

// 1. Products (Inventory)
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    category: String,
    icon: String
}));

// 2. Orders (Sales & Fulfillment)
const Order = mongoose.model('Order', new mongoose.Schema({
    customer: String,
    email: String,
    phone: String,
    address: String,
    total: Number,
    items: Array, // Stores list of items purchased
    status: { type: String, default: 'Paid' }, // Paid, Shipped, Delivered, Returned
    type: String, // 'Online' or 'Instore'
    paymentMethod: String, // card, paypal, cod
    createdAt: { type: Date, default: Date.now }
}));

// 3. Tickets (Support, IT, Facilities, Returns)
const Ticket = mongoose.model('Ticket', new mongoose.Schema({
    type: String, // Support, Return, IT, Facilities, Loss
    desc: String,
    status: { type: String, default: 'Open' },
    date: { type: Date, default: Date.now }
}));

// 4. Employees (HR & Payroll)
const Employee = mongoose.model('Employee', new mongoose.Schema({
    name: String,
    role: String,
    salary: Number,
    status: { type: String, default: 'Active' }
}));

// 5. Invoices (Finance & Procurement)
const Invoice = mongoose.model('Invoice', new mongoose.Schema({
    vendor: String,
    amount: Number,
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
}));

// 6. Marketing Campaigns
const Campaign = mongoose.model('Campaign', new mongoose.Schema({
    name: String,
    budget: Number,
    status: String
}));


// --- API ROUTES (The Logic) ---

// >> GET REQUESTS (Fetching Data)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 });
        res.json(tickets);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        res.json(employees);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ date: -1 });
        res.json(invoices);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// >> AUTHENTICATION ROUTES

// User Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password, role, name, phone } = req.body;

        // Validate required fields
        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields: username, email, password, role' });
        }

        // Validate role
        if (!['customer', 'admin', 'operations'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be: customer, admin, or operations' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            name: name || username,
            phone: phone || null
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User signed up:', {
            id: newUser._id,
            username: newUser.username,
            role: newUser.role
        });

        res.json({
            message: 'Account created successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name
            }
        });
    } catch (e) {
        console.error('❌ Signup error:', e);
        res.status(500).json({ error: e.message });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if role matches (if specified)
        if (role && user.role !== role) {
            return res.status(403).json({ error: `Access denied. This account is for ${user.role} role.` });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User logged in:', {
            id: user._id,
            username: user.username,
            role: user.role
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (e) {
        console.error('❌ Login error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Get Current User (for token validation)
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (e) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// >> POST REQUESTS (Creating Data)

// Create Product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({ message: 'Product Created Successfully', productId: product._id, product: product });
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

// Bulk Create Products
app.post('/api/products/bulk', async (req, res) => {
    try {
        const products = await Product.insertMany(req.body);
        res.json({ message: `${products.length} Products Created Successfully`, count: products.length });
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

// Create Order (Simulates Payment & Inventory Deduction)
app.post('/api/orders', async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.customer || !req.body.total || !req.body.items || !req.body.type) {
            return res.status(400).json({ error: 'Missing required fields: customer, total, items, type' });
        }

        // For online orders, require email, phone, address
        if (req.body.type === 'Online') {
            if (!req.body.email || !req.body.phone || !req.body.address) {
                return res.status(400).json({ error: 'Online orders require email, phone, and address' });
            }
        }

        const orderData = {
            customer: req.body.customer,
            email: req.body.email || null,
            phone: req.body.phone || null,
            address: req.body.address || null,
            total: Number(req.body.total),
            items: Array.isArray(req.body.items) ? req.body.items : [],
            status: req.body.status || 'Paid',
            type: req.body.type,
            createdAt: new Date()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();
        
        console.log('✅ Order saved to database:', {
            id: newOrder._id,
            customer: newOrder.customer,
            total: newOrder.total,
            items: newOrder.items.length
        });
        
        res.json({ 
            message: 'Order Placed Successfully', 
            orderId: newOrder._id,
            order: newOrder
        });
    } catch (e) { 
        console.error('❌ Order creation error:', e);
        res.status(500).json({ error: e.message }); 
    }
});

// Create Ticket (Support/IT/Returns)
app.post('/api/tickets', async (req, res) => {
    try {
        if (!req.body.type || !req.body.desc) {
            return res.status(400).json({ error: 'Missing required fields: type, desc' });
        }
        const ticket = new Ticket(req.body);
        await ticket.save();
        console.log('✅ Ticket saved:', ticket._id);
        res.json({ message: 'Ticket Logged', ticketId: ticket._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Hire Employee
app.post('/api/employees', async (req, res) => {
    try {
        if (!req.body.name || !req.body.role || !req.body.salary) {
            return res.status(400).json({ error: 'Missing required fields: name, role, salary' });
        }
        const employee = new Employee(req.body);
        await employee.save();
        console.log('✅ Employee saved:', employee._id);
        res.json({ message: 'Employee Hired', employeeId: employee._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Run Payroll (Mock Process)
app.post('/api/payroll', async (req, res) => {
    // In a real app, this would generate bank files
    res.json({ message: 'Payroll Processed for All Active Staff' });
});

// Create Vendor Invoice
app.post('/api/invoices', async (req, res) => {
    try {
        if (!req.body.vendor || !req.body.amount) {
            return res.status(400).json({ error: 'Missing required fields: vendor, amount' });
        }
        const invoice = new Invoice(req.body);
        await invoice.save();
        console.log('✅ Invoice saved:', invoice._id);
        res.json({ message: 'Invoice Received', invoiceId: invoice._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create Campaign
app.post('/api/campaigns', async (req, res) => {
    try {
        if (!req.body.name || !req.body.budget) {
            return res.status(400).json({ error: 'Missing required fields: name, budget' });
        }
        const campaign = new Campaign(req.body);
        await campaign.save();
        console.log('✅ Campaign saved:', campaign._id);
        res.json({ message: 'Campaign Started', campaignId: campaign._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// >> PUT REQUESTS (Updating Data)

// Update Order Status (Shipping/Delivery)
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log('✅ Order updated:', updatedOrder._id, 'Status:', status);
        res.json({ message: `Order Status Updated to ${status}`, order: updatedOrder });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Pay Invoice
app.put('/api/invoices/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id, 
            { status: 'Paid' },
            { new: true }
        );
        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        console.log('✅ Invoice paid:', updatedInvoice._id);
        res.json({ message: 'Invoice Paid', invoice: updatedInvoice });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Ticket Status
app.put('/api/tickets/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be: Open, In Progress, Resolved, or Closed' });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { status },
            { new: true }
        );
        
        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        console.log('✅ Ticket updated:', updatedTicket._id, 'Status:', status);
        res.json({ message: `Ticket Status Updated to ${status}`, ticket: updatedTicket });
    } catch (e) {
        console.error('❌ Ticket update error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Delete Ticket
app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        console.log('✅ Ticket deleted:', deletedTicket._id);
        res.json({ message: 'Ticket Deleted Successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// --- SYSTEM RESET & SEEDING ---
// Visit http://localhost:3000/api/seed to reset your database
app.get('/api/seed', async (req, res) => {
    try {
        // 1. Clear Data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Employee.deleteMany({});
        await Order.deleteMany({});
        await Ticket.deleteMany({});
        await Invoice.deleteMany({});
        await Campaign.deleteMany({});

        // 2. Create Default Users
        const hashedAdminPass = await bcrypt.hash('admin123', 10);
        const hashedOpsPass = await bcrypt.hash('ops123', 10);
        const hashedCustomerPass = await bcrypt.hash('customer123', 10);

        const users = await User.insertMany([
            { username: 'admin', email: 'admin@globalmart.com', password: hashedAdminPass, role: 'admin', name: 'Admin User', status: 'Active' },
            { username: 'ops', email: 'ops@globalmart.com', password: hashedOpsPass, role: 'operations', name: 'Operations Manager', status: 'Active' },
            { username: 'customer', email: 'customer@example.com', password: hashedCustomerPass, role: 'customer', name: 'Test Customer', status: 'Active' }
        ]);

        // 2. Add Starter Products with proper structure
        const products = await Product.insertMany([
            { name: 'Laptop Pro X', price: 1200, stock: 50, category: 'Electronics', icon: 'fa-laptop' },
            { name: 'Wireless Mouse', price: 25, stock: 200, category: 'Electronics', icon: 'fa-computer-mouse' },
            { name: 'Office Chair', price: 150, stock: 20, category: 'Home', icon: 'fa-chair' },
            { name: 'Running Shoes', price: 80, stock: 45, category: 'Fashion', icon: 'fa-shoe-prints' },
            { name: 'Smartphone Pro', price: 800, stock: 100, category: 'Electronics', icon: 'fa-mobile-screen' },
            { name: 'Headphones Premium', price: 120, stock: 75, category: 'Electronics', icon: 'fa-headphones' },
            { name: 'Monitor 27inch', price: 300, stock: 30, category: 'Electronics', icon: 'fa-tv' },
            { name: 'Keyboard Mechanical', price: 90, stock: 60, category: 'Electronics', icon: 'fa-keyboard' },
            { name: 'T-Shirt Classic', price: 25, stock: 150, category: 'Fashion', icon: 'fa-shirt' },
            { name: 'Jeans Denim', price: 60, stock: 80, category: 'Fashion', icon: 'fa-shirt' },
            { name: 'Sofa Comfort', price: 500, stock: 15, category: 'Home', icon: 'fa-couch' },
            { name: 'Coffee Table', price: 120, stock: 25, category: 'Home', icon: 'fa-table' }
        ]);

        // 3. Add Starter Employees
        const employees = await Employee.insertMany([
            { name: 'Alice Smith', role: 'Manager', salary: 5000, status: 'Active' },
            { name: 'Bob Jones', role: 'Warehouse', salary: 3200, status: 'Active' },
            { name: 'Charlie Day', role: 'Cashier', salary: 2800, status: 'Active' }
        ]);

        // 4. Add Starter Tickets
        await Ticket.create({ type: 'IT', desc: 'Server Rack Overheating', status: 'Open' });

        console.log('✅ Database seeded successfully');
        console.log(`   - ${users.length} Users created`);
        console.log(`   - ${products.length} Products created`);
        console.log(`   - ${employees.length} Employees created`);

        res.json({ 
            message: 'Database Reset & Seeded with Starter Data',
            stats: {
                users: users.length,
                products: products.length,
                employees: employees.length,
                tickets: 1
            },
            defaultCredentials: {
                admin: { username: 'admin', password: 'admin123' },
                operations: { username: 'ops', password: 'ops123' },
                customer: { username: 'customer', password: 'customer123' }
            }
        });
    } catch (error) {
        console.error('❌ Seeding error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`\n🚀 Global Mart ERP System running on http://localhost:${PORT}`);
    console.log(`👉 To reset data, visit: http://localhost:${PORT}/api/seed\n`);
});