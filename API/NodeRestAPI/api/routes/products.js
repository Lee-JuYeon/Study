const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message : 'GET method /products'
	});
});

router.post('/', (req, res, next) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	};
	res.status(201).json({
		message: 'POST method /products',
		product: product
	});
});

router.get('/:productID', (req, res, next) => {
	const id = req.params.productID;
	if(id === 'special'){
		res.status(200).json({
			message: 'special id used'
		});
	}else{
		res.status(200).json({
			message:'common id'
		});
	}
});

router.patch('/:productID', (req, res, next) => {
	res.status(200).json({
		message: 'udpated product!'
	});
});

router.delete('/:productID', (req, res, next) => {
	res.status(200).json({
		message: 'delete product!'
	});
});


module.exports = router;
