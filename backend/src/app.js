const express = require('express')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.use('/api/auth/', authRoutes)
app.use('/api/products', productRoutes)

module.exports = app
