const mongoose = require('mongoose');
const express = require('express');
const products = require('./routes/product');
const customers = require('./routes/customer');
const orders = require('./routes/order');
const app = express();

mongoose.connect('mongodb://localhost/myshop')
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/products', products);
app.use('/api/customers', customers);
app.use('/api/orders', orders);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));