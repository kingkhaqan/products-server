// routes/index.js
const express = require('express');
const { createProductHandler, updateProductHandler, deleteProductHandler, getProductHandler, indexProductHandler, createProductsHandler, deleteProductsHandler } = require('./services');
const router = express.Router();

router.post("/bulk", createProductsHandler)
router.delete("/", deleteProductsHandler)


router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);
router.get('/:id', getProductHandler);
router.get('/', indexProductHandler);


module.exports = router;
