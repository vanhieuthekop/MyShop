const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async(req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with given ID was not existed');

    res.send(customer);
});

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer(_.pick(req.body, ['name', 'dob', 'address', 'phone']));

    customer = await customer.save();
    
    res.send(customer);
});

router.put('/:id', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let customer = await Customer.findOneAndUpdate({_id: req.params.id}, 
                _.pick(req.body, ['name', 'dob', 'address', 'phone']),
                {new : true});

    if (!customer) return res.status(404).send('The customer with given ID was not existed!');

    res.send(customer);
});

router.delete('/:id', async(req, res) =>{
    const customer = await Customer.findOneAndDelete({_id: req.params.id});

    if (!customer) return res.status(404).send('The customer with given ID was not existed');

    res.send(customer);
});

module.exports = router;