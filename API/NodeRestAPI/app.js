const express = require('express');
const app = express();

const productsRoutes = require('./api/routes/products');

app.use('/products', productsRoutes);

module.exports = app;
