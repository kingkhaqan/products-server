const { ObjectId } = require("mongodb")
const { BaseHandler } = require("../../utils/global")

class DeleteCategories extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { business_id } = request
        try {
            const results = await this.categoryCollection.deleteMany({ business_id })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not delete cats' }

            }

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)
    }
}

class CreateCategories extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { categories } = request
        try {
            const results = await this.categoryCollection.insertMany(categories)
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not create cats' }

            }

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)
    }
}

class IndexCategory extends BaseHandler {

    constructor(categoryCollection, sendResponse = true) {
        super()
        this.categoryCollection = categoryCollection
        this.sendResponse = sendResponse

    }

    async handle(request) {
        const { business_id } = request
        let categories
        try {
            const results = await this.categoryCollection.find({ business_id }).toArray()
            if (!results || results.length == 0) {
                return { success: false, code: 401, data: {}, message: 'Category not found' }
            }
            categories = results
        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        request.categories = categories
        const nextHandlerResponse = await this.handleNext(request)
        if (this.sendResponse)
            nextHandlerResponse.data['categories'] = categories
        return nextHandlerResponse

    }
}

class GetCategory extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { business_id, category_id } = request
        let category
        try {
            const results = await this.categoryCollection.findOne({ _id: new ObjectId(category_id), business_id })
            if (!results) {
                return { success: false, code: 401, data: {}, message: 'Category not found' }
            }
            category = results
        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        request.category = category
        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['category'] = category
        return nextHandlerResponse

    }
}

class GetCategoryBySlug extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { business_id, category_slug } = request
        let category
        try {
            const results = await this.categoryCollection.findOne({ slug: category_slug, business_id })
            if (!results) {
                return { success: false, code: 401, data: {}, message: 'Category not found' }
            }
            category = results
        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        request.category = category
        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['category'] = category
        return nextHandlerResponse

    }
}

class CreateCategory extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { category } = request
        try {
            const results = await this.categoryCollection.insertOne(category)
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not create cat' }

            }
            category['_id'] = results.insertedId

        } catch (error) {
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['category'] = category
        return nextHandlerResponse

    }
}

class UpdateCategory extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { business_id, category, category_id } = request
        try {
            const results = await this.categoryCollection.updateOne({ _id: new ObjectId(category_id), business_id }, { $set: category })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not update cat' }

            }
        } catch (error) {
            console.log(error);
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['category'] = category
        return nextHandlerResponse

    }
}

class DeleteCategory extends BaseHandler {

    constructor(categoryCollection) {
        super()
        this.categoryCollection = categoryCollection
    }

    async handle(request) {
        const { business_id, category_id } = request
        try {
            const results = await this.categoryCollection.deleteOne({ _id: new ObjectId(category_id), business_id })
            if (!results.acknowledged) {
                return { success: false, code: 400, data: {}, message: 'Could not delete cat' }

            }
        } catch (error) {
            console.log(error);
            return { success: false, code: 400, data: {}, message: String(error) }
        }

        return await this.handleNext(request)

    }
}


class UpdateCategoryParams extends BaseHandler {

    constructor() {
        super()
    }

    async handle(request) {
        const { category, newCategory } = request

        Object.assign(category, newCategory)

        return await this.handleNext(request)

    }
}

class NavbarMenu extends BaseHandler {

    constructor() {
        super()
    }

    async handle(request) {


        const { categories } = request

        const navbar = []

        categories.forEach(category => {
            const catObj = {
                "name": category.name,
                "title": category.title,
                "path": `/shop/${category.slug}`,
                "categories": []
            }
            const group = category.group
            if (group && group != "") {

                const groupFound = navbar.find(nav => nav.name == group)
                if (groupFound) {
                    groupFound.categories.push(catObj)
                }
                else {
                    const tempCat = {

                        name: group,
                        title: group.replace("_", " "),
                        path: null,
                        categories: [catObj]
                    }

                    navbar.push(tempCat)
                }

            }
            else {
                navbar.push(catObj)
            }
        })


        const nextHandlerResponse = await this.handleNext(request)
        nextHandlerResponse.data['navbar'] = navbar
        return nextHandlerResponse

    }
}



module.exports = {
    IndexCategory,
    GetCategory,
    GetCategoryBySlug,
    CreateCategory,
    UpdateCategoryParams,
    UpdateCategory,
    DeleteCategory,
    CreateCategories,
    DeleteCategories,
    NavbarMenu
}