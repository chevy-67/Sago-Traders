const express = require('express')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const heroBannerRoutes = require('./routes/heroBannerRoutes')
const cors = require('cors')

const app = express()
app.use(express.json({ limit: '10mb' }))

// Configure CORS to explicitly allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow Vite's default dev server ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use('/api/auth/', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/banners', heroBannerRoutes)

module.exports = app
