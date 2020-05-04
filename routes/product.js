const {Product, validate} = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', async(req, res) => {
    const products = await Product.find().sort('name');
    res.send(products);
});

router.get('/:id', async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with given ID was not existed');

    res.send(product);
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let product = new Product(_.pick(req.body, ['name', 'price', 'numberInStock']));

    product = await product.save();
    
    res.send(product);
});

router.put('/:id', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let product = await Product.findOneAndUpdate({_id: req.params.id}, 
                _.pick(req.body, ['name', 'price', 'numberInStock']),
                {new : true});

    if (!product) return res.status(404).send('The product with given ID was not existed!');

    res.send(product);
});

router.delete('/:id', async(req, res) =>{
    const product = await Product.findOneAndDelete({_id: req.params.id});

    if (!product) return res.status(404).send('The product with given ID was not existed');

    res.send(product);
});

module.exports = router;