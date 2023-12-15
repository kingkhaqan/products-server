require("dotenv").config()
const express = require("express")
const cors = require('cors')

const port = 3000
const app = express()

const categoryRoutes = require("./modules/categories/routes")
const productRoutes = require("./modules/products/routes")

/**
 * implement multifilters
 * implement sorting
 * implement pagination
 * implement cart
 * bulk insert with categories
 * bulk update
 */

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ data: [] })
})

app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)


app.listen(port, () => console.log(`http://localhost:${port}`))