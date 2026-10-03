const express = require('express')
const koreanRouter = express.Router()
const database = require('../config/db')

// ROTA PARA SELECIONAR UMA PALAVRA ALEATORIA
koreanRouter.get('/', async (req, res) => {
    try {
        const [random_word] = await database.query('SELECT id_word, word, difficulty FROM korean_words WHERE difficulty = ? ORDER BY RAND() LIMIT 1', [req.query.difficulty])
        res.json(random_word[0])
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

// ROTA PARA VALIDAR RESPOSTA
koreanRouter.post('/validate', async (req, res) => {
    const { id_word, userResponse } = req.body

    if(!id_word || !userResponse) {
        return res.status(400).send("ID e Resposta são obrigatórios!")
    }
    
    try {
        const [word_selected] = await database.query('SELECT word, accepted_translations FROM korean_words WHERE id_word = ?', [id_word])

        if(word_selected.length === 0) {
            return res.status(400).send('Palavra não encontrada.')
        }

        const translations = word_selected[0].accepted_translations
        translations = translations.split(',').map(translation => translation.trim().toLowerCase())
        const lastResponse = userResponse.toLowerCase().trim()

        const correct = translations.includes(lastResponse)

        res.json({correct: correct, word: word_selected[0].word, translations: translations})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = koreanRouter
