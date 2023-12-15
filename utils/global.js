const MongodbConnection = require("../db/Mongodb")

class BaseHandler {

    setNext(nextHandler) {
        this.nextHandler = nextHandler
    }

    async handleNext(request) {
        if (this.nextHandler) {
            return await this.nextHandler.handle(request)
        }
        else {
            return { success: true, code: 200, data: {} }
        }
    }

    static createChain(handlers) {
        for (let i = 1; i < handlers.length; i++) {
            handlers[i - 1].setNext(handlers[i])
        }

        return handlers[0]
    }
}

class Container {

    static getDependencies() {
        const mongoClient = MongodbConnection.getInstance().client
        const mongodb = mongoClient.db(process.env.DB_NAME);
        const categoryCollection = mongodb.collection(process.env.CATEGORY_COLLECTION);
        const productCollection = mongodb.collection(process.env.PRODUCT_COLLECTION);



        return { mongoClient, mongodb, categoryCollection, productCollection }
    }
}

module.exports = {
    BaseHandler,
    Container
}