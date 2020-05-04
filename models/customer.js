const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 5
    },
    dob : {
        type: Date,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).required(),
        dob: Joi.date().required(),
        address: Joi.string().required(),
        phone: Joi.string().required()
    }

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;