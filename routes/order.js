const { Order, validate } = require('../models/order');
const { Product } = require('../models/product');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Fawn = require('fawn');
const _ = require('lodash');
const assert = require('assert');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const orders = Order.find().sort('name');
    res.send(orders);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    try {
        const ps = await Promise.all(req.body.products.map(async (product) => {
            const p = await Product.findById(product.id);
            if (!p) 
                throw new Error('Can not find products');
            if (p.numberInStock < product.amount)
                throw new Error('Not enough products in stores...');
            else {
                p.numberInStock -= product.amount;
                await p.save();
            }
            return {
                name: p.name,
                price: p.price,
                amount: product.amount,
                total: (p.price * product.amount)
            }
        }));

        const order = new Order({
            customer: _.pick(customer, ['name', 'phone']),
            products: ps,
            totalBill : ps.reduce((sum, value) => {
                return sum + value.total;
            }, 0)
        });

        order.save();

        res.send(order);
    }catch(err){
        return res.send(err.message);
    }

    
 
});

module.exports = router;