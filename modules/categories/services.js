const { Container, BaseHandler } = require("../../utils/global");
const { GetCategory, CreateCategory, UpdateCategoryParams, UpdateCategory, IndexCategory, DeleteCategory, CreateCategories, DeleteCategories, NavbarMenu, GetCategoryBySlug } = require("./handlers");

const { categoryCollection } = Container.getDependencies()

const deleteCategoriesHandler = async (req, res) => {
    const business_id = req.query.business_id

    const request = { business_id }
    const response = await BaseHandler.createChain([
        new DeleteCategories(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const createCategoriesHandler = async (req, res) => {
    const business_id = req.query.business_id
    const categories = req.body.categories

    const request = { business_id, categories }
    const response = await BaseHandler.createChain([
        new CreateCategories(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const createCategoryHandler = async (req, res) => {
    const business_id = req.query.business_id
    const category = req.body

    const request = { business_id, category }
    const response = await BaseHandler.createChain([
        new CreateCategory(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const updateCategoryHandler = async (req, res) => {
    const business_id = req.query.business_id
    const category_id = req.params.id
    const newCategory = req.body

    const request = { business_id, category_id, newCategory }
    const response = await BaseHandler.createChain([
        new GetCategory(categoryCollection),
        new UpdateCategoryParams(),
        new UpdateCategory(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const deleteCategoryHandler = async (req, res) => {
    const business_id = req.query.business_id
    const category_id = req.params.id

    const request = { business_id, category_id }
    const response = await BaseHandler.createChain([
        new DeleteCategory(categoryCollection),
    ]).handle(request)

    res.json(response)
}

const getCategoryHandler = async (req, res) => {
    const business_id = req.query.business_id
    const category_id = req.params.id

    const request = { business_id, category_id }
    const response = await BaseHandler.createChain([
        new GetCategory(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const getCategoryBySlugHandler = async (req, res) => {
    const business_id = req.query.business_id
    const category_slug = req.params.slug

    const request = { business_id, category_slug }
    const response = await BaseHandler.createChain([
        new GetCategoryBySlug(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const indexCategoryHandler = async (req, res) => {
    const business_id = req.query.business_id

    const request = { business_id }
    const response = await BaseHandler.createChain([
        new IndexCategory(categoryCollection)
    ]).handle(request)

    res.json(response)
}

const navbarHandler = async (req, res) => {
    const business_id = req.query.business_id

    const request = { business_id }
    const response = await BaseHandler.createChain([
        new IndexCategory(categoryCollection, false),
        new NavbarMenu(),
    ]).handle(request)

    res.json(response)
}


module.exports = {
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    getCategoryHandler,
    getCategoryBySlugHandler,
    indexCategoryHandler,
    createCategoriesHandler,
    deleteCategoriesHandler,
    navbarHandler
}