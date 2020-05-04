const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    }
});

const Product = mongoose.model('Product',productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        price: Joi.number().min(0).required(),
        numberInStock: Joi.number().min(0).max(1000).required()
    };

    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;