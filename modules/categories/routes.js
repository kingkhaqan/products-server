// routes/index.js
const express = require('express');
const { createCategoryHandler, updateCategoryHandler, getCategoryHandler, indexCategoryHandler, deleteCategoryHandler, createCategoriesHandler, deleteCategoriesHandler, navbarHandler, getCategoryBySlugHandler } = require('./services');
const router = express.Router();

router.post('/bulk', createCategoriesHandler);
router.delete('/', deleteCategoriesHandler);

router.get('/navbar', navbarHandler);


router.post('/', createCategoryHandler);
router.put('/:id', updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);
router.get('/:id', getCategoryHandler);
router.get('/slug/:slug', getCategoryBySlugHandler);
router.get('/', indexCategoryHandler);



module.exports = router;
