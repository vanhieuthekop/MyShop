const mongoose = require('mongoose');
const express = require('express');
const products = require('./routes/product');
const customers = require('./routes/customer');
const orders = require('./routes/order');
const users = require('./routes/user');
const auth = require('./routes/auth');
const app = express();
const config = require('config');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/myshop', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify :false })
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/products', products);
app.use('/api/customers', customers);
app.use('/api/orders', orders);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));