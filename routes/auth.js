const {User} = require('../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');


router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthtoken();
    
    res.send(token);
});

function validate(req){
    const schema = {
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email()
    }

    return Joi.validate(req, schema);
}

module.exports = router;