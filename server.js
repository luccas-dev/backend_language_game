// CORAÇÃO DA API - REUNE EXPRESS, CORS E BANCO DE DADOS
const express = require('express')
const cors = require('cors')
const koreanRoutes = require('./routes/koreanRoutes')
const gameDataRoutes = require('./routes/gameDataRoutes')
require('dotenv').config()


const app = express()

// MIDDLEWARES
app.use(cors()) // Libera acesso ao Front-End
app.use(express.json()) // Permite que a API receba dados no formato JSON

// ROTAS
app.use('/', koreanRoutes)
app.use('/', gameDataRoutes)

// INICIA SERVIDOR
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('SERVER ON')
})