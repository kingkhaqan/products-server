const { Container, BaseHandler } = require("../../utils/global");
const { GetCategory, CreateCategory, UpdateCategoryParams, UpdateCategory, IndexCategory, DeleteCategory, CreateProduct, GetProduct, UpdateProductParams, UpdateProduct, DeleteProduct, IndexProduct, DeleteProducts, CreateProducts, PrepareFilter, PrepareBulkInsertProducts } = require("./handlers");

const { productCollection } = Container.getDependencies()

const deleteProductsHandler = async (req, res) => {
    const business_id = req.query.business_id

    const request = { business_id }
    const response = await BaseHandler.createChain([
        new DeleteProducts(productCollection)
    ]).handle(request)

    res.json(response)
}

const createProductsHandler = async (req, res) => {
    const business_id = req.query.business_id
    const products = req.body.products

    const request = { business_id, products }
    const response = await BaseHandler.createChain([
        new PrepareBulkInsertProducts(),
        new CreateProducts(productCollection)
    ]).handle(request)

    res.json(response)
}

const createProductHandler = async (req, res) => {
    const business_id = req.query.business_id
    const product = req.body

    const request = { business_id, product }
    const response = await BaseHandler.createChain([
        new CreateProduct(productCollection)
    ]).handle(request)

    res.json(response)
}

const updateProductHandler = async (req, res) => {
    const business_id = req.query.business_id
    const product_id = req.params.id
    const newProduct = req.body

    const request = { business_id, product_id, newProduct }
    const response = await BaseHandler.createChain([
        new GetProduct(productCollection),
        new UpdateProductParams(),
        new UpdateProduct(productCollection)
    ]).handle(request)

    res.json(response)
}

const deleteProductHandler = async (req, res) => {
    const business_id = req.query.business_id
    const product_id = req.params.id

    const request = { business_id, product_id }
    const response = await BaseHandler.createChain([
        new DeleteProduct(productCollection),
    ]).handle(request)

    res.json(response)
}

const getProductHandler = async (req, res) => {
    const business_id = req.query.business_id
    const product_id = req.params.id

    console.log(business_id, product_id);

    const request = { business_id, product_id }
    const response = await BaseHandler.createChain([
        new GetProduct(productCollection)
    ]).handle(request)

    res.json(response)
}

const indexProductHandler = async (req, res) => {
    const business_id = req.query.business_id
    const filters = req.query

    const request = { business_id, filters }
    const response = await BaseHandler.createChain([
        new PrepareFilter(),
        new IndexProduct(productCollection)
    ]).handle(request)

    res.json(response)
}


module.exports = {
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
    getProductHandler,
    indexProductHandler,
    createProductsHandler,
    deleteProductsHandler
}