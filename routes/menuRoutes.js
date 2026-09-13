const MenuItem = require("./models/menuItem");

app.get("/menu", async (req, res) => {

    const tableNo = req.query.table;

    const menuItems = await MenuItem.find();

    res.render("user/menu", {
        tableNo,
        menuItems
    });

});