const { ObjectId } = require("mongodb")
const { BaseHandler } = require("../../utils/global")

class PrepareBulkInsertProducts extends BaseHandler {
    constructor() {
        super()
    }

    async handle(request) {
        const { business_id, products } = request

        products.forEach(product => {
            product.business_id = business_id
            product.created_at = Date.now()
            product.updated_at = Date.now()
        });


        return await this.nextHandler.handle(request)
    }
}

class DeleteProducts extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { business_id } = request
        try {
            const results = await this.productCollection.deleteMany({ business_id })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not delete products' }

            }

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)
    }
}

class CreateProducts extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { products } = request
        try {
            const results = await this.productCollection.insertMany(products)
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not create products' }

            }

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)
    }
}

class PrepareFilter extends BaseHandler {

    constructor() {
        super()
    }

    async handle(request) {
        const { business_id, filters } = request

        let limit = 20
        const appliedFilters = { business_id }

        if (filters.limit) {
            limit = Number(filters.limit)
        }

        if (filters.popular_products) {
            appliedFilters.popular = true
        }

        if (filters.discounted_products) {
            appliedFilters['discounted_price'] = { $exists: true, $nin: ["", null] }

        }

        if (filters.latest_products) {
            appliedFilters.latest = true
        }

        if (filters.category) {
            appliedFilters['category.name'] = filters.category
        }

        if (filters.filters) {
            const attributeFilterStr = filters.filters
            const attributeFilters = attributeFilterStr.split(";")
            const af = attributeFilters[0]
            const kv = af.split(":")
            const id = kv[0]
            const value = kv[1]
            appliedFilters.filters = {
                $elemMatch: { filter_id: id, filter_value: value }
            }


        }

        if (filters.q) {
            appliedFilters['$text'] = { $search: filters.q }
        }


        request.filters = appliedFilters
        request.limit = limit
        return await this.handleNext(request)

    }
}

class IndexProduct extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { filters, limit } = request


        let products
        try {
            const results = await this.productCollection.find(filters).limit(limit).toArray()
            if (!results || results.length == 0) {
                return { success: false, code: 401, data: {}, message: 'Product not found' }
            }
            products = results
        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        request.products = products
        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['products'] = products
        return nextHandlerResponse

    }
}

class GetProduct extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { business_id, product_id } = request

        let product
        try {
            const results = await this.productCollection.findOne({ _id: (product_id), business_id })
            if (!results) {
                return { success: false, code: 401, data: {}, message: 'Product not found' }
            }
            product = results
        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        request.product = product
        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['product'] = product
        return nextHandlerResponse

    }
}

class CreateProduct extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { product } = request
        try {
            const results = await this.productCollection.insertOne(product)
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not create product' }

            }
            product['_id'] = results.insertedId

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['product'] = product
        return nextHandlerResponse

    }
}

class UpdateProduct extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { business_id, product, product_id } = request
        try {
            const results = await this.productCollection.updateOne({ _id: (product_id), business_id }, { $set: product })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not update product' }

            }
        } catch (error) {
            console.log(error);
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['product'] = product
        return nextHandlerResponse

    }
}

class DeleteProduct extends BaseHandler {

    constructor(productCollection) {
        super()
        this.productCollection = productCollection
    }

    async handle(request) {
        const { business_id, product_id } = request
        try {
            const results = await this.productCollection.deleteOne({ _id: new ObjectId(product_id), business_id })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not delete product' }

            }
        } catch (error) {
            console.log(error);
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)

    }
}


class UpdateProductParams extends BaseHandler {

    constructor() {
        super()
    }

    async handle(request) {
        const { product, newProduct } = request

        Object.assign(product, newProduct)

        return await this.handleNext(request)

    }
}



module.exports = {
    PrepareFilter,
    IndexProduct,
    GetProduct,
    CreateProduct,
    UpdateProductParams,
    UpdateProduct,
    DeleteProduct,
    CreateProducts,
    DeleteProducts,
    PrepareBulkInsertProducts
}