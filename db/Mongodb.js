class MongodbConnection {

    constructor() {

        if(MongodbConnection.instance){
            return this
        }

        const { MongoClient } = require('mongodb')
        const url = process.env.MONGODB_CONNECTION_STRING
        this.client = new MongoClient(url);

        // this.client.db("products_db").collection("categories").insertMany()

        MongodbConnection.instance = this;
    }

    static getInstance() {
        if (!MongodbConnection.instance) {
            MongodbConnection.instance = new MongodbConnection();
        }
        return MongodbConnection.instance;
    }
}

module.exports = MongodbConnection
