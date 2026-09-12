const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.post("/place-order", async (req, res) => {

    try {

        const { items, totalAmount } = req.body;

        const newOrder = new Order({
            items,
            totalAmount
        });

        await newOrder.save();

        res.json({
            success: true,
            message: "Order Saved"
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;