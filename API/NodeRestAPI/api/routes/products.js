const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message : 'GET method /products'
	});
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'POST method /products'
	});
});

router.get('/:productID', (req, res, next) => {
	const id = req.params.productID;
	if(id === 'special'){
		res.status(200).json({
			message: 'special id used'
		});
	}
})
module.exports = router;
