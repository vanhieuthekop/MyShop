const { Order, validate} = require('../models/order');
const { Product } = require('../models/product');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', async(req, res) => {
    const orders = Order.find().sort('name');
    res.send(orders);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer ) return res.status(400).send('Invalid customer');

    const ps = await Promise.all(req.body.products.map( async (product) => {
        const p = await Product.findById(product.id);
        return {
            name : p.name,
            price: p.price,
            amount: product.amount,
            total: (p.price * product.amount)
        }
    }));

    let order = new Order({
        customer: _.pick(customer, ['name', 'phone']),
        products: ps,
        totalBill: ps.reduce((sum, value) => {
            return sum.total + value.total;
        })
    });

    console.log(ps);

    // order.save();
    res.send(order);
});

module.exports = router;