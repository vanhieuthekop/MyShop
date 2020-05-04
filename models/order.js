const Joi = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }),
        required: true
    },
    products: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: 1
            },
            total: {
                type: Number,
                required: true
            }
        })],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalBill: {
        type: Number
    }
});

const Order = new mongoose.model('Order', orderSchema);

function validateOrder(order) {
    const schema = {
        customerId: Joi.string().required(),
        products: Joi.array().required()
    }

    return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
