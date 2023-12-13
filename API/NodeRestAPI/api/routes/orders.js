const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
	res.status(200).json({
		message : 'GET method /orders'
	});
});

router.post('/', (req, res, next) => {
    const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	};
	res.status(201).json({
		message: 'POST method /orders',
        order: order
	});
});

router.get('/:orderID', (req, res, next) => {
	res.status(200).json({
        message: 'GET / order',
        orderID: req.params.orderID
    });
});

router.delete('/:orderID', (req, res, next) => {
	res.status(200).json({
        message: 'DELETE / order',
        orderID: req.params.orderID
    });
});



module.exports = router;
