const express = require("express");
const connectDB = require("./config/db");

const app = express();
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");
const MenuItem = require("./models/menuitem");
const QRCode = require("qrcode");
connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");



app.use("/", orderRoutes);


let cart = [];

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
app.get("/admin/orders", async (req, res) => {
    const orders = await Order.find();
    res.render("admin/orders", { orders });
});
// ADD THIS ROUTE HERE
app.get("/admin/order/:id/:status", async (req, res) => {

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

let currentTableNo = null;

app.get("/menu", async (req, res) => {

    const tableNo = req.query.table;

    const items = await MenuItem.find();

    res.render("user/menu", {
        tableNo,
        items
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
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});