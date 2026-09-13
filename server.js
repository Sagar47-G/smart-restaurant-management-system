const express = require("express");
const connectDB = require("./config/db");
const Admin = require("./models/admin");
const bcrypt = require("bcrypt");
const app = express();
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");
const MenuItem = require("./models/menuitem");
const QRCode = require("qrcode");
const session = require("express-session");
const Feedback = require("./models/feedback");
connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");



app.use("/", orderRoutes);


let cart = [];

let currentTableNo = null;
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/cart", (req, res) => {

    const total = cart.reduce(
        (sum, item) => sum + item.price,
        0
    );

    res.render("user/cart", {
        cart,
        total
    });
});

// Show all orders
app.get("/admin/orders", isAdmin, async (req, res) => {
    const orders = await Order.find();
    res.render("admin/orders", { orders });
});
// ADD THIS ROUTE HERE
app.get("/admin/order/:id/:status", isAdmin, async (req, res) => {

    const { id, status } = req.params;

    await Order.findByIdAndUpdate(id, {
        status: status
    });

    res.redirect("/admin/orders");
});

app.get("/track/:id", async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.send("Order not found");
    }

    res.render("user/trackOrder", { order });

});

app.get("/admin/add-menu", (req, res) => {
    res.render("admin/addMenu");
});

app.post("/admin/add-menu", async (req, res) => {

    await MenuItem.create({
        name: req.body.name,
        price: req.body.price
    });

    res.redirect("/admin/menu");
});

app.get("/admin/menu", async (req, res) => {

    const items = await MenuItem.find();

    res.render("admin/menu", { items });

});

app.get("/admin/delete-menu/:id", async (req, res) => {

    await MenuItem.findByIdAndDelete(req.params.id);

    res.redirect("/admin/menu");
});

app.get("/admin/edit-menu/:id", async (req, res) => {

    const item = await MenuItem.findById(req.params.id);

    res.render("admin/editMenu", { item });
});

app.post("/admin/edit-menu/:id", async (req, res) => {

    const { name, price, category } = req.body;

    await MenuItem.findByIdAndUpdate(req.params.id, {
        name,
        price,
        category
    });

    res.redirect("/admin/menu");
});

app.get("/admin/generate-qr/:tableNo", async (req, res) => {

    const tableNo = req.params.tableNo;

    const url = `http://localhost:3000/menu?table=${tableNo}`;

    const qrImage = await QRCode.toDataURL(url);

    res.render("admin/qr", {
        qrImage,
        tableNo
    });
});

app.get("/menu", async (req, res) => {
    const tableNo = req.query.table;

    const menuItems = await MenuItem.find();

    res.render("user/menu", {
        tableNo,
        menuItems
    });
});

app.get("/add-to-cart/:name/:price", (req, res) => {

    cart.push({
        name: req.params.name,
        price: Number(req.params.price)
    });

    res.redirect("/cart");
});
app.get("/place-order", async (req, res) => {

    const total = cart.reduce(
        (sum, item) => sum + item.price,
        0
    );

    const order = await Order.create({
    tableNo: currentTableNo,
    items: cart,
    totalAmount: total,
    status: "Received"
});

    cart = [];

    res.redirect(`/track/${order._id}`);
});

app.get("/admin/dashboard", async (req, res) => {

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );

    const totalOrders = orders.length;

    res.render("admin/dashboard", {
        totalRevenue,
        totalOrders
    });

});
app.get("/admin/dashboard", async (req, res) => {

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );

    const totalOrders = orders.length;

    const itemCount = {};

    orders.forEach(order => {
        order.items.forEach(item => {

            if(itemCount[item.name]) {
                itemCount[item.name]++;
            } else {
                itemCount[item.name] = 1;
            }

        });
    });

    let bestSellingItem = "No Orders";
    let maxCount = 0;

    for(const item in itemCount) {

        if(itemCount[item] > maxCount) {
            maxCount = itemCount[item];
            bestSellingItem = item;
        }

    }

    res.render("admin/dashboard", {
        totalRevenue,
        totalOrders,
        bestSellingItem
    });

});
app.get("/bill/:id", async (req, res) => {

    const order = await Order.findById(req.params.id);

    res.render("user/bill", { order });

});
app.get("/create-admin", async (req, res) => {

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
        username: "admin",
        password: hashedPassword
    });

    res.send("Admin Created");
});

app.get("/admin/login", (req, res) => {
    res.render("admin/login");
});
app.post("/admin/login", async (req, res) => {

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
        return res.send("Invalid Username");
    }

    const match = await bcrypt.compare(
        password,
        admin.password
    );

    if (!match) {
        return res.send("Invalid Password");
    }

    req.session.adminId = admin._id;
    res.redirect("/admin/orders");
});

// Middleware function
function isAdmin(req, res, next) {

    if (!req.session.adminId) {
        return res.redirect("/admin/login");
    }

    next();
}
app.get("/admin/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/admin/login");
    });

});
app.get("/feedback", (req, res) => {
    res.render("user/feedback");
});
app.post("/feedback", async (req, res) => {

    await Feedback.create({
        tableNo: req.body.tableNo,
        rating: req.body.rating,
        comment: req.body.comment
    });

    res.send("Thank You For Your Feedback!");
});
app.get("/admin/feedbacks", isAdmin, async (req, res) => {

    const feedbacks = await Feedback.find();

    res.render("admin/feedbacks", {
        feedbacks
    });

});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

